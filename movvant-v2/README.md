# Movvant V2 — reconstrução limpa

Esta aplicação nasce isolada do frontend legado do Movvant.

## Estado atual

A V2 está na candidata **2.0.0-rc.1**, destinada à homologação visual e funcional final. O frontend, a navegação e os fluxos de sessão estão isolados e protegidos por CI e E2E. A candidata ainda não grava dados reais e não está autorizada a substituir produção.

Consulte `FINAL_HOMOLOGATION.md` para o gate de saída da RC.

## Regras arquiteturais obrigatórias

1. Não importar nenhum arquivo JavaScript/CSS da aplicação antiga.
2. Não criar patches sequenciais por versão (`v16xxx.js`, hotfixes encadeados etc.).
3. A URL/Next.js App Router é a única autoridade de navegação.
4. Existe um único `AppShell` para cabeçalho e menu.
5. Cada módulo possui rota e componentes próprios.
6. Alterações visuais devem usar os tokens definidos em `src/app/globals.css`.
7. Supabase, Maps, Google Agenda e demais integrações serão conectados somente depois da homologação visual/navegacional.
8. Nenhum serviço externo pode modificar DOM ou navegação global da aplicação.

## Homologação atual

Os 15 módulos possuem rotas independentes. Dados e operações desta etapa são demonstrativos ou mantidos apenas na sessão React. Recarregar a aplicação limpa os dados temporários de homologação.

## Execução local

```bash
npm install
npm run dev
```

A aplicação inicia em `/` e redireciona para `/dashboard`.
