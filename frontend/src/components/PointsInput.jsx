import { useState, useEffect } from 'react';

export default function PointsInput({ onChange, resetSignal }) {
  const [points, setPoints] = useState([{ x: '', y: '' }]);
  const [errors, setErrors] = useState([{}]);

  useEffect(() => {
    const errs = validate(points);
    setErrors(errs);
    const valid = points.filter((_, i) => !errs[i].x && !errs[i].y);
    onChange(valid);
  }, [points, onChange]);
  
useEffect(() => {
  setPoints([{ x: '', y: '' }]);
  setErrors([{}]);
}, [resetSignal]);

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
    <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-md">
      <table className="min-w-full bg-gray-700 text-gray-100 rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2 text-lg">x</th>
            <th className="px-4 py-2 text-lg">y</th>
            <th className="px-4 py-2 text-lg">Acción</th>
          </tr>
        </thead>
        <tbody>
          {points.map((pt, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
              <td className="px-4 py-3">
                <input
                  className="w-full p-3 border border-gray-600 bg-gray-900 rounded focus:outline-none focus:ring focus:border-blue-500 text-lg"
                  type="text"
                  placeholder="0"
                  value={pt.x}
                  onChange={e => updatePoint(i, 'x', e.target.value)}
                />
                {errors[i]?.x && (
                  <p className="text-red-400 text-base mt-1">{errors[i].x}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <input
                  className="w-full p-3 border border-gray-600 bg-gray-900 rounded focus:outline-none focus:ring focus:border-blue-500 text-lg"
                  type="text"
                  placeholder="0"
                  value={pt.y}
                  onChange={e => updatePoint(i, 'y', e.target.value)}
                />
                {errors[i]?.y && (
                  <p className="text-red-400 text-base mt-1">{errors[i].y}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => removeRow(i)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-lg"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <button
          onClick={addRow}
          className="inline-flex items-center px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-lg"
        >
          <span className="mr-2 text-2xl">+</span> Añadir punto
        </button>
      </div>
    </div>
  );
}

function validate(points) {
  const errs = points.map(() => ({ x: null, y: null }));
  const xs = points.map(p => p.x.trim());

  points.forEach((p, i) => {
    if (!p.x.trim()) errs[i].x = 'x vacío';
    else if (isNaN(Number(p.x))) errs[i].x = 'x no es un número';
    else if (xs.filter(v => v === p.x.trim()).length > 1)
      errs[i].x = 'x duplicado';

    if (!p.y.trim()) errs[i].y = 'y vacío';
    else if (isNaN(Number(p.y))) errs[i].y = 'y no es un número';
  });

  return errs;
}
