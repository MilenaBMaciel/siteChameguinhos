import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
}

const MyRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // ✅ FUTURA CONEXÃO COM O BACKEND: Buscar receitas do usuário autenticado
  useEffect(() => {
    fetch("http://localhost:5000/my-recipes") // ❗ Substituir pela API real do backend
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Erro ao carregar receitas:", error));
  }, []);

  // ✅ FUTURA CONEXÃO COM O BACKEND: Excluir receita do banco de dados
  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta receita?")) {
      try {
        const response = await fetch(`http://localhost:5000/delete-recipe/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setRecipes(recipes.filter((recipe) => recipe.id !== id));
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
                <p className="myRecipes-category">Categoria: {recipe.category}</p>
                <p className="myRecipes-price">Preço: R${recipe.price.toFixed(2)}</p>

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
