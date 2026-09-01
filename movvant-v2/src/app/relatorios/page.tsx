import { ModuleHeader } from '@/components/CoreModules';
import { ReportsSessionModule } from '@/components/ReportsSessionModule';

export default function ReportsPage() {
  return <><ModuleHeader title="Relatórios" description="Indicadores, filtros e exportação da operação desta sessão." /><ReportsSessionModule /></>;
}
