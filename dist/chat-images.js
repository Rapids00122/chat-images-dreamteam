const Re = (u) => $(u), kt = (u, h) => u.before(h), le = (u, h) => h ? h.find(u) : $(u), Se = (u, h) => u.append(h), ke = (u, h, b) => u.on(h, b), Gt = (u, h) => u.trigger(h), Ht = (u, h) => u.removeClass(h), Je = (u, h) => u.addClass(h), Ve = (u) => u.remove(), Pt = (u, h, b) => u.attr(h, b), Lt = (u, h) => u.removeAttr(h), Ot = (u) => u.focus(), Le = "data", Ae = (u) => game?.i18n?.localize(`CI.${u}`) || "", gt = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), ht = (u = !1) => {
  const h = game?.user?.role, b = game?.permissions?.FILES_UPLOAD;
  if (!h || !b)
    return u || ui.notifications?.warn(Ae("uploadPermissions")), !1;
  const a = b.includes(h);
  return !a && !u && ui.notifications?.warn(Ae("uploadPermissions")), a;
}, Qt = () => game?.version, _e = () => Number(Qt()) >= 13, Oe = () => _e() ? foundry.applications.apps.FilePicker.implementation : FilePicker, Nt = () => _e() ? foundry.applications.apps.ImagePopout : ImagePopout, zt = () => Re('<div id="ci-chat-upload-area" class="hidden"></div>'), it = (u) => {
  const h = _e() ? ".chat-controls" : "#chat-controls", b = le(h, u), a = zt();
  kt(b, a);
};
function $t(u, h) {
  return h.forEach((function(b) {
    b && typeof b != "string" && !Array.isArray(b) && Object.keys(b).forEach((function(a) {
      if (a !== "default" && !(a in u)) {
        var e = Object.getOwnPropertyDescriptor(b, a);
        Object.defineProperty(u, a, e.get ? e : { enumerable: !0, get: function() {
          return b[a];
        } });
      }
    }));
  })), Object.freeze(u);
}
function mt(u, h) {
  return new Promise((function(b, a) {
    let e;
    return Wt(u).then((function(t) {
      try {
        return e = t, b(new Blob([h.slice(0, 2), e, h.slice(2)], { type: "image/jpeg" }));
      } catch (c) {
        return a(c);
      }
    }), a);
  }));
}
const Wt = (u) => new Promise(((h, b) => {
  const a = new FileReader();
  a.addEventListener("load", (({ target: { result: e } }) => {
    const t = new DataView(e);
    let c = 0;
    if (t.getUint16(c) !== 65496) return b("not a valid JPEG");
    for (c += 2; ; ) {
      const i = t.getUint16(c);
      if (i === 65498) break;
      const p = t.getUint16(c + 2);
      if (i === 65505 && t.getUint32(c + 4) === 1165519206) {
        const y = c + 10;
        let r;
        switch (t.getUint16(y)) {
          case 18761:
            r = !0;
            break;
          case 19789:
            r = !1;
            break;
          default:
            return b("TIFF header contains invalid endian");
        }
        if (t.getUint16(y + 2, r) !== 42) return b("TIFF header contains invalid version");
        const o = t.getUint32(y + 4, r), n = y + o + 2 + 12 * t.getUint16(y + o, r);
        for (let s = y + o + 2; s < n; s += 12)
          if (t.getUint16(s, r) == 274) {
            if (t.getUint16(s + 2, r) !== 3) return b("Orientation data type is invalid");
            if (t.getUint32(s + 4, r) !== 1) return b("Orientation data count is invalid");
            t.setUint16(s + 8, 1, r);
            break;
          }
        return h(e.slice(c, c + 2 + p));
      }
      c += 2 + p;
    }
    return h(new Blob());
  })), a.readAsArrayBuffer(u);
}));
var $e = {}, qt = { get exports() {
  return $e;
}, set exports(u) {
  $e = u;
} };
(function(u) {
  var h, b, a = {};
  qt.exports = a, a.parse = function(e, t) {
    for (var c = a.bin.readUshort, i = a.bin.readUint, p = 0, y = {}, r = new Uint8Array(e), o = r.length - 4; i(r, o) != 101010256; ) o--;
    p = o, p += 4;
    var n = c(r, p += 4);
    c(r, p += 2);
    var s = i(r, p += 2), m = i(r, p += 4);
    p += 4, p = m;
    for (var C = 0; C < n; C++) {
      i(r, p), p += 4, p += 4, p += 4, i(r, p += 4), s = i(r, p += 4);
      var B = i(r, p += 4), E = c(r, p += 4), H = c(r, p + 2), x = c(r, p + 4);
      p += 6;
      var S = i(r, p += 8);
      p += 4, p += E + H + x, a._readLocal(r, S, y, s, B, t);
    }
    return y;
  }, a._readLocal = function(e, t, c, i, p, y) {
    var r = a.bin.readUshort, o = a.bin.readUint;
    o(e, t), r(e, t += 4), r(e, t += 2);
    var n = r(e, t += 2);
    o(e, t += 2), o(e, t += 4), t += 4;
    var s = r(e, t += 8), m = r(e, t += 2);
    t += 2;
    var C = a.bin.readUTF8(e, t, s);
    if (t += s, t += m, y) c[C] = { size: p, csize: i };
    else {
      var B = new Uint8Array(e.buffer, t);
      if (n == 0) c[C] = new Uint8Array(B.buffer.slice(t, t + i));
      else {
        if (n != 8) throw "unknown compression method: " + n;
        var E = new Uint8Array(p);
        a.inflateRaw(B, E), c[C] = E;
      }
    }
  }, a.inflateRaw = function(e, t) {
    return a.F.inflate(e, t);
  }, a.inflate = function(e, t) {
    return e[0], e[1], a.inflateRaw(new Uint8Array(e.buffer, e.byteOffset + 2, e.length - 6), t);
  }, a.deflate = function(e, t) {
    t == null && (t = { level: 6 });
    var c = 0, i = new Uint8Array(50 + Math.floor(1.1 * e.length));
    i[c] = 120, i[c + 1] = 156, c += 2, c = a.F.deflateRaw(e, i, c, t.level);
    var p = a.adler(e, 0, e.length);
    return i[c + 0] = p >>> 24 & 255, i[c + 1] = p >>> 16 & 255, i[c + 2] = p >>> 8 & 255, i[c + 3] = p >>> 0 & 255, new Uint8Array(i.buffer, 0, c + 4);
  }, a.deflateRaw = function(e, t) {
    t == null && (t = { level: 6 });
    var c = new Uint8Array(50 + Math.floor(1.1 * e.length)), i = a.F.deflateRaw(e, c, i, t.level);
    return new Uint8Array(c.buffer, 0, i);
  }, a.encode = function(e, t) {
    t == null && (t = !1);
    var c = 0, i = a.bin.writeUint, p = a.bin.writeUshort, y = {};
    for (var r in e) {
      var o = !a._noNeed(r) && !t, n = e[r], s = a.crc.crc(n, 0, n.length);
      y[r] = { cpr: o, usize: n.length, crc: s, file: o ? a.deflateRaw(n) : n };
    }
    for (var r in y) c += y[r].file.length + 30 + 46 + 2 * a.bin.sizeUTF8(r);
    c += 22;
    var m = new Uint8Array(c), C = 0, B = [];
    for (var r in y) {
      var E = y[r];
      B.push(C), C = a._writeHeader(m, C, r, E, 0);
    }
    var H = 0, x = C;
    for (var r in y)
      E = y[r], B.push(C), C = a._writeHeader(m, C, r, E, 1, B[H++]);
    var S = C - x;
    return i(m, C, 101010256), C += 4, p(m, C += 4, H), p(m, C += 2, H), i(m, C += 2, S), i(m, C += 4, x), C += 4, C += 2, m.buffer;
  }, a._noNeed = function(e) {
    var t = e.split(".").pop().toLowerCase();
    return "png,jpg,jpeg,zip".indexOf(t) != -1;
  }, a._writeHeader = function(e, t, c, i, p, y) {
    var r = a.bin.writeUint, o = a.bin.writeUshort, n = i.file;
    return r(e, t, p == 0 ? 67324752 : 33639248), t += 4, p == 1 && (t += 2), o(e, t, 20), o(e, t += 2, 0), o(e, t += 2, i.cpr ? 8 : 0), r(e, t += 2, 0), r(e, t += 4, i.crc), r(e, t += 4, n.length), r(e, t += 4, i.usize), o(e, t += 4, a.bin.sizeUTF8(c)), o(e, t += 2, 0), t += 2, p == 1 && (t += 2, t += 2, r(e, t += 6, y), t += 4), t += a.bin.writeUTF8(e, t, c), p == 0 && (e.set(n, t), t += n.length), t;
  }, a.crc = { table: (function() {
    for (var e = new Uint32Array(256), t = 0; t < 256; t++) {
      for (var c = t, i = 0; i < 8; i++) 1 & c ? c = 3988292384 ^ c >>> 1 : c >>>= 1;
      e[t] = c;
    }
    return e;
  })(), update: function(e, t, c, i) {
    for (var p = 0; p < i; p++) e = a.crc.table[255 & (e ^ t[c + p])] ^ e >>> 8;
    return e;
  }, crc: function(e, t, c) {
    return 4294967295 ^ a.crc.update(4294967295, e, t, c);
  } }, a.adler = function(e, t, c) {
    for (var i = 1, p = 0, y = t, r = t + c; y < r; ) {
      for (var o = Math.min(y + 5552, r); y < o; ) p += i += e[y++];
      i %= 65521, p %= 65521;
    }
    return p << 16 | i;
  }, a.bin = { readUshort: function(e, t) {
    return e[t] | e[t + 1] << 8;
  }, writeUshort: function(e, t, c) {
    e[t] = 255 & c, e[t + 1] = c >> 8 & 255;
  }, readUint: function(e, t) {
    return 16777216 * e[t + 3] + (e[t + 2] << 16 | e[t + 1] << 8 | e[t]);
  }, writeUint: function(e, t, c) {
    e[t] = 255 & c, e[t + 1] = c >> 8 & 255, e[t + 2] = c >> 16 & 255, e[t + 3] = c >> 24 & 255;
  }, readASCII: function(e, t, c) {
    for (var i = "", p = 0; p < c; p++) i += String.fromCharCode(e[t + p]);
    return i;
  }, writeASCII: function(e, t, c) {
    for (var i = 0; i < c.length; i++) e[t + i] = c.charCodeAt(i);
  }, pad: function(e) {
    return e.length < 2 ? "0" + e : e;
  }, readUTF8: function(e, t, c) {
    for (var i, p = "", y = 0; y < c; y++) p += "%" + a.bin.pad(e[t + y].toString(16));
    try {
      i = decodeURIComponent(p);
    } catch {
      return a.bin.readASCII(e, t, c);
    }
    return i;
  }, writeUTF8: function(e, t, c) {
    for (var i = c.length, p = 0, y = 0; y < i; y++) {
      var r = c.charCodeAt(y);
      if ((4294967168 & r) == 0) e[t + p] = r, p++;
      else if ((4294965248 & r) == 0) e[t + p] = 192 | r >> 6, e[t + p + 1] = 128 | r >> 0 & 63, p += 2;
      else if ((4294901760 & r) == 0) e[t + p] = 224 | r >> 12, e[t + p + 1] = 128 | r >> 6 & 63, e[t + p + 2] = 128 | r >> 0 & 63, p += 3;
      else {
        if ((4292870144 & r) != 0) throw "e";
        e[t + p] = 240 | r >> 18, e[t + p + 1] = 128 | r >> 12 & 63, e[t + p + 2] = 128 | r >> 6 & 63, e[t + p + 3] = 128 | r >> 0 & 63, p += 4;
      }
    }
    return p;
  }, sizeUTF8: function(e) {
    for (var t = e.length, c = 0, i = 0; i < t; i++) {
      var p = e.charCodeAt(i);
      if ((4294967168 & p) == 0) c++;
      else if ((4294965248 & p) == 0) c += 2;
      else if ((4294901760 & p) == 0) c += 3;
      else {
        if ((4292870144 & p) != 0) throw "e";
        c += 4;
      }
    }
    return c;
  } }, a.F = {}, a.F.deflateRaw = function(e, t, c, i) {
    var p = [[0, 0, 0, 0, 0], [4, 4, 8, 4, 0], [4, 5, 16, 8, 0], [4, 6, 16, 16, 0], [4, 10, 16, 32, 0], [8, 16, 32, 32, 0], [8, 16, 128, 128, 0], [8, 32, 128, 256, 0], [32, 128, 258, 1024, 1], [32, 258, 258, 4096, 1]][i], y = a.F.U, r = a.F._goodIndex;
    a.F._hash;
    var o = a.F._putsE, n = 0, s = c << 3, m = 0, C = e.length;
    if (i == 0) {
      for (; n < C; )
        o(t, s, n + (U = Math.min(65535, C - n)) == C ? 1 : 0), s = a.F._copyExact(e, n, U, t, s + 8), n += U;
      return s >>> 3;
    }
    var B = y.lits, E = y.strt, H = y.prev, x = 0, S = 0, k = 0, v = 0, _ = 0, d = 0;
    for (C > 2 && (E[d = a.F._hash(e, 0)] = 0), n = 0; n < C; n++) {
      if (_ = d, n + 1 < C - 2) {
        d = a.F._hash(e, n + 1);
        var f = n + 1 & 32767;
        H[f] = E[d], E[d] = f;
      }
      if (m <= n) {
        (x > 14e3 || S > 26697) && C - n > 100 && (m < n && (B[x] = n - m, x += 2, m = n), s = a.F._writeBlock(n == C - 1 || m == C ? 1 : 0, B, x, v, e, k, n - k, t, s), x = S = v = 0, k = n);
        var w = 0;
        n < C - 2 && (w = a.F._bestMatch(e, n, H, _, Math.min(p[2], C - n), p[3]));
        var U = w >>> 16, I = 65535 & w;
        if (w != 0) {
          I = 65535 & w;
          var F = r(U = w >>> 16, y.of0);
          y.lhst[257 + F]++;
          var A = r(I, y.df0);
          y.dhst[A]++, v += y.exb[F] + y.dxb[A], B[x] = U << 23 | n - m, B[x + 1] = I << 16 | F << 8 | A, x += 2, m = n + U;
        } else y.lhst[e[n]]++;
        S++;
      }
    }
    for (k == n && e.length != 0 || (m < n && (B[x] = n - m, x += 2, m = n), s = a.F._writeBlock(1, B, x, v, e, k, n - k, t, s), x = 0, S = 0, x = S = v = 0, k = n); (7 & s) != 0; ) s++;
    return s >>> 3;
  }, a.F._bestMatch = function(e, t, c, i, p, y) {
    var r = 32767 & t, o = c[r], n = r - o + 32768 & 32767;
    if (o == r || i != a.F._hash(e, t - n)) return 0;
    for (var s = 0, m = 0, C = Math.min(32767, t); n <= C && --y != 0 && o != r; ) {
      if (s == 0 || e[t + s] == e[t + s - n]) {
        var B = a.F._howLong(e, t, n);
        if (B > s) {
          if (m = n, (s = B) >= p) break;
          n + 2 < B && (B = n + 2);
          for (var E = 0, H = 0; H < B - 2; H++) {
            var x = t - n + H + 32768 & 32767, S = x - c[x] + 32768 & 32767;
            S > E && (E = S, o = x);
          }
        }
      }
      n += (r = o) - (o = c[r]) + 32768 & 32767;
    }
    return s << 16 | m;
  }, a.F._howLong = function(e, t, c) {
    if (e[t] != e[t - c] || e[t + 1] != e[t + 1 - c] || e[t + 2] != e[t + 2 - c]) return 0;
    var i = t, p = Math.min(e.length, t + 258);
    for (t += 3; t < p && e[t] == e[t - c]; ) t++;
    return t - i;
  }, a.F._hash = function(e, t) {
    return (e[t] << 8 | e[t + 1]) + (e[t + 2] << 4) & 65535;
  }, a.saved = 0, a.F._writeBlock = function(e, t, c, i, p, y, r, o, n) {
    var s, m, C, B, E, H, x, S, k, v = a.F.U, _ = a.F._putsF, d = a.F._putsE;
    v.lhst[256]++, m = (s = a.F.getTrees())[0], C = s[1], B = s[2], E = s[3], H = s[4], x = s[5], S = s[6], k = s[7];
    var f = 32 + ((n + 3 & 7) == 0 ? 0 : 8 - (n + 3 & 7)) + (r << 3), w = i + a.F.contSize(v.fltree, v.lhst) + a.F.contSize(v.fdtree, v.dhst), U = i + a.F.contSize(v.ltree, v.lhst) + a.F.contSize(v.dtree, v.dhst);
    U += 14 + 3 * x + a.F.contSize(v.itree, v.ihst) + (2 * v.ihst[16] + 3 * v.ihst[17] + 7 * v.ihst[18]);
    for (var I = 0; I < 286; I++) v.lhst[I] = 0;
    for (I = 0; I < 30; I++) v.dhst[I] = 0;
    for (I = 0; I < 19; I++) v.ihst[I] = 0;
    var F = f < w && f < U ? 0 : w < U ? 1 : 2;
    if (_(o, n, e), _(o, n + 1, F), n += 3, F == 0) {
      for (; (7 & n) != 0; ) n++;
      n = a.F._copyExact(p, y, r, o, n);
    } else {
      var A, D;
      if (F == 1 && (A = v.fltree, D = v.fdtree), F == 2) {
        a.F.makeCodes(v.ltree, m), a.F.revCodes(v.ltree, m), a.F.makeCodes(v.dtree, C), a.F.revCodes(v.dtree, C), a.F.makeCodes(v.itree, B), a.F.revCodes(v.itree, B), A = v.ltree, D = v.dtree, d(o, n, E - 257), d(o, n += 5, H - 1), d(o, n += 5, x - 4), n += 4;
        for (var g = 0; g < x; g++) d(o, n + 3 * g, v.itree[1 + (v.ordr[g] << 1)]);
        n += 3 * x, n = a.F._codeTiny(S, v.itree, o, n), n = a.F._codeTiny(k, v.itree, o, n);
      }
      for (var l = y, G = 0; G < c; G += 2) {
        for (var T = t[G], M = T >>> 23, Q = l + (8388607 & T); l < Q; ) n = a.F._writeLit(p[l++], A, o, n);
        if (M != 0) {
          var L = t[G + 1], O = L >> 16, P = L >> 8 & 255, R = 255 & L;
          d(o, n = a.F._writeLit(257 + P, A, o, n), M - v.of0[P]), n += v.exb[P], _(o, n = a.F._writeLit(R, D, o, n), O - v.df0[R]), n += v.dxb[R], l += M;
        }
      }
      n = a.F._writeLit(256, A, o, n);
    }
    return n;
  }, a.F._copyExact = function(e, t, c, i, p) {
    var y = p >>> 3;
    return i[y] = c, i[y + 1] = c >>> 8, i[y + 2] = 255 - i[y], i[y + 3] = 255 - i[y + 1], y += 4, i.set(new Uint8Array(e.buffer, t, c), y), p + (c + 4 << 3);
  }, a.F.getTrees = function() {
    for (var e = a.F.U, t = a.F._hufTree(e.lhst, e.ltree, 15), c = a.F._hufTree(e.dhst, e.dtree, 15), i = [], p = a.F._lenCodes(e.ltree, i), y = [], r = a.F._lenCodes(e.dtree, y), o = 0; o < i.length; o += 2) e.ihst[i[o]]++;
    for (o = 0; o < y.length; o += 2) e.ihst[y[o]]++;
    for (var n = a.F._hufTree(e.ihst, e.itree, 7), s = 19; s > 4 && e.itree[1 + (e.ordr[s - 1] << 1)] == 0; ) s--;
    return [t, c, n, p, r, s, i, y];
  }, a.F.getSecond = function(e) {
    for (var t = [], c = 0; c < e.length; c += 2) t.push(e[c + 1]);
    return t;
  }, a.F.nonZero = function(e) {
    for (var t = "", c = 0; c < e.length; c += 2) e[c + 1] != 0 && (t += (c >> 1) + ",");
    return t;
  }, a.F.contSize = function(e, t) {
    for (var c = 0, i = 0; i < t.length; i++) c += t[i] * e[1 + (i << 1)];
    return c;
  }, a.F._codeTiny = function(e, t, c, i) {
    for (var p = 0; p < e.length; p += 2) {
      var y = e[p], r = e[p + 1];
      i = a.F._writeLit(y, t, c, i);
      var o = y == 16 ? 2 : y == 17 ? 3 : 7;
      y > 15 && (a.F._putsE(c, i, r, o), i += o);
    }
    return i;
  }, a.F._lenCodes = function(e, t) {
    for (var c = e.length; c != 2 && e[c - 1] == 0; ) c -= 2;
    for (var i = 0; i < c; i += 2) {
      var p = e[i + 1], y = i + 3 < c ? e[i + 3] : -1, r = i + 5 < c ? e[i + 5] : -1, o = i == 0 ? -1 : e[i - 1];
      if (p == 0 && y == p && r == p) {
        for (var n = i + 5; n + 2 < c && e[n + 2] == p; ) n += 2;
        (s = Math.min(n + 1 - i >>> 1, 138)) < 11 ? t.push(17, s - 3) : t.push(18, s - 11), i += 2 * s - 2;
      } else if (p == o && y == p && r == p) {
        for (n = i + 5; n + 2 < c && e[n + 2] == p; ) n += 2;
        var s = Math.min(n + 1 - i >>> 1, 6);
        t.push(16, s - 3), i += 2 * s - 2;
      } else t.push(p, 0);
    }
    return c >>> 1;
  }, a.F._hufTree = function(e, t, c) {
    var i = [], p = e.length, y = t.length, r = 0;
    for (r = 0; r < y; r += 2) t[r] = 0, t[r + 1] = 0;
    for (r = 0; r < p; r++) e[r] != 0 && i.push({ lit: r, f: e[r] });
    var o = i.length, n = i.slice(0);
    if (o == 0) return 0;
    if (o == 1) {
      var s = i[0].lit;
      return n = s == 0 ? 1 : 0, t[1 + (s << 1)] = 1, t[1 + (n << 1)] = 1, 1;
    }
    i.sort((function(S, k) {
      return S.f - k.f;
    }));
    var m = i[0], C = i[1], B = 0, E = 1, H = 2;
    for (i[0] = { lit: -1, f: m.f + C.f, l: m, r: C, d: 0 }; E != o - 1; ) m = B != E && (H == o || i[B].f < i[H].f) ? i[B++] : i[H++], C = B != E && (H == o || i[B].f < i[H].f) ? i[B++] : i[H++], i[E++] = { lit: -1, f: m.f + C.f, l: m, r: C };
    var x = a.F.setDepth(i[E - 1], 0);
    for (x > c && (a.F.restrictDepth(n, c, x), x = c), r = 0; r < o; r++) t[1 + (n[r].lit << 1)] = n[r].d;
    return x;
  }, a.F.setDepth = function(e, t) {
    return e.lit != -1 ? (e.d = t, t) : Math.max(a.F.setDepth(e.l, t + 1), a.F.setDepth(e.r, t + 1));
  }, a.F.restrictDepth = function(e, t, c) {
    var i = 0, p = 1 << c - t, y = 0;
    for (e.sort((function(o, n) {
      return n.d == o.d ? o.f - n.f : n.d - o.d;
    })), i = 0; i < e.length && e[i].d > t; i++) {
      var r = e[i].d;
      e[i].d = t, y += p - (1 << c - r);
    }
    for (y >>>= c - t; y > 0; )
      (r = e[i].d) < t ? (e[i].d++, y -= 1 << t - r - 1) : i++;
    for (; i >= 0; i--) e[i].d == t && y < 0 && (e[i].d--, y++);
    y != 0 && console.log("debt left");
  }, a.F._goodIndex = function(e, t) {
    var c = 0;
    return t[16 | c] <= e && (c |= 16), t[8 | c] <= e && (c |= 8), t[4 | c] <= e && (c |= 4), t[2 | c] <= e && (c |= 2), t[1 | c] <= e && (c |= 1), c;
  }, a.F._writeLit = function(e, t, c, i) {
    return a.F._putsF(c, i, t[e << 1]), i + t[1 + (e << 1)];
  }, a.F.inflate = function(e, t) {
    var c = Uint8Array;
    if (e[0] == 3 && e[1] == 0) return t || new c(0);
    var i = a.F, p = i._bitsF, y = i._bitsE, r = i._decodeTiny, o = i.makeCodes, n = i.codes2map, s = i._get17, m = i.U, C = t == null;
    C && (t = new c(e.length >>> 2 << 3));
    for (var B, E, H = 0, x = 0, S = 0, k = 0, v = 0, _ = 0, d = 0, f = 0, w = 0; H == 0; ) if (H = p(e, w, 1), x = p(e, w + 1, 2), w += 3, x != 0) {
      if (C && (t = a.F._check(t, f + (1 << 17))), x == 1 && (B = m.flmap, E = m.fdmap, _ = 511, d = 31), x == 2) {
        S = y(e, w, 5) + 257, k = y(e, w + 5, 5) + 1, v = y(e, w + 10, 4) + 4, w += 14;
        for (var U = 0; U < 38; U += 2) m.itree[U] = 0, m.itree[U + 1] = 0;
        var I = 1;
        for (U = 0; U < v; U++) {
          var F = y(e, w + 3 * U, 3);
          m.itree[1 + (m.ordr[U] << 1)] = F, F > I && (I = F);
        }
        w += 3 * v, o(m.itree, I), n(m.itree, I, m.imap), B = m.lmap, E = m.dmap, w = r(m.imap, (1 << I) - 1, S + k, e, w, m.ttree);
        var A = i._copyOut(m.ttree, 0, S, m.ltree);
        _ = (1 << A) - 1;
        var D = i._copyOut(m.ttree, S, k, m.dtree);
        d = (1 << D) - 1, o(m.ltree, A), n(m.ltree, A, B), o(m.dtree, D), n(m.dtree, D, E);
      }
      for (; ; ) {
        var g = B[s(e, w) & _];
        w += 15 & g;
        var l = g >>> 4;
        if (!(l >>> 8)) t[f++] = l;
        else {
          if (l == 256) break;
          var G = f + l - 254;
          if (l > 264) {
            var T = m.ldef[l - 257];
            G = f + (T >>> 3) + y(e, w, 7 & T), w += 7 & T;
          }
          var M = E[s(e, w) & d];
          w += 15 & M;
          var Q = M >>> 4, L = m.ddef[Q], O = (L >>> 4) + p(e, w, 15 & L);
          for (w += 15 & L, C && (t = a.F._check(t, f + (1 << 17))); f < G; ) t[f] = t[f++ - O], t[f] = t[f++ - O], t[f] = t[f++ - O], t[f] = t[f++ - O];
          f = G;
        }
      }
    } else {
      (7 & w) != 0 && (w += 8 - (7 & w));
      var P = 4 + (w >>> 3), R = e[P - 4] | e[P - 3] << 8;
      C && (t = a.F._check(t, f + R)), t.set(new c(e.buffer, e.byteOffset + P, R), f), w = P + R << 3, f += R;
    }
    return t.length == f ? t : t.slice(0, f);
  }, a.F._check = function(e, t) {
    var c = e.length;
    if (t <= c) return e;
    var i = new Uint8Array(Math.max(c << 1, t));
    return i.set(e, 0), i;
  }, a.F._decodeTiny = function(e, t, c, i, p, y) {
    for (var r = a.F._bitsE, o = a.F._get17, n = 0; n < c; ) {
      var s = e[o(i, p) & t];
      p += 15 & s;
      var m = s >>> 4;
      if (m <= 15) y[n] = m, n++;
      else {
        var C = 0, B = 0;
        m == 16 ? (B = 3 + r(i, p, 2), p += 2, C = y[n - 1]) : m == 17 ? (B = 3 + r(i, p, 3), p += 3) : m == 18 && (B = 11 + r(i, p, 7), p += 7);
        for (var E = n + B; n < E; ) y[n] = C, n++;
      }
    }
    return p;
  }, a.F._copyOut = function(e, t, c, i) {
    for (var p = 0, y = 0, r = i.length >>> 1; y < c; ) {
      var o = e[y + t];
      i[y << 1] = 0, i[1 + (y << 1)] = o, o > p && (p = o), y++;
    }
    for (; y < r; ) i[y << 1] = 0, i[1 + (y << 1)] = 0, y++;
    return p;
  }, a.F.makeCodes = function(e, t) {
    for (var c, i, p, y, r = a.F.U, o = e.length, n = r.bl_count, s = 0; s <= t; s++) n[s] = 0;
    for (s = 1; s < o; s += 2) n[e[s]]++;
    var m = r.next_code;
    for (c = 0, n[0] = 0, i = 1; i <= t; i++) c = c + n[i - 1] << 1, m[i] = c;
    for (p = 0; p < o; p += 2) (y = e[p + 1]) != 0 && (e[p] = m[y], m[y]++);
  }, a.F.codes2map = function(e, t, c) {
    for (var i = e.length, p = a.F.U.rev15, y = 0; y < i; y += 2) if (e[y + 1] != 0) for (var r = y >> 1, o = e[y + 1], n = r << 4 | o, s = t - o, m = e[y] << s, C = m + (1 << s); m != C; )
      c[p[m] >>> 15 - t] = n, m++;
  }, a.F.revCodes = function(e, t) {
    for (var c = a.F.U.rev15, i = 15 - t, p = 0; p < e.length; p += 2) {
      var y = e[p] << t - e[p + 1];
      e[p] = c[y] >>> i;
    }
  }, a.F._putsE = function(e, t, c) {
    c <<= 7 & t;
    var i = t >>> 3;
    e[i] |= c, e[i + 1] |= c >>> 8;
  }, a.F._putsF = function(e, t, c) {
    c <<= 7 & t;
    var i = t >>> 3;
    e[i] |= c, e[i + 1] |= c >>> 8, e[i + 2] |= c >>> 16;
  }, a.F._bitsE = function(e, t, c) {
    return (e[t >>> 3] | e[1 + (t >>> 3)] << 8) >>> (7 & t) & (1 << c) - 1;
  }, a.F._bitsF = function(e, t, c) {
    return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16) >>> (7 & t) & (1 << c) - 1;
  }, a.F._get17 = function(e, t) {
    return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16) >>> (7 & t);
  }, a.F._get25 = function(e, t) {
    return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16 | e[3 + (t >>> 3)] << 24) >>> (7 & t);
  }, a.F.U = (h = Uint16Array, b = Uint32Array, { next_code: new h(16), bl_count: new h(16), ordr: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], of0: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999], exb: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0], ldef: new h(32), df0: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535], dxb: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0], ddef: new b(32), flmap: new h(512), fltree: [], fdmap: new h(32), fdtree: [], lmap: new h(32768), ltree: [], ttree: [], dmap: new h(32768), dtree: [], imap: new h(512), itree: [], rev15: new h(32768), lhst: new b(286), dhst: new b(30), ihst: new b(19), lits: new b(15e3), strt: new h(65536), prev: new h(32768) }), (function() {
    for (var e = a.F.U, t = 0; t < 32768; t++) {
      var c = t;
      c = (4278255360 & (c = (4042322160 & (c = (3435973836 & (c = (2863311530 & c) >>> 1 | (1431655765 & c) << 1)) >>> 2 | (858993459 & c) << 2)) >>> 4 | (252645135 & c) << 4)) >>> 8 | (16711935 & c) << 8, e.rev15[t] = (c >>> 16 | c << 16) >>> 17;
    }
    function i(p, y, r) {
      for (; y-- != 0; ) p.push(0, r);
    }
    for (t = 0; t < 32; t++) e.ldef[t] = e.of0[t] << 3 | e.exb[t], e.ddef[t] = e.df0[t] << 4 | e.dxb[t];
    i(e.fltree, 144, 8), i(e.fltree, 112, 9), i(e.fltree, 24, 7), i(e.fltree, 8, 8), a.F.makeCodes(e.fltree, 9), a.F.codes2map(e.fltree, 9, e.flmap), a.F.revCodes(e.fltree, 9), i(e.fdtree, 32, 5), a.F.makeCodes(e.fdtree, 5), a.F.codes2map(e.fdtree, 5, e.fdmap), a.F.revCodes(e.fdtree, 5), i(e.itree, 19, 0), i(e.ltree, 286, 0), i(e.dtree, 30, 0), i(e.ttree, 320, 0);
  })();
})();
var jt = $t({ __proto__: null, default: $e }, [$e]);
const he = (function() {
  var u = { nextZero(r, o) {
    for (; r[o] != 0; ) o++;
    return o;
  }, readUshort: (r, o) => r[o] << 8 | r[o + 1], writeUshort(r, o, n) {
    r[o] = n >> 8 & 255, r[o + 1] = 255 & n;
  }, readUint: (r, o) => 16777216 * r[o] + (r[o + 1] << 16 | r[o + 2] << 8 | r[o + 3]), writeUint(r, o, n) {
    r[o] = n >> 24 & 255, r[o + 1] = n >> 16 & 255, r[o + 2] = n >> 8 & 255, r[o + 3] = 255 & n;
  }, readASCII(r, o, n) {
    let s = "";
    for (let m = 0; m < n; m++) s += String.fromCharCode(r[o + m]);
    return s;
  }, writeASCII(r, o, n) {
    for (let s = 0; s < n.length; s++) r[o + s] = n.charCodeAt(s);
  }, readBytes(r, o, n) {
    const s = [];
    for (let m = 0; m < n; m++) s.push(r[o + m]);
    return s;
  }, pad: (r) => r.length < 2 ? `0${r}` : r, readUTF8(r, o, n) {
    let s, m = "";
    for (let C = 0; C < n; C++) m += `%${u.pad(r[o + C].toString(16))}`;
    try {
      s = decodeURIComponent(m);
    } catch {
      return u.readASCII(r, o, n);
    }
    return s;
  } };
  function h(r, o, n, s) {
    const m = o * n, C = t(s), B = Math.ceil(o * C / 8), E = new Uint8Array(4 * m), H = new Uint32Array(E.buffer), { ctype: x } = s, { depth: S } = s, k = u.readUshort;
    if (x == 6) {
      const T = m << 2;
      if (S == 8) for (var v = 0; v < T; v += 4) E[v] = r[v], E[v + 1] = r[v + 1], E[v + 2] = r[v + 2], E[v + 3] = r[v + 3];
      if (S == 16) for (v = 0; v < T; v++) E[v] = r[v << 1];
    } else if (x == 2) {
      const T = s.tabs.tRNS;
      if (T == null) {
        if (S == 8) for (v = 0; v < m; v++) {
          var _ = 3 * v;
          H[v] = 255 << 24 | r[_ + 2] << 16 | r[_ + 1] << 8 | r[_];
        }
        if (S == 16) for (v = 0; v < m; v++)
          _ = 6 * v, H[v] = 255 << 24 | r[_ + 4] << 16 | r[_ + 2] << 8 | r[_];
      } else {
        var d = T[0];
        const M = T[1], Q = T[2];
        if (S == 8) for (v = 0; v < m; v++) {
          var f = v << 2;
          _ = 3 * v, H[v] = 255 << 24 | r[_ + 2] << 16 | r[_ + 1] << 8 | r[_], r[_] == d && r[_ + 1] == M && r[_ + 2] == Q && (E[f + 3] = 0);
        }
        if (S == 16) for (v = 0; v < m; v++)
          f = v << 2, _ = 6 * v, H[v] = 255 << 24 | r[_ + 4] << 16 | r[_ + 2] << 8 | r[_], k(r, _) == d && k(r, _ + 2) == M && k(r, _ + 4) == Q && (E[f + 3] = 0);
      }
    } else if (x == 3) {
      const T = s.tabs.PLTE, M = s.tabs.tRNS, Q = M ? M.length : 0;
      if (S == 1) for (var w = 0; w < n; w++) {
        var U = w * B, I = w * o;
        for (v = 0; v < o; v++) {
          f = I + v << 2;
          var F = 3 * (A = r[U + (v >> 3)] >> 7 - ((7 & v) << 0) & 1);
          E[f] = T[F], E[f + 1] = T[F + 1], E[f + 2] = T[F + 2], E[f + 3] = A < Q ? M[A] : 255;
        }
      }
      if (S == 2) for (w = 0; w < n; w++) for (U = w * B, I = w * o, v = 0; v < o; v++)
        f = I + v << 2, F = 3 * (A = r[U + (v >> 2)] >> 6 - ((3 & v) << 1) & 3), E[f] = T[F], E[f + 1] = T[F + 1], E[f + 2] = T[F + 2], E[f + 3] = A < Q ? M[A] : 255;
      if (S == 4) for (w = 0; w < n; w++) for (U = w * B, I = w * o, v = 0; v < o; v++)
        f = I + v << 2, F = 3 * (A = r[U + (v >> 1)] >> 4 - ((1 & v) << 2) & 15), E[f] = T[F], E[f + 1] = T[F + 1], E[f + 2] = T[F + 2], E[f + 3] = A < Q ? M[A] : 255;
      if (S == 8) for (v = 0; v < m; v++) {
        var A;
        f = v << 2, F = 3 * (A = r[v]), E[f] = T[F], E[f + 1] = T[F + 1], E[f + 2] = T[F + 2], E[f + 3] = A < Q ? M[A] : 255;
      }
    } else if (x == 4) {
      if (S == 8) for (v = 0; v < m; v++) {
        f = v << 2;
        var D = r[g = v << 1];
        E[f] = D, E[f + 1] = D, E[f + 2] = D, E[f + 3] = r[g + 1];
      }
      if (S == 16) for (v = 0; v < m; v++) {
        var g;
        f = v << 2, D = r[g = v << 2], E[f] = D, E[f + 1] = D, E[f + 2] = D, E[f + 3] = r[g + 2];
      }
    } else if (x == 0) for (d = s.tabs.tRNS ? s.tabs.tRNS : -1, w = 0; w < n; w++) {
      const T = w * B, M = w * o;
      if (S == 1) for (var l = 0; l < o; l++) {
        var G = (D = 255 * (r[T + (l >>> 3)] >>> 7 - (7 & l) & 1)) == 255 * d ? 0 : 255;
        H[M + l] = G << 24 | D << 16 | D << 8 | D;
      }
      else if (S == 2) for (l = 0; l < o; l++)
        G = (D = 85 * (r[T + (l >>> 2)] >>> 6 - ((3 & l) << 1) & 3)) == 85 * d ? 0 : 255, H[M + l] = G << 24 | D << 16 | D << 8 | D;
      else if (S == 4) for (l = 0; l < o; l++)
        G = (D = 17 * (r[T + (l >>> 1)] >>> 4 - ((1 & l) << 2) & 15)) == 17 * d ? 0 : 255, H[M + l] = G << 24 | D << 16 | D << 8 | D;
      else if (S == 8) for (l = 0; l < o; l++)
        G = (D = r[T + l]) == d ? 0 : 255, H[M + l] = G << 24 | D << 16 | D << 8 | D;
      else if (S == 16) for (l = 0; l < o; l++)
        D = r[T + (l << 1)], G = k(r, T + (l << 1)) == d ? 0 : 255, H[M + l] = G << 24 | D << 16 | D << 8 | D;
    }
    return E;
  }
  function b(r, o, n, s) {
    const m = t(r), C = Math.ceil(n * m / 8), B = new Uint8Array((C + 1 + r.interlace) * s);
    return o = r.tabs.CgBI ? e(o, B) : a(o, B), r.interlace == 0 ? o = c(o, r, 0, n, s) : r.interlace == 1 && (o = (function(H, x) {
      const S = x.width, k = x.height, v = t(x), _ = v >> 3, d = Math.ceil(S * v / 8), f = new Uint8Array(k * d);
      let w = 0;
      const U = [0, 0, 4, 0, 2, 0, 1], I = [0, 4, 0, 2, 0, 1, 0], F = [8, 8, 8, 4, 4, 2, 2], A = [8, 8, 4, 4, 2, 2, 1];
      let D = 0;
      for (; D < 7; ) {
        const l = F[D], G = A[D];
        let T = 0, M = 0, Q = U[D];
        for (; Q < k; ) Q += l, M++;
        let L = I[D];
        for (; L < S; ) L += G, T++;
        const O = Math.ceil(T * v / 8);
        c(H, x, w, T, M);
        let P = 0, R = U[D];
        for (; R < k; ) {
          let N = I[D], Z = w + P * O << 3;
          for (; N < S; ) {
            var g;
            if (v == 1 && (g = (g = H[Z >> 3]) >> 7 - (7 & Z) & 1, f[R * d + (N >> 3)] |= g << 7 - ((7 & N) << 0)), v == 2 && (g = (g = H[Z >> 3]) >> 6 - (7 & Z) & 3, f[R * d + (N >> 2)] |= g << 6 - ((3 & N) << 1)), v == 4 && (g = (g = H[Z >> 3]) >> 4 - (7 & Z) & 15, f[R * d + (N >> 1)] |= g << 4 - ((1 & N) << 2)), v >= 8) {
              const W = R * d + N * _;
              for (let z = 0; z < _; z++) f[W + z] = H[(Z >> 3) + z];
            }
            Z += v, N += G;
          }
          P++, R += l;
        }
        T * M != 0 && (w += M * (1 + O)), D += 1;
      }
      return f;
    })(o, r)), o;
  }
  function a(r, o) {
    return e(new Uint8Array(r.buffer, 2, r.length - 6), o);
  }
  var e = (function() {
    const r = { H: {} };
    return r.H.N = function(o, n) {
      const s = Uint8Array;
      let m, C, B = 0, E = 0, H = 0, x = 0, S = 0, k = 0, v = 0, _ = 0, d = 0;
      if (o[0] == 3 && o[1] == 0) return n || new s(0);
      const f = r.H, w = f.b, U = f.e, I = f.R, F = f.n, A = f.A, D = f.Z, g = f.m, l = n == null;
      for (l && (n = new s(o.length >>> 2 << 5)); B == 0; ) if (B = w(o, d, 1), E = w(o, d + 1, 2), d += 3, E != 0) {
        if (l && (n = r.H.W(n, _ + (1 << 17))), E == 1 && (m = g.J, C = g.h, k = 511, v = 31), E == 2) {
          H = U(o, d, 5) + 257, x = U(o, d + 5, 5) + 1, S = U(o, d + 10, 4) + 4, d += 14;
          let T = 1;
          for (var G = 0; G < 38; G += 2) g.Q[G] = 0, g.Q[G + 1] = 0;
          for (G = 0; G < S; G++) {
            const L = U(o, d + 3 * G, 3);
            g.Q[1 + (g.X[G] << 1)] = L, L > T && (T = L);
          }
          d += 3 * S, F(g.Q, T), A(g.Q, T, g.u), m = g.w, C = g.d, d = I(g.u, (1 << T) - 1, H + x, o, d, g.v);
          const M = f.V(g.v, 0, H, g.C);
          k = (1 << M) - 1;
          const Q = f.V(g.v, H, x, g.D);
          v = (1 << Q) - 1, F(g.C, M), A(g.C, M, m), F(g.D, Q), A(g.D, Q, C);
        }
        for (; ; ) {
          const T = m[D(o, d) & k];
          d += 15 & T;
          const M = T >>> 4;
          if (!(M >>> 8)) n[_++] = M;
          else {
            if (M == 256) break;
            {
              let Q = _ + M - 254;
              if (M > 264) {
                const N = g.q[M - 257];
                Q = _ + (N >>> 3) + U(o, d, 7 & N), d += 7 & N;
              }
              const L = C[D(o, d) & v];
              d += 15 & L;
              const O = L >>> 4, P = g.c[O], R = (P >>> 4) + w(o, d, 15 & P);
              for (d += 15 & P; _ < Q; ) n[_] = n[_++ - R], n[_] = n[_++ - R], n[_] = n[_++ - R], n[_] = n[_++ - R];
              _ = Q;
            }
          }
        }
      } else {
        (7 & d) != 0 && (d += 8 - (7 & d));
        const T = 4 + (d >>> 3), M = o[T - 4] | o[T - 3] << 8;
        l && (n = r.H.W(n, _ + M)), n.set(new s(o.buffer, o.byteOffset + T, M), _), d = T + M << 3, _ += M;
      }
      return n.length == _ ? n : n.slice(0, _);
    }, r.H.W = function(o, n) {
      const s = o.length;
      if (n <= s) return o;
      const m = new Uint8Array(s << 1);
      return m.set(o, 0), m;
    }, r.H.R = function(o, n, s, m, C, B) {
      const E = r.H.e, H = r.H.Z;
      let x = 0;
      for (; x < s; ) {
        const S = o[H(m, C) & n];
        C += 15 & S;
        const k = S >>> 4;
        if (k <= 15) B[x] = k, x++;
        else {
          let v = 0, _ = 0;
          k == 16 ? (_ = 3 + E(m, C, 2), C += 2, v = B[x - 1]) : k == 17 ? (_ = 3 + E(m, C, 3), C += 3) : k == 18 && (_ = 11 + E(m, C, 7), C += 7);
          const d = x + _;
          for (; x < d; ) B[x] = v, x++;
        }
      }
      return C;
    }, r.H.V = function(o, n, s, m) {
      let C = 0, B = 0;
      const E = m.length >>> 1;
      for (; B < s; ) {
        const H = o[B + n];
        m[B << 1] = 0, m[1 + (B << 1)] = H, H > C && (C = H), B++;
      }
      for (; B < E; ) m[B << 1] = 0, m[1 + (B << 1)] = 0, B++;
      return C;
    }, r.H.n = function(o, n) {
      const s = r.H.m, m = o.length;
      let C, B, E, H;
      const x = s.j;
      for (var S = 0; S <= n; S++) x[S] = 0;
      for (S = 1; S < m; S += 2) x[o[S]]++;
      const k = s.K;
      for (C = 0, x[0] = 0, B = 1; B <= n; B++) C = C + x[B - 1] << 1, k[B] = C;
      for (E = 0; E < m; E += 2) H = o[E + 1], H != 0 && (o[E] = k[H], k[H]++);
    }, r.H.A = function(o, n, s) {
      const m = o.length, C = r.H.m.r;
      for (let B = 0; B < m; B += 2) if (o[B + 1] != 0) {
        const E = B >> 1, H = o[B + 1], x = E << 4 | H, S = n - H;
        let k = o[B] << S;
        const v = k + (1 << S);
        for (; k != v; )
          s[C[k] >>> 15 - n] = x, k++;
      }
    }, r.H.l = function(o, n) {
      const s = r.H.m.r, m = 15 - n;
      for (let C = 0; C < o.length; C += 2) {
        const B = o[C] << n - o[C + 1];
        o[C] = s[B] >>> m;
      }
    }, r.H.M = function(o, n, s) {
      s <<= 7 & n;
      const m = n >>> 3;
      o[m] |= s, o[m + 1] |= s >>> 8;
    }, r.H.I = function(o, n, s) {
      s <<= 7 & n;
      const m = n >>> 3;
      o[m] |= s, o[m + 1] |= s >>> 8, o[m + 2] |= s >>> 16;
    }, r.H.e = function(o, n, s) {
      return (o[n >>> 3] | o[1 + (n >>> 3)] << 8) >>> (7 & n) & (1 << s) - 1;
    }, r.H.b = function(o, n, s) {
      return (o[n >>> 3] | o[1 + (n >>> 3)] << 8 | o[2 + (n >>> 3)] << 16) >>> (7 & n) & (1 << s) - 1;
    }, r.H.Z = function(o, n) {
      return (o[n >>> 3] | o[1 + (n >>> 3)] << 8 | o[2 + (n >>> 3)] << 16) >>> (7 & n);
    }, r.H.i = function(o, n) {
      return (o[n >>> 3] | o[1 + (n >>> 3)] << 8 | o[2 + (n >>> 3)] << 16 | o[3 + (n >>> 3)] << 24) >>> (7 & n);
    }, r.H.m = (function() {
      const o = Uint16Array, n = Uint32Array;
      return { K: new o(16), j: new o(16), X: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], S: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999], T: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0], q: new o(32), p: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535], z: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0], c: new n(32), J: new o(512), _: [], h: new o(32), $: [], w: new o(32768), C: [], v: [], d: new o(32768), D: [], u: new o(512), Q: [], r: new o(32768), s: new n(286), Y: new n(30), a: new n(19), t: new n(15e3), k: new o(65536), g: new o(32768) };
    })(), (function() {
      const o = r.H.m;
      for (var n = 0; n < 32768; n++) {
        let m = n;
        m = (2863311530 & m) >>> 1 | (1431655765 & m) << 1, m = (3435973836 & m) >>> 2 | (858993459 & m) << 2, m = (4042322160 & m) >>> 4 | (252645135 & m) << 4, m = (4278255360 & m) >>> 8 | (16711935 & m) << 8, o.r[n] = (m >>> 16 | m << 16) >>> 17;
      }
      function s(m, C, B) {
        for (; C-- != 0; ) m.push(0, B);
      }
      for (n = 0; n < 32; n++) o.q[n] = o.S[n] << 3 | o.T[n], o.c[n] = o.p[n] << 4 | o.z[n];
      s(o._, 144, 8), s(o._, 112, 9), s(o._, 24, 7), s(o._, 8, 8), r.H.n(o._, 9), r.H.A(o._, 9, o.J), r.H.l(o._, 9), s(o.$, 32, 5), r.H.n(o.$, 5), r.H.A(o.$, 5, o.h), r.H.l(o.$, 5), s(o.Q, 19, 0), s(o.C, 286, 0), s(o.D, 30, 0), s(o.v, 320, 0);
    })(), r.H.N;
  })();
  function t(r) {
    return [1, null, 3, 1, 2, null, 4][r.ctype] * r.depth;
  }
  function c(r, o, n, s, m) {
    let C = t(o);
    const B = Math.ceil(s * C / 8);
    let E, H;
    C = Math.ceil(C / 8);
    let x = r[n], S = 0;
    if (x > 1 && (r[n] = [0, 0, 1][x - 2]), x == 3) for (S = C; S < B; S++) r[S + 1] = r[S + 1] + (r[S + 1 - C] >>> 1) & 255;
    for (let k = 0; k < m; k++) if (E = n + k * B, H = E + k + 1, x = r[H - 1], S = 0, x == 0) for (; S < B; S++) r[E + S] = r[H + S];
    else if (x == 1) {
      for (; S < C; S++) r[E + S] = r[H + S];
      for (; S < B; S++) r[E + S] = r[H + S] + r[E + S - C];
    } else if (x == 2) for (; S < B; S++) r[E + S] = r[H + S] + r[E + S - B];
    else if (x == 3) {
      for (; S < C; S++) r[E + S] = r[H + S] + (r[E + S - B] >>> 1);
      for (; S < B; S++) r[E + S] = r[H + S] + (r[E + S - B] + r[E + S - C] >>> 1);
    } else {
      for (; S < C; S++) r[E + S] = r[H + S] + i(0, r[E + S - B], 0);
      for (; S < B; S++) r[E + S] = r[H + S] + i(r[E + S - C], r[E + S - B], r[E + S - C - B]);
    }
    return r;
  }
  function i(r, o, n) {
    const s = r + o - n, m = s - r, C = s - o, B = s - n;
    return m * m <= C * C && m * m <= B * B ? r : C * C <= B * B ? o : n;
  }
  function p(r, o, n) {
    n.width = u.readUint(r, o), o += 4, n.height = u.readUint(r, o), o += 4, n.depth = r[o], o++, n.ctype = r[o], o++, n.compress = r[o], o++, n.filter = r[o], o++, n.interlace = r[o], o++;
  }
  function y(r, o, n, s, m, C, B, E, H) {
    const x = Math.min(o, m), S = Math.min(n, C);
    let k = 0, v = 0;
    for (let D = 0; D < S; D++) for (let g = 0; g < x; g++) if (B >= 0 && E >= 0 ? (k = D * o + g << 2, v = (E + D) * m + B + g << 2) : (k = (-E + D) * o - B + g << 2, v = D * m + g << 2), H == 0) s[v] = r[k], s[v + 1] = r[k + 1], s[v + 2] = r[k + 2], s[v + 3] = r[k + 3];
    else if (H == 1) {
      var _ = r[k + 3] * 0.00392156862745098, d = r[k] * _, f = r[k + 1] * _, w = r[k + 2] * _, U = s[v + 3] * (1 / 255), I = s[v] * U, F = s[v + 1] * U, A = s[v + 2] * U;
      const l = 1 - _, G = _ + U * l, T = G == 0 ? 0 : 1 / G;
      s[v + 3] = 255 * G, s[v + 0] = (d + I * l) * T, s[v + 1] = (f + F * l) * T, s[v + 2] = (w + A * l) * T;
    } else if (H == 2)
      _ = r[k + 3], d = r[k], f = r[k + 1], w = r[k + 2], U = s[v + 3], I = s[v], F = s[v + 1], A = s[v + 2], _ == U && d == I && f == F && w == A ? (s[v] = 0, s[v + 1] = 0, s[v + 2] = 0, s[v + 3] = 0) : (s[v] = d, s[v + 1] = f, s[v + 2] = w, s[v + 3] = _);
    else if (H == 3) {
      if (_ = r[k + 3], d = r[k], f = r[k + 1], w = r[k + 2], U = s[v + 3], I = s[v], F = s[v + 1], A = s[v + 2], _ == U && d == I && f == F && w == A) continue;
      if (_ < 220 && U > 20) return !1;
    }
    return !0;
  }
  return { decode: function(o) {
    const n = new Uint8Array(o);
    let s = 8;
    const m = u, C = m.readUshort, B = m.readUint, E = { tabs: {}, frames: [] }, H = new Uint8Array(n.length);
    let x, S = 0, k = 0;
    const v = [137, 80, 78, 71, 13, 10, 26, 10];
    for (var _ = 0; _ < 8; _++) if (n[_] != v[_]) throw "The input is not a PNG file!";
    for (; s < n.length; ) {
      const D = m.readUint(n, s);
      s += 4;
      const g = m.readASCII(n, s, 4);
      if (s += 4, g == "IHDR") p(n, s, E);
      else if (g == "iCCP") {
        for (var d = s; n[d] != 0; ) d++;
        m.readASCII(n, s, d - s), n[d + 1];
        const l = n.slice(d + 2, s + D);
        let G = null;
        try {
          G = a(l);
        } catch {
          G = e(l);
        }
        E.tabs[g] = G;
      } else if (g == "CgBI") E.tabs[g] = n.slice(s, s + 4);
      else if (g == "IDAT") {
        for (_ = 0; _ < D; _++) H[S + _] = n[s + _];
        S += D;
      } else if (g == "acTL") E.tabs[g] = { num_frames: B(n, s), num_plays: B(n, s + 4) }, x = new Uint8Array(n.length);
      else if (g == "fcTL") {
        k != 0 && ((A = E.frames[E.frames.length - 1]).data = b(E, x.slice(0, k), A.rect.width, A.rect.height), k = 0);
        const l = { x: B(n, s + 12), y: B(n, s + 16), width: B(n, s + 4), height: B(n, s + 8) };
        let G = C(n, s + 22);
        G = C(n, s + 20) / (G == 0 ? 100 : G);
        const T = { rect: l, delay: Math.round(1e3 * G), dispose: n[s + 24], blend: n[s + 25] };
        E.frames.push(T);
      } else if (g == "fdAT") {
        for (_ = 0; _ < D - 4; _++) x[k + _] = n[s + _ + 4];
        k += D - 4;
      } else if (g == "pHYs") E.tabs[g] = [m.readUint(n, s), m.readUint(n, s + 4), n[s + 8]];
      else if (g == "cHRM")
        for (E.tabs[g] = [], _ = 0; _ < 8; _++) E.tabs[g].push(m.readUint(n, s + 4 * _));
      else if (g == "tEXt" || g == "zTXt") {
        E.tabs[g] == null && (E.tabs[g] = {});
        var f = m.nextZero(n, s), w = m.readASCII(n, s, f - s), U = s + D - f - 1;
        if (g == "tEXt") F = m.readASCII(n, f + 1, U);
        else {
          var I = a(n.slice(f + 2, f + 2 + U));
          F = m.readUTF8(I, 0, I.length);
        }
        E.tabs[g][w] = F;
      } else if (g == "iTXt") {
        E.tabs[g] == null && (E.tabs[g] = {}), f = 0, d = s, f = m.nextZero(n, d), w = m.readASCII(n, d, f - d);
        const l = n[d = f + 1];
        var F;
        n[d + 1], d += 2, f = m.nextZero(n, d), m.readASCII(n, d, f - d), d = f + 1, f = m.nextZero(n, d), m.readUTF8(n, d, f - d), U = D - ((d = f + 1) - s), l == 0 ? F = m.readUTF8(n, d, U) : (I = a(n.slice(d, d + U)), F = m.readUTF8(I, 0, I.length)), E.tabs[g][w] = F;
      } else if (g == "PLTE") E.tabs[g] = m.readBytes(n, s, D);
      else if (g == "hIST") {
        const l = E.tabs.PLTE.length / 3;
        for (E.tabs[g] = [], _ = 0; _ < l; _++) E.tabs[g].push(C(n, s + 2 * _));
      } else if (g == "tRNS") E.ctype == 3 ? E.tabs[g] = m.readBytes(n, s, D) : E.ctype == 0 ? E.tabs[g] = C(n, s) : E.ctype == 2 && (E.tabs[g] = [C(n, s), C(n, s + 2), C(n, s + 4)]);
      else if (g == "gAMA") E.tabs[g] = m.readUint(n, s) / 1e5;
      else if (g == "sRGB") E.tabs[g] = n[s];
      else if (g == "bKGD") E.ctype == 0 || E.ctype == 4 ? E.tabs[g] = [C(n, s)] : E.ctype == 2 || E.ctype == 6 ? E.tabs[g] = [C(n, s), C(n, s + 2), C(n, s + 4)] : E.ctype == 3 && (E.tabs[g] = n[s]);
      else if (g == "IEND") break;
      s += D, m.readUint(n, s), s += 4;
    }
    var A;
    return k != 0 && ((A = E.frames[E.frames.length - 1]).data = b(E, x.slice(0, k), A.rect.width, A.rect.height)), E.data = b(E, H, E.width, E.height), delete E.compress, delete E.interlace, delete E.filter, E;
  }, toRGBA8: function(o) {
    const n = o.width, s = o.height;
    if (o.tabs.acTL == null) return [h(o.data, n, s, o).buffer];
    const m = [];
    o.frames[0].data == null && (o.frames[0].data = o.data);
    const C = n * s * 4, B = new Uint8Array(C), E = new Uint8Array(C), H = new Uint8Array(C);
    for (let S = 0; S < o.frames.length; S++) {
      const k = o.frames[S], v = k.rect.x, _ = k.rect.y, d = k.rect.width, f = k.rect.height, w = h(k.data, d, f, o);
      if (S != 0) for (var x = 0; x < C; x++) H[x] = B[x];
      if (k.blend == 0 ? y(w, d, f, B, n, s, v, _, 0) : k.blend == 1 && y(w, d, f, B, n, s, v, _, 1), m.push(B.buffer.slice(0)), k.dispose != 0) {
        if (k.dispose == 1) y(E, d, f, B, n, s, v, _, 0);
        else if (k.dispose == 2) for (x = 0; x < C; x++) B[x] = H[x];
      }
    }
    return m;
  }, _paeth: i, _copyTile: y, _bin: u };
})();
(function() {
  const { _copyTile: u } = he, { _bin: h } = he, b = he._paeth;
  var a = { table: (function() {
    const d = new Uint32Array(256);
    for (let f = 0; f < 256; f++) {
      let w = f;
      for (let U = 0; U < 8; U++) 1 & w ? w = 3988292384 ^ w >>> 1 : w >>>= 1;
      d[f] = w;
    }
    return d;
  })(), update(d, f, w, U) {
    for (let I = 0; I < U; I++) d = a.table[255 & (d ^ f[w + I])] ^ d >>> 8;
    return d;
  }, crc: (d, f, w) => 4294967295 ^ a.update(4294967295, d, f, w) };
  function e(d, f, w, U) {
    f[w] += d[0] * U >> 4, f[w + 1] += d[1] * U >> 4, f[w + 2] += d[2] * U >> 4, f[w + 3] += d[3] * U >> 4;
  }
  function t(d) {
    return Math.max(0, Math.min(255, d));
  }
  function c(d, f) {
    const w = d[0] - f[0], U = d[1] - f[1], I = d[2] - f[2], F = d[3] - f[3];
    return w * w + U * U + I * I + F * F;
  }
  function i(d, f, w, U, I, F, A) {
    A == null && (A = 1);
    const D = U.length, g = [];
    for (var l = 0; l < D; l++) {
      const R = U[l];
      g.push([R >>> 0 & 255, R >>> 8 & 255, R >>> 16 & 255, R >>> 24 & 255]);
    }
    for (l = 0; l < D; l++) {
      let R = 4294967295;
      for (var G = 0, T = 0; T < D; T++) {
        var M = c(g[l], g[T]);
        T != l && M < R && (R = M, G = T);
      }
    }
    const Q = new Uint32Array(I.buffer), L = new Int16Array(f * w * 4), O = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    for (l = 0; l < O.length; l++) O[l] = 255 * ((O[l] + 0.5) / 16 - 0.5);
    for (let R = 0; R < w; R++) for (let N = 0; N < f; N++) {
      var P;
      l = 4 * (R * f + N), A != 2 ? P = [t(d[l] + L[l]), t(d[l + 1] + L[l + 1]), t(d[l + 2] + L[l + 2]), t(d[l + 3] + L[l + 3])] : (M = O[4 * (3 & R) + (3 & N)], P = [t(d[l] + M), t(d[l + 1] + M), t(d[l + 2] + M), t(d[l + 3] + M)]), G = 0;
      let Z = 16777215;
      for (T = 0; T < D; T++) {
        const q = c(P, g[T]);
        q < Z && (Z = q, G = T);
      }
      const W = g[G], z = [P[0] - W[0], P[1] - W[1], P[2] - W[2], P[3] - W[3]];
      A == 1 && (N != f - 1 && e(z, L, l + 4, 7), R != w - 1 && (N != 0 && e(z, L, l + 4 * f - 4, 3), e(z, L, l + 4 * f, 5), N != f - 1 && e(z, L, l + 4 * f + 4, 1))), F[l >> 2] = G, Q[l >> 2] = U[G];
    }
  }
  function p(d, f, w, U, I) {
    I == null && (I = {});
    const { crc: F } = a, A = h.writeUint, D = h.writeUshort, g = h.writeASCII;
    let l = 8;
    const G = d.frames.length > 1;
    let T, M = !1, Q = 33 + (G ? 20 : 0);
    if (I.sRGB != null && (Q += 13), I.pHYs != null && (Q += 21), I.iCCP != null && (T = pako.deflate(I.iCCP), Q += 21 + T.length + 4), d.ctype == 3) {
      for (var L = d.plte.length, O = 0; O < L; O++) d.plte[O] >>> 24 != 255 && (M = !0);
      Q += 8 + 3 * L + 4 + (M ? 8 + 1 * L + 4 : 0);
    }
    for (var P = 0; P < d.frames.length; P++)
      G && (Q += 38), Q += (W = d.frames[P]).cimg.length + 12, P != 0 && (Q += 4);
    Q += 12;
    const R = new Uint8Array(Q), N = [137, 80, 78, 71, 13, 10, 26, 10];
    for (O = 0; O < 8; O++) R[O] = N[O];
    if (A(R, l, 13), l += 4, g(R, l, "IHDR"), l += 4, A(R, l, f), l += 4, A(R, l, w), l += 4, R[l] = d.depth, l++, R[l] = d.ctype, l++, R[l] = 0, l++, R[l] = 0, l++, R[l] = 0, l++, A(R, l, F(R, l - 17, 17)), l += 4, I.sRGB != null && (A(R, l, 1), l += 4, g(R, l, "sRGB"), l += 4, R[l] = I.sRGB, l++, A(R, l, F(R, l - 5, 5)), l += 4), I.iCCP != null) {
      const z = 13 + T.length;
      A(R, l, z), l += 4, g(R, l, "iCCP"), l += 4, g(R, l, "ICC profile"), l += 11, l += 2, R.set(T, l), l += T.length, A(R, l, F(R, l - (z + 4), z + 4)), l += 4;
    }
    if (I.pHYs != null && (A(R, l, 9), l += 4, g(R, l, "pHYs"), l += 4, A(R, l, I.pHYs[0]), l += 4, A(R, l, I.pHYs[1]), l += 4, R[l] = I.pHYs[2], l++, A(R, l, F(R, l - 13, 13)), l += 4), G && (A(R, l, 8), l += 4, g(R, l, "acTL"), l += 4, A(R, l, d.frames.length), l += 4, A(R, l, I.loop != null ? I.loop : 0), l += 4, A(R, l, F(R, l - 12, 12)), l += 4), d.ctype == 3) {
      for (A(R, l, 3 * (L = d.plte.length)), l += 4, g(R, l, "PLTE"), l += 4, O = 0; O < L; O++) {
        const z = 3 * O, q = d.plte[O], J = 255 & q, te = q >>> 8 & 255, Ue = q >>> 16 & 255;
        R[l + z + 0] = J, R[l + z + 1] = te, R[l + z + 2] = Ue;
      }
      if (l += 3 * L, A(R, l, F(R, l - 3 * L - 4, 3 * L + 4)), l += 4, M) {
        for (A(R, l, L), l += 4, g(R, l, "tRNS"), l += 4, O = 0; O < L; O++) R[l + O] = d.plte[O] >>> 24 & 255;
        l += L, A(R, l, F(R, l - L - 4, L + 4)), l += 4;
      }
    }
    let Z = 0;
    for (P = 0; P < d.frames.length; P++) {
      var W = d.frames[P];
      G && (A(R, l, 26), l += 4, g(R, l, "fcTL"), l += 4, A(R, l, Z++), l += 4, A(R, l, W.rect.width), l += 4, A(R, l, W.rect.height), l += 4, A(R, l, W.rect.x), l += 4, A(R, l, W.rect.y), l += 4, D(R, l, U[P]), l += 2, D(R, l, 1e3), l += 2, R[l] = W.dispose, l++, R[l] = W.blend, l++, A(R, l, F(R, l - 30, 30)), l += 4);
      const z = W.cimg;
      A(R, l, (L = z.length) + (P == 0 ? 0 : 4)), l += 4;
      const q = l;
      g(R, l, P == 0 ? "IDAT" : "fdAT"), l += 4, P != 0 && (A(R, l, Z++), l += 4), R.set(z, l), l += L, A(R, l, F(R, q, l - q)), l += 4;
    }
    return A(R, l, 0), l += 4, g(R, l, "IEND"), l += 4, A(R, l, F(R, l - 4, 4)), l += 4, R.buffer;
  }
  function y(d, f, w) {
    for (let U = 0; U < d.frames.length; U++) {
      const I = d.frames[U];
      I.rect.width;
      const F = I.rect.height, A = new Uint8Array(F * I.bpl + F);
      I.cimg = s(I.img, F, I.bpp, I.bpl, A, f, w);
    }
  }
  function r(d, f, w, U, I) {
    const F = I[0], A = I[1], D = I[2], g = I[3], l = I[4], G = I[5];
    let T = 6, M = 8, Q = 255;
    for (var L = 0; L < d.length; L++) {
      const re = new Uint8Array(d[L]);
      for (var O = re.length, P = 0; P < O; P += 4) Q &= re[P + 3];
    }
    const R = Q != 255, N = (function(Y, j, ne, ie, V, fe) {
      const ee = [];
      for (var K = 0; K < Y.length; K++) {
        const se = new Uint8Array(Y[K]), ge = new Uint32Array(se.buffer);
        var ue;
        let de = 0, be = 0, pe = j, Fe = ne, Ze = ie ? 1 : 0;
        if (K != 0) {
          const Mt = fe || ie || K == 1 || ee[K - 2].dispose != 0 ? 1 : 2;
          let Ye = 0, ot = 1e9;
          for (let Ge = 0; Ge < Mt; Ge++) {
            var Ee = new Uint8Array(Y[K - 1 - Ge]);
            const xt = new Uint32Array(Y[K - 1 - Ge]);
            let Ie = j, ye = ne, Me = -1, He = -1;
            for (let De = 0; De < ne; De++) for (let Te = 0; Te < j; Te++)
              ge[oe = De * j + Te] != xt[oe] && (Te < Ie && (Ie = Te), Te > Me && (Me = Te), De < ye && (ye = De), De > He && (He = De));
            Me == -1 && (Ie = ye = Me = He = 0), V && ((1 & Ie) == 1 && Ie--, (1 & ye) == 1 && ye--);
            const at = (Me - Ie + 1) * (He - ye + 1);
            at < ot && (ot = at, Ye = Ge, de = Ie, be = ye, pe = Me - Ie + 1, Fe = He - ye + 1);
          }
          Ee = new Uint8Array(Y[K - 1 - Ye]), Ye == 1 && (ee[K - 1].dispose = 2), ue = new Uint8Array(pe * Fe * 4), u(Ee, j, ne, ue, pe, Fe, -de, -be, 0), Ze = u(se, j, ne, ue, pe, Fe, -de, -be, 3) ? 1 : 0, Ze == 1 ? n(se, j, ne, ue, { x: de, y: be, width: pe, height: Fe }) : u(se, j, ne, ue, pe, Fe, -de, -be, 0);
        } else ue = se.slice(0);
        ee.push({ rect: { x: de, y: be, width: pe, height: Fe }, img: ue, blend: Ze, dispose: 0 });
      }
      if (ie) for (K = 0; K < ee.length; K++) {
        if ((Ce = ee[K]).blend == 1) continue;
        const se = Ce.rect, ge = ee[K - 1].rect, de = Math.min(se.x, ge.x), be = Math.min(se.y, ge.y), pe = { x: de, y: be, width: Math.max(se.x + se.width, ge.x + ge.width) - de, height: Math.max(se.y + se.height, ge.y + ge.height) - be };
        ee[K - 1].dispose = 1, K - 1 != 0 && o(Y, j, ne, ee, K - 1, pe, V), o(Y, j, ne, ee, K, pe, V);
      }
      let Pe = 0;
      if (Y.length != 1) for (var oe = 0; oe < ee.length; oe++) {
        var Ce;
        Pe += (Ce = ee[oe]).rect.width * Ce.rect.height;
      }
      return ee;
    })(d, f, w, F, A, D), Z = {}, W = [], z = [];
    if (U != 0) {
      const re = [];
      for (P = 0; P < N.length; P++) re.push(N[P].img.buffer);
      const Y = (function(V) {
        let fe = 0;
        for (var ee = 0; ee < V.length; ee++) fe += V[ee].byteLength;
        const K = new Uint8Array(fe);
        let ue = 0;
        for (ee = 0; ee < V.length; ee++) {
          const Ee = new Uint8Array(V[ee]), Pe = Ee.length;
          for (let oe = 0; oe < Pe; oe += 4) {
            let Ce = Ee[oe], se = Ee[oe + 1], ge = Ee[oe + 2];
            const de = Ee[oe + 3];
            de == 0 && (Ce = se = ge = 0), K[ue + oe] = Ce, K[ue + oe + 1] = se, K[ue + oe + 2] = ge, K[ue + oe + 3] = de;
          }
          ue += Pe;
        }
        return K.buffer;
      })(re), j = C(Y, U);
      for (P = 0; P < j.plte.length; P++) W.push(j.plte[P].est.rgba);
      let ne = 0;
      for (P = 0; P < N.length; P++) {
        const ie = (J = N[P]).img.length;
        var q = new Uint8Array(j.inds.buffer, ne >> 2, ie >> 2);
        z.push(q);
        const V = new Uint8Array(j.abuf, ne, ie);
        G && i(J.img, J.rect.width, J.rect.height, W, V, q), J.img.set(V), ne += ie;
      }
    } else for (L = 0; L < N.length; L++) {
      var J = N[L];
      const re = new Uint32Array(J.img.buffer);
      var te = J.rect.width;
      for (O = re.length, q = new Uint8Array(O), z.push(q), P = 0; P < O; P++) {
        const Y = re[P];
        if (P != 0 && Y == re[P - 1]) q[P] = q[P - 1];
        else if (P > te && Y == re[P - te]) q[P] = q[P - te];
        else {
          let j = Z[Y];
          if (j == null && (Z[Y] = j = W.length, W.push(Y), W.length >= 300)) break;
          q[P] = j;
        }
      }
    }
    const Ue = W.length;
    for (Ue <= 256 && l == 0 && (M = Ue <= 2 ? 1 : Ue <= 4 ? 2 : Ue <= 16 ? 4 : 8, M = Math.max(M, g)), L = 0; L < N.length; L++) {
      (J = N[L]).rect.x, J.rect.y, te = J.rect.width;
      const re = J.rect.height;
      let Y = J.img;
      new Uint32Array(Y.buffer);
      let j = 4 * te, ne = 4;
      if (Ue <= 256 && l == 0) {
        j = Math.ceil(M * te / 8);
        var me = new Uint8Array(j * re);
        const ie = z[L];
        for (let V = 0; V < re; V++) {
          P = V * j;
          const fe = V * te;
          if (M == 8) for (var X = 0; X < te; X++) me[P + X] = ie[fe + X];
          else if (M == 4) for (X = 0; X < te; X++) me[P + (X >> 1)] |= ie[fe + X] << 4 - 4 * (1 & X);
          else if (M == 2) for (X = 0; X < te; X++) me[P + (X >> 2)] |= ie[fe + X] << 6 - 2 * (3 & X);
          else if (M == 1) for (X = 0; X < te; X++) me[P + (X >> 3)] |= ie[fe + X] << 7 - 1 * (7 & X);
        }
        Y = me, T = 3, ne = 1;
      } else if (R == 0 && N.length == 1) {
        me = new Uint8Array(te * re * 3);
        const ie = te * re;
        for (P = 0; P < ie; P++) {
          const V = 3 * P, fe = 4 * P;
          me[V] = Y[fe], me[V + 1] = Y[fe + 1], me[V + 2] = Y[fe + 2];
        }
        Y = me, T = 2, ne = 3, j = 3 * te;
      }
      J.img = Y, J.bpl = j, J.bpp = ne;
    }
    return { ctype: T, depth: M, plte: W, frames: N };
  }
  function o(d, f, w, U, I, F, A) {
    const D = Uint8Array, g = Uint32Array, l = new D(d[I - 1]), G = new g(d[I - 1]), T = I + 1 < d.length ? new D(d[I + 1]) : null, M = new D(d[I]), Q = new g(M.buffer);
    let L = f, O = w, P = -1, R = -1;
    for (let Z = 0; Z < F.height; Z++) for (let W = 0; W < F.width; W++) {
      const z = F.x + W, q = F.y + Z, J = q * f + z, te = Q[J];
      te == 0 || U[I - 1].dispose == 0 && G[J] == te && (T == null || T[4 * J + 3] != 0) || (z < L && (L = z), z > P && (P = z), q < O && (O = q), q > R && (R = q));
    }
    P == -1 && (L = O = P = R = 0), A && ((1 & L) == 1 && L--, (1 & O) == 1 && O--), F = { x: L, y: O, width: P - L + 1, height: R - O + 1 };
    const N = U[I];
    N.rect = F, N.blend = 1, N.img = new Uint8Array(F.width * F.height * 4), U[I - 1].dispose == 0 ? (u(l, f, w, N.img, F.width, F.height, -F.x, -F.y, 0), n(M, f, w, N.img, F)) : u(M, f, w, N.img, F.width, F.height, -F.x, -F.y, 0);
  }
  function n(d, f, w, U, I) {
    u(d, f, w, U, I.width, I.height, -I.x, -I.y, 2);
  }
  function s(d, f, w, U, I, F, A) {
    const D = [];
    let g, l = [0, 1, 2, 3, 4];
    F != -1 ? l = [F] : (f * U > 5e5 || w == 1) && (l = [0]), A && (g = { level: 0 });
    const G = jt;
    for (var T = 0; T < l.length; T++) {
      for (let L = 0; L < f; L++) m(I, d, L, U, w, l[T]);
      D.push(G.deflate(I, g));
    }
    let M, Q = 1e9;
    for (T = 0; T < D.length; T++) D[T].length < Q && (M = T, Q = D[T].length);
    return D[M];
  }
  function m(d, f, w, U, I, F) {
    const A = w * U;
    let D = A + w;
    if (d[D] = F, D++, F == 0) if (U < 500) for (var g = 0; g < U; g++) d[D + g] = f[A + g];
    else d.set(new Uint8Array(f.buffer, A, U), D);
    else if (F == 1) {
      for (g = 0; g < I; g++) d[D + g] = f[A + g];
      for (g = I; g < U; g++) d[D + g] = f[A + g] - f[A + g - I] + 256 & 255;
    } else if (w == 0) {
      for (g = 0; g < I; g++) d[D + g] = f[A + g];
      if (F == 2) for (g = I; g < U; g++) d[D + g] = f[A + g];
      if (F == 3) for (g = I; g < U; g++) d[D + g] = f[A + g] - (f[A + g - I] >> 1) + 256 & 255;
      if (F == 4) for (g = I; g < U; g++) d[D + g] = f[A + g] - b(f[A + g - I], 0, 0) + 256 & 255;
    } else {
      if (F == 2) for (g = 0; g < U; g++) d[D + g] = f[A + g] + 256 - f[A + g - U] & 255;
      if (F == 3) {
        for (g = 0; g < I; g++) d[D + g] = f[A + g] + 256 - (f[A + g - U] >> 1) & 255;
        for (g = I; g < U; g++) d[D + g] = f[A + g] + 256 - (f[A + g - U] + f[A + g - I] >> 1) & 255;
      }
      if (F == 4) {
        for (g = 0; g < I; g++) d[D + g] = f[A + g] + 256 - b(0, f[A + g - U], 0) & 255;
        for (g = I; g < U; g++) d[D + g] = f[A + g] + 256 - b(f[A + g - I], f[A + g - U], f[A + g - I - U]) & 255;
      }
    }
  }
  function C(d, f) {
    const w = new Uint8Array(d), U = w.slice(0), I = new Uint32Array(U.buffer), F = B(U, f), A = F[0], D = F[1], g = w.length, l = new Uint8Array(g >> 2);
    let G;
    if (w.length < 2e7) for (var T = 0; T < g; T += 4)
      G = E(A, M = w[T] * (1 / 255), Q = w[T + 1] * (1 / 255), L = w[T + 2] * (1 / 255), O = w[T + 3] * (1 / 255)), l[T >> 2] = G.ind, I[T >> 2] = G.est.rgba;
    else for (T = 0; T < g; T += 4) {
      var M = w[T] * 0.00392156862745098, Q = w[T + 1] * (1 / 255), L = w[T + 2] * (1 / 255), O = w[T + 3] * (1 / 255);
      for (G = A; G.left; ) G = H(G.est, M, Q, L, O) <= 0 ? G.left : G.right;
      l[T >> 2] = G.ind, I[T >> 2] = G.est.rgba;
    }
    return { abuf: U.buffer, inds: l, plte: D };
  }
  function B(d, f, w) {
    w == null && (w = 1e-4);
    const U = new Uint32Array(d.buffer), I = { i0: 0, i1: d.length, bst: null, est: null, tdst: 0, left: null, right: null };
    I.bst = k(d, I.i0, I.i1), I.est = v(I.bst);
    const F = [I];
    for (; F.length < f; ) {
      let D = 0, g = 0;
      for (var A = 0; A < F.length; A++) F[A].est.L > D && (D = F[A].est.L, g = A);
      if (D < w) break;
      const l = F[g], G = x(d, U, l.i0, l.i1, l.est.e, l.est.eMq255);
      if (l.i0 >= G || l.i1 <= G) {
        l.est.L = 0;
        continue;
      }
      const T = { i0: l.i0, i1: G, bst: null, est: null, tdst: 0, left: null, right: null };
      T.bst = k(d, T.i0, T.i1), T.est = v(T.bst);
      const M = { i0: G, i1: l.i1, bst: null, est: null, tdst: 0, left: null, right: null };
      for (M.bst = { R: [], m: [], N: l.bst.N - T.bst.N }, A = 0; A < 16; A++) M.bst.R[A] = l.bst.R[A] - T.bst.R[A];
      for (A = 0; A < 4; A++) M.bst.m[A] = l.bst.m[A] - T.bst.m[A];
      M.est = v(M.bst), l.left = T, l.right = M, F[g] = T, F.push(M);
    }
    for (F.sort(((D, g) => g.bst.N - D.bst.N)), A = 0; A < F.length; A++) F[A].ind = A;
    return [I, F];
  }
  function E(d, f, w, U, I) {
    if (d.left == null) return d.tdst = (function(T, M, Q, L, O) {
      const P = M - T[0], R = Q - T[1], N = L - T[2], Z = O - T[3];
      return P * P + R * R + N * N + Z * Z;
    })(d.est.q, f, w, U, I), d;
    const F = H(d.est, f, w, U, I);
    let A = d.left, D = d.right;
    F > 0 && (A = d.right, D = d.left);
    const g = E(A, f, w, U, I);
    if (g.tdst <= F * F) return g;
    const l = E(D, f, w, U, I);
    return l.tdst < g.tdst ? l : g;
  }
  function H(d, f, w, U, I) {
    const { e: F } = d;
    return F[0] * f + F[1] * w + F[2] * U + F[3] * I - d.eMq;
  }
  function x(d, f, w, U, I, F) {
    for (U -= 4; w < U; ) {
      for (; S(d, w, I) <= F; ) w += 4;
      for (; S(d, U, I) > F; ) U -= 4;
      if (w >= U) break;
      const A = f[w >> 2];
      f[w >> 2] = f[U >> 2], f[U >> 2] = A, w += 4, U -= 4;
    }
    for (; S(d, w, I) > F; ) w -= 4;
    return w + 4;
  }
  function S(d, f, w) {
    return d[f] * w[0] + d[f + 1] * w[1] + d[f + 2] * w[2] + d[f + 3] * w[3];
  }
  function k(d, f, w) {
    const U = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], I = [0, 0, 0, 0], F = w - f >> 2;
    for (let A = f; A < w; A += 4) {
      const D = d[A] * 0.00392156862745098, g = d[A + 1] * (1 / 255), l = d[A + 2] * (1 / 255), G = d[A + 3] * (1 / 255);
      I[0] += D, I[1] += g, I[2] += l, I[3] += G, U[0] += D * D, U[1] += D * g, U[2] += D * l, U[3] += D * G, U[5] += g * g, U[6] += g * l, U[7] += g * G, U[10] += l * l, U[11] += l * G, U[15] += G * G;
    }
    return U[4] = U[1], U[8] = U[2], U[9] = U[6], U[12] = U[3], U[13] = U[7], U[14] = U[11], { R: U, m: I, N: F };
  }
  function v(d) {
    const { R: f } = d, { m: w } = d, { N: U } = d, I = w[0], F = w[1], A = w[2], D = w[3], g = U == 0 ? 0 : 1 / U, l = [f[0] - I * I * g, f[1] - I * F * g, f[2] - I * A * g, f[3] - I * D * g, f[4] - F * I * g, f[5] - F * F * g, f[6] - F * A * g, f[7] - F * D * g, f[8] - A * I * g, f[9] - A * F * g, f[10] - A * A * g, f[11] - A * D * g, f[12] - D * I * g, f[13] - D * F * g, f[14] - D * A * g, f[15] - D * D * g], G = l, T = _;
    let M = [Math.random(), Math.random(), Math.random(), Math.random()], Q = 0, L = 0;
    if (U != 0) for (let P = 0; P < 16 && (M = T.multVec(G, M), L = Math.sqrt(T.dot(M, M)), M = T.sml(1 / L, M), !(P != 0 && Math.abs(L - Q) < 1e-9)); P++) Q = L;
    const O = [I * g, F * g, A * g, D * g];
    return { Cov: l, q: O, e: M, L: Q, eMq255: T.dot(T.sml(255, O), M), eMq: T.dot(M, O), rgba: (Math.round(255 * O[3]) << 24 | Math.round(255 * O[2]) << 16 | Math.round(255 * O[1]) << 8 | Math.round(255 * O[0]) << 0) >>> 0 };
  }
  var _ = { multVec: (d, f) => [d[0] * f[0] + d[1] * f[1] + d[2] * f[2] + d[3] * f[3], d[4] * f[0] + d[5] * f[1] + d[6] * f[2] + d[7] * f[3], d[8] * f[0] + d[9] * f[1] + d[10] * f[2] + d[11] * f[3], d[12] * f[0] + d[13] * f[1] + d[14] * f[2] + d[15] * f[3]], dot: (d, f) => d[0] * f[0] + d[1] * f[1] + d[2] * f[2] + d[3] * f[3], sml: (d, f) => [d * f[0], d * f[1], d * f[2], d * f[3]] };
  he.encode = function(f, w, U, I, F, A, D) {
    I == null && (I = 0), D == null && (D = !1);
    const g = r(f, w, U, I, [!1, !1, !1, 0, D, !1]);
    return y(g, -1), p(g, w, U, F, A);
  }, he.encodeLL = function(f, w, U, I, F, A, D, g) {
    const l = { ctype: 0 + (I == 1 ? 0 : 2) + (F == 0 ? 0 : 4), depth: A, frames: [] }, G = (I + F) * A, T = G * w;
    for (let M = 0; M < f.length; M++) l.frames.push({ rect: { x: 0, y: 0, width: w, height: U }, img: new Uint8Array(f[M]), blend: 0, dispose: 1, bpp: Math.ceil(G / 8), bpl: Math.ceil(T / 8) });
    return y(l, 0, !0), p(l, w, U, D, g);
  }, he.encode.compress = r, he.encode.dither = i, he.quantize = C, he.quantize.getKDtree = B, he.quantize.getNearest = E;
})();
const pt = { toArrayBuffer(u, h) {
  const b = u.width, a = u.height, e = b << 2, t = u.getContext("2d").getImageData(0, 0, b, a), c = new Uint32Array(t.data.buffer), i = (32 * b + 31) / 32 << 2, p = i * a, y = 122 + p, r = new ArrayBuffer(y), o = new DataView(r), n = 1 << 20;
  let s, m, C, B, E = n, H = 0, x = 0, S = 0;
  function k(d) {
    o.setUint16(x, d, !0), x += 2;
  }
  function v(d) {
    o.setUint32(x, d, !0), x += 4;
  }
  function _(d) {
    x += d;
  }
  k(19778), v(y), _(4), v(122), v(108), v(b), v(-a >>> 0), k(1), k(32), v(3), v(p), v(2835), v(2835), _(8), v(16711680), v(65280), v(255), v(4278190080), v(1466527264), (function d() {
    for (; H < a && E > 0; ) {
      for (B = 122 + H * i, s = 0; s < e; ) E--, m = c[S++], C = m >>> 24, o.setUint32(B + s, m << 8 | C), s += 4;
      H++;
    }
    S < c.length ? (E = n, setTimeout(d, pt._dly)) : h(r);
  })();
}, toBlob(u, h) {
  this.toArrayBuffer(u, ((b) => {
    h(new Blob([b], { type: "image/bmp" }));
  }));
}, _dly: 9 };
var ce = { CHROME: "CHROME", FIREFOX: "FIREFOX", DESKTOP_SAFARI: "DESKTOP_SAFARI", IE: "IE", IOS: "IOS", ETC: "ETC" }, Kt = { [ce.CHROME]: 16384, [ce.FIREFOX]: 11180, [ce.DESKTOP_SAFARI]: 16384, [ce.IE]: 8192, [ce.IOS]: 4096, [ce.ETC]: 8192 };
const et = typeof window < "u", vt = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope, We = et && window.cordova && window.cordova.require && window.cordova.require("cordova/modulemapper"), Zt = (et || vt) && (We && We.getOriginalSymbol(window, "File") || typeof File < "u" && File), At = (et || vt) && (We && We.getOriginalSymbol(window, "FileReader") || typeof FileReader < "u" && FileReader);
function tt(u, h, b = Date.now()) {
  return new Promise(((a) => {
    const e = u.split(","), t = e[0].match(/:(.*?);/)[1], c = globalThis.atob(e[1]);
    let i = c.length;
    const p = new Uint8Array(i);
    for (; i--; ) p[i] = c.charCodeAt(i);
    const y = new Blob([p], { type: t });
    y.name = h, y.lastModified = b, a(y);
  }));
}
function wt(u) {
  return new Promise(((h, b) => {
    const a = new At();
    a.onload = () => h(a.result), a.onerror = (e) => b(e), a.readAsDataURL(u);
  }));
}
function bt(u) {
  return new Promise(((h, b) => {
    const a = new Image();
    a.onload = () => h(a), a.onerror = (e) => b(e), a.src = u;
  }));
}
function Be() {
  if (Be.cachedResult !== void 0) return Be.cachedResult;
  let u = ce.ETC;
  const { userAgent: h } = navigator;
  return /Chrom(e|ium)/i.test(h) ? u = ce.CHROME : /iP(ad|od|hone)/i.test(h) && /WebKit/i.test(h) ? u = ce.IOS : /Safari/i.test(h) ? u = ce.DESKTOP_SAFARI : /Firefox/i.test(h) ? u = ce.FIREFOX : (/MSIE/i.test(h) || document.documentMode) && (u = ce.IE), Be.cachedResult = u, Be.cachedResult;
}
function Et(u, h) {
  const b = Be(), a = Kt[b];
  let e = u, t = h, c = e * t;
  const i = e > t ? t / e : e / t;
  for (; c > a * a; ) {
    const p = (a + e) / 2, y = (a + t) / 2;
    p < y ? (t = y, e = y * i) : (t = p * i, e = p), c = e * t;
  }
  return { width: e, height: t };
}
function Ke(u, h) {
  let b, a;
  try {
    if (b = new OffscreenCanvas(u, h), a = b.getContext("2d"), a === null) throw new Error("getContext of OffscreenCanvas returns null");
  } catch {
    b = document.createElement("canvas"), a = b.getContext("2d");
  }
  return b.width = u, b.height = h, [b, a];
}
function It(u, h) {
  const { width: b, height: a } = Et(u.width, u.height), [e, t] = Ke(b, a);
  return h && /jpe?g/.test(h) && (t.fillStyle = "white", t.fillRect(0, 0, e.width, e.height)), t.drawImage(u, 0, 0, e.width, e.height), e;
}
function Qe() {
  return Qe.cachedResult !== void 0 || (Qe.cachedResult = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || navigator.userAgent.includes("Mac") && typeof document < "u" && "ontouchend" in document), Qe.cachedResult;
}
function qe(u, h = {}) {
  return new Promise((function(b, a) {
    let e, t;
    var c = function() {
      try {
        return t = It(e, h.fileType || u.type), b([e, t]);
      } catch (p) {
        return a(p);
      }
    }, i = function(p) {
      try {
        var y = function(r) {
          try {
            throw r;
          } catch (o) {
            return a(o);
          }
        };
        try {
          let r;
          return wt(u).then((function(o) {
            try {
              return r = o, bt(r).then((function(n) {
                try {
                  return e = n, (function() {
                    try {
                      return c();
                    } catch (s) {
                      return a(s);
                    }
                  })();
                } catch (s) {
                  return y(s);
                }
              }), y);
            } catch (n) {
              return y(n);
            }
          }), y);
        } catch (r) {
          y(r);
        }
      } catch (r) {
        return a(r);
      }
    };
    try {
      if (Qe() || [ce.DESKTOP_SAFARI, ce.MOBILE_SAFARI].includes(Be())) throw new Error("Skip createImageBitmap on IOS and Safari");
      return createImageBitmap(u).then((function(p) {
        try {
          return e = p, c();
        } catch {
          return i();
        }
      }), i);
    } catch {
      i();
    }
  }));
}
function je(u, h, b, a, e = 1) {
  return new Promise((function(t, c) {
    let i;
    if (h === "image/png") {
      let o, n, s;
      return o = u.getContext("2d"), { data: n } = o.getImageData(0, 0, u.width, u.height), s = he.encode([n.buffer], u.width, u.height, 4096 * e), i = new Blob([s], { type: h }), i.name = b, i.lastModified = a, p.call(this);
    }
    {
      let o = function() {
        return p.call(this);
      };
      var y = o;
      if (h === "image/bmp") return new Promise(((n) => pt.toBlob(u, n))).then((function(n) {
        try {
          return i = n, i.name = b, i.lastModified = a, o.call(this);
        } catch (s) {
          return c(s);
        }
      }).bind(this), c);
      {
        let n = function() {
          return o.call(this);
        };
        var r = n;
        if (typeof OffscreenCanvas == "function" && u instanceof OffscreenCanvas) return u.convertToBlob({ type: h, quality: e }).then((function(s) {
          try {
            return i = s, i.name = b, i.lastModified = a, n.call(this);
          } catch (m) {
            return c(m);
          }
        }).bind(this), c);
        {
          let s;
          return s = u.toDataURL(h, e), tt(s, b, a).then((function(m) {
            try {
              return i = m, n.call(this);
            } catch (C) {
              return c(C);
            }
          }).bind(this), c);
        }
      }
    }
    function p() {
      return t(i);
    }
  }));
}
function ve(u) {
  u.width = 0, u.height = 0;
}
function xe() {
  return new Promise((function(u, h) {
    let b, a, e, t;
    return xe.cachedResult !== void 0 ? u(xe.cachedResult) : tt("data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==", "test.jpg", Date.now()).then((function(c) {
      try {
        return b = c, qe(b).then((function(i) {
          try {
            return a = i[1], je(a, b.type, b.name, b.lastModified).then((function(p) {
              try {
                return e = p, ve(a), qe(e).then((function(y) {
                  try {
                    return t = y[0], xe.cachedResult = t.width === 1 && t.height === 2, u(xe.cachedResult);
                  } catch (r) {
                    return h(r);
                  }
                }), h);
              } catch (y) {
                return h(y);
              }
            }), h);
          } catch (p) {
            return h(p);
          }
        }), h);
      } catch (i) {
        return h(i);
      }
    }), h);
  }));
}
function yt(u) {
  return new Promise(((h, b) => {
    const a = new At();
    a.onload = (e) => {
      const t = new DataView(e.target.result);
      if (t.getUint16(0, !1) != 65496) return h(-2);
      const c = t.byteLength;
      let i = 2;
      for (; i < c; ) {
        if (t.getUint16(i + 2, !1) <= 8) return h(-1);
        const p = t.getUint16(i, !1);
        if (i += 2, p == 65505) {
          if (t.getUint32(i += 2, !1) != 1165519206) return h(-1);
          const y = t.getUint16(i += 6, !1) == 18761;
          i += t.getUint32(i + 4, y);
          const r = t.getUint16(i, y);
          i += 2;
          for (let o = 0; o < r; o++) if (t.getUint16(i + 12 * o, y) == 274) return h(t.getUint16(i + 12 * o + 8, y));
        } else {
          if ((65280 & p) != 65280) break;
          i += t.getUint16(i, !1);
        }
      }
      return h(-1);
    }, a.onerror = (e) => b(e), a.readAsArrayBuffer(u);
  }));
}
function Ut(u, h) {
  const { width: b } = u, { height: a } = u, { maxWidthOrHeight: e } = h;
  let t, c = u;
  return isFinite(e) && (b > e || a > e) && ([c, t] = Ke(b, a), b > a ? (c.width = e, c.height = a / b * e) : (c.width = b / a * e, c.height = e), t.drawImage(u, 0, 0, c.width, c.height), ve(u)), c;
}
function Ct(u, h) {
  const { width: b } = u, { height: a } = u, [e, t] = Ke(b, a);
  switch (h > 4 && h < 9 ? (e.width = a, e.height = b) : (e.width = b, e.height = a), h) {
    case 2:
      t.transform(-1, 0, 0, 1, b, 0);
      break;
    case 3:
      t.transform(-1, 0, 0, -1, b, a);
      break;
    case 4:
      t.transform(1, 0, 0, -1, 0, a);
      break;
    case 5:
      t.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      t.transform(0, 1, -1, 0, a, 0);
      break;
    case 7:
      t.transform(0, -1, -1, 0, a, b);
      break;
    case 8:
      t.transform(0, -1, 1, 0, 0, b);
  }
  return t.drawImage(u, 0, 0, b, a), ve(u), e;
}
function st(u, h, b = 0) {
  return new Promise((function(a, e) {
    let t, c, i, p, y, r, o, n, s, m, C, B, E, H, x, S, k, v, _, d;
    function f(U = 5) {
      if (h.signal && h.signal.aborted) throw h.signal.reason;
      t += U, h.onProgress(Math.min(t, 100));
    }
    function w(U) {
      if (h.signal && h.signal.aborted) throw h.signal.reason;
      t = Math.min(Math.max(U, t), 100), h.onProgress(t);
    }
    return t = b, c = h.maxIteration || 10, i = 1024 * h.maxSizeMB * 1024, f(), qe(u, h).then((function(U) {
      try {
        return [, p] = U, f(), y = Ut(p, h), f(), new Promise((function(I, F) {
          var A;
          if (!(A = h.exifOrientation)) return yt(u).then((function(g) {
            try {
              return A = g, D.call(this);
            } catch (l) {
              return F(l);
            }
          }).bind(this), F);
          function D() {
            return I(A);
          }
          return D.call(this);
        })).then((function(I) {
          try {
            return r = I, f(), xe().then((function(F) {
              try {
                return o = F ? y : Ct(y, r), f(), n = h.initialQuality || 1, s = h.fileType || u.type, je(o, s, u.name, u.lastModified, n).then((function(A) {
                  try {
                    {
                      let G = function() {
                        if (c-- && (x > i || x > E)) {
                          let M, Q;
                          return M = d ? 0.95 * _.width : _.width, Q = d ? 0.95 * _.height : _.height, [k, v] = Ke(M, Q), v.drawImage(_, 0, 0, M, Q), n *= s === "image/png" ? 0.85 : 0.95, je(k, s, u.name, u.lastModified, n).then((function(L) {
                            try {
                              return S = L, ve(_), _ = k, x = S.size, w(Math.min(99, Math.floor((H - x) / (H - i) * 100))), G;
                            } catch (O) {
                              return e(O);
                            }
                          }), e);
                        }
                        return [1];
                      }, T = function() {
                        return ve(_), ve(k), ve(y), ve(o), ve(p), w(100), a(S);
                      };
                      var g = G, l = T;
                      if (m = A, f(), C = m.size > i, B = m.size > u.size, !C && !B) return w(100), a(m);
                      var D;
                      return E = u.size, H = m.size, x = H, _ = o, d = !h.alwaysKeepResolution && C, (D = (function(M) {
                        for (; M; ) {
                          if (M.then) return void M.then(D, e);
                          try {
                            if (M.pop) {
                              if (M.length) return M.pop() ? T.call(this) : M;
                              M = G;
                            } else M = M.call(this);
                          } catch (Q) {
                            return e(Q);
                          }
                        }
                      }).bind(this))(G);
                    }
                  } catch (G) {
                    return e(G);
                  }
                }).bind(this), e);
              } catch (A) {
                return e(A);
              }
            }).bind(this), e);
          } catch (F) {
            return e(F);
          }
        }).bind(this), e);
      } catch (I) {
        return e(I);
      }
    }).bind(this), e);
  }));
}
const Yt = `
let scriptImported = false
self.addEventListener('message', async (e) => {
  const { file, id, imageCompressionLibUrl, options } = e.data
  options.onProgress = (progress) => self.postMessage({ progress, id })
  try {
    if (!scriptImported) {
      // console.log('[worker] importScripts', imageCompressionLibUrl)
      self.importScripts(imageCompressionLibUrl)
      scriptImported = true
    }
    // console.log('[worker] self', self)
    const compressedFile = await imageCompression(file, options)
    self.postMessage({ file: compressedFile, id })
  } catch (e) {
    // console.error('[worker] error', e)
    self.postMessage({ error: e.message + '\\n' + e.stack, id })
  }
})
`;
let Xe;
function Xt(u, h) {
  return new Promise(((b, a) => {
    Xe || (Xe = (function(c) {
      const i = [];
      return i.push(c), URL.createObjectURL(new Blob(i));
    })(Yt));
    const e = new Worker(Xe);
    e.addEventListener("message", (function(c) {
      if (h.signal && h.signal.aborted) e.terminate();
      else if (c.data.progress === void 0) {
        if (c.data.error) return a(new Error(c.data.error)), void e.terminate();
        b(c.data.file), e.terminate();
      } else h.onProgress(c.data.progress);
    })), e.addEventListener("error", a), h.signal && h.signal.addEventListener("abort", (() => {
      a(h.signal.reason), e.terminate();
    })), e.postMessage({ file: u, imageCompressionLibUrl: h.libURL, options: { ...h, onProgress: void 0, signal: void 0 } });
  }));
}
function ae(u, h) {
  return new Promise((function(b, a) {
    let e, t, c, i, p, y;
    if (e = { ...h }, c = 0, { onProgress: i } = e, e.maxSizeMB = e.maxSizeMB || Number.POSITIVE_INFINITY, p = typeof e.useWebWorker != "boolean" || e.useWebWorker, delete e.useWebWorker, e.onProgress = (s) => {
      c = s, typeof i == "function" && i(c);
    }, !(u instanceof Blob || u instanceof Zt)) return a(new Error("The file given is not an instance of Blob or File"));
    if (!/^image/.test(u.type)) return a(new Error("The file given is not an image"));
    if (y = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope, !p || typeof Worker != "function" || y) return st(u, e).then((function(s) {
      try {
        return t = s, n.call(this);
      } catch (m) {
        return a(m);
      }
    }).bind(this), a);
    var r = (function() {
      try {
        return n.call(this);
      } catch (s) {
        return a(s);
      }
    }).bind(this), o = function(s) {
      try {
        return st(u, e).then((function(m) {
          try {
            return t = m, r();
          } catch (C) {
            return a(C);
          }
        }), a);
      } catch (m) {
        return a(m);
      }
    };
    try {
      return e.libURL = e.libURL || "https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js", Xt(u, e).then((function(s) {
        try {
          return t = s, r();
        } catch {
          return o();
        }
      }), o);
    } catch {
      o();
    }
    function n() {
      try {
        t.name = u.name, t.lastModified = u.lastModified;
      } catch {
      }
      try {
        e.preserveExif && u.type === "image/jpeg" && (!e.fileType || e.fileType && e.fileType === u.type) && (t = mt(u, t));
      } catch {
      }
      return b(t);
    }
  }));
}
ae.getDataUrlFromFile = wt, ae.getFilefromDataUrl = tt, ae.loadImage = bt, ae.drawImageInCanvas = It, ae.drawFileInCanvas = qe, ae.canvasToFile = je, ae.getExifOrientation = yt, ae.handleMaxWidthOrHeight = Ut, ae.followExifOrientation = Ct, ae.cleanupCanvasMemory = ve, ae.isAutoOrientationInBrowser = xe, ae.approximateBelowMaximumCanvasSizeOfBrowser = Et, ae.copyExifWithoutOrientation = mt, ae.getBrowserName = Be, ae.version = "2.0.2";
const lt = (u, h) => {
  if (!h) {
    Pt(u, "disabled", !0);
    return;
  }
  Lt(u, "disabled"), Ot(u);
}, ct = (u, h) => {
  const b = "ci-spinner", a = le(`#${b}`, u);
  if (!h && a[0]) {
    Ve(a);
    return;
  }
  if (h && !a[0]) {
    const e = Re(`<div id="${b}"></div>`);
    Se(u, e);
  }
}, nt = (u) => {
  const h = _e() ? ".chat-form" : "#chat-form", b = le(h, u), a = le("#chat-message", u);
  return {
    on() {
      lt(a, !1), ct(b, !0);
    },
    off() {
      lt(a, !0), ct(b, !1);
    }
  };
}, Ft = async (u) => {
  const h = u || rt("uploadLocation");
  try {
    (await Oe().browse(Le, h)).target === "." && await Oe().createDirectory(Le, h, {});
  } catch {
    try {
      await Oe().createDirectory(Le, h, {});
    } catch {
    }
  }
}, Jt = (u, h) => game.settings.set("chat-images", u, h), Vt = () => [
  {
    key: "uploadButton",
    options: {
      name: Ae("uploadButton"),
      hint: Ae("uploadButtonHint"),
      type: Boolean,
      default: !0,
      config: !0,
      requiresReload: !0
    }
  },
  {
    key: "uploadLocation",
    options: {
      name: Ae("uploadLocation"),
      hint: Ae("uploadLocationHint"),
      type: String,
      default: "uploaded-chat-images",
      scope: "world",
      config: !0,
      restricted: !0,
      onChange: async (u) => {
        const h = "uploaded-chat-images";
        let b = u.trim(), a = !1;
        b || (b = h, a = !0), b = b.replace(/\s+/g, "-"), u !== b && (a = !0), await Ft(b), a && await Jt("uploadLocation", b);
      }
    }
  }
], en = (u) => game.settings.register("chat-images", u.key, u.options), rt = (u) => game.settings.get("chat-images", u), tn = ["static.wikia"], nn = new DOMParser();
let we = [];
const Dt = (u) => {
  const h = u.type && u.type.startsWith("image/");
  return console.log("[CI:DEBUG] isFileImage →", { file: u, isImage: h }), h;
}, rn = ({ imageSrc: u, id: h }) => (console.log("[CI:DEBUG] createImagePreview →", { id: h, imageSrc: u }), Re(
  `<div id="${h}" class="ci-upload-area-image">
        <i class="ci-remove-image-icon fa-regular fa-circle-xmark"></i>
        <img class="ci-image-preview" src="${u}" alt="${Ae("unableToLoadImage")}"/>
     </div>`
)), on = (u, h, b) => {
  console.log("[CI:DEBUG] addEventToRemoveButton → binding remove for id", h.id), ke(u, "click", () => {
    console.log("[CI:DEBUG] removeEventHandler → CLICKED for id", h.id);
    const e = le(`#${h.id}`, b);
    if (console.log("[CI:DEBUG] removeEventHandler → found image element", e), Ve(e), we = we.filter((t) => h.id !== t.id), console.log("[CI:DEBUG] removeEventHandler → updated imageQueue", we), we.length) {
      console.log("[CI:DEBUG] removeEventHandler → images still in queue, not hiding uploadArea");
      return;
    }
    console.log("[CI:DEBUG] removeEventHandler → queue empty, hiding uploadArea"), Je(b, "hidden");
  });
}, an = async (u) => {
  const h = (b) => {
    const { type: a, name: e, id: t } = b, c = e?.substring(e.lastIndexOf("."), e.length) || a?.replace("image/", ".") || ".jpeg", i = `${t}${c}`;
    return console.log("[CI:DEBUG] generateFileName →", { name: e, type: a, id: t, fileExtension: c, result: i }), i;
  };
  try {
    console.log("[CI:DEBUG] uploadImage → START", u);
    const b = h(u);
    console.log("[CI:DEBUG] uploadImage → newName", b);
    const a = await ae(u.file, {
      maxSizeMB: 1.5,
      useWebWorker: !0,
      alwaysKeepResolution: !0
    });
    console.log("[CI:DEBUG] uploadImage → compressedImage", a);
    const e = new File([a], b, { type: u.type });
    console.log("[CI:DEBUG] uploadImage → newImage", e);
    const t = rt("uploadLocation");
    console.log("[CI:DEBUG] uploadImage → uploadLocation", t);
    const c = await Oe().upload(
      Le,
      t,
      e,
      {},
      { notify: !1 }
    );
    if (console.log("[CI:DEBUG] uploadImage → upload result", c), !c || !c?.path)
      return console.warn(
        "[CI:DEBUG] uploadImage → no path returned from upload, falling back to original imageSrc",
        c
      ), u.imageSrc;
    const i = c.path;
    return console.log("[CI:DEBUG] uploadImage → returning path", i), i;
  } catch (b) {
    return console.error("[CI:DEBUG] uploadImage → ERROR, falling back to imageSrc", b), u.imageSrc;
  }
}, Tt = async (u, h) => {
  console.log("[CI:DEBUG] addImageToQueue → START", { saveValue: u, sidebar: h });
  const b = nt(h);
  console.log("[CI:DEBUG] addImageToQueue → got uploadingStates", b), b.on(), console.log("[CI:DEBUG] addImageToQueue → uploadingStates.on() called");
  const a = le("#ci-chat-upload-area", h);
  if (console.log("[CI:DEBUG] addImageToQueue → uploadArea lookup", a), !a || !a[0]) {
    console.warn("[CI:DEBUG] addImageToQueue → uploadArea NOT FOUND, returning early WITHOUT turning spinner off");
    return;
  }
  if (u.file) {
    if (console.log("[CI:DEBUG] addImageToQueue → saveValue has file, checking permissions", u.file), !ht()) {
      console.warn("[CI:DEBUG] addImageToQueue → userCanUpload() = FALSE, turning spinner off and returning"), b.off();
      return;
    }
    console.log("[CI:DEBUG] addImageToQueue → userCanUpload() = TRUE, calling uploadImage"), u.imageSrc = await an(u), console.log("[CI:DEBUG] addImageToQueue → uploadImage finished, updated imageSrc", u.imageSrc);
  } else
    console.log("[CI:DEBUG] addImageToQueue → no file present (likely URL/paste)", u.imageSrc);
  console.log("[CI:DEBUG] addImageToQueue → creating image preview");
  const e = rn(u);
  if (console.log("[CI:DEBUG] addImageToQueue → imagePreview result", e), !e || !e[0]) {
    console.warn(
      "[CI:DEBUG] addImageToQueue → imagePreview is EMPTY, returning early WITHOUT turning spinner off"
    );
    return;
  }
  console.log("[CI:DEBUG] addImageToQueue → showing uploadArea and appending preview"), Ht(a, "hidden"), Se(a, e), we.push(u), console.log("[CI:DEBUG] addImageToQueue → pushed to imageQueue", we);
  const t = le(".ci-remove-image-icon", e);
  console.log("[CI:DEBUG] addImageToQueue → removeButton lookup", t), on(t, u, a), console.log("[CI:DEBUG] addImageToQueue → remove event bound"), b.off(), console.log("[CI:DEBUG] addImageToQueue → uploadingStates.off() called, END");
}, sn = (u, h) => async (b) => {
  const a = b.target?.result;
  console.log("[CI:DEBUG] imagesFileReaderHandler → file loaded", { file: u, imageSrc: a });
  const e = {
    type: u.type,
    name: u.name,
    imageSrc: a,
    id: gt(),
    file: u
  };
  console.log("[CI:DEBUG] imagesFileReaderHandler → constructed saveValue", e), await Tt(e, h);
}, St = (u, h) => {
  console.log("[CI:DEBUG] processImageFiles → START, files length", u.length);
  for (let b = 0; b < u.length; b++) {
    const a = u[b];
    if (console.log("[CI:DEBUG] processImageFiles → inspecting file", a), !Dt(a)) {
      console.warn("[CI:DEBUG] processImageFiles → skipping non-image file", a);
      continue;
    }
    console.log("[CI:DEBUG] processImageFiles → processing image file", a);
    const e = new FileReader();
    e.addEventListener("load", sn(a, h)), e.readAsDataURL(a);
  }
  console.log("[CI:DEBUG] processImageFiles → END");
}, ln = (u, h) => {
  console.log("[CI:DEBUG] processDropAndPasteImages → START", u);
  const b = (i) => {
    const p = i.getData("text/html");
    if (console.log("[CI:DEBUG] extractUrlFromEventData → raw html", p), !p)
      return console.log("[CI:DEBUG] extractUrlFromEventData → no html in eventData"), null;
    const r = nn.parseFromString(p, "text/html").querySelectorAll("img");
    if (console.log("[CI:DEBUG] extractUrlFromEventData → found <img> elements", r), !r || !r.length)
      return console.log("[CI:DEBUG] extractUrlFromEventData → no <img> tags found"), null;
    const o = [...r].map((s) => s.src);
    console.log("[CI:DEBUG] extractUrlFromEventData → imageUrls", o);
    const n = o.some(
      (s) => tn.some((m) => s.includes(m))
    );
    return console.log("[CI:DEBUG] extractUrlFromEventData → restricted domain check", {
      imageUrls: o,
      imagesContainRestrictedDomains: n
    }), n ? (console.warn("[CI:DEBUG] extractUrlFromEventData → URLs contain restricted domains, returning null"), null) : o;
  }, a = async (i) => {
    console.log("[CI:DEBUG] urlsFromEventDataHandler → START with urls", i);
    for (let p = 0; p < i.length; p++) {
      const r = { imageSrc: i[p], id: gt() };
      console.log("[CI:DEBUG] urlsFromEventDataHandler → queuing URL", r), await Tt(r, h);
    }
    console.log("[CI:DEBUG] urlsFromEventDataHandler → END");
  }, e = b(u);
  if (e && e.length)
    return console.log("[CI:DEBUG] processDropAndPasteImages → URLs detected, handling as URL paste/drop"), a(e);
  const c = ((i) => {
    const p = i.items, y = [];
    console.log("[CI:DEBUG] extractFilesFromEventData → items", p);
    for (let r = 0; r < p.length; r++) {
      const o = p[r];
      if (console.log("[CI:DEBUG] extractFilesFromEventData → inspecting item", o), !Dt(o)) {
        console.warn("[CI:DEBUG] extractFilesFromEventData → skipping non-image item", o);
        continue;
      }
      const n = o.getAsFile();
      if (console.log("[CI:DEBUG] extractFilesFromEventData → item.getAsFile()", n), !n) {
        console.warn("[CI:DEBUG] extractFilesFromEventData → item.getAsFile() returned null, skipping");
        continue;
      }
      y.push(n);
    }
    return console.log("[CI:DEBUG] extractFilesFromEventData → extracted files", y), y;
  })(u);
  if (c && c.length)
    return console.log("[CI:DEBUG] processDropAndPasteImages → files detected, delegating to processImageFiles"), St(c, h);
  console.log("[CI:DEBUG] processDropAndPasteImages → no URLs or files found, nothing to do");
}, Bt = () => (console.log("[CI:DEBUG] getImageQueue →", we), we), Rt = (u) => {
  for (console.log("[CI:DEBUG] removeAllFromQueue → START"); we.length; ) {
    const b = we.pop();
    if (console.log("[CI:DEBUG] removeAllFromQueue → popped imageData", b), !b) continue;
    const a = le(`#${b.id}`, u);
    console.log("[CI:DEBUG] removeAllFromQueue → removing element", a), Ve(a);
  }
  const h = le("#ci-chat-upload-area", u);
  console.log("[CI:DEBUG] removeAllFromQueue → found uploadArea", h), Je(h, "hidden"), console.log("[CI:DEBUG] removeAllFromQueue → END, queue cleared and uploadArea hidden");
}, cn = () => Re(`<a id="ci-upload-image" title="${Ae("uploadButtonTitle")}"><i class="fas fa-images"></i></a>`), fn = () => Re('<input type="file" multiple accept="image/*" id="ci-upload-image-hidden-input">'), un = (u, h, b) => {
  const a = (t) => {
    const c = t.currentTarget, i = c.files;
    i && (St(i, b), c.value = "");
  }, e = (t) => {
    t.preventDefault(), Gt(h, "click");
  };
  ke(h, "change", a), ke(u, "click", e);
}, dn = (u) => {
  if (!rt("uploadButton")) return;
  const h = le(".control-buttons", u), b = cn(), a = fn();
  if (ht(!0)) {
    if (h[0])
      Je(h, "ci-control-buttons-gm"), Se(h, b), Se(h, a);
    else {
      const e = le("#chat-controls", u), t = Re('<div class="ci-control-buttons-p"></div>');
      Se(t, b), Se(t, a), Se(e, t);
    }
    un(b, a, u);
  }
};
let Ne = !1, ze = !1;
const gn = (u) => `<div class="ci-message-image"><img src="${u.imageSrc}" alt="${u.name || Ae("unableToLoadImage")}"></div>`, _t = (u) => `<div class="ci-message">${u.map((b) => gn(b)).join("")}</div>`, hn = (u) => (h, b, a) => {
  if (ze) return;
  Ne = !0;
  const e = Bt();
  if (!e.length) {
    Ne = !1;
    return;
  }
  const t = nt(u);
  t.on();
  const c = `${_t(e)}<div class="ci-notes">${h.content}</div>`;
  h.content = c, h._source.content = c, a.chatBubble = !1, Rt(u), Ne = !1, t.off();
}, mn = (u) => async (h) => {
  if (Ne || h.code !== "Enter" && h.code !== "NumpadEnter" || h.shiftKey) return;
  ze = !0;
  const b = nt(u), a = Bt();
  if (!a.length) {
    ze = !1;
    return;
  }
  b.on();
  const e = _e() ? CONST.CHAT_MESSAGE_STYLES.OOC : CONST.CHAT_MESSAGE_TYPES.OOC, t = {
    content: _t(a),
    type: typeof e < "u" ? e : 1,
    user: game.user
  };
  await ChatMessage.create(t), Rt(u), b.off(), ze = !1;
}, pn = (u) => (h) => {
  const b = h.originalEvent, a = b.clipboardData || b.dataTransfer;
  a && ln(a, u);
}, vn = (u) => !!le("#ci-chat-upload-area", u).length, ft = (u) => {
  Hooks.on("preCreateChatMessage", hn(u)), ke(u, "keyup", mn(u)), ke(u, "paste drop", pn(u));
}, ut = (u) => {
  const h = le(".ci-message-image img", u);
  if (!h[0]) return;
  ke(h, "click", (a) => {
    const e = a.target.src, t = Nt();
    _e() ? new t({ src: e, editable: !1, shareable: !0 }).render(!0) : new t(e, { editable: !1, shareable: !0 }).render(!0);
  });
}, dt = /!\s*ci\s*\|\s*(.+?)\s*!/gi, An = /\w+\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif)/gi, wn = (u) => `<div class="ci-message-image"><img src="${u}" alt="${Ae("unableToLoadImage")}"></div>`, bn = (u) => u.match(dt) ? u.replaceAll(dt, (h, b) => b.match(An) ? wn(b) : h) : u, En = () => {
  Vt().forEach((h) => en(h));
};
Hooks.once("init", async () => {
  En(), In(), await Ft();
});
const In = () => {
  if (_e()) {
    Hooks.on("renderChatMessageHTML", (h, b) => {
      const a = Re(b);
      le(".ci-message-image", a)[0] && ut(a);
    });
    const u = (h) => {
      vn(h) || (it(h), ft(h));
    };
    Hooks.on("collapseSidebar", (h, b) => {
      if (!h || b) return;
      const a = h.element;
      if (!a || !a.querySelector("#chat-message")) return;
      const t = $(a);
      u(t);
    }), Hooks.on("activateChatLog", (h) => {
      if (!h) return;
      const b = h.element;
      if (!b || !b.querySelector("#chat-message")) return;
      const e = $(b);
      u(e);
    });
  } else
    Hooks.on("renderChatMessage", (u, h) => {
      le(".ci-message-image", h)[0] && ut(h);
    }), Hooks.on("renderSidebarTab", (u, h) => {
      const b = h[0];
      !b || !b.querySelector("#chat-message") || (it(h), dn(h), ft(h));
    });
  Hooks.on("preCreateChatMessage", (u, h, b) => {
    const a = bn(u.content);
    u.content !== a && (u.content = a, u._source.content = a, b.chatBubble = !1);
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1pbWFnZXMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JpcHRzL3V0aWxzL0pxdWVyeVdyYXBwZXJzLnRzIiwiLi4vc3JjL3NjcmlwdHMvdXRpbHMvVXRpbHMudHMiLCIuLi9zcmMvc2NyaXB0cy9jb21wb25lbnRzL1VwbG9hZEFyZWEudHMiLCIuLi9ub2RlX21vZHVsZXMvYnJvd3Nlci1pbWFnZS1jb21wcmVzc2lvbi9kaXN0L2Jyb3dzZXItaW1hZ2UtY29tcHJlc3Npb24ubWpzIiwiLi4vc3JjL3NjcmlwdHMvY29tcG9uZW50cy9Mb2FkZXIudHMiLCIuLi9zcmMvc2NyaXB0cy91dGlscy9TZXR0aW5ncy50cyIsIi4uL3NyYy9zY3JpcHRzL3Byb2Nlc3NvcnMvRmlsZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9zY3JpcHRzL2NvbXBvbmVudHMvVXBsb2FkQnV0dG9uLnRzIiwiLi4vc3JjL3NjcmlwdHMvY29tcG9uZW50cy9DaGF0U2lkZWJhci50cyIsIi4uL3NyYy9zY3JpcHRzL2NvbXBvbmVudHMvQ2hhdE1lc3NhZ2UudHMiLCIuLi9zcmMvc2NyaXB0cy9wcm9jZXNzb3JzL01lc3NhZ2VQcm9jZXNzb3IudHMiLCIuLi9zcmMvY2hhdC1pbWFnZXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxyXG5leHBvcnQgY29uc3QgY3JlYXRlID0gKGh0bWw6IHN0cmluZyB8IEhUTUxFbGVtZW50KTogSlF1ZXJ5ID0+ICQoaHRtbClcclxuZXhwb3J0IGNvbnN0IGJlZm9yZSA9IChyZWZlcmVuY2VOb2RlOiBKUXVlcnksIG5ld05vZGU6IEpRdWVyeSk6IEpRdWVyeSA9PiByZWZlcmVuY2VOb2RlLmJlZm9yZShuZXdOb2RlKVxyXG5leHBvcnQgY29uc3QgYWZ0ZXIgPSAocmVmZXJlbmNlTm9kZTogSlF1ZXJ5LCBuZXdOb2RlOiBKUXVlcnkpOiBKUXVlcnkgPT4gcmVmZXJlbmNlTm9kZS5hZnRlcihuZXdOb2RlKVxyXG5leHBvcnQgY29uc3QgZmluZCA9IChzZWxlY3Rvcjogc3RyaW5nLCBwYXJlbnROb2RlPzogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHBhcmVudE5vZGUgPyBwYXJlbnROb2RlLmZpbmQoc2VsZWN0b3IpIDogJChzZWxlY3RvcilcclxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChwYXJlbnROb2RlOiBKUXVlcnksIG5ld05vZGU6IEpRdWVyeSk6IEpRdWVyeSA9PiBwYXJlbnROb2RlLmFwcGVuZChuZXdOb2RlKVxyXG4vLyBAdHMtaWdub3JlXHJcbmV4cG9ydCBjb25zdCBvbiA9IChwYXJlbnROb2RlOiBKUXVlcnksIGV2ZW50VHlwZTogc3RyaW5nLCBldmVudEZ1bmN0aW9uOiBGdW5jdGlvbik6IEpRdWVyeSA9PiBwYXJlbnROb2RlLm9uKGV2ZW50VHlwZSwgZXZlbnRGdW5jdGlvbilcclxuZXhwb3J0IGNvbnN0IHRyaWdnZXIgPSAocGFyZW50Tm9kZTogSlF1ZXJ5LCBldmVudFR5cGU6IHN0cmluZyk6IEpRdWVyeSA9PiBwYXJlbnROb2RlLnRyaWdnZXIoZXZlbnRUeXBlKVxyXG5leHBvcnQgY29uc3QgcmVtb3ZlQ2xhc3MgPSAocGFyZW50Tm9kZTogSlF1ZXJ5LCBjbGFzc1N0cmluZzogc3RyaW5nKTogSlF1ZXJ5ID0+IHBhcmVudE5vZGUucmVtb3ZlQ2xhc3MoY2xhc3NTdHJpbmcpXHJcbmV4cG9ydCBjb25zdCBhZGRDbGFzcyA9IChwYXJlbnROb2RlOiBKUXVlcnksIGNsYXNzU3RyaW5nOiBzdHJpbmcpOiBKUXVlcnkgPT4gcGFyZW50Tm9kZS5hZGRDbGFzcyhjbGFzc1N0cmluZylcclxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IChub2RlOiBKUXVlcnkpOiBKUXVlcnkgPT4gbm9kZS5yZW1vdmUoKVxyXG5leHBvcnQgY29uc3QgYXR0ciA9IChub2RlOiBKUXVlcnksIGF0dHJJZDogc3RyaW5nLCBhdHRyVmFsdWU/OiBhbnkpOiBzdHJpbmcgfCBKUXVlcnkgfCB1bmRlZmluZWQgPT4gYXR0clZhbHVlID8gbm9kZS5hdHRyKGF0dHJJZCwgYXR0clZhbHVlKSA6IG5vZGUuYXR0cihhdHRySWQpXHJcbmV4cG9ydCBjb25zdCByZW1vdmVBdHRyID0gKG5vZGU6IEpRdWVyeSwgYXR0cklkOiBzdHJpbmcpOiBKUXVlcnkgPT4gbm9kZS5yZW1vdmVBdHRyKGF0dHJJZClcclxuZXhwb3J0IGNvbnN0IGZvY3VzID0gKG5vZGU6IEpRdWVyeSk6IEpRdWVyeSA9PiBub2RlLmZvY3VzKClcclxuZXhwb3J0IGNvbnN0IHNjcm9sbEJvdHRvbSA9IChub2RlOiBKUXVlcnkpOiBKUXVlcnkgPT4gbm9kZS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBub2RlLmhlaWdodCgpIH0pXHJcbi8vIEB0cy1pZ25vcmVcclxuZXhwb3J0IGNvbnN0IGVhY2ggPSAobm9kZTogSlF1ZXJ5LCBoYW5kbGVyOiBGdW5jdGlvbik6IEpRdWVyeSA9PiBub2RlLmVhY2goaGFuZGxlcikiLCJleHBvcnQgY29uc3QgT1JJR0lOX0ZPTERFUiA9ICdkYXRhJ1xyXG5leHBvcnQgY29uc3QgdCA9ICh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcgPT4gKGdhbWUgYXMgR2FtZSk/LmkxOG4/LmxvY2FsaXplKGBDSS4ke3RleHR9YCkgfHwgJydcclxuZXhwb3J0IGNvbnN0IHJhbmRvbVN0cmluZyA9ICgpOiBzdHJpbmcgPT4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KSArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxNSlcclxuZXhwb3J0IGNvbnN0IHVzZXJDYW5VcGxvYWQgPSAoc2lsZW50ID0gZmFsc2UpOiBib29sZWFuID0+IHtcclxuICBjb25zdCB1c2VyUm9sZSA9IChnYW1lIGFzIEdhbWUpPy51c2VyPy5yb2xlXHJcbiAgY29uc3QgZmlsZVVwbG9hZFBlcm1pc3Npb25zID0gKGdhbWUgYXMgR2FtZSk/LnBlcm1pc3Npb25zPy5GSUxFU19VUExPQURcclxuXHJcbiAgaWYgKCF1c2VyUm9sZSB8fCAhZmlsZVVwbG9hZFBlcm1pc3Npb25zKSB7XHJcbiAgICBpZiAoIXNpbGVudCkgdWkubm90aWZpY2F0aW9ucz8ud2Fybih0KCd1cGxvYWRQZXJtaXNzaW9ucycpKVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICBjb25zdCB1cGxvYWRQZXJtaXNzaW9uID0gZmlsZVVwbG9hZFBlcm1pc3Npb25zLmluY2x1ZGVzKHVzZXJSb2xlKVxyXG4gIGlmICghdXBsb2FkUGVybWlzc2lvbiAmJiAhc2lsZW50KSB1aS5ub3RpZmljYXRpb25zPy53YXJuKHQoJ3VwbG9hZFBlcm1pc3Npb25zJykpXHJcblxyXG4gIHJldHVybiB1cGxvYWRQZXJtaXNzaW9uXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRGb3VuZHJ5VmVyc2lvbiA9ICgpID0+IChnYW1lIGFzIEdhbWUpPy52ZXJzaW9uXHJcblxyXG5leHBvcnQgY29uc3QgaXNWZXJpb3NuQWZ0ZXIxMyA9ICgpID0+IE51bWJlcihnZXRGb3VuZHJ5VmVyc2lvbigpKSA+PSAxM1xyXG5cclxuZXhwb3J0IGNvbnN0IEZpbGVQaWNrZXJJbXBsZW1lbnRhdGlvbiA9ICgpID0+IGlzVmVyaW9zbkFmdGVyMTMoKVxyXG4gID8gZm91bmRyeS5hcHBsaWNhdGlvbnMuYXBwcy5GaWxlUGlja2VyLmltcGxlbWVudGF0aW9uXHJcbiAgOiBGaWxlUGlja2VyXHJcblxyXG5leHBvcnQgY29uc3QgSW1hZ2VQb3BvdXRJbXBsZW1lbnRhdGlvbiA9ICgpID0+IGlzVmVyaW9zbkFmdGVyMTMoKVxyXG4gID8gZm91bmRyeS5hcHBsaWNhdGlvbnMuYXBwcy5JbWFnZVBvcG91dFxyXG4gIDogSW1hZ2VQb3BvdXQiLCJpbXBvcnQgeyBiZWZvcmUsIGNyZWF0ZSwgZmluZCB9IGZyb20gJy4uL3V0aWxzL0pxdWVyeVdyYXBwZXJzJ1xyXG5pbXBvcnQgeyBpc1Zlcmlvc25BZnRlcjEzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnXHJcblxyXG5jb25zdCBjcmVhdGVVcGxvYWRBcmVhID0gKCk6IEpRdWVyeSA9PiBjcmVhdGUoYDxkaXYgaWQ9XCJjaS1jaGF0LXVwbG9hZC1hcmVhXCIgY2xhc3M9XCJoaWRkZW5cIj48L2Rpdj5gKVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRVcGxvYWRBcmVhID0gKHNpZGViYXI6IEpRdWVyeSkgPT4ge1xyXG4gIGNvbnN0IGNoYXRDb250cm9sc1NlbGVjdG9yID0gaXNWZXJpb3NuQWZ0ZXIxMygpID8gJy5jaGF0LWNvbnRyb2xzJyA6ICcjY2hhdC1jb250cm9scydcclxuXHJcbiAgY29uc3QgY2hhdENvbnRyb2xzOiBKUXVlcnkgPSBmaW5kKGNoYXRDb250cm9sc1NlbGVjdG9yLCBzaWRlYmFyKVxyXG4gIGNvbnN0IHVwbG9hZEFyZWE6IEpRdWVyeSA9IGNyZWF0ZVVwbG9hZEFyZWEoKVxyXG4gIGJlZm9yZShjaGF0Q29udHJvbHMsIHVwbG9hZEFyZWEpXHJcbn1cclxuIiwiLyoqXG4gKiBCcm93c2VyIEltYWdlIENvbXByZXNzaW9uXG4gKiB2Mi4wLjJcbiAqIGJ5IERvbmFsZCA8ZG9uYWxkY3dsQGdtYWlsLmNvbT5cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Eb25hbGRjd2wvYnJvd3Nlci1pbWFnZS1jb21wcmVzc2lvblxuICovXG5cbmZ1bmN0aW9uIF9tZXJnZU5hbWVzcGFjZXMoZSx0KXtyZXR1cm4gdC5mb3JFYWNoKChmdW5jdGlvbih0KXt0JiZcInN0cmluZ1wiIT10eXBlb2YgdCYmIUFycmF5LmlzQXJyYXkodCkmJk9iamVjdC5rZXlzKHQpLmZvckVhY2goKGZ1bmN0aW9uKHIpe2lmKFwiZGVmYXVsdFwiIT09ciYmIShyIGluIGUpKXt2YXIgaT1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQscik7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUscixpLmdldD9pOntlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0W3JdfX0pfX0pKX0pKSxPYmplY3QuZnJlZXplKGUpfWZ1bmN0aW9uIGNvcHlFeGlmV2l0aG91dE9yaWVudGF0aW9uKGUsdCl7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihyLGkpe2xldCBvO3JldHVybiBnZXRBcHAxU2VnbWVudChlKS50aGVuKChmdW5jdGlvbihlKXt0cnl7cmV0dXJuIG89ZSxyKG5ldyBCbG9iKFt0LnNsaWNlKDAsMiksbyx0LnNsaWNlKDIpXSx7dHlwZTpcImltYWdlL2pwZWdcIn0pKX1jYXRjaChlKXtyZXR1cm4gaShlKX19KSxpKX0pKX1jb25zdCBnZXRBcHAxU2VnbWVudD1lPT5uZXcgUHJvbWlzZSgoKHQscik9Pntjb25zdCBpPW5ldyBGaWxlUmVhZGVyO2kuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwoKHt0YXJnZXQ6e3Jlc3VsdDplfX0pPT57Y29uc3QgaT1uZXcgRGF0YVZpZXcoZSk7bGV0IG89MDtpZig2NTQ5NiE9PWkuZ2V0VWludDE2KG8pKXJldHVybiByKFwibm90IGEgdmFsaWQgSlBFR1wiKTtmb3Iobys9Mjs7KXtjb25zdCBhPWkuZ2V0VWludDE2KG8pO2lmKDY1NDk4PT09YSlicmVhaztjb25zdCBzPWkuZ2V0VWludDE2KG8rMik7aWYoNjU1MDU9PT1hJiYxMTY1NTE5MjA2PT09aS5nZXRVaW50MzIobys0KSl7Y29uc3QgYT1vKzEwO2xldCBmO3N3aXRjaChpLmdldFVpbnQxNihhKSl7Y2FzZSAxODc2MTpmPSEwO2JyZWFrO2Nhc2UgMTk3ODk6Zj0hMTticmVhaztkZWZhdWx0OnJldHVybiByKFwiVElGRiBoZWFkZXIgY29udGFpbnMgaW52YWxpZCBlbmRpYW5cIil9aWYoNDIhPT1pLmdldFVpbnQxNihhKzIsZikpcmV0dXJuIHIoXCJUSUZGIGhlYWRlciBjb250YWlucyBpbnZhbGlkIHZlcnNpb25cIik7Y29uc3QgbD1pLmdldFVpbnQzMihhKzQsZiksYz1hK2wrMisxMippLmdldFVpbnQxNihhK2wsZik7Zm9yKGxldCBlPWErbCsyO2U8YztlKz0xMil7aWYoMjc0PT1pLmdldFVpbnQxNihlLGYpKXtpZigzIT09aS5nZXRVaW50MTYoZSsyLGYpKXJldHVybiByKFwiT3JpZW50YXRpb24gZGF0YSB0eXBlIGlzIGludmFsaWRcIik7aWYoMSE9PWkuZ2V0VWludDMyKGUrNCxmKSlyZXR1cm4gcihcIk9yaWVudGF0aW9uIGRhdGEgY291bnQgaXMgaW52YWxpZFwiKTtpLnNldFVpbnQxNihlKzgsMSxmKTticmVha319cmV0dXJuIHQoZS5zbGljZShvLG8rMitzKSl9bys9MitzfXJldHVybiB0KG5ldyBCbG9iKX0pKSxpLnJlYWRBc0FycmF5QnVmZmVyKGUpfSkpO3ZhciBlPXt9LHQ9e2dldCBleHBvcnRzKCl7cmV0dXJuIGV9LHNldCBleHBvcnRzKHQpe2U9dH19OyFmdW5jdGlvbihlKXt2YXIgcixpLFVaSVA9e307dC5leHBvcnRzPVVaSVAsVVpJUC5wYXJzZT1mdW5jdGlvbihlLHQpe2Zvcih2YXIgcj1VWklQLmJpbi5yZWFkVXNob3J0LGk9VVpJUC5iaW4ucmVhZFVpbnQsbz0wLGE9e30scz1uZXcgVWludDhBcnJheShlKSxmPXMubGVuZ3RoLTQ7MTAxMDEwMjU2IT1pKHMsZik7KWYtLTtvPWY7bys9NDt2YXIgbD1yKHMsbys9NCk7cihzLG8rPTIpO3ZhciBjPWkocyxvKz0yKSx1PWkocyxvKz00KTtvKz00LG89dTtmb3IodmFyIGg9MDtoPGw7aCsrKXtpKHMsbyksbys9NCxvKz00LG8rPTQsaShzLG8rPTQpO2M9aShzLG8rPTQpO3ZhciBkPWkocyxvKz00KSxBPXIocyxvKz00KSxnPXIocyxvKzIpLHA9cihzLG8rNCk7bys9Njt2YXIgbT1pKHMsbys9OCk7bys9NCxvKz1BK2crcCxVWklQLl9yZWFkTG9jYWwocyxtLGEsYyxkLHQpfXJldHVybiBhfSxVWklQLl9yZWFkTG9jYWw9ZnVuY3Rpb24oZSx0LHIsaSxvLGEpe3ZhciBzPVVaSVAuYmluLnJlYWRVc2hvcnQsZj1VWklQLmJpbi5yZWFkVWludDtmKGUsdCkscyhlLHQrPTQpLHMoZSx0Kz0yKTt2YXIgbD1zKGUsdCs9Mik7ZihlLHQrPTIpLGYoZSx0Kz00KSx0Kz00O3ZhciBjPXMoZSx0Kz04KSx1PXMoZSx0Kz0yKTt0Kz0yO3ZhciBoPVVaSVAuYmluLnJlYWRVVEY4KGUsdCxjKTtpZih0Kz1jLHQrPXUsYSlyW2hdPXtzaXplOm8sY3NpemU6aX07ZWxzZXt2YXIgZD1uZXcgVWludDhBcnJheShlLmJ1ZmZlcix0KTtpZigwPT1sKXJbaF09bmV3IFVpbnQ4QXJyYXkoZC5idWZmZXIuc2xpY2UodCx0K2kpKTtlbHNle2lmKDghPWwpdGhyb3dcInVua25vd24gY29tcHJlc3Npb24gbWV0aG9kOiBcIitsO3ZhciBBPW5ldyBVaW50OEFycmF5KG8pO1VaSVAuaW5mbGF0ZVJhdyhkLEEpLHJbaF09QX19fSxVWklQLmluZmxhdGVSYXc9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gVVpJUC5GLmluZmxhdGUoZSx0KX0sVVpJUC5pbmZsYXRlPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIGVbMF0sZVsxXSxVWklQLmluZmxhdGVSYXcobmV3IFVpbnQ4QXJyYXkoZS5idWZmZXIsZS5ieXRlT2Zmc2V0KzIsZS5sZW5ndGgtNiksdCl9LFVaSVAuZGVmbGF0ZT1mdW5jdGlvbihlLHQpe251bGw9PXQmJih0PXtsZXZlbDo2fSk7dmFyIHI9MCxpPW5ldyBVaW50OEFycmF5KDUwK01hdGguZmxvb3IoMS4xKmUubGVuZ3RoKSk7aVtyXT0xMjAsaVtyKzFdPTE1NixyKz0yLHI9VVpJUC5GLmRlZmxhdGVSYXcoZSxpLHIsdC5sZXZlbCk7dmFyIG89VVpJUC5hZGxlcihlLDAsZS5sZW5ndGgpO3JldHVybiBpW3IrMF09bz4+PjI0JjI1NSxpW3IrMV09bz4+PjE2JjI1NSxpW3IrMl09bz4+PjgmMjU1LGlbciszXT1vPj4+MCYyNTUsbmV3IFVpbnQ4QXJyYXkoaS5idWZmZXIsMCxyKzQpfSxVWklQLmRlZmxhdGVSYXc9ZnVuY3Rpb24oZSx0KXtudWxsPT10JiYodD17bGV2ZWw6Nn0pO3ZhciByPW5ldyBVaW50OEFycmF5KDUwK01hdGguZmxvb3IoMS4xKmUubGVuZ3RoKSksaT1VWklQLkYuZGVmbGF0ZVJhdyhlLHIsaSx0LmxldmVsKTtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoci5idWZmZXIsMCxpKX0sVVpJUC5lbmNvZGU9ZnVuY3Rpb24oZSx0KXtudWxsPT10JiYodD0hMSk7dmFyIHI9MCxpPVVaSVAuYmluLndyaXRlVWludCxvPVVaSVAuYmluLndyaXRlVXNob3J0LGE9e307Zm9yKHZhciBzIGluIGUpe3ZhciBmPSFVWklQLl9ub05lZWQocykmJiF0LGw9ZVtzXSxjPVVaSVAuY3JjLmNyYyhsLDAsbC5sZW5ndGgpO2Fbc109e2NwcjpmLHVzaXplOmwubGVuZ3RoLGNyYzpjLGZpbGU6Zj9VWklQLmRlZmxhdGVSYXcobCk6bH19Zm9yKHZhciBzIGluIGEpcis9YVtzXS5maWxlLmxlbmd0aCszMCs0NisyKlVaSVAuYmluLnNpemVVVEY4KHMpO3IrPTIyO3ZhciB1PW5ldyBVaW50OEFycmF5KHIpLGg9MCxkPVtdO2Zvcih2YXIgcyBpbiBhKXt2YXIgQT1hW3NdO2QucHVzaChoKSxoPVVaSVAuX3dyaXRlSGVhZGVyKHUsaCxzLEEsMCl9dmFyIGc9MCxwPWg7Zm9yKHZhciBzIGluIGEpe0E9YVtzXTtkLnB1c2goaCksaD1VWklQLl93cml0ZUhlYWRlcih1LGgscyxBLDEsZFtnKytdKX12YXIgbT1oLXA7cmV0dXJuIGkodSxoLDEwMTAxMDI1NiksaCs9NCxvKHUsaCs9NCxnKSxvKHUsaCs9MixnKSxpKHUsaCs9MixtKSxpKHUsaCs9NCxwKSxoKz00LGgrPTIsdS5idWZmZXJ9LFVaSVAuX25vTmVlZD1mdW5jdGlvbihlKXt2YXIgdD1lLnNwbGl0KFwiLlwiKS5wb3AoKS50b0xvd2VyQ2FzZSgpO3JldHVybi0xIT1cInBuZyxqcGcsanBlZyx6aXBcIi5pbmRleE9mKHQpfSxVWklQLl93cml0ZUhlYWRlcj1mdW5jdGlvbihlLHQscixpLG8sYSl7dmFyIHM9VVpJUC5iaW4ud3JpdGVVaW50LGY9VVpJUC5iaW4ud3JpdGVVc2hvcnQsbD1pLmZpbGU7cmV0dXJuIHMoZSx0LDA9PW8/NjczMjQ3NTI6MzM2MzkyNDgpLHQrPTQsMT09byYmKHQrPTIpLGYoZSx0LDIwKSxmKGUsdCs9MiwwKSxmKGUsdCs9MixpLmNwcj84OjApLHMoZSx0Kz0yLDApLHMoZSx0Kz00LGkuY3JjKSxzKGUsdCs9NCxsLmxlbmd0aCkscyhlLHQrPTQsaS51c2l6ZSksZihlLHQrPTQsVVpJUC5iaW4uc2l6ZVVURjgocikpLGYoZSx0Kz0yLDApLHQrPTIsMT09byYmKHQrPTIsdCs9MixzKGUsdCs9NixhKSx0Kz00KSx0Kz1VWklQLmJpbi53cml0ZVVURjgoZSx0LHIpLDA9PW8mJihlLnNldChsLHQpLHQrPWwubGVuZ3RoKSx0fSxVWklQLmNyYz17dGFibGU6ZnVuY3Rpb24oKXtmb3IodmFyIGU9bmV3IFVpbnQzMkFycmF5KDI1NiksdD0wO3Q8MjU2O3QrKyl7Zm9yKHZhciByPXQsaT0wO2k8ODtpKyspMSZyP3I9Mzk4ODI5MjM4NF5yPj4+MTpyPj4+PTE7ZVt0XT1yfXJldHVybiBlfSgpLHVwZGF0ZTpmdW5jdGlvbihlLHQscixpKXtmb3IodmFyIG89MDtvPGk7bysrKWU9VVpJUC5jcmMudGFibGVbMjU1JihlXnRbcitvXSldXmU+Pj44O3JldHVybiBlfSxjcmM6ZnVuY3Rpb24oZSx0LHIpe3JldHVybiA0Mjk0OTY3Mjk1XlVaSVAuY3JjLnVwZGF0ZSg0Mjk0OTY3Mjk1LGUsdCxyKX19LFVaSVAuYWRsZXI9ZnVuY3Rpb24oZSx0LHIpe2Zvcih2YXIgaT0xLG89MCxhPXQscz10K3I7YTxzOyl7Zm9yKHZhciBmPU1hdGgubWluKGErNTU1MixzKTthPGY7KW8rPWkrPWVbYSsrXTtpJT02NTUyMSxvJT02NTUyMX1yZXR1cm4gbzw8MTZ8aX0sVVpJUC5iaW49e3JlYWRVc2hvcnQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZVt0XXxlW3QrMV08PDh9LHdyaXRlVXNob3J0OmZ1bmN0aW9uKGUsdCxyKXtlW3RdPTI1NSZyLGVbdCsxXT1yPj44JjI1NX0scmVhZFVpbnQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gMTY3NzcyMTYqZVt0KzNdKyhlW3QrMl08PDE2fGVbdCsxXTw8OHxlW3RdKX0sd3JpdGVVaW50OmZ1bmN0aW9uKGUsdCxyKXtlW3RdPTI1NSZyLGVbdCsxXT1yPj44JjI1NSxlW3QrMl09cj4+MTYmMjU1LGVbdCszXT1yPj4yNCYyNTV9LHJlYWRBU0NJSTpmdW5jdGlvbihlLHQscil7Zm9yKHZhciBpPVwiXCIsbz0wO288cjtvKyspaSs9U3RyaW5nLmZyb21DaGFyQ29kZShlW3Qrb10pO3JldHVybiBpfSx3cml0ZUFTQ0lJOmZ1bmN0aW9uKGUsdCxyKXtmb3IodmFyIGk9MDtpPHIubGVuZ3RoO2krKyllW3QraV09ci5jaGFyQ29kZUF0KGkpfSxwYWQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGUubGVuZ3RoPDI/XCIwXCIrZTplfSxyZWFkVVRGODpmdW5jdGlvbihlLHQscil7Zm9yKHZhciBpLG89XCJcIixhPTA7YTxyO2ErKylvKz1cIiVcIitVWklQLmJpbi5wYWQoZVt0K2FdLnRvU3RyaW5nKDE2KSk7dHJ5e2k9ZGVjb2RlVVJJQ29tcG9uZW50KG8pfWNhdGNoKGkpe3JldHVybiBVWklQLmJpbi5yZWFkQVNDSUkoZSx0LHIpfXJldHVybiBpfSx3cml0ZVVURjg6ZnVuY3Rpb24oZSx0LHIpe2Zvcih2YXIgaT1yLmxlbmd0aCxvPTAsYT0wO2E8aTthKyspe3ZhciBzPXIuY2hhckNvZGVBdChhKTtpZigwPT0oNDI5NDk2NzE2OCZzKSllW3Qrb109cyxvKys7ZWxzZSBpZigwPT0oNDI5NDk2NTI0OCZzKSllW3Qrb109MTkyfHM+PjYsZVt0K28rMV09MTI4fHM+PjAmNjMsbys9MjtlbHNlIGlmKDA9PSg0Mjk0OTAxNzYwJnMpKWVbdCtvXT0yMjR8cz4+MTIsZVt0K28rMV09MTI4fHM+PjYmNjMsZVt0K28rMl09MTI4fHM+PjAmNjMsbys9MztlbHNle2lmKDAhPSg0MjkyODcwMTQ0JnMpKXRocm93XCJlXCI7ZVt0K29dPTI0MHxzPj4xOCxlW3QrbysxXT0xMjh8cz4+MTImNjMsZVt0K28rMl09MTI4fHM+PjYmNjMsZVt0K28rM109MTI4fHM+PjAmNjMsbys9NH19cmV0dXJuIG99LHNpemVVVEY4OmZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLmxlbmd0aCxyPTAsaT0wO2k8dDtpKyspe3ZhciBvPWUuY2hhckNvZGVBdChpKTtpZigwPT0oNDI5NDk2NzE2OCZvKSlyKys7ZWxzZSBpZigwPT0oNDI5NDk2NTI0OCZvKSlyKz0yO2Vsc2UgaWYoMD09KDQyOTQ5MDE3NjAmbykpcis9MztlbHNle2lmKDAhPSg0MjkyODcwMTQ0Jm8pKXRocm93XCJlXCI7cis9NH19cmV0dXJuIHJ9fSxVWklQLkY9e30sVVpJUC5GLmRlZmxhdGVSYXc9ZnVuY3Rpb24oZSx0LHIsaSl7dmFyIG89W1swLDAsMCwwLDBdLFs0LDQsOCw0LDBdLFs0LDUsMTYsOCwwXSxbNCw2LDE2LDE2LDBdLFs0LDEwLDE2LDMyLDBdLFs4LDE2LDMyLDMyLDBdLFs4LDE2LDEyOCwxMjgsMF0sWzgsMzIsMTI4LDI1NiwwXSxbMzIsMTI4LDI1OCwxMDI0LDFdLFszMiwyNTgsMjU4LDQwOTYsMV1dW2ldLGE9VVpJUC5GLlUscz1VWklQLkYuX2dvb2RJbmRleDtVWklQLkYuX2hhc2g7dmFyIGY9VVpJUC5GLl9wdXRzRSxsPTAsYz1yPDwzLHU9MCxoPWUubGVuZ3RoO2lmKDA9PWkpe2Zvcig7bDxoOyl7Zih0LGMsbCsoXz1NYXRoLm1pbig2NTUzNSxoLWwpKT09aD8xOjApLGM9VVpJUC5GLl9jb3B5RXhhY3QoZSxsLF8sdCxjKzgpLGwrPV99cmV0dXJuIGM+Pj4zfXZhciBkPWEubGl0cyxBPWEuc3RydCxnPWEucHJldixwPTAsbT0wLHc9MCx2PTAsYj0wLHk9MDtmb3IoaD4yJiYoQVt5PVVaSVAuRi5faGFzaChlLDApXT0wKSxsPTA7bDxoO2wrKyl7aWYoYj15LGwrMTxoLTIpe3k9VVpJUC5GLl9oYXNoKGUsbCsxKTt2YXIgRT1sKzEmMzI3Njc7Z1tFXT1BW3ldLEFbeV09RX1pZih1PD1sKXsocD4xNGUzfHxtPjI2Njk3KSYmaC1sPjEwMCYmKHU8bCYmKGRbcF09bC11LHArPTIsdT1sKSxjPVVaSVAuRi5fd3JpdGVCbG9jayhsPT1oLTF8fHU9PWg/MTowLGQscCx2LGUsdyxsLXcsdCxjKSxwPW09dj0wLHc9bCk7dmFyIEY9MDtsPGgtMiYmKEY9VVpJUC5GLl9iZXN0TWF0Y2goZSxsLGcsYixNYXRoLm1pbihvWzJdLGgtbCksb1szXSkpO3ZhciBfPUY+Pj4xNixCPTY1NTM1JkY7aWYoMCE9Ril7Qj02NTUzNSZGO3ZhciBVPXMoXz1GPj4+MTYsYS5vZjApO2EubGhzdFsyNTcrVV0rKzt2YXIgQz1zKEIsYS5kZjApO2EuZGhzdFtDXSsrLHYrPWEuZXhiW1VdK2EuZHhiW0NdLGRbcF09Xzw8MjN8bC11LGRbcCsxXT1CPDwxNnxVPDw4fEMscCs9Mix1PWwrX31lbHNlIGEubGhzdFtlW2xdXSsrO20rK319Zm9yKHc9PWwmJjAhPWUubGVuZ3RofHwodTxsJiYoZFtwXT1sLXUscCs9Mix1PWwpLGM9VVpJUC5GLl93cml0ZUJsb2NrKDEsZCxwLHYsZSx3LGwtdyx0LGMpLHA9MCxtPTAscD1tPXY9MCx3PWwpOzAhPSg3JmMpOyljKys7cmV0dXJuIGM+Pj4zfSxVWklQLkYuX2Jlc3RNYXRjaD1mdW5jdGlvbihlLHQscixpLG8sYSl7dmFyIHM9MzI3NjcmdCxmPXJbc10sbD1zLWYrMzI3NjgmMzI3Njc7aWYoZj09c3x8aSE9VVpJUC5GLl9oYXNoKGUsdC1sKSlyZXR1cm4gMDtmb3IodmFyIGM9MCx1PTAsaD1NYXRoLm1pbigzMjc2Nyx0KTtsPD1oJiYwIT0tLWEmJmYhPXM7KXtpZigwPT1jfHxlW3QrY109PWVbdCtjLWxdKXt2YXIgZD1VWklQLkYuX2hvd0xvbmcoZSx0LGwpO2lmKGQ+Yyl7aWYodT1sLChjPWQpPj1vKWJyZWFrO2wrMjxkJiYoZD1sKzIpO2Zvcih2YXIgQT0wLGc9MDtnPGQtMjtnKyspe3ZhciBwPXQtbCtnKzMyNzY4JjMyNzY3LG09cC1yW3BdKzMyNzY4JjMyNzY3O20+QSYmKEE9bSxmPXApfX19bCs9KHM9ZiktKGY9cltzXSkrMzI3NjgmMzI3Njd9cmV0dXJuIGM8PDE2fHV9LFVaSVAuRi5faG93TG9uZz1mdW5jdGlvbihlLHQscil7aWYoZVt0XSE9ZVt0LXJdfHxlW3QrMV0hPWVbdCsxLXJdfHxlW3QrMl0hPWVbdCsyLXJdKXJldHVybiAwO3ZhciBpPXQsbz1NYXRoLm1pbihlLmxlbmd0aCx0KzI1OCk7Zm9yKHQrPTM7dDxvJiZlW3RdPT1lW3Qtcl07KXQrKztyZXR1cm4gdC1pfSxVWklQLkYuX2hhc2g9ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZVt0XTw8OHxlW3QrMV0pKyhlW3QrMl08PDQpJjY1NTM1fSxVWklQLnNhdmVkPTAsVVpJUC5GLl93cml0ZUJsb2NrPWZ1bmN0aW9uKGUsdCxyLGksbyxhLHMsZixsKXt2YXIgYyx1LGgsZCxBLGcscCxtLHcsdj1VWklQLkYuVSxiPVVaSVAuRi5fcHV0c0YseT1VWklQLkYuX3B1dHNFO3YubGhzdFsyNTZdKyssdT0oYz1VWklQLkYuZ2V0VHJlZXMoKSlbMF0saD1jWzFdLGQ9Y1syXSxBPWNbM10sZz1jWzRdLHA9Y1s1XSxtPWNbNl0sdz1jWzddO3ZhciBFPTMyKygwPT0obCszJjcpPzA6OC0obCszJjcpKSsoczw8MyksRj1pK1VaSVAuRi5jb250U2l6ZSh2LmZsdHJlZSx2Lmxoc3QpK1VaSVAuRi5jb250U2l6ZSh2LmZkdHJlZSx2LmRoc3QpLF89aStVWklQLkYuY29udFNpemUodi5sdHJlZSx2Lmxoc3QpK1VaSVAuRi5jb250U2l6ZSh2LmR0cmVlLHYuZGhzdCk7Xys9MTQrMypwK1VaSVAuRi5jb250U2l6ZSh2Lml0cmVlLHYuaWhzdCkrKDIqdi5paHN0WzE2XSszKnYuaWhzdFsxN10rNyp2Lmloc3RbMThdKTtmb3IodmFyIEI9MDtCPDI4NjtCKyspdi5saHN0W0JdPTA7Zm9yKEI9MDtCPDMwO0IrKyl2LmRoc3RbQl09MDtmb3IoQj0wO0I8MTk7QisrKXYuaWhzdFtCXT0wO3ZhciBVPUU8RiYmRTxfPzA6RjxfPzE6MjtpZihiKGYsbCxlKSxiKGYsbCsxLFUpLGwrPTMsMD09VSl7Zm9yKDswIT0oNyZsKTspbCsrO2w9VVpJUC5GLl9jb3B5RXhhY3QobyxhLHMsZixsKX1lbHNle3ZhciBDLEk7aWYoMT09VSYmKEM9di5mbHRyZWUsST12LmZkdHJlZSksMj09VSl7VVpJUC5GLm1ha2VDb2Rlcyh2Lmx0cmVlLHUpLFVaSVAuRi5yZXZDb2Rlcyh2Lmx0cmVlLHUpLFVaSVAuRi5tYWtlQ29kZXModi5kdHJlZSxoKSxVWklQLkYucmV2Q29kZXModi5kdHJlZSxoKSxVWklQLkYubWFrZUNvZGVzKHYuaXRyZWUsZCksVVpJUC5GLnJldkNvZGVzKHYuaXRyZWUsZCksQz12Lmx0cmVlLEk9di5kdHJlZSx5KGYsbCxBLTI1NykseShmLGwrPTUsZy0xKSx5KGYsbCs9NSxwLTQpLGwrPTQ7Zm9yKHZhciBRPTA7UTxwO1ErKyl5KGYsbCszKlEsdi5pdHJlZVsxKyh2Lm9yZHJbUV08PDEpXSk7bCs9MypwLGw9VVpJUC5GLl9jb2RlVGlueShtLHYuaXRyZWUsZixsKSxsPVVaSVAuRi5fY29kZVRpbnkodyx2Lml0cmVlLGYsbCl9Zm9yKHZhciBNPWEseD0wO3g8cjt4Kz0yKXtmb3IodmFyIFM9dFt4XSxSPVM+Pj4yMyxUPU0rKDgzODg2MDcmUyk7TTxUOylsPVVaSVAuRi5fd3JpdGVMaXQob1tNKytdLEMsZixsKTtpZigwIT1SKXt2YXIgTz10W3grMV0sUD1PPj4xNixIPU8+PjgmMjU1LEw9MjU1Jk87eShmLGw9VVpJUC5GLl93cml0ZUxpdCgyNTcrSCxDLGYsbCksUi12Lm9mMFtIXSksbCs9di5leGJbSF0sYihmLGw9VVpJUC5GLl93cml0ZUxpdChMLEksZixsKSxQLXYuZGYwW0xdKSxsKz12LmR4YltMXSxNKz1SfX1sPVVaSVAuRi5fd3JpdGVMaXQoMjU2LEMsZixsKX1yZXR1cm4gbH0sVVpJUC5GLl9jb3B5RXhhY3Q9ZnVuY3Rpb24oZSx0LHIsaSxvKXt2YXIgYT1vPj4+MztyZXR1cm4gaVthXT1yLGlbYSsxXT1yPj4+OCxpW2ErMl09MjU1LWlbYV0saVthKzNdPTI1NS1pW2ErMV0sYSs9NCxpLnNldChuZXcgVWludDhBcnJheShlLmJ1ZmZlcix0LHIpLGEpLG8rKHIrNDw8Myl9LFVaSVAuRi5nZXRUcmVlcz1mdW5jdGlvbigpe2Zvcih2YXIgZT1VWklQLkYuVSx0PVVaSVAuRi5faHVmVHJlZShlLmxoc3QsZS5sdHJlZSwxNSkscj1VWklQLkYuX2h1ZlRyZWUoZS5kaHN0LGUuZHRyZWUsMTUpLGk9W10sbz1VWklQLkYuX2xlbkNvZGVzKGUubHRyZWUsaSksYT1bXSxzPVVaSVAuRi5fbGVuQ29kZXMoZS5kdHJlZSxhKSxmPTA7ZjxpLmxlbmd0aDtmKz0yKWUuaWhzdFtpW2ZdXSsrO2ZvcihmPTA7ZjxhLmxlbmd0aDtmKz0yKWUuaWhzdFthW2ZdXSsrO2Zvcih2YXIgbD1VWklQLkYuX2h1ZlRyZWUoZS5paHN0LGUuaXRyZWUsNyksYz0xOTtjPjQmJjA9PWUuaXRyZWVbMSsoZS5vcmRyW2MtMV08PDEpXTspYy0tO3JldHVyblt0LHIsbCxvLHMsYyxpLGFdfSxVWklQLkYuZ2V0U2Vjb25kPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1bXSxyPTA7cjxlLmxlbmd0aDtyKz0yKXQucHVzaChlW3IrMV0pO3JldHVybiB0fSxVWklQLkYubm9uWmVybz1mdW5jdGlvbihlKXtmb3IodmFyIHQ9XCJcIixyPTA7cjxlLmxlbmd0aDtyKz0yKTAhPWVbcisxXSYmKHQrPShyPj4xKStcIixcIik7cmV0dXJuIHR9LFVaSVAuRi5jb250U2l6ZT1mdW5jdGlvbihlLHQpe2Zvcih2YXIgcj0wLGk9MDtpPHQubGVuZ3RoO2krKylyKz10W2ldKmVbMSsoaTw8MSldO3JldHVybiByfSxVWklQLkYuX2NvZGVUaW55PWZ1bmN0aW9uKGUsdCxyLGkpe2Zvcih2YXIgbz0wO288ZS5sZW5ndGg7bys9Mil7dmFyIGE9ZVtvXSxzPWVbbysxXTtpPVVaSVAuRi5fd3JpdGVMaXQoYSx0LHIsaSk7dmFyIGY9MTY9PWE/MjoxNz09YT8zOjc7YT4xNSYmKFVaSVAuRi5fcHV0c0UocixpLHMsZiksaSs9Zil9cmV0dXJuIGl9LFVaSVAuRi5fbGVuQ29kZXM9ZnVuY3Rpb24oZSx0KXtmb3IodmFyIHI9ZS5sZW5ndGg7MiE9ciYmMD09ZVtyLTFdOylyLT0yO2Zvcih2YXIgaT0wO2k8cjtpKz0yKXt2YXIgbz1lW2krMV0sYT1pKzM8cj9lW2krM106LTEscz1pKzU8cj9lW2krNV06LTEsZj0wPT1pPy0xOmVbaS0xXTtpZigwPT1vJiZhPT1vJiZzPT1vKXtmb3IodmFyIGw9aSs1O2wrMjxyJiZlW2wrMl09PW87KWwrPTI7KGM9TWF0aC5taW4obCsxLWk+Pj4xLDEzOCkpPDExP3QucHVzaCgxNyxjLTMpOnQucHVzaCgxOCxjLTExKSxpKz0yKmMtMn1lbHNlIGlmKG89PWYmJmE9PW8mJnM9PW8pe2ZvcihsPWkrNTtsKzI8ciYmZVtsKzJdPT1vOylsKz0yO3ZhciBjPU1hdGgubWluKGwrMS1pPj4+MSw2KTt0LnB1c2goMTYsYy0zKSxpKz0yKmMtMn1lbHNlIHQucHVzaChvLDApfXJldHVybiByPj4+MX0sVVpJUC5GLl9odWZUcmVlPWZ1bmN0aW9uKGUsdCxyKXt2YXIgaT1bXSxvPWUubGVuZ3RoLGE9dC5sZW5ndGgscz0wO2ZvcihzPTA7czxhO3MrPTIpdFtzXT0wLHRbcysxXT0wO2ZvcihzPTA7czxvO3MrKykwIT1lW3NdJiZpLnB1c2goe2xpdDpzLGY6ZVtzXX0pO3ZhciBmPWkubGVuZ3RoLGw9aS5zbGljZSgwKTtpZigwPT1mKXJldHVybiAwO2lmKDE9PWYpe3ZhciBjPWlbMF0ubGl0O2w9MD09Yz8xOjA7cmV0dXJuIHRbMSsoYzw8MSldPTEsdFsxKyhsPDwxKV09MSwxfWkuc29ydCgoZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5mLXQuZn0pKTt2YXIgdT1pWzBdLGg9aVsxXSxkPTAsQT0xLGc9Mjtmb3IoaVswXT17bGl0Oi0xLGY6dS5mK2guZixsOnUscjpoLGQ6MH07QSE9Zi0xOyl1PWQhPUEmJihnPT1mfHxpW2RdLmY8aVtnXS5mKT9pW2QrK106aVtnKytdLGg9ZCE9QSYmKGc9PWZ8fGlbZF0uZjxpW2ddLmYpP2lbZCsrXTppW2crK10saVtBKytdPXtsaXQ6LTEsZjp1LmYraC5mLGw6dSxyOmh9O3ZhciBwPVVaSVAuRi5zZXREZXB0aChpW0EtMV0sMCk7Zm9yKHA+ciYmKFVaSVAuRi5yZXN0cmljdERlcHRoKGwscixwKSxwPXIpLHM9MDtzPGY7cysrKXRbMSsobFtzXS5saXQ8PDEpXT1sW3NdLmQ7cmV0dXJuIHB9LFVaSVAuRi5zZXREZXB0aD1mdW5jdGlvbihlLHQpe3JldHVybi0xIT1lLmxpdD8oZS5kPXQsdCk6TWF0aC5tYXgoVVpJUC5GLnNldERlcHRoKGUubCx0KzEpLFVaSVAuRi5zZXREZXB0aChlLnIsdCsxKSl9LFVaSVAuRi5yZXN0cmljdERlcHRoPWZ1bmN0aW9uKGUsdCxyKXt2YXIgaT0wLG89MTw8ci10LGE9MDtmb3IoZS5zb3J0KChmdW5jdGlvbihlLHQpe3JldHVybiB0LmQ9PWUuZD9lLmYtdC5mOnQuZC1lLmR9KSksaT0wO2k8ZS5sZW5ndGgmJmVbaV0uZD50O2krKyl7dmFyIHM9ZVtpXS5kO2VbaV0uZD10LGErPW8tKDE8PHItcyl9Zm9yKGE+Pj49ci10O2E+MDspeyhzPWVbaV0uZCk8dD8oZVtpXS5kKyssYS09MTw8dC1zLTEpOmkrK31mb3IoO2k+PTA7aS0tKWVbaV0uZD09dCYmYTwwJiYoZVtpXS5kLS0sYSsrKTswIT1hJiZjb25zb2xlLmxvZyhcImRlYnQgbGVmdFwiKX0sVVpJUC5GLl9nb29kSW5kZXg9ZnVuY3Rpb24oZSx0KXt2YXIgcj0wO3JldHVybiB0WzE2fHJdPD1lJiYocnw9MTYpLHRbOHxyXTw9ZSYmKHJ8PTgpLHRbNHxyXTw9ZSYmKHJ8PTQpLHRbMnxyXTw9ZSYmKHJ8PTIpLHRbMXxyXTw9ZSYmKHJ8PTEpLHJ9LFVaSVAuRi5fd3JpdGVMaXQ9ZnVuY3Rpb24oZSx0LHIsaSl7cmV0dXJuIFVaSVAuRi5fcHV0c0YocixpLHRbZTw8MV0pLGkrdFsxKyhlPDwxKV19LFVaSVAuRi5pbmZsYXRlPWZ1bmN0aW9uKGUsdCl7dmFyIHI9VWludDhBcnJheTtpZigzPT1lWzBdJiYwPT1lWzFdKXJldHVybiB0fHxuZXcgcigwKTt2YXIgaT1VWklQLkYsbz1pLl9iaXRzRixhPWkuX2JpdHNFLHM9aS5fZGVjb2RlVGlueSxmPWkubWFrZUNvZGVzLGw9aS5jb2RlczJtYXAsYz1pLl9nZXQxNyx1PWkuVSxoPW51bGw9PXQ7aCYmKHQ9bmV3IHIoZS5sZW5ndGg+Pj4yPDwzKSk7Zm9yKHZhciBkLEEsZz0wLHA9MCxtPTAsdz0wLHY9MCxiPTAseT0wLEU9MCxGPTA7MD09ZzspaWYoZz1vKGUsRiwxKSxwPW8oZSxGKzEsMiksRis9MywwIT1wKXtpZihoJiYodD1VWklQLkYuX2NoZWNrKHQsRSsoMTw8MTcpKSksMT09cCYmKGQ9dS5mbG1hcCxBPXUuZmRtYXAsYj01MTEseT0zMSksMj09cCl7bT1hKGUsRiw1KSsyNTcsdz1hKGUsRis1LDUpKzEsdj1hKGUsRisxMCw0KSs0LEYrPTE0O2Zvcih2YXIgXz0wO188Mzg7Xys9Mil1Lml0cmVlW19dPTAsdS5pdHJlZVtfKzFdPTA7dmFyIEI9MTtmb3IoXz0wO188djtfKyspe3ZhciBVPWEoZSxGKzMqXywzKTt1Lml0cmVlWzErKHUub3JkcltfXTw8MSldPVUsVT5CJiYoQj1VKX1GKz0zKnYsZih1Lml0cmVlLEIpLGwodS5pdHJlZSxCLHUuaW1hcCksZD11LmxtYXAsQT11LmRtYXAsRj1zKHUuaW1hcCwoMTw8QiktMSxtK3csZSxGLHUudHRyZWUpO3ZhciBDPWkuX2NvcHlPdXQodS50dHJlZSwwLG0sdS5sdHJlZSk7Yj0oMTw8QyktMTt2YXIgST1pLl9jb3B5T3V0KHUudHRyZWUsbSx3LHUuZHRyZWUpO3k9KDE8PEkpLTEsZih1Lmx0cmVlLEMpLGwodS5sdHJlZSxDLGQpLGYodS5kdHJlZSxJKSxsKHUuZHRyZWUsSSxBKX1mb3IoOzspe3ZhciBRPWRbYyhlLEYpJmJdO0YrPTE1JlE7dmFyIE09UT4+PjQ7aWYoTT4+Pjg9PTApdFtFKytdPU07ZWxzZXtpZigyNTY9PU0pYnJlYWs7dmFyIHg9RStNLTI1NDtpZihNPjI2NCl7dmFyIFM9dS5sZGVmW00tMjU3XTt4PUUrKFM+Pj4zKSthKGUsRiw3JlMpLEYrPTcmU312YXIgUj1BW2MoZSxGKSZ5XTtGKz0xNSZSO3ZhciBUPVI+Pj40LE89dS5kZGVmW1RdLFA9KE8+Pj40KStvKGUsRiwxNSZPKTtmb3IoRis9MTUmTyxoJiYodD1VWklQLkYuX2NoZWNrKHQsRSsoMTw8MTcpKSk7RTx4Oyl0W0VdPXRbRSsrLVBdLHRbRV09dFtFKystUF0sdFtFXT10W0UrKy1QXSx0W0VdPXRbRSsrLVBdO0U9eH19fWVsc2V7MCE9KDcmRikmJihGKz04LSg3JkYpKTt2YXIgSD00KyhGPj4+MyksTD1lW0gtNF18ZVtILTNdPDw4O2gmJih0PVVaSVAuRi5fY2hlY2sodCxFK0wpKSx0LnNldChuZXcgcihlLmJ1ZmZlcixlLmJ5dGVPZmZzZXQrSCxMKSxFKSxGPUgrTDw8MyxFKz1MfXJldHVybiB0Lmxlbmd0aD09RT90OnQuc2xpY2UoMCxFKX0sVVpJUC5GLl9jaGVjaz1mdW5jdGlvbihlLHQpe3ZhciByPWUubGVuZ3RoO2lmKHQ8PXIpcmV0dXJuIGU7dmFyIGk9bmV3IFVpbnQ4QXJyYXkoTWF0aC5tYXgocjw8MSx0KSk7cmV0dXJuIGkuc2V0KGUsMCksaX0sVVpJUC5GLl9kZWNvZGVUaW55PWZ1bmN0aW9uKGUsdCxyLGksbyxhKXtmb3IodmFyIHM9VVpJUC5GLl9iaXRzRSxmPVVaSVAuRi5fZ2V0MTcsbD0wO2w8cjspe3ZhciBjPWVbZihpLG8pJnRdO28rPTE1JmM7dmFyIHU9Yz4+PjQ7aWYodTw9MTUpYVtsXT11LGwrKztlbHNle3ZhciBoPTAsZD0wOzE2PT11PyhkPTMrcyhpLG8sMiksbys9MixoPWFbbC0xXSk6MTc9PXU/KGQ9MytzKGksbywzKSxvKz0zKToxOD09dSYmKGQ9MTErcyhpLG8sNyksbys9Nyk7Zm9yKHZhciBBPWwrZDtsPEE7KWFbbF09aCxsKyt9fXJldHVybiBvfSxVWklQLkYuX2NvcHlPdXQ9ZnVuY3Rpb24oZSx0LHIsaSl7Zm9yKHZhciBvPTAsYT0wLHM9aS5sZW5ndGg+Pj4xO2E8cjspe3ZhciBmPWVbYSt0XTtpW2E8PDFdPTAsaVsxKyhhPDwxKV09ZixmPm8mJihvPWYpLGErK31mb3IoO2E8czspaVthPDwxXT0wLGlbMSsoYTw8MSldPTAsYSsrO3JldHVybiBvfSxVWklQLkYubWFrZUNvZGVzPWZ1bmN0aW9uKGUsdCl7Zm9yKHZhciByLGksbyxhLHM9VVpJUC5GLlUsZj1lLmxlbmd0aCxsPXMuYmxfY291bnQsYz0wO2M8PXQ7YysrKWxbY109MDtmb3IoYz0xO2M8ZjtjKz0yKWxbZVtjXV0rKzt2YXIgdT1zLm5leHRfY29kZTtmb3Iocj0wLGxbMF09MCxpPTE7aTw9dDtpKyspcj1yK2xbaS0xXTw8MSx1W2ldPXI7Zm9yKG89MDtvPGY7bys9MikwIT0oYT1lW28rMV0pJiYoZVtvXT11W2FdLHVbYV0rKyl9LFVaSVAuRi5jb2RlczJtYXA9ZnVuY3Rpb24oZSx0LHIpe2Zvcih2YXIgaT1lLmxlbmd0aCxvPVVaSVAuRi5VLnJldjE1LGE9MDthPGk7YSs9MilpZigwIT1lW2ErMV0pZm9yKHZhciBzPWE+PjEsZj1lW2ErMV0sbD1zPDw0fGYsYz10LWYsdT1lW2FdPDxjLGg9dSsoMTw8Yyk7dSE9aDspe3Jbb1t1XT4+PjE1LXRdPWwsdSsrfX0sVVpJUC5GLnJldkNvZGVzPWZ1bmN0aW9uKGUsdCl7Zm9yKHZhciByPVVaSVAuRi5VLnJldjE1LGk9MTUtdCxvPTA7bzxlLmxlbmd0aDtvKz0yKXt2YXIgYT1lW29dPDx0LWVbbysxXTtlW29dPXJbYV0+Pj5pfX0sVVpJUC5GLl9wdXRzRT1mdW5jdGlvbihlLHQscil7cjw8PTcmdDt2YXIgaT10Pj4+MztlW2ldfD1yLGVbaSsxXXw9cj4+Pjh9LFVaSVAuRi5fcHV0c0Y9ZnVuY3Rpb24oZSx0LHIpe3I8PD03JnQ7dmFyIGk9dD4+PjM7ZVtpXXw9cixlW2krMV18PXI+Pj44LGVbaSsyXXw9cj4+PjE2fSxVWklQLkYuX2JpdHNFPWZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4KT4+Pig3JnQpJigxPDxyKS0xfSxVWklQLkYuX2JpdHNGPWZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4fGVbMisodD4+PjMpXTw8MTYpPj4+KDcmdCkmKDE8PHIpLTF9LFVaSVAuRi5fZ2V0MTc9ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4fGVbMisodD4+PjMpXTw8MTYpPj4+KDcmdCl9LFVaSVAuRi5fZ2V0MjU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4fGVbMisodD4+PjMpXTw8MTZ8ZVszKyh0Pj4+MyldPDwyNCk+Pj4oNyZ0KX0sVVpJUC5GLlU9KHI9VWludDE2QXJyYXksaT1VaW50MzJBcnJheSx7bmV4dF9jb2RlOm5ldyByKDE2KSxibF9jb3VudDpuZXcgcigxNiksb3JkcjpbMTYsMTcsMTgsMCw4LDcsOSw2LDEwLDUsMTEsNCwxMiwzLDEzLDIsMTQsMSwxNV0sb2YwOlszLDQsNSw2LDcsOCw5LDEwLDExLDEzLDE1LDE3LDE5LDIzLDI3LDMxLDM1LDQzLDUxLDU5LDY3LDgzLDk5LDExNSwxMzEsMTYzLDE5NSwyMjcsMjU4LDk5OSw5OTksOTk5XSxleGI6WzAsMCwwLDAsMCwwLDAsMCwxLDEsMSwxLDIsMiwyLDIsMywzLDMsMyw0LDQsNCw0LDUsNSw1LDUsMCwwLDAsMF0sbGRlZjpuZXcgcigzMiksZGYwOlsxLDIsMyw0LDUsNyw5LDEzLDE3LDI1LDMzLDQ5LDY1LDk3LDEyOSwxOTMsMjU3LDM4NSw1MTMsNzY5LDEwMjUsMTUzNywyMDQ5LDMwNzMsNDA5Nyw2MTQ1LDgxOTMsMTIyODksMTYzODUsMjQ1NzcsNjU1MzUsNjU1MzVdLGR4YjpbMCwwLDAsMCwxLDEsMiwyLDMsMyw0LDQsNSw1LDYsNiw3LDcsOCw4LDksOSwxMCwxMCwxMSwxMSwxMiwxMiwxMywxMywwLDBdLGRkZWY6bmV3IGkoMzIpLGZsbWFwOm5ldyByKDUxMiksZmx0cmVlOltdLGZkbWFwOm5ldyByKDMyKSxmZHRyZWU6W10sbG1hcDpuZXcgcigzMjc2OCksbHRyZWU6W10sdHRyZWU6W10sZG1hcDpuZXcgcigzMjc2OCksZHRyZWU6W10saW1hcDpuZXcgcig1MTIpLGl0cmVlOltdLHJldjE1Om5ldyByKDMyNzY4KSxsaHN0Om5ldyBpKDI4NiksZGhzdDpuZXcgaSgzMCksaWhzdDpuZXcgaSgxOSksbGl0czpuZXcgaSgxNWUzKSxzdHJ0Om5ldyByKDY1NTM2KSxwcmV2Om5ldyByKDMyNzY4KX0pLGZ1bmN0aW9uKCl7Zm9yKHZhciBlPVVaSVAuRi5VLHQ9MDt0PDMyNzY4O3QrKyl7dmFyIHI9dDtyPSg0Mjc4MjU1MzYwJihyPSg0MDQyMzIyMTYwJihyPSgzNDM1OTczODM2JihyPSgyODYzMzExNTMwJnIpPj4+MXwoMTQzMTY1NTc2NSZyKTw8MSkpPj4+MnwoODU4OTkzNDU5JnIpPDwyKSk+Pj40fCgyNTI2NDUxMzUmcik8PDQpKT4+Pjh8KDE2NzExOTM1JnIpPDw4LGUucmV2MTVbdF09KHI+Pj4xNnxyPDwxNik+Pj4xN31mdW5jdGlvbiBwdXNoVihlLHQscil7Zm9yKDswIT10LS07KWUucHVzaCgwLHIpfWZvcih0PTA7dDwzMjt0KyspZS5sZGVmW3RdPWUub2YwW3RdPDwzfGUuZXhiW3RdLGUuZGRlZlt0XT1lLmRmMFt0XTw8NHxlLmR4Ylt0XTtwdXNoVihlLmZsdHJlZSwxNDQsOCkscHVzaFYoZS5mbHRyZWUsMTEyLDkpLHB1c2hWKGUuZmx0cmVlLDI0LDcpLHB1c2hWKGUuZmx0cmVlLDgsOCksVVpJUC5GLm1ha2VDb2RlcyhlLmZsdHJlZSw5KSxVWklQLkYuY29kZXMybWFwKGUuZmx0cmVlLDksZS5mbG1hcCksVVpJUC5GLnJldkNvZGVzKGUuZmx0cmVlLDkpLHB1c2hWKGUuZmR0cmVlLDMyLDUpLFVaSVAuRi5tYWtlQ29kZXMoZS5mZHRyZWUsNSksVVpJUC5GLmNvZGVzMm1hcChlLmZkdHJlZSw1LGUuZmRtYXApLFVaSVAuRi5yZXZDb2RlcyhlLmZkdHJlZSw1KSxwdXNoVihlLml0cmVlLDE5LDApLHB1c2hWKGUubHRyZWUsMjg2LDApLHB1c2hWKGUuZHRyZWUsMzAsMCkscHVzaFYoZS50dHJlZSwzMjAsMCl9KCl9KCk7dmFyIFVaSVA9X21lcmdlTmFtZXNwYWNlcyh7X19wcm90b19fOm51bGwsZGVmYXVsdDplfSxbZV0pO2NvbnN0IFVQTkc9ZnVuY3Rpb24oKXt2YXIgZT17bmV4dFplcm8oZSx0KXtmb3IoOzAhPWVbdF07KXQrKztyZXR1cm4gdH0scmVhZFVzaG9ydDooZSx0KT0+ZVt0XTw8OHxlW3QrMV0sd3JpdGVVc2hvcnQoZSx0LHIpe2VbdF09cj4+OCYyNTUsZVt0KzFdPTI1NSZyfSxyZWFkVWludDooZSx0KT0+MTY3NzcyMTYqZVt0XSsoZVt0KzFdPDwxNnxlW3QrMl08PDh8ZVt0KzNdKSx3cml0ZVVpbnQoZSx0LHIpe2VbdF09cj4+MjQmMjU1LGVbdCsxXT1yPj4xNiYyNTUsZVt0KzJdPXI+PjgmMjU1LGVbdCszXT0yNTUmcn0scmVhZEFTQ0lJKGUsdCxyKXtsZXQgaT1cIlwiO2ZvcihsZXQgbz0wO288cjtvKyspaSs9U3RyaW5nLmZyb21DaGFyQ29kZShlW3Qrb10pO3JldHVybiBpfSx3cml0ZUFTQ0lJKGUsdCxyKXtmb3IobGV0IGk9MDtpPHIubGVuZ3RoO2krKyllW3QraV09ci5jaGFyQ29kZUF0KGkpfSxyZWFkQnl0ZXMoZSx0LHIpe2NvbnN0IGk9W107Zm9yKGxldCBvPTA7bzxyO28rKylpLnB1c2goZVt0K29dKTtyZXR1cm4gaX0scGFkOmU9PmUubGVuZ3RoPDI/YDAke2V9YDplLHJlYWRVVEY4KHQscixpKXtsZXQgbyxhPVwiXCI7Zm9yKGxldCBvPTA7bzxpO28rKylhKz1gJSR7ZS5wYWQodFtyK29dLnRvU3RyaW5nKDE2KSl9YDt0cnl7bz1kZWNvZGVVUklDb21wb25lbnQoYSl9Y2F0Y2gobyl7cmV0dXJuIGUucmVhZEFTQ0lJKHQscixpKX1yZXR1cm4gb319O2Z1bmN0aW9uIGRlY29kZUltYWdlKHQscixpLG8pe2NvbnN0IGE9cippLHM9X2dldEJQUChvKSxmPU1hdGguY2VpbChyKnMvOCksbD1uZXcgVWludDhBcnJheSg0KmEpLGM9bmV3IFVpbnQzMkFycmF5KGwuYnVmZmVyKSx7Y3R5cGU6dX09byx7ZGVwdGg6aH09byxkPWUucmVhZFVzaG9ydDtpZig2PT11KXtjb25zdCBlPWE8PDI7aWYoOD09aClmb3IodmFyIEE9MDtBPGU7QSs9NClsW0FdPXRbQV0sbFtBKzFdPXRbQSsxXSxsW0ErMl09dFtBKzJdLGxbQSszXT10W0ErM107aWYoMTY9PWgpZm9yKEE9MDtBPGU7QSsrKWxbQV09dFtBPDwxXX1lbHNlIGlmKDI9PXUpe2NvbnN0IGU9by50YWJzLnRSTlM7aWYobnVsbD09ZSl7aWYoOD09aClmb3IoQT0wO0E8YTtBKyspe3ZhciBnPTMqQTtjW0FdPTI1NTw8MjR8dFtnKzJdPDwxNnx0W2crMV08PDh8dFtnXX1pZigxNj09aClmb3IoQT0wO0E8YTtBKyspe2c9NipBO2NbQV09MjU1PDwyNHx0W2crNF08PDE2fHRbZysyXTw8OHx0W2ddfX1lbHNle3ZhciBwPWVbMF07Y29uc3Qgcj1lWzFdLGk9ZVsyXTtpZig4PT1oKWZvcihBPTA7QTxhO0ErKyl7dmFyIG09QTw8MjtnPTMqQTtjW0FdPTI1NTw8MjR8dFtnKzJdPDwxNnx0W2crMV08PDh8dFtnXSx0W2ddPT1wJiZ0W2crMV09PXImJnRbZysyXT09aSYmKGxbbSszXT0wKX1pZigxNj09aClmb3IoQT0wO0E8YTtBKyspe209QTw8MixnPTYqQTtjW0FdPTI1NTw8MjR8dFtnKzRdPDwxNnx0W2crMl08PDh8dFtnXSxkKHQsZyk9PXAmJmQodCxnKzIpPT1yJiZkKHQsZys0KT09aSYmKGxbbSszXT0wKX19fWVsc2UgaWYoMz09dSl7Y29uc3QgZT1vLnRhYnMuUExURSxzPW8udGFicy50Uk5TLGM9cz9zLmxlbmd0aDowO2lmKDE9PWgpZm9yKHZhciB3PTA7dzxpO3crKyl7dmFyIHY9dypmLGI9dypyO2ZvcihBPTA7QTxyO0ErKyl7bT1iK0E8PDI7dmFyIHk9MyooRT10W3YrKEE+PjMpXT4+Ny0oKDcmQSk8PDApJjEpO2xbbV09ZVt5XSxsW20rMV09ZVt5KzFdLGxbbSsyXT1lW3krMl0sbFttKzNdPUU8Yz9zW0VdOjI1NX19aWYoMj09aClmb3Iodz0wO3c8aTt3KyspZm9yKHY9dypmLGI9dypyLEE9MDtBPHI7QSsrKXttPWIrQTw8Mix5PTMqKEU9dFt2KyhBPj4yKV0+PjYtKCgzJkEpPDwxKSYzKTtsW21dPWVbeV0sbFttKzFdPWVbeSsxXSxsW20rMl09ZVt5KzJdLGxbbSszXT1FPGM/c1tFXToyNTV9aWYoND09aClmb3Iodz0wO3c8aTt3KyspZm9yKHY9dypmLGI9dypyLEE9MDtBPHI7QSsrKXttPWIrQTw8Mix5PTMqKEU9dFt2KyhBPj4xKV0+PjQtKCgxJkEpPDwyKSYxNSk7bFttXT1lW3ldLGxbbSsxXT1lW3krMV0sbFttKzJdPWVbeSsyXSxsW20rM109RTxjP3NbRV06MjU1fWlmKDg9PWgpZm9yKEE9MDtBPGE7QSsrKXt2YXIgRTttPUE8PDIseT0zKihFPXRbQV0pO2xbbV09ZVt5XSxsW20rMV09ZVt5KzFdLGxbbSsyXT1lW3krMl0sbFttKzNdPUU8Yz9zW0VdOjI1NX19ZWxzZSBpZig0PT11KXtpZig4PT1oKWZvcihBPTA7QTxhO0ErKyl7bT1BPDwyO3ZhciBGPXRbXz1BPDwxXTtsW21dPUYsbFttKzFdPUYsbFttKzJdPUYsbFttKzNdPXRbXysxXX1pZigxNj09aClmb3IoQT0wO0E8YTtBKyspe3ZhciBfO209QTw8MixGPXRbXz1BPDwyXTtsW21dPUYsbFttKzFdPUYsbFttKzJdPUYsbFttKzNdPXRbXysyXX19ZWxzZSBpZigwPT11KWZvcihwPW8udGFicy50Uk5TP28udGFicy50Uk5TOi0xLHc9MDt3PGk7dysrKXtjb25zdCBlPXcqZixpPXcqcjtpZigxPT1oKWZvcih2YXIgQj0wO0I8cjtCKyspe3ZhciBVPShGPTI1NSoodFtlKyhCPj4+MyldPj4+Ny0oNyZCKSYxKSk9PTI1NSpwPzA6MjU1O2NbaStCXT1VPDwyNHxGPDwxNnxGPDw4fEZ9ZWxzZSBpZigyPT1oKWZvcihCPTA7QjxyO0IrKyl7VT0oRj04NSoodFtlKyhCPj4+MildPj4+Ni0oKDMmQik8PDEpJjMpKT09ODUqcD8wOjI1NTtjW2krQl09VTw8MjR8Rjw8MTZ8Rjw8OHxGfWVsc2UgaWYoND09aClmb3IoQj0wO0I8cjtCKyspe1U9KEY9MTcqKHRbZSsoQj4+PjEpXT4+PjQtKCgxJkIpPDwyKSYxNSkpPT0xNypwPzA6MjU1O2NbaStCXT1VPDwyNHxGPDwxNnxGPDw4fEZ9ZWxzZSBpZig4PT1oKWZvcihCPTA7QjxyO0IrKyl7VT0oRj10W2UrQl0pPT1wPzA6MjU1O2NbaStCXT1VPDwyNHxGPDwxNnxGPDw4fEZ9ZWxzZSBpZigxNj09aClmb3IoQj0wO0I8cjtCKyspe0Y9dFtlKyhCPDwxKV0sVT1kKHQsZSsoQjw8MSkpPT1wPzA6MjU1O2NbaStCXT1VPDwyNHxGPDwxNnxGPDw4fEZ9fXJldHVybiBsfWZ1bmN0aW9uIF9kZWNvbXByZXNzKGUscixpLG8pe2NvbnN0IGE9X2dldEJQUChlKSxzPU1hdGguY2VpbChpKmEvOCksZj1uZXcgVWludDhBcnJheSgocysxK2UuaW50ZXJsYWNlKSpvKTtyZXR1cm4gcj1lLnRhYnMuQ2dCST90KHIsZik6X2luZmxhdGUocixmKSwwPT1lLmludGVybGFjZT9yPV9maWx0ZXJaZXJvKHIsZSwwLGksbyk6MT09ZS5pbnRlcmxhY2UmJihyPWZ1bmN0aW9uIF9yZWFkSW50ZXJsYWNlKGUsdCl7Y29uc3Qgcj10LndpZHRoLGk9dC5oZWlnaHQsbz1fZ2V0QlBQKHQpLGE9bz4+MyxzPU1hdGguY2VpbChyKm8vOCksZj1uZXcgVWludDhBcnJheShpKnMpO2xldCBsPTA7Y29uc3QgYz1bMCwwLDQsMCwyLDAsMV0sdT1bMCw0LDAsMiwwLDEsMF0saD1bOCw4LDgsNCw0LDIsMl0sZD1bOCw4LDQsNCwyLDIsMV07bGV0IEE9MDtmb3IoO0E8Nzspe2NvbnN0IHA9aFtBXSxtPWRbQV07bGV0IHc9MCx2PTAsYj1jW0FdO2Zvcig7YjxpOyliKz1wLHYrKztsZXQgeT11W0FdO2Zvcig7eTxyOyl5Kz1tLHcrKztjb25zdCBFPU1hdGguY2VpbCh3Km8vOCk7X2ZpbHRlclplcm8oZSx0LGwsdyx2KTtsZXQgRj0wLF89Y1tBXTtmb3IoO188aTspe2xldCB0PXVbQV0saT1sK0YqRTw8Mztmb3IoO3Q8cjspe3ZhciBnO2lmKDE9PW8pZz0oZz1lW2k+PjNdKT4+Ny0oNyZpKSYxLGZbXypzKyh0Pj4zKV18PWc8PDctKCg3JnQpPDwwKTtpZigyPT1vKWc9KGc9ZVtpPj4zXSk+PjYtKDcmaSkmMyxmW18qcysodD4+MildfD1nPDw2LSgoMyZ0KTw8MSk7aWYoND09bylnPShnPWVbaT4+M10pPj40LSg3JmkpJjE1LGZbXypzKyh0Pj4xKV18PWc8PDQtKCgxJnQpPDwyKTtpZihvPj04KXtjb25zdCByPV8qcyt0KmE7Zm9yKGxldCB0PTA7dDxhO3QrKylmW3IrdF09ZVsoaT4+MykrdF19aSs9byx0Kz1tfUYrKyxfKz1wfXcqdiE9MCYmKGwrPXYqKDErRSkpLEErPTF9cmV0dXJuIGZ9KHIsZSkpLHJ9ZnVuY3Rpb24gX2luZmxhdGUoZSxyKXtyZXR1cm4gdChuZXcgVWludDhBcnJheShlLmJ1ZmZlciwyLGUubGVuZ3RoLTYpLHIpfXZhciB0PWZ1bmN0aW9uKCl7Y29uc3QgZT17SDp7fX07cmV0dXJuIGUuSC5OPWZ1bmN0aW9uKHQscil7Y29uc3QgaT1VaW50OEFycmF5O2xldCBvLGEscz0wLGY9MCxsPTAsYz0wLHU9MCxoPTAsZD0wLEE9MCxnPTA7aWYoMz09dFswXSYmMD09dFsxXSlyZXR1cm4gcnx8bmV3IGkoMCk7Y29uc3QgcD1lLkgsbT1wLmIsdz1wLmUsdj1wLlIsYj1wLm4seT1wLkEsRT1wLlosRj1wLm0sXz1udWxsPT1yO2ZvcihfJiYocj1uZXcgaSh0Lmxlbmd0aD4+PjI8PDUpKTswPT1zOylpZihzPW0odCxnLDEpLGY9bSh0LGcrMSwyKSxnKz0zLDAhPWYpe2lmKF8mJihyPWUuSC5XKHIsQSsoMTw8MTcpKSksMT09ZiYmKG89Ri5KLGE9Ri5oLGg9NTExLGQ9MzEpLDI9PWYpe2w9dyh0LGcsNSkrMjU3LGM9dyh0LGcrNSw1KSsxLHU9dyh0LGcrMTAsNCkrNCxnKz0xNDtsZXQgZT0xO2Zvcih2YXIgQj0wO0I8Mzg7Qis9MilGLlFbQl09MCxGLlFbQisxXT0wO2ZvcihCPTA7Qjx1O0IrKyl7Y29uc3Qgcj13KHQsZyszKkIsMyk7Ri5RWzErKEYuWFtCXTw8MSldPXIscj5lJiYoZT1yKX1nKz0zKnUsYihGLlEsZSkseShGLlEsZSxGLnUpLG89Ri53LGE9Ri5kLGc9dihGLnUsKDE8PGUpLTEsbCtjLHQsZyxGLnYpO2NvbnN0IHI9cC5WKEYudiwwLGwsRi5DKTtoPSgxPDxyKS0xO2NvbnN0IGk9cC5WKEYudixsLGMsRi5EKTtkPSgxPDxpKS0xLGIoRi5DLHIpLHkoRi5DLHIsbyksYihGLkQsaSkseShGLkQsaSxhKX1mb3IoOzspe2NvbnN0IGU9b1tFKHQsZykmaF07Zys9MTUmZTtjb25zdCBpPWU+Pj40O2lmKGk+Pj44PT0wKXJbQSsrXT1pO2Vsc2V7aWYoMjU2PT1pKWJyZWFrO3tsZXQgZT1BK2ktMjU0O2lmKGk+MjY0KXtjb25zdCByPUYucVtpLTI1N107ZT1BKyhyPj4+Mykrdyh0LGcsNyZyKSxnKz03JnJ9Y29uc3Qgbz1hW0UodCxnKSZkXTtnKz0xNSZvO2NvbnN0IHM9bz4+PjQsZj1GLmNbc10sbD0oZj4+PjQpK20odCxnLDE1JmYpO2ZvcihnKz0xNSZmO0E8ZTspcltBXT1yW0ErKy1sXSxyW0FdPXJbQSsrLWxdLHJbQV09cltBKystbF0scltBXT1yW0ErKy1sXTtBPWV9fX19ZWxzZXswIT0oNyZnKSYmKGcrPTgtKDcmZykpO2NvbnN0IG89NCsoZz4+PjMpLGE9dFtvLTRdfHRbby0zXTw8ODtfJiYocj1lLkguVyhyLEErYSkpLHIuc2V0KG5ldyBpKHQuYnVmZmVyLHQuYnl0ZU9mZnNldCtvLGEpLEEpLGc9bythPDwzLEErPWF9cmV0dXJuIHIubGVuZ3RoPT1BP3I6ci5zbGljZSgwLEEpfSxlLkguVz1mdW5jdGlvbihlLHQpe2NvbnN0IHI9ZS5sZW5ndGg7aWYodDw9cilyZXR1cm4gZTtjb25zdCBpPW5ldyBVaW50OEFycmF5KHI8PDEpO3JldHVybiBpLnNldChlLDApLGl9LGUuSC5SPWZ1bmN0aW9uKHQscixpLG8sYSxzKXtjb25zdCBmPWUuSC5lLGw9ZS5ILlo7bGV0IGM9MDtmb3IoO2M8aTspe2NvbnN0IGU9dFtsKG8sYSkmcl07YSs9MTUmZTtjb25zdCBpPWU+Pj40O2lmKGk8PTE1KXNbY109aSxjKys7ZWxzZXtsZXQgZT0wLHQ9MDsxNj09aT8odD0zK2YobyxhLDIpLGErPTIsZT1zW2MtMV0pOjE3PT1pPyh0PTMrZihvLGEsMyksYSs9Myk6MTg9PWkmJih0PTExK2YobyxhLDcpLGErPTcpO2NvbnN0IHI9Yyt0O2Zvcig7YzxyOylzW2NdPWUsYysrfX1yZXR1cm4gYX0sZS5ILlY9ZnVuY3Rpb24oZSx0LHIsaSl7bGV0IG89MCxhPTA7Y29uc3Qgcz1pLmxlbmd0aD4+PjE7Zm9yKDthPHI7KXtjb25zdCByPWVbYSt0XTtpW2E8PDFdPTAsaVsxKyhhPDwxKV09cixyPm8mJihvPXIpLGErK31mb3IoO2E8czspaVthPDwxXT0wLGlbMSsoYTw8MSldPTAsYSsrO3JldHVybiBvfSxlLkgubj1mdW5jdGlvbih0LHIpe2NvbnN0IGk9ZS5ILm0sbz10Lmxlbmd0aDtsZXQgYSxzLGY7bGV0IGw7Y29uc3QgYz1pLmo7Zm9yKHZhciB1PTA7dTw9cjt1KyspY1t1XT0wO2Zvcih1PTE7dTxvO3UrPTIpY1t0W3VdXSsrO2NvbnN0IGg9aS5LO2ZvcihhPTAsY1swXT0wLHM9MTtzPD1yO3MrKylhPWErY1tzLTFdPDwxLGhbc109YTtmb3IoZj0wO2Y8bztmKz0yKWw9dFtmKzFdLDAhPWwmJih0W2ZdPWhbbF0saFtsXSsrKX0sZS5ILkE9ZnVuY3Rpb24odCxyLGkpe2NvbnN0IG89dC5sZW5ndGgsYT1lLkgubS5yO2ZvcihsZXQgZT0wO2U8bztlKz0yKWlmKDAhPXRbZSsxXSl7Y29uc3Qgbz1lPj4xLHM9dFtlKzFdLGY9bzw8NHxzLGw9ci1zO2xldCBjPXRbZV08PGw7Y29uc3QgdT1jKygxPDxsKTtmb3IoO2MhPXU7KXtpW2FbY10+Pj4xNS1yXT1mLGMrK319fSxlLkgubD1mdW5jdGlvbih0LHIpe2NvbnN0IGk9ZS5ILm0ucixvPTE1LXI7Zm9yKGxldCBlPTA7ZTx0Lmxlbmd0aDtlKz0yKXtjb25zdCBhPXRbZV08PHItdFtlKzFdO3RbZV09aVthXT4+Pm99fSxlLkguTT1mdW5jdGlvbihlLHQscil7cjw8PTcmdDtjb25zdCBpPXQ+Pj4zO2VbaV18PXIsZVtpKzFdfD1yPj4+OH0sZS5ILkk9ZnVuY3Rpb24oZSx0LHIpe3I8PD03JnQ7Y29uc3QgaT10Pj4+MztlW2ldfD1yLGVbaSsxXXw9cj4+PjgsZVtpKzJdfD1yPj4+MTZ9LGUuSC5lPWZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4KT4+Pig3JnQpJigxPDxyKS0xfSxlLkguYj1mdW5jdGlvbihlLHQscil7cmV0dXJuKGVbdD4+PjNdfGVbMSsodD4+PjMpXTw8OHxlWzIrKHQ+Pj4zKV08PDE2KT4+Pig3JnQpJigxPDxyKS0xfSxlLkguWj1mdW5jdGlvbihlLHQpe3JldHVybihlW3Q+Pj4zXXxlWzErKHQ+Pj4zKV08PDh8ZVsyKyh0Pj4+MyldPDwxNik+Pj4oNyZ0KX0sZS5ILmk9ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZVt0Pj4+M118ZVsxKyh0Pj4+MyldPDw4fGVbMisodD4+PjMpXTw8MTZ8ZVszKyh0Pj4+MyldPDwyNCk+Pj4oNyZ0KX0sZS5ILm09ZnVuY3Rpb24oKXtjb25zdCBlPVVpbnQxNkFycmF5LHQ9VWludDMyQXJyYXk7cmV0dXJue0s6bmV3IGUoMTYpLGo6bmV3IGUoMTYpLFg6WzE2LDE3LDE4LDAsOCw3LDksNiwxMCw1LDExLDQsMTIsMywxMywyLDE0LDEsMTVdLFM6WzMsNCw1LDYsNyw4LDksMTAsMTEsMTMsMTUsMTcsMTksMjMsMjcsMzEsMzUsNDMsNTEsNTksNjcsODMsOTksMTE1LDEzMSwxNjMsMTk1LDIyNywyNTgsOTk5LDk5OSw5OTldLFQ6WzAsMCwwLDAsMCwwLDAsMCwxLDEsMSwxLDIsMiwyLDIsMywzLDMsMyw0LDQsNCw0LDUsNSw1LDUsMCwwLDAsMF0scTpuZXcgZSgzMikscDpbMSwyLDMsNCw1LDcsOSwxMywxNywyNSwzMyw0OSw2NSw5NywxMjksMTkzLDI1NywzODUsNTEzLDc2OSwxMDI1LDE1MzcsMjA0OSwzMDczLDQwOTcsNjE0NSw4MTkzLDEyMjg5LDE2Mzg1LDI0NTc3LDY1NTM1LDY1NTM1XSx6OlswLDAsMCwwLDEsMSwyLDIsMywzLDQsNCw1LDUsNiw2LDcsNyw4LDgsOSw5LDEwLDEwLDExLDExLDEyLDEyLDEzLDEzLDAsMF0sYzpuZXcgdCgzMiksSjpuZXcgZSg1MTIpLF86W10saDpuZXcgZSgzMiksJDpbXSx3Om5ldyBlKDMyNzY4KSxDOltdLHY6W10sZDpuZXcgZSgzMjc2OCksRDpbXSx1Om5ldyBlKDUxMiksUTpbXSxyOm5ldyBlKDMyNzY4KSxzOm5ldyB0KDI4NiksWTpuZXcgdCgzMCksYTpuZXcgdCgxOSksdDpuZXcgdCgxNWUzKSxrOm5ldyBlKDY1NTM2KSxnOm5ldyBlKDMyNzY4KX19KCksZnVuY3Rpb24oKXtjb25zdCB0PWUuSC5tO2Zvcih2YXIgcj0wO3I8MzI3Njg7cisrKXtsZXQgZT1yO2U9KDI4NjMzMTE1MzAmZSk+Pj4xfCgxNDMxNjU1NzY1JmUpPDwxLGU9KDM0MzU5NzM4MzYmZSk+Pj4yfCg4NTg5OTM0NTkmZSk8PDIsZT0oNDA0MjMyMjE2MCZlKT4+PjR8KDI1MjY0NTEzNSZlKTw8NCxlPSg0Mjc4MjU1MzYwJmUpPj4+OHwoMTY3MTE5MzUmZSk8PDgsdC5yW3JdPShlPj4+MTZ8ZTw8MTYpPj4+MTd9ZnVuY3Rpb24gbihlLHQscil7Zm9yKDswIT10LS07KWUucHVzaCgwLHIpfWZvcihyPTA7cjwzMjtyKyspdC5xW3JdPXQuU1tyXTw8M3x0LlRbcl0sdC5jW3JdPXQucFtyXTw8NHx0Lnpbcl07bih0Ll8sMTQ0LDgpLG4odC5fLDExMiw5KSxuKHQuXywyNCw3KSxuKHQuXyw4LDgpLGUuSC5uKHQuXyw5KSxlLkguQSh0Ll8sOSx0LkopLGUuSC5sKHQuXyw5KSxuKHQuJCwzMiw1KSxlLkgubih0LiQsNSksZS5ILkEodC4kLDUsdC5oKSxlLkgubCh0LiQsNSksbih0LlEsMTksMCksbih0LkMsMjg2LDApLG4odC5ELDMwLDApLG4odC52LDMyMCwwKX0oKSxlLkguTn0oKTtmdW5jdGlvbiBfZ2V0QlBQKGUpe3JldHVyblsxLG51bGwsMywxLDIsbnVsbCw0XVtlLmN0eXBlXSplLmRlcHRofWZ1bmN0aW9uIF9maWx0ZXJaZXJvKGUsdCxyLGksbyl7bGV0IGE9X2dldEJQUCh0KTtjb25zdCBzPU1hdGguY2VpbChpKmEvOCk7bGV0IGYsbDthPU1hdGguY2VpbChhLzgpO2xldCBjPWVbcl0sdT0wO2lmKGM+MSYmKGVbcl09WzAsMCwxXVtjLTJdKSwzPT1jKWZvcih1PWE7dTxzO3UrKyllW3UrMV09ZVt1KzFdKyhlW3UrMS1hXT4+PjEpJjI1NTtmb3IobGV0IHQ9MDt0PG87dCsrKWlmKGY9cit0KnMsbD1mK3QrMSxjPWVbbC0xXSx1PTAsMD09Yylmb3IoO3U8czt1KyspZVtmK3VdPWVbbCt1XTtlbHNlIGlmKDE9PWMpe2Zvcig7dTxhO3UrKyllW2YrdV09ZVtsK3VdO2Zvcig7dTxzO3UrKyllW2YrdV09ZVtsK3VdK2VbZit1LWFdfWVsc2UgaWYoMj09Yylmb3IoO3U8czt1KyspZVtmK3VdPWVbbCt1XStlW2YrdS1zXTtlbHNlIGlmKDM9PWMpe2Zvcig7dTxhO3UrKyllW2YrdV09ZVtsK3VdKyhlW2YrdS1zXT4+PjEpO2Zvcig7dTxzO3UrKyllW2YrdV09ZVtsK3VdKyhlW2YrdS1zXStlW2YrdS1hXT4+PjEpfWVsc2V7Zm9yKDt1PGE7dSsrKWVbZit1XT1lW2wrdV0rX3BhZXRoKDAsZVtmK3Utc10sMCk7Zm9yKDt1PHM7dSsrKWVbZit1XT1lW2wrdV0rX3BhZXRoKGVbZit1LWFdLGVbZit1LXNdLGVbZit1LWEtc10pfXJldHVybiBlfWZ1bmN0aW9uIF9wYWV0aChlLHQscil7Y29uc3QgaT1lK3QtcixvPWktZSxhPWktdCxzPWktcjtyZXR1cm4gbypvPD1hKmEmJm8qbzw9cypzP2U6YSphPD1zKnM/dDpyfWZ1bmN0aW9uIF9JSERSKHQscixpKXtpLndpZHRoPWUucmVhZFVpbnQodCxyKSxyKz00LGkuaGVpZ2h0PWUucmVhZFVpbnQodCxyKSxyKz00LGkuZGVwdGg9dFtyXSxyKyssaS5jdHlwZT10W3JdLHIrKyxpLmNvbXByZXNzPXRbcl0scisrLGkuZmlsdGVyPXRbcl0scisrLGkuaW50ZXJsYWNlPXRbcl0scisrfWZ1bmN0aW9uIF9jb3B5VGlsZShlLHQscixpLG8sYSxzLGYsbCl7Y29uc3QgYz1NYXRoLm1pbih0LG8pLHU9TWF0aC5taW4ocixhKTtsZXQgaD0wLGQ9MDtmb3IobGV0IHI9MDtyPHU7cisrKWZvcihsZXQgYT0wO2E8YzthKyspaWYocz49MCYmZj49MD8oaD1yKnQrYTw8MixkPShmK3IpKm8rcythPDwyKTooaD0oLWYrcikqdC1zK2E8PDIsZD1yKm8rYTw8MiksMD09bClpW2RdPWVbaF0saVtkKzFdPWVbaCsxXSxpW2QrMl09ZVtoKzJdLGlbZCszXT1lW2grM107ZWxzZSBpZigxPT1sKXt2YXIgQT1lW2grM10qKDEvMjU1KSxnPWVbaF0qQSxwPWVbaCsxXSpBLG09ZVtoKzJdKkEsdz1pW2QrM10qKDEvMjU1KSx2PWlbZF0qdyxiPWlbZCsxXSp3LHk9aVtkKzJdKnc7Y29uc3QgdD0xLUEscj1BK3cqdCxvPTA9PXI/MDoxL3I7aVtkKzNdPTI1NSpyLGlbZCswXT0oZyt2KnQpKm8saVtkKzFdPShwK2IqdCkqbyxpW2QrMl09KG0reSp0KSpvfWVsc2UgaWYoMj09bCl7QT1lW2grM10sZz1lW2hdLHA9ZVtoKzFdLG09ZVtoKzJdLHc9aVtkKzNdLHY9aVtkXSxiPWlbZCsxXSx5PWlbZCsyXTtBPT13JiZnPT12JiZwPT1iJiZtPT15PyhpW2RdPTAsaVtkKzFdPTAsaVtkKzJdPTAsaVtkKzNdPTApOihpW2RdPWcsaVtkKzFdPXAsaVtkKzJdPW0saVtkKzNdPUEpfWVsc2UgaWYoMz09bCl7QT1lW2grM10sZz1lW2hdLHA9ZVtoKzFdLG09ZVtoKzJdLHc9aVtkKzNdLHY9aVtkXSxiPWlbZCsxXSx5PWlbZCsyXTtpZihBPT13JiZnPT12JiZwPT1iJiZtPT15KWNvbnRpbnVlO2lmKEE8MjIwJiZ3PjIwKXJldHVybiExfXJldHVybiEwfXJldHVybntkZWNvZGU6ZnVuY3Rpb24gZGVjb2RlKHIpe2NvbnN0IGk9bmV3IFVpbnQ4QXJyYXkocik7bGV0IG89ODtjb25zdCBhPWUscz1hLnJlYWRVc2hvcnQsZj1hLnJlYWRVaW50LGw9e3RhYnM6e30sZnJhbWVzOltdfSxjPW5ldyBVaW50OEFycmF5KGkubGVuZ3RoKTtsZXQgdSxoPTAsZD0wO2NvbnN0IEE9WzEzNyw4MCw3OCw3MSwxMywxMCwyNiwxMF07Zm9yKHZhciBnPTA7Zzw4O2crKylpZihpW2ddIT1BW2ddKXRocm93XCJUaGUgaW5wdXQgaXMgbm90IGEgUE5HIGZpbGUhXCI7Zm9yKDtvPGkubGVuZ3RoOyl7Y29uc3QgZT1hLnJlYWRVaW50KGksbyk7bys9NDtjb25zdCByPWEucmVhZEFTQ0lJKGksbyw0KTtpZihvKz00LFwiSUhEUlwiPT1yKV9JSERSKGksbyxsKTtlbHNlIGlmKFwiaUNDUFwiPT1yKXtmb3IodmFyIHA9bzswIT1pW3BdOylwKys7YS5yZWFkQVNDSUkoaSxvLHAtbyksaVtwKzFdO2NvbnN0IHM9aS5zbGljZShwKzIsbytlKTtsZXQgZj1udWxsO3RyeXtmPV9pbmZsYXRlKHMpfWNhdGNoKGUpe2Y9dChzKX1sLnRhYnNbcl09Zn1lbHNlIGlmKFwiQ2dCSVwiPT1yKWwudGFic1tyXT1pLnNsaWNlKG8sbys0KTtlbHNlIGlmKFwiSURBVFwiPT1yKXtmb3IoZz0wO2c8ZTtnKyspY1toK2ddPWlbbytnXTtoKz1lfWVsc2UgaWYoXCJhY1RMXCI9PXIpbC50YWJzW3JdPXtudW1fZnJhbWVzOmYoaSxvKSxudW1fcGxheXM6ZihpLG8rNCl9LHU9bmV3IFVpbnQ4QXJyYXkoaS5sZW5ndGgpO2Vsc2UgaWYoXCJmY1RMXCI9PXIpe2lmKDAhPWQpKEU9bC5mcmFtZXNbbC5mcmFtZXMubGVuZ3RoLTFdKS5kYXRhPV9kZWNvbXByZXNzKGwsdS5zbGljZSgwLGQpLEUucmVjdC53aWR0aCxFLnJlY3QuaGVpZ2h0KSxkPTA7Y29uc3QgZT17eDpmKGksbysxMikseTpmKGksbysxNiksd2lkdGg6ZihpLG8rNCksaGVpZ2h0OmYoaSxvKzgpfTtsZXQgdD1zKGksbysyMik7dD1zKGksbysyMCkvKDA9PXQ/MTAwOnQpO2NvbnN0IHI9e3JlY3Q6ZSxkZWxheTpNYXRoLnJvdW5kKDFlMyp0KSxkaXNwb3NlOmlbbysyNF0sYmxlbmQ6aVtvKzI1XX07bC5mcmFtZXMucHVzaChyKX1lbHNlIGlmKFwiZmRBVFwiPT1yKXtmb3IoZz0wO2c8ZS00O2crKyl1W2QrZ109aVtvK2crNF07ZCs9ZS00fWVsc2UgaWYoXCJwSFlzXCI9PXIpbC50YWJzW3JdPVthLnJlYWRVaW50KGksbyksYS5yZWFkVWludChpLG8rNCksaVtvKzhdXTtlbHNlIGlmKFwiY0hSTVwiPT1yKXtsLnRhYnNbcl09W107Zm9yKGc9MDtnPDg7ZysrKWwudGFic1tyXS5wdXNoKGEucmVhZFVpbnQoaSxvKzQqZykpfWVsc2UgaWYoXCJ0RVh0XCI9PXJ8fFwielRYdFwiPT1yKXtudWxsPT1sLnRhYnNbcl0mJihsLnRhYnNbcl09e30pO3ZhciBtPWEubmV4dFplcm8oaSxvKSx3PWEucmVhZEFTQ0lJKGksbyxtLW8pLHY9bytlLW0tMTtpZihcInRFWHRcIj09cil5PWEucmVhZEFTQ0lJKGksbSsxLHYpO2Vsc2V7dmFyIGI9X2luZmxhdGUoaS5zbGljZShtKzIsbSsyK3YpKTt5PWEucmVhZFVURjgoYiwwLGIubGVuZ3RoKX1sLnRhYnNbcl1bd109eX1lbHNlIGlmKFwiaVRYdFwiPT1yKXtudWxsPT1sLnRhYnNbcl0mJihsLnRhYnNbcl09e30pO209MCxwPW87bT1hLm5leHRaZXJvKGkscCk7dz1hLnJlYWRBU0NJSShpLHAsbS1wKTtjb25zdCB0PWlbcD1tKzFdO3ZhciB5O2lbcCsxXSxwKz0yLG09YS5uZXh0WmVybyhpLHApLGEucmVhZEFTQ0lJKGkscCxtLXApLHA9bSsxLG09YS5uZXh0WmVybyhpLHApLGEucmVhZFVURjgoaSxwLG0tcCk7dj1lLSgocD1tKzEpLW8pO2lmKDA9PXQpeT1hLnJlYWRVVEY4KGkscCx2KTtlbHNle2I9X2luZmxhdGUoaS5zbGljZShwLHArdikpO3k9YS5yZWFkVVRGOChiLDAsYi5sZW5ndGgpfWwudGFic1tyXVt3XT15fWVsc2UgaWYoXCJQTFRFXCI9PXIpbC50YWJzW3JdPWEucmVhZEJ5dGVzKGksbyxlKTtlbHNlIGlmKFwiaElTVFwiPT1yKXtjb25zdCBlPWwudGFicy5QTFRFLmxlbmd0aC8zO2wudGFic1tyXT1bXTtmb3IoZz0wO2c8ZTtnKyspbC50YWJzW3JdLnB1c2gocyhpLG8rMipnKSl9ZWxzZSBpZihcInRSTlNcIj09cikzPT1sLmN0eXBlP2wudGFic1tyXT1hLnJlYWRCeXRlcyhpLG8sZSk6MD09bC5jdHlwZT9sLnRhYnNbcl09cyhpLG8pOjI9PWwuY3R5cGUmJihsLnRhYnNbcl09W3MoaSxvKSxzKGksbysyKSxzKGksbys0KV0pO2Vsc2UgaWYoXCJnQU1BXCI9PXIpbC50YWJzW3JdPWEucmVhZFVpbnQoaSxvKS8xZTU7ZWxzZSBpZihcInNSR0JcIj09cilsLnRhYnNbcl09aVtvXTtlbHNlIGlmKFwiYktHRFwiPT1yKTA9PWwuY3R5cGV8fDQ9PWwuY3R5cGU/bC50YWJzW3JdPVtzKGksbyldOjI9PWwuY3R5cGV8fDY9PWwuY3R5cGU/bC50YWJzW3JdPVtzKGksbykscyhpLG8rMikscyhpLG8rNCldOjM9PWwuY3R5cGUmJihsLnRhYnNbcl09aVtvXSk7ZWxzZSBpZihcIklFTkRcIj09cilicmVhaztvKz1lLGEucmVhZFVpbnQoaSxvKSxvKz00fXZhciBFO3JldHVybiAwIT1kJiYoKEU9bC5mcmFtZXNbbC5mcmFtZXMubGVuZ3RoLTFdKS5kYXRhPV9kZWNvbXByZXNzKGwsdS5zbGljZSgwLGQpLEUucmVjdC53aWR0aCxFLnJlY3QuaGVpZ2h0KSksbC5kYXRhPV9kZWNvbXByZXNzKGwsYyxsLndpZHRoLGwuaGVpZ2h0KSxkZWxldGUgbC5jb21wcmVzcyxkZWxldGUgbC5pbnRlcmxhY2UsZGVsZXRlIGwuZmlsdGVyLGx9LHRvUkdCQTg6ZnVuY3Rpb24gdG9SR0JBOChlKXtjb25zdCB0PWUud2lkdGgscj1lLmhlaWdodDtpZihudWxsPT1lLnRhYnMuYWNUTClyZXR1cm5bZGVjb2RlSW1hZ2UoZS5kYXRhLHQscixlKS5idWZmZXJdO2NvbnN0IGk9W107bnVsbD09ZS5mcmFtZXNbMF0uZGF0YSYmKGUuZnJhbWVzWzBdLmRhdGE9ZS5kYXRhKTtjb25zdCBvPXQqcio0LGE9bmV3IFVpbnQ4QXJyYXkobykscz1uZXcgVWludDhBcnJheShvKSxmPW5ldyBVaW50OEFycmF5KG8pO2ZvcihsZXQgYz0wO2M8ZS5mcmFtZXMubGVuZ3RoO2MrKyl7Y29uc3QgdT1lLmZyYW1lc1tjXSxoPXUucmVjdC54LGQ9dS5yZWN0LnksQT11LnJlY3Qud2lkdGgsZz11LnJlY3QuaGVpZ2h0LHA9ZGVjb2RlSW1hZ2UodS5kYXRhLEEsZyxlKTtpZigwIT1jKWZvcih2YXIgbD0wO2w8bztsKyspZltsXT1hW2xdO2lmKDA9PXUuYmxlbmQ/X2NvcHlUaWxlKHAsQSxnLGEsdCxyLGgsZCwwKToxPT11LmJsZW5kJiZfY29weVRpbGUocCxBLGcsYSx0LHIsaCxkLDEpLGkucHVzaChhLmJ1ZmZlci5zbGljZSgwKSksMD09dS5kaXNwb3NlKTtlbHNlIGlmKDE9PXUuZGlzcG9zZSlfY29weVRpbGUocyxBLGcsYSx0LHIsaCxkLDApO2Vsc2UgaWYoMj09dS5kaXNwb3NlKWZvcihsPTA7bDxvO2wrKylhW2xdPWZbbF19cmV0dXJuIGl9LF9wYWV0aDpfcGFldGgsX2NvcHlUaWxlOl9jb3B5VGlsZSxfYmluOmV9fSgpOyFmdW5jdGlvbigpe2NvbnN0e19jb3B5VGlsZTplfT1VUE5HLHtfYmluOnR9PVVQTkcscj1VUE5HLl9wYWV0aDt2YXIgaT17dGFibGU6ZnVuY3Rpb24oKXtjb25zdCBlPW5ldyBVaW50MzJBcnJheSgyNTYpO2ZvcihsZXQgdD0wO3Q8MjU2O3QrKyl7bGV0IHI9dDtmb3IobGV0IGU9MDtlPDg7ZSsrKTEmcj9yPTM5ODgyOTIzODRecj4+PjE6cj4+Pj0xO2VbdF09cn1yZXR1cm4gZX0oKSx1cGRhdGUoZSx0LHIsbyl7Zm9yKGxldCBhPTA7YTxvO2ErKyllPWkudGFibGVbMjU1JihlXnRbcithXSldXmU+Pj44O3JldHVybiBlfSxjcmM6KGUsdCxyKT0+NDI5NDk2NzI5NV5pLnVwZGF0ZSg0Mjk0OTY3Mjk1LGUsdCxyKX07ZnVuY3Rpb24gYWRkRXJyKGUsdCxyLGkpe3Rbcl0rPWVbMF0qaT4+NCx0W3IrMV0rPWVbMV0qaT4+NCx0W3IrMl0rPWVbMl0qaT4+NCx0W3IrM10rPWVbM10qaT4+NH1mdW5jdGlvbiBOKGUpe3JldHVybiBNYXRoLm1heCgwLE1hdGgubWluKDI1NSxlKSl9ZnVuY3Rpb24gRChlLHQpe2NvbnN0IHI9ZVswXS10WzBdLGk9ZVsxXS10WzFdLG89ZVsyXS10WzJdLGE9ZVszXS10WzNdO3JldHVybiByKnIraSppK28qbythKmF9ZnVuY3Rpb24gZGl0aGVyKGUsdCxyLGksbyxhLHMpe251bGw9PXMmJihzPTEpO2NvbnN0IGY9aS5sZW5ndGgsbD1bXTtmb3IodmFyIGM9MDtjPGY7YysrKXtjb25zdCBlPWlbY107bC5wdXNoKFtlPj4+MCYyNTUsZT4+PjgmMjU1LGU+Pj4xNiYyNTUsZT4+PjI0JjI1NV0pfWZvcihjPTA7YzxmO2MrKyl7bGV0IGU9NDI5NDk2NzI5NTtmb3IodmFyIHU9MCxoPTA7aDxmO2grKyl7dmFyIGQ9RChsW2NdLGxbaF0pO2ghPWMmJmQ8ZSYmKGU9ZCx1PWgpfX1jb25zdCBBPW5ldyBVaW50MzJBcnJheShvLmJ1ZmZlciksZz1uZXcgSW50MTZBcnJheSh0KnIqNCkscD1bMCw4LDIsMTAsMTIsNCwxNCw2LDMsMTEsMSw5LDE1LDcsMTMsNV07Zm9yKGM9MDtjPHAubGVuZ3RoO2MrKylwW2NdPTI1NSooKHBbY10rLjUpLzE2LS41KTtmb3IobGV0IG89MDtvPHI7bysrKWZvcihsZXQgdz0wO3c8dDt3Kyspe3ZhciBtO2M9NCoobyp0K3cpO2lmKDIhPXMpbT1bTihlW2NdK2dbY10pLE4oZVtjKzFdK2dbYysxXSksTihlW2MrMl0rZ1tjKzJdKSxOKGVbYyszXStnW2MrM10pXTtlbHNle2Q9cFs0KigzJm8pKygzJncpXTttPVtOKGVbY10rZCksTihlW2MrMV0rZCksTihlW2MrMl0rZCksTihlW2MrM10rZCldfXU9MDtsZXQgdj0xNjc3NzIxNTtmb3IoaD0wO2g8ZjtoKyspe2NvbnN0IGU9RChtLGxbaF0pO2U8diYmKHY9ZSx1PWgpfWNvbnN0IGI9bFt1XSx5PVttWzBdLWJbMF0sbVsxXS1iWzFdLG1bMl0tYlsyXSxtWzNdLWJbM11dOzE9PXMmJih3IT10LTEmJmFkZEVycih5LGcsYys0LDcpLG8hPXItMSYmKDAhPXcmJmFkZEVycih5LGcsYys0KnQtNCwzKSxhZGRFcnIoeSxnLGMrNCp0LDUpLHchPXQtMSYmYWRkRXJyKHksZyxjKzQqdCs0LDEpKSksYVtjPj4yXT11LEFbYz4+Ml09aVt1XX19ZnVuY3Rpb24gX21haW4oZSxyLG8sYSxzKXtudWxsPT1zJiYocz17fSk7Y29uc3R7Y3JjOmZ9PWksbD10LndyaXRlVWludCxjPXQud3JpdGVVc2hvcnQsdT10LndyaXRlQVNDSUk7bGV0IGg9ODtjb25zdCBkPWUuZnJhbWVzLmxlbmd0aD4xO2xldCBBLGc9ITEscD0zMysoZD8yMDowKTtpZihudWxsIT1zLnNSR0ImJihwKz0xMyksbnVsbCE9cy5wSFlzJiYocCs9MjEpLG51bGwhPXMuaUNDUCYmKEE9cGFrby5kZWZsYXRlKHMuaUNDUCkscCs9MjErQS5sZW5ndGgrNCksMz09ZS5jdHlwZSl7Zm9yKHZhciBtPWUucGx0ZS5sZW5ndGgsdz0wO3c8bTt3KyspZS5wbHRlW3ddPj4+MjQhPTI1NSYmKGc9ITApO3ArPTgrMyptKzQrKGc/OCsxKm0rNDowKX1mb3IodmFyIHY9MDt2PGUuZnJhbWVzLmxlbmd0aDt2Kyspe2QmJihwKz0zOCkscCs9KEY9ZS5mcmFtZXNbdl0pLmNpbWcubGVuZ3RoKzEyLDAhPXYmJihwKz00KX1wKz0xMjtjb25zdCBiPW5ldyBVaW50OEFycmF5KHApLHk9WzEzNyw4MCw3OCw3MSwxMywxMCwyNiwxMF07Zm9yKHc9MDt3PDg7dysrKWJbd109eVt3XTtpZihsKGIsaCwxMyksaCs9NCx1KGIsaCxcIklIRFJcIiksaCs9NCxsKGIsaCxyKSxoKz00LGwoYixoLG8pLGgrPTQsYltoXT1lLmRlcHRoLGgrKyxiW2hdPWUuY3R5cGUsaCsrLGJbaF09MCxoKyssYltoXT0wLGgrKyxiW2hdPTAsaCsrLGwoYixoLGYoYixoLTE3LDE3KSksaCs9NCxudWxsIT1zLnNSR0ImJihsKGIsaCwxKSxoKz00LHUoYixoLFwic1JHQlwiKSxoKz00LGJbaF09cy5zUkdCLGgrKyxsKGIsaCxmKGIsaC01LDUpKSxoKz00KSxudWxsIT1zLmlDQ1Ape2NvbnN0IGU9MTMrQS5sZW5ndGg7bChiLGgsZSksaCs9NCx1KGIsaCxcImlDQ1BcIiksaCs9NCx1KGIsaCxcIklDQyBwcm9maWxlXCIpLGgrPTExLGgrPTIsYi5zZXQoQSxoKSxoKz1BLmxlbmd0aCxsKGIsaCxmKGIsaC0oZSs0KSxlKzQpKSxoKz00fWlmKG51bGwhPXMucEhZcyYmKGwoYixoLDkpLGgrPTQsdShiLGgsXCJwSFlzXCIpLGgrPTQsbChiLGgscy5wSFlzWzBdKSxoKz00LGwoYixoLHMucEhZc1sxXSksaCs9NCxiW2hdPXMucEhZc1syXSxoKyssbChiLGgsZihiLGgtMTMsMTMpKSxoKz00KSxkJiYobChiLGgsOCksaCs9NCx1KGIsaCxcImFjVExcIiksaCs9NCxsKGIsaCxlLmZyYW1lcy5sZW5ndGgpLGgrPTQsbChiLGgsbnVsbCE9cy5sb29wP3MubG9vcDowKSxoKz00LGwoYixoLGYoYixoLTEyLDEyKSksaCs9NCksMz09ZS5jdHlwZSl7bChiLGgsMyoobT1lLnBsdGUubGVuZ3RoKSksaCs9NCx1KGIsaCxcIlBMVEVcIiksaCs9NDtmb3Iodz0wO3c8bTt3Kyspe2NvbnN0IHQ9Myp3LHI9ZS5wbHRlW3ddLGk9MjU1JnIsbz1yPj4+OCYyNTUsYT1yPj4+MTYmMjU1O2JbaCt0KzBdPWksYltoK3QrMV09byxiW2grdCsyXT1hfWlmKGgrPTMqbSxsKGIsaCxmKGIsaC0zKm0tNCwzKm0rNCkpLGgrPTQsZyl7bChiLGgsbSksaCs9NCx1KGIsaCxcInRSTlNcIiksaCs9NDtmb3Iodz0wO3c8bTt3KyspYltoK3ddPWUucGx0ZVt3XT4+PjI0JjI1NTtoKz1tLGwoYixoLGYoYixoLW0tNCxtKzQpKSxoKz00fX1sZXQgRT0wO2Zvcih2PTA7djxlLmZyYW1lcy5sZW5ndGg7disrKXt2YXIgRj1lLmZyYW1lc1t2XTtkJiYobChiLGgsMjYpLGgrPTQsdShiLGgsXCJmY1RMXCIpLGgrPTQsbChiLGgsRSsrKSxoKz00LGwoYixoLEYucmVjdC53aWR0aCksaCs9NCxsKGIsaCxGLnJlY3QuaGVpZ2h0KSxoKz00LGwoYixoLEYucmVjdC54KSxoKz00LGwoYixoLEYucmVjdC55KSxoKz00LGMoYixoLGFbdl0pLGgrPTIsYyhiLGgsMWUzKSxoKz0yLGJbaF09Ri5kaXNwb3NlLGgrKyxiW2hdPUYuYmxlbmQsaCsrLGwoYixoLGYoYixoLTMwLDMwKSksaCs9NCk7Y29uc3QgdD1GLmNpbWc7bChiLGgsKG09dC5sZW5ndGgpKygwPT12PzA6NCkpLGgrPTQ7Y29uc3Qgcj1oO3UoYixoLDA9PXY/XCJJREFUXCI6XCJmZEFUXCIpLGgrPTQsMCE9diYmKGwoYixoLEUrKyksaCs9NCksYi5zZXQodCxoKSxoKz1tLGwoYixoLGYoYixyLGgtcikpLGgrPTR9cmV0dXJuIGwoYixoLDApLGgrPTQsdShiLGgsXCJJRU5EXCIpLGgrPTQsbChiLGgsZihiLGgtNCw0KSksaCs9NCxiLmJ1ZmZlcn1mdW5jdGlvbiBjb21wcmVzc1BORyhlLHQscil7Zm9yKGxldCBpPTA7aTxlLmZyYW1lcy5sZW5ndGg7aSsrKXtjb25zdCBvPWUuZnJhbWVzW2ldO28ucmVjdC53aWR0aDtjb25zdCBhPW8ucmVjdC5oZWlnaHQscz1uZXcgVWludDhBcnJheShhKm8uYnBsK2EpO28uY2ltZz1fZmlsdGVyWmVybyhvLmltZyxhLG8uYnBwLG8uYnBsLHMsdCxyKX19ZnVuY3Rpb24gY29tcHJlc3ModCxyLGksbyxhKXtjb25zdCBzPWFbMF0sZj1hWzFdLGw9YVsyXSxjPWFbM10sdT1hWzRdLGg9YVs1XTtsZXQgZD02LEE9OCxnPTI1NTtmb3IodmFyIHA9MDtwPHQubGVuZ3RoO3ArKyl7Y29uc3QgZT1uZXcgVWludDhBcnJheSh0W3BdKTtmb3IodmFyIG09ZS5sZW5ndGgsdz0wO3c8bTt3Kz00KWcmPWVbdyszXX1jb25zdCB2PTI1NSE9ZyxiPWZ1bmN0aW9uIGZyYW1pemUodCxyLGksbyxhLHMpe2NvbnN0IGY9W107Zm9yKHZhciBsPTA7bDx0Lmxlbmd0aDtsKyspe2NvbnN0IGg9bmV3IFVpbnQ4QXJyYXkodFtsXSksQT1uZXcgVWludDMyQXJyYXkoaC5idWZmZXIpO3ZhciBjO2xldCBnPTAscD0wLG09cix3PWksdj1vPzE6MDtpZigwIT1sKXtjb25zdCBiPXN8fG98fDE9PWx8fDAhPWZbbC0yXS5kaXNwb3NlPzE6MjtsZXQgeT0wLEU9MWU5O2ZvcihsZXQgZT0wO2U8YjtlKyspe3ZhciB1PW5ldyBVaW50OEFycmF5KHRbbC0xLWVdKTtjb25zdCBvPW5ldyBVaW50MzJBcnJheSh0W2wtMS1lXSk7bGV0IHM9cixmPWksYz0tMSxoPS0xO2ZvcihsZXQgZT0wO2U8aTtlKyspZm9yKGxldCB0PTA7dDxyO3QrKyl7QVtkPWUqcit0XSE9b1tkXSYmKHQ8cyYmKHM9dCksdD5jJiYoYz10KSxlPGYmJihmPWUpLGU+aCYmKGg9ZSkpfS0xPT1jJiYocz1mPWM9aD0wKSxhJiYoMT09KDEmcykmJnMtLSwxPT0oMSZmKSYmZi0tKTtjb25zdCB2PShjLXMrMSkqKGgtZisxKTt2PEUmJihFPXYseT1lLGc9cyxwPWYsbT1jLXMrMSx3PWgtZisxKX11PW5ldyBVaW50OEFycmF5KHRbbC0xLXldKTsxPT15JiYoZltsLTFdLmRpc3Bvc2U9MiksYz1uZXcgVWludDhBcnJheShtKncqNCksZSh1LHIsaSxjLG0sdywtZywtcCwwKSx2PWUoaCxyLGksYyxtLHcsLWcsLXAsMyk/MTowLDE9PXY/X3ByZXBhcmVEaWZmKGgscixpLGMse3g6Zyx5OnAsd2lkdGg6bSxoZWlnaHQ6d30pOmUoaCxyLGksYyxtLHcsLWcsLXAsMCl9ZWxzZSBjPWguc2xpY2UoMCk7Zi5wdXNoKHtyZWN0Ont4OmcseTpwLHdpZHRoOm0saGVpZ2h0Ond9LGltZzpjLGJsZW5kOnYsZGlzcG9zZTowfSl9aWYobylmb3IobD0wO2w8Zi5sZW5ndGg7bCsrKXtpZigxPT0oQT1mW2xdKS5ibGVuZCljb250aW51ZTtjb25zdCBlPUEucmVjdCxvPWZbbC0xXS5yZWN0LHM9TWF0aC5taW4oZS54LG8ueCksYz1NYXRoLm1pbihlLnksby55KSx1PXt4OnMseTpjLHdpZHRoOk1hdGgubWF4KGUueCtlLndpZHRoLG8ueCtvLndpZHRoKS1zLGhlaWdodDpNYXRoLm1heChlLnkrZS5oZWlnaHQsby55K28uaGVpZ2h0KS1jfTtmW2wtMV0uZGlzcG9zZT0xLGwtMSE9MCYmX3VwZGF0ZUZyYW1lKHQscixpLGYsbC0xLHUsYSksX3VwZGF0ZUZyYW1lKHQscixpLGYsbCx1LGEpfWxldCBoPTA7aWYoMSE9dC5sZW5ndGgpZm9yKHZhciBkPTA7ZDxmLmxlbmd0aDtkKyspe3ZhciBBO2grPShBPWZbZF0pLnJlY3Qud2lkdGgqQS5yZWN0LmhlaWdodH1yZXR1cm4gZn0odCxyLGkscyxmLGwpLHk9e30sRT1bXSxGPVtdO2lmKDAhPW8pe2NvbnN0IGU9W107Zm9yKHc9MDt3PGIubGVuZ3RoO3crKyllLnB1c2goYlt3XS5pbWcuYnVmZmVyKTtjb25zdCB0PWZ1bmN0aW9uIGNvbmNhdFJHQkEoZSl7bGV0IHQ9MDtmb3IodmFyIHI9MDtyPGUubGVuZ3RoO3IrKyl0Kz1lW3JdLmJ5dGVMZW5ndGg7Y29uc3QgaT1uZXcgVWludDhBcnJheSh0KTtsZXQgbz0wO2ZvcihyPTA7cjxlLmxlbmd0aDtyKyspe2NvbnN0IHQ9bmV3IFVpbnQ4QXJyYXkoZVtyXSksYT10Lmxlbmd0aDtmb3IobGV0IGU9MDtlPGE7ZSs9NCl7bGV0IHI9dFtlXSxhPXRbZSsxXSxzPXRbZSsyXTtjb25zdCBmPXRbZSszXTswPT1mJiYocj1hPXM9MCksaVtvK2VdPXIsaVtvK2UrMV09YSxpW28rZSsyXT1zLGlbbytlKzNdPWZ9bys9YX1yZXR1cm4gaS5idWZmZXJ9KGUpLHI9cXVhbnRpemUodCxvKTtmb3Iodz0wO3c8ci5wbHRlLmxlbmd0aDt3KyspRS5wdXNoKHIucGx0ZVt3XS5lc3QucmdiYSk7bGV0IGk9MDtmb3Iodz0wO3c8Yi5sZW5ndGg7dysrKXtjb25zdCBlPShCPWJbd10pLmltZy5sZW5ndGg7dmFyIF89bmV3IFVpbnQ4QXJyYXkoci5pbmRzLmJ1ZmZlcixpPj4yLGU+PjIpO0YucHVzaChfKTtjb25zdCB0PW5ldyBVaW50OEFycmF5KHIuYWJ1ZixpLGUpO2gmJmRpdGhlcihCLmltZyxCLnJlY3Qud2lkdGgsQi5yZWN0LmhlaWdodCxFLHQsXyksQi5pbWcuc2V0KHQpLGkrPWV9fWVsc2UgZm9yKHA9MDtwPGIubGVuZ3RoO3ArKyl7dmFyIEI9YltwXTtjb25zdCBlPW5ldyBVaW50MzJBcnJheShCLmltZy5idWZmZXIpO3ZhciBVPUIucmVjdC53aWR0aDttPWUubGVuZ3RoLF89bmV3IFVpbnQ4QXJyYXkobSk7Ri5wdXNoKF8pO2Zvcih3PTA7dzxtO3crKyl7Y29uc3QgdD1lW3ddO2lmKDAhPXcmJnQ9PWVbdy0xXSlfW3ddPV9bdy0xXTtlbHNlIGlmKHc+VSYmdD09ZVt3LVVdKV9bd109X1t3LVVdO2Vsc2V7bGV0IGU9eVt0XTtpZihudWxsPT1lJiYoeVt0XT1lPUUubGVuZ3RoLEUucHVzaCh0KSxFLmxlbmd0aD49MzAwKSlicmVhaztfW3ddPWV9fX1jb25zdCBDPUUubGVuZ3RoO0M8PTI1NiYmMD09dSYmKEE9Qzw9Mj8xOkM8PTQ/MjpDPD0xNj80OjgsQT1NYXRoLm1heChBLGMpKTtmb3IocD0wO3A8Yi5sZW5ndGg7cCsrKXsoQj1iW3BdKS5yZWN0LngsQi5yZWN0Lnk7VT1CLnJlY3Qud2lkdGg7Y29uc3QgZT1CLnJlY3QuaGVpZ2h0O2xldCB0PUIuaW1nO25ldyBVaW50MzJBcnJheSh0LmJ1ZmZlcik7bGV0IHI9NCpVLGk9NDtpZihDPD0yNTYmJjA9PXUpe3I9TWF0aC5jZWlsKEEqVS84KTt2YXIgST1uZXcgVWludDhBcnJheShyKmUpO2NvbnN0IG89RltwXTtmb3IobGV0IHQ9MDt0PGU7dCsrKXt3PXQqcjtjb25zdCBlPXQqVTtpZig4PT1BKWZvcih2YXIgUT0wO1E8VTtRKyspSVt3K1FdPW9bZStRXTtlbHNlIGlmKDQ9PUEpZm9yKFE9MDtRPFU7USsrKUlbdysoUT4+MSldfD1vW2UrUV08PDQtNCooMSZRKTtlbHNlIGlmKDI9PUEpZm9yKFE9MDtRPFU7USsrKUlbdysoUT4+MildfD1vW2UrUV08PDYtMiooMyZRKTtlbHNlIGlmKDE9PUEpZm9yKFE9MDtRPFU7USsrKUlbdysoUT4+MyldfD1vW2UrUV08PDctMSooNyZRKX10PUksZD0zLGk9MX1lbHNlIGlmKDA9PXYmJjE9PWIubGVuZ3RoKXtJPW5ldyBVaW50OEFycmF5KFUqZSozKTtjb25zdCBvPVUqZTtmb3Iodz0wO3c8bzt3Kyspe2NvbnN0IGU9Myp3LHI9NCp3O0lbZV09dFtyXSxJW2UrMV09dFtyKzFdLElbZSsyXT10W3IrMl19dD1JLGQ9MixpPTMscj0zKlV9Qi5pbWc9dCxCLmJwbD1yLEIuYnBwPWl9cmV0dXJue2N0eXBlOmQsZGVwdGg6QSxwbHRlOkUsZnJhbWVzOmJ9fWZ1bmN0aW9uIF91cGRhdGVGcmFtZSh0LHIsaSxvLGEscyxmKXtjb25zdCBsPVVpbnQ4QXJyYXksYz1VaW50MzJBcnJheSx1PW5ldyBsKHRbYS0xXSksaD1uZXcgYyh0W2EtMV0pLGQ9YSsxPHQubGVuZ3RoP25ldyBsKHRbYSsxXSk6bnVsbCxBPW5ldyBsKHRbYV0pLGc9bmV3IGMoQS5idWZmZXIpO2xldCBwPXIsbT1pLHc9LTEsdj0tMTtmb3IobGV0IGU9MDtlPHMuaGVpZ2h0O2UrKylmb3IobGV0IHQ9MDt0PHMud2lkdGg7dCsrKXtjb25zdCBpPXMueCt0LGY9cy55K2UsbD1mKnIraSxjPWdbbF07MD09Y3x8MD09b1thLTFdLmRpc3Bvc2UmJmhbbF09PWMmJihudWxsPT1kfHwwIT1kWzQqbCszXSl8fChpPHAmJihwPWkpLGk+dyYmKHc9aSksZjxtJiYobT1mKSxmPnYmJih2PWYpKX0tMT09dyYmKHA9bT13PXY9MCksZiYmKDE9PSgxJnApJiZwLS0sMT09KDEmbSkmJm0tLSkscz17eDpwLHk6bSx3aWR0aDp3LXArMSxoZWlnaHQ6di1tKzF9O2NvbnN0IGI9b1thXTtiLnJlY3Q9cyxiLmJsZW5kPTEsYi5pbWc9bmV3IFVpbnQ4QXJyYXkocy53aWR0aCpzLmhlaWdodCo0KSwwPT1vW2EtMV0uZGlzcG9zZT8oZSh1LHIsaSxiLmltZyxzLndpZHRoLHMuaGVpZ2h0LC1zLngsLXMueSwwKSxfcHJlcGFyZURpZmYoQSxyLGksYi5pbWcscykpOmUoQSxyLGksYi5pbWcscy53aWR0aCxzLmhlaWdodCwtcy54LC1zLnksMCl9ZnVuY3Rpb24gX3ByZXBhcmVEaWZmKHQscixpLG8sYSl7ZSh0LHIsaSxvLGEud2lkdGgsYS5oZWlnaHQsLWEueCwtYS55LDIpfWZ1bmN0aW9uIF9maWx0ZXJaZXJvKGUsdCxyLGksbyxhLHMpe2NvbnN0IGY9W107bGV0IGwsYz1bMCwxLDIsMyw0XTstMSE9YT9jPVthXToodCppPjVlNXx8MT09cikmJihjPVswXSkscyYmKGw9e2xldmVsOjB9KTtjb25zdCB1PVVaSVA7Zm9yKHZhciBoPTA7aDxjLmxlbmd0aDtoKyspe2ZvcihsZXQgYT0wO2E8dDthKyspX2ZpbHRlckxpbmUobyxlLGEsaSxyLGNbaF0pO2YucHVzaCh1LmRlZmxhdGUobyxsKSl9bGV0IGQsQT0xZTk7Zm9yKGg9MDtoPGYubGVuZ3RoO2grKylmW2hdLmxlbmd0aDxBJiYoZD1oLEE9ZltoXS5sZW5ndGgpO3JldHVybiBmW2RdfWZ1bmN0aW9uIF9maWx0ZXJMaW5lKGUsdCxpLG8sYSxzKXtjb25zdCBmPWkqbztsZXQgbD1mK2k7aWYoZVtsXT1zLGwrKywwPT1zKWlmKG88NTAwKWZvcih2YXIgYz0wO2M8bztjKyspZVtsK2NdPXRbZitjXTtlbHNlIGUuc2V0KG5ldyBVaW50OEFycmF5KHQuYnVmZmVyLGYsbyksbCk7ZWxzZSBpZigxPT1zKXtmb3IoYz0wO2M8YTtjKyspZVtsK2NdPXRbZitjXTtmb3IoYz1hO2M8bztjKyspZVtsK2NdPXRbZitjXS10W2YrYy1hXSsyNTYmMjU1fWVsc2UgaWYoMD09aSl7Zm9yKGM9MDtjPGE7YysrKWVbbCtjXT10W2YrY107aWYoMj09cylmb3IoYz1hO2M8bztjKyspZVtsK2NdPXRbZitjXTtpZigzPT1zKWZvcihjPWE7YzxvO2MrKyllW2wrY109dFtmK2NdLSh0W2YrYy1hXT4+MSkrMjU2JjI1NTtpZig0PT1zKWZvcihjPWE7YzxvO2MrKyllW2wrY109dFtmK2NdLXIodFtmK2MtYV0sMCwwKSsyNTYmMjU1fWVsc2V7aWYoMj09cylmb3IoYz0wO2M8bztjKyspZVtsK2NdPXRbZitjXSsyNTYtdFtmK2Mtb10mMjU1O2lmKDM9PXMpe2ZvcihjPTA7YzxhO2MrKyllW2wrY109dFtmK2NdKzI1Ni0odFtmK2Mtb10+PjEpJjI1NTtmb3IoYz1hO2M8bztjKyspZVtsK2NdPXRbZitjXSsyNTYtKHRbZitjLW9dK3RbZitjLWFdPj4xKSYyNTV9aWYoND09cyl7Zm9yKGM9MDtjPGE7YysrKWVbbCtjXT10W2YrY10rMjU2LXIoMCx0W2YrYy1vXSwwKSYyNTU7Zm9yKGM9YTtjPG87YysrKWVbbCtjXT10W2YrY10rMjU2LXIodFtmK2MtYV0sdFtmK2Mtb10sdFtmK2MtYS1vXSkmMjU1fX19ZnVuY3Rpb24gcXVhbnRpemUoZSx0KXtjb25zdCByPW5ldyBVaW50OEFycmF5KGUpLGk9ci5zbGljZSgwKSxvPW5ldyBVaW50MzJBcnJheShpLmJ1ZmZlciksYT1nZXRLRHRyZWUoaSx0KSxzPWFbMF0sZj1hWzFdLGw9ci5sZW5ndGgsYz1uZXcgVWludDhBcnJheShsPj4yKTtsZXQgdTtpZihyLmxlbmd0aDwyZTcpZm9yKHZhciBoPTA7aDxsO2grPTQpe3U9Z2V0TmVhcmVzdChzLGQ9cltoXSooMS8yNTUpLEE9cltoKzFdKigxLzI1NSksZz1yW2grMl0qKDEvMjU1KSxwPXJbaCszXSooMS8yNTUpKSxjW2g+PjJdPXUuaW5kLG9baD4+Ml09dS5lc3QucmdiYX1lbHNlIGZvcihoPTA7aDxsO2grPTQpe3ZhciBkPXJbaF0qKDEvMjU1KSxBPXJbaCsxXSooMS8yNTUpLGc9cltoKzJdKigxLzI1NSkscD1yW2grM10qKDEvMjU1KTtmb3IodT1zO3UubGVmdDspdT1wbGFuZURzdCh1LmVzdCxkLEEsZyxwKTw9MD91LmxlZnQ6dS5yaWdodDtjW2g+PjJdPXUuaW5kLG9baD4+Ml09dS5lc3QucmdiYX1yZXR1cm57YWJ1ZjppLmJ1ZmZlcixpbmRzOmMscGx0ZTpmfX1mdW5jdGlvbiBnZXRLRHRyZWUoZSx0LHIpe251bGw9PXImJihyPTFlLTQpO2NvbnN0IGk9bmV3IFVpbnQzMkFycmF5KGUuYnVmZmVyKSxvPXtpMDowLGkxOmUubGVuZ3RoLGJzdDpudWxsLGVzdDpudWxsLHRkc3Q6MCxsZWZ0Om51bGwscmlnaHQ6bnVsbH07by5ic3Q9c3RhdHMoZSxvLmkwLG8uaTEpLG8uZXN0PWVzdGF0cyhvLmJzdCk7Y29uc3QgYT1bb107Zm9yKDthLmxlbmd0aDx0Oyl7bGV0IHQ9MCxvPTA7Zm9yKHZhciBzPTA7czxhLmxlbmd0aDtzKyspYVtzXS5lc3QuTD50JiYodD1hW3NdLmVzdC5MLG89cyk7aWYodDxyKWJyZWFrO2NvbnN0IGY9YVtvXSxsPXNwbGl0UGl4ZWxzKGUsaSxmLmkwLGYuaTEsZi5lc3QuZSxmLmVzdC5lTXEyNTUpO2lmKGYuaTA+PWx8fGYuaTE8PWwpe2YuZXN0Lkw9MDtjb250aW51ZX1jb25zdCBjPXtpMDpmLmkwLGkxOmwsYnN0Om51bGwsZXN0Om51bGwsdGRzdDowLGxlZnQ6bnVsbCxyaWdodDpudWxsfTtjLmJzdD1zdGF0cyhlLGMuaTAsYy5pMSksYy5lc3Q9ZXN0YXRzKGMuYnN0KTtjb25zdCB1PXtpMDpsLGkxOmYuaTEsYnN0Om51bGwsZXN0Om51bGwsdGRzdDowLGxlZnQ6bnVsbCxyaWdodDpudWxsfTt1LmJzdD17UjpbXSxtOltdLE46Zi5ic3QuTi1jLmJzdC5OfTtmb3Iocz0wO3M8MTY7cysrKXUuYnN0LlJbc109Zi5ic3QuUltzXS1jLmJzdC5SW3NdO2ZvcihzPTA7czw0O3MrKyl1LmJzdC5tW3NdPWYuYnN0Lm1bc10tYy5ic3QubVtzXTt1LmVzdD1lc3RhdHModS5ic3QpLGYubGVmdD1jLGYucmlnaHQ9dSxhW29dPWMsYS5wdXNoKHUpfWEuc29ydCgoKGUsdCk9PnQuYnN0Lk4tZS5ic3QuTikpO2ZvcihzPTA7czxhLmxlbmd0aDtzKyspYVtzXS5pbmQ9cztyZXR1cm5bbyxhXX1mdW5jdGlvbiBnZXROZWFyZXN0KGUsdCxyLGksbyl7aWYobnVsbD09ZS5sZWZ0KXJldHVybiBlLnRkc3Q9ZnVuY3Rpb24gZGlzdChlLHQscixpLG8pe2NvbnN0IGE9dC1lWzBdLHM9ci1lWzFdLGY9aS1lWzJdLGw9by1lWzNdO3JldHVybiBhKmErcypzK2YqZitsKmx9KGUuZXN0LnEsdCxyLGksbyksZTtjb25zdCBhPXBsYW5lRHN0KGUuZXN0LHQscixpLG8pO2xldCBzPWUubGVmdCxmPWUucmlnaHQ7YT4wJiYocz1lLnJpZ2h0LGY9ZS5sZWZ0KTtjb25zdCBsPWdldE5lYXJlc3Qocyx0LHIsaSxvKTtpZihsLnRkc3Q8PWEqYSlyZXR1cm4gbDtjb25zdCBjPWdldE5lYXJlc3QoZix0LHIsaSxvKTtyZXR1cm4gYy50ZHN0PGwudGRzdD9jOmx9ZnVuY3Rpb24gcGxhbmVEc3QoZSx0LHIsaSxvKXtjb25zdHtlOmF9PWU7cmV0dXJuIGFbMF0qdCthWzFdKnIrYVsyXSppK2FbM10qby1lLmVNcX1mdW5jdGlvbiBzcGxpdFBpeGVscyhlLHQscixpLG8sYSl7Zm9yKGktPTQ7cjxpOyl7Zm9yKDt2ZWNEb3QoZSxyLG8pPD1hOylyKz00O2Zvcig7dmVjRG90KGUsaSxvKT5hOylpLT00O2lmKHI+PWkpYnJlYWs7Y29uc3Qgcz10W3I+PjJdO3Rbcj4+Ml09dFtpPj4yXSx0W2k+PjJdPXMscis9NCxpLT00fWZvcig7dmVjRG90KGUscixvKT5hOylyLT00O3JldHVybiByKzR9ZnVuY3Rpb24gdmVjRG90KGUsdCxyKXtyZXR1cm4gZVt0XSpyWzBdK2VbdCsxXSpyWzFdK2VbdCsyXSpyWzJdK2VbdCszXSpyWzNdfWZ1bmN0aW9uIHN0YXRzKGUsdCxyKXtjb25zdCBpPVswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwXSxvPVswLDAsMCwwXSxhPXItdD4+Mjtmb3IobGV0IGE9dDthPHI7YSs9NCl7Y29uc3QgdD1lW2FdKigxLzI1NSkscj1lW2ErMV0qKDEvMjU1KSxzPWVbYSsyXSooMS8yNTUpLGY9ZVthKzNdKigxLzI1NSk7b1swXSs9dCxvWzFdKz1yLG9bMl0rPXMsb1szXSs9ZixpWzBdKz10KnQsaVsxXSs9dCpyLGlbMl0rPXQqcyxpWzNdKz10KmYsaVs1XSs9cipyLGlbNl0rPXIqcyxpWzddKz1yKmYsaVsxMF0rPXMqcyxpWzExXSs9cypmLGlbMTVdKz1mKmZ9cmV0dXJuIGlbNF09aVsxXSxpWzhdPWlbMl0saVs5XT1pWzZdLGlbMTJdPWlbM10saVsxM109aVs3XSxpWzE0XT1pWzExXSx7UjppLG06byxOOmF9fWZ1bmN0aW9uIGVzdGF0cyhlKXtjb25zdHtSOnR9PWUse206cn09ZSx7TjppfT1lLGE9clswXSxzPXJbMV0sZj1yWzJdLGw9clszXSxjPTA9PWk/MDoxL2ksdT1bdFswXS1hKmEqYyx0WzFdLWEqcypjLHRbMl0tYSpmKmMsdFszXS1hKmwqYyx0WzRdLXMqYSpjLHRbNV0tcypzKmMsdFs2XS1zKmYqYyx0WzddLXMqbCpjLHRbOF0tZiphKmMsdFs5XS1mKnMqYyx0WzEwXS1mKmYqYyx0WzExXS1mKmwqYyx0WzEyXS1sKmEqYyx0WzEzXS1sKnMqYyx0WzE0XS1sKmYqYyx0WzE1XS1sKmwqY10saD11LGQ9bztsZXQgQT1bTWF0aC5yYW5kb20oKSxNYXRoLnJhbmRvbSgpLE1hdGgucmFuZG9tKCksTWF0aC5yYW5kb20oKV0sZz0wLHA9MDtpZigwIT1pKWZvcihsZXQgZT0wO2U8MTYmJihBPWQubXVsdFZlYyhoLEEpLHA9TWF0aC5zcXJ0KGQuZG90KEEsQSkpLEE9ZC5zbWwoMS9wLEEpLCEoMCE9ZSYmTWF0aC5hYnMocC1nKTwxZS05KSk7ZSsrKWc9cDtjb25zdCBtPVthKmMscypjLGYqYyxsKmNdO3JldHVybntDb3Y6dSxxOm0sZTpBLEw6ZyxlTXEyNTU6ZC5kb3QoZC5zbWwoMjU1LG0pLEEpLGVNcTpkLmRvdChBLG0pLHJnYmE6KE1hdGgucm91bmQoMjU1Km1bM10pPDwyNHxNYXRoLnJvdW5kKDI1NSptWzJdKTw8MTZ8TWF0aC5yb3VuZCgyNTUqbVsxXSk8PDh8TWF0aC5yb3VuZCgyNTUqbVswXSk8PDApPj4+MH19dmFyIG89e211bHRWZWM6KGUsdCk9PltlWzBdKnRbMF0rZVsxXSp0WzFdK2VbMl0qdFsyXStlWzNdKnRbM10sZVs0XSp0WzBdK2VbNV0qdFsxXStlWzZdKnRbMl0rZVs3XSp0WzNdLGVbOF0qdFswXStlWzldKnRbMV0rZVsxMF0qdFsyXStlWzExXSp0WzNdLGVbMTJdKnRbMF0rZVsxM10qdFsxXStlWzE0XSp0WzJdK2VbMTVdKnRbM11dLGRvdDooZSx0KT0+ZVswXSp0WzBdK2VbMV0qdFsxXStlWzJdKnRbMl0rZVszXSp0WzNdLHNtbDooZSx0KT0+W2UqdFswXSxlKnRbMV0sZSp0WzJdLGUqdFszXV19O1VQTkcuZW5jb2RlPWZ1bmN0aW9uIGVuY29kZShlLHQscixpLG8sYSxzKXtudWxsPT1pJiYoaT0wKSxudWxsPT1zJiYocz0hMSk7Y29uc3QgZj1jb21wcmVzcyhlLHQscixpLFshMSwhMSwhMSwwLHMsITFdKTtyZXR1cm4gY29tcHJlc3NQTkcoZiwtMSksX21haW4oZix0LHIsbyxhKX0sVVBORy5lbmNvZGVMTD1mdW5jdGlvbiBlbmNvZGVMTChlLHQscixpLG8sYSxzLGYpe2NvbnN0IGw9e2N0eXBlOjArKDE9PWk/MDoyKSsoMD09bz8wOjQpLGRlcHRoOmEsZnJhbWVzOltdfSxjPShpK28pKmEsdT1jKnQ7Zm9yKGxldCBpPTA7aTxlLmxlbmd0aDtpKyspbC5mcmFtZXMucHVzaCh7cmVjdDp7eDowLHk6MCx3aWR0aDp0LGhlaWdodDpyfSxpbWc6bmV3IFVpbnQ4QXJyYXkoZVtpXSksYmxlbmQ6MCxkaXNwb3NlOjEsYnBwOk1hdGguY2VpbChjLzgpLGJwbDpNYXRoLmNlaWwodS84KX0pO3JldHVybiBjb21wcmVzc1BORyhsLDAsITApLF9tYWluKGwsdCxyLHMsZil9LFVQTkcuZW5jb2RlLmNvbXByZXNzPWNvbXByZXNzLFVQTkcuZW5jb2RlLmRpdGhlcj1kaXRoZXIsVVBORy5xdWFudGl6ZT1xdWFudGl6ZSxVUE5HLnF1YW50aXplLmdldEtEdHJlZT1nZXRLRHRyZWUsVVBORy5xdWFudGl6ZS5nZXROZWFyZXN0PWdldE5lYXJlc3R9KCk7Y29uc3Qgcj17dG9BcnJheUJ1ZmZlcihlLHQpe2NvbnN0IGk9ZS53aWR0aCxvPWUuaGVpZ2h0LGE9aTw8MixzPWUuZ2V0Q29udGV4dChcIjJkXCIpLmdldEltYWdlRGF0YSgwLDAsaSxvKSxmPW5ldyBVaW50MzJBcnJheShzLmRhdGEuYnVmZmVyKSxsPSgzMippKzMxKS8zMjw8MixjPWwqbyx1PTEyMitjLGg9bmV3IEFycmF5QnVmZmVyKHUpLGQ9bmV3IERhdGFWaWV3KGgpLEE9MTw8MjA7bGV0IGcscCxtLHcsdj1BLGI9MCx5PTAsRT0wO2Z1bmN0aW9uIHNldDE2KGUpe2Quc2V0VWludDE2KHksZSwhMCkseSs9Mn1mdW5jdGlvbiBzZXQzMihlKXtkLnNldFVpbnQzMih5LGUsITApLHkrPTR9ZnVuY3Rpb24gc2VlayhlKXt5Kz1lfXNldDE2KDE5Nzc4KSxzZXQzMih1KSxzZWVrKDQpLHNldDMyKDEyMiksc2V0MzIoMTA4KSxzZXQzMihpKSxzZXQzMigtbz4+PjApLHNldDE2KDEpLHNldDE2KDMyKSxzZXQzMigzKSxzZXQzMihjKSxzZXQzMigyODM1KSxzZXQzMigyODM1KSxzZWVrKDgpLHNldDMyKDE2NzExNjgwKSxzZXQzMig2NTI4MCksc2V0MzIoMjU1KSxzZXQzMig0Mjc4MTkwMDgwKSxzZXQzMigxNDY2NTI3MjY0KSxmdW5jdGlvbiBjb252ZXJ0KCl7Zm9yKDtiPG8mJnY+MDspe2Zvcih3PTEyMitiKmwsZz0wO2c8YTspdi0tLHA9ZltFKytdLG09cD4+PjI0LGQuc2V0VWludDMyKHcrZyxwPDw4fG0pLGcrPTQ7YisrfUU8Zi5sZW5ndGg/KHY9QSxzZXRUaW1lb3V0KGNvbnZlcnQsci5fZGx5KSk6dChoKX0oKX0sdG9CbG9iKGUsdCl7dGhpcy50b0FycmF5QnVmZmVyKGUsKGU9Pnt0KG5ldyBCbG9iKFtlXSx7dHlwZTpcImltYWdlL2JtcFwifSkpfSkpfSxfZGx5Ojl9O3ZhciBpPXtDSFJPTUU6XCJDSFJPTUVcIixGSVJFRk9YOlwiRklSRUZPWFwiLERFU0tUT1BfU0FGQVJJOlwiREVTS1RPUF9TQUZBUklcIixJRTpcIklFXCIsSU9TOlwiSU9TXCIsRVRDOlwiRVRDXCJ9LG89e1tpLkNIUk9NRV06MTYzODQsW2kuRklSRUZPWF06MTExODAsW2kuREVTS1RPUF9TQUZBUkldOjE2Mzg0LFtpLklFXTo4MTkyLFtpLklPU106NDA5NixbaS5FVENdOjgxOTJ9O2NvbnN0IGE9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyxzPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSYmc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlLGY9YSYmd2luZG93LmNvcmRvdmEmJndpbmRvdy5jb3Jkb3ZhLnJlcXVpcmUmJndpbmRvdy5jb3Jkb3ZhLnJlcXVpcmUoXCJjb3Jkb3ZhL21vZHVsZW1hcHBlclwiKSxDdXN0b21GaWxlPShhfHxzKSYmKGYmJmYuZ2V0T3JpZ2luYWxTeW1ib2wod2luZG93LFwiRmlsZVwiKXx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEZpbGUmJkZpbGUpLEN1c3RvbUZpbGVSZWFkZXI9KGF8fHMpJiYoZiYmZi5nZXRPcmlnaW5hbFN5bWJvbCh3aW5kb3csXCJGaWxlUmVhZGVyXCIpfHxcInVuZGVmaW5lZFwiIT10eXBlb2YgRmlsZVJlYWRlciYmRmlsZVJlYWRlcik7ZnVuY3Rpb24gZ2V0RmlsZWZyb21EYXRhVXJsKGUsdCxyPURhdGUubm93KCkpe3JldHVybiBuZXcgUHJvbWlzZSgoaT0+e2NvbnN0IG89ZS5zcGxpdChcIixcIiksYT1vWzBdLm1hdGNoKC86KC4qPyk7LylbMV0scz1nbG9iYWxUaGlzLmF0b2Iob1sxXSk7bGV0IGY9cy5sZW5ndGg7Y29uc3QgbD1uZXcgVWludDhBcnJheShmKTtmb3IoO2YtLTspbFtmXT1zLmNoYXJDb2RlQXQoZik7Y29uc3QgYz1uZXcgQmxvYihbbF0se3R5cGU6YX0pO2MubmFtZT10LGMubGFzdE1vZGlmaWVkPXIsaShjKX0pKX1mdW5jdGlvbiBnZXREYXRhVXJsRnJvbUZpbGUoZSl7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2NvbnN0IGk9bmV3IEN1c3RvbUZpbGVSZWFkZXI7aS5vbmxvYWQ9KCk9PnQoaS5yZXN1bHQpLGkub25lcnJvcj1lPT5yKGUpLGkucmVhZEFzRGF0YVVSTChlKX0pKX1mdW5jdGlvbiBsb2FkSW1hZ2UoZSl7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2NvbnN0IGk9bmV3IEltYWdlO2kub25sb2FkPSgpPT50KGkpLGkub25lcnJvcj1lPT5yKGUpLGkuc3JjPWV9KSl9ZnVuY3Rpb24gZ2V0QnJvd3Nlck5hbWUoKXtpZih2b2lkIDAhPT1nZXRCcm93c2VyTmFtZS5jYWNoZWRSZXN1bHQpcmV0dXJuIGdldEJyb3dzZXJOYW1lLmNhY2hlZFJlc3VsdDtsZXQgZT1pLkVUQztjb25zdHt1c2VyQWdlbnQ6dH09bmF2aWdhdG9yO3JldHVybi9DaHJvbShlfGl1bSkvaS50ZXN0KHQpP2U9aS5DSFJPTUU6L2lQKGFkfG9kfGhvbmUpL2kudGVzdCh0KSYmL1dlYktpdC9pLnRlc3QodCk/ZT1pLklPUzovU2FmYXJpL2kudGVzdCh0KT9lPWkuREVTS1RPUF9TQUZBUkk6L0ZpcmVmb3gvaS50ZXN0KHQpP2U9aS5GSVJFRk9YOigvTVNJRS9pLnRlc3QodCl8fCEwPT0hIWRvY3VtZW50LmRvY3VtZW50TW9kZSkmJihlPWkuSUUpLGdldEJyb3dzZXJOYW1lLmNhY2hlZFJlc3VsdD1lLGdldEJyb3dzZXJOYW1lLmNhY2hlZFJlc3VsdH1mdW5jdGlvbiBhcHByb3hpbWF0ZUJlbG93TWF4aW11bUNhbnZhc1NpemVPZkJyb3dzZXIoZSx0KXtjb25zdCByPWdldEJyb3dzZXJOYW1lKCksaT1vW3JdO2xldCBhPWUscz10LGY9YSpzO2NvbnN0IGw9YT5zP3MvYTphL3M7Zm9yKDtmPmkqaTspe2NvbnN0IGU9KGkrYSkvMix0PShpK3MpLzI7ZTx0PyhzPXQsYT10KmwpOihzPWUqbCxhPWUpLGY9YSpzfXJldHVybnt3aWR0aDphLGhlaWdodDpzfX1mdW5jdGlvbiBnZXROZXdDYW52YXNBbmRDdHgoZSx0KXtsZXQgcixpO3RyeXtpZihyPW5ldyBPZmZzY3JlZW5DYW52YXMoZSx0KSxpPXIuZ2V0Q29udGV4dChcIjJkXCIpLG51bGw9PT1pKXRocm93IG5ldyBFcnJvcihcImdldENvbnRleHQgb2YgT2Zmc2NyZWVuQ2FudmFzIHJldHVybnMgbnVsbFwiKX1jYXRjaChlKXtyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksaT1yLmdldENvbnRleHQoXCIyZFwiKX1yZXR1cm4gci53aWR0aD1lLHIuaGVpZ2h0PXQsW3IsaV19ZnVuY3Rpb24gZHJhd0ltYWdlSW5DYW52YXMoZSx0KXtjb25zdHt3aWR0aDpyLGhlaWdodDppfT1hcHByb3hpbWF0ZUJlbG93TWF4aW11bUNhbnZhc1NpemVPZkJyb3dzZXIoZS53aWR0aCxlLmhlaWdodCksW28sYV09Z2V0TmV3Q2FudmFzQW5kQ3R4KHIsaSk7cmV0dXJuIHQmJi9qcGU/Zy8udGVzdCh0KSYmKGEuZmlsbFN0eWxlPVwid2hpdGVcIixhLmZpbGxSZWN0KDAsMCxvLndpZHRoLG8uaGVpZ2h0KSksYS5kcmF3SW1hZ2UoZSwwLDAsby53aWR0aCxvLmhlaWdodCksb31mdW5jdGlvbiBpc0lPUygpe3JldHVybiB2b2lkIDAhPT1pc0lPUy5jYWNoZWRSZXN1bHR8fChpc0lPUy5jYWNoZWRSZXN1bHQ9W1wiaVBhZCBTaW11bGF0b3JcIixcImlQaG9uZSBTaW11bGF0b3JcIixcImlQb2QgU2ltdWxhdG9yXCIsXCJpUGFkXCIsXCJpUGhvbmVcIixcImlQb2RcIl0uaW5jbHVkZXMobmF2aWdhdG9yLnBsYXRmb3JtKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcyhcIk1hY1wiKSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50JiZcIm9udG91Y2hlbmRcImluIGRvY3VtZW50KSxpc0lPUy5jYWNoZWRSZXN1bHR9ZnVuY3Rpb24gZHJhd0ZpbGVJbkNhbnZhcyhlLHQ9e30pe3JldHVybiBuZXcgUHJvbWlzZSgoZnVuY3Rpb24ocixvKXtsZXQgYSxzO3ZhciAkVHJ5XzJfUG9zdD1mdW5jdGlvbigpe3RyeXtyZXR1cm4gcz1kcmF3SW1hZ2VJbkNhbnZhcyhhLHQuZmlsZVR5cGV8fGUudHlwZSkscihbYSxzXSl9Y2F0Y2goZSl7cmV0dXJuIG8oZSl9fSwkVHJ5XzJfQ2F0Y2g9ZnVuY3Rpb24odCl7dHJ5ezA7dmFyICRUcnlfM19DYXRjaD1mdW5jdGlvbihlKXt0cnl7dGhyb3cgZX1jYXRjaChlKXtyZXR1cm4gbyhlKX19O3RyeXtsZXQgdDtyZXR1cm4gZ2V0RGF0YVVybEZyb21GaWxlKGUpLnRoZW4oKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gdD1lLGxvYWRJbWFnZSh0KS50aGVuKChmdW5jdGlvbihlKXt0cnl7cmV0dXJuIGE9ZSxmdW5jdGlvbigpe3RyeXtyZXR1cm4gJFRyeV8yX1Bvc3QoKX1jYXRjaChlKXtyZXR1cm4gbyhlKX19KCl9Y2F0Y2goZSl7cmV0dXJuICRUcnlfM19DYXRjaChlKX19KSwkVHJ5XzNfQ2F0Y2gpfWNhdGNoKGUpe3JldHVybiAkVHJ5XzNfQ2F0Y2goZSl9fSksJFRyeV8zX0NhdGNoKX1jYXRjaChlKXskVHJ5XzNfQ2F0Y2goZSl9fWNhdGNoKGUpe3JldHVybiBvKGUpfX07dHJ5e2lmKGlzSU9TKCl8fFtpLkRFU0tUT1BfU0FGQVJJLGkuTU9CSUxFX1NBRkFSSV0uaW5jbHVkZXMoZ2V0QnJvd3Nlck5hbWUoKSkpdGhyb3cgbmV3IEVycm9yKFwiU2tpcCBjcmVhdGVJbWFnZUJpdG1hcCBvbiBJT1MgYW5kIFNhZmFyaVwiKTtyZXR1cm4gY3JlYXRlSW1hZ2VCaXRtYXAoZSkudGhlbigoZnVuY3Rpb24oZSl7dHJ5e3JldHVybiBhPWUsJFRyeV8yX1Bvc3QoKX1jYXRjaChlKXtyZXR1cm4gJFRyeV8yX0NhdGNoKCl9fSksJFRyeV8yX0NhdGNoKX1jYXRjaChlKXskVHJ5XzJfQ2F0Y2goKX19KSl9ZnVuY3Rpb24gY2FudmFzVG9GaWxlKGUsdCxpLG8sYT0xKXtyZXR1cm4gbmV3IFByb21pc2UoKGZ1bmN0aW9uKHMsZil7bGV0IGw7aWYoXCJpbWFnZS9wbmdcIj09PXQpe2xldCBjLHUsaDtyZXR1cm4gYz1lLmdldENvbnRleHQoXCIyZFwiKSwoe2RhdGE6dX09Yy5nZXRJbWFnZURhdGEoMCwwLGUud2lkdGgsZS5oZWlnaHQpKSxoPVVQTkcuZW5jb2RlKFt1LmJ1ZmZlcl0sZS53aWR0aCxlLmhlaWdodCw0MDk2KmEpLGw9bmV3IEJsb2IoW2hdLHt0eXBlOnR9KSxsLm5hbWU9aSxsLmxhc3RNb2RpZmllZD1vLCRJZl80LmNhbGwodGhpcyl9e2lmKFwiaW1hZ2UvYm1wXCI9PT10KXJldHVybiBuZXcgUHJvbWlzZSgodD0+ci50b0Jsb2IoZSx0KSkpLnRoZW4oZnVuY3Rpb24oZSl7dHJ5e3JldHVybiBsPWUsbC5uYW1lPWksbC5sYXN0TW9kaWZpZWQ9bywkSWZfNS5jYWxsKHRoaXMpfWNhdGNoKGUpe3JldHVybiBmKGUpfX0uYmluZCh0aGlzKSxmKTt7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgT2Zmc2NyZWVuQ2FudmFzJiZlIGluc3RhbmNlb2YgT2Zmc2NyZWVuQ2FudmFzKXJldHVybiBlLmNvbnZlcnRUb0Jsb2Ioe3R5cGU6dCxxdWFsaXR5OmF9KS50aGVuKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gbD1lLGwubmFtZT1pLGwubGFzdE1vZGlmaWVkPW8sJElmXzYuY2FsbCh0aGlzKX1jYXRjaChlKXtyZXR1cm4gZihlKX19LmJpbmQodGhpcyksZik7e2xldCBkO3JldHVybiBkPWUudG9EYXRhVVJMKHQsYSksZ2V0RmlsZWZyb21EYXRhVXJsKGQsaSxvKS50aGVuKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gbD1lLCRJZl82LmNhbGwodGhpcyl9Y2F0Y2goZSl7cmV0dXJuIGYoZSl9fS5iaW5kKHRoaXMpLGYpfWZ1bmN0aW9uICRJZl82KCl7cmV0dXJuICRJZl81LmNhbGwodGhpcyl9fWZ1bmN0aW9uICRJZl81KCl7cmV0dXJuICRJZl80LmNhbGwodGhpcyl9fWZ1bmN0aW9uICRJZl80KCl7cmV0dXJuIHMobCl9fSkpfWZ1bmN0aW9uIGNsZWFudXBDYW52YXNNZW1vcnkoZSl7ZS53aWR0aD0wLGUuaGVpZ2h0PTB9ZnVuY3Rpb24gaXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIoKXtyZXR1cm4gbmV3IFByb21pc2UoKGZ1bmN0aW9uKGUsdCl7bGV0IHIsaSxvLGEscztyZXR1cm4gdm9pZCAwIT09aXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIuY2FjaGVkUmVzdWx0P2UoaXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIuY2FjaGVkUmVzdWx0KToocj1cImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRRQWlSWGhwWmdBQVRVMEFLZ0FBQUFnQUFRRVNBQU1BQUFBQkFBWUFBQUFBQUFELzJ3Q0VBQUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQWYvQUFCRUlBQUVBQWdNQkVRQUNFUUVERVFIL3hBQktBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUxFQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFFUUVBQUFBQUFBQUFBQUFBQUFBQUFBQUEvOW9BREFNQkFBSVJBeEVBUHdBLzhILy8yUT09XCIsZ2V0RmlsZWZyb21EYXRhVXJsKFwiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNFFBaVJYaHBaZ0FBVFUwQUtnQUFBQWdBQVFFU0FBTUFBQUFCQUFZQUFBQUFBQUQvMndDRUFBRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBZi9BQUJFSUFBRUFBZ01CRVFBQ0VRRURFUUgveEFCS0FBRUFBQUFBQUFBQUFBQUFBQUFBQUFBTEVBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFRRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUVRRUFBQUFBQUFBQUFBQUFBQUFBQUFBQS85b0FEQU1CQUFJUkF4RUFQd0EvOEgvLzJRPT1cIixcInRlc3QuanBnXCIsRGF0ZS5ub3coKSkudGhlbigoZnVuY3Rpb24ocil7dHJ5e3JldHVybiBpPXIsZHJhd0ZpbGVJbkNhbnZhcyhpKS50aGVuKChmdW5jdGlvbihyKXt0cnl7cmV0dXJuIG89clsxXSxjYW52YXNUb0ZpbGUobyxpLnR5cGUsaS5uYW1lLGkubGFzdE1vZGlmaWVkKS50aGVuKChmdW5jdGlvbihyKXt0cnl7cmV0dXJuIGE9cixjbGVhbnVwQ2FudmFzTWVtb3J5KG8pLGRyYXdGaWxlSW5DYW52YXMoYSkudGhlbigoZnVuY3Rpb24ocil7dHJ5e3JldHVybiBzPXJbMF0saXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIuY2FjaGVkUmVzdWx0PTE9PT1zLndpZHRoJiYyPT09cy5oZWlnaHQsZShpc0F1dG9PcmllbnRhdGlvbkluQnJvd3Nlci5jYWNoZWRSZXN1bHQpfWNhdGNoKGUpe3JldHVybiB0KGUpfX0pLHQpfWNhdGNoKGUpe3JldHVybiB0KGUpfX0pLHQpfWNhdGNoKGUpe3JldHVybiB0KGUpfX0pLHQpfWNhdGNoKGUpe3JldHVybiB0KGUpfX0pLHQpKX0pKX1mdW5jdGlvbiBnZXRFeGlmT3JpZW50YXRpb24oZSl7cmV0dXJuIG5ldyBQcm9taXNlKCgodCxyKT0+e2NvbnN0IGk9bmV3IEN1c3RvbUZpbGVSZWFkZXI7aS5vbmxvYWQ9ZT0+e2NvbnN0IHI9bmV3IERhdGFWaWV3KGUudGFyZ2V0LnJlc3VsdCk7aWYoNjU0OTYhPXIuZ2V0VWludDE2KDAsITEpKXJldHVybiB0KC0yKTtjb25zdCBpPXIuYnl0ZUxlbmd0aDtsZXQgbz0yO2Zvcig7bzxpOyl7aWYoci5nZXRVaW50MTYobysyLCExKTw9OClyZXR1cm4gdCgtMSk7Y29uc3QgZT1yLmdldFVpbnQxNihvLCExKTtpZihvKz0yLDY1NTA1PT1lKXtpZigxMTY1NTE5MjA2IT1yLmdldFVpbnQzMihvKz0yLCExKSlyZXR1cm4gdCgtMSk7Y29uc3QgZT0xODc2MT09ci5nZXRVaW50MTYobys9NiwhMSk7bys9ci5nZXRVaW50MzIobys0LGUpO2NvbnN0IGk9ci5nZXRVaW50MTYobyxlKTtvKz0yO2ZvcihsZXQgYT0wO2E8aTthKyspaWYoMjc0PT1yLmdldFVpbnQxNihvKzEyKmEsZSkpcmV0dXJuIHQoci5nZXRVaW50MTYobysxMiphKzgsZSkpfWVsc2V7aWYoNjUyODAhPSg2NTI4MCZlKSlicmVhaztvKz1yLmdldFVpbnQxNihvLCExKX19cmV0dXJuIHQoLTEpfSxpLm9uZXJyb3I9ZT0+cihlKSxpLnJlYWRBc0FycmF5QnVmZmVyKGUpfSkpfWZ1bmN0aW9uIGhhbmRsZU1heFdpZHRoT3JIZWlnaHQoZSx0KXtjb25zdHt3aWR0aDpyfT1lLHtoZWlnaHQ6aX09ZSx7bWF4V2lkdGhPckhlaWdodDpvfT10O2xldCBhLHM9ZTtyZXR1cm4gaXNGaW5pdGUobykmJihyPm98fGk+bykmJihbcyxhXT1nZXROZXdDYW52YXNBbmRDdHgocixpKSxyPmk/KHMud2lkdGg9byxzLmhlaWdodD1pL3Iqbyk6KHMud2lkdGg9ci9pKm8scy5oZWlnaHQ9byksYS5kcmF3SW1hZ2UoZSwwLDAscy53aWR0aCxzLmhlaWdodCksY2xlYW51cENhbnZhc01lbW9yeShlKSksc31mdW5jdGlvbiBmb2xsb3dFeGlmT3JpZW50YXRpb24oZSx0KXtjb25zdHt3aWR0aDpyfT1lLHtoZWlnaHQ6aX09ZSxbbyxhXT1nZXROZXdDYW52YXNBbmRDdHgocixpKTtzd2l0Y2godD40JiZ0PDk/KG8ud2lkdGg9aSxvLmhlaWdodD1yKTooby53aWR0aD1yLG8uaGVpZ2h0PWkpLHQpe2Nhc2UgMjphLnRyYW5zZm9ybSgtMSwwLDAsMSxyLDApO2JyZWFrO2Nhc2UgMzphLnRyYW5zZm9ybSgtMSwwLDAsLTEscixpKTticmVhaztjYXNlIDQ6YS50cmFuc2Zvcm0oMSwwLDAsLTEsMCxpKTticmVhaztjYXNlIDU6YS50cmFuc2Zvcm0oMCwxLDEsMCwwLDApO2JyZWFrO2Nhc2UgNjphLnRyYW5zZm9ybSgwLDEsLTEsMCxpLDApO2JyZWFrO2Nhc2UgNzphLnRyYW5zZm9ybSgwLC0xLC0xLDAsaSxyKTticmVhaztjYXNlIDg6YS50cmFuc2Zvcm0oMCwtMSwxLDAsMCxyKX1yZXR1cm4gYS5kcmF3SW1hZ2UoZSwwLDAscixpKSxjbGVhbnVwQ2FudmFzTWVtb3J5KGUpLG99ZnVuY3Rpb24gY29tcHJlc3MoZSx0LHI9MCl7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihpLG8pe2xldCBhLHMsZixsLGMsdSxoLGQsQSxnLHAsbSx3LHYsYix5LEUsRixfLEI7ZnVuY3Rpb24gaW5jUHJvZ3Jlc3MoZT01KXtpZih0LnNpZ25hbCYmdC5zaWduYWwuYWJvcnRlZCl0aHJvdyB0LnNpZ25hbC5yZWFzb247YSs9ZSx0Lm9uUHJvZ3Jlc3MoTWF0aC5taW4oYSwxMDApKX1mdW5jdGlvbiBzZXRQcm9ncmVzcyhlKXtpZih0LnNpZ25hbCYmdC5zaWduYWwuYWJvcnRlZCl0aHJvdyB0LnNpZ25hbC5yZWFzb247YT1NYXRoLm1pbihNYXRoLm1heChlLGEpLDEwMCksdC5vblByb2dyZXNzKGEpfXJldHVybiBhPXIscz10Lm1heEl0ZXJhdGlvbnx8MTAsZj0xMDI0KnQubWF4U2l6ZU1CKjEwMjQsaW5jUHJvZ3Jlc3MoKSxkcmF3RmlsZUluQ2FudmFzKGUsdCkudGhlbihmdW5jdGlvbihyKXt0cnl7cmV0dXJuWyxsXT1yLGluY1Byb2dyZXNzKCksYz1oYW5kbGVNYXhXaWR0aE9ySGVpZ2h0KGwsdCksaW5jUHJvZ3Jlc3MoKSxuZXcgUHJvbWlzZSgoZnVuY3Rpb24ocixpKXt2YXIgbztpZighKG89dC5leGlmT3JpZW50YXRpb24pKXJldHVybiBnZXRFeGlmT3JpZW50YXRpb24oZSkudGhlbihmdW5jdGlvbihlKXt0cnl7cmV0dXJuIG89ZSwkSWZfMi5jYWxsKHRoaXMpfWNhdGNoKGUpe3JldHVybiBpKGUpfX0uYmluZCh0aGlzKSxpKTtmdW5jdGlvbiAkSWZfMigpe3JldHVybiByKG8pfXJldHVybiAkSWZfMi5jYWxsKHRoaXMpfSkpLnRoZW4oZnVuY3Rpb24ocil7dHJ5e3JldHVybiB1PXIsaW5jUHJvZ3Jlc3MoKSxpc0F1dG9PcmllbnRhdGlvbkluQnJvd3NlcigpLnRoZW4oZnVuY3Rpb24ocil7dHJ5e3JldHVybiBoPXI/Yzpmb2xsb3dFeGlmT3JpZW50YXRpb24oYyx1KSxpbmNQcm9ncmVzcygpLGQ9dC5pbml0aWFsUXVhbGl0eXx8MSxBPXQuZmlsZVR5cGV8fGUudHlwZSxjYW52YXNUb0ZpbGUoaCxBLGUubmFtZSxlLmxhc3RNb2RpZmllZCxkKS50aGVuKGZ1bmN0aW9uKHIpe3RyeXt7aWYoZz1yLGluY1Byb2dyZXNzKCkscD1nLnNpemU+ZixtPWcuc2l6ZT5lLnNpemUsIXAmJiFtKXJldHVybiBzZXRQcm9ncmVzcygxMDApLGkoZyk7dmFyIGE7ZnVuY3Rpb24gJExvb3BfMygpe2lmKHMtLSYmKGI+Znx8Yj53KSl7bGV0IHQscjtyZXR1cm4gdD1CPy45NSpfLndpZHRoOl8ud2lkdGgscj1CPy45NSpfLmhlaWdodDpfLmhlaWdodCxbRSxGXT1nZXROZXdDYW52YXNBbmRDdHgodCxyKSxGLmRyYXdJbWFnZShfLDAsMCx0LHIpLGQqPVwiaW1hZ2UvcG5nXCI9PT1BPy44NTouOTUsY2FudmFzVG9GaWxlKEUsQSxlLm5hbWUsZS5sYXN0TW9kaWZpZWQsZCkudGhlbigoZnVuY3Rpb24oZSl7dHJ5e3JldHVybiB5PWUsY2xlYW51cENhbnZhc01lbW9yeShfKSxfPUUsYj15LnNpemUsc2V0UHJvZ3Jlc3MoTWF0aC5taW4oOTksTWF0aC5mbG9vcigodi1iKS8odi1mKSoxMDApKSksJExvb3BfM31jYXRjaChlKXtyZXR1cm4gbyhlKX19KSxvKX1yZXR1cm5bMV19cmV0dXJuIHc9ZS5zaXplLHY9Zy5zaXplLGI9dixfPWgsQj0hdC5hbHdheXNLZWVwUmVzb2x1dGlvbiYmcCwoYT1mdW5jdGlvbihlKXtmb3IoO2U7KXtpZihlLnRoZW4pcmV0dXJuIHZvaWQgZS50aGVuKGEsbyk7dHJ5e2lmKGUucG9wKXtpZihlLmxlbmd0aClyZXR1cm4gZS5wb3AoKT8kTG9vcF8zX2V4aXQuY2FsbCh0aGlzKTplO2U9JExvb3BfM31lbHNlIGU9ZS5jYWxsKHRoaXMpfWNhdGNoKGUpe3JldHVybiBvKGUpfX19LmJpbmQodGhpcykpKCRMb29wXzMpO2Z1bmN0aW9uICRMb29wXzNfZXhpdCgpe3JldHVybiBjbGVhbnVwQ2FudmFzTWVtb3J5KF8pLGNsZWFudXBDYW52YXNNZW1vcnkoRSksY2xlYW51cENhbnZhc01lbW9yeShjKSxjbGVhbnVwQ2FudmFzTWVtb3J5KGgpLGNsZWFudXBDYW52YXNNZW1vcnkobCksc2V0UHJvZ3Jlc3MoMTAwKSxpKHkpfX19Y2F0Y2godSl7cmV0dXJuIG8odSl9fS5iaW5kKHRoaXMpLG8pfWNhdGNoKGUpe3JldHVybiBvKGUpfX0uYmluZCh0aGlzKSxvKX1jYXRjaChlKXtyZXR1cm4gbyhlKX19LmJpbmQodGhpcyksbyl9Y2F0Y2goZSl7cmV0dXJuIG8oZSl9fS5iaW5kKHRoaXMpLG8pfSkpfWNvbnN0IGw9XCJcXG5sZXQgc2NyaXB0SW1wb3J0ZWQgPSBmYWxzZVxcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGFzeW5jIChlKSA9PiB7XFxuICBjb25zdCB7IGZpbGUsIGlkLCBpbWFnZUNvbXByZXNzaW9uTGliVXJsLCBvcHRpb25zIH0gPSBlLmRhdGFcXG4gIG9wdGlvbnMub25Qcm9ncmVzcyA9IChwcm9ncmVzcykgPT4gc2VsZi5wb3N0TWVzc2FnZSh7IHByb2dyZXNzLCBpZCB9KVxcbiAgdHJ5IHtcXG4gICAgaWYgKCFzY3JpcHRJbXBvcnRlZCkge1xcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdbd29ya2VyXSBpbXBvcnRTY3JpcHRzJywgaW1hZ2VDb21wcmVzc2lvbkxpYlVybClcXG4gICAgICBzZWxmLmltcG9ydFNjcmlwdHMoaW1hZ2VDb21wcmVzc2lvbkxpYlVybClcXG4gICAgICBzY3JpcHRJbXBvcnRlZCA9IHRydWVcXG4gICAgfVxcbiAgICAvLyBjb25zb2xlLmxvZygnW3dvcmtlcl0gc2VsZicsIHNlbGYpXFxuICAgIGNvbnN0IGNvbXByZXNzZWRGaWxlID0gYXdhaXQgaW1hZ2VDb21wcmVzc2lvbihmaWxlLCBvcHRpb25zKVxcbiAgICBzZWxmLnBvc3RNZXNzYWdlKHsgZmlsZTogY29tcHJlc3NlZEZpbGUsIGlkIH0pXFxuICB9IGNhdGNoIChlKSB7XFxuICAgIC8vIGNvbnNvbGUuZXJyb3IoJ1t3b3JrZXJdIGVycm9yJywgZSlcXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7IGVycm9yOiBlLm1lc3NhZ2UgKyAnXFxcXG4nICsgZS5zdGFjaywgaWQgfSlcXG4gIH1cXG59KVxcblwiO2xldCBjO2Z1bmN0aW9uIGNvbXByZXNzT25XZWJXb3JrZXIoZSx0KXtyZXR1cm4gbmV3IFByb21pc2UoKChyLGkpPT57Y3x8KGM9ZnVuY3Rpb24gY3JlYXRlV29ya2VyU2NyaXB0VVJMKGUpe2NvbnN0IHQ9W107cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgZT90LnB1c2goYCgke2V9KSgpYCk6dC5wdXNoKGUpLFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IodCkpfShsKSk7Y29uc3Qgbz1uZXcgV29ya2VyKGMpO28uYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwoZnVuY3Rpb24gaGFuZGxlcihlKXtpZih0LnNpZ25hbCYmdC5zaWduYWwuYWJvcnRlZClvLnRlcm1pbmF0ZSgpO2Vsc2UgaWYodm9pZCAwPT09ZS5kYXRhLnByb2dyZXNzKXtpZihlLmRhdGEuZXJyb3IpcmV0dXJuIGkobmV3IEVycm9yKGUuZGF0YS5lcnJvcikpLHZvaWQgby50ZXJtaW5hdGUoKTtyKGUuZGF0YS5maWxlKSxvLnRlcm1pbmF0ZSgpfWVsc2UgdC5vblByb2dyZXNzKGUuZGF0YS5wcm9ncmVzcyl9KSksby5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixpKSx0LnNpZ25hbCYmdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsKCgpPT57aSh0LnNpZ25hbC5yZWFzb24pLG8udGVybWluYXRlKCl9KSksby5wb3N0TWVzc2FnZSh7ZmlsZTplLGltYWdlQ29tcHJlc3Npb25MaWJVcmw6dC5saWJVUkwsb3B0aW9uczp7Li4udCxvblByb2dyZXNzOnZvaWQgMCxzaWduYWw6dm9pZCAwfX0pfSkpfWZ1bmN0aW9uIGltYWdlQ29tcHJlc3Npb24oZSx0KXtyZXR1cm4gbmV3IFByb21pc2UoKGZ1bmN0aW9uKHIsaSl7bGV0IG8sYSxzLGYsbCxjO2lmKG89ey4uLnR9LHM9MCwoe29uUHJvZ3Jlc3M6Zn09byksby5tYXhTaXplTUI9by5tYXhTaXplTUJ8fE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxsPVwiYm9vbGVhblwiIT10eXBlb2Ygby51c2VXZWJXb3JrZXJ8fG8udXNlV2ViV29ya2VyLGRlbGV0ZSBvLnVzZVdlYldvcmtlcixvLm9uUHJvZ3Jlc3M9ZT0+e3M9ZSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBmJiZmKHMpfSwhKGUgaW5zdGFuY2VvZiBCbG9ifHxlIGluc3RhbmNlb2YgQ3VzdG9tRmlsZSkpcmV0dXJuIGkobmV3IEVycm9yKFwiVGhlIGZpbGUgZ2l2ZW4gaXMgbm90IGFuIGluc3RhbmNlIG9mIEJsb2Igb3IgRmlsZVwiKSk7aWYoIS9eaW1hZ2UvLnRlc3QoZS50eXBlKSlyZXR1cm4gaShuZXcgRXJyb3IoXCJUaGUgZmlsZSBnaXZlbiBpcyBub3QgYW4gaW1hZ2VcIikpO2lmKGM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlJiZzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUsIWx8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdvcmtlcnx8YylyZXR1cm4gY29tcHJlc3MoZSxvKS50aGVuKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gYT1lLCRJZl80LmNhbGwodGhpcyl9Y2F0Y2goZSl7cmV0dXJuIGkoZSl9fS5iaW5kKHRoaXMpLGkpO3ZhciB1PWZ1bmN0aW9uKCl7dHJ5e3JldHVybiAkSWZfNC5jYWxsKHRoaXMpfWNhdGNoKGUpe3JldHVybiBpKGUpfX0uYmluZCh0aGlzKSwkVHJ5XzFfQ2F0Y2g9ZnVuY3Rpb24odCl7dHJ5e3JldHVybiBjb21wcmVzcyhlLG8pLnRoZW4oKGZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gYT1lLHUoKX1jYXRjaChlKXtyZXR1cm4gaShlKX19KSxpKX1jYXRjaChlKXtyZXR1cm4gaShlKX19O3RyeXtyZXR1cm4gby5saWJVUkw9by5saWJVUkx8fFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9icm93c2VyLWltYWdlLWNvbXByZXNzaW9uQDIuMC4yL2Rpc3QvYnJvd3Nlci1pbWFnZS1jb21wcmVzc2lvbi5qc1wiLGNvbXByZXNzT25XZWJXb3JrZXIoZSxvKS50aGVuKChmdW5jdGlvbihlKXt0cnl7cmV0dXJuIGE9ZSx1KCl9Y2F0Y2goZSl7cmV0dXJuICRUcnlfMV9DYXRjaCgpfX0pLCRUcnlfMV9DYXRjaCl9Y2F0Y2goZSl7JFRyeV8xX0NhdGNoKCl9ZnVuY3Rpb24gJElmXzQoKXt0cnl7YS5uYW1lPWUubmFtZSxhLmxhc3RNb2RpZmllZD1lLmxhc3RNb2RpZmllZH1jYXRjaChlKXt9dHJ5e28ucHJlc2VydmVFeGlmJiZcImltYWdlL2pwZWdcIj09PWUudHlwZSYmKCFvLmZpbGVUeXBlfHxvLmZpbGVUeXBlJiZvLmZpbGVUeXBlPT09ZS50eXBlKSYmKGE9Y29weUV4aWZXaXRob3V0T3JpZW50YXRpb24oZSxhKSl9Y2F0Y2goZSl7fXJldHVybiByKGEpfX0pKX1pbWFnZUNvbXByZXNzaW9uLmdldERhdGFVcmxGcm9tRmlsZT1nZXREYXRhVXJsRnJvbUZpbGUsaW1hZ2VDb21wcmVzc2lvbi5nZXRGaWxlZnJvbURhdGFVcmw9Z2V0RmlsZWZyb21EYXRhVXJsLGltYWdlQ29tcHJlc3Npb24ubG9hZEltYWdlPWxvYWRJbWFnZSxpbWFnZUNvbXByZXNzaW9uLmRyYXdJbWFnZUluQ2FudmFzPWRyYXdJbWFnZUluQ2FudmFzLGltYWdlQ29tcHJlc3Npb24uZHJhd0ZpbGVJbkNhbnZhcz1kcmF3RmlsZUluQ2FudmFzLGltYWdlQ29tcHJlc3Npb24uY2FudmFzVG9GaWxlPWNhbnZhc1RvRmlsZSxpbWFnZUNvbXByZXNzaW9uLmdldEV4aWZPcmllbnRhdGlvbj1nZXRFeGlmT3JpZW50YXRpb24saW1hZ2VDb21wcmVzc2lvbi5oYW5kbGVNYXhXaWR0aE9ySGVpZ2h0PWhhbmRsZU1heFdpZHRoT3JIZWlnaHQsaW1hZ2VDb21wcmVzc2lvbi5mb2xsb3dFeGlmT3JpZW50YXRpb249Zm9sbG93RXhpZk9yaWVudGF0aW9uLGltYWdlQ29tcHJlc3Npb24uY2xlYW51cENhbnZhc01lbW9yeT1jbGVhbnVwQ2FudmFzTWVtb3J5LGltYWdlQ29tcHJlc3Npb24uaXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXI9aXNBdXRvT3JpZW50YXRpb25JbkJyb3dzZXIsaW1hZ2VDb21wcmVzc2lvbi5hcHByb3hpbWF0ZUJlbG93TWF4aW11bUNhbnZhc1NpemVPZkJyb3dzZXI9YXBwcm94aW1hdGVCZWxvd01heGltdW1DYW52YXNTaXplT2ZCcm93c2VyLGltYWdlQ29tcHJlc3Npb24uY29weUV4aWZXaXRob3V0T3JpZW50YXRpb249Y29weUV4aWZXaXRob3V0T3JpZW50YXRpb24saW1hZ2VDb21wcmVzc2lvbi5nZXRCcm93c2VyTmFtZT1nZXRCcm93c2VyTmFtZSxpbWFnZUNvbXByZXNzaW9uLnZlcnNpb249XCIyLjAuMlwiO2V4cG9ydHtpbWFnZUNvbXByZXNzaW9uIGFzIGRlZmF1bHR9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnJvd3Nlci1pbWFnZS1jb21wcmVzc2lvbi5tanMubWFwXG4iLCJpbXBvcnQgeyBhcHBlbmQsIGF0dHIsIGNyZWF0ZSwgZmluZCwgZm9jdXMsIHJlbW92ZSwgcmVtb3ZlQXR0ciB9IGZyb20gJy4uL3V0aWxzL0pxdWVyeVdyYXBwZXJzJ1xyXG5pbXBvcnQgeyBpc1Zlcmlvc25BZnRlcjEzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnXHJcblxyXG5jb25zdCB0b2dnbGVDaGF0ID0gKGNoYXQ6IEpRdWVyeSwgdG9nZ2xlOiBib29sZWFuKSA9PiB7XHJcbiAgaWYgKCF0b2dnbGUpIHtcclxuICAgIGF0dHIoY2hhdCwgJ2Rpc2FibGVkJywgdHJ1ZSlcclxuICAgIHJldHVyblxyXG4gIH1cclxuICByZW1vdmVBdHRyKGNoYXQsICdkaXNhYmxlZCcpXHJcbiAgZm9jdXMoY2hhdClcclxufVxyXG5cclxuY29uc3QgdG9nZ2xlU3Bpbm5lciA9IChjaGF0Rm9ybTogSlF1ZXJ5LCB0b2dnbGU6IGJvb2xlYW4pID0+IHtcclxuICBjb25zdCBzcGlubmVySWQgPSAnY2ktc3Bpbm5lcidcclxuICBjb25zdCBzcGlubmVyID0gZmluZChgIyR7c3Bpbm5lcklkfWAsIGNoYXRGb3JtKVxyXG5cclxuICBpZiAoIXRvZ2dsZSAmJiBzcGlubmVyWzBdKSB7XHJcbiAgICByZW1vdmUoc3Bpbm5lcilcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgaWYgKHRvZ2dsZSAmJiAhc3Bpbm5lclswXSkge1xyXG4gICAgY29uc3QgbmV3U3Bpbm5lciA9IGNyZWF0ZShgPGRpdiBpZD1cIiR7c3Bpbm5lcklkfVwiPjwvZGl2PmApXHJcbiAgICBhcHBlbmQoY2hhdEZvcm0sIG5ld1NwaW5uZXIpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VXBsb2FkaW5nU3RhdGVzID0gKHNpZGViYXI6IEpRdWVyeSkgPT4ge1xyXG4gIGNvbnN0IGNoYXRGb3JtUXVlcnkgPSBpc1Zlcmlvc25BZnRlcjEzKCkgPyAnLmNoYXQtZm9ybScgOiAnI2NoYXQtZm9ybSdcclxuICBjb25zdCBjaGF0Rm9ybSA9IGZpbmQoY2hhdEZvcm1RdWVyeSwgc2lkZWJhcilcclxuICBjb25zdCBjaGF0ID0gZmluZCgnI2NoYXQtbWVzc2FnZScsIHNpZGViYXIpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvbigpIHtcclxuICAgICAgdG9nZ2xlQ2hhdChjaGF0LCBmYWxzZSlcclxuICAgICAgdG9nZ2xlU3Bpbm5lcihjaGF0Rm9ybSwgdHJ1ZSlcclxuICAgIH0sXHJcbiAgICBvZmYoKSB7XHJcbiAgICAgIHRvZ2dsZUNoYXQoY2hhdCwgdHJ1ZSlcclxuICAgICAgdG9nZ2xlU3Bpbm5lcihjaGF0Rm9ybSwgZmFsc2UpXHJcbiAgICB9LFxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBPUklHSU5fRk9MREVSLCB0LCBGaWxlUGlja2VySW1wbGVtZW50YXRpb24gfSBmcm9tICcuL1V0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVVcGxvYWRGb2xkZXIgPSBhc3luYyAodXBsb2FkTG9jYXRpb24/OiBzdHJpbmcpID0+IHtcclxuICBjb25zdCBsb2NhdGlvbiA9IHVwbG9hZExvY2F0aW9uIHx8IGdldFNldHRpbmcoJ3VwbG9hZExvY2F0aW9uJylcclxuICB0cnkge1xyXG4gICAgY29uc3QgZm9sZGVyTG9jYXRpb24gPSBhd2FpdCBGaWxlUGlja2VySW1wbGVtZW50YXRpb24oKS5icm93c2UoT1JJR0lOX0ZPTERFUiwgbG9jYXRpb24pXHJcbiAgICBpZiAoZm9sZGVyTG9jYXRpb24udGFyZ2V0ID09PSAnLicpIGF3YWl0IEZpbGVQaWNrZXJJbXBsZW1lbnRhdGlvbigpLmNyZWF0ZURpcmVjdG9yeShPUklHSU5fRk9MREVSLCBsb2NhdGlvbiwge30pXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgRmlsZVBpY2tlckltcGxlbWVudGF0aW9uKCkuY3JlYXRlRGlyZWN0b3J5KE9SSUdJTl9GT0xERVIsIGxvY2F0aW9uLCB7fSlcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAvLyBUaGUgRmlsZVBpY2tlciB0aG9yd3MgYW4gZXJyb3Igd2hlbiB5b3UgaGF2ZSBhIHVzZXIgd2l0aG91dCB1cGxvYWQgcGVybWlzc2lvbnNcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTZXR0aW5nID0gKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB7XHJcbiAgLy8gQHRzLWlnbm9yZVxyXG4gIHJldHVybiAoZ2FtZSBhcyBHYW1lKS5zZXR0aW5ncy5zZXQoJ2NoYXQtaW1hZ2VzJywga2V5LCB2YWx1ZSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNldHRpbmdzID0gKCkgPT4gW1xyXG4gIHtcclxuICAgIGtleTogJ3VwbG9hZEJ1dHRvbicsXHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIG5hbWU6IHQoJ3VwbG9hZEJ1dHRvbicpLFxyXG4gICAgICBoaW50OiB0KCd1cGxvYWRCdXR0b25IaW50JyksXHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgIGNvbmZpZzogdHJ1ZSxcclxuICAgICAgcmVxdWlyZXNSZWxvYWQ6IHRydWUsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAge1xyXG4gICAga2V5OiAndXBsb2FkTG9jYXRpb24nLFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICBuYW1lOiB0KCd1cGxvYWRMb2NhdGlvbicpLFxyXG4gICAgICBoaW50OiB0KCd1cGxvYWRMb2NhdGlvbkhpbnQnKSxcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAndXBsb2FkZWQtY2hhdC1pbWFnZXMnLFxyXG4gICAgICBzY29wZTogJ3dvcmxkJyxcclxuICAgICAgY29uZmlnOiB0cnVlLFxyXG4gICAgICByZXN0cmljdGVkOiB0cnVlLFxyXG4gICAgICBvbkNoYW5nZTogYXN5bmMgKG5ld1VwbG9hZExvY2F0aW9uOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBkZWZhdWx0TG9jYXRpb24gPSAndXBsb2FkZWQtY2hhdC1pbWFnZXMnXHJcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gbmV3VXBsb2FkTG9jYXRpb24udHJpbSgpXHJcbiAgICAgICAgbGV0IHNob3VsZENoYW5nZUxvY2F0aW9uID0gZmFsc2VcclxuXHJcbiAgICAgICAgaWYgKCFsb2NhdGlvbikge1xyXG4gICAgICAgICAgbG9jYXRpb24gPSBkZWZhdWx0TG9jYXRpb25cclxuICAgICAgICAgIHNob3VsZENoYW5nZUxvY2F0aW9uID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9jYXRpb24gPSBsb2NhdGlvbi5yZXBsYWNlKC9cXHMrL2csICctJylcclxuICAgICAgICBpZiAobmV3VXBsb2FkTG9jYXRpb24gIT09IGxvY2F0aW9uKSBzaG91bGRDaGFuZ2VMb2NhdGlvbiA9IHRydWVcclxuXHJcbiAgICAgICAgYXdhaXQgY3JlYXRlVXBsb2FkRm9sZGVyKGxvY2F0aW9uKVxyXG4gICAgICAgIGlmIChzaG91bGRDaGFuZ2VMb2NhdGlvbikgYXdhaXQgc2V0U2V0dGluZygndXBsb2FkTG9jYXRpb24nLCBsb2NhdGlvbilcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuXVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyU2V0dGluZyA9IChzZXR0aW5nOiB7IGtleTogc3RyaW5nLCBvcHRpb25zOiBhbnkgfSkgPT4ge1xyXG4gIC8vIEB0cy1pZ25vcmVcclxuICByZXR1cm4gKGdhbWUgYXMgR2FtZSkuc2V0dGluZ3MucmVnaXN0ZXIoJ2NoYXQtaW1hZ2VzJywgc2V0dGluZy5rZXksIHNldHRpbmcub3B0aW9ucylcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNldHRpbmcgPSAoa2V5OiBzdHJpbmcpOiBhbnkgPT4ge1xyXG4gIC8vIEB0cy1pZ25vcmVcclxuICByZXR1cm4gKGdhbWUgYXMgR2FtZSkuc2V0dGluZ3MuZ2V0KCdjaGF0LWltYWdlcycsIGtleSlcclxufVxyXG4iLCJpbXBvcnQgeyBGaWxlUGlja2VySW1wbGVtZW50YXRpb24sIE9SSUdJTl9GT0xERVIsIHJhbmRvbVN0cmluZywgdCwgdXNlckNhblVwbG9hZCB9IGZyb20gJy4uL3V0aWxzL1V0aWxzJ1xyXG5pbXBvcnQgeyBhZGRDbGFzcywgYXBwZW5kLCBjcmVhdGUsIGZpbmQsIG9uLCByZW1vdmUsIHJlbW92ZUNsYXNzIH0gZnJvbSAnLi4vdXRpbHMvSnF1ZXJ5V3JhcHBlcnMnXHJcbmltcG9ydCBpbWFnZUNvbXByZXNzaW9uIGZyb20gJ2Jyb3dzZXItaW1hZ2UtY29tcHJlc3Npb24nXHJcbmltcG9ydCB7IGdldFVwbG9hZGluZ1N0YXRlcyB9IGZyb20gJy4uL2NvbXBvbmVudHMvTG9hZGVyJ1xyXG5pbXBvcnQgeyBnZXRTZXR0aW5nIH0gZnJvbSAnLi4vdXRpbHMvU2V0dGluZ3MnXHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIHNpbmdsZSBpbWFnZSBzZWxlY3RlZC9xdWV1ZWQgZm9yIGNoYXQuXHJcbiAqXHJcbiAqIC0gYHR5cGVgICAgICDihpIgTUlNRSB0eXBlIChlLmcuIFwiaW1hZ2UvcG5nXCIpXHJcbiAqIC0gYG5hbWVgICAgICDihpIgb3JpZ2luYWwgZmlsZW5hbWUgZnJvbSBkaXNrXHJcbiAqIC0gYGZpbGVgICAgICDihpIgRmlsZSBvYmplY3QgKGZvciBsb2NhbCB1cGxvYWRzIG9ubHkpXHJcbiAqIC0gYGltYWdlU3JjYCDihpIgZWl0aGVyIGEgRGF0YVVSTCwgYSByZW1vdGUgVVJMLCBvciBhIGZpbmFsIHVwbG9hZGVkIHBhdGhcclxuICogLSBgaWRgICAgICAgIOKGkiByYW5kb20gSUQgdXNlZCB0byBpZGVudGlmeSBpdHMgRE9NIHByZXZpZXcgYW5kIGZpbGVuYW1lIGJhc2VcclxuICovXHJcbmV4cG9ydCB0eXBlIFNhdmVWYWx1ZVR5cGUgPSB7XHJcbiAgdHlwZT86IHN0cmluZyxcclxuICBuYW1lPzogc3RyaW5nLFxyXG4gIGZpbGU/OiBGaWxlLFxyXG4gIGltYWdlU3JjOiBzdHJpbmcgfCBBcnJheUJ1ZmZlciB8IG51bGwsXHJcbiAgaWQ6IHN0cmluZyxcclxufVxyXG5cclxuLyoqXHJcbiAqIEFueSBpbWFnZSBjb21pbmcgZnJvbSB0aGVzZSBkb21haW5zIHdpbGwgYmUgcmVqZWN0ZWQgd2hlbiBwYXN0ZWQvZHJvcHBlZFxyXG4gKiAodG8gYXZvaWQgaG90LWxpbmtpbmcgZnJvbSBjZXJ0YWluIHNpdGVzKS5cclxuICovXHJcbmNvbnN0IFJFU1RSSUNURURfRE9NQUlOUyA9IFsnc3RhdGljLndpa2lhJ11cclxuXHJcbi8qKlxyXG4gKiBTaGFyZWQgRE9NUGFyc2VyIGluc3RhbmNlIHVzZWQgdG8gcGFyc2UgSFRNTCBmcm9tIGNsaXBib2FyZC9kcmFnIGRhdGEuXHJcbiAqL1xyXG5jb25zdCBET01fUEFSU0VSID0gbmV3IERPTVBhcnNlcigpXHJcblxyXG4vKipcclxuICogR2xvYmFsIHF1ZXVlIG9mIGltYWdlcyBjdXJyZW50bHkgYXR0YWNoZWQgdG8gdGhlIGNoYXQgaW5wdXQuXHJcbiAqIFdoZW4gdGhlIHVzZXIgc2VuZHMgYSBtZXNzYWdlLCB0aGlzIGlzIHR5cGljYWxseSByZWFkIGFuZCB0aGVuIGNsZWFyZWQuXHJcbiAqL1xyXG5sZXQgaW1hZ2VRdWV1ZTogU2F2ZVZhbHVlVHlwZVtdID0gW11cclxuXHJcbi8qKlxyXG4gKiBDaGVja3Mgd2hldGhlciBhIEZpbGUgb3IgRGF0YVRyYW5zZmVySXRlbSBpcyBhbiBpbWFnZSBiYXNlZCBvbiBpdHMgTUlNRSB0eXBlLlxyXG4gKi9cclxuY29uc3QgaXNGaWxlSW1hZ2UgPSAoZmlsZTogRmlsZSB8IERhdGFUcmFuc2Zlckl0ZW0pID0+IHtcclxuICAvLyBAdHMtaWdub3JlIOKAkyBEYXRhVHJhbnNmZXJJdGVtIGhhcyAudHlwZSBhdCBydW50aW1lXHJcbiAgY29uc3QgcmVzdWx0ID0gZmlsZS50eXBlICYmIGZpbGUudHlwZS5zdGFydHNXaXRoKCdpbWFnZS8nKVxyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGlzRmlsZUltYWdlIOKGkicsIHsgZmlsZSwgaXNJbWFnZTogcmVzdWx0IH0pXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyB0aGUgRE9NIHNuaXBwZXQgZm9yIGFuIGltYWdlIHByZXZpZXcgYmxvY2sgaW4gdGhlIHVwbG9hZCBhcmVhLlxyXG4gKiBUaGlzIGluY2x1ZGVzOlxyXG4gKiAtIHdyYXBwZXIgZGl2IHdpdGggdW5pcXVlIElEXHJcbiAqIC0gcmVtb3ZlIChYKSBpY29uXHJcbiAqIC0gaW1nIHRhZyBmb3IgdGhlIHByZXZpZXdcclxuICovXHJcbmNvbnN0IGNyZWF0ZUltYWdlUHJldmlldyA9ICh7IGltYWdlU3JjLCBpZCB9OiBTYXZlVmFsdWVUeXBlKTogSlF1ZXJ5ID0+IHtcclxuICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBjcmVhdGVJbWFnZVByZXZpZXcg4oaSJywgeyBpZCwgaW1hZ2VTcmMgfSlcclxuICByZXR1cm4gY3JlYXRlKFxyXG4gICAgYDxkaXYgaWQ9XCIke2lkfVwiIGNsYXNzPVwiY2ktdXBsb2FkLWFyZWEtaW1hZ2VcIj5cclxuICAgICAgICA8aSBjbGFzcz1cImNpLXJlbW92ZS1pbWFnZS1pY29uIGZhLXJlZ3VsYXIgZmEtY2lyY2xlLXhtYXJrXCI+PC9pPlxyXG4gICAgICAgIDxpbWcgY2xhc3M9XCJjaS1pbWFnZS1wcmV2aWV3XCIgc3JjPVwiJHtpbWFnZVNyY31cIiBhbHQ9XCIke3QoJ3VuYWJsZVRvTG9hZEltYWdlJyl9XCIvPlxyXG4gICAgIDwvZGl2PmBcclxuICApXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGEgY2xpY2sgaGFuZGxlciB0byB0aGUgXCJyZW1vdmUgaW1hZ2VcIiBpY29uIG9uIGVhY2ggcHJldmlldy5cclxuICogV2hlbiBjbGlja2VkOlxyXG4gKiAtIHJlbW92ZXMgdGhlIHByZXZpZXcgZnJvbSB0aGUgRE9NXHJcbiAqIC0gcmVtb3ZlcyB0aGUgY29ycmVzcG9uZGluZyBlbnRyeSBmcm9tIGltYWdlUXVldWVcclxuICogLSBoaWRlcyB0aGUgdXBsb2FkIGFyZWEgaWYgbm8gaW1hZ2VzIHJlbWFpblxyXG4gKi9cclxuY29uc3QgYWRkRXZlbnRUb1JlbW92ZUJ1dHRvbiA9IChyZW1vdmVCdXR0b246IEpRdWVyeSwgc2F2ZVZhbHVlOiBTYXZlVmFsdWVUeXBlLCB1cGxvYWRBcmVhOiBKUXVlcnkpID0+IHtcclxuICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBhZGRFdmVudFRvUmVtb3ZlQnV0dG9uIOKGkiBiaW5kaW5nIHJlbW92ZSBmb3IgaWQnLCBzYXZlVmFsdWUuaWQpXHJcblxyXG4gIGNvbnN0IHJlbW92ZUV2ZW50SGFuZGxlciA9ICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHJlbW92ZUV2ZW50SGFuZGxlciDihpIgQ0xJQ0tFRCBmb3IgaWQnLCBzYXZlVmFsdWUuaWQpXHJcblxyXG4gICAgY29uc3QgaW1hZ2UgPSBmaW5kKGAjJHtzYXZlVmFsdWUuaWR9YCwgdXBsb2FkQXJlYSlcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHJlbW92ZUV2ZW50SGFuZGxlciDihpIgZm91bmQgaW1hZ2UgZWxlbWVudCcsIGltYWdlKVxyXG5cclxuICAgIHJlbW92ZShpbWFnZSlcclxuICAgIGltYWdlUXVldWUgPSBpbWFnZVF1ZXVlLmZpbHRlcigoaW1nRGF0YTogU2F2ZVZhbHVlVHlwZSkgPT4gc2F2ZVZhbHVlLmlkICE9PSBpbWdEYXRhLmlkKVxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gcmVtb3ZlRXZlbnRIYW5kbGVyIOKGkiB1cGRhdGVkIGltYWdlUXVldWUnLCBpbWFnZVF1ZXVlKVxyXG5cclxuICAgIGlmIChpbWFnZVF1ZXVlLmxlbmd0aCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSByZW1vdmVFdmVudEhhbmRsZXIg4oaSIGltYWdlcyBzdGlsbCBpbiBxdWV1ZSwgbm90IGhpZGluZyB1cGxvYWRBcmVhJylcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gcmVtb3ZlRXZlbnRIYW5kbGVyIOKGkiBxdWV1ZSBlbXB0eSwgaGlkaW5nIHVwbG9hZEFyZWEnKVxyXG4gICAgYWRkQ2xhc3ModXBsb2FkQXJlYSwgJ2hpZGRlbicpXHJcbiAgfVxyXG5cclxuICBvbihyZW1vdmVCdXR0b24sICdjbGljaycsIHJlbW92ZUV2ZW50SGFuZGxlcilcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbXByZXNzZXMgYW5kIHVwbG9hZHMgYSBzaW5nbGUgaW1hZ2UgZmlsZSB0byBGb3VuZHJ5J3MgZmlsZSBzeXN0ZW0uXHJcbiAqXHJcbiAqIFN0ZXBzOlxyXG4gKiAxLiBHZW5lcmF0ZSBhIG5ldyBmaWxlbmFtZSBiYXNlZCBvbiB0aGUgaW1hZ2UncyBpZCBhbmQgZXh0ZW5zaW9uLlxyXG4gKiAyLiBDb21wcmVzcyB0aGUgaW1hZ2UgKHVwIHRvIH4xLjVNQiwgcHJlc2VydmluZyByZXNvbHV0aW9uKS5cclxuICogMy4gVXBsb2FkIHZpYSBGaWxlUGlja2VySW1wbGVtZW50YXRpb24gdG8gdGhlIGNvbmZpZ3VyZWQgdXBsb2FkTG9jYXRpb24uXHJcbiAqIDQuIFJldHVybiB0aGUgdXBsb2FkZWQgZmlsZSBwYXRoLCBvciBmYWxsIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGltYWdlU3JjIG9uIGVycm9yLlxyXG4gKi9cclxuY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAoc2F2ZVZhbHVlOiBTYXZlVmFsdWVUeXBlKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICBjb25zdCBnZW5lcmF0ZUZpbGVOYW1lID0gKHNhdmVWYWx1ZTogU2F2ZVZhbHVlVHlwZSkgPT4ge1xyXG4gICAgY29uc3QgeyB0eXBlLCBuYW1lLCBpZCB9ID0gc2F2ZVZhbHVlXHJcbiAgICBjb25zdCBmaWxlRXh0ZW5zaW9uOiBzdHJpbmcgPVxyXG4gICAgICBuYW1lPy5zdWJzdHJpbmcobmFtZS5sYXN0SW5kZXhPZignLicpLCBuYW1lLmxlbmd0aCkgfHxcclxuICAgICAgdHlwZT8ucmVwbGFjZSgnaW1hZ2UvJywgJy4nKSB8fFxyXG4gICAgICAnLmpwZWcnXHJcbiAgICBjb25zdCByZXN1bHQgPSBgJHtpZH0ke2ZpbGVFeHRlbnNpb259YFxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gZ2VuZXJhdGVGaWxlTmFtZSDihpInLCB7IG5hbWUsIHR5cGUsIGlkLCBmaWxlRXh0ZW5zaW9uLCByZXN1bHQgfSlcclxuICAgIHJldHVybiByZXN1bHRcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSB1cGxvYWRJbWFnZSDihpIgU1RBUlQnLCBzYXZlVmFsdWUpXHJcblxyXG4gICAgY29uc3QgbmV3TmFtZSA9IGdlbmVyYXRlRmlsZU5hbWUoc2F2ZVZhbHVlKVxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gdXBsb2FkSW1hZ2Ug4oaSIG5ld05hbWUnLCBuZXdOYW1lKVxyXG5cclxuICAgIGNvbnN0IGNvbXByZXNzZWRJbWFnZSA9IGF3YWl0IGltYWdlQ29tcHJlc3Npb24oc2F2ZVZhbHVlLmZpbGUgYXMgRmlsZSwge1xyXG4gICAgICBtYXhTaXplTUI6IDEuNSxcclxuICAgICAgdXNlV2ViV29ya2VyOiB0cnVlLFxyXG4gICAgICBhbHdheXNLZWVwUmVzb2x1dGlvbjogdHJ1ZSxcclxuICAgIH0pXHJcbiAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSB1cGxvYWRJbWFnZSDihpIgY29tcHJlc3NlZEltYWdlJywgY29tcHJlc3NlZEltYWdlKVxyXG5cclxuICAgIGNvbnN0IG5ld0ltYWdlID0gbmV3IEZpbGUoW2NvbXByZXNzZWRJbWFnZSBhcyBGaWxlXSwgbmV3TmFtZSwgeyB0eXBlOiBzYXZlVmFsdWUudHlwZSB9KVxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gdXBsb2FkSW1hZ2Ug4oaSIG5ld0ltYWdlJywgbmV3SW1hZ2UpXHJcblxyXG4gICAgY29uc3QgdXBsb2FkTG9jYXRpb24gPSBnZXRTZXR0aW5nKCd1cGxvYWRMb2NhdGlvbicpXHJcbiAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSB1cGxvYWRJbWFnZSDihpIgdXBsb2FkTG9jYXRpb24nLCB1cGxvYWRMb2NhdGlvbilcclxuXHJcbiAgICAvLyBAdHMtaWdub3JlIOKAkyBGaWxlUGlja2VySW1wbGVtZW50YXRpb24gdHlwZSBpcyBub3QgZnVsbHkga25vd24gaGVyZVxyXG4gICAgY29uc3QgaW1hZ2VMb2NhdGlvbiA9IGF3YWl0IEZpbGVQaWNrZXJJbXBsZW1lbnRhdGlvbigpLnVwbG9hZChcclxuICAgICAgT1JJR0lOX0ZPTERFUixcclxuICAgICAgdXBsb2FkTG9jYXRpb24sXHJcbiAgICAgIG5ld0ltYWdlLFxyXG4gICAgICB7fSxcclxuICAgICAgeyBub3RpZnk6IGZhbHNlIH1cclxuICAgIClcclxuXHJcbiAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSB1cGxvYWRJbWFnZSDihpIgdXBsb2FkIHJlc3VsdCcsIGltYWdlTG9jYXRpb24pXHJcblxyXG4gICAgaWYgKCFpbWFnZUxvY2F0aW9uIHx8ICEoaW1hZ2VMb2NhdGlvbiBhcyBGaWxlUGlja2VyLlVwbG9hZFJldHVybik/LnBhdGgpIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICdbQ0k6REVCVUddIHVwbG9hZEltYWdlIOKGkiBubyBwYXRoIHJldHVybmVkIGZyb20gdXBsb2FkLCBmYWxsaW5nIGJhY2sgdG8gb3JpZ2luYWwgaW1hZ2VTcmMnLFxyXG4gICAgICAgIGltYWdlTG9jYXRpb25cclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gc2F2ZVZhbHVlLmltYWdlU3JjIGFzIHN0cmluZ1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhdGggPSAoaW1hZ2VMb2NhdGlvbiBhcyBGaWxlUGlja2VyLlVwbG9hZFJldHVybikucGF0aFxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gdXBsb2FkSW1hZ2Ug4oaSIHJldHVybmluZyBwYXRoJywgcGF0aClcclxuICAgIHJldHVybiBwYXRoXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5lcnJvcignW0NJOkRFQlVHXSB1cGxvYWRJbWFnZSDihpIgRVJST1IsIGZhbGxpbmcgYmFjayB0byBpbWFnZVNyYycsIGUpXHJcbiAgICByZXR1cm4gc2F2ZVZhbHVlLmltYWdlU3JjIGFzIHN0cmluZ1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENvcmUgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIFNhdmVWYWx1ZVR5cGUgYW5kOlxyXG4gKiAtIChvcHRpb25hbGx5KSB1cGxvYWRzIHRoZSBmaWxlIHRvIEZvdW5kcnkgaWYgaXQgaGFzIGEgbG9jYWwgRmlsZVxyXG4gKiAtIGNyZWF0ZXMgYSBwcmV2aWV3IERPTSBibG9ja1xyXG4gKiAtIHNob3dzIHRoZSB1cGxvYWQgYXJlYVxyXG4gKiAtIHB1c2hlcyB0aGUgaW1hZ2UgaW50byB0aGUgZ2xvYmFsIGltYWdlUXVldWVcclxuICogLSB3aXJlcyB1cCB0aGUgcmVtb3ZlIGJ1dHRvblxyXG4gKlxyXG4gKiBOT1RFOiBUaGlzIGlzIGtlcHQgc3RydWN0dXJhbGx5IGlkZW50aWNhbCB0byB5b3VyIG9yaWdpbmFsIGNvZGUuXHJcbiAqIFRoZSBvbmx5IGFkZGl0aW9ucyBhcmUgbG9nZ2luZyBjYWxscyBhbmQgY29tbWVudHMuXHJcbiAqL1xyXG5jb25zdCBhZGRJbWFnZVRvUXVldWUgPSBhc3luYyAoc2F2ZVZhbHVlOiBTYXZlVmFsdWVUeXBlLCBzaWRlYmFyOiBKUXVlcnkpID0+IHtcclxuICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBhZGRJbWFnZVRvUXVldWUg4oaSIFNUQVJUJywgeyBzYXZlVmFsdWUsIHNpZGViYXIgfSlcclxuXHJcbiAgY29uc3QgdXBsb2FkaW5nU3RhdGVzID0gZ2V0VXBsb2FkaW5nU3RhdGVzKHNpZGViYXIpXHJcbiAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gYWRkSW1hZ2VUb1F1ZXVlIOKGkiBnb3QgdXBsb2FkaW5nU3RhdGVzJywgdXBsb2FkaW5nU3RhdGVzKVxyXG5cclxuICB1cGxvYWRpbmdTdGF0ZXMub24oKVxyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGFkZEltYWdlVG9RdWV1ZSDihpIgdXBsb2FkaW5nU3RhdGVzLm9uKCkgY2FsbGVkJylcclxuXHJcbiAgY29uc3QgdXBsb2FkQXJlYTogSlF1ZXJ5ID0gZmluZCgnI2NpLWNoYXQtdXBsb2FkLWFyZWEnLCBzaWRlYmFyKVxyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGFkZEltYWdlVG9RdWV1ZSDihpIgdXBsb2FkQXJlYSBsb29rdXAnLCB1cGxvYWRBcmVhKVxyXG5cclxuICAvLyBFQVJMWSBSRVRVUk4gUEFUSCAjMTogdXBsb2FkIGFyZWEgbWlzc2luZ1xyXG4gIGlmICghdXBsb2FkQXJlYSB8fCAhdXBsb2FkQXJlYVswXSkge1xyXG4gICAgY29uc29sZS53YXJuKCdbQ0k6REVCVUddIGFkZEltYWdlVG9RdWV1ZSDihpIgdXBsb2FkQXJlYSBOT1QgRk9VTkQsIHJldHVybmluZyBlYXJseSBXSVRIT1VUIHR1cm5pbmcgc3Bpbm5lciBvZmYnKVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICBpZiAoc2F2ZVZhbHVlLmZpbGUpIHtcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGFkZEltYWdlVG9RdWV1ZSDihpIgc2F2ZVZhbHVlIGhhcyBmaWxlLCBjaGVja2luZyBwZXJtaXNzaW9ucycsIHNhdmVWYWx1ZS5maWxlKVxyXG5cclxuICAgIGlmICghdXNlckNhblVwbG9hZCgpKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW0NJOkRFQlVHXSBhZGRJbWFnZVRvUXVldWUg4oaSIHVzZXJDYW5VcGxvYWQoKSA9IEZBTFNFLCB0dXJuaW5nIHNwaW5uZXIgb2ZmIGFuZCByZXR1cm5pbmcnKVxyXG4gICAgICB1cGxvYWRpbmdTdGF0ZXMub2ZmKClcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gYWRkSW1hZ2VUb1F1ZXVlIOKGkiB1c2VyQ2FuVXBsb2FkKCkgPSBUUlVFLCBjYWxsaW5nIHVwbG9hZEltYWdlJylcclxuICAgIHNhdmVWYWx1ZS5pbWFnZVNyYyA9IGF3YWl0IHVwbG9hZEltYWdlKHNhdmVWYWx1ZSlcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGFkZEltYWdlVG9RdWV1ZSDihpIgdXBsb2FkSW1hZ2UgZmluaXNoZWQsIHVwZGF0ZWQgaW1hZ2VTcmMnLCBzYXZlVmFsdWUuaW1hZ2VTcmMpXHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGFkZEltYWdlVG9RdWV1ZSDihpIgbm8gZmlsZSBwcmVzZW50IChsaWtlbHkgVVJML3Bhc3RlKScsIHNhdmVWYWx1ZS5pbWFnZVNyYylcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGFkZEltYWdlVG9RdWV1ZSDihpIgY3JlYXRpbmcgaW1hZ2UgcHJldmlldycpXHJcbiAgY29uc3QgaW1hZ2VQcmV2aWV3ID0gY3JlYXRlSW1hZ2VQcmV2aWV3KHNhdmVWYWx1ZSlcclxuICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBhZGRJbWFnZVRvUXVldWUg4oaSIGltYWdlUHJldmlldyByZXN1bHQnLCBpbWFnZVByZXZpZXcpXHJcblxyXG4gIC8vIEVBUkxZIFJFVFVSTiBQQVRIICMyOiBubyBwcmV2aWV3IGNyZWF0ZWRcclxuICBpZiAoIWltYWdlUHJldmlldyB8fCAhaW1hZ2VQcmV2aWV3WzBdKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICdbQ0k6REVCVUddIGFkZEltYWdlVG9RdWV1ZSDihpIgaW1hZ2VQcmV2aWV3IGlzIEVNUFRZLCByZXR1cm5pbmcgZWFybHkgV0lUSE9VVCB0dXJuaW5nIHNwaW5uZXIgb2ZmJ1xyXG4gICAgKVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBhZGRJbWFnZVRvUXVldWUg4oaSIHNob3dpbmcgdXBsb2FkQXJlYSBhbmQgYXBwZW5kaW5nIHByZXZpZXcnKVxyXG4gIHJlbW92ZUNsYXNzKHVwbG9hZEFyZWEsICdoaWRkZW4nKVxyXG4gIGFwcGVuZCh1cGxvYWRBcmVhLCBpbWFnZVByZXZpZXcpXHJcblxyXG4gIGltYWdlUXVldWUucHVzaChzYXZlVmFsdWUpXHJcbiAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gYWRkSW1hZ2VUb1F1ZXVlIOKGkiBwdXNoZWQgdG8gaW1hZ2VRdWV1ZScsIGltYWdlUXVldWUpXHJcblxyXG4gIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGZpbmQoJy5jaS1yZW1vdmUtaW1hZ2UtaWNvbicsIGltYWdlUHJldmlldylcclxuICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBhZGRJbWFnZVRvUXVldWUg4oaSIHJlbW92ZUJ1dHRvbiBsb29rdXAnLCByZW1vdmVCdXR0b24pXHJcblxyXG4gIGFkZEV2ZW50VG9SZW1vdmVCdXR0b24ocmVtb3ZlQnV0dG9uLCBzYXZlVmFsdWUsIHVwbG9hZEFyZWEpXHJcbiAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gYWRkSW1hZ2VUb1F1ZXVlIOKGkiByZW1vdmUgZXZlbnQgYm91bmQnKVxyXG5cclxuICB1cGxvYWRpbmdTdGF0ZXMub2ZmKClcclxuICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBhZGRJbWFnZVRvUXVldWUg4oaSIHVwbG9hZGluZ1N0YXRlcy5vZmYoKSBjYWxsZWQsIEVORCcpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVyIGZhY3RvcnkgdXNlZCB3aGVuIHJlYWRpbmcgZmlsZXMgdmlhIEZpbGVSZWFkZXIuXHJcbiAqIEZvciBlYWNoIGZpbGU6XHJcbiAqIC0gRmlsZVJlYWRlciByZWFkcyBpdCBhcyBEYXRhVVJMXHJcbiAqIC0gd2hlbiBsb2FkZWQsIHRoaXMgaGFuZGxlciBpcyBjYWxsZWRcclxuICogLSBhIFNhdmVWYWx1ZVR5cGUgaXMgY3JlYXRlZCBhbmQgcGFzc2VkIHRvIGFkZEltYWdlVG9RdWV1ZVxyXG4gKi9cclxuY29uc3QgaW1hZ2VzRmlsZVJlYWRlckhhbmRsZXIgPVxyXG4gIChmaWxlOiBGaWxlLCBzaWRlYmFyOiBKUXVlcnkpID0+XHJcbiAgYXN5bmMgKGV2dDogRXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGltYWdlU3JjID0gKGV2dC50YXJnZXQgYXMgRmlsZVJlYWRlcik/LnJlc3VsdFxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gaW1hZ2VzRmlsZVJlYWRlckhhbmRsZXIg4oaSIGZpbGUgbG9hZGVkJywgeyBmaWxlLCBpbWFnZVNyYyB9KVxyXG5cclxuICAgIGNvbnN0IHNhdmVWYWx1ZTogU2F2ZVZhbHVlVHlwZSA9IHtcclxuICAgICAgdHlwZTogZmlsZS50eXBlLFxyXG4gICAgICBuYW1lOiBmaWxlLm5hbWUsXHJcbiAgICAgIGltYWdlU3JjLFxyXG4gICAgICBpZDogcmFuZG9tU3RyaW5nKCksXHJcbiAgICAgIGZpbGUsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gaW1hZ2VzRmlsZVJlYWRlckhhbmRsZXIg4oaSIGNvbnN0cnVjdGVkIHNhdmVWYWx1ZScsIHNhdmVWYWx1ZSlcclxuICAgIGF3YWl0IGFkZEltYWdlVG9RdWV1ZShzYXZlVmFsdWUsIHNpZGViYXIpXHJcbiAgfVxyXG5cclxuLyoqXHJcbiAqIEhhbmRsZXMgYSBGaWxlTGlzdCBvciBhcnJheSBvZiBGaWxlIG9iamVjdHMgKGUuZy4gZnJvbSA8aW5wdXQgdHlwZT1cImZpbGVcIj4pLlxyXG4gKiBGb3IgZWFjaCBpbWFnZSBmaWxlOlxyXG4gKiAtIHNldHMgdXAgYSBGaWxlUmVhZGVyXHJcbiAqIC0gcmVhZHMgaXQgYXMgRGF0YVVSTFxyXG4gKiAtIG9uIGxvYWQsIGRlbGVnYXRlcyB0byBpbWFnZXNGaWxlUmVhZGVySGFuZGxlclxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHByb2Nlc3NJbWFnZUZpbGVzID0gKGZpbGVzOiBGaWxlTGlzdCB8IEZpbGVbXSwgc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gcHJvY2Vzc0ltYWdlRmlsZXMg4oaSIFNUQVJULCBmaWxlcyBsZW5ndGgnLCBmaWxlcy5sZW5ndGgpXHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGZpbGU6IEZpbGUgPSBmaWxlc1tpXVxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gcHJvY2Vzc0ltYWdlRmlsZXMg4oaSIGluc3BlY3RpbmcgZmlsZScsIGZpbGUpXHJcblxyXG4gICAgaWYgKCFpc0ZpbGVJbWFnZShmaWxlKSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tDSTpERUJVR10gcHJvY2Vzc0ltYWdlRmlsZXMg4oaSIHNraXBwaW5nIG5vbi1pbWFnZSBmaWxlJywgZmlsZSlcclxuICAgICAgY29udGludWVcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBwcm9jZXNzSW1hZ2VGaWxlcyDihpIgcHJvY2Vzc2luZyBpbWFnZSBmaWxlJywgZmlsZSlcclxuXHJcbiAgICBjb25zdCByZWFkZXI6IEZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGltYWdlc0ZpbGVSZWFkZXJIYW5kbGVyKGZpbGUsIHNpZGViYXIpKVxyXG4gICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSlcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHByb2Nlc3NJbWFnZUZpbGVzIOKGkiBFTkQnKVxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBkcmFnLWFuZC1kcm9wIG9yIHBhc3RlIGV2ZW50cyBjb21pbmcgZnJvbSBhIERhdGFUcmFuc2Zlci5cclxuICogSXQgYXR0ZW1wdHMgdHdvIHBhdGhzOlxyXG4gKiAxLiBJZiB0aGUgRGF0YVRyYW5zZmVyIGluY2x1ZGVzIEhUTUwgd2l0aCA8aW1nPiB0YWdzLCBpdCBleHRyYWN0cyBpbWcuc3JjIFVSTHMuXHJcbiAqICAgIC0gcmVqZWN0cyBpZiBhbnkgY29tZSBmcm9tIHJlc3RyaWN0ZWQgZG9tYWluc1xyXG4gKiAgICAtIHF1ZXVlcyBlYWNoIFVSTCBhcyBhbiBpbWFnZSAobm8gdXBsb2FkLCBqdXN0IGxpbmspXHJcbiAqIDIuIE90aGVyd2lzZSwgaXQgZXh0cmFjdHMgRmlsZSBvYmplY3RzIGZyb20gRGF0YVRyYW5zZmVyLml0ZW1zIGFuZCBkZWxlZ2F0ZXMgdG8gcHJvY2Vzc0ltYWdlRmlsZXMuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcHJvY2Vzc0Ryb3BBbmRQYXN0ZUltYWdlcyA9IChldmVudERhdGE6IERhdGFUcmFuc2Zlciwgc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gcHJvY2Vzc0Ryb3BBbmRQYXN0ZUltYWdlcyDihpIgU1RBUlQnLCBldmVudERhdGEpXHJcblxyXG4gIGNvbnN0IGV4dHJhY3RVcmxGcm9tRXZlbnREYXRhID0gKGV2ZW50RGF0YTogRGF0YVRyYW5zZmVyKTogc3RyaW5nW10gfCBudWxsID0+IHtcclxuICAgIGNvbnN0IGh0bWwgPSBldmVudERhdGEuZ2V0RGF0YSgndGV4dC9odG1sJylcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGV4dHJhY3RVcmxGcm9tRXZlbnREYXRhIOKGkiByYXcgaHRtbCcsIGh0bWwpXHJcblxyXG4gICAgaWYgKCFodG1sKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGV4dHJhY3RVcmxGcm9tRXZlbnREYXRhIOKGkiBubyBodG1sIGluIGV2ZW50RGF0YScpXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZG9jID0gRE9NX1BBUlNFUi5wYXJzZUZyb21TdHJpbmcoaHRtbCwgJ3RleHQvaHRtbCcpXHJcbiAgICBjb25zdCBpbWFnZXMgPSBkb2MucXVlcnlTZWxlY3RvckFsbCgnaW1nJylcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGV4dHJhY3RVcmxGcm9tRXZlbnREYXRhIOKGkiBmb3VuZCA8aW1nPiBlbGVtZW50cycsIGltYWdlcylcclxuXHJcbiAgICBpZiAoIWltYWdlcyB8fCAhaW1hZ2VzLmxlbmd0aCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBleHRyYWN0VXJsRnJvbUV2ZW50RGF0YSDihpIgbm8gPGltZz4gdGFncyBmb3VuZCcpXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQHRzLWlnbm9yZSDigJMgc3ByZWFkIE5vZGVMaXN0XHJcbiAgICBjb25zdCBpbWFnZVVybHMgPSBbLi4uaW1hZ2VzXS5tYXAoKGltZykgPT4gKGltZy5zcmMgYXMgc3RyaW5nKSlcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGV4dHJhY3RVcmxGcm9tRXZlbnREYXRhIOKGkiBpbWFnZVVybHMnLCBpbWFnZVVybHMpXHJcblxyXG4gICAgY29uc3QgaW1hZ2VzQ29udGFpblJlc3RyaWN0ZWREb21haW5zID0gaW1hZ2VVcmxzLnNvbWUoKGl1KSA9PlxyXG4gICAgICBSRVNUUklDVEVEX0RPTUFJTlMuc29tZSgocmQpID0+IGl1LmluY2x1ZGVzKHJkKSlcclxuICAgIClcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGV4dHJhY3RVcmxGcm9tRXZlbnREYXRhIOKGkiByZXN0cmljdGVkIGRvbWFpbiBjaGVjaycsIHtcclxuICAgICAgaW1hZ2VVcmxzLFxyXG4gICAgICBpbWFnZXNDb250YWluUmVzdHJpY3RlZERvbWFpbnMsXHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChpbWFnZXNDb250YWluUmVzdHJpY3RlZERvbWFpbnMpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbQ0k6REVCVUddIGV4dHJhY3RVcmxGcm9tRXZlbnREYXRhIOKGkiBVUkxzIGNvbnRhaW4gcmVzdHJpY3RlZCBkb21haW5zLCByZXR1cm5pbmcgbnVsbCcpXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGltYWdlVXJsc1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdXJsc0Zyb21FdmVudERhdGFIYW5kbGVyID0gYXN5bmMgKHVybHM6IHN0cmluZ1tdKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSB1cmxzRnJvbUV2ZW50RGF0YUhhbmRsZXIg4oaSIFNUQVJUIHdpdGggdXJscycsIHVybHMpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVybHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgdXJsID0gdXJsc1tpXVxyXG4gICAgICBjb25zdCBzYXZlVmFsdWU6IFNhdmVWYWx1ZVR5cGUgPSB7IGltYWdlU3JjOiB1cmwsIGlkOiByYW5kb21TdHJpbmcoKSB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHVybHNGcm9tRXZlbnREYXRhSGFuZGxlciDihpIgcXVldWluZyBVUkwnLCBzYXZlVmFsdWUpXHJcbiAgICAgIGF3YWl0IGFkZEltYWdlVG9RdWV1ZShzYXZlVmFsdWUsIHNpZGViYXIpXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSB1cmxzRnJvbUV2ZW50RGF0YUhhbmRsZXIg4oaSIEVORCcpXHJcbiAgfVxyXG5cclxuICAvLyBGaXJzdCB0cnkgdG8gaW50ZXJwcmV0IHRoZSBldmVudCBhcyBjb250YWluaW5nIEhUTUwgd2l0aCBpbWFnZSBVUkxzXHJcbiAgY29uc3QgdXJsczogc3RyaW5nW10gfCBudWxsID0gZXh0cmFjdFVybEZyb21FdmVudERhdGEoZXZlbnREYXRhKVxyXG4gIGlmICh1cmxzICYmIHVybHMubGVuZ3RoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBwcm9jZXNzRHJvcEFuZFBhc3RlSW1hZ2VzIOKGkiBVUkxzIGRldGVjdGVkLCBoYW5kbGluZyBhcyBVUkwgcGFzdGUvZHJvcCcpXHJcbiAgICByZXR1cm4gdXJsc0Zyb21FdmVudERhdGFIYW5kbGVyKHVybHMpXHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGF0IGZhaWxzLCBmYWxsIGJhY2sgdG8gcHVsbGluZyBGaWxlIG9iamVjdHMgZnJvbSB0aGUgRGF0YVRyYW5zZmVyIGl0ZW1zXHJcbiAgY29uc3QgZXh0cmFjdEZpbGVzRnJvbUV2ZW50RGF0YSA9IChldmVudERhdGE6IERhdGFUcmFuc2Zlcik6IEZpbGVbXSA9PiB7XHJcbiAgICBjb25zdCBpdGVtczogRGF0YVRyYW5zZmVySXRlbUxpc3QgPSBldmVudERhdGEuaXRlbXNcclxuICAgIGNvbnN0IGZpbGVzOiBGaWxlW10gPSBbXVxyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gZXh0cmFjdEZpbGVzRnJvbUV2ZW50RGF0YSDihpIgaXRlbXMnLCBpdGVtcylcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW06IERhdGFUcmFuc2Zlckl0ZW0gPSBpdGVtc1tpXVxyXG4gICAgICBjb25zb2xlLmxvZygnW0NJOkRFQlVHXSBleHRyYWN0RmlsZXNGcm9tRXZlbnREYXRhIOKGkiBpbnNwZWN0aW5nIGl0ZW0nLCBpdGVtKVxyXG5cclxuICAgICAgaWYgKCFpc0ZpbGVJbWFnZShpdGVtKSkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignW0NJOkRFQlVHXSBleHRyYWN0RmlsZXNGcm9tRXZlbnREYXRhIOKGkiBza2lwcGluZyBub24taW1hZ2UgaXRlbScsIGl0ZW0pXHJcbiAgICAgICAgY29udGludWVcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcclxuICAgICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gZXh0cmFjdEZpbGVzRnJvbUV2ZW50RGF0YSDihpIgaXRlbS5nZXRBc0ZpbGUoKScsIGZpbGUpXHJcblxyXG4gICAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1tDSTpERUJVR10gZXh0cmFjdEZpbGVzRnJvbUV2ZW50RGF0YSDihpIgaXRlbS5nZXRBc0ZpbGUoKSByZXR1cm5lZCBudWxsLCBza2lwcGluZycpXHJcbiAgICAgICAgY29udGludWVcclxuICAgICAgfVxyXG5cclxuICAgICAgZmlsZXMucHVzaChmaWxlKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGV4dHJhY3RGaWxlc0Zyb21FdmVudERhdGEg4oaSIGV4dHJhY3RlZCBmaWxlcycsIGZpbGVzKVxyXG4gICAgcmV0dXJuIGZpbGVzXHJcbiAgfVxyXG5cclxuICBjb25zdCBmaWxlczogRmlsZVtdID0gZXh0cmFjdEZpbGVzRnJvbUV2ZW50RGF0YShldmVudERhdGEpXHJcbiAgaWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCkge1xyXG4gICAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gcHJvY2Vzc0Ryb3BBbmRQYXN0ZUltYWdlcyDihpIgZmlsZXMgZGV0ZWN0ZWQsIGRlbGVnYXRpbmcgdG8gcHJvY2Vzc0ltYWdlRmlsZXMnKVxyXG4gICAgcmV0dXJuIHByb2Nlc3NJbWFnZUZpbGVzKGZpbGVzLCBzaWRlYmFyKVxyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coJ1tDSTpERUJVR10gcHJvY2Vzc0Ryb3BBbmRQYXN0ZUltYWdlcyDihpIgbm8gVVJMcyBvciBmaWxlcyBmb3VuZCwgbm90aGluZyB0byBkbycpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBjdXJyZW50IHF1ZXVlIG9mIGltYWdlcyBhdHRhY2hlZCB0byB0aGUgY2hhdCBpbnB1dC5cclxuICogVHlwaWNhbGx5IHVzZWQgYnkgdGhlIG1lc3NhZ2Utc2VuZGluZyBsb2dpYyB0byBidWlsZCBtYXJrdXAuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ2V0SW1hZ2VRdWV1ZSA9ICgpOiBTYXZlVmFsdWVUeXBlW10gPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIGdldEltYWdlUXVldWUg4oaSJywgaW1hZ2VRdWV1ZSlcclxuICByZXR1cm4gaW1hZ2VRdWV1ZVxyXG59XHJcblxyXG4vKipcclxuICogQ2xlYXJzIHRoZSBlbnRpcmUgaW1hZ2VRdWV1ZSBhbmQgcmVtb3ZlcyBhbGwgcHJldmlldyBET00gZWxlbWVudHNcclxuICogZnJvbSB0aGUgdXBsb2FkIGFyZWEgaW4gdGhlIHNpZGViYXIuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVtb3ZlQWxsRnJvbVF1ZXVlID0gKHNpZGViYXI6IEpRdWVyeSkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHJlbW92ZUFsbEZyb21RdWV1ZSDihpIgU1RBUlQnKVxyXG5cclxuICB3aGlsZSAoaW1hZ2VRdWV1ZS5sZW5ndGgpIHtcclxuICAgIGNvbnN0IGltYWdlRGF0YTogU2F2ZVZhbHVlVHlwZSB8IHVuZGVmaW5lZCA9IGltYWdlUXVldWUucG9wKClcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHJlbW92ZUFsbEZyb21RdWV1ZSDihpIgcG9wcGVkIGltYWdlRGF0YScsIGltYWdlRGF0YSlcclxuXHJcbiAgICBpZiAoIWltYWdlRGF0YSkgY29udGludWVcclxuXHJcbiAgICBjb25zdCBpbWFnZUVsZW1lbnQgPSBmaW5kKGAjJHtpbWFnZURhdGEuaWR9YCwgc2lkZWJhcilcclxuICAgIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHJlbW92ZUFsbEZyb21RdWV1ZSDihpIgcmVtb3ZpbmcgZWxlbWVudCcsIGltYWdlRWxlbWVudClcclxuXHJcbiAgICByZW1vdmUoaW1hZ2VFbGVtZW50KVxyXG4gIH1cclxuXHJcbiAgY29uc3QgdXBsb2FkQXJlYTogSlF1ZXJ5ID0gZmluZCgnI2NpLWNoYXQtdXBsb2FkLWFyZWEnLCBzaWRlYmFyKVxyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHJlbW92ZUFsbEZyb21RdWV1ZSDihpIgZm91bmQgdXBsb2FkQXJlYScsIHVwbG9hZEFyZWEpXHJcblxyXG4gIGFkZENsYXNzKHVwbG9hZEFyZWEsICdoaWRkZW4nKVxyXG4gIGNvbnNvbGUubG9nKCdbQ0k6REVCVUddIHJlbW92ZUFsbEZyb21RdWV1ZSDihpIgRU5ELCBxdWV1ZSBjbGVhcmVkIGFuZCB1cGxvYWRBcmVhIGhpZGRlbicpXHJcbn1cclxuIiwiaW1wb3J0IHthZGRDbGFzcywgYXBwZW5kLCBjcmVhdGUsIGZpbmQsIG9uLCB0cmlnZ2VyfSBmcm9tICcuLi91dGlscy9KcXVlcnlXcmFwcGVycydcclxuaW1wb3J0IHt0LCB1c2VyQ2FuVXBsb2FkfSBmcm9tICcuLi91dGlscy9VdGlscydcclxuaW1wb3J0IHtwcm9jZXNzSW1hZ2VGaWxlc30gZnJvbSAnLi4vcHJvY2Vzc29ycy9GaWxlUHJvY2Vzc29yJ1xyXG5pbXBvcnQge2dldFNldHRpbmd9IGZyb20gJy4uL3V0aWxzL1NldHRpbmdzJ1xyXG5cclxuY29uc3QgY3JlYXRlVXBsb2FkQnV0dG9uID0gKCk6IEpRdWVyeSA9PiBjcmVhdGUoYDxhIGlkPVwiY2ktdXBsb2FkLWltYWdlXCIgdGl0bGU9XCIke3QoJ3VwbG9hZEJ1dHRvblRpdGxlJyl9XCI+PGkgY2xhc3M9XCJmYXMgZmEtaW1hZ2VzXCI+PC9pPjwvYT5gKVxyXG5cclxuY29uc3QgY3JlYXRlSGlkZGVuVXBsb2FkSW5wdXQgPSAoKTogSlF1ZXJ5ID0+IGNyZWF0ZShgPGlucHV0IHR5cGU9XCJmaWxlXCIgbXVsdGlwbGUgYWNjZXB0PVwiaW1hZ2UvKlwiIGlkPVwiY2ktdXBsb2FkLWltYWdlLWhpZGRlbi1pbnB1dFwiPmApXHJcblxyXG5jb25zdCBzZXR1cEV2ZW50cyA9ICh1cGxvYWRCdXR0b246IEpRdWVyeSwgaGlkZGVuVXBsb2FkSW5wdXQ6IEpRdWVyeSwgc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgY29uc3QgaGlkZGVuVXBsb2FkSW5wdXRDaGFuZ2VFdmVudEhhbmRsZXIgPSAoZXZ0OiBFdmVudCkgPT4ge1xyXG4gICAgY29uc3QgY3VycmVudFRhcmdldDogSFRNTElucHV0RWxlbWVudCA9IGV2dC5jdXJyZW50VGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICAgIGNvbnN0IGZpbGVzOiBGaWxlTGlzdCB8IG51bGwgPSBjdXJyZW50VGFyZ2V0LmZpbGVzXHJcbiAgICBpZiAoIWZpbGVzKSByZXR1cm5cclxuXHJcbiAgICBwcm9jZXNzSW1hZ2VGaWxlcyhmaWxlcywgc2lkZWJhcilcclxuICAgIGN1cnJlbnRUYXJnZXQudmFsdWUgPSAnJ1xyXG4gIH1cclxuICBjb25zdCB1cGxvYWRCdXR0b25DbGlja0V2ZW50SGFuZGxlciA9IChldnQ6IEV2ZW50KSA9PiB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgdHJpZ2dlcihoaWRkZW5VcGxvYWRJbnB1dCwgJ2NsaWNrJylcclxuICB9XHJcblxyXG4gIG9uKGhpZGRlblVwbG9hZElucHV0LCAnY2hhbmdlJywgaGlkZGVuVXBsb2FkSW5wdXRDaGFuZ2VFdmVudEhhbmRsZXIpXHJcbiAgb24odXBsb2FkQnV0dG9uLCAnY2xpY2snLCB1cGxvYWRCdXR0b25DbGlja0V2ZW50SGFuZGxlcilcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRVcGxvYWRCdXR0b24gPSAoc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgaWYgKCFnZXRTZXR0aW5nKCd1cGxvYWRCdXR0b24nKSkgcmV0dXJuXHJcblxyXG4gIGNvbnN0IGNvbnRyb2xCdXR0b25zOiBKUXVlcnkgPSBmaW5kKCcuY29udHJvbC1idXR0b25zJywgc2lkZWJhcilcclxuICBjb25zdCB1cGxvYWRCdXR0b246IEpRdWVyeSA9IGNyZWF0ZVVwbG9hZEJ1dHRvbigpXHJcbiAgY29uc3QgaGlkZGVuVXBsb2FkSW5wdXQ6IEpRdWVyeSA9IGNyZWF0ZUhpZGRlblVwbG9hZElucHV0KClcclxuXHJcbiAgaWYgKCF1c2VyQ2FuVXBsb2FkKHRydWUpKSByZXR1cm5cclxuXHJcbiAgaWYgKGNvbnRyb2xCdXR0b25zWzBdKSB7XHJcbiAgICBhZGRDbGFzcyhjb250cm9sQnV0dG9ucywgJ2NpLWNvbnRyb2wtYnV0dG9ucy1nbScpXHJcbiAgICBhcHBlbmQoY29udHJvbEJ1dHRvbnMsIHVwbG9hZEJ1dHRvbilcclxuICAgIGFwcGVuZChjb250cm9sQnV0dG9ucywgaGlkZGVuVXBsb2FkSW5wdXQpXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFBsYXllcnMgZG9uJ3QgaGF2ZSBidXR0b25zXHJcbiAgICBjb25zdCBjaGF0Q29udHJvbHM6IEpRdWVyeSA9IGZpbmQoJyNjaGF0LWNvbnRyb2xzJywgc2lkZWJhcilcclxuICAgIGNvbnN0IG5ld0NvbnRyb2xCdXR0b25zID0gY3JlYXRlKCc8ZGl2IGNsYXNzPVwiY2ktY29udHJvbC1idXR0b25zLXBcIj48L2Rpdj4nKVxyXG5cclxuICAgIGFwcGVuZChuZXdDb250cm9sQnV0dG9ucywgdXBsb2FkQnV0dG9uKVxyXG4gICAgYXBwZW5kKG5ld0NvbnRyb2xCdXR0b25zLCBoaWRkZW5VcGxvYWRJbnB1dClcclxuICAgIGFwcGVuZChjaGF0Q29udHJvbHMsIG5ld0NvbnRyb2xCdXR0b25zKVxyXG4gIH1cclxuXHJcbiAgc2V0dXBFdmVudHModXBsb2FkQnV0dG9uLCBoaWRkZW5VcGxvYWRJbnB1dCwgc2lkZWJhcilcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgZmluZCwgb24gfSBmcm9tICcuLi91dGlscy9KcXVlcnlXcmFwcGVycydcclxuaW1wb3J0IHsgZ2V0SW1hZ2VRdWV1ZSwgcHJvY2Vzc0Ryb3BBbmRQYXN0ZUltYWdlcywgcmVtb3ZlQWxsRnJvbVF1ZXVlLCBTYXZlVmFsdWVUeXBlIH0gZnJvbSAnLi4vcHJvY2Vzc29ycy9GaWxlUHJvY2Vzc29yJ1xyXG5pbXBvcnQgeyBpc1Zlcmlvc25BZnRlcjEzLCB0IH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnXHJcbmltcG9ydCB7IGdldFVwbG9hZGluZ1N0YXRlcyB9IGZyb20gJy4vTG9hZGVyJ1xyXG5cclxubGV0IGhvb2tJc0hhbmRsaW5nVGhlTWVzc2FnZSA9IGZhbHNlXHJcbmxldCBldmVudElzSGFuZGxpbmdUaGVNZXNzYWdlID0gZmFsc2VcclxuXHJcbmNvbnN0IGltYWdlVGVtcGxhdGUgPSAoaW1hZ2VQcm9wczogU2F2ZVZhbHVlVHlwZSk6IHN0cmluZyA9PiBgPGRpdiBjbGFzcz1cImNpLW1lc3NhZ2UtaW1hZ2VcIj48aW1nIHNyYz1cIiR7aW1hZ2VQcm9wcy5pbWFnZVNyY31cIiBhbHQ9XCIke2ltYWdlUHJvcHMubmFtZSB8fCB0KCd1bmFibGVUb0xvYWRJbWFnZScpfVwiPjwvZGl2PmBcclxuXHJcbmNvbnN0IG1lc3NhZ2VUZW1wbGF0ZSA9IChpbWFnZVF1ZXVlOiBTYXZlVmFsdWVUeXBlW10pID0+IHtcclxuICBjb25zdCBpbWFnZVRlbXBsYXRlczogc3RyaW5nW10gPSBpbWFnZVF1ZXVlLm1hcCgoaW1hZ2VQcm9wczogU2F2ZVZhbHVlVHlwZSk6IHN0cmluZyA9PiBpbWFnZVRlbXBsYXRlKGltYWdlUHJvcHMpKVxyXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cImNpLW1lc3NhZ2VcIj4ke2ltYWdlVGVtcGxhdGVzLmpvaW4oJycpfTwvZGl2PmBcclxufVxyXG5cclxuY29uc3QgcHJlQ3JlYXRlQ2hhdE1lc3NhZ2VIYW5kbGVyID0gKHNpZGViYXI6IEpRdWVyeSkgPT4gKGNoYXRNZXNzYWdlOiBhbnksIHVzZXJPcHRpb25zOiBuZXZlciwgbWVzc2FnZU9wdGlvbnM6IGFueSkgPT4ge1xyXG4gIGlmIChldmVudElzSGFuZGxpbmdUaGVNZXNzYWdlKSByZXR1cm5cclxuXHJcbiAgaG9va0lzSGFuZGxpbmdUaGVNZXNzYWdlID0gdHJ1ZVxyXG4gIGNvbnN0IGltYWdlUXVldWU6IFNhdmVWYWx1ZVR5cGVbXSA9IGdldEltYWdlUXVldWUoKVxyXG4gIGlmICghaW1hZ2VRdWV1ZS5sZW5ndGgpIHtcclxuICAgIGhvb2tJc0hhbmRsaW5nVGhlTWVzc2FnZSA9IGZhbHNlXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIGNvbnN0IHVwbG9hZFN0YXRlID0gZ2V0VXBsb2FkaW5nU3RhdGVzKHNpZGViYXIpXHJcbiAgdXBsb2FkU3RhdGUub24oKVxyXG5cclxuICBjb25zdCBjb250ZW50ID0gYCR7bWVzc2FnZVRlbXBsYXRlKGltYWdlUXVldWUpfTxkaXYgY2xhc3M9XCJjaS1ub3Rlc1wiPiR7Y2hhdE1lc3NhZ2UuY29udGVudH08L2Rpdj5gXHJcblxyXG4gIGNoYXRNZXNzYWdlLmNvbnRlbnQgPSBjb250ZW50XHJcbiAgY2hhdE1lc3NhZ2UuX3NvdXJjZS5jb250ZW50ID0gY29udGVudFxyXG4gIG1lc3NhZ2VPcHRpb25zLmNoYXRCdWJibGUgPSBmYWxzZVxyXG5cclxuICByZW1vdmVBbGxGcm9tUXVldWUoc2lkZWJhcilcclxuICBob29rSXNIYW5kbGluZ1RoZU1lc3NhZ2UgPSBmYWxzZVxyXG4gIHVwbG9hZFN0YXRlLm9mZigpXHJcbn1cclxuXHJcbmNvbnN0IGVtcHR5Q2hhdEV2ZW50SGFuZGxlciA9IChzaWRlYmFyOiBKUXVlcnkpID0+IGFzeW5jIChldnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICBpZiAoaG9va0lzSGFuZGxpbmdUaGVNZXNzYWdlIHx8IChldnQuY29kZSAhPT0gJ0VudGVyJyAmJiBldnQuY29kZSAhPT0gJ051bXBhZEVudGVyJykgfHwgZXZ0LnNoaWZ0S2V5KSByZXR1cm5cclxuICBldmVudElzSGFuZGxpbmdUaGVNZXNzYWdlID0gdHJ1ZVxyXG5cclxuICBjb25zdCB1cGxvYWRTdGF0ZSA9IGdldFVwbG9hZGluZ1N0YXRlcyhzaWRlYmFyKVxyXG4gIGNvbnN0IGltYWdlUXVldWU6IFNhdmVWYWx1ZVR5cGVbXSA9IGdldEltYWdlUXVldWUoKVxyXG4gIGlmICghaW1hZ2VRdWV1ZS5sZW5ndGgpIHtcclxuICAgIGV2ZW50SXNIYW5kbGluZ1RoZU1lc3NhZ2UgPSBmYWxzZVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHVwbG9hZFN0YXRlLm9uKClcclxuXHJcbiAgY29uc3QgY2hhdE1lc3NhZ2VUeXBlID0gaXNWZXJpb3NuQWZ0ZXIxMygpXHJcbiAgICA/IENPTlNULkNIQVRfTUVTU0FHRV9TVFlMRVMuT09DXHJcbiAgICA6IENPTlNULkNIQVRfTUVTU0FHRV9UWVBFUy5PT0NcclxuXHJcbiAgY29uc3QgbWVzc2FnZURhdGEgPSB7XHJcbiAgICBjb250ZW50OiBtZXNzYWdlVGVtcGxhdGUoaW1hZ2VRdWV1ZSksXHJcbiAgICB0eXBlOiB0eXBlb2YgY2hhdE1lc3NhZ2VUeXBlICE9PSAndW5kZWZpbmVkJyA/IGNoYXRNZXNzYWdlVHlwZSA6IDEsXHJcbiAgICB1c2VyOiAoZ2FtZSBhcyBHYW1lKS51c2VyLFxyXG4gIH1cclxuICBhd2FpdCBDaGF0TWVzc2FnZS5jcmVhdGUobWVzc2FnZURhdGEpXHJcbiAgcmVtb3ZlQWxsRnJvbVF1ZXVlKHNpZGViYXIpXHJcbiAgdXBsb2FkU3RhdGUub2ZmKClcclxuICBldmVudElzSGFuZGxpbmdUaGVNZXNzYWdlID0gZmFsc2VcclxufVxyXG5cclxuY29uc3QgcGFzdEFuZERyb3BFdmVudEhhbmRsZXIgPSAoc2lkZWJhcjogSlF1ZXJ5KSA9PiAoZXZ0OiBhbnkpID0+IHtcclxuICBjb25zdCBvcmlnaW5hbEV2ZW50OiBDbGlwYm9hcmRFdmVudCB8IERyYWdFdmVudCA9IGV2dC5vcmlnaW5hbEV2ZW50XHJcbiAgY29uc3QgZXZlbnREYXRhOiBEYXRhVHJhbnNmZXIgfCBudWxsID0gKG9yaWdpbmFsRXZlbnQgYXMgQ2xpcGJvYXJkRXZlbnQpLmNsaXBib2FyZERhdGEgfHwgKG9yaWdpbmFsRXZlbnQgYXMgRHJhZ0V2ZW50KS5kYXRhVHJhbnNmZXJcclxuICBpZiAoIWV2ZW50RGF0YSkgcmV0dXJuXHJcblxyXG4gIHByb2Nlc3NEcm9wQW5kUGFzdGVJbWFnZXMoZXZlbnREYXRhLCBzaWRlYmFyKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaXNVcGxvYWRBcmVhUmVuZGVyZWQgPSAoc2lkZWJhcjogSlF1ZXJ5KTogYm9vbGVhbiA9PiB7XHJcbiAgY29uc3QgdXBsb2FkQXJlYSA9IGZpbmQoJyNjaS1jaGF0LXVwbG9hZC1hcmVhJywgc2lkZWJhcilcclxuICByZXR1cm4gISF1cGxvYWRBcmVhLmxlbmd0aDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRDaGF0U2lkZWJhciA9IChzaWRlYmFyOiBKUXVlcnkpID0+IHtcclxuICBIb29rcy5vbigncHJlQ3JlYXRlQ2hhdE1lc3NhZ2UnLCBwcmVDcmVhdGVDaGF0TWVzc2FnZUhhbmRsZXIoc2lkZWJhcikpXHJcblxyXG4gIC8vIFRoaXMgc2hvdWxkIG9ubHkgcnVuIHdoZW4gdGhlcmUgaXMgbm90aGluZyBpbiB0aGUgY2hhdFxyXG4gIG9uKHNpZGViYXIsICdrZXl1cCcsIGVtcHR5Q2hhdEV2ZW50SGFuZGxlcihzaWRlYmFyKSlcclxuXHJcbiAgb24oc2lkZWJhciwgJ3Bhc3RlIGRyb3AnLCBwYXN0QW5kRHJvcEV2ZW50SGFuZGxlcihzaWRlYmFyKSlcclxufVxyXG4iLCJpbXBvcnQgeyBmaW5kLCBvbiB9IGZyb20gJy4uL3V0aWxzL0pxdWVyeVdyYXBwZXJzJ1xyXG5pbXBvcnQgeyBJbWFnZVBvcG91dEltcGxlbWVudGF0aW9uLCBpc1Zlcmlvc25BZnRlcjEzIH0gZnJvbSAnLi4vdXRpbHMvVXRpbHMnXHJcblxyXG5leHBvcnQgY29uc3QgaW5pdENoYXRNZXNzYWdlID0gKGNoYXRNZXNzYWdlOiBKUXVlcnkpID0+IHtcclxuICBjb25zdCBpbWFnZXMgPSBmaW5kKCcuY2ktbWVzc2FnZS1pbWFnZSBpbWcnLCBjaGF0TWVzc2FnZSlcclxuICBpZiAoIWltYWdlc1swXSkgcmV0dXJuXHJcblxyXG4gIGNvbnN0IGNsaWNrSW1hZ2VIYW5kbGUgPSAoZXZ0OiBFdmVudCkgPT4ge1xyXG4gICAgY29uc3Qgc3JjID0gKGV2dC50YXJnZXQgYXMgSFRNTEltYWdlRWxlbWVudCkuc3JjXHJcbiAgICBjb25zdCBpbWFnZVBvcHVwID0gSW1hZ2VQb3BvdXRJbXBsZW1lbnRhdGlvbigpXHJcblxyXG4gICAgaWYgKGlzVmVyaW9zbkFmdGVyMTMoKSkge1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIG5ldyBpbWFnZVBvcHVwKHsgc3JjLCBlZGl0YWJsZTogZmFsc2UsIHNoYXJlYWJsZTogdHJ1ZSB9KS5yZW5kZXIodHJ1ZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgbmV3IGltYWdlUG9wdXAoc3JjLCB7IGVkaXRhYmxlOiBmYWxzZSwgc2hhcmVhYmxlOiB0cnVlIH0pLnJlbmRlcih0cnVlKVxyXG4gICAgfVxyXG4gIH1cclxuICBvbihpbWFnZXMsICdjbGljaycsIGNsaWNrSW1hZ2VIYW5kbGUpXHJcbn1cclxuIiwiaW1wb3J0IHt0fSBmcm9tICcuLi91dGlscy9VdGlscydcclxuXHJcbmNvbnN0IGltYWdlTWFya2Rvd25SZWcgPSAvIVxccypjaVxccypcXHxcXHMqKC4rPylcXHMqIS9naVxyXG5jb25zdCBpbWFnZVJlZyA9IC9cXHcrXFwuKGdpZnxwbmd8anBnfGpwZWd8d2VicHxzdmd8cHNkfGJtcHx0aWYpL2dpXHJcblxyXG5jb25zdCBpbWFnZVRlbXBsYXRlID0gKHNyYzogc3RyaW5nKTogc3RyaW5nID0+IGA8ZGl2IGNsYXNzPVwiY2ktbWVzc2FnZS1pbWFnZVwiPjxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiJHt0KCd1bmFibGVUb0xvYWRJbWFnZScpfVwiPjwvZGl2PmBcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9jZXNzTWVzc2FnZSA9IChtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gIGlmICghbWVzc2FnZS5tYXRjaChpbWFnZU1hcmtkb3duUmVnKSkgcmV0dXJuIG1lc3NhZ2VcclxuXHJcbiAgcmV0dXJuIG1lc3NhZ2UucmVwbGFjZUFsbChpbWFnZU1hcmtkb3duUmVnLCAobTogc3RyaW5nLCBzcmM6IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKCFzcmMubWF0Y2goaW1hZ2VSZWcpKSByZXR1cm4gbVxyXG4gICAgcmV0dXJuIGltYWdlVGVtcGxhdGUoc3JjKVxyXG4gIH0pXHJcbn1cclxuIiwiaW1wb3J0ICcuL3N0eWxlcy9jaGF0LWltYWdlcy5zY3NzJ1xyXG5pbXBvcnQgeyBpbml0VXBsb2FkQXJlYSB9IGZyb20gJy4vc2NyaXB0cy9jb21wb25lbnRzL1VwbG9hZEFyZWEnXHJcbmltcG9ydCB7IGluaXRVcGxvYWRCdXR0b24gfSBmcm9tICcuL3NjcmlwdHMvY29tcG9uZW50cy9VcGxvYWRCdXR0b24nXHJcbmltcG9ydCB7IGluaXRDaGF0U2lkZWJhciwgaXNVcGxvYWRBcmVhUmVuZGVyZWQgfSBmcm9tICcuL3NjcmlwdHMvY29tcG9uZW50cy9DaGF0U2lkZWJhcidcclxuaW1wb3J0IHsgaW5pdENoYXRNZXNzYWdlIH0gZnJvbSAnLi9zY3JpcHRzL2NvbXBvbmVudHMvQ2hhdE1lc3NhZ2UnXHJcbmltcG9ydCB7IGNyZWF0ZSwgZmluZCB9IGZyb20gJy4vc2NyaXB0cy91dGlscy9KcXVlcnlXcmFwcGVycydcclxuaW1wb3J0IHsgcHJvY2Vzc01lc3NhZ2UgfSBmcm9tICcuL3NjcmlwdHMvcHJvY2Vzc29ycy9NZXNzYWdlUHJvY2Vzc29yJ1xyXG5pbXBvcnQgeyBjcmVhdGVVcGxvYWRGb2xkZXIsIGdldFNldHRpbmdzLCByZWdpc3RlclNldHRpbmcgfSBmcm9tICcuL3NjcmlwdHMvdXRpbHMvU2V0dGluZ3MnXHJcbmltcG9ydCB7IGlzVmVyaW9zbkFmdGVyMTMgfSBmcm9tICcuL3NjcmlwdHMvdXRpbHMvVXRpbHMnXHJcblxyXG5jb25zdCByZWdpc3RlclNldHRpbmdzID0gKCkgPT4ge1xyXG4gIGNvbnN0IHNldHRpbmdzID0gZ2V0U2V0dGluZ3MoKVxyXG4gIHNldHRpbmdzLmZvckVhY2goKHNldHRpbmcpID0+IHJlZ2lzdGVyU2V0dGluZyhzZXR0aW5nKSlcclxufVxyXG5cclxuSG9va3Mub25jZSgnaW5pdCcsIGFzeW5jICgpID0+IHtcclxuICByZWdpc3RlclNldHRpbmdzKClcclxuICByZWdpc3Rlckhvb2tzKClcclxuXHJcbiAgYXdhaXQgY3JlYXRlVXBsb2FkRm9sZGVyKClcclxufSlcclxuXHJcbmNvbnN0IHJlZ2lzdGVySG9va3MgPSAoKSA9PiB7XHJcbiAgaWYgKGlzVmVyaW9zbkFmdGVyMTMoKSkge1xyXG4gICAgSG9va3Mub24oJ3JlbmRlckNoYXRNZXNzYWdlSFRNTCcsIChfMDogbmV2ZXIsIGNoYXRNZXNzYWdlRWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgY29uc3QgY2hhdE1lc3NhZ2UgPSBjcmVhdGUoY2hhdE1lc3NhZ2VFbGVtZW50KVxyXG5cclxuICAgICAgY29uc3QgY2lNZXNzYWdlID0gZmluZCgnLmNpLW1lc3NhZ2UtaW1hZ2UnLCBjaGF0TWVzc2FnZSlcclxuICAgICAgaWYgKCFjaU1lc3NhZ2VbMF0pIHJldHVyblxyXG5cclxuICAgICAgaW5pdENoYXRNZXNzYWdlKGNoYXRNZXNzYWdlKVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCBpbml0RXZlbnRzID0gKHNpZGViYXI6IEpRdWVyeSkgPT4ge1xyXG4gICAgICAvLyBQcmV2ZW50IGFkZGluZyBldmVudHMgbXVsdGlwbGUgdGltZXNcclxuICAgICAgaWYgKGlzVXBsb2FkQXJlYVJlbmRlcmVkKHNpZGViYXIpKSByZXR1cm5cclxuXHJcbiAgICAgIGluaXRVcGxvYWRBcmVhKHNpZGViYXIpXHJcbiAgICAgIC8vIFJlbW92ZWQgaW4gdmVyc2lvbiAxMyBcclxuICAgICAgLy8gaW5pdFVwbG9hZEJ1dHRvbihzaWRlYmFyKVxyXG4gICAgICBpbml0Q2hhdFNpZGViYXIoc2lkZWJhcilcclxuICAgIH1cclxuXHJcbiAgICBIb29rcy5vbignY29sbGFwc2VTaWRlYmFyJywgKHNpZGViYXI6IGFueSwgY29sbGFwc2VkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgIGlmICghc2lkZWJhciB8fCBjb2xsYXBzZWQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3Qgc2lkZWJhckVsZW1lbnQgPSBzaWRlYmFyLmVsZW1lbnRcclxuICAgICAgaWYgKCFzaWRlYmFyRWxlbWVudCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBoYXNDaGF0RWxlbWVudCA9IHNpZGViYXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGF0LW1lc3NhZ2UnKVxyXG4gICAgICBpZiAoIWhhc0NoYXRFbGVtZW50KSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHNpZGViYXJKcSA9ICQoc2lkZWJhckVsZW1lbnQpXHJcbiAgICAgIGluaXRFdmVudHMoc2lkZWJhckpxKVxyXG4gICAgfSlcclxuXHJcbiAgICBIb29rcy5vbignYWN0aXZhdGVDaGF0TG9nJywgKGNoYXRMb2c6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoIWNoYXRMb2cpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgY2hhdExvZ0VsZW1lbnQgPSBjaGF0TG9nLmVsZW1lbnRcclxuICAgICAgaWYgKCFjaGF0TG9nRWxlbWVudCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBoYXNDaGF0RWxlbWVudCA9IGNoYXRMb2dFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGF0LW1lc3NhZ2UnKVxyXG4gICAgICBpZiAoIWhhc0NoYXRFbGVtZW50KSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IGNoYXRMb2dKcSA9ICQoY2hhdExvZ0VsZW1lbnQpXHJcbiAgICAgIGluaXRFdmVudHMoY2hhdExvZ0pxKVxyXG4gICAgfSlcclxuICB9IGVsc2Uge1xyXG4gICAgSG9va3Mub24oJ3JlbmRlckNoYXRNZXNzYWdlJywgKF8wOiBuZXZlciwgY2hhdE1lc3NhZ2U6IEpRdWVyeSkgPT4ge1xyXG4gICAgICBjb25zdCBjaU1lc3NhZ2UgPSBmaW5kKCcuY2ktbWVzc2FnZS1pbWFnZScsIGNoYXRNZXNzYWdlKVxyXG4gICAgICBpZiAoIWNpTWVzc2FnZVswXSkgcmV0dXJuXHJcblxyXG4gICAgICBpbml0Q2hhdE1lc3NhZ2UoY2hhdE1lc3NhZ2UpXHJcbiAgICB9KVxyXG5cclxuICAgIEhvb2tzLm9uKCdyZW5kZXJTaWRlYmFyVGFiJywgKF8wOiBuZXZlciwgc2lkZWJhcjogSlF1ZXJ5KSA9PiB7XHJcbiAgICAgIGNvbnN0IHNpZGViYXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBzaWRlYmFyWzBdXHJcbiAgICAgIGlmICghc2lkZWJhckVsZW1lbnQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgaGFzQ2hhdEVsZW1lbnQgPSBzaWRlYmFyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhdC1tZXNzYWdlJylcclxuICAgICAgaWYgKCFoYXNDaGF0RWxlbWVudCkgcmV0dXJuXHJcblxyXG4gICAgICBpbml0VXBsb2FkQXJlYShzaWRlYmFyKVxyXG4gICAgICBpbml0VXBsb2FkQnV0dG9uKHNpZGViYXIpXHJcbiAgICAgIGluaXRDaGF0U2lkZWJhcihzaWRlYmFyKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIEhvb2tzLm9uKCdwcmVDcmVhdGVDaGF0TWVzc2FnZScsIChjaGF0TWVzc2FnZTogYW55LCB1c2VyT3B0aW9uczogbmV2ZXIsIG1lc3NhZ2VPcHRpb25zOiBhbnkpID0+IHtcclxuICAgIGNvbnN0IHByb2Nlc3NlZE1lc3NhZ2U6IHN0cmluZyA9IHByb2Nlc3NNZXNzYWdlKGNoYXRNZXNzYWdlLmNvbnRlbnQpXHJcbiAgICBpZiAoY2hhdE1lc3NhZ2UuY29udGVudCA9PT0gcHJvY2Vzc2VkTWVzc2FnZSkgcmV0dXJuXHJcblxyXG4gICAgY2hhdE1lc3NhZ2UuY29udGVudCA9IHByb2Nlc3NlZE1lc3NhZ2VcclxuICAgIGNoYXRNZXNzYWdlLl9zb3VyY2UuY29udGVudCA9IHByb2Nlc3NlZE1lc3NhZ2VcclxuICAgIG1lc3NhZ2VPcHRpb25zLmNoYXRCdWJibGUgPSBmYWxzZVxyXG4gIH0pXHJcbn1cclxuIl0sIm5hbWVzIjpbImNyZWF0ZSIsImh0bWwiLCJiZWZvcmUiLCJyZWZlcmVuY2VOb2RlIiwibmV3Tm9kZSIsImZpbmQiLCJzZWxlY3RvciIsInBhcmVudE5vZGUiLCJhcHBlbmQiLCJvbiIsImV2ZW50VHlwZSIsImV2ZW50RnVuY3Rpb24iLCJ0cmlnZ2VyIiwicmVtb3ZlQ2xhc3MiLCJjbGFzc1N0cmluZyIsImFkZENsYXNzIiwicmVtb3ZlIiwibm9kZSIsImF0dHIiLCJhdHRySWQiLCJhdHRyVmFsdWUiLCJyZW1vdmVBdHRyIiwiZm9jdXMiLCJPUklHSU5fRk9MREVSIiwidCIsInRleHQiLCJyYW5kb21TdHJpbmciLCJ1c2VyQ2FuVXBsb2FkIiwic2lsZW50IiwidXNlclJvbGUiLCJmaWxlVXBsb2FkUGVybWlzc2lvbnMiLCJ1cGxvYWRQZXJtaXNzaW9uIiwiZ2V0Rm91bmRyeVZlcnNpb24iLCJpc1Zlcmlvc25BZnRlcjEzIiwiRmlsZVBpY2tlckltcGxlbWVudGF0aW9uIiwiSW1hZ2VQb3BvdXRJbXBsZW1lbnRhdGlvbiIsImNyZWF0ZVVwbG9hZEFyZWEiLCJpbml0VXBsb2FkQXJlYSIsInNpZGViYXIiLCJjaGF0Q29udHJvbHNTZWxlY3RvciIsImNoYXRDb250cm9scyIsInVwbG9hZEFyZWEiLCJfbWVyZ2VOYW1lc3BhY2VzIiwiZSIsInIiLCJpIiwiY29weUV4aWZXaXRob3V0T3JpZW50YXRpb24iLCJvIiwiZ2V0QXBwMVNlZ21lbnQiLCJhIiwicyIsImYiLCJsIiwiYyIsIlVaSVAiLCJ1IiwiaCIsImQiLCJBIiwiZyIsInAiLCJtIiwiXyIsInciLCJiIiwieSIsIkUiLCJGIiwiQiIsIlUiLCJDIiwiSSIsIlEiLCJNIiwieCIsIlMiLCJSIiwiVCIsIk8iLCJQIiwiSCIsIkwiLCJwdXNoViIsIlVQTkciLCJkZWNvZGVJbWFnZSIsIl9nZXRCUFAiLCJ2IiwiX2RlY29tcHJlc3MiLCJfaW5mbGF0ZSIsIl9maWx0ZXJaZXJvIiwibiIsIl9wYWV0aCIsIl9JSERSIiwiX2NvcHlUaWxlIiwiYWRkRXJyIiwiTiIsIkQiLCJkaXRoZXIiLCJfbWFpbiIsImNvbXByZXNzUE5HIiwiY29tcHJlc3MiLCJfcHJlcGFyZURpZmYiLCJfdXBkYXRlRnJhbWUiLCJxdWFudGl6ZSIsIl9maWx0ZXJMaW5lIiwiZ2V0S0R0cmVlIiwiZ2V0TmVhcmVzdCIsInBsYW5lRHN0Iiwic3RhdHMiLCJlc3RhdHMiLCJzcGxpdFBpeGVscyIsInZlY0RvdCIsInNldDE2Iiwic2V0MzIiLCJzZWVrIiwiY29udmVydCIsIkN1c3RvbUZpbGUiLCJDdXN0b21GaWxlUmVhZGVyIiwiZ2V0RmlsZWZyb21EYXRhVXJsIiwiZ2V0RGF0YVVybEZyb21GaWxlIiwibG9hZEltYWdlIiwiZ2V0QnJvd3Nlck5hbWUiLCJhcHByb3hpbWF0ZUJlbG93TWF4aW11bUNhbnZhc1NpemVPZkJyb3dzZXIiLCJnZXROZXdDYW52YXNBbmRDdHgiLCJkcmF3SW1hZ2VJbkNhbnZhcyIsImlzSU9TIiwiZHJhd0ZpbGVJbkNhbnZhcyIsIiRUcnlfMl9Qb3N0IiwiJFRyeV8yX0NhdGNoIiwiJFRyeV8zX0NhdGNoIiwiY2FudmFzVG9GaWxlIiwiJElmXzQiLCIkSWZfNSIsIiRJZl82IiwiY2xlYW51cENhbnZhc01lbW9yeSIsImlzQXV0b09yaWVudGF0aW9uSW5Ccm93c2VyIiwiZ2V0RXhpZk9yaWVudGF0aW9uIiwiaGFuZGxlTWF4V2lkdGhPckhlaWdodCIsImZvbGxvd0V4aWZPcmllbnRhdGlvbiIsImluY1Byb2dyZXNzIiwic2V0UHJvZ3Jlc3MiLCIkSWZfMiIsIiRMb29wXzMiLCIkTG9vcF8zX2V4aXQiLCJjb21wcmVzc09uV2ViV29ya2VyIiwiaW1hZ2VDb21wcmVzc2lvbiIsIiRUcnlfMV9DYXRjaCIsInRvZ2dsZUNoYXQiLCJjaGF0IiwidG9nZ2xlIiwidG9nZ2xlU3Bpbm5lciIsImNoYXRGb3JtIiwic3Bpbm5lcklkIiwic3Bpbm5lciIsIm5ld1NwaW5uZXIiLCJnZXRVcGxvYWRpbmdTdGF0ZXMiLCJjaGF0Rm9ybVF1ZXJ5IiwiY3JlYXRlVXBsb2FkRm9sZGVyIiwidXBsb2FkTG9jYXRpb24iLCJsb2NhdGlvbiIsImdldFNldHRpbmciLCJzZXRTZXR0aW5nIiwia2V5IiwidmFsdWUiLCJnZXRTZXR0aW5ncyIsIm5ld1VwbG9hZExvY2F0aW9uIiwiZGVmYXVsdExvY2F0aW9uIiwic2hvdWxkQ2hhbmdlTG9jYXRpb24iLCJyZWdpc3RlclNldHRpbmciLCJzZXR0aW5nIiwiUkVTVFJJQ1RFRF9ET01BSU5TIiwiRE9NX1BBUlNFUiIsImltYWdlUXVldWUiLCJpc0ZpbGVJbWFnZSIsImZpbGUiLCJyZXN1bHQiLCJjcmVhdGVJbWFnZVByZXZpZXciLCJpbWFnZVNyYyIsImlkIiwiYWRkRXZlbnRUb1JlbW92ZUJ1dHRvbiIsInJlbW92ZUJ1dHRvbiIsInNhdmVWYWx1ZSIsImltYWdlIiwiaW1nRGF0YSIsInVwbG9hZEltYWdlIiwiZ2VuZXJhdGVGaWxlTmFtZSIsInR5cGUiLCJuYW1lIiwiZmlsZUV4dGVuc2lvbiIsIm5ld05hbWUiLCJjb21wcmVzc2VkSW1hZ2UiLCJuZXdJbWFnZSIsImltYWdlTG9jYXRpb24iLCJwYXRoIiwiYWRkSW1hZ2VUb1F1ZXVlIiwidXBsb2FkaW5nU3RhdGVzIiwiaW1hZ2VQcmV2aWV3IiwiaW1hZ2VzRmlsZVJlYWRlckhhbmRsZXIiLCJldnQiLCJwcm9jZXNzSW1hZ2VGaWxlcyIsImZpbGVzIiwicmVhZGVyIiwicHJvY2Vzc0Ryb3BBbmRQYXN0ZUltYWdlcyIsImV2ZW50RGF0YSIsImV4dHJhY3RVcmxGcm9tRXZlbnREYXRhIiwiaW1hZ2VzIiwiaW1hZ2VVcmxzIiwiaW1nIiwiaW1hZ2VzQ29udGFpblJlc3RyaWN0ZWREb21haW5zIiwiaXUiLCJyZCIsInVybHNGcm9tRXZlbnREYXRhSGFuZGxlciIsInVybHMiLCJpdGVtcyIsIml0ZW0iLCJnZXRJbWFnZVF1ZXVlIiwicmVtb3ZlQWxsRnJvbVF1ZXVlIiwiaW1hZ2VEYXRhIiwiaW1hZ2VFbGVtZW50IiwiY3JlYXRlVXBsb2FkQnV0dG9uIiwiY3JlYXRlSGlkZGVuVXBsb2FkSW5wdXQiLCJzZXR1cEV2ZW50cyIsInVwbG9hZEJ1dHRvbiIsImhpZGRlblVwbG9hZElucHV0IiwiaGlkZGVuVXBsb2FkSW5wdXRDaGFuZ2VFdmVudEhhbmRsZXIiLCJjdXJyZW50VGFyZ2V0IiwidXBsb2FkQnV0dG9uQ2xpY2tFdmVudEhhbmRsZXIiLCJpbml0VXBsb2FkQnV0dG9uIiwiY29udHJvbEJ1dHRvbnMiLCJuZXdDb250cm9sQnV0dG9ucyIsImhvb2tJc0hhbmRsaW5nVGhlTWVzc2FnZSIsImV2ZW50SXNIYW5kbGluZ1RoZU1lc3NhZ2UiLCJpbWFnZVRlbXBsYXRlIiwiaW1hZ2VQcm9wcyIsIm1lc3NhZ2VUZW1wbGF0ZSIsInByZUNyZWF0ZUNoYXRNZXNzYWdlSGFuZGxlciIsImNoYXRNZXNzYWdlIiwidXNlck9wdGlvbnMiLCJtZXNzYWdlT3B0aW9ucyIsInVwbG9hZFN0YXRlIiwiY29udGVudCIsImVtcHR5Q2hhdEV2ZW50SGFuZGxlciIsImNoYXRNZXNzYWdlVHlwZSIsIm1lc3NhZ2VEYXRhIiwicGFzdEFuZERyb3BFdmVudEhhbmRsZXIiLCJvcmlnaW5hbEV2ZW50IiwiaXNVcGxvYWRBcmVhUmVuZGVyZWQiLCJpbml0Q2hhdFNpZGViYXIiLCJpbml0Q2hhdE1lc3NhZ2UiLCJzcmMiLCJpbWFnZVBvcHVwIiwiaW1hZ2VNYXJrZG93blJlZyIsImltYWdlUmVnIiwicHJvY2Vzc01lc3NhZ2UiLCJtZXNzYWdlIiwicmVnaXN0ZXJTZXR0aW5ncyIsInJlZ2lzdGVySG9va3MiLCJfMCIsImNoYXRNZXNzYWdlRWxlbWVudCIsImluaXRFdmVudHMiLCJjb2xsYXBzZWQiLCJzaWRlYmFyRWxlbWVudCIsInNpZGViYXJKcSIsImNoYXRMb2ciLCJjaGF0TG9nRWxlbWVudCIsImNoYXRMb2dKcSIsInByb2Nlc3NlZE1lc3NhZ2UiXSwibWFwcGluZ3MiOiJBQUNPLE1BQU1BLEtBQVMsQ0FBQ0MsTUFBdUMsRUFBRUEsQ0FBSSxHQUN2REMsS0FBUyxDQUFDQyxHQUF1QkMsTUFBNEJELEVBQWMsT0FBT0MsQ0FBTyxHQUV6RkMsS0FBTyxDQUFDQyxHQUFrQkMsTUFBZ0NBLElBQWFBLEVBQVcsS0FBS0QsQ0FBUSxJQUFJLEVBQUVBLENBQVEsR0FDN0dFLEtBQVMsQ0FBQ0QsR0FBb0JILE1BQTRCRyxFQUFXLE9BQU9ILENBQU8sR0FFbkZLLEtBQUssQ0FBQ0YsR0FBb0JHLEdBQW1CQyxNQUFvQ0osRUFBVyxHQUFHRyxHQUFXQyxDQUFhLEdBQ3ZIQyxLQUFVLENBQUNMLEdBQW9CRyxNQUE4QkgsRUFBVyxRQUFRRyxDQUFTLEdBQ3pGRyxLQUFjLENBQUNOLEdBQW9CTyxNQUFnQ1AsRUFBVyxZQUFZTyxDQUFXLEdB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QUVDLENBQUM7QUFBQSxJQUFDO0FBQUMsV0FBT0E7QUFBQSxFQUFDLEdBQUVFLEVBQUssRUFBRSxhQUFXLFNBQVMsR0FBRSxHQUFFVixHQUFFLEdBQUVHLEdBQUU7QUFBQyxRQUFJRSxJQUFFRixNQUFJO0FBQUUsV0FBTyxFQUFFRSxDQUFDLElBQUVMLEdBQUUsRUFBRUssSUFBRSxDQUFDLElBQUVMLE1BQUksR0FBRSxFQUFFSyxJQUFFLENBQUMsSUFBRSxNQUFJLEVBQUVBLENBQUMsR0FBRSxFQUFFQSxJQUFFLENBQUMsSUFBRSxNQUFJLEVBQUVBLElBQUUsQ0FBQyxHQUFFQSxLQUFHLEdBQUUsRUFBRSxJQUFJLElBQUksV0FBVyxFQUFFLFFBQU8sR0FBRUwsQ0FBQyxHQUFFSyxDQUFDLEdBQUVGLEtBQUdILElBQUUsS0FBRztBQUFBLEVBQUUsR0FBRVUsRUFBSyxFQUFFLFdBQVMsV0FBVTtBQUFDLGFBQVEsSUFBRUEsRUFBSyxFQUFFLEdBQUUsSUFBRUEsRUFBSyxFQUFFLFNBQVMsRUFBRSxNQUFLLEVBQUUsT0FBTSxFQUFFLEdBQUVWLElBQUVVLEVBQUssRUFBRSxTQUFTLEVBQUUsTUFBSyxFQUFFLE9BQU0sRUFBRSxHQUFFLElBQUUsQ0FBQSxHQUFHUCxJQUFFTyxFQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU0sQ0FBQyxHQUFFTCxJQUFFLENBQUEsR0FBR0MsSUFBRUksRUFBSyxFQUFFLFVBQVUsRUFBRSxPQUFNTCxDQUFDLEdBQUVFLElBQUUsR0FBRUEsSUFBRSxFQUFFLFFBQU9BLEtBQUcsRUFBRSxHQUFFLEtBQUssRUFBRUEsQ0FBQyxDQUFDO0FBQUksU0FBSUEsSUFBRSxHQUFFQSxJQUFFRixFQUFFLFFBQU9FLEtBQUcsRUFBRSxHQUFFLEtBQUtGLEVBQUVFLENBQUMsQ0FBQztBQUFJLGFBQVFDLElBQUVFLEVBQUssRUFBRSxTQUFTLEVBQUUsTUFBSyxFQUFFLE9BQU0sQ0FBQyxHQUFFRCxJQUFFLElBQUdBLElBQUUsS0FBTSxFQUFFLE1BQU0sS0FBRyxFQUFFLEtBQUtBLElBQUUsQ0FBQyxLQUFHLEVBQUUsS0FBN0IsSUFBZ0MsQ0FBQUE7QUFBSSxXQUFNLENBQUMsR0FBRVQsR0FBRVEsR0FBRUwsR0FBRUcsR0FBRUcsR0FBRSxHQUFFSixDQUFDO0FBQUEsRUFBQyxHQUFFSyxFQUFLLEVBQUUsWUFBVSxTQUFTLEdBQUU7QUFBQyxhQUFRLElBQUUsQ0FBQSxHQUFHVixJQUFFLEdBQUVBLElBQUUsRUFBRSxRQUFPQSxLQUFHLEVBQUUsR0FBRSxLQUFLLEVBQUVBLElBQUUsQ0FBQyxDQUFDO0FBQUUsV0FBTztBQUFBLEVBQUMsR0FBRVUsRUFBSyxFQUFFLFVBQVEsU0FBUyxHQUFFO0FBQUMsYUFBUSxJQUFFLElBQUdWLElBQUUsR0FBRUEsSUFBRSxFQUFFLFFBQU9BLEtBQUcsRUFBRSxDQUFHLEVBQUVBLElBQUUsQ0FBQyxLQUFSLE1BQVksTUFBSUEsS0FBRyxLQUFHO0FBQUssV0FBTztBQUFBLEVBQUMsR0FBRVUsRUFBSyxFQUFFLFdBQVMsU0FBUyxHQUFFLEdBQUU7QUFBQyxhQUFRVixJQUFFLEdBQUUsSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPLElBQUksQ0FBQUEsS0FBRyxFQUFFLENBQUMsSUFBRSxFQUFFLEtBQUcsS0FBRyxFQUFFO0FBQUUsV0FBT0E7QUFBQSxFQUFDLEdBQUVVLEVBQUssRUFBRSxZQUFVLFNBQVMsR0FBRSxHQUFFVixHQUFFLEdBQUU7QUFBQyxhQUFRRyxJQUFFLEdBQUVBLElBQUUsRUFBRSxRQUFPQSxLQUFHLEdBQUU7QUFBQyxVQUFJRSxJQUFFLEVBQUVGLENBQUMsR0FBRUcsSUFBRSxFQUFFSCxJQUFFLENBQUM7QUFBRSxVQUFFTyxFQUFLLEVBQUUsVUFBVUwsR0FBRSxHQUFFTCxHQUFFLENBQUM7QUFBRSxVQUFJTyxJQUFNRixLQUFKLEtBQU0sSUFBTUEsS0FBSixLQUFNLElBQUU7QUFBRSxNQUFBQSxJQUFFLE9BQUtLLEVBQUssRUFBRSxPQUFPVixHQUFFLEdBQUVNLEdBQUVDLENBQUMsR0FBRSxLQUFHQTtBQUFBLElBQUU7QUFBQyxXQUFPO0FBQUEsRUFBQyxHQUFFRyxFQUFLLEVBQUUsWUFBVSxTQUFTLEdBQUUsR0FBRTtBQUFDLGFBQVFWLElBQUUsRUFBRSxRQUFVQSxLQUFILEtBQVMsRUFBRUEsSUFBRSxDQUFDLEtBQVIsSUFBVyxDQUFBQSxLQUFHO0FBQUUsYUFBUSxJQUFFLEdBQUUsSUFBRUEsR0FBRSxLQUFHLEdBQUU7QUFBQyxVQUFJRyxJQUFFLEVBQUUsSUFBRSxDQUFDLEdBQUVFLElBQUUsSUFBRSxJQUFFTCxJQUFFLEVBQUUsSUFBRSxDQUFDLElBQUUsSUFBR00sSUFBRSxJQUFFLElBQUVOLElBQUUsRUFBRSxJQUFFLENBQUMsSUFBRSxJQUFHTyxJQUFLLEtBQUgsSUFBSyxLQUFHLEVBQUUsSUFBRSxDQUFDO0FBQUUsVUFBTUosS0FBSCxLQUFNRSxLQUFHRixLQUFHRyxLQUFHSCxHQUFFO0FBQUMsaUJBQVFLLElBQUUsSUFBRSxHQUFFQSxJQUFFLElBQUVSLEtBQUcsRUFBRVEsSUFBRSxDQUFDLEtBQUdMLElBQUcsQ0FBQUssS0FBRztBQUFFLFNBQUNDLElBQUUsS0FBSyxJQUFJRCxJQUFFLElBQUUsTUFBSSxHQUFFLEdBQUcsS0FBRyxLQUFHLEVBQUUsS0FBSyxJQUFHQyxJQUFFLENBQUMsSUFBRSxFQUFFLEtBQUssSUFBR0EsSUFBRSxFQUFFLEdBQUUsS0FBRyxJQUFFQSxJQUFFO0FBQUEsTUFBQyxXQUFTTixLQUFHSSxLQUFHRixLQUFHRixLQUFHRyxLQUFHSCxHQUFFO0FBQUMsYUFBSUssSUFBRSxJQUFFLEdBQUVBLElBQUUsSUFBRVIsS0FBRyxFQUFFUSxJQUFFLENBQUMsS0FBR0wsSUFBRyxDQUFBSyxLQUFHO0FBQUUsWUFBSUMsSUFBRSxLQUFLLElBQUlELElBQUUsSUFBRSxNQUFJLEdBQUUsQ0FBQztBQUFFLFVBQUUsS0FBSyxJQUFHQyxJQUFFLENBQUMsR0FBRSxLQUFHLElBQUVBLElBQUU7QUFBQSxNQUFDLE1BQU0sR0FBRSxLQUFLTixHQUFFLENBQUM7QUFBQSxJQUFDO0FBQUMsV0FBT0gsTUFBSTtBQUFBLEVBQUMsR0FBRVUsRUFB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QUFFLEtBQUk7QUFBQyxVQUFJTyxJQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQUUsUUFBRSxDQUFDLEVBQUUsSUFBRSxHQUFFRCxLQUFHRixLQUFHLEtBQUdILElBQUVNO0FBQUEsSUFBRTtBQUFDLFNBQUlELE9BQUtMLElBQUUsR0FBRUssSUFBRTtBQUFJLE9BQUNDLElBQUUsRUFBRSxDQUFDLEVBQUUsS0FBRyxLQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUlELEtBQUcsS0FBRyxJQUFFQyxJQUFFLEtBQUc7QUFBSSxXQUFLLEtBQUcsR0FBRSxJQUFJLEdBQUUsQ0FBQyxFQUFFLEtBQUcsS0FBR0QsSUFBRSxNQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUlBO0FBQUssSUFBR0EsS0FBSCxLQUFNLFFBQVEsSUFBSSxXQUFXO0FBQUEsRUFBQyxHQUFFSyxFQUFLLEVBQUUsYUFBVyxTQUFTLEdBQUUsR0FBRTtBQUFDLFFBQUlWLElBQUU7QUFBRSxXQUFPLEVBQUUsS0FBR0EsQ0FBQyxLQUFHLE1BQUlBLEtBQUcsS0FBSSxFQUFFLElBQUVBLENBQUMsS0FBRyxNQUFJQSxLQUFHLElBQUcsRUFBRSxJQUFFQSxDQUFDLEtBQUcsTUFBSUEsS0FBRyxJQUFHLEVBQUUsSUFBRUEsQ0FBQyxLQUFHLE1BQUlBLEtBQUcsSUFBRyxFQUFFLElBQUVBLENBQUMsS0FBRyxNQUFJQSxLQUFHLElBQUdBO0FBQUEsRUFBQyxHQUFFVSxFQUFLLEVBQUUsWUFBVSxTQUFTLEdBQUUsR0FBRVYsR0FBRSxHQUFFO0FBQUMsV0FBT1UsRUFBSyxFQUFFLE9BQU9WLEdBQUUsR0FBRSxFQUFFLEtBQUcsQ0FBQyxDQUFDLEdBQUUsSUFBRSxFQUFFLEtBQUcsS0FBRyxFQUFFO0FBQUEsRUFBQyxHQUFFVSxFQUFLLEVBQUUsVUFBUSxTQUFTLEdBQUUsR0FBRTtBQUFDLFFBQUlWLElBQUU7QUFBVyxRQUFNLEVBQUUsQ0FBQyxLQUFOLEtBQVksRUFBRSxDQUFDLEtBQU4sRUFBUSxRQUFPLEtBQUcsSUFBSUEsRUFBRSxDQUFDO0FBQUUsUUFBSSxJQUFFVSxF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RSxLQUFHLE1BQUksRUFBRSxLQUFHLFFBQU0sSUFBRSxNQUFJLEtBQUdBLEtBQUc7QUFBQSxFQUFDLEdBQUVVLEVBQUssRUFBRSxTQUFPLFNBQVMsR0FBRSxHQUFFVixHQUFFO0FBQUMsWUFBTyxFQUFFLE1BQUksQ0FBQyxJQUFFLEVBQUUsS0FBRyxNQUFJLEVBQUUsS0FBRyxJQUFFLEVBQUUsS0FBRyxNQUFJLEVBQUUsS0FBRyxTQUFPLElBQUUsTUFBSSxLQUFHQSxLQUFHO0FBQUEsRUFBQyxHQUFFVSxFQUFLLEVBQUUsU0FBTyxTQUFTLEdBQUUsR0FBRTtBQUFDLFlBQU8sRUFBRSxNQUFJLENBQUMsSUFBRSxFQUFFLEtBQUcsTUFBSSxFQUFFLEtBQUcsSUFBRSxFQUFFLEtBQUcsTUFBSSxFQUFFLEtBQUcsU0FBTyxJQUFFO0FBQUEsRUFBRSxHQUFFQSxFQUFLLEVBQUUsU0FBTyxTQUFTLEdBQUUsR0FBRTtBQUFDLFlBQU8sRUFBRSxNQUFJLENBQUMsSUFBRSxFQUFFLEtBQUcsTUFBSSxFQUFFLEtBQUcsSUFBRSxFQUFFLEtBQUcsTUFBSSxFQUFFLEtBQUcsS0FBRyxFQUFFLEtBQUcsTUFBSSxFQUFFLEtBQUcsU0FBTyxJQUFFO0FBQUEsRUFBRSxHQUFFQSxFQUFLLEVBQUUsS0FBR1YsSUFBRSxhQUFZQyxJQUFFLGFBQVksRUFBQyxXQUFVLElBQUlELEVBQUUsRUFBRSxHQUFFLFVBQVMsSUFBSUEsRUFBRSxFQUFFLEdBQUUsTUFBSyxDQUFDLElBQUcsSUFBRyxJQUFHLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxJQUFHLEdBQUUsSUFBRyxHQUFFLElBQUcsR0FBRSxJQUFHLEdBQUUsSUFBRyxHQUFFLEVBQUUsR0FBRSxLQUFJLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxHQUFHLEdBQUUsS0FBSSxDQUFDLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLE1BQUssSUFBSUEsRUFBRSxFQUFFLEdBQUUsS0FBSSxDQUFDLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxNQUFLLE1BQUssTUFBSyxNQUFLLE1BQUssTUFBSyxNQUFLLE9BQU0sT0FBTSxPQUFNLE9BQU0sS0FBSyxHQUFFLEtBQUksQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxHQUFFLENBQUMsR0FBRSxNQUFLLElBQUlDLEVBQUUsRUFBRSxHQUFFLE9BQU0sSUFBSUQsRUFBRSxHQUFHLEdBQUUsUUFBTyxDQUFBLEdBQUcsT0FBTSxJQUFJQSxFQUFFLEVBQUUsR0FBRSxRQUFPLENBQUEsR0FBRyxNQUFLLElBQUlBLEVBQUUsS0FBSyxHQUFFLE9BQU0sQ0FBQSxHQUFHLE9BQU0sQ0FBQSxHQUFHLE1BQUssSUFBSUEsRUFBRSxLQUFLLEdBQUUsT0FBTSxDQUFBLEdBQUcsTUFBSyxJQUFJQSxFQUFFLEdBQUcsR0FBRSxPQUFNLENBQUEsR0FBRyxPQUFNLElBQUlBLEVBQUUsS0FBSyxHQUFFLE1BQUssSUFBSUMsRUFBRSxHQUFHLEdBQUUsTUFBSyxJQUFJQSxFQUFFLEVBQUUsR0FBRSxNQUFLLElB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QUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLENBQUMsR0FBRSxHQUFFLElBQUlBLEVBQUUsRUFBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsS0FBSSxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksTUFBSyxNQUFLLE1BQUssTUFBSyxNQUFLLE1BQUssTUFBSyxPQUFNLE9BQU0sT0FBTSxPQUFNLEtBQUssR0FBRSxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsR0FBRSxDQUFDLEdBQUUsR0FBRSxJQUFJbkIsRUFBRSxFQUFFLEdBQUUsR0FBRSxJQUFJbUIsRUFBRSxHQUFHLEdBQUUsR0FBRSxDQUFBLEdBQUcsR0FBRSxJQUFJQSxFQUFFLEVBQUUsR0FBRSxHQUFFLENBQUEsR0FBRyxHQUFFLElBQUlBLEVBQUUsS0FBSyxHQUFFLEdBQUUsSUFBRyxHQUFFLENBQUEsR0FBRyxHQUFFLElBQUlBLEVBQUUsS0FBSyxHQUFFLEdBQUUsQ0FBQSxHQUFHLEdBQUUsSUFBSUEsRUFBRSxHQUFHLEdBQUUsR0FBRSxDQUFBLEdBQUcsR0FBRSxJQUFJQSxFQUFFLEtBQUssR0FBRSxHQUFFLElBQUluQixFQUFFLEdBQUcsR0FBRSxHQUFFLElBQUlBLEVBQUUsRUFBRSxHQUFFLEdBQUUsSUFBSUEsRUFBRSxFQUFFLEdBQUUsR0FBRSxJQUFJQSxFQUFFLElBQUksR0FBRSxHQUFFLElBQUltQixFQUFFLEtBQUssR0FBRSxHQUFFLElBQUlBLEVBQUUsS0FBSyxFQUFDO0FBQUEsSUFBQyxHQUFDLElBQUcsV0FBVTtBQUFDLFlBQU1uQixJQUFFbUIs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Q0FBQyxHQUFFTSxJQUFFTixFQUFFLENBQUMsR0FBRU8sSUFBRVAsRUFBRSxDQUFDLEdBQUVRLElBQUVSLEVBQUUsQ0FBQyxHQUFFUyxJQUFLUixLQUFILElBQUssSUFBRSxJQUFFQSxHQUFFVSxJQUFFLENBQUMvQixFQUFFLENBQUMsSUFBRXlCLElBQUVBLElBQUVJLEdBQUU3QixFQUFFLENBQUMsSUFBRXlCLElBQUVDLElBQUVHLEdBQUU3QixFQUFFLENBQUMsSUFBRXlCLElBQUVFLElBQUVFLEdBQUU3QixFQUFFLENBQUMsSUFBRXlCLElBQUVHLElBQUVDLEdBQUU3QixFQUFFLENBQUMsSUFBRTBCLElBQUVELElBQUVJLEdBQUU3QixFQUFFLENBQUMsSUFBRTBCLElBQUVBLElBQUVHLEdBQUU3QixFQUFFLENBQUMsSUFBRTBCLElBQUVDLElBQUVFLEdBQUU3QixFQUFFLENBQUMsSUFBRTBCLElBQUVFLElBQUVDLEdBQUU3QixFQUFFLENBQUMsSUFBRTJCLElBQUVGLElBQUVJLEdBQUU3QixFQUFFLENBQUMsSUFBRTJCLElBQUVELElBQUVHLEdBQUU3QixFQUFFLEVBQUUsSUFBRTJCLElBQUVBLElBQUVFLEdBQUU3QixFQUFFLEVBQUUsSUFBRTJCLElBQUVDLElBQUVDLEdBQUU3QixFQUFFLEVBQUUsSUFBRTRCLElBQUVILElBQUVJLEdBQUU3QixFQUFFLEVBQUUsSUFBRTRCLElBQUVGLElBQUVHLEdBQUU3QixFQUFFLEVBQUUsSUFBRTRCLElBQUVELElBQUVFLEdBQUU3QixFQUFFLEVBQUUsSUFBRTRCLElBQUVBLElBQUVDLENBQUMsR0FBRUcsSUFBRUQsR0FBRUUsSUFBRVY7QUFBRSxRQUFJVyxJQUFFLENBQUMsS0FBSyxPQUFNLEdBQUcsS0FBSyxPQUFNLEdBQUcsS0FBSyxPQUFNLEdBQUcsS0FBSyxPQUFNLENBQUUsR0FBRUMsSUFBRSxHQUFFQyxJQUFFO0FBQUUsUUFBTWYsS0FBSCxFQUFLLFVBQVFGLElBQUUsR0FBRUEsSUFBRSxPQUFLZSxJQUFFRCxFQUFFLFFBQVFELEdBQUVFLENBQUMs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
