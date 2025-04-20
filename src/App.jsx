import './App.css'
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Cart from './components/Cart';
import Toast from './components/Toast'
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
        clearSession();
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };
    const clearSession = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("username");
        setLoggedIn(false);
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const loggedOut = urlParams.get('logout');
        if (loggedOut) {
            clearSession();
        }
        else if (auth.isAuthenticated) {
            localStorage.setItem("access_token", auth.user.id_token);
            localStorage.setItem("refresh_token", auth.user.refresh_token);
            localStorage.setItem("expires_at", auth.user.expires_at);
            localStorage.setItem("username", auth.user.profile.email);
            setLoggedIn(auth.user.profile.email);
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

    //orders
    const [orders, setOrders] = useState([]);
    const fetchOrders = async () => {
        const api_url = `${import.meta.env.VITE_API_URL}/orders`;
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(api_url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


    useEffect(() => {
        if (loggedIn) {
            fetchOrders();
        }
    }, [loggedIn]);


    const placeOrder = async () => {
        console.log(loggedIn);
        if (!loggedIn) {
            showToast("Please login to place order", 'error');
            return;
        }
        const api_url = `${import.meta.env.VITE_API_URL}/orders`;
        const token = localStorage.getItem('access_token');

        const orderData = {
            items: cartItems,
            totalPrice: parseFloat(cartTotal)
        };

        try {
            const response = await fetch(api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error(`Failed to place order: ${response.status}`);
            }

            const data = await response.json();
            showToast("Order has been placed");
            setCartItems([]);
            fetchOrders();
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    //Toast
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
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


    const searchProducts = async (keyword) => {
        const api_url = `${import.meta.env.VITE_API_URL}/products?search=${keyword}`;
        fetch(api_url)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            });

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
        showToast("Added to cart");


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
                fetchProducts={fetchProducts}
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
                    placeOrder={placeOrder}
                    orders={orders}
                />
                {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}


            </main>
        </>
    )
}

export default App
