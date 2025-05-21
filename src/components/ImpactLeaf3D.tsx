import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, PerspectiveCamera } from '@react-three/drei';

const LeafMesh: React.FC = () => {
  const meshRef = useRef(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.2) * 0.15;
    }
  });
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <Icosahedron args={[0.7, 0]}>
        <meshStandardMaterial color="#34d399" roughness={0.3} metalness={0.5} />
      </Icosahedron>
    </mesh>
  );
};

const ImpactLeaf3D: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-[90px] h-[90px] md:w-[120px] md:h-[120px] ${className}`}>
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 3]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={1.1} castShadow />
      <LeafMesh />
    </Canvas>
  </div>
);

export default ImpactLeaf3D; 