const fragmentShader = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D tPrevious;
uniform sampler2D tVideo;
uniform float distortion;
uniform float distortion2;
uniform float scale;
uniform vec2 resolution;
uniform vec3 leftEyePoints[15];
uniform vec3 rightEyePoints[15];

uniform vec3 leftIris;
uniform vec3 rightIris;

uniform vec3 facePoints[15];
uniform vec2 eyeBlink;
uniform float time;
uniform float noseFactor;

bool invert = false;

// some functiomns shamelessly stolen from https://github.com/MaxBittker/shaderbooth/blob/0c48cf148479fc095a582fd63a705375841ae6cd/src/prefix.glsl#L393
// big ups Max Bittker

float hue2rgb(float f1, float f2, float hue) {
  // http://www.chilliant.com/rgb2hsv.html

  if (hue < 0.0)
    hue += 1.0;
  else if (hue > 1.0)
    hue -= 1.0;
  float res;
  if ((6.0 * hue) < 1.0)
    res = f1 + (f2 - f1) * 6.0 * hue;
  else if ((2.0 * hue) < 1.0)
    res = f2;
  else if ((3.0 * hue) < 2.0)
    res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
  else
    res = f1;
  return res;
}

// Color Space Conversion

vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb;

  if (hsl.y == 0.0) {
    rgb = vec3(hsl.z); // Luminance
  } else {
    float f2;

    if (hsl.z < 0.5)
      f2 = hsl.z * (1.0 + hsl.y);
    else
      f2 = hsl.z + hsl.y - hsl.y * hsl.z;

    float f1 = 2.0 * hsl.z - f2;

    rgb.r = hue2rgb(f1, f2, hsl.x + (1.0 / 3.0));
    rgb.g = hue2rgb(f1, f2, hsl.x);
    rgb.b = hue2rgb(f1, f2, hsl.x - (1.0 / 3.0));
  }
  return rgb;
}



float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 hsl2rgb(float h, float s, float l) { return hsl2rgb(vec3(h, s, l)); }

float luma(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }

// This function checks if a given 2D point is inside a polygon defined by a set of 3D points.
// The polygon is assumed to be a simple polygon (not self-intersecting).
float distanceFromEdge(vec2 point, vec3 polygon[15]) {
    float minDistance = 1e10; // Initialize with a large number
    int j = 14; // Initialize the index of the previous point in the polygon

    bool inside = false;

    // Iterate over each point in the polygon
    for (int i = 0; i < 15; i++) {
        // Convert the current and previous 3D points to 2D points
        vec2 pi = vec2((polygon[i].x), (polygon[i].y));
        vec2 pj = vec2((polygon[j].x), (polygon[j].y));

        // Calculate the distance from the point to the edge formed by pi and pj
        vec2 edge = pj - pi;
        vec2 toPoint = point - pi;
        float edgeLength = length(edge);
        float projection = dot(toPoint, edge) / edgeLength;
        vec2 closestPoint;

        if (projection < 0.0) {
            closestPoint = pi;
        } else if (projection > edgeLength) {
            closestPoint = pj;
        } else {
            closestPoint = pi + projection * normalize(edge);
        }


        if (((pi.y > point.y) != (pj.y > point.y)) &&
            (point.x < (pj.x - pi.x) * (point.y - pi.y) / (pj.y - pi.y) + pi.x)) {
            // If the point is on the edge, toggle the inside flag
            inside = !inside;
        }

        float distance = length(point - closestPoint);
        minDistance = min(minDistance, distance);

        // Move to the next point in the polygon
        j = i;
    }

    // Return the minimum distance from the point to the polygon's edge
    return inside ? -minDistance : minDistance;
}


