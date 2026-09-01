'use client';

import { PrototypeActionButton } from './PrototypeActionButton';
import { useSessionActivity } from './SessionActivityProvider';

const baseItems = [
  ['01/09 · 10:52', 'Visita concluída · Casa do MDF', 'Itajaí → Balneário Camboriú · 14,8 km'],
  ['31/08 · 16:18', 'Retorno comercial', 'Camboriú → Itajaí · 18,2 km'],
  ['31/08 · 11:06', 'Prospecção regional', 'Itajaí → Navegantes · 22,4 km'],
  ['30/08 · 14:31', 'Reunião externa', 'Itajaí → Brusque · 45,7 km']
];

export function HistorySessionModule() {
  const { journeys, clearJourneys } = useSessionActivity();

  return <section className="panel"><div className="panel-title-row"><div><h2>Linha do tempo de campo</h2>{journeys.length ? <span className="session-chip">{journeys.length} registro(s) desta sessão</span> : null}</div><div className="row-actions"><PrototypeActionButton className="secondary-button" title="Filtrar histórico" description="Abrirá período, usuário, veículo, cidade e tipo de atividade para refinar a linha do tempo.">Filtrar período</PrototypeActionButton>{journeys.length ? <button className="secondary-button" type="button" onClick={clearJourneys}>Limpar sessão</button> : null}</div></div><div className="timeline-list">{journeys.map((item) => { const time = new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); return <div className="timeline-entry session-row" key={item.id}><span className="timeline-date">Hoje · {time}</span><i className="timeline-dot"/><div className="timeline-content"><strong>Jornada concluída · {item.client}</strong><span>{item.vehicle} · {item.distance.toLocaleString('pt-BR')} km · {item.visitResult}</span><em className="session-chip">Somente nesta sessão</em></div></div>; })}{baseItems.map(([date,title,detail]) => <div className="timeline-entry" key={`${date}-${title}`}><span className="timeline-date">{date}</span><i className="timeline-dot"/><div className="timeline-content"><strong>{title}</strong><span>{detail}</span></div></div>)}</div></section>;
}
