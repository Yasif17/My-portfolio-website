// src/components/SkillsDock.jsx
import { useEffect, useRef, useState } from "react";

export default function SkillsDock({ items, isMobile }) {
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