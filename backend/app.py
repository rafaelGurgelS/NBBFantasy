import pandas as pd
import numpy as np
from flask import Flask, jsonify,request
from datetime import datetime
from sqlalchemy import create_engine, func
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

    update_all_scores(round_id=current_round_id-1, session=session)

    update_all_lineups(previous_round_id = current_round_id-1, current_round_id=current_round_id, session=session)
    
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

        membership = db.LeagueMembership(league_id="1", user_id=username)
        session.add(membership)
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

            # Busca os jogadores na lineup do time de fantasia na rodada atual
            lineup = session.query(db.Lineup).filter_by(team_name=team_name, round_id=current_round_id).all()
            
            # Obter todos os player_ids da lineup
            player_ids = [lineup_item.player_id for lineup_item in lineup]

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
                jogadores_list.append({
                    'id': jogador.id,
                    'nome': jogador.name,
                    'valor': score.value,   # valor da tabela PlayerScore
                    'time': jogador.real_team,
                    'posicao': jogador.position,
                    'pontuacao': score.score  # Pontuação da tabela PlayerScore
                })   ##talvez adicionar o atributo booleano aqui...

            # Calcular a pontuação total do jogador
            player_score = (
                session.query(func.coalesce(db.func.sum(db.UserHasScore.score), 0))
                .filter_by(user_id=username)  # Supondo que user.id é o ID do usuário
                .scalar()
            )

            # Criar a resposta JSON com as informações do usuário, time e lineup
            user_info = {
                'money': user.money,
                'fantasy_team': team_name,
                'emblema': user.fantasy_team.emblem,
                'players': jogadores_list,  # Adiciona as informações dos jogadores da lineup
                'total_score': player_score  # Adiciona a pontuação total do usuário
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
    session=Session()
    #tentar criar uma nova session aqui?localmente
    try:
        
         # Certifique-se de que a sessão está aberta
        if not session.is_active:
            session.begin()


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
        if session.is_active:
            session.close()


# Endpoint para obter a lista de partidas
@app.route('/partidas', methods=['GET'])
def get_partidas():
    global current_round_id
    session=Session()
    try:
        if not session.is_active:
            session.begin()

        ###filtrar pelo numero da rodada atual
        partidas = session.query(db.Match).filter(db.Match.round < current_round_id).all()
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



@app.route('/create_league', methods=['POST'])
def create_league():
    data = request.get_json()
    league_name = data.get('name')
    description = data.get('description')
    username = data.get('username')

    if not league_name or not username:
        return jsonify({'error': 'Nome da liga e username são obrigatórios.'}), 400

    try:
        # Verifica se o usuário existe
        user = session.query(db.User).filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'Usuário não encontrado.'}), 404

        # Verifica se a liga já existe
        existing_league = session.query(db.League).filter_by(name=league_name).first()
        if existing_league:
            return jsonify({'error': 'Uma liga com esse nome já existe.'}), 400

        # Cria a nova liga
        new_league = db.League(name=league_name, description=description)
        session.add(new_league)
        session.commit()

        # Associa o usuário à nova liga
        membership = db.LeagueMembership(league_id=new_league.id, user_id=username)
        session.add(membership)
        session.commit()

        return jsonify({'message': 'Liga criada com sucesso!'}), 201

    except Exception as e:
        session.rollback()
        print(f"Erro ao criar liga: {str(e)}")
        return jsonify({'error': 'Erro ao criar liga.'}), 500

    finally:
        session.close()



@app.route('/leagues', methods=['GET'])
def get_leagues():
    username = request.args.get('username')
    
    if not username:
        return jsonify({'error': 'Nome de usuário é obrigatório.'}), 400

    try:
        # Verifica se o usuário existe
        user = session.query(db.User).filter_by(username=username).first()
        if not user:
            return jsonify({'error': 'Usuário não encontrado.'}), 404

        # Busca as ligas associadas ao usuário
        leagues = session.query(db.League).join(db.LeagueMembership).filter(db.LeagueMembership.user_id == username).all()

        # Formata a resposta
        leagues_data = [{'id': league.id, 'name': league.name} for league in leagues]

        return jsonify(leagues_data), 200

    except Exception as e:
        print(f"Erro ao buscar ligas: {str(e)}")
        return jsonify({'error': 'Erro ao buscar ligas.'}), 500

    finally:
        session.close()


