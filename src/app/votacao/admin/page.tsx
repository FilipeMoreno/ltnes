"use client";

import { useEffect, useState } from "react";
import { database, auth } from "@/utils/firebase/firebaseService";
import { ref, update, onValue, push, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Loading from "@/components/Loading";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function AdminPanel() {
	const [votacaoAtiva, setVotacaoAtiva] = useState<boolean>(true);
	const [categorias, setCategorias] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [novaCategoria, setNovaCategoria] = useState<string>("");
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);

	const router = useRouter();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (!user) router.push("/login");
		});

		return () => unsubscribe();
	}, [router]);

	useEffect(() => {
		const categoriasRef = ref(database, "categorias");
		onValue(categoriasRef, (snapshot) => {
			const data = snapshot.val();
			const parsed = data
				? Object.entries(data).map(([id, value]) => ({ id, ...value }))
				: [];
			setCategorias(parsed);
			setLoading(false);
		});
	}, []);

	const toggleVotacao = async (ativa: boolean) => {
		try {
			await update(ref(database, "/"), { votacaoAtiva: ativa });
			setVotacaoAtiva(ativa);
			toast.success(`Votação ${ativa ? "ativada" : "finalizada"} com sucesso!`);
		} catch (error) {
			toast.error("Erro ao atualizar o estado da votação.");
		}
	};

	const handleNovaCategoria = () => {
		if (!novaCategoria.trim()) {
			toast.error("O nome da categoria não pode estar vazio.");
			return;
		}
		const categoriasRef = ref(database, "categorias");
		const novaCategoriaRef = push(categoriasRef);
		set(novaCategoriaRef, { nome: novaCategoria, indicados: {} })
			.then(() => {
				toast.success("Categoria adicionada com sucesso!");
				setDialogOpen(false);
				setNovaCategoria("");
			})
			.catch((error) => {
				toast.error("Erro ao adicionar categoria.");
				console.error(error);
			});
	};

	const resultados = categorias.map((categoria) => ({
		nome: categoria.nome,
		id: categoria.id,
		dados: categoria.indicados
			? Object.values(categoria.indicados).map((indicado: any) => ({
					nome: indicado.nome,
					votos: indicado.votos || 0,
				}))
			: [],
	}));

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-4">Painel de Administração</h1>

			<div className="mb-6 flex items-center gap-4">
				<Switch
					checked={votacaoAtiva}
					onCheckedChange={(ativa) => toggleVotacao(ativa)}
				/>
				<span>{votacaoAtiva ? "Votação Ativa" : "Votação Finalizada"}</span>
			</div>

			<div className="mb-6 flex justify-end">
				<Button onClick={() => setDialogOpen(true)}>
					Incluir Nova Categoria
				</Button>
			</div>

			{loading ? (
				<Loading />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{resultados.map((categoria, index) => (
						<Card key={index} className="shadow-md">
							<CardHeader>
								<CardTitle className="text-sm font-medium">
									{categoria.nome}
								</CardTitle>
								<CardDescription className="text-xs">
									Resultados da Votação
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={{
										votos: { label: "Votos", color: "hsl(var(--chart-1))" },
									}}
								>
									<BarChart
										accessibilityLayer
										data={categoria.dados.map((indicado) => ({
											nome: indicado.nome,
											votos: indicado.votos,
										}))}
										height={150}
									>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="nome"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											tickFormatter={(value) => value.slice(0, 5)}
										/>
										<ChartTooltip
											cursor={false}
											content={<ChartTooltipContent indicator="dashed" />}
										/>
										<Bar
											dataKey="votos"
											fill="hsl(var(--chart-1))"
											radius={4}
										/>
									</BarChart>
								</ChartContainer>
							</CardContent>
							<CardFooter className="flex-col items-start gap-1 text-xs">
								<div className="font-medium">
									Total de votos:{" "}
									{categoria.dados.reduce((acc, dado) => acc + dado.votos, 0)}
								</div>
								<Button
									variant="outline"
									className="mt-2"
									onClick={() => router.push(`/votacao/admin/${categoria.id}`)}
								>
									Ver Detalhes
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Incluir Nova Categoria</DialogTitle>
					</DialogHeader>
					<Input
						placeholder="Nome da nova categoria"
						value={novaCategoria}
						onChange={(e) => setNovaCategoria(e.target.value)}
					/>
					<div className="flex justify-end gap-2 mt-4">
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleNovaCategoria}>Salvar</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
