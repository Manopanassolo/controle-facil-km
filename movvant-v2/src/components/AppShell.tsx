'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moduleGroups, modules } from '@/lib/modules';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname.split('/').filter(Boolean)[0] || 'dashboard';

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/dashboard" className="brand" aria-label="Movvant - início">
          <span className="brand-mark">M</span>
          <span className="brand-copy">
            <strong>MOVVANT</strong>
            <small>inteligência comercial em campo</small>
          </span>
        </Link>
        <div className="topbar-actions">
          <span className="environment-pill">V2 limpa</span>
          <Link href="/notificacoes" className="icon-action" aria-label="Notificações">●</Link>
          <Link href="/perfil" className="profile-chip">MP</Link>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Menu principal">
          <nav>
            {moduleGroups.map((group) => (
              <section className="menu-group" key={group}>
                <h2>{group}</h2>
                <div className="menu-items">
                  {modules.filter((item) => item.group === group).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className={active === item.slug ? 'menu-link active' : 'menu-link'}
                    >
                      <span className="menu-dot" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
