const API_BASE_URL = "http://localhost:3000/api"; // Backend rodando localmente

export async function fetchReceitas() {
  const response = await fetch(`${API_BASE_URL}/receitas`);
  return response.json();
}

export async function fetchReceitaById(id: number) {
  const response = await fetch(`${API_BASE_URL}/receitas/${id}`);
  return response.json();
}

export async function criarCompra(id_usuario: number, id_receita: number) {
  const response = await fetch(`${API_BASE_URL}/compras`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario, id_receita }),
  });
  return response.json();
}

export async function fetchComprasUsuario(id_usuario: number) {
  const response = await fetch(`${API_BASE_URL}/usuarios/${id_usuario}/compras`);
  return response.json();
}

export async function loginUsuario(email: string, senha: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return response.json();
}

export async function cadastrarUsuario(nome: string, email: string, senha: string, chave_pix?: string) {
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, chave_pix }),
  });
  return response.json();
}
