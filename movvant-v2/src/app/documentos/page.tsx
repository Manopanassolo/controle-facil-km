import { ModuleHeader } from '@/components/CoreModules';
import { DocumentsSessionModule } from '@/components/DocumentsSessionModule';

export default function DocumentsPage() {
  return <><ModuleHeader title="Documentos" description="Validades, comprovantes e documentos operacionais." /><DocumentsSessionModule /></>;
}
