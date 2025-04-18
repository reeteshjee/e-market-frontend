import CartItem from "./CartItem";


export default function Cart({ isOpen, onClose, items, updateQuantity, removeFromCart, total }) {
    if (!isOpen) return null;

    return (
        <>
            <div id="cartOverlay" className="fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300">
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Your Cart ({items.length})</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {items.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    removeFromCart={removeFromCart}
                                />
                            ))}
                        </div>

                        <div className="pt-4 border-t mt-4">
                            <div className="flex justify-between mb-2">
                                <span>Total</span>
                                <span className="font-bold">${total}</span>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-150">Place Order (${total})</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}