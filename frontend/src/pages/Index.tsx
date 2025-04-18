
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Moon, Sun, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Simple animation on mount
    setIsVisible(true);
    
    // Apply the theme from state
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => {
      const themes = ['light', 'dark', 'cupcake', 'cyberpunk', 'synthwave', 'retro', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter'];
      const currentIndex = themes.indexOf(prev);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    });
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div 
        className="absolute top-4 right-4 cursor-pointer bg-base-100 p-2 rounded-full shadow-md"
        onClick={toggleTheme}
        title="Change theme"
      >
        {currentTheme === 'dark' ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </div>
      
      <div className="text-sm absolute top-4 left-4 px-3 py-1 bg-base-100 rounded-full shadow">
        Theme: <span className="font-semibold">{currentTheme}</span>
      </div>
      
      <div className="hero-content text-center">
        <div className={`max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary rounded-full shadow-lg animate-float">
              <Bot size={64} className="text-primary-content" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ChatSphere
          </h1>
          
          <p className="text-lg mb-8 opacity-80">
            Your intelligent AI assistant ready for meaningful conversations
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2">
                Login
              </Button>
            </Link>
          </div>
          
          <div className={`mt-16 flex justify-center gap-6 transition-all delay-500 duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge variant="secondary" className="py-2 px-4 text-sm">Fast</Badge>
            <Badge variant="secondary" className="py-2 px-4 text-sm">Intelligent</Badge>
            <Badge variant="secondary" className="py-2 px-4 text-sm">Helpful</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
