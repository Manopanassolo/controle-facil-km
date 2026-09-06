# Movvant Web — Fase 1: Consolidação

Baseline canônico: `main`, package `164.2.0-stable-web`, build `index.html -> dist/index.html`.

## Regra
A Web existente é o produto-base. Inteligência Comercial, Agenda, Rotas, KM, Relatórios e Administração entram no mesmo shell; não será criada uma segunda aplicação concorrente.

## Arquitetura alvo do menu
1. Home
2. Inteligência Comercial
3. Agenda
4. Deslocamentos / Rotas
5. KM
6. Abastecimentos / Despesas
7. Relatórios
8. Clientes
9. Veículos
10. Administração
   - Usuários
   - Equipes
   - Lojas
   - Aprovações
   - Configurações

## Paridade Web / Mobile
- Web: gestão, filtros hierárquicos, planejamento, aprovações, relatórios e inteligência completa.
- Mobile: execução de campo, agenda pessoal, rota/GPS/KM, abastecimento/despesa e alertas/indicadores essenciais.
- Ambos: mesma identidade, sessão, permissões, dados e contratos de indicadores.

## Gates da Fase 1
- baseline preservado
- menu único
- nenhum link ativo para UI legada concorrente
- Inteligência Comercial incorporada ao shell existente
- navegação Home/voltar/refresh/deep-link validada
- build canônico verde
- homologação antes de produção

## Política de backup
Cada marco homologável deve registrar branch/commit, versão Web/Mobile e cópia dos artefatos relevantes em Drive antes da promoção.
