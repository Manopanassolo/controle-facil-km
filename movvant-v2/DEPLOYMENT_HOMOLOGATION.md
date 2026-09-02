# Movvant V2 — implantação de homologação

## Objetivo

Disponibilizar a RC da Movvant V2 em uma URL separada para homologação manual, sem substituir a aplicação legada, sem tocar na `main` e sem publicar produção automaticamente.

## Estrutura escolhida

- Hospedagem da V2 em **Cloudflare Pages**.
- Projeto Pages exclusivo: `movvant-v2-homologacao`.
- Código da aplicação: `movvant-v2/`.
- Branch de homologação: `movvant-v2-rebuild`.
- Build estático dedicado com `CLOUDFLARE_PAGES=true`.
- Saída publicada: `movvant-v2/out`.
- Workflow: `Movvant V2 Cloudflare Pages Homologation`.
- O Worker legado `movvant` permanece independente e não é modificado pelo workflow da V2.

## Credenciais

O workflow reutiliza apenas os secrets Cloudflare já esperados pelo repositório:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Nenhuma credencial é gravada no código.

## Criação segura do Pages

O workflow consulta os projetos Pages da conta. Se `movvant-v2-homologacao` ainda não existir, cria esse projeto com `movvant-v2-rebuild` como branch de produção do **projeto de homologação**. Em seguida publica somente o diretório `out` gerado pela V2.

Isso não altera a `main`, o Worker legado, o domínio principal ou a aplicação atual.

## Domínio e DNS

O DNS continua integralmente no Cloudflare. A ordem recomendada é:

1. validar primeiro a URL `pages.dev` gerada pelo projeto `movvant-v2-homologacao`;
2. conectar depois um subdomínio isolado, preferencialmente `homologacao.<dominio>` ou `v2.<dominio>`;
3. manter o domínio principal apontando para o sistema atual durante toda a homologação;
4. só planejar a troca do domínio principal depois da aprovação final e da persistência/autenticação controladas.

## Gate

1. CI/guard/typecheck da V2 verdes.
2. Build estático Cloudflare Pages verde.
3. Projeto `movvant-v2-homologacao` isolado criado/confirmado.
4. Deploy Pages da branch `movvant-v2-rebuild` concluído.
5. Validar a URL Pages em desktop e celular.
6. Conectar subdomínio de homologação no Cloudflare.
7. Homologar novamente pelo domínio.
8. Só depois iniciar persistência/autenticação.

## Regra permanente

Vercel não faz parte da arquitetura oficial da Movvant V2. A publicação da V2 é Cloudflare-first. Não reutilizar o Worker legado `movvant` como hospedagem da V2 enquanto a RC estiver em homologação.
