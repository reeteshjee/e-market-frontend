import './App.css'
import Header from './components/Header'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import { useState, useEffect } from 'react';

function App() {

  const [showCart, setShowCart] = useState(false);
  const storedCart = JSON.parse(localStorage.getItem('cart'));
  const [cartItems, setCartItems] = useState(storedCart);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://meswlk0rri.execute-api.us-east-1.amazonaws.com/dev/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);





  const toggleCart = () => setShowCart(!showCart);

  const addToCart = (product) => {
    if (!cartItems) {
      setCartItems({ ...product, quantity: 1 });
    } else {
      const existingItem = cartItems.find(item => item.id === product.id);
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
    }
  };
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);


  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

const cartTotal = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
    : 0;  
  const user = false;

  return (
    <>
      <Header cartCount={cartItems ? cartItems.length : 0} user={user} toggleCart={toggleCart} />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
          </div>
          <ProductList products={products} addToCart={addToCart} />
          <Cart
            isOpen={showCart}
            onClose={toggleCart}
            items={cartItems}
            removeFromCart={removeFromCart}
            total={cartTotal}
          />
        </section>
      </main>
    </>
  )
}

export default App
