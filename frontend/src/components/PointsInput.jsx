import { useState, useEffect } from 'react';

// onChange recibe solo los puntos válidos [{x,y},…]
export default function PointsInput({ onChange }) {
  const [points, setPoints] = useState([{ x: '', y: '' }]);
  const [errors, setErrors] = useState([{}]);

  useEffect(() => {
    const errs = validate(points);
    setErrors(errs);
    const valid = points.filter((_, i) => !errs[i].x && !errs[i].y);
    onChange(valid);
  }, [points, onChange]);

  const updatePoint = (idx, field, val) => {
    const copy = [...points];
    copy[idx] = { ...copy[idx], [field]: val };
    setPoints(copy);
  };

  const addRow = () => setPoints([...points, { x: '', y: '' }]);
  const removeRow = idx => {
    if (points.length === 1) return;
    setPoints(points.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <table>
        <thead>
          <tr><th>x</th><th>y</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {points.map((pt, i) => (
            <tr key={i}>
              <td>
                <input
                  type="text"
                  value={pt.x}
                  onChange={e => updatePoint(i, 'x', e.target.value)}
                />
                {errors[i]?.x && <div style={{ color: 'red' }}>{errors[i].x}</div>}
              </td>
              <td>
                <input
                  type="text"
                  value={pt.y}
                  onChange={e => updatePoint(i, 'y', e.target.value)}
                />
                {errors[i]?.y && <div style={{ color: 'red' }}>{errors[i].y}</div>}
              </td>
              <td>
                <button onClick={() => removeRow(i)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Añadir punto</button>
    </div>
  );
}

function validate(points) {
  const errs = points.map(() => ({ x: null, y: null }));
  const xs = points.map(p => p.x.trim());

  points.forEach((p, i) => {
    // Validar x
    if (!p.x.trim()) errs[i].x = 'x vacío';
    else if (isNaN(Number(p.x))) errs[i].x = 'x no es un número';
    else if (xs.filter(v => v === p.x.trim()).length > 1) errs[i].x = 'x duplicado';

    // Validar y
    if (!p.y.trim()) errs[i].y = 'y vacío';
    else if (isNaN(Number(p.y))) errs[i].y = 'y no es un número';
  });

  return errs;
}
