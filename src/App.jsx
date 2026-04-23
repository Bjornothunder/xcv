import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import ShopPage from "./components/ShopPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("shop");

  return (
    <CartProvider>
      <div className="app">
        <Header page={page} setPage={setPage} />
        {page === "shop" && <ShopPage />}
        {page === "cart" && <CartPage setPage={setPage} />}
        {page === "checkout" && <CheckoutPage setPage={setPage} />}
        <footer className="footer">
          <p>© 2026 Green Leaf Dispensary · For adults 21+ only · All rights reserved.</p>
          <p className="footer-addr">420 Main Street, Suite 1 · Mon–Sat 10AM–8PM · (555) 420-0000</p>
        </footer>
      </div>
    </CartProvider>
  );
}
