import { useEffect, useRef, useState } from "react";

export  function useInView(threshold = 0.4, root = null) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold, root },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, root]);

  return [ref, visible];
}