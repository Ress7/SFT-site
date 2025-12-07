function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getPositions() {
  return load('sf_positions', []);
}

export function getTrades() {
  return load('sf_trades', []);
}

export function placeOrder({ side, symbol, quantity, price }) {
  const qty = Number(quantity);
  const px = Number(price);
  if (!symbol || !qty || !px) throw new Error('INVALID_ORDER');
  const trades = getTrades();
  const positions = getPositions();

  trades.push({ id: `T-${Date.now()}`, time: Date.now(), side, symbol, quantity: qty, price: px });

  const idx = positions.findIndex(p => p.symbol === symbol);
  if (idx === -1) {
    positions.push({ symbol, quantity: side === 'buy' ? qty : -qty, avgPrice: px });
  } else {
    const p = positions[idx];
    const newQty = p.quantity + (side === 'buy' ? qty : -qty);
    let newAvg = p.avgPrice;
    if (side === 'buy') {
      newAvg = ((p.avgPrice * p.quantity) + (px * qty)) / Math.max(newQty, 1);
    }
    positions[idx] = { symbol, quantity: newQty, avgPrice: newAvg };
    if (positions[idx].quantity === 0) positions.splice(idx, 1);
  }

  save('sf_trades', trades);
  save('sf_positions', positions);
  return { trades, positions };
}

export function resetBroker() {
  save('sf_trades', []);
  save('sf_positions', []);
}
