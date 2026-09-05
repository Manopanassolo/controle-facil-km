import React,{useEffect,useMemo,useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {Alert,Modal,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View} from 'react-native';
import {VehicleRow} from './api';
import {FuelingRecord,lastFuelingForVehicle,saveFueling} from './fueling';
import {validateFueling} from './fuelingValidation';

const NAVY='#0B3558',BLUE='#1769E0',BG='#F3F6FA',TEXT='#17324D',MUTED='#78889A',BORDER='#DFE6EE',GREEN='#22B77A',ORANGE='#F59E0B',RED='#E5484D';
const n=(v:string)=>Number(v.replace(/\./g,'').replace(',','.').replace(/[^0-9.]/g,''))||0;
const d=(v:unknown)=>v===null||v===undefined?'':String(v).replace('.',',');

type VehicleFuel=VehicleRow&{fuel_type?:string|null;avg_km_per_liter?:number|string|null;reference_fuel_price?:number|string|null;tank_capacity_liters?:number|string|null};
type Props={visible:boolean;close:()=>void;companyId:string;userId:string;vehicles:VehicleRow[];saved:()=>Promise<void>|void};

export default function FuelingModal({visible,close,companyId,userId,vehicles,saved}:Props){
 const rows=vehicles as VehicleFuel[];
 const [vehicleId,setVehicleId]=useState(''),[date,setDate]=useState(new Date().toISOString().slice(0,10)),[time,setTime]=useState(new Date().toTimeString().slice(0,5));
 const [odometer,setOdometer]=useState(''),[liters,setLiters]=useState(''),[total,setTotal]=useState(''),[price,setPrice]=useState(''),[station,setStation]=useState(''),[fuelType,setFuelType]=useState('');
 const [fullTank,setFullTank]=useState(true),[receipt,setReceipt]=useState<string|undefined>();
 const vehicle=useMemo(()=>rows.find(v=>v.id===vehicleId)||null,[rows,vehicleId]);
 useEffect(()=>{if(visible&&rows.length&&!vehicleId)setVehicleId(rows[0].id)},[visible,rows.length]);
 useEffect(()=>{if(!vehicle)return;setFuelType(vehicle.fuel_type||'');if(!odometer&&vehicle.current_odometer_km)setOdometer(d(vehicle.current_odometer_km))},[vehicle?.id]);
 const litersN=n(liters),totalN=n(total),priceN=n(price);
 const recalcFromTotal=(raw:string)=>{setTotal(raw);const t=n(raw);if(litersN>0&&t>0)setPrice((t/litersN).toFixed(3).replace('.',','))};
 const recalcFromPrice=(raw:string)=>{setPrice(raw);const p=n(raw);if(litersN>0&&p>0)setTotal((litersN*p).toFixed(2).replace('.',','))};
 const recalcLiters=(raw:string)=>{setLiters(raw);const l=n(raw);if(l>0&&priceN>0)setTotal((l*priceN).toFixed(2).replace('.',','));else if(l>0&&totalN>0)setPrice((totalN/l).toFixed(3).replace('.',','))};
 const pick=async()=>{const p=await ImagePicker.requestMediaLibraryPermissionsAsync();if(!p.granted)return Alert.alert('Comprovante','Permita acesso às fotos.');const r=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:.8});if(!r.canceled)setReceipt(r.assets[0]?.uri)};
 const persist=async(force=false)=>{if(!vehicle)return Alert.alert('Abastecimento','Selecione um veículo.');const occurredAt=new Date(`${date}T${time}:00`).toISOString();const prev=await lastFuelingForVehicle(companyId,vehicle.id,occurredAt);const result=validateFueling({vehicleId:vehicle.id,occurredAt,odometerKm:n(odometer),liters:litersN,totalAmount:totalN,pricePerLiter:priceN,stationName:station,fuelType,fullTank,partialFueling:!fullTank,receiptAttached:Boolean(receipt)},{currentOdometerKm:Number(vehicle.current_odometer_km||0),fuelType:vehicle.fuel_type,avgKmPerLiter:Number(vehicle.avg_km_per_liter||0),referenceFuelPrice:Number(vehicle.reference_fuel_price||0),tankCapacityLiters:Number(vehicle.tank_capacity_liters||0)},prev?{odometerKm:prev.odometerKm,occurredAt:prev.occurredAt,fullTank:prev.fullTank,liters:prev.liters}:null);
 if(result.blocked)return Alert.alert('Registro inconsistente',result.errors.join('\n'));
 if(!force&&result.reviewReasons.length)return Alert.alert('Revisão necessária',[...result.alerts,...result.reviewReasons].join('\n'),[{text:'Cancelar',style:'cancel'},{text:'Salvar para revisão',onPress:()=>persist(true)}]);
 const now=new Date().toISOString();const row:FuelingRecord={id:`fuel-${Date.now()}`,companyId,userId,vehicleId:vehicle.id,vehiclePlate:vehicle.plate,occurredAt,odometerKm:n(odometer),liters:litersN,totalAmount:totalN,pricePerLiter:priceN,stationName:station.trim(),fuelType:fuelType||null,fullTank,partialFueling:!fullTank,receiptUri:receipt||null,status:result.status,alerts:result.alerts,reviewReasons:result.reviewReasons,createdAt:now,updatedAt:now};await saveFueling(row);Alert.alert('Abastecimento salvo',row.status==='valid'?'Registro validado e disponível para o relatório real.':'Registro salvo, mas ficará fora da média real até revisão.');await saved();close()};
 return <Modal visible={visible} animationType="slide" onRequestClose={close}><SafeAreaView style={s.screen}><View style={s.head}><Text style={s.title}>Abastecimento real</Text><Pressable onPress={close}><Text style={s.close}>×</Text></Pressable></View><ScrollView contentContainerStyle={s.form} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
  <Text style={s.label}>Veículo</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{rows.map(v=><Pressable key={v.id} style={[s.chip,vehicleId===v.id&&s.chipOn]} onPress={()=>setVehicleId(v.id)}><Text style={[s.chipText,vehicleId===v.id&&s.chipTextOn]}>{v.plate}</Text></Pressable>)}</ScrollView>
  {vehicle&&<View style={s.reference}><Text style={s.refTitle}>Base do veículo</Text><Text style={s.refText}>{vehicle.fuel_type||'Combustível não informado'} · {vehicle.avg_km_per_liter?`${vehicle.avg_km_per_liter} km/l`:'sem média'} · {vehicle.reference_fuel_price?`R$ ${vehicle.reference_fuel_price}/l`:'sem preço ref.'}</Text></View>}
  <View style={s.row}><Field label="Data" value={date} onChange={setDate}/><Field label="Hora" value={time} onChange={setTime}/></View>
  <Field label="Odômetro (km)" value={odometer} onChange={setOdometer} numeric/>
  <Field label="Litros" value={liters} onChange={recalcLiters} numeric/>
  <Field label="Valor total (R$)" value={total} onChange={recalcFromTotal} numeric/>
  <Field label="Preço por litro (R$)" value={price} onChange={recalcFromPrice} numeric/>
  <Field label="Posto" value={station} onChange={setStation}/><Field label="Combustível" value={fuelType} onChange={setFuelType}/>
  <View style={s.toggleRow}><Text style={s.toggleLabel}>Tanque cheio?</Text><View style={s.toggleBtns}><Pressable style={[s.choice,fullTank&&s.choiceOn]} onPress={()=>setFullTank(true)}><Text style={s.choiceText}>Sim</Text></Pressable><Pressable style={[s.choice,!fullTank&&s.choiceOn]} onPress={()=>setFullTank(false)}><Text style={s.choiceText}>Parcial</Text></Pressable></View></View>
  <Pressable style={s.receipt} onPress={pick}><Text style={s.receiptTitle}>{receipt?'✓ Comprovante anexado':'Anexar comprovante'}</Text><Text style={s.help}>Ajuda na auditoria e aprovação.</Text></Pressable>
  <Pressable style={s.primary} onPress={()=>persist(false)}><Text style={s.primaryText}>Salvar abastecimento</Text></Pressable>
 </ScrollView></SafeAreaView></Modal>
}
function Field({label,value,onChange,numeric=false}:{label:string;value:string;onChange:(v:string)=>void;numeric?:boolean}){return <View style={{flex:1,gap:5}}><Text style={s.label}>{label}</Text><TextInput style={s.input} value={value} onChangeText={onChange} keyboardType={numeric?'decimal-pad':'default'}/></View>}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:BG},head:{backgroundColor:'#fff',padding:18,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderBottomColor:BORDER},title:{fontSize:22,fontWeight:'900',color:TEXT},close:{fontSize:28,color:MUTED},form:{padding:18,gap:12,paddingBottom:44},label:{fontSize:11,fontWeight:'900',color:MUTED},chip:{paddingHorizontal:14,paddingVertical:10,borderRadius:999,backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,marginRight:8},chipOn:{backgroundColor:NAVY,borderColor:NAVY},chipText:{fontSize:11,fontWeight:'900',color:TEXT},chipTextOn:{color:'#fff'},reference:{backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:14,padding:13},refTitle:{fontSize:11,fontWeight:'900',color:NAVY},refText:{fontSize:10,color:MUTED,marginTop:4},row:{flexDirection:'row',gap:8},input:{minHeight:50,borderRadius:13,borderWidth:1,borderColor:BORDER,backgroundColor:'#fff',paddingHorizontal:13,color:TEXT},toggleRow:{backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:14,padding:13},toggleLabel:{fontSize:11,fontWeight:'900',color:TEXT,marginBottom:8},toggleBtns:{flexDirection:'row',gap:8},choice:{paddingHorizontal:13,paddingVertical:9,borderRadius:10,borderWidth:1,borderColor:BORDER},choiceOn:{backgroundColor:'#EEF4FB',borderColor:NAVY},choiceText:{fontSize:10,fontWeight:'900',color:TEXT},receipt:{borderWidth:1,borderStyle:'dashed',borderColor:'#AAB8C8',borderRadius:14,padding:16,backgroundColor:'#fff'},receiptTitle:{fontSize:12,fontWeight:'900',color:NAVY},help:{fontSize:10,color:MUTED,marginTop:3},primary:{minHeight:54,borderRadius:15,backgroundColor:BLUE,alignItems:'center',justifyContent:'center'},primaryText:{color:'#fff',fontWeight:'900'}});
