'use client';

import { PrototypeFormDialog, PrototypeFormValues } from './PrototypeFormDialog';
import { useSessionActivity } from './SessionActivityProvider';
import { useDriverSession } from './DriverSessionProvider';
import { IncidentSeverity, useIncidentSession } from './IncidentSessionProvider';

const initialItems=[
 {date:'18/08/2026',title:'Pequena avaria em estacionamento',detail:'SUV Comercial · análise concluída',status:'Concluído'},
 {date:'04/07/2026',title:'Trinca em para-brisa',detail:'Hatch Vendas · aguardando nota',status:'Pendente'}
];
function text(values:PrototypeFormValues,key:string){const current=values[key];return Array.isArray(current)?current.join(' · '):current||'';}
function formatDate(date:string){if(!date)return 'Sem prazo';const[y,m,d]=date.split('-');return`${d}/${m}/${y}`;}

export function IncidentsSessionModule(){
 const{vehicleOptions}=useSessionActivity();
 const{driverOptions}=useDriverSession();
 const{incidents,addIncident,startIncidentReview,resolveIncident,clearIncidents}=useIncidentSession();
 function create(values:PrototypeFormValues){
  const requiresAction=text(values,'acao')==='Sim';
  addIncident({vehicle:text(values,'veiculo'),driver:text(values,'condutor'),date:text(values,'data'),location:text(values,'local'),description:text(values,'descricao'),notes:text(values,'observacao'),severity:text(values,'gravidade') as IncidentSeverity,requiresAction,actionOwner:requiresAction?text(values,'responsavel'):'',actionDue:requiresAction?text(values,'prazo'):''});
 }
 function resolve(id:string,values:PrototypeFormValues){resolveIncident(id,text(values,'resolucao'));}
 return <section className="panel">
  <div className="panel-title-row"><div><h2>Ocorrências</h2><span>Vínculo com frota, condutor, gravidade e tratamento.</span></div><div className="row-actions">{incidents.length?<button className="secondary-button" type="button" onClick={clearIncidents}>Limpar sinistros da sessão</button>:null}<PrototypeFormDialog trigger="+ Registrar sinistro" title="Registrar sinistro" description="Use apenas veículos e condutores elegíveis da sessão. Ações necessárias geram Pendência automaticamente." onValidate={create} fields={[
   {name:'veiculo',label:'Veículo',type:'select',required:true,options:vehicleOptions},
   {name:'condutor',label:'Condutor',type:'select',required:true,options:driverOptions},
   {name:'data',label:'Data',type:'date',required:true},
   {name:'local',label:'Local',required:true,placeholder:'Cidade, endereço ou referência'},
   {name:'gravidade',label:'Gravidade',type:'select',required:true,options:['Baixa','Média','Alta','Crítica']},
   {name:'descricao',label:'Descrição da ocorrência',type:'textarea',required:true,placeholder:'Descreva o que aconteceu'},
   {name:'acao',label:'Exige ação posterior?',type:'select',required:true,options:['Sim','Não']},
   {name:'responsavel',label:'Responsável pela ação',placeholder:'Ex.: Frota / Rafael Silva'},
   {name:'prazo',label:'Prazo da ação',type:'date'},
   {name:'observacao',label:'Observações adicionais',type:'textarea',placeholder:'Providências, terceiros ou documentos envolvidos'}
  ]}/></div></div>
  {incidents.length?<div className="session-banner"><strong>{incidents.length} ocorrência(s) compartilhada(s)</strong><span>Pendências e Histórico usam os mesmos registros desta sessão.</span></div>:null}
  <div className="incident-list">
   {incidents.map((item)=><div className="incident-card session-row" key={item.id}><span className="incident-date">{formatDate(item.date)}</span><div className="incident-copy"><strong>{item.description}</strong><span>{item.vehicle} · {item.driver} · {item.location}</span><span>Gravidade {item.severity}{item.requiresAction?` · ação até ${formatDate(item.actionDue)}`:' · sem ação posterior'}</span>{item.resolution?<span>Resolução: {item.resolution}</span>:null}<em className="session-chip">Somente nesta sessão</em></div><div className="row-actions"><span className={`tag ${item.status==='Concluído'?'success':'warning'}`}>{item.status}</span>{item.status==='Pendente'?<button type="button" className="secondary-button" onClick={()=>startIncidentReview(item.id)}>Iniciar análise</button>:null}{item.status!=='Concluído'?<PrototypeFormDialog trigger="Concluir" className="secondary-button" title="Concluir sinistro" description="Registre a resolução. A pendência associada será encerrada automaticamente." onValidate={(values)=>resolve(item.id,values)} fields={[{name:'resolucao',label:'Resolução',type:'textarea',required:true,placeholder:'Providência adotada e resultado final'}]}/>:null}</div></div>)}
   {initialItems.map((item)=><div className="incident-card" key={`${item.date}-${item.title}`}><span className="incident-date">{item.date}</span><div className="incident-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><span className={`tag ${item.status==='Concluído'?'success':'warning'}`}>{item.status}</span></div>)}
  </div>
  <div className="empty-recommendation"><strong>Próxima conexão</strong><p>Fotos, anexos e localização real continuam previstos para a fase de backend/storage. O fluxo operacional e a governança do registro já estão homologáveis.</p></div>
 </section>;
}
