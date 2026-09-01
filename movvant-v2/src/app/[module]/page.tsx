import { notFound } from 'next/navigation';
import { moduleMap } from '@/lib/modules';
import { DocumentsModule, GenericModule, HistoryModule, IncidentsModule, NotificationsModule, ProfileModule, SettingsModule, TeamModule } from '@/components/RemainingModules';
import { FieldModeModule, PendingModule } from '@/components/OperationsModules';
import { ModuleHeader } from '@/components/CoreModules';

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const current = moduleMap.get(slug);
  if (!current) notFound();

  const content = slug === 'pendencias' ? <PendingModule />
    : slug === 'campo' ? <FieldModeModule />
    : slug === 'historico' ? <HistoryModule />
    : slug === 'equipe' ? <TeamModule />
    : slug === 'documentos' ? <DocumentsModule />
    : slug === 'sinistros' ? <IncidentsModule />
    : slug === 'notificacoes' ? <NotificationsModule />
    : slug === 'perfil' ? <ProfileModule />
    : slug === 'configuracoes' ? <SettingsModule />
    : <GenericModule title={current.label} />;

  return <><ModuleHeader title={current.label} description={current.description} />{content}</>;
}
