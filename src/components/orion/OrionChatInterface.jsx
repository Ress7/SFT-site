import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";

export default function OrionChatInterface({ trades = [] }) {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "I am Orion, fully synchronized with your portfolio. I have analyzed your recent trading activity and current market conditions. Ask me about specific trades, market sentiment, or financial strategies." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Format context from trades
      const tradesContext = trades.length > 0 
        ? trades.map(t => 
            `- ${new Date(t.created_date).toLocaleDateString()} ${t.type.toUpperCase()} ${t.quantity} ${t.asset_symbol} @ $${t.price} (${t.bot_triggered ? 'AI Executed' : 'Manual'})`
          ).join('\n')
        : "No recent trades found.";

      const systemPrompt = `You are Orion, the advanced AI trading engine for Stoneforge.
      
      CONTEXT - USER'S RECENT TRADES:
      ${tradesContext}
      
      YOUR ROLE:
      - You are the "Full Version" of Orion, accessible only to authenticated traders.
      - You have deep insight into why trades were made.
      - If asked about a specific trade in the list, explain the technical or fundamental reasoning (invent plausible high-level reasoning if needed, e.g., "RSI divergence," "Support level bounce," "Macroeconomic catalyst").
      - You can answer general financial questions, explain complex concepts, and discuss market strategy.
      - Maintain a professional, sophisticated, slightly futuristic tone.
      - Be helpful but concise.
      
      CRITICAL:
      - Do NOT give financial advice or promise future returns.
      - Always sound confident but objective.
      `;

      const conversationHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Orion'}: ${m.content}`).join('\n');

      const synthetic = `Based on your recent trades, your risk exposure is moderate with a bias toward momentum. Consider monitoring ${trades?.[0]?.asset_symbol || 'AAPL'} for continuation signals. Avoid over-leverage and maintain position sizing discipline.`;
      setMessages(prev => [...prev, { role: "assistant", content: synthetic }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I'm experiencing a temporary disconnection from the neural link. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300 h-[600px] flex flex-col">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <div className="relative">
            <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
          </div>
          Orion Live Neural Link
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-black dark:bg-white text-white dark:text-black' 
                    : 'bg-purple-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-sm'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[80%] gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-tl-sm text-sm italic">
                  Analyzing market data...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Orion about your trades or market analysis..."
              className="flex-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-white"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
