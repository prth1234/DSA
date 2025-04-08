// components/ProgressBar.jsx
import React, { useRef, useState, useEffect } from "react";

const ProgressBar = ({ progress, progressKey, variant = "default", progressAnimations }) => {
  const progressRef = useRef(null);
  const animationRef = useRef(null);
  const [displayProgress, setDisplayProgress] = useState(progress);
  
  // Check if we have animation data for this key
  const animation = progressAnimations[progressKey];
  
  useEffect(() => {
    // Clean up previous animation if it exists
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // If we have animation data and it's relatively fresh (less than 2 seconds old)
    if (animation && Date.now() - animation.timestamp < 2000) {
      let startTime;
      const duration = 800; // Animation duration in ms
      
      const animateProgress = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easeOutCubic easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // Calculate current value in the animation
        const currentValue = animation.from + (animation.to - animation.from) * easeProgress;
        setDisplayProgress(currentValue);
        
        // Continue animation if not finished
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateProgress);
        } else {
          // Ensure we reach the exact final value
          setDisplayProgress(animation.to);
        }
      };
      
      // Start animation
      animationRef.current = requestAnimationFrame(animateProgress);
    } else {
      // No animation data or too old, just use the provided progress
      setDisplayProgress(progress);
    }
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [progress, animation]);
  
  // Enhanced gradient that responds to progress
  const getProgressGradient = (value) => {
    // Color scheme changes based on progress
    if (value < 33) {
      return 'linear-gradient(90deg, #F27121 0%, #F27121 100%)';
    } else if (value < 66) {
      return 'linear-gradient(90deg, #F27121 0%, #E94057 100%)';
    } else {
      return 'linear-gradient(90deg, #8A2387 0%, #E94057 50%, #F27121 100%)';
    }
  };
  
  // Make both progress bars the same height (2px)
  const barHeight = "2px";
  const barMargin = variant === "topic" ? "14px" : "12px";
  const shadowIntensity = variant === "topic" ? "0.7" : "0.6";
  
  return (
    <div 
      style={{ 
        width: '100%', 
        height: barHeight,
        backgroundColor: '#f3f3f3', 
        borderRadius: '4px',
        marginBottom: barMargin,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05) inset',
        position: 'relative'
      }}
    >
      <div 
        ref={progressRef}
        style={{
          width: `${displayProgress}%`,
          height: '100%',
          background: getProgressGradient(displayProgress),
          borderRadius: '4px',
          transition: animation ? 'none' : 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: `0 0 8px rgba(242, 113, 33, ${shadowIntensity})`,
          position: 'relative',
          zIndex: 2
        }}
      />
      
      {/* Subtle pulse effect */}
      {animation && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${displayProgress}%`,
            height: '100%',
            background: 'rgba(255, 255, 255, 0.3)',
            filter: 'blur(4px)',
            animation: 'pulse 1.5s ease-in-out',
            zIndex: 1
          }}
        />
      )}
      
      {/* Add global styles for the pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 0.4; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;