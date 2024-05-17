import type { Metadata } from "next";
import { Finger_Paint, Inter } from "next/font/google";
import { ImageResponse } from "next/og";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });
const fingerpaint = Finger_Paint({ subsets: ["latin"], weight: "400" });

const teste = new ImageResponse(
	<div
		style={{
			fontSize: 48,
			background: "white",
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		LTNES
	</div>,
);

export const metadata: Metadata = {
	title: "LTNES",
	description: "Site do LTNES",
	openGraph: {
		title: "The LTNES",
		description: "Um APP incrível para pessoas incríveis",
		type: "website",
		url: "https://ltnes.com.br",
		images: "https://i.imgur.com/neVnuIN.png",
		locale: "pt-BR",
	},
	twitter: {
		card: "summary_large_image",
		images: "https://i.imgur.com/neVnuIN.png",
		description: "Um APP incrível para pessoas incríveis",
		title: "The LTNES",
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
