/*!
 * ascii-shader.js v1.0.0
 *
 * Renders an image, video or canvas as ASCII characters in WebGL, with optional
 * pointer-driven distortion. No dependencies. Works from a plain <script> tag
 * (including file://), so it drops straight into Webflow, static HTML or a bundler.
 *
 * ── Quick start ───────────────────────────────────────────────────────────────
 *   <canvas id="hero" style="width:100%;height:60vh"></canvas>
 *   <script src="ascii-shader.js"></script>
 *   <script>
 *     AsciiShader.create(document.getElementById('hero'), {
 *       source: '/media/hero.mp4',        // video URL, image URL, or an element
 *       poster: '/media/hero-poster.jpg', // shown if autoplay is blocked / no WebGL
 *       effect: 'bulge',                  // bulge | pinch | swirl | ripple | scatter | none
 *       strength: 0.4, radius: 110, cellSize: 10
 *     });
 *   </script>
 *
 * ── No-JS-required alternative (data attributes) ──────────────────────────────
 *   <canvas data-ascii-shader data-src="/media/hero.mp4" data-poster="/media/hero.jpg"
 *           data-effect="bulge" data-strength="0.4" data-cell-size="10"></canvas>
 *
 * ── Options (all optional) ────────────────────────────────────────────────────
 *   source        URL string (.mp4/.webm/.mov = video, else image) or
 *                 HTMLVideoElement / HTMLImageElement / HTMLCanvasElement
 *   poster        image URL used when the video can't play or isn't ready yet
 *   ramp          characters from sparse to dense          default ' .:-=+*#%@'
 *   cellSize      cell height in CSS px (width is 0.6x)    default 10
 *   gap           0..1, fraction of each cell left as a gap around the glyph   default 0
 *   contrast      1 = none, higher = punchier              default 1.3
 *   fg, bg        glyph and background colours (hex)       default #1A1A1A on #FBFAF8
 *   accent        hex colour that tints glyphs near the pointer (null = off)
 *   invert        true/false; null = automatic (ink on a light bg maps dark → dense)
 *   effect        see quick start                          default 'bulge'
 *   strength      0..1                                     default 0.4
 *   radius        effect radius in CSS px                  default 110
 *   idleMotion    ghost pointer drifts when nobody is interacting   default true
 *   smoothing     pointer easing, 0..1 (lower = floatier)  default 0.14
 *   maxFps        render cap                               default 30
 *   maxDpr        device-pixel-ratio cap (perf)            default 2
 *   fontFamily    glyph font; load it on the page first    default "Space Mono", monospace
 *   crossOrigin   set 'anonymous' if the media is on another origin (needs CORS headers)
 *   pointerTarget element that receives pointer events     default window
 *   respectReducedMotion   render one still frame instead of animating   default true
 *   onError       function(err) called on shader / texture errors
 *
 * ── Controller ────────────────────────────────────────────────────────────────
 *   const s = AsciiShader.create(...);
 *   s.setOptions({ effect: 'ripple', strength: 0.6 });   // live update
 *   s.pause(); s.play(); s.destroy();
 *
 * ── Fallback ladder ───────────────────────────────────────────────────────────
 *   video plays → animated ASCII
 *   video blocked / not ready → poster frame as ASCII
 *   prefers-reduced-motion → one still frame, no pointer effects
 *   no WebGL → one still frame drawn with the 2D canvas
 *   no JS → the canvas is simply empty; give its parent a background colour
 */