@app.route('/leagueInfo', methods=['GET'])
def league_info():
    
    try:
        league_id = request.args.get('league_id', type=int)
        print("Received league_id:", league_id)
        
        if not league_id:
            return jsonify({'error': 'league_id parameter is required'}), 400

        # Buscar a liga pelo ID
        league = session.query(db.League).filter_by(id=league_id).first()
        if not league:
            return jsonify({'error': 'Liga não encontrada'}), 404
        
        # Buscar todos os usuários associados a esta liga
        member_usernames = (
            session.query(db.LeagueMembership.user_id)
            .filter_by(league_id=league_id)
            .all()
        )
        
        # Extrair os usernames dos membros
        usernames = [username for (username,) in member_usernames]
        
        # Buscar detalhes dos usuários e seus scores
        members_details = (
            session.query(
                db.User.username,
                func.coalesce(db.func.sum(db.UserHasScore.score), 0).label('total_score')  # Usando SUM para calcular a pontuação total
            )
            .outerjoin(db.UserHasScore, db.User.username == db.UserHasScore.user_id)
            .filter(db.User.username.in_(usernames))
            .group_by(db.User.username)  # Agrupar por username para evitar duplicatas
            .all()
        )

        # Construir a lista de membros com detalhes
        members = [
            {
                'username': username,
                'score': total_score if total_score > 0 else 'N/A'  # Use 'N/A' se o score não estiver disponível
            }
            for username, total_score in members_details
        ]

        # Ordenar a lista de membros pelo score em ordem decrescente
        members_sorted = sorted(
            members, 
            key=lambda x: (x['score'] if isinstance(x['score'], (int, float)) else -1), 
            reverse=True
        )

        print("League Name:", league.name)
        print("League Description:", league.description)
        print("League Members (Sorted):", members_sorted)

        return jsonify({
            'name': league.name,
            'description': league.description,
            'members': members_sorted
        })
    
    except Exception as e:
        print("Exception:", e)
        return jsonify({'error': str(e)}), 500
    
    finally:
        session.close()  # Fecha a sessão independentemente de sucesso ou erro

   


@app.route('/search_leagues', methods=['GET'])
def search_leagues():
    try:
        name = request.args.get('name', type=str)
        if not name:
            return jsonify({'error': 'Nome da liga é necessário'}), 400

        # Buscar ligas que contenham o nome fornecido
        leagues = session.query(db.League).filter(db.League.name.ilike(f'%{name}%')).all()
        league_list = [{'id': league.id, 'name': league.name} for league in leagues]

        return jsonify(league_list)
    except Exception as e:
        print("Exception:", e)
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@app.route('/leaveLeague', methods=['POST'])
def leave_league():
    data = request.get_json()

    # Validando os dados recebidos
    league_id = data.get('league_id')
    user_id = data.get('user_id')

    if not league_id or not user_id:
        return jsonify({"error": "league_id and user_id are required"}), 400

    try:
        # Procurando a relação de 'membership' entre o usuário e a liga
        membership = session.query(db.LeagueMembership).filter_by(league_id=league_id, user_id=user_id).first()

        if not membership:
            return jsonify({"error": "User is not a member of this league"}), 404

        # Remover o usuário da liga
        session.delete(membership)
        session.commit()

        return jsonify({"message": "User removed from the league successfully"}), 200

    except Exception as e:
        session.rollback()  # Reverte a transação em caso de erro
        print(f"Error removing user from league: {e}")
        return jsonify({"error": "An error occurred while trying to leave the league"}), 500

    finally:
        session.close()  # Fechar a sessão no final, independentemente de erro ou sucesso



