// components/RecipeCard.tsx
import React from 'react';

interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  price: number;
  category: string; // Novo campo para a categoria
}

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <a href={recipe.link}>
        <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
        <div className="product-info">
          <div className="product-name">{recipe.name}</div>
          <p className="product-category">{recipe.category}</p>
          <div className="product-price">R${recipe.price.toFixed(2)}</div>
        </div>
      </a>
    </div>
  );
};

export default RecipeCard;
