const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
const fixes=[
  [`onclick="v161AskFeature('"+f.id+"')"`,`onclick='v161AskFeature(&quot;"+f.id+"&quot;)'`],
  [`onclick="v161SaveFeature('"+f.id+"')"`,`onclick='v161SaveFeature(&quot;"+f.id+"&quot;)'`]
];
let changed=0;
for(const [from,to] of fixes){
  if(s.includes(from)){s=s.replaceAll(from,to);changed++;}
}
if(changed!==fixes.length) throw new Error('v161.1 expected inline-handler anchors were not found');
fs.writeFileSync('dist/index.html',s);
console.log('Controle KM v161.1: commercial inline handlers syntax repaired');
