import { memo, useCallback, useMemo } from "react";
import Button3 from "../Projects buttons/Button3";

const ServicesSection = memo(function ServicesSection({
  isMobile,
  sectionStyle,
  sectionTitle,
  paragraphStyle,
  scrollToPage,
  Reveal,
  SectionDivider,
}) {
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

  // ✅ stable handlers
  const onRequestQuote = useCallback(() => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=yasiffkhan@gmail.com&su=Service%20Inquiry%20-%20Portfolio%20Website",
      "_blank",
    );
  }, []);

  const onSeeSocials = useCallback(() => {
    scrollToPage(8);
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
    }),
    [sectionStyle, isMobile],
  );

  const gridWrapStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "1500px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
            <p style={{ ...paragraphStyle, maxWidth: "680px", color: "rgba(255,255,255,0.78)" }}>
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
                <h3 style={{ margin: 0,color: "rgba(255,255,255,0.58)", marginBottom: "0.6rem" }}>{s.title}</h3>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
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

              <h3 style={{ marginTop: 0,color: "rgba(255,255,255,0.58)", marginBottom: "1rem" }}>
                Engagement Model
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: "0.9rem",
                  opacity: 0.85,
                  color: "#22c55e",
                  textShadow:
                    "0 0 8px rgba(34,197,94,0.7), 0 0 16px rgba(34,197,94,0.5)",
                }}
              >
                {[
                  "Discovery: requirements + references",
                  "Design: UI layout + section flow",
                  "Build: components + 3D + interactions",
                  "Optimize: performance + responsiveness",
                  "Delivery: deploy + handover",
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.6rem" }}>
                    <span style={{  color: "rgba(255,255,255,0.78)" }}>✔</span>
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

              <p style={{ marginTop: "1.4rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
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

export default ServicesSection;
