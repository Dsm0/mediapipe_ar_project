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
uniform vec3 facePoints[15];
uniform float time;
varying vec2 vUv;

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

vec3 hsl2rgb(float h, float s, float l) { return hsl2rgb(vec3(h, s, l)); }

float luma(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }

// This function checks if a given 2D point is inside a polygon defined by a set of 3D points.
// The polygon is assumed to be a simple polygon (not self-intersecting).
bool isInsideEye(vec2 point, vec3 polygon[15]) {
    bool inside = false; // Initialize a flag to track if the point is inside the polygon
    int j = 14; // Initialize the index of the previous point in the polygon

    // Iterate over each point in the polygon
    for (int i = 0; i < 15; i++) {
        // Convert the current and previous 3D points to 2D points
        vec2 pi = vec2((polygon[i].x), (polygon[i].y));
        vec2 pj = vec2((polygon[j].x), (polygon[j].y));

        // Check if the point is on the edge formed by pi and pj
        if (((pi.y > point.y) != (pj.y > point.y)) &&
            (point.x < (pj.x - pi.x) * (point.y - pi.y) / (pj.y - pi.y) + pi.x)) {
            // If the point is on the edge, toggle the inside flag
            inside = !inside;
        }
        // Move to the next point in the polygon
        j = i;
    }
    // Return the final state of the inside flag
    return inside;
}

vec4 getPrevious(vec2 uv) {
  return texture2D(tPrevious, uv);
}

vec4 createEchoEffect(vec2 uv, vec4 currentFrame) {
  // Create offset coordinates for echo trail
  vec2 echo_offset = (uv - 0.5) * 0.01;

  // Sample the previous frame with offset
  vec4 echo = getPrevious(uv + echo_offset);

  // Mix current frame with echo
  // Adjust these values to control echo intensity and decay
  float echo_strength = 0.5; // Echo persistence (0-1)
  float current_strength = 0.95; // Current frame intensity

  return mix(currentFrame * current_strength, echo, echo_strength);
}

vec4 filterWhite(vec4 point) {
  if(point.r == 1.0 && point.g == 1.0 && point.b == 1.0) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }
  return point;
}

void main() {
    vec2 uv = vUv;
    vec2 d = uv - 0.5;
    float r2 = dot(d, d);

    vec2 pixel = 1.0 / resolution;

    float barrel = 1.0 + r2 * (distortion + distortion2 * r2);

    uv = 0.5 + (d * barrel * scale);

    bool inRightEyeRegion = isInsideEye(uv, rightEyePoints);
    bool inLeftEyeRegion = isInsideEye(uv, leftEyePoints);
    bool inEyeRegion = inRightEyeRegion || inLeftEyeRegion;

    vec2 videoUV = (uv - 0.5) * 1.28 + 0.5;
    videoUV.y = (videoUV.y - 0.5) * 1.1 + 0.5;
    vec4 videoTex = texture2D(tVideo, videoUV);

    vec4 tex = texture2D(tDiffuse, uv);
    tex = filterWhite(tex);

    vec4 prevTex = texture2D(tPrevious, uv);

    tex = videoTex;

    // tex = mix(tex, prevTex, 0.5);


    // shamelessly stolen from https://github.com/MaxBittker/shaderbooth/blob/0c48cf148479fc095a582fd63a705375841ae6cd/src/prefix.glsl#L393
    // big ups Max Bittker

    vec3 color = vec3(0.0, 0.0, 0.0);

    if (inEyeRegion) {

      vec3 wcolor = tex.rgb;
      float wmag = luma(wcolor);
      wcolor = hsl2rgb((sin(time * 0.001) * 0.5) + 1.0, 0.2, wmag + 0.5);

      int n = 5;
      float uB = luma(getPrevious(uv + pixel * vec2(0., 2.0)).rgb);
      float dB = luma(getPrevious(uv + pixel * vec2(0, -2.0)).rgb);
      float lB = luma(getPrevious(uv + pixel * vec2(-2.0, 0.)).rgb);
      float rB = luma(getPrevious(uv + pixel * vec2(2.0, 0.)).rgb);

      vec2 d = vec2(rB - lB, dB - uB);

      vec3 scolor = getPrevious(uv + d * pixel * 10.).rgb;

      tex = vec4(color, 1.0);

      if (luma(wcolor) > luma(scolor) /*webcam darker*/
       && luma(wcolor) * 0.7 + sin(time * 1.) * 0.1 < luma(scolor)) {
        color = scolor;
      }

      tex = vec4(color, 1.0);


      // barrel = 1.0 + r2 * (distortion2 * r2);
      color = videoTex.rgb;
    }

    // Draw an unfilled square border

    // float border = 0.01; // Border thickness
    // if ((abs(uv.x - 0.5) > 0.5 - border && abs(uv.x - 0.5) < 0.5) ||
    //     (abs(uv.y - 0.5) > 0.5 - border && abs(uv.y - 0.5) < 0.5)) {
    //     tex = vec4(1.0, 0.0, 0.0, 1.0); // Red border
    // }


    for (float y = 0.25; y <= 0.75; y += 0.25) {
        for (float x = 0.25; x <= 0.75; x += 0.25) {
            if (abs(uv.x - x) < 0.005 && abs(uv.y - y) < 0.005) {
                tex = vec4(1.0, 1.0, 1.0, 1.0); // White dot
            }
        }
    }

    // vec4 echo_result = createEchoEffect(uv, videoTex);
    // gl_FragColor = echo_result;

    gl_FragColor = prevTex;

    // Optional: Add some decay to prevent infinite buildup
    // gl_FragColor *= 0.29;

}
`
