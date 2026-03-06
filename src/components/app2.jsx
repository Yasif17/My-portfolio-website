// import { Canvas, useFrame } from "@react-three/fiber";
// import { ScrollControls, Scroll, useScroll } from "@react-three/drei";
// import { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
// import * as THREE from "three";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";

// /* ================= PARTICLES ================= */

// function StarsLayer({ count = 800, depth = 10, introDone }) {
//   const pointsRef = useRef();

//   const positions = useMemo(() => {
//     const arr = new Float32Array(count * 3);
//     for (let i = 0; i < count; i++) {
//       arr[i * 3] = (Math.random() - 0.5) * 40;
//       arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
//       arr[i * 3 + 2] = -Math.random() * depth;
//     }
//     return arr;
//   }, [count, depth]);

//   useFrame((state) => {
//     if (!pointsRef.current) return;

//     // slow rotation (cheap)
//     pointsRef.current.rotation.y += 0.00025;

//     // subtle mouse parallax (cheap)
//     const { mouse } = state;
//     pointsRef.current.rotation.x += mouse.y * 0.0006;
//     pointsRef.current.rotation.y += mouse.x * 0.0006;

//     const t = state.clock.elapsedTime;
//     pointsRef.current.material.opacity = 0.55 + Math.sin(t * 0.5) * 0.04;
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

// function StarsParallax({ introDone, isMobile }) {
//   return (
//     <>
//       <StarsLayer
//         count={isMobile ? 400 : 1200}
//         depth={60}
//         introDone={introDone}
//       />
//       <StarsLayer
//         count={isMobile ? 600 : 1500}
//         depth={40}
//         introDone={introDone}
//       />
//       <StarsLayer
//         count={isMobile ? 500 : 1000}
//         depth={42}
//         introDone={introDone}
//       />
//     </>
//   );
// }

// /* ================= 3D RING ================= */

// function ScrollCube({ isMobile, introDone, sectionId }) {
//   const meshRef = useRef();
//   const scroll = useScroll();
//   const materialRef = useRef();
//   const scaleRef = useRef(0.6);

//   useFrame((state) => {
//     if (!meshRef.current) return;

//     const progress = scroll.offset;

//     meshRef.current.position.x = isMobile ? 0 : 3.2;
//     meshRef.current.position.y = isMobile ? -1.8 : meshRef.current.position.y;

//     const targetRotationY = progress * Math.PI;
//     const targetRotationX = progress * Math.PI;
//     const targetY = progress * 1.5 - 1;

//     meshRef.current.rotation.y = THREE.MathUtils.lerp(
//       meshRef.current.rotation.y,
//       targetRotationY,
//       0.08,
//     );
//     meshRef.current.rotation.x = THREE.MathUtils.lerp(
//       meshRef.current.rotation.x,
//       targetRotationX,
//       0.08,
//     );
//     meshRef.current.position.y = THREE.MathUtils.lerp(
//       meshRef.current.position.y,
//       targetY,
//       0.08,
//     );

//     meshRef.current.rotation.z = state.clock.elapsedTime * 0.08;
//     meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.05;

//     // ✅ smooth scale across sections (no double writes)
//     const base = isMobile ? 0.62 : 0.92;
//     const introMul = introDone ? 1 : 0.4;

//     let sectionMul = 1.0;
//     if (sectionId === 4) sectionMul = 1.12; // Projects
//     if (sectionId === 5) sectionMul = 1.18; // Services
//     if (sectionId === 6) sectionMul = 1.08; // Skills

//     const targetScale = base * introMul * sectionMul;
//     scaleRef.current = THREE.MathUtils.lerp(
//       scaleRef.current,
//       targetScale,
//       0.08,
//     );
//     meshRef.current.scale.setScalar(scaleRef.current);

//     // camera micro-parallax
//     const mouseX = state.mouse.x * 0.1;
//     const mouseY = state.mouse.y * 0.5;

//     state.camera.position.x = THREE.MathUtils.lerp(
//       state.camera.position.x,
//       mouseX + (progress * 2 - 1),
//       0.05,
//     );
//     state.camera.position.y = THREE.MathUtils.lerp(
//       state.camera.position.y,
//       mouseY,
//       0.05,
//     );

//     // section-based camera depth
//     let targetZ = 6;
//     if (sectionId === 0) targetZ = 5.4;
//     if (sectionId === 1) targetZ = 6.3;
//     if (sectionId === 2) targetZ = 6.9;
//     if (sectionId === 3) targetZ = 6.6;
//     if (sectionId === 4) targetZ = 6.5;
//     if (sectionId === 5) targetZ = 6.4;
//     if (sectionId === 6) targetZ = 6.3;
//     if (sectionId === 7) targetZ = 5.9;
//     if (sectionId === 8) targetZ = 6.3;
//     if (sectionId === 9) targetZ = 5.6;

//     state.camera.position.z += (targetZ - state.camera.position.z) * 0.04;
//     state.camera.lookAt(0, 0, 0);

//     // emissive pulse
//     const baseIntensity = 0.25;
//     const pulse =
//       baseIntensity + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
//     if (materialRef.current) materialRef.current.emissiveIntensity = pulse;

//     // color per section
//     let targetColor = new THREE.Color("#ffffff");
//     if (sectionId === 1) targetColor = new THREE.Color("#3b82f6");
//     if (sectionId === 2) targetColor = new THREE.Color("#22c55e");
//     if (sectionId === 3) targetColor = new THREE.Color("#ef4444");
//     if (sectionId === 4) targetColor = new THREE.Color("#a855f7");
//     if (sectionId === 5) targetColor = new THREE.Color("#f59e0b");
//     if (sectionId === 6) targetColor = new THREE.Color("#16a34a");
//     if (sectionId === 7) targetColor = new THREE.Color("#0000ff");
//     if (sectionId === 8) targetColor = new THREE.Color("#008080");
//     if (sectionId === 9) targetColor = new THREE.Color("#ffffff");

//     meshRef.current.material.color.lerp(targetColor, 0.05);
//     meshRef.current.material.emissive.lerp(targetColor, 0.05);
//   });

//   return (
//     <mesh ref={meshRef}>
//       <torusGeometry
//         args={isMobile ? [1.8, 0.35, 12, 30] : [1.8, 0.35, 16, 50]}
//       />
//       <meshPhysicalMaterial
//         ref={materialRef}
//         color="#22c55e"
//         metalness={0.9}
//         roughness={0.2}
//         clearcoat={1}
//         clearcoatRoughness={0.08}
//         emissive="#14532d"
//         emissiveIntensity={0.5}
//         wireframe
//         transparent
//         opacity={0.35}
//       />
//     </mesh>
//   );
// }

// /* ================= STYLES ================= */

// const sectionStyle = {
//   minHeight: "100dvh",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   paddingTop: "60px",
//   paddingBottom: "60px",
//   color: "white",
// };

// const heroTitle = (isMobile) => ({
//   fontSize: isMobile ? "clamp(1.8rem, 6vw, 2.4rem)" : "3.8rem",
//   fontWeight: 800,
//   letterSpacing: "-1.2px",
//   lineHeight: 1.2,
//   wordBreak: "break-word",
//   overflowWrap: "break-word",
//   maxWidth: "100%",
//   background: "linear-gradient(180deg, #ffffff, #9ca3af)",
//   WebkitBackgroundClip: "text",
//   WebkitTextFillColor: "transparent",
// });

// const heroSubtitle = {
//   fontSize: "clamp(0.95rem, 3vw, 1.2rem)",
//   marginTop: "1.2rem",
//   marginBottom: "1.2rem",
//   opacity: 0.8,
//   letterSpacing: "0.5px",
//   fontWeight: 500,
//   maxWidth: "100%",
//   wordBreak: "break-word",
// };

// const heroDesc = {
//   fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
//   marginBottom: "2rem",
//   opacity: 0.7,
//   maxWidth: "100%",
//   lineHeight: 1.6,
//   wordBreak: "break-word",
// };

// const sectionTitle = (isMobile) => ({
//   fontSize: isMobile ? "2.2rem" : "3.5rem",
//   marginBottom: isMobile ? "2rem" : "3.5rem",
//   letterSpacing: "-1.5px",
//   fontWeight: 800,
//   background: "linear-gradient(to bottom, #ffffff, #9ca3af)",
//   WebkitBackgroundClip: "text",
//   WebkitTextFillColor: "transparent",
//   textAlign: "center",
// });

// const paragraphStyle = {
//   fontSize: "1.2rem",
//   lineHeight: 1.6,
//   opacity: 0.85,
// };

// const primaryBtn = {
//   padding: "1rem 2.2rem",
//   background: "linear-gradient(135deg, #16a34a, #15803d)",
//   border: "none",
//   borderRadius: "18px",
//   color: "white",
//   fontSize: "1rem",
//   cursor: "pointer",
//   position: "relative",
//   overflow: "hidden",
//   transition: "transform 0.15s ease, box-shadow 0.2s ease",
//   boxShadow: "0 10px 30px rgba(34,197,94,0.25)",
// };

