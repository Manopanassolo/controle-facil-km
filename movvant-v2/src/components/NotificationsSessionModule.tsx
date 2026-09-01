'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSessionActivity } from './SessionActivityProvider';
import { useIncidentSession } from './IncidentSessionProvider';
import { NotificationPreferenceKey, usePreferencesSession } from './PreferencesSessionProvider';

type NotificationItem={id:string;title:string;detail:string;type:string;category:NotificationPreferenceKey;href:string;severity:'info'|'warning'|'critical';};
function formatDate(date:string){if(!date)return 'sem data';const[y,m,d]=date.split('-');return`${d}/${m}/${y}`;}

export function NotificationsSessionModule(){
 const{maintenanceAlerts,documentAlerts,appointments,routes,journeys,expenses}=useSessionActivity();
 const{incidents}=useIncidentSession();
 const{notificationPreferences}=usePreferencesSession();
 const[readIds,setReadIds]=useState<string[]>([]);
 const allItems=useMemo<NotificationItem[]>(()=>[
  ...maintenanceAlerts.filter((a)=>a.state!=='ok').map((a)=>({id:`maintenance-${a.vehicleId}`,title:a.state==='vencida'?`Revisão vencida · ${a.vehicle}`:`Revisão próxima · ${a.vehicle}`,detail:`Limite ${a.dueKm.toLocaleString('pt-BR')} km ou ${formatDate(a.dueDate)}.`,type:'Frota',category:'fleet' as const,href:'/veiculos',severity:a.state==='vencida'?'critical' as const:'warning' as const})),
  ...documentAlerts.filter((a)=>a.state!=='ok').map((a)=>({id:`document-${a.documentId}`,title:`${a.kind} ${a.state==='vencido'?'vencido':'próximo do vencimento'} · ${a.subject}`,detail:`Validade ${formatDate(a.expiryDate)}${a.blocksOperation?' · operação correspondente bloqueada':''}.`,type:'Documentos',category:'documents' as const,href:'/documentos',severity:a.state==='vencido'?'critical' as const:'warning' as const})),
  ...incidents.map((i)=>({id:`incident-${i.id}-${i.status}`,title:`Sinistro ${i.status.toLowerCase()} · ${i.vehicle}`,detail:`${i.driver} · ${i.severity} · ${i.location}.`,type:'Sinistros',category:'incidents' as const,href:'/sinistros',severity:i.severity==='Crítica'?'critical' as const:i.status==='Concluído'?'info' as const:'warning' as const})),
  ...appointments.map((a)=>({id:`appointment-${a.id}-${a.status}`,title:`Agenda · ${a.status}`,detail:`${a.client} · ${a.title} · ${a.date} ${a.time}.`,type:'Agenda',category:'agenda' as const,href:'/agenda',severity:a.status==='Em atendimento'?'warning' as const:'info' as const})),
  ...routes.slice(0,5).map((r)=>({id:`route-${r.id}`,title:`Rota concluída · ${r.destination}`,detail:`${r.vehicle} · ${r.distance.toLocaleString('pt-BR')} km.`,type:'Campo',category:'field' as const,href:'/roteiros',severity:'info' as const})),
  ...journeys.slice(0,5).map((j)=>({id:`journey-${j.id}`,title:`Jornada concluída · ${j.client}`,detail:`${j.vehicle} · ${j.distance.toLocaleString('pt-BR')} km.`,type:'Campo',category:'field' as const,href:'/campo',severity:'info' as const})),
  ...expenses.slice(0,5).map((e)=>({id:`expense-${e.id}`,title:`Despesa registrada · ${e.category}`,detail:`${e.vehicle} · R$ ${e.amount.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}.`,type:'Financeiro',category:'finance' as const,href:'/custos',severity:'info' as const}))
 ],[maintenanceAlerts,documentAlerts,incidents,appointments,routes,journeys,expenses]);
 const items=useMemo(()=>allItems.filter(item=>notificationPreferences[item.category]),[allItems,notificationPreferences]);
 const unread=items.filter((item)=>!readIds.includes(item.id)).length;
 function markAll(){setReadIds(items.map((item)=>item.id));}
 function markOne(id:string){setReadIds((current)=>current.includes(id)?current:[...current,id]);}
 return <section className="panel"><div className="panel-title-row"><div><span className="eyebrow">Informação operacional</span><h2>Central de notificações</h2><span>{unread} não lida(s) · {items.length} visível(is) nesta sessão</span></div><button type="button" className="secondary-button" onClick={markAll} disabled={!unread}>Marcar todas como lidas</button></div>
  <div className="soft-box"><strong>Diferença importante</strong><span>Notificação informa um evento. Pendência aparece somente quando existe ação, responsável e prazo. Preferências de Configurações filtram apenas esta Central.</span></div>
  <div className="notification-list">{items.length?items.map((item)=>{const read=readIds.includes(item.id);return <div className={`notification-row ${read?'':'session-row'}`} key={item.id}><div className="notification-copy"><strong>{item.title}</strong><span>{item.detail}</span>{!read?<em className="session-chip">Não lida</em>:null}</div><div className="row-actions"><span className={`tag ${item.severity==='critical'||item.severity==='warning'?'warning':''}`}>{item.type}</span><Link href={item.href} className="secondary-button" onClick={()=>markOne(item.id)}>Abrir</Link></div></div>; }):<div className="soft-box"><strong>Sem notificações visíveis</strong><span>Não há eventos nas categorias habilitadas. Revise Configurações se desejar reativar categorias.</span></div>}</div>
 </section>;
}
