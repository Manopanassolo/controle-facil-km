const fs=require('fs');
const s=fs.readFileSync('dist/index.html','utf8');
const required=[
  'v164.0: single canonical navigation authority',
  'mvMenu164',
  'mv_last_page_v164',
  "addEventListener('popstate'",
  'globalThis.mvNavigationV164',
  "document.body.dataset.mvNavAuthority='164.2'",
  "if(typeof show==='function'){show(p);lifecycle=true}",
  "function navigate(p){return showPage(p,{historyMode:p===current?'replace':'push'})}",
  "closest?.('[data-p]')",
  "closest?.('[data-page]')"
];
const forbidden=[
  'v162.82 performance hotfix: persistent navigation',
  'mv_nav_stack_v16282',
  'globalThis.mvNavigationV16282',
  'v162.9 clean mobile menu built on top of the stable shell only',
  'mvWebLayoutV16325',
  'mvShellV16327'
];
const missing=required.filter(x=>!s.includes(x));
if(missing.length){console.error('Navigation validation failed. Missing canonical markers:',missing);process.exit(1)}
const legacy=forbidden.filter(x=>s.includes(x));
if(legacy.length){console.error('Navigation validation failed. Legacy navigation still present:',legacy);process.exit(1)}
const pageIds=[...s.matchAll(/id=["']p-([a-z0-9_-]+)["']/gi)].map(m=>m[1]);
const pages=[...new Set(pageIds)];
if(!pages.includes('inicio')||!pages.includes('viagem')||!pages.includes('historico')||!pages.includes('agenda')){console.error('Navigation validation failed: core pages missing',pages);process.exit(1)}
const navButtons=[...s.matchAll(/data-(?:p|mvroute|page164)=["']([a-z0-9_-]+)["']/gi)].map(m=>m[1]);
const targets=[...new Set(navButtons)];
const invalid=targets.filter(x=>!pages.includes(x));
if(invalid.length){console.error('Navigation validation failed: buttons without pages',invalid);process.exit(1)}
console.log('Navigation validation OK: canonical v164.2 direct lifecycle authority,',pages.length,'pages and',targets.length,'literal navigation targets');
