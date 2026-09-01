import { ModuleHeader } from '@/components/CoreModules';
import { ProfileModule } from '@/components/RemainingModules';

export default function ProfilePage() {
  return <><ModuleHeader title="Perfil" description="Dados pessoais, preferências e informações da conta." /><ProfileModule /></>;
}
