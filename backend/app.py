import csv
import pandas as pd
import numpy as np
from flask import Flask, jsonify,request
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import create_tables_2 as db
from sqlalchemy.engine import URL
from flask_socketio import SocketIO, emit
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

# Configuração da URL do banco de dados
url = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    host="localhost",
    database="nbb",
    password="admin",
    port="5432"
)

# Criação do engine e conexão com o banco de dados
engine = create_engine(url)
Session = sessionmaker(bind=engine)
session = Session()

app = Flask(__name__)
socketio = SocketIO(app)
scheduler = BackgroundScheduler()

current_round_id = 0

def my_cron_job():
    global current_round_id
    # Code to be executed by the cron job
    if current_round_id == 0:
        first_round = session.query(db.Round).order_by(db.Round.id).first()
        if first_round:
            current_round_id = first_round.id
        print(f"Rodada atual: {current_round_id}")
        update_player_actions_for_round(current_round_id, df_stat)
        socketio.emit('update', {'current_round_id': current_round_id})
        return

    # Obter a próxima rodada com ID maior que o current_round_id

    ###quando ajeitarmos a questao das datas das partidas, podemos colocar data de inicio e fim
    ##como atributos das rodadas. so nao quis fazer isso pq eh um saco mudar a data o tempo todo
    ### ai com data teria um if a mais aqui
    next_round = session.query(db.Round).filter(db.Round.id > current_round_id).order_by(db.Round.id).first()

    if next_round:
        # Se encontrar a próxima rodada, atualiza o current_round_id
        current_round_id = next_round.id
    else:
        # Se não houver uma próxima rodada (estamos na última), volta para a primeira rodada
        first_round = session.query(db.Round).order_by(db.Round.id).first()
        if first_round:
            current_round_id = first_round.id
            
    print(f"Rodada atual: {current_round_id}")
    update_player_actions_for_round(current_round_id, df_stat)
    socketio.emit('update', {'current_round_id': current_round_id})


# Ler o CSV
df_stat = pd.read_csv('nbb_estatisticas.csv', header=0)

# Mapeamento das estatísticas
df_stat['arremessos_3pontos'] = df_stat['3PC'].astype(int)
df_stat['arremessos_2pontos'] = df_stat['2PC'].astype(int)
df_stat['lances_livres_convertidos'] = df_stat['LLC'].astype(int)
df_stat['rebotes_totais'] = df_stat['RT'].astype(int)
df_stat['bolas_recuperadas'] = df_stat['BR'].astype(int)
df_stat['tocos'] = df_stat['TO'].astype(int)
df_stat['erros'] = df_stat['ER'].astype(int)
df_stat['duplos_duplos'] = df_stat['DD'].astype(int)
df_stat['enterradas'] = df_stat['EN'].astype(int)
df_stat['assistencias'] = df_stat['AS'].astype(int)



def generate_random_variation(stat_value, variation_range=10):
    return max(0, int(stat_value + np.random.uniform(-variation_range, variation_range)))


def update_player_actions_for_round(round_id, df_stat):
    # Mapeamento dos IDs de ações diretamente
    action_ids = {
        'arremessos_3pontos': 1,
        'arremessos_2pontos': 2,
        'lances_livres_convertidos': 3,
        'rebotes_totais': 4,
        'bolas_recuperadas': 5,
        'tocos': 6,
        'erros': 7,
        'duplos_duplos': 8,
        'enterradas': 9,
        'assistencias': 10
    }

    # Iterar sobre cada jogador no DataFrame
    for _, row in df_stat.iterrows():
        player_id = row['ID'] 

        # Para cada estatística (ação), cria uma associação separada
        for stat_key, action_id in action_ids.items():
            # Gerar a variação aleatória para essa estatística
            stat_value = generate_random_variation(row[stat_key])

            # Criar um registro de ação para o jogador, ação e rodada
            try:
                action_record = db.PlayerTakesAction(
                    player_id=player_id,
                    round_id=round_id,
                    action_id=action_id,
                    stat_value=stat_value  # Valor da pontuação com variação
                )
                session.add(action_record)
            except Exception as e:
                session.rollback()
                print(f"Erro ao inserir a ação {stat_key} do jogador {player_id}: {str(e)}")

    # Commit para salvar todas as ações no banco de dados
    try:
        session.commit()
        print('Ações dos jogadores inseridas com sucesso.')
    except Exception as e:
        session.rollback()
        print(f"Erro ao salvar ações: {str(e)}")

    


