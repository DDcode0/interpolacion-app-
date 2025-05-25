from flask import Flask, request, jsonify, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # permite cualquier origen

@app.route('/ping')
def ping():
    return jsonify(message='pong')

@app.route('/interpolate', methods=['POST'])
def interpolate_route():
    data = request.get_json()
    if not data or 'points' not in data:
        abort(400, description='Faltan puntos en la solicitud')

    raw = data['points']
    pts = []
    try:
        for p in raw:
            x = float(p['x'])
            y = float(p['y'])
            pts.append((x, y))
    except Exception:
        abort(400, description='Todos los puntos deben tener x e y numéricos')

    xs = [x for x, _ in pts]
    if len(xs) != len(set(xs)):
        abort(400, description='No se permiten valores duplicados de x')

    if len(pts) < 2:
        abort(400, description='Se requieren al menos 2 puntos')

    # Por ahora devolvemos eco de puntos
    return jsonify(points=pts)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
