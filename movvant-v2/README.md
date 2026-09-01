# Movvant V2 — reconstrução limpa

Esta aplicação nasce isolada do frontend legado do Movvant.

## Regras arquiteturais obrigatórias

1. Não importar nenhum arquivo JavaScript/CSS da aplicação antiga.
2. Não criar patches sequenciais por versão (`v16xxx.js`, hotfixes encadeados etc.).
3. A URL/Next.js App Router é a única autoridade de navegação.
4. Existe um único `AppShell` para cabeçalho e menu.
5. Cada módulo possui rota e componentes próprios.
6. Alterações visuais devem usar os tokens definidos em `src/app/globals.css`.
7. Supabase, Maps, Google Agenda e demais integrações serão conectados somente depois da homologação visual/navegacional.
8. Nenhum serviço externo pode modificar DOM ou navegação global da aplicação.

## Primeira fase

A versão 0.1 contém a identidade visual inicial, menu, dashboard e rotas independentes para os módulos. Dados exibidos são demonstrativos e não há backend conectado.

## Execução local

```bash
npm install
npm run dev
```

A aplicação inicia em `/` e redireciona para `/dashboard`.
