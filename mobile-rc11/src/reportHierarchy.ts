import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from './api';

const SESSION_KEY='movvant.rc11.session';

type DirectoryUser={user_id:string;full_name?:string|null;email?:string|null;job_title?:string|null;role_slug?:string|null;role_name?:string|null;scope_level?:string|null;branch_id?:string|null;branch_name?:string|null;company_id?:string|null;assignment_active?:boolean|null};
export type ReportPerson={id:string;name:string;email?:string;role?:string;branch?:string;kind:'seller'|'driver'|'other'};
export type ReportPersonMetrics={userId:string;visits30d:number;validatedVisits30d:number;actualKm30d:number;routes30d:number;completedRoutes30d:number;adherencePct:number;orders30d:number;revenue30d:number};
export type ReportHierarchyData={canSelectPeople:boolean;people:ReportPerson[];metrics:ReportPersonMetrics[];currentUserId:string;scopeLabel:string};

const env=()=>{const url=process.env.EXPO_PUBLIC_SUPABASE_URL,key=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)throw new Error('Supabase não configurado.');return{url:url.replace(/\/$/,''),key}};
const authHeaders=(s:Session)=>{const {key}=env();return{apikey:key,Authorization:`Bearer ${s.access_token}`,'Content-Type':'application/json'}};
const enc=(v:string)=>encodeURIComponent(v);
const norm=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const num=(v:any)=>Number(v||0)||0;
const classify=(u:DirectoryUser):ReportPerson['kind']=>{const x=norm(`${u.role_slug||''} ${u.role_name||''} ${u.job_title||''}`);if(/motor|driver|entrega|logist/.test(x))return'driver';if(/vend|seller|comercial|represent/.test(x))return'seller';return'other'};
const canLead=(u?:DirectoryUser|null)=>{const x=norm(`${u?.role_slug||''} ${u?.role_name||''} ${u?.job_title||''} ${u?.scope_level||''}`);return /owner|propriet|master|admin|gerente|manager|supervisor|company|regional/.test(x)};

async function session():Promise<Session>{const raw=await AsyncStorage.getItem(SESSION_KEY);if(!raw)throw new Error('Sessão não encontrada.');return JSON.parse(raw) as Session}
async function get<T>(s:Session,path:string):Promise<T>{const {url}=env();const r=await fetch(`${url}/rest/v1/${path}`,{headers:authHeaders(s)});const text=await r.text();if(!r.ok)throw new Error(text||`HTTP ${r.status}`);return text?JSON.parse(text) as T:[] as T}

export async function loadReportHierarchy(companyId:string|null|undefined):Promise<ReportHierarchyData>{
  const s=await session();
  if(!companyId)return{canSelectPeople:false,people:[],metrics:[],currentUserId:s.user.id,scopeLabel:'Meu relatório'};
  const mine=await get<DirectoryUser[]>(s,`v_user_directory?select=*&user_id=eq.${enc(s.user.id)}&assignment_active=eq.true&limit=1`).catch(()=>[]);
  const me=mine[0]||null;
  const elevated=canLead(me);
  if(!elevated){return{canSelectPeople:false,people:[{id:s.user.id,name:me?.full_name||s.user.email||'Usuário',email:me?.email||s.user.email,role:me?.role_name||me?.job_title||undefined,branch:me?.branch_name||undefined,kind:classify(me||{user_id:s.user.id})}],metrics:[],currentUserId:s.user.id,scopeLabel:'Meu relatório'}}
  const scope=me?.scope_level||'';
  let filter=`company_id=eq.${enc(companyId)}&assignment_active=eq.true`;
  if(norm(scope).includes('branch')&&me?.branch_id)filter+=`&branch_id=eq.${enc(me.branch_id)}`;
  const rows=await get<DirectoryUser[]>(s,`v_user_directory?select=user_id,full_name,email,job_title,role_slug,role_name,scope_level,branch_id,branch_name,company_id,assignment_active&${filter}&order=full_name.asc&limit=500`).catch(()=>[]);
  const dedup=new Map<string,DirectoryUser>();rows.forEach(x=>{if(!dedup.has(x.user_id))dedup.set(x.user_id,x)});
  const people=[...dedup.values()].map(x=>({id:x.user_id,name:x.full_name||x.email||'Usuário',email:x.email||undefined,role:x.role_name||x.job_title||undefined,branch:x.branch_name||undefined,kind:classify(x)}));
  const perf=await get<any[]>(s,`v_field_commercial_performance_30d?select=*&company_id=eq.${enc(companyId)}&limit=1000`).catch(()=>[]);
  const metrics:ReportPersonMetrics[]=perf.map(x=>({userId:String(x.user_id||''),visits30d:num(x.visits_30d),validatedVisits30d:num(x.validated_visits_30d),actualKm30d:num(x.actual_km_30d),routes30d:num(x.routes_30d),completedRoutes30d:num(x.completed_routes_30d),adherencePct:num(x.avg_adherence_pct),orders30d:num(x.orders_30d),revenue30d:num(x.revenue_30d)})).filter(x=>x.userId);
  return{canSelectPeople:true,people,metrics,currentUserId:s.user.id,scopeLabel:norm(scope).includes('branch')?'Minha filial':'Equipe / empresa'};
}
