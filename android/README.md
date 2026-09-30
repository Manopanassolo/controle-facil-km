# Controle Fácil KM — Android V1

Projeto Android nativo independente.

## Stack

- Kotlin
- Jetpack Compose
- Material 3
- Room
- WorkManager
- Supabase Auth/Postgres/Storage
- Android BiometricPrompt
- DataStore para preferências
- Google Calendar OAuth em backend separado

## Arquitetura

app
- ui/
- navigation/
- feature/
  - auth/
  - onboarding/
  - home/
  - trips/
  - expenses/
  - calendar/
  - reports/
  - vehicles/
  - settings/
  - plans/
- domain/
- data/
  - local/
  - remote/
  - repository/
  - sync/
- core/
  - security/
  - model/
  - util/

A UI nunca chama Supabase diretamente.

## Banco local

Room será a fonte operacional do dispositivo.

A sincronização utiliza WorkManager e uma outbox.

## Identidade

Package/applicationId planejado:
`br.com.controlefacil.km`

Antes da publicação, confirmar disponibilidade e registrar o applicationId definitivo.

## Regras

- sem código Movvant;
- sem dependência de organização;
- sem fleet enterprise;
- sem WebView como shell principal;
- offline-first;
- Google login opcional;
- Google Calendar opcional.
