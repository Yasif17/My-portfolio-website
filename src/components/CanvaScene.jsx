import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import StarsParallax from "../three/StarsParallax";
import ScrollCube from "../three/ScrollCube";

export default function CanvasScene({ isMobile, introDone, mouseRef, sectionId }) {
  return (
    <>
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
        frameloop="always"
        shadows={false}
        dpr={isMobile ? 1 : [1, 1.2]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
        }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        performance={{ min: 0.7 }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 10, 20]} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />
        <pointLight position={[-4, 2, -3]} intensity={1.8} color="#22c55e" />
        <pointLight position={[4, -2, 2]} intensity={0.6} color="#22c55e" />

        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}

        <StarsParallax introDone={introDone} isMobile={isMobile} />

        <ScrollCube
          isMobile={isMobile}
          introDone={introDone}
          sectionId={sectionId}
          mouseRef={mouseRef}
        />
      </Canvas>
    </>
  );
}