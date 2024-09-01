import csv
import pandas as pd
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from create_tables_2 import Player, Round,Action,Match
from sqlalchemy.engine import URL

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
                    value=20,  # Valor fixo de 20 para todos os jogadores
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

if __name__ == '__main__':
    
    #importar_jogadores()
    #importar_rodadas()
    #importar_acoes()
    importar_partidas()


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