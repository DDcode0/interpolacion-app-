import { useEffect, useState } from 'react';
import { ping } from './services/api';

function App() {
  const [msg, setMsg] = useState('Cargando...');

  useEffect(() => {
    ping()
      .then(res => setMsg(res.data.message))
      .catch(err => setMsg('Error: ' + err.message));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Backend dice: {msg}</h1>
    </div>
  );
}

export default App;
