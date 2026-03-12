// src/styles/inlineStyles.js

export const sectionStyle = (isMobile) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: isMobile ? "90px" : "70px",
  paddingBottom: isMobile ? "70px" : "60px",
  color: "white",
});

export const containerStyle = {
  width: "100%",
  maxWidth: "1100px",
};

export const heroTitle = (isMobile) => ({
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

export const heroSubtitle = {
  fontSize: "clamp(0.95rem, 3vw, 1.2rem)",
  marginTop: "1.2rem",
  marginBottom: "1.2rem",
  opacity: 0.8,
  letterSpacing: "0.5px",
  fontWeight: 500,
  maxWidth: "100%",
  wordBreak: "break-word",
};

export const heroDesc = (isMobile) => ({
  fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
  marginBottom: "2rem",
  opacity: 0.7,
  maxWidth: isMobile ? "100%" : "60%",
  lineHeight: 1.6,
  wordBreak: "break-word",
});

export const sectionTitle = (isMobile) => ({
  fontSize: isMobile ? "2.2rem" : "3.5rem",
  marginBottom: isMobile ? "2rem" : "3.5rem",
  letterSpacing: "-1.5px",
  fontWeight: 800,
  background: "linear-gradient(to bottom, #ffffff, #9ca3af)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
});

export const paragraphStyle = {
  fontSize: "1.2rem",
  lineHeight: 1.6,
  opacity: 0.85,
};

export const primaryBtn = {
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

export const secondaryBtn = {
  padding: "1rem 2.2rem",
  background: "transparent",
  border: "1px solid rgba(59,130,246,0.6)",
  borderRadius: "18px",
  color: "#3b82f6",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
};

export const floatingWrapper = {
  position: "relative",
  width: "100%",
  marginBottom: "1.5rem",
};

export const floatingInput = {
  width: "100%",
  padding: "1.2rem 1rem",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  fontSize: "1rem",
  outline: "none",
  transition: "all .25s ease",
};

export const floatingLabel = {
  position: "absolute",
  left: "1rem",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "0.9rem",
  opacity: 0.6,
  pointerEvents: "none",
  transition: "all .25s ease",
};
