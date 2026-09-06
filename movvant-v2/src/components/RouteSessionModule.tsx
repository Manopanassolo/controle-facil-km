'use client';

import { useEffect, useState } from 'react';

type Alt='A'|'B'|'C';
type RouteState={alt:Alt;startedAt:number;plannedKm:number};
const KEY='movvant.rc11.route.active';
const alts=[{id:'A' as Alt,label:'Mais rápida',km:18.4,time:'28 min'},{id:'B' as Alt,label:'Equilibrada',km:20.1,time:'31 min'},{id:'C' as Alt,label:'Menos trânsito',km:22.7,time:'34 min'}];

export function RouteSessionModule(){
 const[alt,setAlt]=useState<Alt>('A');const[active,setActive]=useState<RouteState|null>(null);const[zoom,setZoom]=useState(1);const[pan,setPan]=useState({x:0,y:0});
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const r=JSON.parse(raw);setActive(r);setAlt(r.alt)}}catch{}},[]);
 useEffect(()=>{try{active?localStorage.setItem(KEY,JSON.stringify(active)):localStorage.removeItem(KEY)}catch{}},[active]);
 const selected=alts.find(x=>x.id===alt)!;
 const choose=(id:Alt)=>{setAlt(id);setActive(v=>v?{...v,alt:id,plannedKm:alts.find(x=>x.id===id)!.km}:v)};
 const start=()=>setActive({alt,startedAt:Date.now(),plannedKm:selected.km});
 const finish=()=>setActive(null);
 return <div style={{maxWidth:1180,margin:'0 auto',fontFamily:'Arial,Helvetica,sans-serif',color:'#152331'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}><div><div style={{fontSize:11,fontWeight:900,color:'#2f7fb5',letterSpacing:1}}>MOVVANT ENTERPRISE</div><h1 style={{margin:'4px 0 0',fontSize:28,color:'#071b2e'}}>Deslocamento</h1></div><span style={{fontSize:11,fontWeight:800,padding:'7px 10px',borderRadius:20,background:active?'#eaf7d2':'#eef3f6',color:active?'#466600':'#496272'}}>{active?'Em deslocamento':'Pronto para iniciar'}</span></div>
  <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.45fr) minmax(280px,.55fr)',gap:14}}>
   <section style={{background:'#fff',border:'1px solid #dfe7ec',borderRadius:18,overflow:'hidden',boxShadow:'0 12px 35px rgba(7,27,46,.09)'}}>
    <div style={{padding:'14px 16px 8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><strong style={{fontSize:15}}>Mapa da rota</strong><div style={{display:'flex',gap:12,fontSize:11}}><span><b style={{color:'#1677c8'}}>●</b> Ida</span><span><b style={{color:'#f7941d'}}>●</b> Retorno</span></div></div>
    <div style={{padding:'0 12px 10px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7}}>{alts.map(x=><button key={x.id} onClick={()=>choose(x.id)} style={{border:alt===x.id?'2px solid #0a2742':'1px solid #dfe7ec',background:alt===x.id?'#f1f7fb':'#fff',borderRadius:11,padding:'9px 8px',textAlign:'left'}}><b>Rota {x.id}</b><div style={{fontSize:10,color:'#6b7b89',marginTop:3}}>{x.label}</div><div style={{fontSize:10,fontWeight:700,marginTop:3}}>{x.km.toLocaleString('pt-BR')} km · {x.time}</div></button>)}</div>
    <div style={{height:430,position:'relative',overflow:'hidden',background:'linear-gradient(145deg,#e8f1e8,#dce9ef 55%,#d7ebf2)'}}>
     <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(28deg,transparent 47%,rgba(255,255,255,.8) 48%,rgba(255,255,255,.8) 52%,transparent 53%),linear-gradient(-20deg,transparent 45%,rgba(255,255,255,.55) 46%,rgba(255,255,255,.55) 49%,transparent 50%)',backgroundSize:'170px 120px,210px 150px',transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:'center'}}>
      <div onClick={()=>choose('A')} style={{position:'absolute',left:'15%',top:'58%',width:'64%',height:7,background:alt==='A'?'#1677c8':'#75a9ce',borderRadius:8,transform:'rotate(-18deg)',cursor:'pointer',boxShadow:'0 0 0 2px rgba(255,255,255,.8)'}}/>
      <div onClick={()=>choose('B')} style={{position:'absolute',left:'19%',top:'48%',width:'58%',height:6,background:alt==='B'?'#1677c8':'#8db6d3',borderRadius:8,transform:'rotate(-6deg)',cursor:'pointer'}}/>
      <div onClick={()=>choose('C')} style={{position:'absolute',left:'22%',top:'67%',width:'55%',height:6,background:alt==='C'?'#1677c8':'#9bbdd5',borderRadius:8,transform:'rotate(-30deg)',cursor:'pointer'}}/>
      <div style={{position:'absolute',left:'24%',top:'70%',width:'50%',height:7,background:'#f7941d',borderRadius:8,transform:'rotate(-23deg)',boxShadow:'0 0 0 2px rgba(255,255,255,.75)'}}/>
      <div style={{position:'absolute',left:'13%',top:'63%',width:25,height:25,borderRadius:'50% 50% 50% 0',transform:'rotate(-45deg)',background:'#28a56a',border:'3px solid white'}}/><div style={{position:'absolute',right:'18%',top:'35%',width:25,height:25,borderRadius:'50% 50% 50% 0',transform:'rotate(-45deg)',background:'#e24a4a',border:'3px solid white'}}/>
      <span style={{position:'absolute',left:'8%',top:'16%',fontSize:12,fontWeight:800,color:'#60717d'}}>Itajaí</span><span style={{position:'absolute',right:'8%',bottom:'16%',fontSize:12,fontWeight:800,color:'#60717d'}}>Balneário Camboriú</span><span style={{position:'absolute',left:'44%',top:'38%',fontSize:10,color:'#71838e'}}>BR-101</span>
     </div>
     <div style={{position:'absolute',right:12,top:12,display:'grid',gap:6}}><button onClick={()=>setZoom(z=>Math.min(1.8,z+.1))} style={ctl}>＋</button><button onClick={()=>setZoom(z=>Math.max(.7,z-.1))} style={ctl}>−</button><button onClick={()=>{setZoom(1);setPan({x:0,y:0})}} style={{...ctl,fontSize:10,width:70}}>Centralizar</button></div>
     <div style={{position:'absolute',left:12,bottom:12,display:'flex',gap:5}}><button onClick={()=>setPan(p=>({...p,x:p.x-18}))} style={ctl}>←</button><button onClick={()=>setPan(p=>({...p,y:p.y-18}))} style={ctl}>↑</button><button onClick={()=>setPan(p=>({...p,y:p.y+18}))} style={ctl}>↓</button><button onClick={()=>setPan(p=>({...p,x:p.x+18}))} style={ctl}>→</button></div>
    </div>
   </section>
   <aside style={{display:'grid',gap:14,alignContent:'start'}}>
    <section style={card}><div style={{fontSize:11,color:'#6b7b89'}}>STATUS</div><h2 style={{fontSize:22,margin:'7px 0',color:'#071b2e'}}>{active?'Em deslocamento':'Rota preparada'}</h2><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:14}}><Metric label="Planejado" value={`${selected.km.toLocaleString('pt-BR')} km`}/><Metric label="Previsão" value={selected.time}/><Metric label="Alternativa" value={`Rota ${alt}`}/><Metric label="Zoom" value={`${zoom.toFixed(1)}×`}/></div>{!active?<button onClick={start} style={primary}>Iniciar deslocamento</button>:<><div style={{marginTop:14,padding:12,borderRadius:12,background:'#eff8e2',fontSize:12}}><b>Rota ativa preservada</b><div style={{marginTop:4,color:'#60717d'}}>A sessão será recuperada ao reabrir o app.</div></div><button onClick={finish} style={danger}>Finalizar</button></>}</section>
    <section style={card}><strong style={{fontSize:14}}>Planejado × realizado</strong><p style={{fontSize:11,lineHeight:1.5,color:'#6b7b89'}}>O planejado permanece registrado separadamente do percurso realizado para comparação ao encerrar a rota.</p><div style={{display:'flex',justifyContent:'space-between',fontSize:12,paddingTop:10,borderTop:'1px solid #e3e9ed'}}><span>Planejado</span><b>{selected.km.toLocaleString('pt-BR')} km</b></div><div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginTop:8}}><span>Realizado</span><b>{active?'Em coleta':'—'}</b></div></section>
   </aside>
  </div>
  <nav style={{marginTop:14,background:'#fff',border:'1px solid #dfe7ec',borderRadius:16,padding:'10px 14px',display:'flex',justifyContent:'space-around',fontSize:11,fontWeight:800,color:'#657784'}}><span>⌂ Home</span><span>▣ Agenda</span><span>KM</span><span style={{color:'#0a2742'}}>● Mapa</span><span>☰ Mais</span></nav>
 </div>
}
const ctl:React.CSSProperties={border:'1px solid #d5e0e6',background:'rgba(255,255,255,.94)',borderRadius:9,width:38,height:36,fontWeight:900,color:'#0a2742',boxShadow:'0 4px 12px rgba(7,27,46,.12)'};
const card:React.CSSProperties={background:'#fff',border:'1px solid #dfe7ec',borderRadius:18,padding:18,boxShadow:'0 12px 35px rgba(7,27,46,.09)'};
const primary:React.CSSProperties={width:'100%',border:0,borderRadius:12,background:'#0a2742',color:'#fff',fontWeight:900,padding:'12px 14px',marginTop:16};
const danger:React.CSSProperties={...primary,background:'#c83c3c'};
function Metric({label,value}:{label:string,value:string}){return <div style={{padding:10,border:'1px solid #e1e8ec',borderRadius:11,background:'#f8fafb'}}><div style={{fontSize:9,color:'#788995'}}>{label}</div><b style={{display:'block',marginTop:4,fontSize:13}}>{value}</b></div>}
