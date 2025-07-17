import { WebContainer } from '@webcontainer/api';
import { useEffect, useState, useRef } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const processRef = useRef<{ install?: any; dev?: any }>({});
  const mountedFilesRef = useRef<string>("");

  // Function to add terminal log
  const addTerminalLog = (message: string) => {
    setTerminalLogs(prev => [...prev, `$ ${message}`]);
  };

  // Function to check and fix package.json issues
  const validatePackageJson = (files: any[]) => {
    const packageJsonFile = files.find(file => 
      file.name === 'package.json' || 
      (file.children && file.children.find((child: any) => child.name === 'package.json'))
    );

    if (!packageJsonFile) return null;

    try {
      const content = packageJsonFile.content || 
        (packageJsonFile.children && packageJsonFile.children.find((child: any) => child.name === 'package.json')?.content);
      
      if (!content) return null;

      const packageJson = JSON.parse(content);
      
      // Check for common issues
      const issues = [];
      
      // Check for conflicting React versions
      if (packageJson.dependencies?.react && packageJson.dependencies?.['@types/react']) {
        const reactVersion = packageJson.dependencies.react;
        const typesVersion = packageJson.dependencies['@types/react'];
        if (reactVersion.includes('^18') && !typesVersion.includes('^18')) {
          issues.push('React and @types/react version mismatch');
        }
      }

      // Check for very new versions that might not be stable
      if (packageJson.dependencies) {
        Object.entries(packageJson.dependencies).forEach(([pkg, version]) => {
          if (typeof version === 'string' && (version.includes('beta') || version.includes('alpha'))) {
            issues.push(`Package ${pkg} uses pre-release version: ${version}`);
          }
        });
      }

      return { packageJson, issues };
    } catch (error) {
      return { error: 'Invalid package.json format' };
    }
  };

  async function main() {
    try {
      setIsLoading(true);
      setError(null);
      setUrl("");
      setTerminalLogs([]);

      addTerminalLog('Initializing preview environment...');
      console.log('PreviewFrame: Starting preview setup');
      console.log('PreviewFrame: Files count:', files.length);
      console.log('PreviewFrame: WebContainer available:', !!webContainer);

      if (files.length === 0) {
        addTerminalLog('Error: No files available to preview');
        setError('No files available to preview');
        setIsLoading(false);
        return;
      }

      // Simple test: create a basic HTML file if no files exist
      const hasHtmlOrPackageJson = files.some(file => 
        file.name === 'package.json' || 
        file.name.endsWith('.html') ||
        (file.children && file.children.some((child: any) => 
          child.name === 'package.json' || child.name.endsWith('.html')
        ))
      );

      if (!hasHtmlOrPackageJson) {
        // Create a simple HTML preview
        addTerminalLog('Creating static file preview...');
        const simpleHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Preview</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .file { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
        .filename { font-weight: bold; color: #333; }
        .content { background: #f5f5f5; padding: 10px; margin-top: 5px; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>File Preview</h1>
    ${files.map(file => `
        <div class="file">
            <div class="filename">${file.name}</div>
            <div class="content">${file.content || 'No content'}</div>
        </div>
    `).join('')}
</body>
</html>`;
        
        const blob = new Blob([simpleHtml], { type: 'text/html' });
        const htmlUrl = URL.createObjectURL(blob);
        addTerminalLog('Static preview ready!');
        setUrl(htmlUrl);
        setIsLoading(false);
        return;
      }

      // Create a hash of current files to detect changes
      const filesHash = JSON.stringify(files);
      if (mountedFilesRef.current === filesHash && url) {
        console.log('PreviewFrame: No file changes detected, keeping current preview');
        setIsLoading(false);
        return; // No changes, don't restart
      }
      mountedFilesRef.current = filesHash;

      // Kill any existing processes
      if (processRef.current.dev) {
        try {
          processRef.current.dev.kill();
        } catch (e) {
          // Process might already be dead
        }
      }

      // Check if package.json exists
      const hasPackageJson = files.some(file => 
        file.name === 'package.json' || 
        (file.children && file.children.some((child: any) => child.name === 'package.json'))
      );

      console.log('PreviewFrame: Has package.json:', hasPackageJson);

      if (!hasPackageJson) {
        addTerminalLog('Error: No package.json found in project files');
        setError('No package.json found in project files');
        setIsLoading(false);
        return;
      }

      addTerminalLog('Validating package.json...');
      // Validate package.json for common issues
      const validation = validatePackageJson(files);
      if (validation?.error) {
        addTerminalLog(`Error: Package.json validation failed - ${validation.error}`);
        setError(`Package.json error: ${validation.error}`);
        setIsLoading(false);
        return;
      }
      
      if (validation?.issues && validation.issues.length > 0) {
        addTerminalLog(`Warning: Package.json issues detected - ${validation.issues.join(', ')}`);
        console.warn('PreviewFrame: Package.json issues detected:', validation.issues);
        // Continue but log the issues
      } else {
        addTerminalLog('Package.json validation passed ✓');
      }
      
      // Install dependencies with better error handling
      addTerminalLog('Running npm install...');
      console.log('PreviewFrame: Starting npm install');
      try {
        const installProcess = await webContainer.spawn('npm', ['install'], {
          output: false
        });
        processRef.current.install = installProcess;
        
        // Wait for install to complete
        const installExitCode = await installProcess.exit;
        console.log('PreviewFrame: npm install exit code:', installExitCode);
        
        if (installExitCode !== 0) {
          addTerminalLog('npm install failed, trying with --legacy-peer-deps...');
          console.log('PreviewFrame: npm install failed, trying with --legacy-peer-deps');
          // Try with legacy peer deps flag
          const installProcessLegacy = await webContainer.spawn('npm', ['install', '--legacy-peer-deps'], {
            output: false
          });
          const legacyExitCode = await installProcessLegacy.exit;
          
          if (legacyExitCode !== 0) {
            addTerminalLog('Fallback: Trying yarn install...');
            console.log('PreviewFrame: npm install with --legacy-peer-deps also failed, trying yarn');
            // Try with yarn as fallback
            try {
              await webContainer.spawn('npm', ['install', '-g', 'yarn'], { output: false });
              const yarnProcess = await webContainer.spawn('yarn', ['install'], { output: false });
              const yarnExitCode = await yarnProcess.exit;
              
              if (yarnExitCode !== 0) {
                addTerminalLog('Error: All installation methods failed');
                setError('Failed to install dependencies with npm and yarn. Check package.json for version conflicts.');
                setIsLoading(false);
                return;
              } else {
                addTerminalLog('Dependencies installed successfully with yarn ✓');
              }
            } catch (yarnError) {
              addTerminalLog('Error: yarn installation failed');
              setError('Failed to install dependencies. Package versions may be incompatible.');
              setIsLoading(false);
              return;
            }
          } else {
            addTerminalLog('Dependencies installed with --legacy-peer-deps ✓');
          }
        } else {
          addTerminalLog('Dependencies installed successfully ✓');
        }
      } catch (installError) {
        addTerminalLog(`Error: Installation failed - ${installError instanceof Error ? installError.message : 'Unknown error'}`);
        console.error('PreviewFrame: Install error:', installError);
        setError(`Installation failed: ${installError instanceof Error ? installError.message : 'Unknown error'}`);
        setIsLoading(false);
        return;
      }

      // Start the dev server with better error handling
      addTerminalLog('Starting development server...');
      console.log('PreviewFrame: Starting dev server');
      try {
        const devProcess = await webContainer.spawn('npm', ['run', 'dev'], {
          output: false
        });
        processRef.current.dev = devProcess;
        
        addTerminalLog('Waiting for server to be ready...');
        
        // Set up a timeout for server startup
        const serverTimeout = setTimeout(() => {
          addTerminalLog('Error: Server startup timeout');
          setError('Server took too long to start');
          setIsLoading(false);
        }, 30000); // 30 second timeout

        // Listen for server-ready event
        const handleServerReady = (port: number, serverUrl: string) => {
          clearTimeout(serverTimeout);
          addTerminalLog(`Development server ready on port ${port} ✓`);
          addTerminalLog('Preview is now available!');
          console.log('Preview server ready on port:', port);
          setUrl(serverUrl);
          setIsLoading(false);
        };

        // Listen for server-ready event (Note: WebContainer doesn't have 'off' method)
        webContainer.on('server-ready', handleServerReady);
        
      } catch (devError) {
        addTerminalLog(`Error: Failed to start dev server - ${devError instanceof Error ? devError.message : 'Unknown error'}`);
        console.error('PreviewFrame: Dev server error:', devError);
        setError(`Failed to start dev server: ${devError instanceof Error ? devError.message : 'Unknown error'}`);
        setIsLoading(false);
      }

    } catch (error) {
      console.error('Error starting preview:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log('PreviewFrame: useEffect triggered');
    console.log('PreviewFrame: webContainer:', !!webContainer);
    console.log('PreviewFrame: files.length:', files.length);
    
    if (webContainer && files.length > 0) {
      console.log('PreviewFrame: Calling main()');
      main();
    } else if (files.length > 0) {
      console.log('PreviewFrame: Files available but no webContainer, creating simple preview');
      main(); // Still call main for simple HTML preview
    } else {
      console.log('PreviewFrame: Conditions not met for main()');
      if (!webContainer) console.log('PreviewFrame: Missing webContainer');
      if (files.length === 0) console.log('PreviewFrame: No files');
    }

    // Cleanup function
    return () => {
      if (processRef.current.dev) {
        try {
          processRef.current.dev.kill();
        } catch (e) {
          // Process might already be dead
        }
      }
      // Cleanup blob URLs
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [webContainer, files])

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {error && (
        <div className="flex-1 flex flex-col">
          {/* Terminal-style error display */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-4 text-gray-300 text-sm font-mono">Terminal</span>
          </div>
          <div className="flex-1 bg-black p-4 font-mono text-sm overflow-y-auto">
            {terminalLogs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1">
                {log}
              </div>
            ))}
            <div className="text-red-400 mb-2">
              Error: {error}
            </div>
            <div className="text-white">
              <span className="text-green-400">user@webbuilder</span>
              <span className="text-blue-400">:~</span>
              <span className="text-white">$ </span>
              <span className="animate-pulse">█</span>
            </div>
          </div>
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex space-x-2">
              <button 
                onClick={main}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Retry
              </button>
              {error.includes('dependencies') && (
                <button 
                  onClick={async () => {
                    setError(null);
                    setIsLoading(true);
                    setTerminalLogs([]);
                    try {
                      addTerminalLog('Clearing npm cache...');
                      await webContainer.spawn('npm', ['cache', 'clean', '--force'], { output: false });
                      await main();
                    } catch (e) {
                      addTerminalLog('Error: Failed to clear cache');
                      setError('Failed to clear cache and retry');
                      setIsLoading(false);
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  🧹 Clear Cache & Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {!error && (isLoading || !url) && (
        <div className="flex-1 flex flex-col">
          {/* Terminal-style loading display */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-4 text-gray-300 text-sm font-mono">Building Preview</span>
          </div>
          <div className="flex-1 bg-black p-4 font-mono text-sm overflow-y-auto">
            {terminalLogs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1">
                {log}
              </div>
            ))}
            <div className="text-white flex items-center">
              <span className="text-green-400">user@webbuilder</span>
              <span className="text-blue-400">:~</span>
              <span className="text-white">$ </span>
              <div className="ml-2 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                <span>Setting up preview environment...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!error && url && !isLoading && (
        <div className="flex-1 flex flex-col">
          {/* Preview header */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-gray-300 text-sm font-mono">Live Preview</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-400 text-xs">Live</span>
            </div>
          </div>
          <iframe 
            className="flex-1 w-full border-0 bg-white"
            src={url}
            title="Preview"
          />
        </div>
      )}
    </div>
  );
}