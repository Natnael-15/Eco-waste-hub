import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

const slides = [
  {
    title: "Eco Waste Hub",
    subtitle: "Revolutionizing Waste Management",
    content: "A sustainable solution for modern waste management challenges"
  },
  {
    title: "Key Features",
    subtitle: "What Makes Us Different",
    content: "• Real-time waste tracking\n• Smart bin monitoring\n• Community engagement\n• Data-driven insights"
  },
  {
    title: "Impact",
    subtitle: "Making a Difference",
    content: "• 40% reduction in waste\n• 60% increase in recycling\n• 1000+ active users"
  },
  {
    title: "Future Vision",
    subtitle: "What's Next",
    content: "• AI-powered sorting\n• Blockchain tracking\n• Global expansion"
  }
];

const Slide = ({ position, rotation, content, index, activeSlide }: any) => {
  const meshRef = useRef<any>();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={activeSlide === index ? 1 : 0.8}
      >
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color={activeSlide === index ? "#4CAF50" : "#2E7D32"} />
        <Text
          position={[0, 0.5, 0.06]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {content.title}
        </Text>
        <Text
          position={[0, 0.2, 0.06]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {content.subtitle}
        </Text>
        <Text
          position={[0, -0.2, 0.06]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {content.content}
        </Text>
      </mesh>
    </Float>
  );
};

const Presentation3D = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {slides.map((slide, index) => (
          <Slide
            key={index}
            position={[
              (index - activeSlide) * 3,
              0,
              -Math.abs(index - activeSlide) * 0.5
            ]}
            rotation={[0, 0, 0]}
            content={slide}
            index={index}
            activeSlide={activeSlide}
          />
        ))}
      </Canvas>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={prevSlide}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={nextSlide}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Presentation3D; 