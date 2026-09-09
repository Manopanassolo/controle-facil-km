import { PrototypeActionButton } from './PrototypeActionButton';

export function ReportsControls() {
  return (
    <div className="panel-title-row module-actions reports-actions">
      <div>
        <span className="eyebrow">Período e saída</span>
        <strong>Setembro de 2026 · visão consolidada</strong>
      </div>
      <div className="row-actions">
        <PrototypeActionButton
          className="secondary-button"
          title="Filtrar relatórios"
          description="Abrirá período, equipe, usuário, veículo, loja e região sem alterar os demais módulos."
        >
          Filtrar
        </PrototypeActionButton>
        <PrototypeActionButton
          title="Exportar relatório"
          description="Permitirá escolher PDF ou planilha com os filtros aplicados e identificação de quem gerou o relatório."
        >
          Exportar
        </PrototypeActionButton>
      </div>
    </div>
  );
}
