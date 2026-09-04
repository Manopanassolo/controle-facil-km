from pathlib import Path

route = r'''import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import type { LocationSubscription } from 'expo-location';
import { distanceMeters, getCurrentPoint, Point, watchRoute } from './location';
import { enqueue, saveTripLocal } from './offline';

type RouteStatus = 'idle' | 'starting' | 'running' | 'paused' | 'finished';
type Props = { onSaved?: () => void };

const BLUE = '#1769E0';
const ORANGE = '#F59E0B';
const NAVY = '#0B3558';
const MUTED = '#7A899A';
const RED = '#E5484D';

export default function RouteScreen({ onSaved }: Props) {
  const [status, setStatus] = useState<RouteStatus>('idle');
  const [points, setPoints] = useState<Point[]>([]);
  const [returnStart, setReturnStart] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [region, setRegion] = useState<Region | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const subscription = useRef<LocationSubscription | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const lastElapsedBase = useRef(0);
  const resumeStartedAt = useRef<number | null>(null);

  useEffect(() => {
    if (status !== 'running') return;
    if (!resumeStartedAt.current) resumeStartedAt.current = Date.now();
    const timer = setInterval(() => {
      const segment = resumeStartedAt.current ? Date.now() - resumeStartedAt.current : 0;
      setElapsed(lastElapsedBase.current + segment);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => () => {
    subscription.current?.remove();
    subscription.current = null;
  }, []);

  const distance = useMemo(() => {
    let total = 0;
    for (let i = 1; i < points.length; i += 1) total += distanceMeters(points[i - 1], points[i]);
    return total;
  }, [points]);

  const outbound = returnStart == null ? points : points.slice(0, returnStart + 1);
  const returning = returnStart == null ? [] : points.slice(returnStart);

  const followPoint = (point: Point) => {
    if (!mapReady) return;
    mapRef.current?.animateToRegion({ latitude: point.latitude, longitude: point.longitude, latitudeDelta: 0.018, longitudeDelta: 0.018 }, 500);
  };

  const beginWatcher = async () => {
    try {
      subscription.current?.remove();
      subscription.current = await watchRoute(point => {
        setPoints(previous => {
          const last = previous[previous.length - 1];
          if (last && distanceMeters(last, point) < 3) return previous;
          return [...previous, point];
        });
        followPoint(point);
      });
      if (!subscription.current) Alert.alert('GPS', 'A rota iniciou, mas o acompanhamento contínuo não pôde ser ativado.');
    } catch {
      subscription.current = null;
      Alert.alert('GPS', 'Não foi possível iniciar o acompanhamento contínuo da localização.');
    }
  };

  const start = async () => {
    if (status === 'starting') return;
    setStatus('starting');
    setMapReady(false);
    try {
      const result = await getCurrentPoint();
      if (!result.ok) {
        setStatus('idle');
        Alert.alert('Localização necessária', result.reason);
        return;
      }
      const first = result.point;
      setPoints([first]);
      setReturnStart(null);
      setStartedAt(Date.now());
      lastElapsedBase.current = 0;
      resumeStartedAt.current = Date.now();
      setElapsed(0);
      setRegion({ latitude: first.latitude, longitude: first.longitude, latitudeDelta: 0.018, longitudeDelta: 0.018 });
      setStatus('running');
      await beginWatcher();
    } catch {
      setStatus('idle');
      Alert.alert('Não foi possível iniciar', 'O Movvant encontrou um erro ao iniciar o deslocamento. Nenhum registro foi criado.');
    }
  };

  const pause = () => {
    subscription.current?.remove();
    subscription.current = null;
    if (resumeStartedAt.current) lastElapsedBase.current += Date.now() - resumeStartedAt.current;
    resumeStartedAt.current = null;
    setElapsed(lastElapsedBase.current);
    setStatus('paused');
  };

  const resume = async () => {
    resumeStartedAt.current = Date.now();
    setStatus('running');
    await beginWatcher();
  };

  const markReturn = () => {
    if (points.length > 1 && returnStart == null) return setReturnStart(points.length - 1);
    if (returnStart == null) Alert.alert('Retorno', 'Aguarde o GPS registrar mais pontos da rota antes de marcar o retorno.');
  };

  const finish = async () => {
    try {
      subscription.current?.remove();
      subscription.current = null;
      if (status === 'running' && resumeStartedAt.current) {
        lastElapsedBase.current += Date.now() - resumeStartedAt.current;
        resumeStartedAt.current = null;
      }
      const finalElapsed = lastElapsedBase.current || elapsed;
      const finishedAt = Date.now();
      const id = `${finishedAt}-trip`;
      setElapsed(finalElapsed);
      setStatus('finished');
      await saveTripLocal({ id, startedAt, finishedAt, elapsedMs: finalElapsed, distanceMeters: Math.round(distance), returnStart, pointsCount: points.length, synced: false });
      await enqueue({ entity: 'trip', action: 'finish', payload: { localId: id, startedAt, finishedAt, elapsedMs: finalElapsed, distanceMeters: Math.round(distance), returnStart, points } });
      onSaved?.();
      Alert.alert('Deslocamento salvo', 'A rota foi salva no aparelho e entrou na fila de sincronização.');
    } catch {
      Alert.alert('Falha ao salvar', 'A rota foi finalizada, mas não foi possível gravar o registro local.');
    }
  };

  const center = () => {
    const point = points[points.length - 1];
    if (point) followPoint(point);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const title = status === 'running' ? 'Em deslocamento' : status === 'paused' ? 'Deslocamento pausado' : status === 'finished' ? 'Deslocamento finalizado' : status === 'starting' ? 'Localizando veículo...' : 'Pronto para iniciar';

  return <View style={styles.screen}>
    {region ? <>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={StyleSheet.absoluteFill} initialRegion={region} showsUserLocation showsMyLocationButton={false} showsCompass toolbarEnabled={false} moveOnMarkerPress={false} onMapReady={() => setMapReady(true)} onMapLoaded={() => setMapReady(true)}>
        {points[0] && <Marker coordinate={points[0]} title="Início" pinColor="#22B77A"/>}
        {points.length > 1 && <Marker coordinate={points[points.length - 1]} title="Posição atual"/>}
        {outbound.length > 1 && <Polyline coordinates={outbound} strokeWidth={5} strokeColor={BLUE}/>} 
        {returning.length > 1 && <Polyline coordinates={returning} strokeWidth={5} strokeColor={ORANGE}/>} 
      </MapView>
      <Pressable style={styles.centerMap} onPress={center}><Text style={styles.centerMapText}>⌖</Text></Pressable>
      {!mapReady && <View style={styles.mapLoading}><Text style={styles.mapLoadingText}>Carregando mapa...</Text></View>}
    </> : <View style={styles.emptyMap}><View style={styles.pinBadge}><Text style={styles.pinIcon}>⌖</Text></View><Text style={styles.emptyTitle}>Mapa pronto para iniciar</Text><Text style={styles.emptyText}>O GPS será solicitado somente quando você tocar em iniciar deslocamento.</Text></View>}

    <View style={styles.panel}>
      <View style={styles.statusLine}><View style={[styles.statusDot,status==='running'&&styles.statusDotOn]}/><Text style={styles.title}>{title}</Text></View>
      <View style={styles.metrics}><View style={styles.metric}><Text style={styles.value}>{formatTime(elapsed)}</Text><Text style={styles.label}>Tempo ativo</Text></View><View style={styles.metricRight}><Text style={styles.value}>{(distance/1000).toFixed(1)} km</Text><Text style={styles.label}>Distância GPS</Text></View></View>
      {status==='idle'||status==='finished'||status==='starting' ? <Pressable style={[styles.primary,status==='starting'&&styles.disabled]} onPress={start} disabled={status==='starting'}><Text style={styles.primaryText}>{status==='starting'?'Localizando...':status==='finished'?'Iniciar novo deslocamento':'Iniciar deslocamento'}</Text></Pressable> : <View style={styles.actions}><View style={styles.actionRow}><Pressable style={styles.secondary} onPress={status==='paused'?resume:pause}><Text style={styles.secondaryText}>{status==='paused'?'Continuar':'Pausar'}</Text></Pressable><Pressable style={styles.returnButton} onPress={markReturn}><Text style={styles.returnText}>{returnStart==null?'Marcar retorno':'Retorno marcado'}</Text></Pressable></View><Pressable style={styles.finish} onPress={finish}><Text style={styles.finishText}>Finalizar deslocamento</Text></Pressable></View>}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#E8EEF5'},emptyMap:{flex:1,alignItems:'center',justifyContent:'center',padding:30,backgroundColor:'#EAF0F6'},pinBadge:{width:72,height:72,borderRadius:36,backgroundColor:'#DCEAF8',alignItems:'center',justifyContent:'center',marginBottom:14},pinIcon:{fontSize:30,color:NAVY,fontWeight:'800'},emptyTitle:{fontSize:20,fontWeight:'900',color:NAVY},emptyText:{fontSize:13,color:MUTED,textAlign:'center',marginTop:8,lineHeight:19,maxWidth:320},centerMap:{position:'absolute',right:18,top:18,width:46,height:46,borderRadius:23,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},centerMapText:{fontSize:22,color:NAVY,fontWeight:'900'},mapLoading:{position:'absolute',top:18,left:18,backgroundColor:'#FFFFFFEE',paddingHorizontal:12,paddingVertical:8,borderRadius:12},mapLoadingText:{fontSize:11,color:MUTED,fontWeight:'800'},panel:{backgroundColor:'#fff',paddingHorizontal:20,paddingTop:20,paddingBottom:18,borderTopLeftRadius:30,borderTopRightRadius:30,elevation:10,shadowColor:'#17324D',shadowOpacity:.10,shadowRadius:14},statusLine:{flexDirection:'row',alignItems:'center',gap:8},statusDot:{width:9,height:9,borderRadius:5,backgroundColor:'#B8C4D1'},statusDotOn:{backgroundColor:'#25B979'},title:{fontSize:17,fontWeight:'900',color:NAVY},metrics:{flexDirection:'row',justifyContent:'space-between',paddingVertical:16},metric:{alignItems:'flex-start'},metricRight:{alignItems:'flex-end'},value:{fontSize:22,fontWeight:'900',color:NAVY},label:{fontSize:11,color:MUTED,marginTop:2},actions:{gap:10},actionRow:{flexDirection:'row',gap:10},primary:{minHeight:58,backgroundColor:BLUE,borderRadius:17,alignItems:'center',justifyContent:'center'},disabled:{opacity:.6},primaryText:{color:'#fff',fontWeight:'900',fontSize:15},secondary:{flex:1,minHeight:48,backgroundColor:'#EDF2F7',borderRadius:12,alignItems:'center',justifyContent:'center'},secondaryText:{color:NAVY,fontWeight:'800'},returnButton:{flex:1,minHeight:48,backgroundColor:'#FFF3E4',borderRadius:12,alignItems:'center',justifyContent:'center'},returnText:{color:ORANGE,fontWeight:'900'},finish:{minHeight:48,backgroundColor:'#FFF0F0',borderRadius:12,borderWidth:1,borderColor:'#F7C6C8',alignItems:'center',justifyContent:'center'},finishText:{color:RED,fontWeight:'900'}
});
'''
Path('mobile-rc11/src/RouteScreen.tsx').write_text(route)