// const secondaryBtn = {
//   padding: "1rem 2.2rem",
//   background: "transparent",
//   border: "1px solid rgba(59,130,246,0.6)",
//   borderRadius: "18px",
//   color: "#3b82f6",
//   fontSize: "1rem",
//   cursor: "pointer",
//   transition: "transform 0.25s ease, box-shadow 0.25s ease",
// };

// /* ================= NAVBAR ================= */

// function Navbar({ active, scrollToPage, isMobile }) {
//   const [open, setOpen] = useState(false);

//   const links = [
//     { label: "Home", index: 0 },
//     { label: "About", index: 1.3 },
//     { label: "Projects", index: 2.8 },
//     { label: "Services", index: 4.14 },
//     { label: "Engineering", index: 5.45 },
//     { label: "System", index: 6.6 },
//     { label: "Skills", index: 7.6 },
//     { label: "Social", index: 8.57 },
//     { label: "Contact", index: 9.6 },
//   ];

//   return (
//     <>
//       {/* ================= MAIN NAVBAR ================= */}
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           height: "60px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: isMobile ? "0 1.5rem" : "0 clamp(1.5rem, 6vw, 6rem)",
//           background:
//             "linear-gradient(to bottom, rgba(2,6,23,0.85), rgba(2,6,23,0.6))",
//           backdropFilter: "blur(16px)",
//           borderBottom: "1px solid rgba(255,255,255,0.05)",
//           boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
//           zIndex: 1000,
//         }}
//       >
//         {/* LOGO */}
//         <div
//           style={{
//             fontWeight: 700,
//             fontSize: "1.1rem",
//             letterSpacing: "1px",
//           }}
//         >
//           Yasif
//         </div>

//         {/* DESKTOP NAV LINKS */}
//         {!isMobile && (
//           <div
//             style={{
//               position: "absolute",
//               left: "50%",
//               transform: "translateX(-50%)",
//               display: "flex",
//               gap: "2rem",
//             }}
//           >
//             {links.map((item) => {
//               const isActive = Math.abs(active - item.index) < 0.6;

//               return (
//                 <div
//                   key={item.index}
//                   onClick={() => scrollToPage(item.index)}
//                   style={{
//                     cursor: "pointer",
//                     fontSize: "0.95rem",
//                     padding: "6px 14px",
//                     borderRadius: "12px",
//                     color: isActive ? "#22c55e" : "rgba(255,255,255,0.6)",
//                     transition: "all 0.25s ease",
//                     boxShadow: isActive
//                       ? "0 0 18px rgba(34,197,94,0.5)"
//                       : "none",
//                   }}
//                 >
//                   {item.label}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* RIGHT SIDE */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "1rem",
//           }}
//         >
//           {/* DESKTOP RESUME */}
//           {!isMobile && (
//             <button
//               style={{
//                 padding: "0.6rem 1.4rem",
//                 borderRadius: "20px",
//                 border: "none",
//                 background: "linear-gradient(135deg,#16a34a,#15803d)",
//                 color: "white",
//                 cursor: "pointer",
//                 transition: "all 0.25s ease",
//                 boxShadow: "0 8px 25px rgba(34,197,94,0.25)",
//               }}
//             >
//               Resume
//             </button>
//           )}

//           {/* MOBILE HAMBURGER */}
//           {isMobile && (
//             <div
//               onClick={() => setOpen(!open)}
//               style={{
//                 width: "28px",
//                 height: "20px",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//                 cursor: "pointer",
//               }}
//             >
//               <span
//                 style={{
//                   height: "3px",
//                   background: "white",
//                   transition: "all 0.3s ease",
//                   transform: open ? "rotate(45deg) translateY(8px)" : "none",
//                 }}
//               />
//               <span
//                 style={{
//                   height: "3px",
//                   background: "white",
//                   opacity: open ? 0 : 1,
//                   transition: "all 0.3s ease",
//                 }}
//               />
//               <span
//                 style={{
//                   height: "3px",
//                   background: "white",
//                   transition: "all 0.3s ease",
//                   transform: open ? "rotate(-45deg) translateY(-8px)" : "none",
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ================= MOBILE MENU ================= */}
//       {isMobile && (
//         <div
//           style={{
//             position: "fixed",
//             top: "60px",
//             left: 0,
//             right: 0,
//             background: "rgba(2,6,23,0.98)",
//             backdropFilter: "blur(20px)",
//             padding: "2rem",
//             display: "flex",
//             flexDirection: "column",
//             gap: "1.5rem",
//             zIndex: 1500,
//             transform: open ? "translateY(0)" : "translateY(-20px)",
//             opacity: open ? 1 : 0,
//             pointerEvents: open ? "auto" : "none",
//             transition: "all 0.3s ease",
//           }}
//         >
//           {links.map((item) => (
//             <div
//               key={item.index}
//               onClick={() => {
//                 scrollToPage(item.index);
//                 setOpen(false);
//               }}
//               style={{
//                 fontSize: "1.1rem",
//                 color: "white",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//               }}
//             >
//               {item.label}
//             </div>
//           ))}

//           {/* Resume inside mobile menu */}
//           <button
//             style={{
//               marginTop: "1rem",
//               padding: "0.8rem 1.4rem",
//               borderRadius: "20px",
//               border: "none",
//               background: "linear-gradient(135deg,#16a34a,#15803d)",
//               color: "white",
//               cursor: "pointer",
//             }}
//           >
//             Resume
//           </button>
//         </div>
//       )}
//     </>
//   );
// }

// /* ================= PROGRESS BAR ================= */

// function ScrollProgress({ scrollEl }) {
//   const ref = useRef();

//   useEffect(() => {
//     if (!scrollEl) return;

//     const onScroll = () => {
//       const progress =
//         scrollEl.scrollTop / (scrollEl.scrollHeight - scrollEl.clientHeight);
//       if (ref.current) ref.current.style.width = `${progress * 100}%`;
//     };

//     onScroll();
//     scrollEl.addEventListener("scroll", onScroll, { passive: true });
//     return () => scrollEl.removeEventListener("scroll", onScroll);
//   }, [scrollEl]);

//   return (
//     <div
//       ref={ref}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         height: "3px",
//         width: "0%",
//         background: "linear-gradient(90deg, #dc2626, #ef4444)",
//         zIndex: 4000,
//         pointerEvents: "none",
//         transition: "width 0.08s linear",
//       }}
//     />
//   );
// }

// function SectionDivider() {
//   return (
//     <div
//       style={{
//         width: "60%",
//         height: "1px",
//         margin: "0 auto",
//         marginTop: "8rem",
//         background:
//           "linear-gradient(90deg, transparent, rgba(34,197,94,0.6), transparent)",
//         boxShadow: "0 0 20px rgba(34,197,94,0.4)",
//         opacity: 0.8,
//       }}
//     />
//   );
// }

// // 🔥 ADD HERE (above App function)
// function SkillsDock({ items }) {
//   const [mouseX, setMouseX] = useState(null);

//   return (
//     <div
//       onMouseMove={(e) => setMouseX(e.clientX)}
//       onMouseLeave={() => setMouseX(null)}
//       style={{
//         background: "rgba(255,255,255,0.06)",
//         backdropFilter: "blur(20px)",
//         borderRadius: "28px",
//         padding: "1.2rem 2rem",
//         display: "flex",
//         gap: "2rem",
//         alignItems: "flex-end",
//         boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
//         border: "1px solid rgba(255,255,255,0.08)",
//         overflow: "visible",
//         position: "relative",
//       }}
//     >
//       {items.map((item, index) => (
//         <DockItem key={index} item={item} mouseX={mouseX} />
//       ))}
//     </div>
//   );
// }
// function DockItem({ item, mouseX }) {
//   const ref = useRef(null);
//   const [scale, setScale] = useState(1);
//   const [hovered, setHovered] = useState(false);

//   useEffect(() => {
//     if (!ref.current || mouseX === null) {
//       setScale(1);
//       return;
//     }

//     const rect = ref.current.getBoundingClientRect();
//     const center = rect.left + rect.width / 2;

//     const distance = Math.abs(mouseX - center);
//     const maxDistance = 120;

//     if (distance > maxDistance) {
//       setScale(1);
//       return;
//     }

//     // smoother curve (less aggressive)
//     const influence = 1 - distance / maxDistance;
//     const newScale = 1 + influence * 0.6;

//     setScale(newScale);
//   }, [mouseX]);

//   return (
//     <div
//       ref={ref}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
//       style={{
//         position: "relative",
//         transform: `translateY(${hovered ? "-6px" : "0px"}) scale(${scale})`,
//         transition: "transform 0.25s cubic-bezier(.22,1,.36,1)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: "64px",
//         height: "64px",
//         cursor: "pointer",
//       }}
//     >
//       {/* Glow ring */}
//       <div
//         style={{
//           position: "absolute",
//           width: "56px",
//           height: "56px",
//           borderRadius: "50%",
//           background: hovered
//             ? "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)"
//             : "transparent",
//           transition: "all 0.3s ease",
//         }}
//       />

