const fs=require('fs');
const path=require('path');

function replaceOnce(text,from,to,label){
  if(text.includes(to)) return {text,changed:false};
  if(!text.includes(from)){console.log(`Patch already applied or target changed: ${label}`);return {text,changed:false};}
  return {text:text.replace(from,to),changed:true};
}

const file=path.join(__dirname,'..','AppRC11Final.tsx');
let text=fs.readFileSync(file,'utf8');
let changed=false;
const patches=[
  ["import VehicleSettingsScreen from './src/VehicleSettingsScreen';","import VehicleSettingsScreen from './src/VehicleSettingsScreen';\nimport FuelingApprovalScreen from './src/FuelingApprovalScreen';",'fuel approval import'],
  ["type MorePage = 'menu' | 'lojas' | 'relatorios' | 'despesas' | 'veiculos' | 'notificacoes' | 'sincronizacao' | 'configuracoes';","type MorePage = 'menu' | 'lojas' | 'relatorios' | 'despesas' | 'veiculos' | 'abastecimentos' | 'notificacoes' | 'sincronizacao' | 'configuracoes';",'fuel approval page type'],
  ["  if (page === 'veiculos') return <VehicleSettingsScreen session={session} data={data}/>;","  if (page === 'veiculos') return <VehicleSettingsScreen session={session} data={data}/>;\n  if (page === 'abastecimentos') return <FuelingApprovalScreen companyId={data?.companyId||'local'} managerId={session.user.id} role={`${data?.directory?.role_slug||''} ${data?.directory?.role_name||''} ${data?.directory?.job_title||''}`}/>;",'fuel approval route'],
  ["<Row icon=\"▣\" title=\"Veículos e combustível\" sub=\"Média km/l, preço de referência e tanque\" onPress={() => setPage('veiculos')}/>","<Row icon=\"▣\" title=\"Veículos e combustível\" sub=\"Média km/l, preço de referência e tanque\" onPress={() => setPage('veiculos')}/><Row icon=\"✓\" title=\"Aprovar abastecimentos\" sub=\"Pendências, correções e auditoria gerencial\" onPress={() => setPage('abastecimentos')}/>",'fuel approval menu row'],
  ["more==='veiculos'?'Veículos':more==='notificacoes'?'Notificações'","more==='veiculos'?'Veículos':more==='abastecimentos'?'Aprovar abastecimentos':more==='notificacoes'?'Notificações'",'fuel approval header title'],
  ["['▣','Veículos e combustível',()=>go('mais','veiculos')],['↻','Sincronização'","['▣','Veículos e combustível',()=>go('mais','veiculos')],['✓','Aprovar abastecimentos',()=>go('mais','abastecimentos')],['↻','Sincronização'",'fuel approval drawer entry']
];
for(const [from,to,label] of patches){const r=replaceOnce(text,from,to,label);text=r.text;changed=changed||r.changed;}
if(changed)fs.writeFileSync(file,text);
console.log('RC11.12 operations foundation patch completed.');
