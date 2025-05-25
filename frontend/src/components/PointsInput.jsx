import { useState, useEffect } from 'react';

// Recibe onChange(pointsValidos) para notificar al padre
export default function PointsInput({ onChange }) {
  // Estado de puntos y errores
  const [points, setPoints] = useState([{ x: '', y: '' }]);
  const [errors, setErrors] = useState([{}]);

  // Cada vez que cambian points, validamos y notificamos
  useEffect(() => {
    const errs = validate(points);
    setErrors(errs);
    // Solo puntos sin error en x e y
    const valid = points.filter((_, i) => !errs[i].x && !errs[i].y);
    onChange(valid);
  }, [points, onChange]);

  // Actualiza un campo de un punto
  const updatePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  // Añade una nueva fila
  const addRow = () => setPoints([...points, { x: '', y: '' }]);

  // Elimina la fila i
  const removeRow = (i) => {
    const newPoints = points.filter((_, idx) => idx !== i);
    setPoints(newPoints);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>x</th><th>y</th><th>Acción</th>
          </tr>
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
                {errors[i]?.x && (
                  <div style={{ color: 'red', fontSize: '0.8em' }}>
                    {errors[i].x}
                  </div>
                )}
              </td>
              <td>
                <input
                  type="text"
                  value={pt.y}
                  onChange={e => updatePoint(i, 'y', e.target.value)}
                />
                {errors[i]?.y && (
                  <div style={{ color: 'red', fontSize: '0.8em' }}>
                    {errors[i].y}
                  </div>
                )}
              </td>
              <td>
                {points.length > 1 && (
                  <button onClick={() => removeRow(i)}>Eliminar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Añadir punto</button>
    </div>
  );
}

// Función de validación devuelve un array de objetos { x: mensaje | null, y: mensaje | null }
function validate(points) {
  const errs = points.map(() => ({ x: null, y: null }));
  const xs = points.map(p => p.x.trim());
  points.forEach((p, i) => {
    // Validar x
    if (p.x.trim() === '') {
      errs[i].x = 'x vacío';
    } else if (isNaN(Number(p.x))) {
      errs[i].x = 'x no es un número';
    } else if (xs.filter(v => v === p.x.trim()).length > 1) {
      errs[i].x = 'x duplicado';
    }
    // Validar y
    if (p.y.trim() === '') {
      errs[i].y = 'y vacío';
    } else if (isNaN(Number(p.y))) {
      errs[i].y = 'y no es un número';
    }
  });
  return errs;
}
