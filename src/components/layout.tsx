import React from "react";
import Nav from "./nav"; // Importa a Navbar

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Nav /> {/* Navbar aparece em todas as páginas */}
      <main>{children}</main> {/* Renderiza o conteúdo da página */}
    </>
  );
};

export default Layout;
