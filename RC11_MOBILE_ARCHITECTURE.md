# Movvant Mobile RC11 — Reconstrução Mobile

## Objetivo
Reconstruir a experiência mobile sem alterar a versão web homologada nem a branch main. Esta branch concentra a nova arquitetura visual e funcional aprovada para a RC11.

## Padrão visual aprovado
- Identidade: azul-marinho, azul Movvant, branco e cinzas neutros.
- Verde/vermelho somente para estados e ações.
- Cabeçalho compacto, cartões limpos, tipografia legível e espaçamento consistente.
- Barra inferior fixa: Home | Agenda | KM | Mapa | Mais.
- Menu lateral completo para módulos secundários e administração.

## Home
- Saudação e perfil.
- Indicadores do dia: compromissos, lojas/visitas, KM.
- Agenda do dia em lista compacta.
- Atalhos somente para ações frequentes.
- Sem duplicação de navegação com menu lateral.

## Agenda
- Calendário mensal sempre visível.
- Navegação entre meses.
- Dia selecionado destacado.
- Dias com compromissos sinalizados.
- Lista de compromissos do dia logo abaixo.
- Criar, abrir, editar e cancelar compromisso.
- Campos: título, data, horário, loja, tipo, origem/destino quando aplicável, descrição, lembrete.
- Persistência offline com sincronização posterior.
- Integração com Google Agenda sem depender dela para exibir o calendário Movvant.

## KM
- Veículo.
- KM inicial e final.
- Total calculado automaticamente.
- Motivo/atividade.
- Histórico.
- Fluxo curto, preparado para operação com uma mão.

## Deslocamento / Mapa
- Mapa como elemento principal.
- Origem, destino e paradas.
- Rota ancorada ao mapa durante zoom/pan.
- Retorno diferenciado em laranja quando aplicável.
- Iniciar, pausar e finalizar.
- Tempo e distância em destaque.
- Recuperação após reconexão.

## Relatórios
- Indicadores primeiro.
- Filtros simples.
- Detalhamento em segundo nível.
- Exportação separada do conteúdo principal.

## Configurações
- Perfil.
- Empresa/lojas permitidas.
- Sincronização.
- Modo offline.
- Notificações.
- Tema quando aplicável.
- Sobre/versão.

## Regras de navegação
- Home nunca deve abrir Agenda automaticamente.
- Voltar preserva contexto.
- Reabrir app respeita sessão e tela permitida.
- Menu fecha após seleção.
- Refresh/reload não deve resetar fluxo sem necessidade.
- Permissões respeitam perfil e lojas vinculadas.

## Critérios bloqueadores
A RC11 não pode ser aprovada com falha em: login, permissões, Home, Agenda, KM, início/fim de deslocamento, GPS/mapa, navegação principal, perda de dados ou sincronização crítica.

## Ordem de implementação
1. Shell visual + navegação
2. Home
3. Agenda completa
4. KM
5. Deslocamento/Mapa
6. Relatórios
7. Configurações
8. Offline/sincronização
9. Regressão geral
10. Novo APK

## Referências históricas recuperadas
- v126: calendário mobile proporcional e refinamento de Agenda.
- v162.92: calendário ligado a scheduledTrips e handoff para Google Agenda.

Essas referências serão reaproveitadas apenas como lógica comprovada, sem manter a aparência antiga ou camadas sobrepostas.
