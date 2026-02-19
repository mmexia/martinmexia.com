import type { Metadata } from 'next';
import './botvault.css';

export const metadata: Metadata = {
  title: 'BotVault',
  description: 'Secure credential vault for AI bots',
};

export default function BotVaultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
