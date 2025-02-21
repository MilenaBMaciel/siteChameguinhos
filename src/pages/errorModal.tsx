import React from "react";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  if (!message) return null; // Se não houver mensagem, não renderiza o modal

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Erro</h2>
        <p>{message}</p>
        <button onClick={onClose} className="close-button">Fechar</button>
      </div>
    </div>
  );
};

export default ErrorModal;
