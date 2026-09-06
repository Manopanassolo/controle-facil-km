const fs=require('fs');
const required=['dist/index.html','dist/commercial-intelligence.html','dist/commercial-intelligence-core.js'];
for(const f of required){if(!fs.existsSync(f))throw new Error(`Missing ${f}`)}
const html=fs.readFileSync('dist/commercial-intelligence.html','utf8');
for(const text of ['Inteligência Comercial','Agenda','Deslocamentos / Rotas','KM','Relatórios','Administração','Receita / KM']){if(!html.includes(text))throw new Error(`Missing dashboard item: ${text}`)}
const core=fs.readFileSync('dist/commercial-intelligence-core.js','utf8');
for(const text of ['MOVVANT_COMMERCIAL','visitValidationPct','routeCompletionPct','revenuePerVisit','revenuePerKm']){if(!core.includes(text))throw new Error(`Missing shared contract: ${text}`)}
console.log('Movvant Web Consolidation V1: OK');
