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
  return <><section className="dashboard-grid" aria-label="Indicadores">{dashboardMetrics.map(([label,value,note]) => <article className="metric-card" key={label}><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><div className="metric-note">{note}</div></article>)}</section><section className="main-grid"><article className="panel"><div className="panel-title-row"><h2>Agenda e atividades</h2><Link href="/agenda" className="text-link">Abrir agenda</Link></div><div className="placeholder-list">{agendaItems.map(([time,title,place]) => <div className="placeholder-row" key={`${time}-${title}`}><div><strong>{title}</strong><small>{place}</small></div><span>{time}</span></div>)}</div></article><article className="panel"><div className="panel-title-row"><h2>Resumo de campo</h2><Link href="/relatorios" className="text-link">Detalhes</Link></div><div className="placeholder-list"><div className="placeholder-row"><strong>Visitas realizadas</strong><span>18 este mês</span></div><div className="placeholder-row"><strong>Despesas</strong><span>R$ 1.024,30</span></div><div className="placeholder-row"><strong>Veículos ativos</strong><span>3</span></div><div className="placeholder-row"><strong>KM comercial</strong><span>1.248 km</span></div></div></article></section></>;
}

function Agenda() {
  return <section className="agenda-layout"><article className="panel agenda-main"><div className="panel-title-row"><div><span className="eyebrow">Setembro 2026</span><h2>Terça-feira, 1 de setembro</h2></div><button className="primary-button" type="button">+ Novo compromisso</button></div><div className="agenda-list">{agendaItems.map(([time,title,place,status]) => <div className="agenda-item" key={`${time}-${title}`}><time>{time}</time><div className="agenda-line" /><div className="agenda-card"><div><strong>{title}</strong><span>{place}</span></div><span className={`tag ${status === 'Confirmada' ? 'success' : ''}`}>{status}</span></div></div>)}</div></article><aside className="panel agenda-side"><h2>Próximos dias</h2><div className="mini-calendar">{['31','1','2','3','4','5','6','7','8','9','10','11','12','13'].map((day) => <span key={day} className={day === '1' ? 'selected' : ''}>{day}</span>)}</div><div className="soft-box"><strong>Google Agenda</strong><span>Integração será reconectada somente depois da homologação visual.</span></div></aside></section>;
}

function Routes() {
  return <section className="routes-grid"><article className="panel route-control"><div className="panel-title-row"><h2>Planejar deslocamento</h2><span className="tag success">Rota visual</span></div><label className="field-label">Origem<input className="field" defaultValue="Itajaí, SC" /></label><label className="field-label">Destino<input className="field" defaultValue="Balneário Camboriú, SC" /></label><div className="form-grid"><label className="field-label">Veículo<select className="field" defaultValue="principal"><option value="principal">Veículo principal</option></select></label><label className="field-label">Finalidade<select className="field" defaultValue="visita"><option value="visita">Visita comercial</option></select></label></div><button className="primary-button wide" type="button">Calcular rota</button><div className="route-summary"><div><span>Distância estimada</span><strong>14,8 km</strong></div><div><span>Tempo estimado</span><strong>24 min</strong></div><div><span>Retorno</span><strong>14,8 km</strong></div></div></article><article className="panel map-panel"><div className="map-toolbar"><strong>Mapa da rota</strong><span>Somente visual nesta fase</span></div><div className="mock-map" aria-label="Representação visual do mapa"><div className="road road-a" /><div className="road road-b" /><div className="road road-c" /><div className="route-line outbound" /><div className="route-line return" /><span className="map-pin start">A</span><span className="map-pin end">B</span><div className="map-legend"><span><i className="legend-blue" />Ida</span><span><i className="legend-orange" />Retorno</span></div></div></article></section>;
}

function Costs() {
  const rows = [['01/09','Combustível','Posto Central','R$ 286,40'],['29/08','Pedágio','BR-101','R$ 18,60'],['28/08','Estacionamento','Centro Itajaí','R$ 24,00'],['27/08','Combustível','Posto Norte','R$ 241,70']];
  return <><section className="dashboard-grid"><article className="metric-card"><span className="metric-label">Total no mês</span><strong className="metric-value">R$ 1.024</strong><div className="metric-note">despesas registradas</div></article><article className="metric-card"><span className="metric-label">Combustível</span><strong className="metric-value">R$ 782</strong><div className="metric-note">76% do total</div></article><article className="metric-card"><span className="metric-label">Custo por KM</span><strong className="metric-value">R$ 0,82</strong><div className="metric-note">média mensal</div></article><article className="metric-card"><span className="metric-label">Pendentes</span><strong className="metric-value">2</strong><div className="metric-note">lançamentos para revisar</div></article></section><section className="panel data-panel"><div className="panel-title-row"><h2>Lançamentos recentes</h2><button className="primary-button" type="button">+ Nova despesa</button></div><div className="data-table">{rows.map(([date,type,place,value]) => <div className="data-row" key={`${date}-${type}`}><span>{date}</span><strong>{type}</strong><span>{place}</span><b>{value}</b></div>)}</div></section></>;
}

function Vehicles() {
  const vehicles = [['SUV Comercial','ABC1D23','12.480 km','Ativo'],['Hatch Vendas','DEF4G56','38.210 km','Ativo'],['Utilitário','GHI7J89','64.990 km','Revisão']];
  return <section className="cards-list">{vehicles.map(([name,plate,km,status]) => <article className="panel vehicle-card" key={plate}><div className="vehicle-icon">V</div><div className="vehicle-copy"><span className="eyebrow">{plate}</span><h2>{name}</h2><p>{km} registrados</p></div><span className={`tag ${status === 'Ativo' ? 'success' : ''}`}>{status}</span></article>)}</section>;
}

function Reports() {
  return <section className="reports-layout"><article className="panel report-hero"><span className="eyebrow">Visão consolidada</span><h2>Performance de campo</h2><strong className="report-number">1.248 km</strong><span className="report-caption">percorridos em setembro</span><div className="bar-chart" aria-label="Gráfico visual"><i style={{height:'34%'}} /><i style={{height:'48%'}} /><i style={{height:'42%'}} /><i style={{height:'67%'}} /><i style={{height:'58%'}} /><i style={{height:'82%'}} /><i style={{height:'72%'}} /></div></article><article className="panel"><h2>Indicadores</h2><div className="placeholder-list report-list"><div className="placeholder-row"><strong>Visitas comerciais</strong><span>18</span></div><div className="placeholder-row"><strong>Tempo em campo</strong><span>42h 18min</span></div><div className="placeholder-row"><strong>Distância média/dia</strong><span>62,4 km</span></div><div className="placeholder-row"><strong>Custo operacional</strong><span>R$ 1.024,30</span></div></div></article></section>;
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const current = moduleMap.get(slug);
  if (!current) notFound();
  const content = slug === 'dashboard' ? <Dashboard /> : slug === 'agenda' ? <Agenda /> : slug === 'roteiros' ? <Routes /> : slug === 'custos' ? <Costs /> : slug === 'veiculos' ? <Vehicles /> : slug === 'relatorios' ? <Reports /> : <section className="module-stage"><div className="module-empty"><div><strong>{current.label} já possui rota própria.</strong><span>Este módulo será reconstruído diretamente nesta base V2, sem scripts herdados ou camadas de correção.</span></div></div></section>;
  return <><div className="page-head"><div><span className="eyebrow">Movvant V2</span><h1>{current.label}</h1><p>{current.description}</p></div><span className="status-badge">Base visual isolada · sem backend</span></div>{content}</>;
}
