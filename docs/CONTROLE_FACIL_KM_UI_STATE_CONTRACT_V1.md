# Controle Fácil KM — Contrato de UI/Estado V1

## Estado de sessão

`signed_out | signing_in | signed_in | expired`

## Estado de sincronização

`offline | pending | syncing | synced | error`

## Estado Google Agenda

`disconnected | connecting | connected | syncing | error | revoked`

## Estado de assinatura

`free | premium | pending | expired`

## Regras

### Offline

Toda operação de:
- viagem;
- despesa;
- agenda local;
- veículo;
- configuração

deve funcionar sem rede quando possível.

### Sincronização

O usuário pode continuar usando o app durante sincronização.

A UI deve informar:
- o que está pendente;
- se houve erro;
- quando foi a última sincronização.

### Exclusão

Excluir uma entidade gera soft delete local e operação de sincronização.

### Erros

Erro de rede não deve bloquear cadastro.

Erro de validação deve aparecer no campo correspondente.

Erro de autenticação deve levar ao fluxo de sessão.

### Navegação

Nenhuma tela interna deve depender do histórico do navegador para voltar.

A navegação Android terá stack explícita.

### Dados

A UI nunca acessa Supabase diretamente.

Fluxo:

UI
→ ViewModel
→ Use Case
→ Repository
→ Room / Sync
→ Supabase
