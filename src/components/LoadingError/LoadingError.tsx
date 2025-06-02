// src/components/LoadingError/LoadingError.tsx
import React from "react";
import "./LoadingError.css";

interface LoadingErrorProps {
  loading: boolean;
  error: string | null;
}

const LoadingError: React.FC<LoadingErrorProps> = ({ loading, error }) => {
  // Se estiver carregando, exibo um spinner com a mensagem de carregamento
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  // Se houve algum erro, exibo a mensagem de erro recebida via prop
  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  // Se não estiver carregando nem tiver erro, não renderiza nada
  return null;
};

export default LoadingError;
