# Movvant Mobile RC11 — Homologação integrada

Estado: desenvolvimento funcional fechado; homologação física no Android ainda necessária antes de classificar como 100% homologado.

Escopo integrado ativo:
- login e sessão autenticados via Supabase;
- carga empresarial com cache local e operação offline;
- Home executiva com dados reais/locais e navegação mobile;
- Agenda mensal com visitas remotas, compromissos locais, inclusão, edição e exclusão local;
- fila da Agenda sem duplicação da mesma alteração local;
- KM com veículos atribuídos, validação de hodômetro, histórico e captura/preview real da foto;
- deslocamento GPS endurecido, mapa Google, pausa, retorno, finalização, recentralização e persistência local;
- carteira de lojas/clientes respeitando escopo empresarial;
- relatórios operacionais com indicadores reais e compartilhamento;
- notificações reais e confirmação de leitura;
- sincronização persistente para sync_queue/sync-apply, com idempotência;
- configurações persistentes, logout e sincronização automática protegida;
- navegação inferior e menu lateral conforme direção visual aprovada.

Validação técnica dos blocos integrados: Expo Doctor + TypeScript + Expo config aprovados nos workflows de integração.

Próxima etapa: Quality Gate do HEAD final e, após aprovação explícita do usuário para subir a homologação, geração do APK RC11 para teste físico no Android. O APK não deve ser tratado como produção até a homologação física do GPS, câmera, Agenda, offline/sync e sessão.
