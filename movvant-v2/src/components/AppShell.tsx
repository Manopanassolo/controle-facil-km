'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moduleGroups, modules } from '@/lib/modules';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname.split('/').filter(Boolean)[0] || 'dashboard';

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo-principal">Ir para o conteúdo</a>
      <header className="topbar">
        <Link href="/dashboard" className="brand" aria-label="Movvant - início" aria-current={active === 'dashboard' ? 'page' : undefined}>
          <span className="brand-symbol" aria-hidden="true">
            <span className="signal-bar bar-one" />
            <span className="signal-bar bar-two" />
            <span className="signal-bar bar-three" />
            <span className="pin-dot" />
          </span>
          <span className="brand-copy">
            <strong>MOVVANT</strong>
            <small>inteligência comercial em campo</small>
          </span>
        </Link>

        <nav className="desktop-groups" aria-label="Navegação principal">
          {moduleGroups.filter((group) => group !== 'Conta').map((group) => {
            const groupModules = modules.filter((item) => item.group === group);
            const groupActive = groupModules.some((item) => item.slug === active);
            return (
              <div className={groupActive ? 'nav-group active' : 'nav-group'} key={group}>
                <button type="button" className="nav-group-trigger">{group}</button>
                <div className="nav-dropdown">
                  {groupModules.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className={active === item.slug ? 'dropdown-link active' : 'dropdown-link'}
                      aria-current={active === item.slug ? 'page' : undefined}
                    >
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="topbar-actions">
          <span className="environment-pill">V2 visual</span>
          <Link href="/notificacoes" className="icon-action" aria-label="Notificações" aria-current={active === 'notificacoes' ? 'page' : undefined}>●</Link>
          <Link href="/perfil" className="profile-chip" aria-label="Perfil" aria-current={active === 'perfil' ? 'page' : undefined}>MP</Link>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Menu lateral">
          <div className="sidebar-title">Módulos</div>
          <nav aria-label="Módulos da aplicação">
            {moduleGroups.map((group) => (
              <section className="menu-group" key={group}>
                <h2>{group}</h2>
                <div className="menu-items">
                  {modules.filter((item) => item.group === group).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className={active === item.slug ? 'menu-link active' : 'menu-link'}
                      aria-current={active === item.slug ? 'page' : undefined}
                    >
                      <span className="menu-dot" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <main id="conteudo-principal" className="content-area" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
