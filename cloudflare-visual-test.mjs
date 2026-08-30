import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = process.env.CHROME || 'chromium';
const url = process.env.MOVVANT_URL || 'https://movvant.panassolofilho.workers.dev';
const profile = `/tmp/movvant-cdp-${Date.now()}`;
const proc = spawn(chrome,[
  '--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',
  '--window-size=390,844','--remote-debugging-port=9222',
  `--user-data-dir=${profile}`,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let stderr='';proc.stderr.on('data',d=>stderr+=String(d));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitJson(path,tries=60){for(let i=0;i<tries;i++){try{const r=await fetch('http://127.0.0.1:9222'+path,{method:path.startsWith('/json/new')?'PUT':'GET'});if(r.ok)return await r.json()}catch{}await sleep(250)}throw new Error('Chrome CDP did not start\n'+stderr)}
let ws;
let seq=0;const pending=new Map();
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))})}
function evaluate(expression){return send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}).then(r=>r.result?.result?.value)}
try{
  await waitJson('/json/version');
  const target=await waitJson('/json/new?'+encodeURIComponent(url+'/?mv_visual_test=1'));
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
  ws.addEventListener('message',e=>{const m=JSON.parse(String(e.data));if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m)}});
  await send('Page.enable');await send('Runtime.enable');
  await sleep(5000);
  const prep=await evaluate(`(()=>{const o=document.getElementById('origem'),d=document.getElementById('destino');if(!o||!d)return {ok:false,why:'missing_inputs'};o.disabled=false;o.readOnly=false;d.disabled=false;d.readOnly=false;o.value='';o.scrollIntoView({block:'center'});o.focus();const r=o.getBoundingClientRect();return {ok:true,x:r.left+r.width/2,y:r.top+r.height/2,active:document.activeElement===o,build:document.documentElement.dataset.mvBuild||'',self:document.documentElement.dataset.mvTypingTest||'',pointer:getComputedStyle(o).pointerEvents}})()`);
  if(!prep?.ok)throw new Error('Route inputs missing: '+JSON.stringify(prep));
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:prep.x,y:prep.y,radiusX:1,radiusY:1,force:1}]});
  await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await send('Input.insertText',{text:'Avenida Paulista'});
  await sleep(500);
  const result=await evaluate(`(()=>{const o=document.getElementById('origem'),d=document.getElementById('destino');return {value:o?.value||'',active:document.activeElement===o,originEditable:!!o&&!o.disabled&&!o.readOnly,destinationEditable:!!d&&!d.disabled&&!d.readOnly,build:document.documentElement.dataset.mvBuild||'',self:document.documentElement.dataset.mvTypingTest||'',pointer:o?getComputedStyle(o).pointerEvents:'none',bodyRoute:document.body.dataset.mvRoute||''}})()`);
  const pass=result.value==='Avenida Paulista'&&result.active&&result.originEditable&&result.destinationEditable&&result.pointer!=='none'&&result.build==='162.59';
  fs.writeFileSync('/tmp/movvant-visual-result.json',JSON.stringify({...result,pass},null,2));
  const shot=await send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
  fs.writeFileSync('/tmp/movvant-android.png',Buffer.from(shot.result.data,'base64'));
  console.log(JSON.stringify({...result,pass}));
  if(!pass)process.exitCode=1;
} catch(e){console.error(e.stack||e);process.exitCode=1}
finally{try{ws?.close()}catch{};try{proc.kill('SIGKILL')}catch{}}
