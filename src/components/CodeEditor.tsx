import Editor from '@monaco-editor/react';
import { FileItem } from '../types';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900/20 rounded-lg m-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-gray-400 text-lg font-medium mb-2">No File Selected</p>
          <p className="text-gray-500 text-sm">Choose a file from the explorer to view its contents</p>
        </div>
      </div>
    );
  }

  const getLanguageFromExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return 'typescript';
      case 'ts':
        return 'typescript';
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'typescript';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/20 rounded-lg m-4 overflow-hidden">
      {/* File header */}
      <div className="bg-gray-800/50 border-b border-gray-700/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-300 font-medium">{file.name}</span>
          <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
            {getLanguageFromExtension(file.name).toUpperCase()}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {file.content?.split('\n').length || 0} lines
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageFromExtension(file.name)}
          theme="vs-dark"
          value={file.content || '// Empty file'}
          options={{
            readOnly: true,
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            folding: true,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}