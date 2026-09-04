import React, { useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import RouteScreen from './src/RouteScreen';
import { enqueue } from './src/offline';

type Tab = 'home' | 'agenda' | 'km' | 'mapa' | 'mais';
type MorePage = 'menu' | 'relatorios' | 'configuracoes';
type Appointment = { id: string; day: number; time: string; title: string; store: string; type: string };

const BLUE = '#0B63E5';
const NAVY = '#07365B';
const BG = '#F4F7FB';
const TEXT = '#17324D';
const MUTED = '#75859A';
const BORDER = '#DFE6EF';

const seed: Appointment[] = [
  { id: '1', day: 14, time: '09:00', title: 'Visita comercial', store: 'Loja Centro', type: 'Visita' },
  { id: '2', day: 14, time: '11:00', title: 'Reunião de equipe', store: 'Loja Avenida', type: 'Reunião' },
  { id: '3', day: 14, time: '14:00', title: 'Acompanhamento', store: 'Loja Shopping', type: 'Visita' },
  { id: '4', day: 14, time: '16:00', title: 'Check-in / Relatório', store: 'Loja Industrial', type: 'Relatório' },
];
const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);

function Header({ title, onMenu, onBack }: { title: string; onMenu?: () => void; onBack?: () => void }) {
  return <View style={s.header}><Pressable style={s.headerBtn} onPress={onBack || onMenu}><Text style={s.headerBtnText}>{onBack ? '‹' : '☰'}</Text></Pressable><Text style={s.headerTitle}>{title}</Text><View style={s.headerBtn}><Text style={s.headerBtnText}>●</Text></View></View>;
}
function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: Array<[Tab, string, string]> = [['home', '⌂', 'Home'], ['agenda', '▣', 'Agenda'], ['km', '◎', 'KM'], ['mapa', '⌖', 'Mapa'], ['mais', '•••', 'Mais']];
  return <View style={s.bottomNav}>{items.map(([key, icon, label]) => <Pressable key={key} style={s.bottomItem} onPress={() => setTab(key)}><Text style={[s.bottomIcon, tab === key && s.active]}>{icon}</Text><Text style={[s.bottomLabel, tab === key && s.active]}>{label}</Text></Pressable>)}</View>;
}
function Kpi({ value, label }: { value: string; label: string }) { return <View style={s.kpi}><Text style={s.kpiValue}>{value}</Text><Text style={s.kpiLabel}>{label}</Text></View>; }
function AgendaRow({ item }: { item: Appointment }) { return <View style={s.agendaRow}><Text style={s.time}>{item.time}</Text><View style={s.line}/><View style={{ flex: 1 }}><Text style={s.store}>{item.store}</Text><Text style={s.sub}>{item.title}</Text></View></View>; }
function Field({ label, value, onChangeText, editable = true }: { label: string; value: string; onChangeText: (v: string) => void; editable?: boolean }) { return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput style={s.input} value={value} onChangeText={onChangeText} editable={editable}/></View>; }

function Home({ goAgenda, goMap }: { goAgenda: () => void; goMap: () => void }) {
  return <ScrollView contentContainerStyle={s.content}><View style={s.profile}><View style={s.avatar}><Text style={s.avatarText}>CS</Text></View><View><Text style={s.hello}>Olá, Carlos</Text><Text style={s.muted}>Supervisor</Text></View></View><View style={s.kpiRow}><Kpi value="12" label="Lojas hoje"/><Kpi value="5" label="Compromissos"/><Kpi value="120 km" label="Percorridos"/></View><View style={s.sectionHead}><Text style={s.sectionTitle}>Agenda de hoje</Text><Pressable onPress={goAgenda}><Text style={s.link}>Ver todos</Text></Pressable></View>{seed.map(item => <AgendaRow key={item.id} item={item}/>)}<Pressable style={s.primary} onPress={goMap}><Text style={s.primaryText}>Iniciar deslocamento</Text></Pressable><View style={s.syncCard}><View><Text style={s.syncTitle}>Sincronização</Text><Text style={s.sub}>Modo offline preparado para Agenda, KM e rotas</Text></View><View style={s.statusDot}/></View></ScrollView>;
}

