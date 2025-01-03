import { Whiteboard } from './Whiteboard';
import WhiteboardText from './WhiteboardText';

const WhiteboardSection = ({
  position,
  rotation,
  texts,
  isRight,
  isMobile,
}) => (
  <group>
    <Whiteboard
      scale={2}
      position-x={position.x}
      position-y={position.y}
      position-z={position.z}
      rotation-y={rotation}
    />
    {texts.map((text, index) => (
      <WhiteboardText
        key={index}
        position={{
          x: isMobile ? -1.05 : isRight ? position.x - 0.7 : position.x - 0.8,
          y: isMobile
            ? 2.9 - index * 0.15
            : isRight
            ? 1.9 - index * 0.2
            : 2 - index * 0.15,
          z: isMobile
            ? position.z
            : isRight
            ? position.z - 0.7
            : position.z + 0.8,
          rotationY: rotation,
        }}
        text={text.content}
        size={text.size}
      />
    ))}
  </group>
);

export default WhiteboardSection;
