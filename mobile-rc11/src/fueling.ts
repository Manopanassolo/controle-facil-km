import AsyncStorage from '@react-native-async-storage/async-storage';
import {FuelingStatus} from './fuelingValidation';

export type FuelingRecord={
 id:string;companyId:string;userId:string;vehicleId:string;vehiclePlate:string;
 occurredAt:string;odometerKm:number;liters:number;totalAmount:number;pricePerLiter:number;
 stationName:string;fuelType?:string|null;fullTank:boolean;partialFueling:boolean;
 receiptUri?:string|null;status:FuelingStatus;alerts:string[];reviewReasons:string[];
 approvedAt?:string|null;approvedBy?:string|null;rejectedAt?:string|null;rejectedBy?:string|null;
 createdAt:string;updatedAt:string;
};

const key=(companyId:string)=>`movvant.rc11.fuelings.${companyId}`;
export async function readFuelings(companyId:string):Promise<FuelingRecord[]>{
 const raw=await AsyncStorage.getItem(key(companyId));if(!raw)return[];
 try{const rows=JSON.parse(raw);return Array.isArray(rows)?rows:[]}catch{return[]}
}
export async function saveFueling(row:FuelingRecord){
 const rows=await readFuelings(row.companyId);const i=rows.findIndex(x=>x.id===row.id);if(i>=0)rows[i]=row;else rows.push(row);
 rows.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));await AsyncStorage.setItem(key(row.companyId),JSON.stringify(rows));return row;
}
export async function lastFuelingForVehicle(companyId:string,vehicleId:string,before?:string){
 const rows=(await readFuelings(companyId)).filter(x=>x.vehicleId===vehicleId&&x.status!=='review'&&(!before||x.occurredAt<before));
 return rows.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0]||null;
}
export async function approveFueling(companyId:string,id:string,userId:string){
 const rows=await readFuelings(companyId);const row=rows.find(x=>x.id===id);if(!row)return null;row.status='valid';row.approvedAt=new Date().toISOString();row.approvedBy=userId;row.reviewReasons=[];row.updatedAt=new Date().toISOString();await AsyncStorage.setItem(key(companyId),JSON.stringify(rows));return row;
}
export async function rejectFueling(companyId:string,id:string,userId:string){
 const rows=await readFuelings(companyId);const row=rows.find(x=>x.id===id);if(!row)return null;row.status='review';row.rejectedAt=new Date().toISOString();row.rejectedBy=userId;row.updatedAt=new Date().toISOString();await AsyncStorage.setItem(key(companyId),JSON.stringify(rows));return row;
}
