"use client";

import { useRef, useCallback } from "react";
import WebGLCanvas from "@components/backgrounds/WebGLCanvas";
import { balaroShaderConfig } from "@src/logic/shaders/balatro";
import {
  createColorAnimationState,
  updateColorAnimation,
} from "@src/logic/colorAnimation";

export default function WebGLBackground() {
  const colorStateRef = useRef(createColorAnimationState());
  const startTimeRef = useRef<number>(0);
  const lastDeltaRef = useRef<number>(0);

  const handleRender = useCallback(
    (
      gl: WebGLRenderingContext,
      program: WebGLProgram,
      uniforms: Record<string, WebGLUniformLocation>,
      deltaTime: number,
      elapsedTime: number
    ) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = Date.now();
      }

      lastDeltaRef.current += deltaTime;
      updateColorAnimation(colorStateRef.current, lastDeltaRef.current, 120);
      lastDeltaRef.current = 0;

      const width = gl.canvas.width;
      const height = gl.canvas.height;

      gl.uniform2f(uniforms.u_resolution, width, height);
      gl.uniform1f(uniforms.u_time, elapsedTime);
      gl.uniform1f(uniforms.u_speed, 0.15);
      gl.uniform1f(uniforms.u_warp, 0.3);
      gl.uniform3f(
        uniforms.u_color,
        colorStateRef.current.current[0],
        colorStateRef.current.current[1],
        colorStateRef.current.current[2]
      );
      gl.uniform1f(uniforms.u_contrast, 2.5);
    },
    []
  );

  return (
    <WebGLCanvas shader={balaroShaderConfig} onRender={handleRender} fpsCap={30} />
  );
}
