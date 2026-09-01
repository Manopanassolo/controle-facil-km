import { ModuleHeader } from '@/components/CoreModules';
import { TeamSessionModule } from '@/components/TeamSessionModule';

export default function TeamPage() {
  return <><ModuleHeader title="Equipe" description="Usuários, funções, permissões e escopo de operação." /><TeamSessionModule /></>;
}
