const fs=require('fs');
const path=require('path');
fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('index.html','dist/index.html');
const webFiles=['commercial-intelligence.html','commercial-intelligence-core.js'];
for(const name of webFiles){const src=path.join('web',name);if(!fs.existsSync(src))throw new Error(`Missing web consolidation asset: ${src}`);fs.copyFileSync(src,path.join('dist',name));}
console.log('Movvant canonical build: index.html + consolidated web modules -> dist');
