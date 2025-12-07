import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { QRCodeSVG } from "qrcode.react"; // Removed: Package not available 
// Note: Since I cannot install new packages, I will use an image-based QR code or SVG if available.
// Prompt said "Only the following packages are installed...". qrcode.react is NOT in the list.
// So I will use an API based QR code generator for simplicity and robustness without extra deps.

import { Shield, Star, TrendingUp, Award, Lock, Zap, Crown } from "lucide-react";

export default function TraderCard({ user, className = "" }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isPublic = user?.public_profile_enabled ?? true;

  const handleFlip = () => {
    if (isPublic) {
        setIsFlipped(!isFlipped);
    }
  };

  // Ranks Configuration
  const ranks = [
    { id: 1, name: "VANGUARD", minTrades: 0, icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { id: 2, name: "ELITE", minTrades: 50, icon: Shield, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
    { id: 3, name: "APEX", minTrades: 200, icon: Crown, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" }
  ];

  const trades = user?.total_trades || 0;
  const currentRank = ranks.slice().reverse().find(r => trades >= r.minTrades) || ranks[0];
  const RankIcon = currentRank.icon;

  // Fallbacks
  const nickname = user?.trader_nickname || user?.full_name?.split(" ")[0] || "Trader";
  const fullName = user?.full_name || "Anonymous";
  const stoneforgeId = user?.stoneforge_id || "PENDING";
  const profileUrl = `${window.location.origin}/trader/${stoneforgeId}`; 
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&color=000000&bgcolor=FFFFFF`;

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
    <div className="relative w-full max-w-[320px] aspect-[0.714] perspective-1000 mx-auto">
      <motion.div
        className={`w-full h-full relative preserve-3d transition-all duration-500 ${isPublic ? 'cursor-pointer' : 'cursor-not-allowed grayscale-[0.8] opacity-80'}`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        onClick={handleFlip}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-[20px] overflow-hidden shadow-2xl border border-white/10 bg-black"
          style={{ backfaceVisibility: "hidden" }}
        >
            {!isPublic && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Lock className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-300 font-bold tracking-widest uppercase text-sm">Card Locked</p>
                    <p className="text-gray-500 text-[10px] mt-1">Enable Public Profile</p>
                </div>
            )}
          {/* Holo/Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-black/90 z-0" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
          
          {/* Holo Shine Effect (Conceptual) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

          {/* Content */}
          <div className="relative z-20 p-6 flex flex-col h-full justify-between">
            {/* Top Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <RankIcon className={`w-5 h-5 ${currentRank.color}`} />
                <span className={`text-xs font-mono ${currentRank.color} tracking-widest uppercase`}>{currentRank.name} TRADER</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Avatar & Main Info */}
            <div className="text-center space-y-4 mt-4">
              <div className="relative w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-br from-yellow-400 via-purple-500 to-indigo-600">
                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                    {user?.profile_image ? (
                        <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-white">
                            {nickname.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1 border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-black">
                        99
                    </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md font-sans uppercase break-words">
                  {nickname}
                </h2>
                <p className="text-sm text-gray-300 font-medium">{fullName}</p>
              </div>

              {/* Stats Row */}
              <div className="flex justify-center gap-4 py-2">
                <div className="bg-white/5 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Win Rate</div>
                    <div className="text-sm font-bold text-green-400">{user?.win_rate || 0}%</div>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Trades</div>
                    <div className="text-sm font-bold text-blue-400">{user?.total_trades || 0}</div>
                </div>
              </div>
            </div>

            {/* Bottom ID */}
            <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-0.5">Stoneforge ID</div>
                <div className="font-mono text-sm text-white tracking-wider">{stoneforgeId}</div>
              </div>
              <Award className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 w-full h-full rounded-[20px] overflow-hidden shadow-2xl border border-white/10 bg-black"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-bl from-black via-gray-900 to-black z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent z-0" />

            {/* Content */}
            <div className="relative z-20 p-8 flex flex-col h-full items-center justify-center text-center space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">SCAN TO VIEW</h3>
                    <p className="text-xs text-gray-400">Open Stoneforge App to copy trades</p>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-lg">
                    <img 
                        src={qrUrl} 
                        alt="QR Code" 
                        className="w-32 h-32 object-contain mix-blend-multiply" 
                    />
                </div>

                <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-1">Unique ID</div>
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 font-mono text-sm text-white tracking-widest select-all cursor-text">
                        {stoneforgeId}
                    </div>
                </div>

                <div className="text-[10px] text-gray-600 pt-4">
                    stoneforge.com/trader/{stoneforgeId}
                </div>
            </div>
        </div>
      </motion.div>
    </div>

    {/* Rank Progress */}
    <div className="w-full max-w-[320px] px-2">
        <div className="flex justify-between items-center relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10 transform -translate-y-1/2" />
            
            {ranks.map((rank) => {
                const isActive = currentRank.id === rank.id;
                const isPast = currentRank.id > rank.id;
                const RIcon = rank.icon;
                
                return (
                    <div key={rank.name} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white dark:bg-black ${
                            isActive ? `${rank.border} ${rank.color} scale-110 shadow-lg` : 
                            isPast ? 'border-gray-400 text-gray-400' : 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700'
                        }`}>
                            <RIcon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold tracking-wider ${isActive ? rank.color : 'text-gray-400'}`}>
                            {rank.name}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
    </div>
  );
}
