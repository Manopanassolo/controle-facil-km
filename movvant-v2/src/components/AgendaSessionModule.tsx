'use client';

import Link from 'next/link';
import { PrototypeFormDialog, PrototypeFormValues } from '@/components/PrototypeFormDialog';
import { useSessionActivity } from '@/components/SessionActivityProvider';

const baseItems = [
  ['08:30', 'Visita comercial', 'Casa do MDF · Itajaí', 'Confirmada'],
  ['10:45', 'Follow-up', 'Cliente regional · Balneário Camboriú', 'Pendente'],
  ['14:00', 'Reunião de equipe', 'Comercial · Online', 'Confirmada'],
  ['16:30', 'Prospecção', 'Nova conta · Camboriú', 'Planejada']
];

function value(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

export function AgendaSessionModule() {
  const { appointments, addAppointment, startAppointment, completeAppointment } = useSessionActivity();

  function createAppointment(values: PrototypeFormValues) {
    addAppointment({
      title: value(values, 'titulo'),
      client: value(values, 'cliente') || 'Contato não informado',
      date: value(values, 'data'),
      time: value(values, 'horario'),
      address: value(values, 'endereco'),
      responsible: value(values, 'responsavel'),
      result: undefined,
      nextStep: undefined,
      startedAt: undefined,
      completedAt: undefined
    });
  }

  function finishAppointment(id: string, values: PrototypeFormValues) {
    completeAppointment(id, value(values, 'resultado'), value(values, 'proximoPasso'));
  }

  const ordered = [...appointments].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  return <section className="agenda-layout"><article className="panel agenda-main"><div className="panel-title-row"><div><span className="eyebrow">Setembro 2026</span><h2>Terça-feira, 1 de setembro</h2></div><PrototypeFormDialog trigger="+ Novo compromisso" title="Novo compromisso" description="Crie um compromisso de homologação que continuará visível ao navegar pela V2 durante esta sessão." onValidate={createAppointment} fields={[{name:'titulo',label:'Título',required:true,placeholder:'Ex.: Visita comercial'},{name:'cliente',label:'Cliente',required:true,placeholder:'Empresa ou contato'},{name:'data',label:'Data',type:'date',required:true},{name:'horario',label:'Horário',required:true,placeholder:'14:30'},{name:'endereco',label:'Endereço',required:true,placeholder:'Rua, número e cidade'},{name:'responsavel',label:'Responsável',required:true,placeholder:'Usuário responsável'}]} /></div>{appointments.length ? <div className="session-banner"><strong>{appointments.length} compromisso(s) compartilhado(s)</strong><span>Agenda, Dashboard e Histórico usam os mesmos dados nesta sessão.</span></div> : null}<div className="agenda-list">{ordered.map((item) => <div className="agenda-item session-row" key={item.id}><time>{item.time}</time><div className="agenda-line"/><div className="agenda-card"><div><strong>{item.title}</strong><span>{item.client} · {item.address}</span><em className="session-chip">{item.status}</em>{item.result ? <span>{item.result}{item.nextStep ? ` · Próximo: ${item.nextStep}` : ''}</span> : null}</div><div className="row-actions">{item.status === 'Planejado' ? <><button type="button" className="secondary-button" onClick={() => startAppointment(item.id)}>Iniciar atendimento</button><Link className="secondary-button" href="/roteiros">Abrir rota</Link></> : null}{item.status === 'Em atendimento' ? <PrototypeFormDialog className="primary-button" trigger="Concluir visita" title="Concluir atendimento" description="Registre o resultado da visita. O Dashboard e o Histórico serão atualizados imediatamente nesta sessão." onValidate={(values) => finishAppointment(item.id, values)} fields={[{name:'resultado',label:'Resultado',type:'select',required:true,options:['Venda realizada','Orçamento solicitado','Follow-up','Sem interesse','Visita técnica','Outro']},{name:'proximoPasso',label:'Próximo passo',required:true,placeholder:'Ex.: enviar orçamento amanhã'},{name:'observacao',label:'Observações',type:'textarea',placeholder:'Detalhes do atendimento'}]} /> : null}{item.status === 'Concluído' ? <span className="tag success">Concluído</span> : null}</div></div></div>)}{baseItems.map(([time,title,place,status]) => <div className="agenda-item" key={`${time}-${title}`}><time>{time}</time><div className="agenda-line"/><div className="agenda-card"><div><strong>{title}</strong><span>{place}</span></div><span className={`tag ${status === 'Confirmada' ? 'success' : ''}`}>{status}</span></div></div>)}</div></article><aside className="panel agenda-side"><h2>Próximos dias</h2><div className="mini-calendar">{['31','1','2','3','4','5','6','7','8','9','10','11','12','13'].map((day) => <span key={day} className={day === '1' ? 'selected' : ''}>{day}</span>)}</div><div className="soft-box"><strong>Google Agenda</strong><span>A integração real permanece desligada até a homologação visual e funcional ser aprovada.</span></div></aside></section>;
}
