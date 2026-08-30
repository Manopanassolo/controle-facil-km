const fs=require('fs');
const s=fs.readFileSync('dist/index.html','utf8');
const required=[
  'v162.82',
  'mvTopNavV16282',
  'mvMenuToggleV16282',
  'mvBackV16282',
  'mvHomeV16282',
  'mv_last_page_v16282',
  'mv_nav_stack_v16282',
  "window.addEventListener('popstate'",
  'mv-nav-collapsed-v16282',
  'globalThis.mvNavigationV16282'
];
const missing=required.filter(x=>!s.includes(x));
if(missing.length){console.error('Navigation validation failed. Missing:',missing);process.exit(1)}

// Pages are created both in the base HTML and by later runtime modules (for example
// Recursos/Assinatura). Accept either quote style because generated modules use both.
const pageIds=[...s.matchAll(/id=["']p-([a-z0-9_-]+)["']/gi)].map(m=>m[1]);
const pages=[...new Set(pageIds)];
if(!pages.includes('inicio')||!pages.includes('viagem')||!pages.includes('historico')){
  console.error('Navigation validation failed: core pages missing',pages);process.exit(1)
}

// Only literal page targets count. Ignore selector/template fragments such as '+p+'
// and CSS.escape expressions embedded in generated JavaScript.
const navButtons=[...s.matchAll(/data-p=["']([a-z0-9_-]+)["']/gi)].map(m=>m[1]);
const targets=[...new Set(navButtons)];
const invalid=targets.filter(x=>!pages.includes(x));
if(invalid.length){console.error('Navigation validation failed: buttons without pages',invalid);process.exit(1)}
console.log('Navigation validation OK:',pages.length,'pages and',targets.length,'literal navigation targets');