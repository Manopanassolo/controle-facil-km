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

## Evidência automática da RC1

Resultados confirmados na candidata atual:

- CI principal / `validate-v2`: **success**;
- Browser E2E: **success**;
- Cloudflare Pages: **success**;
- projeto isolado: `movvant-v2-homologacao`;
- domínio de homologação: `homologacao.movvant.com.br`;
- HTTPS/domínio próprio validados em Android;
- branch `movvant-v2-rebuild` isolada da `main`;
- PR #7 permanece draft e sem merge.

O Worker legado `movvant` permanece fora do gate da V2 e não deve ser modificado por este fluxo.

## Homologação manual

Em 2026-09-01, após publicação da RC1 no Cloudflare Pages e ativação de `homologacao.movvant.com.br`, o usuário confirmou a homologação funcional pelo Android com a declaração **“Tudo funcionando”** e autorizou continuidade.

Esta aprovação libera a próxima fase controlada de backend/persistência. Ela não autoriza merge na `main`, substituição do legado ou promoção do domínio principal.

## Próxima fase — backend controlado

A candidata pode agora iniciar autenticação e persistência em ambiente isolado, módulo por módulo. A ordem de implantação é:

1. autenticação e sessão;
2. perfil/usuários e permissões;
3. veículos e condutores;
4. jornadas, rotas e KM;
5. custos;
6. agenda;
7. documentos, manutenção e sinistros;
8. relatórios/notificações;
9. integrações externas (Google Agenda/Maps) por último.

Cada bloco deve manter CI, Browser E2E e homologação Cloudflare verdes antes do próximo.

## Estado do gate

- Gates automáticos: **APROVADOS**.
- Homologação manual Android: **APROVADA**.
- Cloudflare Pages + domínio de homologação: **APROVADOS**.
- Backend/persistência: **LIBERADO PARA IMPLEMENTAÇÃO CONTROLADA**.
- Merge/produção: **BLOQUEADO**.

## Regra de proteção

Não fazer merge na `main`, não substituir a aplicação legada e não promover `movvant.com.br` para a V2 antes da validação da fase de backend e aprovação explícita de produção.
