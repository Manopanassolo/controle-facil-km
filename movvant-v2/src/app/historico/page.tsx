import { ModuleHeader } from '@/components/CoreModules';
import { HistoryModule } from '@/components/RemainingModules';

export default function HistoryPage() {
  return <><ModuleHeader title="Histórico" description="Registro cronológico de visitas, rotas e atividades." /><HistoryModule /></>;
}
