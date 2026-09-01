import { ModuleHeader } from '@/components/CoreModules';
import { PendingModule } from '@/components/OperationsModules';

export default function PendingPage() {
  return <><ModuleHeader title="Pendências" description="Ações que exigem atenção, responsável e prazo." /><PendingModule /></>;
}
