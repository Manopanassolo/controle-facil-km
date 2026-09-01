import { ModuleHeader } from '@/components/CoreModules';
import { ProfileSessionModule } from '@/components/ProfileSessionModule';

export default function ProfilePage() {
  return <><ModuleHeader title="Perfil" description="Dados pessoais, preferências e informações da conta." /><ProfileSessionModule /></>;
}
