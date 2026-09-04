from pathlib import Path

# 1) Offline queue: replace pending local mutation instead of duplicating edits.
p = Path('mobile-rc11/src/offline.ts')
s = p.read_text()
anchor = "export async function removeQueued(ids: string[]): Promise<SyncItem[]> {"
helper = r'''export async function enqueueReplacingLocal(entity: SyncItem['entity'], localId: string, item: Omit<SyncItem, 'id' | 'createdAt'>): Promise<SyncItem[]> {
  const queue = await readQueue();
  const filtered = queue.filter(existing => !(existing.entity === entity && existing.payload?.localId === localId));
  const next: SyncItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...filtered, next];
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeQueuedForLocal(entity: SyncItem['entity'], localId: string): Promise<SyncItem[]> {
  const queue = await readQueue();
  const updated = queue.filter(existing => !(existing.entity === entity && existing.payload?.localId === localId));
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return updated;
}

'''
if 'enqueueReplacingLocal' not in s:
    if anchor not in s:
        raise SystemExit('offline queue anchor missing')
    s = s.replace(anchor, helper + anchor)
p.write_text(s)

# 2) App: use queue replacement for Agenda/KM, clear queue on local delete, show KM photo preview.
p = Path('mobile-rc11/AppRC11Final.tsx')
s = p.read_text()
s = s.replace(
    "import { Alert, Modal, Pressable, SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Switch, Text, TextInput, View } from 'react-native';",
    "import { Alert, Image, Modal, Pressable, SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Switch, Text, TextInput, View } from 'react-native';"
)
s = s.replace(
    "import { LocalAppointment, LocalKmRecord, LocalState, enqueue, readLocalState, readQueue, removeAppointmentLocal, saveAppointmentLocal, saveKmLocal, syncPending } from './src/offline';",
    "import { LocalAppointment, LocalKmRecord, LocalState, enqueue, enqueueReplacingLocal, readLocalState, readQueue, removeAppointmentLocal, removeQueuedForLocal, saveAppointmentLocal, saveKmLocal, syncPending } from './src/offline';"
)
old = "const saveAppointment = async (item: LocalAppointment) => { await saveAppointmentLocal(item); await enqueue({ entity:'appointment',action:'insert',payload:{ localId:item.id,date:item.date,time:item.time,title:item.title,customerId:item.customerId,store:item.store } }); await reloadLocal(); };\n  const deleteAppointment = async (id: string) => { await removeAppointmentLocal(id); await reloadLocal(); };\n  const saveKm = async (item: LocalKmRecord) => { await saveKmLocal(item); await enqueue({ entity:'km',action:'insert',payload:{ localId:item.id,vehicleId:item.vehicleId,vehicle:item.vehicle,start:item.start,end:item.end,total:item.total,reason:item.reason,photoUri:item.photoUri,createdAt:item.createdAt } }); await reloadLocal(); };"
new = "const saveAppointment = async (item: LocalAppointment) => { await saveAppointmentLocal(item); await enqueueReplacingLocal('appointment',item.id,{ entity:'appointment',action:'insert',payload:{ localId:item.id,date:item.date,time:item.time,title:item.title,customerId:item.customerId,store:item.store } }); await reloadLocal(); };\n  const deleteAppointment = async (id: string) => { await removeAppointmentLocal(id); await removeQueuedForLocal('appointment',id); await reloadLocal(); };\n  const saveKm = async (item: LocalKmRecord) => { await saveKmLocal(item); await enqueueReplacingLocal('km',item.id,{ entity:'km',action:'insert',payload:{ localId:item.id,vehicleId:item.vehicleId,vehicle:item.vehicle,start:item.start,end:item.end,total:item.total,reason:item.reason,photoUri:item.photoUri,createdAt:item.createdAt } }); await reloadLocal(); };"
if old not in s:
    raise SystemExit('save handlers anchor missing')
s = s.replace(old, new)

