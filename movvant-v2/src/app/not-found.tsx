import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="system-state">
      <div className="system-state-card">
        <span className="eyebrow">Movvant V2</span>
        <h1>Página não encontrada</h1>
        <p>Esta rota não existe na V2. A navegação oficial continua disponível sem redirecionamentos automáticos inesperados.</p>
        <Link href="/dashboard" className="primary-button">Voltar ao Dashboard</Link>
      </div>
    </section>
  );
}
