"use client";
import Image from "next/image";

export default function Loading() {
	return (
		<div className="flex items-center justify-center">
			<div className="text-center">
				<div className="relative h-32 w-32 mx-auto">
					<Image
						src="/logo-natal.png"
						alt="Logo"
						className="absolute inset-0 animate-spin-normal"
						width={300}
						height={300}
					/>
				</div>
				<p className="text-lg font-medium animate-pulse">Carregando...</p>
			</div>
		</div>
	);
}
