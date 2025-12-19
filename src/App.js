import { useEffect, useState } from "react";
import { orderApi, userApi, productApi, compositeApi } from "./apiFactory";

export default function App() {
  const [root, setRoot] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await orderApi.listOrders();
        setRoot(r.data);
      } catch (e) { setError(String(e)); }
    })();
  }, []);

  const [orderPing, setOrderPing] = useState(null);

  // async function pingOrder() {
  //   setError("");
  //   try {
  //     const base = process.env.REACT_APP_ORDER_API_BASE_URL;
  //     if (!base) throw new Error("Order base URL undefined");
  //     const r = await fetch(`${base}/healthz`);
  //     if (!r.ok) throw new Error(`Order /healthz -> HTTP ${r.status}`);
  //     setOrderPing(await r.json());
  //   } catch (e) {
  //     setError(String(e));
  //   }
  // }

  const [orderPingRaw, setOrderPingRaw] = useState("");

  async function pingOrder() {
    setError("");
    setOrderPingRaw("");

    try {
      const base = process.env.REACT_APP_ORDER_API_BASE_URL;
      if (!base) throw new Error("REACT_APP_ORDER_API_BASE_URL undefined");

      const url = `${base.replace(/\/$/, "")}/`;
      const r = await fetch(url, { method: "GET" });

      const text = await r.text(); // 关键：先拿原文
      setOrderPingRaw(`HTTP ${r.status}\n${text}`);

      if (!r.ok) throw new Error(`Order / -> HTTP ${r.status}`);

    } catch (e) {
      setError(String(e));
    }
  }


  async function getOrders() {
    setError("");
    try {
      const r = await orderApi.listOrders();
      setOrders(Array.isArray(r.data) ? r.data : []);
      console.log("listOrders raw:", r);
      console.log("listOrders data:", r.data);
    } catch (e) { setError(String(e)); }
  }

  async function compositeListProducts() {
    setError("");
    try {
      const r = await compositeApi.listProducts();
      setProducts(Array.isArray(r.data) ? r.data : []);
    } catch (e) { setError(String(e)); }
  }

  const [productPing, setProductPing] = useState(null);

  async function pingProduct() {
    setError("");
    try {
      const base = process.env.REACT_APP_PRODUCT_API_BASE_URL;
      if (!base) throw new Error("REACT_APP_PRODUCT_API_BASE_URL undefined");

      const r = await fetch(`${base}/`, { method: "GET" });
      if (!r.ok) throw new Error(`Product / -> HTTP ${r.status}`);
      const data = await r.json();
      setProductPing(data);

    } catch (e) {
      setError(String(e));
    }
  }

  const [userPing, setUserPing] = useState(null);

  async function pingUser() {
    setError("");
    try {
      const base = process.env.REACT_APP_USER_API_BASE_URL;
      if (!base) throw new Error("REACT_APP_USER_API_BASE_URL undefined");

      const r = await fetch(`${base}/`, { method: "GET" });
      if (!r.ok) throw new Error(`User / -> HTTP ${r.status}`);
      const data = await r.json();
      setUserPing(data);
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Order Management UI</h1>
      <p>API: <code>{process.env.REACT_APP_API_BASE_URL}</code></p>

      <section style={card}>
        <h2>Orders</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={pingOrder}>GetOrders</button>
        </div>
        <pre style={pre}>{orderPingRaw || "—"}</pre>
      </section>

      {error && (
        <section style={{ ...card, borderColor: "#c00" }}>
          <h3 style={{ color: "#c00" }}>Error</h3>
          <pre style={pre}>{error}</pre>
        </section>
      )}

      <section style={card}>
        <h2>Product: quick ping</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={pingProduct}>Ping Product “/”</button>
        </div>
        <pre style={pre}>{productPing ? JSON.stringify(productPing, null, 2) : "—"}</pre>
      </section>

      <section style={card}>
        <h2>User: quick ping</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={pingUser}>Ping User “/”</button>
        </div>
        <pre style={pre}>{userPing ? JSON.stringify(userPing, null, 2) : "—"}</pre>
      </section>

      <section style={card}>
        <h2>Composite: quick ping</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={compositeListProducts}>List Products via Composite</button>
        </div>
        <pre style={pre}>{products.length ? JSON.stringify(products, null, 2) : "—"}</pre>
      </section>
    </div>

  );
}

const card = { border: "1px solid #ddd", padding: 16, borderRadius: 12, marginBottom: 24 };
const pre = { background: "#f7f7f7", padding: 12, borderRadius: 8, overflowX: "auto" };
