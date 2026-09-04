import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AppRC11Final from './AppRC11Final';
import { signIn } from './src/api';
import { signInWithGoogle } from './src/googleAuth';

const SESSION_KEY = 'movvant.rc11.session';
const NAVY = '#0B3558';
const BLUE = '#1769E0';
const TEXT = '#17324D';
const MUTED = '#78889A';
const BORDER = '#DFE6EE';

export default function AppRC11GoogleGate() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(SESSION_KEY).then(v => {
      if (!active) return;
      setAuthenticated(Boolean(v));
      setChecking(false);
    });
    const timer = setInterval(async () => {
      const v = await AsyncStorage.getItem(SESSION_KEY);
      if (active) setAuthenticated(Boolean(v));
    }, 1200);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const finish = async (session: unknown) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setAuthenticated(true);
  };

  const loginEmail = async () => {
    if (!email.trim() || !password) return Alert.alert('Acesso', 'Informe e-mail e senha.');
    setLoading(true);
    try { await finish(await signIn(email, password)); }
    catch (e) { Alert.alert('Não foi possível entrar', e instanceof Error ? e.message : 'Verifique os dados e a conexão.'); }
    finally { setLoading(false); }
  };

  const loginGoogle = async () => {
    setGoogleLoading(true);
    try { await finish(await signInWithGoogle()); }
    catch (e) { Alert.alert('Não foi possível entrar com Google', e instanceof Error ? e.message : 'Tente novamente.'); }
    finally { setGoogleLoading(false); }
  };

  if (checking) return <SafeAreaView style={s.loading}><StatusBar barStyle="light-content" backgroundColor={NAVY}/><Text style={s.loadingText}>Movvant</Text></SafeAreaView>;
  if (authenticated) return <AppRC11Final/>;

  return <SafeAreaView style={s.root}>
    <StatusBar barStyle="light-content" backgroundColor={NAVY}/>
    <View style={s.hero}>
      <View style={s.logo}><Text style={s.logoText}>M</Text></View>
      <Text style={s.brand}>Movvant</Text>
      <Text style={s.enterprise}>E N T E R P R I S E</Text>
      <Text style={s.tag}>A gestão em movimento</Text>
    </View>
    <View style={s.card}>
      <Text style={s.title}>Bem-vindo</Text>
      <Text style={s.subtitle}>Entre para acessar sua operação</Text>
      <Text style={s.label}>E-mail</Text>
      <TextInput style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
      <Text style={s.label}>Senha</Text>
      <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry/>
      <Pressable style={[s.primary, (loading || googleLoading) && s.disabled]} onPress={loginEmail} disabled={loading || googleLoading}><Text style={s.primaryText}>{loading ? 'Entrando...' : 'Entrar'}</Text></Pressable>
      <View style={s.divider}><View style={s.line}/><Text style={s.or}>ou</Text><View style={s.line}/></View>
      <Pressable style={[s.google, (loading || googleLoading) && s.disabled]} onPress={loginGoogle} disabled={loading || googleLoading}><Text style={s.googleText}>{googleLoading ? 'Conectando ao Google...' : 'G   Entrar com Google'}</Text></Pressable>
      <Text style={s.foot}>Mobilidade que impulsiona resultados</Text>
      <Text style={s.version}>Movvant Mobile · RC11.2</Text>
    </View>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:'#F3F6FA'},loading:{flex:1,backgroundColor:NAVY,alignItems:'center',justifyContent:'center'},loadingText:{color:'#fff',fontSize:30,fontWeight:'800'},
  hero:{height:250,backgroundColor:NAVY,alignItems:'center',justifyContent:'center'},logo:{width:82,height:82,borderRadius:22,backgroundColor:BLUE,alignItems:'center',justifyContent:'center',transform:[{rotate:'-7deg'}]},logoText:{color:'#fff',fontSize:48,fontWeight:'500',transform:[{rotate:'7deg'}]},brand:{marginTop:14,color:'#fff',fontSize:36,fontWeight:'800'},enterprise:{color:'#D4DBE4',fontSize:12,letterSpacing:5,marginTop:2},tag:{color:'#DDE5EE',fontSize:16,marginTop:22},
  card:{flex:1,marginTop:-18,marginHorizontal:30,borderTopLeftRadius:38,borderTopRightRadius:38,backgroundColor:'#fff',padding:38,shadowColor:'#000',shadowOpacity:.12,shadowRadius:12,elevation:6},title:{fontSize:32,fontWeight:'800',color:TEXT},subtitle:{fontSize:16,color:MUTED,marginTop:18,marginBottom:28},label:{fontSize:15,fontWeight:'700',color:TEXT,marginBottom:10,marginTop:8},input:{height:58,borderWidth:1,borderColor:BORDER,borderRadius:18,paddingHorizontal:16,fontSize:16,color:TEXT},primary:{height:58,borderRadius:18,backgroundColor:BLUE,alignItems:'center',justifyContent:'center',marginTop:18},primaryText:{color:'#fff',fontWeight:'800',fontSize:17},divider:{flexDirection:'row',alignItems:'center',gap:10,marginVertical:14},line:{flex:1,height:1,backgroundColor:BORDER},or:{color:MUTED,fontSize:13},google:{height:58,borderRadius:18,borderWidth:1,borderColor:BORDER,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},googleText:{color:TEXT,fontWeight:'800',fontSize:16},disabled:{opacity:.55},foot:{textAlign:'center',color:MUTED,marginTop:24,fontSize:14},version:{textAlign:'center',color:'#A5AFBB',marginTop:16,fontSize:13}
});
