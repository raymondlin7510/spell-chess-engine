from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from your React frontend

@app.route('/api/get-move', methods=['POST'])
def get_ai_move():
    data = request.get_json()
    fen = data.get("fen", "")
    move = "e2e4"
    return jsonify({"move": move})


if __name__ == '__main__':
    app.run(port=8000, debug=True)
