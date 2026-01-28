import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Simplified continent outlines as lat/lng point arrays
// Each continent is represented by boundary points that we'll fill with dots
const continentBoundaries = {
  northAmerica: {
    bounds: { minLat: 15, maxLat: 72, minLng: -170, maxLng: -50 },
    shape: (lat: number, lng: number): boolean => {
      // North America shape approximation
      if (lat > 60 && lng < -140) return true; // Alaska
      if (lat > 48 && lat < 72 && lng > -140 && lng < -55) return true; // Canada
      if (lat > 25 && lat < 50 && lng > -130 && lng < -65) {
        // Continental US shape
        if (lat < 30 && lng < -100) return true; // Texas/Southwest
        if (lat > 30 && lat < 50) return true;
        return false;
      }
      if (lat > 15 && lat < 32 && lng > -118 && lng < -85) return true; // Mexico
      return false;
    }
  },
  southAmerica: {
    bounds: { minLat: -56, maxLat: 12, minLng: -82, maxLng: -34 },
    shape: (lat: number, lng: number): boolean => {
      // South America shape
      if (lat > 0 && lat < 12 && lng > -80 && lng < -50) return true; // Northern SA
      if (lat > -15 && lat <= 0 && lng > -80 && lng < -35) return true; // Brazil north
      if (lat > -35 && lat <= -15 && lng > -75 && lng < -38) return true; // Brazil/Argentina
      if (lat > -56 && lat <= -35 && lng > -75 && lng < -62) return true; // Patagonia
      if (lat > -25 && lat < 0 && lng > -82 && lng < -68) return true; // Peru/Bolivia
      return false;
    }
  },
  europe: {
    bounds: { minLat: 35, maxLat: 71, minLng: -10, maxLng: 60 },
    shape: (lat: number, lng: number): boolean => {
      if (lat > 55 && lat < 71 && lng > 5 && lng < 32) return true; // Scandinavia
      if (lat > 48 && lat < 60 && lng > -10 && lng < 40) return true; // Northern Europe
      if (lat > 35 && lat <= 48 && lng > -10 && lng < 30) return true; // Southern Europe
      if (lat > 45 && lat < 70 && lng > 30 && lng < 60) return true; // Eastern Europe/Russia
      return false;
    }
  },
  africa: {
    bounds: { minLat: -35, maxLat: 37, minLng: -18, maxLng: 52 },
    shape: (lat: number, lng: number): boolean => {
      if (lat > 20 && lat < 37 && lng > -18 && lng < 35) return true; // North Africa
      if (lat > 0 && lat <= 20 && lng > -18 && lng < 52) return true; // Central Africa
      if (lat > -20 && lat <= 0 && lng > 10 && lng < 45) return true; // East Africa
      if (lat > -35 && lat <= -20 && lng > 15 && lng < 35) return true; // South Africa
      return false;
    }
  },
  asia: {
    bounds: { minLat: 5, maxLat: 75, minLng: 60, maxLng: 180 },
    shape: (lat: number, lng: number): boolean => {
      if (lat > 50 && lat < 75 && lng > 60 && lng < 180) return true; // Siberia
      if (lat > 35 && lat <= 50 && lng > 70 && lng < 145) return true; // Central Asia
      if (lat > 20 && lat <= 35 && lng > 60 && lng < 125) return true; // Middle East/India/China
      if (lat > 5 && lat <= 20 && lng > 95 && lng < 125) return true; // Southeast Asia
      if (lat > 30 && lat < 45 && lng > 125 && lng < 145) return true; // Japan/Korea
      return false;
    }
  },
  australia: {
    bounds: { minLat: -45, maxLat: -10, minLng: 112, maxLng: 155 },
    shape: (lat: number, lng: number): boolean => {
      if (lat > -40 && lat < -10 && lng > 112 && lng < 155) return true;
      return false;
    }
  },
  indonesia: {
    bounds: { minLat: -10, maxLat: 6, minLng: 95, maxLng: 140 },
    shape: (lat: number, lng: number): boolean => {
      if (lat > -10 && lat < 6 && lng > 95 && lng < 140) return true;
      return false;
    }
  }
};

