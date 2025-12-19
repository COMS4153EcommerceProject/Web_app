// src/apiFactory.js
console.log("[API BASE]", process.env.REACT_APP_ORDER_API_BASE_URL);

function toQS(obj) {
    const q = new URLSearchParams(
        Object.entries(obj || {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString();
    return q ? `?${q}` : "";
}

function makeClient(baseUrl) {
    const base = (baseUrl || "").replace(/\/$/, "");
    const req = async (path, { method = "GET", body, headers = {} } = {}) => {
        const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
        const res = await fetch(url, {
            method,
            headers: {
                Accept: "application/json",
                ...(body ? { "Content-Type": "application/json" } : {}),
                ...headers,
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
        });

        // 统一解析
        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }

        if (!res.ok) {
            const msg = typeof data === "string" ? data : JSON.stringify(data);
            const err = new Error(`${res.status} ${res.statusText} :: ${msg}`);
            err.status = res.status;
            err.data = data;
            throw err;
        }
        return { status: res.status, data, headers: res.headers };
    };

    return { req, toQS };
}


export const orderApi = (() => {
    const { req, toQS } = makeClient(process.env.REACT_APP_ORDER_API_BASE_URL);
    return {
        root: () => req("/"),
        listOrders: (params) => req(`/orders${toQS(params)}`),
        getOrder: (orderId) => req(`/orders/${orderId}`),
        createOrder: (payload) => req("/orders", { method: "POST", body: payload }),
        updateOrder: (orderId, payload) => req(`/orders/${orderId}`, { method: "PUT", body: payload }),
        deleteOrder: (orderId) => req(`/orders/${orderId}`, { method: "DELETE" }),
        // order-details
        listOrderDetails: (params) => req(`/order-details${toQS(params)}`),
        getOrderDetail: (orderId, prodId) => req(`/order-details/${orderId}/${prodId}`),
        createOrderDetail: (payload) => req("/order-details", { method: "POST", body: payload }),
        updateOrderDetail: (orderId, prodId, payload) =>
            req(`/order-details/${orderId}/${prodId}`, { method: "PUT", body: payload }),
        deleteOrderDetail: (orderId, prodId) => req(`/order-details/${orderId}/${prodId}`, { method: "DELETE" }),
    };
})();

export const userApi = (() => {
    const { req, toQS } = makeClient(process.env.REACT_APP_USER_API_BASE_URL);
    return {
    };
})();

export const productApi = (() => {
    const { req, toQS } = makeClient(process.env.REACT_APP_PRODUCT_API_BASE_URL);
    return {
        listProducts: (params) => req(`/products${toQS(params)}`),
        getProduct: (id) => req(`/products/${id}`),
    };
})();

export const compositeApi = (() => {
    const { req, toQS } = makeClient(process.env.REACT_APP_COMPOSITE_API_BASE_URL);
    return {
        ping: () => req(`/`),
        listOrders: (params) => req(`/composite/orders${toQS(params)}`),
        listProducts: (params) => req(`/composite/products${toQS(params)}`)
    };
})();
