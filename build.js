const fs=require('fs');
fs.mkdirSync('dist',{recursive:true});
let s=fs.readFileSync('index.html','utf8');
// Browser-safe stabilization: `window.status` is a native string in some browsers.
// Never rely on legacy named-element globals for the connection badge.
s=s.replace(/\bstatus\.textContent/g,"$('status').textContent")
   .replace(/\bstatus\.className/g,"$('status').className")
   .replace('Gestão de deslocamentos · versão 100.2','Gestão de deslocamentos · versão 100.3');
fs.writeFileSync('dist/index.html',s);
console.log('Controle KM v100.3: browser-safe status binding published to dist');
