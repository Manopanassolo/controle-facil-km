import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const html=fs.readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
const mockItems={
  origem:[{placeId:'origem-1',text:'Avenida Paulista - Bela Vista, São Paulo - SP, Brasil',mainText:'Avenida Paulista',secondaryText:'Bela Vista, São Paulo - SP, Brasil'}],
  parada:[{placeId:'parada-1',text:'Praça da Sé - Sé, São Paulo - SP, Brasil',mainText:'Praça da Sé',secondaryText:'Sé, São Paulo - SP, Brasil'}],
  destino:[{placeId:'destino-1',text:'Aeroporto de Congonhas - São Paulo - SP, Brasil',mainText:'Aeroporto de Congonhas',secondaryText:'São Paulo - SP, Brasil'}]
};
const server=http.createServer((req,res)=>{
  if(req.url?.startsWith('/api/places')){
    const q=new URL(req.url,'http://localhost').searchParams.get('q')||'';
    const key=/paulista/i.test(q)?'origem':/sé|se|praca|praça/i.test(q)?'parada':'destino';
    res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});
    res.end(JSON.stringify({configured:true,items:mockItems[key],source:'qa_mock'}));return;
  }
  if(req.url?.startsWith('/api/')){res.writeHead(200,{'content-type':'application/json'});res.end('{"qa":true}');return;}
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html);
});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},userAgent:'Mozilla/5.0 (Linux; Android 16; SM-S948B) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',isMobile:true,hasTouch:true,deviceScaleFactor:1});
const page=await context.newPage();page.setDefaultTimeout(6000);
const result={};
async function expose(){
  await page.evaluate(()=>{
    const auth=document.getElementById('auth'),app=document.getElementById('app'),trip=document.getElementById('p-viagem'),form=document.getElementById('novaViagem'),route=document.getElementById('directRouteStackV127');
    auth?.classList.add('hide');if(app){app.classList.remove('hide');app.style.setProperty('display','block','important')}
    document.body.classList.add('mv-trip-active-v16247');document.body.dataset.mvRoute='viagem';
    for(const root of [trip,form,route]){let n=root;while(n&&n!==document.body){n.classList?.remove('hide');n.style?.setProperty('display','block','important');n.style?.setProperty('visibility','visible','important');n=n.parentElement}}
    route?.scrollIntoView({block:'center'});
  });
}
async function twoTap(fieldId,text){
  const input=page.locator('#'+fieldId);await input.fill('');await input.focus();await input.pressSequentially(text,{delay:15});
  const choice=page.locator('#mvRouteChoicesV16263 button[data-mv-choice63]').first();await choice.waitFor({state:'visible'});
  const before=await input.inputValue();await choice.tap();await page.waitForTimeout(180);
  const afterFirst=await input.inputValue();
  const state1=await choice.evaluate(b=>({selected:b.classList.contains('mv-selected-v16263'),hint:b.querySelector('em')?.textContent||'',visible:!!(b.offsetWidth||b.offsetHeight||b.getClientRects().length)}));
  await choice.tap();await page.waitForTimeout(180);
  const afterSecond=await input.inputValue();
  const portalHidden=await page.locator('#mvRouteChoicesV16263').evaluate(p=>p.classList.contains('hide'));
  return {before,afterFirst,state1,afterSecond,portalHidden};
}
function assertTwoTap(label,x,expected){
  if(x.afterFirst!==x.before||!x.state1.selected||!/toque novamente/i.test(x.state1.hint)||!x.state1.visible||!x.afterSecond.includes(expected)||!x.portalHidden)throw new Error(label+' two-tap failed: '+JSON.stringify(x));
}
try{
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(2300);await expose();
  result.origin=await twoTap('origem','Avenida Paulista');assertTwoTap('Origem',result.origin,'Avenida Paulista');

  const toggle=page.locator('#mvStopToggleV16262');await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  const stopInput=page.locator('#preTripStopNameV127');
  await stopInput.waitFor({state:'visible'});
  result.stopEditorOpen=await page.locator('#directRouteStackV127 .route-point-v126.stops').evaluate(el=>el.classList.contains('mv-stop-open-v16262'));
  if(!result.stopEditorOpen)throw new Error('Stop editor did not open');

  result.stop=await twoTap('preTripStopNameV127','Praça da Sé');assertTwoTap('Stop',result.stop,'Praça da Sé');
  await page.locator('#preTripStopAddV127').click();await page.waitForTimeout(150);
  result.stopAdded=await page.locator('#preTripStopsListV127').innerText();
  if(!result.stopAdded.includes('Praça da Sé'))throw new Error('Stop was not added');

  result.destination=await twoTap('destino','Aeroporto Congonhas');assertTwoTap('Destino',result.destination,'Aeroporto de Congonhas');
  await page.locator('#destino').focus();
  result.destinationUsable=await page.locator('#destino').evaluate(el=>!el.disabled&&!el.readOnly&&document.activeElement===el);
  if(!result.destinationUsable)throw new Error('Destino not usable after stop');
  result.pass=true;
  await page.screenshot({path:'/tmp/movvant-autocomplete-flow.png',fullPage:false});
}catch(e){result.pass=false;result.error=String(e?.message||e);try{result.debug=await page.evaluate(()=>({stopClass:document.querySelector('#directRouteStackV127 .route-point-v126.stops')?.className,stopDisplay:getComputedStyle(document.getElementById('preTripStopNameV127')||document.body).display,activeId:document.activeElement?.id||''}))}catch{}try{await page.screenshot({path:'/tmp/movvant-autocomplete-flow-failure.png',fullPage:false})}catch{}process.exitCode=1}
fs.writeFileSync('/tmp/movvant-autocomplete-flow.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
await browser.close();await new Promise(r=>server.close(r));
