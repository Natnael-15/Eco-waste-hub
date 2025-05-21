import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

// Country data with fun facts
const countries = [
  { name: 'United States', lat: 38, lng: -97, fact: 'The US wastes about 30-40% of its food supply.' },
  { name: 'Brazil', lat: -14, lng: -51, fact: 'Brazil is a major food producer and also faces food waste challenges.' },
  { name: 'India', lat: 21, lng: 78, fact: 'India loses 67 million tonnes of food annually.' },
  { name: 'China', lat: 35, lng: 105, fact: 'China has launched campaigns to reduce food waste.' },
  { name: 'Australia', lat: -25, lng: 133, fact: 'Australia wastes over 7.6 million tonnes of food each year.' },
  { name: 'UK', lat: 54, lng: -2, fact: 'The UK reduced food waste by 27% from 2007 to 2018.' },
];

function latLngToVec3(lat: number, lng: number, radius = 2.01) {
  // Corrected for Three.js globe orientation
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  return [x, y, z];
}

// Billboarded marker using Html from drei
function CountryBillboardMarkers({ onHover, onClick, hovered }) {
  return countries.map((c, i) => {
    const pos = latLngToVec3(c.lat, c.lng);
    return (
      <Html
        key={c.name}
        position={pos}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'auto' }}
        zIndexRange={[10, 0]}
        occlude={false}
      >
        <div
          onMouseEnter={e => onHover(c, e)}
          onMouseLeave={e => onHover(null, e)}
          onClick={e => onClick(c, e)}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: hovered?.name === c.name ? '#facc15' : '#22c55e',
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.2s',
            transform: hovered?.name === c.name ? 'scale(1.2)' : 'scale(1)',
            userSelect: 'none',
          }}
          title={c.name}
        >
          <span role="img" aria-label="marker">📍</span>
        </div>
      </Html>
    );
  });
}

function Globe({ onHover, onClick, hovered }) {
  const globeRef = useRef();
  const texture = useTexture('/assets/earth-blue-marble.jpg');
  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.2}
          transparent
          opacity={0.98}
        />
      </mesh>
      <CountryBillboardMarkers onHover={onHover} onClick={onClick} hovered={hovered} />
    </group>
  );
}

const InteractiveWorldMap = () => {
  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);
  return (
    <div className="w-full h-96 rounded-3xl shadow-2xl bg-white/70 dark:bg-gray-800/70 border border-eco-green dark:border-eco-yellow backdrop-blur-lg flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <Stars radius={10} depth={50} count={1000} factor={4} fade />
        <Suspense fallback={null}>
          <Globe onHover={setHovered} onClick={setClicked} hovered={hovered} />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
      {hovered && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2 bg-eco-green text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold pointer-events-none animate-fade-in">
          {hovered.name} <span className="ml-2 text-xs font-normal">{hovered.fact}</span>
        </div>
      )}
      {clicked && (
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2 bg-eco-yellow text-eco-green px-4 py-2 rounded-xl shadow-lg text-base font-bold animate-fade-in">
          <div className="font-bold">{clicked.name}</div>
          <div className="text-xs mt-1">{clicked.fact}</div>
          <button className="mt-2 px-3 py-1 rounded bg-eco-green text-white text-xs font-semibold" onClick={() => setClicked(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default InteractiveWorldMap; 