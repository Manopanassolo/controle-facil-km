export default function Loading() {
  return (
    <section className="system-state" aria-live="polite" aria-busy="true">
      <div className="system-state-card">
        <span className="eyebrow">Movvant V2</span>
        <h1>Carregando módulo</h1>
        <p>A interface mantém o contexto da navegação enquanto o conteúdo é preparado.</p>
        <div className="loading-line" aria-hidden="true" />
      </div>
    </section>
  );
}
