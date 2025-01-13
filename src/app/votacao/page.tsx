"use client";
import { useEffect, useState } from "react";
import { database, auth } from "@/utils/firebase/firebaseService";
import { ref, onValue } from "firebase/database";
import { useRouter } from "next/navigation";
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

export default function Votacao() {
	const [categorias, setCategorias] = useState<any[]>([]);
	const [user, setUser] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		// Verifica se o usuário está logado
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (!user) {
				router.push("/login");
			} else {
				setUser(user);
			}
		});

		return () => unsubscribe();
	}, [router]);

	useEffect(() => {
		// Carrega as categorias do Firebase
		const categoriasRef = ref(database, "categorias");
		onValue(categoriasRef, (snapshot) => {
			const data = snapshot.val();
			const parsed = data
				? Object.entries(data).map(([id, value]) => ({ id, ...value }))
				: [];
			setCategorias(parsed);
		});
	}, []);

	const handleVotarClick = (categoriaId: string) => {
		router.push(`/votacao/${categoriaId}`);
	};

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">Categorias de Votação</h1>
			{categorias.length === 0 && <Loading />}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{categorias.map((categoria) => (
					<Card key={categoria.id} className="hover:shadow-lg">
						<CardHeader>
							<CardTitle className="text-lg font-semibold">
								{categoria.nome}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600">
								Clique em "Votar" para escolher seu indicado favorito nesta
								categoria.
							</p>
						</CardContent>
						<CardFooter className="flex justify-end">
							<Button onClick={() => handleVotarClick(categoria.id)}>
								Votar
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
