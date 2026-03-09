// src/ui/AnimatedName.jsx
import { useEffect, useMemo, useState } from "react";

export default function AnimatedName({ name = "Yasif Khan " }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setI((p) => (p >= name.length ? name.length : p + 1));
    }, 250);
    return () => clearInterval(t);
  }, [name]);

  const shown = useMemo(() => name.slice(0, i), [name, i]);

  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: "6px" }}>
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