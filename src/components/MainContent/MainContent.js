import React from 'react';
import './MainContent.css';

// Mock file content for demonstration
const mockFileContents = {
  'App.js': `import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import BottomPanel from './components/BottomPanel/BottomPanel';

function App() {
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);
  const [isBottomPanelVisible, setIsBottomPanelVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const toggleBottomPanel = () => {
    setIsBottomPanelVisible(!isBottomPanelVisible);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="app-container">
      <div className="main-area">
        <Sidebar onFileSelect={handleFileSelect} />
        <MainContent selectedFile={selectedFile} />
      </div>
      <BottomPanel 
        height={bottomPanelHeight}
        isVisible={isBottomPanelVisible}
        onToggle={toggleBottomPanel}
      />
    </div>
  );
}

export default App;`,
  'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  'package.json': `{
  "name": "vscode-like-webapp",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.4.0",
    "@fortawesome/free-solid-svg-icons": "^6.4.0",
    "@fortawesome/react-fontawesome": "^0.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`
};

const MainContent = ({ selectedFile }) => {
  // Get file content based on selected file
  const getFileContent = () => {
    if (!selectedFile) return '';
    
    // Get content from mock data or return placeholder
    return mockFileContents[selectedFile.name] || 
      `// Content for ${selectedFile.name} would be displayed here`;
  };

  // Get language for syntax highlighting (simplified version)
  const getLanguageClass = () => {
    if (!selectedFile) return '';
    
    const extension = selectedFile.name.split('.').pop();
    switch (extension) {
      case 'js':
        return 'language-javascript';
      case 'css':
        return 'language-css';
      case 'html':
        return 'language-html';
      case 'json':
        return 'language-json';
      case 'md':
        return 'language-markdown';
      default:
        return '';
    }
  };

  return (
    <div className="main-content">
      {selectedFile ? (
        <div className="editor">
          <div className="editor-header">
            <span className="file-name">{selectedFile.name}</span>
          </div>
          <div className="editor-content">
            <pre className={getLanguageClass()}>
              <code>{getFileContent()}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="welcome-screen">
          <h2>Welcome to VSCode-like Webapp</h2>
          <p>Select a file from the sidebar to start editing</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;