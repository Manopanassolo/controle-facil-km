const fs = require('fs');
const path = require('path');

function patchFile(file, patches) {
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to, label] of patches) {
    if (text.includes(to)) continue;
    if (!text.includes(from)) throw new Error(`Patch target not found: ${label}`);
    text = text.replace(from, to);
    changed = true;
  }
  if (changed) fs.writeFileSync(file, text);
}

const root = path.join(__dirname, '..');
const trip = path.join(root, 'src', 'TripPlannerScreen.tsx');
const app = path.join(root, 'AppRC11Final.tsx');

patchFile(trip, [
  ["import MapView, { MapPressEvent, Marker, Polyline } from 'react-native-maps';", "import MapView, { Marker, Polyline } from 'react-native-maps';", 'remove MapPressEvent import'],
  ["const segmentDistance=(p:Point,a:Point,b:Point)=>{const x=p.longitude,y=p.latitude,x1=a.longitude,y1=a.latitude,x2=b.longitude,y2=b.latitude;const dx=x2-x1,dy=y2-y1;if(!dx&&!dy)return Math.hypot(x-x1,y-y1);const t=Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(x1+t*dx),y-(y1+t*dy))};\nconst routeDistance=(p:Point,pts:Point[])=>{let best=Infinity;for(let i=1;i<pts.length;i++)best=Math.min(best,segmentDistance(p,pts[i-1],pts[i]));return best};\n", "", 'remove map proximity helpers'],
  ["  const onMapPress=(e:MapPressEvent)=>{if(routes.length<2)return;const p=e.nativeEvent.coordinate;let best=-1,bestDist=Infinity;routes.forEach((r,i)=>{const pts=decodePolyline(r.polyline);if(pts.length>1){const d=routeDistance(p,pts);if(d<bestDist){bestDist=d;best=i}}});const threshold=Math.max(mapRegion.latitudeDelta,mapRegion.longitudeDelta)*0.045;if(best>=0&&bestDist<=threshold)selectRoute(best)};\n", "", 'remove ambiguous map tap selector'],
  [
    "<Text style={s.cardSub}>O mapa destaca somente a rota ativa. As demais aparecem discretas para permitir toque direto sem poluir a visualização.</Text>",
    "<Text style={s.cardSub}>Selecione uma alternativa. O mapa mostra somente a rota escolhida e, quando solicitado, o retorno correspondente.</Text>",
    'map helper text'
  ],
  [
    "<MapView ref={mapRef} style={[s.map,{height:mapHeight}]} initialRegion={mapRegion} customMapStyle={LIGHT_MAP_STYLE} onPress={onMapPress}>{routes.map((r,i)=>{if(i===selected)return null;const pts=decodePolyline(r.polyline);return pts.length>1?<Polyline key={`alt-${i}`} coordinates={pts} strokeColor=\"#C8D2DC\" strokeWidth={2} lineDashPattern={[8,8]} zIndex={2}/>:null})}{routePoints.length>1?<Polyline key={`selected-out-${selected}`} coordinates={routePoints} strokeColor={BLUE} strokeWidth={8} zIndex={20}/>:null}",
    "<MapView key={`active-map-${selected}-${showReturn?'return':'outbound'}`} ref={mapRef} style={[s.map,{height:mapHeight}]} initialRegion={mapRegion} customMapStyle={LIGHT_MAP_STYLE}>{routePoints.length>1?<Polyline key={`selected-out-${selected}`} coordinates={routePoints} strokeColor={BLUE} strokeWidth={8} zIndex={20}/>:null}",
    'render only active outbound route'
  ]
]);

patchFile(app, [
  [
    "{appointments.some(x=>x.date===isoDate(new Date(y,m,d)))&&<View style={s.dayDot}/>}",
    "{(()=>{const dayIso=isoDate(new Date(y,m,d));const dayRoutes=appointments.filter(x=>x.date===dayIso&&x.type==='Viagem');const hasPendingRoute=dayRoutes.some(x=>x.routeStatus!=='completed'&&x.routeStatus!=='cancelled');const hasAny=appointments.some(x=>x.date===dayIso);return hasPendingRoute?<View style={[s.dayDot,{backgroundColor:ORANGE}]}/>:hasAny?<View style={s.dayDot}/>:null})()}",
    'orange dot for pending route'
  ]
]);

console.log('RC11.9 map/calendar patch applied.');
