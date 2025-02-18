import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import "./LoginPage.css"; // Descomente quando houver um arquivo CSS

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ FUTURO BACKEND: Verificar se o usuário já está logado através de um token JWT no localStorage
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLogin = () => {
    // ✅ FUTURO BACKEND: Aqui será feita a requisição para a API de login
    fetch("/users.json") // Substituir por `fetch("https://sua-api.com/login")`
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar os usuários.");
        }
        return response.json();
      })
      .then((users) => {
        // ✅ FUTURO BACKEND: Remover essa busca local e usar a resposta da API
        const user = users.find(
          (user: { username: string; password: string }) =>
            user.username === username && user.password === password
        );

        if (user) {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true"); // ✅ FUTURO BACKEND: Trocar por token JWT
          navigate("/profile"); // Redireciona para a página do usuário
        } else {
          setShowErrorModal(true);
          setErrorMessage("Usuário ou senha inválidos. Tente novamente.");
        }
      })
      .catch((error) => {
        console.error("Erro ao conectar-se ao servidor:", error);
        setShowErrorModal(true);
        setErrorMessage("Erro ao conectar-se ao servidor.");
      });
  };

  return (
    <div className="loginPage-container">
      <div className="loginPage-wrapper">
        <div className="loginPage-box">
          <h2 className="loginPage-title">Login</h2>

          <div className="loginPage-socialLogin">
            {/* ✅ FUTURO BACKEND: Implementar login com Google OAuth */}
            <button className="loginPage-socialButton" onClick={() => alert("Login com Google ainda não implementado.")}>
              <span>🔵</span> Entrar com Google
            </button>
            
            {/* ✅ FUTURO BACKEND: Implementar login com GitHub OAuth */}
            <button className="loginPage-socialButton" onClick={() => alert("Login com GitHub ainda não implementado.")}>
              <span>🐙</span> Entrar com Github
            </button>
          </div>

          <p className="loginPage-orText">Ou faça login com seu email</p>

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

            <div className="loginPage-options">
              <label>
                <input type="checkbox" /> Manter-me conectado
              </label>
              <a href="#" className="loginPage-forgotPassword">Esqueceu a senha?</a>
            </div>

            {/* ✅ FUTURO BACKEND: Alterar para chamar API de autenticação */}
            <button type="button" onClick={handleLogin} className="loginPage-button">
              Entrar
            </button>
          </form>

          {isLoggedIn && <p className="loginPage-success">Você está logado com sucesso!</p>}

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
            <a href="/register" className="loginPage-registerLink">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
