import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faFile, faChevronRight, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';

// Mock data for the file tree
const mockFileTree = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: '3',
            name: 'Sidebar',
            type: 'folder',
            isOpen: true,
            children: [
              { id: '4', name: 'Sidebar.js', type: 'file', language: 'javascript' },
              { id: '5', name: 'Sidebar.css', type: 'file', language: 'css' }
            ]
          },
          {
            id: '6',
            name: 'MainContent',
            type: 'folder',
            isOpen: true,
            children: [
              { id: '7', name: 'MainContent.js', type: 'file', language: 'javascript' },
              { id: '8', name: 'MainContent.css', type: 'file', language: 'css' }
            ]
          },
          {
            id: '9',
            name: 'BottomPanel',
            type: 'folder',
            isOpen: true,
            children: [
              { id: '10', name: 'BottomPanel.js', type: 'file', language: 'javascript' },
              { id: '11', name: 'BottomPanel.css', type: 'file', language: 'css' }
            ]
          }
        ]
      },
      { id: '12', name: 'App.js', type: 'file', language: 'javascript' },
      { id: '13', name: 'App.css', type: 'file', language: 'css' },
      { id: '14', name: 'index.js', type: 'file', language: 'javascript' },
      { id: '15', name: 'index.css', type: 'file', language: 'css' }
    ]
  },
  {
    id: '16',
    name: 'public',
    type: 'folder',
    isOpen: false,
    children: [
      { id: '17', name: 'index.html', type: 'file', language: 'html' },
      { id: '18', name: 'favicon.ico', type: 'file', language: 'image' }
    ]
  },
  { id: '19', name: 'package.json', type: 'file', language: 'json' },
  { id: '20', name: 'README.md', type: 'file', language: 'markdown' }
];

