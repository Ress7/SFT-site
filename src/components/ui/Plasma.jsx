import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Helper to parse hex color
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ];
};

const vertex = `
precision highp float;
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragment = `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = (length(rgb) * 0.8 + 0.2) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}
`;

export default function Plasma({
  color = '#ffffff',
  speed = 1,
  direction = 'forward',
  scale = 1,
  opacity = 1,
  mouseInteractive = true
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const customColorRgb = hexToRgb(color);
    const useCustomColor = color ? 1.0 : 0.0;
    const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(container.clientWidth * renderer.getPixelRatio(), container.clientHeight * renderer.getPixelRatio()) },
        uCustomColor: { value: new THREE.Vector3(...customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: uniforms,
        glslVersion: THREE.GLSL3,
        depthWrite: false,
        depthTest: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let raf;
    const start = performance.now();

    const animate = () => {
        raf = requestAnimationFrame(animate);
        const time = (performance.now() - start) * 0.001;
        
        if (direction === 'pingpong') {
            const pingpongDuration = 10;
            const segmentTime = time % pingpongDuration;
            const isForward = Math.floor(time / pingpongDuration) % 2 === 0;
            const u = segmentTime / pingpongDuration;
            const smooth = u * u * (3 - 2 * u);
            const pingpongTime = isForward ? smooth * pingpongDuration : (1 - smooth) * pingpongDuration;
            uniforms.iTime.value = pingpongTime;
        } else {
            uniforms.iTime.value = time;
        }
        
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        const dpr = renderer.getPixelRatio();
        uniforms.iResolution.value.set(w * dpr, h * dpr);
    };

    const handleMouseMove = (e) => {
        if (!mouseInteractive) return;
        const rect = container.getBoundingClientRect();
        uniforms.uMouse.value.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    if (mouseInteractive) {
        container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        if (mouseInteractive && container) {
            container.removeEventListener('mousemove', handleMouseMove);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        if (container && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
    };
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return (
    <div 
        ref={containerRef} 
        className="plasma-container" 
        style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }} 
    />
  );
}