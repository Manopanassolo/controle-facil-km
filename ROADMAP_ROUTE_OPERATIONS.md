# Roadmap — Roteiros Operacionais

Status: **pendência estratégica / módulo opcional**.

## Objetivo
Criar um módulo opcional para empresas que operam rotas diárias de entregas, coletas, serviços técnicos ou visitas comerciais. O módulo deve aceitar roteiros programados manualmente, importados por arquivo e integrados por API.

## Escopo funcional previsto

### 1. Entrada de roteiros
- Criação manual no app.
- Importação por CSV/XLSX com validação prévia.
- API para integração com ERP, TMS, CRM ou sistemas próprios.
- Identificador externo idempotente para impedir duplicidades.
- Data, motorista, veículo, unidade/filial, centro de custo e janela de execução.
- Sequência de paradas com endereço, coordenadas, cliente/local, referência externa, observações e janela de atendimento.

### 2. Planejamento e otimização
- Cálculo da rota planejada antes do início.
- Distância prevista, duração prevista, pedágios e sequência de paradas.
- Possibilidade de rota fechada/ida e volta.
- Reotimização controlada quando houver inclusão/cancelamento de paradas.

### 3. Check-in e check-out automáticos
- Geofence configurável por parada.
- Check-in automático quando o dispositivo entra na área da parada e atende aos critérios mínimos de permanência.
- Check-out automático ao sair da área após o atendimento.
- Registrar hora, latitude, longitude, precisão do GPS e origem do registro.
- Permitir correção manual somente com justificativa e trilha de auditoria.

### 4. Telemetria operacional
- Registrar pontos de localização durante a execução do roteiro em frequência adaptativa.
- Calcular distância e tempo realmente percorridos.
- Separar tempo em deslocamento, tempo parado e tempo em atendimento.
- Registrar início e fim do roteiro, além do início e fim de cada parada.
- Operar com fila offline no celular quando não houver internet e sincronizar depois.

### 5. Desvios de rota
- Comparar percurso planejado com percurso realizado.
- Detectar saída do corredor esperado da rota usando tolerância configurável.
- Registrar início, fim, duração, distância adicional e estimativa de custo do desvio.
- Não tratar pequenos ajustes de trânsito como desvio relevante.
- Permitir classificar o desvio: trânsito, bloqueio, parada não programada, erro de caminho, necessidade operacional, pessoal ou outro.

### 6. Indicadores e relatórios
- KM planejado x realizado.
- Tempo planejado x realizado.
- Distância e custo adicionais por desvios.
- Pontualidade por parada.
- Tempo médio de atendimento.
- Paradas não realizadas.
- Paradas extras.
- Desempenho por motorista, veículo, unidade, centro de custo e roteiro.

### 7. Segurança e privacidade
- Localização deve ser coletada apenas durante períodos operacionais autorizados conforme política da organização.
- RLS por organização e unidade.
- Histórico de alterações e correções manuais.
- Política configurável de retenção dos pontos de localização.
- Documentar claramente o uso de localização em segundo plano no Android/iOS antes da publicação nas lojas.

## Arquitetura prevista
- Feature flag por contrato: `route_operations`.
- Entidades futuras sugeridas: `km_route_batches`, `km_route_plans`, `km_route_stops`, `km_route_assignments`, `km_route_executions`, `km_route_location_points`, `km_route_stop_events`, `km_route_deviations`, `km_route_import_batches` e `km_route_integrations`.
- Ingestão por arquivo deve ter staging + validação + commit, nunca importar diretamente na tabela final.
- API externa deve usar idempotency key e autenticação específica por organização.
- Cálculos de rota devem aproveitar a infraestrutura de Google Routes já utilizada pelo Controle Fácil de KM.

## Regra comercial
O módulo deve permanecer desativado por padrão e só aparecer para organizações cujo contrato tenha `route_operations=true`. Usuário individual não recebe esse módulo por padrão.

## Critério para iniciar desenvolvimento
Iniciar após estabilização dos módulos de Frota, Documentos, Sinistros, Agenda e Backup, com uma rodada específica de definição de geofence, frequência de localização, política de privacidade e formato padrão de importação/API.
