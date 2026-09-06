const fs=require('fs');
const required=['dist/index.html','dist/commercial-intelligence.html','dist/commercial-intelligence-core.js','dist/navigation-manifest.js','dist/shell-bridge.js'];
for(const f of required){if(!fs.existsSync(f))throw new Error(`Missing ${f}`)}
const main=fs.readFileSync('dist/index.html','utf8');
for(const text of ['MOVVANT_WEB_CONSOLIDATION_V1','/navigation-manifest.js','/shell-bridge.js']){if(!main.includes(text))throw new Error(`Missing shell integration: ${text}`)}
const html=fs.readFileSync('dist/commercial-intelligence.html','utf8');
for(const text of ['Inteligência Comercial','Agenda','Deslocamentos / Rotas','KM','Relatórios','Administração','Receita / KM']){if(!html.includes(text))throw new Error(`Missing dashboard item: ${text}`)}
const core=fs.readFileSync('dist/commercial-intelligence-core.js','utf8');
for(const text of ['MOVVANT_COMMERCIAL','visitValidationPct','routeCompletionPct','revenuePerVisit','revenuePerKm']){if(!core.includes(text))throw new Error(`Missing shared contract: ${text}`)}
const nav=fs.readFileSync('dist/navigation-manifest.js','utf8');
for(const text of ['Home','Inteligência Comercial','Agenda','Deslocamentos / Rotas','Abastecimentos / Despesas','Relatórios','Clientes','Veículos','Administração','Usuários','Equipes','Lojas','Aprovações','Configurações']){if(!nav.includes(text))throw new Error(`Missing navigation item: ${text}`)}
const bridge=fs.readFileSync('dist/shell-bridge.js','utf8');
for(const text of ['MOVVANT_WEB_SHELL','mvNavigationV164','Inteligência Comercial']){if(!bridge.includes(text))throw new Error(`Missing shell bridge capability: ${text}`)}
console.log('Movvant Web Consolidation V1: shell + intelligence + navigation OK');
