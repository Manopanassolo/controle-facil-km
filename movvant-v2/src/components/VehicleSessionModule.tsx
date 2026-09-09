'use client';

import { PrototypeActionButton } from '@/components/PrototypeActionButton';
import { PrototypeFormDialog, PrototypeFormValues } from '@/components/PrototypeFormDialog';
import { useSessionActivity } from '@/components/SessionActivityProvider';

function text(values:PrototypeFormValues,key:string){const current=values[key];return Array.isArray(current)?current.join(' · '):current||'';}
function formatDate(date:string){if(!date)return 'Não definida';const [y,m,d]=date.split('-');return `${d}/${m}/${y}`;}

export function VehicleSessionModule(){
  const {vehicles,addVehicle,clearSessionVehicles,maintenanceAlerts,maintenanceRecords,scheduleMaintenance,completeMaintenance}=useSessionActivity();
  const sessionCount=vehicles.filter((vehicle)=>vehicle.source==='session').length;

  function createVehicle(values:PrototypeFormValues){
    const currentKm=Number(text(values,'kmInicial'))||0;
    addVehicle({name:text(values,'nome'),plate:text(values,'placa').toUpperCase(),model:text(values,'modelo'),year:Number(text(values,'ano'))||new Date().getFullYear(),currentKm,responsible:text(values,'responsavel')||'Não definido',status:text(values,'status') as 'Ativo'|'Reserva'|'Manutenção',nextMaintenanceKm:Math.max(currentKm,Number(text(values,'proximaRevisaoKm'))||currentKm),nextMaintenanceDate:text(values,'proximaRevisaoData')});
  }

  return <>
    <div className="panel-title-row module-actions"><span>{sessionCount?<span className="session-banner compact"><strong>{sessionCount} veículo(s) criado(s) nesta sessão</strong><span>Já disponíveis em Rotas, Custos e Modo Campo.</span></span>:null}</span><div className="row-actions">{sessionCount?<button type="button" className="secondary-button" onClick={clearSessionVehicles}>Limpar veículos da sessão</button>:null}<PrototypeFormDialog trigger="+ Novo veículo" title="Novo veículo" description="Cadastre o veículo e sua próxima manutenção preventiva. A frota operacional respeitará automaticamente vencimentos." onValidate={createVehicle} fields={[
      {name:'nome',label:'Identificação do veículo',required:true,placeholder:'Ex.: SUV Regional'},
      {name:'placa',label:'Placa',required:true,placeholder:'ABC1D23'},
      {name:'modelo',label:'Modelo',required:true,placeholder:'Ex.: T-Cross Comfortline'},
      {name:'ano',label:'Ano',type:'number',required:true,placeholder:'2026'},
      {name:'kmInicial',label:'KM atual',type:'number',required:true,placeholder:'0'},
      {name:'proximaRevisaoKm',label:'Próxima revisão (KM)',type:'number',required:true,placeholder:'15000'},
      {name:'proximaRevisaoData',label:'Próxima revisão (data)',type:'date',required:true},
      {name:'responsavel',label:'Responsável',placeholder:'Condutor principal'},
      {name:'status',label:'Status',type:'select',required:true,options:['Ativo','Reserva','Manutenção']}
    ]}/></div></div>

    <section className="cards-list">{vehicles.map((vehicle)=>{
      const alert=maintenanceAlerts.find((item)=>item.vehicleId===vehicle.id);
      const openMaintenance=maintenanceRecords.find((record)=>record.vehicleId===vehicle.id&&record.status==='Agendada');
      const lastMaintenance=maintenanceRecords.find((record)=>record.vehicleId===vehicle.id&&record.status==='Concluída');
      const maintenanceLabel=alert?.state==='vencida'?'Revisão vencida':alert?.state==='proxima'?'Revisão próxima':'Revisão em dia';
      return <article className={`panel vehicle-card ${vehicle.source==='session'?'session-row':''}`} key={vehicle.id}>
        <div className="vehicle-icon">V</div>
        <div className="vehicle-copy">
          <span className="eyebrow">{vehicle.plate}</span><h2>{vehicle.name}</h2>
          <p>{vehicle.model} · {vehicle.year} · {vehicle.currentKm.toLocaleString('pt-BR')} km</p>
          <span>{vehicle.responsible}</span>
          <span>Próxima revisão: {vehicle.nextMaintenanceKm.toLocaleString('pt-BR')} km ou {formatDate(vehicle.nextMaintenanceDate)}</span>
          {openMaintenance?<span>Revisão agendada: {formatDate(openMaintenance.scheduledDate)} · {openMaintenance.workshop} · referência {openMaintenance.scheduledKm.toLocaleString('pt-BR')} km</span>:null}
          {lastMaintenance?.completedAt?<span>Última revisão da sessão: {new Date(lastMaintenance.completedAt).toLocaleDateString('pt-BR')} · {lastMaintenance.serviceKm?.toLocaleString('pt-BR')} km</span>:null}
          <div className="history-session-tags"><em className="session-chip">{vehicle.source==='session'?'Frota da sessão':'Base demonstrativa'}</em><em className="session-chip">{maintenanceLabel}</em>{openMaintenance?<em className="session-chip">Revisão agendada</em>:null}</div>
        </div>
        <div className="vehicle-actions">
          <span className={`tag ${vehicle.status==='Ativo'&&alert?.state!=='vencida'?'success':'warning'}`}>{alert?.state==='vencida'?'Bloqueado · revisão':vehicle.status}</span>
          {!openMaintenance?<PrototypeFormDialog trigger="Agendar revisão" title={`Agendar revisão · ${vehicle.name}`} description="Registre oficina, data e KM de referência. Agendar não bloqueia um veículo saudável; revisão vencida continua bloqueada até conclusão." onValidate={(values)=>scheduleMaintenance(vehicle.id,text(values,'oficina'),text(values,'data'),Number(text(values,'km'))||vehicle.currentKm)} fields={[
            {name:'oficina',label:'Oficina / prestador',required:true,placeholder:'Ex.: Oficina Central'},
            {name:'data',label:'Data agendada',type:'date',required:true},
            {name:'km',label:'KM previsto',type:'number',required:true,placeholder:String(Math.max(vehicle.currentKm,vehicle.nextMaintenanceKm))},
            {name:'observacao',label:'Observação',type:'textarea',placeholder:'Serviços previstos ou instruções'}
          ]}/>:<PrototypeFormDialog trigger="Concluir revisão" title={`Concluir revisão · ${vehicle.name}`} description="Finalize o serviço. O KM será atualizado, a próxima revisão definida e o veículo será liberado automaticamente quando aplicável." onValidate={(values)=>completeMaintenance(openMaintenance.id,Number(text(values,'kmServico'))||vehicle.currentKm,text(values,'servicos'),Number(text(values,'proximaKm'))||vehicle.currentKm+10000,text(values,'proximaData'))} fields={[
            {name:'kmServico',label:'KM no serviço',type:'number',required:true,placeholder:String(Math.max(vehicle.currentKm,openMaintenance.scheduledKm))},
            {name:'servicos',label:'Serviços realizados',type:'textarea',required:true,placeholder:'Troca de óleo, filtros, inspeções...'},
            {name:'proximaKm',label:'Próxima revisão (KM)',type:'number',required:true,placeholder:String(Math.max(vehicle.currentKm,openMaintenance.scheduledKm)+10000)},
            {name:'proximaData',label:'Próxima revisão (data)',type:'date',required:true}
          ]}/>} 
          <PrototypeActionButton className="secondary-button" title={vehicle.name} description="Abrirá KM, documentos, revisões, custos, responsável e histórico de utilização do veículo.">Gerenciar</PrototypeActionButton>
        </div>
      </article>;
    })}</section>
  </>;
}
