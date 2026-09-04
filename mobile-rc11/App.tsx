import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';

type Tab = 'home' | 'agenda' | 'km' | 'mapa' | 'mais';

type Appointment = {
  id: string;
  day: number;
  time: string;
  title: string;
  store: string;
  type: string;
};

const appointmentsSeed: Appointment[] = [
  { id: '1', day: 14, time: '09:00', title: 'Visita comercial', store: 'Loja Centro', type: 'Visita' },
  { id: '2', day: 14, time: '11:00', title: 'Reunião de equipe', store: 'Loja Avenida', type: 'Reunião' },
  { id: '3', day: 14, time: '14:00', title: 'Acompanhamento', store: 'Loja Shopping', type: 'Visita' },
  { id: '4', day: 14, time: '16:00', title: 'Check-in / Relatório', store: 'Loja Industrial', type: 'Relatório' },
];

const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);

function Header({ title, onMenu, onBack }: { title: string; onMenu?: () => void; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.headerIcon} onPress={onBack || onMenu}>
        <Text style={styles.headerIconText}>{onBack ? '‹' : '☰'}</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerIcon}><Text style={styles.headerIconText}>●</Text></View>
    </View>
  );
}

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  const items: Array<[Tab, string, string]> = [
    ['home', '⌂', 'Home'],
    ['agenda', '▣', 'Agenda'],
    ['km', '◎', 'KM'],
    ['mapa', '⌖', 'Mapa'],
    ['mais', '•••', 'Mais'],
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map(([key, icon, label]) => (
        <Pressable key={key} style={styles.bottomItem} onPress={() => setTab(key)}>
          <Text style={[styles.bottomIcon, tab === key && styles.activeBlue]}>{icon}</Text>
          <Text style={[styles.bottomLabel, tab === key && styles.activeBlue]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Home({ goAgenda, goMap }: { goAgenda: () => void; goMap: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.profileRow}>
        <View style={styles.avatar}><Text style={styles.avatarText}>CS</Text></View>
        <View>
          <Text style={styles.hello}>Olá, Carlos</Text>
          <Text style={styles.muted}>Supervisor</Text>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <Kpi value="12" label="Lojas hoje" />
        <Kpi value="5" label="Compromissos" />
        <Kpi value="120 km" label="Percorridos" />
      </View>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Agenda de hoje</Text>
        <Pressable onPress={goAgenda}><Text style={styles.link}>Ver todos</Text></Pressable>
      </View>

      {appointmentsSeed.map(item => <AgendaRow key={item.id} item={item} />)}

      <Pressable style={styles.primaryButton} onPress={goMap}>
        <Text style={styles.primaryButtonText}>Iniciar deslocamento</Text>
      </Pressable>
    </ScrollView>
  );
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

function AgendaRow({ item }: { item: Appointment }) {
  return (
    <View style={styles.agendaRow}>
      <Text style={styles.agendaTime}>{item.time}</Text>
      <View style={styles.timeline} />
      <View style={styles.flex1}>
        <Text style={styles.agendaStore}>{item.store}</Text>
        <Text style={styles.agendaTitle}>{item.title}</Text>
      </View>
    </View>
  );
}

function Agenda() {
  const [selectedDay, setSelectedDay] = useState(14);
  const [appointments, setAppointments] = useState(appointmentsSeed);
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState('Visita comercial');
  const [store, setStore] = useState('Loja Centro');
  const [time, setTime] = useState('09:00');

  const selected = useMemo(
    () => appointments.filter(a => a.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDay],
  );

  const save = () => {
    setAppointments(prev => [
      ...prev,
      { id: String(Date.now()), day: selectedDay, time, title, store, type: 'Visita' },
    ]);
    setEditorOpen(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.calendarCard}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthArrow}>‹</Text>
          <Text style={styles.monthTitle}>Novembro 2026</Text>
          <Text style={styles.monthArrow}>›</Text>
        </View>
        <View style={styles.weekHeader}>
          {['D','S','T','Q','Q','S','S'].map((d, i) => <Text key={i} style={styles.weekText}>{d}</Text>)}
        </View>
        <View style={styles.daysGrid}>
          {monthDays.map(day => {
            const has = appointments.some(a => a.day === day);
            return (
              <Pressable key={day} style={styles.dayCell} onPress={() => setSelectedDay(day)}>
                <View style={[styles.dayCircle, selectedDay === day && styles.daySelected]}>
                  <Text style={[styles.dayText, selectedDay === day && styles.daySelectedText]}>{day}</Text>
                </View>
                {has && <View style={styles.dayDot} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Dia {selectedDay}</Text>
        <Pressable onPress={() => setEditorOpen(true)}><Text style={styles.link}>+ Novo</Text></Pressable>
      </View>
      {selected.length ? selected.map(item => <AgendaRow key={item.id} item={item} />) : <Text style={styles.empty}>Nenhum compromisso neste dia.</Text>}

      <Modal visible={editorOpen} animationType="slide" onRequestClose={() => setEditorOpen(false)}>
        <SafeAreaView style={styles.screen}>
          <Header title="Novo compromisso" onBack={() => setEditorOpen(false)} />
          <ScrollView contentContainerStyle={styles.content}>
            <Field label="Título" value={title} onChangeText={setTitle} />
            <Field label="Data" value={`Novembro ${selectedDay}, 2026`} onChangeText={() => {}} editable={false} />
            <Field label="Horário" value={time} onChangeText={setTime} />
            <Field label="Loja" value={store} onChangeText={setStore} />
            <Field label="Descrição" value="Verificar estoque e alinhamento da campanha." onChangeText={() => {}} />
            <Pressable style={styles.primaryButton} onPress={save}><Text style={styles.primaryButtonText}>Salvar compromisso</Text></Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, editable = true }: { label: string; value: string; onChangeText: (v: string) => void; editable?: boolean }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} editable={editable} />
    </View>
  );
}

function Km() {
  const [start, setStart] = useState('12340');
  const [end, setEnd] = useState('12520');
  const total = Math.max(0, Number(end || 0) - Number(start || 0));
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.segment}><Text style={styles.segmentActive}>Registrar</Text><Text style={styles.segmentItem}>Histórico</Text></View>
      <Field label="Veículo" value="Fiat Strada · ABC1D23" onChangeText={() => {}} editable={false} />
      <Field label="KM inicial" value={start} onChangeText={setStart} />
      <Field label="KM final" value={end} onChangeText={setEnd} />
      <View style={styles.totalCard}><Text style={styles.muted}>Total calculado</Text><Text style={styles.totalValue}>{total} km</Text></View>
      <Field label="Motivo" value="Visita a lojas" onChangeText={() => {}} />
      <Pressable style={styles.primaryButton}><Text style={styles.primaryButtonText}>Salvar registro</Text></Pressable>
    </ScrollView>
  );
}

function MapScreen() {
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  return (
    <View style={styles.mapScreen}>
      <View style={styles.fakeMap}>
        <View style={[styles.routeSegment, { transform: [{ rotate: '-20deg' }], left: 45, top: 185, width: 120 }]} />
        <View style={[styles.routeSegment, { transform: [{ rotate: '35deg' }], left: 135, top: 145, width: 130 }]} />
        <View style={[styles.routeSegmentOrange, { transform: [{ rotate: '8deg' }], left: 220, top: 205, width: 95 }]} />
        <View style={[styles.pin, { left: 36, top: 190 }]}><Text style={styles.pinText}>A</Text></View>
        <View style={[styles.pinRed, { right: 28, top: 178 }]}><Text style={styles.pinText}>B</Text></View>
        <View style={styles.mapBadge}><Text style={styles.mapBadgeText}>Rota ativa · GPS</Text></View>
      </View>
      <View style={styles.tripPanel}>
        <Text style={styles.tripTitle}>{running ? (paused ? 'Deslocamento pausado' : 'Em deslocamento') : 'Pronto para iniciar'}</Text>
        <View style={styles.tripMetrics}>
          <View><Text style={styles.metricValue}>{running ? '00:42:15' : '00:00:00'}</Text><Text style={styles.muted}>Tempo</Text></View>
          <View><Text style={styles.metricValue}>{running ? '12,4 km' : '0 km'}</Text><Text style={styles.muted}>Distância</Text></View>
        </View>
        {!running ? (
          <Pressable style={styles.primaryButton} onPress={() => setRunning(true)}><Text style={styles.primaryButtonText}>Iniciar deslocamento</Text></Pressable>
        ) : (
          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton} onPress={() => setPaused(v => !v)}><Text style={styles.secondaryButtonText}>{paused ? 'Continuar' : 'Pausar'}</Text></Pressable>
            <Pressable style={styles.dangerButton} onPress={() => { setRunning(false); setPaused(false); }}><Text style={styles.dangerButtonText}>Finalizar</Text></Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function More() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {['Lojas', 'Relatórios', 'Sincronização', 'Configurações', 'Notificações', 'Sobre'].map(item => (
        <View key={item} style={styles.moreRow}><Text style={styles.moreTitle}>{item}</Text><Text style={styles.moreArrow}>›</Text></View>
      ))}
    </ScrollView>
  );
}

function Drawer({ visible, close, setTab }: { visible: boolean; close: () => void; setTab: (tab: Tab) => void }) {
  if (!visible) return null;
  const go = (tab: Tab) => { setTab(tab); close(); };
  return (
    <View style={styles.drawerOverlay}>
      <Pressable style={styles.drawerScrim} onPress={close} />
      <View style={styles.drawer}>
        <Text style={styles.drawerBrand}>Movvant</Text>
        <Text style={styles.drawerEnterprise}>ENTERPRISE</Text>
        <View style={styles.drawerProfile}><View style={styles.avatar}><Text style={styles.avatarText}>CS</Text></View><View><Text style={styles.drawerName}>Carlos Silva</Text><Text style={styles.drawerRole}>Supervisor</Text></View></View>
        {[
          ['home','Home'],['agenda','Agenda'],['mais','Lojas'],['km','KM'],['mapa','Deslocamento'],['mapa','Mapa'],['mais','Relatórios'],['mais','Sincronização'],['mais','Configurações']
        ].map(([key, label]) => (
          <Pressable key={`${key}-${label}`} style={styles.drawerItem} onPress={() => go(key as Tab)}><Text style={styles.drawerItemText}>{label}</Text></Pressable>
        ))}
        <View style={styles.flex1} />
        <Pressable style={styles.drawerExit}><Text style={styles.drawerItemText}>Sair</Text></Pressable>
      </View>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [drawer, setDrawer] = useState(false);
  const title = tab === 'home' ? 'Movvant' : tab === 'agenda' ? 'Agenda' : tab === 'km' ? 'KM' : tab === 'mapa' ? 'Deslocamento' : 'Mais';
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#07365b" />
      <Header title={title} onMenu={() => setDrawer(true)} />
      <View style={styles.body}>
        {tab === 'home' && <Home goAgenda={() => setTab('agenda')} goMap={() => setTab('mapa')} />}
        {tab === 'agenda' && <Agenda />}
        {tab === 'km' && <Km />}
        {tab === 'mapa' && <MapScreen />}
        {tab === 'mais' && <More />}
      </View>
      <BottomNav tab={tab} setTab={setTab} />
      <Drawer visible={drawer} close={() => setDrawer(false)} setTab={setTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f7fb' },
  body: { flex: 1 },
  flex1: { flex: 1 },
  header: { height: 58, backgroundColor: '#07365b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  headerIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerIconText: { color: '#fff', fontSize: 22 },
  content: { padding: 16, paddingBottom: 28 },
  profileRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#0b78e3', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800' },
  hello: { fontSize: 20, fontWeight: '800', color: '#172438' },
  muted: { color: '#7e8b9a', fontSize: 12 },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  kpiCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e6ebf2' },
  kpiValue: { fontSize: 20, fontWeight: '800', color: '#0c7a42' },
  kpiLabel: { marginTop: 4, fontSize: 11, color: '#596779', textAlign: 'center' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1c2b40' },
  link: { color: '#0877e8', fontSize: 13, fontWeight: '700' },
  agendaRow: { minHeight: 62, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#edf0f4', paddingHorizontal: 12 },
  agendaTime: { width: 48, color: '#27405e', fontSize: 12, fontWeight: '700' },
  timeline: { width: 3, alignSelf: 'stretch', backgroundColor: '#19b96b', marginRight: 12, marginVertical: 8, borderRadius: 2 },
  agendaStore: { color: '#1d2d42', fontSize: 13, fontWeight: '800' },
  agendaTitle: { color: '#7a8796', fontSize: 11, marginTop: 2 },
  primaryButton: { backgroundColor: '#0877e8', minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  bottomNav: { height: 62, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#dfe5ec', flexDirection: 'row' },
  bottomItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomIcon: { fontSize: 19, color: '#68788a' },
  bottomLabel: { fontSize: 10, color: '#68788a', marginTop: 2 },
  activeBlue: { color: '#0877e8', fontWeight: '800' },
  calendarCard: { backgroundColor: '#fff', borderRadius: 15, padding: 12, borderWidth: 1, borderColor: '#e5eaf1' },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthTitle: { fontSize: 16, fontWeight: '800', color: '#1d2b3f' },
  monthArrow: { fontSize: 28, color: '#234f7d' },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  weekText: { width: '14.28%', textAlign: 'center', color: '#738092', fontSize: 10, fontWeight: '700' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', height: 43, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: '#0877e8' },
  dayText: { color: '#3e4e62', fontSize: 12 },
  daySelectedText: { color: '#fff', fontWeight: '800' },
  dayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#14a95f', marginTop: 1 },
  empty: { padding: 18, color: '#8894a2', textAlign: 'center' },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#42536a', marginBottom: 6 },
  input: { minHeight: 48, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dfe5ed', paddingHorizontal: 12, color: '#1e2c3f' },
  segment: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#e4e9ef' },
  segmentActive: { flex: 1, textAlign: 'center', padding: 13, color: '#0877e8', fontWeight: '800', borderBottomWidth: 2, borderBottomColor: '#0877e8' },
  segmentItem: { flex: 1, textAlign: 'center', padding: 13, color: '#647386' },
  totalCard: { backgroundColor: '#edf5ff', padding: 14, borderRadius: 12, marginBottom: 14 },
  totalValue: { fontSize: 22, color: '#0877e8', fontWeight: '800', marginTop: 3 },
  mapScreen: { flex: 1, backgroundColor: '#eef3f7' },
  fakeMap: { flex: 1, minHeight: 360, backgroundColor: '#dfeadf', position: 'relative', overflow: 'hidden' },
  routeSegment: { position: 'absolute', height: 5, backgroundColor: '#1479ee', borderRadius: 4 },
  routeSegmentOrange: { position: 'absolute', height: 5, backgroundColor: '#ff8b24', borderRadius: 4 },
  pin: { position: 'absolute', width: 32, height: 32, borderRadius: 16, backgroundColor: '#18a95f', alignItems: 'center', justifyContent: 'center' },
  pinRed: { position: 'absolute', width: 32, height: 32, borderRadius: 16, backgroundColor: '#e44848', alignItems: 'center', justifyContent: 'center' },
  pinText: { color: '#fff', fontWeight: '900' },
  mapBadge: { position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(255,255,255,.95)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  mapBadgeText: { color: '#24405d', fontSize: 11, fontWeight: '800' },
  tripPanel: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18, marginTop: -16 },
  tripTitle: { fontSize: 17, fontWeight: '800', color: '#1d2b3f' },
  tripMetrics: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  metricValue: { fontSize: 18, fontWeight: '800', color: '#24374e' },
  actionRow: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: 10, backgroundColor: '#dce2e8', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: '#27384c', fontWeight: '800' },
  dangerButton: { flex: 1, minHeight: 48, borderRadius: 10, backgroundColor: '#ef4343', alignItems: 'center', justifyContent: 'center' },
  dangerButtonText: { color: '#fff', fontWeight: '800' },
  moreRow: { minHeight: 58, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e7ebf0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 },
  moreTitle: { color: '#22334a', fontSize: 14, fontWeight: '700' },
  moreArrow: { color: '#7f8b99', fontSize: 22 },
  drawerOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 20, flexDirection: 'row' },
  drawerScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.45)' },
  drawer: { width: '82%', maxWidth: 340, backgroundColor: '#07365b', paddingTop: 54, paddingHorizontal: 18, paddingBottom: 22 },
  drawerBrand: { fontSize: 28, color: '#fff', fontWeight: '900' },
  drawerEnterprise: { color: '#bcd7ef', letterSpacing: 4, fontSize: 10, marginTop: 2 },
  drawerProfile: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 22, marginBottom: 4 },
  drawerName: { color: '#fff', fontSize: 14, fontWeight: '800' },
  drawerRole: { color: '#a8c3dc', fontSize: 11, marginTop: 2 },
  drawerItem: { minHeight: 44, justifyContent: 'center', borderRadius: 8, paddingHorizontal: 10 },
  drawerItemText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  drawerExit: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.15)', paddingTop: 16, marginTop: 14 },
});
