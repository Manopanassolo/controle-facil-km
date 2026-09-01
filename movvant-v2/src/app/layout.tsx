import type { Metadata } from 'next';
import './globals.css';
import './modules.css';
import './module-extra.css';
import './operations.css';
import './polish.css';
import './session-activity.css';
import { AppShell } from '@/components/AppShell';
import { SessionActivityProvider } from '@/components/SessionActivityProvider';
import { DriverSessionProvider } from '@/components/DriverSessionProvider';
import { IncidentSessionProvider } from '@/components/IncidentSessionProvider';

export const metadata: Metadata = { title: 'Movvant V2', description: 'Inteligência comercial em campo' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><SessionActivityProvider><DriverSessionProvider><IncidentSessionProvider><AppShell>{children}</AppShell></IncidentSessionProvider></DriverSessionProvider></SessionActivityProvider></body></html>;
}
