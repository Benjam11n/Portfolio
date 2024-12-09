const ViewToggle = ({ currentView, setCurrentView }) => {
  return (
    <div className="toggle-container">
      <button
        onClick={() => setCurrentView(true)}
        className={`toggle-button ${currentView ? 'active' : ''}`}
      >
        Explore
      </button>

      <button
        onClick={() => setCurrentView(!currentView)}
        className="toggle-switch"
      >
        <div className={`toggle-handle ${currentView ? '' : 'switched'}`} />
      </button>

      <button
        onClick={() => setCurrentView(false)}
        className={`toggle-button ${!currentView ? 'active' : ''}`}
      >
        List
      </button>
    </div>
  );
};

export default ViewToggle;
