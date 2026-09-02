# Movvant V2 — decisões de produto

## Princípio central
A V2 deve ser rápida para uso em campo, previsível na navegação e auditável. Funcionalidade nova não pode criar uma segunda autoridade de navegação, renderização ou sincronização.

## Melhorias prioritárias

### 1. Central de Pendências
O Dashboard deve destacar apenas o que exige ação: compromisso atrasado, despesa sem comprovante, documento vencendo, rota não finalizada, usuário aguardando aprovação e integração desconectada.

Regra: cada pendência precisa ter responsável, prazo, prioridade e ação direta.

### 2. Modo Campo
Criar uma visão simplificada para celular com grandes ações principais: iniciar rota, chegar ao cliente, registrar visita, lançar despesa, anexar comprovante e encerrar rota.

Regra: ações críticas devem exigir o mínimo de toques possível.

### 3. Offline e sincronização
Rotas, visitas, KM, despesas e fotos precisam tolerar internet instável. O app deve informar claramente: sincronizado, aguardando sincronização ou erro.

Regra: nunca esconder falhas de sincronização e nunca duplicar registros ao reconectar.

### 4. Permissões por função e loja
Permissões devem combinar função + lojas autorizadas + escopo de dados. Exemplo: vendedor externo visualiza apenas sua operação; supervisor enxerga sua equipe; administrador enxerga toda a organização.

Regra: segurança deve ser aplicada também no backend, não apenas escondendo botões no frontend.

### 5. Trilha de auditoria
Alterações sensíveis precisam registrar quem fez, quando fez, valor anterior e valor novo: usuários, permissões, KM, despesas, veículos, documentos, sinistros e configurações.

Regra: registros de auditoria não devem ser editáveis por usuários comuns.

### 6. Dashboard por perfil
A página inicial deve priorizar informações diferentes conforme a função do usuário. Vendedor externo recebe agenda, rotas e pendências próprias; gerente recebe equipe, desempenho e exceções; financeiro recebe custos e documentos; proprietário/administrador recebe visão consolidada.

Regra: o perfil visual deve ser derivado da autenticação e das permissões reais. O seletor manual existente na fase visual é apenas demonstração e não deve existir como autoridade de acesso quando o backend for conectado.

## Identidade visual e assets
Logo, ícones e demais elementos de marca devem entrar na V2 como arquivos estáticos independentes. Não extrair nem importar assets a partir do HTML, CSS ou JavaScript legado, para não reintroduzir dependências da aplicação antiga.

## Ordem recomendada de integração
1. Homologação visual e navegação.
2. Autenticação.
3. Organização, usuários, funções e permissões.
4. Veículos.
5. Rotas e KM.
6. Visitas e histórico.
7. Custos e comprovantes.
8. Agenda.
9. Documentos e sinistros.
10. Relatórios e notificações.
11. Offline/sincronização.
12. Integrações externas.

## Regra de homologação
Nenhum módulo recebe integração real antes de sua tela visual e fluxo principal estarem aprovados. Integrações são adicionadas uma por vez e cada módulo deve continuar funcionando sem dependência de scripts globais antigos.
