// src/ui/SectionDivider.jsx
export default function SectionDivider({ isMobile }) {
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