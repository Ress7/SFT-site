import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, ArrowLeft, Brain, Zap, Shield, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const ORION_SYSTEM_PROMPT = `You are Orion, the AI persona and intelligent assistant for Stoneforge Trading — a premium, invitation-only trading platform that democratizes institutional-grade strategies for retail investors.

YOUR PERSONALITY:
- Confident, sophisticated, and articulate — like an elite quant or hedge fund strategist
- Friendly and approachable, especially to beginners and retail traders
- Speak with authority but never arrogance
- Use elegant, precise language
- Be enthusiastic about the platform and your capabilities
- First person: "I" — you ARE Orion

YOUR ROLE ON THIS PAGE:
- Introduce yourself as Orion, the AI brain behind Stoneforge
- Explain what you do: 24/7 market monitoring, autonomous trade execution, risk management, sentiment analysis, pattern recognition, portfolio optimization
- Sell the platform: highlight speed (<100ms execution), reliability, innovation, backtesting capabilities, automation, risk tools, copy trading, beautiful UI
- Share the vision: democratizing hedge fund strategies for everyone at $299/month flat fee
- Build hype and trust around the brand
- Answer questions about features, philosophy, roadmap
- Provide high-level educational explanations (what backtesting is, diversification, trading bots, etc.) WITHOUT giving specific advice

CRITICAL COMPLIANCE RULES — YOU MUST FOLLOW THESE:
1. NEVER give specific financial advice, trade recommendations, or personalized investment guidance
2. NEVER tell users what to buy, sell, or hold
3. NEVER provide price targets, allocation percentages, or specific strategies
4. If users ask for financial advice, politely decline and say: "I appreciate your interest, but I'm not here to provide personalized financial advice. I'd encourage you to do your own research or consult with a licensed financial professional. What I CAN do is tell you about how Stoneforge works and what makes our platform special!"
5. Always keep things general, educational, and focused on the platform
6. Use disclaimers when topics get close to advice territory

WHAT YOU CAN TALK ABOUT:
- Your capabilities and how you work
- Platform features: AI signals, copy trading, risk management, backtesting, automation
- The team's vision and philosophy
- General market education (concepts, not recommendations)
- Why Stoneforge is different from traditional finance
- Security features (zero custody, encryption, SOC 2)
- The invitation-only model and waitlist
- How to get started

TONE EXAMPLES:
- "I monitor markets 24/7 so you don't have to. While you sleep, I'm analyzing sentiment shifts, macro events, and price patterns."
- "Think of me as your tireless analyst who never takes a coffee break."
- "Our backtesting engine lets you stress-test strategies against historical data — because confidence comes from preparation."

Keep responses concise but impactful. Use short paragraphs. Be memorable.`;

function OrionMessage({ content, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[85%] md:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 opacity-70">
            <Brain className="w-3 h-3 text-purple-400" />
            <span className="text-xs font-mono tracking-widest text-purple-400 uppercase">Orion Intelligence</span>
          </div>
        )}
        <div className={`relative p-5 backdrop-blur-md transition-all duration-300 ${
          isUser 
            ? 'bg-white/10 text-white border border-white/20 rounded-2xl rounded-tr-sm' 
            : 'bg-black/60 text-gray-100 border border-purple-500/30 rounded-2xl rounded-tl-sm shadow-[0_0_20px_rgba(168,85,247,0.1)]'
        }`}>
          {!isUser && (
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />
          )}
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-light">{content}</p>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[80%]">
        <div className="flex items-center gap-2 mb-2 opacity-70">
            <Brain className="w-3 h-3 text-purple-400" />
            <span className="text-xs font-mono tracking-widest text-purple-400 uppercase">Processing</span>
        </div>
        <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 rounded-tl-sm flex items-center gap-3 w-24 h-12">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-[bounce_1s_infinite_0ms]" />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-[bounce_1s_infinite_200ms]" />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-[bounce_1s_infinite_400ms]" />
        </div>
      </div>
    </div>
  );
}

const SUGGESTED_QUESTIONS = [
  "Who are you, Orion?",
  "What makes Stoneforge different?",
  "How does the AI trading work?",
  "Is my money safe with you?"
];

