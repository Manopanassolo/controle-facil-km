import { ModuleHeader, ReportsModule } from '@/components/CoreModules';
import { ReportsControls } from '@/components/ReportsControls';

export default function ReportsPage() {
  return <><ModuleHeader title="Relatórios" description="Relatórios gerenciais e comerciais." /><ReportsControls /><ReportsModule /></>;
}
