import { useEffect, useState } from 'react';
import RecipeCard from '../components/recipeCard';

interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  price: number;
  category: string;
}

const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // ✅ FUTURO BACKEND: Alterar para buscar as receitas de uma API real
    fetch('/recipes.json') // Substituir por: fetch("https://sua-api.com/recipes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar as receitas.");
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setFilteredRecipes(data);
      })
      .catch((error) => console.error('Erro ao carregar receitas:', error));
  }, []);

  const filterByCategory = (category: string | null) => {
    if (category === null) {
      setSelectedCategory(null);
      setFilteredRecipes(recipes);
    } else {
      setSelectedCategory(category);
      setFilteredRecipes(recipes.filter(recipe => recipe.category === category));
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="home-container">
        <div className="homepage-title">
          <h1> ✨Encontre receitas incríveis!✨ </h1>
        </div>

        <div className="homePagecategory-buttons flex gap-4 mb-6">
          <button onClick={() => filterByCategory(null)} className="px-4 py-2 bg-gray-300 rounded">Ver Todos</button>
          <button onClick={() => filterByCategory('Amigurumi')} className="px-4 py-2 bg-blue-300 rounded">Amigurumi</button>
          <button onClick={() => filterByCategory('Roupas')} className="px-4 py-2 bg-green-300 rounded">Roupas</button>
          <button onClick={() => filterByCategory('Decoração')} className="px-4 py-2 bg-yellow-300 rounded">Decoração</button>
        </div>

        <ul className="recipe-list">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
