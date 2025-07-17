import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      console.log('Builder: Files updated:', originalFiles);
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log('Builder: Current files:', files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">WB</span>
                </div>
                <h1 className="text-xl font-bold text-gray-100">Website Builder AI</h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Development Environment</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full">
                <span className="text-gray-400">Prompt:</span> {prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          {/* Left Sidebar - Steps and Chat */}
          <div className="col-span-1 space-y-6 overflow-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
              <div className="max-h-[65vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              
              {/* Enhanced Chat Interface */}
              <div className="border-t border-gray-700/50 p-4">
                <div className="flex flex-col space-y-3">
                  {(loading || !templateSet) ? (
                    <div className="text-center py-4">
                      <Loader />
                      <p className="text-sm text-gray-400 mt-2">Processing your request...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <textarea 
                          value={userPrompt} 
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Ask for modifications or new features..."
                          className="w-full p-3 bg-gray-900/50 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 min-h-[80px]"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                          {userPrompt.length}/500
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as "user",
                            content: userPrompt
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                            messages: [...llmMessages, newMessage]
                          });
                          setLoading(false);

                          setLlmMessages(x => [...x, newMessage]);
                          setLlmMessages(x => [...x, {
                            role: "assistant",
                            content: stepsResponse.data.response
                          }]);
                          
                          setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                            ...x,
                            status: "pending" as "pending"
                          }))]);
                          
                          setPrompt(""); // Clear input after sending
                        }}
                        disabled={!userPrompt.trim() || loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                      >
                        {loading ? '🤖 Thinking...' : '✨ Send Request'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* File Explorer */}
          <div className="col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl h-full">
              <FileExplorer 
                files={files} 
                onFileSelect={setSelectedFile}
              />
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="col-span-2">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl h-[calc(100vh-8rem)] overflow-hidden">
              <TabView activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="h-[calc(100%-4rem)]">
                {activeTab === 'code' ? (
                  <CodeEditor file={selectedFile} />
                ) : webcontainer ? (
                  <PreviewFrame webContainer={webcontainer} files={files} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 bg-gray-900/20 rounded-lg m-4">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
                      <p>Initializing WebContainer...</p>
                      <p className="text-sm text-gray-500 mt-1">Setting up development environment</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}