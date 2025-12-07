export function getProvider() {
  try { return localStorage.getItem('marketProvider') || 'finnhub'; } catch { return 'finnhub'; }
}

export function getFinnhubToken() {
  try {
    const v = localStorage.getItem('finnhubToken') || '';
    if (v) return v;
  } catch {}
  return import.meta.env?.VITE_FINNHUB_TOKEN || '';
}

export function getAlphaKey() {
  try {
    const v = localStorage.getItem('alphaVantageKey') || '';
    if (v) return v;
  } catch {}
  return import.meta.env?.VITE_ALPHA_KEY || '';
}

export async function fetchQuote(symbol) {
  const provider = getProvider();
  if (provider === 'finnhub') {
    const token = getFinnhubToken();
    if (!token) throw new Error('NO_API_KEY');
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${token}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    const q = await res.json();
    const price = Number(q.c || 0);
    const change = Number(q.d || 0);
    const changePercent = Number(q.dp || 0);
    if (!isFinite(price) || price <= 0) throw new Error('BAD_RESPONSE');
    return { symbol, price, change, changePercent, raw: q };
  } else {
    const key = getAlphaKey();
    if (!key) throw new Error('NO_API_KEY');
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    const json = await res.json();
    const gq = json["Global Quote"] || {};
    const price = parseFloat(gq["05. price"] || gq["05.price"] || gq.price || 'NaN');
    const change = parseFloat(gq["09. change"] || gq.change || '0');
    const changePercentRaw = (gq["10. change percent"] || gq["10.change percent"] || '0%').toString().replace('%','');
    const changePercent = parseFloat(changePercentRaw || '0');
    if (!isFinite(price)) throw new Error('BAD_RESPONSE');
    return { symbol, price, change, changePercent, raw: gq };
  }
}

export async function fetchDailySeries(symbol) {
  const provider = getProvider();
  if (provider === 'finnhub') {
    const token = getFinnhubToken();
    if (!token) throw new Error('NO_API_KEY');
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&count=50&token=${token}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    const json = await res.json();
    if (json.s !== 'ok') throw new Error('BAD_RESPONSE');
    const points = (json.t || []).map((t, i) => ({
      date: new Date(t * 1000).toISOString(),
      open: Number((json.o || [])[i] || 0),
      high: Number((json.h || [])[i] || 0),
      low: Number((json.l || [])[i] || 0),
      close: Number((json.c || [])[i] || 0),
      volume: Number((json.v || [])[i] || 0),
    }));
    return points;
  } else {
    const key = getAlphaKey();
    if (!key) throw new Error('NO_API_KEY');
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${key}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    const json = await res.json();
    const series = json["Time Series (Daily)"] || {};
    const points = Object.entries(series).slice(0, 50).reverse().map(([date, v]) => ({
      date,
      open: parseFloat(v["1. open"]),
      high: parseFloat(v["2. high"]),
      low: parseFloat(v["3. low"]),
      close: parseFloat(v["4. close"]),
      volume: parseFloat(v["5. volume"]),
    }));
    return points;
  }
}

export function isMarketConnected() {
  const provider = getProvider();
  return provider === 'finnhub' ? !!getFinnhubToken() : !!getAlphaKey();
}
