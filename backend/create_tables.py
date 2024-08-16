from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float,ForeignKey
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker,backref,relationship
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
    time_fantasy = relationship("Time_fantasy", secondary="time_fantasy_jogador",back_populates="jogadores")
    

# Definição da tabela Partidas
class Partida(Base):
    __tablename__ = 'Partidas'

    id = Column(Integer, primary_key=True)
    data = Column(DateTime, nullable=False)
    time_casa = Column(String(100), nullable=False)
    time_visitante = Column(String(100), nullable=False)
    placar_casa = Column(Integer, nullable=False)
    placar_visitante = Column(Integer, nullable=False)
    rodada = Column(Integer, nullable=False)
    fase = Column(String(100),nullable=False)
# Definição da tabela Usuarios com username como chave primária
class Usuario(Base):
    __tablename__ = 'Usuarios'

    username = Column(String(50), primary_key=True, nullable=False)
    senha = Column(String(100), nullable=False)
    #nome_time = Column(String(100), ForeignKey('Time.nome_time'), nullable=False)
   
    emblema = Column(String(255), nullable=True)  
    dinheiro = Column(Float, nullable=False)  
    pontuacao = Column(Float, nullable=False)
    time_fantasy = relationship("Time_fantasy", back_populates="username", uselist=False)

class Time_fantasy(Base):
    __tablename__ = 'Time_fantasy'

    nome_time = Column(String(100), primary_key=True, nullable=False)

    # Relacionamento com a tabela Jogadores
    jogadores = relationship("Jogador",secondary="time_fantasy_jogador", back_populates="time_fantasy")

    # Relacionamento de um-para-um com Usuario
    username = relationship("Usuario", back_populates="time_fantasy", uselist=False)
    usuario = Column(String(50), ForeignKey('Usuarios.username'), nullable=False)

# Tabela associativa para a relação muitos-para-muitos entre Time_fantasy e Jogador
class Time_fantasy_jogador(Base):
    __tablename__ = 'time_fantasy_jogador'

    time_nome = Column(String(100), ForeignKey('Time_fantasy.nome_time'), primary_key=True)
    jogador_id = Column(Integer, ForeignKey('Jogadores.id'), primary_key=True)

    # Relacionamentos com Time_fantasy e Jogador
    time = relationship("Time_fantasy", backref=backref("jogadores_assoc", cascade="all, delete-orphan"))
    jogador = relationship("Jogador", backref=backref("times_assoc", cascade="all, delete-orphan"))

# Criação das tabelas no banco de dados
Base.metadata.drop_all(engine)    
###dica: dropa direto no sql se precisar dropar
Base.metadata.create_all(engine)
#Base.metadata.create_all(engine, tables=[Jogador.__table__])
# Configuração da sessão
Session = sessionmaker(bind=engine)
session = Session()

# Commit das alterações (tabelas criadas)
session.commit()
