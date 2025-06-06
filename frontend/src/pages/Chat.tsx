
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, LogOut } from 'lucide-react';
import axios from "axios";
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
// pretty syntax highlighting (like ChatGPT)
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Message = {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
};


// Custom components for rendering Markdown
// This is where we can customize how different elements are rendered in the chat
const markdownComponents = {
  code: (props: any) => {
    const { inline, className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');

    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        {...rest}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="bg-base-300 px-1 py-0.5 rounded" {...rest}>
        {children}
      </code>
    );
  }
};




const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    // if (!isAuthenticated) {
    //   navigate('/login');
    //   return;
    // }

    // Add welcome message
    setMessages([
      {
        id: 1,
        content: "Hello! My name is Neko, your MERN mentor🐱. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, [navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const userId = localStorage.getItem('userId') || "user123";
    const userName = localStorage.getItem('userName') || 'friend';

    try {
      const response = await axios.post('http://localhost:3000/genaiMemory/generateWithMemory',
        {
          prompt: input,
          userId: userId,
          userName: "Dhruv"
        },
        { withCredentials: true }
      );

      const aiText = response.data?.text || response.data?.response || "No response from Neko 🐱";

      const botMessage: Message = {
        id: Date.now() + 1,
        content: aiText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }
    catch (error) {
      console.error("AI error:", error);
      const errorMessage: Message = {
        id: Date.now() + 2,
        content: "Neko ran into an issue trying to help you. 🐾 Try again in a bit!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-base-200">
      {/* Header */}
      <header className="bg-base-100 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">ChatSphere</h1>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-ghost"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 container mx-auto max-w-4xl p-4 overflow-hidden flex flex-col">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto mb-4 p-6 rounded-lg bg-base-100 shadow-inner space-y-4">
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`chat ${message.isUser ? 'chat-end' : 'chat-start'}`}
            >
              {/* <div className="chat-image avatar">
                <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                  {message.isUser ? (
                    <User size={20} />
                  ) : (
                    <div className="text-xs font-semibold text-primary">AI</div>
                  )}
                </div>
              </div> */}
              <div className="chat-image avatar">
                {message.isUser ? (
                  <div className="w-10 rounded-full">
                    <img src="/user-photo.jpg" alt="User" />
                  </div>
                ) : (
                  <div className="w-10 rounded-full">
                    <img src="/robot-avatar.png" alt="AI" />
                  </div>
                )}
              </div>

              <div
                className={`chat-bubble break-words max-w-[80%] prose prose-sm dark:prose-invert ${message.isUser ? 'chat-bubble-primary' : 'bg-base-200 text-base-content'
                  }`}
              >
                <ReactMarkdown components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
              </div>
              <div className="chat-footer opacity-50 text-xs">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                  <div className="text-xs font-semibold text-primary">AI</div>
                </div>
              </div>
              <div className="chat-bubble flex items-center gap-2">
                <span className="loading loading-dots loading-sm" />
                <span className="text-xs text-base-content">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="input input-bordered flex-1 text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
