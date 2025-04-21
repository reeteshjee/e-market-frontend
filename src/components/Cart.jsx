import { useState } from "react";
import CartItem from "./CartItem";

export default function Cart({
    isOpen,
    onClose,
    items,
    updateQuantity,
    removeFromCart,
    cartTotal,
    placeOrder,
    orders = [],
}) {
    const [activeTab, setActiveTab] = useState("cart");

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={onClose}
            />
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-4">
                            <button
                                className={`cursor-pointer text-xl font-semibold ${activeTab === "cart" ? "text-blue-600" : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("cart")}
                            >
                                Cart ({items?.length || 0})
                            </button>
                            <button
                                className={`cursor-pointer text-xl font-semibold ${activeTab === "history" ? "text-blue-600" : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("history")}
                            >
                                Orders
                            </button>
                        </div>
                        <button onClick={onClose} className="text-xl cursor-pointer text-gray-500 hover:text-gray-700">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === "cart" ? (
                            items && items.length > 0 ? (
                                [...items].reverse().map((item) => (
                                    <CartItem
                                        key={item.productId}
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeFromCart={removeFromCart}
                                    />
                                ))
                            ) : (
                                <p>Your cart is empty.</p>
                            )
                        ) : orders.length > 0 ? (
                            <ul className="space-y-4">
                                {orders.map((order, index) => (
                                    <li key={index} className="bg-blue-100 rounded p-3 text-sm">
                                        <p className="font-medium">Order #{order.orderId}</p>
                                        <p className="text-gray-500">
                                            Date: {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        <p>Total: ${order.totalPrice}</p>
                                        <p>Status: {order.orderStatus}</p>
                                        <ul className="mt-2 ml-3 list-disc">
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.name} × {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No past orders yet.</p>
                        )}
                    </div>

                    {/* Footer */}
                    {activeTab === "cart" && (
                        <div className="pt-4 border-t mt-4">
                            <div className="flex justify-between mb-2">
                                <span>Total</span>
                                <span className="font-bold">${cartTotal}</span>
                            </div>
                            <button
                                onClick={placeOrder}
                                className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-150"
                            >
                                Place Order (${cartTotal})
                            </button>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
}
