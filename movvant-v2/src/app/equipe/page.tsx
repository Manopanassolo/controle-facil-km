import { ModuleHeader } from '@/components/CoreModules';
import { TeamModule } from '@/components/RemainingModules';

export default function TeamPage() {
  return <><ModuleHeader title="Equipe" description="Usuários, funções, permissões e escopo de operação." /><TeamModule /></>;
}
