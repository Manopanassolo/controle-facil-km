const fs=require('fs');
fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('index.html','dist/index.html');
fs.copyFileSync('commercial-intelligence.html','dist/commercial-intelligence.html');
let html=fs.readFileSync('dist/index.html','utf8');
const launcher=`<script>document.addEventListener('DOMContentLoaded',()=>{const nav=document.querySelector('.nav')||document.getElementById('topMenu');if(nav&&!document.getElementById('mvCommercialIntelligenceLink')){const b=document.createElement('button');b.id='mvCommercialIntelligenceLink';b.type='button';b.textContent='◎ Inteligência Comercial';b.addEventListener('click',()=>location.href='/commercial-intelligence.html');nav.appendChild(b)}});</script>`;
if(!html.includes('mvCommercialIntelligenceLink'))html=html.replace('</body>',launcher+'\n</body>');
fs.writeFileSync('dist/index.html',html);
console.log('Movvant canonical build: index + commercial intelligence dashboard -> dist');
