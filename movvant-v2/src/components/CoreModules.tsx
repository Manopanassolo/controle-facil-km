'use client';

import { useState } from 'react';
import { PrototypeActionButton } from '@/components/PrototypeActionButton';
import { PrototypeFormDialog, PrototypeFormValues } from '@/components/PrototypeFormDialog';
import { useSessionActivity } from '@/components/SessionActivityProvider';

const agendaItems = [
  ['08:30', 'Visita comercial', 'Casa do MDF · Itajaí', 'Confirmada'],
  ['10:45', 'Follow-up', 'Cliente regional · Balneário Camboriú', 'Pendente'],
  ['14:00', 'Reunião de equipe', 'Comercial · Online', 'Confirmada'],
  ['16:30', 'Prospecção', 'Nova conta · Camboriú', 'Planejada']
];

function value(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

export function AgendaModule() {
  const [sessionItems, setSessionItems] = useState<string[][]>([]);
  const items = [...sessionItems, ...agendaItems].sort((a, b) => a[0].localeCompare(b[0]));

  function addAppointment(values: PrototypeFormValues) {
    const client = value(values, 'cliente');
    const address = value(values, 'endereco');
    const responsible = value(values, 'responsavel');
    const detail = [client, address, responsible].filter(Boolean).join(' · ');
    setSessionItems((current) => [[value(values, 'horario'), value(values, 'titulo'), detail || 'Compromisso local', 'Planejada', 'session'], ...current]);
  }

  return <section className="agenda-layout"><article className="panel agenda-main"><div className="panel-title-row"><div><span className="eyebrow">Setembro 2026</span><h2>Terça-feira, 1 de setembro</h2></div><PrototypeFormDialog trigger="+ Novo compromisso" title="Novo compromisso" description="Valide o fluxo de agenda antes de conectarmos Google Agenda e persistência real." onValidate={addAppointment} fields={[{name:'titulo',label:'Título',required:true,placeholder:'Ex.: Visita comercial'},{name:'cliente',label:'Cliente',placeholder:'Empresa ou contato'},{name:'data',label:'Data',type:'date',required:true},{name:'horario',label:'Horário',required:true,placeholder:'14:30'},{name:'endereco',label:'Endereço',required:true,placeholder:'Rua, número e cidade'},{name:'responsavel',label:'Responsável',required:true,placeholder:'Usuário responsável'},{name:'observacao',label:'Observações',type:'textarea',placeholder:'Objetivo ou instruções da visita'}]} /></div>{sessionItems.length ? <div className="session-banner" role="status"><strong>{sessionItems.length} compromisso(s) local(is)</strong><span>Somente nesta sessão · ainda não sincroniza com Google Agenda.</span></div> : null}<div className="agenda-list">{items.map(([time,title,place,status,session], index) => <div className={`agenda-item ${session ? 'session-row' : ''}`} key={`${time}-${title}-${index}`}><time>{time}</time><div className="agenda-line" /><div className="agenda-card"><div><strong>{title}</strong><span>{place}</span>{session ? <em className="session-chip">Somente nesta sessão</em> : null}</div><span className={`tag ${status === 'Confirmada' ? 'success' : ''}`}>{status}</span></div></div>)}</div></article><aside className="panel agenda-side"><h2>Próximos dias</h2><div className="mini-calendar">{['31','1','2','3','4','5','6','7','8','9','10','11','12','13'].map((day) => <span key={day} className={day === '1' ? 'selected' : ''}>{day}</span>)}</div><div className="soft-box"><strong>Google Agenda</strong><span>Integração será reconectada somente depois da homologação visual.</span></div></aside></section>;
}

export function RoutesModule() {
  return <section className="routes-grid"><article className="panel route-control"><div className="panel-title-row"><h2>Planejar deslocamento</h2><span className="tag success">Rota visual</span></div><label className="field-label">Origem<input className="field" defaultValue="Itajaí, SC" /></label><label className="field-label">Destino<input className="field" defaultValue="Balneário Camboriú, SC" /></label><div className="form-grid"><label className="field-label">Veículo<select className="field" defaultValue="principal"><option value="principal">Veículo principal</option></select></label><label className="field-label">Finalidade<select className="field" defaultValue="visita"><option value="visita">Visita comercial</option></select></label></div><PrototypeActionButton className="primary-button wide" title="Calcular rota" description="Nesta etapa serão consultadas distância, duração, trajeto de ida e retorno usando o serviço de mapas, sem perder os dados informados no formulário.">Calcular rota</PrototypeActionButton><div className="route-summary"><div><span>Distância estimada</span><strong>14,8 km</strong></div><div><span>Tempo estimado</span><strong>24 min</strong></div><div><span>Retorno</span><strong>14,8 km</strong></div></div></article><article className="panel map-panel"><div className="map-toolbar"><strong>Mapa da rota</strong><span>Somente visual nesta fase</span></div><div className="mock-map" aria-label="Representação visual do mapa"><div className="road road-a" /><div className="road road-b" /><div className="road road-c" /><div className="route-line outbound" /><div className="route-line return" /><span className="map-pin start">A</span><span className="map-pin end">B</span><div className="map-legend"><span><i className="legend-blue" />Ida</span><span><i className="legend-orange" />Retorno</span></div></div></article></section>;
}

export function CostsModule() {
  const initialRows = [['01/09','Combustível','Posto Central','R$ 286,40'],['29/08','Pedágio','BR-101','R$ 18,60'],['28/08','Estacionamento','Centro Itajaí','R$ 24,00'],['27/08','Combustível','Posto Norte','R$ 241,70']];
  const [sessionRows, setSessionRows] = useState<string[][]>([]);
  const { expenses, addExpense: shareExpense, totalExpenses } = useSessionActivity();
  const rows = [...sessionRows, ...initialRows];

  function addExpense(values: PrototypeFormValues) {
    const rawDate = value(values, 'data');
    const date = rawDate ? rawDate.split('-').reverse().slice(0, 2).join('/') : 'Hoje';
    const rawAmount = Number(value(values, 'valor').replace(',', '.')) || 0;
    const amount = `R$ ${rawAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const vehicle = value(values, 'veiculo');
    const place = value(values, 'local') || vehicle;
    setSessionRows((current) => [[date, value(values, 'categoria'), place, amount, 'session'], ...current]);
    shareExpense({ category: value(values, 'categoria'), amount: rawAmount, date: rawDate, vehicle, km: Number(value(values, 'km')) || undefined, place });
  }

  return <><section className="dashboard-grid"><article className="metric-card"><span className="metric-label">Total no mês</span><strong className="metric-value">R$ 1.024</strong><div className="metric-note">base demonstrativa</div></article><article className="metric-card"><span className="metric-label">Despesas da sessão</span><strong className="metric-value">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong><div className="metric-note">jornadas + lançamentos locais</div></article><article className="metric-card"><span className="metric-label">Lançamentos locais</span><strong className="metric-value">{expenses.length}</strong><div className="metric-note">fora do Modo Campo</div></article><article className="metric-card"><span className="metric-label">Pendentes</span><strong className="metric-value">2</strong><div className="metric-note">base demonstrativa</div></article></section><section className="panel data-panel"><div className="panel-title-row"><h2>Lançamentos recentes</h2><PrototypeFormDialog trigger="+ Nova despesa" title="Nova despesa" description="Valide a estrutura completa do lançamento antes de conectarmos o financeiro real." onValidate={addExpense} fields={[{name:'categoria',label:'Categoria',type:'select',required:true,options:['Combustível','Pedágio','Estacionamento','Alimentação','Hospedagem','Outro']},{name:'valor',label:'Valor (R$)',type:'number',required:true,placeholder:'0,00'},{name:'data',label:'Data',type:'date',required:true},{name:'veiculo',label:'Veículo',type:'select',required:true,options:['SUV Comercial','Hatch Vendas','Utilitário']},{name:'km',label:'KM no lançamento',type:'number',placeholder:'12480'},{name:'local',label:'Local',placeholder:'Estabelecimento ou cidade'},{name:'observacao',label:'Observação',type:'textarea',placeholder:'Detalhes relevantes da despesa'}]} /></div>{sessionRows.length ? <div className="session-banner" role="status"><strong>{sessionRows.length} lançamento(s) local(is)</strong><span>Compartilhados com Dashboard, Histórico e Relatórios nesta sessão.</span></div> : null}<div className="data-table">{rows.map(([date,type,place,amount,session], index) => <div className={`data-row ${session ? 'session-row' : ''}`} key={`${date}-${type}-${index}`}><span>{date}</span><strong>{type}</strong><span>{place}</span><b>{amount}</b>{session ? <em className="session-chip">Sessão</em> : null}</div>)}</div></section></>;
}

export function VehiclesModule() {
  const initialVehicles = [['SUV Comercial','ABC1D23','12.480 km','Ativo'],['Hatch Vendas','DEF4G56','38.210 km','Ativo'],['Utilitário','GHI7J89','64.990 km','Revisão']];
  const [sessionVehicles, setSessionVehicles] = useState<string[][]>([]);
  const vehicles = [...sessionVehicles, ...initialVehicles];

  function addVehicle(values: PrototypeFormValues) {
    const km = Number(value(values, 'kmInicial')) || 0;
    setSessionVehicles((current) => [[value(values, 'nome'), value(values, 'placa').toUpperCase(), `${km.toLocaleString('pt-BR')} km`, value(values, 'status'), 'session'], ...current]);
  }

  return <><div className="panel-title-row module-actions"><span>{sessionVehicles.length ? <span className="session-banner compact"><strong>{sessionVehicles.length} veículo(s) local(is)</strong><span>Somente nesta sessão</span></span> : null}</span><PrototypeFormDialog trigger="+ Novo veículo" title="Novo veículo" description="Valide os campos essenciais do cadastro da frota antes da persistência real." onValidate={addVehicle} fields={[{name:'nome',label:'Identificação do veículo',required:true,placeholder:'Ex.: SUV Comercial'},{name:'placa',label:'Placa',required:true,placeholder:'ABC1D23'},{name:'modelo',label:'Modelo',required:true,placeholder:'Ex.: T-Cross Comfortline'},{name:'ano',label:'Ano',type:'number',required:true,placeholder:'2026'},{name:'kmInicial',label:'KM inicial',type:'number',required:true,placeholder:'0'},{name:'responsavel',label:'Responsável',placeholder:'Condutor principal'},{name:'status',label:'Status',type:'select',required:true,options:['Ativo','Reserva','Manutenção']},{name:'observacao',label:'Observações',type:'textarea',placeholder:'Documentos, manutenção ou regras específicas'}]} /></div><section className="cards-list">{vehicles.map(([name,plate,km,status,session]) => <article className={`panel vehicle-card ${session ? 'session-row' : ''}`} key={`${plate}-${name}`}><div className="vehicle-icon">V</div><div className="vehicle-copy"><span className="eyebrow">{plate}</span><h2>{name}</h2><p>{km} registrados</p>{session ? <em className="session-chip">Somente nesta sessão</em> : null}</div><div className="vehicle-actions"><span className={`tag ${status === 'Ativo' ? 'success' : 'warning'}`}>{status}</span><PrototypeActionButton className="secondary-button" title={name} description="Abrirá dados do veículo, KM, documentos, revisões, despesas e histórico de utilização.">Gerenciar</PrototypeActionButton></div></article>)}</section></>;
}

export function ReportsModule() {
  const { journeys, routes, expenses, totalKm, totalExpenses, activityCount } = useSessionActivity();
  const sessionVisits = journeys.length;
  const sessionRoutes = journeys.length + routes.length;
  return <><section className="panel session-report-summary"><div><span className="eyebrow">Homologação consolidada</span><h2>Dados desta sessão</h2><p>Jornadas, rotas e despesas registradas localmente são consolidadas sem misturar com a base demonstrativa.</p></div><div className="session-report-metrics"><span><b>{totalKm.toLocaleString('pt-BR')} km</b><small>KM da sessão</small></span><span><b>{sessionVisits}</b><small>visitas/jornadas</small></span><span><b>{sessionRoutes}</b><small>deslocamentos</small></span><span><b>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b><small>despesas da sessão</small></span><span><b>{activityCount}</b><small>eventos consolidados</small></span><span><b>{expenses.length}</b><small>despesas independentes</small></span></div></section><section className="reports-layout"><article className="panel report-hero"><span className="eyebrow">Visão consolidada · base demonstrativa</span><h2>Performance de campo</h2><strong className="report-number">1.248 km</strong><span className="report-caption">percorridos em setembro</span><div className="bar-chart" aria-label="Gráfico visual"><i style={{height:'34%'}} /><i style={{height:'48%'}} /><i style={{height:'42%'}} /><i style={{height:'67%'}} /><i style={{height:'58%'}} /><i style={{height:'82%'}} /><i style={{height:'72%'}} /></div></article><article className="panel"><h2>Indicadores demonstrativos</h2><div className="placeholder-list report-list"><div className="placeholder-row"><strong>Visitas comerciais</strong><span>18</span></div><div className="placeholder-row"><strong>Tempo em campo</strong><span>42h 18min</span></div><div className="placeholder-row"><strong>Distância média/dia</strong><span>62,4 km</span></div><div className="placeholder-row"><strong>Custo operacional</strong><span>R$ 1.024,30</span></div></div></article></section></>;
}

export function ModuleHeader({ title, description }: { title: string; description: string }) {
  return <div className="page-head"><div><span className="eyebrow">Movvant V2</span><h1>{title}</h1><p>{description}</p></div><span className="status-badge">Base visual isolada · sem backend</span></div>;
}
