from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, backref
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


class User(Base):
    __tablename__ = 'Users'

    username = Column(String(50), primary_key=True, nullable=False)
    password = Column(String(100), nullable=False)
    money = Column(Float, nullable=False)  

    scores=relationship("UserHasScore")
    fantasy_team=relationship("FantasyTeam",uselist=False)
    

class FantasyTeam(Base):
    __tablename__ = 'FantasyTeams'

    team_name = Column(String(100), primary_key=True, nullable=False)
    emblem = Column(String(255), nullable=True) 

    username = Column(String(50), ForeignKey('Users.username'), nullable=False)

    # Relacionamento com a tabela lineup
    lineup = relationship("Lineup")

 
class Player(Base):
    __tablename__ = 'Players'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(100), nullable=False)
    real_team = Column(String(50), nullable=False)
    value = Column(Float, nullable=False)
    position = Column(String(50), nullable=False)

    lineup = relationship("Lineup")
    action= relationship("PlayerTakesAction")


class Round(Base):
    __tablename__ = 'Rounds'

    id = Column(Integer, primary_key=True, nullable=False)
    

    lineup = relationship("Lineup")
    action= relationship("PlayerTakesAction")
    match = relationship("Match")
    user_score = relationship("UserHasScore")


class Action(Base):
    __tablename__ = 'Actions'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    description = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    
    player_takes_action = relationship("PlayerTakesAction")



class Match(Base):
    __tablename__ = 'Matches'

    id = Column(Integer, primary_key=True)
    date = Column(DateTime, nullable=False)
    house_team = Column(String(100), nullable=False)
    visit_team = Column(String(100), nullable=False)
    house_score = Column(Integer, nullable=False)
    visit_score = Column(Integer, nullable=False)

    round = Column(Integer,ForeignKey('Rounds.id'), nullable=False)
    

class Lineup(Base):
    __tablename__ = 'Lineups'


    player_id = Column(Integer,ForeignKey('Players.id'),primary_key=True, nullable=False)
    round_id = Column(Integer,ForeignKey('Rounds.id'),primary_key=True, nullable=False)
    team_name = Column(String(100),ForeignKey('FantasyTeams.team_name'),primary_key=True, nullable=False)

    
class PlayerTakesAction(Base):
    __tablename__ = 'PlayersActions'


    player_id = Column(Integer,ForeignKey('Players.id'),primary_key=True, nullable=False)
    round_id = Column(Integer,ForeignKey('Rounds.id'),primary_key=True, nullable=False)
    action_id = Column(Integer,ForeignKey('Actions.id'),primary_key=True, nullable=False)
    

class UserHasScore(Base):
    __tablename__ = 'UsersScores'


    user_id = Column(String(50),ForeignKey('Users.username'),primary_key=True, nullable=False)
    round_id = Column(Integer,ForeignKey('Rounds.id'),primary_key=True, nullable=False)
    score = Column(Float, nullable=False)











# Criação das tabelas no banco de dados (sem excluir dados existentes)
Base.metadata.create_all(engine)

# Configuração da sessão
Session = sessionmaker(bind=engine)
session = Session()

# Commit das alterações (tabelas criadas)
session.commit()
