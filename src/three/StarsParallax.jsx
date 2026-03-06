import StarsLayer from "./StarsLayer";

export default function StarsParallax({ introDone, isMobile }) {
  const baseCount = isMobile ? 300 : 800;

  return (
    <>
      <StarsLayer key={`layer1-${baseCount}`} count={baseCount} depth={80} introDone={introDone} speed={0.03} />
      <StarsLayer key={`layer2-${baseCount}`} count={baseCount + 300} depth={60} introDone={introDone} speed={0.035} />
      <StarsLayer key={`layer3-${baseCount}`} count={baseCount - 200} depth={40} introDone={introDone} speed={0.045} />
    </>
  );
}