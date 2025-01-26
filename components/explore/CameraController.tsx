import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { lerp } from 'three/src/math/MathUtils.js';

const CameraController = ({ rotationIntensity = 0.1, smoothSpeed = 0.05 }) => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const initialPosition = useRef({
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Add passive event listener
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // Calculate target rotation based on mouse position
    targetRotation.current.x = mouse.current.y * rotationIntensity * 0.2;
    targetRotation.current.y = mouse.current.x * rotationIntensity;

    // Smoothly interpolate camera position
    camera.position.x = lerp(
      camera.position.x,
      initialPosition.current.x + mouse.current.x * 0.2,
      smoothSpeed
    );
    camera.position.y = lerp(
      camera.position.y,
      initialPosition.current.y + mouse.current.y * 0.02,
      smoothSpeed
    );

    // Smoothly interpolate camera rotation
    camera.rotation.x = lerp(
      camera.rotation.x,
      targetRotation.current.x,
      smoothSpeed
    );
    camera.rotation.y = lerp(
      camera.rotation.y,
      targetRotation.current.y,
      smoothSpeed
    );
  });

  return null;
};

export default CameraController;
