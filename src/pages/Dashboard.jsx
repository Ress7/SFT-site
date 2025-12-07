import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Activity, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { getPositions, getTrades } from "@/api/paperBroker";
import { fetchQuote, isMarketConnected, getProvider } from "@/api/market";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [trades, setTrades] = useState([]);
  const bots = [
    { id: 'b1', name: 'Orion Momentum', status: 'active' },
    { id: 'b2', name: 'Orion Mean Reversion', status: 'paused' },
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/account");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const load = async () => {
      const pos = getPositions();
      const tr = getTrades();
      setTrades(tr.map(t => ({ id: t.id, type: t.side, asset_symbol: t.symbol, quantity: t.quantity, price: t.price, created_date: new Date(t.time).toISOString() })));
      const enriched = [];
      for (const p of pos) {
        let price = p.avgPrice;
        let pl = 0;
        let plPct = 0;
        try {
          const q = await fetchQuote(p.symbol);
          price = q.price;
          pl = (price - p.avgPrice) * p.quantity;
          plPct = ((price - p.avgPrice) / p.avgPrice) * 100;
        } catch {}
        enriched.push({ id: `${p.symbol}`, asset_symbol: p.symbol, quantity: p.quantity, total_value: price * p.quantity, profit_loss: pl, profit_loss_percent: plPct });
      }
      setPortfolio(enriched);
    };
    load();
  }, []);

  const totalValue = portfolio.reduce((sum, p) => sum + (p.total_value || 0), 0);
  const totalProfitLoss = portfolio.reduce((sum, p) => sum + (p.profit_loss || 0), 0);
  const profitLossPercent = totalValue > 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0;
  const activeOrion = bots.filter(b => b.status === 'active').length;

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {!isMarketConnected() && (
          <div className="w-full mb-2 p-3 rounded-md border border-yellow-300 bg-yellow-50/60 text-yellow-800">
            {`Market data is not connected. Add your ${getProvider() === 'finnhub' ? 'Finnhub token' : 'Alpha Vantage key'} in Settings to show live valuations.`}
          </div>
        )}
        {(() => { try { const raw = localStorage.getItem('sf_exchange_connections'); const list = raw ? JSON.parse(raw) : []; return list.filter(c => c.status === 'connected').length === 0; } catch { return true; } })() && (
          <div className="w-full mb-2 p-3 rounded-md border border-blue-300 bg-blue-50/60 text-blue-800">
            No brokerage API connected. Connect your exchange in Settings to enable Orion AI trading.
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back to Stoneforge</p>
          </div>
          <Link to={createPageUrl("Trade")}>
            <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Trading
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</CardTitle>
              <DollarSign className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Portfolio value</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Profit/Loss</CardTitle>
              {totalProfitLoss >= 0 ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}% overall
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Assets</CardTitle>
              <Briefcase className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{portfolio.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">In portfolio</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Orion AI</CardTitle>
              <Sparkles className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{activeOrion}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active strategies</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Holdings */}
          <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Holdings</CardTitle>
                <Link to={createPageUrl("Portfolio")}>
                  <Button variant="ghost" size="sm" className="dark:text-gray-300">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {portfolio.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No assets in portfolio yet</p>
                  <Link to={createPageUrl("Trade")}>
                    <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
                      Start Trading
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.slice(0, 5).map((holding) => (
                    <div key={holding.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
                          {holding.asset_symbol?.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{holding.asset_symbol}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{holding.quantity} units</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ${(holding.total_value || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </div>
                        <div className={`text-sm flex items-center gap-1 justify-end ${(holding.profit_loss_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(holding.profit_loss_percent || 0) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {(holding.profit_loss_percent || 0) >= 0 ? '+' : ''}{(holding.profit_loss_percent || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights & Recent Activity */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <Sparkles className="w-5 h-5 text-gray-900 dark:text-white" />
                  Orion Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Market Sentiment</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Bullish trend detected in tech sector. Consider diversifying into AI stocks.</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-gray-900 dark:text-white" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">AI Performance</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Your strategies have a 68% win rate this week.</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                {trades.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent trades</p>
                ) : (
                  <div className="space-y-2">
                    {trades.slice(0, 5).map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'} className={trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                          <span className="font-medium text-gray-900 dark:text-white">{trade.asset_symbol}</span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">{trade.quantity} @ ${trade.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
