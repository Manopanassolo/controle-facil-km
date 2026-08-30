const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const css=`
/* v162.64: native focus fallback keeps the stop editor usable even if legacy rerenders replace JS-bound nodes. */
#p-viagem #directRouteStackV127 .mv-stop-v16262:focus-within .pre-stop-entry-v127{display:grid!important}
#p-viagem #directRouteStackV127 .mv-stop-v16262:focus-within .mv-stop-toggle-v16262 b{visibility:hidden!important;position:relative!important}
#p-viagem #directRouteStackV127 .mv-stop-v16262:focus-within .mv-stop-toggle-v16262 b:after{content:'Fechar';visibility:visible!important;position:absolute!important;left:0!important;top:0!important}
`;
if(!s.includes('</style>'))throw new Error('v162.64 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.64: stop editor native focus fallback installed');
