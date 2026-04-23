import { useState, useMemo } from "react";
import { products, categories } from "../data/products";
import ProductCard from "./ProductCard";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const featured = products.filter((p) => p.featured && p.inStock);

  return (
    <main className="shop-page">
      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">Welcome to Green Leaf</h1>
        <p className="hero-sub">
          Premium cannabis products — order online, pick up in store.
        </p>
        <div className="age-notice">🔞 Must be 21+ to purchase. Valid ID required at pickup.</div>
      </section>

      {/* Featured */}
      {activeCategory === "all" && !search && (
        <section className="section">
          <h2 className="section-title">Featured Products</h2>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Catalog */}
      <section className="section">
        <h2 className="section-title">Shop All</h2>
        <div className="search-row">
          <input
            type="search"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-tab ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">No products found.</div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
