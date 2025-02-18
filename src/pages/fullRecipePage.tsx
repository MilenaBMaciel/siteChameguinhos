import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  pdfUrl: string;
}

const FullRecipePage: React.FC = () => {
  const { id } = useParams();  
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    // ✅ CONEXÃO COM O BACKEND: Substituir pela URL real do backend
    fetch(`http://localhost:5000/recipe/${id}`)
      .then(response => response.json())
      .then(data => setRecipe(data))
      .catch(error => console.error("Erro ao carregar a receita:", error));
  }, [id]);

  return (
    <div className="fullRecipePage-container">
      {recipe ? (
        <div className="fullRecipePage-content">
          <h1 className="fullRecipePage-title">{recipe.name}</h1>
          <img src={recipe.imageUrl} alt={recipe.name} className="fullRecipePage-image" />
          <p className="fullRecipePage-description">{recipe.description}</p>
          <p className="fullRecipePage-category">Categoria: {recipe.category}</p>
          <p className="fullRecipePage-price">Preço: R${recipe.price.toFixed(2)}</p>
          <a href={recipe.pdfUrl} target="_blank" rel="noopener noreferrer" className="fullRecipePage-button">
            Baixar Receita
          </a>
        </div>
      ) : (
        <p className="loading">Carregando...</p>
      )}
    </div>
  );
};

export default FullRecipePage;
