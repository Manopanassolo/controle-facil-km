const fs=require('fs');
const p='dist/index.html';
let s=fs.readFileSync(p,'utf8');
const rep=(a,b,label)=>{if(!s.includes(a))throw new Error('v1011 anchor not found: '+label);s=s.replace(a,b)};

rep('Gestão de deslocamentos · versão 101.0','Gestão de deslocamentos · versão 101.1','version');
rep('<span class="tag">101.0</span>','<span class="tag">101.1</span>','help version');
s=s.replace("checks.push(['Versão','101.0']);","checks.push(['Versão','101.1']);");

rep("r=await sb.from('km_trips').select('*').eq('organization_id',org.id).order('trip_date',{ascending:false}).order('created_at',{ascending:false});trips=r.data||[];","r=await sb.from('km_trips').select('*').eq('organization_id',org.id).is('deleted_at',null).order('trip_date',{ascending:false}).order('created_at',{ascending:false});trips=r.data||[];",'hide soft deleted trips');

rep("hist.innerHTML=data.map(t=>'<div class=\"row\"><h4>'+esc(t.trip_date)+' · '+(t.status==='completed'?'Finalizada':'Em andamento')+'</h4><div>'+esc(t.origin||'—')+' → '+esc(t.destination)+'</div><div class=\"muted\">KM inicial '+esc(t.start_odometer)+' · KM final '+esc(t.end_odometer??'—')+' · '+esc(t.distance_km??'—')+' km</div><div class=\"actions\"><button class=\"sec\" data-trip-detail=\"'+t.id+'\">Ver detalhes</button></div></div>').join('')||'<p class=\"muted\">Nenhum deslocamento encontrado.</p>';\n  document.querySelectorAll('[data-trip-detail]').forEach(b=>b.onclick=()=>abrirDetalheViagem(b.dataset.tripDetail));","const canManage=['admin','manager'].includes(acc?.module_role);\n  hist.innerHTML=data.map(t=>'<div class=\"row\"><h4>'+esc(t.trip_date)+' · '+(t.status==='completed'?'Finalizada':'Em andamento')+'</h4><div>'+esc(t.origin||'—')+' → '+esc(t.destination)+'</div><div class=\"muted\">KM inicial '+esc(t.start_odometer)+' · KM final '+esc(t.end_odometer??'—')+' · '+esc(t.distance_km??'—')+' km</div><div class=\"actions\"><button class=\"sec\" data-trip-detail=\"'+t.id+'\">Ver detalhes</button>'+(canManage&&t.status==='completed'?'<button class=\"sec\" data-trip-edit=\"'+t.id+'\">Editar</button><button class=\"danger\" data-trip-delete=\"'+t.id+'\">Excluir</button>':'')+'</div></div>').join('')||'<p class=\"muted\">Nenhum deslocamento encontrado.</p>';\n  document.querySelectorAll('[data-trip-detail]').forEach(b=>b.onclick=()=>abrirDetalheViagem(b.dataset.tripDetail));\n  document.querySelectorAll('[data-trip-edit]').forEach(b=>b.onclick=()=>editarViagemFinalizada(b.dataset.tripEdit));\n  document.querySelectorAll('[data-trip-delete]').forEach(b=>b.onclick=()=>excluirViagemFinalizada(b.dataset.tripDelete));",'history edit delete');

