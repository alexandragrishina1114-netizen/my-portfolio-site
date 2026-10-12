(() => {
  const photo = document.querySelector(".hero-portrait img");
  const canvas = document.querySelector(".portrait-gaze");
  if (!photo || !canvas) return;

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = matchMedia("(min-width: 480px) and (hover: hover) and (pointer: fine)");

  const smoothstep = (a, b, value) => {
    const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  async function start() {
    await photo.decode();
    if (photo.naturalWidth !== 798 || photo.naturalHeight !== 791) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    context.drawImage(photo, 0, 0);
    const source = context.getImageData(0, 0, canvas.width, canvas.height);

    // Eye openings calibrated for am_baby.png (798 x 791). The eyelids stay fixed.
    const eyes = [
      {
        box: [188, 369, 67, 41],
        travel: [3.5, 1.2],
        outline: [
          [193, 395],
          [196, 383, 209, 375, 223, 375],
          [236, 374, 244, 378, 248, 383],
          [250, 386, 248, 389, 245, 391],
          [228, 397, 214, 404, 202, 405],
          [197, 403, 195, 400, 193, 395],
        ],
      },
      {
        box: [325, 322, 84, 43],
        travel: [4.8, 1.6],
        outline: [
          [331, 357],
          [333, 346, 344, 337, 357, 332],
          [375, 325, 391, 331, 404, 334],
          [397, 345, 382, 351, 368, 355],
          [355, 359, 340, 360, 331, 357],
        ],
      },
    ];

    function prepare(eye) {
      const path = new Path2D();
      path.moveTo(...eye.outline[0]);
      const boundary = [eye.outline[0]];
      let from = eye.outline[0];
      for (const curve of eye.outline.slice(1)) {
        path.bezierCurveTo(...curve);
        for (let i = 1; i <= 32; i++) {
          const t = i / 32;
          const q = 1 - t;
          boundary.push([0, 1].map((axis) =>
            q ** 3 * from[axis] + 3 * q ** 2 * t * curve[axis] +
            3 * q * t ** 2 * curve[axis + 2] + t ** 3 * curve[axis + 4],
          ));
        }
        from = curve.slice(4);
      }
      path.closePath();
      const [left, top, width, height] = eye.box;
      const patch = context.getImageData(left, top, width, height);
      const weights = new Float32Array(width * height);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const px = left + x;
          const py = top + y;
          if (!context.isPointInPath(path, px, py)) continue;
          const distance = Math.sqrt(Math.min(...boundary.map(([bx, by]) =>
            (px - bx) ** 2 + (py - by) ** 2,
          )));
          weights[y * width + x] = smoothstep(0, 5, distance);
        }
      }
      return { ...eye, patch, weights };
    }

    const patches = eyes.map(prepare);

    function draw(gaze) {
      for (const eye of patches) {
        const [left, top, width, height] = eye.box;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const weight = eye.weights[y * width + x];
            if (weight === 0) continue;
            // Always sample the original texture so repeated movements cannot accumulate distortion.
            const sx = left + x - gaze.x * eye.travel[0] * weight;
            const sy = top + y - gaze.y * eye.travel[1] * weight;
            const ix = Math.floor(sx);
            const iy = Math.floor(sy);
            const fx = sx - ix;
            const fy = sy - iy;
            const first = (iy * source.width + ix) * 4;
            const below = first + source.width * 4;
            const target = (y * width + x) * 4;
            for (let channel = 0; channel < 3; channel++) {
              const upper = source.data[first + channel] * (1 - fx) + source.data[first + 4 + channel] * fx;
              const lower = source.data[below + channel] * (1 - fx) + source.data[below + 4 + channel] * fx;
              eye.patch.data[target + channel] = upper * (1 - fy) + lower * fy;
            }
          }
        }
        context.putImageData(eye.patch, left, top);
      }
    }

    let visible = true;
    let frame = 0;
    let lastTime = 0;
    let current = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let cursor = null;
    const allowed = () => pointer.matches && !motion.matches && visible && !document.hidden;

    function animate(time) {
      frame = 0;
      if (!allowed()) return;
      const elapsed = lastTime ? Math.min(40, time - lastTime) : 16;
      lastTime = time;
      const easing = 1 - Math.exp(-elapsed / 65);
      current.x += (target.x - current.x) * easing;
      current.y += (target.y - current.y) * easing;
      const moving = Math.hypot(target.x - current.x, target.y - current.y) > 0.003;
      if (!moving) current = { ...target };
      draw(current);
      if (moving) frame = requestAnimationFrame(animate);
      else lastTime = 0;
    }

    function wake() {
      if (allowed() && !frame) frame = requestAnimationFrame(animate);
    }

    function aim() {
      if (!cursor || !allowed()) return;
      const bounds = photo.getBoundingClientRect();
      // Match the photo's object-fit: contain, including any space around it.
      const scale = Math.min(bounds.width / source.width, bounds.height / source.height);
      const width = source.width * scale;
      const height = source.height * scale;
      if (!width || !height) return;
      const centerX = bounds.left + (bounds.width - width) / 2 + width * 0.38;
      const centerY = bounds.top + (bounds.height - height) / 2 + height * 0.457;
      target = {
        x: Math.tanh((cursor.x - centerX) / (width * 0.65)),
        y: Math.tanh((cursor.y - centerY) / (height * 0.65)),
      };
      wake();
    }

    function neutral() {
      cursor = null;
      target = { x: 0, y: 0 };
      wake();
    }

    function update() {
      canvas.hidden = !allowed();
      if (!allowed()) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        current = { x: 0, y: 0 };
        target = { x: 0, y: 0 };
        draw(current);
      } else aim();
    }

    window.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !allowed()) return;
      cursor = { x: event.clientX, y: event.clientY };
      aim();
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", neutral);
    window.addEventListener("blur", neutral);
    window.addEventListener("resize", aim, { passive: true });
    window.addEventListener("scroll", aim, { passive: true });
    document.addEventListener("visibilitychange", update);
    pointer.addEventListener("change", update);
    motion.addEventListener("change", update);
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        update();
      });
      observer.observe(photo);
    }
    update();
  }

  start().catch((error) => {
    canvas.hidden = true;
    console.warn("Portrait animation is unavailable; showing the original photograph.", error);
  });
})();
