import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const localHtml=fs.readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
const server=http.createServer((req,res)=>{if(req.url?.startsWith('/api/')){res.writeHead(404,{'content-type':'application/json'});res.end('{}');return}res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(localHtml)});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},userAgent:'Mozilla/5.0 (Linux; Android 16; SM-S948B) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',isMobile:true,hasTouch:true});
const page=await context.newPage();page.setDefaultTimeout(5000);
const result={};
const navTo=async name=>{await page.evaluate(n=>{const b=document.querySelector('#app .nav [data-p="'+n+'"]');if(!b)throw new Error('navigation target missing: '+n);const api=globalThis.mvNavigationV16282;if(!api?.navigate)throw new Error('navigation controller missing');api.navigate(n)},name);await page.waitForTimeout(180)};
const state=()=>page.evaluate(()=>({dataset:document.body.dataset.mvPage||'',api:globalThis.mvNavigationV16282?.page||'',stored:localStorage.getItem('mv_last_page_v16282'),stack:sessionStorage.getItem('mv_nav_stack_v16282'),hash:location.hash,backDisabled:!!document.getElementById('mvBackV16282')?.disabled,pages:[...document.querySelectorAll('#app [id^="p-"]')].map(x=>x.id.slice(2)),targets:[...document.querySelectorAll('#app .nav [data-p]')].map(x=>x.dataset.p)}));
try{
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded',timeout:15000});
  await page.waitForTimeout(900);
  await page.evaluate(()=>{document.getElementById('auth')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide')});
  await page.waitForTimeout(450);
  result.shell=await page.evaluate(()=>({top:!!document.getElementById('mvTopNavV16282'),menu:!!document.getElementById('mvMenuToggleV16282'),back:!!document.getElementById('mvBackV16282'),home:!!document.getElementById('mvHomeV16282'),api:!!globalThis.mvNavigationV16282?.navigate,historyButton:!!document.querySelector('#app .nav [data-p="historico"]'),agendaButton:!!document.querySelector('#app .nav [data-p="agenda"]')}));
  result.initial=await state();
  await navTo('historico'); result.afterHistory=await state();
  result.history=await page.evaluate(()=>({page:document.body.dataset.mvPage,stored:localStorage.getItem('mv_last_page_v16282'),hash:location.hash,visible:!document.getElementById('p-historico')?.classList.contains('hide')}));
  await page.locator('#mvMenuToggleV16282').click();await page.waitForTimeout(80);
  result.menuOpen=await page.evaluate(()=>({open:document.body.classList.contains('mv-menu-open-v16282'),collapsed:document.querySelector('#app .nav')?.classList.contains('mv-nav-collapsed-v16282')}));
  await navTo('agenda'); result.afterAgenda=await state();
  result.autoCollapse=await page.evaluate(()=>({page:document.body.dataset.mvPage,open:document.body.classList.contains('mv-menu-open-v16282'),collapsed:document.querySelector('#app .nav')?.classList.contains('mv-nav-collapsed-v16282')}));
  await page.locator('#mvHomeV16282').click();await page.waitForTimeout(100); result.afterHome=await state();
  result.home=await page.evaluate(()=>({page:document.body.dataset.mvPage,visible:!document.getElementById('p-inicio')?.classList.contains('hide')}));
  await navTo('historico'); result.beforeAgenda2=await state(); await navTo('agenda'); result.beforeBack=await state();
  await page.locator('#mvBackV16282').click();await page.waitForTimeout(120);
  result.back=await page.evaluate(()=>({page:document.body.dataset.mvPage,visible:!document.getElementById('p-historico')?.classList.contains('hide')}));
  await navTo('agenda');await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(700);await page.evaluate(()=>{document.getElementById('auth')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide')});await page.waitForTimeout(500);
  result.reload=await page.evaluate(()=>({page:document.body.dataset.mvPage,stored:localStorage.getItem('mv_last_page_v16282'),hash:location.hash,visible:!document.getElementById('p-agenda')?.classList.contains('hide')}));
  result.pass=Object.values(result.shell).every(Boolean)&&result.history.page==='historico'&&result.history.stored==='historico'&&result.history.visible&&result.menuOpen.open&&!result.menuOpen.collapsed&&result.autoCollapse.page==='agenda'&&!result.autoCollapse.open&&result.autoCollapse.collapsed&&result.home.page==='inicio'&&result.home.visible&&result.back.page==='historico'&&result.back.visible&&result.reload.page==='agenda'&&result.reload.stored==='agenda'&&result.reload.visible;
  fs.writeFileSync('/tmp/movvant-navigation.json',JSON.stringify(result,null,2));
  await page.screenshot({path:'/tmp/movvant-navigation.png',fullPage:false});
  console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
}catch(e){result.pass=false;result.error=String(e?.stack||e);try{result.failureState=await state()}catch{}fs.writeFileSync('/tmp/movvant-navigation.json',JSON.stringify(result,null,2));try{await page.screenshot({path:'/tmp/movvant-navigation-failure.png',fullPage:false})}catch{}console.error(JSON.stringify(result,null,2));console.error(e);process.exitCode=1}finally{await browser.close();await new Promise(r=>server.close(r))}