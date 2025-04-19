

export default function ProductItem({ product, addToCart }) {
    return (
        <>
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        <span className="text-blue-600 font-bold">${product.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                    <button onClick={() => addToCart(product)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-150">Add to Cart</button>
                </div>
            </div>
        </>
    )
}