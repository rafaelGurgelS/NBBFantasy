import csv
import pandas as pd
from flask import Flask, jsonify
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

app = Flask(__name__)

# Endpoint para obter a lista de jogadores
@app.route('/jogadores', methods=['GET'])
def get_jogadores():
    try:
        jogadores = session.query(Jogador).all()
        jogadores_list = []
        for jogador in jogadores:
            jogadores_list.append({
                'id': jogador.id,
                'nome': jogador.nome,
                'valor': jogador.valor,
                'time': jogador.time,
                'posicao': jogador.posicao,
                'arremessos_3pontos': jogador.arremessos_3pontos,
                'arremessos_2pontos': jogador.arremessos_2pontos,
                'lances_livres_convertidos': jogador.lances_livres_convertidos,
                'rebotes_totais': jogador.rebotes_totais,
                'bolas_recuperadas': jogador.bolas_recuperadas,
                'tocos': jogador.tocos,
                'erros': jogador.erros,
                'duplos_duplos': jogador.duplos_duplos,
                'enterradas': jogador.enterradas,
                'assistencias': jogador.assistencias
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
    session = Session()
    try:
        partidas = session.query(Partida).all()
        partidas_list = [{
            'id': partida.id,
            'data': partida.data,
            'time_casa': partida.time_casa,
            'time_visitante': partida.time_visitante,
            'placar_casa': partida.placar_casa,
            'placar_visitante': partida.placar_visitante,
            'rodada': partida.rodada
        } for partida in partidas]
        print(partidas_list)
        return jsonify(partidas_list)
    
    except Exception as e:
        print(f"Erro ao consultar o banco de dados: {str(e)}")
        return jsonify({'error': 'Erro ao consultar o banco de dados'}), 500

    finally:
        session.close()  # Fecha a sessão

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
