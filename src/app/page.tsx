"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
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
import { FormEvent, useEffect, useState } from "react";
import { FaGoogle, FaMoon, FaSignOutAlt, FaSun } from "react-icons/fa";
import ComingSoonComponent from "./_comingsoon";

export default function Home() {
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

	const [theme, setTheme] = useState("dark");

	useEffect(() => {
		localStorage.setItem("theme", theme);
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	function toggleTheme() {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	}

	return (
		<div className={`w-full h-full ${theme}`}>
			<Button
				onClick={toggleTheme}
				className="fixed top-4 right-4 z-50 p-2 rounded-full shadow-md bg-zinc-400 hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc-400"
			>
				{theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
			</Button>
			{user && (
				<main
					onSubmit={handleLogin}
					className="w-full h-full flex lg:flex-row flex-col items-center justify-center my-4"
				>
					<ComingSoonComponent />
					<Card className="max-w-sm lg:max-w-lg lg:ml-8 mt-8 lg:mt-0 mx-2">
						<CardHeader>
							<CardTitle className="text-2xl font-bold">
								Parabéns, {user.displayName?.split(" ")[0]}! Você está na lista
								de espera! 🥳
							</CardTitle>
							<CardDescription className="flex flex-col justify-center">
								Seu nome já está na nossa lista de espera. Você deve receber o
								seu convite por e-mail em breve. Obrigado por se juntar a nós!
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<Button onClick={logout} className="w-full">
								<FaSignOutAlt className="mr-4" />
								Sair
							</Button>
						</CardFooter>
					</Card>
				</main>
			)}
			{!user && (
				<main
					onSubmit={handleLogin}
					className="w-full h-full flex lg:flex-row flex-col items-center justify-center my-4"
				>
					<ComingSoonComponent />
					<Card className="max-w-sm lg:max-w-lg lg:ml-8 mt-8 lg:mt-0 mx-2">
						<CardHeader>
							<CardTitle className="text-2xl font-bold">
								Seja um dos primeiros a experimentar o LTNES!
							</CardTitle>
							<CardDescription>
								Garanta sua vaga na lista de espera e receba notificações
								exclusivas sobre novidades!
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
			)}
		</div>
	);
}
