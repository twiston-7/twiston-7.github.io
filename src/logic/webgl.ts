export interface ShaderConfig {
  vertexSource: string;
  fragmentSource: string;
  uniforms?: Record<string, string>;
}

export interface WebGLEngineOptions {
  canvas: HTMLCanvasElement;
  shader: ShaderConfig;
  fpsCap?: number;
  onRender?: (gl: WebGLRenderingContext, program: WebGLProgram, uniforms: Record<string, WebGLUniformLocation>) => void;
}

export function createWebGLEngine({ canvas, shader, fpsCap = 30, onRender }: WebGLEngineOptions) {
  let gl: WebGLRenderingContext;
  let program: WebGLProgram;
  let animationId: number;
  let lastFrameTime = 0;
  const frameInterval = 1000 / fpsCap;

  const uniforms: Record<string, WebGLUniformLocation> = {};

  function createShader(type: number, source: string) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(sh) || 'Shader compile error');
    return sh;
  }

  function init() {
    const context = canvas.getContext('webgl');
    if (!context) throw new Error('WebGL not supported');
    gl = context;

    const v = createShader(gl.VERTEX_SHADER, shader.vertexSource);
    const f = createShader(gl.FRAGMENT_SHADER, shader.fragmentSource);
    program = gl.createProgram()!;
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program) || 'Link error');

    const pos = gl.getAttribLocation(program, 'a_position');
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    if (shader.uniforms) {
      for (const name of Object.keys(shader.uniforms)) {
        const loc = gl.getUniformLocation(program, name);
        if (loc) uniforms[name] = loc;
      }
    }

    requestAnimationFrame(render);
  }

  function render(currentTime: number) {
    if (!gl || !program) return;
    if (currentTime - lastFrameTime < frameInterval) {
      animationId = requestAnimationFrame(render);
      return;
    }

    lastFrameTime = currentTime;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    gl.viewport(0, 0, width, height);
    gl.useProgram(program);

    // Call custom render callback to set uniforms
    if (onRender) {
      onRender(gl, program, uniforms);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationId = requestAnimationFrame(render);
  }

  function destroy() {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
  }

  function handleResize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', handleResize);

  return { init, destroy };
}
