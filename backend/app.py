from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import time

from services.interpolation import (
    linear_interpolation,
    quadratic_interpolation,
    lagrange_interpolation
)

app = Flask(__name__)
CORS(app)

@app.route('/ping')
def ping():
    return jsonify(message='pong')

@app.route('/interpolate', methods=['POST'])
def interpolate_route():
    data = request.get_json()
    pts_raw = data.get('points')
    method = data.get('method', 'linear')
    x0 = data.get('xToEval', None)

    # Validaciones previas...
    try:
        pts = [(float(p['x']), float(p['y'])) for p in pts_raw]
    except:
        abort(400, "Todos los puntos deben tener x e y numéricos")

    if len(set(x for x,_ in pts)) != len(pts):
        abort(400, "No se permiten valores duplicados de x")

    if method == 'linear' and len(pts) != 2:
        abort(400, "Lineal: se requieren exactamente 2 puntos")
    if method == 'quadratic' and len(pts) != 3:
        abort(400, "Cuadrática: se requieren exactamente 3 puntos")
    if method == 'lagrange' and len(pts) < 2:
        abort(400, "Lagrange: se requieren al menos 2 puntos")

    # Ejecutar método y obtener pasos
    start = time.perf_counter()
    if method=='linear':
      poly, val, steps = linear_interpolation(pts, x0)
    elif method=='quadratic':
      poly, val, steps = quadratic_interpolation(pts, x0)
    else:
      poly, val, steps = lagrange_interpolation(pts, x0)
    elapsed = time.perf_counter() - start

    return jsonify({
      'method': method,
      'polynomialLaTeX': poly,
      'value': val,
      'time': elapsed,
      'steps': steps
    })
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