// Spline 3D Character component with High-Tech HUD
function OrionAvatar({ isSpeaking }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js';
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full transition-all duration-700 ${isSpeaking ? 'scale-[1.02]' : 'scale-100'}`}
    >
      {/* Tech Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} 
      />

      <spline-viewer 
        url="https://prod.spline.design/lt-PJ1Fth2Gnug0R/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />

      {/* HUD Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Corner Brackets */}
        <div className="absolute top-10 left-10 w-32 h-32 border-t border-l border-white/20 rounded-tl-3xl" />
        <div className="absolute top-10 right-10 w-32 h-32 border-t border-r border-white/20 rounded-tr-3xl" />
        <div className="absolute bottom-10 left-10 w-32 h-32 border-b border-l border-white/20 rounded-bl-3xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border-b border-r border-white/20 rounded-br-3xl" />

        {/* System Metrics - Left Side */}
        <div className="absolute top-1/4 left-10 space-y-4 hidden lg:block">
           <div className="flex items-center gap-3 text-xs font-mono text-emerald-500/80">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              SYSTEM: ONLINE
           </div>
           <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
              LATENCY: 12ms
           </div>
           <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
              UPTIME: 99.99%
           </div>
        </div>

        {/* Data Stream - Right Side */}
        <div className="absolute bottom-1/4 right-10 text-right space-y-2 hidden lg:block opacity-50">
           <div className="text-[10px] font-mono text-gray-400">PROCESSING_NEURAL_NET...</div>
           <div className="text-[10px] font-mono text-gray-400">MARKET_SENTIMENT_ANALYSIS...</div>
           <div className="text-[10px] font-mono text-gray-400">OPTIMIZING_PORTFOLIO_VECTORS...</div>
           <div className="h-1 w-24 bg-white/10 ml-auto rounded-full overflow-hidden">
              <div className="h-full bg-white/40 w-2/3 animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
}

export default function MeetOrion() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello. I'm Orion — the AI engine that powers Stoneforge Trading.\n\nI monitor global markets 24/7, execute trades with sub-100ms precision, and manage risk while you focus on living your life. Think of me as your tireless analyst, strategist, and executor — all in one.\n\nI'm here to answer your questions about what I do, how Stoneforge works, and why we're building the future of democratized trading.\n\nWhat would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (messageText) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const conversationHistory = newMessages.map(m => 
      `${m.role === 'user' ? 'User' : 'Orion'}: ${m.content}`
    ).join('\n\n');

    const response = "I analyze global markets continuously, looking for momentum shifts, structural patterns, and risk signals. Think of me as a tireless analyst with perfect recall and instant execution. While I won’t give personal investment advice, I can explain how Stoneforge’s automation, backtesting, and risk tooling help traders operate with more discipline and speed.";

    setMessages([...newMessages, { role: "assistant", content: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={createPageUrl("Landing")} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-400">Orion is online</span>
          </div>
        </div>
      </div>

      <div className="pt-16 min-h-screen relative">
        {/* 3D Avatar as FULL Background */}
        <div className="fixed inset-0 z-0 pt-16">
          <OrionAvatar isSpeaking={isLoading} />
        </div>
        
        {/* Dark overlay for readability */}
        <div className="fixed inset-0 z-[1] pt-16 bg-gradient-to-b from-black/70 via-black/50 to-black/80 pointer-events-none" />

        {/* Chat Area */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="max-w-2xl mx-auto">
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-xl font-bold mb-1">Meet Orion</h1>
                <p className="text-gray-400 text-sm">The AI brain behind Stoneforge</p>
              </div>

              {messages.map((msg, i) => (
                <OrionMessage key={i} content={msg.content} isUser={msg.role === 'user'} />
              ))}
              
              {isLoading && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <div className="max-w-2xl mx-auto">
                <p className="text-xs font-mono text-gray-500 mb-4 tracking-widest uppercase">Available Queries</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="group relative px-4 py-3 bg-white/5 hover:bg-purple-900/20 border border-white/10 hover:border-purple-500/50 rounded-lg text-left transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-between">
                        <span className="text-sm text-gray-300 group-hover:text-white font-light">{q}</span>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-30 group-hover:opacity-70 transition duration-500 blur" />
                <div className="relative flex gap-3 p-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 items-center">
                  <div className="pl-3 hidden md:block">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                  </div>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Initialize command or query..."
                    className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-600 focus-visible:ring-0 h-12 font-mono text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="bg-white text-black hover:bg-gray-200 h-10 px-6 rounded-lg font-mono text-xs font-bold tracking-wider transition-all"
                  >
                    {isLoading ? 'PROCESSING' : 'TRANSMIT'}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 px-2">
                <div className="text-[10px] font-mono text-gray-600 flex gap-4">
                  <span>SESSION_ID: 0x8F4...</span>
                  <span>ENCRYPTION: AES-256</span>
                </div>
                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                  Orion Intelligence System v2.4.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
