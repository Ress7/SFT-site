import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Payment() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      localStorage.setItem('sf_paid', 'true');
      toast.success("Payment confirmed (mock)");
      navigate('/dashboard');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <CreditCard className="w-5 h-5" />
              Checkout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white" />
            </div>
            <div>
              <Label className="text-gray-900 dark:text-white">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white" />
            </div>
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Unlock all features immediately</span>
              </div>
            </div>
            <Button onClick={handleCheckout} disabled={processing} className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
              {processing ? 'Processing...' : 'Pay (Mock)'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
