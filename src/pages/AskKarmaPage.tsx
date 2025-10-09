import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Send } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAuth } from "@/App";

const API_KEY = 'AIzaSyAbJINoNUa_H8UCfdpjstcWJS2ZMjDB3mQ';
const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AskKarmaPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: `Hi ${user?.name || 'there'}! 👋\n\nAsk me anything about skincare, beauty, or wellness! I'm here to help you with personalized advice, product recommendations, and expert tips.`,
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [user?.name, messages.length]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const prompt = `You are Karma Terra, a friendly and knowledgeable AI assistant specializing in skincare, beauty, and wellness. You provide personalized, expert advice with a warm and encouraging tone. 

User's question: ${inputText}

Please provide a helpful, detailed response that:
1. Directly addresses their question
2. Offers practical, actionable advice
3. Mentions relevant Karma Terra products when appropriate
4. Maintains a supportive and encouraging tone
5. Keeps the response conversational and easy to understand

If the question is about skincare, hair care, or wellness, provide specific recommendations and tips.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-800">Karma Terra</h1>
              <span className="text-gray-400">⌄</span>
            </div>
          </div>
          <button
            onClick={startNewChat}
            aria-label="Start new chat"
            title="Start new chat"
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.isUser
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.text}
              </div>
              <div
                className={`text-xs mt-2 ${
                  message.isUser ? 'text-green-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Karma Terra is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={1}
              style={{
                minHeight: '48px',
                maxHeight: '120px'
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            aria-label="Send message"
            title="Send message"
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-3 rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskKarmaPage;
