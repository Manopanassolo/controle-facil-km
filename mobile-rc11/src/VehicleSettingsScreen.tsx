import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BootstrapData, Session } from './api';
import VehicleFuelSettingsCard from './VehicleFuelSettingsCard';

const NAVY='#0B3558',BG='#F3F6FA',TEXT='#17324D',MUTED='#78889A',BORDER='#DFE6EE';
const norm=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const canManage=(d:BootstrapData|null)=>['owner','propriet','admin','master','gerente','manager','supervisor'].some(x=>norm(`${d?.directory?.role_slug||''} ${d?.directory?.role_name||''} ${d?.directory?.job_title||''} ${d?.directory?.scope_level||''}`).includes(x));

type Props={session:Session;data:BootstrapData|null};

export default function VehicleSettingsScreen({session,data}:Props){
 const manager=canManage(data);
 return <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
  <View style={s.hero}><Text style={s.eyebrow}>FROTA</Text><Text style={s.title}>Veículos e combustível</Text><Text style={s.text}>Os valores abaixo são referências do veículo. Abastecimentos reais continuam sendo lançados em Despesas & Prestação.</Text></View>
  {!manager?<View style={s.info}><Text style={s.infoTitle}>Somente leitura</Text><Text style={s.text}>A edição de média, preço de referência e capacidade do tanque é exclusiva de gerente, supervisor, administrador ou proprietário.</Text></View>:<VehicleFuelSettingsCard session={session} companyId={data?.companyId} enabled/>}
  <View style={s.info}><Text style={s.infoTitle}>Como preencher</Text><Text style={s.text}>Média km/l: quantos quilômetros o veículo costuma rodar com 1 litro. Ex.: 10,5.</Text><Text style={s.text}>Preço de referência: valor médio do litro usado somente para estimativas quando ainda não houver abastecimento real validado. Ex.: R$ 6,20.</Text><Text style={s.text}>Capacidade do tanque: usada para alertar abastecimentos incompatíveis com o veículo.</Text></View>
 </ScrollView>
}

const s=StyleSheet.create({content:{padding:16,paddingBottom:40,gap:12,backgroundColor:BG},hero:{backgroundColor:'#fff',borderRadius:20,padding:18,borderWidth:1,borderColor:BORDER},eyebrow:{fontSize:10,fontWeight:'900',color:NAVY},title:{fontSize:22,fontWeight:'900',color:TEXT,marginTop:4},text:{fontSize:11,color:MUTED,lineHeight:17,marginTop:6},info:{backgroundColor:'#fff',borderRadius:16,padding:15,borderWidth:1,borderColor:BORDER},infoTitle:{fontSize:13,fontWeight:'900',color:NAVY}});
