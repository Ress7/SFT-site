import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Zap, TrendingUp, Target, Play, Pause, Settings as SettingsIcon, Plus, Activity, Key, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import OrionChatInterface from "@/components/orion/OrionChatInterface";

export default function Orion() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    name: "",
    strategy: "momentum",
    risk_level: "medium",
    max_position_size: 1000,
    stop_loss_percent: 5,
    take_profit_percent: 10,
    asset_types: ["stock"],
    sharia_only: false
  });


  const orionInstances = [
    { id: 'b1', name: 'Orion Momentum', strategy: 'momentum', status: 'active', win_rate: 62, profitable_trades: 31, total_trades: 50 },
    { id: 'b2', name: 'Orion Mean Reversion', strategy: 'mean-reversion', status: 'paused', win_rate: 55, profitable_trades: 22, total_trades: 40 },
  ];

  const [connections, setConnections] = useState(() => {
    try {
      const raw = localStorage.getItem('sf_exchange_connections');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem('sf_exchange_connections');
        const next = raw ? JSON.parse(raw) : [];
        setConnections(next);
      } catch {}
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const recentTrades = [
    { id: 't1', type: 'buy', asset_symbol: 'AAPL', quantity: 5, price: 190, created_date: new Date().toISOString(), bot_triggered: true },
  ];

  const createOrionMutation = {
    mutate: () => {
      toast.success("Orion AI strategy configured (mock)!");
      setShowCreateDialog(false);
      setNewStrategy({
        name: "",
        strategy: "momentum",
        risk_level: "medium",
        max_position_size: 1000,
        stop_loss_percent: 5,
        take_profit_percent: 10,
        asset_types: ["stock"],
        sharia_only: false
      });
    }
  };

  const toggleOrionMutation = {
    mutate: () => {
      toast.success("Strategy status updated (mock)!");
    }
  };

  const handleCreate = () => {
    if (!newStrategy.name) {
      toast.error("Please enter a strategy name");
      return;
    }
    if (connections.length === 0) {
      toast.error("Please connect an exchange first");
      return;
    }
    createOrionMutation.mutate(newStrategy);
  };

  const activeOrion = orionInstances.filter(o => o.status === 'active').length;
  const totalTrades = orionInstances.reduce((sum, o) => sum + (o.total_trades || 0), 0);
  const avgWinRate = orionInstances.length > 0 
    ? orionInstances.reduce((sum, o) => sum + (o.win_rate || 0), 0) / orionInstances.length 
    : 0;

  const activeConnections = connections.filter(c => c.status === 'connected');

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">

              Orion AI
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Extremely powerful AI trading automation</p>
          </div>
          
          {activeConnections.length === 0 ? (
            <Link to={createPageUrl("Settings")}>
              <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-lg">
                <Key className="w-4 h-4 mr-2" />
                Connect Exchange First
              </Button>
            </Link>
          ) : (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  New Strategy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Brain className="w-5 h-5 text-gray-900 dark:text-white" />
                    Configure Orion AI Strategy
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label className="text-gray-900 dark:text-white">Strategy Name</Label>
                    <Input
                      placeholder="e.g., Aggressive Momentum"
                      value={newStrategy.name}
                      onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
                      className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-900 dark:text-white">Trading Strategy</Label>
                      <Select 
                        value={newStrategy.strategy} 
                        onValueChange={(value) => setNewStrategy({...newStrategy, strategy: value})}
                      >
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="momentum">Momentum Trading</SelectItem>
                          <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                          <SelectItem value="breakout">Breakout</SelectItem>
                          <SelectItem value="scalping">Scalping</SelectItem>
                          <SelectItem value="swing">Swing Trading</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-900 dark:text-white">Risk Level</Label>
                      <Select 
                        value={newStrategy.risk_level} 
                        onValueChange={(value) => setNewStrategy({...newStrategy, risk_level: value})}
                      >
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-900 dark:text-white">Max Position ($)</Label>
                      <Input
                        type="number"
                        value={newStrategy.max_position_size}
                        onChange={(e) => setNewStrategy({...newStrategy, max_position_size: parseFloat(e.target.value)})}
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-900 dark:text-white">Stop Loss (%)</Label>
                      <Input
                        type="number"
                        value={newStrategy.stop_loss_percent}
                        onChange={(e) => setNewStrategy({...newStrategy, stop_loss_percent: parseFloat(e.target.value)})}
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-900 dark:text-white">Take Profit (%)</Label>
                      <Input
                        type="number"
                        value={newStrategy.take_profit_percent}
                        onChange={(e) => setNewStrategy({...newStrategy, take_profit_percent: parseFloat(e.target.value)})}
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-gray-900 dark:text-white mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Connected Exchange</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Orion will trade using: {activeConnections.map(c => c.exchange_name).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreate} 
                    disabled={createOrionMutation.isPending}
                    className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black h-12 text-base"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Activate Orion Strategy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Connection Warning */}
        {activeConnections.length === 0 && (
          <Card className="bg-yellow-50/90 dark:bg-yellow-900/30 backdrop-blur-sm border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">No Exchange Connected</h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                    Connect your exchange API to enable Orion AI automated trading. Your keys are encrypted and secure.
                  </p>
                  <Link to={createPageUrl("Settings")}>
                    <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
                      <Key className="w-4 h-4 mr-2" />
                      Go to Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Strategies</CardTitle>
              <Activity className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{activeOrion}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Running now</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trades</CardTitle>
              <Zap className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalTrades}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Executed by Orion</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</CardTitle>
              <Target className="h-5 w-5 text-gray-900 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{avgWinRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Strategies */}
        <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Configured Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            {orionInstances.length === 0 ? (
              <div className="text-center py-16">
                <Brain className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Strategies Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {activeConnections.length === 0 
                    ? "Connect an exchange first, then configure Orion AI with your trading strategy." 
                    : "Configure Orion AI with your preferred trading strategy for automated execution."}
                </p>
                {activeConnections.length > 0 && (
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create First Strategy
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orionInstances.map((orion) => (
                  <div key={orion.id} className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-black dark:hover:border-white transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          orion.status === 'active' 
                            ? 'bg-black dark:bg-white shadow-lg' 
                            : 'bg-gray-300 dark:bg-gray-700'
                        }`}>
                          <Sparkles className={`w-6 h-6 ${orion.status === 'active' ? 'text-white dark:text-black' : 'text-white'}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{orion.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{orion.strategy.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge variant={orion.status === 'active' ? 'default' : 'secondary'} className={
                        orion.status === 'active' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : ''
                      }>
                        {orion.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white dark:bg-black rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Trades</div>
                        <div className="font-bold text-gray-900 dark:text-white">{orion.total_trades || 0}</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-black rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Win Rate</div>
                        <div className="font-bold text-green-600">{orion.win_rate || 0}%</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-black rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">P/L</div>
                        <div className={`font-bold ${(orion.total_profit_loss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(orion.total_profit_loss || 0) >= 0 ? '+' : ''}${(orion.total_profit_loss || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-4 p-3 bg-white dark:bg-black rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Risk Level</span>
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">{orion.risk_level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Max Position</span>
                        <span className="font-semibold text-gray-900 dark:text-white">${orion.max_position_size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Stop Loss / Take Profit</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{orion.stop_loss_percent}% / {orion.take_profit_percent}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => toggleOrionMutation.mutate({ id: orion.id, currentStatus: orion.status })}
                        disabled={toggleOrionMutation.isPending}
                        variant={orion.status === 'active' ? 'destructive' : 'default'}
                        className={orion.status !== 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {orion.status === 'active' ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="dark:border-gray-800 dark:text-gray-300">
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <Card className="bg-gradient-to-br from-gray-100/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300 h-[600px]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Brain className="w-6 h-6 text-gray-900 dark:text-white" />
                Orion Intelligence Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Market Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bullish momentum detected in tech sector. AI confidence: 87%. Momentum strategies performing well.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-gray-900 dark:text-white mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Performance Optimization</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Strategies performing above market average. Consider slight position size increase for optimal returns.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Orion Update</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Neural networks have been recalibrated for upcoming FOMC meeting volatility.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orion Chat Interface */}
          <OrionChatInterface trades={recentTrades} />
        </div>
      </div>
    </div>
  );
}
