import csv
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from create_tables import Jogador, Partida
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
                jogador = Jogador(
                    id=int(row[0]),  # ID Jogador
                    nome=row[1],  # Nome do jogador
                    time=row[2],  # Equipe
                    valor=20,  # Valor fixo de 20 para todos os jogadores
                    posicao=row[header.index('Posicao')],  # Posicao
                    
                    # Mapeamento das estatísticas
                    arremessos_3pontos=float(row[header.index('3PC')]),  # '3PC'
                    arremessos_2pontos=float(row[header.index('2PC')]),  # '2PC'
                    lances_livres_convertidos=float(row[header.index('LLC')]),  # 'LLC'
                    rebotes_totais=float(row[header.index('RT')]),  # 'RT'
                    bolas_recuperadas=float(row[header.index('BR')]),  # 'BR'
                    tocos=float(row[header.index('TO')]),  # 'TO'
                    erros=float(row[header.index('ER')]),  # 'ER'
                    duplos_duplos=float(row[header.index('DD')]),  # 'DD'
                    enterradas=float(row[header.index('EN')]),  # 'EN'
                    assistencias=float(row[header.index('AS')])  # 'AS'
                )
                session.add(jogador)
            session.commit()
        print('Jogadores importados com sucesso.')
    except Exception as e:
        session.rollback()
        print(f'Erro ao importar jogadores: {str(e)}')

def importar_partidas():
    try:
        with open('nbb_partidas.csv', mode='r', encoding='utf-8-sig') as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader)  # Pular o cabeçalho se houver
            for row in reader:
                id = int(row[0])  # Usa a primeira coluna como ID
                data_str = row[1]
                data = datetime.strptime(data_str, '%Y-%m-%d %H:%M:%S')  # Ajuste para incluir data e hora
                
                partida = Partida(
                    id=id,
                    data=data,
                    rodada=row[7],
                    time_casa=row[2],
                    time_visitante=row[5],
                    placar_casa=int(row[3]),
                    placar_visitante=int(row[4]),
                    fase=row[8] 
                )
                session.add(partida)
            session.commit()
        print('Partidas importadas com sucesso.')
    except Exception as e:
        session.rollback()
        print(f'Erro ao importar partidas: {str(e)}')

if __name__ == '__main__':
    importar_jogadores()
    importar_partidas()