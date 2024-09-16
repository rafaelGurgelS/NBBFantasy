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
import time

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
waiting_for_next_round = False

## fazer 2 cron_job: um pra atualizar a rodada e outro pra mandar a rodada atual. esse de mandar a rodada atual roda com mais frequência.


def send_round():
    global current_round_id
    socketio.emit('info', {'current_round_id': current_round_id})
    print("mandando rodada atual")



def update_round():
    global current_round_id
    # Code to be executed by the cron job
    if current_round_id == 0:
        first_round = session.query(db.Round).order_by(db.Round.id).first()
        if first_round:
            current_round_id = first_round.id
        print(f"Rodada atual: {current_round_id}")
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
    
    socketio.emit('update', {'current_round_id': current_round_id})


@app.route('/insert_lineup', methods=['POST'])
def insert_lineup():
    global current_round_id

    data = request.get_json()
    
    team_name = data.get('team_name')
    player_id = data.get('player_id')
    
    new_lineup = db.Lineup(team_name=team_name, player_id=player_id,round_id=current_round_id)
    
    try:
        session.add(new_lineup)
        session.commit()
        return jsonify({'message': 'Jogador adicionado ao time!'}), 201
    
    except Exception as e:
        session.rollback()
        print(f"Erro ao adicionar jogador: {str(e)}")
        return jsonify({'error': 'Erro ao adicionar jogador'}), 500
    
    finally:
        session.close()


@app.route('/remove_lineup', methods=['DELETE'])
def remove_lineup():
    global current_round_id

    data = request.get_json()
    
    team_name = data.get('team_name')
    player_id = data.get('player_id')
    
    try:
        # Buscar o usuário no banco de dados
        player = session.query(db.Lineup).filter_by(player_id = player_id, team_name = team_name, round_id = current_round_id).first()

        if player:
            # Excluir o usuário
            session.delete(player)
            session.commit()
            return jsonify({'success': True, 'message': 'Jogador removido com sucesso!'}), 200
        else:
            return jsonify({'error': 'Jogador não encontrado.'}), 404

    except Exception as e:
        session.rollback()  # Desfazer alterações em caso de erro
        print(f"Erro ao excluir o jogador: {str(e)}")
        return jsonify({'error': 'Erro ao excluir o jogador.'}), 500

    finally:
        session.close()  # Fecha a sessão 
    


@app.route('/update_user_money', methods=['POST'])
def insert_money():
    data = request.get_json()
    username = data.get('username')
    new_money = data.get('new_money')

    try:
        user = session.query(db.User).filter_by(username=username).first()
        if user:
            print(f"Usuário encontrado: {user.username}")
            print(f"Saldo antes da atualização: {user.money}")

            user.money = new_money
            print(f"Saldo após a atualização: {user.money}")

            try:
                session.flush()  
                session.commit() 
                print("Commit bem-sucedido")
                return jsonify({"message": "Saldo atualizado com sucesso!"}), 200
            except Exception as e:
                session.rollback()  
                print(f"Erro ao dar commit: {e}")
                return jsonify({"message": "Erro ao atualizar o saldo"}), 500
        else:
            return jsonify({"message": "Usuário não encontrado"}), 404

    except Exception as e:
        session.rollback()  # Desfaz alterações em caso de erro
        print(f"Erro ao atualizar o saldo: {str(e)}")
        return jsonify({'error': 'Erro ao atualizar o saldo.'}), 500

    finally:
        session.close()  # Fecha a sessão



# Endpoint para criar um novo usuário
@app.route('/insert_usuario', methods=['POST'])
def insert_usuario():
    data = request.get_json()
    
    username = data.get('username')
    senha = data.get('senha')
    
    # Criar novo usuário
    novo_usuario = db.User(username=username, password=senha, money=400.0)
    

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
    global current_round_id  # Suponho que o current_round_id já esteja definido em outro lugar
    
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username parameter is required'}), 400

    try:
        # Consulta o usuário e o time de fantasia
        user = session.query(db.User).filter_by(username=username).first()

        if user:
            # Obtém o nome do time de fantasia do usuário
            team_name = user.fantasy_team.team_name
             ## tratar o caso em que nao tem nenhum   
            # Busca os jogadores na lineup do time de fantasia na rodada atual
            lineup = session.query(db.Lineup).filter_by(team_name=team_name, round_id=current_round_id).all()
            
            # Obter todos os player_ids da lineup
            player_ids = [lineup_item.player_id for lineup_item in lineup]

            # Consultar os detalhes dos jogadores
            #players = session.query(db.Player).filter(db.Player.id.in_(player_ids)).all()

            jogadores = session.query(
                db.Player,
                db.PlayerScore
            ).join(
                db.PlayerScore, db.Player.id == db.PlayerScore.id_player
            ).filter(
                db.PlayerScore.id_round == current_round_id,
                db.Player.id.in_(player_ids)
            ).all()
            
           

            # Criar uma lista com as informações dos jogadores
            jogadores_list = []
            for jogador, score in jogadores:
                print(jogador.name)
                jogadores_list.append({
                    'id': jogador.id,
                    'nome': jogador.name,
                    'valor': score.value,   ##valor da tabela PlayerScore
                    'time': jogador.real_team,
                    'posicao': jogador.position,
                    'pontuacao': score.score  # Pontuação da tabela PlayerScore
                })

            # Criar a resposta JSON com as informações do usuário, time e lineup
            user_info = {
                'money': user.money,
                'fantasy_team': team_name,
                'emblema': user.fantasy_team.emblem,
                'players': jogadores_list  # Adiciona as informações dos jogadores da lineup
            }

            return jsonify(user_info), 200
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        print(f"Erro ao consultar o banco de dados: {str(e)}")
        return jsonify({'error': 'Erro ao consultar o banco de dados'}), 500

    finally:
        session.close()  # Fecha a sessão



