"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { database } from "@/utils/firebase/firebaseService";
import { ref, onValue, update, push, remove } from "firebase/database";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function CategoriaDetalhes() {
	const params = useParams();
	const categoriaId = params?.id;
	const router = useRouter();

	const [categoriaNome, setCategoriaNome] = useState("");
	const [indicados, setIndicados] = useState<any[]>([]);
	const [novoNomeCategoria, setNovoNomeCategoria] = useState("");
	const [novoIndicado, setNovoIndicado] = useState("");

	// Carrega os detalhes da categoria
	useEffect(() => {
		if (!categoriaId) return;

		const categoriaRef = ref(database, `categorias/${categoriaId}`);
		onValue(categoriaRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setCategoriaNome(data.nome || "");
				setNovoNomeCategoria(data.nome || ""); // Preenche o nome inicial no dialog
				const indicadosArray = data.indicados
					? Object.entries(data.indicados).map(([id, value]) => ({
							id,
							...value,
						}))
					: [];
				setIndicados(indicadosArray);
			}
		});
	}, [categoriaId]);

	// Atualiza o nome da categoria
	const salvarNomeCategoria = async () => {
		const categoriaRef = ref(database, `categorias/${categoriaId}`);
		try {
			await update(categoriaRef, { nome: novoNomeCategoria });
			toast.success("Nome da categoria atualizado com sucesso!");
		} catch {
			toast.error("Erro ao atualizar o nome da categoria.");
		}
	};

	// Adiciona um novo indicado
	const adicionarIndicado = async () => {
		if (!novoIndicado.trim()) return;

		const indicadosRef = ref(database, `categorias/${categoriaId}/indicados`);
		const novoRef = push(indicadosRef);

		try {
			await update(novoRef, { nome: novoIndicado, votos: 0 });
			setNovoIndicado("");
			toast.success("Indicado adicionado com sucesso!");
		} catch {
			toast.error("Erro ao adicionar indicado.");
		}
	};

	// Remove um indicado
	const removerIndicado = async (indicadoId: string) => {
		const indicadoRef = ref(
			database,
			`categorias/${categoriaId}/indicados/${indicadoId}`,
		);

		try {
			await remove(indicadoRef);
			toast.success("Indicado removido com sucesso!");
		} catch {
			toast.error("Erro ao remover indicado.");
		}
	};

	return (
		<div className="p-4">
			<Button variant="outline" onClick={() => router.back()}>
				← Voltar
			</Button>

			<div className="flex justify-between items-center mt-4 mb-6">
				<h1 className="text-3xl font-bold">{categoriaNome}</h1>

				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">Editar Nome</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar Nome da Categoria</DialogTitle>
						</DialogHeader>
						<Input
							value={novoNomeCategoria}
							onChange={(e) => setNovoNomeCategoria(e.target.value)}
							placeholder="Novo Nome da Categoria"
							className="mt-4"
						/>
						<div className="mt-4 flex justify-end">
							<Button onClick={salvarNomeCategoria}>Salvar</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>Indicados</CardTitle>

						{/* Dialog para adicionar novo indicado */}
						<Dialog>
							<DialogTrigger asChild>
								<Button>Adicionar Novo Indicado</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Adicionar Novo Indicado</DialogTitle>
								</DialogHeader>
								<Input
									value={novoIndicado}
									onChange={(e) => setNovoIndicado(e.target.value)}
									placeholder="Nome do Indicado"
									className="mt-4"
								/>
								<div className="mt-4 flex justify-end">
									<Button onClick={adicionarIndicado}>Adicionar</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>

				<CardContent>
					{indicados.length === 0 ? (
						<p>Nenhum indicado cadastrado.</p>
					) : (
						<div className="space-y-4">
							{indicados.map((indicado) => (
								<div
									key={indicado.id}
									className="flex justify-between items-center border-b pb-2"
								>
									<div>
										<p className="font-semibold">{indicado.nome}</p>
										<p>Total de votos: {indicado.votos}</p>
									</div>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => removerIndicado(indicado.id)}
									>
										Remover
									</Button>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
