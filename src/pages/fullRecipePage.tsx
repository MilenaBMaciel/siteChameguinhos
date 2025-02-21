import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Pegamos os dados da receita da tela anterior
  const recipe = location.state?.recipe || null;

  const [pixKey] = useState("00020126360014BR.GOV.BCB.PIX0114+5511999999995204000053039865802BR5925Nome Exemplo6009Sao Paulo62070503***6304ABCD");
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (!recipe) {
      navigate(`/receita/${id}`);
    }
  }, [recipe, id, navigate]);

  // Finaliza o pagamento ao pressionar qualquer tecla e exibe a fatura
  useEffect(() => {
    const handlePayment = async () => {
      setLoadingInvoice(true);
      try {
        // Finaliza o pagamento no backend
        await fetch("http://localhost:3000/finalizar-pagamento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: localStorage.getItem("userId"),
            id_receita: id,
            metodo: "Pix", // Simulação
            parcelas: 1,
          }),
        });

        // Busca a fatura atualizada
        const response = await fetch(`http://localhost:3000/fatura/${localStorage.getItem("userId")}/${id}`);
        const data = await response.json();
        if (data) {
          setInvoiceData(data);
          setShowInvoicePopup(true);
          setIsPaymentConfirmed(true);
        } else {
          alert("Erro ao carregar fatura.");
        }
      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        alert("Erro ao processar pagamento.");
      } finally {
        setLoadingInvoice(false);
      }
    };

    const handleKeyPress = () => {
      if (!showInvoicePopup) {
        handlePayment();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [id, showInvoicePopup]);

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <h2 className="checkout-title">Confirmação de Pagamento</h2>

        {recipe ? (
          <>
            <p className="checkout-text">Finalize a compra da receita:</p>
            <h3 className="checkout-recipeName">{recipe.name}</h3>

            <p className="checkout-text">Use a chave PIX abaixo para efetuar o pagamento:</p>
            <textarea 
              className="checkout-pixKey" 
              readOnly 
              value={pixKey} 
              onClick={(e) => (e.target as HTMLTextAreaElement).select()} 
            />

            <p className="checkout-wait">Pressione qualquer tecla após pagar</p>
          </>
        ) : (
          <p className="checkout-loading">Carregando receita...</p>
        )}
      </div>

      {/* Popup da Fatura */}
      {showInvoicePopup && invoiceData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Detalhes da Fatura</h2>
            <p><strong>Receita:</strong> {recipe.name}</p>
            <p><strong>Valor:</strong> R$ {recipe.price.toFixed(2)}</p>
            <p><strong>Método de Pagamento:</strong> {invoiceData.metodo}</p>
            <p><strong>Parcelas:</strong> {invoiceData.parcelas}</p>
            <p><strong>Status:</strong> {invoiceData.situacao}</p>

            {/* Botão para baixar o PDF da receita */}
            {isPaymentConfirmed && (
              <a href={recipe.pdfUrl} className="fullRecipePage-button">
                📄 Baixar Receita
              </a>
            )}

            <button onClick={() => navigate("/profile")} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
