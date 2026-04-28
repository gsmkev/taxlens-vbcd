import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaxLens PY — Inteligencia Fiscal Local para Paraguay',
  description: 'Procesá facturas, generá tus libros de Marangatu y consultá la DNIT con IA que corre en tu dispositivo. Sin servidores. Sin costos. 100% privado.',
  keywords: ['Marangatu', 'DNIT', 'facturas Paraguay', 'IVA Paraguay', 'IRE', 'IRP-RSP', 'fiscal'],
  openGraph: {
    title: 'TaxLens PY',
    description: 'Mirá tus impuestos con claridad.',
    locale: 'es_PY',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
