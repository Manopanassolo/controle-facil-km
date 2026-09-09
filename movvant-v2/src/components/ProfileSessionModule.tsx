'use client';

import { PrototypeFormDialog, PrototypeFormValues } from './PrototypeFormDialog';
import { usePreferencesSession } from './PreferencesSessionProvider';

function text(values:PrototypeFormValues,key:string){const current=values[key];return Array.isArray(current)?current.join(' · '):current||'';}
function initials(name:string){return name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]?.toUpperCase()).join('')||'MV';}

export function ProfileSessionModule(){
 const{profile,updateProfile}=usePreferencesSession();
 function save(values:PrototypeFormValues){updateProfile({name:text(values,'nome'),email:text(values,'email'),phone:text(values,'telefone')});}
 return <section className="profile-layout"><article className="panel profile-summary"><div className="profile-avatar">{initials(profile.name)}</div><h2>{profile.name}</h2><p>{profile.role} · {profile.company}</p><span className="tag success">Perfil ativo</span><em className="session-chip">Sessão local</em></article><article className="panel"><div className="panel-title-row"><div><h2>Dados do perfil</h2><span>Dados pessoais editáveis; função permanece controlada pela administração.</span></div><PrototypeFormDialog className="secondary-button" trigger="Editar" title="Editar perfil" description="As alterações ficam compartilhadas durante esta sessão. Função e permissões não podem ser alteradas pelo próprio usuário." onValidate={save} fields={[{name:'nome',label:'Nome',required:true,defaultValue:profile.name},{name:'email',label:'E-mail',type:'email',required:true,defaultValue:profile.email},{name:'telefone',label:'Telefone',type:'tel',required:true,defaultValue:profile.phone}]}/></div><div className="profile-fields"><label className="field-label">Nome<input className="field" value={profile.name} readOnly /></label><label className="field-label">Função<input className="field" value={profile.role} readOnly /></label><label className="field-label">E-mail<input className="field" value={profile.email} readOnly /></label><label className="field-label">Telefone<input className="field" value={profile.phone} readOnly /></label></div><div className="soft-box"><strong>Segurança prevista</strong><span>Na etapa conectada, função e escopo virão do backend/autorização e não de campos editáveis pelo usuário.</span></div></article></section>;
}
