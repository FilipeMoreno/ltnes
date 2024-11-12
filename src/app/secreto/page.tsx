"use client";

import Head from "next/head";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import Snowfall from "@/components/snowfall";
import ChristmasPlaylist from "@/components/ChristmasPlaylist";

const targetDate = new Date("2024-12-15T16:00:00-03:00");

export default function AmigoSecreto() {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [description, setDescription] = useState("");

	const calculateTimeLeft = () => {
		const now = new Date();
		const timeDiff = targetDate.getTime() - now.getTime();

		const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
		const seconds = Math.floor((timeDiff / 1000) % 60);

		setTimeLeft({ days, hours, minutes, seconds });

		if (days < 0) {
			setDescription(
				"Amigo Secreto - 15 de dezembro de 2024 | O evento já aconteceu!",
			);
		} else if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
			setDescription("Amigo Secreto - 15 de dezembro de 2024 | É HOJE!!!");
		} else if (days === 1) {
			setDescription("Amigo Secreto - 15 de dezembro de 2024 | É amanhã!");
		} else {
			setDescription(
				`Amigo Secreto - 15 de dezembro de 2024 | Faltam ${days} dias!`,
			);
		}
	};

	useEffect(() => {
		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<>
			<Head>
				<title>Confra LTNES 2024</title>
				<meta name="description" content={description} />
				<meta property="og:title" content="Confra LTNES 2024" />
				<meta property="og:description" content={description} />
				<meta
					property="og:image"
					content="https://ltnes.com.br/LTNES%20Natal.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://ltnes.com.br/confra" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Confra LTNES 2024" />
				<meta name="twitter:description" content={description} />
				<meta
					name="twitter:image"
					content="https://ltnes.com.br/LTNES%20Natal.png"
				/>
			</Head>
			<Snowfall />
			<ChristmasPlaylist />
			<div className="flex flex-col items-center justify-center h-screen ">
				<Image src="/logo-natal.png" width={200} height={200} alt="LTNES" />
				<h1 className="text-4xl font-bold mb-4 text-center">
					Confraternização 2024
				</h1>
				<p className="text-2xl mb-6">
					{timeLeft.days < 0
						? "O evento já aconteceu!"
						: `Faltam ${timeLeft.days} dias, ${timeLeft.hours} horas, ${timeLeft.minutes} minutos e ${timeLeft.seconds} segundos para o Amigo Secreto!`}
				</p>
			</div>
		</>
	);
}