function Agenda() {
  const [day, setDay] = useState(14);
  const [items, setItems] = useState<Appointment[]>(seed);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Visita comercial');
  const [store, setStore] = useState('Loja Centro');
  const [time, setTime] = useState('09:00');
  const selected = useMemo(() => items.filter(item => item.day === day).sort((a, b) => a.time.localeCompare(b.time)), [items, day]);
  const save = async () => {
    const item: Appointment = { id: String(Date.now()), day, time, title, store, type: 'Visita' };
    setItems(previous => [...previous, item]);
    await enqueue({ entity: 'appointment', action: 'insert', payload: item });
    setOpen(false);
  };
  return <ScrollView contentContainerStyle={s.content}><View style={s.calendar}><View style={s.monthHead}><Text style={s.monthArrow}>‹</Text><Text style={s.monthTitle}>Novembro 2026</Text><Text style={s.monthArrow}>›</Text></View><View style={s.week}>{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((label, i) => <Text key={`${label}-${i}`} style={s.weekText}>{label}</Text>)}</View><View style={s.days}>{monthDays.map(d => { const has = items.some(item => item.day === d); return <Pressable key={d} style={s.dayCell} onPress={() => setDay(d)}><View style={[s.dayCircle, day === d && s.daySelected]}><Text style={[s.dayText, day === d && s.daySelectedText]}>{d}</Text></View>{has && <View style={s.dayDot}/>}</Pressable>; })}</View></View><View style={s.sectionHead}><Text style={s.sectionTitle}>Dia {day}</Text><Pressable onPress={() => setOpen(true)}><Text style={s.link}>+ Novo</Text></Pressable></View>{selected.length ? selected.map(item => <AgendaRow key={item.id} item={item}/>) : <Text style={s.empty}>Nenhum compromisso neste dia.</Text>}<Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}><SafeAreaView style={s.screen}><Header title="Novo compromisso" onBack={() => setOpen(false)}/><ScrollView contentContainerStyle={s.content}><Field label="Título" value={title} onChangeText={setTitle}/><Field label="Data" value={`Novembro ${day}, 2026`} onChangeText={() => {}} editable={false}/><Field label="Horário" value={time} onChangeText={setTime}/><Field label="Loja" value={store} onChangeText={setStore}/><Pressable style={s.primary} onPress={save}><Text style={s.primaryText}>Salvar compromisso</Text></Pressable></ScrollView></SafeAreaView></Modal></ScrollView>;
}

function Km() {
  const [start, setStart] = useState('12340');
  const [end, setEnd] = useState('12520');
  const total = Math.max(0, Number(end || 0) - Number(start || 0));
  const save = async () => enqueue({ entity: 'km', action: 'insert', payload: { vehicle: 'Fiat Strada · ABC1D23', start: Number(start), end: Number(end), total, reason: 'Visita a lojas' } });
  return <ScrollView contentContainerStyle={s.content}><View style={s.segment}><Text style={s.segmentActive}>Registrar</Text><Text style={s.segmentItem}>Histórico</Text></View><Field label="Veículo" value="Fiat Strada · ABC1D23" onChangeText={() => {}} editable={false}/><Field label="KM inicial" value={start} onChangeText={setStart}/><Field label="KM final" value={end} onChangeText={setEnd}/><View style={s.totalCard}><Text style={s.muted}>Total calculado</Text><Text style={s.totalValue}>{total} km</Text></View><Field label="Motivo" value="Visita a lojas" onChangeText={() => {}}/><Pressable style={s.primary} onPress={save}><Text style={s.primaryText}>Salvar registro</Text></Pressable></ScrollView>;
}

