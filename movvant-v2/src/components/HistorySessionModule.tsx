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
  const { journeys, routes, expenses, appointments, maintenanceRecords, activityCount, clearAllActivity } = useSessionActivity();
  const sessionItems = [
    ...journeys.map((item) => ({ id:item.id, createdAt:item.createdAt, title:`Jornada concluída · ${item.client}`, detail:`${item.vehicle} · ${item.distance.toLocaleString('pt-BR')} km · ${item.visitResult}`, type:'Jornada' })),
    ...routes.map((item) => ({ id:item.id, createdAt:item.createdAt, title:`Rota concluída · ${item.destination}`, detail:`${item.origin} → ${item.destination} · ${item.vehicle} · ${item.distance.toLocaleString('pt-BR')} km`, type:'Rota' })),
    ...expenses.map((item) => ({ id:item.id, createdAt:item.createdAt, title:`Despesa lançada · ${item.category}`, detail:`${item.vehicle} · ${item.place} · R$ ${item.amount.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`, type:'Despesa' })),
    ...appointments.map((item) => ({ id:item.id, createdAt:item.completedAt||item.startedAt||item.createdAt, title:`${item.status==='Concluído'?'Visita concluída':item.status==='Em atendimento'?'Atendimento iniciado':'Compromisso criado'} · ${item.client}`, detail:`${item.title} · ${item.time} · ${item.address}${item.result?` · ${item.result}`:''}`, type:'Agenda' })),
    ...maintenanceRecords.map((item) => ({ id:item.id, createdAt:item.completedAt||item.createdAt, title:`${item.status==='Concluída'?'Revisão concluída':'Revisão agendada'} · ${item.vehicle}`, detail:item.status==='Concluída'?`${item.plate} · ${item.workshop} · ${item.serviceKm?.toLocaleString('pt-BR')} km · próxima ${item.nextMaintenanceKm?.toLocaleString('pt-BR')} km`: `${item.plate} · ${item.workshop} · ${new Date(`${item.scheduledDate}T12:00:00`).toLocaleDateString('pt-BR')} · referência ${item.scheduledKm.toLocaleString('pt-BR')} km`, type:'Manutenção' }))
  ].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));

  return <section className="panel"><div className="panel-title-row"><div><h2>Linha do tempo operacional</h2>{activityCount?<span className="session-chip">{activityCount} registro(s) desta sessão</span>:null}</div><div className="row-actions"><PrototypeActionButton className="secondary-button" title="Filtrar histórico" description="Abrirá período, usuário, veículo, cidade e tipo de atividade para refinar a linha do tempo.">Filtrar período</PrototypeActionButton>{activityCount?<button className="secondary-button" type="button" onClick={clearAllActivity}>Limpar sessão</button>:null}</div></div><div className="timeline-list">{sessionItems.map((item)=>{const time=new Date(item.createdAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});return <div className="timeline-entry session-row" key={item.id}><span className="timeline-date">Hoje · {time}</span><i className="timeline-dot"/><div className="timeline-content"><strong>{item.title}</strong><span>{item.detail}</span><div className="history-session-tags"><em className="session-chip">{item.type}</em><em className="session-chip">Somente nesta sessão</em></div></div></div>;})}{baseItems.map(([date,title,detail])=><div className="timeline-entry" key={`${date}-${title}`}><span className="timeline-date">{date}</span><i className="timeline-dot"/><div className="timeline-content"><strong>{title}</strong><span>{detail}</span></div></div>)}</div></section>;
}
