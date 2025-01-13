"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { database, auth } from "@/utils/firebase/firebaseService";
import { ref, onValue, runTransaction } from "firebase/database";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/Loading";

export default function CategoriaVotacao() {
	const [categoria, setCategoria] = useState<any>(null);
	const [votosUsuario, setVotosUsuario] = useState<Record<string, string>>({});
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [votacaoAtiva, setVotacaoAtiva] = useState<boolean>(true);
	const router = useRouter();
	const params = useParams();
	const categoriaId = params?.id;

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (!user) {
				router.push("/login");
			} else {
				setUser(user);
				carregarVotos(user.uid);
			}
		});

		return () => unsubscribe();
	}, [router]);

	useEffect(() => {
		if (!categoriaId) {
			console.log("ID da categoria não encontrado nos parâmetros da URL.");
			return;
		}

		const categoriaRef = ref(database, `categorias/${categoriaId}`);
		onValue(
			categoriaRef,
			(snapshot) => {
				const data = snapshot.val();
				setCategoria(data);
				setLoading(false);
			},
			(error) => {
				console.error("Erro ao carregar dados da categoria:", error);
				setLoading(false);
			},
		);

		const votacaoRef = ref(database, "votacaoAtiva");
		onValue(
			votacaoRef,
			(snapshot) => {
				setVotacaoAtiva(snapshot.val());
			},
			(error) => {
				console.error("Erro ao verificar status da votação:", error);
			},
		);
	}, [categoriaId]);

	const carregarVotos = (userId: string) => {
		const votosRef = ref(database, `usuarios/${userId}/votos`);
		onValue(
			votosRef,
			(snapshot) => {
				const data = snapshot.val() || {};
				setVotosUsuario(data);
			},
			(error) => {
				console.error("Erro ao carregar votos do usuário:", error);
			},
		);
	};

	const votar = async (indicadoId: string) => {
		if (!user || !votacaoAtiva) {
			toast.error("A votação está encerrada ou você não está autenticado.");
			return;
		}

		if (votosUsuario[categoriaId]) {
			toast.error("Você já votou nesta categoria!");
			return;
		}

		console.log("Registrando voto para o indicado:", indicadoId);
		const votosRef = ref(
			database,
			`categorias/${categoriaId}/indicados/${indicadoId}/votos`,
		);
		const userVoteRef = ref(
			database,
			`usuarios/${user.uid}/votos/${categoriaId}`,
		);

		try {
			await runTransaction(votosRef, (currentVotos) => {
				console.log("Votos atuais:", currentVotos);
				return (currentVotos || 0) + 1;
			});

			await runTransaction(userVoteRef, () => indicadoId);
			toast.success("Voto registrado com sucesso!");
		} catch (error) {
			toast.error("Erro ao registrar o voto. Tente novamente!");
		}
	};

	const encontrarVencedor = () => {
		if (!categoria || !categoria.indicados) return null;
		return Object.entries(categoria.indicados).reduce(
			(vencedor, [id, indicado]: any) => {
				if (!vencedor || (indicado.votos || 0) > vencedor.votos) {
					return { id, ...indicado };
				}
				return vencedor;
			},
			null,
		);
	};

	const vencedor = encontrarVencedor();

	if (loading) {
		return <Loading />;
	}

	if (!categoria) {
		return <p>Categoria não encontrada!</p>;
	}

	if (!categoria.indicados || Object.keys(categoria.indicados).length === 0) {
		return <p>Nenhum indicado encontrado para esta categoria!</p>;
	}

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">{categoria.nome}</h1>
			{!votacaoAtiva && vencedor && (
				<div className="mb-6">
					<h2 className="text-xl font-semibold text-green-600">
						Vencedor: {vencedor.nome} 🎉
					</h2>
					<p className="text-gray-600">Total de votos: {vencedor.votos}</p>
				</div>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{Object.entries(categoria.indicados || {}).map(
					([id, indicado]: any) => (
						<Card
							key={id}
							className={`hover:shadow-lg ${
								!votacaoAtiva && vencedor?.id === id
									? "border-2 border-green-600"
									: ""
							}`}
						>
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									{indicado.nome}
								</CardTitle>
							</CardHeader>
							<CardContent>
								{indicado.descricao && (
									<p className="text-gray-600">{indicado.descricao}</p>
								)}
								{!votacaoAtiva && (
									<p className="text-gray-600">Votos: {indicado.votos || 0}</p>
								)}
							</CardContent>
							<CardFooter className="flex justify-end">
								<Button
									disabled={!votacaoAtiva || !!votosUsuario[categoriaId]}
									variant={
										votosUsuario[categoriaId] === id ? "secondary" : "default"
									}
									onClick={() => votar(id)}
								>
									{votosUsuario[categoriaId] === id ? "Votado ✅" : "Votar"}
								</Button>
							</CardFooter>
						</Card>
					),
				)}
			</div>
		</div>
	);
}
