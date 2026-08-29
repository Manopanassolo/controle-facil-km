const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');

const from=`window.addEventListener('unhandledrejection',function(e){
 const el=document.getElementById('am'); if(el){el.classList.remove('hide');el.classList.add('err');el.textContent='Falha ao iniciar: '+((e.reason&&e.reason.message)||e.reason||'erro desconhecido');}
});`;
const to=`window.addEventListener('unhandledrejection',function(e){
 const authEl=document.getElementById('auth'),appEl=document.getElementById('app');
 const waitingForLogin=!!authEl&&!authEl.classList.contains('hide')&&(!appEl||appEl.classList.contains('hide'));
 if(waitingForLogin){console.warn('Inicialização secundária aguardando autenticação:',e.reason);return;}
 const el=document.getElementById('am'); if(el){el.classList.remove('hide');el.classList.add('err');el.textContent='Falha ao iniciar: '+((e.reason&&e.reason.message)||e.reason||'erro desconhecido');}
});`;
if(!s.includes(from))throw new Error('v162.1 unhandled rejection anchor not found');
s=s.replace(from,to);
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.1: login startup rejection guard applied');
