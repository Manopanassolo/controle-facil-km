# Movvant — inteligência comercial em campo

Aplicação independente e multiempresa para controle de quilometragem, deslocamentos, despesas, comprovantes, frota, agenda, manutenção, relatórios, auditoria, avisos e recursos comerciais por assinatura.

## Versão atual

**v161.0.1 — production candidate estabilizada**

Homologação: https://controle-km-homologacao.vercel.app

## Marca

- Produto: **Movvant**
- Slogan: **inteligência comercial em campo**
- Origem técnica do projeto/repositório: Controle Fácil KM

## Arquitetura

- Produto independente do restante do Controle Fácil.
- Dados empresariais centralizados no Supabase com RLS.
- Preferências do dispositivo mantidas localmente apenas quando apropriado.
- Deploy contínuo pelo Vercel a partir da branch `main`.
- Build com validação automática de sintaxe, IDs HTML, funções duplicadas e regressões de backendização.
- GitHub Actions executa o quality gate em pushes e pull requests.

## Produto e planos

A camada comercial v161 introduz os planos **Pessoal, Pro e Empresas**, além de recursos vendáveis e adicionais controlados pelo proprietário da assinatura. Alterações de plano e recursos não apagam viagens, despesas, agenda ou histórico.

## Checkpoint

A versão **v161.0.1** é o checkpoint técnico atual após a correção do build/quality gate da camada comercial v161. O deployment correspondente está apto para seguir como base das próximas evoluções sem retroceder as funcionalidades acumuladas.
