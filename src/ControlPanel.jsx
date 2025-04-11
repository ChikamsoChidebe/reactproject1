// ControlPanel.js
import React from 'react';

const ControlPanel = ({ onPassTime }) => (
  <div className="control-panel">
    <button onClick={onPassTime} className=' border-2 active:scale-[0.9]'>Pass One Hour</button>
  </div>
);

export default ControlPanel;
