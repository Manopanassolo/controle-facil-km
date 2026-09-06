import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export type PdfDashboard = {
  reportTitle:string;
  scopeLabel:string;
  periodLabel:string;
  displacements:number;
  completed:number;
  plannedComparableKm:number;
  realizedKm:number;
  futurePlannedKm:number;
  expensesLabel:string;
  fuelLabel:string;
  litersLabel:string;
};

export type PdfDisplacement = {
  date:string;
  status:string;
  title:string;
  vehicle:string;
  plannedKm:number;
  actualKm:number;
  source:string;
  expenseLabel:string;
};

const esc=(v:unknown)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const km=(v:number)=>`${Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})} km`;

export function buildKmReportHtml(d:PdfDashboard, rows:PdfDisplacement[]){
  const cards=[
    ['DESLOCAMENTOS',String(d.displacements)],
    ['CONCLUÍDOS',String(d.completed)],
    ['KM PLANEJADO COMPARÁVEL',km(d.plannedComparableKm)],
    ['KM REALIZADO',km(d.realizedKm)],
    ['KM FUTURO PLANEJADO',km(d.futurePlannedKm)],
    ['DESPESAS',d.expensesLabel],
    ['COMBUSTÍVEL',d.fuelLabel],
    ['LITROS',d.litersLabel],
  ];
  const detail=rows.length?rows.map(r=>`<tr>
    <td>${esc(r.date)}</td><td>${esc(r.status)}</td><td>${esc(r.title)}</td><td>${esc(r.vehicle)}</td>
    <td class="num">${esc(km(r.plannedKm))}</td><td class="num">${esc(r.actualKm>0?km(r.actualKm):'—')}</td>
    <td>${esc(r.source)}</td><td class="num">${esc(r.expenseLabel)}</td>
  </tr>`).join(''):`<tr><td colspan="8" class="empty">Nenhum deslocamento encontrado no período.</td></tr>`;
  return `<!doctype html><html><head><meta charset="utf-8"/><style>
  @page{size:A4;margin:24px}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#17324D;margin:0;font-size:10px}
  .top{background:#0B3558;color:#fff;padding:20px 22px;border-radius:12px}.brand{font-size:10px;letter-spacing:2px;opacity:.8}.title{font-size:23px;font-weight:800;margin:5px 0}.meta{font-size:10px;opacity:.9;line-height:1.5}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0 18px}.card{border:1px solid #DFE6EE;border-radius:10px;padding:10px;min-height:62px;background:#F7F9FC}.label{font-size:7px;font-weight:700;color:#78889A;letter-spacing:.3px}.value{font-size:15px;font-weight:800;color:#0B3558;margin-top:7px}
  h2{font-size:14px;margin:12px 0 8px}table{width:100%;border-collapse:collapse;table-layout:fixed}th{background:#EAF2FE;color:#0B3558;font-size:7px;text-align:left;padding:7px;border-bottom:1px solid #C9D7E6}td{padding:7px;border-bottom:1px solid #E6EBF0;vertical-align:top;word-wrap:break-word}.num{text-align:right}.empty{text-align:center;padding:22px;color:#78889A}
  .foot{margin-top:16px;color:#78889A;font-size:8px;text-align:right}.status{font-weight:700}.wide{width:22%}
  </style></head><body>
  <div class="top"><div class="brand">MOVVANT ENTERPRISE</div><div class="title">${esc(d.reportTitle)}</div><div class="meta">${esc(d.scopeLabel)}<br/>Período: ${esc(d.periodLabel)}</div></div>
  <div class="grid">${cards.map(([l,v])=>`<div class="card"><div class="label">${esc(l)}</div><div class="value">${esc(v)}</div></div>`).join('')}</div>
  <h2>Detalhes por deslocamento</h2>
  <table><thead><tr><th>DATA</th><th>STATUS</th><th class="wide">ORIGEM → DESTINO / TRABALHO</th><th>VEÍCULO</th><th>KM PLANEJADO</th><th>KM REAL</th><th>FONTE KM</th><th>DESPESAS</th></tr></thead><tbody>${detail}</tbody></table>
  <div class="foot">Gerado pelo Movvant em ${esc(new Date().toLocaleString('pt-BR'))}</div>
  </body></html>`;
}

export async function createAndShareKmPdf(d:PdfDashboard,rows:PdfDisplacement[]){
  const html=buildKmReportHtml(d,rows);
  const file=await Print.printToFileAsync({html});
  const available=await Sharing.isAvailableAsync();
  if(available){
    await Sharing.shareAsync(file.uri,{mimeType:'application/pdf',dialogTitle:'Salvar ou compartilhar relatório Movvant'});
  }else{
    await Print.printAsync({uri:file.uri});
  }
  return file;
}
