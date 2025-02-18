import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { id } = useParams(); // Obtém o ID da receita da URL
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<{ id: number; name: string } | null>(null);
  const [pixKey] = useState("00020126360014BR.GOV.BCB.PIX0114+5511999999995204000053039865802BR5925Nome Exemplo6009Sao Paulo62070503***6304ABCD");
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);

  // ✅ SIMULAÇÃO DE DADOS (remover após conectar ao backend)
  useEffect(() => {
    // FUTURA CONEXÃO COM O BACKEND: Buscar dados da receita pelo ID
    // fetch(`http://localhost:5000/recipe/${id}`)
    //   .then(response => response.json())
    //   .then(data => setRecipe(data))
    //   .catch(error => console.error("Erro ao carregar a receita:", error));

    // 🔹 Simulação de carregamento da receita
    setTimeout(() => {
      setRecipe({ id: Number(id), name: "Receita Simulada" }); // Substituir por dados do backend
    }, 1000); // Simula atraso na resposta da API
  }, [id]);

  // ✅ SIMULAÇÃO DE CONFIRMAÇÃO DE COMPRA (remover após conectar ao backend)
  useEffect(() => {
    const confirmPurchase = (event: KeyboardEvent) => {
      if (!purchaseConfirmed) {
        setPurchaseConfirmed(true);
        
        // FUTURA CONEXÃO COM O BACKEND: Registrar a compra no banco de dados
        // fetch("http://localhost:5000/confirm-purchase", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ recipeId: id, userId: "123" }), // ❗ Enviar ID real do usuário
        // });

        // 🔹 Simulação de confirmação da compra
        setTimeout(() => navigate("/profile"), 2000);
      }
    };

    window.addEventListener("keydown", confirmPurchase);

    return () => {
      window.removeEventListener("keydown", confirmPurchase);
    };
  }, [id, purchaseConfirmed, navigate]);

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

            {!purchaseConfirmed ? (
              <p className="checkout-wait">Pressione qualquer tecla após pagar</p>
            ) : (
              <p className="checkout-confirmed">Compra confirmada! Redirecionando...</p>
            )}
          </>
        ) : (
          <p className="checkout-loading">Carregando receita...</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
