var w = { color: "white", lineWidth: 4, radius: 6, visibilityMin: .5 }
const x = (a) => { a = a || {}; return Object.assign({}, w, { fillColor: a.color }, a) }

const q = (a) => { var c = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator]; return c ? c.call(a) : { next: h(a) } }
const y = (a, c) => { return a instanceof Function ? a(c) : a }

const drawSpecificLandmarks = (drawCtx, allLandmarks, specificLandmarks) => {

    if (allLandmarks) {
        drawCtx.save();
        var d = drawCtx.canvas, e = 0, i = 0;
        allLandmarks = q(allLandmarks);
        for (var f = allLandmarks.next();
            !f.done;
            f = allLandmarks.next()) {
            style = getStyle(f, i);
            // console.log(style);


            if (f = f.value, void 0 !== f && (void 0 === f.visibility || f.visibility > style.visibilityMin)) {
                if (specificLandmarks.includes(i)) {

                    drawCtx.fillStyle = y(style.fillColor, {
                        index: e, from: f
                    });
                    drawCtx.strokeStyle = y(style.color, {
                        index: e, from: f
                    });
                    drawCtx.lineWidth = y(style.lineWidth, {
                        index: e, from: f
                    });
                    var g = new Path2D;
                    g.arc(f.x * d.width, f.y * d.height, y(style.radius, {
                        index: e, from: f
                    }),
                        0, 2 * Math.PI);
                    drawCtx.fill(g);
                    drawCtx.stroke(g);
                }
                ++e
            }
            ++i
        }
        drawCtx.restore()
    }
}