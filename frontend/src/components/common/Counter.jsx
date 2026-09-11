import React, { useState, useEffect, useRef } from "react";

const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasStarted]);
    
    useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Use easeOutQuad for smoother finish
        const easeProgress = progress * (2 - progress);
        const rawCount = easeProgress * end;
        
        // If end is a decimal, show one decimal place
        const currentCount = Number.isInteger(end) 
        ? Math.floor(rawCount) 
        : rawCount.toFixed(1);
        
        setCount(currentCount);

        if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
        }
};
