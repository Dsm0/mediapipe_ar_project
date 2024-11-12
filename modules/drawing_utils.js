/**
 * Drawing utilities library
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Default drawing styles
const DEFAULT_STYLES = {
    color: 0xffffff,
    lineWidth: 4,
    radius: 6,
    visibilityMin: 0.5
};

/**
 * Creates a Three.js scene, camera and renderer
 */
function createScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    camera.position.z = 2;

    return { scene, camera, renderer };
}

/**
 * Merges drawing options with defaults
 */
function mergeWithDefaults(options) {
    options = options || {};
    return Object.assign({}, DEFAULT_STYLES, {
        fillColor: options.color
    }, options);
}

/**
 * Evaluates a value or function
 */
function evaluateValue(value, context) {
    return value instanceof Function ? value(context) : value;
}

/**
 * Draws landmarks in 3D space
 */
function drawLandmarks(scene, landmarks, options) {
    if (!landmarks) return;

    options = mergeWithDefaults(options);

    const geometry = new THREE.SphereGeometry(options.radius / 100, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: options.color,
        depthTest: false
    });

    landmarks.forEach((landmark, index) => {
        if (!landmark || (landmark.visibility && landmark.visibility <= options.visibilityMin)) {
            return;
        }

        const mesh = new THREE.Mesh(geometry, material);
        // Convert from normalized coordinates to Three.js coordinates
        mesh.position.set(
            (landmark.x - 0.5) * 2,
            -(landmark.y - 0.5) * 2,
            landmark.z || 0
        );
        scene.add(mesh);
    });
}

/**
 * Draws connectors between landmarks in 3D space
 */
function drawConnectors(scene, landmarks, connections, options) {
    if (!landmarks || !connections) return;

    options = mergeWithDefaults(options);

    const material = new THREE.LineBasicMaterial({
        color: options.color,
        linewidth: options.lineWidth,
        depthTest: false
    });

    connections.forEach((connection, index) => {
        const from = landmarks[connection[0]];
        const to = landmarks[connection[1]];

        if (!from || !to) return;

        const fromVisible = !from.visibility || from.visibility > options.visibilityMin;
        const toVisible = !to.visibility || to.visibility > options.visibilityMin;

        if (fromVisible && toVisible) {
            const points = [
                new THREE.Vector3(
                    (from.x - 0.5) * 2,
                    -(from.y - 0.5) * 2,
                    from.z || 0
                ),
                new THREE.Vector3(
                    (to.x - 0.5) * 2,
                    -(to.y - 0.5) * 2,
                    to.z || 0
                )
            ];

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
        }
    });
}

/**
 * Draws a single point in 3D space
 */
function drawPoint(scene, point, options) {
    if (!point) return;

    options = mergeWithDefaults(options);

    const geometry = new THREE.SphereGeometry(options.radius / 100, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: options.color,
        depthTest: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    // Convert from normalized coordinates to Three.js coordinates
    mesh.position.set(
        (point.x - 0.5) * 2,
        -(point.y - 0.5) * 2,
        point.z || 0
    );
    scene.add(mesh);
}

// Export functions to global scope
if (typeof window !== 'undefined') {
    window.createScene = createScene;
    window.drawLandmarks = drawLandmarks;
    window.drawConnectors = drawConnectors;
    window.drawPoint = drawPoint;
}
