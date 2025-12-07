import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Brain, Zap, Shield, Wallet, Info, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

/**
 * Interface for OrionOrderRequest
 * @typedef {Object} OrionOrderRequest
 * @property {string} symbol - Asset symbol (e.g. "NASDAQ:AAPL")
 * @property {string} assetType - Asset type (e.g. "stock", "crypto")
 * @property {number} maxPositionSize - Maximum capital to allocate
 * @property {number} maxDailyLoss - Stop trading if loss exceeds this
 * @property {string} strategy - "trend_following", "scalping", etc.
 * @property {boolean} botEnabled - Whether the bot is active
 * @property {number} riskLevel - 1-10 scale
 */

export default function OrderPanel({ selectedAsset, onExecuteTrade, onUpdateOrion }) {
  const [mode, setMode] = useState("manual");
  
  // Manual State
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(1);
  const [leverage, setLeverage] = useState(1);

  // Orion State
  const [orionEnabled, setOrionEnabled] = useState(false);
  const [strategy, setStrategy] = useState("trend_following");
  const [riskLevel, setRiskLevel] = useState([5]);
  const [maxPosSize, setMaxPosSize] = useState(1000);
  const [maxDailyLoss, setMaxDailyLoss] = useState(100);

  const handleManualSubmit = (side) => {
    onExecuteTrade({
        asset: selectedAsset,
        type: side, // 'buy' or 'sell'
        quantity: parseFloat(quantity),
        price: selectedAsset.current_price,
        leverage
    });
  };

  const handleOrionUpdate = (enabled) => {
    setOrionEnabled(enabled);
    const request = {
        symbol: selectedAsset.symbol,
        assetType: selectedAsset.type,
        maxPositionSize: maxPosSize,
        maxDailyLoss: maxDailyLoss,
        strategy: strategy,
        botEnabled: enabled,
        riskLevel: riskLevel[0]
    };
    // Call parent handler
    onUpdateOrion(request);
    
    if(enabled) {
        toast.success("Orion AI Activated", {
            description: `Trading ${selectedAsset.symbol} with ${strategy.replace('_', ' ')} strategy.`
        });
    } else {
        toast.info("Orion AI Deactivated");
    }
  };

  if (!selectedAsset) {
    return (
        <Card className="h-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-500 p-6">
                <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select an asset to trade</p>
            </div>
        </Card>
    );
  }

  const totalCost = (quantity * (selectedAsset.current_price || 0)).toFixed(2);
  const fee = (totalCost * 0.001).toFixed(2); // 0.1% fee mock

  return (
    <Card className="h-full flex flex-col bg-black/90 backdrop-blur-2xl border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
        {/* Sci-fi grid background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
        
        {/* Glowing Border Effect for Orion Mode */}
        <motion.div 
            className={`absolute inset-0 pointer-events-none border transition-colors duration-500 z-0 rounded-xl ${
                orionEnabled 
                ? "border-purple-500/50 shadow-[inset_0_0_30px_rgba(168,85,247,0.15)]" 
                : "border-transparent"
            }`} 
        />

        <div className="p-5 border-b border-gray-800 bg-gray-950/50 z-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                        {selectedAsset.symbol}
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-700 text-gray-500 font-mono uppercase">{selectedAsset.type || 'AST'}</span>
                    </h2>
                    <p className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">{selectedAsset.name}</p>
                </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-white tracking-tight">
                        ${Number(selectedAsset.current_price || 0).toLocaleString()}
                      </div>
                      <div className={`text-xs font-bold flex items-center justify-end gap-1 ${(selectedAsset.price_change_24h || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {(selectedAsset.price_change_24h || 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {(selectedAsset.price_change_24h || 0) >= 0 ? "+" : ""}{Number(selectedAsset.price_change_24h || 0).toFixed(2)}%
                      </div>
                    </div>
            </div>
        </div>

        <Tabs value={mode} onValueChange={setMode} className="flex-1 flex flex-col z-10">
            <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-900/80 border border-gray-800 m-4 mt-4 mb-2 rounded-lg relative">
                <TabsTrigger 
                    value="manual" 
                    className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 transition-all duration-300"
                >
                    MANUAL
                </TabsTrigger>
                <TabsTrigger 
                    value="orion" 
                    className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-100 data-[state=active]:border-purple-500/30 border border-transparent flex items-center gap-2 text-gray-400 transition-all duration-300"
                >
                    <Brain className="w-3 h-3" /> ORION AI
                </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-5">
                <TabsContent value="manual" className="mt-0 space-y-6">
                    {/* Order Type */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Order Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['market', 'limit', 'stop'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setOrderType(type)}
                                    className={`py-2 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all border ${
                                        orderType === type 
                                        ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                                        : "bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity & Leverage */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Size</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="0"
                                    className="font-mono bg-gray-900/50 border-gray-800 text-white focus:border-blue-500 focus:ring-blue-500/20 h-10"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-mono">Units</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Leverage</label>
                            <Select value={leverage.toString()} onValueChange={(v) => setLeverage(parseInt(v))}>
                                <SelectTrigger className="bg-gray-900/50 border-gray-800 text-white h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800 text-white">
                                    <SelectItem value="1">1x</SelectItem>
                                    <SelectItem value="2">2x</SelectItem>
                                    <SelectItem value="5">5x</SelectItem>
                                    <SelectItem value="10">10x</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Cost Summary */}
                    <div className="bg-gray-900/30 border border-gray-800 p-4 rounded-lg space-y-3 text-sm backdrop-blur-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Estimated Cost</span>
                            <span className="font-mono font-medium text-gray-300">${totalCost}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Fees</span>
                            <span className="font-mono font-medium text-red-400/80">-${fee}</span>
                        </div>
                        <div className="pt-3 border-t border-dashed border-gray-800 flex justify-between font-bold items-center">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Total</span>
                            <span className="text-lg text-white font-mono tracking-tight">${(parseFloat(totalCost) + parseFloat(fee)).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button 
                            className="w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white h-12 border-t border-green-400/50 shadow-[0_5px_20px_rgba(22,163,74,0.3)] transition-all active:scale-[0.98]"
                            onClick={() => handleManualSubmit('buy')}
                        >
                            <div className="flex flex-col items-center leading-none">
                                <span className="text-lg font-bold tracking-wide">BUY</span>
                                <span className="text-[9px] opacity-80 font-mono tracking-wider">LONG</span>
                            </div>
                        </Button>
                        <Button 
                            className="w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white h-12 border-t border-red-400/50 shadow-[0_5px_20px_rgba(220,38,38,0.3)] transition-all active:scale-[0.98]"
                            onClick={() => handleManualSubmit('sell')}
                        >
                            <div className="flex flex-col items-center leading-none">
                                <span className="text-lg font-bold tracking-wide">SELL</span>
                                <span className="text-[9px] opacity-80 font-mono tracking-wider">SHORT</span>
                            </div>
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="orion" className="mt-0 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                <Brain className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-tight">Orion Autopilot</h3>
                                <p className="text-[10px] text-purple-300 font-mono uppercase tracking-wider">AI-driven execution</p>
                            </div>
                        </div>
                        <Switch 
                            checked={orionEnabled}
                            onCheckedChange={handleOrionUpdate}
                            className="data-[state=checked]:bg-purple-600 border-2 border-transparent data-[state=checked]:border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                        />
                    </div>

                    <div className={`space-y-6 transition-all duration-500 ${orionEnabled ? 'opacity-100 translate-y-0' : 'opacity-50 pointer-events-none grayscale translate-y-2'}`}>
                        
                        {/* Strategy Selector */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Core Strategy</label>
                            <Select value={strategy} onValueChange={setStrategy}>
                                <SelectTrigger className="bg-gray-900/50 border-purple-500/30 text-purple-100 h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-purple-500/20 text-gray-300">
                                    <SelectItem value="trend_following">Trend Following (Momentum)</SelectItem>
                                    <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                                    <SelectItem value="scalping">High-Freq Scalping</SelectItem>
                                    <SelectItem value="swing">Swing Trading</SelectItem>
                                    <SelectItem value="news_reactive">News Reactive (Sentiment)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Risk Controls */}
                        <div className="space-y-5 p-4 rounded-xl bg-gray-900/20 border border-gray-800">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs items-end">
                                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Max Position</span>
                                    <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">${maxPosSize}</span>
                                </div>
                                <Slider 
                                    value={[maxPosSize]} 
                                    onValueChange={(v) => setMaxPosSize(v[0])} 
                                    max={10000} 
                                    step={100} 
                                    className="py-2 [&>.relative>.bg-primary]:bg-blue-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs items-end">
                                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Stop Loss Limit</span>
                                    <span className="font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">-${maxDailyLoss}</span>
                                </div>
                                <Slider 
                                    value={[maxDailyLoss]} 
                                    onValueChange={(v) => setMaxDailyLoss(v[0])} 
                                    max={1000} 
                                    step={10} 
                                    className="py-2 [&>.relative>.bg-primary]:bg-red-500"
                                />
                            </div>
                        </div>

                        {/* AI Summary */}
                        <div className="p-5 bg-gray-950/80 rounded-xl border border-purple-500/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-gradient" />
                            <div className="absolute -right-6 -top-6 p-4 opacity-10 rotate-12 group-hover:opacity-20 transition-opacity duration-700">
                                <Zap className="w-32 h-32 text-purple-500" />
                            </div>
                            
                            <h4 className="text-[10px] font-black text-purple-400 uppercase mb-3 flex items-center gap-2 tracking-[0.2em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                Execution Protocol
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-mono relative z-10">
                                > Target: <span className="text-white font-bold">{selectedAsset.symbol}</span><br/>
                                > Logic: <span className="text-purple-300">{strategy}</span><br/>
                                > Size Cap: <span className="text-blue-300">${maxPosSize}</span><br/>
                                > Hard Stop: <span className="text-red-400">-${maxDailyLoss}</span>
                            </p>
                        </div>
                    </div>
                </TabsContent>
            </div>
        </Tabs>
    </Card>
  );
}
