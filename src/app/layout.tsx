import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'ಕರ್ನಾಟಕ ನ್ಯೂಸ್ ಪಲ್ಸ್',
  description: 'ಕರ್ನಾಟಕಕ್ಕಾಗಿ ನೈಜ-ಸಮಯದ, ಜಿಲ್ಲಾವಾರು ಸುದ್ದಿ ನವೀಕರಣಗಳು',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
