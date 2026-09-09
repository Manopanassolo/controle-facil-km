# Movvant V2 — Backend Readiness

## Estado atual

A V2 permanece deliberadamente em `memory-only`. Nenhum cliente Supabase, chave, sessão remota, tabela ou Storage é usado pelo runtime desta branch.

A conexão real só deve acontecer em uma branch Supabase de desenvolvimento isolada. A inspeção feita em 01/09/2026 encontrou o projeto existente sem development branches; por isso nenhuma alteração de banco foi executada.

## Regra de transição

1. Criar uma branch Supabase dedicada para a V2 antes de qualquer DDL ou Auth.
2. Manter `main` e o projeto legado sem alterações durante a homologação.
3. Implementar autenticação Next.js por cookie usando o pacote Supabase recomendado para SSR na versão vigente.
4. Nunca tomar decisão de autorização a partir de `user_metadata` editável pelo usuário.
5. Todas as tabelas expostas devem ter RLS habilitado, grants mínimos e policies específicas por operação.
6. UPDATE deve ter policy de SELECT compatível e usar `USING` + `WITH CHECK`.
7. Chave secreta/service role nunca entra no cliente ou em variável pública.
8. Storage de documentos/sinistros será conectado somente depois das policies de objeto e testes de acesso.
9. Após DDL: executar advisors de segurança/performance e testes de acesso antes de migrar qualquer dado real.

## Contrato de entidades

O runtime já separa os domínios que serão persistidos: perfil, equipe/condutor, veículo, agenda, rota, jornada, despesa, documento, manutenção e sinistro. `src/services/backend-contract.ts` define a porta de persistência sem criar dependência externa.

## Modelo de autorização previsto

- Todo registro operacional pertence a uma organização.
- O usuário autenticado possui um `user_id`; função e escopo vêm de dados administrativos não editáveis pelo próprio usuário.
- RLS deve validar organização + permissão efetiva, não apenas `TO authenticated`.
- Funções administrativas terão policies distintas das operações de vendedor/condutor/financeiro.
- Alterações sensíveis devem ter trilha de auditoria imutável no backend.

## Critério para ligar o backend

A conexão só é permitida quando: branch Supabase isolada existir, schema/policies forem revisados, CI/E2E da V2 estiver verde e a homologação frontend estiver preservada em commit identificável. Até lá, `BACKEND_RUNTIME_MODE` deve continuar `memory-only`.
