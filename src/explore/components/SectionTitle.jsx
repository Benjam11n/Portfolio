import { Text3D } from '@react-three/drei';

export const SectionTitle = ({ children, font, color = 'white', ...props }) => {
  return (
    <Text3D
      font={font ? font : 'fonts/Inter_Bold.json'}
      size={0.3}
      height={0.2} // Add depth to the text
      {...props}
    >
      {children}
      <meshPhysicalMaterial
        color={color}
        metalness={0.3} // Slight metallic look
        roughness={0.2} // Polished surface
        clearcoat={0.8} // Add glossy clear coat
        clearcoatRoughness={0.2}
        reflectivity={0.8} // Make it reflective
        envMapIntensity={0.5}
        aoMapIntensity={1}
        emissive="#ffffff"
        emissiveIntensity={0.05}
      />
    </Text3D>
  );
};
