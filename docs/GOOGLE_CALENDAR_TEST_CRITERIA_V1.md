# Google Calendar — Critérios de Sucesso da Suíte v1

## Regra principal

Um teste só é **PASS** quando sua asserção automatizada é executada e satisfeita.

Criar o arquivo, compilar parcialmente ou revisar o código não conta como PASS.

Estados permitidos:

- PASS
- FAIL
- BLOCKED

## Unit

### OAuthStateTest

PASS quando:

- state correto e dentro da validade é aceito;
- hash/state incorreto é rejeitado;
- state expirado é rejeitado;
- state já usado é rejeitado;
- o mesmo state não pode ser consumido duas vezes.

### SyncTokenPolicyTest

PASS quando:

- sincronização inicial não envia token;
- sincronização incremental envia o token armazenado;
- sincronização bem-sucedida substitui o token anterior;
- troca de calendário limpa o token anterior;
- recuperação de 410 inicia full sync sem o token inválido.

### EventIdentityTest

PASS quando:

- `connection_id + google_event_id` identifica um único evento;
- mesmo evento é atualizado por UPSERT;
- dois Google Event IDs permanecem distintos;
- o mesmo Google Event ID em conexões diferentes permanece distinto.

### SyncRecoveryTest

PASS quando:

- HTTP 410 limpa o token inválido;
- HTTP 410 exige full sync;
- full sync bem-sucedido gera novo token;
- depois da recuperação, a próxima sincronização é incremental;
- a recuperação não entra em loop.

## Integration

PASS somente com ambiente de homologação CFKM configurado.

Deve validar:

- OAuth real;
- Google Calendar API;
- Edge Function;
- Supabase;
- RLS;
- persistência;
- sincronização;
- HTTP 410 controlado;
- ausência de duplicidades.

## Golden Test

PASS somente quando todo o ciclo completar sem intervenção manual:

OAuth → calendário → sync inicial → novo evento → alteração → cancelamento → repetição → 410 → full sync → novo token → sync incremental → desconexão.

## Bloqueadores

O teste deve ser FAIL/BLOCKED, nunca PASS, quando houver:

- token exposto ao cliente;
- acesso entre usuários;
- duplicidade de evento;
- loop de 410;
- mistura entre calendários;
- dependência do Movvant;
- falha na recuperação de token.

## Nota de implementação

Os testes unitários criados inicialmente usam contratos locais mínimos para validar comportamento.

Quando os serviços reais de OAuth/sincronização forem implementados, esses contratos devem ser extraídos para produção e os testes devem passar a testar as classes reais, evitando manter uma implementação duplicada somente dentro dos arquivos de teste.
