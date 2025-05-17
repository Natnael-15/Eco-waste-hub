import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';

function Earth() {
  const mesh = useRef<any>();
  const colorMap = useTexture('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg');

  // Auto-rotate
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
}

const Globe3D: React.FC<{ width?: number; height?: number }> = ({ width = 200, height = 200 }) => {
  return (
    <div style={{ width, height }}>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Earth />
        <Stars radius={10} depth={50} count={1000} factor={2} fade />
        {/* No OrbitControls for non-interactive */}
      </Canvas>
    </div>
  );
};

export default Globe3D; 