import React from "react";
import { Hammer } from "lucide-react";

const HammerLoader = () => {
  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-center">
      {/* Animated Hammer */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <Hammer
          className="w-24 h-24 text-white"
          style={{
            animation: "swing 1s ease-in-out infinite",
            transformOrigin: "50% 50%",
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-white font-bold text-2xl">
        {["L", "O", "A", "D", "I", "N", "G"].map((letter, index) => (
          <span
            key={index}
            className="inline-block animate-bounce"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Ripple Effect */}
      <div className="absolute">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-4 border-white opacity-0"
            style={{
              width: `${(i + 1) * 40}px`,
              height: `${(i + 1) * 40}px`,
              animation: `ripple 1.5s infinite ${i * 0.3}s`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes swing {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-35deg);
          }
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.2;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HammerLoader;
