"use client";

import { useEffect, useRef } from "react";
import { createWebGLEngine, type ShaderConfig } from "@src/logic/webgl";
import styles from "@components/backgrounds/webgl-background.module.css";

export interface WebGLCanvasProps {
  shader: ShaderConfig;
  onRender?: (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    uniforms: Record<string, WebGLUniformLocation>,
    deltaTime: number,
    elapsedTime: number
  ) => void;
  fpsCap?: number;
}

export default function WebGLCanvas({
  shader,
  onRender,
  fpsCap = 30,
}: WebGLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    startTimeRef.current = Date.now();
    lastTimeRef.current = Date.now();

    const bg = createWebGLEngine({
      canvas,
      shader,
      fpsCap,
      onRender: (gl, program, uniforms) => {
        const now = Date.now();
        const deltaTime = (now - lastTimeRef.current) / 1000;
        const elapsedTime = (now - startTimeRef.current) / 1000;
        lastTimeRef.current = now;

        if (onRender) {
          onRender(gl, program, uniforms, deltaTime, elapsedTime);
        }
      },
    });

    bg.init();

    return () => {
      bg.destroy();
    };
  }, [shader, onRender, fpsCap]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.webglBackground}
      aria-hidden="true"
    />
  );
}
