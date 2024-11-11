/**
 * Drawing utilities library
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Default drawing styles
const DEFAULT_STYLES = {
    color: 'white',
    lineWidth: 4,
    radius: 6,
    visibilityMin: 0.5
};

/**
 * Creates an iterator for an array
 */
function createArrayIterator(array) {
    let index = 0;
    return function () {
        return index < array.length ?
            { done: false, value: array[index++] } :
            { done: true };
    };
}

/**
 * Gets an iterator for an iterable object
 */
function getIterator(obj) {
    const iterator = typeof Symbol !== 'undefined' &&
        Symbol.iterator &&
        obj[Symbol.iterator];
    return iterator ? iterator.call(obj) : { next: createArrayIterator(obj) };
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
 * Clamps a value between min and max
 */
function clamp(value, min, max) {
    return Math.max(
        Math.min(min, max),
        Math.min(Math.max(min, max), value)
    );
}

/**
 * Draws landmarks on a canvas
 */
function drawLandmarks(ctx, landmarks, options) {
    if (!landmarks) return;

    options = mergeWithDefaults(options);
    ctx.save();

    const canvas = ctx.canvas;
    let index = 0;

    const iterator = getIterator(landmarks);
    for (let item = iterator.next(); !item.done; item = iterator.next()) {
        const landmark = item.value;

        if (!landmark ||
            (landmark.visibility && landmark.visibility <= options.visibilityMin)) {
            continue;
        }

        // Set styles
        ctx.fillStyle = evaluateValue(options.fillColor, {
            index,
            from: landmark
        });
        ctx.strokeStyle = evaluateValue(options.color, {
            index,
            from: landmark
        });
        ctx.lineWidth = evaluateValue(options.lineWidth, {
            index,
            from: landmark
        });

        // Draw landmark point
        const path = new Path2D();
        path.arc(
            landmark.x * canvas.width,
            landmark.y * canvas.height,
            evaluateValue(options.radius, {
                index,
                from: landmark
            }),
            0,
            2 * Math.PI
        );

        ctx.fill(path);
        ctx.stroke(path);
        index++;
    }

    ctx.restore();
}

/**
 * Draws connectors between landmarks
 */
function drawConnectors(ctx, landmarks, connections, options) {
    if (!landmarks || !connections) return;

    options = mergeWithDefaults(options);
    ctx.save();

    const canvas = ctx.canvas;
    let index = 0;

    const iterator = getIterator(connections);
    for (let item = iterator.next(); !item.done; item = iterator.next()) {
        const connection = item.value;
        ctx.beginPath();

        const from = landmarks[connection[0]];
        const to = landmarks[connection[1]];

        if (!from || !to) continue;

        const fromVisible = !from.visibility || from.visibility > options.visibilityMin;
        const toVisible = !to.visibility || to.visibility > options.visibilityMin;

        if (fromVisible && toVisible) {
            ctx.strokeStyle = evaluateValue(options.color, {
                index,
                from,
                to
            });
            ctx.lineWidth = evaluateValue(options.lineWidth, {
                index,
                from,
                to
            });

            ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
            ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
        }

        index++;
        ctx.stroke();
    }

    ctx.restore();
}

/**
 * Draws a rectangle on the canvas
 */
function drawRectangle(ctx, rect, options) {
    options = mergeWithDefaults(options);
    ctx.save();

    const canvas = ctx.canvas;

    ctx.beginPath();
    ctx.lineWidth = evaluateValue(options.lineWidth, {});
    ctx.strokeStyle = evaluateValue(options.color, {});
    ctx.fillStyle = evaluateValue(options.fillColor, {});

    // Transform and draw rectangle
    ctx.translate(rect.xCenter * canvas.width, rect.yCenter * canvas.height);
    ctx.rotate(rect.rotation * Math.PI / 180);
    ctx.rect(
        -rect.width / 2 * canvas.width,
        -rect.height / 2 * canvas.height,
        rect.width * canvas.width,
        rect.height * canvas.height
    );
    ctx.translate(-rect.xCenter * canvas.width, -rect.yCenter * canvas.height);

    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

/**
 * Linear interpolation between values
 */
function lerp(value, min1, max1, min2, max2) {
    return clamp(
        min2 * (1 - (value - min1) / (max1 - min1)) +
        max2 * (1 - (max1 - value) / (max1 - min1)),
        min2,
        max2
    );
}

// Export functions to global scope
if (typeof window !== 'undefined') {
    window.clamp = clamp;
    window.drawLandmarks = drawLandmarks;
    window.drawConnectors = drawConnectors;
    window.drawRectangle = drawRectangle;
    window.lerp = lerp;
}
