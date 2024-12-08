import { Text3D } from '@react-three/drei';

export const SectionTitle = ({ children, font, color = 'white', ...props }) => {
  return (
    <Text3D font={font ? font : 'fonts/Inter_Bold.json'} size={0.3} {...props}>
      {children}
      <meshStandardMaterial
        color={color}
        // metalness={0.5} // Metallic look (0-1)
        // roughness={0.2} // Surface roughness (0-1)
        // emissive="#000000" // Glowing effect color
        // emissiveIntensity={0.5} // Glow intensity
      />
    </Text3D>
  );
};
