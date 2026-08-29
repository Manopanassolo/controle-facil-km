const fs=require('fs');
let s=fs.readFileSync('dist/index.html','utf8');
s=s.replace("const box=document.getElementById('mvRouteCalcV16226'),status=document.getElementById('mvRouteCalcStatusV16226');","const box=document.getElementById('mvRouteCalcV16226'),routeStatus=document.getElementById('mvRouteCalcStatusV16226');");
s=s.replaceAll('if(status)status.textContent','if(routeStatus)routeStatus.textContent');
s=s.replaceAll('if(status)status.innerHTML','if(routeStatus)routeStatus.innerHTML');
fs.writeFileSync('dist/index.html',s);
console.log('Movvant v162.27: active route stabilization passes status safety guard');