function Reports() {
  const rows = [['Visitas realizadas', '46', '+12%'], ['KM percorrido', '1.248 km', '+8%'], ['Tempo em deslocamento', '38h 20m', '-4%'], ['Lojas visitadas', '18', '+3']];
  return <ScrollView contentContainerStyle={s.content}><Text style={s.sectionTitle}>Resumo do período</Text><View style={s.reportGrid}>{rows.map(([label, value, delta]) => <View style={s.reportCard} key={label}><Text style={s.reportLabel}>{label}</Text><Text style={s.reportValue}>{value}</Text><Text style={s.reportDelta}>{delta}</Text></View>)}</View><Pressable style={s.primary}><Text style={s.primaryText}>Exportar relatório</Text></Pressable></ScrollView>;
}
function SettingRow({ title, subtitle, value, setValue }: { title: string; subtitle: string; value: boolean; setValue: (v: boolean) => void }) { return <View style={s.settingRow}><View style={{ flex: 1 }}><Text style={s.moreTitle}>{title}</Text><Text style={s.sub}>{subtitle}</Text></View><Switch value={value} onValueChange={setValue}/></View>; }
function Settings() {
  const [offline, setOffline] = useState(true), [notify, setNotify] = useState(true), [auto, setAuto] = useState(true);
  return <ScrollView contentContainerStyle={s.content}><View style={s.profile}><View style={s.avatar}><Text style={s.avatarText}>CS</Text></View><View><Text style={s.hello}>Carlos Silva</Text><Text style={s.muted}>Supervisor · Movvant Enterprise</Text></View></View><SettingRow title="Sincronização automática" subtitle="Enviar dados quando houver internet" value={auto} setValue={setAuto}/><SettingRow title="Modo offline" subtitle="Continuar trabalhando sem conexão" value={offline} setValue={setOffline}/><SettingRow title="Notificações" subtitle="Agenda, rotas e alertas operacionais" value={notify} setValue={setNotify}/><View style={s.infoCard}><Text style={s.infoTitle}>RC11</Text><Text style={s.sub}>Quality gate ativo · GPS real · fila offline</Text></View></ScrollView>;
}
function More({ page, setPage }: { page: MorePage; setPage: (p: MorePage) => void }) {
  if (page === 'relatorios') return <Reports/>;
  if (page === 'configuracoes') return <Settings/>;
  return <ScrollView contentContainerStyle={s.content}>{[['Lojas', 'menu'], ['Relatórios', 'relatorios'], ['Sincronização', 'menu'], ['Configurações', 'configuracoes'], ['Notificações', 'menu'], ['Sobre', 'menu']].map(([label, pageName]) => <Pressable key={label} style={s.moreRow} onPress={() => setPage(pageName as MorePage)}><Text style={s.moreTitle}>{label}</Text><Text style={s.moreArrow}>›</Text></Pressable>)}</ScrollView>;
}
function Drawer({ visible, close, setTab, setMore }: { visible: boolean; close: () => void; setTab: (t: Tab) => void; setMore: (p: MorePage) => void }) {
  if (!visible) return null;
  const go = (tab: Tab, page?: MorePage) => { setTab(tab); if (page) setMore(page); close(); };
  const entries: Array<[string, () => void]> = [['Home', () => go('home')], ['Agenda', () => go('agenda')], ['Lojas', () => go('mais', 'menu')], ['KM', () => go('km')], ['Deslocamento', () => go('mapa')], ['Relatórios', () => go('mais', 'relatorios')], ['Configurações', () => go('mais', 'configuracoes')]];
  return <View style={s.drawerOverlay}><Pressable style={s.scrim} onPress={close}/><View style={s.drawer}><Text style={s.drawerBrand}>Movvant</Text><Text style={s.drawerEnterprise}>ENTERPRISE</Text><View style={s.drawerProfile}><View style={s.avatar}><Text style={s.avatarText}>CS</Text></View><View><Text style={s.drawerName}>Carlos Silva</Text><Text style={s.drawerRole}>Supervisor</Text></View></View>{entries.map(([label, action]) => <Pressable key={label} style={s.drawerItem} onPress={action}><Text style={s.drawerItemText}>{label}</Text></Pressable>)}<View style={{ flex: 1 }}/><Pressable style={s.drawerExit}><Text style={s.drawerItemText}>Sair</Text></Pressable></View></View>;
}

