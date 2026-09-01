import type { Metadata } from 'next';
import './globals.css';
import './modules.css';
import './module-extra.css';
import './operations.css';
import './polish.css';
import { AppShell } from '@/components/AppShell';
import { SessionActivityProvider } from '@/components/SessionActivityProvider';

export const metadata: Metadata = {
  title: 'Movvant V2',
  description: 'Inteligência comercial em campo'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionActivityProvider>
          <AppShell>{children}</AppShell>
        </SessionActivityProvider>
      </body>
    </html>
  );
}
