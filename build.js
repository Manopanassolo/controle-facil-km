const fs=require('fs');
fs.mkdirSync('dist',{recursive:true});
let s=fs.readFileSync('index.html','utf8');
// Browser-safe stabilization: `window.status` is a native string in some browsers.
// Restore the last user-homologated frontend while keeping backend schema work intact.
s=s.replace(/\bstatus\.textContent/g,"$('status').textContent")
   .replace(/\bstatus\.className/g,"$('status').className")
   .replace('Gestão de deslocamentos · versão 100.2','Gestão de deslocamentos · versão 100.6');
fs.writeFileSync('dist/index.html',s);
console.log('Controle KM v100.6: stable frontend restored and published to dist');
