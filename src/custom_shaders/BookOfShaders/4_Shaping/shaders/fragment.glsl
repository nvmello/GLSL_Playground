#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

/**
 Plot a line on Y using a value between 0.0-1.0
 Takes a 2D coordinate (st)
 calculates how far a point is from the y=x diagonal line, creates a smooth transition
 Returns 1.0 when distance is 0.0 
 Returns 0.0 when distance is 0.01 or greater
 */
float plot(vec2 st, float pct) {    
    return smoothstep(pct - 0.01, pct, st.y) - smoothstep(pct, pct + 0.01, st.y);
}

// void main() {
// 	vec2 st = gl_FragCoord.xy/u_resolution; //gl_FragCoord.xy gives the normalized pixel coordinates

//     float y = pow(st.x,8.0); //Takes the x coordinate (st.x, which is normalized between 0 and 1). Raises it to the power of 8.0
	
//     vec3 color = vec3(y); //Creates a grayscale gradient from black (0,0,0) to white (1,1,1)

// 	float pct = plot(st, y); //pct is 1.0 on the line, 0.0 elsewhere

// 	color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0); //keeps the background gradient where pct is 0, adds green where pct is 1

// 	gl_FragColor = vec4(color,1.0); //Sets the final pixel color. Converts vec3 color to vec4 by adding 1.0 alpha (fully opaque)
// }

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;

	// Step will return 0.0 unless the value is over 0.5,
    // in that case it will return 1.0
    // float y = step(0.5,st.x);

	// Smooth interpolation between 0.1 and 0.9
	// float y = smoothstep(0.1,0.9,st.x);
	float y = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);

	vec3 color = vec3(y);

    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4(color,1.0);
}