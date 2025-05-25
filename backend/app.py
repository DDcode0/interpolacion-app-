from flask import Flask, request, jsonify, abort

app = Flask(__name__)

@app.route('/interpolate', methods=['POST'])
def interpolate():
    data = request.get_json()
    if not data or 'points' not in data:
        abort(400, description='Faltan puntos en la solicitud')
    raw = data['points']
    # Intentar convertir a float y validar
    pts = []
    try:
        for p in raw:
            x = float(p['x'])
            y = float(p['y'])
            pts.append((x, y))
    except Exception:
        abort(400, description='Todos los puntos deben tener x e y numéricos')
    # Duplicados en x
    xs = [x for x, _ in pts]
    if len(xs) != len(set(xs)):
        abort(400, description='No se permiten valores duplicados de x')
    # Verificación mínimo de puntos
    if len(pts) < 2:
        abort(400, description='Se requieren al menos 2 puntos')
    # Aquí harías la lógica de interpolación...
    # De momento devolvemos echo de puntos
    return jsonify(points=pts)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
