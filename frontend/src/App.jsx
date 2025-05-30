import { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import PointsInput from './components/PointsInput';
import StepsAccordion from './components/StepsAccordion';
import { ping, interpolate } from './services/api';
import Chart from './components/Chart'; // <-- Agregado

export default function App() {
  const [msg, setMsg] = useState('Cargando…');
  const [points, setPoints] = useState([]);
  const [method, setMethod] = useState('linear');
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [xToEval, setXToEval] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [resetSignal, setResetSignal] = useState(false);

  useEffect(() => {
    ping()
      .then(res => setMsg(res.data.message))
      .catch(() => setMsg('Error al conectar'));
  }, []);

  const handleCalculate = () => {
    setError('');
    setResult(null);
    const xParsed = xToEval.trim() === '' ? null : parseFloat(xToEval);
    if (xParsed !== null && isNaN(xParsed)) {
      setError('El valor de x a evaluar no es válido');
      return;
    }
    interpolate(points, method, xParsed)
      .then(res => setResult(res.data))
      .catch(err => {
        setError(err.response?.data?.message || 'Error desconocido');
      });
  };

  const handleReset = () => {
    setResetSignal(prev => !prev);
    setXToEval('');
    setResult(null);
    setError('');
    setPoints([]);
  };

  const minPts = method === 'quadratic' ? 3 : 2;

  const methodDescriptions = {
    linear:    'Lineal: requiere exactamente 2 puntos para estimaciones rápidas.',
    quadratic: 'Cuadrática: requiere exactamente 3 puntos para incorporar curvatura.',
    lagrange:  'Lagrange: requiere ≥2 puntos; ojo con oscilaciones para muchos puntos.'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
<h1 class="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
    Interpolador Inteligente
</h1>

      <p className="mb-8 text-lg sm:text-xl text-gray-300">
        
      </p>

      <div className="w-full max-w-3xl">
        <PointsInput onChange={setPoints} resetSignal={resetSignal} />

        <div className="flex flex-wrap gap-4 mt-6 mb-1 justify-center">
          {['linear', 'quadratic', 'lagrange'].map(m => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              onMouseEnter={() => setHoveredMethod(m)}
              onMouseLeave={() => setHoveredMethod(null)}
              className={`px-4 py-2 rounded-xl font-bold transition text-lg ${
                method === m
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {hoveredMethod && (
          <p className="text-center text-sm text-gray-300 italic mb-4">
            {methodDescriptions[hoveredMethod]}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-300">
            Valor de x a evaluar (opcional):
          </label>
          <input
            type="text"
            value={xToEval}
            onChange={e => setXToEval(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ej: 1.5"
          />
        </div>

        <button
          onClick={handleCalculate}
          disabled={points.length < minPts}
          className={`mt-2 w-full py-4 rounded-xl font-semibold transition ${
            points.length < minPts
              ? 'bg-gray-600 cursor-not-allowed text-gray-400'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } text-lg sm:text-xl`}
        >
          Calcular
        </button>

        <button
          onClick={handleReset}
          className="mt-3 w-full py-3 rounded-xl font-semibold transition bg-red-500 hover:bg-red-600 text-white text-lg sm:text-xl"
        >
          Limpiar campos
        </button>

        {error && (
          <div className="mt-4 text-red-400 font-medium text-lg">{error}</div>
        )}

        {result && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Resultado:
            </h2>
            <p className="text-lg mb-2">
              <strong>Método:</strong> {result.method}
            </p>
            <p className="text-lg mb-2 flex items-center">
              <strong>Polinomio:</strong>
              <BlockMath
                math={result.polynomialLaTeX}
                className="ml-2 inline-block"
              />
            </p>
            {result.value !== null && (
              <p className="text-lg mb-2">
                <strong>Valor en x = {xToEval}:</strong> {result.value}
              </p>
            )}
            <p className="text-sm text-gray-400 mt-2">
              Tiempo de cálculo: {result.time.toFixed(6)} segundos
            </p>

            {result.steps && (
              <StepsAccordion
                steps={result.steps}
                polynomialLaTeX={result.polynomialLaTeX}
              />
            )}

            {/* 9. Gráfica */}
            {result.polynomialJs && (
              <Chart
                polynomialJs={result.polynomialJs}
                points={points.map(p => ({ x: Number(p.x), y: Number(p.y) }))}
              />
            )}
            <p className="mt-4 text-sm text-gray-400 text-center">
              <span className="text-blue-400 font-semibold">Línea azul:</span> polinomio interpolante.&nbsp;
              <span className="text-red-400 font-semibold">Puntos rojos:</span> datos ingresados.
            </p>

          </div>
        )}
      </div>
    </div>
  );
}
