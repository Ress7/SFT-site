export function createFinnhubSocket({ symbols = [], onTrade }) {
  const token =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_FINNHUB_TOKEN) ||
    (typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem("finnhub_token") : "") ||
    "";
  if (!token) {
    return {
      close: () => {},
      send: () => {},
      ready: false,
      error: "FINNHUB token missing"
    };
  }
  const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`);
  const api = {
    ready: false,
    error: null,
    send: (msg) => {
      if (api.ready) ws.send(msg);
    },
    close: () => {
      try { ws.close(); } catch {}
    }
  };
  ws.onopen = () => {
    api.ready = true;
    symbols.forEach((s) => {
      try {
        ws.send(JSON.stringify({ type: "subscribe", symbol: s }));
      } catch {}
    });
  };
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "trade" && Array.isArray(data.data)) {
        onTrade?.(data.data);
      }
    } catch {}
  };
  ws.onerror = (err) => {
    api.error = String(err);
  };
  ws.onclose = () => {
    api.ready = false;
  };
  return api;
}
