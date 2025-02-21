import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./errorModal"; // Importa o modal genérico

const RegisterPage = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (senha !== confirmSenha) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, chave_pix: chavePix || null }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erro ao criar conta.");
      }

      setSuccessMessage("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="registerPage-container">
      <div className="registerPage-wrapper">
        <div className="registerPage-box">
          <h2 className="registerPage-title">Criar Conta</h2>
          <p className="registerPage-orText">Preencha seus dados para se cadastrar</p>

          <form className="registerPage-form">
            <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} className="registerPage-input" />
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="registerPage-input" />
            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="registerPage-input" />
            <input type="password" placeholder="Confirmar Senha" value={confirmSenha} onChange={(e) => setConfirmSenha(e.target.value)} className="registerPage-input" />
            <input type="text" placeholder="Chave Pix (Opcional)" value={chavePix} onChange={(e) => setChavePix(e.target.value)} className="registerPage-input" />

            <button type="button" onClick={handleRegister} className="registerPage-button">Criar Conta</button>
          </form>

          {successMessage && <p className="registerPage-success">{successMessage}</p>}

          {/* Exibe o modal se houver um erro */}
          <ErrorModal message={errorMessage} onClose={() => setErrorMessage("")} />

          <p className="registerPage-registerText">
            Já tem uma conta? <a href="/login" className="registerPage-registerLink">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
