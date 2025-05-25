import { useState, useEffect } from 'react';
import PointsInput from './components/PointsInput';
import { ping, interpolate } from './services/api';

function App() {
  const [msg, setMsg] = useState('Cargando…');
  const [points, setPoints] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    ping()
      .then(res => setMsg(res.data.message))
      .catch(() => setMsg('Error al conectar'));
  }, []);

  const handleCalculate = () => {
    setError('');
    setResult(null);
    interpolate(points, 'linear', null)
      .then(res => setResult(res.data))
      .catch(err => {
        setError(err.response?.data?.message || 'Error desconocido');
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-4xl text-blue-500">¡Tailwind funciona!</h1>

      <h1>App de Interpolación</h1>
      <p><strong>Backend dice:</strong> {msg}</p>

      <PointsInput onChange={setPoints} />

      <button
        onClick={handleCalculate}
        disabled={points.length < 2}
        style={{ marginTop: 10 }}
      >
        Calcular
      </button>

      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 10 }}>
          <h2>Respuesta del backend:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
