import type { Metadata } from "next";
import { Inter, Finger_Paint } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });
const fingerpaint = Finger_Paint({ subsets: ["latin"], weight: "400" })


export const metadata: Metadata = {
  title: "LTNES",
  description: "Site do LTNES",
  openGraph: {
    title: "The LTNES",
    description: "Um APP incrível para pessoas incríveis",
    type: "website",
    url: "https://ltnes.com.br",
    images: ['/opengraph-image.jpg'],
    locale: 'pt-BR'
  },
  twitter: {
    card: "summary_large_image",
    images: ['/opengraph-image.jpg'],
    description: "Um APP incrível para pessoas incríveis",
    title: "The LTNES"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={fingerpaint.className}>{children}</body>
    </html>
  );
}
