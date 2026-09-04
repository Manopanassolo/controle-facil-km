import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import type { LocationSubscription } from 'expo-location';
import { distanceMeters, getCurrentPoint, Point, watchRoute } from './location';
import { enqueue } from './offline';

type RouteStatus = 'idle' | 'running' | 'paused' | 'finished';

const BLUE = '#0B63E5';
const ORANGE = '#F39A2B';
const NAVY = '#07365B';
const MUTED = '#75859A';

export default function RouteScreen() {
  const [status, setStatus] = useState<RouteStatus>('idle');
  const [points, setPoints] = useState<Point[]>([]);
  const [returnStart, setReturnStart] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [region, setRegion] = useState<Region | null>(null);
  const subscription = useRef<LocationSubscription | null>(null);

  useEffect(() => {
    if (status !== 'running' || !startedAt) return;
    const timer = setInterval(() => setElapsed(Date.now() - startedAt), 1000);
    return () => clearInterval(timer);
  }, [status, startedAt]);

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
    subscription.current?.remove();
    subscription.current = await watchRoute(point => {
      setPoints(previous => [...previous, point]);
    });
  };

  const start = async () => {
    const first = await getCurrentPoint();
    if (!first) {
      Alert.alert('Localização necessária', 'Ative a permissão de localização para iniciar o deslocamento.');
      return;
    }
    setPoints([first]);
    setReturnStart(null);
    setStartedAt(Date.now());
    setElapsed(0);
    setRegion({ latitude: first.latitude, longitude: first.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 });
    setStatus('running');
    await beginWatcher();
  };

  const pause = () => {
    subscription.current?.remove();
    subscription.current = null;
    setStatus('paused');
  };

  const resume = async () => {
    setStatus('running');
    await beginWatcher();
  };

  const markReturn = () => {
    if (points.length > 1 && returnStart == null) setReturnStart(points.length - 1);
  };

  const finish = async () => {
    subscription.current?.remove();
    subscription.current = null;
    setStatus('finished');
    await enqueue({
      entity: 'trip',
      action: 'finish',
      payload: {
        startedAt,
        finishedAt: Date.now(),
        elapsedMs: elapsed,
        distanceMeters: Math.round(distance),
        returnStart,
        points,
      },
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <View style={styles.screen}>
      {region ? (
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
          onRegionChangeComplete={setRegion}
        >
          {points[0] && <Marker coordinate={points[0]} title="Início" pinColor="green" />}
          {points.length > 1 && <Marker coordinate={points[points.length - 1]} title="Posição atual" />}
          {outbound.length > 1 && <Polyline coordinates={outbound} strokeWidth={5} strokeColor={BLUE} />}
          {returning.length > 1 && <Polyline coordinates={returning} strokeWidth={5} strokeColor={ORANGE} />}
        </MapView>
      ) : (
        <View style={styles.emptyMap}><Text style={styles.emptyTitle}>Mapa pronto para iniciar</Text><Text style={styles.emptyText}>O GPS será solicitado somente ao iniciar o deslocamento.</Text></View>
      )}

      <View style={styles.panel}>
        <Text style={styles.title}>{status === 'running' ? 'Em deslocamento' : status === 'paused' ? 'Deslocamento pausado' : status === 'finished' ? 'Deslocamento finalizado' : 'Pronto para iniciar'}</Text>
        <View style={styles.metrics}>
          <View><Text style={styles.value}>{formatTime(elapsed)}</Text><Text style={styles.label}>Tempo</Text></View>
          <View><Text style={styles.value}>{(distance / 1000).toFixed(1)} km</Text><Text style={styles.label}>Distância GPS</Text></View>
        </View>
        {status === 'idle' || status === 'finished' ? (
          <Pressable style={styles.primary} onPress={start}><Text style={styles.primaryText}>Iniciar deslocamento</Text></Pressable>
        ) : (
          <View style={styles.actions}>
            <Pressable style={styles.secondary} onPress={status === 'paused' ? resume : pause}><Text style={styles.secondaryText}>{status === 'paused' ? 'Continuar' : 'Pausar'}</Text></Pressable>
            <Pressable style={styles.returnButton} onPress={markReturn}><Text style={styles.returnText}>{returnStart == null ? 'Iniciar retorno' : 'Retorno marcado'}</Text></Pressable>
            <Pressable style={styles.finish} onPress={finish}><Text style={styles.finishText}>Finalizar</Text></Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8EEF5' },
  emptyMap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  emptyText: { fontSize: 12, color: MUTED, textAlign: 'center', marginTop: 8 },
  panel: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  title: { fontSize: 16, fontWeight: '900', color: NAVY },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  value: { fontSize: 18, fontWeight: '900', color: NAVY },
  label: { fontSize: 11, color: MUTED },
  actions: { gap: 8 },
  primary: { minHeight: 48, backgroundColor: BLUE, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontWeight: '900' },
  secondary: { minHeight: 44, backgroundColor: '#E9EEF5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: NAVY, fontWeight: '800' },
  returnButton: { minHeight: 44, backgroundColor: '#FFF0DD', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  returnText: { color: ORANGE, fontWeight: '900' },
  finish: { minHeight: 44, backgroundColor: '#FF4A4A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  finishText: { color: '#fff', fontWeight: '900' },
});
