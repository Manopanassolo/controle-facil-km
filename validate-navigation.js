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
const pageIds=[...s.matchAll(/<section id="p-([^"]+)"/g)].map(m=>m[1]);
if(!pageIds.includes('inicio')||!pageIds.includes('viagem')||!pageIds.includes('historico')){console.error('Navigation validation failed: core pages missing',pageIds);process.exit(1)}
const navButtons=[...s.matchAll(/data-p="([^"]+)"/g)].map(m=>m[1]);
const invalid=[...new Set(navButtons)].filter(x=>!pageIds.includes(x));
if(invalid.length){console.error('Navigation validation failed: buttons without pages',invalid);process.exit(1)}
console.log('Navigation validation OK:',pageIds.length,'pages and',new Set(navButtons).size,'navigation targets');