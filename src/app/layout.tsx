import type { Metadata } from "next";
import { Inter, Finger_Paint } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });
const fingerpaint = Finger_Paint({ subsets: ["latin"], weight: "400" })


export const metadata: Metadata = {
  title: "LTNES",
  description: "Site do LTNES",
  openGraph: {
    title: "the ltnes",
    description: "um site incrível para pessoas incríveis",
    type: "website",
    url: "https://ltnes.com.br",
    images: ['/logo.svg']
  }
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
