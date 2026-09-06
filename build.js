const fs=require('fs');
const path=require('path');
fs.mkdirSync('dist',{recursive:true});
let main=fs.readFileSync('index.html','utf8');
const marker='<!-- MOVVANT_WEB_CONSOLIDATION_V1 -->';
if(!main.includes(marker)){
  const scripts=`\n${marker}\n<script src="/navigation-manifest.js"></script>\n<script src="/access-scope.js"></script>\n<script src="/historical-data-contract.js"></script>\n<script src="/contract-profile.js"></script>\n<script src="/product-catalog-contract.js"></script>\n<script src="/shell-bridge.js"></script>\n`;
  if(main.includes('</body>'))main=main.replace('</body>',scripts+'</body>');else main+=scripts;
}
fs.writeFileSync('dist/index.html',main);
const webFiles=['commercial-intelligence.html','commercial-intelligence-core.js','authenticated-intelligence.js','navigation-manifest.js','access-scope.js','historical-data-contract.js','contract-profile.js','product-catalog-contract.js','shell-bridge.js'];
for(const name of webFiles){const src=path.join('web',name);if(!fs.existsSync(src))throw new Error(`Missing web consolidation asset: ${src}`);fs.copyFileSync(src,path.join('dist',name));}
console.log('Movvant canonical build: existing Web + authenticated intelligence + contract profile + configurable product catalog -> dist');
