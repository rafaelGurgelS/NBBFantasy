import csv
from flask import Flask, jsonify

app = Flask(__name__)

# Endpoint para obter a lista de jogadores
@app.route('/jogadores', methods=['GET'])
def get_jogadores():
    jogadores = []

    # Leitura do arquivo CSV e construção da lista de jogadores
    try:
        with open('nbb_estatisticas.csv', mode='r', encoding='utf-8-sig') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                jogador = {
                    'nome': row['Jogador'],
                    'pontuacao': float(row['PTS']),
                    'valor': float(row['PTS']),
                    'time': row['Equipe'],
                    'posicao': row['Posicao']
                }
                jogadores.append(jogador)

        return jsonify(jogadores)
    
    except Exception as e:
        print(f"Erro ao ler CSV: {str(e)}")
        return jsonify({'error': 'Erro ao ler CSV'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
