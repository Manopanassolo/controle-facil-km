from playwright.sync_api import sync_playwright, expect

BASE='http://127.0.0.1:3000'
ROUTES={
 'dashboard':'Dashboard','pendencias':'Pendências','agenda':'Agenda','notificacoes':'Notificações','campo':'Modo Campo','roteiros':'Rotas','historico':'Histórico','custos':'Custos','veiculos':'Veículos','equipe':'Equipe','documentos':'Documentos','sinistros':'Sinistros','relatorios':'Relatórios','perfil':'Perfil','configuracoes':'Configurações'
}

def assert_layout(page, slug, title):
    page.goto(f'{BASE}/{slug}', wait_until='networkidle')
    expect(page.locator('h1')).to_contain_text(title)
    assert page.locator('.topbar').count() == 1, f'{slug}: topbar ausente'
    assert page.locator('.content-area').count() == 1, f'{slug}: content-area ausente'
    overflow=page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth + 2')
    assert not overflow, f'{slug}: overflow horizontal'
    overlay=page.locator('[data-nextjs-dialog]')
    assert overlay.count() == 0, f'{slug}: overlay de erro do Next.js'


def test_modal_keyboard(page):
    page.goto(f'{BASE}/agenda', wait_until='networkidle')
    trigger=page.get_by_role('button', name='+ Novo compromisso')
    trigger.focus()
    trigger.click()
    dialog=page.get_by_role('dialog')
    expect(dialog).to_be_visible()
    assert dialog.evaluate('(node)=>node.contains(document.activeElement)'), 'foco não entrou no modal'
    page.keyboard.press('Escape')
    expect(dialog).to_be_hidden()
    assert trigger.evaluate('(node)=>node===document.activeElement'), 'foco não retornou ao gatilho'


def create_agenda_item(page):
    page.get_by_role('button', name='+ Novo compromisso').click()
    page.get_by_label('Título *').fill('Visita E2E')
    page.get_by_label('Cliente *').fill('Cliente Automação')
    page.get_by_label('Data *').fill('2026-09-02')
    page.get_by_label('Horário *').fill('09:30')
    page.get_by_label('Endereço *').fill('Rua Teste, 100, Itajaí')
    page.get_by_label('Responsável *').fill('Rafael Silva')
    page.get_by_role('button', name='Adicionar nesta sessão').click()
    expect(page.get_by_text('Fluxo validado.')).to_be_visible()
    page.get_by_role('button', name='Concluir').click()


def test_agenda_flow_and_route_draft(page):
    page.goto(f'{BASE}/agenda', wait_until='networkidle')
    create_agenda_item(page)
    expect(page.get_by_text('Visita E2E')).to_be_visible()
    expect(page.get_by_text('Cliente Automação · Rua Teste, 100, Itajaí')).to_be_visible()
    expect(page.locator('.agenda-main h2')).to_contain_text('2 de setembro')
    page.get_by_role('button', name='Selecionar 1 de setembro').click()
    expect(page.locator('.agenda-main h2')).to_contain_text('1 de setembro')
    page.get_by_role('button', name='Selecionar 2 de setembro').click()
    expect(page.get_by_text('Visita E2E')).to_be_visible()
    page.get_by_role('link', name='Abrir rota').first.click()
    expect(page.locator('h1')).to_contain_text('Rotas')
    expect(page.get_by_text('Rota preparada pela Agenda · Cliente Automação')).to_be_visible()
    page.get_by_role('button', name='Iniciar rota').click()
    expect(page.get_by_label('Destino *')).to_have_value('Rua Teste, 100, Itajaí')
    expect(page.get_by_label('Finalidade *')).to_have_value('Visita comercial')
    page.keyboard.press('Escape')


def test_reports_filter(page):
    page.goto(f'{BASE}/relatorios', wait_until='networkidle')
    expect(page.get_by_text('Filtros operacionais')).to_be_visible()
    page.get_by_label('Tipo').select_option('Agenda')
    expect(page.get_by_text('Nenhum registro no filtro')).to_be_visible()
    assert page.get_by_role('button', name='Exportar CSV').is_disabled(), 'CSV deveria estar desabilitado sem registros'


def test_profile_edit(page):
    page.goto(f'{BASE}/perfil', wait_until='networkidle')
    page.get_by_role('button', name='Editar').click()
    expect(page.get_by_label('Nome *')).to_have_value('Marcos Paulo')
    expect(page.get_by_label('E-mail *')).to_have_value('usuario@movvant.app')
    page.get_by_label('Nome *').fill('Marcos E2E')
    page.get_by_role('button', name='Adicionar nesta sessão').click()
    page.get_by_role('button', name='Concluir').click()
    expect(page.locator('.profile-summary h2')).to_have_text('Marcos E2E')
    expect(page.get_by_label('Função')).to_have_value('Administrador')


def fleet_notification_count(page):
    return page.locator('.notification-row').filter(has=page.locator('.tag', has_text='Frota')).count()


def test_settings_filter_notifications(page):
    page.goto(f'{BASE}/configuracoes', wait_until='networkidle')
    fleet_row=page.locator('.setting-row').filter(has_text='Frota e manutenção')
    toggle=fleet_row.get_by_role('button', name='Habilitada')
    expect(toggle).to_have_attribute('aria-pressed','true')
    toggle.click()
    expect(fleet_row.get_by_role('button', name='Desabilitada')).to_have_attribute('aria-pressed','false')
    page.get_by_role('link', name='Notificações').first.click()
    expect(page.locator('h1')).to_contain_text('Notificações')
    assert fleet_notification_count(page) == 0, 'Frota deveria estar filtrada nas notificações'
    page.get_by_role('link', name='Configurações').first.click()
    page.get_by_role('button', name='Restaurar padrões').click()
    page.get_by_role('link', name='Notificações').first.click()
    assert fleet_notification_count(page) > 0, 'Frota deveria retornar após restaurar padrões'


def test_navigation(page):
    page.goto(f'{BASE}/dashboard', wait_until='networkidle')
    page.get_by_role('link', name='Agenda').first.click()
    expect(page.locator('h1')).to_contain_text('Agenda')
    page.get_by_role('link', name='Relatórios').first.click()
    expect(page.locator('h1')).to_contain_text('Relatórios')


def run_suite(browser, viewport):
    page=browser.new_page(viewport=viewport)
    console_errors=[]
    page.on('console', lambda msg: console_errors.append(msg.text) if msg.type=='error' else None)
    for slug,title in ROUTES.items():
        assert_layout(page,slug,title)
    test_navigation(page)
    test_modal_keyboard(page)
    test_agenda_flow_and_route_draft(page)
    test_reports_filter(page)
    test_profile_edit(page)
    test_settings_filter_notifications(page)
    meaningful=[e for e in console_errors if 'favicon' not in e.lower()]
    assert not meaningful, 'Erros no console: '+ ' | '.join(meaningful[:8])
    page.close()

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    run_suite(browser, {'width':1440,'height':1000})
    run_suite(browser, {'width':390,'height':844})
    browser.close()
print('Movvant V2 browser E2E passed: 15 routes, desktop/mobile, navigation, modal keyboard, agenda-to-route draft, reports, profile and notification preferences.')
