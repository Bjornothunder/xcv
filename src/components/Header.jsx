import { useCart } from "../context/CartContext";

export default function Header({ page, setPage }) {
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => setPage("shop")} style={{ cursor: "pointer" }}>
          <span className="logo-leaf">🌿</span>
          <div>
            <div className="logo-name">Green Leaf Dispensary</div>
            <div className="logo-tagline">Premium Cannabis Products</div>
          </div>
        </div>
        <nav className="header-nav">
          <button
            className={`nav-btn ${page === "shop" ? "active" : ""}`}
            onClick={() => setPage("shop")}
          >
            Shop
          </button>
          <button
            className={`nav-btn ${page === "cart" ? "active" : ""}`}
            onClick={() => setPage("cart")}
          >
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
