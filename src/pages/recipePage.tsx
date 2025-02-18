import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
;

interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  category: string;
}

const RecipePage: React.FC = () => {
  const { id } = useParams();  
  const [recipe, setRecipe] = useState<Recipe | null>(null);  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('isLoggedIn') === 'true');  
  const [showLoginMessage, setShowLoginMessage] = useState<boolean>(false);
  const navigate = useNavigate();  

  useEffect(() => {
    // ✅ FUTURO BACKEND: Buscar a receita pelo ID diretamente da API
    fetch('/recipes.json') // Substituir por: fetch(`https://sua-api.com/recipes/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao carregar a receita.");
        }
        return response.json();
      })
      .then(data => {
        const recipeData = data.find((item: Recipe) => item.id.toString() === id);
        setRecipe(recipeData || null);
      })
      .catch(error => console.error('Erro ao carregar a receita:', error));

    // Atualiza o estado quando o evento de autenticação for disparado
    const updateAuthStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener("authChange", updateAuthStatus);

    return () => {
      window.removeEventListener("authChange", updateAuthStatus);
    };
  }, [id]);

  const handlePurchase = () => {
    if (isLoggedIn) {
      // ✅ FUTURO BACKEND: Criar uma requisição para iniciar a compra
      console.log(`Usuário autenticado! Iniciando compra da receita ID: ${id}`);
      navigate('/checkout');  
    } else {
      setShowLoginMessage(true);  
    }
  };

  const closeModal = () => {
    setShowLoginMessage(false);
  };

  return (
    <div className="recipePage-page">
      {recipe ? (
        <div className="recipePage-container">
          <h1 className="recipePage-title">{recipe.name}</h1>
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="recipePage-image"
          />
          <p className="recipePage-description">{recipe.description}</p>
          <p className="recipePage-category">{recipe.category}</p>
          <p className="recipePage-price">Preço: R${recipe.price.toFixed(2)}</p>

          {/* ✅ FUTURO BACKEND: Confirmar compra no servidor */}
          <button onClick={handlePurchase} className="buy-button">
            Comprar
          </button>
        </div>
      ) : (
        <p className="loading">Carregando...</p>
      )}

      {showLoginMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Você precisa estar logado para comprar</h2>
            <p>Por favor, faça login para continuar.</p>
            <button onClick={closeModal} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
