import type { Metadata, Viewport } from "next";
import "./bautizo.css";

export const metadata: Metadata = {
  title: "Bautizo · Martín Mexía Moreno · 24.10.2026",
  description:
    "Tienen el honor de invitarte al bautizo de Martín — sábado 24 de octubre de 2026, Atizapán.",
  openGraph: {
    title: "Bautizo · Martín Mexía Moreno",
    description: "24 · 10 · 2026 · Atizapán, Estado de México",
    locale: "es_MX",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function BautizoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=Tenor+Sans&family=Jost:wght@300;400;500&display=swap"
      />
      <div className="bautizo-root">{children}</div>
    </>
  );
}
