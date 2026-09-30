# Controle Fácil KM — Google Agenda Deployment Checklist

A integração Google Agenda está implementada no repositório, mas deve ser implantada em um projeto Supabase próprio do Controle Fácil KM. Não implantar a função no projeto do Movvant.

## Edge Function

Nome:
- `google-calendar`

Configuração:
- JWT obrigatório para chamadas do app.
- Exceção: callback OAuth precisa aceitar a chamada do Google sem JWT e validar o `state` armazenado. Se a função for implantada com JWT global desabilitado, a própria função valida o JWT em todas as operações do usuário.

Segredos:
- `CFKM_GOOGLE_CLIENT_ID`
- `CFKM_GOOGLE_CLIENT_SECRET`
- `CFKM_GOOGLE_CALLBACK_BASE_URL`
- `CFKM_APP_REDIRECT_URI`
- `SUPABASE_SERVICE_ROLE_KEY`

O client secret e service role nunca entram no APK.

## Google Cloud

Ativar:
- Google Calendar API

OAuth:
- aplicação separada do Movvant;
- client ID/secret próprios;
- callback apontando para a Edge Function do Controle Fácil KM;
- redirect final apontando para o deep link do Controle Fácil KM.

Escopos:
- `https://www.googleapis.com/auth/calendar.events`
- `https://www.googleapis.com/auth/calendar.calendarlist.readonly`

## Banco

Aplicar, nesta ordem:
1. `20260930000100_controle_facil_km_core.sql`
2. `20260930000200_calendar_and_plans.sql`
3. `20260930000300_secure_google_tokens.sql`
4. `20260930000400_google_calendar_oauth_state.sql`

## Testes obrigatórios

- conectar Google;
- callback com state inválido;
- callback com state expirado;
- conectar novamente a mesma conta;
- listar agendas;
- selecionar outra agenda;
- sincronizar duas vezes;
- sincronizar depois de alterar um evento no Google;
- cancelar evento no Google;
- invalidar sync token e confirmar full sync;
- desconectar;
- confirmar que tokens não aparecem para authenticated;
- confirmar que usuário A não consegue acessar eventos/conexões do usuário B;
- confirmar que nenhuma chamada usa credencial do Movvant.

## Anti-duplicação

A chave lógica é:
`connection_id + google_event_id`

O backend usa UPSERT nessa chave. A repetição de uma sincronização não cria um segundo registro para o mesmo evento Google.

