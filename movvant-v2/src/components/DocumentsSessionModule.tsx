'use client';

import { useState } from 'react';
import { PrototypeActionButton } from './PrototypeActionButton';
import { PrototypeFormDialog, PrototypeFormValues } from './PrototypeFormDialog';

type DocumentItem = { title: string; detail: string; status: string; session?: boolean };

const initialDocs: DocumentItem[] = [
  { title: 'CNH · Marcos Paulo', detail: 'Validade 18/03/2028', status: 'Válido' },
  { title: 'CRLV · SUV Comercial', detail: 'Licenciamento 2026', status: 'Válido' },
  { title: 'Seguro · Hatch Vendas', detail: 'Renova em 42 dias', status: 'Atenção' },
  { title: 'Comprovante · Utilitário', detail: 'Atualizado em 25/08', status: 'Válido' }
];

function text(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

export function DocumentsSessionModule() {
  const [sessionDocs, setSessionDocs] = useState<DocumentItem[]>([]);
  const docs = [...sessionDocs, ...initialDocs];

  function addDocument(values: PrototypeFormValues) {
    const rawDate = text(values, 'validade');
    const formatted = rawDate ? rawDate.split('-').reverse().join('/') : 'Sem validade';
    setSessionDocs((current) => [{
      title: `${text(values, 'tipo')} · ${text(values, 'vinculo')}`,
      detail: rawDate ? `Validade ${formatted}` : 'Sem validade informada',
      status: text(values, 'status'),
      session: true
    }, ...current]);
  }

  return <section className="panel">
    <div className="panel-title-row"><h2>Documentos monitorados</h2><PrototypeFormDialog trigger="+ Adicionar documento" title="Adicionar documento" description="Valide tipo, vínculo, validade e regra de alerta antes de conectarmos armazenamento de arquivos." onValidate={addDocument} fields={[
      {name:'tipo',label:'Tipo de documento',type:'select',required:true,options:['CNH','CRLV','Seguro','Comprovante','Contrato','Outro']},
      {name:'vinculo',label:'Vinculado a',required:true,placeholder:'Usuário ou veículo'},
      {name:'validade',label:'Data de validade',type:'date'},
      {name:'alerta',label:'Alertar com antecedência',type:'select',options:['7 dias','15 dias','30 dias','45 dias','60 dias']},
      {name:'status',label:'Status',type:'select',required:true,options:['Válido','Atenção','Pendente']},
      {name:'observacao',label:'Observação',type:'textarea',placeholder:'Informações adicionais do documento'}
    ]} /></div>
    {sessionDocs.length ? <div className="session-banner"><strong>{sessionDocs.length} documento(s) local(is)</strong><span>Somente nesta sessão · nenhum arquivo foi enviado.</span></div> : null}
    <div className="document-list">{docs.map((doc, index) => <div className={`document-row ${doc.session ? 'session-row' : ''}`} key={`${doc.title}-${index}`}><div className="document-copy"><strong>{doc.title}</strong><span>{doc.detail}</span>{doc.session ? <em className="session-chip">Somente nesta sessão</em> : null}</div><div className="row-actions"><span className={`tag ${doc.status === 'Válido' ? 'success' : 'warning'}`}>{doc.status}</span><PrototypeActionButton className="secondary-button" title={doc.title} description="Abrirá detalhes, arquivo anexado, validade, alertas e histórico de atualização deste documento.">Abrir</PrototypeActionButton></div></div>)}</div>
  </section>;
}
