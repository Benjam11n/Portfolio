import { SectionTitle } from './SectionTitle';

interface Position {
  x: number;
  y: number;
  z: number;
  rotationY: number;
}

interface WhiteboardTextProps {
  position: Position;
  text: string;
  size?: number;
}

const WhiteboardText = ({ position, text, size = 0.09 }: WhiteboardTextProps) => (
  <SectionTitle
    font={'fonts/Inter_Light_Regular.json'}
    size={size}
    position-x={position.x}
    position-y={position.y}
    position-z={position.z}
    rotation-y={position.rotationY}
    height={0.02}
    curveSegments={32}
    color={'#000000'}
  >
    {text}
  </SectionTitle>
);

export default WhiteboardText;
