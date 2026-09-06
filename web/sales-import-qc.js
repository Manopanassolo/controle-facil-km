(function(g){
 function isSummaryRow(row,profile){const fields=profile?.summaryRowRule?.whenAllEmpty||[];return fields.length>0&&fields.every(k=>String(row[k]??'').trim()==='');}
 function validateCanonical(row){const issues=[];if(!row.date)issues.push('missing_date');if(!row.productCode)issues.push('missing_product');if(!row.operation)issues.push('missing_operation');if(row.quantity===0&&row.netRevenue===0)issues.push('zero_line');return issues;}
 function classifyProductMatch(code,catalogSet){if(!code)return'missing_code';return catalogSet?.has?.(String(code))?'matched':'not_in_catalog';}
 function summarize(rows){const out={rows:rows.length,returns:0,futureSales:0,netRevenue:0,cost:0,profit:0};for(const r of rows){if(r.operation==='Devolução')out.returns++;if(r.operation==='Venda Futura')out.futureSales++;out.netRevenue+=Number(r.netRevenue||0);out.cost+=Number(r.cost||0);out.profit+=Number(r.netProfit??r.profit??0);}out.marginPct=out.netRevenue?out.profit/out.netRevenue*100:0;return out;}
 g.MOVVANT_SALES_QC={isSummaryRow,validateCanonical,classifyProductMatch,summarize};
})(window);