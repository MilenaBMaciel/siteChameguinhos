import pool from "./database";
import { RowDataPacket } from "mysql2/promise";

/* Criar usuário */
export const criarUsuario = async (nome: string, email: string, senha: string, chave_pix: string | null) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`START TRANSACTION`);
    
    await connection.query(
      `INSERT INTO USUARIO (nome, email, senha, chave_pix) VALUES (?, ?, ?, ?)`,
      [nome, email, senha, chave_pix]
    );

    await connection.query(`COMMIT`);
    return { success: true, message: "Usuário cadastrado com sucesso!" };
  } catch (error: any) {
    await connection.query(`ROLLBACK`);
    return { success: false, message: error.sqlMessage || "Erro ao cadastrar usuário." };
  } finally {
    connection.release(); 
  }
};



/* Login do usuário */
export const loginUsuario = async (email: string, senha: string) => {
  const [rows] = await pool.query(
    `SELECT id_usuario, nome, email FROM USUARIO WHERE email = ? AND senha = ?`,
    [email, senha]
  );
  return rows;
};

/* Listar receitas do vendedor autenticado */
export const listarReceitasVendedor = async (id_usuario: number) => {
  const [rows] = await pool.query(
    `SELECT R.id_receita, R.titulo, R.valor, R.data_publicacao, C.nome AS categoria
     FROM RECEITA R
     INNER JOIN CATEGORIA C ON R.id_categoria = C.id_categoria
     WHERE R.id_vendedor = ?`,
    [id_usuario]
  );
  return rows;
};

/* Comprar Receita */
export const comprarReceita = async (id_usuario: number, id_receita: number) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`START TRANSACTION`);

    await connection.query(
      `INSERT INTO COMPRA (id_usuario, id_receita, valor) 
       SELECT ?, ?, valor FROM RECEITA WHERE id_receita = ?`,
      [id_usuario, id_receita, id_receita]
    );

    await connection.query(
      `INSERT INTO FATURA (id_usuario, id_receita, situacao) 
       VALUES (?, ?, 'Pendente')`,
      [id_usuario, id_receita]
    );

    await connection.query(`COMMIT`);
    return { success: true, message: "Compra registrada. Agora finalize o pagamento!" };
  } catch (error: any) {
    await connection.query(`ROLLBACK`);
    throw error;
  } finally {
    connection.release();
  }
};

/* Finalizar Pagamento */
export const finalizarPagamento = async (id_usuario: number, id_receita: number, metodo: string, parcelas: number) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`START TRANSACTION`);

    await connection.query(
      `UPDATE FATURA 
       SET situacao = 'Paga', metodo = ?, parcelas = ? 
       WHERE id_usuario = ? AND id_receita = ?`,
      [metodo, parcelas, id_usuario, id_receita]
    );

    await connection.query(`COMMIT`);
    return { success: true, message: "Pagamento realizado com sucesso!" };
  } catch (error) {
    await connection.query(`ROLLBACK`);
    throw error;
  } finally {
    connection.release();
  }
};


/* Deletar receita */
export const deletarReceita = async (id_receita: number) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`START TRANSACTION`);
    
    const [result] = await connection.query(`DELETE FROM RECEITA WHERE id_receita = ?`, [id_receita]);

    await connection.query(`COMMIT`);
    return result;
  } catch (error: any) {
    await connection.query(`ROLLBACK`);
    throw error;
  } finally {
    connection.release();
  }
};

/* Atualizar receita */
export const atualizarReceita = async (
  id_receita: number,
  titulo: string,
  valor: number,
  descricao: string,
  imageUrl: string,
  pdfUrl: string
) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`START TRANSACTION`);
    
    const [result] = await connection.query(
      `UPDATE RECEITA 
       SET titulo = ?, valor = ?, descricao = ?, imageUrl = ?, pdfUrl = ?
       WHERE id_receita = ?`,
      [titulo, valor, descricao, imageUrl, pdfUrl, id_receita]
    );

    await connection.query(`COMMIT`);
    return { success: true, message: "Receita atualizada com sucesso!" };
  } catch (error: any) {
    await connection.query(`ROLLBACK`);
    return { success: false, message: error.sqlMessage || "Erro ao atualizar a receita." };
  } finally {
    connection.release();
  }
};


/* Compras do usuário */
export const listarCompras = async (id_usuario: number) => {
  const [rows] = await pool.query(
    `SELECT C.id_receita, R.titulo, R.valor, R.data_publicacao, R.id_categoria, C.data_compra, C.valor, C.id_usuario, CAT.nome AS categoria
     FROM COMPRA C
     INNER JOIN RECEITA R ON C.id_receita = R.id_receita
     INNER JOIN CATEGORIA CAT ON R.id_categoria = CAT.id_categoria
     WHERE C.id_usuario = ?`,
    [id_usuario]
  );
  return rows;
};

