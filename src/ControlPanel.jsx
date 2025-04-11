import React from 'react';

const ControlPanel = ({ onPassTime, onFeed, currentTime }) => {
  // Ensure currentTime is a valid Date object
  const time = currentTime instanceof Date ? currentTime : new Date();

  return (
    <div className="control-panel" style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <div
        style={{
          display: 'inline-block',
          padding: '1rem',
          borderRadius: '8px',
          backgroundColor: '#f0f4f8',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '1rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            margin: 0,
            color: '#333',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Current Time
        </h2>
        <p
          style={{
            fontSize: '1.25rem',
            margin: 0,
            color: '#4CAF50',
            fontWeight: 'bold',
            fontFamily: 'Courier New, monospace',
          }}
        >
          {time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()}:
          {time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}:
          {time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={onPassTime}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          Pass Time
        </button>
        <button
          onClick={onFeed}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          Feed Animals
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;