# Endpoint para obter a lista de jogadores
@app.route('/jogadores', methods=['GET'])
def get_jogadores():
    global current_round_id

    try:
        
        jogadores = session.query(
            db.Player,
            db.PlayerScore
        ).join(
            db.PlayerScore, db.Player.id == db.PlayerScore.id_player
        ).filter(
            db.PlayerScore.id_round == current_round_id
        ).all()

        jogadores_list = []
        for jogador, score in jogadores:
            jogadores_list.append({
                'id': jogador.id,
                'nome': jogador.name,
                'valor': score.value,   ##valor da tabela PlayerScore
                'time': jogador.real_team,
                'posicao': jogador.position,
                'pontuacao': score.score  # Pontuação da tabela PlayerScore
            })
        
        return jsonify(jogadores_list)
    
    except Exception as e:
        print(f"Erro ao consultar o banco de dados: {str(e)}")
        return jsonify({'error': 'Erro ao consultar o banco de dados'}), 500
    finally:
        session.close()  # Fecha a sessão


@app.route('/update_usuario', methods=['PUT'])
def update_usuario():
    data = request.get_json()
    
    username = data.get('username')
    new_password = data.get('new_password')
    
    try:
        # Buscar o usuário atual no banco de dados
        user = session.query(db.User).filter_by(username=username).first()

        if user:
            user.password = new_password
            
            # Salvar as alterações no banco de dados
            session.commit()
            return jsonify({'success': True, 'message': 'Usuário atualizado com sucesso!'}), 200
        
        else:
            return jsonify({'error': 'Usuário não encontrado.'}), 404
        
    except Exception as e:
        session.rollback()  # Desfazer as alterações em caso de erro
        print(f"Erro ao atualizar o usuário: {str(e)}")
        return jsonify({'error': 'Erro ao atualizar o usuário.'}), 500

    finally:
        session.close()  # Fecha a sessão



@app.route('/update-emblem', methods=['POST'])
def update_emblem():
    data = request.get_json()
    team_name = data.get('team_name')
    new_emblem = data.get('new_emblem')

    try:
        team = session.query(db.FantasyTeam).filter_by(team_name=team_name).first()
        print(f"Nome do time: {team.team_name}")
        print(f"User: {team.username}")

        if team:
            print(f"Antes da atualização: {team.emblem}")
            team.emblem = new_emblem
            print(f"Após a atualização: {team.emblem}")
            
            try:
                session.flush() 
                session.commit()
                print("Commit bem-sucedido")
                return jsonify({"message": "Emblema atualizado com sucesso!"}), 200
            except Exception as e:
                session.rollback()
                print(f"Erro ao dar commit: {e}")
                return jsonify({"message": "Erro ao atualizar o emblema"}), 500

        else:
            return jsonify({"message": "Time não encontrado"}), 404
    
    except Exception as e:
        session.rollback()  # Desfazer as alterações em caso de erro
        print(f"Erro ao atualizar o emblema: {str(e)}")
        return jsonify({'error': 'Erro ao atualizar o emblema.'}), 500

    finally:
        session.close()  # Fecha a sessão





@app.route('/delete_usuario', methods=['DELETE'])
def delete_usuario():
    data = request.get_json()
    username = data.get('username')
    print(f"Recebido username para exclusão: {username}")

    try:
        # Buscar o usuário no banco de dados
        user = session.query(db.User).filter_by(username=username).first()
        print(f"Usuário encontrado: {user}")

        if user:
            # Excluir o usuário
            session.delete(user)
            session.commit()
            return jsonify({'success': True, 'message': 'Usuário excluído com sucesso!'}), 200
        else:
            return jsonify({'error': 'Usuário não encontrado.'}), 404

    except Exception as e:
        session.rollback()  # Desfazer alterações em caso de erro
        print(f"Erro ao excluir o usuário: {str(e)}")
        return jsonify({'error': 'Erro ao excluir o usuário.'}), 500

    finally:
        session.close()  # Fecha a sessão




# Endpoint para obter a lista de partidas
@app.route('/partidas', methods=['GET'])
def get_partidas():
    global current_round_id
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

    try:
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

    except Exception as e:
        print(f"Erro ao realizar login: {str(e)}")
        return jsonify({'error': 'Erro ao realizar login.'}), 500

    finally:
        session.close()  # Fecha a sessão


scheduler.add_job(
    func=update_round,
    trigger=IntervalTrigger(seconds=120),

)

scheduler.add_job(
    func=send_round,
    trigger=IntervalTrigger(seconds=10),  ## no pior caso, tem que esperar 30s... mas se fosse muio alta a frequência tenho medo de sobrecarregar

)

scheduler.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
