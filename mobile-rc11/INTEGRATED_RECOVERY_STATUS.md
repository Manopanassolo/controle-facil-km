# Movvant Mobile — recuperação integrada

O desenvolvimento passa a tratar visual e função como uma única entrega.

## Fechado neste bloco
- mapa com provedor Google explícito, ciclo de montagem mais seguro e centralização manual;
- GPS com início, acompanhamento, pausa, retorno e finalização preservados;
- Agenda com abertura de compromisso, criação, edição e exclusão local;
- compromissos remotos abrem em modo de leitura sem simular permissão de edição;
- fila offline e sincronização preservadas;
- padrão Visual 100 mantido.

O mapa ainda precisa de validação física em Android porque a falha anterior encerrava o processo nativo e não pode ser comprovada apenas por TypeScript/Expo Doctor.
