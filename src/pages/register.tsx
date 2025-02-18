import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "./RegisterPage.css"; // Mantendo seu CSS externo padrão

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    // 🚀 FUTURO BACKEND: Verificar se as senhas coincidem antes de enviar ao servidor
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      setShowErrorModal(true);
      return;
    }

    // 🚀 FUTURO BACKEND: Enviar os dados para um backend para criação do usuário
    // Aqui simularíamos uma chamada à API de registro, substitua por um `fetch` no futuro
    console.log("Usuário criado:", { username, password });

    // Simulando um registro bem-sucedido
    setSuccessMessage("Conta criada com sucesso! Redirecionando...");
    
    // 🚀 FUTURO BACKEND: Se o backend confirmar sucesso, então redirecionar
    setTimeout(() => {
      navigate("/login"); // Redirecionar para a página de login
    }, 2000);
  };

  return (
    <div className="loginPage-container">
      <div className="loginPage-wrapper">
        <div className="loginPage-box">
          <h2 className="loginPage-title">Criar Conta</h2>

          <p className="loginPage-orText">Preencha seus dados para se cadastrar</p>

          <form className="loginPage-form">
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="loginPage-input"
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="loginPage-input"
            />

            <input
              type="password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="loginPage-input"
            />

            <button type="button" onClick={handleRegister} className="loginPage-button">
              Criar Conta
            </button>
          </form>

          {successMessage && <p className="loginPage-success">{successMessage}</p>}

          {showErrorModal && (
            <div className="loginPage-modalOverlay">
              <div className="loginPage-modalContent">
                <h2>Erro</h2>
                <p>{errorMessage}</p>
                <button onClick={() => setShowErrorModal(false)} className="loginPage-closeButton">
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Link para login caso o usuário já tenha conta */}
          <p className="loginPage-registerText">
            Já tem uma conta?{" "}
            <a href="/login" className="loginPage-registerLink">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
