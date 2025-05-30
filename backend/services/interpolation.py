import time
import sympy as sp
from sympy.printing.pycode import PythonCodePrinter

# Creamos un printer para convertir expresiones a código Python (string)
_printer = PythonCodePrinter()

def sympy_to_py(expr):
    return _printer.doprint(expr)

class InterpolationError(Exception):
    pass

def validate_pts(pts, required):
    if not isinstance(pts, list) or any(len(p) != 2 for p in pts):
        raise InterpolationError("Los puntos deben ser lista de tuplas (x,y).")
    xs = [p[0] for p in pts]
    if len(set(xs)) != len(xs):
        raise InterpolationError("No se permiten valores duplicados de x.")
    if required is not None and len(pts) != required:
        raise InterpolationError(f"Se requieren exactamente {required} puntos para este método.")

def linear_interpolation(pts, x0=None):
    validate_pts(pts, 2)
    x1, y1 = map(float, pts[0])
    x2, y2 = map(float, pts[1])
    x = sp.Symbol('x')

    m = (y2 - y1) / (x2 - x1)
    b = y1 - m * x1
    P = m*x + b

    polyLaTeX   = sp.latex(sp.simplify(P))
    polynomialJs = sympy_to_py(sp.simplify(P))

    steps = [
        "=== Interpolación Lineal ===",
        f"Puntos: ({x1},{y1}), ({x2},{y2})",
        "Formamos P(x) = m·x + b con m=(y2-y1)/(x2-x1) y b=y1-m·x1",
        f"m = ({y2} - {y1})/({x2} - {x1}) = {m:.4f}",
        f"b = {y1} - ({m:.4f})·{x1} = {b:.4f}",
        f"P(x) = {m:.4f}·x + {b:.4f}"
    ]
    val = None
    if x0 is not None:
        x0f = float(x0)
        val = float(P.subs(x, x0f))
        steps += [
            f"\nEvaluación en x = {x0f}:",
            f"P({x0f}) = {m:.4f}·({x0f}) + {b:.4f} = {val:.4f}"
        ]

    return polyLaTeX, val, {"method": "linear", "points": pts, "steps": steps}, polynomialJs

def quadratic_interpolation(pts, x0=None):
    validate_pts(pts, 3)
    xs = [float(p[0]) for p in pts]
    ys = [float(p[1]) for p in pts]
    x = sp.Symbol('x')

    a0 = ys[0]
    a1 = (ys[1] - ys[0])/(xs[1] - xs[0])
    a2 = (((ys[2] - ys[1])/(xs[2] - xs[1])) - a1)/(xs[2] - xs[0])
    P = a0 + a1*(x - xs[0]) + a2*(x - xs[0])*(x - xs[1])

    polyLaTeX   = sp.latex(sp.simplify(P))
    polynomialJs = sympy_to_py(sp.simplify(P))

    steps = [
        "=== Interpolación Cuadrática de Newton ===",
        "Puntos: " + ", ".join(f"({xs[i]},{ys[i]})" for i in range(3)),
        "Formamos diferencias divididas:",
        f"a0 = {a0:.4f}",
        f"a1 = ({ys[1]} - {ys[0]})/({xs[1]} - {xs[0]}) = {a1:.4f}",
        f"a2 = ((({ys[2]} - {ys[1]})/({xs[2]} - {xs[1]})) - {a1:.4f})/({xs[2]} - {xs[0]}) = {a2:.4f}",
        f"P(x) = {a0:.4f} + {a1:.4f}(x - {xs[0]}) + {a2:.4f}(x - {xs[0]})(x - {xs[1]})"
    ]
    val = None
    if x0 is not None:
        x0f = float(x0)
        val = float(P.subs(x, x0f))
        steps += [
            f"\nEvaluación en x = {x0f}:",
            f"P({x0f}) = {val:.4f}"
        ]

    return polyLaTeX, val, {"method": "quadratic", "points": pts, "steps": steps}, polynomialJs

def lagrange_interpolation(pts, x0=None):
    validate_pts(pts, None)
    xs = [float(p[0]) for p in pts]
    ys = [float(p[1]) for p in pts]
    x = sp.Symbol('x')

    L = 0
    steps = [
        "=== Interpolación de Lagrange ===",
        "Puntos: " + ", ".join(f"({xs[i]},{ys[i]})" for i in range(len(xs))),
        "Construimos cada Lᵢ(x):"
    ]
    for i in range(len(xs)):
        expr = 1
        parts = []
        for j in range(len(xs)):
            if i != j:
                expr *= (x - xs[j])/(xs[i] - xs[j])
                parts.append(f"(x - {xs[j]})/({xs[i]} - {xs[j]})")
        steps.append(f"L{i}(x) = {' · '.join(parts)} · {ys[i]}")
        L += ys[i] * expr

    polyLaTeX   = sp.latex(sp.simplify(L))
    polynomialJs = sympy_to_py(sp.simplify(L))

    val = None
    if x0 is not None:
        x0f = float(x0)
        val = float(L.subs(x, x0f))
        steps += [
            f"\nEvaluación en x = {x0f}:",
            f"f({x0f}) = {val:.4f}"
        ]

    return polyLaTeX, val, {"method": "lagrange", "points": pts, "steps": steps}, polynomialJs
