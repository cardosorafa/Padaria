import express from "express";
import rotasProdutos from "./routes/produtos.js";

const app = express();
const PORT = 4000;
app.use(express.json());
//removendo o x-powered-by por segurança
app.disable("x-powered-by");
//Rota de conteúdo público
app.use("/", express.static("public"));
//Configurando o favicon
app.use("/favicon.ico", express.static("public/images/icone.jpg"));

app.get("/api", (req, res) => {
  res.status(200).json({ message: "API 🚀⭐ ", version: "1.0.0" });
});

/* Rotas da aplicação */
app.use("/api/produtos", rotasProdutos);
//Tratando rotas inexistentes no backend
app.use((req, res, next) => {
  const rotaInvalida = req.originalUrl;
  res.status(404).json({
    message: `Rota ${rotaInvalida} não encontrada`,
    error: "Invalid Route",
  });
});

app.listen(PORT, function () {
  console.log(`Servidor Web rodando na porta ${PORT}`);
});
