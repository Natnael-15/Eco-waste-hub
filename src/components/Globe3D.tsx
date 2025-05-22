import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, useTexture } from '@react-three/drei';
import { useNavigate, useLocation } from 'react-router-dom';
import * as THREE from 'three';

const GlobeMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/assets/earth-blue-marble.jpg',
      (loadedTexture) => {
        loadedTexture.wrapS = loadedTexture.wrapT = THREE.RepeatWrapping;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.warn('Error loading earth texture:', error);
        // Create a fallback texture
        const fallbackTexture = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
        setTexture(fallbackTexture);
      }
    );
  }, []);

  const { gl } = useThree();

  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.log('WebGL context lost, attempting to recover...');
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      if (meshRef.current) {
        meshRef.current.material.needsUpdate = true;
      }
    };

    gl.domElement.addEventListener('webglcontextlost', handleContextLost);
    gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
      gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} castShadow receiveShadow>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
};

const Globe3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleClick = () => {
    navigate('/game-arcade');
  };

  // Only show the tooltip on dashboard pages
  const showTooltip = location.pathname === '/dashboard' || location.pathname === '/admin' || location.pathname === '/user-dashboard';

  return (
    <div
      className={`flex flex-col items-center justify-center w-full py-6 md:py-10 ${className}`}
      style={{ minHeight: 340 }}
    >
      <div
        className="relative rounded-full overflow-hidden aspect-square"
        style={{ width: 300, height: 300, cursor: 'pointer', boxShadow: '0 0 32px #0004' }}
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label="Open Game Arcade"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      >
        {isVisible && (
          <Canvas
            shadows
            dpr={[1, 1.5]}
            style={{ width: '100%', height: '100%' }}
            gl={{
              powerPreference: 'high-performance',
              antialias: true,
              stencil: false,
              depth: true,
              alpha: true,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: true,
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 3]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.1} castShadow />
            <GlobeMesh />
          </Canvas>
        )}
        {/* Optional: Glow effect */}
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: '0 0 40px 10px #eab30833, 0 0 0 8px #1a223355' }} />
      </div>
      {showTooltip && (
        <div className="mt-3 animate-bounce text-eco-yellow text-lg font-bold bg-black/60 px-4 py-2 rounded-full shadow-lg border border-eco-yellow/60 select-none" style={{ letterSpacing: 0.5 }}>
          🎮 Click the globe for games!
        </div>
      )}
    </div>
  );
};

export default Globe3D; 