import time
import sympy as sp

# Ejemplo para linear_interpolation
def linear_interpolation(pts, x0=None):
    x0_, y0_ = pts[0]
    x1_, y1_ = pts[1]
    # Cálculo
    m = (y1_ - y0_) / (x1_ - x0_)
    # Construir pasos
    steps = []
    steps.append("=== Interpolación Lineal ===")
    steps.append(
      f"Usamos los puntos: (x0 = {x0_}, f0 = {y0_}) y (x1 = {x1_}, f1 = {y1_})"
    )
    if x0 is not None:
      steps.append(f"Queremos estimar la temperatura a x = {x0} horas")
    steps.append("")
    steps.append("Paso 1: Calcular la pendiente")
    steps.append(
      f"m = (f1 - f0) / (x1 - x0) = ({y1_} - {y0_}) / ({x1_} - {x0_}) = {y1_ - y0_} / {x1_ - x0_} = {m:.4f}"
    )
    steps.append("")
    steps.append("Paso 2: Aplicar la fórmula")
    if x0 is not None:
      val = y0_ + m * (x0 - x0_)
      steps.append(
        f"f({x0}) ≈ f0 + m * (x - x0)\n     = {y0_} + {m:.4f} * ({x0} - {x0_})\n     = {y0_} + {m:.4f} = {val:.4f} °C"
      )
    # LaTeX del polinomio y valor
    polyLaTeX = f"{m:.4f} x + {y0_ - m*x0_:.4f}"
    return polyLaTeX, val if x0 is not None else None, {
      "method": "linear",
      "points": pts,
      "steps": steps
    }


def quadratic_interpolation(pts, x0=None):
    x0_, y0_ = pts[0]
    x1_, y1_ = pts[1]
    x2_, y2_ = pts[2]

    # diferencias
    f01 = (y1_ - y0_) / (x1_ - x0_)
    f12 = (y2_ - y1_) / (x2_ - x1_)
    f012 = (f12 - f01) / (x2_ - x0_)

    steps = [
      "=== Interpolación Cuadrática de Newton ===",
      "Puntos dados:",
      f"x0 = {x0_}, f0 = {y0_}",
      f"x1 = {x1_}, f1 = {y1_}",
      f"x2 = {x2_}, f2 = {y2_}",
    ]
    if x0 is not None:
      steps.append(f"x = {x0} horas")
    steps += [
      "",
      "Paso 1: Calcular diferencias divididas",
      f"f[x0,x1]   = ({y1_} - {y0_}) / ({x1_} - {x0_}) = {y1_ - y0_} / {x1_ - x0_} = {f01:.4f}",
      f"f[x1,x2]   = ({y2_} - {y1_}) / ({x2_} - {x1_}) = {y2_ - y1_} / {x2_ - x1_} = {f12:.4f}",
      f"f[x0,x1,x2] = ({f12:.4f} - {f01:.4f}) / ({x2_} - {x0_}) = {(f12 - f01):.4f} / {x2_ - x0_} = {f012:.4f}",
      "",
      "Paso 2: Construir el polinomio de Newton",
      "P(x) = f0 + f[x0,x1]*(x - x0) + f[x0,x1,x2]*(x - x0)*(x - x1)",
    ]
    if x0 is not None:
      val = y0_ + f01*(x0 - x0_) + f012*(x0 - x0_)*(x0 - x1_)
      steps += [
        "",
        f"Evaluando en x = {x0}:",
        f"P({x0}) = {y0_} + {f01:.4f}*({x0} - {x0_}) + {f012:.4f}*({x0} - {x0_})*({x0} - {x1_})",
        f"     = {val:.4f} °C"
      ]
    polyLaTeX = "..."  # tu LaTeX aquí
    return polyLaTeX, val if x0 is not None else None, {
      "method":"quadratic",
      "points": pts,
      "steps":steps
    }

def lagrange_interpolation(pts, x0=None):
    xs, ys = zip(*pts)
    steps = [
      "=== Interpolación de Lagrange ===",
      "Puntos: " + ", ".join(f"({x},{y})" for x,y in pts),
    ]
    if x0 is not None:
      steps.append(f"Queremos f({x0})")
    steps += [
      "",
      "Paso 1: Aplicar la fórmula general",
    ]
    # cada Lk
    for k in range(len(xs)):
      numer = " * ".join(f"(x - {xs[j]})" for j in range(len(xs)) if j!=k)
      denom = " * ".join(f"({xs[k]} - {xs[j]})" for j in range(len(xs)) if j!=k)
      steps.append(f"L{k} = {ys[k]} * {numer} / {denom}")
    if x0 is not None:
      steps += [
        "",
        "Paso 2: Sumar términos",
        "f({}) = ".format(x0) + " + ".join(f"{ys[k]} * L{k}" for k in range(len(xs))),
        "= resultado"
      ]
    polyLaTeX="..."  # tu LaTeX
    return polyLaTeX, val if x0 is not None else None, {
      "method":"lagrange",
      "points":pts,
      "steps":steps
    }

