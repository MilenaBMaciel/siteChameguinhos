import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SellRecipe = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Gera um ID único para a nova receita
  const generateUniqueID = () => Math.floor(Date.now() / 1000);

  const handleUpload = async () => {
    if (!imageUrl || !pdfUrl || !name || !description || !price || !category) {
      setMessage("Preencha todos os campos!");
      return;
    }

    const recipeData = {
      id: generateUniqueID(),
      name,
      description,
      price,
      category,
      imageUrl,
      pdfUrl,
    };

    try {
      // ✅ CONEXÃO COM O BACKEND: Substituir pela URL real do backend
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        setMessage("Receita enviada com sucesso!");
        setTimeout(() => navigate(`/fullRecipe/${recipeData.id}`), 2000);
      } else {
        setMessage("Erro ao enviar receita.");
      }
    } catch (error) {
      setMessage("Erro ao conectar com o servidor.");
      console.error(error);
    }
  };

  return (
    <div className="sellPage-container">
      <div className="sellPage-wrapper">
        <h2 className="sellPage-title">Vender Nova Receita</h2>

        <input
          type="text"
          placeholder="Nome da Receita"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="sellPage-input"
        />

        <input
          placeholder="Descrição da Receita"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="sellPage-input"
        />

        <input
          type="text"
          placeholder="Preço (R$)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="sellPage-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sellPage-select"
        >
          <option value="">Selecione a Categoria</option>
          <option value="Amigurumi">Amigurumi</option>
          <option value="Roupas">Roupas</option>
          <option value="Decoração">Decoração</option>
        </select>

        <input
          type="text"
          placeholder="Link da Imagem"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="sellPage-input"
        />

        <input
          type="text"
          placeholder="Link do PDF"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          className="sellPage-input"
        />

        <div className="sellPage-button-group">
          <button onClick={handleUpload} className="sellPage-button">
            Enviar Receita
          </button>
          <button onClick={() => navigate("/myRecipes")} className="sellPage-button cancel">
            Voltar
          </button>
        </div>

        {message && <p className="sellPage-message">{message}</p>}
      </div>
    </div>
  );
};

export default SellRecipe;
