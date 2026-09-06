(function(g){
 const profile={
  key:'monthly-sales-export-v1',version:1,delimiter:',',decimalSeparator:'.',dateFormat:'DD/MM/YYYY',
  summaryRowRule:{whenAllEmpty:['Data Emissão','Cod. Produto','Operação'],action:'exclude'},
  columnMap:{
   date:'Data Emissão',branchName:'Empresa',productName:'Produto',customerName:'Cliente',quantity:'Quantidade',brand:'Marca',productGroup:'Grupo',grossRevenue:'Valor',insideSellerName:'Vendedor Interno',department:'Departamento',netMarginPct:'Margem líquida',sellerName:'Vendedor Externo',section:'Seção',city:'Cidade',subgroup:'Subgrupo',promotion:'Promoção',economicGroup:'Grupo Econômico',businessSegment:'Ramo de Atividade',invoice:'Documento',profit:'Lucro',productCode:'Cod. Produto',state:'UF',discount:'Desconto',freight:'Frete',operation:'Operação',personType:'Tipo de Pessoa',taxId:'CPF/CNPJ',linkedPerson:'Pessoa Vinculada',mix:'Mix',insideSupervisor:'Supervisor interno',customerCode:'Cod. Cliente',marginPct:'Margem',deliveryType:'Tipo de Entrega',grossProfit:'Lucro bruto',netProfit:'Lucro líquido',netRevenue:'Receita líquida',cost:'CMV',grossMarginPct:'Margem bruta',unitPrice:'Preço Un.',discountPct:'% Desconto',address:'Endereço',district:'Bairro',portfolioStatus:'Status Carteira',phone:'Telefone',mobile:'Celular',monthYear:'Mês/Ano'
  },
  operationRules:{sale:'Venda',return:'Devolução',futureSale:'Venda Futura',returnsAlreadySigned:true},
  privacy:{piiFields:['taxId','address','phone','mobile'],publicRepositoryPolicy:'never-store-source-rows-or-pii'}
 };
 g.MOVVANT_SALES_SOURCE_PROFILE=profile;
})(window);