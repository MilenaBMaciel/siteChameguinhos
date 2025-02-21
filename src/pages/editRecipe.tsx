import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    titulo: "",
    descricao: "",
    valor: "",
    imageUrl: "",
    pdfUrl: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  //Busca os dados da receita para edição
  useEffect(() => {
    fetch(`http://localhost:3000/receita/${id}`)
      .then((response) => response.json())
      .then((data) =>
        setRecipe({
          titulo: data.titulo || "",
          descricao: data.descricao || "",
          valor: data.valor || "",
          imageUrl: data.imageUrl || "",
          pdfUrl: data.pdfUrl || "",
        })
      )
      .catch((error) => {
        console.error("Erro ao carregar a receita:", error);
        setErrorMessage("Erro ao carregar a receita.");
        setShowErrorModal(true);
      });
  }, [id]);

  //Envia os dados atualizados para o backend
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/atualizar-receita/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      navigate("/myRecipes");
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao atualizar a receita.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="editRecipe-container">
      <div className="editRecipe-wrapper">
        <h2 className="editRecipe-title">Editar Receita</h2>

        <input
          type="text"
          placeholder="Título"
          value={recipe.titulo}
          readOnly //O título não pode ser alterado
          className="editRecipe-input readonly"
        />

        <textarea
          placeholder="Descrição"
          value={recipe.descricao}
          onChange={(e) => setRecipe({ ...recipe, descricao: e.target.value })}
          className="editRecipe-input"
        />

        <input
          type="text"
          placeholder="Preço (R$)"
          value={recipe.valor}
          onChange={(e) => setRecipe({ ...recipe, valor: e.target.value })}
          className="editRecipe-input"
        />

        <input
          type="text"
          placeholder="Imagem (URL)"
          value={recipe.imageUrl}
          onChange={(e) => setRecipe({ ...recipe, imageUrl: e.target.value })}
          className="editRecipe-input"
        />

        <input
          type="text"
          placeholder="PDF (URL)"
          value={recipe.pdfUrl}
          onChange={(e) => setRecipe({ ...recipe, pdfUrl: e.target.value })}
          className="editRecipe-input"
        />

        <button onClick={handleSave} className="editRecipe-button" style={{ marginTop: "20px", marginBottom:"10px"}}>
          Salvar
        </button>
        <button onClick={() => navigate("/myRecipes")} className="editRecipe-button cancel">
          Cancelar
        </button>
      </div>

      {/*Modal de erro */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Erro</h2>
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorModal(false)} className="close-button">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRecipe;
