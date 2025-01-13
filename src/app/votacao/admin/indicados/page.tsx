"use client";

import { useState } from "react";
import { database } from "@/utils/firebase/firebaseService";
import { ref, push } from "firebase/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdicionarIndicado() {
	const [nome, setNome] = useState("");
	const [descricao, setDescricao] = useState("");
	const [fotoUrl, setFotoUrl] = useState("");

	const adicionarIndicado = async () => {
		if (!nome || !descricao || !fotoUrl) {
			toast.error("Todos os campos são obrigatórios!");
			return;
		}

		try {
			const indicadosRef = ref(database, "indicados");
			await push(indicadosRef, { nome, descricao, fotoUrl });
			toast.success("Indicado cadastrado com sucesso!");
			setNome("");
			setDescricao("");
			setFotoUrl("");
		} catch (error) {
			toast.error("Erro ao cadastrar indicado.");
		}
	};

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Adicionar Indicado</h2>
			<Input
				placeholder="Nome"
				value={nome}
				onChange={(e) => setNome(e.target.value)}
			/>
			<Input
				placeholder="Descrição"
				value={descricao}
				onChange={(e) => setDescricao(e.target.value)}
			/>
			<Input
				placeholder="URL da Foto"
				value={fotoUrl}
				onChange={(e) => setFotoUrl(e.target.value)}
			/>
			<Button onClick={adicionarIndicado}>Salvar Indicado</Button>
		</div>
	);
}
