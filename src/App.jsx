import { useState } from 'react';
import ExploreView from './explore/ExploreView.jsx';
import ListView from './list/ListView.jsx';
import Navbar from './list/sections/Navbar.jsx';

function App() {
  // True for explore view and false for list view
  const [currentView, setCurrentView] = useState(true);

  return (
    <>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      {currentView === true ? (
        <ExploreView setCurrentView={setCurrentView} />
      ) : (
        <ListView />
      )}
    </>
  );
}

export default App;