p = Path('mobile-rc11/src/offline.ts')
s = p.read_text()
anchor = "export async function saveKmLocal(item: LocalKmRecord) {"
helper = "export async function removeAppointmentLocal(id: string) {\n  return mutateLocal(state => ({ ...state, appointments: state.appointments.filter(x => x.id !== id) }));\n}\n\n"
if 'removeAppointmentLocal' not in s:
    if anchor not in s:
        raise SystemExit('offline anchor missing')
    s = s.replace(anchor, helper + anchor)
p.write_text(s)

p = Path('mobile-rc11/AppRC11Final.tsx')
s = p.read_text()
s = s.replace("import { LocalAppointment, LocalKmRecord, LocalState, enqueue, readLocalState, readQueue, saveAppointmentLocal, saveKmLocal, syncPending } from './src/offline';", "import { LocalAppointment, LocalKmRecord, LocalState, enqueue, readLocalState, readQueue, removeAppointmentLocal, saveAppointmentLocal, saveKmLocal, syncPending } from './src/offline';")
s = s.replace("function AgendaRow({ item }: { item: Appointment }) { return <View style={s.agendaRow}><Text style={s.time}>{item.time}</Text><View style={[s.greenLine, item.local && { backgroundColor: ORANGE }]}/><View style={{ flex: 1 }}><Text style={s.store}>{item.store}</Text><Text style={s.sub}>{item.title}{item.local ? ' · aguardando sincronização' : ''}</Text></View></View>; }", "function AgendaRow({ item, onPress }: { item: Appointment; onPress?: () => void }) { return <Pressable style={s.agendaRow} onPress={onPress}><Text style={s.time}>{item.time}</Text><View style={[s.greenLine, item.local && { backgroundColor: ORANGE }]}/><View style={{ flex: 1 }}><Text style={s.store}>{item.store}</Text><Text style={s.sub}>{item.title}{item.local ? ' · aguardando sincronização' : ''}</Text></View><Text style={s.rowArrow}>›</Text></Pressable>; }")
start = s.find('function Agenda({ appointments, customers, onSave }')
end = s.find('\nfunction Km(', start)
if start < 0 or end < 0:
    raise SystemExit('agenda anchors missing')
