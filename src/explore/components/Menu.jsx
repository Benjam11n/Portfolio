import { useState } from 'react';
import ViewToggle from './ViewToggle';

const Menu = ({ currentView, setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="menu">
      <a
        href="/"
        className="text-neutral-400 font-bold text-xl hover:text-white transition-colors"
      >
        Benjamin
      </a>

      {/* <img className="menu__logo" src="logo.png" alt="logo" /> */}
      <div className="menu__buttons">
        <ViewToggle currentView={currentView} setCurrentView={setCurrentView} />
        <a className="menu__button" href="#home">
          Home
        </a>
        <a className="menu__button" href="#about">
          About
        </a>
        <a className="menu__button" href="#experience">
          Experience
        </a>
        <a className="menu__button" href="#projects">
          Projects
        </a>
        <a className="menu__button" href="#contact">
          Contact
        </a>

        <button
          onClick={toggleMenu}
          className="text-nentral-400 hover:text-white focus:outline-none sm:hidden flex"
          aria-label="Toggle menu"
        >
          <img
            src={isOpen ? 'assets/close.svg' : 'assets/menu.svg'}
            alt="toggle"
            className="w-6 h-6"
          />
        </button>
      </div>
    </div>
  );
};

export default Menu;
