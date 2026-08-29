# Movvant — inteligência comercial em campo

Aplicação independente e multiempresa para controle de quilometragem, deslocamentos, despesas, comprovantes, frota, agenda, manutenção, relatórios, auditoria, avisos e recursos comerciais por assinatura.

## Versão atual

**v162.0.0 — identidade Movvant aplicada**

Homologação técnica atual: https://controle-km-homologacao.vercel.app

Domínio oficial adquirido: **movvant.com.br**

## Marca

- Produto: **Movvant**
- Slogan: **inteligência comercial em campo**
- Domínio oficial: **movvant.com.br**
- Identidade visual v162: azul institucional, tipografia/realces verde-limão quase neon e símbolo GPS branco.
- Origem técnica do projeto/repositório: Controle Fácil KM.

## Arquitetura

- Produto independente do restante do Controle Fácil.
- Dados empresariais centralizados no Supabase com RLS.
- Preferências do dispositivo mantidas localmente apenas quando apropriado.
- Deploy contínuo pelo Vercel a partir da branch `main`.
- Build com validação automática de sintaxe, IDs HTML, funções duplicadas e regressões de backendização.
- GitHub Actions executa o quality gate em pushes e pull requests.

## Produto e planos

A camada comercial introduz os planos **Pessoal, Pro e Empresas**, além de recursos vendáveis e adicionais controlados pelo proprietário da assinatura. Alterações de plano e recursos não apagam viagens, despesas, agenda ou histórico.

## Checkpoint

A **v162.0.0** inicia oficialmente a identidade Movvant dentro do aplicativo, preservando a base funcional estabilizada da v161.0.1. O domínio movvant.com.br será apontado para o projeto de produção após a liberação/configuração DNS no Vercel.
