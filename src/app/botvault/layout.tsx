import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BotVault — Secure Credential Vault for Bots",
  description:
    "Store API keys, secrets, and tokens with envelope encryption. Manage bot access, automate OAuth flows, and audit every credential access. One API for all your bots.",
  openGraph: {
    title: "BotVault — Secure Credential Vault for Bots",
    description:
      "Store API keys, secrets, and tokens with envelope encryption. Manage bot access, automate OAuth flows, and audit every credential access.",
    url: "https://mybotvault.com",
    siteName: "BotVault",
    type: "website",
  },
};

export default function BotVaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ background: "#050505", color: "#f5f5f5", minHeight: "100vh" }}
    >
      {children}
    </div>
  );
}
