export type MovvantModule = {
  slug: string;
  label: string;
  group: string;
  description: string;
};

export const modules: MovvantModule[] = [
  { slug: 'dashboard', label: 'Dashboard', group: 'Visão geral', description: 'Indicadores, agenda do dia e atalhos principais.' },
  { slug: 'pendencias', label: 'Pendências', group: 'Visão geral', description: 'Ações que exigem atenção, responsável e prazo.' },
  { slug: 'agenda', label: 'Agenda', group: 'Produtividade', description: 'Compromissos, visitas e atividades comerciais.' },
  { slug: 'notificacoes', label: 'Notificações', group: 'Produtividade', description: 'Central de alertas e avisos.' },
  { slug: 'campo', label: 'Modo Campo', group: 'Campo', description: 'Fluxo simplificado para operação externa no celular.' },
  { slug: 'roteiros', label: 'Rotas', group: 'Campo', description: 'Planejamento e execução de deslocamentos.' },
  { slug: 'historico', label: 'Histórico', group: 'Campo', description: 'Histórico de viagens, visitas e deslocamentos.' },
  { slug: 'custos', label: 'Custos', group: 'Gestão', description: 'Despesas, abastecimentos e custos operacionais.' },
  { slug: 'veiculos', label: 'Veículos', group: 'Gestão', description: 'Cadastro e acompanhamento da frota.' },
  { slug: 'equipe', label: 'Equipe', group: 'Gestão', description: 'Usuários, funções e permissões.' },
  { slug: 'documentos', label: 'Documentos', group: 'Gestão', description: 'Documentos vinculados a usuários e veículos.' },
  { slug: 'sinistros', label: 'Sinistros', group: 'Gestão', description: 'Registro e acompanhamento de ocorrências.' },
  { slug: 'relatorios', label: 'Relatórios', group: 'Análise', description: 'Relatórios gerenciais e comerciais.' },
  { slug: 'perfil', label: 'Perfil', group: 'Conta', description: 'Dados pessoais e preferências.' },
  { slug: 'configuracoes', label: 'Configurações', group: 'Conta', description: 'Parâmetros gerais do sistema.' }
];

export const moduleMap = new Map(modules.map((item) => [item.slug, item]));
export const moduleGroups = Array.from(new Set(modules.map((item) => item.group)));