agenda = r'''function Agenda({ appointments, customers, onSave, onDelete }: { appointments: Appointment[]; customers: CustomerRow[]; onSave: (item: LocalAppointment) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const now=new Date();
  const [cursor,setCursor]=useState(new Date(now.getFullYear(),now.getMonth(),1));
  const [selected,setSelected]=useState(isoDate(now));
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<Appointment|null>(null);
  const [title,setTitle]=useState('');
  const [time,setTime]=useState('09:00');
  const [customer,setCustomer]=useState<CustomerRow|null>(null);
  const [picker,setPicker]=useState(false);
  const y=cursor.getFullYear(),m=cursor.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
  const cells=Array.from({length:first+days},(_,i)=>i<first?null:i-first+1);
  const dayItems=useMemo(()=>appointments.filter(x=>x.date===selected).sort((a,b)=>a.time.localeCompare(b.time)),[appointments,selected]);
  const selectedObj=new Date(`${selected}T12:00:00`);
  const change=(d:number)=>{const n=new Date(y,m+d,1);setCursor(n);setSelected(isoDate(n.getFullYear()===now.getFullYear()&&n.getMonth()===now.getMonth()?now:n));};
  const newItem=()=>{setEditing(null);setTitle('');setTime('09:00');setCustomer(null);setOpen(true);};
  const openItem=(item:Appointment)=>{setEditing(item);setTitle(item.title);setTime(item.time);setCustomer(customers.find(c=>c.id===item.customerId)||null);setOpen(true);};
  const save=async()=>{
    if(editing && !editing.local) return setOpen(false);
    if(!title.trim()) return Alert.alert('Compromisso','Informe um título.');
    if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return Alert.alert('Horário','Use o formato HH:MM.');
    const item:LocalAppointment={id:editing?.id||`${Date.now()}-appointment`,date:selected,time,title:title.trim(),store:customer?customerName(customer):editing?.store||'Sem loja definida',type:'Compromisso',customerId:customer?.id||editing?.customerId,synced:false};
    await onSave(item);setOpen(false);setEditing(null);
  };
  const remove=()=>{if(!editing?.local)return;Alert.alert('Excluir compromisso','Deseja remover este compromisso do aparelho?',[{text:'Cancelar',style:'cancel'},{text:'Excluir',style:'destructive',onPress:async()=>{await onDelete(editing.id);setOpen(false);setEditing(null);}}]);};
  return <ScrollView contentContainerStyle={s.content}>
    <View style={s.calendar}><View style={s.monthHead}><Pressable onPress={()=>change(-1)}><Text style={s.arrow}>‹</Text></Pressable><Text style={s.monthTitle}>{MONTHS[m]} {y}</Text><Pressable onPress={()=>change(1)}><Text style={s.arrow}>›</Text></Pressable></View><View style={s.week}>{['D','S','T','Q','Q','S','S'].map((x,i)=><Text key={i} style={s.weekText}>{x}</Text>)}</View><View style={s.days}>{cells.map((d,i)=>!d?<View key={`e-${i}`} style={s.dayCell}/>:<Pressable key={d} style={s.dayCell} onPress={()=>setSelected(isoDate(new Date(y,m,d)))}><View style={[s.dayCircle,selected===isoDate(new Date(y,m,d))&&s.daySelected]}><Text style={[s.dayText,selected===isoDate(new Date(y,m,d))&&s.dayTextSelected]}>{d}</Text></View>{appointments.some(x=>x.date===isoDate(new Date(y,m,d)))&&<View style={s.dayDot}/>}</Pressable>)}</View></View>
    <View style={s.sectionHead}><Text style={s.sectionTitle}>{WEEK[selectedObj.getDay()]}, {selectedObj.getDate()} de {MONTHS[selectedObj.getMonth()].toLowerCase()}</Text><Pressable onPress={newItem}><Text style={s.link}>+ Novo</Text></Pressable></View>
    {dayItems.length?dayItems.map(x=><AgendaRow key={x.id} item={x} onPress={()=>openItem(x)}/>):<Empty title="Nenhum compromisso" text="Toque em + Novo para adicionar."/>}
    <Modal visible={open} animationType="slide" onRequestClose={()=>setOpen(false)}><SafeAreaView style={s.screen}><View style={s.modalHeader}><Pressable onPress={()=>setOpen(false)}><Text style={s.modalBack}>‹</Text></Pressable><Text style={s.modalTitle}>{editing?'Compromisso':'Novo compromisso'}</Text><View style={{width:32}}/></View><ScrollView contentContainerStyle={s.content}><Field label="Título" value={title} setValue={setTitle} editable={!editing||Boolean(editing.local)} placeholder="Ex.: Visita comercial"/><Field label="Data" value={`${pad(selectedObj.getDate())}/${pad(selectedObj.getMonth()+1)}/${selectedObj.getFullYear()}`} setValue={()=>{}} editable={false}/><Field label="Horário" value={time} setValue={setTime} editable={!editing||Boolean(editing.local)}/><View style={s.field}><Text style={s.label}>Loja</Text><Pressable style={s.inputButton} onPress={()=>!editing||editing.local?setPicker(true):undefined}><Text style={customer?s.inputButtonText:s.inputPlaceholder}>{customer?customerName(customer):editing?.store||'Selecionar loja'}</Text><Text style={s.rowArrow}>›</Text></Pressable></View>{editing&&!editing.local?<Empty title="Compromisso sincronizado" text={`Status: ${editing.status||'planejado'}. Alterações remotas respeitam a permissão empresarial.`}/>:<Pressable style={s.primary} onPress={save}><Text style={s.primaryText}>{editing?'Salvar alterações':'Salvar compromisso'}</Text></Pressable>}{editing?.local&&<Pressable style={s.logout} onPress={remove}><Text style={s.logoutText}>Excluir compromisso</Text></Pressable>}</ScrollView><CustomerPicker visible={picker} customers={customers} selected={customer?.id} close={()=>setPicker(false)} select={setCustomer}/></SafeAreaView></Modal>
  </ScrollView>;
}
'''
s = s[:start] + agenda + s[end:]
old = "const saveAppointment = async (item: LocalAppointment) => { await saveAppointmentLocal(item); await enqueue({ entity:'appointment',action:'insert',payload:{ localId:item.id,date:item.date,time:item.time,title:item.title,customerId:item.customerId,store:item.store } }); await reloadLocal(); };"
if old not in s:
    raise SystemExit('save appointment anchor missing')
