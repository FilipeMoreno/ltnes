"use client";

import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { Button } from "./ui/button";

export default function ChristmasPlaylist() {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const playlist = [
		"/musicas/natal-1.mp3",
		"/musicas/natal-2.mp3",
		"/musicas/natal-3.mp3",
		"/musicas/natal-4.mp3",
	];

	const [shuffledPlaylist, setShuffledPlaylist] = useState<string[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	function shuffleArray(array: string[]) {
		return array.sort(() => Math.random() - 0.5);
	}

	useEffect(() => {
		const shuffled = shuffleArray(playlist);
		setShuffledPlaylist(shuffled);
	}, []);

	useEffect(() => {
		const audio = audioRef.current;
		if (audio && shuffledPlaylist.length > 0) {
			audio.src = shuffledPlaylist[currentIndex];
			if (isPlaying) {
				audio.play().catch((err) => {
					console.log("Erro ao tentar reproduzir a música:", err);
				});
			} else {
				audio.pause();
			}
		}
	}, [currentIndex, isPlaying, shuffledPlaylist]);

	function handleNextSong() {
		setCurrentIndex((prevIndex) =>
			prevIndex + 1 >= shuffledPlaylist.length ? 0 : prevIndex + 1,
		);
	}

	function togglePlayPause() {
		setIsPlaying((prev) => !prev);
	}

	return (
		<div>
			<audio
				ref={audioRef}
				onEnded={handleNextSong}
				preload="auto"
				loop={false}
			/>

			<Button
				onClick={togglePlayPause}
				className="fixed top-4 right-16 z-50 p-2 rounded-full shadow-md bg-zinc-400 hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc-400"
			>
				{isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
			</Button>
		</div>
	);
}
