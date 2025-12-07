import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Filter, Star, Globe, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function AssetExplorer({ assets, selectedAsset, onSelectAsset }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Normalize filtering
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    // Flexible matching for "futures", "options", "forex", etc. if data allows
    // Assuming 'type' property exists on asset
    const typeMap = {
        stocks: ['stock', 'etf'],
        crypto: ['crypto'],
        forex: ['forex'],
        futures: ['futures', 'index'],
        options: ['option']
    };
    
    const allowedTypes = typeMap[activeTab] || [activeTab];
    const matchesType = allowedTypes.includes(asset.type?.toLowerCase());

    return matchesSearch && matchesType;
  });

  const categories = [
    { id: "all", label: "All" },
    { id: "stocks", label: "Stocks" },
    { id: "crypto", label: "Crypto" },
    { id: "forex", label: "Forex" },
    { id: "futures", label: "Futures" },
    { id: "options", label: "Options" },
  ];

  return (
    <Card className="h-full flex flex-col bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
      <div className="p-4 space-y-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Global Markets
            </h2>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">
                {filteredAssets.length} Assets
            </Badge>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="Search ticker, company, or asset..."
            className="pl-10 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                        activeTab === cat.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No assets found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-900">
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id || asset.symbol}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => onSelectAsset(asset)}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900/50 border-l-4 ${
                    selectedAsset?.id === asset.id 
                      ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-500" 
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            asset.type === 'crypto' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                            asset.type === 'forex' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                            {asset.symbol.substring(0, 1)}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                {asset.symbol}
                                {asset.ai_signal && (
                                    <Zap className={`w-3 h-3 ${asset.ai_signal.includes('buy') ? 'text-green-500' : 'text-red-500'}`} />
                                )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                                {asset.name}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium text-sm text-gray-900 dark:text-white">
                        ${asset.current_price?.toLocaleString()}
                      </div>
                      <div className={`flex items-center justify-end text-xs font-medium ${
                        (asset.price_change_24h || 0) >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {(asset.price_change_24h || 0) >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(asset.price_change_24h || 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-gray-100 dark:bg-gray-800 text-gray-500">
                        {asset.type?.toUpperCase()}
                    </Badge>
                    {asset.exchange && (
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{asset.exchange}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}