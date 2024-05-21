import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { RxCookie } from "react-icons/rx";

export default function CookiesConsent() {
	const [showConsent, setShowConsent] = useState(true);

	useEffect(() => {
		// setShowConsent(hasCookie('localConsent'))
		setShowConsent(localStorage.getItem("cookieConsent") === "true");
	}, []);

	const acceptCookie = () => {
		setShowConsent(true);
		localStorage.setItem("cookieConsent", "true");
		setCookie("cookieConsent", "true", {});
	};

	if (showConsent) {
		return null;
	}
	return (
		<div className="fixed inset-0 bg-zinc-950 bg-opacity-60">
			<div className="fixed bottom-0 left-0 right-0 flex items-center justify-between rounded-t-lg bg-secondary px-4 py-8">
				<div className="mx-2 flex flex-row items-center justify-between">
					<div className="flex flex-col justify-center">
						<span className="mx-4 flex flex-row items-center text-xl font-bold">
							<RxCookie className="mr-2 h-4 w-4" />
							Cookies
						</span>
						<span className="mx-4 text-base">
							Este site utiliza cookies para melhorar a experiência do usuário.
							Ao utilizar o nosso site você concorda com todos os cookies de
							acordo com a nossa Política de Cookies.
						</span>
					</div>
					<Button className="w-64" onClick={() => acceptCookie()}>
						Aceito
					</Button>
				</div>
			</div>
		</div>
	);
}
