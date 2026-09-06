(function(g){
  const nav=g.MOVVANT_WEB_NAV;
  if(!nav)return;
  const routeMap=new Map();
  nav.items.forEach(i=>{if(i.route)routeMap.set(i.key,i.route);(i.children||[]).forEach(c=>{if(c.route)routeMap.set(c.key,c.route)})});
  function go(item){
    if(item.href){location.href=item.href;return;}
    if(item.route){
      if(g.mvNavigationV164?.navigate){g.mvNavigationV164.navigate(item.route);return;}
      if(typeof g.show==='function'){g.show(item.route);return;}
      location.hash='#'+item.route;
    }
  }
  function ensureCommercialLink(){
    const existing=[...document.querySelectorAll('a,button')].find(el=>/inteligência comercial/i.test((el.textContent||'').trim()));
    if(existing)return;
    const candidates=[...document.querySelectorAll('#app nav,#app .nav,.classic-app-header nav,.desktop-nav,[data-nav]')];
    const host=candidates.find(el=>el.offsetParent!==null)||candidates[0];
    if(!host)return;
    const a=document.createElement('button');
    a.type='button';
    a.textContent='Inteligência Comercial';
    a.dataset.mvConsolidated='commercial';
    a.style.cssText='border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;padding:8px 10px;border-radius:8px';
    a.addEventListener('click',()=>go(nav.items.find(i=>i.key==='commercial')));
    host.appendChild(a);
  }
  function expose(){g.MOVVANT_WEB_SHELL={version:1,navigation:nav,go:key=>{const all=nav.items.flatMap(i=>[i,...(i.children||[])]);const item=all.find(x=>x.key===key);if(item)go(item);return !!item;}}}
  function boot(){expose();ensureCommercialLink();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('pageshow',boot,true);
})(window);
