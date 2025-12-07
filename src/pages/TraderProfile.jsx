import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, UserPlus, UserCheck, TrendingUp, Target, Activity, CheckCircle, Globe, BarChart3, Calendar, Edit2, LogIn } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function TraderProfile() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const { stoneforgeId } = useParams();
  const isSelf = !!user && (user.user_metadata?.stoneforge_id === stoneforgeId);

  const [trader, setTrader] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [portfolio, setPortfolio] = useState([]);
  const [trades, setTrades] = useState([]);
  useEffect(() => {
    try {
      const rawPos = localStorage.getItem('sf_positions');
      const pos = rawPos ? JSON.parse(rawPos) : [];
      const rawTr = localStorage.getItem('sf_trades');
      const tr = rawTr ? JSON.parse(rawTr) : [];
      setTrades(tr.map(t => ({ id: t.id, type: t.side, asset_symbol: t.symbol, quantity: t.quantity, price: t.price, created_date: new Date(t.time).toISOString() })));
      setPortfolio(pos.map(p => ({ id: `${p.symbol}`, asset_symbol: p.symbol, quantity: p.quantity, total_value: p.avgPrice * p.quantity, profit_loss_percent: 0 })));
    } catch {}
  }, []);

  const follows = [];

  useEffect(() => {
    setCurrentUser(null);
    const raw = localStorage.getItem('publicTraders');
    const list = raw ? JSON.parse(raw) : [];
    const found = list.find(u => u.stoneforge_id === stoneforgeId);
    setTrader(found || null);
    setIsLoading(false);
  }, [stoneforgeId]);

  const followMutation = {
    mutate: () => {
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? "Unfollowed trader" : "Now following trader!");
    }
  };

  const copyTradeMutation = {
    mutate: () => {
      setIsCopying(!isCopying);
      toast.success(isCopying ? "Stopped copying trades" : "Now copying trades!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!trader) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Trader Not Found</h2>
          <Button onClick={() => navigate(createPageUrl("Social"))} className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black mt-4">
            Back to Social
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(createPageUrl("Social"))} className="dark:text-gray-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Social
        </Button>

        {/* Profile Header */}
        <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {trader.profile_image ? (
                  <img src={trader.profile_image} alt={trader.full_name} className="w-24 h-24 rounded-full object-cover border-4 border-black dark:border-white" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-4xl font-bold">
                    {trader.full_name?.charAt(0) || trader.email?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{trader.full_name}</h1>
                    {trader.verified && (
                      <Badge className="bg-blue-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-3">{trader.bio || "No bio available"}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Globe className="w-4 h-4" />
                      {trader.country || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Member since {new Date(trader.created_at || trader.created_date || Date.now()).toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto">
                {!user ? (
                  <Button onClick={() => navigate(createPageUrl("Account"))} className="bg-black dark:bg-white text-white dark:text-black">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login to Interact
                  </Button>
                ) : isSelf ? (
                  <Button onClick={() => navigate(createPageUrl("Account"))} variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => copyTradeMutation.mutate()}
                      disabled={copyTradeMutation.isPending}
                      className={`font-bold shadow-md transition-all ${isCopying 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"}`}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {isCopying ? "Stop Copying" : "Copy Trades"}
                    </Button>
                    <Button
                      onClick={() => followMutation.mutate()}
                      disabled={followMutation.isPending}
                      variant={isFollowing ? "secondary" : "outline"}
                      className={`border-gray-200 dark:border-gray-700 ${isFollowing ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900" : ""}`}
                    >
                      {isFollowing ? <UserCheck className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">+{trader.total_returns || 0}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Returns</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{trader.win_rate || 0}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Win Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{trader.total_trades || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Trades</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{trader.followers || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Followers</div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
          <Tabs defaultValue="activity">
            <CardHeader>
              <TabsList className="bg-gray-100 dark:bg-gray-900">
                <TabsTrigger value="activity">Trading Activity</TabsTrigger>
                <TabsTrigger value="portfolio" disabled={!trader.portfolio_public}>Portfolio</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="activity" className="space-y-3">
                {!trader.portfolio_public ? (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">This trader's portfolio is private</p>
                  </div>
                ) : trades.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No recent trades</p>
                  </div>
                ) : (
                  trades.map((trade) => (
                    <div key={trade.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}`} />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {trade.type.toUpperCase()} {trade.asset_symbol}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {trade.quantity} @ ${trade.price}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            ${(trade.quantity * trade.price).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(trade.created_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="portfolio">
                {portfolio.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No holdings</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {portfolio.map((holding) => (
                      <div key={holding.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-lg text-gray-900 dark:text-white">{holding.asset_symbol}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{holding.quantity} units</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              ${(holding.total_value || 0).toFixed(2)}
                            </div>
                            <div className={`text-sm font-semibold ${(holding.profit_loss_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {(holding.profit_loss_percent || 0) >= 0 ? '+' : ''}{(holding.profit_loss_percent || 0).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