# Add photo preview directly below capture card.
old_photo = "<Pressable style={[s.attach,photo&&s.attachDone]} onPress={capture}><Text style={s.attachIcon}>{photo ? '✓' : '▧'}</Text><View><Text style={s.rowTitle}>{photo ? 'Foto anexada' : 'Adicionar foto'}</Text><Text style={s.sub}>{photo ? 'Toque para substituir' : 'Opcional · comprovante ou painel'}</Text></View></Pressable><Pressable style={s.primary} onPress={save}><Text style={s.primaryText}>Salvar registro</Text></Pressable>"
new_photo = "<Pressable style={[s.attach,photo&&s.attachDone]} onPress={capture}><Text style={s.attachIcon}>{photo ? '✓' : '▧'}</Text><View><Text style={s.rowTitle}>{photo ? 'Foto anexada' : 'Adicionar foto'}</Text><Text style={s.sub}>{photo ? 'Toque para substituir' : 'Opcional · comprovante ou painel'}</Text></View></Pressable>{photo ? <View style={s.photoPreviewCard}><Image source={{uri:photo}} style={s.photoPreview}/><View style={{flex:1}}><Text style={s.rowTitle}>Comprovante pronto</Text><Text style={s.sub}>A imagem será enviada com o registro quando houver sincronização.</Text></View></View> : null}<Pressable style={s.primary} onPress={save}><Text style={s.primaryText}>Salvar registro</Text></Pressable>"
if old_photo not in s:
    raise SystemExit('KM photo anchor missing')
s = s.replace(old_photo, new_photo)

# Improve history card with photo state and safer total/status wording.
s = s.replace(
    "<Text style={s.historyKm}>{x.total} km</Text><Text style={s.sub}>{new Date(x.createdAt).toLocaleString('pt-BR')} · {x.start} → {x.end}</Text>{x.reason ? <Text style={s.sub}>{x.reason}</Text> : null}</View>)",
    "<Text style={s.historyKm}>{x.total} km</Text><Text style={s.sub}>{new Date(x.createdAt).toLocaleString('pt-BR')} · {x.start} → {x.end}</Text>{x.reason ? <Text style={s.sub}>{x.reason}</Text> : null}{x.photoUri ? <Text style={s.photoState}>✓ Foto anexada</Text> : <Text style={s.photoStateMuted}>Sem foto</Text>}</View>)"
)

style_anchor = "attachIcon:{fontSize:22,color:BLUE},historyCard:"
style_repl = "attachIcon:{fontSize:22,color:BLUE},photoPreviewCard:{backgroundColor:'#fff',borderWidth:1,borderColor:'#D9E2EB',borderRadius:18,padding:10,flexDirection:'row',alignItems:'center',gap:12},photoPreview:{width:72,height:72,borderRadius:14,backgroundColor:'#EAF0F6'},photoState:{fontSize:10,color:GREEN,fontWeight:'900',marginTop:4},photoStateMuted:{fontSize:10,color:MUTED,fontWeight:'700',marginTop:4},historyCard:"
if style_anchor not in s:
    raise SystemExit('style anchor missing')
s = s.replace(style_anchor, style_repl)

# Version label should reflect integrated recovery, not old final version.
s = s.replace('Mobile RC11 Final · versão 1.1.0', 'Mobile RC11 Integrado · versão 1.1.1')
p.write_text(s)

Path('mobile-rc11/INTEGRATED_BLOCK2_STATUS.md').write_text('''# Movvant Mobile — Bloco integrado 2\n\n## Agenda\n- edição local substitui a mutação pendente anterior em vez de duplicar inserts;\n- exclusão local remove também a mutação correspondente da fila;\n- abertura, edição e exclusão continuam no padrão visual final.\n\n## KM\n- registro continua ligado a veículo real atribuído;\n- fila local usa substituição idempotente por registro;\n- foto capturada recebe pré-visualização real antes do salvamento;\n- histórico local indica foto e estado de sincronização;\n- envio da evidência continua ligado ao storage empresarial no fluxo de sincronização.\n\nValidação física do mapa Android permanece bloqueadora antes de homologação final.\n''')
