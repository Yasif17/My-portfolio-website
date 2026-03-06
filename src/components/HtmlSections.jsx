import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import Reveal from "./Reveal";
import { primaryBtn } from "/src/styles/inlineStyle.js";

export default function HtmlSections({
  isMobile,
  introDone,
  setActive,
  setSectionId,
  scrollToPage,

  // pulled from App scope (no logic changes)
  sectionId,
  setShowCert,

  // styles/helpers you already have in App
  sectionStyle,
  containerStyle,
  heroTitle,
  heroSubtitle,
  heroDesc,
  sectionTitle,
  paragraphStyle,
  secondaryBtn,

  // components you already have
  AnimatedName,
  SectionDivider,
  SkillsDock,
  ServicesSection,
  ShinySpan,
  Button1,
  Button2,
  Button3,
  Button4,
}) {
  const [aboutRef, aboutVisible] = useInView(0.5);

  const [aboutTriggered, setAboutTriggered] = useState(false);

  useEffect(() => {
    if (sectionId === 1 && !aboutTriggered) {
      setAboutTriggered(true);
    }
  }, [sectionId, aboutTriggered]);

  const isAboutActive = aboutTriggered;

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const handleScroll = () => {
      const midpoint = window.innerHeight * 0.5;

      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= midpoint && rect.bottom >= midpoint) {
          setSectionId(i);
          setActive(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              ...containerStyle,
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

                <Button4 onClick={() => scrollToPage(7)}>Let's Talk!</Button4>
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
                  I’m a Computer Science engineer focused on building secure and
                  scalable backend systems using Java and Spring Boot. I design
                  clean, maintainable APIs and follow structured architecture
                  principles. I continuously strengthen my problem-solving
                  skills to deliver production-ready solutions.
                </p>
              </Reveal>

              {/* EDUCATION */}
              <Reveal delay={300}>
                <div
                  onClick={() => setShowCert(true)}
                  style={{
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
                          e.currentTarget.style.transform = "translateY(-4px)";
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
                    Secure ride booking backend with JWT authentication, refresh
                    tokens, RBAC, audit logging, MVC architecture and
                    production-grade exception handling. Deployed to AWS Elastic
                    Beanstalk instance.
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
                    <a
                      href="/jobseekers architecture.png"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button2 style={{ ...secondaryBtn, padding: "1.1rem" }}>
                        Architecture
                      </Button2>
                    </a>
                    <Button1
                      onClick={() =>
                        window.open(
                          "https://github.com/Ashh26/JobSeekers-job-networking-springBoot-backend-application-.git",
                          "_blank",
                        )
                      }
                    >
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
                    scroll- controlled 3D interactions, modular architecture and
                    optimized rendering pipeline.
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
                  textAlign: "center",
                  opacity: 0.7,
                }}
              >
                Secure backend engineering toolkit — production-ready patterns,
                cloud deployment, and scalable architecture.
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: isMobile ? "3rem 2rem 0" : "2.5rem 6rem",
          }}
        >
          <div
            style={{
              ...containerStyle,
              padding: isMobile ? "0 1.5rem" : "0 4rem",
            }}
          >
            <Reveal delay={0}>
              <h2 style={sectionTitle(isMobile)}>Engineering Expertise</h2>{" "}
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
                    <p style={{ opacity: 0.7, lineHeight: 1.6 }}>{item.desc}</p>
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: "900px", width: "100%", padding: "0 2rem" }}>
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              ...containerStyle,
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
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
                I'm open to backend engineering roles where I can design secure,
                production-ready systems and contribute to scalable
                architecture.
                <ShinySpan>
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.9rem",
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
