'use client';

import { useState } from 'react';
import { PrototypeFormDialog, PrototypeFormValues } from '@/components/PrototypeFormDialog';
import { useSessionActivity } from '@/components/SessionActivityProvider';

type RouteRecord = {
  origin: string;
  destination: string;
  vehicle: string;
  purpose: string;
  kmStart: number;
  kmEnd?: number;
  status: 'Em andamento' | 'Concluída';
};

function text(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

export function RouteSessionModule() {
  const [active, setActive] = useState<RouteRecord | null>(null);
  const [history, setHistory] = useState<RouteRecord[]>([]);
  const { routes, addRoute, vehicleOptions, getVehicleKm, updateVehicleKm } = useSessionActivity();

  function startRoute(values: PrototypeFormValues) {
    const vehicle = text(values, 'veiculo');
    const knownKm = getVehicleKm(vehicle);
    const informedKm = Number(text(values, 'kmInicial')) || knownKm;
    setActive({
      origin: text(values, 'origem'),
      destination: text(values, 'destino'),
      vehicle,
      purpose: text(values, 'finalidade'),
      kmStart: Math.max(knownKm, informedKm),
      status: 'Em andamento'
    });
  }

  function finishRoute(values: PrototypeFormValues) {
    if (!active) return;
    const knownKm = getVehicleKm(active.vehicle);
    const informedKm = Number(text(values, 'kmFinal')) || active.kmStart;
    const kmEnd = updateVehicleKm(active.vehicle, Math.max(active.kmStart, knownKm, informedKm));
    const distance = Math.max(0, kmEnd - active.kmStart);
    const completed = { ...active, kmEnd, status: 'Concluída' as const };
    setHistory((current) => [completed, ...current]);
    addRoute({ origin: active.origin, destination: active.destination, vehicle: active.vehicle, purpose: active.purpose, kmStart: active.kmStart, kmEnd, distance });
    setActive(null);
  }

  const travelled = active ? null : history[0]?.kmEnd != null ? Math.max(0, history[0].kmEnd! - history[0].kmStart) : null;

  return <section className="route-session-layout">
    <article className="panel route-session-control">
      <div className="panel-title-row"><div><span className="eyebrow">Homologação operacional</span><h2>{active ? 'Rota em andamento' : 'Controle de deslocamento'}</h2></div><span className={`tag ${active ? 'warning' : 'success'}`}>{active ? 'Em andamento' : 'Pronto'}</span></div>
      <div className="session-banner compact"><strong>{vehicleOptions.length} veículo(s) operacional(is)</strong><span>KM compartilhado com a frota · valores nunca retrocedem.</span></div>
      {active ? <div className="route-live-card"><div><span>Origem</span><strong>{active.origin}</strong></div><div><span>Destino</span><strong>{active.destination}</strong></div><div><span>Veículo</span><strong>{active.vehicle}</strong></div><div><span>KM inicial</span><strong>{active.kmStart.toLocaleString('pt-BR')} km</strong></div><div className="route-live-wide"><span>Finalidade</span><strong>{active.purpose}</strong></div></div> : <div className="soft-box"><strong>Nenhuma rota ativa</strong><span>Inicie um deslocamento para homologar KM inicial, execução e encerramento.</span></div>}
      <div className="route-session-actions">{!active ? <PrototypeFormDialog trigger="Iniciar rota" title="Iniciar rota" description="Selecione um veículo da frota compartilhada. Se o KM informado for menor que o KM atual conhecido, a V2 preserva automaticamente o maior valor." onValidate={startRoute} fields={[
        {name:'origem',label:'Origem',required:true,placeholder:'Itajaí, SC'},
        {name:'destino',label:'Destino',required:true,placeholder:'Balneário Camboriú, SC'},
        {name:'veiculo',label:'Veículo',type:'select',required:true,options:vehicleOptions},
        {name:'finalidade',label:'Finalidade',type:'select',required:true,options:['Visita comercial','Prospecção','Reunião externa','Entrega','Outro']},
        {name:'kmInicial',label:'KM inicial',type:'number',required:true,placeholder:'KM atual do veículo'},
        {name:'observacao',label:'Observação',type:'textarea',placeholder:'Informação relevante antes da saída'}
      ]} /> : <PrototypeFormDialog trigger="Encerrar rota" title="Encerrar rota" description="O KM final atualizará imediatamente a frota compartilhada. Valores menores que o KM atual são ignorados para impedir regressão." onValidate={finishRoute} fields={[
        {name:'kmFinal',label:'KM final',type:'number',required:true,placeholder:String(Math.max(active.kmStart,getVehicleKm(active.vehicle))+30)},
        {name:'retorno',label:'Situação do retorno',type:'select',required:true,options:['Retornei à origem','Encerrei em outro local']},
        {name:'observacao',label:'Resumo do deslocamento',type:'textarea',placeholder:'Ocorrências, desvios ou observações'}
      ]} />}</div>
    </article>
    <article className="panel map-panel"><div className="map-toolbar"><strong>Mapa da rota</strong><span>Mapa real será conectado depois</span></div><div className="mock-map" aria-label="Representação visual do mapa da rota em homologação"><div className="road road-a" /><div className="road road-b" /><div className="road road-c" /><div className="route-line outbound" /><div className="route-line return" /><span className="map-pin start">A</span><span className="map-pin end">B</span><div className="map-legend"><span><i className="legend-blue" />Ida</span><span><i className="legend-orange" />Retorno</span></div></div></article>
    <article className="panel route-session-history"><div className="panel-title-row"><h2>Rotas encerradas nesta sessão</h2><span className="session-chip">{routes.length} compartilhada(s)</span></div>{history.length ? history.map((route,index) => { const distance=Math.max(0,(route.kmEnd||route.kmStart)-route.kmStart); return <div className="route-history-row" key={`${route.origin}-${route.destination}-${index}`}><div><strong>{route.origin} → {route.destination}</strong><span>{route.vehicle} · {route.purpose}</span></div><div><strong>{distance.toLocaleString('pt-BR')} km</strong><span>{route.kmStart.toLocaleString('pt-BR')} → {route.kmEnd?.toLocaleString('pt-BR')}</span></div></div>; }) : <div className="soft-box"><strong>Sem rotas encerradas</strong><span>Ao encerrar uma rota, o resumo aparece aqui e o KM final passa para a frota compartilhada.</span></div>}{travelled != null ? <div className="session-banner compact"><strong>Última distância: {travelled.toLocaleString('pt-BR')} km</strong><span>Calculada pelo KM inicial e final</span></div> : null}</article>
  </section>;
}
