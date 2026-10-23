import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { CartNotificationToast } from '@/components/storefront/CartNotificationToast';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';

export const metadata: Metadata = {
  metadataBase: new URL('https://flamira.lk'),
  title: 'Flamira | Handmade Home Décor & Scented Gifts Ceylon',
  description:
    'Handmade pure soy wax candles, botanical wax sachets, pressed flower resin keepsakes & bespoke gift hampers in Sri Lanka. Cash on Delivery available island-wide across all 25 districts.',
  keywords: [
    'home decor Sri Lanka',
    'online gift shop Sri Lanka',
    'handmade gifts Sri Lanka',
    'personalized gifts Sri Lanka',
    'soy wax candles Colombo',
    'botanical wax sachet Sri Lanka',
    'cash on delivery gift shop Sri Lanka',
    'Flamira Ceylon',
  ],
  openGraph: {
    title: 'Flamira | Handmade Home Décor & Scented Gifts Ceylon',
    description:
      'Pure soy wax candles & bespoke gift hampers handcrafted in Sri Lanka. Cash on Delivery across all 25 districts.',
    images: ['/flamira-logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#281B13]">
        <StoreProvider>
          <CustomerAuthProvider>
            <Navbar />
            <CartDrawer />
            <CartNotificationToast />
            <FloatingWhatsApp />
            <main className="flex-1">{children}</main>
            <Footer />
          </CustomerAuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
