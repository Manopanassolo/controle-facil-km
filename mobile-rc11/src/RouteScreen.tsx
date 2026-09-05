import React, { useEffect, useMemo, useRef, useState } from 'react';
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
const MIN_TRACK_STEP_METERS = 2;
const MAX_TRACK_STEP_METERS = 300;

const LIGHT_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#F2F5F8' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4C5B69' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#C9D2DA' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#F5F7F9' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#E9EEF2' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#E4F0E7' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#D5DDE4' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#F8E7B0' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#E6EBEF' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#CFE6F4' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#607D8B' }] },
];

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
  const mapReadyRef = useRef(false);
  const lastElapsedBase = useRef(0);
  const resumeStartedAt = useRef<number | null>(null);

  useEffect(() => {
    mapReadyRef.current = mapReady;
  }, [mapReady]);

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
    if (!mapReadyRef.current) return;
    mapRef.current?.animateToRegion({ latitude: point.latitude, longitude: point.longitude, latitudeDelta: 0.006, longitudeDelta: 0.006 }, 450);
  };

  const fitCompletedRoute = (routePoints: Point[]) => {
    if (!mapReadyRef.current || routePoints.length < 2) return;
    mapRef.current?.fitToCoordinates(routePoints, {
      edgePadding: { top: 80, right: 48, bottom: 80, left: 48 },
      animated: true,
    });
  };

  const beginWatcher = async () => {
    try {
      subscription.current?.remove();
      subscription.current = await watchRoute(point => {
        setPoints(previous => {
          const last = previous[previous.length - 1];
          if (last) {
            const step = distanceMeters(last, point);
            if (step < MIN_TRACK_STEP_METERS || step > MAX_TRACK_STEP_METERS) return previous;
          }
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
    mapReadyRef.current = false;
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
      setRegion({ latitude: first.latitude, longitude: first.longitude, latitudeDelta: 0.006, longitudeDelta: 0.006 });
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
    if (returnStart != null) return;
    if (points.length > 1) {
      setReturnStart(points.length - 1);
      Alert.alert('Retorno marcado', 'A partir deste ponto, o trajeto será destacado em laranja.');
      return;
    }
    Alert.alert('Retorno', 'Aguarde o GPS registrar mais pontos da rota antes de marcar o retorno.');
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
      fitCompletedRoute(points);
      await saveTripLocal({ id, startedAt, finishedAt, elapsedMs: finalElapsed, distanceMeters: Math.round(distance), returnStart, pointsCount: points.length, points, synced: false });
      await enqueue({ entity: 'trip', action: 'finish', payload: { localId: id, startedAt, finishedAt, elapsedMs: finalElapsed, distanceMeters: Math.round(distance), returnStart, points } });
      onSaved?.();
      Alert.alert('Deslocamento salvo', `Rota salva com ${Math.round(distance)} m registrados e enviada para a fila de sincronização.`);
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

  const formatDistance = (meters: number) => meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(2)} km`;
  const title = status === 'running' ? 'Em deslocamento' : status === 'paused' ? 'Deslocamento pausado' : status === 'finished' ? 'Deslocamento finalizado' : status === 'starting' ? 'Localizando veículo...' : 'Pronto para iniciar';

  return <View style={styles.screen}>
    {region ? <>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={StyleSheet.absoluteFill} initialRegion={region} mapType="standard" customMapStyle={LIGHT_MAP_STYLE} showsUserLocation showsMyLocationButton={false} showsCompass toolbarEnabled={false} moveOnMarkerPress={false} onMapReady={() => { mapReadyRef.current = true; setMapReady(true); }} onMapLoaded={() => { mapReadyRef.current = true; setMapReady(true); }}>
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
      <View style={styles.metrics}><View style={styles.metric}><Text style={styles.value}>{formatTime(elapsed)}</Text><Text style={styles.label}>Tempo ativo</Text></View><View style={styles.metricRight}><Text style={styles.value}>{formatDistance(distance)}</Text><Text style={styles.label}>Distância GPS</Text></View></View>
      {status==='idle'||status==='finished'||status==='starting' ? <Pressable style={[styles.primary,status==='starting'&&styles.disabled]} onPress={start} disabled={status==='starting'}><Text style={styles.primaryText}>{status==='starting'?'Localizando...':status==='finished'?'Iniciar novo deslocamento':'Iniciar deslocamento'}</Text></Pressable> : <View style={styles.actions}>
        <Pressable style={styles.secondary} onPress={status==='paused'?resume:pause}><Text style={styles.secondaryText}>{status==='paused'?'Continuar deslocamento':'Pausar deslocamento'}</Text></Pressable>
        <Pressable style={[styles.returnButton, returnStart!=null && styles.returnButtonDone]} onPress={markReturn} disabled={returnStart!=null}><Text style={styles.returnText}>{returnStart==null?'↩ Marcar retorno':'✓ Retorno marcado'}</Text></Pressable>
        <Text style={styles.returnHelp}>{returnStart==null?'Use quando iniciar o caminho de volta. A volta será mostrada em laranja.':'Trajeto de retorno ativo · linha laranja'}</Text>
        <Pressable style={styles.finish} onPress={finish}><Text style={styles.finishText}>Finalizar deslocamento</Text></Pressable>
      </View>}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#E8EEF5'},emptyMap:{flex:1,alignItems:'center',justifyContent:'center',padding:30,backgroundColor:'#EAF0F6'},pinBadge:{width:72,height:72,borderRadius:36,backgroundColor:'#DCEAF8',alignItems:'center',justifyContent:'center',marginBottom:14},pinIcon:{fontSize:30,color:NAVY,fontWeight:'800'},emptyTitle:{fontSize:20,fontWeight:'900',color:NAVY},emptyText:{fontSize:13,color:MUTED,textAlign:'center',marginTop:8,lineHeight:19,maxWidth:320},centerMap:{position:'absolute',right:18,top:18,width:46,height:46,borderRadius:23,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},centerMapText:{fontSize:22,color:NAVY,fontWeight:'900'},mapLoading:{position:'absolute',top:18,left:18,backgroundColor:'#FFFFFFEE',paddingHorizontal:12,paddingVertical:8,borderRadius:12},mapLoadingText:{fontSize:11,color:MUTED,fontWeight:'800'},panel:{backgroundColor:'#fff',paddingHorizontal:20,paddingTop:18,paddingBottom:16,borderTopLeftRadius:30,borderTopRightRadius:30,elevation:10,shadowColor:'#17324D',shadowOpacity:.10,shadowRadius:14},statusLine:{flexDirection:'row',alignItems:'center',gap:8},statusDot:{width:9,height:9,borderRadius:5,backgroundColor:'#B8C4D1'},statusDotOn:{backgroundColor:'#25B979'},title:{fontSize:17,fontWeight:'900',color:NAVY},metrics:{flexDirection:'row',justifyContent:'space-between',paddingVertical:14},metric:{alignItems:'flex-start'},metricRight:{alignItems:'flex-end'},value:{fontSize:22,fontWeight:'900',color:NAVY},label:{fontSize:11,color:MUTED,marginTop:2},actions:{gap:8},primary:{minHeight:58,backgroundColor:BLUE,borderRadius:17,alignItems:'center',justifyContent:'center'},disabled:{opacity:.6},primaryText:{color:'#fff',fontWeight:'900',fontSize:15},secondary:{minHeight:46,backgroundColor:'#EDF2F7',borderRadius:12,alignItems:'center',justifyContent:'center'},secondaryText:{color:NAVY,fontWeight:'800'},returnButton:{minHeight:52,backgroundColor:'#FFF3E4',borderRadius:14,borderWidth:1,borderColor:'#F7D5A5',alignItems:'center',justifyContent:'center'},returnButtonDone:{backgroundColor:'#FFF7EC'},returnText:{color:ORANGE,fontWeight:'900',fontSize:15},returnHelp:{fontSize:11,color:MUTED,textAlign:'center',lineHeight:15,paddingHorizontal:8},finish:{minHeight:46,backgroundColor:'#FFF0F0',borderRadius:12,borderWidth:1,borderColor:'#F7C6C8',alignItems:'center',justifyContent:'center'},finishText:{color:RED,fontWeight:'900'}
});
