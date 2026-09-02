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
import { PreferencesSessionProvider } from '@/components/PreferencesSessionProvider';
import { RouteDraftSessionProvider } from '@/components/RouteDraftSessionProvider';

export const metadata: Metadata = { title: 'Movvant V2', description: 'Inteligência comercial em campo' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><SessionActivityProvider><DriverSessionProvider><IncidentSessionProvider><PreferencesSessionProvider><RouteDraftSessionProvider><AppShell>{children}</AppShell></RouteDraftSessionProvider></PreferencesSessionProvider></IncidentSessionProvider></DriverSessionProvider></SessionActivityProvider></body></html>;
}
