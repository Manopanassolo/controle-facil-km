import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppRC11Final from '../AppRC11Final';
import { BootstrapData, CustomerRow, Session, VisitRow, checkInVisit, checkOutVisit, loadBootstrap } from './api';
import { distanceMeters, getCurrentPoint, Point } from './location';
import { readLocalState } from './offline';
import { mergeTimeline, summarizeTimeline, TimelineEvent } from './timeline';

const SESSION_KEY = 'movvant.rc11.session';
const BLUE = '#1769E0';
const NAVY = '#0B3558';
const GREEN = '#22B77A';
const ORANGE = '#F59E0B';
const RED = '#E5484D';
const BG = '#F3F6FA';
const TEXT = '#17324D';
const MUTED = '#78889A';
const BORDER = '#DFE6EE';
const DEFAULT_GEOFENCE_METERS = 200;
const PROXIMITY_CHECK_MS = 60000;
const DATA_REFRESH_MS = 45000;

type NearbyVisit = { visit: VisitRow; customer: CustomerRow; distance: number };

function customerName(customer?: CustomerRow | null) {
  return customer?.trade_name || customer?.legal_name || 'Loja';
}

function formatClock(value: number) {
  const d = new Date(value);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDuration(ms: number) {
  const minutes = Math.max(0, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function formatDistance(meters: number) {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}

function eventIcon(type: TimelineEvent['type']) {
  if (type === 'trip') return '⌖';
  if (type === 'checkin') return '✓';
  if (type === 'checkout') return '↗';
  if (type === 'km') return '◎';
  return '▦';
}

function eventTone(type: TimelineEvent['type']) {
  if (type === 'checkin') return GREEN;
  if (type === 'checkout') return ORANGE;
  if (type === 'trip') return BLUE;
  if (type === 'km') return NAVY;
  return '#7A899A';
}

export default function OperationalLayer() {
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<BootstrapData | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [nearby, setNearby] = useState<NearbyVisit | null>(null);
  const [activeVisit, setActiveVisit] = useState<VisitRow | null>(null);
  const [busy, setBusy] = useState(false);
  const lastSuggestedVisit = useRef<string | null>(null);

  const reload = useCallback(async () => {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) {
      setSession(null);
      setData(null);
      setTimeline([]);
      setNearby(null);
      setActiveVisit(null);
      return;
    }
    try {
      const ss = JSON.parse(raw) as Session;
      setSession(ss);
      const [remote, local] = await Promise.all([loadBootstrap(ss), readLocalState()]);
      setData(remote);
      const customers = new Map(remote.customers.map(c => [c.id, c]));
      setTimeline(mergeTimeline(local, remote.visits, id => customerName(customers.get(id))));
      setActiveVisit(remote.visits.find(v => Boolean(v.checkin_at) && !v.checkout_at) || null);
    } catch {
      // O app principal continua funcionando mesmo se a camada operacional não puder atualizar.
    }
  }, []);

  useEffect(() => {
    reload();
    const timer = setInterval(reload, DATA_REFRESH_MS);
    return () => clearInterval(timer);
  }, [reload]);

  const scheduledCandidates = useMemo(() => {
    if (!data) return [];
    const now = Date.now();
    const lower = now - 2 * 60 * 60 * 1000;
    const upper = now + 2 * 60 * 60 * 1000;
    return data.visits.filter(v => {
      if (v.checkin_at || v.checkout_at || !v.scheduled_start) return false;
      const when = new Date(v.scheduled_start).getTime();
      return when >= lower && when <= upper;
    });
  }, [data]);

  const checkProximity = useCallback(async () => {
    if (!data || !scheduledCandidates.length || activeVisit) {
      setNearby(null);
      return;
    }
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      if (!permission.granted) return;
      const result = await getCurrentPoint();
      if (!result.ok) return;
      const here: Point = result.point;
      let best: NearbyVisit | null = null;
      for (const visit of scheduledCandidates) {
        const customer = data.customers.find(c => c.id === visit.customer_id);
        const lat = Number(customer?.latitude);
        const lng = Number(customer?.longitude);
        if (!customer || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
        const distance = distanceMeters(here, { latitude: lat, longitude: lng, timestamp: Date.now() });
        if (distance <= DEFAULT_GEOFENCE_METERS && (!best || distance < best.distance)) best = { visit, customer, distance };
      }
      setNearby(best);
      if (best && lastSuggestedVisit.current !== best.visit.id) lastSuggestedVisit.current = best.visit.id;
    } catch {}
  }, [activeVisit, data, scheduledCandidates]);

  useEffect(() => {
    checkProximity();
    const timer = setInterval(checkProximity, PROXIMITY_CHECK_MS);
    return () => clearInterval(timer);
  }, [checkProximity]);

  const doCheckIn = async () => {
    if (!session || !nearby || busy) return;
    setBusy(true);
    try {
      const updated = await checkInVisit(session, nearby.visit.id, nearby.distance <= DEFAULT_GEOFENCE_METERS);
      setActiveVisit(updated);
      setNearby(null);
      await reload();
      Alert.alert('Check-in realizado', `${customerName(nearby.customer)} · localização validada a ${Math.round(nearby.distance)} m.`);
    } catch (e) {
      Alert.alert('Check-in', e instanceof Error ? e.message : 'Não foi possível concluir o check-in.');
    } finally { setBusy(false); }
  };

  const doCheckOut = async () => {
    if (!session || !activeVisit || busy) return;
    setBusy(true);
    try {
      const updated = await checkOutVisit(session, activeVisit.id);
      const customer = data?.customers.find(c => c.id === updated.customer_id);
      const started = updated.checkin_at ? new Date(updated.checkin_at).getTime() : Date.now();
      const ended = updated.checkout_at ? new Date(updated.checkout_at).getTime() : Date.now();
      setActiveVisit(null);
      await reload();
      Alert.alert('Check-out realizado', `${customerName(customer)} · permanência ${formatDuration(Math.max(0, ended - started))}.`);
    } catch (e) {
      Alert.alert('Check-out', e instanceof Error ? e.message : 'Não foi possível concluir o check-out.');
    } finally { setBusy(false); }
  };

  const summary = useMemo(() => summarizeTimeline(timeline), [timeline]);
  const activeCustomer = activeVisit && data ? data.customers.find(c => c.id === activeVisit.customer_id) : null;

  return <View style={styles.root}>
    <AppRC11Final/>

    {nearby && !activeVisit && <View style={styles.arrivalCard}>
      <View style={styles.arrivalDot}/>
      <View style={{ flex: 1 }}>
        <Text style={styles.arrivalTitle}>Você chegou a {customerName(nearby.customer)}</Text>
        <Text style={styles.arrivalText}>{Math.round(nearby.distance)} m do ponto cadastrado · confirmar check-in?</Text>
      </View>
      <Pressable style={[styles.checkinButton, busy && styles.disabled]} onPress={doCheckIn} disabled={busy}><Text style={styles.checkinText}>{busy ? '...' : 'Check-in'}</Text></Pressable>
      <Pressable style={styles.dismiss} onPress={() => setNearby(null)}><Text style={styles.dismissText}>×</Text></Pressable>
    </View>}

    {activeVisit && <View style={styles.activeCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.activeTop}>VISITA EM ANDAMENTO</Text>
        <Text style={styles.activeTitle}>{customerName(activeCustomer)}</Text>
        <Text style={styles.activeText}>Check-in {activeVisit.checkin_at ? formatClock(new Date(activeVisit.checkin_at).getTime()) : ''}{activeVisit.geofence_valid ? ' · GPS validado' : ''}</Text>
      </View>
      <Pressable style={[styles.checkoutButton, busy && styles.disabled]} onPress={doCheckOut} disabled={busy}><Text style={styles.checkoutText}>{busy ? '...' : 'Check-out'}</Text></Pressable>
    </View>}

    <Pressable style={styles.timelineFab} onPress={() => setTimelineOpen(true)}><Text style={styles.timelineFabIcon}>≡</Text><Text style={styles.timelineFabText}>Linha do Tempo</Text></Pressable>

    <Modal visible={timelineOpen} animationType="slide" onRequestClose={() => setTimelineOpen(false)}>
      <SafeAreaView style={styles.modalRoot}>
        <View style={styles.modalHeader}>
          <Pressable style={styles.closeButton} onPress={() => setTimelineOpen(false)}><Text style={styles.closeText}>‹</Text></Pressable>
          <View><Text style={styles.modalTitle}>Linha do Tempo</Text><Text style={styles.modalSub}>Deslocamentos, visitas e KM</Text></View>
          <Pressable style={styles.refreshButton} onPress={reload}><Text style={styles.refreshText}>↻</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}><Text style={styles.summaryValue}>{formatDistance(summary.distanceMeters)}</Text><Text style={styles.summaryLabel}>Deslocamento</Text></View>
            <View style={styles.summaryCard}><Text style={styles.summaryValue}>{formatDuration(summary.tripDurationMs)}</Text><Text style={styles.summaryLabel}>Tempo em rota</Text></View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}><Text style={styles.summaryValue}>{summary.visits}</Text><Text style={styles.summaryLabel}>Check-ins</Text></View>
            <View style={styles.summaryCard}><Text style={styles.summaryValue}>{formatDuration(summary.visitDurationMs)}</Text><Text style={styles.summaryLabel}>Tempo em clientes</Text></View>
          </View>

          <Text style={styles.sectionTitle}>Histórico operacional</Text>
          {!timeline.length && <View style={styles.empty}><Text style={styles.emptyTitle}>Sem eventos ainda</Text><Text style={styles.emptyText}>Deslocamentos, registros de KM e visitas aparecerão aqui automaticamente.</Text></View>}
          {timeline.slice(0, 120).map(event => <View style={styles.timelineRow} key={event.id}>
            <View style={[styles.timelineIcon, { borderColor: eventTone(event.type) }]}><Text style={[styles.timelineIconText, { color: eventTone(event.type) }]}>{eventIcon(event.type)}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={styles.timelineHead}><Text style={styles.timelineTitle}>{event.title}</Text><Text style={styles.timelineTime}>{formatClock(event.startedAt)}</Text></View>
              {!!event.subtitle && <Text style={styles.timelineSub}>{event.subtitle}</Text>}
              {event.synced === false && <Text style={styles.pending}>Aguardando sincronização</Text>}
            </View>
          </View>)}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:BG},
  arrivalCard:{position:'absolute',left:12,right:12,bottom:88,minHeight:84,backgroundColor:'#fff',borderRadius:18,borderWidth:1,borderColor:'#CFE7DB',padding:12,flexDirection:'row',alignItems:'center',gap:10,elevation:16,shadowColor:'#17324D',shadowOpacity:.18,shadowRadius:12},arrivalDot:{width:10,height:10,borderRadius:5,backgroundColor:GREEN},arrivalTitle:{fontSize:13,fontWeight:'900',color:TEXT},arrivalText:{fontSize:10,color:MUTED,marginTop:3,lineHeight:14},checkinButton:{minHeight:42,paddingHorizontal:13,borderRadius:12,backgroundColor:GREEN,alignItems:'center',justifyContent:'center'},checkinText:{color:'#fff',fontSize:11,fontWeight:'900'},dismiss:{position:'absolute',top:-8,right:-6,width:25,height:25,borderRadius:13,backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,alignItems:'center',justifyContent:'center'},dismissText:{fontSize:17,color:MUTED},
  activeCard:{position:'absolute',left:12,right:12,bottom:88,minHeight:82,backgroundColor:NAVY,borderRadius:18,padding:13,flexDirection:'row',alignItems:'center',gap:10,elevation:16,shadowColor:'#17324D',shadowOpacity:.18,shadowRadius:12},activeTop:{fontSize:8,letterSpacing:1.3,fontWeight:'900',color:'#9CC6E7'},activeTitle:{fontSize:14,fontWeight:'900',color:'#fff',marginTop:3},activeText:{fontSize:10,color:'#D5E3EE',marginTop:3},checkoutButton:{minHeight:44,paddingHorizontal:14,borderRadius:12,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},checkoutText:{color:NAVY,fontSize:11,fontWeight:'900'},
  timelineFab:{position:'absolute',right:14,bottom:178,minHeight:42,borderRadius:21,backgroundColor:'#FFFFFFF2',borderWidth:1,borderColor:'#D6E0E9',paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:7,elevation:10,shadowColor:'#17324D',shadowOpacity:.14,shadowRadius:9},timelineFabIcon:{fontSize:17,fontWeight:'900',color:BLUE},timelineFabText:{fontSize:10,fontWeight:'900',color:NAVY},disabled:{opacity:.55},
  modalRoot:{flex:1,backgroundColor:BG},modalHeader:{height:70,backgroundColor:NAVY,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12},closeButton:{width:40,height:40,alignItems:'center',justifyContent:'center'},closeText:{color:'#fff',fontSize:28,fontWeight:'700'},modalTitle:{color:'#fff',fontSize:18,fontWeight:'900'},modalSub:{color:'#B9CDDD',fontSize:10,marginTop:2},refreshButton:{marginLeft:'auto',width:40,height:40,alignItems:'center',justifyContent:'center'},refreshText:{color:'#fff',fontSize:22,fontWeight:'900'},modalContent:{padding:16,paddingBottom:34,gap:10},summaryRow:{flexDirection:'row',gap:10},summaryCard:{flex:1,minHeight:96,backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:18,padding:14,justifyContent:'center'},summaryValue:{fontSize:20,fontWeight:'900',color:NAVY},summaryLabel:{fontSize:10,color:MUTED,marginTop:3},sectionTitle:{fontSize:16,fontWeight:'900',color:TEXT,marginTop:6,marginBottom:2},timelineRow:{minHeight:74,backgroundColor:'#fff',borderRadius:17,borderWidth:1,borderColor:BORDER,padding:12,flexDirection:'row',alignItems:'center',gap:11},timelineIcon:{width:38,height:38,borderRadius:19,borderWidth:2,alignItems:'center',justifyContent:'center'},timelineIconText:{fontWeight:'900',fontSize:15},timelineHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},timelineTitle:{flex:1,fontSize:12,fontWeight:'900',color:TEXT},timelineTime:{fontSize:11,fontWeight:'800',color:MUTED},timelineSub:{fontSize:10,color:MUTED,marginTop:3,lineHeight:14},pending:{fontSize:9,color:ORANGE,fontWeight:'900',marginTop:3},empty:{backgroundColor:'#fff',borderWidth:1,borderColor:BORDER,borderRadius:18,padding:18},emptyTitle:{fontSize:13,fontWeight:'900',color:TEXT},emptyText:{fontSize:10,color:MUTED,marginTop:5,lineHeight:15}
});
