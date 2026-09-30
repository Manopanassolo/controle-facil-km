# Controle Fácil KM — Google Agenda V1

## Objetivo

Permitir que o usuário conecte opcionalmente o Google Agenda e sincronize seus compromissos com a Agenda do Controle Fácil KM.

A integração deve ser independente do Movvant.

## OAuth

A integração será feita por OAuth 2.0 do próprio Controle Fácil KM.

Escopo preferencial para leitura/escrita de eventos:

`https://www.googleapis.com/auth/calendar.events`

Esse escopo permite ver e editar eventos nas agendas acessíveis ao usuário. O escopo amplo `calendar` não será solicitado sem necessidade. O Google recomenda escolher o escopo mais restrito possível. citeturn0search0turn0search3

Como o aplicativo será público, a configuração OAuth e os escopos deverão passar pelo processo aplicável de verificação do Google antes da publicação, quando exigido. citeturn0search0

## Fluxo

1. Usuário abre Agenda.
2. Toca em **Conectar Google Agenda**.
3. OAuth solicita consentimento.
4. Usuário escolhe/autoriza a conta.
5. Backend registra a conexão.
6. Sistema lista as agendas disponíveis.
7. Usuário escolhe a agenda principal ou outra agenda.
8. Sistema importa eventos futuros.
9. Alterações passam a ser sincronizadas.

## Modelo local

Tabela futura `calendar_connections`:

- id
- user_id
- provider
- google_account_email
- calendar_id
- calendar_name
- timezone
- connected_at
- updated_at
- revoked_at
- sync_status
- last_sync_at
- next_sync_token
- version

Tabela futura `calendar_events`:

- id
- user_id
- connection_id
- local_event_id
- google_event_id
- google_etag
- title
- description
- location
- start_at
- end_at
- all_day
- status
- html_link
- updated_at
- deleted_at
- sync_version

## Evitar duplicações

Ao criar um evento, o sistema deve manter um identificador estável do evento.

A API do Google permite que o cliente forneça um event ID próprio na criação, justamente para manter entidades locais sincronizadas e evitar duplicações quando uma operação falha depois de ter sido aceita pelo servidor. citeturn0search4

## Sincronização

### Controle Fácil → Google

- criar: `events.insert`
- alterar: `events.update` ou `patch`
- excluir: excluir/cancelar o evento correspondente

### Google → Controle Fácil

- importar novos eventos;
- atualizar eventos alterados;
- remover localmente eventos cancelados.

## Regra de conflito

A entidade mantém:
- `google_event_id`
- `google_etag`
- `updated_at`
- `sync_version`

Se houver alteração externa, o sistema consulta novamente o evento antes de sobrescrever.

## Agenda padrão

A agenda principal pode ser referenciada pelo identificador `primary`; para outras agendas, o sistema deve usar o `calendarId` retornado pelo Google. citeturn0search4

## Importante

O Controle Fácil KM não deve copiar o antigo endpoint/estado OAuth do legado Movvant.

A nova integração terá:
- credenciais próprias;
- callback próprio;
- tabelas próprias;
- políticas próprias;
- logs próprios;
- nomenclatura própria.

## Segurança

Tokens OAuth nunca devem ficar em texto puro no Room ou em tabelas públicas.

No Android, quando aplicável, manter somente o material necessário para a sessão segura e usar armazenamento protegido pelo sistema.

No backend, segredos OAuth permanecem em secrets do ambiente.

## Interface

Na Agenda:
- status **Google conectado**;
- botão **Sincronizar agora**;
- data/hora da última sincronização;
- seleção de calendário;
- botão **Desconectar Google**;
- mensagem clara quando houver erro.

O usuário continua podendo usar a Agenda interna sem Google.
