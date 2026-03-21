import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const phrases = [
  "J'ai rien vu 👀",
  'Promis je regarde pas 🤫',
  'Secret bien gardé 🔒',
  'Oups… juste un petit œil 😅',
];

function PandaModel({ isHidden }: { isHidden: boolean }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const targetLeft = useRef({ z: 0.3, x: 0 });
  const targetRight = useRef({ z: -0.3, x: 0 });

  useEffect(() => {
    if (isHidden) {
      targetLeft.current = { z: 1.2, x: -0.5 };
      targetRight.current = { z: -1.2, x: -0.5 };
    } else {
      targetLeft.current = { z: 0.3, x: 0 };
      targetRight.current = { z: -0.3, x: 0 };
    }
  }, [isHidden]);

  const darkGreen = useMemo(() => new THREE.Color('#1a5c2a'), []);
  const midGreen = useMemo(() => new THREE.Color('#2d8a4e'), []);
  const neonGreen = useMemo(() => new THREE.Color('#22ff66'), []);
  const darkFur = useMemo(() => new THREE.Color('#0d2818'), []);
  const white = useMemo(() => new THREE.Color('#f0f0f0'), []);
  const nose = useMemo(() => new THREE.Color('#1a1a1a'), []);
  const eyeWhite = useMemo(() => new THREE.Color('#ffffff'), []);
  const pupilColor = useMemo(() => new THREE.Color('#4a2800'), []);
  const mouthPink = useMemo(() => new THREE.Color('#cc6666'), []);

  useFrame((_, delta) => {
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, targetLeft.current.z, delta * 4);
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targetLeft.current.x, delta * 4);
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targetRight.current.z, delta * 4);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetRight.current.x, delta * 4);
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      {/* Body */}
      <mesh><sphereGeometry args={[0.7, 32, 32]} /><meshStandardMaterial color={darkGreen} roughness={0.85} /></mesh>
      {/* Belly */}
      <mesh position={[0, 0.05, 0.55]}><sphereGeometry args={[0.38, 32, 32]} /><meshStandardMaterial color={midGreen} roughness={0.9} /></mesh>
      {/* Neon lines */}
      <mesh position={[0.45, -0.1, 0.35]} rotation={[0, 0, -0.3]}><torusGeometry args={[0.15, 0.015, 8, 32, Math.PI]} /><meshStandardMaterial color={neonGreen} emissive={neonGreen} emissiveIntensity={2} /></mesh>
      <mesh position={[-0.45, -0.1, 0.35]} rotation={[0, 0, 0.3]}><torusGeometry args={[0.15, 0.015, 8, 32, Math.PI]} /><meshStandardMaterial color={neonGreen} emissive={neonGreen} emissiveIntensity={2} /></mesh>

      {/* Head */}
      <mesh position={[0, 0.85, 0]}><sphereGeometry args={[0.55, 32, 32]} /><meshStandardMaterial color={darkGreen} roughness={0.85} /></mesh>
      {/* Face */}
      <mesh position={[0, 0.75, 0.4]}><sphereGeometry args={[0.32, 32, 32]} /><meshStandardMaterial color={white} roughness={0.9} /></mesh>

      {/* Ears */}
      <mesh position={[-0.4, 1.3, -0.05]}><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
      <mesh position={[0.4, 1.3, -0.05]}><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
      <mesh position={[-0.4, 1.32, 0.05]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color={white} roughness={0.9} /></mesh>
      <mesh position={[0.4, 1.32, 0.05]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color={white} roughness={0.9} /></mesh>

      {/* Eye sockets */}
      <mesh position={[-0.18, 0.88, 0.42]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
      <mesh position={[0.18, 0.88, 0.42]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
      {/* Eyes */}
      <mesh position={[-0.18, 0.88, 0.5]}><sphereGeometry args={[0.07, 16, 16]} /><meshStandardMaterial color={eyeWhite} roughness={0.3} /></mesh>
      <mesh position={[0.18, 0.88, 0.5]}><sphereGeometry args={[0.07, 16, 16]} /><meshStandardMaterial color={eyeWhite} roughness={0.3} /></mesh>
      {/* Pupils */}
      <mesh position={[-0.18, 0.88, 0.57]}><sphereGeometry args={[0.035, 16, 16]} /><meshStandardMaterial color={pupilColor} roughness={0.3} /></mesh>
      <mesh position={[0.18, 0.88, 0.57]}><sphereGeometry args={[0.035, 16, 16]} /><meshStandardMaterial color={pupilColor} roughness={0.3} /></mesh>

      {/* Nose */}
      <mesh position={[0, 0.75, 0.58]}><sphereGeometry args={[0.05, 16, 16]} /><meshStandardMaterial color={nose} roughness={0.4} metalness={0.3} /></mesh>
      {/* Mouth */}
      <mesh position={[0, 0.68, 0.54]} rotation={[0.2, 0, 0]}><torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} /><meshStandardMaterial color={mouthPink} roughness={0.7} /></mesh>

      {/* Neon cheeks */}
      <mesh position={[-0.35, 0.8, 0.3]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color={neonGreen} emissive={neonGreen} emissiveIntensity={1.5} transparent opacity={0.6} /></mesh>
      <mesh position={[0.35, 0.8, 0.3]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color={neonGreen} emissive={neonGreen} emissiveIntensity={1.5} transparent opacity={0.6} /></mesh>

      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.55, 0.15, 0.2]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, 0.2, 0]}><capsuleGeometry args={[0.1, 0.25, 8, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
        <mesh position={[-0.05, 0.48, 0.05]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.55, 0.15, 0.2]} rotation={[0, 0, -0.3]}>
        <mesh position={[0, 0.2, 0]}><capsuleGeometry args={[0.1, 0.25, 8, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
        <mesh position={[0.05, 0.48, 0.05]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.3, -0.6, 0.2]}><sphereGeometry args={[0.16, 16, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>
      <mesh position={[0.3, -0.6, 0.2]}><sphereGeometry args={[0.16, 16, 16]} /><meshStandardMaterial color={darkFur} roughness={0.9} /></mesh>

      {/* Tail */}
      <mesh position={[0, -0.15, -0.6]}><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color={midGreen} roughness={0.9} /></mesh>
    </group>
  );
}

type BalanceMascotProps = { isHidden: boolean };

const BalanceMascot = ({ isHidden }: BalanceMascotProps) => {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(phrases[0]);
  const randomPhrase = useMemo(() => phrases[Math.floor(Math.random() * phrases.length)], [isHidden]);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout> | null = null;
    let t2: ReturnType<typeof setTimeout> | null = null;
    if (isHidden) {
      setBubbleText(randomPhrase);
      t1 = setTimeout(() => setShowBubble(true), 600);
      t2 = setTimeout(() => setShowBubble(false), 3800);
    } else {
      setShowBubble(false);
    }
    return () => { if (t1) clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, [isHidden, randomPhrase]);

  return (
    <>
      <div className="absolute right-0 -bottom-1 z-20 pointer-events-none w-[100px] h-[100px]">
        <Canvas camera={{ position: [0, 0.3, 3.2], fov: 35 }} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 4]} intensity={0.8} />
          <directionalLight position={[-2, 1, 2]} intensity={0.3} color="#4ade80" />
          <pointLight position={[0, 0, 2]} intensity={0.4} color="#22ff66" />
          <PandaModel isHidden={isHidden} />
        </Canvas>
      </div>
      <div className={`absolute left-1/2 -translate-x-1/2 bottom-[108px] z-30 transition-all duration-500 pointer-events-none ${showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-75'}`}>
        <div className="relative bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-1.5 shadow-lg">
          <p className="text-[10px] font-medium text-foreground whitespace-nowrap">{bubbleText}</p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card/95 border-b border-r border-border/50 rotate-45" />
        </div>
      </div>
    </>
  );
};

export default BalanceMascot;
