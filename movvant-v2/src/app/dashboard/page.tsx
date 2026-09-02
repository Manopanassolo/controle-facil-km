import { DashboardByRole } from '@/components/DashboardByRole';

export default function DashboardPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Movvant V2</span>
          <h1>Dashboard</h1>
          <p>Indicadores e ações adaptados à função e às permissões do usuário.</p>
        </div>
        <span className="status-badge">Base visual isolada · sem backend</span>
      </div>
      <DashboardByRole />
    </>
  );
}
