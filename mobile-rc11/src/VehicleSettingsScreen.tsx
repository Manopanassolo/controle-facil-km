import React,{useMemo} from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BootstrapData, Session } from './api';
import VehicleFuelSettingsCard from './VehicleFuelSettingsCard';

const NAVY='#0B3558',BG='#F3F6FA',TEXT='#17324D',MUTED='#78889A',BORDER='#DFE6EE',GREEN='#22B77A',ORANGE='#F59E0B';
const norm=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const canManage=(d:BootstrapData|null)=>['owner','propriet','admin','master','gerente','manager','supervisor'].some(x=>norm(`${d?.directory?.role_slug||''} ${d?.directory?.role_name||''} ${d?.directory?.job_title||''} ${d?.directory?.scope_level||''}`).includes(x));
const decimal=(v:unknown,digits=1)=>{const n=Number(v||0);return Number.isFinite(n)&&n>0?n.toLocaleString('pt-BR',{minimumFractionDigits:digits,maximumFractionDigits:digits}):'Não informado'};
const money=(v:unknown)=>{const n=Number(v||0);return Number.isFinite(n)&&n>0?n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):'Não informado'};

type Props={session:Session;data:BootstrapData|null};

export default function VehicleSettingsScreen({session,data}:Props){
 const manager=canManage(data);
 const assignedIds=useMemo(()=>new Set((data?.assignments||[]).filter(a=>a.active&&(!a.ends_at||new Date(a.ends_at).getTime()>Date.now())).map(a=>a.vehicle_id)),[data?.assignments]);
 const visibleVehicles=useMemo(()=>{const all=(data?.vehicles||[]).filter(v=>v.active);const assigned=all.filter(v=>assignedIds.has(v.id));return assigned.length?assigned:all},[data?.vehicles,assignedIds]);
 return <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
  <View style={s.hero}><Text style={s.eyebrow}>FROTA</Text><Text style={s.title}>Veículos e combustível</Text><Text style={s.text}>O cadastro do veículo é a base para KM, consumo estimado e validação dos abastecimentos.</Text></View>
  <View style={s.info}><Text style={s.infoTitle}>Veículo(s) do seu escopo</Text>{visibleVehicles.length?visibleVehicles.map(v=>{const complete=Boolean(v.fuel_type&&Number(v.avg_km_per_liter||0)>0&&Number(v.reference_fuel_price||0)>0&&Number(v.tank_capacity_liters||0)>0&&v.current_odometer_km!==null&&v.current_odometer_km!==undefined);return <View key={v.id} style={s.vehicleCard}><View style={s.vehicleHead}><View><Text style={s.plate}>{v.plate}</Text><Text style={s.text}>{[v.make,v.model].filter(Boolean).join(' · ')||'Modelo não informado'}</Text></View><View style={[s.badge,{backgroundColor:complete?'#E7F7F0':'#FFF3E5'}]}><Text style={{fontSize:10,fontWeight:'900',color:complete?GREEN:ORANGE}}>{complete?'COMPLETO':'PENDENTE'}</Text></View></View><View style={s.grid}><Metric label="KM atual" value={v.current_odometer_km!==null&&v.current_odometer_km!==undefined?`${Number(v.current_odometer_km).toLocaleString('pt-BR')} km`:'Não informado'}/><Metric label="Combustível" value={v.fuel_type||'Não informado'}/><Metric label="Média referência" value={Number(v.avg_km_per_liter||0)>0?`${decimal(v.avg_km_per_liter)} km/l`:'Não informado'}/><Metric label="Preço referência" value={money(v.reference_fuel_price)}/><Metric label="Tanque" value={Number(v.tank_capacity_liters||0)>0?`${decimal(v.tank_capacity_liters)} L`:'Não informado'}/></View></View>}):<Text style={s.text}>Nenhum veículo ativo disponível para este usuário.</Text>}</View>
  {!manager?<View style={s.info}><Text style={s.infoTitle}>Somente leitura</Text><Text style={s.text}>A edição das referências do veículo é exclusiva de gerente, supervisor, administrador ou proprietário.</Text></View>:<VehicleFuelSettingsCard session={session} companyId={data?.companyId} enabled/>}
  <View style={s.info}><Text style={s.infoTitle}>Como o Movvant usa esses dados</Text><Text style={s.text}>Média km/l: referência inicial do consumo. O abastecimento real aprovado passa a ser a fonte preferencial para indicadores realizados.</Text><Text style={s.text}>Preço de referência: usado apenas quando ainda não existe preço real validado para o período.</Text><Text style={s.text}>Capacidade do tanque: ajuda a identificar lançamentos incompatíveis e encaminhá-los para revisão.</Text></View>
 </ScrollView>
}

function Metric({label,value}:{label:string;value:string}){return <View style={s.metric}><Text style={s.metricLabel}>{label}</Text><Text style={s.metricValue}>{value}</Text></View>}

const s=StyleSheet.create({content:{padding:16,paddingBottom:40,gap:12,backgroundColor:BG},hero:{backgroundColor:'#fff',borderRadius:20,padding:18,borderWidth:1,borderColor:BORDER},eyebrow:{fontSize:10,fontWeight:'900',color:NAVY},title:{fontSize:22,fontWeight:'900',color:TEXT,marginTop:4},text:{fontSize:11,color:MUTED,lineHeight:17,marginTop:6},info:{backgroundColor:'#fff',borderRadius:16,padding:15,borderWidth:1,borderColor:BORDER,gap:10},infoTitle:{fontSize:13,fontWeight:'900',color:NAVY},vehicleCard:{borderTopWidth:1,borderTopColor:BORDER,paddingTop:12,gap:10},vehicleHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',gap:10},plate:{fontSize:17,fontWeight:'900',color:TEXT},badge:{paddingHorizontal:9,paddingVertical:6,borderRadius:999},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},metric:{width:'48%',backgroundColor:'#F6F8FB',borderRadius:12,padding:10},metricLabel:{fontSize:9,fontWeight:'800',color:MUTED},metricValue:{fontSize:12,fontWeight:'900',color:TEXT,marginTop:3}});
// RC11.12: veículo obrigatório em novos planejamentos; viagens legadas sem veículo permanecem compatíveis.
