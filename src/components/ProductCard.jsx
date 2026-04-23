import { useCart } from "../context/CartContext";

const strainColors = {
  Sativa: "#4ade80",
  Indica: "#a78bfa",
  Hybrid: "#fb923c",
  CBD: "#38bdf8",
};

export default function ProductCard({ product }) {
  const { cart, addItem } = useCart();
  const inCart = cart.find((i) => i.id === product.id);

  return (
    <div className={`product-card ${!product.inStock ? "out-of-stock" : ""}`}>
      <div className="product-emoji">{product.emoji}</div>
      <div className="product-body">
        <div className="product-header-row">
          <h3 className="product-name">{product.name}</h3>
          {product.strain && (
            <span
              className="strain-badge"
              style={{ backgroundColor: strainColors[product.strain] + "30", color: strainColors[product.strain] }}
            >
              {product.strain}
            </span>
          )}
        </div>
        <p className="product-desc">{product.description}</p>
        {product.thc && (
          <div className="product-stats">
            <span className="stat">THC: {product.thc}</span>
            <span className="stat">CBD: {product.cbd}</span>
          </div>
        )}
        <div className="product-footer">
          <div className="product-price">
            ${product.price} <span className="product-unit">/ {product.unit}</span>
          </div>
          {product.inStock ? (
            <button
              className={`add-btn ${inCart ? "in-cart" : ""}`}
              onClick={() => addItem(product)}
            >
              {inCart ? `In Cart (${inCart.qty})` : "Add to Cart"}
            </button>
          ) : (
            <span className="out-label">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
