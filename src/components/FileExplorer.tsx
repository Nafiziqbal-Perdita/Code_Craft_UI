import { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-700/50 group ${
          item.type === 'file' ? 'hover:bg-blue-600/10' : ''
        }`}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        
        <div className={`flex items-center gap-2 flex-1 min-w-0 ${
          item.type === 'file' ? 'group-hover:text-blue-400' : ''
        }`}>
          {item.type === 'folder' ? (
            <FolderTree className="w-4 h-4 text-blue-400 flex-shrink-0" />
          ) : (
            <File className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
          )}
          <span className="text-gray-200 group-hover:text-white transition-colors text-sm truncate">
            {item.name}
          </span>
        </div>
        
        {item.type === 'file' && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        )}
      </div>
      
      {item.type === 'folder' && isExpanded && item.children && (
        <div className="ml-2 border-l border-gray-700/50">
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-blue-400" />
          Project Files
        </h2>
        <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
          {files.length} items
        </div>
      </div>
      
      <div className="space-y-1 overflow-auto max-h-full">
        {files.length > 0 ? (
          files.map((file, index) => (
            <FileNode
              key={`${file.path}-${index}`}
              item={file}
              depth={0}
              onFileClick={onFileSelect}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderTree className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">No files generated yet</p>
            <p className="text-gray-500 text-xs mt-1">Files will appear here as they're created</p>
          </div>
        )}
      </div>
    </div>
  );
}