import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, TrendingDown, Briefcase, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Plus, Activity } from "lucide-react";
import { getPositions, getTrades } from "@/api/paperBroker";
import { fetchQuote, isMarketConnected, getProvider } from "@/api/market";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const load = async () => {
      const pos = getPositions();
      const tr = getTrades();
      setTrades(tr.map(t => ({ id: t.id, type: t.side, asset_symbol: t.symbol, quantity: t.quantity, price: t.price, created_date: new Date(t.time).toISOString() })));
      const enriched = [];
      for (const p of pos) {
        let price = p.avgPrice;
        let plPct = 0;
        try {
          const q = await fetchQuote(p.symbol);
          price = q.price;
          plPct = ((price - p.avgPrice) / p.avgPrice) * 100;
        } catch {}
        enriched.push({ id: `${p.symbol}`, asset_symbol: p.symbol, asset_name: p.symbol, quantity: p.quantity, avg_buy_price: p.avgPrice, current_price: price, total_value: price * p.quantity, profit_loss_percent: plPct });
      }
      setPortfolio(enriched);
    };
    load();
  }, []);

  const totalValue = portfolio.reduce((sum, p) => sum + (p.total_value || 0), 0);
  const totalInvestment = portfolio.reduce((sum, p) => sum + (p.avg_buy_price * p.quantity || 0), 0);
  const totalProfitLoss = totalValue - totalInvestment;
  const profitLossPercent = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  const bestPerformer = portfolio.reduce((best, current) => 
    (current.profit_loss_percent || 0) > (best.profit_loss_percent || 0) ? current : best, 
    portfolio[0] || {}
  );

  const worstPerformer = portfolio.reduce((worst, current) => 
    (current.profit_loss_percent || 0) < (worst.profit_loss_percent || 0) ? current : worst, 
    portfolio[0] || {}
  );

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track investments and performance</p>
          </div>
          <Link to={createPageUrl("Trade")}>
            <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
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

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P/L</CardTitle>
              {totalProfitLoss >= 0 ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Assets</CardTitle>
              <Briefcase className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{portfolio.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Holdings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Diversity</CardTitle>
              <PieChart className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {portfolio.length > 0 ? 'High' : 'Low'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{portfolio.length} positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings */}
          <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Your portfolio is empty</p>
                  <Link to={createPageUrl("Trade")}>
                    <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
                      Start Trading
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((holding) => (
                    <div key={holding.id} className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-purple-600 dark:hover:border-purple-600 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-lg shadow-md">
                            {holding.asset_symbol?.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-xl text-gray-900 dark:text-white">{holding.asset_symbol}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{holding.asset_name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-gray-900 dark:text-white">
                            ${(holding.total_value || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </div>
                          <div className={`text-sm font-semibold flex items-center gap-1 justify-end ${
                            (holding.profit_loss_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {(holding.profit_loss_percent || 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {(holding.profit_loss_percent || 0) >= 0 ? '+' : ''}{(holding.profit_loss_percent || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="p-2 bg-white dark:bg-black rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">Quantity</span>
                          <div className="font-semibold text-gray-900 dark:text-white">{holding.quantity}</div>
                        </div>
                        <div className="p-2 bg-white dark:bg-black rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">Avg Cost</span>
                          <div className="font-semibold text-gray-900 dark:text-white">${holding.avg_buy_price?.toFixed(2)}</div>
                        </div>
                        <div className="p-2 bg-white dark:bg-black rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">Current</span>
                          <div className="font-semibold text-gray-900 dark:text-white">${holding.current_price?.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {portfolio.length > 0 && (
              <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Best Performer</div>
                    <div className="font-bold text-gray-900 dark:text-white">{bestPerformer.asset_symbol}</div>
                    <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      +{(bestPerformer.profit_loss_percent || 0).toFixed(2)}%
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Needs Attention</div>
                    <div className="font-bold text-gray-900 dark:text-white">{worstPerformer.asset_symbol}</div>
                    <div className="text-sm font-semibold text-red-600 flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" />
                      {(worstPerformer.profit_loss_percent || 0).toFixed(2)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {trades.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No recent trades</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {trades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}`} />
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">{trade.asset_symbol}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {trade.type.toUpperCase()} {trade.quantity} @ ${trade.price}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(trade.created_date).toLocaleDateString()}
                        </div>
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
