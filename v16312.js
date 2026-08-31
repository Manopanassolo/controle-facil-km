const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const css=`
@media(min-width:900px){
 #mvDesktopNav132.mv-grouped140{height:38px!important;top:64px!important;padding:0!important;background:transparent!important;box-shadow:none!important;justify-content:center!important;align-items:center!important}
 #mvDesktopNav132.mv-grouped140 .mv-navgroups140{width:auto!important;min-width:520px!important;max-width:680px!important;grid-template-columns:repeat(4,auto)!important;justify-content:center!important;gap:18px!important;margin:0 auto!important;padding:0 14px!important}
 .mv-menugroup140{height:30px!important;align-items:center!important}
 .mv-menutrigger140{width:auto!important;min-width:96px!important;height:30px!important;padding:0 12px!important;font-size:11px!important;border-radius:6px!important}
 .mv-submenu140{top:34px!important;min-width:190px!important;padding:6px!important}
 .mv-submenu140 button{padding:8px 10px!important;font-size:11px!important}
 #app{inset:110px 0 0 0!important}
}
`;
s=s.replace('</style>',css+'\n</style>');
fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.41 compact centered desktop menu');
