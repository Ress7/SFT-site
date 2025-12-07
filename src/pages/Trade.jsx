import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import AssetExplorer from "@/components/trade/AssetExplorer";
import ChartArea from "@/components/trade/ChartArea";
import OrderPanel from "@/components/trade/OrderPanel";
import { fetchQuote, isMarketConnected, getProvider } from "@/api/market";
import { placeOrder } from "@/api/paperBroker";
import { AlertCircle } from "lucide-react";

export default function Trade() {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const assets = [
    // Stocks (US large-cap)
    { id: 'a1', symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a2', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a3', symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a4', symbol: 'GOOGL', name: 'Alphabet Inc. Class A', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a5', symbol: 'GOOG', name: 'Alphabet Inc. Class C', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a6', symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a7', symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a8', symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a9', symbol: 'AMD', name: 'Advanced Micro Devices', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a10', symbol: 'INTC', name: 'Intel Corp.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a11', symbol: 'ORCL', name: 'Oracle Corp.', type: 'stock', exchange: 'NYSE' },
    { id: 'a12', symbol: 'CRM', name: 'Salesforce Inc.', type: 'stock', exchange: 'NYSE' },
    { id: 'a13', symbol: 'NFLX', name: 'Netflix Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a14', symbol: 'AVGO', name: 'Broadcom Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a15', symbol: 'ADBE', name: 'Adobe Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a16', symbol: 'PYPL', name: 'PayPal Holdings Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a17', symbol: 'PEP', name: 'PepsiCo Inc.', type: 'stock', exchange: 'NASDAQ' },
    { id: 'a18', symbol: 'KO', name: 'Coca-Cola Co.', type: 'stock', exchange: 'NYSE' },
    { id: 'a19', symbol: 'DIS', name: 'Walt Disney Co.', type: 'stock', exchange: 'NYSE' },
    { id: 'a20', symbol: 'NKE', name: 'Nike Inc.', type: 'stock', exchange: 'NYSE' },

    // ETFs / Indices
    { id: 'e1', symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'etf', exchange: 'NYSE' },
    { id: 'e2', symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'etf', exchange: 'NASDAQ' },
    { id: 'e3', symbol: 'IWM', name: 'iShares Russell 2000', type: 'etf', exchange: 'NYSE' },
    { id: 'e4', symbol: 'DIA', name: 'SPDR Dow Jones Industrial', type: 'etf', exchange: 'NYSE' },
    { id: 'i1', symbol: 'TVC:DXY', name: 'US Dollar Index', type: 'index' },
    { id: 'i2', symbol: 'SP:SPX', name: 'S&P 500 Index', type: 'index' },
    { id: 'i3', symbol: 'NASDAQ:NDX', name: 'Nasdaq 100 Index', type: 'index' },

    // Forex (TradingView feed symbols)
    { id: 'f1', symbol: 'FX_IDC:EURUSD', name: 'EUR/USD', type: 'forex' },
    { id: 'f2', symbol: 'FX_IDC:GBPUSD', name: 'GBP/USD', type: 'forex' },
    { id: 'f3', symbol: 'FX_IDC:USDJPY', name: 'USD/JPY', type: 'forex' },
    { id: 'f4', symbol: 'FX_IDC:AUDUSD', name: 'AUD/USD', type: 'forex' },
    { id: 'f5', symbol: 'FX_IDC:USDCAD', name: 'USD/CAD', type: 'forex' },
    { id: 'f6', symbol: 'FX_IDC:USDCHF', name: 'USD/CHF', type: 'forex' },
    { id: 'f7', symbol: 'FX_IDC:NZDUSD', name: 'NZD/USD', type: 'forex' },

    // Crypto (Binance)
    { id: 'c1', symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin / Tether', type: 'crypto' },
    { id: 'c2', symbol: 'BINANCE:ETHUSDT', name: 'Ethereum / Tether', type: 'crypto' },
    { id: 'c3', symbol: 'BINANCE:SOLUSDT', name: 'Solana / Tether', type: 'crypto' },
    { id: 'c4', symbol: 'BINANCE:ADAUSDT', name: 'Cardano / Tether', type: 'crypto' },
    { id: 'c5', symbol: 'BINANCE:XRPUSDT', name: 'XRP / Tether', type: 'crypto' },
    { id: 'c6', symbol: 'BINANCE:DOGEUSDT', name: 'Dogecoin / Tether', type: 'crypto' },

    // Commodities (TV feed)
    { id: 'm1', symbol: 'TVC:USOIL', name: 'Crude Oil (WTI)', type: 'commodity' },
    { id: 'm2', symbol: 'TVC:GOLD', name: 'Gold', type: 'commodity' },
    { id: 'm3', symbol: 'TVC:SILVER', name: 'Silver', type: 'commodity' },
  ];

  // Default selection
  useEffect(() => {
    if (!selectedAsset && assets.length > 0) {
        const defaultAsset = assets.find(a => a.symbol.includes('AAPL')) || assets[0];
        setSelectedAsset(defaultAsset);
    }
  }, [assets, selectedAsset]);

  useEffect(() => {
    const loadQuote = async () => {
      if (!selectedAsset) return;
      try {
        const q = await fetchQuote(selectedAsset.symbol);
        setSelectedAsset(prev => ({ ...prev, current_price: q.price, price_change_24h: q.changePercent }));
      } catch (e) {
        // If no API key, show banner; still allow manual trade but with price as 0
        setSelectedAsset(prev => ({ ...prev, current_price: prev?.current_price || 0, price_change_24h: 0 }));
      }
    };
    loadQuote();
  }, [selectedAsset?.symbol]);

  const executeTradeMutation = {
    mutate: ({ asset, type, quantity, price }) => {
      try {
        placeOrder({ side: type, symbol: asset.symbol, quantity, price });
        toast.success("Order executed");
      } catch {
        toast.error("Order failed");
      }
    }
  };

  // --- Handlers ---
  const handleExecuteTrade = (tradeDetails) => {
    if (!tradeDetails.asset) return;
    executeTradeMutation.mutate({
        asset: tradeDetails.asset,
        type: tradeDetails.type,
        quantity: tradeDetails.quantity,
        price: Number(tradeDetails.price || tradeDetails.asset?.current_price || 0),
        leverage: tradeDetails.leverage
    });
  };

  const handleUpdateOrion = async (request) => {
    toast.info("Orion settings updated (mock)");
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-transparent p-2 md:p-4 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row gap-4">
        {!isMarketConnected() && (
          <div className="w-full mb-2 p-3 rounded-md border border-yellow-300 bg-yellow-50/60 text-yellow-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {`No market data API key connected. Add your ${getProvider() === 'finnhub' ? 'Finnhub token' : 'Alpha Vantage key'} in Settings to see live prices.`}
          </div>
        )}
        {/* Brokerage banner intentionally removed per request */}
        {/* Left Column: Asset Explorer */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 h-[500px] md:h-full overflow-hidden">
            <AssetExplorer 
                assets={assets} 
                selectedAsset={selectedAsset} 
                onSelectAsset={setSelectedAsset} 
            />
        </div>

        {/* Center Column: Chart Area */}
        <div className="flex-1 h-[400px] md:h-full min-w-0 overflow-hidden">
            <ChartArea selectedAsset={selectedAsset} />
        </div>

        {/* Right Column: Order Panel */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 min-h-[600px] md:h-full overflow-hidden pb-8 md:pb-0">
            <OrderPanel 
                selectedAsset={selectedAsset} 
                onExecuteTrade={handleExecuteTrade}
                onUpdateOrion={handleUpdateOrion}
            />
        </div>
    </div>
  );
}
