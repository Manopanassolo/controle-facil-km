(function(g){
 const SCHEMA_VERSION='1.0';
 const required={sales:['date','productCode','quantity','netRevenue'],products:['productCode','description']};
 const optional={sales:['customerCode','sellerCode','branchCode','grossRevenue','cost','discount','orderCode'],products:['brand','category','family','unit','cost','salePrice','active']};
 const aliases={date:['data','dt_venda','emissao'],productCode:['codigo','cod_produto','sku','produto_codigo'],quantity:['quantidade','qtd'],netRevenue:['valor','valor_liquido','venda_liquida','total'],customerCode:['cliente','cod_cliente'],sellerCode:['vendedor','cod_vendedor'],branchCode:['loja','filial','cod_loja'],description:['descricao','produto','nome']};
 const key=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 function mapHeaders(headers,kind){const out={};for(const target of [...required[kind],...optional[kind]]){const candidates=[target,...(aliases[target]||[])].map(key);const found=headers.find(h=>candidates.includes(key(h)));if(found)out[target]=found;}return out;}
 function validate(headers,kind){const mapping=mapHeaders(headers,kind);return{schemaVersion:SCHEMA_VERSION,kind,mapping,missing:required[kind].filter(x=>!mapping[x]),ready:required[kind].every(x=>mapping[x])};}
 function joinKey(row,mapping){return String(row[mapping.productCode]??'').trim();}
 g.MOVVANT_HISTORY={SCHEMA_VERSION,required,optional,mapHeaders,validate,joinKey};
})(window);