import React, { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js"; // Importing the library correctly

const FireworksComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // if (containerRef.current) {
      // Initialize fireworks
      const fireworks = new Fireworks(containerRef.current, {
        speed: 2,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        trace: 3,
        explosion: 5,
      });

      fireworks.start();

      // Cleanup: Stop fireworks on component unmount
      return () => {
        fireworks.stop();
      };
    // }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        background: "black",
        zIndex: "1",
      }}
    ></div>
  );
};

export default FireworksComponent;
