# Controle Fácil KM — Especificação de Telas V1

## Princípio

Aplicativo pessoal. O usuário é o único proprietário dos dados.

## Fluxo de entrada

Splash
→ Login/Cadastro
→ Escolha de plano
→ Configuração inicial
→ Início

### Login/Cadastro

Opções:
- Continuar com Google
- Entrar com e-mail e senha
- Criar conta
- Recuperar senha

Google é opcional.

### Escolha de plano

Dois cards:
- Gratuito
- Premium

O usuário pode continuar grátis.

## Início

KPIs:
- KM no período
- despesas
- custo por KM
- viagens

Ações:
- Nova viagem
- Nova despesa

Blocos:
- últimas viagens
- últimas despesas
- próximos compromissos
- estado da sincronização

## Nova viagem

Campos:
- data
- hora inicial
- veículo
- origem
- destino
- paradas
- KM inicial
- KM final
- tipo: pessoal / trabalho / outro
- finalidade
- observações

Ações:
- Salvar rascunho
- Finalizar viagem

Validações:
- KM final >= KM inicial
- veículo obrigatório
- data obrigatória
- destino opcional

## Viagens

Lista:
- data
- origem → destino
- distância
- veículo
- tipo
- status

Filtros:
- período
- veículo
- tipo
- status

Detalhe:
- todos os dados
- paradas
- despesas vinculadas
- comprovantes
- editar
- duplicar
- excluir

## Despesas

Nova despesa:
- data
- categoria
- descrição
- valor
- veículo
- viagem opcional
- hodômetro opcional
- estabelecimento
- forma de pagamento
- observações
- comprovante

Valor sempre armazenado em centavos.

## Agenda

Agenda interna:
- dia
- semana
- lista

Evento:
- título
- data/hora
- local
- descrição
- vínculo opcional com viagem

Google:
- conectar
- escolher calendário
- sincronizar agora
- última sincronização
- desconectar

## Relatórios

Filtros:
- período
- veículo
- tipo de viagem

Indicadores:
- KM
- viagens
- despesas
- custo/KM

Relatórios:
- resumo
- despesas por categoria
- evolução mensal
- custo por KM
- viagens

Exportação V1:
- PDF
- CSV

## Veículos

Cadastro:
- nome
- marca
- modelo
- ano
- placa
- combustível
- KM inicial

Pode marcar veículo padrão.

## Configurações

- perfil
- segurança
- PIN
- biometria
- Google Agenda
- sincronização
- backup
- plano
- privacidade
- exportação
- excluir conta

## Navegação Android

Bottom navigation:
- Início
- Viagens
- Despesas
- Agenda
- Mais

Ações de criação ficam em botão flutuante/ação primária.

Em telas internas:
- botão voltar
- título
- ação contextual

## Estados globais

O aplicativo sempre deve conseguir representar:
- online
- offline
- sincronizando
- sincronizado
- erro de sincronização
- sessão expirada

Nenhum desses estados deve apagar dados locais.

## Plano

O plano controla funcionalidades, não os dados.

Free:
- 1 veículo
- viagens
- despesas
- agenda interna
- relatórios básicos

Premium:
- múltiplos veículos
- comprovantes ampliados/ilimitados
- relatórios avançados
- exportações avançadas
- recursos avançados de agenda

Nunca apagar dados por downgrade.
