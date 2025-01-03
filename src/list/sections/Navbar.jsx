import { useState } from 'react';
import { navLinks } from '../../constants';
import ViewToggle from '../../explore/components/ViewToggle';
import { useActiveSection } from '../../hooks/useActiveSection';

const Navbar = ({ currentView, setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useActiveSection();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const NavItems = () => {
    const handleClick = (href) => {
      window.location.href = href;
    };

    return (
      <ul className="nav-ul">
        {navLinks.map(({ id, name, href }) => (
          <li
            key={id}
            className="nav-li cursor-pointer"
            onClick={() => handleClick(href)}
          >
            <a
              className={`nav-li_a ${
                !currentView && activeSection === name.toLowerCase()
                  ? 'text-white'
                  : ''
              }`}
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center py-5 mx-auto c-space">
          <a
            href="/"
            className="text-neutral-400 font-bold text-xl hover:text-white transition-colors"
          >
            Benjamin
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

          <nav className="sm:flex hidden">
            <ViewToggle
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
            <NavItems />
          </nav>
        </div>
      </div>

      <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <nav className="p-5">
          <NavItems />
          <ViewToggle
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
