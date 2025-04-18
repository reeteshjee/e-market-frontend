import ProductItem from "./ProductItem";


export default function ProductList({ products, addToCart }) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductItem key={product.id} product={product} addToCart={addToCart} />
                ))}

            </div>
        </>
    )
}