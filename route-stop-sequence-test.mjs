import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const html=fs.readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
const server=http.createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 16; SM-S948B) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'});
const page=await context.newPage();page.setDefaultTimeout(7000);
const calls=[];
await page.route('**/api/routes',async route=>{
  const req=route.request();let body={};try{body=JSON.parse(req.postData()||'{}')}catch{}
  calls.push(body);
  const optimize=!!body.optimize;
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,items:[{distanceMeters:123400,duration:optimize?'7000s':'7600s',hasTolls:false,tollTotalBRL:0,optimizedIntermediateWaypointIndex:optimize?[1,0]:[],legs:[]} ]})});
});
const out={};
try{
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(2200);
  await page.evaluate(()=>{document.getElementById('auth')?.classList.add('hide');const app=document.getElementById('app');if(app){app.classList.remove('hide');app.style.display='block'};document.body.dataset.mvRoute='viagem';try{show?.('viagem')}catch{};try{ensureDirectRouteV127?.()}catch{};document.getElementById('p-viagem')?.classList.remove('hide');document.getElementById('novaViagem')?.classList.remove('hide')});
  await page.waitForTimeout(400);
  await page.evaluate(()=>{const o=document.getElementById('origem'),d=document.getElementById('destino');if(o)o.value='Galvão, SC, Brasil';if(d)d.value='Florianópolis, SC, Brasil';const r=document.getElementById('routeRoundTripV132');if(r)r.checked=true});
  const input=page.locator('#preTripStopNameV127');const add=page.locator('#preTripStopAddV127');
  if(!await input.count()||!await add.count())throw new Error('stop editor missing');
  await input.fill('Chapecó, SC, Brasil');await add.click();await page.waitForTimeout(150);
  await input.fill('Concórdia, SC, Brasil');await add.click();await page.waitForTimeout(250);
  const before=await page.evaluate(()=>({rows:[...document.querySelectorAll('#preTripStopsListV127 .pre-stop-row-v127 b')].map(x=>x.textContent.trim()),source:globalThis.mvRouteStopsV16270?.()}));
  out.before=before;if(before.rows.length!==2||before.source?.length!==2)throw new Error('two visible stops not in unified source: '+JSON.stringify(before));
  await page.locator('#routePlanBtnV131').click();await page.waitForSelector('[data-seq70]');await page.waitForTimeout(300);
  const result=await page.evaluate(()=>{const cards=[...document.querySelectorAll('[data-seq70]')].map(x=>x.innerText);const f=document.getElementById('mvGoogleRouteFrameV16270');return {cards,frameSrc:f?.src||'',status:document.getElementById('routeMapStatusV133')?.textContent||'',options:(globalThis.mvRouteOptionsV16270||[]).map(o=>o.stops)}});
  out.result=result;out.calls=calls;
  const decoded=decodeURIComponent(result.frameSrc);
  out.pass=result.cards.length>=2&&result.cards.some(x=>x.includes('Chapecó'))&&result.cards.some(x=>x.includes('Concórdia'))&&decoded.includes('Chapecó')&&decoded.includes('Concórdia')&&result.status.includes('2 paradas')&&calls.some(x=>Array.isArray(x.stops)&&x.stops.length===2&&!x.optimize)&&calls.some(x=>Array.isArray(x.stops)&&x.stops.length===2&&x.optimize);
  await page.screenshot({path:'/tmp/movvant-route-stops.png',fullPage:true});
  fs.writeFileSync('/tmp/movvant-route-stops.json',JSON.stringify(out,null,2));
  console.log(JSON.stringify(out));if(!out.pass)process.exitCode=1;
}catch(e){out.pass=false;out.error=String(e?.message||e);try{await page.screenshot({path:'/tmp/movvant-route-stops-failure.png',fullPage:true})}catch{}fs.writeFileSync('/tmp/movvant-route-stops.json',JSON.stringify(out,null,2));console.error(e.stack||e);process.exitCode=1}finally{await browser.close();await new Promise(r=>server.close(r))}
