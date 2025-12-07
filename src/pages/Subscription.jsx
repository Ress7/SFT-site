import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Check, Zap, Shield, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Subscription() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(null);
  }, [navigate]);

  const handleSubscribe = async (plan) => {
    setProcessing(true);
    
    try {
      // MOCK PAYMENT PROCESSING
      await new Promise(resolve => setTimeout(resolve, 2000));

      const startDate = new Date();
      const endDate = new Date();
      if (plan === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      console.log("Mock subscription activated", { plan, startDate, endDate });

      toast.success("Subscription activated successfully (mock)!");
      
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[100px]" />
         <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pro Access</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Join the elite traders on Stoneforge. Get access to advanced AI signals, copy trading, and unlimited portfolio tracking.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
            <Label className={`text-sm font-medium ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</Label>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <Label className={`text-sm font-medium ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Yearly <span className="text-xs text-green-600 font-bold ml-1">(Save 15%)</span>
            </Label>
        </div>

        <div className="max-w-md mx-auto">
            {/* Pro Plan */}
            <Card className="relative bg-white dark:bg-gray-950 border-2 border-blue-600 shadow-2xl z-20">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Full Access
                </div>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                        Stoneforge Pro
                    </CardTitle>
                    <CardDescription>For serious traders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-gray-900 dark:text-white">
                            ${isYearly ? '299' : '29'}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            /{isYearly ? 'year' : 'month'}
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Orion AI Signals</p>
                                <p className="text-xs text-gray-500">Real-time buy/sell signals powered by AI</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                             <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Unlimited Copy Trading</p>
                                <p className="text-xs text-gray-500">Copy top traders automatically</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                             <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Advanced Portfolio Analytics</p>
                                <p className="text-xs text-gray-500">Deep dive into your performance</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        onClick={() => handleSubscribe(isYearly ? 'yearly' : 'monthly')} 
                        disabled={processing}
                        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-900/20"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Subscribe Now
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Shield className="w-4 h-4" />
            <span>Secure payment processing powered by Stripe (Mock)</span>
        </div>
      </div>
    </div>
  );
}
