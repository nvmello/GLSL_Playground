// Fragment shader for the Bloom-inspired header animation
#version 300 es
precision highp float;

// Input/output variables
in vec2 uv;
out vec4 outColor;

// Uniforms
uniform float time;        // Time in seconds for animation
uniform vec2 resolution;   // Canvas resolution for aspect ratio correction

/**
 * Generates smooth noise based on position and time
 * Uses bilinear interpolation with smoothstep for organic movement
 */
float noise(vec2 p) {
    vec2 i = floor(p);    // Integer part of position
    vec2 f = fract(p);    // Fractional part of position
    
    // Smoothstep interpolation
    f = f * f * (3.0 - 2.0 * f);
    
    // Generate random values at grid points
    float a = sin(i.x + i.y * 24.1 + time);
    float b = sin(i.x + 1.0 + i.y * 24.1 + time);
    float c = sin(i.x + (i.y + 1.0) * 24.1 + time);
    float d = sin(i.x + 1.0 + (i.y + 1.0) * 24.1 + time);
    
    // Interpolate between the four points
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y) * 0.5 + 0.5;
}

void main() {
    // Convert fragment coordinates to centered UV space
    vec2 pos = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    pos.x *= resolution.x / resolution.y;    // Correct for aspect ratio
    
    // Animation speed control
    float flowSpeed = 0.2;
    
    // Generate three layers of noise at different scales and speeds
    float n1 = noise(pos + time * flowSpeed);
    float n2 = noise(pos * 2.0 - time * flowSpeed * 1.5);
    float n3 = noise(pos * 3.0 + time * flowSpeed * 2.0);
    
    // Define base colors for mixing
    vec3 color1 = vec3(0.9, 0.0, 0.3);  // Purple
    vec3 color2 = vec3(0.9, 0.1, 0.2);  // Blue
    vec3 color3 = vec3(0.9, 0.1, 0.5);  // Warm accent
    
    // Mix colors based on noise values
    vec3 finalColor = color1 * n1 + color2 * n2 + color3 * n3;
    
    // Add vignette effect
    float vignette = 1.0 - length(pos * 0.5);
    finalColor *= vignette * 1.2;
    
    // Add subtle pulsing effect
    finalColor += 0.1 * sin(time + length(pos));
    
    // Output final color
    outColor = vec4(finalColor, 1.0);
}