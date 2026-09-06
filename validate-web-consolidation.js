const fs=require('fs');
const required=['dist/index.html','dist/commercial-intelligence.html','dist/commercial-intelligence-core.js','dist/enterprise-intelligence.js','dist/enterprise-rankings.js','dist/navigation-manifest.js','dist/access-scope.js','dist/historical-data-contract.js','dist/contract-profile.js','dist/product-catalog-contract.js','dist/sales-import-contract.js','dist/sales-fact-model.js','dist/visit-sales-link.js','dist/commercial-opportunity-engine.js','dist/shell-bridge.js'];
for(const f of required){if(!fs.existsSync(f))throw new Error(`Missing ${f}`)}
const main=fs.readFileSync('dist/index.html','utf8');
for(const text of ['MOVVANT_WEB_CONSOLIDATION_V1','/navigation-manifest.js','/access-scope.js','/historical-data-contract.js','/contract-profile.js','/product-catalog-contract.js','/sales-import-contract.js','/sales-fact-model.js','/visit-sales-link.js','/commercial-opportunity-engine.js','/shell-bridge.js']){if(!main.includes(text))throw new Error(`Missing shell integration: ${text}`)}
const html=fs.readFileSync('dist/commercial-intelligence.html','utf8');
for(const text of ['Inteligência Comercial','Movvant Enterprise','id="scope"','id="branch"','id="user"','Ranking de lojas','Ranking de vendedores','Clientes em risco','Oportunidades prioritárias','Eficiência de campo','Qualidade dos dados','enterprise-intelligence.js','enterprise-rankings.js']){if(!html.includes(text))throw new Error(`Missing dashboard item: ${text}`)}
const enterprise=fs.readFileSync('dist/enterprise-intelligence.js','utf8');
for(const text of ['aaqbwdrqmhuzqdesywze','sb.auth.getSession','user_role_assignments','roles(slug,name,scope_level)','companies','branches','profiles','visits','route_plans','historical_sales_facts','commercial_contract_profiles']){if(!enterprise.includes(text))throw new Error(`Missing Enterprise capability: ${text}`)}
const rankings=fs.readFileSync('dist/enterprise-rankings.js','utf8');
for(const text of ['commercial_dimension_monthly','branchRanking','sellerRanking','dimension_type','branch_code','margin_pct']){if(!rankings.includes(text))throw new Error(`Missing Enterprise ranking capability: ${text}`)}
const core=fs.readFileSync('dist/commercial-intelligence-core.js','utf8');
for(const text of ['MOVVANT_COMMERCIAL','visitValidationPct','routeCompletionPct','revenuePerVisit','revenuePerKm']){if(!core.includes(text))throw new Error(`Missing shared contract: ${text}`)}
const catalog=fs.readFileSync('dist/product-catalog-contract.js','utf8');
for(const text of ['MOVVANT_PRODUCT_CATALOG','productCode','resolveMaster','latest_sale']){if(!catalog.includes(text))throw new Error(`Missing product catalog capability: ${text}`)}
const salesFacts=fs.readFileSync('dist/sales-fact-model.js','utf8');
for(const text of ['MOVVANT_SALES_FACTS','aggregate','group','abc','marginPct','ticketAverage']){if(!salesFacts.includes(text))throw new Error(`Missing sales facts capability: ${text}`)}
const opp=fs.readFileSync('dist/commercial-opportunity-engine.js','utf8');
for(const text of ['MOVVANT_OPPORTUNITY','customerSignals','topOpportunities','executive','opportunityScore','strong_decline','inactive']){if(!opp.includes(text))throw new Error(`Missing opportunity engine capability: ${text}`)}
console.log('Movvant Web Consolidation V1: Enterprise backend + rankings + historical sales + risk/opportunity dashboard OK');
