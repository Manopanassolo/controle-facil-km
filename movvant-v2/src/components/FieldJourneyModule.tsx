'use client';

import { useState } from 'react';
import { PrototypeFormDialog, PrototypeFormValues } from '@/components/PrototypeFormDialog';
import { useSessionActivity } from '@/components/SessionActivityProvider';
import { useDriverSession } from '@/components/DriverSessionProvider';

type Step='idle'|'route'|'arrived'|'visited'|'expense'|'done';
type Journey={vehicle?:string;driver?:string;kmStart?:number;client?:string;arrivalNote?:string;visitResult?:string;expense?:string;expenseAmount?:number;kmEnd?:number;};
function text(values:PrototypeFormValues,key:string){const current=values[key];return Array.isArray(current)?current.join(' · '):current||'';}
const steps=[['01','Iniciar rota'],['02','Cheguei ao cliente'],['03','Registrar visita'],['04','Lançar despesa'],['05','Encerrar rota']] as const;

export function FieldJourneyModule(){
 const[step,setStep]=useState<Step>('idle');const[journey,setJourney]=useState<Journey>({});
 const{journeys,addJourney,vehicleOptions,getVehicleKm,updateVehicleKm}=useSessionActivity();const{driverOptions}=useDriverSession();
 const index=step==='idle'?0:step==='route'?1:step==='arrived'?2:step==='visited'?3:step==='expense'?4:5;
 function start(values:PrototypeFormValues){const vehicle=text(values,'veiculo');const knownKm=getVehicleKm(vehicle);const informedKm=Number(text(values,'kmInicial'))||knownKm;setJourney({vehicle,driver:text(values,'condutor'),kmStart:Math.max(knownKm,informedKm)});setStep('route');}
 function arrive(values:PrototypeFormValues){setJourney((current)=>({...current,client:text(values,'cliente'),arrivalNote:text(values,'observacao')}));setStep('arrived');}
 function visit(values:PrototypeFormValues){setJourney((current)=>({...current,visitResult:`${text(values,'resultado')} · ${text(values,'proximoPasso')}`}));setStep('visited');}
 function expense(values:PrototypeFormValues){const amount=Number(text(values,'valor').replace(',','.'))||0;setJourney((current)=>({...current,expenseAmount:amount,expense:`${text(values,'categoria')} · R$ ${amount.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`}));setStep('expense');}
 function finish(values:PrototypeFormValues){const vehicle=journey.vehicle||'Veículo não informado';const kmStart=journey.kmStart||getVehicleKm(vehicle);const informedKm=Number(text(values,'kmFinal'))||kmStart;const kmEnd=updateVehicleKm(vehicle,Math.max(kmStart,getVehicleKm(vehicle),informedKm));const distance=Math.max(0,kmEnd-kmStart);const driver=journey.driver||'Condutor não informado';addJourney({vehicle,kmStart,client:journey.client||'Atendimento externo',visitResult:`${journey.visitResult||'Sem resultado registrado'} · Condutor: ${driver}`,expense:journey.expense||'Sem despesa',expenseAmount:journey.expenseAmount||0,kmEnd,distance});setJourney((current)=>({...current,kmEnd}));setStep('done');}
 function reset(){setJourney({});setStep('idle');}
 return <section className="field-mode-layout">
  <article className="panel field-mode-hero"><span className="eyebrow">Operação guiada · celular</span><h2>{step==='done'?'Jornada concluída':'Seu dia em campo'}</h2><p>Fluxo operacional com validação individual de veículo e condutor.</p><div className="field-status"><span className={`status-dot ${step==='done'?'':'preview'}`}/><strong>{step==='idle'?'Pronto para iniciar':step==='done'?'Fluxo concluído':`Etapa ${Math.min(index+1,5)} de 5`}</strong><span>{vehicleOptions.length} veículo(s) · {driverOptions.length} condutor(es) elegível(is)</span></div></article>
  <div className="journey-progress">{steps.map(([number,title],itemIndex)=><div className={`journey-progress-step ${itemIndex<index?'complete':itemIndex===index&&step!=='done'?'current':''}`} key={number}><span>{number}</span><strong>{title}</strong></div>)}</div>
  <article className="panel journey-action-panel">
   {step==='idle'?<PrototypeFormDialog trigger="01 · Iniciar rota" title="Iniciar rota" description="CNH vencida remove apenas o condutor afetado das opções disponíveis." onValidate={start} fields={[{name:'veiculo',label:'Veículo',type:'select',required:true,options:vehicleOptions},{name:'condutor',label:'Condutor',type:'select',required:true,options:driverOptions},{name:'kmInicial',label:'KM inicial',type:'number',required:true,placeholder:'KM atual do veículo'},{name:'destino',label:'Primeiro destino',required:true,placeholder:'Cliente ou cidade'}]}/>:null}
   {step==='route'?<PrototypeFormDialog trigger="02 · Cheguei ao cliente" title="Chegada ao cliente" description="Marque a chegada e identifique o atendimento." onValidate={arrive} fields={[{name:'cliente',label:'Cliente',required:true},{name:'horario',label:'Horário de chegada',required:true,placeholder:'10:45'},{name:'observacao',label:'Observação',type:'textarea'}]}/>:null}
   {step==='arrived'?<PrototypeFormDialog trigger="03 · Registrar visita" title="Registrar visita" description="Registre resultado e próximo passo." onValidate={visit} fields={[{name:'resultado',label:'Resultado',type:'select',required:true,options:['Venda realizada','Orçamento solicitado','Follow-up','Sem interesse','Visita técnica','Outro']},{name:'proximoPasso',label:'Próximo passo',required:true},{name:'observacao',label:'Observações',type:'textarea'}]}/>:null}
   {step==='visited'?<PrototypeFormDialog trigger="04 · Lançar despesa" title="Despesa da jornada" description="Inclua um custo do atendimento." onValidate={expense} fields={[{name:'categoria',label:'Categoria',type:'select',required:true,options:['Combustível','Pedágio','Estacionamento','Alimentação','Outro']},{name:'valor',label:'Valor (R$)',type:'number',required:true},{name:'local',label:'Local'}]}/>:null}
   {step==='expense'?<PrototypeFormDialog trigger="05 · Encerrar rota" title="Encerrar rota" description="Finalize com KM final." onValidate={finish} fields={[{name:'kmFinal',label:'KM final',type:'number',required:true,placeholder:String(Math.max(journey.kmStart||0,getVehicleKm(journey.vehicle||''))+30)},{name:'resumo',label:'Resumo final',type:'textarea'}]}/>:null}
   {step==='done'?<button type="button" className="primary-button" onClick={reset}>Iniciar nova jornada local</button>:null}
   {step!=='idle'?<div className="journey-summary"><div><span>Veículo</span><strong>{journey.vehicle||'—'}</strong></div><div><span>Condutor</span><strong>{journey.driver||'—'}</strong></div><div><span>KM inicial</span><strong>{journey.kmStart?.toLocaleString('pt-BR')||'—'}</strong></div><div><span>Cliente</span><strong>{journey.client||'—'}</strong></div><div><span>Resultado</span><strong>{journey.visitResult||'—'}</strong></div><div><span>KM final</span><strong>{journey.kmEnd?.toLocaleString('pt-BR')||'—'}</strong></div></div>:null}
  </article>
  {journeys.length?<article className="panel"><div className="panel-title-row"><h2>Jornadas concluídas nesta sessão</h2><span className="session-chip">Elegibilidade aplicada</span></div>{journeys.map((item)=><div className="route-history-row" key={item.id}><div><strong>{item.client}</strong><span>{item.vehicle} · {item.visitResult}</span></div><div><strong>{item.distance.toLocaleString('pt-BR')} km</strong></div></div>)}</article>:null}
 </section>;
}
