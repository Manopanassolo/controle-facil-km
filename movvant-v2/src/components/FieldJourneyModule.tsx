'use client';

import { useState } from 'react';
import { PrototypeFormDialog, PrototypeFormValues } from '@/components/PrototypeFormDialog';
import { useSessionActivity } from '@/components/SessionActivityProvider';

type Step = 'idle' | 'route' | 'arrived' | 'visited' | 'expense' | 'done';
type Journey = { vehicle?: string; kmStart?: number; client?: string; arrivalNote?: string; visitResult?: string; expense?: string; expenseAmount?: number; kmEnd?: number; };

function text(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

const steps = [
  ['01','Iniciar rota','Saída, veículo e KM inicial.'],
  ['02','Cheguei ao cliente','Registrar chegada e cliente.'],
  ['03','Registrar visita','Resultado e próximos passos.'],
  ['04','Lançar despesa','Custo ocorrido durante o atendimento.'],
  ['05','Encerrar rota','KM final e resumo do dia.']
] as const;

export function FieldJourneyModule() {
  const [step, setStep] = useState<Step>('idle');
  const [journey, setJourney] = useState<Journey>({});
  const { journeys, addJourney, vehicleOptions, getVehicleKm, updateVehicleKm } = useSessionActivity();
  const index = step === 'idle' ? 0 : step === 'route' ? 1 : step === 'arrived' ? 2 : step === 'visited' ? 3 : step === 'expense' ? 4 : 5;

  function start(values: PrototypeFormValues) {
    const vehicle=text(values,'veiculo');
    const knownKm=getVehicleKm(vehicle);
    const informedKm=Number(text(values,'kmInicial'))||knownKm;
    setJourney({ vehicle, kmStart:Math.max(knownKm,informedKm) });
    setStep('route');
  }
  function arrive(values: PrototypeFormValues) { setJourney((current)=>({...current,client:text(values,'cliente'),arrivalNote:text(values,'observacao')})); setStep('arrived'); }
  function visit(values: PrototypeFormValues) { setJourney((current)=>({...current,visitResult:`${text(values,'resultado')} · ${text(values,'proximoPasso')}`})); setStep('visited'); }
  function expense(values: PrototypeFormValues) { const amount=Number(text(values,'valor').replace(',','.'))||0; setJourney((current)=>({...current,expenseAmount:amount,expense:`${text(values,'categoria')} · R$ ${amount.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`})); setStep('expense'); }
  function finish(values: PrototypeFormValues) {
    const vehicle=journey.vehicle||'Veículo não informado';
    const kmStart=journey.kmStart||getVehicleKm(vehicle);
    const informedKm=Number(text(values,'kmFinal'))||kmStart;
    const kmEnd=updateVehicleKm(vehicle,Math.max(kmStart,getVehicleKm(vehicle),informedKm));
    const distance=Math.max(0,kmEnd-kmStart);
    const finished={...journey,kmEnd};
    addJourney({ vehicle, kmStart, client:journey.client||'Atendimento externo', visitResult:journey.visitResult||'Sem resultado registrado', expense:journey.expense||'Sem despesa', expenseAmount:journey.expenseAmount||0, kmEnd, distance });
    setJourney(finished); setStep('done');
  }
  function reset(){ setJourney({}); setStep('idle'); }

  return <section className="field-mode-layout">
    <article className="panel field-mode-hero"><span className="eyebrow">Operação guiada · celular</span><h2>{step==='done'?'Jornada concluída':'Seu dia em campo'}</h2><p>Homologue a sequência completa de trabalho sem sair desta tela e sem gravar dados no backend.</p><div className="field-status"><span className={`status-dot ${step==='done'?'':'preview'}`} /><strong>{step==='idle'?'Pronto para iniciar':step==='done'?'Fluxo concluído':`Etapa ${Math.min(index+1,5)} de 5`}</strong><span>{vehicleOptions.length} veículo(s) operacional(is) · KM compartilhado</span></div></article>
    <div className="journey-progress" aria-label="Progresso da jornada">{steps.map(([number,title],itemIndex)=><div className={`journey-progress-step ${itemIndex<index?'complete':itemIndex===index&&step!=='done'?'current':''}`} key={number}><span>{number}</span><strong>{title}</strong></div>)}</div>
    <article className="panel journey-action-panel">
      {step==='idle'?<PrototypeFormDialog trigger="01 · Iniciar rota" title="Iniciar rota" description="Selecione um veículo da frota compartilhada. O KM inicial nunca poderá ficar abaixo do KM atual conhecido." onValidate={start} fields={[{name:'veiculo',label:'Veículo',type:'select',required:true,options:vehicleOptions},{name:'kmInicial',label:'KM inicial',type:'number',required:true,placeholder:'KM atual do veículo'},{name:'destino',label:'Primeiro destino',required:true,placeholder:'Cliente ou cidade'}]} />:null}
      {step==='route'?<PrototypeFormDialog trigger="02 · Cheguei ao cliente" title="Chegada ao cliente" description="Marque a chegada e identifique o atendimento." onValidate={arrive} fields={[{name:'cliente',label:'Cliente',required:true,placeholder:'Nome do cliente'},{name:'horario',label:'Horário de chegada',required:true,placeholder:'10:45'},{name:'observacao',label:'Observação',type:'textarea',placeholder:'Contato, recepção ou detalhe da chegada'}]} />:null}
      {step==='arrived'?<PrototypeFormDialog trigger="03 · Registrar visita" title="Registrar visita" description="Registre o resultado comercial e o próximo passo." onValidate={visit} fields={[{name:'resultado',label:'Resultado',type:'select',required:true,options:['Venda realizada','Orçamento solicitado','Follow-up','Sem interesse','Visita técnica','Outro']},{name:'proximoPasso',label:'Próximo passo',required:true,placeholder:'Ex.: enviar orçamento amanhã'},{name:'observacao',label:'Observações da visita',type:'textarea',placeholder:'Assuntos tratados e informações relevantes'}]} />:null}
      {step==='visited'?<PrototypeFormDialog trigger="04 · Lançar despesa" title="Despesa da jornada" description="Inclua um custo da visita ou deslocamento." onValidate={expense} fields={[{name:'categoria',label:'Categoria',type:'select',required:true,options:['Combustível','Pedágio','Estacionamento','Alimentação','Outro']},{name:'valor',label:'Valor (R$)',type:'number',required:true,placeholder:'0,00'},{name:'local',label:'Local',placeholder:'Estabelecimento ou cidade'}]} />:null}
      {step==='expense'?<PrototypeFormDialog trigger="05 · Encerrar rota" title="Encerrar rota" description="O KM final atualizará imediatamente a frota compartilhada e não poderá reduzir o valor atual conhecido." onValidate={finish} fields={[{name:'kmFinal',label:'KM final',type:'number',required:true,placeholder:String(Math.max(journey.kmStart||0,getVehicleKm(journey.vehicle||''))+30)},{name:'resumo',label:'Resumo final',type:'textarea',placeholder:'Ocorrências ou observações do retorno'}]} />:null}
      {step==='done'?<button type="button" className="primary-button" onClick={reset}>Iniciar nova jornada local</button>:null}
      {step!=='idle'?<div className="journey-summary"><div><span>Veículo</span><strong>{journey.vehicle||'—'}</strong></div><div><span>KM inicial</span><strong>{journey.kmStart?.toLocaleString('pt-BR')||'—'}</strong></div><div><span>Cliente</span><strong>{journey.client||'—'}</strong></div><div><span>Resultado</span><strong>{journey.visitResult||'—'}</strong></div><div><span>Despesa</span><strong>{journey.expense||'—'}</strong></div><div><span>KM final</span><strong>{journey.kmEnd?.toLocaleString('pt-BR')||'—'}</strong></div></div>:null}
    </article>
    {journeys.length?<article className="panel"><div className="panel-title-row"><h2>Jornadas concluídas nesta sessão</h2><span className="session-chip">KM refletido na frota</span></div>{journeys.map((item)=><div className="route-history-row" key={item.id}><div><strong>{item.client}</strong><span>{item.vehicle} · {item.visitResult}</span></div><div><strong>{item.distance.toLocaleString('pt-BR')} km</strong><span>{item.kmStart.toLocaleString('pt-BR')} → {item.kmEnd.toLocaleString('pt-BR')}</span></div></div>)}</article>:null}
    <article className="panel offline-card"><div><span className="eyebrow">Preparação futura</span><h2>Modo offline</h2><p>Depois da homologação, esta mesma sequência poderá usar armazenamento local e fila de sincronização sem duplicar registros.</p></div><span className="tag warning">Ainda não conectado</span></article>
  </section>;
}
