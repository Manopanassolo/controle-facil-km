import { ModuleHeader } from '@/components/CoreModules';
import { RouteSessionModule } from '@/components/RouteSessionModule';

export default function RoutesPage() {
  return <><ModuleHeader title="Rotas" description="Planejamento, execução e controle de KM dos deslocamentos." /><RouteSessionModule /></>;
}
