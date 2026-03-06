import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Button1 from "./Projects buttons/Button1";
import Button2 from "./Projects buttons/Button2";
import Resume from "./Projects buttons/Resume";
import Button3 from "./Projects buttons/Button3";
import Button4 from "./Projects buttons/Button4";
import ShinySpan from "./Projects buttons/ShiningEffect";
import React from "react";
import styled, { keyframes } from "styled-components";

/* ================= PARTICLES ================= */

function StarsLayer({ count = 1200, depth = 60, introDone, speed = 0.002 }) {
  const pointsRef = useRef();
  const positionsRef = useRef();

  // create positions only once
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = -Math.random() * depth;
    }

    positionsRef.current = arr;
    return arr;
  }, [count, depth]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = positionsRef.current;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] += speed;

      // recycle star
      if (positions[i + 2] > 5) {
        positions[i + 2] = -depth;
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 1] = (Math.random() - 0.5) * 40;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={introDone ? 0.9 : 0}
        depthWrite={false}
      />
    </points>
  );
}

function StarsParallax({ introDone, isMobile }) {
  const baseCount = isMobile ? 400 : 1200;

  return (
    <>
      <StarsLayer
        key={`layer1-${baseCount}`}
        count={baseCount}
        depth={80}
        introDone={introDone}
        speed={0.03}
      />
      <StarsLayer
        key={`layer2-${baseCount}`}
        count={baseCount + 300}
        depth={60}
        introDone={introDone}
        speed={0.035}
      />
      <StarsLayer
        key={`layer3-${baseCount}`}
        count={baseCount - 200}
        depth={40}
        introDone={introDone}
        speed={0.045}
      />
    </>
  );
}

/* ================= 3D RING ================= */

function ScrollCube({ isMobile, introDone, sectionId, mouseRef }) {
  const meshRef = useRef();
  // const scroll = useScroll();
  const materialRef = useRef();
  const scaleRef = useRef(0.6);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;

    // idle slow rotation
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += Math.sin(t * 0.6) * 0.0008;

    const progress =
      window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // 3D mouse tilt effect
    const mouseTiltX = state.mouse.y * 0.6;
    const mouseTiltY = state.mouse.x * 0.6;

    meshRef.current.rotation.x += mouseTiltX * 0.02;
    meshRef.current.rotation.y += mouseTiltY * 0.02;

    meshRef.current.position.x = isMobile ? 0 : 3.2;
    meshRef.current.position.y = isMobile ? -1.8 : meshRef.current.position.y;

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

    meshRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.05;

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
    let targetColor = new THREE.Color("#ffffff");
    if (sectionId === 0) targetColor = new THREE.Color("#ffffff");
    if (sectionId === 1) targetColor = new THREE.Color("#22c55e");
    if (sectionId === 2) targetColor = new THREE.Color("#ef4444");
    if (sectionId === 3) targetColor = new THREE.Color("#a855f7");
    if (sectionId === 4) targetColor = new THREE.Color("#f59e0b");
    if (sectionId === 5) targetColor = new THREE.Color("#16a34a");
    if (sectionId === 6) targetColor = new THREE.Color("#0000ff");
    if (sectionId === 7) targetColor = new THREE.Color("#008080");
    if (sectionId === 8) targetColor = new THREE.Color("#ffffff");

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

/* Premium typing + shine on the name */
function AnimatedName({ name = " I'm Yasif " }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setI((p) => (p >= name.length ? name.length : p + 1));
    }, 250);
    return () => clearInterval(t);
  }, [name]);

  const shown = useMemo(() => name.slice(0, i), [name, i]);

  return (
    <span
      style={{ display: "inline-flex", alignItems: "baseline", gap: "6px" }}
    >
      <span
        style={{
          position: "relative",
          fontWeight: 900,
          letterSpacing: "0.6px",
          background:
            "linear-gradient(110deg,#2563eb 0%,#3b82f6 40%,#93c5fd 50%,#3b82f6 60%,#2563eb 100%)",

          textShadow: "0 0 18px rgba(59,130,246,0.45)",
          backgroundSize: "400% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "nameShine 4.2s linear infinite",
        }}
      >
        {shown}
      </span>

      {/* caret */}
      <span
        style={{
          width: "10px",
          height: "1.1em",
          transform: "translateY(2px)",
          borderRadius: "2px",
          background: "rgba(255,255,255,0.85)",
          animation: "blink 0.8s steps(2, start) infinite",
          opacity: i >= name.length ? 0 : 1,
          transition: "opacity .25s ease",
        }}
      />
    </span>
  );
}

/* inject keyframes once */
const __nameKeyframes = `
@keyframes nameShine { 
  0% { background-position: -300% 0; } 
  100% { background-position: 300% 0; } 
}
@keyframes blink { 
  0%,49% { opacity: 1; } 
  50%,100% { opacity: 0; } 
}
`;

function InjectKeyframesOnce() {
  useEffect(() => {
    if (document.getElementById("name-anim-kf")) return;
    const style = document.createElement("style");
    style.id = "name-anim-kf";
    style.innerHTML = __nameKeyframes;
    document.head.appendChild(style);
  }, []);
  return null;
}

/* ================= STYLES ================= */

const sectionStyle = (isMobile) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: isMobile ? "90px" : "70px", // navbar-safe
  paddingBottom: isMobile ? "70px" : "60px",
  color: "white",
});

