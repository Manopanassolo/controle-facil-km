# Controle Fácil KM — Contrato de Sincronização Offline v1

## 1. Fonte operacional

O Android usa Room/SQLite como banco operacional local.

Toda alteração de negócio deve:
1. gravar a entidade local;
2. gerar/atualizar uma operação na outbox local;
3. refletir imediatamente na UI;
4. sincronizar posteriormente com o Supabase.

A nuvem nunca deve ser necessária para concluir uma operação normal de KM ou despesa.

## 2. Identidade

Toda entidade sincronizável recebe UUID antes do primeiro envio.

Formato:
`UUID`

Nunca usar ID incremental do servidor como identidade de sincronização.

## 3. Outbox local

Tabela Room:

`sync_outbox`

Campos mínimos:

- `id`: UUID da operação
- `entity_type`
- `entity_id`
- `operation`: INSERT | UPDATE | DELETE
- `payload_json`
- `created_at`
- `attempt_count`
- `last_attempt_at`
- `last_error`
- `status`: PENDING | PROCESSING | SYNCED | FAILED

Chave lógica recomendada:

`entity_type + entity_id`

Para INSERT/UPDATE, operações pendentes da mesma entidade podem ser compactadas em uma única operação UPDATE/UPSERT antes do envio.

## 4. Idempotência

O servidor deve receber o UUID original.

Exemplo:

```
trip 550e8400-e29b-41d4-a716-446655440000
```

Se a mesma operação for enviada duas vezes, o resultado final deve continuar sendo um único registro.

Usar UPSERT baseado na PK UUID quando a operação for de criação/atualização.

## 5. Ordem de sincronização

Quando houver dependências, respeitar:

1. profile
2. vehicle
3. expense_category
4. trip
5. trip_stop
6. expense
7. odometer_entry
8. attachment metadata
9. upload do arquivo do attachment

Uma despesa não deve ser enviada antes de seu veículo/categoria existirem no servidor.

## 6. Comprovantes

O metadata do attachment e o arquivo físico são operações distintas.

Fluxo:

1. criar attachment local;
2. registrar operação de metadata;
3. sincronizar metadata;
4. comprimir/preparar imagem;
5. enviar objeto para Storage;
6. confirmar upload;
7. atualizar `uploaded_at`;
8. marcar a operação local como concluída.

Se o upload falhar, o registro da despesa continua válido.

## 7. Conflitos

Cada entidade sincronizável possui:

- `version`
- `updated_at`
- `deleted_at`

Regra V1:

- criação: UUID único + upsert;
- alteração: versão mais recente;
- exclusão: soft-delete;
- entidade apagada remotamente não deve reaparecer por causa de uma operação antiga local.

Para alterações concorrentes da mesma entidade, o cliente deve refazer o pull do registro remoto antes de aplicar uma alteração posterior.

## 8. Viagens

Viagens em `completed` não devem ser recalculadas silenciosamente durante uma sincronização.

Se o usuário editar odômetro inicial/final:

1. atualizar a viagem;
2. recalcular distância;
3. registrar novo odometer_entry;
4. sincronizar as alterações na mesma sessão.

## 9. Odometragem

Nunca permitir que sincronização transforme um odômetro válido em valor menor por erro de ordenação de eventos.

Antes de aplicar alteração:

```
new_odometer >= previous_confirmed_odometer
```

Se a operação não puder ser aplicada com segurança, ela deve ir para `FAILED` com mensagem explícita para resolução.

## 10. Retry

Backoff recomendado:

- 1ª tentativa: imediato;
- 2ª: 30 s;
- 3ª: 2 min;
- 4ª: 10 min;
- 5ª: 30 min;
- posteriores: 1 h.

WorkManager deve usar restrição de rede.

Não fazer loop contínuo em caso de erro permanente.

## 11. Erros

Classificação:

### Temporário
- sem internet;
- timeout;
- erro 5xx;
- Storage indisponível.

Ação: retry.

### Autenticação
- sessão expirada;
- refresh token inválido.

Ação: renovar sessão ou solicitar novo login.

### Validação
- FK inexistente;
- ownership inválido;
- valor inválido;
- conflito de versão.

Ação: não repetir indefinidamente; registrar erro e exigir reconciliação.

## 12. Pull após push

Após uma sincronização bem-sucedida:

1. executar pull incremental;
2. atualizar registros locais;
3. resolver versões;
4. só então remover operações confirmadas da outbox.

## 13. Soft delete

Excluir localmente significa:

`deleted_at = now()`

e gerar DELETE na outbox.

No servidor o registro permanece até a política de retenção/limpeza futura.

Isso evita que um dispositivo offline ressuscite um registro apagado.

## 14. Segurança

O cliente Android usa somente credenciais apropriadas ao cliente Supabase.

Nunca colocar:
- service_role;
- senha administrativa;
- segredo de Storage;
- conexão direta PostgreSQL privilegiada

no APK.

RLS continua sendo a autoridade final para propriedade dos dados.

## 15. Testes obrigatórios

Antes da publicação:

- criar viagem offline;
- criar despesa offline;
- anexar comprovante offline;
- fechar viagem offline;
- ficar online e sincronizar;
- desligar internet durante upload;
- repetir sincronização;
- instalar em segundo aparelho;
- confirmar que os dados aparecem;
- alterar no aparelho A e depois no B;
- apagar offline e confirmar que não ressuscita;
- tentar acessar UUID de outro usuário e confirmar bloqueio.
