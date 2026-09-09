'use client';

import { NotificationPreferenceKey, usePreferencesSession } from './PreferencesSessionProvider';

const rows:{key:NotificationPreferenceKey;title:string;detail:string;}[]=[
 {key:'fleet',title:'Frota e manutenção',detail:'Revisões próximas, vencidas e mudanças operacionais da frota.'},
 {key:'documents',title:'Documentos',detail:'CNH, CRLV, seguro e demais documentos em atenção.'},
 {key:'incidents',title:'Sinistros',detail:'Novas ocorrências, mudanças de status e conclusões.'},
 {key:'agenda',title:'Agenda',detail:'Compromissos criados, em atendimento e concluídos.'},
 {key:'field',title:'Campo e rotas',detail:'Rotas e jornadas concluídas durante a operação.'},
 {key:'finance',title:'Financeiro',detail:'Despesas registradas e eventos financeiros da sessão.'}
];

export function SettingsSessionModule(){
 const{notificationPreferences,setNotificationPreference,resetPreferences,enabledNotificationCount}=usePreferencesSession();
 return <section className="panel"><div className="panel-title-row"><div><span className="eyebrow">Preferências funcionais · sessão</span><h2>Notificações</h2><span>{enabledNotificationCount} de {rows.length} categorias habilitadas</span></div><button type="button" className="secondary-button" onClick={resetPreferences}>Restaurar padrões</button></div><div className="setting-list">{rows.map(row=>{const enabled=notificationPreferences[row.key];return <div className="setting-row" key={row.key}><div className="setting-copy"><strong>{row.title}</strong><span>{row.detail}</span></div><button type="button" className={`secondary-button ${enabled?'':'muted'}`} aria-pressed={enabled} onClick={()=>setNotificationPreference(row.key,!enabled)}>{enabled?'Habilitada':'Desabilitada'}</button></div>;})}</div><div className="soft-box"><strong>Integrações externas permanecem isoladas</strong><span>Google Agenda, Maps, autenticação e banco ainda não são alterados por esta tela. Estas preferências afetam somente a Central de Notificações da sessão.</span></div></section>;
}
