
import { useEffect, useState } from "react";



export default function Header({ auth, products, setProducts, searchProducts, loggedIn, handleLogout, cartCount, toggleCart }) {
    const [search, setSearch] = useState();
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (search != '') {
                searchProducts(search);
            } else {
                setProducts(products);
            }
        }
    };
    return (
        <>
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">EM</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">E-Market</span>
                    </div>


                    <div className="hidden md:flex flex-1 max-w-xl mx-6">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <i className="fas fa-search"></i>
                            </div>
                        </div>
                    </div>


                    <nav className="flex items-center space-x-6">

                        <div className="relative">
                            <button onClick={toggleCart} className="cursor-pointer flex items-center">
                                <i className="fas fa-shopping-cart text-lg"></i>
                                <span className="ml-2 hidden md:inline">Cart</span>
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>
                            </button>
                        </div>


                        {loggedIn ? (
                            <div className="relative group">
                                <button className="flex items-center">
                                    <i className="fas fa-user-circle text-lg"></i>
                                    <span className="ml-2 hidden md:inline">{localStorage.getItem('username')}</span>
                                    <i className="fas fa-chevron-down ml-1 text-xs"></i>
                                </button>

                                <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                                    <button
                                        onClick={() => handleLogout()}
                                        className="cursor-pointer block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => auth.signinRedirect()} className="cursor-pointer flex items-center">
                                <i className="fas fa-user-circle text-lg"></i>
                                <span className="ml-2 hidden md:inline">Login</span>
                            </button>
                        )}
                    </nav>
                </div>


                <div className="md:hidden px-4 pb-4">
                    <div className="relative w-full">
                        <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <i className="fas fa-search"></i>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}