vec2 textPoints[50] = vec2[50](
    vec2(0.12, 0.34), vec2(0.45, 0.67), vec2(0.89, 0.23), vec2(0.56, 0.78), vec2(0.34, 0.90),
    vec2(0.67, 0.12), vec2(0.23, 0.45), vec2(0.78, 0.89), vec2(0.90, 0.56), vec2(0.12, 0.78),
    vec2(0.45, 0.90), vec2(0.89, 0.12), vec2(0.56, 0.45), vec2(0.34, 0.67), vec2(0.67, 0.89),
    vec2(0.23, 0.56), vec2(0.78, 0.34), vec2(0.90, 0.67), vec2(0.12, 0.89), vec2(0.45, 0.23),
    vec2(0.89, 0.56), vec2(0.56, 0.34), vec2(0.34, 0.78), vec2(0.67, 0.90), vec2(0.23, 0.12),
    vec2(0.78, 0.45), vec2(0.90, 0.89), vec2(0.12, 0.56), vec2(0.45, 0.34), vec2(0.89, 0.67),
    vec2(0.56, 0.90), vec2(0.34, 0.23), vec2(0.67, 0.45), vec2(0.23, 0.89), vec2(0.78, 0.56),
    vec2(0.90, 0.34), vec2(0.12, 0.67), vec2(0.45, 0.78), vec2(0.89, 0.90), vec2(0.56, 0.12),
    vec2(0.34, 0.45), vec2(0.67, 0.67), vec2(0.23, 0.34), vec2(0.78, 0.78), vec2(0.90, 0.23),
    vec2(0.12, 0.45), vec2(0.45, 0.89), vec2(0.89, 0.34), vec2(0.56, 0.67), vec2(0.34, 0.12)
);



vec4 getPrevious(vec2 uv) {
  return texture2D(tPrevious, uv);
}

vec4 getVideo(vec2 uv) {
  return texture2D(tVideo, uv);
}

vec4 createEchoEffect(vec2 uv, vec2 offset,vec4 currentFrame,float factor) {
  // Create offset coordinates for echo trail
  vec2 echo_offset = (uv - 0.5) * offset;

  // Sample the previous frame with offset
  vec4 echo = getPrevious(uv);

  // Mix current frame with echo
  // Adjust these values to control echo intensity and decay
  float echo_strength = 0.9; // Echo persistence (0-1)
  float current_strength = 1.0; // Current frame intensity

  return currentFrame * current_strength + echo * echo_strength;
}

vec4 filterWhite(vec4 point) {
  if(point.r == 1.0 && point.g == 1.0 && point.b == 1.0) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }
  return point;
}

vec4 applyChromaticAberration(vec2 uv, float intensity) {
    // Shift the red, green, and blue channels slightly in different directions
    vec2 redOffset = vec2(intensity, 0.0);
    vec2 greenOffset = vec2(0.0, intensity);
    vec2 blueOffset = vec2(-intensity, -intensity);

    // Sample the texture with the offsets
    float r = texture2D(tDiffuse, uv + redOffset).r;
    float g = texture2D(tDiffuse, uv + greenOffset).g;
    float b = texture2D(tDiffuse, uv + blueOffset).b;

    return vec4(r, g, b, 1.0);
}

// https://www.flong.com/archive/texts/code/shapers_poly/
float doubleOddPolynomialSeat (float x, float a, float b, float n){
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 

  float p = 2.0*n + 1.0;
  float y = 0.0;
  if (x <= a){
    y = b - b*pow(1.0-x/a, p);
  } else {
    y = b + (1.0-b)*pow((x-a)/(1.0-a), p);
  }
  return y;
}

float doubleCubicSeat (float x, float a, float b){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  
  float y = 0.0;
  if (x <= a){
    y = b - b*pow(1.0-x/a, 3.0);
  } else {
    y = b + (1.0-b)*pow((x-a)/(1.0-a), 3.0);
  }
  return y;
}

vec4 drawPoint(vec2 uv, vec2 center, float radius, vec4 color) {
    if (distance(uv, center) < radius) {
        return color;
    }
    return vec4(0.0, 0.0, 0.0, 0.0);
}


// fullscreen -> eyes -> things in eyes -> blown up motion going from eyes to edges of the screen, 
//   shit that moves your eyes around the screen


float plotFunction2(float x) {
  return doubleCubicSeat(x,0.4, 0.08);
}

