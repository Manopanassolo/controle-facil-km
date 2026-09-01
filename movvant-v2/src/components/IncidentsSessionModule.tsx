'use client';

import { useState } from 'react';
import { PrototypeFormDialog, PrototypeFormValues } from './PrototypeFormDialog';

type Incident = { date: string; title: string; detail: string; status: string; session?: boolean };

const initialItems: Incident[] = [
  { date: '18/08/2026', title: 'Pequena avaria em estacionamento', detail: 'SUV Comercial · análise concluída', status: 'Concluído' },
  { date: '04/07/2026', title: 'Trinca em para-brisa', detail: 'Hatch Vendas · aguardando nota', status: 'Pendente' }
];

function text(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

export function IncidentsSessionModule() {
  const [sessionItems, setSessionItems] = useState<Incident[]>([]);
  const items = [...sessionItems, ...initialItems];

  function addIncident(values: PrototypeFormValues) {
    const rawDate = text(values, 'data');
    const date = rawDate ? rawDate.split('-').reverse().join('/') : 'Hoje';
    setSessionItems((current) => [{
      date,
      title: text(values, 'descricao'),
      detail: [text(values, 'veiculo'), text(values, 'condutor'), text(values, 'local')].filter(Boolean).join(' · '),
      status: 'Pendente',
      session: true
    }, ...current]);
  }

  return <section className="panel">
    <div className="panel-title-row"><h2>Ocorrências</h2><PrototypeFormDialog trigger="+ Registrar sinistro" title="Registrar sinistro" description="Valide os dados essenciais da ocorrência antes de conectarmos fotos, arquivos e persistência." onValidate={addIncident} fields={[
      {name:'veiculo',label:'Veículo',type:'select',required:true,options:['SUV Comercial','Hatch Vendas','Utilitário']},
      {name:'condutor',label:'Condutor',required:true,placeholder:'Nome do condutor'},
      {name:'data',label:'Data',type:'date',required:true},
      {name:'local',label:'Local',required:true,placeholder:'Cidade, endereço ou referência'},
      {name:'descricao',label:'Descrição da ocorrência',type:'textarea',required:true,placeholder:'Descreva o que aconteceu'},
      {name:'observacao',label:'Observações adicionais',type:'textarea',placeholder:'Providências, terceiros ou documentos envolvidos'}
    ]} /></div>
    {sessionItems.length ? <div className="session-banner"><strong>{sessionItems.length} ocorrência(s) local(is)</strong><span>Somente nesta sessão · fotos e anexos ainda não são enviados.</span></div> : null}
    <div className="incident-list">{items.map((item, index) => <div className={`incident-card ${item.session ? 'session-row' : ''}`} key={`${item.date}-${item.title}-${index}`}><span className="incident-date">{item.date}</span><div className="incident-copy"><strong>{item.title}</strong><span>{item.detail}</span>{item.session ? <em className="session-chip">Somente nesta sessão</em> : null}</div><span className={`tag ${item.status === 'Concluído' ? 'success' : 'warning'}`}>{item.status}</span></div>)}</div>
    <div className="empty-recommendation"><strong>Sugestão V2</strong><p>Sinistros devem permitir fotos, localização, veículo, condutor e documentos no mesmo registro. Isso evita informação espalhada em módulos diferentes.</p></div>
  </section>;
}
