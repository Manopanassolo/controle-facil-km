'use client';

import { PrototypeActionButton } from './PrototypeActionButton';
import { PrototypeFormDialog, PrototypeFormValues } from './PrototypeFormDialog';
import { useDriverSession } from './DriverSessionProvider';
import { useSessionActivity } from './SessionActivityProvider';

function text(values: PrototypeFormValues, key: string) { const current=values[key]; return Array.isArray(current)?current.join(' · '):current||''; }
function initials(name:string){return name.split(/\s+/).filter(Boolean).slice(0,2).map((part)=>part[0]?.toUpperCase()).join('')||'NV';}

export function TeamSessionModule(){
  const {drivers,driverOptions,addDriver,clearSessionDrivers}=useDriverSession();
  const {blockedDrivers}=useSessionActivity();
  const sessionCount=drivers.filter((driver)=>driver.source==='session').length;
  function addMember(values:PrototypeFormValues){addDriver({name:text(values,'nome'),role:text(values,'funcao'),access:text(values,'lojas'),status:text(values,'status') as 'Ativo'|'Pendente'});}
  return <>
    <div className="panel-title-row module-actions"><span>{sessionCount?<span className="session-banner compact"><strong>{sessionCount} usuário(s) local(is)</strong><span>{driverOptions.length} condutor(es) elegível(is) para operação</span></span>:null}</span><div className="row-actions">{sessionCount?<button type="button" className="secondary-button" onClick={clearSessionDrivers}>Limpar usuários da sessão</button>:null}<PrototypeFormDialog trigger="+ Novo usuário" title="Novo usuário" description="O usuário ativo entra na lista compartilhada de condutores, salvo quando houver bloqueio documental individual." onValidate={addMember} fields={[
      {name:'nome',label:'Nome completo',required:true,placeholder:'Nome do usuário'},
      {name:'email',label:'E-mail',type:'email',required:true,placeholder:'usuario@empresa.com.br'},
      {name:'telefone',label:'Telefone',type:'tel',placeholder:'(47) 99999-0000'},
      {name:'funcao',label:'Função',type:'select',required:true,options:['Vendedor Externo','Vendedor Loja','Vendedor Televendas','Gerente Comercial','Gerente de Produtos','Gerente de Compras','Diretor','Supervisor Comercial','Gerente Financeiro','Supervisor Financeiro','Auxiliar Administrativo','Supervisor de Compras','Supervisor Logística']},
      {name:'lojas',label:'Lojas permitidas',type:'multiselect',required:true,options:['Todas as lojas','Itajaí','Camboriú','Balneário Camboriú','Navegantes']},
      {name:'status',label:'Status inicial',type:'select',required:true,options:['Ativo','Pendente']}
    ]}/></div></div>
    <section className="member-grid">{drivers.map((member)=>{const blocked=blockedDrivers.includes(member.name);return <article className={`panel member-card ${member.source==='session'?'session-row':''}`} key={member.id}><div className="member-top"><div className="avatar">{initials(member.name)}</div><div className="member-copy"><strong>{member.name}</strong><span>{member.role}</span></div></div><div className="permission-chips"><span>{member.access}</span><span>{blocked?'CNH bloqueando condução':'Elegibilidade documental verificada'}</span></div><div className="row-actions"><span className={`tag ${member.status==='Ativo'&&!blocked?'success':'warning'}`}>{blocked?'Bloqueado para conduzir':member.status}</span>{member.source==='session'?<em className="session-chip">Somente nesta sessão</em>:null}</div><PrototypeActionButton className="secondary-button" title={`Gerenciar ${member.name}`} description="Abrirá função, lojas, permissões e documentos vinculados do usuário.">Gerenciar acesso</PrototypeActionButton></article>;})}</section>
  </>;
}
