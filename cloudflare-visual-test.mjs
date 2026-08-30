import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.MOVVANT_URL || 'https://movvant.panassolofilho.workers.dev';
const browser = await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context = await browser.newContext({
  viewport:{width:390,height:844},
  userAgent:'Mozilla/5.0 (Linux; Android 16; SM-S948B) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',
  isMobile:true,
  hasTouch:true,
  deviceScaleFactor:1
});
const page = await context.newPage();
try {
  await page.goto(base+'/?mv_visual_test=1',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(3500);
  const origin = page.locator('#origem');
  const destination = page.locator('#destino');
  await origin.waitFor({state:'visible',timeout:12000});
  await destination.waitFor({state:'visible',timeout:12000});
  await origin.scrollIntoViewIfNeeded();
  await origin.click({timeout:5000});
  await origin.fill('');
  await origin.pressSequentially('Avenida Paulista',{delay:15});
  await page.waitForTimeout(500);
  const result = await page.evaluate(()=>{
    const o=document.getElementById('origem'),d=document.getElementById('destino');
    return {
      value:o?.value||'',
      active:document.activeElement===o,
      originEditable:!!o&&!o.disabled&&!o.readOnly,
      destinationEditable:!!d&&!d.disabled&&!d.readOnly,
      build:document.documentElement.dataset.mvBuild||'',
      self:document.documentElement.dataset.mvTypingTest||'',
      pointer:o?getComputedStyle(o).pointerEvents:'none',
      bodyRoute:document.body.dataset.mvRoute||'',
      originVisible:!!o&&!!(o.offsetWidth||o.offsetHeight||o.getClientRects().length),
      destinationVisible:!!d&&!!(d.offsetWidth||d.offsetHeight||d.getClientRects().length)
    };
  });
  const pass=result.value==='Avenida Paulista'&&result.active&&result.originEditable&&result.destinationEditable&&result.pointer!=='none'&&result.originVisible&&result.destinationVisible&&result.build==='162.59';
  fs.writeFileSync('/tmp/movvant-visual-result.json',JSON.stringify({...result,pass},null,2));
  await page.screenshot({path:'/tmp/movvant-android.png',fullPage:false});
  console.log(JSON.stringify({...result,pass}));
  if(!pass)process.exitCode=1;
} catch(e) {
  try { await page.screenshot({path:'/tmp/movvant-android-failure.png',fullPage:false}); } catch {}
  console.error(e.stack||e);
  process.exitCode=1;
} finally {
  await browser.close();
}
