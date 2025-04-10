import React, { useState, useRef, useEffect } from 'react';
import './BottomPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTerminal, faList, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';

const BottomPanel = ({ height, isVisible, onToggle, onResize }) => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [panelHeight, setPanelHeight] = useState(height);
  const resizeRef = useRef(null);
  
  // Mock data for tabs
  const mockTerminalOutput = [
    '> npm start',
    'Starting the development server...',
    'Compiled successfully!',
    '',
    'You can now view vscode-like-webapp in the browser.',
    '',
    '  Local:            http://localhost:3000',
    '  On Your Network:  http://192.168.1.5:3000',
    '',
    'Note that the development build is not optimized.',
    'To create a production build, use npm run build.'
  ];
  
  const mockProblemsOutput = [
    { type: 'warning', file: 'src/App.js', line: 12, message: 'Variable is defined but never used' },
    { type: 'error', file: 'src/components/Sidebar/Sidebar.js', line: 45, message: 'Unexpected token' }
  ];
  
  const mockOutputContent = [
    '[Info] Extension host started',
    '[Info] Language server initialized',
    '[Warning] Some features may not be available without latest updates'
  ];
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && resizeRef.current) {
        const deltaY = startY - e.clientY;
        const newHeight = Math.max(100, Math.min(window.innerHeight * 0.8, panelHeight + deltaY));
        setPanelHeight(newHeight);
        if (onResize) onResize(newHeight);
        setStartY(e.clientY);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, panelHeight, onResize]);
  
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="bottom-panel" style={{ height: `${panelHeight}px` }}>
      <div 
        className="resize-handle" 
        ref={resizeRef}
        onMouseDown={handleMouseDown}
      ></div>
      
      <div className="panel-header">
        <div className="panel-tabs">
          <div 
            className={`panel-tab ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
          >
            <FontAwesomeIcon icon={faTerminal} />
            <span>TERMINAL</span>
          </div>
          <div 
            className={`panel-tab ${activeTab === 'problems' ? 'active' : ''}`}
            onClick={() => setActiveTab('problems')}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>PROBLEMS</span>
          </div>
          <div 
            className={`panel-tab ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            <FontAwesomeIcon icon={faList} />
            <span>OUTPUT</span>
          </div>
        </div>
        
        <div className="panel-actions">
          <button className="panel-action-button" onClick={onToggle}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      
      <div className="panel-content">
        {activeTab === 'terminal' && (
          <div className="terminal-content">
            {mockTerminalOutput.map((line, index) => (
              <div key={index} className="terminal-line">{line}</div>
            ))}
          </div>
        )}
        
        {activeTab === 'problems' && (
          <div className="problems-content">
            {mockProblemsOutput.length > 0 ? (
              <table className="problems-table">
                <tbody>
                  {mockProblemsOutput.map((problem, index) => (
                    <tr key={index} className={`problem-item ${problem.type}`}>
                      <td className="problem-type">
                        <FontAwesomeIcon 
                          icon={problem.type === 'error' ? faExclamationTriangle : faSearch} 
                          className={problem.type}
                        />
                      </td>
                      <td className="problem-message">{problem.message}</td>
                      <td className="problem-location">{problem.file}:{problem.line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-problems">No problems have been detected in the workspace.</div>
            )}
          </div>
        )}
        
        {activeTab === 'output' && (
          <div className="output-content">
            {mockOutputContent.map((line, index) => (
              <div key={index} className="output-line">
                {line.includes('[Warning]') ? (
                  <span className="output-warning">{line}</span>
                ) : line.includes('[Error]') ? (
                  <span className="output-error">{line}</span>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomPanel;