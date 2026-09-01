'use client';

import { useState } from 'react';

export function PrototypeActionButton({
  children,
  title,
  description,
  className = 'primary-button'
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>{children}</button>
      {open ? (
        <div className="prototype-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="prototype-dialog" role="dialog" aria-modal="true" aria-labelledby="prototype-action-title">
            <span className="eyebrow">Homologação visual</span>
            <h2 id="prototype-action-title">{title}</h2>
            <p>{description}</p>
            <div className="prototype-notice"><strong>Nenhum dado será gravado.</strong><span>Esta ação demonstra o fluxo previsto antes da conexão com o backend.</span></div>
            <button type="button" className="primary-button" onClick={() => setOpen(false)}>Entendi</button>
          </section>
        </div>
      ) : null}
    </>
  );
}
