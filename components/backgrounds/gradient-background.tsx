import { useRef, useCallback } from "react";
import WebGLCanvas from "@components/backgrounds/WebGLCanvas";
import { simpleGradientShaderConfig } from "@src/logic/shaders/example-gradient";

export default function GradientBackground() {
  const startTimeRef = useRef<number>(0);

  const handleRender = useCallback(
    (gl, program, uniforms, deltaTime, elapsedTime) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = Date.now();
      }

      gl.uniform2f(uniforms.u_resolution, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(uniforms.u_time, elapsedTime);
      gl.uniform3f(uniforms.u_color1, 0.2, 0.5, 0.9);
      gl.uniform3f(uniforms.u_color2, 0.9, 0.3, 0.7);
    },
    []
  );

  return (
    <WebGLCanvas
      shader={simpleGradientShaderConfig}
      onRender={handleRender}
      fpsCap={30}
    />
  );
}
