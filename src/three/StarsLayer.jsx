// import { useFrame } from "@react-three/fiber";
// import { useMemo, useRef } from "react";

// export default function StarsLayer({ count = 1200, depth = 60, introDone, speed = 0.002 }) {
//   const pointsRef = useRef();
//   const positionsRef = useRef();

//   const positions = useMemo(() => {
//     const arr = new Float32Array(count * 3);
//     for (let i = 0; i < count; i++) {
//       arr[i * 3] = (Math.random() - 0.5) * 40;
//       arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
//       arr[i * 3 + 2] = -Math.random() * depth;
//     }
//     positionsRef.current = arr;
//     return arr;
//   }, [count, depth]);

//   useFrame(() => {
//     if (!pointsRef.current) return;

//     const pos = positionsRef.current;
//     for (let i = 0; i < pos.length; i += 3) {
//       pos[i + 2] += speed;
//       if (pos[i + 2] > 5) {
//         pos[i + 2] = -depth;
//         pos[i] = (Math.random() - 0.5) * 40;
//         pos[i + 1] = (Math.random() - 0.5) * 40;
//       }
//     }

//     pointsRef.current.geometry.attributes.position.needsUpdate = true;
//     pointsRef.current.geometry.computeBoundingSphere();
//   });

//   return (
//     <points ref={pointsRef}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           array={positions}
//           count={positions.length / 3}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.025}
//         color="#ffffff"
//         transparent
//         opacity={introDone ? 0.9 : 0}
//         depthWrite={false}
//       />
//     </points>
//   );
// }