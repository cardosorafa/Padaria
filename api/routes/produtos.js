import express from "express";
/* Importar a biblioteca do MongoDB */
import { MongoClient } from "mongodb";
/* Importar o express-validator */
import { check, validationResult } from "express-validator";
import swal from 'sweetalert2';



/* Definido as variáveis de conexão */
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "padaria";
const router = express.Router();
// Função para conectar no banco de dados
async function connectToDatabase() {
  try {
    await client.connect();
    console.log(`Conectado ao database ${dbName}`);
  } catch (err) {
    console.error(`Erro ao conectar: ${err.message}`);
  }
}

/* Definindo a rota /produtos via método GET */
router.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db(dbName);
    const produtos = db.collection("produtos");
    let result = await produtos.find().toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: `${err.message}` });
  }
});

/* Definindo a rota /produtos/:id via método GET */
router.get("/id/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db(dbName);
    const produtos = db.collection("produtos");
    let result = await produtos.find({ COD: req.params.id }).toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: `${err.message}` });
  }
});

const unidadesValidas = ["KG", "G", "UND"];

const validaProduto = [
  //Validações da collection produtos
  check("COD").notEmpty().withMessage("O Código é obrigatório"),
  check("descricao")
    .notEmpty()
    .withMessage("A descricao do produto é obrigatório"),
  check("preco")
    .isFloat({ gt: 0 })
    .withMessage("Valor do produto deve ser maior que zero"),
  check("unidade")
    .isIn(unidadesValidas)
    .withMessage("Unidade de medida deve ser KG, G ou UND"),
  check("datavalidade")
    .isISO8601()
    .withMessage("A data deve estar no formato YYYY-MM-DD"),
  check("estoque")
    .isFloat({ min: 0 })
    .withMessage("Estoque não pode ser menor que zero"),
  check("fornecedor").notEmpty().withMessage("Fornecedor é obrigatório"),
  check("ingredientes")
    .isArray()
    .withMessage("Ingredientes deve ser uma lista"),
  check("categoria").isArray().withMessage("Categoria deve ser uma lista"),
];

/* Definindo a rota /produtos via método POST */
router.post("/", validaProduto, async (req, res) => {
  //Verificando os eventuais erros
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await connectToDatabase();
    const db = client.db(dbName);
    const produtos = db.collection("produtos");
    //Obtendo os dados que vem na requisição
    const novoProduto = req.body;
    //Inserindo um novo produto no MongoDB
    const result = await produtos.insertOne(novoProduto);
    //Retornamos uma mensagem de sucesso
    res.status(201).json({
      message: `Produto inserido com sucesso 
              com o id ${result.insertedId}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Definindo a rota /produtos via método DELETE */
router.delete("/:cod", async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db(dbName);
    const produtos = db.collection("produtos");
    //Obtendo o COD da requisição
    const { cod } = req.params;
    //Deletando o Produto no MongoDB
    const result = await produtos.deleteOne({ COD: cod });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Produto não encontrado!",
      });
    }
    //retornando uma resposta de sucesso
    res.status(200).json({
      message: "Produto removido com sucesso",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:cod", validaProduto, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    //conectado ao MongoDB
    await connectToDatabase();
    const db = client.db(dbName);
    const produtos = db.collection("produtos");
    //obtendo os dados para alteração
    const { cod } = req.params;
    const dadosAtualizados = req.body;
    const result = await produtos.updateOne(
      { COD: cod },
      { $set: dadosAtualizados }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json({ message: "Produto alterado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
