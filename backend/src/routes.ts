import express, { Request, Response, Router } from "express";
import cors from "cors";
import {
  criarUsuario,
  loginUsuario,
  listarReceitasVendedor,
  comprarReceita,
  deletarReceita,
  atualizarReceita,
  listarCompras,
  listarReceitasPorCategoria,
  listarReceitasPorVendedor,
  categoriaMaisReceitasPorVendedor,
  totalReceitasPorCategoria,
  receitasMaisPopulares,
  receitasMaisRecentesEmAlta,
  buscarReceitaPorId,
  finalizarPagamento,
  buscarFatura,
  cadastrarReceita
} from "./services/reports";

const router: Router = express.Router();
router.use(cors());
router.use(express.json());

/* Criar usuário */
router.post("/usuarios", async (req, res) => {
  const result = await criarUsuario(req.body.nome, req.body.email, req.body.senha, req.body.chave_pix);
  res.json(result);
});

/* Login usuário */
router.post("/login", async (req, res) => {
  const result = await loginUsuario(req.body.email, req.body.senha);
  res.json(result);
});

/* Listar receitas de um vendedor */
router.get("/receitas-vendedor/:id_usuario", async (req, res) => {
  const result = await listarReceitasVendedor(parseInt(req.params.id_usuario));
  res.json(result);
});

/* Comprar Receita */
router.post("/comprar-receita", async (req, res) => {
  const result = await comprarReceita(req.body.id_usuario, req.body.id_receita);
  res.json(result);
});

router.post("/finalizar-pagamento", async (req, res) => {
  try {
    const { id_usuario, id_receita, metodo, parcelas } = req.body;
    const result = await finalizarPagamento(id_usuario, id_receita, metodo, parcelas);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar pagamento." });
  }
});

/* Listar compras de um usuário */
router.get("/compras/:id_usuario", async (req, res) => {
  const result = await listarCompras(parseInt(req.params.id_usuario));
  res.json(result);
});

/* Listar todas as receitas por categoria */
router.get("/receitas", async (req, res) => {
  const result = await listarReceitasPorCategoria();
  res.json(result);
});

/* Listar todas as receitas de vendedores */
router.get("/receitas-vendedor", async (req, res) => {
  const result = await listarReceitasPorVendedor();
  res.json(result);
});

/* Buscar a categoria com mais receitas para um vendedor */
router.get("/categoria-vendedor/:id_vendedor", async (req, res) => {
  const result = await categoriaMaisReceitasPorVendedor(parseInt(req.params.id_vendedor));
  res.json(result);
});

/* Buscar o total de receitas por categoria */
router.get("/total-receitas-categoria", async (req, res) => {
  const result = await totalReceitasPorCategoria();
  res.json(result);
});

/* Listar receitas mais populares */
router.get("/receitas-populares", async (req, res) => {
  const result = await receitasMaisPopulares();
  res.json(result);
});

/* (g) Listar receitas mais recentes na categoria mais popular */
router.get("/receitas-recentes-alta", async (req, res) => {
  const result = await receitasMaisRecentesEmAlta();
  res.json(result);
});


/* Busca uma única receita */
router.get("/receita/:id", async (req, res) => {
  const id_receita = parseInt(req.params.id, 10);
  const result = await buscarReceitaPorId(id_receita);
  res.json(result);
});

/* Atualizar uma receita */
router.put("/atualizar-receita/:id_receita", async (req, res) => {
  try {
    const result = await atualizarReceita(
      parseInt(req.params.id_receita),
      req.body.titulo,
      req.body.valor,
      req.body.descricao,
      req.body.imageUrl, //Atualiza a URL da imagem
      req.body.pdfUrl    //Atualiza a URL do PDF
    );

    res.json(result);
  } catch (error) {
    console.error("Erro na atualização da receita:", error);
    res.status(500).json({ success: false, message: "Erro ao atualizar a receita." });
  }
});


/* Deletar uma receita */
router.delete("/deletar-receita/:id_receita", async (req, res) => {
  const result = await deletarReceita(parseInt(req.params.id_receita));
  res.json(result);
});

/* Buscar fatura pelo usuário e receita */
router.get("/fatura/:id_usuario/:id_receita", async (req, res) => {
  const { id_usuario, id_receita } = req.params;
  const result = await buscarFatura(parseInt(id_usuario), parseInt(id_receita));

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "Fatura não encontrada." });
  }
});

/* Cadastra uma receita */
router.post("/cadastrar-receita", async (req, res) => {
  try {
    const { id_vendedor, titulo, descricao, valor, id_categoria, imageUrl, pdfUrl } = req.body;
    const result = await cadastrarReceita(id_vendedor, titulo, descricao, valor, id_categoria, imageUrl, pdfUrl);
    res.json(result);
  } catch (error) {
    console.error("Erro ao cadastrar receita:", error);
    res.status(500).json({ error: "Erro ao cadastrar receita." });
  }
});

export default router;
