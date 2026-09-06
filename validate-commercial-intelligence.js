const fs=require('fs');
const p='dist/commercial-intelligence.html';
if(!fs.existsSync(p))throw Error('commercial intelligence dashboard missing');
const s=fs.readFileSync(p,'utf8');
for(const x of ['INTELIGÊNCIA COMERCIAL','VISITAS VALIDADAS','ROTAS CONCLUÍDAS','RECEITA / VISITA','RECEITA / KM','Alertas comerciais','Detalhamento por colaborador','MOVVANT_COMMERCIAL_CONTRACT'])if(!s.includes(x))throw Error('commercial dashboard missing '+x);
const index=fs.readFileSync('dist/index.html','utf8');
if(!index.includes('mvCommercialIntelligenceLink')||!index.includes('/commercial-intelligence.html'))throw Error('commercial dashboard launcher missing');
console.log('Commercial intelligence dashboard validation OK');
