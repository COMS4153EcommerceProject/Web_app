import { useEffect, useState } from "react";
import { orderApi, userApi, productApi, compositeApi } from "./apiFactory";

export default function App() {
  const [root, setRoot] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await orderApi.listOrders();
        setRoot(r.data);
      } catch (e) { setError(String(e)); }
    })();
  }, []);

  async function refreshOrders() {
    setError("");
    try {
      const r = await orderApi.listOrders(); // optionally: { user_id: "uuid", status: "PAID" }
      setOrders(Array.isArray(r.data) ? r.data : []);
    } catch (e) { setError(String(e)); }
  }

  async function quickCreateOrder() {
    setError("");
    try {
      // NOTE: Your FastAPI models expect UUIDs and a specific shape.
      // Replace with valid data that matches OrderCreate in your backend.
      const example = {
        user_id: "11111111-1111-1111-1111-111111111111",
        status: "PENDING",
        total_price: 0.0,
      };
      await orderApi.createOrder(example);
      await refreshOrders();
      alert("Order created (dummy payload)!");
    } catch (e) { setError(String(e)); }
  }

  const [productPing, setProductPing] = useState(null);

  async function pingProduct() {
    setError("");
    try {
      const base = process.env.REACT_APP_PRODUCT_BASE_URL;
      if (!base) throw new Error("REACT_APP_PRODUCT_BASE undefined");

      const r = await fetch(`${base}/`, { method: "GET" });
      if (!r.ok) throw new Error(`Product / -> HTTP ${r.status}`);
      const data = await r.json();
      setProductPing(data);

    } catch (e) {
      setError(String(e));
    }
  }

  // const [compositePing, setCompositePing] = useState(null);

  // async function pingComposite() {
  //   setError("");
  //   try {
  //     const base = process.env.REACT_APP_COMPOSITE_BASE;
  //     if (!base) throw new Error("REACT_APP_COMPOSITE_BASE undefined");

  //     const r = await fetch(`${base}/`, { method: "GET" });
  //     if (!r.ok) throw new Error(`Composite / -> HTTP ${r.status}`);
  //     const data = await r.json();
  //     setCompositePing(data);
  //   } catch (e) {
  //     setError(String(e));
  //   }
  // }

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Order Management UI</h1>
      <p>API: <code>{process.env.REACT_APP_API_BASE_URL}</code></p>

      <section style={card}>
        <h2>Orders</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={refreshOrders}>listOrders</button>
          <button onClick={quickCreateOrder}>Quick Create (demo)</button>
        </div>
        <pre style={pre}>{JSON.stringify(orders, null, 2) || "—"}</pre>
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

      {/* <section style={card}>
        <h2>Composite: quick ping</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={pingComposite}>Ping Composite “/”</button>
        </div>
        <pre style={pre}>{compositePing ? JSON.stringify(compositePing, null, 2) : "—"}</pre>
      </section> */}
    </div>
  );
}

const card = { border: "1px solid #ddd", padding: 16, borderRadius: 12, marginBottom: 24 };
const pre = { background: "#f7f7f7", padding: 12, borderRadius: 8, overflowX: "auto" };
