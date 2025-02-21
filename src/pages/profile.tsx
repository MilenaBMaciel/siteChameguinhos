import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  pdfUrl: string;
}

interface Invoice {
  metodo: string;
  parcelas: number;
  situacao: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [purchasedRecipes, setPurchasedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/compras/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedRecipes = data.map((item: any) => ({
          id: item.id_receita,
          name: item.titulo,
          imageUrl: item.imageUrl || "/default-image.jpg",
          price: parseFloat(item.valor),
          pdfUrl: item.pdfUrl || "#",
        }));
        setPurchasedRecipes(formattedRecipes);
      })
      .catch((error) => console.error("Erro ao carregar receitas:", error));
  }, [isLoggedIn, navigate]);

  // Função para buscar fatura ao clicar na receita
  const handleShowInvoice = async (recipe: Recipe) => {
    setLoadingInvoice(true);
    setSelectedRecipe(recipe);
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:3000/fatura/${userId}/${recipe.id}`);
      const data = await response.json();
      if (data) {
        setInvoiceData(data);
        setShowInvoicePopup(true);
      } else {
        alert("Erro ao carregar fatura.");
      }
    } catch (error) {
      console.error("Erro ao buscar fatura:", error);
      alert("Erro ao buscar fatura.");
    } finally {
      setLoadingInvoice(false);
    }
  };

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
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
              <div 
                key={recipe.id} 
                className="profilePage-recipeCard" 
                onClick={() => handleShowInvoice(recipe)}
              >
                <img src={recipe.imageUrl} alt={recipe.name} className="profilePage-recipeImage" />
                <h3 className="profilePage-recipeName">{recipe.name}</h3>
              </div>
            ))
          ) : (
            <p className="profilePage-noRecipes">Nenhuma receita adquirida ainda.</p>
          )}
        </div>
      </div>

      {/* Modal da Fatura */}
      {showInvoicePopup && selectedRecipe && invoiceData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Detalhes da Fatura</h2>
            <p><strong>Receita:</strong> {selectedRecipe.name}</p>
            <p><strong>Valor:</strong> R$ {selectedRecipe.price.toFixed(2)}</p>
            <p><strong>Método de Pagamento:</strong> {invoiceData.metodo}</p>
            <p><strong>Parcelas:</strong> {invoiceData.parcelas}</p>
            <p><strong>Status:</strong> {invoiceData.situacao}</p>

            {/* Botão para baixar a receita */}
            <a href={selectedRecipe.pdfUrl} style={{ marginRight: "10px" }}  className="fullRecipePage-button">
                📄 Baixar Receita
            </a>

            <button onClick={() => setShowInvoicePopup(false)} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
