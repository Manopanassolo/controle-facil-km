'use client';

import Link from 'next/link';
import { PrototypeActionButton } from '@/components/PrototypeActionButton';
import { useSessionActivity } from '@/components/SessionActivityProvider';

const baseItems=[
  {priority:'Crítica',title:'CNH próxima do vencimento',owner:'Marcos Paulo',due:'18/09/2026',action:'Atualizar documento',detail:'Abrirá o cadastro do documento correspondente para substituir validade e arquivo, mantendo histórico da alteração.'},
  {priority:'Alta',title:'Despesa sem comprovante',owner:'Rafael Silva',due:'Hoje',action:'Revisar lançamento',detail:'Abrirá o lançamento para anexar comprovante, revisar os campos e concluir a pendência somente após validação.'},
  {priority:'Média',title:'Visita sem resultado registrado',owner:'Ana Costa',due:'Ontem',action:'Completar visita',detail:'Abrirá a visita para registrar resultado, observações, próximos passos e eventual novo compromisso.'}
];
function formatDate(date:string){const [y,m,d]=date.split('-');return `${d}/${m}/${y}`;}

export function PendingSessionModule(){
  const {maintenanceAlerts,maintenancePendingCount,maintenanceRecords}=useSessionActivity();
  const alerts=maintenanceAlerts.filter((alert)=>alert.state!=='ok').sort((a,b)=>a.state==='vencida'?-1:b.state==='vencida'?1:a.remainingKm-b.remainingKm);
  const total=baseItems.length+alerts.length;
  return <section className="panel">
    <div className="panel-title-row"><div><span className="eyebrow">Prioridade operacional</span><h2>O que precisa de ação</h2></div><span className="tag warning">{total} pendências</span></div>
    {alerts.length?<div className="session-banner" role="status"><strong>{maintenancePendingCount} pendência(s) de manutenção calculada(s)</strong><span>Geradas automaticamente por KM/data da frota compartilhada nesta homologação.</span></div>:null}
    <div className="pending-list">
      {alerts.map((alert)=>{const scheduled=maintenanceRecords.find((record)=>record.vehicleId===alert.vehicleId&&record.status==='Agendada');return <article className="pending-row session-row" key={alert.vehicleId}><div className={`priority-mark ${alert.state==='vencida'?'critical':'high'}`}/><div className="pending-copy"><div className="pending-title-line"><strong>{alert.state==='vencida'?'Revisão vencida':'Revisão próxima'} · {alert.vehicle}</strong><span className="tag">{alert.state==='vencida'?'Crítica':'Alta'}</span></div><span>{alert.plate} · {alert.dueKm.toLocaleString('pt-BR')} km ou {formatDate(alert.dueDate)}</span>{scheduled?<span>Agendada para {formatDate(scheduled.scheduledDate)} · {scheduled.workshop}</span>:<span>{alert.state==='vencida'?'Veículo indisponível para novas rotas':`${Math.max(0,alert.remainingKm).toLocaleString('pt-BR')} km restantes · ${Math.max(0,alert.remainingDays)} dia(s)`}</span>}</div><Link href="/veiculos" className="secondary-button">{scheduled?'Concluir revisão':'Agendar revisão'}</Link></article>;})}
      {baseItems.map((item)=><article className="pending-row" key={item.title}><div className={`priority-mark ${item.priority==='Crítica'?'critical':item.priority==='Alta'?'high':'medium'}`}/><div className="pending-copy"><div className="pending-title-line"><strong>{item.title}</strong><span className="tag">{item.priority}</span></div><span>{item.owner} · prazo {item.due}</span></div><PrototypeActionButton className="secondary-button" title={item.action} description={item.detail}>{item.action}</PrototypeActionButton></article>)}
    </div>
    <div className="soft-box"><strong>Regra da V2</strong><span>Manutenção vencida bloqueia novas rotas; agendamento mantém a pendência visível até a conclusão; ao concluir, novos limites são definidos e o veículo é reavaliado automaticamente.</span></div>
  </section>;
}