export default function AppRC11() {
  const [tab, setTab] = useState<Tab>('home');
  const [drawer, setDrawer] = useState(false);
  const [more, setMore] = useState<MorePage>('menu');
  const title = tab === 'home' ? 'Movvant' : tab === 'agenda' ? 'Agenda' : tab === 'km' ? 'KM' : tab === 'mapa' ? 'Deslocamento' : more === 'relatorios' ? 'Relatórios' : more === 'configuracoes' ? 'Configurações' : 'Mais';
  const setMain = (next: Tab) => { setTab(next); if (next !== 'mais') setMore('menu'); };
  return <SafeAreaView style={s.screen}><StatusBar barStyle="light-content" backgroundColor={NAVY}/><Header title={title} onMenu={() => setDrawer(true)}/><View style={s.body}>{tab === 'home' && <Home goAgenda={() => setMain('agenda')} goMap={() => setMain('mapa')}/>} {tab === 'agenda' && <Agenda/>}{tab === 'km' && <Km/>}{tab === 'mapa' && <RouteScreen/>}{tab === 'mais' && <More page={more} setPage={setMore}/>}</View><BottomNav tab={tab} setTab={setMain}/><Drawer visible={drawer} close={() => setDrawer(false)} setTab={setMain} setMore={setMore}/></SafeAreaView>;
}

