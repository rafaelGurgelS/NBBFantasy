import csv
import pandas as pd
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.create_tables import Player, Round,Action,Match
import backend.create_tables as db
from sqlalchemy.engine import URL
import numpy as np
# Configuração da URL do banco de dados
url = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    host="localhost",
    database="nbb",
    password="",
    port="5432"
)

# Criação do engine e conexão com o banco de dados
engine = create_engine(url)
Session = sessionmaker(bind=engine)
session = Session()

def importar_jogadores():
    try:
        with open('nbb_estatisticas.csv', mode='r', encoding='utf-8-sig') as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader)  # Pular o cabeçalho se houver
            for row in reader:
                # Criar instância do jogador com as estatísticas
                jogador = Player(
                    id=int(row[0]),  # ID Jogador
                    name=row[1],  # Nome do jogador
                    real_team=row[2],  # Equipe
                    position=row[header.index('Posicao')],  # Posicao
                    
                   
                )
                session.add(jogador)
            session.commit()
        print('Jogadores importados com sucesso.')
    except Exception as e:
        session.rollback()
        print(f'Erro ao importar jogadores: {str(e)}')


def importar_rodadas():
    
    try:
        with open('nbb_partidas.csv', mode='r', encoding='utf-8-sig') as csvfile:
            df = pd.read_csv(csvfile)
            
            rodadas=df['RODADA'].unique()
            print(rodadas)

            for id in rodadas:
                print(id)
                rodada= Round(
                    id=int(id)
                )
                session.add(rodada)
            session.commit()
        print('Rodadas importadas com sucesso.')
    except Exception as e:
        session.rollback()
        print(f'Erro ao importar rodadas: {str(e)}')
  
def importar_acoes():
    
    pontuacoes = {
    'arremessos_3pontos': 1.5,
    'arremessos_2pontos': 1.0,
    'lances_livres_convertidos': 0.8,
    'rebotes_totais': 1.5,
    'bolas_recuperadas': 1.5,
    'tocos': 1.5,
    'erros': -0.5,
    'duplos_duplos': 5.0,
    'enterradas': 2.0,
    'assistencias': 1.5
    }

    try:
        
        
        for descricao, valor in pontuacoes.items():
            acao = Action(
                description=descricao,
                value=valor
            )
            session.add(acao)
        session.commit()
        print('Acoes importadas com sucesso.')
    except Exception as e:
        session.rollback()
        print(f'Erro ao importar acoes: {str(e)}')
  


def importar_partidas():
    try:
        with open('nbb_partidas.csv', mode='r', encoding='utf-8-sig') as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader)  # Pular o cabeçalho se houver
            for row in reader:
                    
                if( (row[8]=='1º TURNO') or (row[8]=='2º TURNO') ):
                    id = int(row[0])  # Usa a primeira coluna como ID
                    data_str = row[1]
                    data = datetime.strptime(data_str, '%Y-%m-%d %H:%M:%S')  # Ajuste para incluir data e hora
                    
                    partida = Match(
                        id=id,
                        date=data,
                        round=row[7],
                        house_team=row[2],
                        visit_team=row[5],
                        house_score=int(row[3]),
                        visit_score=int(row[4]),
                    
                    )
                    session.add(partida)
            session.commit()
        print('Partidas importadas com sucesso.')
    except Exception as e:
        session.rollback()
        print(f'Erro ao importar partidas: {str(e)}')


def generate_random_variation(stat_value, variation_range=10):
    random_variation = stat_value + np.random.uniform(-variation_range, variation_range)
    return abs(random_variation)


def importar_players_actions(df_stat,rodadas):
    
    for id in rodadas:
        round_id=int(id)
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

def importar_players_scores(rodadas):
  
    for id in rodadas:
        round_id=int(id)
        try:
            # Recupera as ações tomadas pelos jogadores na rodada atual
            player_actions = session.query(
                db.PlayerTakesAction.player_id,
                db.PlayerTakesAction.round_id,
                db.Action.value,
                db.PlayerTakesAction.stat_value
            ).join(db.Action, db.PlayerTakesAction.action_id == db.Action.id
            ).filter(db.PlayerTakesAction.round_id == round_id).all()

            # Dicionário para acumular os scores de cada jogador
            player_scores = {}

            # Calcula o score de cada jogador
            for action in player_actions:
                player_id = action.player_id
                round_id = action.round_id
                weighted_score = action.value * action.stat_value

                # Acumula o score do jogador
                if player_id not in player_scores:
                    player_scores[player_id] = weighted_score
                else:
                    player_scores[player_id] += weighted_score

            # Inserir ou atualizar os scores na tabela PlayerScores
            for player_id, total_score in player_scores.items():
                # Verifica se já existe um registro para este jogador e rodada
                existing_score = session.query(db.PlayerScore).filter_by(
                    id_player=player_id, id_round=round_id
                ).first()

                if existing_score:
                    # Se existir, atualiza o score
                    existing_score.score = total_score
                else:
                    # Se não existir, cria um novo registro
                    new_player_score = db.PlayerScore(
                        id_player=player_id,
                        id_round=round_id,
                        score=total_score,
                        value = total_score*2
                    )
                    session.add(new_player_score)

            # Commit das alterações no banco de dados
            session.commit()

        except Exception as e:
            print(f"Erro ao atualizar os scores dos jogadores: {str(e)}")
            session.rollback()
        finally:
            session.close()

def criar_liga():
    try:
        league = db.League(name="Ranking Geral", description="Liga com todos os usuários do NBB Fantasy")
        session.add(league)
        session.commit()
        print('Liga criada com sucesso.')
    except Exception as e:
        session.rollback()
        print(f'Erro ao criar liga: {str(e)}')
        

if __name__ == '__main__':
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


    df = pd.read_csv('nbb_partidas.csv')
            
    rodadas=df['RODADA'].unique()
    
    importar_jogadores()
    importar_rodadas()
    importar_acoes()
    importar_partidas()

    importar_players_actions(df_stat,rodadas)
    importar_players_scores(rodadas)

    criar_liga()


    # Mapeamento das estatísticas
    #arremessos_3pontos=float(row[header.index('3PC')]),  # '3PC'
    #arremessos_2pontos=float(row[header.index('2PC')]),  # '2PC'
    #lances_livres_convertidos=float(row[header.index('LLC')]),  # 'LLC'
    #rebotes_totais=float(row[header.index('RT')]),  # 'RT'
    #bolas_recuperadas=float(row[header.index('BR')]),  # 'BR'
    #tocos=float(row[header.index('TO')]),  # 'TO'
    #erros=float(row[header.index('ER')]),  # 'ER'
    #duplos_duplos=float(row[header.index('DD')]),  # 'DD'
    #enterradas=float(row[header.index('EN')]),  # 'EN'
    #assistencias=float(row[header.index('AS')])  # 'AS'