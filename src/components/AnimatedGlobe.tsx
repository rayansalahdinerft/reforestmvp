import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, GradientTexture } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Continent coordinates (simplified polygons in lat/lng converted to 3D positions)
const continentData = [
  // North America
  { points: [[50, -125], [50, -65], [25, -80], [25, -105], [35, -120]], name: 'north-america' },
  // South America
  { points: [[-5, -80], [-5, -35], [-55, -70], [-55, -75]], name: 'south-america' },
  // Europe
  { points: [[70, -10], [70, 40], [35, 40], [35, -10]], name: 'europe' },
  // Africa
  { points: [[35, -15], [35, 50], [-35, 20], [-35, -5]], name: 'africa' },
  // Asia
  { points: [[70, 60], [70, 150], [10, 140], [10, 60]], name: 'asia' },
  // Australia
  { points: [[-10, 115], [-10, 155], [-40, 150], [-40, 115]], name: 'australia' },
];

// Convert lat/lng to 3D position on sphere
const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
};

// Create continent mesh geometry
const createContinentGeometry = (points: number[][], radius: number): THREE.BufferGeometry => {
  const shape = new THREE.Shape();
  const projectedPoints: THREE.Vector2[] = [];
  
  // Project to 2D for shape creation (simplified approach)
  points.forEach((point, i) => {
    const [lat, lng] = point;
    // Use mercator-like projection for shape
    const x = lng * 0.01;
    const y = lat * 0.01;
    projectedPoints.push(new THREE.Vector2(x, y));
    
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  });
  shape.closePath();
  
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 2,
  });
  
  return geometry;
};

// Glass material for continents
const GlassContinents = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const continentMeshes = useMemo(() => {
    const meshes: { position: THREE.Vector3; scale: number; rotation: THREE.Euler }[] = [];
    
    continentData.forEach((continent) => {
      // Calculate center of continent
      const centerLat = continent.points.reduce((a, b) => a + b[0], 0) / continent.points.length;
      const centerLng = continent.points.reduce((a, b) => a + b[1], 0) / continent.points.length;
      const position = latLngToVector3(centerLat, centerLng, 1.01);
      
      // Calculate rotation to face outward from sphere center
      const direction = position.clone().normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
      const euler = new THREE.Euler().setFromQuaternion(quaternion);
      
      meshes.push({
        position,
        scale: 0.15,
        rotation: euler,
      });
    });
    
    return meshes;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Simplified continent representations as glass patches on sphere */}
      {/* North America */}
      <mesh position={latLngToVector3(45, -100, 1.005)}>
        <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 0.8, 0, Math.PI * 0.5]} />
        <meshPhysicalMaterial
          color="#4ade80"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* South America */}
      <mesh position={latLngToVector3(-15, -60, 1.005)}>
        <sphereGeometry args={[0.2, 32, 32, 0, Math.PI * 0.6, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial
          color="#4ade80"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Europe */}
      <mesh position={latLngToVector3(50, 10, 1.005)}>
        <sphereGeometry args={[0.15, 32, 32, 0, Math.PI * 0.5, 0, Math.PI * 0.4]} />
        <meshPhysicalMaterial
          color="#4ade80"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Africa */}
      <mesh position={latLngToVector3(5, 20, 1.005)}>
        <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 0.6, 0, Math.PI * 0.7]} />
        <meshPhysicalMaterial
          color="#4ade80"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Asia */}
      <mesh position={latLngToVector3(40, 100, 1.005)}>
        <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 0.9, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial
          color="#4ade80"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Australia */}
      <mesh position={latLngToVector3(-25, 135, 1.005)}>
        <sphereGeometry args={[0.12, 32, 32, 0, Math.PI * 0.5, 0, Math.PI * 0.4]} />
        <meshPhysicalMaterial
          color="#4ade80"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
};

// Rotating globe component
const Globe = () => {
  const globeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Ocean sphere - black/dark */}
      <Sphere args={[1, 64, 64]}>
        <meshPhysicalMaterial
          color="#0a0a0a"
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </Sphere>
      
      {/* Glass continents */}
      <GlassContinents />
      
      {/* Atmosphere glow */}
      <Sphere args={[1.08, 64, 64]}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer glow ring */}
      <Sphere args={[1.15, 32, 32]}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

const AnimatedGlobe = () => {
  return (
    <div className="flex justify-center py-6">
      <div className="relative">
        {/* Glow effect behind globe */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-150" />
        
        {/* 3D Canvas */}
        <div className="w-32 h-32 md:w-40 md:h-40 relative z-10">
          <Canvas
            camera={{ position: [0, 0, 2.8], fov: 45 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
          >
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#22c55e" />
            <pointLight position={[2, 2, 2]} intensity={0.5} color="#4ade80" />
            
            {/* Globe */}
            <Globe />
            
            {/* Interactive controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              rotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI - Math.PI / 4}
            />
          </Canvas>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
          <span className="opacity-60">drag to rotate</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedGlobe;
