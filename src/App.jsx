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
          <p className="footer-name">Pine State Provisions</p>
          <p>© 2026 Pine State Provisions · Hemp Dispensary · For adults 21+ only</p>
          <p className="footer-addr">Pinestatehemp.com · Mon–Sat 10AM–8PM</p>
        </footer>
      </div>
    </CartProvider>
  );
}
