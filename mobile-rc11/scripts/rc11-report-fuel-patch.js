const fs=require('fs');
const path=require('path');
const file=path.join(__dirname,'..','src','ReportsHierarchicalScreen.tsx');
let text=fs.readFileSync(file,'utf8');
const addAfterLine=(needle,line)=>{if(text.includes(line))return;if(!text.includes(needle)){console.log('Report fuel patch target changed:',needle);return;}text=text.replace(needle,`${needle}\n${line}`)};

addAfterLine("import{createAndShareKmPdf}from'./reportPdf';","import{readFuelings,FuelingRecord}from'./fueling';\nimport{summarizeFuelEconomics}from'./fuelEconomics';");

const stateNeedle=" const[routes,setRoutes]=useState<RouteRow[]>([]),[expenses,setExpenses]=useState<ExpenseRow[]>([]),[vehicles,setVehicles]=useState<VehicleRef[]>([]),[localExpenses,setLocalExpenses]=useState<any[]>([]),[loading,setLoading]=useState(false),[warning,setWarning]=useState('');";
addAfterLine(stateNeedle," const[fuelings,setFuelings]=useState<FuelingRecord[]>([]);");

const effectNeedle=" useEffect(()=>{readExpenses(data?.companyId||'local').then(setLocalExpenses).catch(()=>setLocalExpenses([]))},[data?.companyId]);";
addAfterLine(effectNeedle," useEffect(()=>{readFuelings(data?.companyId||'local').then(setFuelings).catch(()=>setFuelings([]))},[data?.companyId]);");

const oldFuel=" const realFuelRows=expenses.filter(x=>/fuel|combust|gasolina|diesel|etanol/i.test(x.expense_type||'')||Number(x.fuel_liters||0)>0),realFuelCost=realFuelRows.reduce((n,x)=>n+Number(x.amount||0),0),realLiters=realFuelRows.reduce((n,x)=>n+Number(x.fuel_liters||0),0);\n const refs=vehicles.filter(v=>Number(v.avg_km_per_liter||0)>0&&Number(v.reference_fuel_price||0)>0),refAvg=refs.length?refs.reduce((n,v)=>n+Number(v.avg_km_per_liter||0),0)/refs.length:0,refPrice=refs.length?refs.reduce((n,v)=>n+Number(v.reference_fuel_price||0),0)/refs.length:0,estimatedLiters=refAvg>0?kmTotal/refAvg:0,estimatedFuelCost=estimatedLiters*refPrice,fuelMode=realFuelCost>0||realLiters>0?'real':'estimated',fuelCost=fuelMode==='real'?realFuelCost:estimatedFuelCost;";
const newFuel=" const fuelSummary=summarizeFuelEconomics({km:kmTotal,fuelings,remoteExpenses:expenses,vehicleRefs:vehicles,from:start,to:end});\n const fuelMode=fuelSummary.mode==='approved-real'||fuelSummary.mode==='remote-real'?'real':'estimated',fuelCost=fuelSummary.cost,realFuelCost=fuelMode==='real'?fuelSummary.cost:0,realLiters=fuelMode==='real'?fuelSummary.liters:0,estimatedLiters=fuelSummary.mode==='estimated'?fuelSummary.liters:0,refAvg=fuelSummary.mode==='unavailable'?0:1;";
if(!text.includes(newFuel)){
 if(text.includes(oldFuel))text=text.replace(oldFuel,newFuel);else if(text.includes("const fuelSummary=summarizeFuelEconomics")){text=text.replace("fuelCost=fuelSummary.cost,realLiters=", "fuelCost=fuelSummary.cost,realFuelCost=fuelMode==='real'?fuelSummary.cost:0,realLiters=");}else console.log('Report fuel calculation target changed');
}

const oldPdf="fuelLabel:refAvg||realFuelCost?money(fuelCost):'Sem base',litersLabel:(fuelMode==='real'?realLiters:estimatedLiters)>0?`${(fuelMode==='real'?realLiters:estimatedLiters).toFixed(1)} L`:'Sem base'";
const newPdf="fuelLabel:fuelSummary.mode==='unavailable'?'Sem base':money(fuelSummary.cost),litersLabel:fuelSummary.liters>0?`${fuelSummary.liters.toFixed(1)} L`:'Sem base',fuelSourceLabel:fuelSummary.label,fuelCostPerKmLabel:fuelSummary.costPerKm>0?money(fuelSummary.costPerKm):'—',pendingFuelLabel:fuelSummary.pendingCount>0?`${fuelSummary.pendingCount} abastecimento(s) aguardando aprovação · ${money(fuelSummary.pendingAmount)} ainda fora do realizado`:undefined";
if(!text.includes(newPdf)){
 if(text.includes(oldPdf))text=text.replace(oldPdf,newPdf);else console.log('Report PDF fuel payload target changed');
}

fs.writeFileSync(file,text);
console.log('RC11.12 trusted fuel economics report patch completed.');
