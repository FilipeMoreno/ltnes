"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useSpring, animated } from "@react-spring/web";
import Image from "next/image";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import html2canvas from "html2canvas";
import { useWindowSize } from "react-use";

import birthdays from "./data/birthdays.json";
import messages from "./data/messages.json";

const BirthdayCard = () => {
	const [showConfetti, setShowConfetti] = useState(false);
	const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
	const [birthday, setBirthday] = useState(birthdays[0]);
	const [message, setMessage] = useState("");
	const [shareUrl, setShareUrl] = useState("");

	useEffect(() => {
		setShowConfetti(true);
		setMessage(messages[Math.floor(Math.random() * messages.length)]);
		const timer = setTimeout(() => setShowConfetti(false), 3000);
		return () => clearTimeout(timer);
	}, []);

	const handleMouseMove = (e: React.MouseEvent) => {
		setCursorPos({ x: e.clientX, y: e.clientY });
	};

	const shareMessage = `🎉 Parabéns, ${birthday.name}! 🎉\n\n${message}\n\nCelebre com a gente! 🎂`;

	const springProps = useSpring({
		from: { scale: 0.8, opacity: 0 },
		to: { scale: 1, opacity: 1 },
		config: { tension: 300, friction: 10 },
	});

	return (
		<div
			className="relative h-screen w-full bg-gradient-to-br from-orange-300 via-orange-300 to-orange-400 overflow-hidden flex items-center justify-center"
			onMouseMove={handleMouseMove}
		>
			<Confetti width={1920} height={1000} />
			<div id="birthday-card" className="relative">
				<animated.div style={springProps} className="relative z-10">
					<div className="bg-white p-8 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
						<Image
							src={birthday.imageUrl}
							alt={birthday.name}
							width={200}
							height={200}
							className="rounded-full mx-auto mb-4"
						/>
						<h1 className="text-4xl font-bold text-center mb-4 text-orange-600">
							Parabéns, {birthday.name}!
						</h1>
						<p className="text-xl text-center text-gray-700">{message}</p>
					</div>
				</animated.div>
			</div>
			<div className="absolute bottom-4 right-4">
				<WhatsappShareButton url="https://www.ltnes/bday" title={shareMessage}>
					<WhatsappIcon size={32} round />
				</WhatsappShareButton>
			</div>
		</div>
	);
};

export default BirthdayCard;
