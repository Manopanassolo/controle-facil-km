# Perfil da base de produtos recebida

Arquivo analisado: `Produtostodos.csv`.

## Estrutura observada
- 65.129 linhas de fatos/snapshots.
- 18.432 códigos de produto únicos.
- Descrição/hierarquia é estável por código na amostra; variações aparecem principalmente em estoque, custo e preço.
- Dimensões disponíveis: Produto, Marca, Departamento, Grupo, Seção, Subgrupo e Unidade de Medida.
- Medidas disponíveis: Saldo de Estoque, Custo Médio Unitário, Preço Unitário e Promoção Unitária.

## Regra arquitetural
A base não será tratada como um catálogo universal do Movvant. Cada contrato possui catálogo, dimensões, unidades, métricas, benchmarks e regras próprias.

A arquitetura deve separar:
1. **Produto mestre do contrato**: código, descrição, marca e hierarquia.
2. **Fatos comerciais/estoque/preço**: registros por origem, loja, snapshot e período.
3. **Perfil configurável do contrato**: dimensões habilitadas, métricas, fórmulas, pesos, alertas e experiência Web/Mobile.

## Consequências
- Nenhuma métrica de produto é obrigatória para todos os clientes, exceto identificador e descrição mínimos para catálogo.
- Hierarquias podem variar por contrato; Departamento > Grupo > Seção > Subgrupo é apenas a configuração inicial desta base.
- Unidade de medida deve ser preservada, pois contratos podem operar em UN, ML, CAR, PAR, JG, CX, PC, CT ou outras unidades.
- Preço e custo devem ser tratados como fatos contextualizados, não atributos imutáveis do produto mestre.
- Duplicidade de código em múltiplas linhas não deve gerar produtos duplicados; deve gerar fatos separados quando houver contexto de origem/loja/snapshot.
- Futuras importações devem exigir um `contractId` e aceitar `sourceId`, `branchId` e `snapshotAt` quando disponíveis.
