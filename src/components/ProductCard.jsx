import { useCart } from "../context/CartContext";

const strainColors = {
  Sativa:  { bg: "rgba(74,124,89,0.2)",  text: "#5e9e72" },
  Indica:  { bg: "rgba(126,87,194,0.2)", text: "#a78bfa" },
  Hybrid:  { bg: "rgba(201,168,76,0.2)", text: "#c9a84c" },
  CBD:     { bg: "rgba(56,189,248,0.2)", text: "#38bdf8" },
};

export default function ProductCard({ product }) {
  const { cart, addItem } = useCart();
  const inCart = cart.find((i) => i.id === product.id);
  const colors = strainColors[product.strain] ?? { bg: "rgba(255,255,255,0.1)", text: "#aaa" };

  return (
    <div className={`product-card ${!product.inStock ? "out-of-stock" : ""}`}>
      <div className="product-emoji">{product.emoji}</div>
      <div className="product-body">
        <div className="product-header-row">
          <h3 className="product-name">{product.name}</h3>
          {product.strain && (
            <span
              className="strain-badge"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {product.strain}
            </span>
          )}
        </div>
        <p className="product-desc">{product.description}</p>
        {product.thc && (
          <div className="product-stats">
            <span className="stat">{product.thc}</span>
            {product.cbd && <span className="stat">{product.cbd}</span>}
          </div>
        )}
        {product.promoCode && (
          <div className="product-promo-hint">
            🏷 Use code <strong>{product.promoCode}</strong> at checkout
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
