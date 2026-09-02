import { ModuleHeader } from '@/components/CoreModules';
import { SettingsSessionModule } from '@/components/SettingsSessionModule';

export default function SettingsPage() {
  return <><ModuleHeader title="Configurações" description="Preferências, regras e integrações da aplicação." /><SettingsSessionModule /></>;
}
