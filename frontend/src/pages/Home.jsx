import { useState } from 'react';
import PointsInput from '../components/PointsInput';
import { interpolate } from '../services/api';

export default function Home() {
  const [validPoints, setValidPoints] = useState([]);
  const [backendError, setBackendError] = useState('');
  const [echoPoints, setEchoPoints] = useState(null);

  const handleCalculate = () => {
    setBackendError('');
    interpolate(validPoints)
      .then(res => setEchoPoints(res.data.points))
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        setBackendError(msg);
      });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Interpolación Numérica</h1>
      <PointsInput onChange={setValidPoints} />
      {backendError && (
        <div style={{ color: 'red' }}>{backendError}</div>
      )}
      <button onClick={handleCalculate} disabled={!validPoints.length}>
        Calcular
      </button>
      {echoPoints && (
        <div>
          <h2>Puntos válidos procesados por backend:</h2>
          <pre>{JSON.stringify(echoPoints, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
