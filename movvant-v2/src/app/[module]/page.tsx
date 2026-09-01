import { notFound } from 'next/navigation';
import { moduleMap } from '@/lib/modules';

const dashboardMetrics = [
  ['Agenda de hoje', '4', 'compromissos previstos'],
  ['Rotas em andamento', '2', 'deslocamentos ativos'],
  ['KM no mês', '1.248', 'quilômetros registrados'],
  ['Custo médio', 'R$ 0,82', 'por quilômetro']
];

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const current = moduleMap.get(slug);
  if (!current) notFound();

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{current.label}</h1>
          <p>{current.description}</p>
        </div>
        <span className="status-badge">Base visual V2 · sem backend</span>
      </div>

      {slug === 'dashboard' ? (
        <>
          <section className="dashboard-grid" aria-label="Indicadores">
            {dashboardMetrics.map(([label, value, note]) => (
              <article className="metric-card" key={label}>
                <span className="metric-label">{label}</span>
                <strong className="metric-value">{value}</strong>
                <div className="metric-note">{note}</div>
              </article>
            ))}
          </section>
          <section className="main-grid">
            <article className="panel">
              <h2>Agenda e atividades</h2>
              <div className="placeholder-list">
                <div className="placeholder-row"><strong>Visita comercial · Cliente A</strong><span>09:30</span></div>
                <div className="placeholder-row"><strong>Rota região Norte</strong><span>11:00</span></div>
                <div className="placeholder-row"><strong>Reunião de equipe</strong><span>14:30</span></div>
                <div className="placeholder-row"><strong>Follow-up comercial</strong><span>16:00</span></div>
              </div>
            </article>
            <article className="panel">
              <h2>Resumo de campo</h2>
              <div className="placeholder-list">
                <div className="placeholder-row"><strong>Visitas</strong><span>18 este mês</span></div>
                <div className="placeholder-row"><strong>Despesas</strong><span>R$ 1.024,30</span></div>
                <div className="placeholder-row"><strong>Veículos</strong><span>3 ativos</span></div>
              </div>
            </article>
          </section>
        </>
      ) : (
        <section className="module-stage">
          <div className="module-empty">
            <div>
              <strong>{current.label} já possui rota própria.</strong>
              <span>Esta tela não compartilha scripts de navegação com nenhum outro módulo. Na próxima etapa, o conteúdo visual aprovado deste módulo será reconstruído aqui, componente por componente.</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
