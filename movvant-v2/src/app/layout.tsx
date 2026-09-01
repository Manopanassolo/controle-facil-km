import type { Metadata } from 'next';
import './globals.css';
import './modules.css';
import './module-extra.css';
import './operations.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Movvant V2',
  description: 'Inteligência comercial em campo'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