rep("function formatDuration(a,b){if(!a)return '—';",`async function editarViagemFinalizada(id){
  if(!['admin','manager'].includes(acc?.module_role))return msg('Somente administrador ou gestor pode editar viagem finalizada',true);
  const t=trips.find(x=>x.id===id);if(!t||t.status!=='completed')return;
  const origin=prompt('Origem',t.origin||'');if(origin===null)return;
  const destination=prompt('Destino',t.destination||'');if(destination===null||!destination.trim())return msg('Informe o destino',true);
  const startRaw=prompt('KM inicial',String(t.start_odometer??''));if(startRaw===null)return;
  const endRaw=prompt('KM final',String(t.end_odometer??''));if(endRaw===null)return;
  const start=Number(startRaw),end=Number(endRaw);if(!Number.isFinite(start)||!Number.isFinite(end)||end<start)return msg('Quilometragem inválida',true);
  const reason=prompt('Motivo obrigatório da alteração','Correção de lançamento');if(reason===null||reason.trim().length<3)return msg('Informe o motivo da alteração',true);
  const r=await sb.from('km_trips').update({origin:origin.trim()||null,destination:destination.trim(),start_odometer:start,end_odometer:end,distance_km:end-start,edit_reason:reason.trim(),updated_at:new Date().toISOString()}).eq('id',id).eq('organization_id',org.id).select().single();
  if(r.error)return msg(r.error.message,true);await refreshAll();render();show('historico');msg('Viagem atualizada e auditada');
}
async function excluirViagemFinalizada(id){
  if(!['admin','manager'].includes(acc?.module_role))return msg('Somente administrador ou gestor pode excluir viagem finalizada',true);
  const t=trips.find(x=>x.id===id);if(!t)return;
  const reason=prompt('Motivo obrigatório da exclusão','Lançamento incorreto');if(reason===null||reason.trim().length<3)return msg('Informe o motivo da exclusão',true);
  if(!confirm('Excluir esta viagem do histórico operacional? Ela continuará preservada na auditoria e poderá ser restaurada.'))return;
  const r=await sb.from('km_trips').update({deleted_at:new Date().toISOString(),edit_reason:reason.trim(),updated_at:new Date().toISOString()}).eq('id',id).eq('organization_id',org.id).select().single();
  if(r.error)return msg(r.error.message,true);await refreshAll();render();show('historico');msg('Viagem excluída com preservação da auditoria');
}
async function loadDeletedTrips(){
  if(!window.admDeleted||!org)return;
  if(!['admin','manager'].includes(acc?.module_role)){admDeleted.innerHTML='<span class="muted">Disponível para administrador e gestor.</span>';return}
  const r=await sb.from('km_trips').select('*').eq('organization_id',org.id).not('deleted_at','is',null).order('deleted_at',{ascending:false}).limit(50);
  if(r.error){admDeleted.innerHTML='<span class="err">'+esc(r.error.message)+'</span>';return}
  admDeleted.innerHTML=(r.data||[]).map(t=>'<div class="row"><b>'+esc(t.trip_date)+' · '+esc(t.origin||'—')+' → '+esc(t.destination)+'</b><br><span class="muted">Excluída em '+esc(new Date(t.deleted_at).toLocaleString('pt-BR'))+' · '+esc(t.edit_reason||'sem motivo')+'</span><div class="actions"><button class="sec" data-trip-restore="'+t.id+'">Restaurar</button></div></div>').join('')||'<span class="muted">Nenhuma viagem excluída.</span>';
  document.querySelectorAll('[data-trip-restore]').forEach(b=>b.onclick=()=>restaurarViagem(b.dataset.tripRestore));
}
async function restaurarViagem(id){
  if(!['admin','manager'].includes(acc?.module_role))return msg('Sem permissão',true);
  const reason=prompt('Motivo da restauração','Restauração autorizada');if(reason===null||reason.trim().length<3)return msg('Informe o motivo',true);
  const r=await sb.from('km_trips').update({deleted_at:null,deleted_by:null,edit_reason:reason.trim(),updated_at:new Date().toISOString()}).eq('id',id).eq('organization_id',org.id).select().single();
  if(r.error)return msg(r.error.message,true);await refreshAll();render();await renderAdmin();await loadDeletedTrips();msg('Viagem restaurada e hodômetro reconciliado');
}

function formatDuration(a,b){if(!a)return '—';`,'completed trip actions');

rep("<h3>Conformidade</h3><div id=\"admCompliance\" class=\"row\"></div>","<h3>Conformidade</h3><div id=\"admCompliance\" class=\"row\"></div><h3>Viagens excluídas</h3><div id=\"admDeleted\"></div>",'admin deleted area');
rep("if(n==='painel')renderAdmin();","if(n==='painel'){renderAdmin();loadDeletedTrips();}",'panel deleted load');

rep("let r=await sb.from('km_trips').update({end_odometer:end,ended_at:new Date().toISOString(),status:'completed',notes:obsFinal.value.trim()||activeTrip.notes}).eq('id',activeTrip.id).select().single();","let r=await sb.from('km_trips').update({end_odometer:end,distance_km:end-Number(activeTrip.start_odometer),ended_at:new Date().toISOString(),status:'completed',notes:obsFinal.value.trim()||activeTrip.notes}).eq('id',activeTrip.id).select().single();",'finalize distance');

fs.writeFileSync(p,s);
console.log('Controle KM v101.1: completed trip edit, soft delete, restore and odometer reconciliation UI');
