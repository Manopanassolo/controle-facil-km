'use client';

import { useState } from 'react';
import { PrototypeActionButton } from './PrototypeActionButton';
import { PrototypeFormDialog, PrototypeFormValues } from './PrototypeFormDialog';

type Member = {
  initials: string;
  name: string;
  role: string;
  access: string;
  status: string;
  session?: boolean;
};

const initialMembers: Member[] = [
  { initials: 'MP', name: 'Marcos Paulo', role: 'Administrador', access: 'Todas as lojas', status: 'Ativo' },
  { initials: 'AC', name: 'Ana Costa', role: 'Gerente Comercial', access: 'Itajaí · Camboriú', status: 'Ativo' },
  { initials: 'RS', name: 'Rafael Silva', role: 'Vendedor Externo', access: 'Baln. Camboriú', status: 'Ativo' },
  { initials: 'LM', name: 'Lucas Martins', role: 'Supervisor Comercial', access: 'Itajaí · Navegantes', status: 'Pendente' },
  { initials: 'CF', name: 'Carla Freitas', role: 'Financeiro', access: 'Todas as lojas', status: 'Ativo' },
  { initials: 'JP', name: 'João Pereira', role: 'Vendedor Loja', access: 'Camboriú', status: 'Ativo' }
];

function text(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'NV';
}

export function TeamSessionModule() {
  const [sessionMembers, setSessionMembers] = useState<Member[]>([]);
  const members = [...sessionMembers, ...initialMembers];

  function addMember(values: PrototypeFormValues) {
    const name = text(values, 'nome');
    setSessionMembers((current) => [{
      initials: initials(name),
      name,
      role: text(values, 'funcao'),
      access: text(values, 'lojas'),
      status: text(values, 'status'),
      session: true
    }, ...current]);
  }

  return <>
    <div className="panel-title-row module-actions">
      <span>{sessionMembers.length ? <span className="session-banner compact"><strong>{sessionMembers.length} usuário(s) local(is)</strong><span>Somente nesta sessão</span></span> : null}</span>
      <PrototypeFormDialog trigger="+ Novo usuário" title="Novo usuário" description="Valide cadastro, função e escopo de lojas antes de conectarmos autenticação e permissões reais." onValidate={addMember} fields={[
        {name:'nome',label:'Nome completo',required:true,placeholder:'Nome do usuário'},
        {name:'email',label:'E-mail',type:'email',required:true,placeholder:'usuario@empresa.com.br'},
        {name:'telefone',label:'Telefone',type:'tel',placeholder:'(47) 99999-0000'},
        {name:'funcao',label:'Função',type:'select',required:true,options:['Vendedor Externo','Vendedor Loja','Vendedor Televendas','Gerente Comercial','Gerente de Produtos','Gerente de Compras','Diretor','Supervisor Comercial','Gerente Financeiro','Supervisor Financeiro','Auxiliar Administrativo','Supervisor de Compras','Supervisor Logística']},
        {name:'lojas',label:'Lojas permitidas',type:'multiselect',required:true,options:['Todas as lojas','Itajaí','Camboriú','Balneário Camboriú','Navegantes']},
        {name:'status',label:'Status inicial',type:'select',required:true,options:['Ativo','Pendente']},
        {name:'observacao',label:'Observações de acesso',type:'textarea',placeholder:'Ex.: acesso adicional temporário ou regra específica'}
      ]} />
    </div>
    <section className="member-grid">
      {members.map((member) => <article className={`panel member-card ${member.session ? 'session-row' : ''}`} key={`${member.name}-${member.role}`}>
        <div className="member-top"><div className="avatar">{member.initials}</div><div className="member-copy"><strong>{member.name}</strong><span>{member.role}</span></div></div>
        <div className="permission-chips"><span>{member.access}</span><span>Permissões por função</span></div>
        <div className="row-actions"><span className={`tag ${member.status === 'Ativo' ? 'success' : 'warning'}`}>{member.status}</span>{member.session ? <em className="session-chip">Somente nesta sessão</em> : null}</div>
        <PrototypeActionButton className="secondary-button" title={`Gerenciar ${member.name}`} description="Abrirá dados do usuário, função, lojas vinculadas, permissões efetivas e histórico de alterações.">Gerenciar acesso</PrototypeActionButton>
      </article>)}
    </section>
  </>;
}
