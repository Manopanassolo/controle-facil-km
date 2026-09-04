import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
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
  const subscription = useRef<LocationSubscription | null>(null);
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

  const beginWatcher = async () => {
    try {
      subscription.current?.remove();
      subscription.current = await watchRoute(point => {
        setPoints(previous => {
          const last = previous[previous.length - 1];
          if (last && distanceMeters(last, point) < 3) return previous;
          return [...previous, point];
        });
      });
      if (!subscription.current) {
        Alert.alert('GPS', 'A rota foi iniciada, mas o acompanhamento contínuo do GPS não pôde ser ativado.');
      }
    } catch {
      subscription.current = null;
      Alert.alert('GPS', 'Não foi possível iniciar o acompanhamento contínuo da localização.');
    }
  };

  const start = async () => {
    if (status === 'starting') return;
    setStatus('starting');
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
      setRegion({ latitude: first.latitude, longitude: first.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 });
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
    if (points.length > 1 && returnStart == null) {
      setReturnStart(points.length - 1);
      return;
    }
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

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const title = status === 'running' ? 'Em deslocamento' : status === 'paused' ? 'Deslocamento pausado' : status === 'finished' ? 'Deslocamento finalizado' : status === 'starting' ? 'Localizando veículo...' : 'Pronto para iniciar';

  return (
    <View style={styles.screen}>
      {region ? (
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          toolbarEnabled={false}
          onRegionChangeComplete={setRegion}
        >
          {points[0] && <Marker coordinate={points[0]} title="Início" pinColor="green" />}
          {points.length > 1 && <Marker coordinate={points[points.length - 1]} title="Posição atual" />}
          {outbound.length > 1 && <Polyline coordinates={outbound} strokeWidth={5} strokeColor={BLUE} />}
          {returning.length > 1 && <Polyline coordinates={returning} strokeWidth={5} strokeColor={ORANGE} />}
        </MapView>
      ) : (
        <View style={styles.emptyMap}>
          <View style={styles.pinBadge}><Text style={styles.pinIcon}>⌖</Text></View>
          <Text style={styles.emptyTitle}>Mapa pronto para iniciar</Text>
          <Text style={styles.emptyText}>O GPS será solicitado somente quando você tocar em iniciar deslocamento.</Text>
        </View>
      )}

      <View style={styles.panel}>
        <View style={styles.statusLine}>
          <View style={[styles.statusDot, status === 'running' && styles.statusDotOn]} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.metrics}>
          <View style={styles.metric}><Text style={styles.value}>{formatTime(elapsed)}</Text><Text style={styles.label}>Tempo ativo</Text></View>
          <View style={styles.metricRight}><Text style={styles.value}>{(distance / 1000).toFixed(1)} km</Text><Text style={styles.label}>Distância GPS</Text></View>
        </View>
        {status === 'idle' || status === 'finished' || status === 'starting' ? (
          <Pressable style={[styles.primary, status === 'starting' && styles.disabled]} onPress={start} disabled={status === 'starting'}>
            <Text style={styles.primaryText}>{status === 'starting' ? 'Localizando...' : status === 'finished' ? 'Iniciar novo deslocamento' : 'Iniciar deslocamento'}</Text>
          </Pressable>
        ) : (
          <View style={styles.actions}>
            <View style={styles.actionRow}>
              <Pressable style={styles.secondary} onPress={status === 'paused' ? resume : pause}><Text style={styles.secondaryText}>{status === 'paused' ? 'Continuar' : 'Pausar'}</Text></Pressable>
              <Pressable style={styles.returnButton} onPress={markReturn}><Text style={styles.returnText}>{returnStart == null ? 'Marcar retorno' : 'Retorno marcado'}</Text></Pressable>
            </View>
            <Pressable style={styles.finish} onPress={finish}><Text style={styles.finishText}>Finalizar deslocamento</Text></Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8EEF5' },
  emptyMap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  pinBadge: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#DCEAF8', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  pinIcon: { fontSize: 30, color: NAVY, fontWeight: '800' },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: NAVY },
  emptyText: { fontSize: 13, color: MUTED, textAlign: 'center', marginTop: 8, lineHeight: 19, maxWidth: 320 },
  panel: { backgroundColor: '#fff', paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
  statusLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#B8C4D1' },
  statusDotOn: { backgroundColor: '#25B979' },
  title: { fontSize: 17, fontWeight: '900', color: NAVY },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16 },
  metric: { alignItems: 'flex-start' },
  metricRight: { alignItems: 'flex-end' },
  value: { fontSize: 22, fontWeight: '900', color: NAVY },
  label: { fontSize: 11, color: MUTED, marginTop: 2 },
  actions: { gap: 10 },
  actionRow: { flexDirection: 'row', gap: 10 },
  primary: { minHeight: 54, backgroundColor: BLUE, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.6 },
  primaryText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  secondary: { flex: 1, minHeight: 48, backgroundColor: '#EDF2F7', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: NAVY, fontWeight: '800' },
  returnButton: { flex: 1, minHeight: 48, backgroundColor: '#FFF3E4', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  returnText: { color: ORANGE, fontWeight: '900' },
  finish: { minHeight: 48, backgroundColor: '#FFF0F0', borderRadius: 12, borderWidth: 1, borderColor: '#F7C6C8', alignItems: 'center', justifyContent: 'center' },
  finishText: { color: RED, fontWeight: '900' },
});