# Endpoint para criar um novo usuário
@app.route('/insert_usuario', methods=['POST'])
def insert_usuario():
    data = request.get_json()
    
    username = data.get('username')
    senha = data.get('senha')
    
    # Criar novo usuário
    novo_usuario = db.User(username=username, password=senha, money=100.0)
    

    try:
        session.add(novo_usuario)
        session.commit()
        return jsonify({'message': 'Usuário criado com sucesso!'}), 201
    
    except Exception as e:
        session.rollback()
        print(f"Erro ao criar usuário: {str(e)}")
        return jsonify({'error': 'Erro ao criar usuário'}), 500
    
    finally:
        session.close()


# Endpoint para criar um novo time
@app.route('/insert_time', methods=['POST'])
def criar_time():
    data = request.get_json()

    nome_time = data.get('nome_time')
    username = data.get('username')
    emblema = data.get('emblema')

    # Verifica se os campos necessários estão presentes
    if not nome_time or not username or not emblema:
        return jsonify({'error': 'Todos os campos são obrigatórios.'}), 400

    # Cria um novo time
    novo_time = db.FantasyTeam(team_name=nome_time, username=username, emblem=emblema)

    try:
        session.add(novo_time)
        session.commit()
        return jsonify({'message': 'Time criado com sucesso!'}), 201

    except Exception as e:
        session.rollback()
        print(f"Erro ao criar time: {str(e)}")
        return jsonify({'error': 'Erro ao criar time.'}), 500

    finally:
        session.close()

@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username parameter is required'}), 400

    user = session.query(db.User).filter_by(username=username).first()

    if user:
        user_info = {
            'teamName': user.fantasy_team.team_name if user.fantasy_team else 'N/A',
            'emblema': user.fantasy_team.emblem if user.fantasy_team else 'N/A',
            'dinheiro': user.money,
            'pontuacao': '--'
        }
        return jsonify(user_info), 200
    else:
        return jsonify({'error': 'User not found'}), 404


# Endpoint para obter a lista de jogadores
@app.route('/jogadores', methods=['GET'])
def get_jogadores():
    try:
        jogadores = session.query(db.Player).all()
        jogadores_list = []
        for jogador in jogadores:
            jogadores_list.append({
                'id': jogador.id,
                'nome': jogador.name,
                'valor': jogador.value,
                'time': jogador.real_team,
                'posicao': jogador.position,
                
            })
        return jsonify(jogadores_list)
    
    except Exception as e:
        print(f"Erro ao consultar o banco de dados: {str(e)}")
        return jsonify({'error': 'Erro ao consultar o banco de dados'}), 500
    finally:
        session.close()  # Fecha a sessão

# Endpoint para obter a lista de partidas
@app.route('/partidas', methods=['GET'])
def get_partidas():
    global current_round_id
    session = Session()
    try:

        ###filtrar pelo numero da rodada atual
        partidas = session.query(db.Match).filter(db.Match.round <= current_round_id).all()
        partidas_list = [{
            'id': partida.id,
            'data': partida.date,
            'time_casa': partida.house_team,
            'time_visitante': partida.visit_team,
            'placar_casa': partida.house_score,
            'placar_visitante': partida.visit_score,
            'rodada': partida.round
        } for partida in partidas]
       
        return jsonify(partidas_list)
    
    except Exception as e:
        print(f"Erro ao consultar o banco de dados: {str(e)}")
        return jsonify({'error': 'Erro ao consultar o banco de dados'}), 500

    finally:
        session.close()  # Fecha a sessão


#Verificar Usuário no login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    senha = data.get('senha')
    
    # Verificar se o usuário existe
    usuario = session.query(db.User).filter_by(username=username).first()
    
    if not usuario:
        return jsonify({"error": "Usuário não encontrado, registre-se!"}), 404
    
    # Verificar a senha
    if usuario.password != senha:
        return jsonify({"error": "Senha incorreta"}), 403
    
    # Verificar se o usuário já tem um time associado
    time_fantasy = session.query(db.FantasyTeam).filter_by(username=username).first()
    
    if time_fantasy:
        return jsonify({"redirect": "home"})
    else:
        return jsonify({"redirect": "criarTime"})


scheduler.add_job(
    func=my_cron_job,
    trigger=IntervalTrigger(seconds=60),

) 

scheduler.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
