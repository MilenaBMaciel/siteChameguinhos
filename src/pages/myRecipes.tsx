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
  const [topCategory, setTopCategory] = useState<string>("");

  // ✅ FUTURA CONEXÃO COM O BACKEND: Buscar receitas do usuário autenticado
  useEffect(() => {
    // fetch("http://localhost:5000/my-recipes") // ❗ Substituir pela API real do backend
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setRecipes(data);
    //     calculateTopCategory(data);
    //   })
    //   .catch((error) => console.error("Erro ao carregar receitas:", error));

    // 🔹 Atualiza a categoria mais vendida sempre que as receitas mudam
    calculateTopCategory(recipes);
  }, [recipes]);

  // 🔹 Calcula a categoria mais vendida com base na quantidade de receitas cadastradas
  const calculateTopCategory = (recipesList: Recipe[]) => {
    if (recipesList.length === 0) {
      setTopCategory("Nenhuma categoria disponível");
      return;
    }

    const categoryCount: Record<string, number> = {};

    recipesList.forEach((recipe) => {
      categoryCount[recipe.category] = (categoryCount[recipe.category] || 0) + 1;
    });

    const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
    setTopCategory(sortedCategories[0][0]); // Categoria com maior número de receitas cadastradas
  };

  // ✅ FUTURA CONEXÃO COM O BACKEND: Excluir receita do banco de dados
  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta receita?")) {
      try {
        // const response = await fetch(`http://localhost:5000/delete-recipe/${id}`, { method: "DELETE" });

        // if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
        calculateTopCategory(recipes.filter((recipe) => recipe.id !== id));
        // } else {
        //   console.error("Erro ao excluir receita.");
        // }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    }
  };

  return (
    <div className="myRecipes-container">
      <div className="myRecipes-wrapper">
        <h1 className="myRecipes-title">Minhas Receitas</h1>

        {/* ✅ Exibe a categoria mais vendida */}
        <p className="myRecipes-topCategory">
           Categoria mais vendida: <strong>{topCategory}</strong>
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

                {/* ✅ Categoria da receita cadastrada */}
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
