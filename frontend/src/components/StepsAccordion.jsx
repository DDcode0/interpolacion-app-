import { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function StepsAccordion({ steps = {} }) {
  const [open, setOpen] = useState(false);
  const detailSteps = Array.isArray(steps.steps) ? steps.steps : [];

  // Definimos la fórmula y descripción para cada método
  const infoMap = {
    linear: {
      title: '1. Interpolación Lineal',
      formula: `f(x) \\approx f(x_0) + \\frac{f(x_1)-f(x_0)}{x_1 - x_0} \\; (x - x_0)`,
      when: 'Solo necesitas dos puntos: (x₀,f(x₀)) y (x₁,f(x₁)). Útil para estimaciones rápidas entre esos dos puntos.'
    },
    quadratic: {
      title: '2. Interpolación Cuadrática de Newton',
      formula: `P(x) = f(x_0) + f[x_0,x_1](x - x_0) + f[x_0,x_1,x_2](x - x_0)(x - x_1)`,
      when: 'Cuando tienes 3 puntos y quieres una mejor aproximación con curvatura.'
    },
    lagrange: {
      title: '3. Interpolación de Lagrange',
      formula: `L(x) = \\sum_{i=0}^n f(x_i) \\prod_{j\\ne i} \\frac{x - x_j}{x_i - x_j}`,
      when: 'Útil con cualquier número de puntos ≥2, y no requiere sistema de ecuaciones.'
    }
  };

  const info = infoMap[steps.method] || {};

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold mb-2"
      >
        {open ? 'Ocultar pasos de resolución' : 'Ver pasos de resolución'}
      </button>

      {open && (
        <div className="bg-gray-800 p-4 rounded-md space-y-4">
          {/* Sección de fórmula general */}
          {info.title && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-yellow-300">{info.title}</h3>
              <div className="bg-gray-700 p-3 rounded">
                <BlockMath math={info.formula} />
              </div>
              <p className="text-base text-gray-200 italic">{info.when}</p>
            </div>
          )}

          {/* Pasos detallados */}
          <div className="space-y-2 pt-2 border-t border-gray-600">
            {detailSteps.map((line, i) => (
              <p
                key={i}
                className="text-base leading-relaxed font-mono text-gray-100 whitespace-pre-wrap"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
