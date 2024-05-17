"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function Home() {
	const el = useRef(null);
	useEffect(() => {
		const typed = new Typed(el.current, {
			strings: ["Em Breve", "Coming Soon", "À Venir", "Prossimamente"],
			typeSpeed: 50,
			loop: true,
			backSpeed: 50,
			cursorChar: "",
		});
		return () => {
			typed.destroy();
		};
	}, []);

	return (
		<main className="flex h-full w-full flex-col items-center justify-center">
			<Image
				className="relative"
				src="/logo.png"
				alt="Ltnes Logo"
				width={600}
				height={400}
				priority
			/>

			{/* biome-ignore lint/a11y/useHeadingContent: <explanation> */}
			<h1 className="text-4xl" ref={el} />
		</main>
	);
}
