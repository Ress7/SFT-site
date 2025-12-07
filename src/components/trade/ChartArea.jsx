import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Maximize2, Minimize2, Activity, Newspaper, List, Settings2, Camera } from "lucide-react";
// removed unused imports

export default function ChartArea({ selectedAsset }) {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const chartContainerId = useRef("tradingview_" + Math.random().toString(36).substring(2, 15)).current;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timeframe, setTimeframe] = useState("D");
  const [activeIndicator, setActiveIndicator] = useState(null);

  useEffect(() => {
    if (!selectedAsset || !containerRef.current) return;

    // Clear previous widget if exists to prevent duplicates
    if (widgetRef.current) {
      containerRef.current.innerHTML = '';
    }

    const ensureWidget = () => {
      if (!window.TradingView) return;
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: selectedAsset.symbol,
        interval: timeframe,
        timezone: "Etc/UTC",
        theme: document.documentElement.classList.contains('dark') ? "dark" : "light",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: false,
        container_id: chartContainerId,
        hide_top_toolbar: false,
        hide_side_toolbar: false,
        save_image: true,
        studies: activeIndicator ? [activeIndicator] : [],
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650",
        withdateranges: true,
        hide_volume: false,
      });
    };

    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = ensureWidget;
      document.head.appendChild(script);
    } else {
      ensureWidget();
    }

    return () => {
      widgetRef.current = null;
    };
  }, [selectedAsset, timeframe, activeIndicator]);

  const timeframes = [
    { label: "1m", val: "1" },
    { label: "5m", val: "5" },
    { label: "1h", val: "60" },
    { label: "4h", val: "240" },
    { label: "1D", val: "D" },
    { label: "1W", val: "W" },
  ];

  const indicators = [
    { label: "RSI", val: "RSI@tv-basicstudies" },
    { label: "MACD", val: "MACD@tv-basicstudies" },
    { label: "EMA", val: "MASimple@tv-basicstudies" } // close enough for demo
  ];

  // Placeholder Data
  const orderBook = Array(8).fill(null).map((_, i) => ({
    price: (selectedAsset?.current_price * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2),
    size: Math.floor(Math.random() * 1000),
    total: Math.floor(Math.random() * 50000),
    type: Math.random() > 0.5 ? 'bid' : 'ask'
  })).sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

  return (
    <>
    {isFullScreen && (
        <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsFullScreen(false)}
        />
    )}
    <div className={`flex flex-col gap-4 transition-all duration-300 ${isFullScreen ? 'fixed inset-0 md:left-10 md:right-10 md:top-24 md:bottom-10 z-50 bg-black md:bg-black/95 p-2 md:p-4 md:rounded-xl border-0 md:border border-gray-800 shadow-2xl' : 'h-full'}`}>
        {/* Main Chart Card */}
        <Card className="flex-1 flex flex-col bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden relative group">
            {/* Chart Toolbar */}
            <div className="h-10 border-b border-gray-200 dark:border-gray-800 flex items-center justify-end px-2 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={() => {
                            if (widgetRef.current) {
                                try {
                                    widgetRef.current.chart().executeActionById('takeScreenshot');
                                } catch (e) {
                                    console.error("Error taking screenshot", e);
                                }
                            }
                        }}
                        title="Take Screenshot"
                    >
                        <Camera className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={() => {
                            if (widgetRef.current) {
                                try {
                                    widgetRef.current.chart().executeActionById('chartProperties');
                                } catch (e) {
                                    console.error("Error opening settings", e);
                                }
                            }
                        }}
                        title="Chart Settings"
                    >
                        <Settings2 className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={() => setIsFullScreen(!isFullScreen)}
                    >
                        {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Chart Container */}
            <CardContent className="p-0 flex-1 relative bg-[#131722]">
                <div id={chartContainerId} ref={containerRef} className="w-full h-full" />
                
                {!selectedAsset && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
                        <p className="text-gray-400">Select an asset to view chart</p>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Bottom Context Tabs */}
        <Card className="h-64 flex flex-col bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
            <Tabs defaultValue="orderbook" className="h-full flex flex-col">
                <div className="border-b border-gray-200 dark:border-gray-800 px-4 bg-gray-50/50 dark:bg-gray-900/30 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabsList className="bg-transparent h-10 p-0 w-full flex justify-start min-w-max">
                        <TabsTrigger value="orderbook" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 flex-shrink-0">
                            <List className="w-4 h-4 mr-2" /> Order Book
                        </TabsTrigger>
                        <TabsTrigger value="trades" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 flex-shrink-0">
                            <Activity className="w-4 h-4 mr-2" /> Recent Trades
                        </TabsTrigger>
                        <TabsTrigger value="news" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 flex-shrink-0">
                            <Newspaper className="w-4 h-4 mr-2" /> News
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="orderbook" className="flex-1 p-0 overflow-y-auto mt-0 custom-scrollbar">
                    <div className="grid grid-cols-3 gap-4 p-2 text-xs font-mono sticky top-0 bg-gray-100 dark:bg-gray-900 text-gray-500 z-10">
                        <div>Price (USD)</div>
                        <div className="text-right">Size</div>
                        <div className="text-right">Total (USD)</div>
                    </div>
                    <div className="p-2 space-y-1">
                        {orderBook.map((order, i) => (
                            <div key={i} className="grid grid-cols-3 gap-4 text-xs font-mono hover:bg-gray-100 dark:hover:bg-gray-800/50 p-1 rounded">
                                <div className={order.type === 'ask' ? 'text-red-500' : 'text-green-500'}>
                                    {order.price}
                                </div>
                                <div className="text-right text-gray-600 dark:text-gray-300">{order.size}</div>
                                <div className="text-right text-gray-500 dark:text-gray-400">{order.total.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="trades" className="flex-1 p-4 mt-0">
                    <div className="text-center text-gray-500 text-sm py-8">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        Live trade feed connecting...
                    </div>
                </TabsContent>

                <TabsContent value="news" className="flex-1 p-4 mt-0">
                     <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex gap-3 group cursor-pointer">
                                <div className="w-16 h-12 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                                        Market analysis for {selectedAsset?.symbol || 'Market'} - Q{i} Update
                                    </h4>
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                        Analysts predict significant movement based on recent technical indicators and global macro events...
                                    </p>
                                </div>
                            </div>
                        ))}
                     </div>
                </TabsContent>
            </Tabs>
        </Card>
    </div>
    </>
  );
}
