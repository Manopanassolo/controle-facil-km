const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const js=`
// v163.30 brand helper only; desktop geometry handled exclusively by v16303.
(function(){
 const byId=id=>document.getElementById(id);
 function installBrand(){
   const bar=byId('mvTopNavV16282');if(!bar)return;
   let brand=byId('mvHeaderBrand127');
   if(!brand){brand=document.createElement('div');brand.id='mvHeaderBrand127';brand.className='mv-headerbrand127';brand.innerHTML='<span class="mv-brandmark127">M</span><span><strong>Movvant</strong><small>Inteligência comercial em campo</small></span>';const title=byId('mvPageTitleV16282');bar.insertBefore(brand,title||bar.children[1]||null)}
   const side=document.querySelector('#app>.nav .mv-sidebrand89');if(side){side.setAttribute('aria-hidden','true')}
 }
 function sync(){installBrand()}
 [0,80,220,600,1200].forEach(ms=>setTimeout(sync,ms));addEventListener('pageshow',sync,true);addEventListener('resize',()=>requestAnimationFrame(sync));
 globalThis.mvShellV16327={sync};
})();
`;
if(!s.includes('carga();'))throw new Error('v163.30 brand anchor');s=s.replace('carga();',js+'\ncarga();');
const css=`
/* v163.30 shared branding only */
#mvTopNavV16282 .mv-headerbrand127{display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important}.mv-brandmark127{display:grid!important;place-items:center!important;width:29px!important;height:29px!important;flex:0 0 29px!important;border-radius:50%!important;background:#fff!important;color:#0d4ea6!important;font-weight:850!important;font-size:13px!important}.mv-headerbrand127>span:last-child{display:grid!important;line-height:1.05!important}.mv-headerbrand127 strong{font-size:14px!important}.mv-headerbrand127 small{margin-top:3px!important;font-size:8px!important;white-space:nowrap!important}
@media(max-width:899px){.mv-headerbrand127 small{display:none!important}}
`;
if(!s.includes('</style>'))throw new Error('v163.30 brand css anchor');s=s.replace('</style>',css+'\n</style>');fs.writeFileSync('dist/index.html',s);console.log('Movvant v163.30: obsolete desktop sidebar rules neutralized');