const TreeNode = ({ node, level, onToggle, onFileSelect, onContextMenu }) => {
  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const handleFileSelect = (e) => {
    e.stopPropagation();
    if (node.type === 'file') {
      onFileSelect(node);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu(e, node);
  };

  return (
    <div className="tree-node" style={{ paddingLeft: `${level * 16}px` }}>
      <div 
        className={`tree-node-content ${node.type === 'file' ? 'file-node' : 'folder-node'}`}
        onClick={handleToggle}
        onContextMenu={handleContextMenu}
      >
        {node.type === 'folder' && (
          <span className="folder-icon">
            <FontAwesomeIcon icon={node.isOpen ? faChevronDown : faChevronRight} size="xs" />
          </span>
        )}
        <span className="node-icon">
          {node.type === 'folder' 
            ? <FontAwesomeIcon icon={node.isOpen ? faFolderOpen : faFolder} /> 
            : <FontAwesomeIcon icon={faFile} />}
        </span>
        <span className="node-name" onClick={handleFileSelect}>{node.name}</span>
      </div>
      
      {node.type === 'folder' && node.isOpen && node.children && (
        <div className="tree-node-children">
          {node.children.map(childNode => (
            <TreeNode 
              key={childNode.id} 
              node={childNode} 
              level={level + 1} 
              onToggle={onToggle}
              onFileSelect={onFileSelect}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ContextMenu = ({ x, y, isVisible, options, onOptionClick, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="context-menu" 
      style={{ top: y, left: x }}
      ref={menuRef}
    >
      {options.map((option, index) => (
        <div 
          key={index} 
          className="context-menu-item"
          onClick={() => onOptionClick(option)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ onFileSelect }) => {
  const [fileTree, setFileTree] = useState(mockFileTree);
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    node: null,
    options: []
  });
  
  // State for modals
  const [modal, setModal] = useState({
    isOpen: false,
    type: null, // 'new-file', 'new-folder', 'rename', 'delete'
    title: '',
    node: null
  });
  
  // State for input in modals
  const [inputValue, setInputValue] = useState('');

  const toggleNode = (nodeId) => {
    const updateNode = (nodes) => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };

    setFileTree(updateNode(fileTree));
  };

  const handleFileSelect = (file) => {
    onFileSelect(file);
  };

  const handleContextMenu = (e, node) => {
    e.preventDefault();
    
    const options = node.type === 'folder' 
      ? [
          { label: 'New File', action: 'new-file' },
          { label: 'New Folder', action: 'new-folder' },
          { label: 'Rename', action: 'rename' },
          { label: 'Delete', action: 'delete' }
        ]
      : [
          { label: 'Open', action: 'open' },
          { label: 'Rename', action: 'rename' },
          { label: 'Delete', action: 'delete' }
        ];

    setContextMenu({
      isVisible: true,
      x: e.clientX,
      y: e.clientY,
      node,
      options
    });
  };

  const handleContextMenuOptionClick = (option) => {
    const node = contextMenu.node;
    
    // Close the context menu first
    closeContextMenu();
    
    // Handle different actions
    switch(option.action) {
      case 'open':
        if (node.type === 'file') {
          handleFileSelect(node);
        }
        break;
        
      case 'new-file':
        setModal({
          isOpen: true,
          type: 'new-file',
          title: 'New File',
          node: node
        });
        setInputValue('');
        break;
        
      case 'new-folder':
        setModal({
          isOpen: true,
          type: 'new-folder',
          title: 'New Folder',
          node: node
        });
        setInputValue('');
        break;
        
      case 'rename':
        setModal({
          isOpen: true,
          type: 'rename',
          title: `Rename ${node.type === 'folder' ? 'Folder' : 'File'}`,
          node: node
        });
        setInputValue(node.name);
        break;
        
      case 'delete':
        setModal({
          isOpen: true,
          type: 'delete',
          title: `Delete ${node.type === 'folder' ? 'Folder' : 'File'}`,
          node: node
        });
        break;
        
      default:
        console.log(`Action ${option.action} not implemented yet`);
    }
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  };
  
  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
    setInputValue('');
  };
  
  // Function to generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  // Function to handle modal actions
  const handleModalAction = () => {
    const { type, node } = modal;
    
    // Create a deep copy of the file tree
    const updateFileTree = (nodes, nodeId, action) => {
      return nodes.map(n => {
        if (n.id === nodeId) {
          return action(n);
        }
        if (n.children) {
          return { ...n, children: updateFileTree(n.children, nodeId, action) };
        }
        return n;
      });
    };
    
    // Remove a node from the tree
    const removeNode = (nodes, nodeId) => {
      return nodes.filter(n => n.id !== nodeId).map(n => {
        if (n.children) {
          return { ...n, children: removeNode(n.children, nodeId) };
        }
        return n;
      });
    };
    
    // Add a new node to a parent
    const addNode = (nodes, parentId, newNode) => {
      return nodes.map(n => {
        if (n.id === parentId) {
          return { 
            ...n, 
            children: [...(n.children || []), newNode],
            isOpen: true // Open the folder when adding a new item
          };
        }
        if (n.children) {
          return { ...n, children: addNode(n.children, parentId, newNode) };
        }
        return n;
      });
    };
    
    switch(type) {
      case 'new-file':
        if (inputValue.trim()) {
          const newFile = {
            id: generateId(),
            name: inputValue.trim(),
            type: 'file',
            language: inputValue.includes('.') ? inputValue.split('.').pop() : 'text'
          };
          
          setFileTree(addNode(fileTree, node.id, newFile));
        }
        break;
        
      case 'new-folder':
        if (inputValue.trim()) {
          const newFolder = {
            id: generateId(),
            name: inputValue.trim(),
            type: 'folder',
            isOpen: false,
            children: []
          };
          
          setFileTree(addNode(fileTree, node.id, newFolder));
        }
        break;
        
      case 'rename':
        if (inputValue.trim() && inputValue !== node.name) {
          setFileTree(updateFileTree(fileTree, node.id, n => ({
            ...n,
            name: inputValue.trim(),
            language: n.type === 'file' && inputValue.includes('.') ? 
              inputValue.split('.').pop() : n.language
          })));
        }
        break;
        
      case 'delete':
        setFileTree(removeNode(fileTree, node.id));
        break;
        
      default:
        console.log(`Modal action ${type} not implemented`);
    }
    
    closeModal();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>EXPLORER</h3>
      </div>
      <div className="file-tree">
        {fileTree.map(node => (
          <TreeNode 
            key={node.id} 
            node={node} 
            level={0} 
            onToggle={toggleNode}
            onFileSelect={handleFileSelect}
            onContextMenu={handleContextMenu}
          />
        ))}
      </div>
      <ContextMenu 
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.isVisible}
        options={contextMenu.options}
        onOptionClick={handleContextMenuOptionClick}
        onClose={closeContextMenu}
      />
      
      {/* Modal for file/folder operations */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
      >
        {modal.type === 'delete' ? (
          <div className="modal-delete-content">
            <p>Are you sure you want to delete {modal.node?.name}?</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="modal-btn modal-btn-confirm" onClick={handleModalAction}>Delete</button>
            </div>
          </div>
        ) : modal.type === 'rename' || modal.type === 'new-file' || modal.type === 'new-folder' ? (
          <div className="modal-input-content">
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={modal.type.includes('new') ? `Enter ${modal.type.includes('file') ? 'file' : 'folder'} name` : 'Enter new name'}
              autoFocus
            />
            <div className="modal-actions">
              <button className="modal-btn modal-btn-cancel" onClick={closeModal}>Cancel</button>
              <button 
                className="modal-btn modal-btn-confirm" 
                onClick={handleModalAction}
                disabled={!inputValue.trim()}
              >
                {modal.type.includes('new') ? 'Create' : 'Rename'}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Sidebar;