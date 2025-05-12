import { useEffect, useState } from 'react';
import { ping } from './services/api';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    ping().then(res => setMsg(res.data.message));
  }, []);

  return <div>Backend dice: {msg}</div>;
}

export default App;
