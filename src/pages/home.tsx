import { useEffect, useState } from "react";
import RecipeCard from "../components/recipeCard";

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
    fetchAllRecipes();
  }, []);

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/receitas`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      const formattedData = data.map((recipe: any) => ({
        id: recipe.id_receita,
        name: recipe.titulo,
        imageUrl: recipe.imageUrl || "/default-image.jpg",
        link: `/recipe/${recipe.id_receita}`,
        price: parseFloat(recipe.valor),
        category: recipe.categoria || "Desconhecido",
      }));
      setRecipes(formattedData);
      setFilteredRecipes(formattedData);
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
    }
  };

  const fetchPopularRecipes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/receitas-populares`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      const formattedData = data.map((recipe: any) => ({
        id: recipe.id_receita,
        name: recipe.titulo,
        imageUrl: recipe.imageUrl || "/default-image.jpg",
        link: `/recipe/${recipe.id_receita}`,
        price: parseFloat(recipe.valor),
        category: recipe.categoria || "Desconhecido",
      }));
      setSelectedCategory("Populares");
      setFilteredRecipes(formattedData);
    } catch (error) {
      console.error("Erro ao carregar receitas populares:", error);
    }
  };

  const fetchRecentRecipes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/receitas-recentes-alta`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      const formattedData = data.map((recipe: any) => ({
        id: recipe.id_receita,
        name: recipe.titulo,
        imageUrl: recipe.imageUrl || "/default-image.jpg",
        link: `/recipe/${recipe.id_receita}`,
        price: parseFloat(recipe.valor),
        category: recipe.categoria || "Desconhecido",
      }));
      setSelectedCategory("Mais Recentes em Alta");
      setFilteredRecipes(formattedData);
    } catch (error) {
      console.error("Erro ao carregar receitas recentes em alta:", error);
    }
  };

  const filterByCategory = (category: string | null) => {
    if (category === null) {
      setSelectedCategory(null);
      setFilteredRecipes(recipes);
    } else {
      setSelectedCategory(category);
      setFilteredRecipes(recipes.filter((recipe) => recipe.category === category));
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="home-container">
        <div className="homepage-title">
          <h1> ✨Encontre receitas incríveis!✨ </h1>
        </div>

        <div className="homePagecategory-buttons flex gap-4 mb-6">
          <button onClick={() => filterByCategory(null)} className="px-4 py-2 bg-gray-300 rounded">
            Ver Todos
          </button>
          <button onClick={() => filterByCategory("Amigurumi")} className="px-4 py-2 bg-blue-300 rounded">
            Amigurumi
          </button>
          <button onClick={() => filterByCategory("Roupas")} className="px-4 py-2 bg-green-300 rounded">
            Roupas
          </button>
          <button onClick={() => filterByCategory("Decoração")} className="px-4 py-2 bg-yellow-300 rounded">
            Decoração
          </button>
          <button onClick={fetchPopularRecipes} className="px-4 py-2 bg-red-300 rounded">
            Populares
          </button>
          <button onClick={fetchRecentRecipes} className="px-4 py-2 bg-purple-300 rounded">
            Mais Recentes em Alta
          </button>
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
