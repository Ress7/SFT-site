import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ok = localStorage.getItem("inviteCodeVerified") === "true";
    if (!ok) {
      navigate("/access");
    }
  }, [navigate]);

  const handleCreateAccount = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-lg z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={createPageUrl("Landing")}>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ce5d09cbce0fa35e3dca6/1f3c43b3b_image.png" 
              alt="Stoneforge" 
              className="h-8"
            />
          </Link>
        </div>
      </div>

      <div className="pt-24 pb-16 px-6 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-900/50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Invite Code Accepted!</h1>
            <p className="text-gray-400">You're approved for early access to Stoneforge</p>
          </div>

          <Card className="bg-gray-950 border-gray-800">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-gray-300 text-sm">AI-powered trading strategies</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-gray-300 text-sm">Bank-grade security</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span className="text-gray-300 text-sm">$299/month flat fee</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-gray-900 border-gray-800 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-900 border-gray-800 text-white" />
                  </div>
                  {error && <div className="text-sm text-red-400">{error}</div>}
                  <Button 
                    onClick={handleCreateAccount}
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-200 text-black h-14 rounded-full text-base font-semibold"
                  >
                    {loading ? "Creating..." : "Create Your Account"}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link to={createPageUrl("Landing")} className="text-gray-500 hover:text-gray-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
