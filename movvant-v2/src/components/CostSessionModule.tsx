'use client';

import { PrototypeFormDialog, PrototypeFormValues } from '@/components/PrototypeFormDialog';
import { useSessionActivity } from '@/components/SessionActivityProvider';

const initialRows = [['01/09','Combustível','Posto Central','R$ 286,40'],['29/08','Pedágio','BR-101','R$ 18,60'],['28/08','Estacionamento','Centro Itajaí','R$ 24,00'],['27/08','Combustível','Posto Norte','R$ 241,70']];

function text(values: PrototypeFormValues, key: string) {
  const current = values[key];
  return Array.isArray(current) ? current.join(' · ') : current || '';
}

export function CostSessionModule() {
  const { expenses, addExpense, totalExpenses, vehicleOptions } = useSessionActivity();

  function createExpense(values: PrototypeFormValues) {
    addExpense({
      category: text(values, 'categoria'),
      amount: Number(text(values, 'valor').replace(',', '.')) || 0,
      date: text(values, 'data'),
      vehicle: text(values, 'veiculo'),
      km: Number(text(values, 'km')) || undefined,
      place: text(values, 'local') || text(values, 'veiculo')
    });
  }

  const sessionRows = expenses.map((expense) => {
    const date = expense.date ? expense.date.split('-').reverse().slice(0,2).join('/') : 'Hoje';
    return [date, expense.category, expense.place, `R$ ${expense.amount.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`, 'session'];
  });
  const rows = [...sessionRows, ...initialRows.map((row) => [...row, ''])];

  return <>
    <section className="dashboard-grid">
      <article className="metric-card"><span className="metric-label">Total no mês</span><strong className="metric-value">R$ 1.024</strong><div className="metric-note">base demonstrativa</div></article>
      <article className="metric-card"><span className="metric-label">Despesas da sessão</span><strong className="metric-value">R$ {totalExpenses.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><div className="metric-note">jornadas + lançamentos locais</div></article>
      <article className="metric-card"><span className="metric-label">Lançamentos locais</span><strong className="metric-value">{expenses.length}</strong><div className="metric-note">fora do Modo Campo</div></article>
      <article className="metric-card"><span className="metric-label">Veículos disponíveis</span><strong className="metric-value">{vehicleOptions.length}</strong><div className="metric-note">frota compartilhada ativa/reserva</div></article>
    </section>
    <section className="panel data-panel">
      <div className="panel-title-row"><h2>Lançamentos recentes</h2><PrototypeFormDialog trigger="+ Nova despesa" title="Nova despesa" description="O veículo é selecionado da frota compartilhada da V2." onValidate={createExpense} fields={[
        {name:'categoria',label:'Categoria',type:'select',required:true,options:['Combustível','Pedágio','Estacionamento','Alimentação','Hospedagem','Outro']},
        {name:'valor',label:'Valor (R$)',type:'number',required:true,placeholder:'0,00'},
        {name:'data',label:'Data',type:'date',required:true},
        {name:'veiculo',label:'Veículo',type:'select',required:true,options:vehicleOptions},
        {name:'km',label:'KM no lançamento',type:'number',placeholder:'12480'},
        {name:'local',label:'Local',placeholder:'Estabelecimento ou cidade'},
        {name:'observacao',label:'Observação',type:'textarea',placeholder:'Detalhes relevantes da despesa'}
      ]} /></div>
      {expenses.length ? <div className="session-banner" role="status"><strong>{expenses.length} lançamento(s) local(is)</strong><span>Usando a mesma frota de Rotas e Modo Campo.</span></div> : null}
      <div className="data-table">{rows.map(([date,type,place,amount,session], index) => <div className={`data-row ${session ? 'session-row' : ''}`} key={`${date}-${type}-${index}`}><span>{date}</span><strong>{type}</strong><span>{place}</span><b>{amount}</b>{session ? <em className="session-chip">Sessão</em> : null}</div>)}</div>
    </section>
  </>;
}
