# Controle Fácil KM — Modelo de Dados v1

Este diretório define o núcleo de dados do aplicativo pessoal Controle Fácil KM.

## Independência

Este modelo não possui dependência de:
- Movvant;
- empresas ou tenants;
- frota empresarial;
- clientes, vendedores ou pedidos;
- roteirização empresarial;
- telemetria;
- geofencing empresarial.

## Banco remoto

- PostgreSQL via Supabase.
- Supabase Auth para identidade.
- RLS em todas as tabelas públicas.
- Storage privado `receipts` para comprovantes.
- Valores monetários em centavos.
- Odômetro e distância em metros.
- UUIDs gerados no cliente ou no banco.
- `version`, `updated_at` e `deleted_at` preparados para sincronização offline.

## Entidades

1. profiles
2. vehicles
3. trips
4. trip_stops
5. expense_categories
6. expenses
7. attachments
8. odometer_entries
9. user_settings

A fila operacional de sincronização deve permanecer no Room/SQLite do Android como `sync_outbox`.

## Regra offline-first

1. Gravar primeiro no Room.
2. Criar uma operação na outbox local.
3. Atualizar a interface imediatamente.
4. WorkManager sincroniza quando houver conectividade.
5. Enviar por UUID usando upsert/idempotência.
6. Confirmar o servidor.
7. Marcar a operação como sincronizada.
8. Manter soft-delete até a sincronização ser confirmada.

## Regras de segurança

Cada tabela privada possui RLS por `auth.uid()`.
Comprovantes são armazenados em bucket privado e o primeiro segmento do caminho é o UUID do usuário.
A chave `service_role` nunca deve ser distribuída no APK.

## Regra de consistência

- Viagem só pode usar veículo do mesmo usuário.
- Parada só pode pertencer a viagem do mesmo usuário.
- Despesa só pode usar veículo, categoria e viagem pertencentes ao mesmo usuário.
- Comprovante só pode apontar para despesa ou viagem do mesmo usuário.
- Odômetro só pode apontar para veículo e viagem do mesmo usuário.
- Distância é derivada do odômetro inicial/final.