//       {/* Icon */}
//       <img
//         src={item.icon}
//         alt={item.label}
//         style={{
//           width: "40px",
//           height: "40px",
//           objectFit: "contain",
//           pointerEvents: "none",
//           transition: "filter 0.25s ease",
//           filter: hovered ? "brightness(1.25)" : "brightness(1)",
//         }}
//       />

//       {/* Label (absolute below, not affecting layout) */}
//       <div
//         style={{
//           position: "absolute",
//           top: "100%",
//           marginTop: "8px",
//           fontSize: "0.7rem",
//           fontWeight: "500",
//           color: "rgba(255,255,255,0.9)",
//           whiteSpace: "nowrap",
//           opacity: hovered ? 1 : 0,
//           transform: hovered ? "translateY(0px)" : "translateY(8px)",
//           transition: "all 0.25s ease",
//           pointerEvents: "none",
//         }}
//       >
//         {item.label}
//       </div>
//     </div>
//   );
// }

// function useInView(threshold = 0.4, root = null) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (!ref.current) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) setVisible(true);
//       },
//       { threshold, root }, // ✅ key change
//     );

//     observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [threshold, root]);

//   return [ref, visible];
// }

// /* ================= APP ================= */

// export default function App() {
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 900);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // const [isMobile, setIsMobile] = useState(false);
//   const [showCert, setShowCert] = useState(false);

//   const pages = 10.6; // total sections (including fractional for smoother nav)
//   const [sectionId, setSectionId] = useState(0);

//   const [active, setActive] = useState(0);
//   const [scrollEl, setScrollEl] = useState(null);

//   useEffect(() => {
//     const timer = setTimeout(() => setIntroDone(true), 1200);
//     return () => clearTimeout(timer);
//   }, []);

//   const scrollToPage = useCallback(
//     (pageIndex) => {
//       if (!scrollEl) return;
//       const totalScrollableHeight =
//         scrollEl.scrollHeight - scrollEl.clientHeight;
//       const targetScroll = (pageIndex / (pages - 1)) * totalScrollableHeight;
//       scrollEl.scrollTo({ top: targetScroll, behavior: "smooth" });
//     },
//     [scrollEl, pages],
//   );

//   const [introDone, setIntroDone] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIntroDone(true);
//     }, 1200);

//     return () => clearTimeout(timer);
//   }, []);

//   const cursorRef = useRef();
//   const cursorDotRef = useRef();

//   useEffect(() => {
//     let mouseX = 0;
//     let mouseY = 0;
//     let posX = 0;
//     let posY = 0;

//     const move = (e) => {
//       mouseX = e.clientX;
//       mouseY = e.clientY;
//     };

//     window.addEventListener("mousemove", move);

//     const animate = () => {
//       posX += (mouseX - posX) * 0.15;
//       posY += (mouseY - posY) * 0.15;

//       if (cursorRef.current) {
//         cursorRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
//       }

//       if (cursorDotRef.current) {
//         cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
//       }

//       requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener("mousemove", move);
//     };
//   }, []);

//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//     @keyframes floatSlow {
//       0% { transform: translateY(0px); }
//       50% { transform: translateY(-10px); }
//       100% { transform: translateY(0px); }
//     }
//   `;
//     document.head.appendChild(style);

//     return () => document.head.removeChild(style);
//   }, []);

//   return (
//     <div
//       style={{
//         width: "100%",
//         minHeight: "100vh",
//         overflowX: "hidden",
//         position: "relative",
//         background: "#020617",
//       }}
//     >
//       <Navbar active={active} scrollToPage={scrollToPage} isMobile={isMobile} />
//       <ScrollProgress scrollEl={scrollEl} />

//       {/* ✅ Radial Glow Layer */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           pointerEvents: "none",
//           background: `
//           radial-gradient(
//             circle at 75% 50%,
//             rgba(37,99,235,0.15),
//             rgba(2,6,23,0.9) 45%
//           )
//         `,
//           zIndex: 0,
//         }}
//       />

//       <div
//         ref={cursorDotRef}
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "6px",
//           height: "6px",
//           background: "#22c55e",
//           borderRadius: "50%",
//           pointerEvents: "none",
//           transform: "translate(-50%, -50%)",
//           zIndex: 5001,
//         }}
//       />

//       {/* ✅ Canvas ABOVE gradient */}
//       <div
//         style={{
//           position: "fixed",
//           inset: 0,
//           pointerEvents: "none",
//           background:
//             "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.6))",
//           zIndex: 2,
//         }}
//       />
//       <Canvas
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           zIndex: 0,
//           width: "100%",
//           height: "100%",
//         }}
//         camera={{ position: [0, 0, 6], fov: 50 }}
//         dpr={isMobile ? 1 : [1, 1.3]}
//         gl={{ antialias: false }}
//         performance={{ min: 0.6 }}
//       >
//         <color attach="background" args={["#000000"]} />
//         <fog attach="fog" args={["#000000", 10, 20]} />

//         <ambientLight intensity={0.25} />
//         <directionalLight position={[5, 5, 5]} intensity={1.1} />
//         <pointLight position={[-4, 2, -3]} intensity={1.8} color="#22c55e" />
//         <pointLight position={[4, -2, 2]} intensity={0.6} color="#22c55e" />

//         <EffectComposer multisampling={0}>
//           <Bloom
//             intensity={0.5}
//             luminanceThreshold={0.6}
//             luminanceSmoothing={0.9}
//             mipmapBlur
//           />
//         </EffectComposer>

//         <StarsParallax introDone={introDone} isMobile={isMobile} />

//         <ScrollControls pages={pages} damping={isMobile ? 0.05 : 0.15}>
//           <ScrollCube
//             isMobile={isMobile}
//             introDone={introDone}
//             sectionId={sectionId}
//           />
//           <HtmlSections
//             pages={pages}
//             setScrollEl={setScrollEl}
//             isMobile={isMobile}
//             introDone={introDone}
//             setActive={setActive}
//             setSectionId={setSectionId}
//             scrollToPage={scrollToPage}
//           />
//         </ScrollControls>
//       </Canvas>

//       {/* ✅ CERTIFICATE MODAL — ADD HERE */}
//       {showCert && (
//         <div
//           onClick={() => setShowCert(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.8)",
//             backdropFilter: "blur(10px)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 5000, // above everything
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "80%",
//               maxWidth: "800px",
//               borderRadius: "18px",
//               overflow: "hidden",
//               background: "#000",
//               border: "1px solid rgba(255,255,255,0.1)",
//               boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
//             }}
//           >
//             <img
//               src="/mca-certificate.jpg"
//               alt="MCA Certificate"
//               style={{ width: "100%", display: "block" }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   function Reveal({ children, delay = 0 }) {
//     const ref = useRef();
//     const [visible, setVisible] = useState(false);
//     const hasAnimated = useRef(false);

//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting && !hasAnimated.current) {
//             setVisible(true);
//             hasAnimated.current = true;
//           }
//         },
//         { threshold: 0.2 },
//       );

//       if (ref.current) observer.observe(ref.current);

//       return () => observer.disconnect();
//     }, []);

//     return (
//       <div
//         ref={ref}
//         style={{
//           opacity: visible ? 1 : 0,
//           transform: visible ? "translateY(0px)" : "translateY(50px)",
//           transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
//           willChange: "opacity, transform",
//         }}
//       >
//         {children}
//       </div>
//     );
//   }

//   /* ================= HTML SECTIONS ================= */

//   function HtmlSections({
//     pages,
//     setScrollEl,
//     isMobile,
//     introDone,
//     setActive,
//     setSectionId,
//     scrollToPage,
//   }) {
//     const scroll = useScroll();
//     const [aboutRef, aboutVisible] = useInView(0.5, scroll?.el);

//     const [aboutTriggered, setAboutTriggered] = useState(false);

//     // ✅ anchors = your nav positions
//     const anchors = useMemo(
//       () => [0, 1.1, 2.7, 3.9, 5.1, 5.9, 6.3, 7.4, 8.6, 9.6],
//       [],
//     );

//     // ✅ stable: set scrollEl once
//     useEffect(() => {
//       if (scroll?.el) setScrollEl(scroll.el);
//     }, [scroll, setScrollEl]);

//     // ✅ single active tracker (no fighting, no “structure” pop)
//     const lastId = useRef(-1);
//     const lastNav = useRef(-999);

//     useFrame(() => {
//       const pos = scroll.offset * (pages - 1); // continuous

//       let nearestIdx = 0;
//       let best = Infinity;

//       for (let i = 0; i < anchors.length; i++) {
//         const d = Math.abs(pos - anchors[i]);
//         if (d < best) {
//           best = d;
//           nearestIdx = i;
//         }
//       }

//       const navValue = anchors[nearestIdx];

//       if (nearestIdx !== lastId.current) {
//         lastId.current = nearestIdx;
//         setSectionId(nearestIdx); // integer section id for 3D ring
//       }

//       if (navValue !== lastNav.current) {
//         lastNav.current = navValue;
//         setActive(navValue); // float nav highlight
//       }
//     });

