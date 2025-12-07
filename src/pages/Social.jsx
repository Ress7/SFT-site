import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Copy, TrendingUp, Star, UserPlus, MessageCircle, Target, Search, ScanLine, QrCode, ChevronRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { createPageUrl } from "@/utils";

export default function Social() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem('publicTraders');
    const list = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(u => u.public_profile_enabled);
    setPublicTraders(filtered);
    setCurrentUser(null);
  }, []);

  const [publicTraders, setPublicTraders] = useState([]);

  const filteredTraders = publicTraders.filter(trader => {
      const query = searchQuery.toLowerCase();
      return (
          trader.full_name?.toLowerCase().includes(query) ||
          trader.stoneforge_id?.toLowerCase().includes(query) ||
          trader.trader_nickname?.toLowerCase().includes(query)
      );
  });

  const follows = [];

  const copiedTrades = [];

  const followingCount = follows.length;
  const copyingCount = follows.filter(f => f.copy_trading).length;
  const copiedThisMonth = copiedTrades.filter(t => {
    const tradeDate = new Date(t.created_date);
    const now = new Date();
    return tradeDate.getMonth() === now.getMonth() && tradeDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 transition-colors duration-300 relative">
      {/* Mobile Floating Scan Button */}
      <div className="fixed bottom-20 right-6 lg:hidden z-50">
        <Button 
            size="icon" 
            className="w-14 h-14 rounded-full bg-black dark:bg-white shadow-xl hover:scale-105 transition-transform"
            onClick={() => alert("QR Scanner would open here natively")}
        >
            <QrCode className="w-6 h-6 text-white dark:text-black" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Header & Search */}
        <div className="flex flex-col items-center text-center py-10 space-y-6">
            <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-white dark:via-gray-400 dark:to-white animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Find Your Edge
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Discover top traders, track their performance, and copy their strategies in real-time.
                </p>
            </div>

            <div className="relative w-full max-w-2xl mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative flex items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-full shadow-2xl p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50">
                    <Search className="w-6 h-6 text-gray-400 ml-4" />
                    <Input 
                        placeholder="Search by Stoneforge ID, Nickname, or Strategy..." 
                        className="border-none bg-transparent text-lg h-12 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2 pr-2">
                        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 font-mono border border-gray-200 dark:border-gray-700">
                            <span className="text-xs">⌘</span>K
                        </div>
                        <Button size="icon" className="rounded-full h-10 w-10 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 md:hidden" onClick={() => alert('QR Scanner active...')}>
                            <ScanLine className="w-4 h-4" />
                        </Button>
                    </div>
                    </div>

                    {/* Search Preview Dropdown */}
                    {searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-2">
                        {filteredTraders.length > 0 ? (
                            <div className="p-2">
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider flex justify-between">
                                    <span>Found {filteredTraders.length} Trader{filteredTraders.length !== 1 && 's'}</span>
                                    <span className="text-[10px]">Press Enter to view all</span>
                                </div>
                                {filteredTraders.slice(0, 3).map(trader => (
                                    <div 
                                      key={trader.id}
                                      onClick={() => navigate(`/trader/${trader.stoneforge_id}`)}
                                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all group/item border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                    >
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {trader.profile_image ? (
                                                <img src={trader.profile_image} alt={trader.full_name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                (trader.trader_nickname || trader.full_name || "?").charAt(0)
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-gray-900 dark:text-white truncate">
                                                    {trader.trader_nickname || trader.full_name}
                                                </span>
                                                {trader.stoneforge_id && (
                                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono">
                                                        {trader.stoneforge_id}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" /> {trader.followers || 0}
                                                </span>
                                                <span className={`flex items-center gap-1 font-medium ${(trader.total_returns || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    <ArrowUpRight className="w-3 h-3" /> {trader.total_returns || 0}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover/item:text-black dark:group-hover/item:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Search className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-900 dark:text-white font-medium">No traders found</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try searching for a different ID or name</p>
                            </div>
                        )}
                    </div>
                    )}
                    </div>
                    </div>

                    {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Following</CardTitle>
              <Users className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{followingCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Traders</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Copying</CardTitle>
              <Copy className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{copyingCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active copies</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Copied Trades</CardTitle>
              <TrendingUp className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{copiedThisMonth}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Rank</CardTitle>
              <Trophy className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentUser?.portfolio_public ? (publicTraders.findIndex(t => t.email === currentUser?.email) + 1 || '-') : '-'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Global</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Trophy className="w-6 h-6 text-gray-900 dark:text-white" />
                Top Traders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTraders.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No public traders yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Enable public portfolio in Account settings to appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTraders.slice(0, 10).map((trader, index) => (
                    <div
                      key={trader.id}
                      onClick={() => navigate(`/trader/${trader.stoneforge_id}`)}
                      className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-black dark:hover:border-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                            'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            #{index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                                <div className="font-bold text-lg text-gray-900 dark:text-white">{trader.trader_nickname || trader.full_name}</div>
                                {trader.stoneforge_id && (
                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-gray-400 text-gray-500">
                                        {trader.stoneforge_id}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {trader.followers || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {trader.win_rate || 0}% WR
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {trader.total_trades || 0} trades
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">+{trader.total_returns || 0}%</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Total returns</div>
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
            <Card className="bg-gradient-to-br from-gray-100/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <Copy className="w-5 h-5 text-gray-900 dark:text-white" />
                  Copy Trading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically replicate trades from successful traders with your own risk controls.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                    <span>Real-time execution</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                    <span>Custom risk limits</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                    <span>Pause anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Your Following</CardTitle>
              </CardHeader>
              <CardContent>
                {followingCount === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Not following anyone yet</p>
                ) : (
                  <div className="space-y-2">
                    {follows.slice(0, 5).map((follow) => (
                      <div key={follow.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                        <span className="text-sm text-gray-900 dark:text-white">{follow.following_email}</span>
                        {follow.copy_trading && (
                          <Badge className="bg-black dark:bg-white text-white dark:text-black text-xs">Copying</Badge>
                        )}
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
