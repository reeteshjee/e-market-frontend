import CartItem from "./CartItem";


export default function Cart({ isOpen, onClose, items, updateQuantity, removeFromCart, cartTotal }) {
    if (!isOpen) return null;

    return (
        <>
            <div id="cartOverlay">
                <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300">
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Your Cart ({items ? items.length : 0})</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {items && items.length > 0 ? (
                                items.map(item => (
                                    <CartItem
                                        key={item.productId}
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeFromCart={removeFromCart}
                                    />
                                ))
                            ) : (
                                <p>Your cart is empty.</p>
                            )}
                        </div>

                        <div className="pt-4 border-t mt-4">
                            <div className="flex justify-between mb-2">
                                <span>Total</span>
                                <span className="font-bold">${cartTotal}</span>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-150">Place Order (${cartTotal})</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}