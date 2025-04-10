import React, { useState } from 'react';
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
        onResize={setBottomPanelHeight}
      />
    </div>
  );
}

export default App;