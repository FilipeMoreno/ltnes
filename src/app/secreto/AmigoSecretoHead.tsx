import Head from "next/head";

export default function AmigoSecretoHead() {
	const targetDate = new Date("2024-12-15T16:00:00-03:00");
	const now = new Date();
	const difference = targetDate.getTime() - now.getTime();
	const daysLeft = Math.max(Math.floor(difference / (1000 * 60 * 60 * 24)), 0);

	return (
		<Head>
			<title>Faltam {daysLeft} dias para o Amigo Secreto!</title>
			<meta
				name="description"
				content={`Faltam ${daysLeft} dias para o Amigo Secreto! Não perca!`}
			/>
			<meta
				property="og:title"
				content={`Faltam ${daysLeft} dias para o Amigo Secreto!`}
			/>
			<meta
				property="og:description"
				content="A contagem regressiva para o nosso Amigo Secreto já começou!"
			/>
			<meta property="og:image" content="/amigo-secreto-banner.png" />
			<meta property="og:type" content="website" />
			<meta property="og:url" content="https://seusite.com/amigo-secreto" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta
				name="twitter:title"
				content={`Faltam ${daysLeft} dias para o Amigo Secreto!`}
			/>
			<meta
				name="twitter:description"
				content="A contagem regressiva para o nosso Amigo Secreto já começou!"
			/>
			<meta name="twitter:image" content="/amigo-secreto-banner.png" />
		</Head>
	);
}
