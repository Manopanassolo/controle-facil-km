const fs=require('fs');
const p='dist/index.html';
let s=fs.readFileSync(p,'utf8');
const rep=(a,b,label)=>{if(!s.includes(a))throw new Error('v102.0 anchor not found: '+label);s=s.replace(a,b)};

rep('Gestão de deslocamentos · versão 101.3','Gestão de deslocamentos · versão 102.0','version');
rep('<span class="tag">101.3</span>','<span class="tag">102.0</span>','help version');
rep("checks.push(['Versão','101.3']);","checks.push(['Versão','102.0']);",'diag version');

rep("if(org&&acc) await refreshAll();\n  render();\n  restoreDraft();","if(org&&acc) await refreshAll();\n  render();\n  restoreDraft();\n  if(org&&acc) await renderAvisos();",'notification badge on load');

rep("renderActive(); renderTeam(); renderSettings();","renderActive(); renderTeam(); renderSettings(); applyRoleUi();",'role ui hook');
rep("function renderSettings(){","function applyRoleUi(){\n  const role=acc?.module_role||'driver';\n  document.querySelectorAll('[data-p=\"custos\"]').forEach(x=>x.classList.toggle('hide',role==='driver'));\n  document.querySelectorAll('[data-p=\"painel\"]').forEach(x=>x.classList.toggle('hide',!['admin','manager','supervisor'].includes(role)));\n  document.querySelectorAll('[data-p=\"equipe\"]').forEach(x=>x.classList.toggle('hide',role==='driver'));\n}\nfunction renderSettings(){",'role ui function');

rep("if(n==='relatorios'){printEmpresa.textContent=org?.name||'';carregaRelatorios();}","if(n==='relatorios'){printEmpresa.innerHTML='<b>'+esc(org?.name||'')+'</b>'+(org?.document?'<br>'+esc(org.document):'')+'<br><span class=\"small\">Emitido em '+new Date().toLocaleString('pt-BR')+'</span>';carregaRelatorios();}",'print header');

rep("const rows=[['Data','Usuário','Unidade','Veículo','Origem','Destino','KM','Despesas','Status'],\n    ...reportCache.map(x=>[x.trip_date,x.user_name||'',x.location_name||'',x.vehicle_plate||'',x.origin||'',x.destination||'',x.distance_km||0,x.expense_total||0,x.status||''])];","const rows=[['Data','Usuário','Unidade','Veículo','Origem','Destino','Motivo','Uso','KM','Despesas','Status','Observações'],\n    ...reportCache.map(x=>[x.trip_date,x.user_name||'',x.location_name||'',x.vehicle_plate||'',x.origin||'',x.destination||'',x.purpose||'',x.usage_type==='personal'?'Pessoal':'Profissional',x.distance_km||0,x.expense_total||0,x.status||'',x.notes||''])];",'csv richer report');

rep("return {version:14,generatedAt:new Date().toISOString()","return {version:15,generatedAt:new Date().toISOString()",'backup version');
rep("'controle-km-backup-v14.json'","'controle-km-backup-v15.json'",'backup filename');

rep("applyFont();\n\ncarga();","applyFont();\napplyPrivacy();\n\nlet kmLastActivity=Date.now();\n['pointerdown','keydown','touchstart','scroll','visibilitychange'].forEach(ev=>window.addEventListener(ev,()=>{kmLastActivity=Date.now()},{passive:true}));\nsetInterval(async()=>{\n  const mins=Number(localStorage.getItem('km_timeout')||0);\n  if(!mins||!ses)return;\n  if(Date.now()-kmLastActivity>=mins*60000){\n    await sb.auth.signOut();\n    location.reload();\n  }\n},30000);\n\ncarga();",'privacy and inactivity enforcement');

fs.writeFileSync(p,s);
console.log('Controle KM v102.0: final production-candidate hardening applied');
