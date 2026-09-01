'use client';

import { PrototypeActionButton } from '@/components/PrototypeActionButton';
import { PrototypeFormDialog, PrototypeFormValues } from '@/components/PrototypeFormDialog';
import { useSessionActivity } from '@/components/SessionActivityProvider';

function text(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

export function VehicleSessionModule() {
  const { vehicles, addVehicle, clearSessionVehicles } = useSessionActivity();
  const sessionCount = vehicles.filter((vehicle) => vehicle.source === 'session').length;

  function createVehicle(values: PrototypeFormValues) {
    addVehicle({
      name: text(values, 'nome'),
      plate: text(values, 'placa').toUpperCase(),
      model: text(values, 'modelo'),
      year: Number(text(values, 'ano')) || new Date().getFullYear(),
      currentKm: Number(text(values, 'kmInicial')) || 0,
      responsible: text(values, 'responsavel') || 'Não definido',
      status: text(values, 'status') as 'Ativo' | 'Reserva' | 'Manutenção'
    });
  }

  return <>
    <div className="panel-title-row module-actions">
      <span>{sessionCount ? <span className="session-banner compact"><strong>{sessionCount} veículo(s) criado(s) nesta sessão</strong><span>Já disponíveis em Rotas, Custos e Modo Campo.</span></span> : null}</span>
      <div className="row-actions">
        {sessionCount ? <button type="button" className="secondary-button" onClick={clearSessionVehicles}>Limpar veículos da sessão</button> : null}
        <PrototypeFormDialog trigger="+ Novo veículo" title="Novo veículo" description="Cadastre um veículo de homologação. Ele ficará disponível automaticamente nos demais fluxos da V2 até a página ser recarregada." onValidate={createVehicle} fields={[
          {name:'nome',label:'Identificação do veículo',required:true,placeholder:'Ex.: SUV Regional'},
          {name:'placa',label:'Placa',required:true,placeholder:'ABC1D23'},
          {name:'modelo',label:'Modelo',required:true,placeholder:'Ex.: T-Cross Comfortline'},
          {name:'ano',label:'Ano',type:'number',required:true,placeholder:'2026'},
          {name:'kmInicial',label:'KM atual',type:'number',required:true,placeholder:'0'},
          {name:'responsavel',label:'Responsável',placeholder:'Condutor principal'},
          {name:'status',label:'Status',type:'select',required:true,options:['Ativo','Reserva','Manutenção']}
        ]} />
      </div>
    </div>

    <section className="cards-list">
      {vehicles.map((vehicle) => <article className={`panel vehicle-card ${vehicle.source === 'session' ? 'session-row' : ''}`} key={vehicle.id}>
        <div className="vehicle-icon">V</div>
        <div className="vehicle-copy">
          <span className="eyebrow">{vehicle.plate}</span>
          <h2>{vehicle.name}</h2>
          <p>{vehicle.model} · {vehicle.year} · {vehicle.currentKm.toLocaleString('pt-BR')} km</p>
          <span>{vehicle.responsible}</span>
          {vehicle.source === 'session' ? <em className="session-chip">Frota da sessão</em> : <em className="session-chip">Base demonstrativa</em>}
        </div>
        <div className="vehicle-actions">
          <span className={`tag ${vehicle.status === 'Ativo' ? 'success' : 'warning'}`}>{vehicle.status}</span>
          <PrototypeActionButton className="secondary-button" title={vehicle.name} description="Abrirá KM, documentos, revisões, custos, responsável e histórico de utilização do veículo.">Gerenciar</PrototypeActionButton>
        </div>
      </article>)}
    </section>
  </>;
}
