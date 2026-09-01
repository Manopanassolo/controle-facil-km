import { PrototypeActionButton } from './PrototypeActionButton';
import { PrototypeFormDialog } from './PrototypeFormDialog';

export function HistoryModule() {
  const items = [
    ['01/09 · 10:52', 'Visita concluída · Casa do MDF', 'Itajaí → Balneário Camboriú · 14,8 km'],
    ['31/08 · 16:18', 'Retorno comercial', 'Camboriú → Itajaí · 18,2 km'],
    ['31/08 · 11:06', 'Prospecção regional', 'Itajaí → Navegantes · 22,4 km'],
    ['30/08 · 14:31', 'Reunião externa', 'Itajaí → Brusque · 45,7 km']
  ];
  return <section className="panel"><div className="panel-title-row"><h2>Linha do tempo de campo</h2><PrototypeActionButton className="secondary-button" title="Filtrar histórico" description="Abrirá período, usuário, veículo, cidade e tipo de atividade para refinar a linha do tempo.">Filtrar período</PrototypeActionButton></div><div className="timeline-list">{items.map(([date,title,detail]) => <div className="timeline-entry" key={`${date}-${title}`}><span className="timeline-date">{date}</span><i className="timeline-dot"/><div className="timeline-content"><strong>{title}</strong><span>{detail}</span></div></div>)}</div></section>;
}

export function TeamModule() {
  const members = [
    ['MP','Marcos Paulo','Administrador','Todas as lojas','Ativo'],
    ['AC','Ana Costa','Gerente Comercial','Itajaí · Camboriú','Ativo'],
    ['RS','Rafael Silva','Vendedor Externo','Baln. Camboriú','Ativo'],
    ['LM','Lucas Martins','Supervisor Comercial','Itajaí · Navegantes','Pendente'],
    ['CF','Carla Freitas','Financeiro','Todas as lojas','Ativo'],
    ['JP','João Pereira','Vendedor Loja','Camboriú','Ativo']
  ];
  return <><div className="panel-title-row"><span/><PrototypeFormDialog trigger="+ Novo usuário" title="Novo usuário" description="Valide cadastro, função e escopo de lojas antes de conectarmos autenticação e permissões reais." fields={[{name:'nome',label:'Nome completo',required:true,placeholder:'Nome do usuário'},{name:'email',label:'E-mail',type:'email',required:true,placeholder:'usuario@empresa.com.br'},{name:'telefone',label:'Telefone',type:'tel',placeholder:'(47) 99999-0000'},{name:'funcao',label:'Função',type:'select',required:true,options:['Vendedor Externo','Vendedor Loja','Vendedor Televendas','Gerente Comercial','Gerente de Produtos','Gerente de Compras','Diretor','Supervisor Comercial','Gerente Financeiro','Supervisor Financeiro','Auxiliar Administrativo','Supervisor de Compras','Supervisor Logística']},{name:'lojas',label:'Lojas permitidas',type:'select',required:true,options:['Todas as lojas','Itajaí','Camboriú','Balneário Camboriú','Navegantes']},{name:'status',label:'Status inicial',type:'select',required:true,options:['Ativo','Pendente']},{name:'observacao',label:'Observações de acesso',type:'textarea',placeholder:'Ex.: acesso adicional temporário ou regra específica'}]} /></div><section className="member-grid">{members.map(([initials,name,role,access,status]) => <article className="panel member-card" key={name}><div className="member-top"><div className="avatar">{initials}</div><div className="member-copy"><strong>{name}</strong><span>{role}</span></div></div><div className="permission-chips"><span>{access}</span><span>Permissões por função</span></div><span className={`tag ${status === 'Ativo' ? 'success' : 'warning'}`}>{status}</span><PrototypeActionButton className="secondary-button" title={`Gerenciar ${name}`} description="Abrirá dados do usuário, função, lojas vinculadas, permissões efetivas e histórico de alterações.">Gerenciar acesso</PrototypeActionButton></article>)}</section></>;
}

export function DocumentsModule() {
  const docs = [
    ['CNH · Marcos Paulo','Validade 18/03/2028','Válido'],
    ['CRLV · SUV Comercial','Licenciamento 2026','Válido'],
    ['Seguro · Hatch Vendas','Renova em 42 dias','Atenção'],
    ['Comprovante · Utilitário','Atualizado em 25/08','Válido']
  ];
  return <section className="panel"><div className="panel-title-row"><h2>Documentos monitorados</h2><PrototypeActionButton title="Adicionar documento" description="Abrirá tipo de documento, vínculo com usuário ou veículo, validade, alerta antecipado e anexo.">+ Adicionar documento</PrototypeActionButton></div><div className="document-list">{docs.map(([title,detail,status]) => <div className="document-row" key={title}><div className="document-copy"><strong>{title}</strong><span>{detail}</span></div><div className="row-actions"><span className={`tag ${status === 'Válido' ? 'success' : 'warning'}`}>{status}</span><PrototypeActionButton className="secondary-button" title={title} description="Abrirá detalhes, arquivo anexado, validade, alertas e histórico de atualização deste documento.">Abrir</PrototypeActionButton></div></div>)}</div></section>;
}

