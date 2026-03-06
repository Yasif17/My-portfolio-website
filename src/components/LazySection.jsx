import { useEffect, useRef, useState } from "react";

export default function LazySection({ children, threshold = 0.2 }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? children : <div style={{ height: "80vh" }} />}
    </div>
  );
}