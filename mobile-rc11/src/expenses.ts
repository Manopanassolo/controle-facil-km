import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalAppointment } from './offline';

export type ExpenseNature='planned'|'actual';
export type ExpenseStatus='draft'|'submitted'|'approved'|'partial'|'rejected'|'reimbursed';
export type PayerType='company'|'employee'|'advance';
export type ExpenseReceipt={id:string;uri:string;kind:'image'|'pdf';name:string;createdAt:string};
export type ExpenseRecord={
  id:string;companyId:string;userId:string;date:string;createdAt:string;updatedAt:string;
  nature:ExpenseNature;status:ExpenseStatus;category:string;subcategory:string;description:string;
  amount:number;currency:'BRL';paymentMethod:string;payerType:PayerType;
  tripId?:string|null;vehicleId?:string|null;customerId?:string|null;visitId?:string|null;costCenter?:string|null;
  receipts:ExpenseReceipt[];requestedAmount:number;approvedAmount?:number|null;reimbursedAmount?:number|null;nonReimbursable?:boolean;
  source:'manual'|'route'|'imported';
};
export type ExpenseCategory={code:string;label:string;subs:string[];requiresVehicle?:boolean};
export const EXPENSE_CATEGORIES:ExpenseCategory[]=[
  {code:'fuel',label:'Combustível',subs:['Gasolina','Etanol','Diesel','GNV','Recarga elétrica'],requiresVehicle:true},
  {code:'toll',label:'Pedágio',subs:['Pedágio','Tag automática']},
  {code:'parking',label:'Estacionamento',subs:['Estacionamento','Zona Azul']},
  {code:'food',label:'Alimentação',subs:['Café','Almoço','Jantar','Lanche']},
  {code:'lodging',label:'Hospedagem',subs:['Hotel','Pousada','Airbnb','Taxas']},
  {code:'vehicle',label:'Veículo',subs:['Conserto emergencial','Oficina','Peças','Pneus','Óleo e lubrificantes','Lavagem'],requiresVehicle:true},
  {code:'assistance',label:'Assistência',subs:['Guincho','Socorro mecânico','Borracharia'],requiresVehicle:true},
  {code:'transport',label:'Transporte',subs:['Táxi','Aplicativo','Ônibus','Metrô','Passagem aérea']},
  {code:'rental',label:'Locação',subs:['Veículo','Equipamento']},
  {code:'ferry',label:'Balsa / Ferry',subs:['Balsa','Ferry','Travessia']},
  {code:'commercial',label:'Comercial',subs:['Amostras','Brindes','Material de cliente','Credenciamento']},
  {code:'travel',label:'Viagem',subs:['Bagagem','Lavanderia','Frigobar','Outras despesas de estadia']},
  {code:'other',label:'Outros',subs:['Outros']},
];
export const PAYMENT_METHODS=[
  {code:'corp_card',label:'Cartão corporativo',payerType:'company' as const},{code:'corp_pix',label:'PIX da empresa',payerType:'company' as const},{code:'company_cash',label:'Dinheiro da empresa',payerType:'company' as const},
  {code:'personal_card',label:'Cartão pessoal',payerType:'employee' as const},{code:'personal_pix',label:'PIX pessoal',payerType:'employee' as const},{code:'personal_cash',label:'Dinheiro pessoal',payerType:'employee' as const},{code:'advance',label:'Adiantamento de viagem',payerType:'advance' as const},
];
const key=(companyId:string)=>`movvant.rc11.expenses.${companyId||'local'}`;
export async function readExpenses(companyId:string){const raw=await AsyncStorage.getItem(key(companyId));if(!raw)return[] as ExpenseRecord[];try{const x=JSON.parse(raw) as ExpenseRecord[];return Array.isArray(x)?x:[]}catch{return[]}}
async function write(companyId:string,rows:ExpenseRecord[]){await AsyncStorage.setItem(key(companyId),JSON.stringify(rows.slice(0,1500)));return rows}
export async function upsertExpense(item:ExpenseRecord){const rows=await readExpenses(item.companyId);return write(item.companyId,[item,...rows.filter(x=>x.id!==item.id)])}
export async function removeExpense(companyId:string,id:string){return write(companyId,(await readExpenses(companyId)).filter(x=>x.id!==id))}
export async function submitDraftExpenses(companyId:string,userId:string){const now=new Date().toISOString();const rows=(await readExpenses(companyId)).map(x=>x.userId===userId&&x.nature==='actual'&&x.status==='draft'?{...x,status:'submitted' as const,updatedAt:now}:x);return write(companyId,rows)}
export function reimbursementFor(x:ExpenseRecord){if(x.nonReimbursable||x.payerType!=='employee')return 0;const eligible=x.status==='approved'||x.status==='partial'||x.status==='reimbursed'?Number(x.approvedAmount??x.requestedAmount??x.amount):Number(x.requestedAmount||x.amount);return Math.max(0,eligible-Number(x.reimbursedAmount||0))}
export function summarizeExpenses(rows:ExpenseRecord[]){const planned=rows.filter(x=>x.nature==='planned').reduce((n,x)=>n+x.amount,0),actual=rows.filter(x=>x.nature==='actual').reduce((n,x)=>n+x.amount,0),reimbursement=rows.filter(x=>x.nature==='actual').reduce((n,x)=>n+reimbursementFor(x),0);return{planned,actual,variance:actual-planned,reimbursement,count:rows.length}}
export async function ensurePlannedTripExpenses(companyId:string,userId:string,appointments:LocalAppointment[]){let rows=await readExpenses(companyId),changed=false;for(const a of appointments.filter(x=>x.type==='Viagem'&&x.travel)){const toll=Number(a.travel?.tollBRL||0);if(toll>0&&!rows.some(x=>x.id===`planned-toll-${a.id}`)){const now=new Date().toISOString();rows=[{id:`planned-toll-${a.id}`,companyId,userId,date:a.date,createdAt:now,updatedAt:now,nature:'planned',status:'draft',category:'toll',subcategory:'Pedágio',description:`Pedágio previsto · ${a.travel?.origin} → ${a.travel?.destination}`,amount:toll,currency:'BRL',paymentMethod:'corp_card',payerType:'company',tripId:a.id,receipts:[],requestedAmount:0,source:'route'},...rows];changed=true}for(const [i,e] of (a.travel?.plannedExpenses||[]).entries()){const id=`planned-extra-${a.id}-${i}`;if(Number(e.amount)>0&&!rows.some(x=>x.id===id)){const now=new Date().toISOString();rows=[{id,companyId,userId,date:a.date,createdAt:now,updatedAt:now,nature:'planned',status:'draft',category:e.category||'travel',subcategory:e.subcategory||'Outro previsto',description:e.description||`Custo previsto · ${a.travel?.origin} → ${a.travel?.destination}`,amount:Number(e.amount),currency:'BRL',paymentMethod:'corp_card',payerType:'company',tripId:a.id,receipts:[],requestedAmount:0,source:'route'},...rows];changed=true}}}if(changed)await write(companyId,rows);return rows}
