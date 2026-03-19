import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useState } from 'react';

const phrases = [
  "J'ai rien vu 👀",
  'Promis je regarde pas 🤫',
  'Secret bien gardé 🔒',
  'Oups… juste un petit œil 😅',
];

/* ─── 3D Panda Model ─── */
function PandaModel({ isHidden }: { isHidden: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);

  // Animation targets
  const targetLeftArm = useRef({ rotZ: 0.3, rotX: 0 });
  const targetRightArm = useRef({ rotZ: -0.3, rotX: 0 });
  const breathRef = useRef(0);

  useEffect(() => {
    if (isHidden) {
      // Arms up covering eyes
      targetLeftArm.current = { rotZ: 1.2, rotX: -0.5 };
      targetRightArm.current = { rotZ: -1.2, rotX: -0.5 };
    } else {
      // Arms down resting
      targetLeftArm.current = { rotZ: 0.3, rotX: 0 };
      targetRightArm.current = { rotZ: -0.3, rotX: 0 };
    }
  }, [isHidden]);

  // Green palette
  const darkGreen = useMemo(() => new THREE.Color('#1a5c2a'), []);
  const midGreen = useMemo(() => new THREE.Color('#2d8a4e'), []);
  const lightGreen = useMemo(() => new THREE.Color('#4ade80'), []);
  const neonGreen = useMemo(() => new THREE.Color('#22ff66'), []);
  const darkFur = useMemo(() => new THREE.Color('#0d2818'), []);
  const white = useMemo(() => new THREE.Color('#f0f0f0'), []);
  const nose = useMemo(() => new THREE.Color('#1a1a1a'), []);
  const eyeWhite = useMemo(() => new THREE.Color('#ffffff'), []);
  const pupilColor = useMemo(() => new THREE.Color('#4a2800'), []);
  const mouthPink = useMemo(() => new THREE.Color('#cc6666'), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Breathing
    breathRef.current += delta * 1.5;
    const breathScale = 1 + Math.sin(breathRef.current) * 0.008;
    groupRef.current.scale.set(breathScale, breathScale, breathScale);

    // Smooth arm animation
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.z,
        targetLeftArm.current.rotZ,
        delta * 4
      );
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.x,
        targetLeftArm.current.rotX,
        delta * 4
      );
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.z,
        targetRightArm.current.rotZ,
        delta * 4
      );
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x,
        targetRightArm.current.rotX,
        delta * 4
      );
    }

    // Peek eye (right eye opens slightly when peeking)
    if (rightPupilRef.current && leftPupilRef.current) {
      const targetScale = isHidden ? 0.6 : 1;
      rightPupilRef.current.scale.y = THREE.MathUtils.lerp(
        rightPupilRef.current.scale.y, targetScale, delta * 3
      );
      leftPupilRef.current.scale.y = THREE.MathUtils.lerp(
        leftPupilRef.current.scale.y, isHidden ? 0 : 1, delta * 3
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={darkGreen} roughness={0.85} />
      </mesh>

      {/* Belly patch */}
      <mesh position={[0, 0.05, 0.55]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={midGreen} roughness={0.9} />
      </mesh>

      {/* Neon glow lines on body */}
      <mesh position={[0.45, -0.1, 0.35]} rotation={[0, 0, -0.3]}>
        <torusGeometry args={[0.15, 0.015, 8, 32, Math.PI]} />
        <meshStandardMaterial color={neonGreen} emissive={neonGreen} emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.45, -0.1, 0.35]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.15, 0.015, 8, 32, Math.PI]} />
        <meshStandardMaterial color={neonGreen} emissive={neonGreen} emissiveIntensity={2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={darkGreen} roughness={0.85} />
      </mesh>

      {/* Face mask / cheeks */}
      <mesh position={[0, 0.75, 0.4]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={white} roughness={0.9} />
      </mesh>

      {/* Eyebrow marks */}
      <mesh position={[-0.18, 1.0, 0.4]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={white} roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 1.0, 0.4]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={white} roughness={0.9} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.4, 1.3, -0.05]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={darkFur} roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 1.3, -0.05]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={darkFur} roughness={0.9} />
      </mesh>
      {/* Ear inner */}
      <mesh position={[-0.4, 1.32, 0.05]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={white} roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 1.32, 0.05]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={white} roughness={0.9} />
      </mesh>

      {/* Eye sockets (dark patches) */}
      <mesh position={[-0.18, 0.88, 0.42]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={darkFur} roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 0.88, 0.42]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={darkFur} roughness={0.9} />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.18, 0.88, 0.5]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={eyeWhite} roughness={0.3} />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.18, 0.88, 0.5]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={eyeWhite} roughness={0.3} />
      </mesh>

      {/* Pupils */}
      <mesh ref={leftPupilRef} position={[-0.18, 0.88, 0.57]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={pupilColor} roughness={0.3} />
      </mesh>
      <mesh ref={rightPupilRef} position={[0.18, 0.88, 0.57]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={pupilColor} roughness={0.3} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.75, 0.58]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={nose} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Mouth (smile) */}
      <mesh position={[0, 0.68, 0.54]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
        <meshStandardMaterial color={mouthPink} roughness={0.7} />
      </mesh>

      {/* Whiskers */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.28, 0.78, 0.5]} rotation={[0, 0, side * 0.15]}>
            <cylinderGeometry args={[0.003, 0.003, 0.2, 4]} />
            <meshStandardMaterial color={white} roughness={0.5} />
          </mesh>
          <mesh position={[side * 0.26, 0.74, 0.5]} rotation={[0, 0, side * 0.3]}>
            <cylinderGeometry args={[0.003, 0.003, 0.18, 4]} />
            <meshStandardMaterial color={white} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Neon glow on cheeks */}
      <mesh position={[-0.35, 0.8, 0.3]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={neonGreen} emissive={neonGreen} emissiveIntensity={1.5} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.35, 0.8, 0.3]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={neonGreen} emissive={neonGreen} emissiveIntensity={1.5} transparent opacity={0.6} />
      </mesh>

      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.55, 0.15, 0.2]} rotation={[0, 0, 0.3]}>
        {/* Upper arm */}
        <mesh position={[0, 0.2, 0]}>
          <capsuleGeometry args={[0.1, 0.25, 8, 16]} />
          <meshStandardMaterial color={darkFur} roughness={0.9} />
        </mesh>
        {/* Paw */}
        <mesh position={[-0.05, 0.48, 0.05]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={darkFur} roughness={0.9} />
        </mesh>
        {/* Paw pads */}
        <mesh position={[-0.05, 0.48, 0.13]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={nose} roughness={0.7} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.55, 0.15, 0.2]} rotation={[0, 0, -0.3]}>
        {/* Upper arm */}
        <mesh position={[0, 0.2, 0]}>
          <capsuleGeometry args={[0.1, 0.25, 8, 16]} />
          <meshStandardMaterial color={darkFur} roughness={0.9} />
        </mesh>
        {/* Paw */}
        <mesh position={[0.05, 0.48, 0.05]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={darkFur} roughness={0.9} />
        </mesh>
        {/* Paw pads */}
        <mesh position={[0.05, 0.48, 0.13]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={nose} roughness={0.7} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.3, -0.6, 0.2]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={darkFur} roughness={0.9} />
      </mesh>
      <mesh position={[0.3, -0.6, 0.2]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={darkFur} roughness={0.9} />
      </mesh>
      {/* Feet pads */}
      <mesh position={[-0.3, -0.62, 0.32]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={nose} roughness={0.7} />
      </mesh>
      <mesh position={[0.3, -0.62, 0.32]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={nose} roughness={0.7} />
      </mesh>

      {/* Tail */}
      <mesh position={[0, -0.15, -0.6]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={midGreen} roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ─── Main Component ─── */
type BalanceMascotProps = {
  isHidden: boolean;
};

const BalanceMascot = ({ isHidden }: BalanceMascotProps) => {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(phrases[0]);

  const randomPhrase = useMemo(
    () => phrases[Math.floor(Math.random() * phrases.length)],
    [isHidden]
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    if (isHidden) {
      setBubbleText(randomPhrase);
      timer = setTimeout(() => setShowBubble(true), 600);
      hideTimer = setTimeout(() => setShowBubble(false), 3800);
    } else {
      setShowBubble(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isHidden, randomPhrase]);

  return (
    <>
      {/* 3D Canvas */}
      <div className="absolute right-0 -bottom-1 z-20 pointer-events-none w-[100px] h-[100px]">
        <Canvas
          camera={{ position: [0, 0.3, 3.2], fov: 35 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 4]} intensity={0.8} />
          <directionalLight position={[-2, 1, 2]} intensity={0.3} color="#4ade80" />
          <pointLight position={[0, 0, 2]} intensity={0.4} color="#22ff66" />
          <PandaModel isHidden={isHidden} />
        </Canvas>
      </div>

      {/* Speech bubble */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-[108px] z-30 transition-all duration-500 pointer-events-none ${
          showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-75'
        }`}
      >
        <div className="relative bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-1.5 shadow-lg">
          <p className="text-[10px] font-medium text-foreground whitespace-nowrap">{bubbleText}</p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card/95 border-b border-r border-border/50 rotate-45" />
        </div>
      </div>
    </>
  );
};

export default BalanceMascot;
