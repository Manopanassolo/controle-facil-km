'use client';

export default function ErrorState({ reset }: { reset: () => void }) {
  return (
    <section className="system-state" role="alert">
      <div className="system-state-card">
        <span className="eyebrow">Movvant V2</span>
        <h1>Não foi possível abrir este módulo</h1>
        <p>O restante da navegação permanece disponível. Você pode tentar carregar apenas esta tela novamente, sem reiniciar toda a aplicação.</p>
        <button className="primary-button" type="button" onClick={() => reset()}>Tentar novamente</button>
      </div>
    </section>
  );
}