const s = StyleSheet.create({
  screen:{flex:1,backgroundColor:BG},body:{flex:1},content:{padding:16,paddingBottom:28,gap:10},header:{height:58,backgroundColor:NAVY,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:10},headerBtn:{width:38,height:38,alignItems:'center',justifyContent:'center'},headerBtnText:{color:'#fff',fontSize:22,fontWeight:'700'},headerTitle:{color:'#fff',fontSize:16,fontWeight:'800'},bottomNav:{height:66,borderTopWidth:1,borderTopColor:BORDER,backgroundColor:'#fff',flexDirection:'row'},bottomItem:{flex:1,alignItems:'center',justifyContent:'center'},bottomIcon:{fontSize:18,color:'#6B7B8D'},bottomLabel:{fontSize:10,color:'#6B7B8D',marginTop:2},active:{color:BLUE,fontWeight:'800'},profile:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:4},avatar:{width:42,height:42,borderRadius:21,backgroundColor:'#DCEBFA',alignItems:'center',justifyContent:'center'},avatarText:{fontWeight:'900',color:NAVY},hello:{fontSize:17,fontWeight:'800',color:TEXT},muted:{fontSize:12,color:MUTED},kpiRow:{flexDirection:'row',gap:8},kpi:{flex:1,backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:14,padding:12},kpiValue:{fontSize:19,fontWeight:'900',color:TEXT},kpiLabel:{fontSize:10,color:MUTED,marginTop:3},sectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:8},sectionTitle:{fontSize:15,fontWeight:'900',color:TEXT},link:{color:BLUE,fontWeight:'800',fontSize:12},agendaRow:{minHeight:56,backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:12,flexDirection:'row',alignItems:'center',padding:10},time:{width:50,fontSize:12,fontWeight:'800',color:TEXT},line:{width:3,height:34,backgroundColor:'#20B26B',borderRadius:4,marginRight:10},store:{fontSize:13,fontWeight:'800',color:TEXT},sub:{fontSize:11,color:MUTED,marginTop:2},primary:{backgroundColor:BLUE,borderRadius:10,minHeight:46,alignItems:'center',justifyContent:'center',marginTop:6},primaryText:{color:'#fff',fontWeight:'900'},syncCard:{backgroundColor:'#EAF5EF',borderRadius:12,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},syncTitle:{fontSize:13,fontWeight:'800',color:TEXT},statusDot:{width:10,height:10,borderRadius:5,backgroundColor:'#20B26B'},calendar:{backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:14,padding:12},monthHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},monthArrow:{fontSize:24,color:NAVY},monthTitle:{fontWeight:'900',color:TEXT},week:{flexDirection:'row',marginTop:12},weekText:{width:'14.285%',textAlign:'center',fontSize:10,fontWeight:'800',color:MUTED},days:{flexDirection:'row',flexWrap:'wrap',marginTop:4},dayCell:{width:'14.285%',alignItems:'center',height:42},dayCircle:{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'},daySelected:{backgroundColor:BLUE},dayText:{fontSize:12,color:TEXT},daySelectedText:{color:'#fff',fontWeight:'900'},dayDot:{width:4,height:4,borderRadius:2,backgroundColor:'#20B26B',marginTop:1},empty:{backgroundColor:'#fff',padding:16,borderRadius:12,color:MUTED},field:{gap:5},label:{fontSize:11,fontWeight:'800',color:TEXT},input:{minHeight:44,borderWidth:1,borderColor:BORDER,borderRadius:10,paddingHorizontal:12,backgroundColor:'#fff',color:TEXT},segment:{height:42,backgroundColor:'#fff',borderRadius:10,flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderWidth:1,borderColor:BORDER},segmentActive:{color:BLUE,fontWeight:'900'},segmentItem:{color:MUTED},totalCard:{backgroundColor:'#fff',borderRadius:12,borderWidth:1,borderColor:BORDER,padding:14,flexDirection:'row',justifyContent:'space-between'},totalValue:{fontSize:16,fontWeight:'900',color:TEXT},moreRow:{minHeight:60,backgroundColor:'#fff',borderRadius:12,borderWidth:1,borderColor:BORDER,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},moreTitle:{fontSize:13,fontWeight:'800',color:TEXT},moreArrow:{fontSize:22,color:MUTED},reportGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},reportCard:{width:'48.7%',backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:12,padding:12},reportLabel:{fontSize:10,color:MUTED},reportValue:{fontSize:17,fontWeight:'900',color:TEXT,marginTop:4},reportDelta:{fontSize:10,color:'#20A464',marginTop:3,fontWeight:'800'},settingRow:{minHeight:66,backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:12,padding:12,flexDirection:'row',alignItems:'center',gap:10},infoCard:{backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:12,padding:14,gap:5},infoTitle:{fontSize:14,fontWeight:'900',color:TEXT},drawerOverlay:{...StyleSheet.absoluteFill,zIndex:20,flexDirection:'row'},scrim:{flex:1,backgroundColor:'rgba(0,0,0,.35)'},drawer:{position:'absolute',left:0,top:0,bottom:0,width:'78%',maxWidth:330,backgroundColor:'#062E4E',padding:20,paddingTop:36},drawerBrand:{fontSize:27,fontWeight:'900',color:'#fff'},drawerEnterprise:{fontSize:10,letterSpacing:4,color:'#B8D1E6',marginBottom:18},drawerProfile:{flexDirection:'row',gap:10,alignItems:'center',marginBottom:16},drawerName:{color:'#fff',fontWeight:'900'},drawerRole:{color:'#B8D1E6',fontSize:11},drawerItem:{minHeight:44,justifyContent:'center',borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,.08)'},drawerItemText:{color:'#fff',fontSize:13,fontWeight:'700'},drawerExit:{minHeight:48,justifyContent:'center',borderTopWidth:1,borderTopColor:'rgba(255,255,255,.15)'}
});
