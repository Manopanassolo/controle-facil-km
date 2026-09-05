import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Session, restPatch, restSelect } from './api';

const NAVY='#0B3558', BLUE='#1769E0', TEXT='#17324D', MUTED='#78889A', BORDER='#DFE6EE', BG='#F3F6FA';

type VehicleFuelRow={
 id:string;plate:string;make?:string|null;model?:string|null;fuel_type?:string|null;
 avg_km_per_liter?:number|string|null;reference_fuel_price?:number|string|null;tank_capacity_liters?:number|string|null;
};

type Props={session:Session;companyId?:string|null;enabled:boolean;onSaved?:()=>void};

const numberValue=(v:string)=>Number(v.replace(/\./g,'').replace(',','.').replace(/[^0-9.]/g,''))||0;
const display=(v:unknown)=>v===null||v===undefined||v===''?'':String(v).replace('.',',');

export default function VehicleFuelSettingsCard({session,companyId,enabled,onSaved}:Props){
 const [vehicles,setVehicles]=useState<VehicleFuelRow[]>([]),[selected,setSelected]=useState('');
 const [fuelType,setFuelType]=useState(''),[avg,setAvg]=useState(''),[price,setPrice]=useState(''),[tank,setTank]=useState('');
 const [loading,setLoading]=useState(false),[saving,setSaving]=useState(false);
 const current=useMemo(()=>vehicles.find(v=>v.id===selected)||null,[vehicles,selected]);
 const load=async()=>{if(!companyId||!enabled)return;setLoading(true);try{const rows=await restSelect<VehicleFuelRow>(session,'vehicles',`select=id,plate,make,model,fuel_type,avg_km_per_liter,reference_fuel_price,tank_capacity_liters&company_id=eq.${encodeURIComponent(companyId)}&active=eq.true&order=plate.asc`);setVehicles(rows);if(rows.length&&!selected)setSelected(rows[0].id)}catch{setVehicles([])}finally{setLoading(false)}};
 useEffect(()=>{load()},[companyId,enabled]);
 useEffect(()=>{if(!current)return;setFuelType(current.fuel_type||'');setAvg(display(current.avg_km_per_liter));setPrice(display(current.reference_fuel_price));setTank(display(current.tank_capacity_liters))},[current?.id]);
 const save=async()=>{if(!current)return;const a=numberValue(avg),p=numberValue(price),t=numberValue(tank);if(!fuelType.trim())return Alert.alert('Combustível','Informe o tipo de combustível.');if(a<=0)return Alert.alert('Consumo','Informe uma média válida em km/l.');if(p<=0)return Alert.alert('Preço','Informe um valor por litro válido.');setSaving(true);try{await restPatch(session,'vehicles',`id=eq.${encodeURIComponent(current.id)}&company_id=eq.${encodeURIComponent(companyId||'')}`,{fuel_type:fuelType.trim(),avg_km_per_liter:a,reference_fuel_price:p,tank_capacity_liters:t>0?t:null,updated_at:new Date().toISOString()});Alert.alert('Veículo atualizado','A base de combustível foi salva e será usada nos cálculos estimados.');await load();onSaved?.()}catch(e){Alert.alert('Não foi possível salvar',e instanceof Error?e.message:'Verifique sua permissão de gestão.')}finally{setSaving(false)}};
 if(!enabled)return null;
 return <View style={s.box}><Text style={s.title}>Base de combustível dos veículos</Text><Text style={s.sub}>Cadastre a referência usada para estimar litros e custo quando não existir abastecimento real.</Text>{loading?<Text style={s.sub}>Carregando veículos...</Text>:<><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.vehicleRow}>{vehicles.map(v=><Pressable key={v.id} style={[s.vehicleChip,selected===v.id&&s.vehicleChipOn]} onPress={()=>setSelected(v.id)}><Text style={[s.vehicleName,selected===v.id&&s.onText]}>{v.plate}</Text><Text style={[s.vehicleSub,selected===v.id&&s.onText]}>{[v.make,v.model].filter(Boolean).join(' ')||'Veículo'}</Text></Pressable>)}</ScrollView>{current&&<><Field label="Tipo de combustível" value={fuelType} onChange={setFuelType} placeholder="Gasolina, Diesel, Etanol..."/><Field label="Média de consumo (km/l)" value={avg} onChange={setAvg} numeric placeholder="Ex.: 10,5"/><Field label="Valor de referência por litro (R$)" value={price} onChange={setPrice} numeric placeholder="Ex.: 6,20"/><Field label="Capacidade do tanque (litros)" value={tank} onChange={setTank} numeric placeholder="Opcional"/><Pressable style={[s.button,saving&&{opacity:.55}]} disabled={saving} onPress={save}><Text style={s.buttonText}>{saving?'Salvando...':'Salvar base do veículo'}</Text></Pressable></>}</>}</View>
}

function Field({label,value,onChange,placeholder,numeric=false}:{label:string;value:string;onChange:(v:string)=>void;placeholder:string;numeric?:boolean}){return <View style={{gap:5}}><Text style={s.label}>{label}</Text><TextInput style={s.input} value={value} onChangeText={onChange} placeholder={placeholder} keyboardType={numeric?'decimal-pad':'default'}/></View>}

const s=StyleSheet.create({box:{backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:18,padding:15,gap:11},title:{fontSize:16,fontWeight:'900',color:NAVY},sub:{fontSize:11,color:MUTED,lineHeight:16},vehicleRow:{gap:8},vehicleChip:{minWidth:125,padding:10,borderRadius:13,borderWidth:1,borderColor:BORDER,backgroundColor:BG},vehicleChipOn:{backgroundColor:NAVY,borderColor:NAVY},vehicleName:{fontSize:12,fontWeight:'900',color:TEXT},vehicleSub:{fontSize:9,color:MUTED,marginTop:2},onText:{color:'#fff'},label:{fontSize:10,fontWeight:'900',color:TEXT},input:{minHeight:48,borderRadius:13,borderWidth:1,borderColor:BORDER,paddingHorizontal:12,color:TEXT,backgroundColor:'#fff'},button:{minHeight:50,borderRadius:14,backgroundColor:BLUE,alignItems:'center',justifyContent:'center'},buttonText:{color:'#fff',fontWeight:'900',fontSize:12}});