import { ModuleHeader } from '@/components/CoreModules';
import { HistorySessionModule } from '@/components/HistorySessionModule';

export default function HistoryPage() {
  return <><ModuleHeader title="Histórico" description="Registro cronológico de visitas, rotas e atividades." /><HistorySessionModule /></>;
}
