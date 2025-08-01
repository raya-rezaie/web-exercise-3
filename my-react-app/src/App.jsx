import React, { useState, useRef, useEffect } from 'react';
import { paintingApi } from './api/paintingApi';

export default function App() {
  // State management
  const [title, setTitle] = useState('My Painting');
  const [shapes, setShapes] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const canvasRef = useRef(null);

  // Count shapes by type
  const shapeCounts = shapes.reduce(
    (acc, shape) => {
      acc[shape.type]++;
      return acc;
    },
    { circle: 0, square: 0, triangle: 0 }
  );

  // Initialize users and canvas
  useEffect(() => {
    const initialize = async () => {
      try {
        const loadedUsers = await paintingApi.getUsers();
        if (loadedUsers.length > 0) {
          setUsers(loadedUsers);
          setSelectedUser(loadedUsers[0]);
        }
      } catch (error) {
        console.error("Couldn't load users:", error);
        // Fallback to default users if API fails
        setUsers([
          { id: 1, username: 'default1', displayName: 'Artist 1' },
          { id: 2, username: 'default2', displayName: 'Artist 2' },
           {id: 2, username: 'default3', displayName: 'Artist 3' }
        ]);
        setSelectedUser({ id: 1, username: 'default1', displayName: 'Artist 1' });
      }
    };
    initialize();
  }, []);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => drawShape(ctx, shape));
  }, [shapes]);

  // Canvas interaction handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData('shape');
    if (!shapeType) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShapes(prev => [...prev, {
      id: Date.now(),
      type: shapeType,
      x,
      y,
    }]);
  };

  const handleDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShapes(shapes.filter(shape => 
      Math.hypot(shape.x - x, shape.y - y) > 30
    ));
  };

  // Server operations
  const handleSaveToServer = async () => {
    if (!selectedUser) {
      alert('Please select a user first');
      return;
    }

    if (shapes.length === 0) {
      alert('Please add some shapes before saving');
      return;
    }

    try {
      await paintingApi.savePainting(selectedUser.id, title, shapes);
      alert(`Successfully saved "${title}" for ${selectedUser.displayName}`);
    } catch (error) {
      alert('Save failed: ' + error.message);
    }
  };

  const handleLoadFromServer = async () => {
    if (!selectedUser) {
      alert('Please select a user first');
      return;
    }
    console.log('Selected painting ID:', selectedUser.id);
    try {
      const paintings = await paintingApi.getPaintings(selectedUser.id);
      
      if (!paintings?.length) {
        alert('No paintings found for this user');
        return;
      }

      const paintingList = paintings.map(p => 
        `${p.id}: ${p.title} (${new Date(p.createdAt).toLocaleDateString()})`
      ).join('\n');

      const selectedId = prompt(`Choose painting to load:\n${paintingList}`);
      if (!selectedId) return;

      const painting = paintings.find(p => p.id == selectedId) || 
        await paintingApi.getPainting(selectedId);

      if (painting) {
        setShapes(JSON.parse(painting.shapesData));
        setTitle(painting.title);
        alert(`Loaded "${painting.title}"`);
      } else {
        alert('Painting not found');
      }
    } catch (error) {
      alert('Load failed: ' + error.message);
    }
  };

  // Canvas drawing function
  const drawShape = (ctx, shape) => {
    ctx.beginPath();
    ctx.fillStyle = '#333';
    const { x, y } = shape;

    switch (shape.type) {
      case 'circle':
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        break;
      case 'square':
        ctx.fillRect(x - 20, y - 20, 40, 40);
        break;
      case 'triangle':
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x - 20, y + 20);
        ctx.lineTo(x + 20, y + 20);
        ctx.closePath();
        break;
    }
    ctx.fill();
  };

  return (
    <div style={styles.appContainer}>
      {/* Header with controls */}
      <div style={styles.header}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Painting title"
          style={styles.titleInput}
        />

        <div style={styles.userSelector}>
          <span style={styles.userLabel}>Artist:</span>
          <select
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find(u => u.id == e.target.value);
              if (user) setSelectedUser(user);
            }}
            disabled={!users.length}
            style={styles.userSelect}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.displayName}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={handleSaveToServer} style={styles.saveButton}>
            Save to Server
          </button>
          <button onClick={handleLoadFromServer} style={styles.loadButton}>
            Load from Server
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div style={styles.mainContent}>
        {/* Canvas */}
        <div style={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            style={styles.canvas}
            onDoubleClick={handleDoubleClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          />
        </div>

        {/* Tools sidebar */}
        <div style={styles.toolsSidebar}>
          <h3 style={styles.toolsTitle}>Tools</h3>
          <div style={styles.toolsContainer}>
            {['circle', 'square', 'triangle'].map((shape) => (
              <div
                key={shape}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('shape', shape)}
                title={`Drag ${shape}`}
                style={{
                  ...styles.shapeTool,
                  ...(shape === 'circle' && styles.circleTool),
                  ...(shape === 'square' && styles.squareTool),
                  ...(shape === 'triangle' && styles.triangleTool),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <strong>Shape Count:</strong> {Object.entries(shapeCounts)
          .map(([type, count]) => `${type}: ${count}`)
          .join(' | ')}
      </div>
    </div>
  );
}

// Styles
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    padding: '10px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  titleInput: {
    padding: '8px 12px',
    fontSize: '1rem',
    flex: 1,
    maxWidth: '300px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  userSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '200px',
  },
  userLabel: {
    fontWeight: 'bold',
  },
  userSelect: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    flex: 1,
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginLeft: 'auto',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#218838',
    },
  },
  loadButton: {
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#138496',
    },
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    background: '#ffffff',
  },
  canvasContainer: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    border: '2px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    cursor: 'crosshair',
  },
  toolsSidebar: {
    width: '180px',
    padding: '20px',
    background: '#f0f0f0',
    borderLeft: '1px solid #ddd',
  },
  toolsTitle: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  toolsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center',
  },
  shapeTool: {
    width: '50px',
    height: '50px',
    cursor: 'grab',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  circleTool: {
    borderRadius: '50%',
    backgroundColor: '#6c757d',
  },
  squareTool: {
    backgroundColor: '#17a2b8',
  },
  triangleTool: {
    width: 0,
    height: 0,
    borderLeft: '25px solid transparent',
    borderRight: '25px solid transparent',
    borderBottom: '50px solid #ffc107',
  },
  footer: {
    padding: '12px',
    background: '#f8f9fa',
    borderTop: '1px solid #ddd',
  },
};