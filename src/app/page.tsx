"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	googleLogin,
	login,
	logout,
	onAuthChanged,
} from "@/utils/firebase/authService";
import { User, sendEmailVerification } from "firebase/auth";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa";
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

	const [user, setUser] = useState<User | null>();
	const [loading, setLoading] = useState(false);

	async function handleRegister(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const emailInput = form.querySelector("#email") as HTMLInputElement;
		const passInput = form.querySelector("#pass") as HTMLInputElement;

		login(emailInput.value, passInput.value)
			.then((user) => {
				console.log(user);
			})
			.catch((err) =>
				alert(`Ocorreu um erro ao tentar registrar, tente novamente. ${err}`),
			);
	}

	async function handleLogin(event: FormEvent<HTMLFormElement>) {
		setLoading(true);
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const emailInput = form.querySelector("#email") as HTMLInputElement;
		const passInput = form.querySelector("#pass") as HTMLInputElement;
		login(emailInput.value, passInput.value)
			.then((user) => {
				console.log(user);
				if (!user.user.emailVerified) {
					alert("Verifique seu email para continuar");
					sendEmailVerification(user.user, {
						url: "http://localhost:3000/",
					});
				}
			})
			.catch((err) => {
				alert(`Ocorreu um erro ao tentar logar, tente novamente. ${err}`);
				setLoading(false);
			});
	}

	useEffect(() => {
		function unsubscribe() {
			return onAuthChanged((user) => {
				if (user) {
					setUser(user);
				} else {
					setUser(null);
				}
			});
		}

		return unsubscribe();
	}, []);

	return (
		<main
			onSubmit={handleLogin}
			className="w-full h-full flex lg:flex-row flex-col items-center justify-center my-24"
		>
			<div className="flex flex-col items-center justify-center">
				<Image
					className="relative"
					src="/logo.png"
					alt="Ltnes Logo"
					width={400}
					height={400}
					priority
				/>
				<h1 className="text-4xl font-fingerpaint" ref={el}></h1>
			</div>

			<Card className="max-w-sm lg:max-w-lg">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Seja um dos primeiros a experimentar o LTNES!
					</CardTitle>
					<CardDescription>
						Garanta sua vaga na lista de espera e receba notificações exclusivas
						sobre novidades!
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button onClick={googleLogin} className="w-full">
						<FaGoogle className="mr-4" />
						Entrar com Google
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