/* Receitas por categoria */
export const listarReceitasPorCategoria = async () => {
  const [rows] = await pool.query(
    `SELECT R.id_receita, R.titulo, R.valor, R.imageUrl, C.nome AS categoria
     FROM RECEITA R
     INNER JOIN CATEGORIA C ON R.id_categoria = C.id_categoria`
  );
  return rows;
};

/* Receitas por vendedor */
export const listarReceitasPorVendedor = async () => {
  const [rows] = await pool.query(
    `SELECT V.id_vendedor, V.nome_loja, 
            R.id_receita, R.titulo, R.valor, R.data_publicacao, R.imageUrl
     FROM VENDEDOR V
     LEFT JOIN RECEITA R ON V.id_vendedor = R.id_vendedor`
  );
  return rows;
};

/* Categoria com mais receitas para um vendedor */
export const categoriaMaisReceitasPorVendedor = async (id_vendedor: number) => {
  const [rows] = await pool.query(
    `SELECT C.nome 
     FROM CATEGORIA C
     WHERE C.id_categoria = (
       SELECT R.id_categoria
       FROM RECEITA R
       WHERE R.id_vendedor = ?
       GROUP BY R.id_categoria
       ORDER BY COUNT(R.id_receita) DESC
       LIMIT 1
     )`,
    [id_vendedor]
  );

  return rows;
};


/* Total de receitas por categoria */
export const totalReceitasPorCategoria = async () => {
  const [rows] = await pool.query(
    `SELECT C.nome AS categoria, COUNT(R.id_receita) AS total
     FROM RECEITA R
     INNER JOIN CATEGORIA C ON R.id_categoria = C.id_categoria
     GROUP BY C.nome
     ORDER BY total DESC`
  );
  return rows;
};

/* Receitas mais vendidas */
export const receitasMaisPopulares = async () => {
  const [rows] = await pool.query(
    `SELECT 
        C.id_receita, 
        R.titulo, 
        R.valor, 
        CAT.nome AS categoria,  -- Pegando o nome da categoria
        COUNT(C.id_usuario) AS total_compras
     FROM COMPRA C
     INNER JOIN RECEITA R ON C.id_receita = R.id_receita
     INNER JOIN CATEGORIA CAT ON R.id_categoria = CAT.id_categoria  -- Fazendo JOIN com a tabela CATEGORIA
     GROUP BY C.id_receita, R.titulo, R.valor, CAT.nome
     HAVING total_compras >= 2
     ORDER BY total_compras DESC`
  );
  return rows;
};

/* (g) Receitas mais recentes na categoria mais popular */
export const receitasMaisRecentesEmAlta = async () => {
  const [rows] = await pool.query(
    `SELECT R.id_receita, R.titulo, R.valor, R.data_publicacao, C.nome AS categoria
     FROM RECEITA R
     INNER JOIN CATEGORIA C ON R.id_categoria = C.id_categoria -- Fazendo JOIN com a tabela CATEGORIA
     WHERE R.id_categoria = (
         SELECT id_categoria
         FROM RECEITA
         GROUP BY id_categoria
         ORDER BY COUNT(id_receita) DESC
         LIMIT 1
     )
     ORDER BY R.data_publicacao DESC
     LIMIT 3`
  );
  return rows;  
};

/* Busca uma única receita */
export const buscarReceitaPorId = async (id_receita: number) => {
  const [rows]: any = await pool.query(
    `SELECT R.id_receita, R.id_categoria, bC.nome AS categoria, R.id_vendedor, R.valor, R.titulo, R.descricao, R.imageUrl, R.pdfUrl, R.data_publicacao
     FROM RECEITA R
     INNER JOIN CATEGORIA C ON R.id_categoria = C.id_categoria  -- Fazendo JOIN com a tabela CATEGORIA
     WHERE R.id_receita = ?`,
    [id_receita]
  );

  return rows.length > 0 ? rows[0] : null;
};

/* Buscar Fatura de uma Compra */
export const buscarFatura = async (id_usuario: number, id_receita: number) => {
  const [rows]: any = await pool.query(
    `SELECT id_usuario, id_receita, situacao, metodo, parcelas 
     FROM FATURA 
     WHERE id_usuario = ? AND id_receita = ?`,
    [id_usuario, id_receita]
  );

  return rows.length > 0 ? rows[0] : null;
};

/* Cadastra uma receita */
export const cadastrarReceita = async (titulo: string, valor: number, descricao: string, id_categoria: number, id_vendedor: number, imageUrl: string, pdfUrl: string) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`START TRANSACTION`);

    await connection.query(
      `INSERT INTO RECEITA (titulo, valor, descricao, id_categoria, id_vendedor, imageUrl, pdfUrl) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titulo, valor, descricao, id_categoria, id_vendedor, imageUrl, pdfUrl]
    );

    await connection.query(`COMMIT`);
    return { success: true, message: "Receita cadastrada com sucesso!" };
  } catch (error: any) {
    await connection.query(`ROLLBACK`);
    return { success: false, message: error.sqlMessage || "Erro ao criar receita." };
  } finally {
    connection.release();
  }
};