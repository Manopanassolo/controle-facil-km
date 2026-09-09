import { ModuleHeader } from '@/components/CoreModules';
import { PendingSessionModule } from '@/components/PendingSessionModule';

export default function PendingPage() {
  return <><ModuleHeader title="Pendências" description="Ações que exigem atenção, responsável e prazo." /><PendingSessionModule /></>;
}