s = s.replace(old, old + "\n  const deleteAppointment = async (id: string) => { await removeAppointmentLocal(id); await reloadLocal(); };")
s = s.replace("<Agenda appointments={appointments} customers={data?.customers||[]} onSave={saveAppointment}/>", "<Agenda appointments={appointments} customers={data?.customers||[]} onSave={saveAppointment} onDelete={deleteAppointment}/>")
s = s.replace('Movvant Mobile · Visual 100', 'Movvant Mobile · Integrado')
p.write_text(s)

status = '''# Movvant Mobile — recuperação integrada\n\nO desenvolvimento passa a tratar visual e função como uma única entrega.\n\n## Fechado neste bloco\n- mapa com provedor Google explícito, ciclo de montagem mais seguro e centralização manual;\n- GPS com início, acompanhamento, pausa, retorno e finalização preservados;\n- Agenda com abertura de compromisso, criação, edição e exclusão local;\n- compromissos remotos abrem em modo de leitura sem simular permissão de edição;\n- fila offline e sincronização preservadas;\n- padrão Visual 100 mantido.\n\nO mapa ainda precisa de validação física em Android porque a falha anterior encerrava o processo nativo e não pode ser comprovada apenas por TypeScript/Expo Doctor.\n'''
Path('mobile-rc11/INTEGRATED_RECOVERY_STATUS.md').write_text(status)
