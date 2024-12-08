import ViewToggle from './ViewToggle';

const Menu = () => {
  return (
    <div className="menu">
      <img className="menu__logo" src="logo.png" alt="logo" />
      <div className="menu__buttons">
        <ViewToggle />
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
      </div>
    </div>
  );
};

export default Menu;
