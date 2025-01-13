import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Método não permitido" });
	}

	const uploadDir = path.join(process.cwd(), "public", "uploads");

	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	const form = new IncomingForm();
	form.uploadDir = uploadDir;
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: "Erro ao processar o arquivo" });
		}

		const filePath = path.relative(process.cwd(), files.file.filepath);
		const publicPath = `/${filePath.split("public/")[1]}`;
		res.status(200).json({ url: publicPath });
	});
}
