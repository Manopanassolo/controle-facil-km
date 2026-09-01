import Link from 'next/link';
import { notFound } from 'next/navigation';
import { moduleMap } from '@/lib/modules';

const dashboardMetrics = [
  ['Agenda de hoje', '4', 'compromissos previstos'],
  ['Rotas em andamento', '2', 'deslocamentos ativos'],
  ['KM no mês', '1.248', 'quilômetros registrados'],
  ['Custo médio', 'R$ 0,82', 'por quilômetro']
];

const agendaItems = [
  ['08:30', 'Visita comercial', 'Casa do MDF · Itajaí', 'Confirmada'],
  ['10:45', 'Follow-up', 'Cliente regional · Balneário Camboriú', 'Pendente'],
  ['14:00', 'Reunião de equipe', 'Comercial · Online', 'Confirmada'],
  ['16:30', 'Prospecção', 'Nova conta · Camboriú', 'Planejada']
];

function Dashboard() {
  return (
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
          <div className="panel-title-row"><h2>Agenda e atividades</h2><Link href="/agenda" className="text-link">Abrir agenda</Link></div>
          <div className="placeholder-list">
            {agendaItems.map(([time, title, place]) => (
              <div className="placeholder-row" key={`${time}-${title}`}><div><strong>{title}</strong><small>{place}</small></div><span>{time}</span></div>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="panel-title-row"><h2>Resumo de campo</h2><Link href="/relatorios" className="text-link">Detalhes</Link></div>
          <div className="placeholder-list">
            <div className="placeholder-row"><strong>Visitas realizadas</strong><span>18 este mês</span></div>
            <div className="placeholder-row"><strong>Despesas</strong><span>R$ 1.024,30</span></div>
            <div className="placeholder-row"><strong>Veículos ativos</strong><span>3</span></div>
            <div className="placeholder-row"><strong>KM comercial</strong><span>1.248 km</span></div>
          </div>
        </article>
      </section>
    </>
  );
}

function Agenda() {
  return (
    <section className="agenda-layout">
      <article className="panel agenda-main">
        <div className="panel-title-row">
          <div><span className="eyebrow">Setembro 2026</span><h2>Terça-feira, 1 de setembro</h2></div>
          <button className="primary-button" type="button">+ Novo compromisso</button>
        </div>
        <div className="agenda-list">
          {agendaItems.map(([time, title, place, status]) => (
            <div className="agenda-item" key={`${time}-${title}`}>
              <time>{time}</time>
              <div className="agenda-line" />
              <div className="agenda-card">
                <div><strong>{title}</strong><span>{place}</span></div>
                <span className={`tag ${status === 'Confirmada' ? 'success' : ''}`}>{status}</span>
              </div>
            </div>
          ))}
        </div>
      </article>
      <aside className="panel agenda-side">
        <h2>Próximos dias</h2>
        <div className="mini-calendar">
          {['31','1','2','3','4','5','6','7','8','9','10','11','12','13'].map((day) => <span key={day} className={day === '1' ? 'selected' : ''}>{day}</span>)}
        </div>
        <div className="soft-box"><strong>Google Agenda</strong><span>Integração será reconectada somente depois da homologação visual.</span></div>
      </aside>
    </section>
  );
}

function Routes() {
  return (
    <section className="routes-grid">
      <article className="panel route-control">
        <div className="panel-title-row"><h2>Planejar deslocamento</h2><span className="tag success">Rota visual</span></div>
        <label className="field-label">Origem<input className="field" defaultValue="Itajaí, SC" /></label>
        <label className="field-label">Destino<input className="field" defaultValue="Balneário Camboriú, SC" /></label>
        <div className="form-grid">
          <label className="field-label">Veículo<select className="field" defaultValue="principal"><option value="principal">Veículo principal</option></select></label>
          <label className="field-label">Finalidade<select className="field" defaultValue="visita"><option value="visita">Visita comercial</option></select></label>
        </div>
        <button className="primary-button wide" type="button">Calcular rota</button>
        <div className="route-summary">
          <div><span>Distância estimada</span><strong>14,8 km</strong></div>
          <div><span>Tempo estimado</span><strong>24 min</strong></div>
          <div><span>Retorno</span><strong>14,8 km</strong></div>
        </div>
      </article>
      <article className="panel map-panel">
        <div className="map-toolbar"><strong>Mapa da rota</strong><span>Somente visual nesta fase</span></div>
        <div className="mock-map" aria-label="Representação visual do mapa">
          <div className="road road-a" /><div className="road road-b" /><div className="road road-c" />
          <div className="route-line outbound" /><div className="route-line return" />
          <span className="map-pin start">A</span><span className="map-pin end">B</span>
          <div className="map-legend"><span><i className="legend-blue" />Ida</span><span><i className="legend-orange" />Retorno</span></div>
        </div>
      </article>
    </section>
  );
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const current = moduleMap.get(slug);
  if (!current) notFound();

  return (
    <>
      <div className="page-head">
        <div><span className="eyebrow">Movvant V2</span><h1>{current.label}</h1><p>{current.description}</p></div>
        <span className="status-badge">Base visual isolada · sem backend</span>
      </div>
      {slug === 'dashboard' ? <Dashboard /> : slug === 'agenda' ? <Agenda /> : slug === 'roteiros' ? <Routes /> : (
        <section className="module-stage"><div className="module-empty"><div><strong>{current.label} já possui rota própria.</strong><span>Este módulo será reconstruído diretamente nesta base V2, sem scripts herdados ou camadas de correção.</span></div></div></section>
      )}
    </>
  );
}
