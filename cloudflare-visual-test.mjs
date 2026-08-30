import fs from 'node:fs';
import http from 'node:http';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const base = process.env.MOVVANT_URL || 'https://movvant.panassolofilho.workers.dev';
const localHtmlPath = new URL('./dist/index.html', import.meta.url);
const localHtml = fs.readFileSync(localHtmlPath, 'utf8');
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
const server = http.createServer((req,res)=>{
  if(req.url?.startsWith('/api/')){
    res.writeHead(404,{'content-type':'application/json'});res.end('{"qa":"api checked separately"}');return;
  }
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
  res.end(localHtml);
});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));

const browser = await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context = await browser.newContext({viewport:{width:390,height:844},userAgent:'Mozilla/5.0 (Linux; Android 16; SM-S948B) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',isMobile:true,hasTouch:true,deviceScaleFactor:1});
const page = await context.newPage();
page.setDefaultTimeout(5000);
const result={checkpoints:[]};
const mark=async(name)=>{result.checkpoints.push(name);console.log('CHECKPOINT',name);try{await page.screenshot({path:'/tmp/movvant-'+name+'.png',fullPage:false,timeout:5000})}catch{}};
try {
  console.log('CHECKPOINT preflight');
  const preflight=await context.request.get(base+'/',{timeout:15000,failOnStatusCode:false});
  const liveHtml=await preflight.text();
  result.preflight={status:preflight.status(),ok:preflight.ok(),liveSha:sha(liveHtml),localSha:sha(localHtml),sameAsset:sha(liveHtml)===sha(localHtml)};
  if(!preflight.ok())throw new Error('Cloudflare preflight HTTP '+preflight.status());
  if(!result.preflight.sameAsset)throw new Error('Live Cloudflare HTML differs from exact local production candidate');
  if(!liveHtml.includes('v162.62'))throw new Error('Live Cloudflare HTML missing v162.62 marker');

  console.log('CHECKPOINT render');
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:15000});
  await page.waitForTimeout(2200);
  const shell=await page.evaluate(()=>{
    const auth=document.getElementById('auth'),app=document.getElementById('app'),trip=document.getElementById('p-viagem'),form=document.getElementById('novaViagem'),route=document.getElementById('directRouteStackV127');
    if(auth)auth.classList.add('hide');
    if(app){app.classList.remove('hide');app.style.setProperty('display','block','important');app.style.setProperty('visibility','visible','important')}
    document.body.classList.add('mv-trip-active-v16247');document.body.dataset.mvRoute='viagem';
    for(const root of [trip,form,route]){if(!root)continue;let n=root;while(n&&n!==document.body){n.classList?.remove('hide');n.style?.setProperty('display','block','important');n.style?.setProperty('visibility','visible','important');n.style?.setProperty('opacity','1','important');n=n.parentElement}}
    const o=document.getElementById('origem'),d=document.getElementById('destino');
    for(const el of [o,d]){if(!el)continue;el.classList.remove('mv-legacy-route-input-v16260');el.style.setProperty('display','block','important');el.style.setProperty('visibility','visible','important');el.style.setProperty('opacity','1','important')}
    route?.scrollIntoView({block:'center'});
    return {app:!!app,trip:!!trip,form:!!form,route:!!route,origin:!!o,destination:!!d,cleanOrigin:o?.dataset.mvCleanV16261==='1',cleanDestination:d?.dataset.mvCleanV16261==='1'};
  });
  Object.assign(result,{shell});
  if(!shell.app||!shell.trip||!shell.form||!shell.route||!shell.origin||!shell.destination||!shell.cleanOrigin||!shell.cleanDestination)throw new Error('v162.62 trip shell incomplete: '+JSON.stringify(shell));
  await page.waitForTimeout(300);
  await mark('pretap');
  const diag=await page.evaluate(()=>{
    const o=document.getElementById('origem'),d=document.getElementById('destino');
    const rect=o?.getBoundingClientRect();
    const cx=rect?Math.max(1,Math.min(innerWidth-2,rect.left+rect.width/2)):0;
    const cy=rect?Math.max(1,Math.min(innerHeight-2,rect.top+rect.height/2)):0;
    const hit=rect?document.elementFromPoint(cx,cy):null;
    const cs=o?getComputedStyle(o):null;
    return {rect:rect?{x:rect.x,y:rect.y,width:rect.width,height:rect.height}:null,cx,cy,hitTag:hit?.tagName||'',hitId:hit?.id||'',hitClass:typeof hit?.className==='string'?hit.className:'',display:cs?.display||'',visibility:cs?.visibility||'',opacity:cs?.opacity||'',pointerEvents:cs?.pointerEvents||'',disabled:!!o?.disabled,readOnly:!!o?.readOnly,destinationVisible:!!d&&!!(d.offsetWidth||d.offsetHeight||d.getClientRects().length)};
  });
  Object.assign(result,{diag});console.log('DIAG',JSON.stringify(diag));
  if(!diag.rect||diag.rect.width<20||diag.rect.height<20)throw new Error('Origem has no usable visible rect');
  await page.evaluate(()=>{const o=document.getElementById('origem');o.value='';o.focus({preventScroll:true})});
  await page.keyboard.insertText('Avenida Paulista');
  await page.waitForTimeout(350);
  const keyboard=await page.evaluate(()=>{const o=document.getElementById('origem');return {value:o?.value||'',active:document.activeElement===o}});
  Object.assign(result,{keyboard});console.log('KEYBOARD',JSON.stringify(keyboard));
  await page.evaluate(()=>document.activeElement?.blur?.());
  await page.touchscreen.tap(diag.cx,diag.cy);
  await page.waitForTimeout(250);
  const touch=await page.evaluate(()=>{const o=document.getElementById('origem'),r=o.getBoundingClientRect(),hit=document.elementFromPoint(Math.max(1,Math.min(innerWidth-2,r.left+r.width/2)),Math.max(1,Math.min(innerHeight-2,r.top+r.height/2)));return {active:document.activeElement===o,hitId:hit?.id||'',hitTag:hit?.tagName||''}});
  Object.assign(result,{touch});console.log('TOUCH',JSON.stringify(touch));

  const stopBefore=await page.evaluate(()=>{
    const row=document.querySelector('#directRouteStackV127 .route-point-v126.stops');
    const add=document.getElementById('mvStopToggleV16262')||document.getElementById('preTripStopAddV127');
    const list=document.getElementById('preTripStopsListV127');
    const rr=row?.getBoundingClientRect(),ar=add?.getBoundingClientRect();
    return {row:rr?{w:rr.width,h:rr.height}:null,add:ar?{w:ar.width,h:ar.height}:null,text:(row?.innerText||'').trim(),listText:(list?.innerText||'').trim()};
  });
  result.stopBefore=stopBefore;console.log('STOP_BEFORE',JSON.stringify(stopBefore));
  const opener=page.locator('#mvStopToggleV16262').first();
  if(await opener.count()){
    await opener.click({timeout:4000});
    await page.waitForTimeout(250);
  }
  const stopAfter=await page.evaluate(()=>{
    const row=document.querySelector('#directRouteStackV127 .route-point-v126.stops');
    const entry=document.querySelector('#directRouteStackV127 .pre-stop-entry-v127');
    const toggle=document.getElementById('mvStopToggleV16262');
    const input=document.getElementById('preTripStopNameV127');
    const add=document.getElementById('preTripStopAddV127');
    const rr=row?.getBoundingClientRect(),er=entry?.getBoundingClientRect(),tr=toggle?.getBoundingClientRect(),ir=input?.getBoundingClientRect(),ar=add?.getBoundingClientRect();
    return {row:rr?{w:rr.width,h:rr.height}:null,entry:er?{w:er.width,h:er.height}:null,toggle:tr?{w:tr.width,h:tr.height}:null,input:ir?{w:ir.width,h:ir.height}:null,add:ar?{w:ar.width,h:ar.height}:null,entryVisible:!!entry&&!!(entry.offsetWidth||entry.offsetHeight||entry.getClientRects().length),open:!!row?.classList.contains('mv-stop-open-v16262'),text:(row?.innerText||'').trim()};
  });
  result.stopAfter=stopAfter;console.log('STOP_AFTER',JSON.stringify(stopAfter));
  await mark('stop-open');

  const final=await page.evaluate(()=>{
    const o=document.getElementById('origem'),d=document.getElementById('destino'),route=document.getElementById('directRouteStackV127'),old=document.getElementById('mvOrigemNativeV16260');
    return {originEditable:!!o&&!o.disabled&&!o.readOnly,destinationEditable:!!d&&!d.disabled&&!d.readOnly,pointer:o?getComputedStyle(o).pointerEvents:'none',originVisible:!!o&&!!(o.offsetWidth||o.offsetHeight||o.getClientRects().length),destinationVisible:!!d&&!!(d.offsetWidth||d.offsetHeight||d.getClientRects().length),routeVisible:!!route&&!!(route.offsetWidth||route.offsetHeight||route.getClientRects().length),cleanOrigin:o?.dataset.mvCleanV16261==='1',cleanDestination:d?.dataset.mvCleanV16261==='1',oldProxyPresent:!!old,versionMarker:document.documentElement.innerHTML.includes('v162.62')};
  });
  Object.assign(result,{final});
  const compactStop=!!stopBefore.row&&stopBefore.row.h<=95&&(!stopBefore.add||stopBefore.add.h<=44)&&!stopBefore.listText.includes('Sem paradas. Adicione somente se fizer parte do percurso.');
  const cleanEditor=stopAfter.open&&stopAfter.entryVisible&&(!stopAfter.toggle||stopAfter.toggle.h<=44)&&(!stopAfter.input||stopAfter.input.h<=52)&&(!stopAfter.add||stopAfter.add.h<=44);
  result.stopChecks={compactStop,cleanEditor};
  result.pass=result.preflight.sameAsset&&keyboard.value==='Avenida Paulista'&&keyboard.active&&touch.active&&touch.hitId==='origem'&&final.originEditable&&final.destinationEditable&&final.pointer!=='none'&&final.originVisible&&final.destinationVisible&&final.routeVisible&&final.cleanOrigin&&final.cleanDestination&&!final.oldProxyPresent&&final.versionMarker&&compactStop&&cleanEditor;
  fs.writeFileSync('/tmp/movvant-visual-result.json',JSON.stringify(result,null,2));
  await page.screenshot({path:'/tmp/movvant-android.png',fullPage:false,timeout:5000});
  console.log('RESULT',JSON.stringify(result));
  if(!result.pass)process.exitCode=1;
} catch(e){
  result.pass=false;result.error=String(e?.message||e);console.error(e.stack||e);
  try{await page.screenshot({path:'/tmp/movvant-android-failure.png',fullPage:false,timeout:5000})}catch{}
  fs.writeFileSync('/tmp/movvant-visual-result.json',JSON.stringify(result,null,2));
  process.exitCode=1;
} finally {
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
