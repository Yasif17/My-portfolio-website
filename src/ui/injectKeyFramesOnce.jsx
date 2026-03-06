import { useEffect } from "react";

const __nameKeyframes = `
@keyframes nameShine { 
  0% { background-position: -300% 0; } 
  100% { background-position: 300% 0; } 
}
@keyframes blink { 
  0%,49% { opacity: 1; } 
  50%,100% { opacity: 0; } 
}
`;

export default function InjectKeyframesOnce() {
  useEffect(() => {
    if (document.getElementById("name-anim-kf")) return;
    const style = document.createElement("style");
    style.id = "name-anim-kf";
    style.innerHTML = __nameKeyframes;
    document.head.appendChild(style);
  }, []);
  return null;
}