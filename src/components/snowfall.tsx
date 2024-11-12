"use client";
import { useEffect } from "react";

export default function Snowfall() {
	useEffect(() => {
		const canvas = document.createElement("canvas");
		canvas.id = "snowfall-canvas";
		canvas.style.position = "fixed";
		canvas.style.top = "0";
		canvas.style.left = "0";
		canvas.style.pointerEvents = "none";
		canvas.style.zIndex = "9999";

		document.body.appendChild(canvas);

		const ctx = canvas.getContext("2d")!;
		const snowflakes: {
			x: number;
			y: number;
			radius: number;
			speed: number;
		}[] = [];

		let width = window.innerWidth;
		let height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;

		function createSnowflakes() {
			for (let i = 0; i < 100; i++) {
				snowflakes.push({
					x: Math.random() * width,
					y: Math.random() * height,
					radius: Math.random() * 3 + 1,
					speed: Math.random() * 1 + 0.5,
				});
			}
		}

		function drawSnowflakes() {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = "white";
			ctx.beginPath();
			for (const flake of snowflakes) {
				ctx.moveTo(flake.x, flake.y);
				ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
			}
			ctx.fill();
			updateSnowflakes();
			requestAnimationFrame(drawSnowflakes);
		}

		function updateSnowflakes() {
			for (const flake of snowflakes) {
				flake.y += flake.speed;
				if (flake.y > height) {
					flake.y = -flake.radius;
					flake.x = Math.random() * width;
				}
			}
		}

		window.addEventListener("resize", () => {
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = width;
			canvas.height = height;
		});

		createSnowflakes();
		drawSnowflakes();

		return () => {
			document.body.removeChild(canvas);
		};
	}, []);

	return null;
}
