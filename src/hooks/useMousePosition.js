import { useState, useEffect } from 'react';

const useMousePosition = (screenElement) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  useEffect(() => {
    const updateMousePosition = ev => {
      const elX = ev.clientX - screenElement?.getBoundingClientRect().left;
      const elY = ev.clientY - screenElement?.getBoundingClientRect().top;
      setMousePosition({ x: elX, y: elY });
    };
    screenElement?.addEventListener('mousemove', updateMousePosition);

    return () => {
      screenElement?.removeEventListener('mousemove', updateMousePosition);
    };
  }, [screenElement]);

  return mousePosition;
};
export default useMousePosition;
