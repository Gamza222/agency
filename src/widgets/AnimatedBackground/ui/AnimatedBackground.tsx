/**
 * Animated Background Component
 * Custom WebGL-based fog effect inspired by vanta.js
 * Uses GPU-accelerated shaders for smooth, infinite animation
 * Animation is handled entirely in CSS for better performance
 */

"use client";

import React, { useEffect, useRef } from "react";
import styles from "./AnimatedBackground.module.scss";
import { ANIMATION_DURATION_MS, ANIMATION_DURATION_S } from "../lib/constants";

// WebGL shader code for fog effect
const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_uv = (a_position + 1.0) * 0.5;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  
  uniform float u_time;
  uniform float u_speed;
  uniform float u_zoom;
  uniform float u_blur;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  
  varying vec2 v_uv;
  
  // Noise function for fog pattern
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Smooth noise
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // Fractal noise for complex patterns
  float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = v_uv;
    
    // Apply zoom
    vec2 centered = (uv - 0.5) * u_zoom + 0.5;
    
    // Animate the fog with time
    vec2 p = centered * 3.0;
    p += vec2(u_time * u_speed * 0.1, u_time * u_speed * 0.15);
    
    // Create flowing fog pattern
    float n = fractalNoise(p);
    
    // Add multiple layers for depth
    float n2 = fractalNoise(p * 1.5 + vec2(u_time * u_speed * 0.08, -u_time * u_speed * 0.12));
    float n3 = fractalNoise(p * 2.0 + vec2(-u_time * u_speed * 0.05, u_time * u_speed * 0.1));
    
    // Combine layers
    float fog = (n * 0.5 + n2 * 0.3 + n3 * 0.2);
    
    // Apply blur factor
    fog = smoothstep(0.3 - u_blur, 0.7 + u_blur, fog);
    
    // Mix colors based on fog density
    vec3 color = mix(u_color1, u_color2, fog);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Helper function to compile shader
function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Helper function to create shader program
function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

// Convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result && result[1] && result[2] && result[3]) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [1, 1, 1];
}

interface AnimatedBackgroundProps {
  onAnimationComplete?: () => void;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  onAnimationComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const animationCompleteRef = useRef(false);

  // Colors from globals.css
  const color1 = "#fcf8ed"; // bone color
  const color2 = "#14100c"; // black color

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    glRef.current = gl;

    // Compile shaders
    const vertexShader = compileShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) {
      console.error("Failed to compile shaders");
      return;
    }

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error("Failed to create program");
      return;
    }

    programRef.current = program;

    // Create full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const speedLocation = gl.getUniformLocation(program, "u_speed");
    const zoomLocation = gl.getUniformLocation(program, "u_zoom");
    const blurLocation = gl.getUniformLocation(program, "u_blur");
    const color1Location = gl.getUniformLocation(program, "u_color1");
    const color2Location = gl.getUniformLocation(program, "u_color2");

    // Validate uniform locations with detailed error reporting
    const uniforms = {
      timeLocation,
      speedLocation,
      zoomLocation,
      blurLocation,
      color1Location,
      color2Location,
    };

    const missingUniforms = Object.entries(uniforms)
      .filter(([_, location]) => !location)
      .map(([name]) => name);

    if (missingUniforms.length > 0) {
      console.error("Failed to get uniform locations:", missingUniforms);
      console.error("Shader info log:", gl.getProgramInfoLog(program));
      console.error(
        "Vertex shader info log:",
        gl.getShaderInfoLog(vertexShader)
      );
      console.error(
        "Fragment shader info log:",
        gl.getShaderInfoLog(fragmentShader)
      );
      return;
    }

    // Get attribute location
    const positionLocation = gl.getAttribLocation(program, "a_position");

    // Convert colors to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    // Animation parameters
    const speed = 1.7;
    const zoom = 1.3;
    const blur = 0.65;

    // Animation loop - only handles fog rendering, not entrance animation
    const animate = (currentTime: number) => {
      if (!gl || !program) return;

      // Start time tracking for fog animation
      if (startTimeRef.current === 0) {
        startTimeRef.current = currentTime;
      }

      // Calculate fog animation time (starts after entrance animation completes)
      const fogTime = (currentTime - startTimeRef.current) / 1000;

      // Clear canvas
      gl.clearColor(rgb1[0], rgb1[1], rgb1[2], 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Use program
      gl.useProgram(program);

      // Set uniforms
      gl.uniform1f(timeLocation, fogTime);
      gl.uniform1f(speedLocation, speed);
      gl.uniform1f(zoomLocation, zoom);
      gl.uniform1f(blurLocation, blur);
      gl.uniform3f(color1Location, rgb1[0], rgb1[1], rgb1[2]);
      gl.uniform3f(color2Location, rgb2[0], rgb2[1], rgb2[2]);

      // Set up attributes
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    startTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    // Track animation completion (2000ms animation + 1000ms delay = 3000ms total)
    const animationDuration = ANIMATION_DURATION_MS + 1000; // 2000ms + 1000ms delay
    const animationTimer = setTimeout(() => {
      if (!animationCompleteRef.current && onAnimationComplete) {
        animationCompleteRef.current = true;
        onAnimationComplete();
      }
    }, animationDuration);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(animationTimer);
    };
  }, [onAnimationComplete]);

  // Calculate initial transform values (matching START constants)

  return (
    <div
      className={styles.background}
      style={{
        // Set CSS custom properties for animation duration
        // These can be accessed from other components via getComputedStyle
        ["--animation-duration" as string]: `${ANIMATION_DURATION_S}s`,
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.canvas} style={{}} />
      <div className={styles.backgroundOverlay} />
    </div>
  );
};
