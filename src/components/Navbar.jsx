import { useEffect, useRef, useState } from "react";
import Resume from "../Projects buttons/Resume";

export default function Navbar({ active, scrollToPage, isMobile }) {
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
      if (current > lastScroll.current && current > 80) setVisible(false);
      else setVisible(true);
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
          width: "min(94%, 1200px)",
          maxWidth: "1400px",
          zIndex: 5000,
          height: "68px",
          borderRadius: "999px",
          padding: "0 1.5rem",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(2,6,23,0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.55), inset 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* PREMIUM CURSIVE LOGO */}
        <div
          onClick={() => scrollToPage(7)}
          style={{
            fontFamily: "Pacifico, cursive",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "1.25rem",
            letterSpacing: "1px",
            background:
              "linear-gradient(120deg,#93c5fd 0%,#3b82f6 35%,#1e3a8a 70%,#93c5fd 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            cursor: "pointer",
            transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
            animation: "logoShine 6s linear infinite",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
          }}
        >
          YASIF
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
                  "linear-gradient(135deg, rgba(96,165,250,0.25), rgba(30,64,175,0.25))",
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

          {/* MOBILE HAMBURGER (OPEN) */}
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
              aria-label="Open menu"
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
              aria-label="Close menu"
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

      {/* LOGO SHINE KEYFRAMES */}
      <style>{`
        @keyframes logoShine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </>
  );
}