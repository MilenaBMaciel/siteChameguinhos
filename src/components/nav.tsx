import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";

const Nav: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    // Atualiza o estado ao ouvir mudanças no login
    const updateAuthStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener("authChange", updateAuthStatus);

    return () => {
      window.removeEventListener("authChange", updateAuthStatus);
    };
  }, []);

  return (
    <header className="nav-header">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img alt="Logo" src="/images/chameguinhos.svg" />
        </Link>
        <div className="nav-right">
          <Link to={isLoggedIn ? "/profile" : "/login"} className="profile-icon" aria-label="Perfil">
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <Link to="/cart" className="cart-icon" aria-label="Carrinho">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Nav;