//     useEffect(() => {
//       if (sectionId === 1 && !aboutTriggered) {
//         setAboutTriggered(true);
//       }
//     }, [sectionId, aboutTriggered]);

//     const isAboutActive = aboutTriggered;
//     return (
//       <Scroll html>
//         <div
//           ref={lastId}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             height: "3px",
//             width: "100%",
//             transform: "scaleX(0)",
//             transformOrigin: "0 0",
//             background: "linear-gradient(90deg, #22c55e, #3b82f6)",
//             zIndex: 999999,
//             pointerEvents: "none",
//           }}
//         />
//         {/* HERO */}
//         <div
//           style={{
//             position: "relative",
//             zIndex: 2,
//             width: "100%",
//             maxWidth: "100vw",
//             overflowX: "hidden",
//             boxSizing: "border-box",
//           }}
//         >
//           <section
//             style={{
//               ...sectionStyle,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//               paddingTop: "10px",
//               opacity: introDone ? 1 : 0,
//               transition: "opacity 1s ease",
//               position: "relative",
//               marginTop: "100px",
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 width: "600px",
//                 height: "600px",
//                 background:
//                   "radial-gradient(circle, rgba(252, 252, 252, 0.4), transparent 70%)",
//                 filter: "blur(100px)",
//                 zIndex: -1,
//                 top: "-150px",
//                 left: "-200px",
//               }}
//             />
//             <div
//               style={{
//                 width: "100%",
//                 maxWidth: "1100px",
//                 margin: "0 auto",
//                 padding: "0 1.5rem",
//                 textAlign: isMobile ? "center" : "left",
//                 opacity: isMobile ? 1 : introDone ? 1 : 0,
//                 transform: isMobile
//                   ? "none"
//                   : introDone
//                     ? "translateY(0px)"
//                     : "translateY(20px)",
//                 transition: isMobile ? "none" : "all 1.2s ease",
//                 boxSizing: "border-box",
//               }}
//             >
//               <Reveal delay={0}>
//                 <h1
//                   style={{
//                     ...heroTitle(isMobile),
//                     maxWidth: isMobile ? "100%" : "750px",
//                     borderBottom: "1px solid rgba(255,255,255,0.08)",
//                     paddingBottom: "2rem",
//                   }}
//                 >
//                   Building Secure & Scalable Backend Systems
//                 </h1>
//               </Reveal>

//               <Reveal delay={150}>
//                 <p style={heroSubtitle}>
//                   Java • Spring Boot • REST APIs • Authentication • Cloud
//                   Deployment
//                 </p>
//               </Reveal>

//               <Reveal delay={300}>
//                 <p style={heroDesc}>
//                   Backend engineer focused on clean architecture, secure
//                   authentication, and production-ready API systems designed for
//                   scalability and reliability.
//                 </p>
//               </Reveal>

//               <Reveal delay={450}>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: isMobile ? "column" : "row",
//                     gap: "1.5rem",
//                     marginTop: "1.5rem",
//                     alignItems: isMobile ? "center" : "flex-start",
//                   }}
//                 >
//                   <button
//                     style={primaryBtn}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform =
//                         "translateY(-4px) scale(1.03)";
//                       e.currentTarget.style.boxShadow =
//                         "0 20px 40px rgba(34,197,94,0.4)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform =
//                         "translateY(0px) scale(1)";
//                       e.currentTarget.style.boxShadow =
//                         "0 10px 30px rgba(34,197,94,0.25)";
//                     }}
//                     onMouseDown={(e) => {
//                       e.currentTarget.style.transform =
//                         "translateY(2px) scale(0.98)";
//                     }}
//                     onMouseUp={(e) => {
//                       e.currentTarget.style.transform =
//                         "translateY(-4px) scale(1.03)";
//                     }}
//                   >
//                     View Projects
//                   </button>

//                   <button
//                     style={secondaryBtn}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.transform = "translateY(-4px)")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.transform = "translateY(0px)")
//                     }
//                   >
//                     Contact Me
//                   </button>
//                 </div>
//               </Reveal>
//             </div>
//             <SectionDivider />
//           </section>

//           {/* ABOUT SECTION */}
//           <section
//             style={{
//               ...sectionStyle,
//               minHeight: "100vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: isMobile ? "0 2rem" : "0 6rem",
//               position: "relative",
//               marginTop: "100px",
//             }}
//           >
//             {/* Parallax Wrapper (NOT section) */}
//             <div
//               ref={aboutRef}
//               onMouseMove={(e) => {
//                 if (isMobile) return;
//                 const x = (e.clientX / window.innerWidth - 0.5) * 5;
//                 const y = (e.clientY / window.innerHeight - 0.5) * 8;
//                 e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translate(0px, 0px)";
//               }}
//               style={{
//                 width: "100%",
//                 maxWidth: "1500px",
//                 display: "grid",
//                 gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
//                 gap: "6rem",
//                 alignItems: "center",
//                 transition: "transform 0.25s ease-out",
//                 willChange: "transform",
//                 transform: "translateZ(0)",
//                 position: "relative",
//                 zIndex: 2,
//               }}
//             >
//               {/* LEFT COLUMN */}
//               <div>
//                 <Reveal delay={0}>
//                   <h2 style={{ ...sectionTitle(isMobile), textAlign: "left" }}>
//                     About Me
//                   </h2>
//                 </Reveal>

//                 <Reveal delay={150}>
//                   <p style={{ ...paragraphStyle, maxWidth: "650px" }}>
//                     Backend-focused Computer Science engineer specializing in
//                     scalable system architecture, secure authentication
//                     workflows, and production-grade API systems.
//                   </p>
//                 </Reveal>

//                 {/* EDUCATION */}
//                 <Reveal delay={300}>
//                   <div
//                     onClick={() => setShowCert(true)}
//                     style={{
//                       marginTop: "3rem",
//                       position: "relative",
//                       cursor: "pointer",
//                       marginBottom: "9rem",
//                     }}
//                   >
//                     {/* Vertical Line */}
//                     <div
//                       style={{
//                         position: "absolute",
//                         left: "10px",
//                         top: 0,
//                         bottom: 0,
//                         width: "2px",
//                         background:
//                           "linear-gradient(to bottom, #22c55e, transparent)",
//                         boxShadow: "0 0 14px rgba(34,197,94,0.7)",
//                       }}
//                     />

//                     {/* Card */}
//                     <div
//                       style={{
//                         marginLeft: "40px",
//                         padding: "1.8rem",
//                         borderRadius: "18px",
//                         background: "rgba(255,255,255,0.05)",
//                         border: "1px solid rgba(255,255,255,0.08)",
//                         backdropFilter: "blur(14px)",
//                         transition: "all 0.3s ease",
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.transform = "translateY(-6px)";
//                         e.currentTarget.style.boxShadow =
//                           "0 20px 50px rgba(34,197,94,0.2)";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = "translateY(0)";
//                         e.currentTarget.style.boxShadow = "none";
//                       }}
//                     >
//                       <h4>Master of Computer Applications (2022)</h4>
//                       <p style={{ opacity: 0.85 }}>2752 / 3500 • CGPA: 7.86+</p>
//                       <p style={{ marginTop: "0.8rem", opacity: 0.7 }}>
//                         Specialized in backend systems, scalable architecture,
//                         database optimization, and secure API engineering.
//                       </p>
//                     </div>
//                   </div>
//                 </Reveal>
//               </div>

//               {/* RIGHT COLUMN */}
//               <div>
//                 {/* CORE STRENGTH */}

//                 <h3 style={{ marginBottom: "2rem" }}>Core Strength</h3>

//                 {[
//                   { label: "Java & Spring Boot", value: 90 },
//                   { label: "Authentication & Security", value: 85 },
//                   { label: "Database Optimization", value: 80 },
//                   { label: "Cloud Deployment (AWS)", value: 75 },
//                 ].map((item, i) => (
//                   <div key={i} style={{ marginBottom: "2rem" }}>
//                     {/* Label */}
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: "8px",
//                         fontSize: "1rem",
//                         fontWeight: 500,
//                         opacity: 0.9,
//                       }}
//                     >
//                       <span>{item.label}</span>
//                       <span style={{ color: "#22c55e" }}>{item.value}%</span>
//                     </div>

//                     {/* Track */}
//                     <div
//                       style={{
//                         height: "5px",
//                         borderRadius: "20px",
//                         background: "rgba(255,255,255,0.08)",
//                         overflow: "hidden",
//                         position: "relative",
//                       }}
//                     >
//                       {/* Fill */}
//                       <div
//                         style={{
//                           height: "100%",
//                           width: isAboutActive ? `${item.value}%` : "0%",
//                           borderRadius: "20px",
//                           background: "white",
//                           boxShadow: "0 0 18px rgba(34,197,94,0.6)",
//                           transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${i * 250}ms`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}

