'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSessionActivity } from '@/components/SessionActivityProvider';

type RoleKey = 'vendedor' | 'gerente' | 'financeiro' | 'proprietario';

type RoleView = {
  label: string;
  headline: string;
  metrics: Array<[string, string, string]>;
  focusTitle: string;
  focusItems: Array<[string, string]>;
  secondaryTitle: string;
  secondaryItems: Array<[string, string]>;
};

const views: Record<RoleKey, RoleView> = {
  vendedor: {
    label: 'Vendedor externo',
    headline: 'Meu dia em campo',
    metrics: [
      ['Agenda de hoje', '4', 'compromissos previstos'],
      ['Rotas', '2', 'deslocamentos planejados'],
      ['Visitas no mês', '18', 'atividades concluídas'],
      ['Pendências', '2', 'ações pessoais']
    ],
    focusTitle: 'Próximas atividades',
    focusItems: [['08:30 · Casa do MDF', 'Visita comercial'], ['10:45 · Cliente regional', 'Follow-up'], ['14:00 · Equipe comercial', 'Reunião online'], ['16:30 · Nova conta', 'Prospecção']],
    secondaryTitle: 'Atenção pessoal',
    secondaryItems: [['Despesa sem comprovante', 'Hoje'], ['Visita sem resultado', 'Ontem'], ['Próxima revisão do veículo', '6 dias']]
  },
  gerente: {
    label: 'Gerente comercial',
    headline: 'Equipe e execução comercial',
    metrics: [
      ['Equipe ativa', '6', 'usuários em operação'],
      ['Visitas hoje', '14', 'equipe comercial'],
      ['Pendências críticas', '3', 'exigem acompanhamento'],
      ['Cobertura de agenda', '91%', 'atividades planejadas']
    ],
    focusTitle: 'Equipe em campo',
    focusItems: [['Rafael Silva', '3 visitas · rota ativa'], ['Ana Costa', '2 visitas · dentro do planejado'], ['Lucas Martins', '1 pendência de cadastro'], ['Equipe Camboriú', '86% da agenda executada']],
    secondaryTitle: 'Exceções para acompanhar',
    secondaryItems: [['2 visitas sem resultado', 'Alta'], ['1 rota acima do previsto', 'Média'], ['1 usuário pendente', 'Cadastro']]
  },
  financeiro: {
    label: 'Financeiro',
    headline: 'Custos e conformidade',
    metrics: [
      ['Despesas no mês', 'R$ 1.024', 'lançamentos registrados'],
      ['Sem comprovante', '2', 'itens pendentes'],
      ['Custo por KM', 'R$ 0,82', 'média mensal'],
      ['Documentos atenção', '1', 'próximo do vencimento']
    ],
    focusTitle: 'Lançamentos para revisar',
    focusItems: [['Combustível · Rafael Silva', 'R$ 286,40'], ['Estacionamento · Ana Costa', 'R$ 24,00'], ['Pedágio · equipe externa', 'R$ 18,60']],
    secondaryTitle: 'Conformidade',
    secondaryItems: [['Seguro Hatch Vendas', '42 dias'], ['2 comprovantes ausentes', 'Pendente'], ['Fechamento mensal', 'Em andamento']]
  },
  proprietario: {
    label: 'Proprietário / administrador',
    headline: 'Visão consolidada da operação',
    metrics: [
      ['KM no mês', '1.248', 'quilômetros registrados'],
      ['Visitas comerciais', '18', 'concluídas'],
      ['Custo operacional', 'R$ 1.024', 'despesas registradas'],
      ['Pendências', '4', 'todas as áreas']
    ],
    focusTitle: 'Resumo da operação',
    focusItems: [['Comercial', '91% da agenda executada'], ['Campo', '2 rotas em andamento'], ['Financeiro', '2 despesas para revisar'], ['Frota', '1 revisão próxima']],
    secondaryTitle: 'Decisões necessárias',
    secondaryItems: [['Documento próximo do vencimento', 'Crítica'], ['Despesa sem comprovante', 'Alta'], ['Usuário pendente de ativação', 'Gestão']]
  }
};

export function DashboardByRole() {
  const [role, setRole] = useState<RoleKey>('proprietario');
  const { journeys, totalKm } = useSessionActivity();
  const view = views[role];

  return (
    <>
      <section className="panel role-preview-bar">
        <div>
          <span className="eyebrow">Demonstração de perfil</span>
          <strong>{view.headline}</strong>
          <small>Na versão conectada, este perfil virá automaticamente da autenticação e das permissões.</small>
        </div>
        <label className="role-selector">
          <span>Visualizar como</span>
          <select value={role} onChange={(event) => setRole(event.target.value as RoleKey)}>
            {Object.entries(views).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
          </select>
        </label>
      </section>

      {journeys.length ? <section className="panel session-dashboard-strip" aria-label="Indicadores da homologação local"><div><span className="eyebrow">Atividade desta sessão</span><strong>{journeys.length} jornada(s) concluída(s)</strong><small>Esses números vêm do Modo Campo e desaparecem ao recarregar a aplicação.</small></div><div className="session-dashboard-metrics"><span><b>{totalKm.toLocaleString('pt-BR')} km</b><small>percorridos nesta sessão</small></span><span><b>{journeys.length}</b><small>visitas refletidas no histórico</small></span></div><Link href="/historico" className="secondary-button">Ver histórico da sessão</Link></section> : null}

      <section className="dashboard-grid" aria-label="Indicadores do perfil">
        {view.metrics.map(([label, value, note]) => (
          <article className="metric-card" key={label}>
            <span className="metric-label">{label}</span>
            <strong className="metric-value">{value}</strong>
            <div className="metric-note">{note}</div>
          </article>
        ))}
      </section>

      <section className="main-grid">
        <article className="panel">
          <div className="panel-title-row"><h2>{view.focusTitle}</h2><Link href="/relatorios" className="text-link">Detalhes</Link></div>
          <div className="placeholder-list">{view.focusItems.map(([title, detail]) => <div className="placeholder-row" key={title}><strong>{title}</strong><span>{detail}</span></div>)}</div>
        </article>
        <article className="panel">
          <div className="panel-title-row"><h2>{view.secondaryTitle}</h2><Link href="/pendencias" className="text-link">Ver pendências</Link></div>
          <div className="placeholder-list">{view.secondaryItems.map(([title, detail]) => <div className="placeholder-row" key={title}><strong>{title}</strong><span>{detail}</span></div>)}</div>
        </article>
      </section>

      <section className="dashboard-field-strip panel">
        <div><span className="eyebrow">Atalho operacional</span><h2>Modo Campo</h2><p>Fluxo simplificado para trabalhar pelo celular com poucos toques.</p></div>
        <Link href="/campo" className="primary-button">Abrir Modo Campo</Link>
      </section>
    </>
  );
}
