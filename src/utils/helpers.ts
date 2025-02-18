// Definição do tipo para os itens do carrinho
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  // Nome da chave para armazenar os dados no localStorage
  const STORAGE_KEY = "cart_data";
  
  // Função para salvar os dados no localStorage
  export function saveLocalData(cart: CartItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }
  
  // Função para obter os dados do localStorage
  export function getLocalData(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  // Função para definir os estados do carrinho a partir do localStorage
  export function setLocalData(setCart: (cart: CartItem[]) => void): void {
    const localData = getLocalData();
    setCart(localData);
  }
  
  // Função para adicionar um item ao carrinho
  export function addToCart(cart: CartItem[], newItem: CartItem): CartItem[] {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.id === newItem.id);
  
    if (existingItem) {
      existingItem.quantity += newItem.quantity;
    } else {
      updatedCart.push(newItem);
    }
  
    saveLocalData(updatedCart);
    return updatedCart;
  }
  
  // Função para atualizar a quantidade de um item no carrinho
  export function updateCartItemQuantity(cart: CartItem[], itemId: string, quantity: number): CartItem[] {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(quantity, 0) } : item
    );
  
    saveLocalData(updatedCart);
    return updatedCart.filter((item) => item.quantity > 0);
  }
  
  // Função para calcular o subtotal do carrinho
  export function getCartSubTotal(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  }
  