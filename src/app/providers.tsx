"use client";

import CookiesConsent from "@/components/CookiesConsent";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, useEffect } from "react";

export default function Providers({ children }: { children: ReactNode }) {
	useEffect(() => {
		navigator.serviceWorker
			.register("/sw.js")
			.then((registration) => {
				// registration.pushManager.subscribe({
				// 	userVisibleOnly: true,
				// 	applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
				// });
				console.log(
					"Service Worker registration successful with scope: ",
					registration.scope,
				);
			})
			.catch((err) => console.log("Service Worker registration failed: ", err));

		if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					console.log("Notification permission granted.");
				}
			});
		}
	}, []);
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
