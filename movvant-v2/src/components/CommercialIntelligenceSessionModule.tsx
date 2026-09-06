'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSessionActivity } from '@/components/SessionActivityProvider';

const money=(v:number)=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});

export function CommercialIntelligenceSessionModule(){
 const{appointments,routes,journeys,totalKm,totalExpenses,completedAppointments}=useSessionActivity();
 const planned=appointments.filter(a=>a.status==='Planejado').length;
 const inService=appointments.filter(a=>a.status==='Em atendimento').length;
 const conversionBase=completedAppointments;
 const sales=appointments.filter(a=>a.status==='Concluído'&&a.result==='Venda realizada').length;
 const conversion=conversionBase?Math.round((sales/conversionBase)*100):0;
 const routeCount=routes.length+journeys.length;
 const alerts=useMemo(()=>{
   const list:{title:string;detail:string;tone:'attention'|'success'|'neutral'}[]=[];
   if(planned>0)list.push({title:'Visitas aguardando execução',detail:`${planned} compromisso(s) planejado(s) ainda não iniciado(s).`,tone:'attention'});
   if(inService>0)list.push({title:'Atendimentos em andamento',detail:`${inService} atendimento(s) precisam ser finalizados para consolidar resultado.`,tone:'attention'});
   if(conversionBase>0)list.push({title:'Conversão das visitas concluídas',detail:`${sales} venda(s) em ${conversionBase} visita(s) concluída(s) · ${conversion}%.`,tone:conversion>=50?'success':'neutral'});
   if(routeCount>0&&totalKm>0)list.push({title:'Eficiência de campo disponível',detail:`${routeCount} deslocamento(s), ${totalKm.toFixed(1)} km e ${money(totalExpenses)} em despesas registradas na sessão.`,tone:'neutral'});
   return list;
 },[planned,inService,conversionBase,sales,conversion,routeCount,totalKm,totalExpenses]);
 return <div style={{display:'grid',gap:18}}>
   <section className="panel"><div className="panel-title-row"><div><span className="eyebrow">INTELIGÊNCIA COMERCIAL</span><h2>Central de decisão</h2><p style={{marginTop:6,color:'var(--muted,#64748b)'}}>Esta tela usa somente atividade real da sessão atual. Dados demonstrativos foram removidos. A camada histórica Enterprise será conectada aqui sem substituir os módulos operacionais.</p></div><div className="row-actions"><Link className="secondary-button" href="/agenda">Abrir Agenda</Link><Link className="primary-button" href="/roteiros">Abrir Rotas</Link></div></div></section>
   <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:12}}>
     <article className="panel"><span className="eyebrow">VISITAS</span><h2>{appointments.length}</h2><span>{completedAppointments} concluída(s)</span></article>
     <article className="panel"><span className="eyebrow">CONVERSÃO</span><h2>{conversion}%</h2><span>{sales} venda(s) registrada(s)</span></article>
     <article className="panel"><span className="eyebrow">DESLOCAMENTOS</span><h2>{routeCount}</h2><span>{totalKm.toFixed(1)} km</span></article>
     <article className="panel"><span className="eyebrow">DESPESAS</span><h2>{money(totalExpenses)}</h2><span>atividade da sessão</span></article>
   </section>
   <section className="panel"><div className="panel-title-row"><div><span className="eyebrow">PRIORIDADES</span><h2>O que fazer agora</h2></div></div>{alerts.length?<div style={{display:'grid',gap:10,marginTop:12}}>{alerts.map(item=><div key={item.title} className="soft-box"><strong>{item.title}</strong><span>{item.detail}</span></div>)}</div>:<div className="soft-box" style={{marginTop:12}}><strong>Sem atividade suficiente para gerar prioridade</strong><span>Crie ou execute compromissos reais na Agenda. A Inteligência passará a consolidar automaticamente visitas, rotas, KM e resultados.</span></div>}</section>
   <section className="panel"><div className="panel-title-row"><div><span className="eyebrow">CAMADA ENTERPRISE</span><h2>Histórico comercial Jan–Ago/2026</h2></div></div><div className="soft-box" style={{marginTop:12}}><strong>Base real preservada para conexão</strong><span>KPIs, oportunidades, carteira em risco e perda de mix serão exibidos aqui pela sessão autenticada do Movvant Enterprise. Esta base Web completa não exibirá dados fictícios enquanto a autenticação e os filtros reais estiverem sendo transplantados.</span></div></section>
 </div>;
}
