import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-accent flex items-center justify-center p-4 font-secondary">
      {/* Claymorphism floating blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-blue rounded-full shadow-clay opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-pink rounded-full shadow-floating opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/public/logo.jpg" alt="Code Craft Logo" className="w-24 h-24 rounded-full shadow-clay bg-white/80 p-2" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-blue via-accent-pink to-secondary-aqua mb-6 drop-shadow-lg">
            CODE CRAFT
          </h1>
          <p className="text-lg md:text-xl text-neutrals-charcoal/80 font-secondary mb-4">
            Transform your ideas into beautiful websites using the power of AI. No coding required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 rounded-2xl shadow-clay p-8 max-w-xl mx-auto mb-8">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your website..."
            className="w-full p-4 rounded-xl border border-neutrals-mediumGray focus:ring-2 focus:ring-primary-blue text-lg font-secondary shadow-floating transition duration-slow"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-blue to-secondary-aqua text-white font-bold text-lg shadow-clay hover:scale-105 transition-transform duration-slow"
          >
            Generate Website
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-neutrals-charcoal mb-4">Try an example:</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {examples.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(ex)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-pink to-accent-yellow text-white font-medium shadow-floating hover:scale-105 transition-transform duration-slow"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add beautiful claymorphic cards for features or info here if needed */}
        </div>
      </div>
    </div>
  );
}