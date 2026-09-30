# Controle Fácil KM — Planos V1

## Objetivo

Criar uma tela simples para o usuário escolher o plano antes da ativação de recursos pagos.

## Planos

### Gratuito
Para começar a controlar KM e despesas.

Inclui:
- controle de viagens;
- controle de despesas;
- categorias básicas;
- um veículo;
- histórico;
- relatórios básicos;
- funcionamento offline;
- sincronização em nuvem.

### Premium
Para uso completo do Controle Fácil KM.

Inclui tudo do Gratuito, mais:
- múltiplos veículos;
- comprovantes ilimitados;
- relatórios avançados;
- exportações avançadas;
- recursos avançados de agenda;
- backup/sincronização ampliados;
- recursos futuros premium.

## Tela

Cabeçalho:
**Escolha o plano que combina com você**

Cards:
- Gratuito
- Premium

O Premium deve ser destacado visualmente, sem linguagem agressiva.

Botões:
- Gratuito: **Continuar grátis**
- Premium: **Assinar Premium**

Também haverá:
**Continuar sem escolher agora**

## Modelo de dados futuro

A assinatura comercial não será misturada às entidades de viagem.

Entidades futuras:
- subscriptions
- subscription_events
- entitlements

A conta do usuário continua podendo usar o plano gratuito.

## Regra

O aplicativo nunca deve apagar viagens, despesas ou comprovantes quando o plano mudar.

Downgrade apenas desativa recursos premium; os dados permanecem preservados.
