'use client';

import { useEffect, useId, useRef, useState } from 'react';

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button ref={triggerRef} type="button" className={className} onClick={() => setOpen(true)}>{children}</button>
      {open ? (
        <div className="prototype-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <section className="prototype-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <span className="eyebrow">Homologação visual</span>
            <h2 id={titleId}>{title}</h2>
            <p>{description}</p>
            <div className="prototype-notice"><strong>Nenhum dado será gravado.</strong><span>Esta ação demonstra o fluxo previsto antes da conexão com o backend.</span></div>
            <button ref={closeRef} type="button" className="primary-button" onClick={close}>Entendi</button>
          </section>
        </div>
      ) : null}
    </>
  );
}