//                 {/* TOOLS & TECHNOLOGIES */}
//                 <Reveal delay={650}>
//                   <div style={{ marginTop: "3rem" }}>
//                     <h3 style={{ marginBottom: "1.5rem" }}>
//                       Tools & Technologies Used
//                     </h3>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexWrap: "wrap",
//                         gap: "1rem",
//                       }}
//                     >
//                       {[
//                         "React",
//                         "React Three Fiber",
//                         "Three.js",
//                         "Drei",
//                         "JavaScript (ES6+)",
//                         "CSS3",
//                         "Vite",
//                         "AWS Deployment",
//                       ].map((tech, i) => (
//                         <div
//                           key={i}
//                           style={{
//                             padding: "0.7rem 1.3rem",
//                             borderRadius: "22px",
//                             background: "rgba(34,197,94,0.12)",
//                             border: "1px solid rgba(34,197,94,0.4)",
//                             fontSize: "0.9rem",
//                             color: "#22c55e",
//                             transition: "all 0.3s ease",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.transform =
//                               "translateY(-4px)";
//                             e.currentTarget.style.boxShadow =
//                               "0 10px 25px rgba(34,197,94,0.25)";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.transform = "translateY(0)";
//                             e.currentTarget.style.boxShadow = "none";
//                           }}
//                         >
//                           {tech}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </Reveal>
//               </div>
//             </div>

//             <SectionDivider />
//           </section>

//           {/* PROJECTS — OPTIMIZED & SCALABLE */}
//           <section
//             className="cv-auto"
//             style={{
//               ...sectionStyle,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//               marginTop: "100px",
//             }}
//           >
//             <div
//               style={{
//                 maxWidth: "1300px",
//                 width: "100%",
//                 padding: isMobile ? "0 1.5rem" : "0 4rem",
//               }}
//             >
//               <Reveal delay={0}>
//                 <h2 style={sectionTitle(isMobile)}>Featured Projects</h2>{" "}
//               </Reveal>

//               <Reveal delay={150}>
//                 <p
//                   style={{
//                     ...paragraphStyle,
//                     maxWidth: "700px",
//                     marginTop: isMobile ? "0px" : "-1rem",
//                     opacity: 0.75,
//                   }}
//                 >
//                   Showcasing secure backend systems and scalable architectures
//                   built with Java, Spring Boot and cloud deployment.
//                 </p>
//               </Reveal>
//               <Reveal delay={300}>
//                 <div className="projects-grid">
//                   {/* ================= CAB BOOKING ================= */}
//                   <div className="project-card-optimized">
//                     <div className="project-glow" />
//                     <h3>Cab Booking System</h3>

//                     <p className="project-desc">
//                       Secure ride booking backend with JWT authentication,
//                       refresh tokens, RBAC, audit logging and production-grade
//                       exception handling.
//                     </p>

//                     <div className="project-badges">
//                       <span>Spring Boot</span>
//                       <span>JWT</span>
//                       <span>PostgreSQL</span>
//                       <span>RBAC</span>
//                     </div>

//                     <div className="project-buttons">
//                       <button style={secondaryBtn}>GitHub</button>
//                       <button style={primaryBtn}>Live API</button>
//                     </div>
//                   </div>

//                   {/* ================= MICROSERVICES PLATFORM ================= */}
//                   <div className="project-card-optimized">
//                     <div className="project-glow" />
//                     <h3>Microservices Job Platform</h3>

//                     <p className="project-desc">
//                       Enterprise microservices architecture using Spring Boot,
//                       Kafka, Eureka, Docker and Kubernetes (Minikube) with 6
//                       services and distributed databases.
//                     </p>

//                     <div className="project-badges">
//                       <span>Spring Cloud</span>
//                       <span>Kafka</span>
//                       <span>Kubernetes</span>
//                       <span>Neo4j</span>
//                     </div>

//                     <div className="project-buttons">
//                       <button style={secondaryBtn}>Architecture</button>
//                       <button style={primaryBtn}>GitHub</button>
//                     </div>
//                   </div>

//                   {/* ================= 3D PORTFOLIO FRAMEWORK ================= */}
//                   <div className="project-card-optimized">
//                     <div className="project-glow" />
//                     <h3>3D Portfolio Framework (Reusable)</h3>

//                     <p className="project-desc">
//                       High-performance React Three Fiber portfolio template with
//                       scroll- controlled 3D interactions, modular architecture
//                       and optimized rendering pipeline.
//                     </p>

//                     <div className="project-badges">
//                       <span>React</span>
//                       <span>Three.js</span>
//                       <span>R3F</span>
//                       <span>Performance</span>
//                     </div>

//                     <div className="project-buttons">
//                       <button style={primaryBtn}>Get Source Code</button>
//                     </div>
//                   </div>
//                 </div>{" "}
//               </Reveal>
//             </div>

//             <SectionDivider />
//           </section>

//           {/* PROFESSIONAL SERVICES */}
//           <ServicesSection
//             isMobile={isMobile}
//             sectionStyle={sectionStyle}
//             sectionTitle={sectionTitle}
//             paragraphStyle={paragraphStyle}
//             primaryBtn={primaryBtn}
//             secondaryBtn={secondaryBtn}
//             scrollToPage={scrollToPage}
//             Reveal={Reveal}
//             SectionDivider={SectionDivider}
//           />

//           {/* ENGINEERING EXPERTISE */}
//           <section
//             className="cv-auto"
//             style={{
//               ...sectionStyle,
//               // height: "100vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//               marginTop: "100px",
//             }}
//           >
//             <div
//               style={{
//                 maxWidth: "1100px",
//                 width: "100%",
//                 padding: isMobile ? "0 1.5rem" : "0 4rem",
//               }}
//             >
//               <Reveal delay={0}>
//                 <h2 style={sectionTitle(isMobile)}>
//                   Engineering Expertise
//                 </h2>{" "}
//               </Reveal>

//               <Reveal delay={150}>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
//                     gap: "2rem",
//                     marginTop: "2rem",
//                   }}
//                 >
//                   {[
//                     {
//                       title: "Authentication Architecture",
//                       desc: "JWT, Refresh Tokens, Token Blacklisting, RBAC Implementation",
//                     },
//                     {
//                       title: "Security & Monitoring",
//                       desc: "Account Lock Mechanism, Audit Logs, Suspicious Activity Alerts",
//                     },
//                     {
//                       title: "API Design",
//                       desc: "RESTful Architecture, Validation, Exception Handling Strategy",
//                     },
//                     {
//                       title: "Deployment & DevOps",
//                       desc: "Dockerized Services, AWS EC2 & RDS, CI/CD Pipeline Integration",
//                     },
//                   ].map((item, index) => (
//                     <div key={index} className="eng-card">
//                       <div className="shine" />
//                       <h3 style={{ marginBottom: "1rem" }}>{item.title}</h3>
//                       <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
//                         {item.desc}
//                       </p>
//                     </div>
//                   ))}
//                 </div>{" "}
//               </Reveal>
//             </div>
//             <SectionDivider />
//           </section>

//           {/* SYSTEM CAPABILITIES */}
//           <section
//             style={{
//               ...sectionStyle,
//               // height: "100vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//               marginTop: isMobile ? "0px" : "-50px",
//             }}
//           >
//             <div
//               style={{ maxWidth: "900px", width: "100%", padding: "0 2rem" }}
//             >
//               <h2 style={sectionTitle(isMobile)}>System Capabilities</h2>

//               <div
//                 style={{
//                   marginTop: "2rem",
//                   padding: "2rem",
//                   borderRadius: "18px",
//                   background: "rgba(0,0,0,0.6)",
//                   border: "1px solid rgba(255,255,255,0.08)",
//                   boxShadow: "0 0 40px rgba(34,197,94,0.15)",
//                   fontFamily: "monospace",
//                 }}
//               >
//                 {[
//                   "JWT Authentication Service — ACTIVE",
//                   "RBAC Authorization Engine — ACTIVE",
//                   "Audit Logging System — MONITORING",
//                   "Account Lock Mechanism — RUNNING",
//                   "AWS EC2 Deployment — STABLE",
//                 ].map((item, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       marginBottom: "0.8rem",
//                       color: "#22c55e",
//                       letterSpacing: "0.5px",
//                       animation: `fadeInUp 0.6s ease ${index * 0.2}s both`,
//                     }}
//                   >
//                     <span style={{ opacity: 0.5 }}>[✔]</span> {item}
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <SectionDivider />
//           </section>

