const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const css=`
/* v162.87.1: only one mobile navigation system may own the bottom edge */
@media(max-width:820px){
  #mvBottomV16249{display:none!important;visibility:hidden!important;pointer-events:none!important}
  #mvBottomDock85{display:grid!important;visibility:visible!important;pointer-events:auto!important;z-index:240!important}
}
`;
if(!s.includes('</style>'))throw new Error('v162.87.1 css anchor not found');
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.87.1: legacy mobile nav removed; reference bottom dock is authoritative');