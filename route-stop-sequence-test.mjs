import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const html=fs.readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
const server=http.createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 16; SM-S948B) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'});
const page=await context.newPage();page.setDefaultTimeout(9000);
const calls=[];
await page.route('**/api/routes',async route=>{
  let body={};try{body=JSON.parse(route.request().postData()||'{}')}catch{}calls.push(body);
  let items;
  if(body.origin==='Florianópolis, SC, Brasil'&&body.destination==='Galvão, SC, Brasil'&&Array.isArray(body.stops)&&body.stops.length===0){items=[{distanceMeters:110000,duration:'6500s',hasTolls:true,tollTotalBRL:11.40,optimizedIntermediateWaypointIndex:[],legs:[]},{distanceMeters:120000,duration:'7000s',hasTolls:false,tollTotalBRL:0,optimizedIntermediateWaypointIndex:[],legs:[]}];}
  else{items=[{distanceMeters:123400,duration:body.optimize?'7000s':'7600s',hasTolls:true,tollTotalBRL:11.40,optimizedIntermediateWaypointIndex:body.optimize?[1,0]:[],legs:[]}];}
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,items})});
});
const out={};
try{
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(2300);
  await page.evaluate(()=>{document.getElementById('auth')?.classList.add('hide');const app=document.getElementById('app');if(app){app.classList.remove('hide');app.style.display='block'};document.body.dataset.mvRoute='viagem';try{show?.('viagem')}catch{};try{ensureDirectRouteV127?.()}catch{};document.getElementById('p-viagem')?.classList.remove('hide');document.getElementById('novaViagem')?.classList.remove('hide')});
  await page.waitForTimeout(400);
  await page.evaluate(()=>{const o=document.getElementById('origem'),d=document.getElementById('destino');if(o)o.value='Galvão, SC, Brasil';if(d)d.value='Florianópolis, SC, Brasil';const r=document.getElementById('routeRoundTripV132');if(r)r.checked=true});
  const toggle=page.locator('#mvStopToggleV16262');if(await toggle.count()){await toggle.click();await page.waitForTimeout(200)}
  const input=page.locator('#preTripStopNameV127'),add=page.locator('#preTripStopAddV127');await input.scrollIntoViewIfNeeded();await input.fill('Chapecó, SC, Brasil');await add.click();await page.waitForTimeout(120);await input.fill('Concórdia, SC, Brasil');await add.click();await page.waitForTimeout(220);
  const before=await page.evaluate(()=>({rows:[...document.querySelectorAll('#preTripStopsListV127 .pre-stop-row-v127 b')].map(x=>x.textContent.trim()),source:globalThis.mvRouteStopsV16270?.()}));out.before=before;if(before.rows.length!==2||before.source?.length!==2)throw new Error('two stops missing from route source: '+JSON.stringify(before));
  const plan=page.locator('#mvPlanRouteV16272');await plan.waitFor();await plan.scrollIntoViewIfNeeded();await plan.click();await page.waitForSelector('[data-route72]');await page.waitForSelector('#mvPlannerModesV16273');await page.waitForTimeout(300);
  const customTab=page.locator('[data-mode73="custom"]');await customTab.click();await page.waitForSelector('#mvCustomPlannerV16273:not(.hide)');await page.locator('[data-segment73]').first().click();await page.waitForTimeout(150);
  const result=await page.evaluate(()=>{const cards=[...document.querySelectorAll('[data-route72]')].map(x=>x.innerText),f=document.getElementById('mvGoogleRouteFrameV16272');return {cards,frameSrc:f?.src||'',status:document.getElementById('routeMapStatusV133')?.textContent||'',options:(globalThis.mvRouteOptionsV16272||[]).map(o=>({distance:o.item.distanceMeters,duration:o.item.duration,toll:o.item.tollTotalBRL,stops:o.stops})),modes:[...document.querySelectorAll('[data-mode73]')].map(x=>x.textContent.trim()),points:[...document.querySelectorAll('.mv-point73')].map(x=>x.innerText),segments:[...document.querySelectorAll('[data-segment73]')].map(x=>x.innerText),editor:document.getElementById('mvSegmentEditor73')?.innerText||''}});out.result=result;out.calls=calls;
  const decoded=decodeURIComponent(result.frameSrc),dists=result.options.map(o=>o.distance);
  out.pass=result.cards.length>=2&&result.cards.some(x=>x.includes('Opção de rota'))&&result.cards.every(x=>x.includes('Total ida + volta'))&&dists.every(x=>x>200000)&&result.cards.some(x=>x.includes('233,4 km'))&&decoded.includes('Chapecó')&&decoded.includes('Concórdia')&&result.status.includes('ida e volta')&&result.modes.some(x=>x.includes('Rotas sugeridas'))&&result.modes.some(x=>x.includes('Montar minha rota'))&&result.points.some(x=>x.includes('Chapecó'))&&result.points.some(x=>x.includes('Concórdia'))&&result.points.some(x=>x.includes('Retorno'))&&result.segments.length===4&&result.editor.includes('Trecho 1 selecionado')&&calls.some(x=>x.origin==='Florianópolis, SC, Brasil'&&x.destination==='Galvão, SC, Brasil'&&Array.isArray(x.stops)&&x.stops.length===0)&&calls.some(x=>Array.isArray(x.stops)&&x.stops.length===2&&x.optimize);
  await page.screenshot({path:'/tmp/movvant-route-stops.png',fullPage:true});fs.writeFileSync('/tmp/movvant-route-stops.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out));if(!out.pass)process.exitCode=1;
}catch(e){out.pass=false;out.error=String(e?.message||e);try{await page.screenshot({path:'/tmp/movvant-route-stops-failure.png',fullPage:true})}catch{}fs.writeFileSync('/tmp/movvant-route-stops.json',JSON.stringify(out,null,2));console.error(e.stack||e);process.exitCode=1}finally{await browser.close();await new Promise(r=>server.close(r))}
