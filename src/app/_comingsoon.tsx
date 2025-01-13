"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import Typed from "typed.js";

export default function ComingSoonComponent() {
	const [themeType, setThemeType] = useState("default");

	const el = useRef(null);

	const logo: { [key: string]: string } = {
		natal: "/logo-natal.png",
		halloween: "/logo-halloween.png",
		default: "/logo.png",
	};

	useEffect(() => {
		const theme = localStorage.getItem("data-comemorativa");
		if (theme) {
			setThemeType(theme);
		}
	}, []);

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
		<div className="flex flex-col items-center justify-center">
			<Image
				src={logo[themeType] || logo.default}
				alt="Ltnes Logo"
				width={400}
				height={400}
				priority
			/>
			<div
				className="text-4xl font-fingerpaint"
				ref={el}
				style={{ height: "50px" }}
			/>
		</div>
	);
}
