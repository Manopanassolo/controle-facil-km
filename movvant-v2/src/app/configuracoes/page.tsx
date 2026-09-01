import { ModuleHeader } from '@/components/CoreModules';
import { SettingsModule } from '@/components/RemainingModules';

export default function SettingsPage() {
  return <><ModuleHeader title="Configurações" description="Preferências, regras e integrações da aplicação." /><SettingsModule /></>;
}