//           {/* SKILLS */}
//           <section
//             style={{
//               ...sectionStyle,
//               // height: "100vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//               marginTop: isMobile ? "0px" : "-150px",
//             }}
//           >
//             <div>
//               <h2 style={{ ...sectionTitle(isMobile), marginBottom: "2rem" }}>
//                 Core Technologies
//               </h2>
//               <p
//                 style={{
//                   ...paragraphStyle,
//                   // marginTop: "0rem",
//                   textAlign: "center",
//                   opacity: 0.7,
//                 }}
//               >
//                 Secure backend engineering toolkit — production-ready patterns,
//                 cloud deployment, and scalable architecture.
//               </p>
//               <div
//                 style={{
//                   marginTop: "2.5rem",
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 <SkillsDock
//                   isMobile={isMobile}
//                   items={[
//                     {
//                       label: "Java",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
//                       url: "https://docs.oracle.com/en/java/",
//                     },
//                     {
//                       label: "Spring Boot",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
//                       url: "https://docs.spring.io/spring-boot/docs/current/reference/html/",
//                     },
//                     {
//                       label: "JWT",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg",
//                       url: "https://jwt.io/introduction",
//                     },
//                     {
//                       label: "PostgreSQL",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
//                       url: "https://www.postgresql.org/docs/",
//                     },
//                     {
//                       label: "Docker",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
//                       url: "https://docs.docker.com/",
//                     },
//                     {
//                       label: "AWS",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
//                       url: "https://docs.aws.amazon.com/",
//                     },
//                     {
//                       label: "Hibernate",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hibernate/hibernate-original.svg",
//                       url: "https://docs.jboss.org/hibernate/orm/current/userguide/html_single/",
//                     },
//                     {
//                       label: "REST APIs",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg",
//                       url: "https://swagger.io/docs/",
//                     },
//                     {
//                       label: "System Design",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
//                       url: "https://martinfowler.com/architecture/",
//                     },
//                   ]}
//                 />
//               </div>
//             </div>
//             <SectionDivider />
//           </section>

//           {/* SOCIAL */}
//           <section
//             style={{
//               ...sectionStyle,
//               // height: "100vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//               marginTop: isMobile ? "0px" : "-100px",
//             }}
//           >
//             <div
//               style={{
//                 width: "100%",
//                 maxWidth: "1100px",
//                 padding: "0 2rem",
//                 display: "flex",
//                 flexDirection: isMobile ? "column" : "row",
//                 alignItems: "center",
//                 gap: "3rem",
//                 justifyContent: isMobile ? "center" : "space-evenly",
//               }}
//             >
//               {/* LEFT SIDE - PROFILE */}
//               <div
//                 style={{
//                   width: "240px",
//                   height: "240px",
//                   borderRadius: "50%",
//                   padding: "6px",
//                   transition: "transform 0.4s ease",
//                   animation: "floatSlow 6s ease-in-out infinite",
//                   border: "2px solid rgba(34,197,94,0.35)",
//                   boxShadow: "0 0 60px rgba(34,197,94,0.25)",
//                   background: "rgba(0,0,0,0.6)",
//                   backdropFilter: "blur(20px)",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     background: "#000",
//                   }}
//                 >
//                   <img
//                     src="/profile.jpg"
//                     alt="Yasif"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       transition: "transform 0.5s ease",
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* RIGHT SIDE - SOCIAL DOCK */}
//               <div
//                 style={{
//                   flex: 1,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: isMobile ? "center" : "flex-start",
//                   justifyContent: "center",
//                   gap: "1.5rem",
//                   height: "100%",
//                   marginTop: isMobile ? "0rem" : "-3rem",
//                 }}
//               >
//                 <h2
//                   style={{
//                     ...sectionTitle(isMobile),
//                     marginBottom: "1rem",
//                     fontSize: "2.5rem",
//                   }}
//                 >
//                   Connect With Me
//                 </h2>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "1.8rem",
//                     marginTop: isMobile ? "0rem" : "-2rem",
//                     alignItems: "center",
//                     justifyContent: isMobile ? "center" : "flex-start",
//                     padding: "0.7rem 0.8rem",
//                     borderRadius: "28px",
//                     background: "rgba(255,255,255,0.03)",
//                     border: "1px solid rgba(255,255,255,0.05)",
//                     backdropFilter: "blur(12px)",
//                   }}
//                 >
//                   {[
//                     {
//                       label: "GitHub",
//                       icon: "https://cdn.simpleicons.org/github/ffffff",
//                       link: "https://github.com/Ashh26",
//                       color: "#ffffff",
//                     },
//                     {
//                       label: "LinkedIn",
//                       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
//                       link: "https://linkedin.com",
//                       color: "#0A66C2",
//                     },
//                     {
//                       label: "Instagram",
//                       icon: "https://cdn.simpleicons.org/instagram/E1306C",
//                       link: "https://instagram.com",
//                       color: "#E1306C",
//                     },
//                     {
//                       label: "Medium",
//                       icon: "https://cdn.simpleicons.org/medium/ffffff",
//                       link: "https://medium.com",
//                       color: "#ffffff",
//                     },
//                     {
//                       label: "WhatsApp",
//                       icon: "https://cdn.simpleicons.org/whatsapp/25D366",
//                       link: "https://wa.me/your-number",
//                       color: "#25D366",
//                     },
//                     {
//                       label: "Twitter",
//                       icon: "https://cdn.simpleicons.org/x/ffffff",
//                       link: "https://twitter.com",
//                       color: "#ffffff",
//                     },
//                     {
//                       label: "Discord",
//                       icon: "https://cdn.simpleicons.org/discord/7289da",
//                       link: "https://discord.com",
//                       color: "#7289da",
//                     },
//                   ].map((item, index) => (
//                     <div
//                       key={index}
//                       onClick={() => window.open(item.link, "_blank")}
//                       style={{
//                         cursor: "pointer",
//                         transition: "transform 0.3s ease",
//                       }}
//                       onMouseEnter={(e) => {
//                         const img = e.currentTarget.querySelector("img");
//                         img.style.transform = "scale(1.18) translateY(-4px)";
//                         img.style.filter = `
//       drop-shadow(0 0 6px ${item.color})
//       `;
//                       }}
//                       onMouseLeave={(e) => {
//                         const img = e.currentTarget.querySelector("img");
//                         img.style.transform = "scale(1)";
//                         img.style.filter = "none";
//                       }}
//                     >
//                       <img
//                         src={item.icon}
//                         alt={item.label}
//                         style={{
//                           width: "30px",
//                           height: "30px",
//                           transition: "all 0.3s ease",
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <SectionDivider />
//           </section>

//           {/* CONTACT */}
//           <section
//             style={{
//               ...sectionStyle,
//               // height: "100vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//               marginTop: isMobile ? "0px" : "-200px",
//             }}
//           >
//             <div
//               style={{
//                 maxWidth: "900px",
//                 width: "100%",
//                 padding: "0 2rem",
//                 textAlign: "center",
//               }}
//             >
//               <Reveal delay={0}>
//                 <h2 style={sectionTitle(isMobile)}>
//                   Let's Build Something Scalable
//                 </h2>{" "}
//               </Reveal>

//               <Reveal delay={150}>
//                 <p
//                   style={{
//                     opacity: 0.75,
//                     marginTop: "1.5rem",
//                     fontSize: "1.2rem",
//                     maxWidth: "600px",
//                     marginInline: "auto",
//                     lineHeight: 1.6,
//                   }}
//                 >
//                   I'm open to backend engineering roles where I can design
//                   secure, production-ready systems and contribute to scalable
//                   architecture.
//                 </p>{" "}
//               </Reveal>

//               <Reveal delay={300}>
//                 <div
//                   style={{
//                     marginTop: "2.5rem",
//                     display: "flex",
//                     justifyContent: "center",
//                     gap: "1.5rem",
//                   }}
//                 >
//                   <button
//                     style={primaryBtn}
//                     onClick={() =>
//                       window.open(
//                         "https://mail.google.com/mail/?view=cm&fs=1&to=yasiffkhan@gmail.com",
//                         "_blank",
//                       )
//                     }
//                   >
//                     Email Me
//                   </button>

//                   <button
//                     style={secondaryBtn}
//                     onClick={() =>
//                       window.open("https://github.com/Ashh26", "_blank")
//                     }
//                   >
//                     GitHub
//                   </button>
//                 </div>{" "}
//               </Reveal>
//             </div>
//             <SectionDivider />
//           </section>

//           {/* FOOTER */}
//           <section
//             style={{
//               // height: "100vh",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               textAlign: "center",
//               color: "rgba(255,255,255,0.5)",
//               fontSize: "0.9rem",
//               marginTop: isMobile ? "0px" : "-5rem",
//               position: "relative",
//             }}
//           >
//             <div>
//               <p style={{ fontSize: "1rem" }}>
//                 © {new Date().getFullYear()} Yasif Khan
//               </p>

//               <p style={{ opacity: 0.8 }}>
//                 Built with React • Three.js • Performance Optimized
//               </p>
//             </div>
//           </section>
//         </div>
//       </Scroll>
//     );
//   }
// }

// /** ✅ Optimized: same UI, same content, same layout, same animations */
// const ServicesSection = memo(function ServicesSection({
//   isMobile,
//   sectionStyle,
//   sectionTitle,
//   paragraphStyle,
//   primaryBtn,
//   secondaryBtn,
//   scrollToPage,
//   Reveal,
//   SectionDivider,
// }) {
//   // ✅ stable data (no re-alloc every render)
//   const services = useMemo(
//     () => [
//       {
//         title: "3D Portfolio Website",
//         desc: "React + Three.js experience with smooth sections, modern UI, and optimized performance.",
//       },
//       {
//         title: "Backend API Development",
//         desc: "Spring Boot REST APIs with clean architecture, validation, exception handling, and best practices.",
//       },
//       {
//         title: "Auth & Security Layer",
//         desc: "JWT + refresh tokens, RBAC, audit trail patterns, and secure production-ready flows.",
//       },
//       {
//         title: "Deployment & Delivery",
//         desc: "Vite builds, hosting setup, domain + SSL, and basic monitoring guidance for a stable rollout.",
//       },
//     ],
//     [],
//   );

