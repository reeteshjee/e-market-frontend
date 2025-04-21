

export default function CartItem({ item, removeFromCart, updateQuantity }) {
    return (
        <>
            <div className="flex items-center py-4 border-b">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                            <button onClick={() => updateQuantity(item.productId, -1)} className="cursor-pointer w-6 h-6 bg-gray-200 rounded-l flex items-center justify-center">−</button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, 1)} className="cursor-pointer w-6 h-6 bg-gray-200 rounded-r flex items-center justify-center">+</button>
                        </div>
                        <span className="font-bold">${item.price}</span>
                    </div>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="cursor-pointer ml-2 text-gray-400 hover:text-red-500">
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </>
    )
}