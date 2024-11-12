"use client";
import { useEffect, useState } from "react";
import AmigoSecretoHead from "./AmigoSecretoHead";

export default function AmigoSecreto() {
	const targetDate = new Date("2024-12-15T16:00:00-03:00");
	const [timeLeft, setTimeLeft] = useState("");

	function calculateTimeLeft() {
		const now = new Date();
		const difference = targetDate.getTime() - now.getTime();

		if (difference <= 0) {
			setTimeLeft("O amigo secreto já começou!");
			return;
		}

		const days = Math.floor(difference / (1000 * 60 * 60 * 24));
		const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((difference / (1000 * 60)) % 60);
		const seconds = Math.floor((difference / 1000) % 60);

		setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
	}

	useEffect(() => {
		const timer = setInterval(calculateTimeLeft, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<>
			<AmigoSecretoHead />
			<div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
				<h1 className="text-4xl font-bold mb-4">Amigo Secreto</h1>
				<p className="text-2xl mb-2">Faltam:</p>
				<p className="text-3xl font-mono">{timeLeft}</p>
			</div>
		</>
	);
}