//   // ✅ stable handlers (no new functions each render)
//   const onRequestQuote = useCallback(() => {
//     window.open(
//       "https://mail.google.com/mail/?view=cm&fs=1&to=yasiffkhan@gmail.com&su=Service%20Inquiry%20-%20Portfolio%20Website",
//       "_blank",
//     );
//   }, []);

//   const onSeeSocials = useCallback(() => {
//     scrollToPage(8.1); // keep exactly what you had
//   }, [scrollToPage]);

//   // ✅ memo styles (prevents new objects per render)
//   const outerSectionStyle = useMemo(
//     () => ({
//       ...sectionStyle,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       position: "relative",
//       padding: isMobile ? "0 2rem" : "0 6rem",
//       marginTop: "100px",
//     }),
//     [sectionStyle, isMobile],
//   );

//   const gridWrapStyle = useMemo(
//     () => ({
//       width: "100%",
//       maxWidth: "1500px",
//       display: "grid",
//       gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
//       gap: "5rem",
//       alignItems: "center",
//       position: "relative",
//       zIndex: 2,
//     }),
//     [isMobile],
//   );

//   const cardsGridStyle = useMemo(
//     () => ({
//       marginTop: "2.5rem",
//       display: "grid",
//       gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
//       gap: "1.4rem",
//       maxWidth: "780px",
//     }),
//     [isMobile],
//   );

//   return (
//     <section className="cv-auto" style={outerSectionStyle}>
//       <div style={gridWrapStyle}>
//         {/* LEFT: Offer + cards */}
//         <div>
//           <Reveal delay={0}>
//             <h2 style={{ ...sectionTitle(isMobile), textAlign: "left" }}>
//               Professional Services
//             </h2>
//           </Reveal>

//           <Reveal delay={120}>
//             <p style={{ ...paragraphStyle, maxWidth: "680px" }}>
//               I build high-impact backend systems and premium 3D portfolio
//               websites like this one. If you want a modern, conversion-focused
//               presence with a high-performance delivery, I can ship it
//               end-to-end.
//             </p>
//           </Reveal>

//           <div style={cardsGridStyle}>
//             {services.map((s, i) => (
//               <div key={i} className="svc-card">
//                 <div className="svc-card__glow" />
//                 <h3 style={{ margin: 0, marginBottom: "0.6rem" }}>{s.title}</h3>
//                 <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.6 }}>
//                   {s.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: CTA / Engagement model */}
//         <div>
//           <Reveal delay={250}>
//             <div className="svc-cta">
//               <div className="svc-cta__glow" />

//               <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
//                 Engagement Model
//               </h3>

//               <div style={{ display: "grid", gap: "0.9rem", opacity: 0.85 }}>
//                 {[
//                   "Discovery: requirements + references",
//                   "Design: UI layout + section flow",
//                   "Build: components + 3D + interactions",
//                   "Optimize: performance + responsiveness",
//                   "Delivery: deploy + handover",
//                 ].map((x, i) => (
//                   <div key={i} style={{ display: "flex", gap: "0.6rem" }}>
//                     <span style={{ color: "#22c55e", opacity: 0.9 }}>✔</span>
//                     <span>{x}</span>
//                   </div>
//                 ))}
//               </div>

//               <div
//                 style={{ display: "flex", gap: "1rem", marginTop: "1.8rem" }}
//               >
//                 <button style={primaryBtn} onClick={onRequestQuote}>
//                   Request a Quote
//                 </button>

//                 <button style={secondaryBtn} onClick={onSeeSocials}>
//                   See Socials
//                 </button>
//               </div>

//               <p style={{ marginTop: "1.4rem", opacity: 0.6, lineHeight: 1.6 }}>
//                 For best outcomes, share your reference site + target sections +
//                 hosting preference.
//               </p>
//             </div>
//           </Reveal>
//         </div>
//       </div>

//       <SectionDivider />
//     </section>
//   );
// });

// export { ServicesSection };

// /////////////////////////////////////////////////////////////////////////////








// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');


// * {
//   box-sizing: border-box;
// }


// html,body {
//   margin: 0;
//   padding: 0;
//   width: 100%;
//   background: #000000;
//   overflow-x: hidden; /* allow vertical scroll */
// }

// #root{
//   width: 100%;
//   overflow-x: hidden;
// }

// h1, h2, h3, h4, p,span{
//   max-width: 100%;
//   word-break: break-word;
//   overflow-wrap: break-word;
// }


// @keyframes shine {
//   to {
//     transform: translateX(100%);
//   }
// }

// @keyframes fadeUp {
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// .timeline-line {
//   position: absolute;
//   left: 10px;
//   top: 0;
//   bottom: 0;
//   width: 2px;
//   background: linear-gradient(to bottom, #22c55e, transparent);
//   box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
// }

// .about-card {
//   position: relative;
//   overflow: hidden;
// }

// .about-card::before {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: -120%;
//   width: 100%;
//   height: 100%;
//   background: linear-gradient(120deg,
//       transparent,
//       rgba(255, 255, 255, 0.08),
//       transparent);
//   transform: skewX(-25deg);
//   transition: left 0.6s ease;
// }

// .about-card:hover::before {
//   left: 120%;
// }


// @keyframes floatSlow {
//   0% {
//     transform: translateY(0px);
//   }

//   50% {
//     transform: translateY(-12px);
//   }

//   100% {
//     transform: translateY(0px);
//     -webkit-transform: translateY(0px);
//     -moz-transform: translateY(0px);
//     -ms-transform: translateY(0px);
//     -o-transform: translateY(0px);
//   }
// }


// @keyframes borderFlow {
//   0% {
//     background-position: 0% 50%;
//   }

//   100% {
//     background-position: 200% 50%;
//   }
// }

// @keyframes fadeInUp {
//   from {
//     opacity: 0;
//     transform: translateY(10px);
//   }

//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// :root {
//   font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
//   line-height: 1.5;
//   font-weight: 400;

//   color-scheme: light dark;
//   color: rgba(255, 255, 255, 0.87);
//   background-color: #242424;

//   font-synthesis: none;
//   text-rendering: optimizeLegibility;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
// }

// a {
//   font-weight: 500;
//   color: #646cff;
//   text-decoration: inherit;
// }

// a:hover {
//   color: #535bf2;
// }



// h1 {
//   font-size: 3.2em;
//   line-height: 1.1;
// }

// button {
//   border-radius: 8px;
//   border: 1px solid transparent;
//   padding: 0.6em 1.2em;
//   font-size: 1em;
//   font-weight: 500;
//   font-family: inherit;
//   background-color: #1a1a1a;
//   cursor: pointer;
//   transition: border-color 0.25s;
// }

// button:hover {
//   border-color: #646cff;
// }

// button:focus,
// button:focus-visible {
//   outline: 4px auto -webkit-focus-ring-color;
// }

// @media (prefers-color-scheme: light) {
//   :root {
//     color: #213547;
//     background-color: #ffffff;
//   }

//   a:hover {
//     color: #747bff;
//   }

//   button {
//     background-color: #f9f9f9;
//   }
// }

// /* ===== TECH LOOP ===== */

// .tech-loop {
//   display: flex;
//   gap: 5rem;
//   animation: scrollLoop 25s linear infinite;
//   width: max-content;
// }

// .tech-loop:hover {
//   animation-play-state: paused;
// }

// @keyframes scrollLoop {
//   from {
//     transform: translateX(0);
//   }

//   to {
//     transform: translateX(-50%);
//   }
// }

// .tech-item {
//   font-size: 3rem;
//   color: #6b7280;
//   transition: transform 0.3s ease, color 0.3s ease, filter 0.3s ease;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 2rem 0;
// }

// .tech-item:hover {
//   transform: scale(1.2);
//   color: var(--hoverColor);
//   filter: drop-shadow(0 0 12px var(--hoverColor));
// }


// /* ===== MAC DOCK (Skills) ===== */
// /* ===== Apple Dock Style ===== */

// .skills-wrap {
//   width: 100%;
//   max-width: 1100px;
//   margin: 0 auto;
//   text-align: center;
// }

// .dock-container {
//   position: relative;
//   display: flex;
//   justify-content: center;
//   align-items: flex-end;

//   width: 100%;
//   max-width: 720px;
//   /* 🔥 lock width */
//   margin: 0 auto;

//   padding: 16px 28px;
//   border-radius: 28px;

//   background: rgba(20, 20, 20, 0.7);
//   backdrop-filter: blur(20px);
//   border: 1px solid rgba(255, 255, 255, 0.08);

//   overflow: hidden;
// }

// .dock-item {
//   width: 60px;
//   height: 60px;

//   display: flex;
//   align-items: center;
//   justify-content: center;

