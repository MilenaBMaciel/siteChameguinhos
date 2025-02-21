import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    fetch(`http://localhost:3000/receita/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao carregar a receita.");
        }
        return response.json();
      })
      .then(data => {
        setRecipe({
          id: data.id_receita,
          name: data.titulo,
          imageUrl: data.imageUrl || "/default-image.jpg",
          description: data.descricao || "Sem descrição",
          price: parseFloat(data.valor),
          category: data.categoria
        });
      })
      .catch(error => console.error('Erro ao carregar a receita:', error));
  }, [id]);

  const handlePurchase = () => {
    const userId = localStorage.getItem("userId");

    if (!isLoggedIn || !userId) {
      setShowLoginMessage(true);
      return;
    }

    //Criar a compra no banco de dados
    fetch("http://localhost:3000/comprar-receita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: userId,
        id_receita: id,
        metodo: "Pix", // Simulação de pagamento
        parcelas: 1
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        //Redireciona para o Checkout passando os dados da receita
        navigate(`/checkout/${id}`, { state: { recipe } });
      } else {
        alert(data.error || "Erro ao processar a compra.");
      }
    })
    .catch(error => {
      console.error("Erro ao processar a compra:", error);
      alert("Erro ao processar a compra.");
    });
  };

  return (
    <div className="recipePage-page">
      {recipe ? (
        <div className="recipePage-container">
          <h1 className="recipePage-title">{recipe.name}</h1>
          <img src={recipe.imageUrl} alt={recipe.name} className="recipePage-image" />
          <p className="recipePage-description">{recipe.description}</p>
          <p className="recipePage-category">Categoria: {recipe.category}</p>
          <p className="recipePage-price">Preço: R${recipe.price.toFixed(2)}</p>

          {/* Botão de compra */}
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
            <button onClick={() => setShowLoginMessage(false)} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
