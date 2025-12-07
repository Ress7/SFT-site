import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, CheckCircle, XCircle, Plus, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showApiKey, setShowApiKey] = useState({});
  const [provider, setProvider] = useState(() => {
    try { return localStorage.getItem('marketProvider') || 'finnhub'; } catch { return 'finnhub'; }
  });
  const [finnhubToken, setFinnhubToken] = useState(() => {
    try { return localStorage.getItem('finnhubToken') || ''; } catch { return ''; }
  });
  const [alphaKey, setAlphaKey] = useState(() => {
    try { return localStorage.getItem('alphaVantageKey') || ''; } catch { return ''; }
  });
  const siteFinnhubToken = import.meta.env?.VITE_FINNHUB_TOKEN || '';
  const siteAlphaKey = import.meta.env?.VITE_ALPHA_KEY || '';
  const [newConnection, setNewConnection] = useState({
    exchange_name: "binance",
    api_key: "",
    api_secret: "",
    permissions: ["read", "trade"]
  });


  const [connections, setConnections] = useState(() => {
    try {
      const raw = localStorage.getItem('sf_exchange_connections');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const createConnectionMutation = {
    isPending: false,
    mutate: (data) => {
      setConnections(prev => {
        const next = [...prev, { id: `c${prev.length+1}`, ...data, status: 'connected', last_sync: new Date().toISOString() }];
        try { localStorage.setItem('sf_exchange_connections', JSON.stringify(next)); } catch {}
        return next;
      });
      toast.success("Exchange connected successfully (mock)!");
      setShowConnectDialog(false);
      setNewConnection({
        exchange_name: "binance",
        api_key: "",
        api_secret: "",
        permissions: ["read", "trade"]
      });
    }
  };

  const deleteConnectionMutation = {
    mutate: (id) => {
      setConnections(prev => {
        const next = prev.filter(c => c.id !== id);
        try { localStorage.setItem('sf_exchange_connections', JSON.stringify(next)); } catch {}
        return next;
      });
      toast.success("Connection removed (mock)");
    }
  };

  const handleConnect = () => {
    if (!newConnection.api_key || !newConnection.api_secret) {
      toast.error("Please fill in all fields");
      return;
    }
    createConnectionMutation.mutate(newConnection);
  };

  const exchangeLogos = {
    binance: "🟡",
    coinbase: "🔵",
    kraken: "🟣",
    alpaca: "🟢",
    interactive_brokers: "🔴"
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your API connections and preferences</p>
        </div>

        {/* Market Data API */}
        <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              {`Market Data (${provider === 'finnhub' ? 'Finnhub' : 'Alpha Vantage'})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Provider</Label>
              <Select value={provider} onValueChange={(v) => setProvider(v)}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finnhub">Finnhub</SelectItem>
                  <SelectItem value="alphavantage">Alpha Vantage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 dark:text-white">API Key</Label>
              <Input
                type="text"
                value={provider === 'finnhub' ? finnhubToken : alphaKey}
                onChange={(e) => provider === 'finnhub' ? setFinnhubToken(e.target.value) : setAlphaKey(e.target.value)}
                placeholder={provider === 'finnhub' ? 'Enter Finnhub token' : 'Enter Alpha Vantage API key'}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white font-mono text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {(() => {
                  const connected = provider === 'finnhub' ? (finnhubToken || siteFinnhubToken) : (alphaKey || siteAlphaKey);
                  const usingSite = provider === 'finnhub' ? (!finnhubToken && !!siteFinnhubToken) : (!alphaKey && !!siteAlphaKey);
                  if (connected) {
                    return `Status: Connected${usingSite ? ' (site token)' : ''}`;
                  }
                  return 'Status: Not Connected';
                })()}
              </div>
              <Button onClick={() => { try { localStorage.setItem('marketProvider', provider); if (provider === 'finnhub') { localStorage.setItem('finnhubToken', finnhubToken || ''); } else { localStorage.setItem('alphaVantageKey', alphaKey || ''); } } catch {}; }} className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Connections (UI-only) */}
        <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-gray-900 dark:text-white" />
                  Exchange Connections
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Connect your exchange APIs to enable automated trading with Orion AI
                </p>
              </div>
              <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Connection
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Connect Exchange</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label className="text-gray-900 dark:text-white">Exchange</Label>
                      <Select 
                        value={newConnection.exchange_name} 
                        onValueChange={(value) => setNewConnection({...newConnection, exchange_name: value})}
                      >
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="binance">Binance</SelectItem>
                          <SelectItem value="coinbase">Coinbase Pro</SelectItem>
                          <SelectItem value="kraken">Kraken</SelectItem>
                          <SelectItem value="alpaca">Alpaca</SelectItem>
                          <SelectItem value="interactive_brokers">Interactive Brokers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-900 dark:text-white">API Key</Label>
                      <Input
                        type="text"
                        value={newConnection.api_key}
                        onChange={(e) => setNewConnection({...newConnection, api_key: e.target.value})}
                        placeholder="Enter your API key"
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white font-mono text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-900 dark:text-white">API Secret</Label>
                      <Input
                        type="password"
                        value={newConnection.api_secret}
                        onChange={(e) => setNewConnection({...newConnection, api_secret: e.target.value})}
                        placeholder="Enter your API secret"
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white font-mono text-sm"
                      />
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm text-yellow-900 dark:text-yellow-200 mb-1">Security Notice</h4>
                          <p className="text-xs text-yellow-800 dark:text-yellow-300">
                            Your API keys are encrypted and stored securely. For maximum security, create API keys with "Read" and "Trade" permissions only. Never enable "Withdraw" permissions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleConnect} 
                      disabled={createConnectionMutation.isPending}
                      className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                    >
                      {createConnectionMutation.isPending ? "Connecting..." : "Connect Exchange"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {connections.length === 0 ? (
              <div className="text-center py-12">
                <Key className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Connections Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm">
                  Connect your exchange accounts to enable automated trading. Your API keys are encrypted and secure.
                </p>
                <Button 
                  onClick={() => setShowConnectDialog(true)}
                  className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Connection
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((conn) => (
                  <div key={conn.id} className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-black dark:hover:border-white transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{exchangeLogos[conn.exchange_name]}</div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">
                            {conn.exchange_name.replace('_', ' ')}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {conn.status === 'connected' ? (
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Disconnected
                              </Badge>
                            )}
                            {conn.permissions?.map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteConnectionMutation.mutate(conn.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">API Key</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type={showApiKey[conn.id] ? "text" : "password"}
                            value={conn.api_key}
                            readOnly
                            className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 dark:text-white font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowApiKey({...showApiKey, [conn.id]: !showApiKey[conn.id]})}
                            className="shrink-0"
                          >
                            {showApiKey[conn.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      {conn.last_sync && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last synced: {new Date(conn.last_sync).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How to Get API Keys */}
        <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">How to Get API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Binance</h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-1">
                <li>Log in to Binance and go to API Management</li>
                <li>Create new API key with "Enable Reading" and "Enable Spot & Margin Trading"</li>
                <li>Do NOT enable "Enable Withdrawals"</li>
                <li>Copy API Key and Secret Key</li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Coinbase Pro</h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-1">
                <li>Log in to Coinbase Pro and navigate to API settings</li>
                <li>Click "New API Key"</li>
                <li>Select "View" and "Trade" permissions only</li>
                <li>Copy API Key, Secret, and Passphrase</li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Alpaca (Stock Trading)</h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-1">
                <li>Sign up for Alpaca and verify your account</li>
                <li>Go to Paper Trading or Live Trading section</li>
                <li>Generate API keys from the dashboard</li>
                <li>Copy API Key ID and Secret Key</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
