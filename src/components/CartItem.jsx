

export default function CartItem({ item, removeFromCart }) {
    return (
        <>
            <div className="flex items-center py-4 border-b">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                        <span className="font-bold">${item.price}</span>
                    </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="ml-2 text-gray-400 hover:text-red-500">
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </>
    )
}