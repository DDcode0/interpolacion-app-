import time
import sympy as sp


def linear_interpolation(pts, x0=None):
    x0 = float(x0)
    x0 = round(x0, 4)
    (x1, y1), (x2, y2) = pts
    steps = [
        "=== Interpolación Lineal ===",
        f"Puntos: ({x1},{y1}), ({x2},{y2})",
        f"Queremos f({x0})",
        "\nPaso 1: Aplicar la fórmula de interpolación lineal:",
        "f(x) = y1 + ((y2 - y1)/(x2 - x1)) * (x - x1)",
        f"     = {y1} + (({y2} - {y1})/({x2} - {x1})) * ({x0} - {x1})"
    ]
    val = y1 + ((y2 - y1)/(x2 - x1)) * (x0 - x1)
    steps.append(f"     = {val:.4f} ")
    polyLaTeX = sp.latex(y1 + ((y2 - y1)/(x2 - x1)) * (sp.Symbol('x') - x1))

    return polyLaTeX, val, {
        "method": "linear",
        "points": pts,
        "steps": steps
    }

def quadratic_interpolation(pts, x0=None):
    xs, ys = zip(*pts)
    x = sp.Symbol('x')
    steps = [
        "=== Interpolación Cuadrática ===",
        "Puntos: " + ", ".join(f"({x},{y})" for x,y in pts)
    ]
    if x0 is not None:
        steps.append(f"Queremos f({x0})")

    steps.append("\nPaso 1: Calcular coeficientes usando forma de Newton")
    a0 = ys[0]
    a1 = (ys[1] - ys[0]) / (xs[1] - xs[0])
    a2 = (((ys[2] - ys[1]) / (xs[2] - xs[1])) - a1) / (xs[2] - xs[0])
    steps.append(f"a0 = {a0}")
    steps.append(f"a1 = ({ys[1]} - {ys[0]}) / ({xs[1]} - {xs[0]}) = {a1:.4f}")
    steps.append(f"a2 = (({ys[2]} - {ys[1]}) / ({xs[2]} - {xs[1]}) - {a1:.4f}) / ({xs[2]} - {xs[0]}) = {a2:.4f}")

    poly = a0 + a1*(x - xs[0]) + a2*(x - xs[0])*(x - xs[1])
    polyLaTeX = sp.latex(sp.expand(poly))

    if x0 is not None:
        val = float(poly.subs(x, x0))
        steps.append("\nPaso 2: Evaluar el polinomio en x = {:.4f}".format(x0))
        steps.append(f"f({x0}) = {val:.4f} °C")
    else:
        val = None

    return polyLaTeX, val, {
        "method": "quadratic",
        "points": pts,
        "steps": steps
    }

def lagrange_interpolation(pts, x0=None):
    xs, ys = zip(*pts)
    x = sp.Symbol('x')
    steps = [
        "=== Interpolación de Lagrange ===",
        "Puntos: " + ", ".join(f"({x},{y})" for x,y in pts)
    ]
    if x0 is not None:
        steps.append(f"Queremos f({x0})")

    steps.append("\nPaso 1: Construir el polinomio de Lagrange")

    n = len(xs)
    L_terms = []
    full_expr = 0

    for i in range(n):
        Li_expr = 1
        Li_steps = [f"L{i}(x) = "]
        for j in range(n):
            if i != j:
                Li_expr *= (x - xs[j]) / (xs[i] - xs[j])
                Li_steps.append(f"(x - {xs[j]}) / ({xs[i]} - {xs[j]})")
        Li_final = ys[i] * Li_expr
        full_expr += Li_final
        steps.append(" * ".join(Li_steps) + f" * {ys[i]}")
        L_terms.append(Li_final)

    polyLaTeX = sp.latex(sp.expand(full_expr))

    if x0 is not None:
        val = float(full_expr.subs(x, x0))
        steps.append("\nPaso 2: Evaluar el polinomio en x = {:.4f}".format(x0))
        steps.append(f"f({x0}) = {val:.4f} °C")
    else:
        val = None

    return polyLaTeX, val, {
        "method": "lagrange",
        "points": pts,
        "steps": steps
    }
