import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50 p-4">
      <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1">
        <button
          onClick={() => onTabChange('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'code'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Source Code
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'preview'
              ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          <Eye className="w-4 h-4" />
          Live Preview
        </button>
      </div>
    </div>
  );
}