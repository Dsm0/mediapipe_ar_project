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



vec2 warpPoint(vec2 uv, vec2 center, float scale, float mixFactor) {
  vec2 newUV = vec2(1.0 - uv.x, uv.y);
  newUV = (newUV - 0.5) * scale + 0.5;
  vec2 huh = (newUV - 0.5) * vec2(pow(center.x, 2.0), pow(center.y, 2.0)) + 0.5;
  vec2 ahhh = barrelDistort(huh, -1.0 * mixFactor * 0.125);
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

    float eyeScale = 5.1 + mixFactorEyes*0.4;
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

    if(drawMovingPoints(uv, leftIris.xy,time,0.001, 2.0,16.0) > 0.0) {
      lineTex = vec4(1.0, 1.0, 1.0, 1.0);
    }
    if(drawMovingPoints(uv, rightIris.xy,time,0.001, 2.0,8.0) > 0.0) {
      lineTex = vec4(1.0, 1.0, 1.0, 1.0);
    }



    vec4 renderWithLines = renderTex + lineTex; 
    renderTex = mix(renderTex, renderWithLines, mixFactor*0.4);

    if(inEyeRegion) {
      vec3 wcolor = renderTex.rgb;
      float wmag = luma(wcolor);
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

      renderTex = mix(vec4(videoColor, 1.0), vec4(color, 1.0), mixFactorEyes*5.0 + 0.8);
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

    // if(drawLine(uv, vec2(0.2, 0.2), vec2(0.8, 0.8), 0.001) > 0.0) {
    //   renderTex = vec4(1.0, 1.0, 1.0, 1.0);
    // }



    // renderTex = renderWithLines;

    gl_FragColor = renderTex * 0.9;
}
`
