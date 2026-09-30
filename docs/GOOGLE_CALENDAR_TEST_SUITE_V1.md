# Controle Fácil KM — Google Calendar Automated Test Suite v1

## Objetivo

Estrutura oficial da suíte automatizada da integração Google Agenda.

A suíte é dividida em:

1. **Unit** — regras puras e determinísticas.
2. **Integration** — interação entre OAuth, Edge Function, Google Calendar API e persistência Supabase.
3. **Golden Test** — fluxo completo ponta a ponta.

## Regra de isolamento

Os testes desta suíte pertencem exclusivamente ao Controle Fácil KM.

Não reutilizar:

- credenciais do Movvant;
- tabelas do Movvant;
- `organization_id`;
- OAuth client do Movvant;
- callback do Movvant;
- tokens armazenados em tabelas acessíveis ao usuário.

---

## Estrutura

```
android/
  app/
    src/
      test/
        kotlin/br/com/controlefacil/km/googlecalendar/
          unit/
            OAuthStateTest.kt
            SyncTokenPolicyTest.kt
            EventIdentityTest.kt
            SyncRecoveryTest.kt
      androidTest/
        kotlin/br/com/controlefacil/km/googlecalendar/
          integration/
            GoogleCalendarOAuthIntegrationTest.kt
            CalendarSelectionIntegrationTest.kt
            CalendarSyncIntegrationTest.kt
            TokenRecoveryIntegrationTest.kt
            DuplicatePreventionIntegrationTest.kt
            SecurityIsolationIntegrationTest.kt
          golden/
            GoogleCalendarGoldenTest.kt

supabase/
  functions/
    google-calendar/
      test/
        fixtures/
          google-calendar-fixtures.ts
          oauth-fixtures.ts
          sync-fixtures.ts
        mocks/
          google-calendar-api.mock.ts
          supabase.mock.ts

docs/
  GOOGLE_CALENDAR_TEST_SUITE_V1.md
  CONTROLE_FACIL_KM_GOOGLE_CALENDAR_DEPLOYMENT_V1.md
```

---

# 1. Testes unitários

Local: `android/app/src/test/`

Os testes unitários não devem acessar internet, Google, Supabase ou credenciais reais.

## 1.1 OAuthStateTest.kt

Casos iniciais:

- `acceptsValidState`
- `rejectsUnknownState`
- `rejectsExpiredState`
- `rejectsAlreadyUsedState`
- `stateCannotBeReusedAfterSuccess`

Objetivo:

Validar as regras de segurança do state OAuth sem depender do Google.

---

## 1.2 SyncTokenPolicyTest.kt

Casos iniciais:

- `initialSyncDoesNotSendSyncToken`
- `incrementalSyncUsesStoredSyncToken`
- `successfulSyncReplacesPreviousSyncToken`
- `calendarChangeClearsPreviousSyncToken`
- `disconnectClearsSyncState`

Objetivo:

Garantir que `nextSyncToken` seja utilizado somente no contexto correto.

---

## 1.3 EventIdentityTest.kt

Casos iniciais:

- `sameGoogleEventIdMapsToSameLocalIdentity`
- `sameEventIsNotInsertedTwice`
- `differentGoogleEventsRemainDistinct`
- `sameGoogleEventCanBeUpdatedWithoutChangingIdentity`

Chave lógica esperada:

`connection_id + google_event_id`

---

## 1.4 SyncRecoveryTest.kt

Casos iniciais:

- `410RequiresFullSync`
- `410ClearsInvalidSyncToken`
- `successfulFullSyncProducesNewSyncToken`
- `410RecoveryDoesNotLoopWhenFullSyncSucceeds`
- `validIncrementalSyncDoesNotTriggerFullSync`

Objetivo:

Garantir a máquina de estados da recuperação do HTTP 410.

---

# 2. Testes de integração

Local: `android/app/src/androidTest/`

Esses testes utilizarão um ambiente dedicado de homologação.

Nunca executar contra o projeto Supabase do Movvant.

## 2.1 GoogleCalendarOAuthIntegrationTest.kt

Casos:

- `connectGoogleAccount`
- `cancelGoogleAuthorization`
- `rejectInvalidState`
- `rejectExpiredState`
- `rejectReusedState`
- `reconnectSameGoogleAccountWithoutDuplicateConnection`

Dependências:

- OAuth Client de homologação;
- Supabase CFKM;
- Google Calendar API.

---

## 2.2 CalendarSelectionIntegrationTest.kt

Casos:

- `listsAvailableCalendars`
- `selectsPrimaryCalendar`
- `selectsReadableCalendar`
- `rejectsCalendarFromAnotherUser`
- `changingCalendarResetsSyncToken`

---

## 2.3 CalendarSyncIntegrationTest.kt

Casos:

- `performsInitialSync`
- `handlesEmptyCalendar`
- `importsTimedEvent`
- `importsAllDayEvent`
- `importsEventLocationAndDescription`
- `processesPagination`
- `importsNewEventIncrementally`
- `updatesChangedEventIncrementally`
- `processesCancelledEvent`

---