//   margin: 0 12px;

//   transition: transform 0.25s cubic-bezier(.16, 1, .3, 1);

//   will-change: transform;
//   transform: translateZ(0);
//   /* GPU acceleration */
// }

// .dock-item img {
//   width: 52px;
//   height: 52px;
//   object-fit: contain;
//   filter: grayscale(0.2);
//   transition: all 0.3s ease;
// }

// .dock-item:hover img {
//   filter: grayscale(0);
// }

// .dock-label {
//   position: absolute;
//   bottom: -28px;
//   left: 50%;
//   transform: translateX(-50%);
//   font-size: 12px;
//   opacity: 0;
//   white-space: nowrap;
//   color: white;
//   transition: opacity 0.2s ease;
// }

// .dock-item:hover .dock-label {
//   opacity: 1;
// }


// .shine-layer {
//   position: absolute;
//   top: 0;
//   left: -120%;
//   width: 100%;
//   height: 100%;
//   background: linear-gradient(120deg,
//       transparent,
//       rgba(255, 255, 255, 0.08),
//       transparent);
//   transform: skewX(-25deg);
//   transition: left 0.6s ease;
// }

// .card:hover .shine-layer {
//   left: 120%;
// }

// /* ===== SERVICES (perf optimized) ===== */
// .svc-card {
//   padding: 1.6rem;
//   border-radius: 18px;
//   background: rgba(255, 255, 255, 0.04);
//   border: 1px solid rgba(255, 255, 255, 0.08);

//   backdrop-filter: blur(8px);
//   -webkit-backdrop-filter: blur(8px);

//   transition: transform 0.3s ease, box-shadow 0.3s ease;

//   transform: translate3d(0,0,0);
//   will-change: auto;
//   contain: layout paint style;
//   backface-visibility: hidden;

//   position: relative;
//   overflow: hidden;
//   isolation: isolate;
// }

// .svc-card:hover {
//   transform: translateY(-6px) translateZ(0);
//   box-shadow: 0 22px 60px rgba(34, 197, 94, 0.14);
//   will-change: transform;
// }

// .svc-card__glow {
//   position: absolute;
//   inset: 0;
//   background: radial-gradient(circle at 20% 20%,
//       rgba(34, 197, 94, 0.12),
//       transparent 50%);
//   opacity: 0.9;
//   pointer-events: none;
// }

// .svc-cta {
//   padding: 2rem;
//   border-radius: 22px;
//   background: rgba(0, 0, 0, 0.55);
//   border: 1px solid rgba(255, 255, 255, 0.08);

//   backdrop-filter: blur(6px);
//   -webkit-backdrop-filter: blur(6px);

//   box-shadow: 0 0 40px rgba(34, 197, 94, 0.08);

//   transform: translate3d(0,0,0);
//   contain: layout paint style;
//   backface-visibility: hidden;

//   position: relative;
//   overflow: hidden;
// }

// .svc-cta__glow {
//   position: absolute;
//   top: -120px;
//   right: -120px;
//   width: 260px;
//   height: 260px;
//   background: radial-gradient(circle, rgba(34, 197, 94, 0.22), transparent 65%);
//   filter: blur(12px);
//   pointer-events: none;
// }


// /* ===== PROJECTS OPTIMIZED ===== */

// .projects-grid {
//   margin-top: 3rem;
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
//   gap: 2rem;
// }

// .project-card-optimized {
//   position: relative;
//   padding: 2rem;
//   border-radius: 22px;
//   background: rgba(255, 255, 255, 0.04);
//   border: 1px solid rgba(255, 255, 255, 0.08);

//   /* 🔥 performance critical */
//   backdrop-filter: blur(8px);
//   -webkit-backdrop-filter: blur(8px);

//   transition: transform 0.35s cubic-bezier(.16, 1, .3, 1),
//               box-shadow 0.35s ease;

//   transform: translate3d(0,0,0);
//   will-change: auto;
//   contain: layout paint style;
//   backface-visibility: hidden;

//   overflow: hidden;
//   isolation: isolate;
// }

// .project-card-optimized:hover {
//   transform: translateY(-8px);
//   box-shadow: 0 12px 35px rgba(34, 197, 94, 0.15);
//   will-change: transform;
// }

// .project-glow {
//   position: absolute;
//   inset: 0;
//   background: radial-gradient(circle at 20% 20%,
//       rgba(34, 197, 94, 0.12),
//       transparent 40%);
//   pointer-events: none;
// }

// .project-desc {
//   opacity: 0.75;
//   line-height: 1.6;
//   margin-top: 0.8rem;
// }

// .project-badges {
//   margin-top: 1rem;
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.6rem;
// }

// .project-badges span {
//   font-size: 0.8rem;
//   padding: 4px 10px;
//   border-radius: 20px;
//   background: rgba(34, 197, 94, 0.15);
//   border: 1px solid rgba(34, 197, 94, 0.35);
//   color: #22c55e;
// }

// .project-buttons {
//   margin-top: 1.5rem;
//   display: flex;
//   gap: 1rem;
// }

// .highlight-card {
//   border: 1px solid rgba(34, 197, 94, 0.5);
//   box-shadow: 0 0 40px rgba(34, 197, 94, 0.12);
// }




// .engineering-card {
//   padding: 2rem;
//   border-radius: 18px;
//   background: rgba(255,255,255,0.04);
//   border: 1px solid rgba(255,255,255,0.08);
//   backdrop-filter: blur(8px);
//   -webkit-backdrop-filter: blur(8px);
//   transition: transform 0.35s cubic-bezier(.16,1,.3,1),              box-shadow 0.35s ease;
//   transform: translate3d(0,0,0);
//   will-change: transform;
//   contain: layout paint style;
//   backface-visibility: hidden;
//   position: relative;
//   overflow: hidden;
//   -webkit-border-radius: 18px;
//   -moz-border-radius: 18px;
//   -ms-border-radius: 18px;
//   -o-border-radius: 18px;
// }

// .engineering-card:hover {
//   transform: translateY(-8px);
//   box-shadow: 0 20px 45px rgba(34,197,94,0.12);
// }





// section {
//   contain: layout style;
// }

// .projects-grid,
// .svc-card,
// .project-card-optimized,
// .engineering-card {
//   will-change: transform;
// }



// /* ===== Engineering cards (no JS hover) ===== */
// .eng-card {
//   padding: 2rem;
//   border-radius: 18px;
//   background: rgba(255,255,255,0.04);
//   border: 1px solid rgba(255,255,255,0.08);
//   backdrop-filter: blur(12px);
//   -webkit-backdrop-filter: blur(12px);

//   transition: transform 0.35s cubic-bezier(.16,1,.3,1), box-shadow 0.35s ease, border 0.35s ease;
//   cursor: default;
//   position: relative;
//   overflow: hidden;
//   isolation: isolate;

//   transform: translateZ(0);
//   will-change: transform;
//   contain: paint; /* reduce repaint blast radius */
//   backface-visibility: hidden;
// }

// .eng-card .shine {
//   position: absolute;
//   top: 0;
//   left: -120%;
//   width: 100%;
//   height: 100%;
//   background: linear-gradient(120deg, transparent, rgba(255,255,255,0.06), transparent);
//   transform: skewX(-25deg);
//   transition: left 0.6s ease;
//   pointer-events: none;
// }

// .eng-card:hover {
//   transform: translateY(-8px) translateZ(0);
//   box-shadow: 0 20px 50px rgba(34,197,94,0.15);
// }

// .eng-card:hover .shine {
//   left: 120%;
// }

// /* ===== Offscreen rendering optimization ===== */
// .cv-auto {
//   content-visibility:visible;
//   contain-intrinsic-size: 600px 1000px; /* keeps layout stable while offscreen */
// }


// /* ================= RESPONSIVE FOUNDATION ================= */

// /* Tablet */
// @media (max-width: 1024px) {
//   .projects-grid {
//     gap: 1.5rem;
//   }

//   .project-card-optimized {
//     padding: 1.6rem;
//   }
// }

// /* Mobile */
// @media (max-width: 768px) {

//   section {
//     padding-left: 1.5rem !important;
//     padding-right: 1.5rem !important;
//   }

//   .projects-grid {
//     grid-template-columns: 1fr;
//     gap: 1.2rem;
//   }

//   .project-card-optimized {
//     padding: 1.4rem;
//   }

//   .eng-card {
//     padding: 1.5rem;
//   }

//   .svc-card {
//     padding: 1.4rem;
//   }
// }

// /* Small phones */
// @media (max-width: 480px) {

//   .project-card-optimized {
//     padding: 1.2rem;
//   }

//   .eng-card {
//     padding: 1.2rem;
//   }

// }


// /* GLOBAL RESPONSIVE TEXT WRAP FIX */





// section {
//   padding-left: clamp(1rem, 4vw, 4rem);
//   padding-right: clamp(1rem, 4vw, 4rem);
// }


// canvas {
//   display: block;
// }

// .r3f-scroll-container {
//   width: 100% !important;
//   max-width: 100vw !important;
//   overflow-x: hidden !important;
// }
