import { ModuleHeader } from '@/components/CoreModules';
import { AgendaSessionModule } from '@/components/AgendaSessionModule';

export default function AgendaPage() {
  return <><ModuleHeader title="Agenda" description="Compromissos, visitas e atividades comerciais." /><AgendaSessionModule /></>;
}
