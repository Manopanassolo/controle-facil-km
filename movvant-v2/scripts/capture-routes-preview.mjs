import { chromium } from 'playwright';

const base = process.env.MOVVANT_PREVIEW_URL || 'http://127.0.0.1:4177';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

async function capture(name, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${base}/roteiros`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const title = await page.title();
  const body = await page.locator('body').innerText();
  if (!/Movvant/i.test(title + ' ' + body)) throw new Error('Identidade Movvant não encontrada na página de rotas');
  if (/Controle Fácil KM|Controle KM/i.test(body)) throw new Error('Referência visual legada encontrada na página de rotas');
  await page.screenshot({ path: `/tmp/movvant-v2-routes-${name}.png`, fullPage: true });
  console.log(`CAPTURE_OK ${name} ${viewport.width}x${viewport.height}`);
  await page.close();
}

await capture('desktop', { width: 1440, height: 1000 });
await capture('mobile', { width: 390, height: 844 });
await browser.close();
