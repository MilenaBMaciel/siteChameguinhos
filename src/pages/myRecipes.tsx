import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  pdfUrl: string;
}

const MyRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [topCategory, setTopCategory] = useState<string>("Carregando...");

  const userId = localStorage.getItem("userId"); // Obtendo ID do usuário autenticado

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redireciona para login se não houver usuário autenticado
      return;
    }

    fetchUserRecipes(userId);
    fetchTopCategory(userId);
  }, [userId]);

  // Função para buscar as receitas do usuário autenticado
  const fetchUserRecipes = async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/receitas-vendedor/${userId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar receitas.");
      }
      const data = await response.json();

      const formattedData = data.map((recipe: any) => ({
        id: recipe.id_receita,
        name: recipe.titulo,
        imageUrl: recipe.imageUrl || "/default-image.jpg",
        price: parseFloat(recipe.valor),
        category: recipe.categoria || "Desconhecido",
      }));

      setRecipes(formattedData);
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
    }
  };

  // Função para buscar a categoria mais vendida do usuário
  const fetchTopCategory = async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categoria-vendedor/${userId}`);      if (!response.ok) {
        throw new Error("Erro ao buscar categoria mais vendida.");
      }
      const data = await response.json();
      setTopCategory(data[0]?.nome || "Nenhuma categoria vendida ainda.");
    } catch (error) {
      console.error("Erro ao buscar categoria mais vendida:", error);
      setTopCategory("Erro ao carregar.");
    }
  };

  // Função para deletar receita
  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta receita?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/deletar-receita/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
          setRecipes(updatedRecipes);
          fetchTopCategory(userId!); // Atualiza a categoria mais vendida
        } else {
          console.error("Erro ao excluir receita.");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    }
  };

  return (
    <div className="myRecipes-container">
      <div className="myRecipes-wrapper">
        <h1 className="myRecipes-title">Minhas Receitas</h1>

        {/*Exibe a categoria mais vendida */}
        <p className="myRecipes-topCategory">
          📌 Categoria mais vendida: <strong>{topCategory}</strong>
        </p>

        {/* Botão para adicionar nova receita */}
        <button onClick={() => navigate("/sellRecipe")} className="myRecipes-button">
          Criar Nova Receita
        </button>

        {/* Lista de receitas do usuário */}
        <div className="myRecipes-list">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.id} className="myRecipes-card">
                <img src={recipe.imageUrl} alt={recipe.name} className="myRecipes-image" />
                <h3 className="myRecipes-name">{recipe.name}</h3>

                {/*Categoria da receita cadastrada */}
                <p className="myRecipes-category">
                  <strong>Categoria:</strong> {recipe.category}
                </p>

                <p className="myRecipes-price">
                  <strong>Preço:</strong> R${recipe.price.toFixed(2)}
                </p>

                {/* Botões de Ação */}
                <div className="myRecipes-actions">
                  <button onClick={() => navigate(`/fullRecipe/${recipe.id}`)} className="myRecipes-view">
                    Visualizar
                  </button>
                  <button onClick={() => navigate(`/edit-recipe/${recipe.id}`)} className="myRecipes-edit">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(recipe.id)} className="myRecipes-delete">
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="myRecipes-empty">Você ainda não cadastrou nenhuma receita.</p>
          )}
        </div>

        {/* Botão para voltar ao perfil */}
        <button onClick={() => navigate("/profile")} className="myRecipes-button cancel">
          Voltar para o Perfil
        </button>
      </div>
    </div>
  );
};

export default MyRecipes;
