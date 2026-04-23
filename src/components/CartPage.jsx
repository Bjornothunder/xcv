import { useCart } from "../context/CartContext";

export default function CartPage({ setPage }) {
  const { cart, removeItem, updateQty, subtotal, tax, total, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started.</p>
          <button className="btn-primary" onClick={() => setPage("shop")}>
            Browse Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h2 className="page-title">Your Cart</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-emoji">{item.emoji}</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-unit">{item.unit}</div>
                <div className="cart-item-price">${item.price} each</div>
              </div>
              <div className="cart-item-controls">
                <button
                  className="qty-btn"
                  onClick={() => updateQty(item.id, item.qty - 1)}
                >
                  −
                </button>
                <span className="qty-display">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQty(item.id, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                ${(item.price * item.qty).toFixed(2)}
              </div>
              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn-primary checkout-btn" onClick={() => setPage("checkout")}>
            Proceed to Checkout
          </button>
          <button className="btn-secondary" onClick={() => setPage("shop")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}
