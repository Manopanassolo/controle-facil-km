import { ModuleHeader } from '@/components/CoreModules';
import { NotificationsModule } from '@/components/RemainingModules';

export default function NotificationsPage() {
  return <><ModuleHeader title="Notificações" description="Alertas e informações importantes da operação." /><NotificationsModule /></>;
}
