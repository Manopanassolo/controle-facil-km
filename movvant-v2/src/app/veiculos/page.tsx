import { ModuleHeader } from '@/components/CoreModules';
import { VehicleSessionModule } from '@/components/VehicleSessionModule';

export default function VehiclesPage() {
  return <><ModuleHeader title="Veículos" description="Cadastro e acompanhamento da frota." /><VehicleSessionModule /></>;
}
