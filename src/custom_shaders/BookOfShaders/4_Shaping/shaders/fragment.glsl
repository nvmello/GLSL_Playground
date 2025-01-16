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

/**
  * Double Cubic Set
  * This seat-shaped function is formed by joining two 3rd-order polynomial (cubic) curves. \
  * The curves meet with a horizontal inflection point at the control coordinate (a,b) in the unit square.
  * https://www.flong.com/archive/texts/code/shapers_poly/
*/
float doubleCubicSeat (float x, float a, float b){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  
  float y = 0.;
  if (x <= a){
    y = b - b*pow(1.-x/a, 3.0);
  } else {
    y = b + (1.-b)*pow((x-a)/(1.-a), 3.0);
  }
  return y;
}


/**
	* Double-Cubic Seat with Linear Blend
	* This modified version of the Double-Cubic Seat function uses a single variable to control the location 
	* of its inflection point along the diagonal of the unit square. A second parameter is used to 
	* blend this curve with the Identity Function (y=x). Here, we use the variable b to control the 
	* amount of this blend, which has the effect of tilting the slope of the curve's plateau in the 
	* vicinity of its inflection point. The adjustable flattening around the inflection point makes 
	* this a useful shaping function for lensing or magnifying evenly-spaced data.
	* https://www.flong.com/archive/texts/code/shapers_poly/
*/
float doubleCubicSeatWithLinearBlend (float x, float a, float b){

  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  b = 1.0 - b; //reverse for intelligibility.
  
  float y = 0.;
  if (x<=a){
    y = b*x + (1.-b)*a*(1.-pow(1.-x/a, 3.0));
  } else {
    y = b*x + (1.-b)*(a + (1.-a)*pow((x-a)/(1.-a), 3.0));
  }
  return y;
}

/**
	* Double-Odd-Polynomial Seat
	* The previous Double-Cubic Seat function can be generalized to a form which uses any odd 
	* integer exponent. In the code below, the parameter n controls the flatness or breadth of 
	* the plateau region in the vicinity of the point (a,b). A good working range for n is the 
	* set of whole numbers from 1 to about 20.
	* https://www.flong.com/archive/texts/code/shapers_poly/
*/
float doubleOddPolynomialSeat (float x, float a, float b, int n){

  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 

  int p = 2*n + 1;
  float y = 0.;
  if (x <= a){
    y = b - b*pow(1.-x/a, float(p));
  } else {
    y = b + (1.-b)*pow((x-a)/(1.-a), float(p));
  }
  return y;
}


void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;

	// Step will return 0.0 unless the value is over 0.5,
    // in that case it will return 1.0
    // float y = step(0.5,st.x);

	//exponential example
	// float y = pow(st.x,8.0);

	// Smooth interpolation between 0.1 and 0.9
	// float y = smoothstep(0.1,0.9,st.x);

	//For each position along the x axis this function makes a bump at a particular value of y
	// float y = smoothstep(0.2,0.8,st.x) - smoothstep(0.8,0.99,st.x);

	// float y = doubleCubicSeat(st.x, st.y, 0.5);

	float y = doubleCubicSeatWithLinearBlend(st.x, 0.3, 0.9);

	// float y = doubleOddPolynomialSeat(st.x, 0.5, 0.5, 3);


	//use y to set the background color
	// vec3 color = vec3(y);

	// Start with black background
    vec3 color = vec3(0.0);

	// Draw the green line
    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4(color,1.0);
}