(function (root) {
  'use strict';

  var VS = 'attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }';

  var FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uImg;
uniform sampler2D uAtlas;
uniform vec2  uRes;
uniform vec2  uImgSize;
uniform vec2  uMouse;
uniform vec3  uFg;
uniform vec3  uBg;
uniform vec3  uAccent;
uniform float uCell;
uniform float uN;
uniform float uRadius;
uniform float uStr;
uniform float uMode;
uniform float uTime;
uniform float uContrast;
uniform float uInvert;
uniform float uHasImg;
uniform float uUseAccent;
uniform float uGap;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec2 toImgUV(vec2 p){
  float s = max(uRes.x / uImgSize.x, uRes.y / uImgSize.y);   // "cover" fit
  return (p - 0.5 * uRes) / (uImgSize * s) + 0.5;
}

void main(){
  if (uHasImg < 0.5) { gl_FragColor = vec4(uBg, 1.0); return; }

  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);     // top-left origin
  vec2 cellSize = vec2(uCell * 0.6, uCell);
  vec2 cellIdx  = floor(p / cellSize);
  vec2 local    = fract(p / cellSize);
  vec2 center   = (cellIdx + 0.5) * cellSize;                 // the grid never moves

  vec2  d    = center - uMouse;
  float dist = length(d);
  float fall = smoothstep(uRadius, 0.0, dist);                // 1 at pointer, 0 at edge

  // warp only where we SAMPLE the image
  vec2 sc = center;
  if (uMode < 0.5) {
    sc = uMouse + d * (1.0 - 0.8 * uStr * fall);              // bulge
  } else if (uMode < 1.5) {
    sc = uMouse + d * (1.0 + 1.5 * uStr * fall);              // pinch
  } else if (uMode < 2.5) {
    float a = uStr * 3.0 * fall;                              // swirl
    float cs = cos(a), sn = sin(a);
    sc = uMouse + vec2(cs * d.x - sn * d.y, sn * d.x + cs * d.y);
  } else if (uMode < 3.5) {
    vec2 dir = d / (dist + 0.001);                            // ripple
    sc = center + dir * sin(dist / uCell * 0.9 - uTime * 5.0) * uStr * uCell * 3.0 * fall;
  } else if (uMode < 4.5) {
    float t = floor(uTime * 10.0);                            // scatter
    vec2 r = vec2(hash(cellIdx + t), hash(cellIdx.yx + t + 7.0)) - 0.5;
    sc = center + r * 2.0 * uStr * uCell * 8.0 * fall;
  }

  // 3x3 average so thin detail doesn't flicker
  float sum = 0.0;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      vec2 o = (vec2(float(i), float(j)) - 1.0) / 3.0 * cellSize;
      vec3 c = texture2D(uImg, toImgUV(sc + o)).rgb;
      sum += dot(c, vec3(0.2126, 0.7152, 0.0722));
    }
  }
  float b = clamp((sum / 9.0 - 0.5) * uContrast + 0.5, 0.0, 1.0);
  if (uInvert > 0.5) b = 1.0 - b;

  float idx = floor(min(b, 0.9999) * uN);

  // shrink the glyph toward the cell's center, leaving a gap of background
  // around each one; uGap is the fraction of the cell given up to the gap
  vec2 gloc = (local - 0.5) / max(1.0 - uGap, 0.001) + 0.5;
  if (gloc.x < 0.0 || gloc.x > 1.0 || gloc.y < 0.0 || gloc.y > 1.0) {
    gl_FragColor = vec4(uBg, 1.0);
    return;
  }
  float lx = clamp(gloc.x, 0.02, 0.98);
  float g  = texture2D(uAtlas, vec2((idx + lx) / uN, gloc.y)).r;

  vec3 ink = mix(uFg, uAccent, fall * uUseAccent * 0.9);
  gl_FragColor = vec4(mix(uBg, ink, g), 1.0);
}`;

  var MODES = { bulge: 0, pinch: 1, swirl: 2, ripple: 3, scatter: 4, none: 5 };

  var DEFAULTS = {
    source: null,
    poster: null,
    ramp: '  ░▒▓█',
    cellSize: 10,
    gap: 0.3,
    contrast: 1.5,
    fg: '#FFFFFF',
    bg: '#1A1A1A',
    accent: '#298372',
    invert: false,
    effect: 'bulge',
    strength: 0.4,
    radius: 110,
    idleMotion: true,
    smoothing: 0.14,
    maxFps: 30,
    maxDpr: 2,
    fontFamily: '"Space Mono", ui-monospace, Menlo, Consolas, monospace',
    crossOrigin: null,
    pointerTarget: null,
    respectReducedMotion: true,
    onError: null
  };

  function noop() {}

  function assign(t) {
    for (var i = 1; i < arguments.length; i++) {
      var s = arguments[i];
      if (s) for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k];
    }
    return t;
  }

  function hex(c) {
    c = String(c).replace('#', '');
    if (c.length === 3) c = c.replace(/./g, '$&$&');
    var n = parseInt(c, 16) || 0;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  function lum(c) { return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function css(c) {
    return 'rgb(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ')';
  }

  function tag(el) { return el && el.tagName ? el.tagName : ''; }

  function isReady(el) {
    var t = tag(el);
    if (!t) return false;
    if (t === 'VIDEO') return el.readyState >= 2 && el.videoWidth > 0;
    if (t === 'IMG') return el.complete && el.naturalWidth > 0;
    return true; // canvas
  }
  function sizeOf(el) {
    var t = tag(el);
    if (t === 'VIDEO') return [el.videoWidth, el.videoHeight];
    if (t === 'IMG') return [el.naturalWidth, el.naturalHeight];
    return [el.width, el.height];
  }

  function makeSource(opts, staticMode) {
    var s = opts.source;
    if (!s) return null;
    if (typeof s !== 'string') return s;

    if (/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(s)) {
      var v = document.createElement('video');
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = !staticMode;
      v.preload = 'auto';
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('aria-hidden', 'true');
      v.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none';
      if (opts.crossOrigin) v.crossOrigin = opts.crossOrigin;
      v.src = s;
      return v;
    }
    var im = new Image();
    if (opts.crossOrigin) im.crossOrigin = opts.crossOrigin;
    im.src = s;
    return im;
  }

  function create(canvas, userOpts) {
    var opts = assign({}, DEFAULTS, userOpts);

    var mq = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var reduce = !!(opts.respectReducedMotion && mq && mq.matches);

    var gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }) ||
           canvas.getContext('experimental-webgl');
    } catch (e) { gl = null; }
    var staticMode = reduce || !gl;

    // ── colours ────────────────────────────────────────────────────────────
    var fg, bg, accent, invert;
    function resolveColors() {
      fg = hex(opts.fg);
      bg = hex(opts.bg);
      accent = opts.accent ? hex(opts.accent) : null;
      invert = opts.invert == null ? lum(bg) > 0.5 : !!opts.invert;
    }
    resolveColors();

    // ── sources ────────────────────────────────────────────────────────────
    var main = makeSource(opts, staticMode);
    var ownVideo = tag(main) === 'VIDEO' && typeof opts.source === 'string';
    var poster = null, posterReady = false, failed = false, uploaded = null, dirty = true;
    var t0 = performance.now();

    var pending = false;
    function kick() {                       // static modes: redraw once on demand
      if (!staticMode || pending) return;
      pending = true;
      root.requestAnimationFrame(function () { pending = false; draw(performance.now()); });
    }

    if (ownVideo) document.body.appendChild(main);
    if (opts.poster) {
      poster = new Image();
      if (opts.crossOrigin) poster.crossOrigin = opts.crossOrigin;
      poster.onload = function () { posterReady = true; dirty = true; kick(); };
      poster.src = opts.poster;
    }
    if (tag(main) === 'VIDEO') {
      main.addEventListener('loadeddata', function () { dirty = true; kick(); });
      if (main.requestVideoFrameCallback) {
        var onFrame = function () { dirty = true; main.requestVideoFrameCallback(onFrame); };
        main.requestVideoFrameCallback(onFrame);
      }
    } else if (tag(main) === 'IMG' && !main.complete) {
      main.addEventListener('load', function () { dirty = true; kick(); });
    }

    function active() {
      if (failed) return null;
      if (isReady(main)) return main;
      if (posterReady) return poster;
      return null;
    }

    // ── size ───────────────────────────────────────────────────────────────
    var dpr = 1, W = 0, H = 0, firstSize = true;
    function resize() {
      dpr = Math.min(root.devicePixelRatio || 1, opts.maxDpr);
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
      if (firstSize) { tx = cx = W / 2; ty = cy = H / 2; firstSize = false; }
      dirty = true;
      draw(performance.now());               // avoid a blank flash after the buffer resets
    }

    // ── WebGL setup ────────────────────────────────────────────────────────
    var prog = null, U = {}, imgTex = null, atlasTex = null, nChars = 10, chars = [];

    function initGL() {
      function sh(type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
      }
      try {
        var p = gl.createProgram();
        gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
        gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
        gl.useProgram(p);
        prog = p;
      } catch (err) {
        prog = null;
        if (opts.onError) opts.onError(err); else console.error('[ascii-shader]', err);
        return;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      ['uImg', 'uAtlas', 'uRes', 'uImgSize', 'uMouse', 'uFg', 'uBg', 'uAccent', 'uCell', 'uN',
       'uRadius', 'uStr', 'uMode', 'uTime', 'uContrast', 'uInvert', 'uHasImg', 'uUseAccent', 'uGap']
        .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

      function makeTex(unit) {
        var t = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return t;
      }
      imgTex = makeTex(0);
      atlasTex = makeTex(1);
      gl.uniform1i(U.uImg, 0);
      gl.uniform1i(U.uAtlas, 1);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    // glyph atlas: one row, one 30x50 slot per character, white on black
    function buildAtlas() {
      chars = Array.from(opts.ramp);
      nChars = chars.length;
      var cw = 30, ch = 50;
      var a = document.createElement('canvas');
      a.width = cw * nChars;
      a.height = ch;
      var c = a.getContext('2d');
      c.fillStyle = '#000';
      c.fillRect(0, 0, a.width, ch);
      c.fillStyle = '#fff';
      c.font = '44px ' + opts.fontFamily;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      chars.forEach(function (k, i) { if (k !== ' ') c.fillText(k, i * cw + cw / 2, ch / 2 + 2); });
      if (gl && prog) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, atlasTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, a);
      }
      dirty = true;
    }

    function loadFont() {
      if (!document.fonts || !document.fonts.load) return;
      var fam = String(opts.fontFamily).split(',')[0].trim();
      document.fonts.load('44px ' + fam).then(function () { buildAtlas(); kick(); }).catch(noop);
    }

    // ── pointer ────────────────────────────────────────────────────────────
    var tx = 0, ty = 0, cx = 0, cy = 0, lastInput = -1e9, fade = 1;
    var ptrTarget = opts.pointerTarget || root;

    function onPointer(e) {
      var r = canvas.getBoundingClientRect(), m = opts.radius;
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < -m || y < -m || x > r.width + m || y > r.height + m) { lastInput = -1e9; return; }
      tx = x; ty = y; lastInput = performance.now();
    }
    function onUp(e) { if (e.pointerType === 'touch') lastInput = performance.now() - 1500; }

    function updatePointer(now, t) {
      var idle = now - lastInput > 2500;
      if (idle && opts.idleMotion) {
        tx = W / 2 + Math.cos(t * 0.5) * W * 0.3;
        ty = H / 2 + Math.sin(t * 0.8) * H * 0.25;
      }
      var f = (idle && !opts.idleMotion) ? 0 : 1;
      fade += (f - fade) * 0.08;
      cx += (tx - cx) * opts.smoothing;
      cy += (ty - cy) * opts.smoothing;
    }

    // ── drawing ────────────────────────────────────────────────────────────
    function drawGL(now) {
      if (!prog || gl.isContextLost()) return;
      var act = active();
      if (act && (dirty || act !== uploaded)) {
        try {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, imgTex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, act);
          uploaded = act;
        } catch (err) {
          failed = true; act = null;
          if (opts.onError) opts.onError(err); else console.warn('[ascii-shader] texture upload failed:', err);
        }
        dirty = false;
      }
      var sz = act ? sizeOf(act) : [1, 1];
      var t = (now - t0) / 1000;
      var str = staticMode ? 0 : opts.strength * fade;
      var mode = MODES[opts.effect] != null ? MODES[opts.effect] : 0;

      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform2f(U.uImgSize, sz[0], sz[1]);
      gl.uniform2f(U.uMouse, staticMode ? -1e5 : cx * dpr, staticMode ? -1e5 : cy * dpr);
      gl.uniform3f(U.uFg, fg[0], fg[1], fg[2]);
      gl.uniform3f(U.uBg, bg[0], bg[1], bg[2]);
      var ac = accent || fg;
      gl.uniform3f(U.uAccent, ac[0], ac[1], ac[2]);
      gl.uniform1f(U.uUseAccent, accent && !staticMode ? 1 : 0);
      gl.uniform1f(U.uCell, opts.cellSize * dpr);
      gl.uniform1f(U.uGap, opts.gap);
      gl.uniform1f(U.uN, nChars);
      gl.uniform1f(U.uRadius, opts.radius * dpr);
      gl.uniform1f(U.uStr, str);
      gl.uniform1f(U.uMode, mode);
      gl.uniform1f(U.uTime, t);
      gl.uniform1f(U.uContrast, opts.contrast);
      gl.uniform1f(U.uInvert, invert ? 1 : 0);
      gl.uniform1f(U.uHasImg, act ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // one still frame with the 2D canvas (used only when WebGL is unavailable)
    var tiny = null;
    function draw2D() {
      var c = canvas.getContext('2d');
      if (!c) return;
      c.fillStyle = css(bg);
      c.fillRect(0, 0, canvas.width, canvas.height);
      var act = active();
      if (!act) return;
      if (!chars.length) chars = Array.from(opts.ramp);
      var cell = opts.cellSize * dpr, cw = cell * 0.6;
      var cols = Math.max(1, Math.floor(canvas.width / cw));
      var rows = Math.max(1, Math.floor(canvas.height / cell));
      tiny = tiny || document.createElement('canvas');
      tiny.width = cols; tiny.height = rows;
      var tc = tiny.getContext('2d', { willReadFrequently: true });
      var sz = sizeOf(act), s = Math.max(canvas.width / sz[0], canvas.height / sz[1]);
      var dw = sz[0] * s / cw, dh = sz[1] * s / cell, px;
      try {
        tc.drawImage(act, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
        px = tc.getImageData(0, 0, cols, rows).data;
      } catch (err) { return; }
      c.fillStyle = css(fg);
      c.font = (cell * (1 - opts.gap)) + 'px ' + opts.fontFamily;  // shrink glyph to match the gap
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      for (var r = 0; r < rows; r++) {
        for (var q = 0; q < cols; q++) {
          var i = (r * cols + q) * 4;
          var b = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
          b = Math.min(1, Math.max(0, (b - 0.5) * opts.contrast + 0.5));
          if (invert) b = 1 - b;
          var k = chars[Math.min(chars.length - 1, Math.floor(b * chars.length))];
          if (k !== ' ') c.fillText(k, q * cw + cw / 2, r * cell + cell / 2);
        }
      }
    }

    function draw(now) { if (gl) drawGL(now); else draw2D(); }

    // ── loop ───────────────────────────────────────────────────────────────
    var raf = 0, last = 0, paused = false, visible = true, docVisible = !document.hidden;

    function tick(now) {
      raf = root.requestAnimationFrame(tick);
      if (now - last < 1000 / opts.maxFps - 2) return;
      last = now;
      if (tag(main) === 'CANVAS') dirty = true;
      else if (tag(main) === 'VIDEO' && !main.paused && !main.requestVideoFrameCallback) dirty = true;
      updatePointer(now, (now - t0) / 1000);
      drawGL(now);
    }

    function update() {
      var run = !staticMode && visible && docVisible && !paused;
      if (run && !raf) {
        if (ownVideo) { var p = main.play(); if (p && p.catch) p.catch(noop); }
        last = 0;
        raf = root.requestAnimationFrame(tick);
      } else if (!run && raf) {
        root.cancelAnimationFrame(raf);
        raf = 0;
        if (ownVideo) main.pause();
      }
    }

    function onVis() { docVisible = !document.hidden; update(); }
    function onLost(e) { e.preventDefault(); prog = null; }
    function onRestored() { initGL(); buildAtlas(); uploaded = null; dirty = true; kick(); }

    // ── boot ───────────────────────────────────────────────────────────────
    if (gl) {
      initGL();
      canvas.addEventListener('webglcontextlost', onLost);
      canvas.addEventListener('webglcontextrestored', onRestored);
    }
    buildAtlas();
    loadFont();

    var ro = null, io = null;
    if (root.ResizeObserver) { ro = new root.ResizeObserver(resize); ro.observe(canvas); }
    else root.addEventListener('resize', resize);
    resize();

    if (!staticMode) {
      ptrTarget.addEventListener('pointermove', onPointer, { passive: true });
      ptrTarget.addEventListener('pointerdown', onPointer, { passive: true });
      ptrTarget.addEventListener('pointerup', onUp, { passive: true });
      if (root.IntersectionObserver) {
        io = new root.IntersectionObserver(function (en) { visible = en[0].isIntersecting; update(); });
        io.observe(canvas);
      }
      document.addEventListener('visibilitychange', onVis);
      update();
    }

    return {
      canvas: canvas,
      setOptions: function (p) {
        var atlasChanged = !!p && ('ramp' in p || 'fontFamily' in p);
        assign(opts, p);
        resolveColors();
        if (atlasChanged) { buildAtlas(); if ('fontFamily' in p) loadFont(); }
        dirty = true;
        kick();
      },
      pause: function () { paused = true; update(); },
      play: function () { paused = false; update(); },
      destroy: function () {
        if (raf) root.cancelAnimationFrame(raf);
        raf = 0;
        ptrTarget.removeEventListener('pointermove', onPointer);
        ptrTarget.removeEventListener('pointerdown', onPointer);
        ptrTarget.removeEventListener('pointerup', onUp);
        document.removeEventListener('visibilitychange', onVis);
        if (io) io.disconnect();
        if (ro) ro.disconnect(); else root.removeEventListener('resize', resize);
        if (gl) {
          canvas.removeEventListener('webglcontextlost', onLost);
          canvas.removeEventListener('webglcontextrestored', onRestored);
          var ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        }
        if (ownVideo) {
          main.pause();
          main.removeAttribute('src');
          main.load();
          if (main.parentNode) main.parentNode.removeChild(main);
        }
      }
    };
  }

  // ── data-attribute auto init ─────────────────────────────────────────────
  function autoInit() {
    var nodes = document.querySelectorAll('canvas[data-ascii-shader]');
    Array.prototype.forEach.call(nodes, function (el) {
      var d = el.dataset, o = {};
      if (d.src) o.source = d.src;
      if (d.poster) o.poster = d.poster;
      if (d.ramp) o.ramp = d.ramp;
      if (d.effect) o.effect = d.effect;
      if (d.fg) o.fg = d.fg;
      if (d.bg) o.bg = d.bg;
      if (d.accent) o.accent = d.accent;
      if (d.crossOrigin) o.crossOrigin = d.crossOrigin;
      if (d.invert) o.invert = d.invert === 'true';
      if (d.idleMotion) o.idleMotion = d.idleMotion !== 'false';
      ['cellSize', 'gap', 'contrast', 'strength', 'radius', 'maxFps', 'smoothing'].forEach(function (k) {
        if (d[k] != null && d[k] !== '') o[k] = parseFloat(d[k]);
      });
      el.__asciiShader = create(el, o);
    });
  }

  root.AsciiShader = { create: create, version: '1.0.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.AsciiShader;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
  else autoInit();
})(typeof window !== 'undefined' ? window : this);
