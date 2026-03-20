/**
 * Wave Fragment Shader
 */
export const waveFragmentShader = `/**
 * Wave Fragment Shader
 *
 * Creates an animated wave effect using Perlin noise and fractal Brownian motion (fbm).
 * Supports optional mouse interaction for additional visual effects.
 *
 * Uniforms:
 * @uniform {vec2} resolution - Canvas resolution in pixels
 * @uniform {float} time - Time in seconds for animation
 * @uniform {float} waveSpeed - Speed of wave animation
 * @uniform {float} waveFrequency - Frequency of wave pattern
 * @uniform {float} waveAmplitude - Amplitude of wave effect
 * @uniform {vec3} waveColor - RGB color of the wave (0.0-1.0)
 * @uniform {float} colorNum - Number of quantized color levels
 * @uniform {float} pixelSize - Pixel block size for the retro effect
 * @uniform {vec2} mousePos - Mouse position in screen coordinates
 * @uniform {int} enableMouseInteraction - Enable/disable mouse interaction (0/1)
 * @uniform {float} mouseRadius - Radius of mouse influence
 *
 * Functions:
 * @function {vec4} mod289 - Modulo 289 operation for Perlin noise
 * @function {vec4} permute - Permutation for Perlin noise
 * @function {vec4} taylorInvSqrt - Taylor series inverse square root
 * @function {vec2} fade - Smooth interpolation function
 * @function {float} cnoise - 2D Perlin noise function
 * @function {float} fbm - Fractal Brownian motion with multiple octaves
 * @function {float} pattern - Creates wave pattern using nested fbm
 */
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform float colorNum;
uniform float pixelSize;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2));
}

vec3 applyRetroDither(vec2 fragCoord, vec3 color) {
  vec2 quantizedFragCoord = pixelSize * floor(fragCoord / pixelSize);
  int x = int(mod(quantizedFragCoord.x / pixelSize, 8.0));
  int y = int(mod(quantizedFragCoord.y / pixelSize, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / max(colorNum - 1.0, 1.0);
  vec3 adjusted = clamp(color + threshold * step - 0.2, 0.0, 1.0);
  return floor(adjusted * max(colorNum - 1.0, 1.0) + 0.5) /
    max(colorNum - 1.0, 1.0);
}

void main() {
  vec2 pixelCoord = pixelSize * floor(gl_FragCoord.xy / pixelSize);
  vec2 uv = pixelCoord / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  col = applyRetroDither(gl_FragCoord.xy, col);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Wave Vertex Shader
 */
export const waveVertexShader = `/**
 * Wave Vertex Shader
 *
 * A simple vertex shader that passes UV coordinates through to the fragment shader.
 * Used for the wave animation effect in the Dither component.
 *
 * @varying {vec2} vUv - UV coordinates passed to fragment shader
 */
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;