const heroTitle = (isMobile) => ({
  fontSize: isMobile ? "clamp(1.8rem, 6vw, 2.4rem)" : "3.8rem",
  fontWeight: 800,
  letterSpacing: "-1.2px",
  lineHeight: 1.2,
  wordBreak: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
  background: "linear-gradient(180deg, #ffffff, #9ca3af)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const heroSubtitle = {
  fontSize: "clamp(0.95rem, 3vw, 1.2rem)",
  marginTop: "1.2rem",
  marginBottom: "1.2rem",
  opacity: 0.8,
  letterSpacing: "0.5px",
  fontWeight: 500,
  maxWidth: "100%",
  wordBreak: "break-word",
};

const heroDesc = (isMobile) => ({
  fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
  marginBottom: "2rem",
  opacity: 0.7,
  maxWidth: isMobile ? "100%" : "60%",
  lineHeight: 1.6,
  wordBreak: "break-word",
});

const sectionTitle = (isMobile) => ({
  fontSize: isMobile ? "2.2rem" : "3.5rem",
  marginBottom: isMobile ? "2rem" : "3.5rem",
  letterSpacing: "-1.5px",
  fontWeight: 800,
  background: "linear-gradient(to bottom, #ffffff, #9ca3af)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
});

const paragraphStyle = {
  fontSize: "1.2rem",
  lineHeight: 1.6,
  opacity: 0.85,
};

const primaryBtn = {
  padding: "1rem 2.2rem",
  background: "linear-gradient(135deg, #16a34a, #15803d)",
  border: "none",
  borderRadius: "18px",
  color: "white",
  fontSize: "1rem",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.15s ease, box-shadow 0.2s ease",
  boxShadow: "0 10px 30px rgba(34,197,94,0.25)",
};

const secondaryBtn = {
  padding: "1rem 2.2rem",
  background: "transparent",
  border: "1px solid rgba(59,130,246,0.6)",
  borderRadius: "18px",
  color: "#3b82f6",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
};

/* ================= NAVBAR ================= */

// import { useState, useEffect, useRef } from "react";

function Navbar({ active, scrollToPage, isMobile }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  const sliderRef = useRef(null);
  const linksRef = useRef([]);

  const links = [
    { label: "Home", index: 0 },
    { label: "About", index: 1 },
    { label: "Projects", index: 2 },
    { label: "Skills", index: 3 },
    { label: "Services", index: 4 },
    { label: "Engineering", index: 5 },
    { label: "System", index: 6 },
    { label: "Social", index: 7 },
    { label: "Contact", index: 8 },
  ];

  /* SLIDING PILL */
  useEffect(() => {
    if (!sliderRef.current || !linksRef.current[active]) return;
    const el = linksRef.current[active];
    sliderRef.current.style.width = `${el.offsetWidth}px`;
    sliderRef.current.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [active]);

  /* AUTO HIDE */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* LOCK BODY SCROLL */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      {/* FLOATING NAVBAR */}
      <div
        style={{
          position: "fixed",
          top: "18px",
          left: "50%",
          transform: `translateX(-50%) ${
            visible ? "translateY(0)" : "translateY(-120%)"
          }`,
          transition: "transform 0.4s cubic-bezier(.16,1,.3,1)",
          width: isMobile ? "94%" : "fit-content",
          maxWidth: "1400px",
          zIndex: 5000,
          height: "68px",
          borderRadius: "999px",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(2,6,23,0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.55), inset 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* LOGO */}
        <div
          onClick={() => scrollToPage(7)}
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          yasif
        </div>

        {/* DESKTOP LINKS */}
        {!isMobile && (
          <div
            style={{
              position: "relative",
              display: "flex",
              gap: "0.5rem",
              padding: "6px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div
              ref={sliderRef}
              style={{
                position: "absolute",
                top: "6px",
                left: 0,
                height: "calc(100% - 12px)",
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.25), rgba(59,130,246,0.25))",
                transition:
                  "transform 0.35s cubic-bezier(.16,1,.3,1), width 0.35s cubic-bezier(.16,1,.3,1)",
              }}
            />

            {links.map((item, i) => {
              const isActive = active === item.index;
              return (
                <div
                  key={item.index}
                  ref={(el) => (linksRef.current[i] = el)}
                  onClick={() => scrollToPage(item.index)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "999px",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isMobile && <Resume />}

          {/* MOBILE HAMBURGER */}
          {isMobile && !open && (
            <button
              onClick={() => setOpen(true)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "20px",
                  height: "2px",
                  background: "#fff",
                  transform: "translate(-50%, -8px)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "20px",
                  height: "2px",
                  background: "#fff",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "20px",
                  height: "2px",
                  background: "#fff",
                  transform: "translate(-50%, 6px)",
                }}
              />
            </button>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobile && (
        <>
          {/* OVERLAY */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: open ? "rgba(0,0,0,0.6)" : "transparent",
              backdropFilter: open ? "blur(6px)" : "none",
              pointerEvents: open ? "auto" : "none",
              transition: "0.3s",
              zIndex: 4900,
            }}
          />

          {/* DRAWER */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: "85%",
              maxWidth: "360px",
              background: "rgba(2,6,23,0.96)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              transform: open ? "translateX(0)" : "translateX(100%)",
              transition: "0.75s cubic-bezier(.16,1,.3,1)",
              zIndex: 5001,
              padding: "4.5rem 2rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",

              /* 🔥 ADD THESE */
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "18px",
                  height: "2px",
                  background: "#fff",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "18px",
                  height: "2px",
                  background: "#fff",
                  transform: "translate(-50%, -50%) rotate(-45deg)",
                }}
              />
            </button>

            {links.map((item) => (
              <div
                key={item.index}
                onClick={() => {
                  scrollToPage(item.index);
                  setOpen(false);
                }}
                style={{
                  padding: "0.9rem 1rem",
                  borderRadius: "14px",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {item.label}
              </div>
            ))}

            <div
              style={{
                marginTop: "2rem",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Resume />
            </div>
          </div>
        </>
      )}
    </>
  );
}

// export default Navbar;

/* ================= PROGRESS BAR ================= */

function ScrollProgress() {
  const ref = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      if (ref.current) {
        ref.current.style.transform = `scaleX(${progress})`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        // background: "rgba(255,255,255,0.05)",
        zIndex: 4000,
      }}
    >
      <div
        ref={ref}
        style={{
          height: "100%",
          width: "100%",
          transform: "scaleX(0)",
          transformOrigin: "0 0",
          background: "white",
          transition: "transform 0.1s linear",
        }}
      />
    </div>
  );
}

function SectionDivider({ isMobile }) {
  return (
    <div
      style={{
        width: isMobile ? "90%" : "60%",
        height: "1px",
        margin: "0 auto",
        marginTop: isMobile ? "3.5rem" : "6rem",
        background:
          "linear-gradient(90deg, transparent, rgba(34,197,94,0.6), transparent)",
        boxShadow: "0 0 20px rgba(34,197,94,0.4)",
        opacity: 0.8,
      }}
    />
  );
}
// 🔥 ADD HERE (above App function)
function SkillsDock({ items, isMobile }) {
  const [mouseX, setMouseX] = useState(null);

  return (
    <div
      onMouseMove={(e) => setMouseX(e.clientX)}
      onMouseLeave={() => setMouseX(null)}
      style={{
        width: "min(980px, 92vw)",
        margin: "0 auto",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        borderRadius: "28px",
        padding: isMobile ? "1rem 1rem" : "1.2rem 2rem",
        display: "flex",
        gap: isMobile ? "1rem" : "2rem",
        alignItems: "flex-end",
        justifyContent: "center",
        flexWrap: isMobile ? "wrap" : "nowrap",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.08)",
        // overflow: "hidden",
      }}
    >
      {items.map((item, index) => (
        <DockItem key={index} item={item} mouseX={mouseX} isMobile={isMobile} />
      ))}
    </div>
  );
}

function DockItem({ item, mouseX, isMobile }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // On mobile we skip magnify behavior (no mouse)
    if (isMobile || !ref.current || mouseX === null) {
      setScale(1);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;

    const distance = Math.abs(mouseX - center);
    const maxDistance = 120;

    if (distance > maxDistance) {
      setScale(1);
      return;
    }

    const influence = 1 - distance / maxDistance;
    setScale(1 + influence * 0.6);
  }, [mouseX, isMobile]);

  const box = isMobile ? 54 : 64;
  const icon = isMobile ? 34 : 40;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
      style={{
        position: "relative",
        transform: `translateY(${hovered && !isMobile ? "-6px" : "0px"}) scale(${scale})`,
        transition: "transform 0.25s cubic-bezier(.22,1,.36,1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${box}px`,
        height: `${box}px`,
        cursor: "pointer",
      }}
    >
      <img
        src={item.icon}
        alt={item.label}
        style={{
          width: `${icon}px`,
          height: `${icon}px`,
          objectFit: "contain",
          pointerEvents: "none",
          transition: "filter 0.25s ease",
          filter: hovered && !isMobile ? "brightness(1.25)" : "brightness(1)",
        }}
      />

      {/* label only on desktop hover */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: "-28px",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#22c55e",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0px)" : "translateY(6px)",
            transition: "all 0.25s ease",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {item.label}
        </div>
      )}
    </div>
  );
}

function useInView(threshold = 0.4, root = null) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold, root }, // ✅ key change
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, root]);

  return [ref, visible];
}

