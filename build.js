const fs=require('fs');
const path=require('path');
fs.mkdirSync('dist',{recursive:true});
let main=fs.readFileSync('index.html','utf8');
const marker='<!-- MOVVANT_WEB_CONSOLIDATION_V1 -->';
if(!main.includes(marker)){
  const scripts=`\n${marker}\n<script src="/navigation-manifest.js"></script>\n<script src="/access-scope.js"></script>\n<script src="/historical-data-contract.js"></script>\n<script src="/contract-profile.js"></script>\n<script src="/product-catalog-contract.js"></script>\n<script src="/sales-source-profile-v1.js"></script>\n<script src="/sales-import-qc.js"></script>\n<script src="/sales-import-contract.js"></script>\n<script src="/sales-fact-model.js"></script>\n<script src="/visit-sales-link.js"></script>\n<script src="/commercial-opportunity-engine.js"></script>\n<script src="/shell-bridge.js"></script>\n`;
  if(main.includes('</body>'))main=main.replace('</body>',scripts+'</body>');else main+=scripts;
}
fs.writeFileSync('dist/index.html',main);
const webFiles=['commercial-intelligence.html','commercial-intelligence-core.js','authenticated-intelligence.js','enterprise-intelligence.js','enterprise-rankings.js','navigation-manifest.js','access-scope.js','historical-data-contract.js','contract-profile.js','product-catalog-contract.js','sales-source-profile-v1.js','sales-import-qc.js','sales-import-contract.js','sales-fact-model.js','visit-sales-link.js','commercial-opportunity-engine.js','shell-bridge.js'];
for(const name of webFiles){const src=path.join('web',name);if(!fs.existsSync(src))throw new Error(`Missing web consolidation asset: ${src}`);fs.copyFileSync(src,path.join('dist',name));}
console.log('Movvant canonical build: existing Web + Movvant Enterprise intelligence + rankings + historical sales + opportunity/risk engine -> dist');
