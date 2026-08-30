const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const css=`
/* v162.88.1: mobile drawer visibility authority */
@media(max-width:899px){
  body.mv-menu-open-v16282 #app>.nav{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:fixed!important;left:10px!important;right:10px!important;top:62px!important;bottom:76px!important;width:auto!important;height:auto!important;max-height:none!important;overflow:auto!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;padding:10px!important;margin:0!important;border-radius:12px!important;background:#071a31!important;z-index:260!important;transform:none!important}
  body.mv-menu-open-v16282 #app>.nav [data-p],body.mv-menu-open-v16282 #app>.nav button{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
  body:not(.mv-menu-open-v16282) #app>.nav.mv-nav-collapsed-v16282{display:none!important;visibility:hidden!important;pointer-events:none!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.88.1 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.88.1: mobile drawer visibility authority installed');