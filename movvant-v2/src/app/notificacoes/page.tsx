import { ModuleHeader } from '@/components/CoreModules';
import { NotificationsSessionModule } from '@/components/NotificationsSessionModule';

export default function NotificationsPage() {
  return <><ModuleHeader title="Notificações" description="Alertas informativos da operação, separados das pendências acionáveis." /><NotificationsSessionModule /></>;
}
