// src/ui/ScrollProgress.jsx
import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const ref = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
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