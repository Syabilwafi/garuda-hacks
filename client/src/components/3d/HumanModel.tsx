"use client";
import { useRef, useCallback, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { PainType } from "@/components/ui/PainTypeSelector";
import type { Coordinate3D, HighlightedNode } from "@/api/assessmentApi";
export interface PainMarkData {
  coordinate3D: Coordinate3D;
  painType: PainType;
  intensity: number;
  faceIndex?: number;
}
const PAIN_HEX: Record<PainType, string> = {
  DULL_ACHE: "#AFA406",
  SHARP:     "#DC2626",
  BURNING:   "#EA580C",
  THROBBING: "#7C3AED",
  PRESSURE:  "#2563EB",
};
function PainDot({ mark }: { mark: PainMarkData }) {
  const color = PAIN_HEX[mark.painType] || "#000000";
  const size = 0.035; 
  const intensity = mark.intensity || 3;
  const coreOpacity = 0.4 + (intensity - 1) * 0.15;
  const haloOpacity = 0.1 + (intensity - 1) * 0.07;
  const haloScale = 1.2 + (intensity - 1) * 0.3;
  return (
    <mesh position={[mark.coordinate3D.x, mark.coordinate3D.y, mark.coordinate3D.z]}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.4} transparent opacity={coreOpacity} />
      <mesh>
        <sphereGeometry args={[size * haloScale, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={haloOpacity} depthWrite={false} />
      </mesh>
    </mesh>
  );
}
function HumanMesh({
  onClickPoint,
  isInteractive,
}: {
  onClickPoint: (coord: Coordinate3D, faceIndex: number) => void;
  isInteractive: boolean;
}) {
  const { scene } = useGLTF("/human_body.glb");
  const [transform, setTransform] = useState({ scale: 1, position: [0, 0, 0] as [number, number, number] });
  const groupRef = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!scene) return;
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 3.5 / maxDim : 1;
    setTransform({
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale]
    });
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (!isInteractive) return;
      e.stopPropagation();
      onClickPoint(
        { x: e.point.x, y: e.point.y, z: e.point.z },
        e.faceIndex ?? 0
      );
    },
    [isInteractive, onClickPoint]
  );
  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <group position={transform.position} scale={transform.scale}>
        <primitive 
          object={scene} 
          onClick={handleClick}
          onPointerOver={() => {
             if (isInteractive) document.body.style.cursor = 'crosshair';
          }}
          onPointerOut={() => {
             if (isInteractive) document.body.style.cursor = 'auto';
          }}
        />
      </group>
    </group>
  );
}
useGLTF.preload("/human_body.glb");
function ReflexNodeMarker({ node }: { node: HighlightedNode }) {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      ringRef.current.scale.set(scale, scale, scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 - scale * 0.2;
    }
  });
  const position = new THREE.Vector3(
    node.coordinate3D.x,
    node.coordinate3D.y,
    node.coordinate3D.z
  );
  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#AFA406" transparent depthWrite={false} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#E8A900" />
      </mesh>
    </group>
  );
}
export interface HumanModelProps {
  selectedPainType: PainType | null;
  paintedPoints: PainMarkData[];
  onPaintPoint: (mark: PainMarkData) => void;
  isInteractive?: boolean;
  highlightedNodes?: HighlightedNode[];
}
export default function HumanModel({
  selectedPainType,
  paintedPoints,
  onPaintPoint,
  isInteractive = true,
  highlightedNodes = [],
}: HumanModelProps) {
  const handlePointClick = useCallback(
    (coord: Coordinate3D, faceIndex: number) => {
      if (!selectedPainType) return;
      onPaintPoint({
        coordinate3D: coord,
        painType: selectedPainType,
        intensity: 5,
        faceIndex,
      });
    },
    [selectedPainType, onPaintPoint]
  );
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "radial-gradient(circle at center, #FAFAF7 0%, #EFEFE2 100%)",
        overflow: "hidden",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        style={{ width: "100%", height: "100%", zIndex: 10 }}
        gl={{ antialias: true, alpha: false }}
      >
        <directionalLight
          position={[3, 4, 3]}
          intensity={1.2}
          color="#FFFBF0"
          castShadow
          shadow-mapSize={[2048, 2048]}
        >
          <orthographicCamera attach="shadow-camera" args={[-3, 3, 3, -3, 0.1, 12]} />
        </directionalLight>
        <directionalLight position={[-3, 2, -1]} intensity={0.4} color="#E0F0FF" />
        <directionalLight position={[0, 3, -4]} intensity={0.6} color="#E8A900" />
        <ambientLight intensity={0.4} />
        <Suspense fallback={null}>
          <group>
            <HumanMesh
              onClickPoint={handlePointClick}
              isInteractive={isInteractive}
            />
            {paintedPoints.map((mark, index) => (
              <PainDot key={`mark-${index}`} mark={mark} />
            ))}
            {highlightedNodes.map((node) => (
              <ReflexNodeMarker key={node.id} node={node} />
            ))}
          </group>
        </Suspense>
        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={0.3}
          scale={4.0}
          blur={2.5}
          color="#1F2937"
          frames={1}
        />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={!isInteractive}
          autoRotateSpeed={1.0}
        />
      </Canvas>
      {isInteractive && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(107, 105, 64, 0.9)",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 500,
            pointerEvents: "none",
            zIndex: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textAlign: "center",
          }}
        >
          Klik pada tubuh untuk menandai area nyeri - Drag untuk memutar
        </div>
      )}
    </div>
  );
}
