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
  const assetHash=sha(localHtml);
  let preflight=null,liveHtml='',sameAsset=false;
  for(let i=1;i<=6;i++){
    preflight=await context.request.get(base+'/?qa_asset='+assetHash.slice(0,20)+'_'+i+'_'+Date.now(),{timeout:15000,failOnStatusCode:false,headers:{'Cache-Control':'no-cache','Pragma':'no-cache'}});
    liveHtml=await preflight.text();sameAsset=sha(liveHtml)===assetHash;
    if(preflight.ok()&&sameAsset)break;
    await new Promise(r=>setTimeout(r,1200));
  }
  result.preflight={status:preflight?.status?.()||0,ok:!!preflight?.ok?.(),liveSha:sha(liveHtml),localSha:assetHash,sameAsset};
  if(!result.preflight.ok)throw new Error('Cloudflare preflight HTTP '+result.preflight.status);
  if(!result.preflight.sameAsset)throw new Error('Live Cloudflare HTML differs from exact local production candidate after cache-safe retries');
  if(!liveHtml.includes('v164.0: single canonical navigation authority'))throw new Error('Live Cloudflare HTML missing canonical v164 marker');

  console.log('CHECKPOINT render');
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:15000});
  await page.waitForTimeout(2200);
  await page.evaluate(()=>{const fold=document.getElementById('mvRouteFold93');if(fold)fold.open=true});
  await page.waitForTimeout(180);
  const shell=await page.evaluate(()=>{
    const auth=document.getElementById('auth'),app=document.getElementById('app'),trip=document.getElementById('p-viagem'),form=document.getElementById('novaViagem'),route=document.getElementById('directRouteStackV127');
    if(auth)auth.classList.add('hide');
    if(app){app.classList.remove('hide');app.style.setProperty('display','block','important');app.style.setProperty('visibility','visible','important')}
    document.body.classList.add('mv-trip-active-v16247');document.body.dataset.mvRoute='viagem';
    if(trip){trip.classList.remove('hide');trip.style.setProperty('display','block','important');trip.style.setProperty('visibility','visible','important')}
    if(form){form.classList.remove('hide');form.style.setProperty('display','block','important');form.style.setProperty('visibility','visible','important')}
    if(route){route.classList.remove('hide');route.style.setProperty('display','block','important');route.style.setProperty('visibility','visible','important')}
    return {app:!!app,trip:!!trip,form:!!form,route:!!route};
  });
  result.shell=shell;await mark('shell');

  const fields=await page.evaluate(()=>({
    origin:!!document.getElementById('origem'),
    destination:!!document.getElementById('destino'),
    stopInput:!!document.getElementById('preTripStopNameV127'),
    stopList:!!document.getElementById('preTripStopsListV127'),
    addStop:!!document.getElementById('preTripStopAddV127'),
    calculate:!!document.getElementById('routePlanBtnV131'),
    mapContract:document.documentElement.innerHTML.includes('routeEmbeddedMapV133')
  }));
  result.fields=fields;
  if(!fields.origin||!fields.destination||!fields.stopInput||!fields.stopList||!fields.addStop||!fields.calculate||!fields.mapContract)throw new Error('Canonical route planner controls missing');
  await mark('fields');

  const origin=page.locator('#origem');
  await origin.scrollIntoViewIfNeeded();await origin.click();await origin.fill('Avenida Paulista, São Paulo');await page.waitForTimeout(350);
  result.originValue=await origin.inputValue();if(!result.originValue.includes('Avenida Paulista'))throw new Error('Origin typing failed');
  await mark('origin');

  const destination=page.locator('#destino');
  await destination.scrollIntoViewIfNeeded();await destination.click();await destination.fill('Aeroporto de Congonhas, São Paulo');await page.waitForTimeout(350);
  result.destinationValue=await destination.inputValue();if(!result.destinationValue.includes('Congonhas'))throw new Error('Destination typing failed');
  await mark('destination');

  const toggle=page.locator('.mv-stop-toggle-v16262');
  if(await toggle.count()){await toggle.scrollIntoViewIfNeeded();await toggle.click();await page.waitForTimeout(100)}
  const stop=page.locator('#preTripStopNameV127');
  await stop.scrollIntoViewIfNeeded();await stop.fill('Parque Ibirapuera, São Paulo');
  await page.locator('#preTripStopAddV127').click();await page.waitForTimeout(120);
  result.stopCount=await page.locator('#preTripStopsListV127 .pre-stop-row-v127').count();
  if(result.stopCount<1)throw new Error('Stop addition failed');
  await mark('stop');

  await page.screenshot({path:'/tmp/movvant-android.png',fullPage:true,timeout:10000});
  result.pass=true;
} catch (error) {
  result.pass=false;result.error=String(error?.stack||error);
} finally {
  fs.writeFileSync('/tmp/movvant-visual-result.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
  await browser.close();await new Promise(resolve=>server.close(resolve));
}
if(!result.pass)process.exit(1);
