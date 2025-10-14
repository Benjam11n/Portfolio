import React from 'react';

interface ButtonProps {
  name: string;
  isBeam?: boolean;
  containerClass?: string;
}

const Button: React.FC<ButtonProps> = ({ name, isBeam = false, containerClass }) => {
  return (
    <button className={`btn ${containerClass}`}>
      {isBeam ? <span className="relative flex size-3">
          <span className="btn-ping" />
          <span className="btn-ping_dot" />
        </span> : null}
      {name}
    </button>
  );
};

export default Button;
