import React, { useState } from 'react';

const ViewToggle = () => {
  const [isTimeline, setIsTimeline] = useState(true);

  return (
    <div className="toggle-container">
      <button
        onClick={() => setIsTimeline(true)}
        className={`toggle-button ${isTimeline ? 'active' : ''}`}
      >
        Explore
      </button>

      <button
        onClick={() => setIsTimeline(!isTimeline)}
        className="toggle-switch"
      >
        <div className={`toggle-handle ${isTimeline ? '' : 'switched'}`} />
      </button>

      <button
        onClick={() => setIsTimeline(false)}
        className={`toggle-button ${!isTimeline ? 'active' : ''}`}
      >
        List
      </button>
    </div>
  );
};

export default ViewToggle;
