import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.MOVVANT_URL || 'https://movvant.panassolofilho.workers.dev';
const browser = await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context = await browser.newContext({viewport:{width:390,height:844},userAgent:'Mozilla/5.0 (Linux; Android 16; SM-S948B) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',isMobile:true,hasTouch:true,deviceScaleFactor:1});
const page = await context.newPage();
try {
  await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(3000);
  const shell=await page.evaluate(()=>{
    const auth=document.getElementById('auth'),app=document.getElementById('app'),trip=document.getElementById('p-viagem'),form=document.getElementById('novaViagem'),route=document.getElementById('directRouteStackV127');
    if(auth)auth.classList.add('hide');
    if(app){app.classList.remove('hide');app.style.setProperty('display','block','important');app.style.setProperty('visibility','visible','important')}
    document.body.classList.add('mv-trip-active-v16247');document.body.dataset.mvRoute='viagem';
    if(trip){trip.classList.remove('hide');trip.style.setProperty('display','block','important');trip.style.setProperty('visibility','visible','important');trip.style.setProperty('opacity','1','important')}
    if(form){form.classList.remove('hide');form.style.setProperty('display','block','important');form.style.setProperty('visibility','visible','important');form.style.setProperty('opacity','1','important')}
    if(route){let n=route;while(n&&n!==document.body){n.classList?.remove('hide');n.style?.setProperty('display','block','important');n.style?.setProperty('visibility','visible','important');n.style?.setProperty('opacity','1','important');n=n.parentElement}}
    const o=document.getElementById('mvOrigemNativeV16260'),d=document.getElementById('mvDestinoNativeV16260');
    for(const el of [o,d]){if(!el)continue;el.style.setProperty('display','block','important');el.style.setProperty('visibility','visible','important');el.style.setProperty('opacity','1','important')}
    route?.scrollIntoView({block:'center'});
    return {app:!!app,trip:!!trip,form:!!form,route:!!route,origin:!!o,destination:!!d};
  });
  if(!shell.app||!shell.trip||!shell.form||!shell.route||!shell.origin||!shell.destination)throw new Error('Native trip shell incomplete: '+JSON.stringify(shell));
  await page.waitForTimeout(400);
  const origin=page.locator('#mvOrigemNativeV16260'),destination=page.locator('#mvDestinoNativeV16260');
  await origin.waitFor({state:'visible',timeout:5000});await destination.waitFor({state:'visible',timeout:5000});
  await origin.scrollIntoViewIfNeeded();await origin.tap({timeout:5000});await origin.fill('');
  await page.keyboard.insertText('Avenida Paulista');await page.waitForTimeout(700);
  const result=await page.evaluate(()=>{
    const o=document.getElementById('mvOrigemNativeV16260'),d=document.getElementById('mvDestinoNativeV16260'),legacy=document.getElementById('origem'),route=document.getElementById('directRouteStackV127');
    return {value:o?.value||'',legacyValue:legacy?.value||'',active:document.activeElement===o,originEditable:!!o&&!o.disabled&&!o.readOnly,destinationEditable:!!d&&!d.disabled&&!d.readOnly,pointer:o?getComputedStyle(o).pointerEvents:'none',originVisible:!!o&&!!(o.offsetWidth||o.offsetHeight||o.getClientRects().length),destinationVisible:!!d&&!!(d.offsetWidth||d.offsetHeight||d.getClientRects().length),routeVisible:!!route&&!!(route.offsetWidth||route.offsetHeight||route.getClientRects().length),versionMarker:[...document.scripts].map(s=>s.textContent||'').some(t=>t.includes('v162.60'))};
  });
  const pass=result.value==='Avenida Paulista'&&result.legacyValue==='Avenida Paulista'&&result.active&&result.originEditable&&result.destinationEditable&&result.pointer!=='none'&&result.originVisible&&result.destinationVisible&&result.routeVisible&&result.versionMarker;
  fs.writeFileSync('/tmp/movvant-visual-result.json',JSON.stringify({...result,pass},null,2));
  await page.screenshot({path:'/tmp/movvant-android.png',fullPage:false});
  console.log(JSON.stringify({...result,pass}));
  if(!pass)process.exitCode=1;
} catch(e){
  try{await page.screenshot({path:'/tmp/movvant-android-failure.png',fullPage:false})}catch{}
  fs.writeFileSync('/tmp/movvant-visual-result.json',JSON.stringify({pass:false,error:String(e?.message||e)},null,2));
  console.error(e.stack||e);process.exitCode=1;
} finally {await browser.close()}
