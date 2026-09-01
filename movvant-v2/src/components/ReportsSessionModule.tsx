'use client';

import { useMemo, useState } from 'react';
import { useSessionActivity } from './SessionActivityProvider';
import { useIncidentSession } from './IncidentSessionProvider';
import { useDriverSession } from './DriverSessionProvider';

type ReportType='Todos'|'Jornada'|'Rota'|'Despesa'|'Agenda'|'Manutenção'|'Sinistro';
type Row={id:string;createdAt:string;type:Exclude<ReportType,'Todos'>;vehicle:string;description:string;km:number;amount:number;status:string;};
function isoDate(value:string){return value?value.slice(0,10):'';}
function money(value:number){return value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function csvCell(value:string|number){return `"${String(value).replaceAll('"','""')}"`;}

export function ReportsSessionModule(){
 const{journeys,routes,expenses,appointments,maintenanceRecords,maintenanceAlerts,documentAlerts,totalKm,totalExpenses}=useSessionActivity();
 const{incidents}=useIncidentSession();
 const{drivers}=useDriverSession();
 const[type,setType]=useState<ReportType>('Todos');const[vehicle,setVehicle]=useState('Todos');const[from,setFrom]=useState('');const[to,setTo]=useState('');
 const rows=useMemo<Row[]>(()=>[
  ...journeys.map(x=>({id:x.id,createdAt:x.createdAt,type:'Jornada' as const,vehicle:x.vehicle,description:`${x.client} · ${x.visitResult}`,km:x.distance,amount:x.expenseAmount,status:'Concluída'})),
  ...routes.map(x=>({id:x.id,createdAt:x.createdAt,type:'Rota' as const,vehicle:x.vehicle,description:`${x.origin} → ${x.destination} · ${x.purpose}`,km:x.distance,amount:0,status:'Concluída'})),
  ...expenses.map(x=>({id:x.id,createdAt:x.createdAt,type:'Despesa' as const,vehicle:x.vehicle,description:`${x.category} · ${x.place}`,km:0,amount:x.amount,status:'Lançada'})),
  ...appointments.map(x=>({id:x.id,createdAt:x.completedAt||x.startedAt||x.createdAt,type:'Agenda' as const,vehicle:'—',description:`${x.client} · ${x.title}`,km:0,amount:0,status:x.status})),
  ...maintenanceRecords.map(x=>({id:x.id,createdAt:x.completedAt||x.createdAt,type:'Manutenção' as const,vehicle:x.vehicle,description:`${x.workshop} · ${x.status}`,km:0,amount:0,status:x.status})),
  ...incidents.map(x=>({id:x.id,createdAt:x.resolvedAt||x.createdAt,type:'Sinistro' as const,vehicle:x.vehicle,description:`${x.description} · ${x.driver}`,km:0,amount:0,status:x.status}))
 ].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),[journeys,routes,expenses,appointments,maintenanceRecords,incidents]);
 const vehicles=useMemo(()=>['Todos',...Array.from(new Set(rows.map(x=>x.vehicle).filter(x=>x&&x!=='—'))).sort()],[rows]);
 const filtered=useMemo(()=>rows.filter(row=>(type==='Todos'||row.type===type)&&(vehicle==='Todos'||row.vehicle===vehicle)&&(!from||isoDate(row.createdAt)>=from)&&(!to||isoDate(row.createdAt)<=to)),[rows,type,vehicle,from,to]);
 const filteredKm=filtered.reduce((sum,row)=>sum+row.km,0);const filteredAmount=filtered.reduce((sum,row)=>sum+row.amount,0);
 const pendingMaintenance=maintenanceAlerts.filter(x=>x.state!=='ok').length;const pendingDocuments=documentAlerts.filter(x=>x.state!=='ok').length;const openIncidents=incidents.filter(x=>x.status!=='Concluído').length;
 function exportCsv(){
  const header=['Data','Tipo','Veículo','Descrição','KM','Valor','Status'];
  const body=filtered.map(row=>[new Date(row.createdAt).toLocaleString('pt-BR'),row.type,row.vehicle,row.description,row.km,row.amount.toFixed(2),row.status]);
  const csv='\uFEFF'+[header,...body].map(line=>line.map(csvCell).join(';')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`movvant-relatorio-${new Date().toISOString().slice(0,10)}.csv`;anchor.click();URL.revokeObjectURL(url);
 }
 return <>
  <section className="panel"><div className="panel-title-row"><div><span className="eyebrow">Relatório funcional · sessão</span><h2>Filtros operacionais</h2></div><button type="button" className="secondary-button" onClick={exportCsv} disabled={!filtered.length}>Exportar CSV</button></div>
   <div className="prototype-form-grid"><label className="field-label">Tipo<select className="field" value={type} onChange={e=>setType(e.target.value as ReportType)}>{['Todos','Jornada','Rota','Despesa','Agenda','Manutenção','Sinistro'].map(x=><option key={x}>{x}</option>)}</select></label><label className="field-label">Veículo<select className="field" value={vehicle} onChange={e=>setVehicle(e.target.value)}>{vehicles.map(x=><option key={x}>{x}</option>)}</select></label><label className="field-label">De<input className="field" type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label className="field-label">Até<input className="field" type="date" value={to} onChange={e=>setTo(e.target.value)}/></label></div>
  </section>
  <section className="dashboard-grid"><article className="metric-card"><span className="metric-label">KM filtrado</span><strong className="metric-value">{filteredKm.toLocaleString('pt-BR')} km</strong><div className="metric-note">total sessão {totalKm.toLocaleString('pt-BR')} km</div></article><article className="metric-card"><span className="metric-label">Despesas filtradas</span><strong className="metric-value">{money(filteredAmount)}</strong><div className="metric-note">total sessão {money(totalExpenses)}</div></article><article className="metric-card"><span className="metric-label">Registros</span><strong className="metric-value">{filtered.length}</strong><div className="metric-note">{rows.length} no total</div></article><article className="metric-card"><span className="metric-label">Condutores cadastrados</span><strong className="metric-value">{drivers.length}</strong><div className="metric-note">equipe compartilhada</div></article></section>
  <section className="panel session-report-summary"><div><span className="eyebrow">Conformidade operacional</span><h2>Alertas consolidados</h2><p>Indicadores calculados a partir da mesma sessão usada por Frota, Documentos e Sinistros.</p></div><div className="session-report-metrics"><span><b>{pendingMaintenance}</b><small>manutenções em atenção</small></span><span><b>{pendingDocuments}</b><small>documentos em atenção</small></span><span><b>{openIncidents}</b><small>sinistros abertos</small></span><span><b>{appointments.filter(x=>x.status==='Concluído').length}</b><small>agenda concluída</small></span></div></section>
  <section className="panel data-panel"><div className="panel-title-row"><h2>Registros filtrados</h2><span className="session-chip">{filtered.length} resultado(s)</span></div><div className="data-table">{filtered.length?filtered.map(row=><div className="data-row session-row" key={`${row.type}-${row.id}`}><span>{new Date(row.createdAt).toLocaleDateString('pt-BR')}</span><strong>{row.type}</strong><span>{row.vehicle}</span><span>{row.description}</span><b>{row.km?`${row.km.toLocaleString('pt-BR')} km`:row.amount?money(row.amount):row.status}</b></div>):<div className="soft-box"><strong>Nenhum registro no filtro</strong><span>Ajuste período, tipo ou veículo.</span></div>}</div></section>
 </>;
}
