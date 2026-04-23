import { useState } from "react";
import { useCart } from "../context/CartContext";

const PICKUP_TIMES = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
];

const today = new Date();
const dateOptions = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
});

export default function CheckoutPage({ setPage }) {
  const { cart, total, tax, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: "",
    pickupDate: dateOptions[0],
    pickupTime: "12:00 PM",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [orderNum] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Valid 10-digit phone required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.dob) {
      e.dob = "Required";
    } else {
      const birth = new Date(form.dob);
      const age = (new Date() - birth) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 21) e.dob = "Must be 21 or older";
    }
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
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
            Thanks, <strong>{form.firstName}</strong>! Your order is confirmed.
            We'll have it ready for pickup on{" "}
            <strong>{form.pickupDate}</strong> at <strong>{form.pickupTime}</strong>.
          </p>
          <p className="confirm-note">
            Please bring a valid government-issued ID showing you are 21+.
          </p>
          <div className="confirm-address">
            <strong>Green Leaf Dispensary</strong>
            <br />
            420 Main Street, Suite 1<br />
            Open Mon–Sat 10AM–8PM
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
      <button className="back-btn" onClick={() => setPage("cart")}>
        ← Back to Cart
      </button>
      <h2 className="page-title">Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <section className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Date of Birth (must be 21+)</label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className={errors.dob ? "error" : ""}
              />
              {errors.dob && <span className="field-error">{errors.dob}</span>}
            </div>
          </section>

          <section className="form-section">
            <h3>Pickup Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Pickup Date</label>
                <select name="pickupDate" value={form.pickupDate} onChange={handleChange}>
                  {dateOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Pickup Time</label>
                <select name="pickupTime" value={form.pickupTime} onChange={handleChange}>
                  {PICKUP_TIMES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Special Instructions (optional)</label>
              <textarea
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                placeholder="Any notes for your order..."
              />
            </div>
          </section>

          <div className="age-notice">
            🔞 By placing this order you confirm you are 21+ and will present a valid ID at pickup.
          </div>

          <button type="submit" className="btn-primary checkout-btn">
            Place Order
          </button>
        </form>

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
        </div>
      </div>
    </main>
  );
}
