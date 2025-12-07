import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Camera, Shield, Globe, LogOut, CheckCircle, Upload, LogIn, UserPlus, Edit2, CreditCard, Receipt, CalendarClock, CreditCard as BillingIcon } from "lucide-react";
import TraderCard from "@/components/social/TraderCard";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();
  const adminEmails = new Set(['ressebar7@gmail.com', 'yaqub.h008@gmail.com']);
  const isAdmin = !!user && adminEmails.has((user.email || '').toLowerCase());
  const [profileData, setProfileData] = useState({
    bio: "",
    portfolio_public: false,
    country: "",
    profile_image: "",
    stoneforge_id: "",
    trader_nickname: "",
    public_profile_enabled: true
  });
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      let saved = null;
      try {
        const raw = localStorage.getItem('publicTraders');
        const list = raw ? JSON.parse(raw) : [];
        saved = list.find(x => x.id === user.id) || null;
      } catch {}
      const md = user.user_metadata || {};
      const next = {
        bio: md.bio || saved?.bio || "",
        portfolio_public: (md.portfolio_public !== undefined ? md.portfolio_public : (saved?.portfolio_public !== undefined ? saved?.portfolio_public : false)),
        country: md.country || saved?.country || "",
        profile_image: md.profile_image || saved?.profile_image || "",
        stoneforge_id: md.stoneforge_id || saved?.stoneforge_id || profileData.stoneforge_id,
        trader_nickname: md.trader_nickname || saved?.trader_nickname || "",
        public_profile_enabled: (md.public_profile_enabled !== undefined ? md.public_profile_enabled : (saved?.public_profile_enabled !== undefined ? saved?.public_profile_enabled : true))
      };
      setProfileData(prev => ({ ...prev, ...next }));
      try {
        const raw = localStorage.getItem('publicTraders');
        const list = raw ? JSON.parse(raw) : [];
        const record = {
          id: user.id,
          email: user.email,
          full_name: md.full_name || user.email,
          trader_nickname: next.trader_nickname,
          stoneforge_id: next.stoneforge_id,
          profile_image: next.profile_image,
          public_profile_enabled: next.public_profile_enabled,
          win_rate: user.win_rate || 0,
          total_trades: user.total_trades || 0,
          total_returns: user.total_returns || 0,
          followers: user.followers || 0,
          created_at: user.created_at
        };
        const idx = list.findIndex(x => x.id === user.id);
        if (next.public_profile_enabled) {
          if (idx >= 0) list[idx] = { ...list[idx], ...record }; else list.push(record);
        } else {
          if (idx >= 0) list.splice(idx, 1);
        }
        localStorage.setItem('publicTraders', JSON.stringify(list));
      } catch {}
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const metaId = user.user_metadata?.stoneforge_id;
      const hasId = profileData.stoneforge_id && profileData.stoneforge_id.length > 0;
      if (!hasId) {
        const newId = metaId || `SF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setProfileData(prev => ({ ...prev, stoneforge_id: newId }));
        supabase.auth.updateUser({ data: { stoneforge_id: newId } }).catch(() => {});
      }
    }
  }, [user]);

  const billingHistory = [];

  const updateProfileMutation = {
    isPending: false,
    mutate: (data) => {
      setProfileData(prev => {
        const next = { ...prev, ...data };
        try {
          const raw = localStorage.getItem('publicTraders');
          const list = raw ? JSON.parse(raw) : [];
          const record = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
            trader_nickname: next.trader_nickname,
            stoneforge_id: next.stoneforge_id,
            profile_image: next.profile_image,
            public_profile_enabled: next.public_profile_enabled,
            win_rate: user.win_rate || 0,
            total_trades: user.total_trades || 0,
            total_returns: user.total_returns || 0,
            followers: user.followers || 0,
            created_at: user.created_at
          };
          const idx = list.findIndex(x => x.id === user.id);
          if (next.public_profile_enabled) {
            if (idx >= 0) list[idx] = record; else list.push(record);
          } else {
            if (idx >= 0) list.splice(idx, 1);
          }
          localStorage.setItem('publicTraders', JSON.stringify(list));
        } catch {}
        supabase.auth.updateUser({ data: next }).catch(() => {});
        return next;
      });
      toast.success("Profile updated (mock)");
    }
  };

  const uploadImageMutation = {
    mutateAsync: async (file) => {
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profile_image: url }));
      toast.success("Image uploaded (mock)");
      return url;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        await uploadImageMutation.mutateAsync(file);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleLogin = async () => {
    setAuthError(null);
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    } else {
      if (rememberMe) {
        try { localStorage.setItem('rememberEmail', email); } catch {}
      } else {
        try { localStorage.removeItem('rememberEmail'); } catch {}
      }
      navigate("/dashboard");
    }
    setAuthLoading(false);
  };

  const handleSignup = async () => {
    setAuthError(null);
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
    } else {
      toast.success("Signup successful. Please check your email.");
    }
    setAuthLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-gray-900 dark:text-white">Welcome to Stoneforge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(!!v)} />
              <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
            </div>
            {authError && (
              <div className="text-sm text-red-600">{authError}</div>
            )}
            <Button onClick={handleLogin} disabled={authLoading} className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
              <LogIn className="w-4 h-4 mr-2" />
              {authLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile and preferences</p>
        </div>

        {/* Digital Trader Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
             <div className="md:col-span-1">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Trader Card
                    </h3>
                    <Badge variant="outline" className="text-xs">
                          <span className="hidden md:inline">Click to flip</span>
                          <span className="md:hidden">Tap to flip</span>
                      </Badge>
                </div>
                <TraderCard user={{...user, ...profileData}} />
             </div>

             <div className="md:col-span-2 space-y-6">
                {/* Profile Card */}
                <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <User className="w-5 h-5 text-gray-900 dark:text-white" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {profileData.profile_image ? (
                  <img
                    src={profileData.profile_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-black dark:border-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-3xl font-bold">
                    {user.full_name?.charAt(0) || user.email?.charAt(0)}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                  <Camera className="w-4 h-4 text-white dark:text-black" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{user.full_name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={(isAdmin || user.role === 'admin') ? 'default' : 'secondary'} className="bg-black dark:bg-white text-white dark:text-black">
                    {(isAdmin || user.role === 'admin') ? 'Admin' : (user.role || 'Member')}
                  </Badge>
                  {user.verified && (
                    <Badge className="bg-blue-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {isAdmin && (
                  <div className="mt-2 p-2 rounded-md border border-green-300 bg-green-50/60 text-green-800 text-xs">
                    Admin account with free access. Paywall bypass is active for this account.
                  </div>
                )}
              </div>
            </div>

            {/* Trader Nickname */}
            <div>
              <Label className="text-gray-900 dark:text-white">Trader Nickname</Label>
              <div className="text-xs text-gray-500 mb-2">Displayed on your digital card</div>
              <Input
                value={profileData.trader_nickname}
                onChange={(e) => setProfileData({ ...profileData, trader_nickname: e.target.value })}
                placeholder="e.g. CryptoKing"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white"
              />
            </div>

            {/* Bio */}
            <div>
              <Label className="text-gray-900 dark:text-white">Bio</Label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell others about your trading experience..."
                className="mt-2 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white"
                rows={4}
              />
            </div>

            {/* Country */}
            <div>
              <Label className="text-gray-900 dark:text-white">Country</Label>
              <Input
                value={profileData.country}
                onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                placeholder="United States"
                className="mt-2 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white"
              />
            </div>

            <Button onClick={handleSave} disabled={updateProfileMutation.isPending} className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
              {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
        </div>
        </div>

        {/* Subscription & Billing */}
        <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <BillingIcon className="w-5 h-5 text-gray-900 dark:text-white" />
              Subscription & Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
               <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                     Current Plan: {(isAdmin || user.role === 'admin') ? 'Admin Lifetime' : user.subscription_plan === 'monthly' ? 'Pro Monthly' : user.subscription_plan === 'yearly' ? 'Pro Yearly' : 'No Active Plan'}
                     <Badge className={(isAdmin || user.subscription_status === 'active') ? "bg-green-600 hover:bg-green-700" : "bg-gray-600"}>
                        {(isAdmin || user.role === 'admin') ? 'Admin Override' : user.subscription_status === 'active' ? 'Active' : 'Inactive'}
                     </Badge>
                  </h3>
                  {user && user.current_period_end && (
                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" />
                        Next billing date: {new Date(user.current_period_end).toLocaleDateString()}
                     </p>
                  )}
               </div>
               {user && user.subscription_status !== 'active' && user.role !== 'admin' && (
                  <Button onClick={() => (window.location.href = "/subscription")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
                     Unlock Full Access
                  </Button>
               )}
            </div>

            <div>
               <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Billing History
               </h4>
               <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 grid grid-cols-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                     <div>Date</div>
                     <div>Amount</div>
                     <div>Plan</div>
                     <div className="text-right">Status</div>
                  </div>
                  {billingHistory.length === 0 ? (
                     <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        No billing history found
                     </div>
                  ) : (
                     <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {billingHistory.map((bill) => (
                           <div key={bill.id} className="p-3 grid grid-cols-4 text-sm items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                              <div className="text-gray-900 dark:text-white">{new Date(bill.date || bill.created_date).toLocaleDateString()}</div>
                              <div className="text-gray-900 dark:text-white">${bill.amount.toFixed(2)}</div>
                              <div className="text-gray-600 dark:text-gray-400">{bill.plan_name}</div>
                              <div className="text-right">
                                 <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900">
                                    {bill.status}
                                 </Badge>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Shield className="w-5 h-5 text-gray-900 dark:text-white" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Public Profile</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to find your card and see stats</p>
              </div>
              <Switch
                checked={profileData.public_profile_enabled}
                onCheckedChange={(checked) => {
                  setProfileData({ ...profileData, public_profile_enabled: checked });
                  updateProfileMutation.mutate({ public_profile_enabled: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Public Portfolio</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your specific holdings</p>
              </div>
              <Switch
                checked={profileData.portfolio_public}
                onCheckedChange={(checked) => {
                  setProfileData({ ...profileData, portfolio_public: checked });
                  updateProfileMutation.mutate({ portfolio_public: checked });
                }}
              />
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-gray-900 dark:text-white mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Visibility</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {profileData.portfolio_public 
                      ? "Your portfolio is visible on the Social Trading leaderboard."
                      : "Your portfolio is private. Enable to appear on the leaderboard and gain followers."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.total_trades || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Trades</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">+{user.total_returns || 0}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Returns</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.win_rate || 0}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Win Rate</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.followers || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Followers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-red-200 dark:border-red-800 shadow-lg transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-red-600">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
