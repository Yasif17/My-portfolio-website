// src/three/ScrollCube.jsx
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function ScrollCube({
  isMobile,
  introDone,
  sectionId,
  mouseRef,
}) {
  const meshRef = useRef();

  const materialRef = useRef();
  const scaleRef = useRef(0.6);
  const smoothScroll = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;

    // idle slow rotation
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += Math.sin(t * 0.6) * 0.0008;

    const rawProgress =
      window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // smooth mobile scroll momentum
    // smoothScroll.current = THREE.MathUtils.lerp(
    //   smoothScroll.current,
    //   rawProgress,
    //   0.08,
    // );

    smoothScroll.current = THREE.MathUtils.lerp(
      smoothScroll.current,
      rawProgress,
      isMobile ? 0.05 : 0.08,
    );

    const progress = smoothScroll.current;

    // 3D mouse tilt effect
    const mouseTiltX = state.mouse.y * 0.6;
    const mouseTiltY = state.mouse.x * 0.6;

    meshRef.current.rotation.x += mouseTiltX * 0.02;
    meshRef.current.rotation.y += mouseTiltY * 0.02;

    meshRef.current.position.x = isMobile ? 0 : 3.2;
    // meshRef.current.position.y = isMobile ? -1.8 : meshRef.current.position.y;

    // const targetRotationY = progress * Math.PI;
    // const targetRotationX = progress * Math.PI;
    // const targetY = progress * 1.5 - 1;

    const targetRotationY = progress * Math.PI;
    const targetRotationX = progress * Math.PI;

    const baseY = isMobile ? -1.8 : -1;
    const scrollRange = isMobile ? 1.2 : 1.5;
    const floatOffset =
      Math.sin(state.clock.elapsedTime * 0.5) * (isMobile ? 0.01 : 0.02);

    const targetY = baseY + progress * scrollRange + floatOffset;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotationY,
      0.08,
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotationX,
      0.08,
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      isMobile ? 0.05 : 0.08,
    );

    meshRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    //  meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.02;

    // ✅ smooth scale across sections (no double writes)
    const base = isMobile ? 0.62 : 0.92;
    const introMul = introDone ? 1 : 0.4;

    let sectionMul = 1.0;
    if (sectionId === 0) sectionMul = 0.8; // Projects
    if (sectionId === 1) sectionMul = 0.6; // Services
    if (sectionId === 2) sectionMul = 0.65; // Skills
    if (sectionId === 3) sectionMul = 0.82; // Projects
    if (sectionId === 4) sectionMul = 1.18; // Services
    if (sectionId === 5) sectionMul = 1.1; // Skills
    if (sectionId === 6) sectionMul = 0.5; // Projects
    if (sectionId === 7) sectionMul = 1.28; // Services
    if (sectionId === 8) sectionMul = 1.08; // Skills
    if (sectionId === 9) sectionMul = 1.0; // Contact

    const targetScale = base * introMul * sectionMul;
    scaleRef.current = THREE.MathUtils.lerp(
      scaleRef.current,
      targetScale,
      0.08,
    );
    meshRef.current.scale.setScalar(scaleRef.current);

    // camera micro-parallax
    // Smooth cinematic camera parallax
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // ring tilt
    meshRef.current.rotation.x += my * 0.02;
    meshRef.current.rotation.y += mx * 0.02;

    // camera parallax
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mx * 0.8,
      0.05,
    );

    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      my * 0.6,
      0.05,
    );

    // section-based camera depth
    let targetZ = 6;
    if (sectionId === 0) targetZ = 5.4;
    if (sectionId === 1) targetZ = 6.3;
    if (sectionId === 2) targetZ = 6.9;
    if (sectionId === 3) targetZ = 6.6;
    if (sectionId === 4) targetZ = 6.5;
    if (sectionId === 5) targetZ = 6.4;
    if (sectionId === 6) targetZ = 6.3;
    if (sectionId === 7) targetZ = 5.9;
    if (sectionId === 8) targetZ = 6.3;
    if (sectionId === 9) targetZ = 5.6;

    state.camera.position.z += (targetZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, 0, 0);

    // emissive pulse
    const baseIntensity = 0.25;
    const pulse =
      baseIntensity + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    if (materialRef.current) materialRef.current.emissiveIntensity = pulse;

    // color per section
    const targetColor = colors[sectionId] || colors[0];

    meshRef.current.material.color.lerp(targetColor, 0.05);
    meshRef.current.material.emissive.lerp(targetColor, 0.05);
  });

  const colors = useMemo(
    () => ({
      0: new THREE.Color("#ffffff"),
      1: new THREE.Color("#22c55e"),
      2: new THREE.Color("#ef4444"),
      3: new THREE.Color("#a855f7"),
      4: new THREE.Color("#f59e0b"),
      5: new THREE.Color("#16a34a"),
      6: new THREE.Color("#0000ff"),
      7: new THREE.Color("#008080"),
      8: new THREE.Color("#ffffff"),
    }),
    [],
  );

  return (
    <mesh ref={meshRef}>
      <torusGeometry
        args={isMobile ? [1.8, 0.35, 12, 30] : [1.8, 0.35, 18, 50]}
      />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#22c55e"
        metalness={1.2}
        roughness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.08}
        emissive="#14532d"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.99}
      />
    </mesh>
  );
}
