export type FuelingStatus='valid'|'attention'|'review';
export type FuelingInput={vehicleId:string;occurredAt:string;odometerKm:number;liters:number;totalAmount:number;pricePerLiter:number;stationName:string;fuelType?:string;fullTank?:boolean;partialFueling?:boolean;receiptAttached?:boolean};
export type FuelingVehicle={currentOdometerKm?:number|null;fuelType?:string|null;avgKmPerLiter?:number|null;referenceFuelPrice?:number|null;tankCapacityLiters?:number|null};
export type FuelingPrevious={odometerKm:number;occurredAt:string;fullTank?:boolean;liters?:number};
export type FuelingPolicy={priceTolerancePct:number;tankTolerancePct:number;lowConsumptionPct:number;highConsumptionPct:number;moneyTolerance:number;requireReceipt:boolean};
export const DEFAULT_FUELING_POLICY:FuelingPolicy={priceTolerancePct:10,tankTolerancePct:5,lowConsumptionPct:50,highConsumptionPct:150,moneyTolerance:.05,requireReceipt:false};
export type FuelingValidation={blocked:boolean;status:FuelingStatus;errors:string[];alerts:string[];reviewReasons:string[];calculated:{pricePerLiter:number;totalAmount:number;distanceKm?:number;realKmPerLiter?:number}};
const pctDiff=(a:number,b:number)=>b>0?Math.abs(a-b)/b*100:0;
export function validateFueling(input:FuelingInput,vehicle:FuelingVehicle,previous?:FuelingPrevious|null,policy:FuelingPolicy=DEFAULT_FUELING_POLICY):FuelingValidation{
 const errors:string[]=[],alerts:string[]=[],reviewReasons:string[]=[];
 if(!input.vehicleId)errors.push('Selecione o veículo.');
 const date=new Date(input.occurredAt);if(Number.isNaN(date.getTime()))errors.push('Informe uma data/hora válida.');else if(date.getTime()>Date.now()+5*60*1000)errors.push('A data/hora não pode estar no futuro.');
 if(!(input.odometerKm>0))errors.push('Informe um odômetro válido.');
 if(!(input.liters>0))errors.push('Litros devem ser maiores que zero.');
 if(!(input.totalAmount>0))errors.push('Valor total deve ser maior que zero.');
 if(!(input.pricePerLiter>0))errors.push('Preço por litro deve ser maior que zero.');
 if(!input.stationName.trim())errors.push('Informe o posto.');
 const lastOdo=previous?.odometerKm??vehicle.currentOdometerKm??0;if(lastOdo>0&&input.odometerKm<lastOdo)errors.push('Odômetro menor que o último registro válido.');
 const calculatedTotal=input.liters*input.pricePerLiter;if(input.liters>0&&input.pricePerLiter>0&&Math.abs(calculatedTotal-input.totalAmount)>policy.moneyTolerance)errors.push('Litros × preço/litro não confere com o valor total.');
 if(vehicle.fuelType&&input.fuelType&&vehicle.fuelType.toLowerCase()!==input.fuelType.toLowerCase()){alerts.push('Combustível diferente do cadastro do veículo.');reviewReasons.push('Tipo de combustível divergente.');}
 if(vehicle.referenceFuelPrice&&pctDiff(input.pricePerLiter,vehicle.referenceFuelPrice)>policy.priceTolerancePct){alerts.push('Preço por litro fora da faixa de referência.');reviewReasons.push('Preço do combustível fora da tolerância.');}
 if(vehicle.tankCapacityLiters&&input.liters>vehicle.tankCapacityLiters*(1+policy.tankTolerancePct/100)){alerts.push('Litros acima da capacidade cadastrada do tanque.');reviewReasons.push('Volume abastecido acima da capacidade tolerada.');}
 if(policy.requireReceipt&&!input.receiptAttached){alerts.push('Comprovante obrigatório não anexado.');reviewReasons.push('Comprovante ausente.');}
 let distanceKm:number|undefined,realKmPerLiter:number|undefined;
 if(previous&&input.odometerKm>=previous.odometerKm){distanceKm=input.odometerKm-previous.odometerKm;if(previous.fullTank&&input.fullTank&&input.liters>0){realKmPerLiter=distanceKm/input.liters;if(vehicle.avgKmPerLiter){const ratio=realKmPerLiter/vehicle.avgKmPerLiter*100;if(ratio<policy.lowConsumptionPct||ratio>policy.highConsumptionPct){alerts.push('Consumo real fora da faixa esperada.');reviewReasons.push('Média real muito diferente da média cadastrada.');}}}}
 if(previous&&new Date(input.occurredAt)<new Date(previous.occurredAt)){alerts.push('Abastecimento lançado com data retroativa.');reviewReasons.push('Sequência cronológica alterada.');}
 const blocked=errors.length>0;const status:FuelingStatus=blocked||reviewReasons.length?'review':alerts.length?'attention':'valid';
 return{blocked,status,errors,alerts,reviewReasons,calculated:{pricePerLiter:input.pricePerLiter,totalAmount:input.totalAmount,distanceKm,realKmPerLiter}};
}

export function fuelReportSource(validRealAmount:number,estimatedAmount:number,coveredKm:number,totalKm:number){
 if(validRealAmount>0&&totalKm>0&&coveredKm>=totalKm*.999)return{kind:'real' as const,primary:validRealAmount,estimated:estimatedAmount};
 if(validRealAmount>0&&coveredKm>0&&totalKm>coveredKm)return{kind:'mixed' as const,primary:validRealAmount+estimatedAmount*Math.max(0,(totalKm-coveredKm)/totalKm),estimated:estimatedAmount};
 return{kind:'estimated' as const,primary:estimatedAmount,estimated:estimatedAmount};
}