## 2.4 TokenRecoveryIntegrationTest.kt

Casos:

- `storesNextSyncTokenAfterInitialSync`
- `usesNextSyncTokenForIncrementalSync`
- `recoversFromHttp410Automatically`
- `performsFullSyncAfter410`
- `storesNewTokenAfterRecovery`
- `doesNotReconnectGoogleAfterRecoverable410`
- `doesNotLoopAfterSuccessful410Recovery`

O 410 deve ser simulado/controlado no ambiente de teste. Não depender de corromper aleatoriamente a conta Google real.

---

## 2.5 DuplicatePreventionIntegrationTest.kt

Casos:

- `repeatedSyncDoesNotDuplicateEvents`
- `sameGoogleEventIdIsUpserted`
- `networkRetryDoesNotDuplicateEvents`
- `eventUpdateDoesNotCreateSecondRecord`
- `concurrentSyncDoesNotCreateDuplicates`

Validação obrigatória:

`COUNT(connection_id, google_event_id) = 1`

---

## 2.6 SecurityIsolationIntegrationTest.kt

Casos:

- `userCannotReadAnotherUsersConnection`
- `userCannotReadAnotherUsersEvents`
- `userCannotReadOAuthSecrets`
- `revokedConnectionCannotSync`
- `disconnectRemovesServerSideTokens`
- `googleCalendarFlowHasNoMovvantDependency`

---

# 3. Fixtures

Local:

`supabase/functions/google-calendar/test/fixtures/`

## google-calendar-fixtures.ts

Deve conter:

- calendário principal;
- calendário secundário;
- calendário somente leitura;
- evento normal;
- evento de dia inteiro;
- evento com localização;
- evento cancelado;
- página 1;
- página 2;
- resposta com `nextSyncToken`;
- resposta HTTP 410.

## oauth-fixtures.ts

Deve conter estados artificiais:

- state válido;
- state inválido;
- state expirado;
- state já utilizado;
- código OAuth de teste.

Nenhum refresh token real deve ser versionado.

## sync-fixtures.ts

Deve conter:

- token inicial;
- token incremental;
- token inválido;
- evento novo;
- evento alterado;
- evento cancelado;
- resposta paginada;
- resposta 410.

---

# 4. Mocks

## google-calendar-api.mock.ts

Responsável por simular:

- `calendarList.list`;
- `events.list`;
- paginação;
- evento novo;
- evento alterado;
- evento cancelado;
- HTTP 410;
- token atualizado.

## supabase.mock.ts

Responsável por simular:

- conexão;
- OAuth state;
- OAuth secrets;
- eventos;
- UPSERT;
- RLS;
- desconexão.

---

# 5. Golden Test

Local:

`android/app/src/androidTest/kotlin/br/com/controlefacil/km/googlecalendar/golden/GoogleCalendarGoldenTest.kt`

Nome do caso principal:

`completeGoogleCalendarLifecycle`

Sequência:

1. Autenticar usuário de homologação.
2. Conectar Google.
3. Validar conexão.
4. Listar calendários.
5. Selecionar calendário.
6. Executar sincronização inicial.
7. Criar evento no Google.
8. Executar sincronização incremental.
9. Alterar o evento.
10. Executar sincronização.
11. Cancelar o evento.
12. Executar sincronização.
13. Repetir sincronização sem alterações.
14. Validar ausência de duplicidades.
15. Forçar HTTP 410 em ambiente controlado.
16. Validar recuperação automática.
17. Validar full sync.
18. Validar novo `nextSyncToken`.
19. Executar nova sincronização incremental.
20. Desconectar Google.
21. Validar revogação.

## Critério de aprovação

O Golden Test só passa quando:

- OAuth funciona;
- calendário é selecionado;
- sincronização inicial funciona;
- sincronização incremental funciona;
- alterações funcionam;
- cancelamentos funcionam;
- HTTP 410 é recuperado automaticamente;
- novo token é armazenado;
- repetição não cria duplicatas;
- desconexão funciona;
- isolamento de usuário permanece íntegro.

---

# 6. Ordem de implementação

### Fase A — Unit

1. OAuthStateTest
2. SyncTokenPolicyTest
3. EventIdentityTest
4. SyncRecoveryTest

### Fase B — Mocks

5. OAuth fixtures
6. Calendar fixtures
7. Sync fixtures
8. Google API mock
9. Supabase mock

### Fase C — Integration

10. OAuth integration
11. Calendar selection
12. Initial/incremental sync
13. Token/410 recovery
14. Duplicate prevention
15. Security isolation

### Fase D — Golden

16. Complete lifecycle
17. Evidence/reporting
18. Homologation gate

---

# 7. Gate de homologação

O pipeline deve separar os resultados em:

- UNIT — obrigatório;
- INTEGRATION — obrigatório quando ambiente de homologação estiver disponível;
- GOLDEN — obrigatório antes da liberação da integração.

Um teste que não pôde ser executado por falta de ambiente deve ser marcado como **BLOCKED**, nunca como PASS.

Nenhum segredo Google, Supabase service-role key, access token ou refresh token deve ser commitado no repositório.