// Convert lat/lng to 3D position on sphere
const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
};

// Generate points for all continents
const generateContinentPoints = (density: number = 2.5): Float32Array => {
  const points: number[] = [];
  const radius = 1.02;
  
  // Iterate through all lat/lng positions
  for (let lat = -60; lat <= 75; lat += density) {
    for (let lng = -180; lng <= 180; lng += density) {
      // Check if point is on any continent
      let isOnLand = false;
      
      for (const continent of Object.values(continentBoundaries)) {
        if (
          lat >= continent.bounds.minLat &&
          lat <= continent.bounds.maxLat &&
          lng >= continent.bounds.minLng &&
          lng <= continent.bounds.maxLng &&
          continent.shape(lat, lng)
        ) {
          isOnLand = true;
          break;
        }
      }
      
      if (isOnLand) {
        const pos = latLngToVector3(lat, lng, radius);
        points.push(pos.x, pos.y, pos.z);
      }
    }
  }
  
  return new Float32Array(points);
};

// Continent dots component
const ContinentDots = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => generateContinentPoints(2.5), []);
  
  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  // Custom shader material for glowing dots
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color('#4ade80') },
        glowColor: { value: new THREE.Color('#22c55e') },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 3.5 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform vec3 glowColor;
        varying vec3 vPosition;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          vec3 finalColor = mix(glowColor, color, smoothstep(0.0, 0.3, dist));
          
          gl_FragColor = vec4(finalColor, alpha * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  return (
    <points ref={pointsRef} geometry={pointsGeometry} material={shaderMaterial} />
  );
};

// Marker point component
const Marker = ({ lat, lng, color = '#ef4444' }: { lat: number; lng: number; color?: string }) => {
  const position = useMemo(() => latLngToVector3(lat, lng, 1.05), [lat, lng]);
  const markerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (markerRef.current) {
      markerRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
    }
  });
  
  return (
    <mesh ref={markerRef} position={position}>
      <sphereGeometry args={[0.025, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

// Atmosphere rings
const AtmosphereRings = () => {
  return (
    <>
      <Sphere args={[1.12, 64, 64]}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
      <Sphere args={[1.2, 64, 64]}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
      <Sphere args={[1.3, 32, 32]}>
        <meshBasicMaterial
          color="#166534"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </Sphere>
    </>
  );
};

// Main rotating globe component
const Globe = () => {
  const globeRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Ocean sphere - dark black */}
      <Sphere args={[1, 64, 64]}>
        <meshPhysicalMaterial
          color="#050505"
          roughness={0.3}
          metalness={0.7}
          clearcoat={0.3}
        />
      </Sphere>
      
      {/* Continent dots */}
      <ContinentDots />
      
      {/* Example marker - Amazon rainforest */}
      <Marker lat={-3} lng={-60} color="#ef4444" />
      
      {/* Atmosphere glow */}
      <AtmosphereRings />
    </group>
  );
};

const AnimatedGlobe = () => {
  return (
    <div className="flex justify-center py-6">
      <div className="relative">
        {/* Glow effect behind globe */}
        <div className="absolute inset-0 rounded-full bg-primary/15 blur-3xl scale-[1.8]" />
        
        {/* 3D Canvas */}
        <div className="w-36 h-36 md:w-44 md:h-44 relative z-10">
          <Canvas
            camera={{ position: [0, 0, 2.5], fov: 45 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
          >
            {/* Subtle lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-3, -3, 3]} intensity={0.3} color="#22c55e" />
            
            {/* Globe */}
            <Globe />
            
            {/* Interactive controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              rotateSpeed={0.4}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI - Math.PI / 4}
            />
          </Canvas>
        </div>
        
        {/* Hint text */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50">
          drag to rotate
        </div>
      </div>
    </div>
  );
};

export default AnimatedGlobe;
