import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../index.css"; // Mantendo o CSS global do site

interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  pdfUrl: string; // ✅ Agora cada receita tem um link para o PDF
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem("isLoggedIn") === "true");
  const [purchasedRecipes, setPurchasedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login"); // Redireciona se o usuário não estiver logado
    }

    // ✅ FUTURO BACKEND: Buscar receitas adquiridas pelo usuário autenticado
    fetch("/recipes.json") // Substituir por: fetch("https://sua-api.com/user/recipes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar as receitas adquiridas.");
        }
        return response.json();
      })
      .then((data) => {
        setPurchasedRecipes(data);
      })
      .catch((error) => console.error("Erro ao carregar receitas:", error));
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    // ✅ FUTURO BACKEND: Informar ao servidor que o usuário está deslogando (opcional)
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("authChange")); // Atualiza a autenticação globalmente
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <div className="profilePage-container">
      <div className="profilePage-wrapper">
        <h1 className="profilePage-title">Meu Perfil</h1>

        {/* Seção de Ações */}
        <div className="profilePage-actions">
          <button onClick={handleLogout} className="profilePage-button logout">
            Sair da Conta
          </button>
          <button onClick={() => navigate("/myRecipes")} className="profilePage-button vendas">
            Ir para a Página de Vendas
          </button>
        </div>

        {/* Seção de Receitas Adquiridas */}
        <h2 className="profilePage-subtitle">Minhas Receitas</h2>
        <div className="profilePage-recipes">
          {purchasedRecipes.length > 0 ? (
            purchasedRecipes.map((recipe) => (
              <a 
                key={recipe.id} 
                href={recipe.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="profilePage-recipeCard"
              >
                <img src={recipe.imageUrl} alt={recipe.name} className="profilePage-recipeImage" />
                <h3 className="profilePage-recipeName">{recipe.name}</h3>
              </a>
            ))
          ) : (
            <p className="profilePage-noRecipes">Nenhuma receita adquirida ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
