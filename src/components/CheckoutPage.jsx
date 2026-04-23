import { useState } from "react";
import { useCart } from "../context/CartContext";
import { PROMO_CODES } from "../data/products";

const PICKUP_TIMES = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM",  "1:30 PM",
  "2:00 PM",  "2:30 PM",  "3:00 PM",  "3:30 PM",
  "4:00 PM",  "4:30 PM",  "5:00 PM",  "5:30 PM",
  "6:00 PM",  "6:30 PM",  "7:00 PM",  "7:30 PM",
];

const today = new Date();
const dateOptions = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
});

function computeDiscount(cart, promo) {
  if (!promo) return 0;
  const code = PROMO_CODES[promo];
  if (!code) return 0;
  if (code.type === "percent-category") {
    const eligible = cart.filter((i) => i.category === code.category);
    return eligible.reduce((sum, i) => sum + i.price * i.qty * code.amount, 0);
  }
  if (code.type === "rosin") {
    const rosinItems = cart.filter((i) => i.name.toLowerCase().includes("rosin"));
    const totalQty = rosinItems.reduce((sum, i) => sum + i.qty, 0);
    const pairs = Math.floor(totalQty / 2);
    return pairs * code.amount;
  }
  return 0;
}

export default function CheckoutPage({ setPage }) {
  const { cart, total, tax, subtotal, clearCart } = useCart();
  const [fulfillment, setFulfillment] = useState("pickup");
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    dob: "", address: "",
    pickupDate: dateOptions[0], pickupTime: "12:00 PM",
    notes: "",
  });
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMsg, setPromoMsg] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [orderNum] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const [errors, setErrors] = useState({});

  const discount = computeDiscount(cart, appliedPromo);
  const finalTotal = Math.max(0, total - discount);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoMsg({ type: "success", text: `✓ ${PROMO_CODES[code].description}` });
    } else {
      setAppliedPromo(null);
      setPromoMsg({ type: "error", text: "Invalid promo code." });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Valid 10-digit phone required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.dob) {
      e.dob = "Required";
    } else {
      const age = (new Date() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 21) e.dob = "Must be 21 or older";
    }
    if (fulfillment === "delivery" && !form.address.trim()) e.address = "Delivery address required";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <main className="checkout-page">
        <div className="confirmation">
          <div className="confirm-icon">✅</div>
          <h2>Order Placed!</h2>
          <p className="confirm-order-num">Order #{orderNum}</p>
          <p>
            Thanks, <strong>{form.firstName}</strong>! Your order is confirmed.{" "}
            {fulfillment === "pickup"
              ? <>Ready for pickup on <strong>{form.pickupDate}</strong> at <strong>{form.pickupTime}</strong>.</>
              : <>We'll deliver to <strong>{form.address}</strong> on <strong>{form.pickupDate}</strong>.</>
            }
          </p>
          <p className="confirm-note">
            Please have a valid government-issued ID showing you are 21+ ready at {fulfillment === "pickup" ? "pickup" : "delivery"}.
          </p>
          <div className="confirm-address">
            <strong>Pine State Provisions</strong><br />
            Hemp Dispensary · Est. 2026<br />
            Visit us at <strong>Pinestatehemp.com</strong><br />
            Mon–Sat 10AM–8PM
          </div>
          <button className="btn-primary" onClick={() => setPage("shop")}>
            Shop Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <button className="back-btn" onClick={() => setPage("cart")}>← Back to Cart</button>
      <h2 className="page-title">Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>

          {/* Fulfillment */}
          <section className="form-section">
            <h3>How do you want it?</h3>
            <div className="fulfillment-toggle">
              <button
                type="button"
                className={`fulfill-btn ${fulfillment === "pickup" ? "active" : ""}`}
                onClick={() => setFulfillment("pickup")}
              >
                <span className="fulfill-icon">🏪</span>
                Pickup
              </button>
              <button
                type="button"
                className={`fulfill-btn ${fulfillment === "delivery" ? "active" : ""}`}
                onClick={() => setFulfillment("delivery")}
              >
                <span className="fulfill-icon">🚗</span>
                Delivery
              </button>
            </div>
            {fulfillment === "delivery" && (
              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  name="address"
                  placeholder="123 Main St, City, State ZIP"
                  value={form.address}
                  onChange={handleChange}
                  className={errors.address ? "error" : ""}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>
            )}
          </section>

          {/* Personal Info */}
          <section className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} className={errors.firstName ? "error" : ""} />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} className={errors.lastName ? "error" : ""} />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={handleChange} className={errors.phone ? "error" : ""} />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={errors.email ? "error" : ""} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Date of Birth (must be 21+)</label>
              <input name="dob" type="date" value={form.dob} onChange={handleChange} className={errors.dob ? "error" : ""} />
              {errors.dob && <span className="field-error">{errors.dob}</span>}
            </div>
          </section>

          {/* Schedule */}
          <section className="form-section">
            <h3>{fulfillment === "pickup" ? "Pickup" : "Delivery"} Schedule</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <select name="pickupDate" value={form.pickupDate} onChange={handleChange}>
                  {dateOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Time</label>
                <select name="pickupTime" value={form.pickupTime} onChange={handleChange}>
                  {PICKUP_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Special Instructions (optional)</label>
              <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Any notes for your order..." />
            </div>
          </section>

          <div className="age-notice">
            🔞 By placing this order you confirm you are 21+ and will present a valid ID.
          </div>

          <button type="submit" className="btn-primary checkout-btn">
            Place Order — ${finalTotal.toFixed(2)}
          </button>
        </form>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.emoji} {item.name} × {item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />

          {/* Promo code */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Promo Code
            </label>
            <div className="promo-row" style={{ marginTop: 6 }}>
              <input
                className="form-group input"
                style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, outline: "none", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "inherit" }}
                placeholder="e.g. EATS"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
              />
              <button type="button" className="promo-apply-btn" onClick={applyPromo}>Apply</button>
            </div>
            {promoMsg && (
              <p className={promoMsg.type === "success" ? "promo-success" : "promo-error"} style={{ marginTop: 6 }}>
                {promoMsg.text}
              </p>
            )}
          </div>

          <div className="summary-divider" />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="summary-row discount-row">
              <span>Promo ({appliedPromo})</span>
              <span>−${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-divider" />
          <div className="summary-row total-row">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
