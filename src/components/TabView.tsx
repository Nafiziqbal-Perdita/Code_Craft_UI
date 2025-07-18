import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="bg-white/60 backdrop-blur-md border-b border-neutrals-mediumGray/40 p-4 shadow-floating rounded-b-xl">
      <div className="flex space-x-2 bg-gradient-to-r from-primary-blue/10 to-secondary-aqua/10 rounded-full p-2 shadow-clay">
        <button
          onClick={() => onTabChange('code')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-slow text-lg font-secondary shadow-floating focus:outline-none focus:ring-2 focus:ring-primary-blue/40 ${
            activeTab === 'code'
              ? 'bg-gradient-to-r from-primary-blue to-accent-pink text-white shadow-clay scale-105'
              : 'text-neutrals-charcoal hover:bg-primary-blue/10 hover:text-primary-blue'
          }`}
        >
          <Code2 className="w-5 h-5" />
          Source Code
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-slow text-lg font-secondary shadow-floating focus:outline-none focus:ring-2 focus:ring-secondary-aqua/40 ${
            activeTab === 'preview'
              ? 'bg-gradient-to-r from-secondary-aqua to-accent-yellow text-white shadow-clay scale-105'
              : 'text-neutrals-charcoal hover:bg-secondary-aqua/10 hover:text-secondary-aqua'
          }`}
        >
          <Eye className="w-5 h-5" />
          Live Preview
        </button>
      </div>
    </div>
  );
}