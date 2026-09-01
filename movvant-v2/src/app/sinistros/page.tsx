import { ModuleHeader } from '@/components/CoreModules';
import { IncidentsModule } from '@/components/RemainingModules';

export default function IncidentsPage() {
  return <><ModuleHeader title="Sinistros" description="Ocorrências, evidências e acompanhamento de incidentes." /><IncidentsModule /></>;
}
