import { ModuleHeader } from '@/components/CoreModules';
import { IncidentsSessionModule } from '@/components/IncidentsSessionModule';

export default function IncidentsPage() {
  return <><ModuleHeader title="Sinistros" description="Ocorrências, evidências e acompanhamento de incidentes." /><IncidentsSessionModule /></>;
}
