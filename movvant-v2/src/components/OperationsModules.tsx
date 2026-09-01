import Link from 'next/link';

const pendingItems = [
  { priority: 'Crítica', title: 'CNH próxima do vencimento', owner: 'Marcos Paulo', due: '18/09/2026', action: 'Atualizar documento' },
  { priority: 'Alta', title: 'Despesa sem comprovante', owner: 'Rafael Silva', due: 'Hoje', action: 'Revisar lançamento' },
  { priority: 'Média', title: 'Veículo com revisão prevista', owner: 'Frota', due: 'Em 6 dias', action: 'Agendar revisão' },
  { priority: 'Média', title: 'Visita sem resultado registrado', owner: 'Ana Costa', due: 'Ontem', action: 'Completar visita' }
];

export function PendingModule() {
  return (
    <section className="panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Prioridade operacional</span><h2>O que precisa de ação</h2></div>
        <span className="tag warning">4 pendências</span>
      </div>
      <div className="pending-list">
        {pendingItems.map((item) => (
          <article className="pending-row" key={item.title}>
            <div className={`priority-mark ${item.priority === 'Crítica' ? 'critical' : item.priority === 'Alta' ? 'high' : 'medium'}`} />
            <div className="pending-copy">
              <div className="pending-title-line"><strong>{item.title}</strong><span className="tag">{item.priority}</span></div>
              <span>{item.owner} · prazo {item.due}</span>
            </div>
            <button className="secondary-button" type="button">{item.action}</button>
          </article>
        ))}
      </div>
      <div className="soft-box"><strong>Regra da V2</strong><span>Uma pendência só aparece aqui quando existe uma ação clara, um responsável e um prazo. Notificações informativas ficam fora desta central.</span></div>
    </section>
  );
}

export function FieldModeModule() {
  const actions = [
    ['01', 'Iniciar rota', 'Registrar saída, veículo e KM inicial.', '/roteiros'],
    ['02', 'Cheguei ao cliente', 'Marcar chegada e abrir a visita.', '/agenda'],
    ['03', 'Registrar visita', 'Resultado, observações, fotos e próximos passos.', '/historico'],
    ['04', 'Lançar despesa', 'Combustível, pedágio, estacionamento ou outro custo.', '/custos'],
    ['05', 'Encerrar rota', 'KM final, retorno e resumo do deslocamento.', '/roteiros']
  ];
  return (
    <section className="field-mode-layout">
      <article className="panel field-mode-hero">
        <span className="eyebrow">Uso rápido no celular</span>
        <h2>Seu dia em campo</h2>
        <p>Fluxo enxuto para executar as tarefas mais frequentes sem navegar por vários módulos.</p>
        <div className="field-status"><span className="status-dot preview" /><strong>Fluxo visual pronto</strong><span>Backend e sincronização ainda não conectados</span></div>
      </article>
      <div className="field-action-list">
        {actions.map(([step,title,detail,href]) => (
          <Link href={href} className="field-action-card panel" key={step}>
            <span className="field-step">{step}</span>
            <div><strong>{title}</strong><span>{detail}</span></div>
            <b aria-hidden="true">›</b>
          </Link>
        ))}
      </div>
      <article className="panel offline-card">
        <div><span className="eyebrow">Preparação futura</span><h2>Modo offline</h2><p>Quando ativado, registros essenciais serão gravados localmente e sincronizados depois sem duplicidade.</p></div>
        <span className="tag warning">Ainda não conectado</span>
      </article>
    </section>
  );
}
