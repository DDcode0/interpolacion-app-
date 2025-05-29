import { useState } from 'react';

export default function StepsAccordion({ steps = {} }) {
  const [open, setOpen] = useState(false);
  const detailSteps = Array.isArray(steps.steps) ? steps.steps : [];

  return (
    <div>
      <button onClick={() => setOpen(o => !o)}>
        {open ? 'Ocultar pasos de resolución' : 'Ver pasos de resolución'}
      </button>

      {open && (
        <div>
          {detailSteps.map((line, i) => (
            <p key={i} style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
