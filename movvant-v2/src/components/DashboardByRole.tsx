'use client';

import Link from 'next/link';
import { useSessionActivity } from '@/components/SessionActivityProvider';

export function DashboardByRole(){
  const {journeys,routes,expenses,appointments,completedAppointments,totalKm,totalExpenses,activityCount,maintenancePendingCount,maintenanceAlerts,documentPendingCount}=useSessionActivity();
  const sessionRoutes=journeys.length+routes.length;
  const activeAppointments=appointments.filter((a)=>a.status==='Em atendimento').length;
  const plannedAppointments=appointments.filter((a)=>a.status==='Planejado').length;
  const sales=appointments.filter((a)=>a.status==='Concluído'&&a.result==='Venda realizada').length;
  const conversion=completedAppointments?Math.round((sales/completedAppointments)*100):0;
  const blockedVehicles=maintenanceAlerts.filter((a)=>a.state==='vencida').length;
  const metrics:Array<[string,string,string]>=[
    ['Agenda',String(appointments.length),`${plannedAppointments} planejado(s) · ${activeAppointments} em atendimento`],
    ['Visitas concluídas',String(completedAppointments),`${sales} venda(s) registrada(s)`],
    ['Rotas / jornadas',String(sessionRoutes),`${totalKm.toLocaleString('pt-BR')} km registrados`],
    ['Despesas',`R$ ${totalExpenses.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`,`${expenses.length} lançamento(s)`],
    ['Conversão',`${conversion}%`,'sobre visitas concluídas nesta sessão'],
    ['Pendências operacionais',String(maintenancePendingCount+documentPendingCount),'manutenção e documentos']
  ];
  return <>
    <section className="panel role-preview-bar"><div><span className="eyebrow">MOVVANT ENTERPRISE</span><strong>Visão geral da operação</strong><small>Base limpa: somente atividade registrada na sessão atual. Os indicadores históricos reais serão adicionados pela camada Enterprise autenticada.</small></div><div className="session-dashboard-actions"><Link href="/inteligencia" className="primary-button">Inteligência Comercial</Link></div></section>
    {maintenancePendingCount?<section className="panel session-dashboard-strip" aria-label="Alertas de manutenção"><div><span className="eyebrow">Manutenção preventiva</span><strong>{maintenancePendingCount} veículo(s) exigem atenção</strong><small>Alertas calculados por KM e data sobre a frota cadastrada.</small></div><div className="session-dashboard-metrics"><span><b>{blockedVehicles}</b><small>bloqueado(s) por revisão vencida</small></span><span><b>{maintenancePendingCount-blockedVehicles}</b><small>revisão próxima</small></span></div><div className="session-dashboard-actions"><Link href="/pendencias" className="secondary-button">Ver pendências</Link><Link href="/veiculos" className="secondary-button">Ver frota</Link></div></section>:null}
    {activityCount?<section className="panel session-dashboard-strip" aria-label="Indicadores da sessão"><div><span className="eyebrow">Atividade atual</span><strong>{activityCount} evento(s) consolidado(s)</strong><small>Agenda, Modo Campo, Rotas, Custos e Frota alimentam este resumo.</small></div><div className="session-dashboard-actions"><Link href="/agenda" className="secondary-button">Ver agenda</Link><Link href="/historico" className="secondary-button">Ver histórico</Link><Link href="/relatorios" className="secondary-button">Ver relatório</Link></div></section>:null}
    <section className="dashboard-grid" aria-label="Indicadores atuais">{metrics.map(([label,value,note])=><article className="metric-card" key={label}><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><div className="metric-note">{note}</div></article>)}</section>
    <section className="main-grid"><article className="panel"><div className="panel-title-row"><h2>Próximas atividades</h2><Link href="/agenda" className="text-link">Abrir Agenda</Link></div>{appointments.length?<div className="placeholder-list">{appointments.slice(0,5).map(item=><div className="placeholder-row" key={item.id}><strong>{item.time} · {item.client}</strong><span>{item.title} · {item.status}</span></div>)}</div>:<div className="soft-box"><strong>Sem compromissos cadastrados</strong><span>A Agenda está limpa e pronta para receber dados reais.</span></div>}</article><article className="panel"><div className="panel-title-row"><h2>Atenção operacional</h2><Link href="/pendencias" className="text-link">Ver pendências</Link></div>{maintenancePendingCount+documentPendingCount?<div className="placeholder-list"><div className="placeholder-row"><strong>Manutenção</strong><span>{maintenancePendingCount} pendência(s)</span></div><div className="placeholder-row"><strong>Documentos</strong><span>{documentPendingCount} pendência(s)</span></div></div>:<div className="soft-box"><strong>Sem alertas cadastrados</strong><span>Nenhum dado fictício é exibido nesta base.</span></div>}</article></section>
    <section className="dashboard-field-strip panel"><div><span className="eyebrow">Atalho operacional</span><h2>Modo Campo</h2><p>Fluxo simplificado para trabalhar pelo celular com poucos toques.</p></div><Link href="/campo" className="primary-button">Abrir Modo Campo</Link></section>
  </>;
}
