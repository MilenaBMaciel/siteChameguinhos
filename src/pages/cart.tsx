import React, { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Carrega os itens do carrinho do arquivo JSON
    fetch('/cart.json')
      .then((response) => response.json())
      .then((data) => setCartItems(data))
      .catch((error) => console.error('Error loading cart items:', error));
  }, []);

  // Função para calcular o total do carrinho
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h2>Seu Carrinho</h2>
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Preço: R${item.price.toFixed(2)}</p>
                <p>Quantidade: {item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: R${calculateTotal().toFixed(2)}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
