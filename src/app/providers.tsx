"use client";

import CookiesConsent from "@/components/CookiesConsent";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			storageKey="theme"
			enableSystem
			disableTransitionOnChange
		>
			<NextTopLoader color="#af3c41" />
			{children}
			<CookiesConsent />
			<Toaster richColors closeButton />
		</ThemeProvider>
	);
}
