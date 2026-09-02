import type { ShaderConfig } from "@src/logic/webgl";

export const balaroShaderConfig: ShaderConfig = {
  vertexSource: `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `,
  fragmentSource: `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_speed;
    uniform float u_warp;
    uniform vec3 u_color;
    uniform float u_contrast;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                              dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= u_resolution.x / u_resolution.y;
      float t = u_time * u_speed;
      vec2 offset1 = vec2(
        snoise(p * 1.2 + vec2(t * 0.4, t * 0.3)),
        snoise(p * 1.2 + vec2(t * 0.3, -t * 0.4))
      );
      vec2 offset2 = vec2(
        snoise(p * 1.5 + vec2(-t * 0.25, t * 0.35)),
        snoise(p * 1.5 + vec2(t * 0.35, t * 0.25))
      );
      vec2 distorted = p + offset1 * u_warp + offset2 * u_warp;
      float noise1 = snoise(distorted * 1.5 + t * 0.1);
      float noise2 = snoise(distorted * 2.0 - t * 0.08);
      float mixAmt = (noise1 * 0.6 + noise2 * 0.4 + 1.0) * 0.5;
      mixAmt = clamp(mixAmt, 0.0, 1.0);
      vec3 base = u_color;
      vec3 color = base * (0.5 + mixAmt * 0.5);
      color *= (0.9 + 0.1 * vec3(
        snoise(distorted * 0.8 + t * 0.2),
        snoise(distorted * 1.1 - t * 0.15),
        snoise(distorted * 0.6 + t * 0.25)
      ));
      float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
      vec3 contrasted = mix(vec3(0.5), color, clamp(u_contrast * (lum / 0.5), 0.0, 2.0));
      vec3 finalColor = clamp(contrasted, 0.0, 1.0);
      float vignette = 1.0 - length(p) * 0.25;
      finalColor *= vignette;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  uniforms: {
    u_resolution: "2f",
    u_time: "1f",
    u_speed: "1f",
    u_warp: "1f",
    u_color: "3f",
    u_contrast: "1f",
  },
};
