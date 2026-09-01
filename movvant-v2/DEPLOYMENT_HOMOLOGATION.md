# Movvant V2 — implantação de homologação

## Objetivo

Disponibilizar a RC da Movvant V2 em uma URL separada para homologação manual, sem substituir a aplicação legada, sem tocar na `main` e sem publicar produção automaticamente.

## Estrutura escolhida

- Projeto Vercel novo e exclusivo para a V2.
- Root Directory do projeto: `movvant-v2`.
- Branch de homologação: `movvant-v2-rebuild`.
- Deploy via workflow manual `Movvant V2 Manual Vercel Preview`.
- O workflow não usa `--prod`.
- O domínio personalizado entra somente depois do primeiro preview separado ser validado.

## Credenciais esperadas no GitHub Actions

As credenciais devem existir apenas como secrets do repositório e nunca ser commitadas:

- `MOVVANT_V2_VERCEL_TOKEN`
- `MOVVANT_V2_VERCEL_ORG_ID`
- `MOVVANT_V2_VERCEL_PROJECT_ID`

## Domínio e Cloudflare

O DNS continua administrado no Cloudflare. Depois que o projeto V2 separado estiver estável e o domínio/subdomínio escolhido for adicionado ao projeto Vercel, o Cloudflare deve apontar somente esse hostname para o alvo indicado pela Vercel.

Não alterar o Worker legado `movvant` para hospedar a V2. Não reutilizar o projeto Vercel antigo `controle-km-homologacao` para a RC.

## Estratégia de domínio recomendada

Durante homologação, usar um subdomínio separado, por exemplo `homologacao.<dominio>` ou `v2.<dominio>`. O domínio principal permanece onde está até a aprovação completa da V2.

## Gate

1. Criar projeto Vercel V2 separado com Root Directory `movvant-v2`.
2. Registrar os três secrets de deploy.
3. Rodar manualmente o workflow de preview.
4. Validar URL Vercel em desktop e celular.
5. Adicionar subdomínio de homologação no projeto Vercel.
6. Ajustar apenas o registro DNS desse subdomínio no Cloudflare.
7. Homologar novamente pelo domínio.
8. Só depois iniciar persistência/autenticação.
