# Perfil da base de produtos recebida — 2026-09-06

Arquivo analisado: `Produtostodos.csv`.

## Estrutura observada
- 65.129 linhas
- 18.432 códigos de produto únicos
- 18.432 descrições únicas
- 10 departamentos
- 137 grupos
- 89 seções
- 59 subgrupos
- 252 marcas
- 24 unidades de medida

Campos recebidos:
- Cód. Produto
- Subgrupo
- Produto
- Marca
- Departamento
- Grupo
- Seção
- Saldo Estoque
- Custo Médio Un.
- Preço Un.
- Promoção Un.
- Un. de Medida

## Interpretação
A repetição de códigos em várias linhas indica que a base não deve ser tratada como um catálogo simples de uma linha por SKU. A ingestão deve separar:
1. dimensão mestre de produto, deduplicada por código;
2. fatos de estoque/preço/custo por contexto de origem;
3. regras específicas por contrato/cliente.

## Regra arquitetural
Nenhuma métrica comercial será fixa no código da aplicação. Cada cliente/contrato poderá configurar:
- dimensões relevantes (loja, vendedor, cliente, produto, marca, categoria etc.);
- métricas habilitadas;
- fórmulas;
- agregações;
- benchmarks;
- limites/alertas;
- peso/prioridade;
- direção desejada da métrica;
- apresentação Web/Mobile.

A base atual serve como primeiro perfil de produto para validar a arquitetura, não como modelo rígido para futuros clientes.

## Qualidade de dados observada
Existem valores extremos/anômalos em custo médio e grande repetição de SKU. Portanto, importação histórica deve incluir validação, quarentena de outliers e trilha de origem antes de alimentar KPIs financeiros.
