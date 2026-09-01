# Movvant V2 — Gate final de homologação

Status desta candidata: **2.0.0-rc.1**.

## O que está fechado nesta fase

- frontend V2 totalmente isolado do legado;
- 15 módulos em rotas físicas independentes;
- um único AppShell e App Router como autoridade de navegação;
- navegação desktop/mobile;
- Agenda com estado compartilhado e preparação de rota;
- Rotas e Modo Campo com veículo e condutor elegíveis;
- KM monotônico compartilhado;
- Custos, Veículos, Equipe, Documentos, Manutenção, Pendências, Histórico e Relatórios em homologação de sessão;
- Perfil e preferências de Notificações em sessão;
- Architecture Guard, TypeScript, build e auditoria de dependências;
- Browser E2E em desktop e mobile cobrindo as 15 rotas e fluxos críticos.

## Limite intencional da RC

A candidata permanece **sem persistência real e sem integrações externas**. O estado operacional de homologação vive apenas na sessão React e é perdido ao recarregar. Supabase, autenticação, Google Agenda, Maps e produção só entram depois da aprovação visual/funcional desta RC.

## Gate para sair de RC

1. Aprovação visual do usuário em desktop e celular.
2. Nenhum erro crítico encontrado na homologação manual.
3. CI principal verde.
4. Preview estático verde.
5. Browser E2E verde.
6. Só então iniciar a conexão controlada de autenticação e persistência, módulo por módulo.

## Regra de proteção

Não fazer merge na `main`, não substituir a aplicação legada e não promover para produção antes da aprovação explícita da RC.
