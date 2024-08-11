from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

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
connection = engine.connect()

# Base para as classes das tabelas
Base = declarative_base()

# Definição da tabela Jogadores
class Jogador(Base):
    __tablename__ = 'Jogadores'

    id = Column(Integer, primary_key=True, nullable=False)
    nome = Column(String(100), nullable=False)
    time = Column(String(50), nullable=False)
    valor = Column(Float, nullable=False)
    posicao = Column(String(50), nullable=False)
    
    # Estatísticas
    arremessos_3pontos = Column(Float, nullable=False)  # '3PC'
    arremessos_2pontos = Column(Float, nullable=False)  # '2PC'
    lances_livres_convertidos = Column(Float, nullable=False)  # 'LLC'
    rebotes_totais = Column(Float, nullable=False)  # 'RT'
    bolas_recuperadas = Column(Float, nullable=False)  # 'BR'
    tocos = Column(Float, nullable=False)  # 'TO'
    erros = Column(Float, nullable=False)  # 'ER'
    duplos_duplos = Column(Float, nullable=False)  # 'DD'
    enterradas = Column(Float, nullable=False)  # 'EN'
    assistencias = Column(Float, nullable=False)  # 'AS'

# Definição da tabela Partidas
class Partida(Base):
    __tablename__ = 'Partidas'

    id = Column(Integer, primary_key=True)
    data = Column(DateTime, nullable=False)
    time_casa = Column(String(100), nullable=False)
    time_visitante = Column(String(100), nullable=False)
    placar_casa = Column(Integer, nullable=False)
    placar_visitante = Column(Integer, nullable=False)
    rodada = Column(String(50), nullable=False)

# Definição da tabela Usuarios com username como chave primária
class Usuario(Base):
    __tablename__ = 'Usuarios'

    username = Column(String(50), primary_key=True, nullable=False)
    senha = Column(String(100), nullable=False)
    nome_time = Column(String(100), nullable=False)
    emblema = Column(String(255), nullable=True)  
    dinheiro = Column(Float, nullable=False)  
    pontuacao = Column(Float, nullable=False)

# Criação das tabelas no banco de dados
Base.metadata.create_all(engine)

# Configuração da sessão
Session = sessionmaker(bind=engine)
session = Session()

# Commit das alterações (tabelas criadas)
session.commit()
