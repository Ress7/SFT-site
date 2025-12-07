import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export default function PaywallGate({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();
  let paid = false;
  try { paid = localStorage.getItem('sf_paid') === 'true'; } catch {}

  const adminEmails = new Set(['ressebar7@gmail.com', 'yaqub.h008@gmail.com']);
  const isAdmin = !!user && adminEmails.has((user.email || '').toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (paid || isAdmin) return children;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Lock className="w-5 h-5" />
            Access Locked
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            A subscription is required to use this part of Stoneforge. Complete checkout to unlock full access.
          </p>
          <Button onClick={() => navigate('/payment')} className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
            <CreditCard className="w-4 h-4 mr-2" />
            Go to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
