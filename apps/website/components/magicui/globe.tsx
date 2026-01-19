"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { cn } from "@111-network/ui";

interface GlobeProps {
  className?: string;
}

export function Globe({ className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) {
      return;
    }

    const getSize = () => {
      const innerDiv = containerRef.current?.querySelector('div');
      if (innerDiv) {
        return {
          width: innerDiv.offsetWidth || 384,
          height: innerDiv.offsetHeight || 384,
        };
      }
      return { width: 384, height: 384 };
    };

    const { width, height } = getSize();

    try {
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: width * 2,
        height: height * 2,
        phi: 0,
        theta: 0.3,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [1, 0.2, 0.2],
        glowColor: [1, 1, 1],
        markers: [
          { location: [37.7749, -122.4194], size: 0.1 }, // San Francisco
          { location: [40.7128, -74.0060], size: 0.1 }, // New York
          { location: [51.5074, -0.1278], size: 0.1 }, // London
          { location: [35.6762, 139.6503], size: 0.1 }, // Tokyo
          { location: [-33.8688, 151.2093], size: 0.1 }, // Sydney
          { location: [-23.5505, -46.6333], size: 0.1 }, // São Paulo
          { location: [19.0760, 72.8777], size: 0.1 }, // Mumbai
        ],
        onRender: (state) => {
          phiRef.current += 0.005;
          state.phi = phiRef.current;
        },
      });

      // Fade in canvas
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = "1";
        }
      }, 100);
    } catch (error) {
      console.error("Failed to create globe:", error);
    }

    const handleResize = () => {
      if (globeRef.current && containerRef.current) {
        const { width: newWidth, height: newHeight } = getSize();
        // Update globe size on resize
        if (canvasRef.current) {
          canvasRef.current.width = newWidth * 2;
          canvasRef.current.height = newHeight * 2;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full flex items-center justify-center", className)}>
      <div className="relative w-96 h-96 md:w-[500px] md:h-[500px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-0 transition-opacity duration-500"
        />
      </div>
    </div>
  );
}
