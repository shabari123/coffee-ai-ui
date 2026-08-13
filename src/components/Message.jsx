import ReactMarkdown from "react-markdown";
import ProductCard from "./ProductCard";

function Message({ sender, text, products = [] }) {
    const isUser = sender === "User";

    return (
        <div className={isUser ? "message user" : "message ai"}>
            <div className="bubble">

                <ReactMarkdown>
                    {text}
                </ReactMarkdown>

                {products.length > 0 && (
                    <div className="products-container">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Message;