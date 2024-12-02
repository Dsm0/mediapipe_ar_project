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
uniform float time;
uniform vec3 nosePosition;

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

vec4 drawPoint(vec2 uv, vec2 center, float radius, vec4 color) {
    if (distance(uv, center) < radius) {
        return color;
    }
    return vec4(0.0, 0.0, 0.0, 0.0);
}


void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 startingUV = uv;

    float eyeScale = 1.0;
    uv = (uv - 0.5) * eyeScale + 0.5;

    // uv.y -= 0.2;

    vec4 renderTex = vec4(0.0, 0.0, 0.0, 0.0);

    float noseFactor = map(abs(nosePosition.z), 0.04, 0.3, 0.0, 1.0) + 0.2;
    float mixFactor = doubleOddPolynomialSeat(noseFactor, 0.7, 0.003, 8.0);


    if(mixFactor > 1.2) {
      uv = min((startingUV - 0.5) * 1.0 + 0.5, uv);
    } else {
      renderTex = renderTex ;
    }


    bool inRightEyeRegion = distanceFromEdge(uv, rightEyePoints) < mixFactor*0.1;
    bool inLeftEyeRegion = distanceFromEdge(uv, leftEyePoints) < mixFactor*0.1;
    bool inEyeRegion = inRightEyeRegion || inLeftEyeRegion;

    vec4 videoTex = texture2D(tVideo, uv);

    vec4 tex = texture2D(tDiffuse,uv);
    tex = filterWhite(tex);

    vec4 prevTex = texture2D(tPrevious, uv);

    float ff = pow(2.0,2.0);



    vec2 pixel = 1.0 / resolution;

    if(inEyeRegion) {
      vec3 wcolor = renderTex.rgb;
      float wmag = luma(wcolor);
      wcolor = hsl2rgb((sin(time * 0.001) * 0.5) + 1.0, 0.2, wmag + 0.5);

      float factor = 20.0;
      float uB = luma(getPrevious(uv + pixel * vec2(0., factor)).rgb);
      float dB = luma(getPrevious(uv + pixel * vec2(0, -factor)).rgb);
      float lB = luma(getPrevious(uv + pixel * vec2(-factor, 0.)).rgb);
      float rB = luma(getPrevious(uv + pixel * vec2(factor, 0.)).rgb);

      vec2 d = vec2(rB - lB, dB - uB);

      vec3 scolor = getPrevious(uv + d * pixel * 10.).rgb * 1.2;

      vec3 color = videoTex.rgb;

      if (luma(wcolor) > luma(scolor) /*webcam darker*/
          && luma(wcolor) * 0.7 + sin(time * 0.1) * 0.01 < luma(scolor)) {
        color = scolor;
      }

      renderTex = mix(videoTex, vec4(color, 1.0), mixFactor);
    }

    // Draw white dot at left iris position
    float dotRadius = 0.003;
    if (distance(uv, leftIris.xy) < dotRadius) {
        renderTex = vec4(1.0, 1.0, 1.0, 1.0);
    }

    float dotRadius2 = 0.003;
    if (distance(uv, rightIris.xy) < dotRadius2) {
        renderTex = vec4(1.0, 1.0, 1.0, 1.0);
    }



    gl_FragColor = renderTex * 0.9;
}
`
