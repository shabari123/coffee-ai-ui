function ProductCard({ product }) {
    return (
        <div className="product-card">
            {product.image_url && (
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                />
            )}

            <div className="product-info">
                <h3>{product.name}</h3>

                <p className="product-price">
                    ₹{product.price}
                </p>

                <p className="product-stock">
                    {product.stock_status === "instock"
                        ? "In Stock"
                        : "Out of Stock"}
                </p>

                <a
                    href={product.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-button"
                >
                    View Product
                </a>
            </div>
        </div>
    );
}

export default ProductCard;