/* ================= APP ================= */

const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const subtleShine = keyframes`
  0% { background-position: -150% 0; }
  100% { background-position: 150% 0; }
`;

const PremiumName = styled.span`
  font-weight: 800;
  letter-spacing: 0.5px;

  background: linear-gradient(
    110deg,
    #ffffff 0%,
    #ffffff 45%,
    #ff1e1e 50%,
    #ffffff 55%,
    #ffffff 100%
  );

  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  animation:
    ${fadeSlide} 0.8s ease forwards,
    ${subtleShine} 4s linear infinite;

  text-shadow: 0 0 12px rgba(255, 30, 30, 0.25);
`;

export default function App() {
  const style = document.createElement("style");
  style.innerHTML = `
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: #020617;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,#22c55e,#3b82f6);
  border-radius: 10px;
  border: 2px solid #020617;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg,#3b82f6,#22c55e);
}
`;
  document.head.appendChild(style);

  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;

      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const [isMobile, setIsMobile] = useState(false);
  const [showCert, setShowCert] = useState(false);

  // const pages = isMobile ? 14 : 10; // reduce sections on mobile for simplicity

  const [sectionId, setSectionId] = useState(0);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const scrollToPage = (index) => {
    const sections = document.querySelectorAll("section");
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const cursorRef = useRef();
  const cursorDotRef = useRef();

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", move);

    const animate = () => {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes floatSlow {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        background: "#020617",
      }}
    >
      <ScrollProgress />
      <Navbar active={active} scrollToPage={scrollToPage} isMobile={isMobile} />
      <InjectKeyframesOnce />
      {/* ✅ Radial Glow Layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background: `
          radial-gradient(
            circle at 75% 50%,
            rgba(37,99,235,0.15),
            rgba(2,6,23,0.9) 45%
          )
        `,
          zIndex: 0,
        }}
      />

      <div
        ref={cursorDotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          background: "#22c55e",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 5001,
        }}
      />

      {/* ✅ Canvas ABOVE gradient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.6))",
          zIndex: 2,
        }}
      />
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
        }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={isMobile ? 1 : [1, 1.3]}
        gl={{ antialias: false }}
        performance={{ min: 0.6 }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 10, 20]} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />
        <pointLight position={[-4, 2, -3]} intensity={1.8} color="#22c55e" />
        <pointLight position={[4, -2, 2]} intensity={0.6} color="#22c55e" />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>

        <StarsParallax
          mouseRef={mouseRef}
          introDone={introDone}
          isMobile={isMobile}
        />

        <ScrollCube
          isMobile={isMobile}
          introDone={introDone}
          sectionId={sectionId}
          mouseRef={mouseRef}
        />
      </Canvas>
      <div style={{ position: "relative", zIndex: 1 }}>
        <HtmlSections
          isMobile={isMobile}
          introDone={introDone}
          setActive={setActive}
          setSectionId={setSectionId}
          scrollToPage={scrollToPage}
        />{" "}
      </div>

      {/* ✅ CERTIFICATE MODAL — ADD HERE */}
      {showCert && (
        <div
          onClick={() => setShowCert(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 5000, // above everything
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "80%",
              maxWidth: "800px",
              borderRadius: "18px",
              overflow: "hidden",
              background: "#000",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            <img
              src="/mca-certificate.jpg"
              alt="MCA Certificate"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>
      )}
    </div>
  );

  function Reveal({ children, delay = 0 }) {
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    const hasAnimated = useRef(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setVisible(true);
            hasAnimated.current = true;
          }
        },
        { threshold: 0.2 },
      );

      if (ref.current) observer.observe(ref.current);

      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(50px)",
          transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    );
  }

  /* ================= HTML SECTIONS ================= */

  function HtmlSections({
    isMobile,
    introDone,
    setActive,
    setSectionId,
    scrollToPage,
  }) {
    const [aboutRef, aboutVisible] = useInView(0.5);

    const [aboutTriggered, setAboutTriggered] = useState(false);

    useEffect(() => {
      if (sectionId === 1 && !aboutTriggered) {
        setAboutTriggered(true);
      }
    }, [sectionId, aboutTriggered]);

    const isAboutActive = aboutTriggered;

    // ✅ anchors = your nav positions
    // const anchors = useMemo(() => {
    //   // 10 sections total (0..9). We keep it consistent with the navbar.
    //   return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // }, []);
    // ✅ single active tracker (no fighting, no “structure” pop)
    // const lastId = useRef(-1);
    // const lastNav = useRef(-999);

    // useFrame(() => {
    //   const pos = scroll.offset * (pages - 1); // continuous

    //   let nearestIdx = 0;
    //   let best = Infinity;

    //   for (let i = 0; i < anchors.length; i++) {
    //     const d = Math.abs(pos - anchors[i]);
    //     if (d < best) {
    //       best = d;
    //       nearestIdx = i;
    //     }
    //   }

    //   const navValue = anchors[nearestIdx];

    //   if (nearestIdx !== lastId.current) {
    //     lastId.current = nearestIdx;
    //     setSectionId(nearestIdx); // integer section id for 3D ring
    //   }

    //   if (navValue !== lastNav.current) {
    //     lastNav.current = navValue;
    //     setActive(navValue); // float nav highlight
    //   }
    // }

    // );

    useEffect(() => {
      const handleScroll = () => {
        const sections = document.querySelectorAll("section");
        let current = 0;

        sections.forEach((sec, index) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5) {
            current = index;
          }
        });

        setSectionId(current);
        setActive(current);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [setSectionId, setActive]);

    return (
      <>
        {/* HERO */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "100vw",
            overflowX: "hidden",
            boxSizing: "border-box",
          }}
        >
          <section
            style={{
              ...sectionStyle(isMobile),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              paddingTop: isMobile ? "120px" : "140px",
              opacity: introDone ? 1 : 0,
              transition: "opacity 1s ease",
              position: "relative",
              // marginTop: "100px",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "600px",
                height: "600px",
                background:
                  "radial-gradient(circle, rgba(252, 252, 252, 0.4), transparent 70%)",
                filter: "blur(100px)",
                zIndex: -1,
                top: "-150px",
                left: "-200px",
              }}
            />
            <div
              style={{
                width: "100%",
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "0 1.5rem",
                textAlign: isMobile ? "center" : "left",
                opacity: isMobile ? 1 : introDone ? 1 : 0,
                transform: isMobile
                  ? "none"
                  : introDone
                    ? "translateY(0px)"
                    : "translateY(20px)",
                transition: isMobile ? "none" : "all 1.2s ease",
                boxSizing: "border-box",
              }}
            >
              <Reveal delay={0}>
                <h3
                  style={{
                    ...heroTitle(isMobile),
                    maxWidth: isMobile ? "100%" : "760px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    paddingBottom: "2rem",
                    whiteSpace: "collapse",
                  }}
                >
                  Hi, <AnimatedName />— A Software Engineer
                </h3>
                <p>Architecting Secure & Scalable Backend Systems Specialist</p>
              </Reveal>

              <Reveal delay={150}>
                <p style={heroSubtitle}>
                  Java • Spring Boot • REST APIs • Authentication • Cloud
                  Deployment
                </p>
              </Reveal>

              <Reveal delay={300}>
                <p style={{ ...heroDesc(isMobile) }}>
                  Backend engineer focused on clean architecture, secure
                  authentication, and production-ready API systems designed for
                  scalability and reliability.
                </p>
              </Reveal>

              <Reveal delay={450}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "1.5rem",
                    marginTop: "1.5rem",
                    alignItems: isMobile ? "center" : "flex-start",
                  }}
                >
                  <Button3 onClick={() => scrollToPage(2)}>Projects</Button3>

                  <Button4 onClick={() => scrollToPage(8)}>Let's Talk!</Button4>
                </div>
              </Reveal>
            </div>
            <SectionDivider isMobile={isMobile} />
          </section>

          {/* ABOUT SECTION */}
          <section
            style={{
              ...sectionStyle(isMobile),
              minHeight: "100vh",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: isMobile ? "4rem 2rem 0" : "3rem 3rem 0",
              position: "relative",
              // marginTop: "100px",
            }}
          >
            {/* Parallax Wrapper (NOT section) */}
            <div
              ref={aboutRef}
              onMouseMove={(e) => {
                if (isMobile) return;
                const x = (e.clientX / window.innerWidth - 0.5) * 5;
                const y = (e.clientY / window.innerHeight - 0.5) * 8;
                e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0px, 0px)";
              }}
              style={{
                width: "100%",
                maxWidth: "1500px",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "0rem" : "6rem",
                alignItems: "center",
                transition: "transform 0.25s ease-out",
                willChange: "transform",
                transform: "translateZ(0)",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* LEFT COLUMN */}
              <div>
                <Reveal delay={0}>
                  <h2 style={{ ...sectionTitle(isMobile), textAlign: "left" }}>
                    About Me
                  </h2>
                </Reveal>

                <Reveal delay={150}>
                  <p style={{ ...paragraphStyle, maxWidth: "650px" }}>
                    I’m a Computer Science engineer focused on building secure
                    and scalable backend systems using Java and Spring Boot. I
                    design clean, maintainable APIs and follow structured
                    architecture principles. I continuously strengthen my
                    problem-solving skills to deliver production-ready
                    solutions.
                  </p>
                </Reveal>

                {/* EDUCATION */}
                <Reveal delay={300}>
                  <div
                    onClick={() => setShowCert(true)}
                    style={{
                      // marginTop: "3rem",
                      position: "relative",
                      cursor: "pointer",
                      marginBottom: isMobile ? "3rem" : "9rem",
                    }}
                  >
                    {/* Vertical Line */}
                    <div
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        background:
                          "linear-gradient(to bottom, #22c55e, transparent)",
                        boxShadow: "0 0 14px rgba(34,197,94,0.7)",
                      }}
                    />

                    {/* Card */}
                    <div
                      style={{
                        marginLeft: "40px",
                        padding: "1.8rem",
                        borderRadius: "18px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(14px)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow =
                          "0 20px 50px rgba(34,197,94,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <h4>Master of Computer Applications (2022)</h4>
                      <span style={{ color: "red" }}>
                        Click to see certificate
                      </span>
                      <p style={{ opacity: 0.85 }}>2752 / 3500 • CGPA: 7.86+</p>
                      <p style={{ marginTop: "0.8rem", opacity: 0.7 }}>
                        Specialized in backend systems, scalable architecture,
                        database optimization, and secure API engineering.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                {/* CORE STRENGTH */}

                <h3 style={{ marginBottom: "2rem" }}>Core Strength</h3>

                {[
                  { label: "Java & Spring Boot", value: 90 },
                  { label: "Authentication & Security", value: 85 },
                  { label: "Database Optimization", value: 80 },
                  { label: "Cloud Deployment (AWS)", value: 75 },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: "2rem" }}>
                    {/* Label */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                        fontSize: "1rem",
                        fontWeight: 500,
                        opacity: 0.9,
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{ color: "#22c55e" }}>{item.value}%</span>
                    </div>

                    {/* Track */}
                    <div
                      style={{
                        height: "5px",
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0.08)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {/* Fill */}
                      <div
                        style={{
                          height: "100%",
                          width: isAboutActive ? `${item.value}%` : "0%",
                          borderRadius: "20px",
                          background: "white",
                          boxShadow: "0 0 18px rgba(34,197,94,0.6)",
                          transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${i * 250}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* TOOLS & TECHNOLOGIES */}
                <Reveal delay={650}>
                  <div style={{ marginTop: "3rem" }}>
                    <h3 style={{ marginBottom: "1.5rem" }}>
                      Tools & Technologies Used building portfolio
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      {[
                        "React",
                        "React Three Fiber",
                        "Three.js",
                        "Drei",
                        "JavaScript (ES6+)",
                        "CSS3",
                        "Vite",
                        "AWS Deployment",
                      ].map((tech, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "0.7rem 1.3rem",
                            borderRadius: "22px",
                            background: "rgba(34,197,94,0.12)",
                            border: "1px solid rgba(34,197,94,0.4)",
                            fontSize: "0.9rem",
                            color: "#22c55e",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 10px 25px rgba(34,197,94,0.25)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            <SectionDivider isMobile={isMobile} />
          </section>

          {/* PROJECTS — OPTIMIZED & SCALABLE */}
          <section
            className="cv-auto"
            style={{
              ...sectionStyle(isMobile),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              padding: isMobile ? "2.5rem 1rem 0" : "0rem 0rem 0",
              // marginTop: "100px",
            }}
          >
            <div
              style={{
                maxWidth: "1300px",
                width: "100%",
                padding: isMobile ? "0 1.5rem" : "0 4rem",
              }}
            >
              <Reveal delay={0}>
                <h2 style={sectionTitle(isMobile)}>Featured Projects</h2>
              </Reveal>

              <Reveal delay={150}>
                <p
                  style={{
                    ...paragraphStyle,
                    maxWidth: "700px",
                    marginTop: isMobile ? "0px" : "-1rem",
                    opacity: 0.75,
                  }}
                >
                  Showcasing secure backend systems and scalable architectures
                  built with Java, Spring Boot and cloud deployment.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="projects-grid">
                  {/* ================= CAB BOOKING ================= */}
                  <div className="project-card-optimized">
                    <div className="project-glow" />
                    <h3>Cab Booking System</h3>

                    <p className="project-desc">
                      Secure ride booking backend with JWT authentication,
                      refresh tokens, RBAC, audit logging, MVC architecture and
                      production-grade exception handling. Deployed to AWS
                      Elastic Beanstalk instance.
                    </p>

                    <div className="project-badges">
                      <span>Spring Boot</span>
                      <span>JWT</span>
                      <span>PostgreSQL</span>
                      <span>RBAC</span>
                    </div>

                    <div className="project-buttons">
                      <Button1
                        onClick={() =>
                          window.open(
                            "https://github.com/Ashh26/Cab-Booking-Sytem.git",
                            "_blank",
                          )
                        }
                      >
                        GitHub
                      </Button1>
                      <Button2
                        onClick={() =>
                          window.open(
                            "http://cab-booking-backend-springboot-env.ap-south-1.elasticbeanstalk.com/",
                            "_blank",
                          )
                        }
                      >
                        Live API
                      </Button2>
                    </div>
                  </div>

                  {/* ================= MICROSERVICES PLATFORM ================= */}
                  <div className="project-card-optimized">
                    <div className="project-glow" />
                    <h3>Microservices Job Platform</h3>

                    <p className="project-desc">
                      Enterprise microservices architecture using Spring Boot,
                      Kafka, Eureka, Docker and Kubernetes (Minikube) with 6
                      services and distributed databases.
                    </p>

                    <div className="project-badges">
                      <span>Spring Cloud</span>
                      <span>Kafka</span>
                      <span>Kubernetes</span>
                      <span>Neo4j</span>
                    </div>

                    <div className="project-buttons">
                      <Button2 style={{ ...secondaryBtn, padding: "1.1rem" }}>
                        Architecture
                      </Button2>
                      <Button1>
                        <span>Github</span>
                      </Button1>
                    </div>
                  </div>

                  {/* ================= 3D PORTFOLIO FRAMEWORK ================= */}
                  <div className="project-card-optimized">
                    <div className="project-glow" />
                    <h3>3D Portfolio Framework (Reusable)</h3>

                    <p className="project-desc">
                      High-performance React Three Fiber portfolio template with
                      scroll- controlled 3D interactions, modular architecture
                      and optimized rendering pipeline.
                    </p>

                    <div className="project-badges">
                      <span>React</span>
                      <span>Three.js</span>
                      <span>R3F</span>
                      <span>Performance</span>
                    </div>
                    <div className="project-buttons">
                      <Button1 />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <SectionDivider isMobile={isMobile} />
          </section>

          {/* SKILLS */}
          <section
            style={{
              ...sectionStyle(isMobile),
              // height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div>
              <Reveal delay={100}>
                <h2 style={{ ...sectionTitle(isMobile), marginBottom: "2rem" }}>
                  Core Technologies I Used
                </h2>
                <p
                  style={{
                    ...paragraphStyle,
                    // marginTop: "0rem",
                    textAlign: "center",
                    opacity: 0.7,
                  }}
                >
                  Secure backend engineering toolkit — production-ready
                  patterns, cloud deployment, and scalable architecture.
                </p>{" "}
              </Reveal>
              <Reveal delay={300}>
                <div
                  style={{
                    marginTop: "2.5rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <SkillsDock
                    isMobile={isMobile}
                    items={[
                      {
                        label: "Java",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
                        url: "https://docs.oracle.com/en/java/",
                      },
                      {
                        label: "Spring Boot",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
                        url: "https://docs.spring.io/spring-boot/docs/current/reference/html/",
                      },
                      {
                        label: "JWT",
                        icon: "data:image/svg+xml,%3csvg width='24' height='24' fill='%23c00b0b' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3c!--Boxicons v3.0.8 https://boxicons.com %7c License https://docs.boxicons.com/free--%3e%3cpath d='m13.48 7.37-.02-5.38h-3l.02 5.38 1.5 2.06zm-3 9.22v5.4h3v-5.4l-1.5-2.06z'%3e%3c/path%3e%3cpath d='m13.48 16.6 3.16 4.36 2.42-1.76-3.16-4.36-2.42-.78zm-3-9.22L7.3 3.02 4.88 4.78l3.16 4.36 2.44.78z'%3e%3c/path%3e%3cpath d='M8.04 9.14 2.92 7.48 2 10.32 7.12 12l2.42-.8zm6.36 3.64 1.5 2.06 5.12 1.66.92-2.84L16.82 12zm2.42-.78 5.12-1.68-.92-2.84-5.12 1.66-1.5 2.06zm-9.7 0L2 13.66l.92 2.84 5.12-1.66 1.5-2.06zm.92 2.84L4.88 19.2l2.42 1.76 3.18-4.36v-2.54zm7.86-5.7 3.16-4.36-2.42-1.76-3.16 4.36v2.54z'%3e%3c/path%3e%3c/svg%3e",
                        url: "https://jwt.io/introduction",
                      },
                      {
                        label: "PostgreSQL",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
                        url: "https://www.postgresql.org/docs/",
                      },
                      {
                        label: "Docker",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
                        url: "https://docs.docker.com/",
                      },
                      {
                        label: "AWS",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
                        url: "https://docs.aws.amazon.com/",
                      },
                      {
                        label: "Hibernate",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hibernate/hibernate-original.svg",
                        url: "https://docs.jboss.org/hibernate/orm/current/userguide/html_single/",
                      },
                      {
                        label: "REST APIs",
                        icon: "https://img.icons8.com/?size=100&id=55190&format=png&color=000000",
                        url: "https://swagger.io/docs/",
                      },
                      {
                        label: "System Design",
                        icon: "https://cdn-icons-png.flaticon.com/512/906/906175.png",
                        url: "https://martinfowler.com/architecture/",
                      },
                      {
                        label: "Postman",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
                        url: "https://learning.postman.com/docs",
                      },
                      {
                        label: "Kafka",
                        icon: "https://cdn.simpleicons.org/apachekafka/ffffff",
                        url: "https://developer.confluent.io/faq/apache-kafka",
                      },
                    ]}
                  />
                </div>
              </Reveal>
            </div>
            <SectionDivider isMobile={isMobile} />
          </section>

          {/* PROFESSIONAL SERVICES */}
          <ServicesSection
            isMobile={isMobile}
            sectionStyle={sectionStyle}
            sectionTitle={sectionTitle}
            paragraphStyle={paragraphStyle}
            primaryBtn={primaryBtn}
            secondaryBtn={secondaryBtn}
            scrollToPage={scrollToPage}
            Reveal={Reveal}
            SectionDivider={SectionDivider}
          />

          {/* ENGINEERING EXPERTISE */}
          <section
            className="cv-auto"
            style={{
              ...sectionStyle(isMobile),
              // height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              padding: isMobile ? "3rem 2rem 0" : "2.5rem 6rem",
              // marginTop: "100px",
            }}
          >
            <div
              style={{
                maxWidth: "1100px",
                width: "100%",
                padding: isMobile ? "0 1.5rem" : "0 4rem",
              }}
            >
              <Reveal delay={0}>
                <h2 style={sectionTitle(isMobile)}>
                  Engineering Expertise
                </h2>{" "}
              </Reveal>

              <Reveal delay={150}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "2rem",
                    marginTop: "2rem",
                  }}
                >
                  {[
                    {
                      title: "Authentication Architecture",
                      desc: "JWT, Refresh Tokens, Token Blacklisting, RBAC Implementation",
                    },
                    {
                      title: "Security & Monitoring",
                      desc: "Account Lock Mechanism, Audit Logs, Suspicious Activity Alerts",
                    },
                    {
                      title: "API Design",
                      desc: "RESTful Architecture, Validation, Exception Handling Strategy",
                    },
                    {
                      title: "Deployment & DevOps",
                      desc: "Dockerized Services, AWS EC2 & RDS, CI/CD Pipeline Integration",
                    },
                  ].map((item, index) => (
                    <div key={index} className="eng-card">
                      <div className="shine" />
                      <h3 style={{ marginBottom: "1rem" }}>{item.title}</h3>
                      <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>{" "}
              </Reveal>
            </div>
            <SectionDivider isMobile={isMobile} />
          </section>

          {/* SYSTEM CAPABILITIES */}
          <section
            style={{
              ...sectionStyle(isMobile),
              // height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              // marginTop: isMobile ? "0px" : "-50px",
            }}
          >
            <div
              style={{ maxWidth: "900px", width: "100%", padding: "0 2rem" }}
            >
              <h2 style={sectionTitle(isMobile)}>System Capabilities</h2>

              <div
                style={{
                  marginTop: "2rem",
                  padding: "2rem",
                  borderRadius: "18px",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 0 40px rgba(34,197,94,0.15)",
                  fontFamily: "monospace",
                }}
              >
                {[
                  "JWT Authentication Service — ACTIVE",
                  "RBAC Authorization Engine — ACTIVE",
                  "Audit Logging System — MONITORING",
                  "Account Lock Mechanism — RUNNING",
                  "AWS EC2 Deployment — STABLE",
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "0.8rem",
                      color: "#22c55e",
                      letterSpacing: "0.5px",
                      animation: `fadeInUp 0.6s ease ${index * 0.2}s both`,
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>[✔]</span> {item}
                  </div>
                ))}
              </div>
            </div>
            <SectionDivider isMobile={isMobile} />
          </section>

          {/* SOCIAL */}
          <section
            style={{
              ...sectionStyle(isMobile),
              // height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              // marginTop: isMobile ? "0px" : "-100px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "1100px",
                padding: "0 2rem",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: "3rem",
                justifyContent: isMobile ? "center" : "space-evenly",
              }}
            >
              {/* LEFT SIDE - PROFILE */}
              <div
                style={{
                  width: "240px",
                  height: "240px",
                  borderRadius: "50%",
                  padding: "6px",
                  transition: "transform 0.4s ease",
                  animation: "floatSlow 3.5s ease-in-out infinite",
                  border: "2px solid rgba(34,197,94,0.35)",
                  boxShadow: "0 0 60px rgba(34,197,94,0.25)",
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#000",
                  }}
                >
                  <img
                    src="/profile.jpg"
                    alt="Yasif"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                  />
                </div>
              </div>

              {/* RIGHT SIDE - SOCIAL DOCK */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMobile ? "center" : "flex-start",
                  justifyContent: "center",
                  gap: "1.5rem",
                  height: "100%",
                  // marginTop: isMobile ? "0rem" : "-3rem",
                }}
              >
                <h2
                  style={{
                    ...sectionTitle(isMobile),
                    marginBottom: "1rem",
                    fontSize: "2.5rem",
                  }}
                >
                  Professional Presence
                </h2>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    justifyContent: isMobile ? "center" : "flex-start",
                    maxWidth: "520px",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "40px",
                    padding: "0.8rem 1rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {[
                    {
                      label: "GitHub",
                      icon: "https://cdn.simpleicons.org/github/ffffff",
                      link: "https://github.com/Ashh26",
                      color: "#ffffff",
                    },
                    {
                      label: "LinkedIn",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
                      link: "https://linkedin.com",
                      color: "#0A66C2",
                    },
                    {
                      label: "Instagram",
                      icon: "https://cdn.simpleicons.org/instagram/E1306C",
                      link: "https://www.instagram.com/yasiff_1709?igsh=MTcyNXQ3Z2trM3dk",
                      color: "#E1306C",
                    },
                    {
                      label: "Medium",
                      icon: "https://cdn.simpleicons.org/medium/ffffff",
                      link: "https://medium.com/@yasiffkhan",
                      color: "#ffffff",
                    },
                    {
                      label: "WhatsApp",
                      icon: "https://cdn.simpleicons.org/whatsapp/25D366",
                      link: "https://wa.me/7773830310",
                      color: "#25D366",
                    },
                    {
                      label: "Twitter",
                      icon: "https://cdn.simpleicons.org/x/ffffff",
                      link: "https://x.com/YasifK78533",
                      color: "#ffffff",
                    },
                    {
                      label: "Discord",
                      icon: "https://cdn.simpleicons.org/discord/7289da",
                      link: "https://discord.com/users/1262339495613956098",
                      color: "#7289da",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => window.open(item.link, "_blank")}
                      style={{
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        const img = e.currentTarget.querySelector("img");
                        img.style.transform = "scale(1.18) translateY(-4px)";
                        img.style.filter = `
      drop-shadow(0 0 6px ${item.color})
      `;
                      }}
                      onMouseLeave={(e) => {
                        const img = e.currentTarget.querySelector("img");
                        img.style.transform = "scale(1)";
                        img.style.filter = "none";
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        style={{
                          width: "30px",
                          height: "30px",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <SectionDivider isMobile={isMobile} />
          </section>

          {/* CONTACT */}
          <section
            style={{
              ...sectionStyle(isMobile),
              // height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              // marginTop: isMobile ? "0px" : "-200px",
            }}
          >
            <div
              style={{
                maxWidth: "900px",
                width: "100%",
                padding: "0 2rem",
                textAlign: "center",
              }}
            >
              <Reveal delay={0}>
                <h4 style={sectionTitle(isMobile)}>
                  Let’s Engineer Your Next Scalable End-to-End website.
                </h4>
              </Reveal>

              <Reveal delay={150}>
                <p
                  style={{
                    opacity: 0.75,
                    marginTop: "1.5rem",
                    fontSize: "1.2rem",
                    maxWidth: "600px",
                    marginInline: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  I'm open to backend engineering roles where I can design
                  secure, production-ready systems and contribute to scalable
                  architecture.
                  <ShinySpan>
                    {" "}
                    Want a production-ready platform like this? Let’s create it
                  </ShinySpan>
                </p>{" "}
              </Reveal>

              <Reveal delay={300}>
                <div
                  style={{
                    marginTop: "2.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "1.5rem",
                  }}
                >
                  <Button3
                    onClick={() =>
                      window.open(
                        "https://mail.google.com/mail/?view=cm&fs=1&to=yasiffkhan@gmail.com",
                        "_blank",
                      )
                    }
                  >
                    Email Me
                  </Button3>

                  <Button3
                    variant="transparent"
                    onClick={() =>
                      window.open("https://github.com/Ashh26", "_blank")
                    }
                  >
                    GitHub
                  </Button3>
                </div>
              </Reveal>
            </div>
            <SectionDivider isMobile={isMobile} />
          </section>

          {/* FOOTER */}
          <section
            style={{
              // height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.9rem",
              // marginTop: isMobile ? "0px" : "-5rem",
              position: "relative",
            }}
          >
            <div>
              <p style={{ fontSize: "1rem" }}>
                © {new Date().getFullYear()} Yasif Khan
              </p>

              <p style={{ opacity: 0.8 }}>
                Built with React • Three.js • Performance Optimized
              </p>
            </div>
          </section>
        </div>
      </>
    );
  }
}

/** ✅ Optimized: same UI, same content, same layout, same animations */
const ServicesSection = memo(function ServicesSection({
  isMobile,
  sectionStyle,
  sectionTitle,
  paragraphStyle,
  scrollToPage,
  Reveal,
  SectionDivider,
}) {
  // ✅ stable data (no re-alloc every render)
  const services = useMemo(
    () => [
      {
        title: "3D Portfolio Website",
        desc: "React + Three.js experience with smooth sections, modern UI, and optimized performance.",
      },
      {
        title: "Backend API Development",
        desc: "Spring Boot REST APIs with clean architecture, validation, exception handling, and best practices.",
      },
      {
        title: "Auth & Security Layer",
        desc: "JWT + refresh tokens, RBAC, audit trail patterns, and secure production-ready flows.",
      },
      {
        title: "Deployment & Delivery",
        desc: "Vite builds, hosting setup, domain + SSL, and basic monitoring guidance for a stable rollout.",
      },
    ],
    [],
  );

  // ✅ stable handlers (no new functions each render)
  const onRequestQuote = useCallback(() => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=yasiffkhan@gmail.com&su=Service%20Inquiry%20-%20Portfolio%20Website",
      "_blank",
    );
  }, []);

  const onSeeSocials = useCallback(() => {
    scrollToPage(8); // keep exactly what you had
  }, [scrollToPage]);

  // ✅ memo styles (prevents new objects per render)
  const outerSectionStyle = useMemo(
    () => ({
      ...sectionStyle,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: isMobile ? "3rem 2rem 0" : "1rem 6rem",
      flexDirection: "column",
      // marginTop: "100px",
    }),
    [sectionStyle, isMobile],
  );

  const gridWrapStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "1500px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
      gap: "5rem",
      alignItems: "center",
      position: "relative",
      zIndex: 2,
    }),
    [isMobile],
  );

  const cardsGridStyle = useMemo(
    () => ({
      marginTop: "2.5rem",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "1.4rem",
      maxWidth: "780px",
    }),
    [isMobile],
  );

  return (
    <section className="cv-auto" style={outerSectionStyle}>
      <div style={gridWrapStyle}>
        {/* LEFT: Offer + cards */}
        <div>
          <Reveal delay={0}>
            <h2 style={{ ...sectionTitle(isMobile), textAlign: "left" }}>
              Professional Services
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p style={{ ...paragraphStyle, maxWidth: "680px" }}>
              I build high-impact backend systems and premium 3D portfolio like
              this one and any kind of websites you want. If you want a modern,
              conversion-focused presence with a high-performance delivery, I
              can ship it end-to-end.
            </p>
          </Reveal>

          <div style={cardsGridStyle}>
            {services.map((s, i) => (
              <div key={i} className="svc-card">
                <div className="svc-card__glow" />
                <h3 style={{ margin: 0, marginBottom: "0.6rem" }}>{s.title}</h3>
                <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: CTA / Engagement model */}
        <div>
          <Reveal delay={250}>
            <div className="svc-cta">
              <div className="svc-cta__glow" />

              <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
                Engagement Model
              </h3>

              <div style={{ display: "grid", gap: "0.9rem", opacity: 0.85 }}>
                {[
                  "Discovery: requirements + references",
                  "Design: UI layout + section flow",
                  "Build: components + 3D + interactions",
                  "Optimize: performance + responsiveness",
                  "Delivery: deploy + handover",
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.6rem" }}>
                    <span style={{ color: "#22c55e", opacity: 0.9 }}>✔</span>
                    <span>{x}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1.8rem",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Button3 onClick={onRequestQuote}>Req a Quote</Button3>

                <Button3 onClick={onSeeSocials} variant="transparent">
                  Contact Me
                </Button3>
              </div>

              <p style={{ marginTop: "1.4rem", opacity: 0.6, lineHeight: 1.6 }}>
                For best outcomes, share your reference site + target sections +
                hosting preference.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <SectionDivider isMobile={isMobile} />
    </section>
  );
});

export { ServicesSection };
