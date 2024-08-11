
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy import Column, Integer, String, DateTime, Text,Float
from sqlalchemy.orm import declarative_base
from datetime import datetime
from sqlalchemy.orm import sessionmaker


url = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    host="localhost",
    database="nbb",
    password="admin",
    port="5432"
)

engine = create_engine(url)
connection = engine.connect()


Base = declarative_base()


class Jogador(Base):
    __tablename__ = 'Jogadores'

    id= Column(Integer, primary_key=True, nullable=False)
    nome = Column(String(100), nullable=False)
    time = Column(String(50), nullable=False)
    pontuacao = Column(Float, nullable=False)
    valor = Column(Float, nullable=False)
    posicao = Column(String(50), nullable=False)

class Partida(Base):
    __tablename__ = 'Partidas'

    id = Column(Integer, primary_key=True)
    data = Column(DateTime, nullable=False)
    time_casa = Column(String(100), nullable=False)
    time_visitante = Column(String(100), nullable=False)
    placar_casa = Column(Integer, nullable=False)
    placar_visitante = Column(Integer, nullable=False)
    rodada = Column(String(50), nullable=False)


Base.metadata.create_all(engine)



Session = sessionmaker(bind=engine)
session = Session()

jogador=Jogador(
id=1,
nome='ze',
time='fla',
pontuacao=34,
valor=50,
posicao='ala'

)

session.add(jogador)
session.commit()

