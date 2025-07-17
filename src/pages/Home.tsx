import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  const examples = [
    "Create a modern portfolio website with dark theme",
    "Build a todo app with React and local storage",
    "Make a landing page for a SaaS product",
    "Create a blog with markdown support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-6">
            Website Builder AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into stunning websites with the power of AI
          </p>
          
          <p className="text-gray-400 mb-8">
            Describe your vision, and watch as our AI creates a complete website with modern design and functionality
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream website in detail..."
                className="w-full h-40 p-6 bg-gray-900/50 text-gray-100 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 text-lg leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                {prompt.length}/1000
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
              >
                ✨ Generate Website
              </button>
              
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="sm:w-auto bg-gray-700 hover:bg-gray-600 text-gray-300 py-4 px-6 rounded-xl font-medium transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
        
        {/* Example prompts */}
        <div className="mt-8">
          <p className="text-center text-gray-400 mb-4">Try these example prompts:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left p-4 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/30 rounded-lg transition-all duration-200 text-gray-300 hover:text-white text-sm group"
              >
                <span className="text-blue-400 group-hover:text-blue-300 mr-2">💡</span>
                {example}
              </button>
            ))}
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Generate complete websites in seconds with our advanced AI</p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Modern Design</h3>
            <p className="text-gray-400 text-sm">Beautiful, responsive designs that look great on all devices</p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Live Preview</h3>
            <p className="text-gray-400 text-sm">See your changes instantly with our real-time preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}