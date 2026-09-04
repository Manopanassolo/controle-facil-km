# Movvant Mobile RC11 — Contrato de Backend e Offline

## Objetivo
Separar interface, persistência local e sincronização remota. O app deve continuar utilizável sem internet e sincronizar quando a conexão voltar.

## Entidades mínimas
- agenda: compromissos, data/hora, loja, tipo, descrição, status, origem da sincronização.
- km: veículo, km inicial, km final, distância, motivo, usuário, loja, timestamps.
- deslocamentos: origem, destino, pontos, início, pausa, fim, distância, duração, status.
- usuários/permissões: perfil, função, lojas permitidas e módulos autorizados.

## Estratégia offline
1. Toda criação/edição salva primeiro no armazenamento local.
2. Cada registro recebe client_id, updated_at local e sync_status=pending.
3. Quando houver conexão, a fila envia alterações ao backend.
4. Após sucesso, sync_status=synced e remote_id é registrado.
5. Falhas ficam em retry, sem apagar dados locais.
6. Exclusões usam tombstone local até confirmação remota.

## Segurança
- Nunca incluir service_role no aplicativo.
- Cliente usa somente chave pública/publishable e sessão autenticada.
- RLS deve restringir dados por usuário/perfil/lojas autorizadas.
- Função do usuário não deve ser autorizada por user_metadata editável.
- Dados sensíveis devem ser lidos conforme permissões reais do backend.

## Agenda
- Calendário Movvant é independente da interface Google Agenda.
- Google Agenda é integração complementar.
- Compromissos continuam visíveis e editáveis offline.
- Sincronização externa deve ser idempotente e não gerar duplicatas.

## KM
- KM final deve ser >= KM inicial.
- Distância é calculada automaticamente.
- Registro salvo localmente mesmo offline.
- Histórico deve permitir filtro por período, colaborador, loja e veículo conforme permissão.

## Deslocamento
- Estado: idle -> running -> paused -> running -> finished.
- GPS deve ser persistido em intervalos adequados, sem depender de renderização da tela.
- Linha de ida azul; retorno laranja quando aplicável.
- Zoom e enquadramento manuais não podem ser sobrescritos continuamente.

## Relatórios
- Mobile mostra resumo primeiro e detalhe sob demanda.
- Exportação PDF/Excel fica como ação separada.
- Filtros: período, colaborador, loja, status.

## Próxima etapa
- adicionar adaptador Supabase;
- persistência local;
- conectividade/retry;
- GPS/mapa nativo;
- testes de navegação, offline e reconexão;
- gerar APK de homologação RC11.
