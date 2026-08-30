const fs=require('fs');
const s=fs.readFileSync('dist/index.html','utf8');
const needles=['function show','const show','function render','auth.classList','app.classList','p-inicio','classic-app-header'];
for(const n of needles){
  let i=s.indexOf(n);
  console.log('\n=== '+n+' @ '+i+' ===');
  if(i>=0) console.log(s.slice(Math.max(0,i-700),Math.min(s.length,i+1800)));
}
const style=s.match(/<style>([\s\S]*?)<\/style>/i)?.[1]||'';
for(const re of [/#app[^\{]*\{[^\}]*\}/g,/#p-inicio[^\{]*\{[^\}]*\}/g,/\.w[^\{]*\{[^\}]*\}/g,/section[^\{]*\{[^\}]*\}/g]){
  const m=[...style.matchAll(re)].map(x=>x[0]);
  console.log('\nCSS '+re+':\n'+m.join('\n'));
}
