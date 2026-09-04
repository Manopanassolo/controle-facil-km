# Movvant Mobile RC11 — Bloco 4

## Implementado
- Dependências nativas para localização, armazenamento offline, conectividade e mapa.
- Permissões de localização configuradas para Android/iOS via Expo.
- Chave do Google Maps fora do código, preparada para variável de ambiente no EAS.
- Serviço de persistência local e fila de sincronização (`src/offline.ts`).
- Serviço de localização em primeiro plano e cálculo incremental de distância (`src/location.ts`).

## Integração pendente deste bloco
- Substituir o mapa ilustrativo do `App.tsx` pelo componente de mapa nativo.
- Ligar Agenda/KM à fila offline já criada.
- Validar o endpoint/tabelas do Supabase quando o acesso voltar a responder.
- Configurar a variável `GOOGLE_MAPS_API_KEY` no ambiente EAS antes do APK de homologação.

## Critérios de aceite
1. Autorizar GPS no primeiro uso do Deslocamento.
2. Iniciar rota usando posição real.
3. Zoom e pan não podem recentralizar automaticamente após interação do usuário.
4. Percurso de ida em azul e retorno em laranja.
5. Pausar/continuar/finalizar sem perder pontos já capturados.
6. Sem internet, Agenda/KM/Deslocamento salvam localmente.
7. Ao reconectar, pendências são sincronizadas sem duplicidade.
8. Nenhuma chave privilegiada fica no APK ou no repositório.
