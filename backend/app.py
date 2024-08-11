import csv
import pandas as pd
from flask import Flask, jsonify

app = Flask(__name__)

# Endpoint para obter a lista de jogadores
@app.route('/jogadores', methods=['GET'])
def get_jogadores():
    jogadores = []

    # Leitura do arquivo CSV e construção da lista de jogadores
    try:
        
        df_stat = pd.read_csv('nbb_estatisticas.csv')
        df_stat.rename(columns={'Jogador':'nome','PTS':'pontuacao','Equipe':'time','Posicao':'posicao'},inplace=True)
        df_stat['valor']=df_stat['pontuacao']
        df_filtered=df_stat[['key','nome','pontuacao','valor','time','posicao']]
        
        jogadores = df_filtered.to_dict(orient='records')
    
        # Retorna a lista de jogadores como JSON
        return jsonify(jogadores)
       
    
    except Exception as e:
        print(f"Erro ao ler CSV: {str(e)}")
        return jsonify({'error': 'Erro ao ler CSV'}), 500

# Endpoint para obter a lista de partidas
@app.route('/partidas', methods=['GET'])
def get_partidas():
    partidas = []

    # Leitura do arquivo CSV e construção da lista de partidas
    try:
        # Carrega o arquivo CSV
        df_partidas = pd.read_csv('nbb_partidas.csv', encoding='utf-8-sig')
        
        # Filtra as partidas do "1º TURNO"
        df_filtered = df_partidas[df_partidas['FASE'] == '1º TURNO']
        
        # Renomeia as colunas para manter consistência no formato de dados
        df_filtered.rename(columns={
            'DATA': 'data',
            'EQUIPE CASA': 'time_casa',
            'EQUIPE VISITANTE': 'time_visitante',
            'PLACAR CASA': 'placar_casa',
            'PLACAR VISITANTE': 'placar_visitante',
            'RODADA': 'rodada'
        }, inplace=True)
        
        # Seleciona apenas as colunas necessárias
        df_filtered = df_filtered[['data', 'time_casa', 'time_visitante', 'placar_casa', 'placar_visitante', 'rodada']]
        
        # Converte o DataFrame para uma lista de dicionários
        partidas = df_filtered.to_dict(orient='records')
        
        # Retorna a lista de partidas como JSON
        return jsonify(partidas)
    
    except Exception as e:
        print(f"Erro ao ler CSV: {str(e)}")
        return jsonify({'error': 'Erro ao ler CSV'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)