import { useState } from 'react';
import ExploreView from './explore/ExploreView.jsx';
import ListView from './list/ListView.jsx';
import Navbar from './list/sections/Navbar.jsx';

function App() {
  const [currentView, setCurrentView] = useState(true);

  return (
    <>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      {currentView === true ? <ExploreView /> : <ListView />}
    </>
  );
}

export default App;
