import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Verificando login inicial:", isLoggedIn);
    if (isLoggedIn) {
      console.log("Usuário já logado, redirecionando para o perfil...");
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async () => {
    console.log("Tentando login com:", { email, senha });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resposta do backend:", data);

      if (data.length > 0) {
        const user = data[0];

        console.log("Usuário encontrado:", user);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", user.id_usuario);
        localStorage.setItem("userName", user.nome);

        setIsLoggedIn(true); //Atualiza o estado corretamente
        console.log("Login bem-sucedido. Redirecionando...");
        navigate("/profile");
      } else {
        console.log("Nenhum usuário encontrado para essas credenciais.");
        setErrorMessage("E-mail ou senha incorretos.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Erro ao conectar-se ao servidor:", error);
      setErrorMessage("Erro ao conectar-se ao servidor.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="loginPage-container">
      <div className="loginPage-wrapper">
        <div className="loginPage-box">
          <h2 className="loginPage-title">Login</h2>

          <form className="loginPage-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="loginPage-input"
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="loginPage-input"
            />

            <button type="button" onClick={handleLogin} className="loginPage-button">
              Entrar
            </button>
          </form>

          {showErrorModal && (
            <div className="loginPage-modalOverlay">
              <div className="loginPage-modalContent">
                <h2>Erro de Login</h2>
                <p>{errorMessage}</p>
                <button onClick={() => setShowErrorModal(false)} className="loginPage-closeButton">
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Link para criação de conta */}
          <p className="loginPage-registerText">
            Ainda não tem uma conta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="loginPage-registerLink"
            >
              Criar conta
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
