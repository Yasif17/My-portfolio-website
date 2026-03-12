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
      9: new THREE.Color("#22c55e"),
    }),
    [],
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;

    /* ---------------- ROTATION ---------------- */

    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += Math.sin(t * 0.6) * 0.0008;

    /* ---------------- SCROLL PROGRESS ---------------- */

    const progress =
      window.scrollY / (document.body.scrollHeight - window.innerHeight);

    const targetRotationY = progress * Math.PI;
    const targetRotationX = progress * Math.PI;
    const targetY = progress * 1.5 - 1;

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
      0.08,
    );

    meshRef.current.rotation.z = t * 0.08;
    meshRef.current.position.y += Math.sin(t) * 0.05;

    /* ---------------- POSITION ---------------- */

    if (isMobile) {
      meshRef.current.position.x = 0;
      meshRef.current.position.y = -0.3;
    } else {
      let targetX = 3.2;

      /* CONTACT SECTION FIX */
      if (sectionId === 9) targetX = 2.6;

      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetX,
        0.08,
      );
    }

    /* ---------------- SCALE ---------------- */

    const base = isMobile ? 0.62 : 0.92;
    const introMul = introDone ? 1 : 0.4;

    const sectionScale = {
      0: 0.8,
      1: 0.6,
      2: 0.65,
      3: 0.82,
      4: 1.18,
      5: 1.1,
      6: 0.5,
      7: 1.28,
      8: 1.08,
      9: 0.9, // smaller on contact so it frames the form
    };

    const sectionMul = sectionScale[sectionId] ?? 1;

    const targetScale = base * introMul * sectionMul;

    scaleRef.current = THREE.MathUtils.lerp(
      scaleRef.current,
      targetScale,
      0.08,
    );

    meshRef.current.scale.setScalar(scaleRef.current);

    /* ---------------- MOUSE PARALLAX ---------------- */

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    meshRef.current.rotation.x += my * 0.02;
    meshRef.current.rotation.y += mx * 0.02;

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

    /* ---------------- CAMERA DEPTH ---------------- */

    const depthMap = {
      0: 5.4,
      1: 6.3,
      2: 6.9,
      3: 6.6,
      4: 6.5,
      5: 6.4,
      6: 6.3,
      7: 5.9,
      8: 6.3,
      9: 5.8,
    };

    const targetZ = depthMap[sectionId] ?? 6;

    state.camera.position.z += (targetZ - state.camera.position.z) * 0.04;
    state.camera.lookAt(0, 0, 0);

    /* ---------------- EMISSIVE PULSE ---------------- */

    const baseIntensity = 0.25;
    const pulse = baseIntensity + Math.sin(t * 1.5) * 0.08;

    if (materialRef.current) materialRef.current.emissiveIntensity = pulse;

    /* ---------------- COLOR TRANSITION ---------------- */

    const targetColor = colors[sectionId] || colors[0];

    meshRef.current.material.color.lerp(targetColor, 0.05);
    meshRef.current.material.emissive.lerp(targetColor, 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry
        args={isMobile ? [1.8, 0.35, 12, 30] : [1.8, 0.35, 16, 50]}
      />

      <meshPhysicalMaterial
        ref={materialRef}
        color="#22c55e"
        metalness={0.9}
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
