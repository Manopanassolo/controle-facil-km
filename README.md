# Controle Fácil de KM

Aplicação independente e multiempresa para controle de quilometragem, deslocamentos, despesas, comprovantes, frota, agenda, manutenção, relatórios, auditoria e avisos.

## Versão atual

**v102.0 — production candidate**

Homologação: https://controle-km-homologacao.vercel.app

## Arquitetura

- Produto independente do restante do Controle Fácil.
- Dados empresariais centralizados no Supabase com RLS.
- Preferências do dispositivo mantidas localmente apenas quando apropriado.
- Deploy contínuo pelo Vercel a partir da branch `main`.
- Build com validação automática de sintaxe, IDs HTML, funções duplicadas e regressões de backendização.
- GitHub Actions executa o quality gate em pushes e pull requests.

## Checkpoint

A versão v100.3 permanece como referência homologada anterior à sequência de backendização. A v102.0 incorpora a evolução completa do núcleo KM e as proteções de regressão do build.