export function IncidentsModule() {
  const items = [
    ['18/08/2026','Pequena avaria em estacionamento','SUV Comercial · análise concluída','Concluído'],
    ['04/07/2026','Trinca em para-brisa','Hatch Vendas · aguardando nota','Pendente']
  ];
  return <section className="panel"><div className="panel-title-row"><h2>Ocorrências</h2><PrototypeActionButton title="Registrar sinistro" description="Abrirá veículo, condutor, data, local, descrição, fotos, documentos e acompanhamento da ocorrência.">+ Registrar sinistro</PrototypeActionButton></div><div className="incident-list">{items.map(([date,title,detail,status]) => <div className="incident-card" key={date}><span className="incident-date">{date}</span><div className="incident-copy"><strong>{title}</strong><span>{detail}</span></div><span className={`tag ${status === 'Concluído' ? 'success' : 'warning'}`}>{status}</span></div>)}</div><div className="empty-recommendation"><strong>Sugestão V2</strong><p>Sinistros devem permitir fotos, localização, veículo, condutor e documentos no mesmo registro. Isso evita informação espalhada em módulos diferentes.</p></div></section>;
}

export function NotificationsModule() {
  const items = [
    ['Documento próximo do vencimento','Seguro do Hatch Vendas vence em 42 dias.','Atenção'],
    ['Compromisso em 30 minutos','Visita comercial em Balneário Camboriú.','Agenda'],
    ['Despesa pendente de revisão','Há 2 lançamentos sem comprovante.','Financeiro'],
    ['Rota finalizada','Rota Itajaí → Camboriú registrada com sucesso.','Campo']
  ];
  return <section className="panel"><div className="panel-title-row"><h2>Central de alertas</h2><PrototypeActionButton className="secondary-button" title="Marcar notificações como lidas" description="Na versão conectada, atualizará somente o estado de leitura do usuário atual, sem apagar notificações.">Marcar todas como lidas</PrototypeActionButton></div><div className="notification-list">{items.map(([title,detail,type]) => <div className="notification-row" key={title}><div className="notification-copy"><strong>{title}</strong><span>{detail}</span></div><span className={`tag ${type === 'Atenção' ? 'warning' : ''}`}>{type}</span></div>)}</div></section>;
}

export function ProfileModule() {
  return <section className="profile-layout"><article className="panel profile-summary"><div className="profile-avatar">MP</div><h2>Marcos Paulo</h2><p>Administrador · Movvant</p><span className="tag success">Perfil ativo</span></article><article className="panel"><div className="panel-title-row"><h2>Dados do perfil</h2><PrototypeActionButton className="secondary-button" title="Editar perfil" description="Abrirá os campos pessoais permitidos ao próprio usuário; função e permissões continuarão controladas pela administração.">Editar</PrototypeActionButton></div><div className="profile-fields"><label className="field-label">Nome<input className="field" defaultValue="Marcos Paulo" readOnly /></label><label className="field-label">Função<input className="field" defaultValue="Administrador" readOnly /></label><label className="field-label">E-mail<input className="field" defaultValue="usuario@movvant.app" readOnly /></label><label className="field-label">Telefone<input className="field" defaultValue="(47) 99999-0000" readOnly /></label></div></article></section>;
}

export function SettingsModule() {
  const settings = [
    ['Empresa e identidade','Nome, logo, cores e dados institucionais.','Abrir'],
    ['Usuários e permissões','Funções, lojas e regras de acesso.','Configurar'],
    ['Integrações','Google Agenda, Maps e outros serviços.','Desconectado'],
    ['Veículos e KM','Regras de quilometragem, tolerâncias e alertas.','Configurar'],
    ['Financeiro','Categorias, centros de custo e aprovações.','Configurar'],
    ['Notificações','Quais eventos geram avisos e para quem.','Configurar']
  ];
  return <section className="panel"><h2>Configuração central</h2><div className="setting-list" style={{marginTop:16}}>{settings.map(([title,detail,status]) => <div className="setting-row" key={title}><div className="setting-copy"><strong>{title}</strong><span>{detail}</span></div><div className="row-actions"><span className={`tag ${status === 'Desconectado' ? 'warning' : ''}`}>{status}</span><PrototypeActionButton className="secondary-button" title={title} description={`Abrirá a configuração de ${title.toLowerCase()} em uma tela própria, com permissões e auditoria antes de salvar alterações.`}>Abrir</PrototypeActionButton></div></div>)}</div></section>;
}

export function GenericModule({ title }: { title: string }) {
  return <section className="action-grid"><article className="panel action-card"><div className="action-card-copy"><h2>{title}</h2><p>Estrutura visual pronta para receber o fluxo funcional sem reaproveitar scripts antigos.</p></div><span className="tag success">V2</span></article><article className="panel action-card"><div className="action-card-copy"><h2>Próxima integração</h2><p>Os dados reais só entram após a homologação desta tela.</p></div><PrototypeActionButton className="secondary-button" title="Fluxo visual" description="Este módulo ainda não possui persistência ou integração externa nesta fase.">Visual apenas</PrototypeActionButton></article></section>;
}
