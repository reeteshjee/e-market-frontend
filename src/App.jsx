import './App.css'
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Cart from './components/Cart';
import ProductItem from './components/ProductItem';

import { useAuth } from "react-oidc-context";



function App() {
    //auth
    const auth = useAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    const handleLogout = () => {
        //window.location.href = import.meta.env.VITE_COGNITO_LOGOUT_URI;
        const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
        const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI
        const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("username");
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const loggedOut = urlParams.get('logout');
        if (loggedOut) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("expires_at");
            localStorage.removeItem("username");
            setLoggedIn(false);
        }
        else if (auth.isAuthenticated) {
            localStorage.setItem("access_token", auth.user.access_token);
            localStorage.setItem("refresh_token", auth.user.refresh_token);
            localStorage.setItem("expires_at", auth.user.expires_at);
            localStorage.setItem("username", auth.user.profile['cognito:username']);
            setLoggedIn(auth.user.profile['cognito:username']);
        }
    }, [auth]);


    //cart
    const [showCart, setShowCart] = useState(false);

    const toggleCart = () => setShowCart(!showCart);
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    const [cartItems, setCartItems] = useState(storedCart ?? []);
    const [cartCount, setCartCount] = useState(storedCart ? storedCart.length : 0);
    const updateQuantity = (productId, change) => {
        setCartItems(cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        ));
    };



    //products
    const fetchProducts = async () => {
        const api_url = `${import.meta.env.VITE_API_URL}/products`;
        fetch(api_url)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
    }
    const searchProducts = async (search) => {
        const api_url = `${import.meta.env.VITE_API_URL}/products?search=${search}`;
        fetch(api_url)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
    }
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setLoggedIn(localStorage.getItem('username') ?? false);
        fetchProducts();
    }, []);



    //cart functions
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        setCartCount(cartItems.length);
    }, [cartItems]);


    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.productId === product.productId);
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
        setShowCart(true);


    };
    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.productId !== productId));
    };
    const cartTotal = Array.isArray(cartItems)
        ? cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
        : 0;

    return (
        <>
            <Header
                auth={auth}
                loggedIn={loggedIn}
                cartCount={cartCount}
                products={products}
                setProducts={setProducts}
                searchProducts={searchProducts}
                handleLogout={handleLogout}
                toggleCart={toggleCart}
            />
            <main className="container mx-auto px-4 py-8">
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Products</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductItem
                                key={product.productId}
                                product={product}
                                addToCart={addToCart}
                            />
                        ))}
                    </div>
                </section>

                <Cart
                    isOpen={showCart}
                    onClose={toggleCart}
                    updateQuantity={updateQuantity}
                    items={cartItems}
                    removeFromCart={removeFromCart}
                    cartTotal={cartTotal}
                />


            </main>
        </>
    )
}

export default App
