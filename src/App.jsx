import './App.css'
import Header from './components/Header'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import { useState, useEffect } from 'react';

function App() {

  const [showCart, setShowCart] = useState(false);
  const storedCart = JSON.parse(localStorage.getItem('cart'));
  const [cartItems, setCartItems] = useState(storedCart);

  const products = [
    { id: 1, name: 'Premium T-Shirt', price: 24.99, description: 'Classic fit, 100% cotton', image: 'https://mms-images.out.customink.com/mms/images/catalog/cade4ebc1252468e58946fd4b3509688/colors/4104/views/alt/front_large.png?autoNegate=1&design=uaj0-00cy-5555&digest=000000028&ixbg=%23f5f5f5&ixfm=jpeg&ixq=60&ixw=900&placeMax=1&placeMaxPct=0.8&placeUseProduct=1&placeUseView=front' },
    { id: 2, name: 'Wireless Earbuds', price: 89.99, description: '24-hour battery life, water resistant', image: 'https://m.media-amazon.com/images/I/61Mn590rlnL.jpg' },
    { id: 3, name: 'Smart Watch', price: 129.99, description: 'Fitness tracking, phone notifications', image: 'https://target.scene7.com/is/image/Target/GUEST_1d1c042e-2121-489f-92d9-98e20c5608ff?wid=800&hei=800&qlt=80&fmt=pjpeg' },
    { id: 4, name: 'Coffee Maker', price: 59.99, description: '12-cup capacity, programmable', image: 'https://i5.walmartimages.com/asr/1458dfab-fe6c-4b8f-b672-40c0de6b6f31.0b69988981860c27331e02a687b073b7.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF' },
  ];




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
