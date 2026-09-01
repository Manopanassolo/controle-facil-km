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
const expose=async()=>{await page.evaluate(()=>{globalThis.mvAuthAuthorityV16356?.showLoggedIn?.();document.getElementById('auth')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide');globalThis.mvUiAuthorityV16354?.sync?.()});await page.waitForTimeout(150)};
const navTo=async name=>{await page.evaluate(n=>{const api=globalThis.mvNavigationV164;if(!api?.navigate)throw new Error('v164 navigation controller missing');api.navigate(n)},name);await page.waitForTimeout(180)};
const state=()=>page.evaluate(()=>({dataset:document.body.dataset.mvPage||'',authority:document.body.dataset.mvNavAuthority||'',stored:localStorage.getItem('mv_last_page_v164'),hash:location.hash,menuOpen:document.getElementById('mvMenu164')?.classList.contains('open')===true,pages:[...document.querySelectorAll('#app [id^="p-"]')].map(x=>x.id.slice(2)),targets:[...document.querySelectorAll('#mvMenu164 [data-page164]')].map(x=>x.dataset.page164)}));
try{
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded',timeout:15000});await page.waitForTimeout(900);await expose();
  result.shell=await page.evaluate(()=>({dockMenu:!!document.querySelector('#mvBottomDock85 [data-mv-dock="menu"]'),dockHome:!!document.querySelector('#mvBottomDock85 [data-mv-dock="inicio"]'),legacyTopGone:!document.getElementById('mvTopNavV16282'),api:!!globalThis.mvNavigationV164?.navigate,menu:!!document.getElementById('mvMenu164'),historyButton:!!document.querySelector('#mvMenu164 [data-page164="historico"]'),agendaButton:!!document.querySelector('#mvMenu164 [data-page164="agenda"]')}));
  result.initial=await state();
  await navTo('historico');result.history=await page.evaluate(()=>({page:document.body.dataset.mvPage,stored:localStorage.getItem('mv_last_page_v164'),visible:!document.getElementById('p-historico')?.classList.contains('hide')}));
  await page.locator('#mvBottomDock85 [data-mv-dock="menu"]').click();await page.waitForTimeout(100);result.menuOpen=await state();
  await page.locator('#mvMenu164 [data-page164="agenda"]').click();await page.waitForTimeout(150);result.agenda=await state();
  await page.locator('#mvBottomDock85 [data-mv-dock="inicio"]').click();await page.waitForTimeout(120);result.home=await page.evaluate(()=>({page:document.body.dataset.mvPage,visible:!document.getElementById('p-inicio')?.classList.contains('hide')}));
  await navTo('agenda');await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(900);await expose();result.reload=await page.evaluate(()=>({page:document.body.dataset.mvPage,stored:localStorage.getItem('mv_last_page_v164'),hash:location.hash,visible:!document.getElementById('p-agenda')?.classList.contains('hide'),authority:document.body.dataset.mvNavAuthority||''}));
  result.pass=Object.values(result.shell).every(Boolean)&&result.initial.authority==='164.0'&&result.history.page==='historico'&&result.history.stored==='historico'&&result.history.visible&&result.menuOpen.menuOpen&&result.agenda.dataset==='agenda'&&!result.agenda.menuOpen&&result.home.page==='inicio'&&result.home.visible&&result.reload.page==='agenda'&&result.reload.stored==='agenda'&&result.reload.visible&&result.reload.authority==='164.0';
  fs.writeFileSync('/tmp/movvant-navigation.json',JSON.stringify(result,null,2));await page.screenshot({path:'/tmp/movvant-navigation.png',fullPage:false});console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
}catch(e){result.pass=false;result.error=String(e?.stack||e);try{result.failureState=await state()}catch{}fs.writeFileSync('/tmp/movvant-navigation.json',JSON.stringify(result,null,2));try{await page.screenshot({path:'/tmp/movvant-navigation-failure.png',fullPage:false})}catch{}console.error(JSON.stringify(result,null,2));console.error(e);process.exitCode=1}finally{await browser.close();await new Promise(r=>server.close(r))}