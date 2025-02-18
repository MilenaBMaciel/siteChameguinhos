import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    pdfUrl: "",
  });

  // ✅ FUTURA CONEXÃO COM O BACKEND: Buscar dados da receita para edição
  useEffect(() => {
    fetch(`http://localhost:5000/recipe/${id}`)
      .then((response) => response.json())
      .then((data) => setRecipe(data))
      .catch((error) => console.error("Erro ao carregar a receita:", error));
  }, [id]);

  // ✅ FUTURA CONEXÃO COM O BACKEND: Atualizar receita no banco de dados
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/update-recipe/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });

      if (response.ok) {
        navigate("/my-recipes");
      } else {
        console.error("Erro ao atualizar receita.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
    }
  };

  return (
    <div className="editRecipe-container">
      <div className="editRecipe-wrapper">
        <h2 className="editRecipe-title">Editar Receita</h2>

        <input type="text" placeholder="Nome" value={recipe.name} onChange={(e) => setRecipe({ ...recipe, name: e.target.value })} className="editRecipe-input" />
        <textarea placeholder="Descrição" value={recipe.description} onChange={(e) => setRecipe({ ...recipe, description: e.target.value })} className="editRecipe-input" />
        <input type="text" placeholder="Preço (R$)" value={recipe.price} onChange={(e) => setRecipe({ ...recipe, price: e.target.value })} className="editRecipe-input" />
        <input type="text" placeholder="Imagem (URL)" value={recipe.imageUrl} onChange={(e) => setRecipe({ ...recipe, imageUrl: e.target.value })} className="editRecipe-input" />
        <input type="text" placeholder="PDF (URL)" value={recipe.pdfUrl} onChange={(e) => setRecipe({ ...recipe, pdfUrl: e.target.value })} className="editRecipe-input" />

        <button onClick={handleSave} className="editRecipe-button">Salvar</button>
        <button onClick={() => navigate("/my-recipes")} className="editRecipe-button cancel">Cancelar</button>
      </div>
    </div>
  );
};

export default EditRecipe;