@app.route('/joinLeague', methods=['POST'])
def join_league():
    try:
        # Obtém os dados da requisição JSON
        data = request.get_json()
        league_id = data.get('league_id')
        user_id = data.get('user_id')  # O ID do usuário (username)

        # Cria uma sessão do banco de dados
        session = db.session

        # Verifica se a liga e o usuário existem no banco de dados
        league = session.query(db.League).get(league_id)
        user = session.query(db.User).filter_by(username=user_id).first()

        if not league:
            return jsonify({"error": "Liga não encontrada"}), 404

        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404

        # Verifica se o usuário já está na liga
        existing_membership = session.query(db.LeagueMembership).filter_by(league_id=league_id, user_id=user_id).first()

        if existing_membership:
            return jsonify({"error": "Usuário já está na liga"}), 400

        # Cria a associação entre o usuário e a liga
        new_member = db.LeagueMembership(user_id=user_id, league_id=league_id)
        session.add(new_member)
        session.commit()

        return jsonify({"message": f"Usuário {user_id} entrou na liga {league.name} com sucesso"}), 200

    except Exception as e:
        if session:
            session.rollback()
        print(f"Erro ao tentar adicionar o usuário à liga: {e}")
        return jsonify({"error": "Erro ao tentar entrar na liga"}), 500

    finally:
        if session:
            session.close()




# -------------------------------------------------------------------- #

# Função para calcular a pontuação total de um time fantasia para uma rodada específica
def calculate_team_score(team_name, round_id, session):
    # Busca todos os jogadores na lineup do time fantasia para a rodada especificada
    lineup = session.query(db.Lineup).filter_by(team_name=team_name, round_id=round_id).all()
    
    total_score = 0

    # Para cada jogador na lineup, recupera a pontuação deles na tabela PlayerScores
    for item in lineup:
        player_score = session.query(db.PlayerScore).filter_by(id_player=item.player_id, id_round=round_id).first()
        if player_score:
            total_score += player_score.score  # Adiciona a pontuação do jogador ao total

    return total_score



# Função para atualizar ou inserir a pontuação do usuário na tabela UserHasScore
def update_user_score(user_id, round_id, session):
    # Busca o time fantasia do usuário
    fantasy_team = session.query(db.FantasyTeam).filter_by(username=user_id).first()

    if not fantasy_team:
        print(f"Usuário {user_id} não possui um time fantasia.")
        return

    # Calcula a pontuação total do time fantasia do usuário para esta rodada
    total_score = calculate_team_score(fantasy_team.team_name, round_id, session)

    # Verifica se já existe um registro para esta rodada
    user_score = session.query(db.UserHasScore).filter_by(user_id=user_id, round_id=round_id).first()

    if user_score:
        # Se já existir, atualiza a pontuação
        user_score.score = total_score
    else:
        # Se não existir, cria um novo registro
        new_score = db.UserHasScore(user_id=user_id, round_id=round_id, score=total_score)
        session.add(new_score)

    # Confirma as mudanças no banco de dados
    session.commit()

# Função para atualizar as pontuações de todos os usuários para uma rodada específica
def update_all_scores(round_id, session):
    try:
        users = session.query(db.User).all()

        # Para cada usuário, atualiza sua pontuação para a rodada especificada
        for user in users:
            update_user_score(user.username, round_id, session)

    except Exception as e:
        session.rollback()  # Desfaz alterações em caso de erro
        print(f"Erro ao atualizar as pontuações: {str(e)}")
    
    finally:
        session.close() 

# Função para copiar as escalações de todos os usuários para a nova rodada
def update_all_lineups(previous_round_id, current_round_id,session):
    try:
        # Certifique-se de que a sessão está ativa
        if not session.is_active:
            session.begin()

        # Busca todas as escalações da rodada anterior
        lineups = session.query(db.Lineup).filter_by(round_id=previous_round_id).all()

        # Para cada escalação da rodada anterior, cria uma nova entrada para a rodada atual
        for lineup in lineups:
            new_lineup = db.Lineup(
                team_name=lineup.team_name,
                player_id=lineup.player_id,
                round_id=current_round_id
            )
            session.add(new_lineup)

        # Confirma as mudanças no banco de dados
        session.commit()

        print(f"Escalações da rodada {previous_round_id} copiadas para a rodada {current_round_id}")

    except Exception as e:
        session.rollback()  # Reverte as mudanças em caso de erro
        print(f"Erro ao copiar escalações: {str(e)}")
    finally:
        if session.is_active:
            session.close()  # Fecha a sessão



scheduler.add_job(
    func=update_round,
    trigger=IntervalTrigger(seconds=60),

)

scheduler.add_job(
    func=send_round,
    trigger=IntervalTrigger(seconds=10),  ## no pior caso, tem que esperar 30s... mas se fosse muio alta a frequência tenho medo de sobrecarregar

)

scheduler.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
