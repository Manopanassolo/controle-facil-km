'use client';

import { FormEvent, ReactNode, useId, useRef, useState } from 'react';

export type PrototypeFormValues = Record<string, string | string[]>;

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'select' | 'multiselect' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

export function PrototypeFormDialog({
  trigger,
  title,
  description,
  fields,
  className = 'primary-button',
  onValidate
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  fields: Field[];
  className?: string;
  onValidate?: (values: PrototypeFormValues) => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    setSubmitted(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    const data = new FormData(event.currentTarget);
    const values: PrototypeFormValues = {};
    for (const field of fields) {
      const entries = data.getAll(field.name).map(String);
      values[field.name] = field.type === 'multiselect' ? entries : (entries[0] || '');
    }

    onValidate?.(values);
    setSubmitted(true);
  }

  return (
    <>
      <button ref={triggerRef} type="button" className={className} onClick={() => setOpen(true)}>{trigger}</button>
      {open ? (
        <div className="prototype-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }} onKeyDown={(event) => {
          if (event.key === 'Escape') close();
        }}>
          <section className="prototype-dialog prototype-form-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
            <span className="eyebrow">Homologação local</span>
            <h2 id={titleId}>{title}</h2>
            <p>{description}</p>
            {submitted ? (
              <div className="prototype-success" role="status"><strong>Fluxo validado.</strong><span>O registro foi incluído somente nesta sessão. Recarregar a página apaga esta simulação.</span><button type="button" className="primary-button" onClick={close}>Concluir</button></div>
            ) : (
              <form className="prototype-form" onSubmit={submit}>
                <div className="prototype-form-grid">
                  {fields.map((field) => (
                    <label className={`field-label ${field.type === 'textarea' || field.type === 'multiselect' ? 'prototype-span-2' : ''}`} key={field.name}>
                      {field.label}{field.required ? ' *' : ''}
                      {field.type === 'select' ? (
                        <select className="field" name={field.name} required={field.required} defaultValue="">
                          <option value="" disabled>Selecione</option>
                          {field.options?.map((option) => <option value={option} key={option}>{option}</option>)}
                        </select>
                      ) : field.type === 'multiselect' ? (
                        <select className="field prototype-multiselect" name={field.name} required={field.required} multiple size={Math.min(field.options?.length || 3, 5)}>
                          {field.options?.map((option) => <option value={option} key={option}>{option}</option>)}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea className="field prototype-textarea" name={field.name} placeholder={field.placeholder} required={field.required} />
                      ) : (
                        <input className="field" name={field.name} type={field.type || 'text'} placeholder={field.placeholder} required={field.required} />
                      )}
                    </label>
                  ))}
                </div>
                <div className="prototype-notice"><strong>Homologação sem backend.</strong><span>Ao continuar, o registro aparece apenas na memória desta tela para validar o fluxo completo.</span></div>
                <div className="prototype-dialog-actions"><button type="button" className="secondary-button" onClick={close}>Cancelar</button><button type="submit" className="primary-button">Adicionar nesta sessão</button></div>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