vec4 plotFunction(vec2 uv, vec2 range, float xPos) {
    // Scale and position the graph in top right corner
    vec2 graphPos = vec2(0.75, 0.75); // Center of graph
    float graphSize = 0.2; // Size of graph
    
    // Transform UV to graph space
    vec2 graphUV = (uv - (graphPos - graphSize)) / (graphSize * 2.0);
    
    if(graphUV.x < 0.0 || graphUV.x > 1.0 || graphUV.y < 0.0 || graphUV.y > 1.0) {
        return vec4(0.0);
    }
    
    // Draw axes
    float axisWidth = 0.002;
    if(abs(graphUV.x) < axisWidth || abs(graphUV.y) < axisWidth) {
        return vec4(0.5);
    }
    
    // Map x from [0,1] to [range.x, range.y] before evaluating function
    float x = mix(range.x, range.y, graphUV.x);
    float y = plotFunction2(x);
    
    float lineWidth = 0.001;
    if(abs(y - graphUV.y) < lineWidth) {
        if(abs(x - xPos) < 0.01) {
          return vec4(1.0,0.0,0.0,1.0);
        } else {
          return vec4(1.0);
        }
    }

    return vec4(0.0);
}



// Classic Perlin noise function
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float perlinNoise(vec3 P) {
    vec3 Pi0 = floor(P); // Integer part
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = Pf0 * Pf0 * (3.0 - 2.0 * Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}


vec3 perlinNoiseTexture(vec2 uv, float time) {
    float scale = 4.0;
    float t = time;
    
    float n1 = perlinNoise(vec3(uv * scale, t));
    float n2 = perlinNoise(vec3(uv * scale + 10.0, t + 5.0)); 
    float n3 = perlinNoise(vec3(uv * scale + 20.0, t + 10.0));

    // Create some color variation
    vec3 color;
    color.r = n1 * 0.5 + 0.5;
    color.g = n2 * 0.5 + 0.5; 
    color.b = n3 * 0.5 + 0.5;

    return color;
}



// Draws a line between two points with a given thickness
float drawLine(vec2 uv, vec2 p1, vec2 p2, float thickness) {
    // Convert line segment to vector
    vec2 lineVec = p2 - p1;
    
    // Get vector from point 1 to current UV coord
    vec2 pointVec = uv - p1;
    
    // Project point vector onto line vector
    float t = dot(pointVec, lineVec) / dot(lineVec, lineVec);
    t = clamp(t, 0.0, 1.0);
    
    // Get closest point on line segment
    vec2 projection = p1 + t * lineVec;
    
    // Get distance from UV to closest point
    float dist = length(uv - projection);
    
    // Return 1.0 if within thickness, 0.0 otherwise
    return 1.0 - smoothstep(thickness * 0.5 - 0.001, thickness * 0.5 + 0.001, dist);
}


// Returns a random value between 0 and 1 based on a 2D position
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Draws lines moving outward from center
float drawMovingPoints(vec2 uv, vec2 center, float time, float size, float distance, float startDistance) {
    float lines = 0.0;
    float numLines = 20.0;
    

    float randVal = random(vec2(time, 0.0));

    float randy = random(vec2(time, 0.0));
    
    // For each line
    for(float i = 0.0; i < numLines; i++) {
        // Get random angle and speed for this line
        float angle = random(vec2(i, randy)) * 6.28;
        float speed = random(vec2(i, randy)) * 1.0 + 0.2;

        // Start position at distance d=0.2 from center
        float startDist = 0.2 + random(vec2(i, 2.0)) * 0.3 * startDistance;
        vec2 startPos = center + vec2(cos(angle), sin(angle)) * startDist;
        
        // Calculate end position based on time, starting from startDist
        float dist = startDist + mod(time * speed, 1.0 - startDist);
        vec2 endPos = center + vec2(cos(angle), sin(angle)) * dist * distance;
        
        // Draw line from start position to end position
        float thickness = (1.0 - (dist - startDist)/(1.0 - startDist)) * 0.002; // Line gets thinner as it moves out
        float line = drawLine(uv, startPos, endPos, thickness);
        
        lines = max(lines, line);
    }
    
    return lines;
}

// Applies barrel distortion to UV coordinates
vec2 barrelDistort(vec2 uv, float strength) {
    vec2 center = vec2(0.5);
    vec2 coord = uv - center;
    
    float dist = length(coord);
    float distPow = pow(dist, 2.0);
    
    // Quadratic distortion formula
    float f = 1.0 + distPow * strength;
    
    // Apply distortion
    vec2 distortedCoord = coord * f;
    return distortedCoord + center;
}




// (TAKEN FROM https://www.shadertoy.com/view/4dtGD2)

// Simple Bitmap Text by Gerard Geer
// 
// Essentially a "hmm, how does that work?" educational rewrite of P_Malin's text renderer:
// https://www.shadertoy.com/view/4sBSWW
// Each character is a 4x5 bitmap encoded into a float, where each hex digit convieniently
// represents one row.
// License: Creative Commons CC0 1.0 Universal (CC-0) 

#define _f float
const lowp _f CH_A    = _f(0x69f99), CH_B    = _f(0x79797), CH_C    = _f(0xe111e),
       	  	  CH_D    = _f(0x79997), CH_E    = _f(0xf171f), CH_F    = _f(0xf1711),
		  	  CH_G    = _f(0xe1d96), CH_H    = _f(0x99f99), CH_I    = _f(0xf444f),
		  	  CH_J    = _f(0x88996), CH_K    = _f(0x95159), CH_L    = _f(0x1111f),
		  	  CH_M    = _f(0x9f999), CH_N    = _f(0x9bd99), CH_O    = _f(0x69996),
		  	  CH_P    = _f(0x79971), CH_Q    = _f(0x69b5a), CH_R    = _f(0x79759),
		  	  CH_S    = _f(0xe1687), CH_T    = _f(0xf4444), CH_U    = _f(0x99996),
		  	  CH_V    = _f(0x999a4), CH_W    = _f(0x999f9), CH_X    = _f(0x99699),
    	  	  CH_Y    = _f(0x99e8e), CH_Z    = _f(0xf843f), CH_0    = _f(0x6bd96),
		  	  CH_1    = _f(0x46444), CH_2    = _f(0x6942f), CH_3    = _f(0x69496),
		  	  CH_4    = _f(0x99f88), CH_5    = _f(0xf1687), CH_6    = _f(0x61796),
		  	  CH_7    = _f(0xf8421), CH_8    = _f(0x69696), CH_9    = _f(0x69e84),
		  	  CH_APST = _f(0x66400), CH_PI   = _f(0x0faa9), CH_UNDS = _f(0x0000f),
		  	  CH_HYPH = _f(0x00600), CH_TILD = _f(0x0a500), CH_PLUS = _f(0x02720),
		  	  CH_EQUL = _f(0x0f0f0), CH_SLSH = _f(0x08421), CH_EXCL = _f(0x33303),
		  	  CH_QUES = _f(0x69404), CH_COMM = _f(0x00032), CH_FSTP = _f(0x00002),
    	  	  CH_QUOT = _f(0x55000), CH_BLNK = _f(0x00000), CH_COLN = _f(0x00202),
			  CH_LPAR = _f(0x42224), CH_RPAR = _f(0x24442);
const lowp vec2 MAP_SIZE = vec2(4,5);
#undef flt

/*
	returns the status of a bit in a bitmap. This is done value-wise, so
	the exact representation of the float doesn't really matter.
*/
float getBit( in float map, in float index )
{
    // Ooh -index takes out that divide :)
    return mod( floor( map*exp2(-index) ), 2.0 );
}

/*
	Trades a float for a character bitmap. Here's to eliminating
	branches with step()!
*/
float floatToChar( in float x )
{
    float res = CH_BLNK;
    res += (step(-.5,x)-step(0.5,x))*CH_0;
    res += (step(0.5,x)-step(1.5,x))*CH_1;
    res += (step(1.5,x)-step(2.5,x))*CH_2;
    res += (step(2.5,x)-step(3.5,x))*CH_3;
    res += (step(3.5,x)-step(4.5,x))*CH_4;
    res += (step(4.5,x)-step(5.5,x))*CH_5;
    res += (step(5.5,x)-step(6.5,x))*CH_6;
    res += (step(6.5,x)-step(7.5,x))*CH_7;
    res += (step(7.5,x)-step(8.5,x))*CH_8;
    res += (step(8.5,x)-step(9.5,x))*CH_9;
    return res;
}

/*
	Draws a character, given its encoded value, a position, size and
	current [0..1] uv coordinate.
*/
float drawChar( in float char, in vec2 pos, in vec2 size, in vec2 uv )
{
    // Subtract our position from the current uv so that we can
    // know if we're inside the bounding box or not.
    uv-=pos;
    
    // Divide the screen space by the size, so our bounding box is 1x1.
    uv /= size;    
    
    // Create a place to store the result.
    float res;
    
    // Branchless bounding box check.
    res = step(0.0,min(uv.x,uv.y)) - step(1.0,max(uv.x,uv.y));
    
    // Go ahead and multiply the UV by the bitmap size so we can work in
    // bitmap space coordinates.
    uv *= MAP_SIZE;
    
    // Get the appropriate bit and return it.
    res*=getBit( char, 4.0*floor(uv.y) + floor(uv.x) );
    return clamp(res,0.0,1.0);
}

/*
	Prints a float as an int. Be very careful about overflow.
	This as a side effect will modify the character position,
	so that multiple calls to this can be made without worrying
	much about kerning.
*/
float drawIntCarriage( in int val, inout vec2 pos, in vec2 size, in vec2 uv, in int places )
{
    // Create a place to store the current values.
    float res = 0.0,digit = 0.0;
    // Surely it won't be more than 10 chars long, will it?
    // (MAX_INT is 10 characters)
    for( int i = 0; i < 10; ++i )
    {
        // If we've run out of film, cut!
        if(val == 0 && i >= places) break;
        // The current lsd is the difference between the current
        // value and the value rounded down one place.
        digit = float( val-(val/10)*10 );
        // Draw the character. Since there are no overlaps, we don't
        // need max().
        res += drawChar(floatToChar(digit),pos,size,uv);
        // Move the carriage.
        pos.x -= size.x*1.2;
        // Truncate away this most recent digit.
        val /= 10;
    }
    return res;
}

/*
	Draws an integer to the screen. No side-effects, but be ever vigilant
	so that your cup not overfloweth.
*/
float drawInt( in int val, in vec2 pos, in vec2 size, in vec2 uv )
{
    vec2 p = vec2(pos);
    float s = sign(float(val));
    val *= int(s);
    
    float c = drawIntCarriage(val,p,size,uv,1);
    return c + drawChar(CH_HYPH,p,size,uv)*max(0.0, -s);
}

/*
	Prints a fixed point fractional value. Be even more careful about overflowing.
*/
float drawFixed( in float val, in int places, in vec2 pos, in vec2 size, in vec2 uv )
{
    // modf() sure would be nice right about now.
    vec2 p = vec2(pos);
    float res = 0.0;
    
    // Draw the floating point part.
    res = drawIntCarriage( int( fract(val)*pow(10.0,float(places)) ), p, size, uv, places );
    // The decimal is tiny, so we back things up a bit before drawing it.
    p.x += size.x*.4;
    res = max(res, drawChar(CH_FSTP,p,size,uv)); p.x-=size.x*1.2;
    // And after as well.
    p.x += size.x *.1;
    // Draw the integer part.
    res = max(res, drawIntCarriage(int(floor(val)),p,size,uv,1));
	return res;
}

float textTxt( in vec2 uv ) {

    // Set a general character size...
    vec2 charSize = vec2(.03, .0375);
    // and a starting position.
    vec2 charPos = vec2(0.45, 0.45);
    // Draw some text!
    float chr = 0.0;
    // Bitmap text rendering!
    chr += drawChar( CH_T, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_S, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_T, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_EXCL, charPos, charSize, uv); charPos.x += .04;
    return chr;
}

float lookCloselyTxt( in vec2 uv) {

    // Set a general character size...
    vec2 charSize = vec2(.02, .0370);
    // and a starting position.
    vec2 charPos = vec2(0.3, 0.5);
    // Draw some text!
    float chr = 0.0;
    // Bitmap text rendering!
    chr += drawChar( CH_L, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_O, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_O, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_K, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_BLNK, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_C, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_L, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_O, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_S, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_L, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_Y, charPos, charSize, uv); charPos.x += .04;
    return chr;
}

float eyesOpenWideTxt( in vec2 uv) {

    // Set a general character size...
    vec2 charSize = vec2(.02, .0370);
    // and a starting position.
    vec2 charPos = vec2(0.3, 0.5);
    // Draw some text!
    float chr = 0.0;
    // Bitmap text rendering!
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_Y, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_S, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_BLNK, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_O, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_P, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_N, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_BLNK, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_W, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_I, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_D, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    return chr;
}



float text( in vec2 uv )
{
    // Set a general character size...
    vec2 charSize = vec2(.03, .0375);
    // and a starting position.
    vec2 charPos = vec2(0.05, 0.90);
    // Draw some text!
    float chr = 0.0;
    // Bitmap text rendering!
    chr += drawChar( CH_B, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_I, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_T, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_M, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_A, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_P, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_BLNK, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_T, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_X, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_T, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_BLNK, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_R, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_N, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_D, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_R, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_I, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_N, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_G, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_EXCL, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_EXCL, charPos, charSize, uv); charPos.x += .04;
    
    // Today's Date: {date}
    charPos = vec2(0.05, .75);
    chr += drawChar( CH_T, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_O, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_D, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_A, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_Y, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_APST, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_S, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_BLNK, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_D, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_A, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_T, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_BLNK, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_LPAR, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_M, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_M, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_HYPH, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_D, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_D, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_HYPH, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_Y, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_Y, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_Y, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_Y, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_RPAR, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_COLN, charPos, charSize, uv); charPos.x += .1;
    // The date itself.
    charPos.x += .3;

    // chr += drawIntCarriage( int(iDate.x), charPos, charSize, uv, 4);
    // chr += drawChar( CH_HYPH, charPos, charSize, uv); charPos.x-=.04;
    // chr += drawIntCarriage( int(iDate.z)+1, charPos, charSize, uv, 2);
    // chr += drawChar( CH_HYPH, charPos, charSize, uv); charPos.x-=.04;
    // chr += drawIntCarriage( int(iDate.y)+1, charPos, charSize, uv, 2);
    
    // Shader uptime:
    charPos = vec2(0.05, .6);
    chr += drawChar( CH_I, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_G, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_L, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_O, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_B, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_A, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_L, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_T, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_I, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_M, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_E, charPos, charSize, uv); charPos.x += .04;
    chr += drawChar( CH_COLN, charPos, charSize, uv); charPos.x += .04;
    // The uptime itself.
    charPos.x += .3;
    chr += drawFixed( time, 2, charPos, charSize, uv);
    return chr;
}


vec2 scaleUV(vec2 uv, vec2 center, float scale) {
  return (uv - center) * scale + center;
}






vec2 warpPoint(vec2 uv, vec2 center, float scale, float mixFactor) {
  vec2 newUV = vec2(uv.x, uv.y);
  newUV = (newUV - 0.5) * scale + 0.5;
  // vec2 huh = (newUV - 0.5) * vec2(pow(center.x, 2.0), pow(center.y, 2.0)) + 0.5;
  vec2 ahhh = newUV;
  return ahhh;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    // uv.y -= 0.2;


    vec2 startingUV = uv;

    bool DEBUG = false;

    vec4 renderTex = vec4(0.0, 0.0, 0.0, 0.0);

    // Get midpoint between left and right iris
    vec2 centerIrisPoint = vec2(
        (leftIris.x + rightIris.x) * 0.5,
        (leftIris.y + rightIris.y) * 0.5
    );

    centerIrisPoint.y = sin(centerIrisPoint.y * 1.0);


    float mixFactor = noseFactor;

    float mixFactorEyes = min(mixFactor*0.1, 0.04);

    float eyeScale = 0.96;
    uv = warpPoint(uv, centerIrisPoint, eyeScale, mixFactorEyes);

    bool inRightEyeRegion = distanceFromEdge(uv, rightEyePoints) < mixFactorEyes;
    bool inLeftEyeRegion = distanceFromEdge(uv, leftEyePoints) < mixFactorEyes;
    bool inEyeRegion = inRightEyeRegion || inLeftEyeRegion;

    vec4 videoTex = texture2D(tVideo, uv);

    vec4 tex = texture2D(tDiffuse,uv);
    tex = filterWhite(tex);

    float ff = pow(2.0,2.0);


    vec2 pixel = 1.0 / resolution;

    vec4 lineTex = vec4(0.0, 0.0, 0.0, 0.0);

    // if(drawMovingPoints(uv, leftIris.xy,time,0.001, 2.0,16.0) > 0.0) {
    //   lineTex = vec4(1.0, 1.0, 1.0, 1.0);
    // }
    // if(drawMovingPoints(uv, rightIris.xy,time,0.001, 2.0,8.0) > 0.0) {
    //   lineTex = vec4(1.0, 1.0, 1.0, 1.0);
    // }
    // vec4 renderWithLines = renderTex + lineTex; 
    // renderTex = mix(renderTex, renderWithLines, mixFactor*0.4);

    vec2 warpedUV2 = barrelDistort(scaleUV(uv, centerIrisPoint, 1.0/eyeScale), -2.2);
    uv = mix(uv, warpedUV2, mixFactor*0.4);

    if(inEyeRegion) {
      vec3 wcolor = renderTex.rgb;
      float wmag = luma(wcolor) * 2.0;
      wcolor = hsl2rgb((sin(time * 0.001) * 0.5) + 1.0, 0.2, wmag + 0.5);

      vec2 prevUV = warpPoint(uv, centerIrisPoint, 1.0/eyeScale, mixFactorEyes);

      float factor = 20.0;
      float uB = luma(getPrevious(prevUV + pixel * vec2(0., factor)).rgb);
      float dB = luma(getPrevious(prevUV + pixel * vec2(0, -factor)).rgb);
      float lB = luma(getPrevious(prevUV + pixel * vec2(-factor, 0.)).rgb);
      float rB = luma(getPrevious(prevUV + pixel * vec2(factor, 0.)).rgb);

      vec2 d = vec2(rB - lB, dB - uB);


      vec3 scolor = getPrevious(prevUV + d * pixel * 10.).rgb * 1.0;

      vec3 videoColor = getVideo(uv).rgb;
      vec3 color = videoColor;

      if (luma(wcolor) > luma(scolor) /*webcam darker*/
          && luma(wcolor) * 0.8 + sin(time * 0.1) * 0.01 < luma(scolor)) {
        color = scolor;
      }

      renderTex = mix(vec4(videoColor, 1.0), vec4(color, 1.0), 1.0);
      renderTex *= min(0.15 + mixFactor, 1.0);
      // interesting shit happens when mixFactor is very high
    } else {
      renderTex = mix(getVideo(uv), renderTex, (mixFactor*1.2)+0.7);
    }

    vec2 boundaryUV = vec2(1.0, 1.0);

    // Create border effect around boundaryUV
    float borderWidth = 0.01;
    vec2 distFromBoundary = abs(uv - boundaryUV);

    if(DEBUG) {
      renderTex += plotFunction(uv, vec2(0.0, 2.0), mixFactor);

      // Draw white dot at iris positions
      float dotRadius = 0.0007;
      if (distance(uv, leftIris.xy) < dotRadius) {
        renderTex = vec4(1.0, 1.0, 1.0, 1.0);
      }
      if (distance(uv, rightIris.xy) < dotRadius) {
        renderTex = vec4(1.0, 1.0, 1.0, 1.0);
      }
    }


    // blink white
    if((eyeBlink.x + eyeBlink.y)/2.0 >  0.5) {
      renderTex = mix(renderTex, vec4(1.0, 1.0, 1.0, 1.0), eyeBlink.x+0.4);
    }

    vec2 pointFromList = textPoints[int(floor(time * 15.0)) % 50];



    float txtMixFactor = (1.0 - (noseFactor*0.8));

    vec2 randomUV = vec2(random(uv), random(uv + vec2(1.0, 0.0)));
    vec2 randomMix = mix(vec2(0.5, 0.5), randomUV, min(0.0, txtMixFactor));

    float txt = lookCloselyTxt(scaleUV(uv, randomMix, 8.0));
    float txt2 = eyesOpenWideTxt(scaleUV(uv + vec2(0.0,0.01), randomMix, 8.0));

    txt += txt2;

    float jumpingText = mix(0.0,txt,1.0-noseFactor*2.0);

    vec4 movingPoint = drawPoint(uv, vec2(sin(time*0.1), 0.5), 0.01, vec4(1.0, 1.0, 1.0, 1.0));
    
    gl_FragColor = renderTex * 0.9;
    gl_FragColor += txt;
    gl_FragColor += jumpingText;

    // gl_FragColor += movingPoint;
}
`
