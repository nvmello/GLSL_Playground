precision mediump float;

uniform float time;
uniform vec2 resolution;

float N21(vec2 p) {
    return fract(sin(p.x * 100.0 + p.y * 6389.0) * 4012.0);
}

float SmoothNoise(vec2 uv) {
    vec2 lv = fract(uv);
    vec2 id = floor(uv);
    
    lv = lv * lv * (3.0 - 2.0 * lv); // manual smoothstep
    float bl = N21(id);
    float br = N21(id + vec2(1.0, 0.0));
    float b = mix(bl, br, lv.x);
    
    float tl = N21(id + vec2(0.0, 1.0));
    float tr = N21(id + vec2(1.0, 1.0));
    float t = mix(tl, tr, lv.x);
    
    return mix(b, t, lv.y);
}

float SmoothNoise2(vec2 uv) {
    float c = SmoothNoise(uv * 4.0);
    c += SmoothNoise(uv * 8.0) * 0.5;
    c += SmoothNoise(uv * 16.0) * 0.25;
    c += SmoothNoise(uv * 32.0) * 0.125;
    c += SmoothNoise(uv * 64.0) * 0.0625;
    
    return c / 2.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy/resolution;
    
    uv += time * 0.1;
   
    float c = SmoothNoise2(uv);
    vec3 col = vec3(c);
    
    gl_FragColor = vec4(col, 1.0);
}