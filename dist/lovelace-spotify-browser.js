/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, K = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, X = Symbol(), rt = /* @__PURE__ */ new WeakMap();
let gt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== X) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (K && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = rt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && rt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const xt = (s) => new gt(typeof s == "string" ? s : s + "", void 0, X), tt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[a + 1], s[0]);
  return new gt(e, s, X);
}, wt = (s, t) => {
  if (K) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = V.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, at = K ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return xt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: At, getOwnPropertyDescriptor: St, getOwnPropertyNames: Pt, getOwnPropertySymbols: Tt, getPrototypeOf: Ct } = Object, A = globalThis, ot = A.trustedTypes, Et = ot ? ot.emptyScript : "", F = A.reactiveElementPolyfillSupport, B = (s, t) => s, G = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Et : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, et = (s, t) => !kt(s, t), nt = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: et };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), A.litPropertyMetadata ?? (A.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = nt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && At(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: a } = St(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      a == null || a.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const e = this.properties, i = [...Pt(e), ...Tt(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(at(r));
    } else t !== void 0 && e.push(at(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return wt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var a;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : G).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((a = l.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? l.converter : G;
      this._$Em = r;
      const u = n.fromAttribute(e, l.type);
      this[r] = u ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, a) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (a = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? et)(a, e) || i.useDefault && i.reflect && a === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: a }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), a !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, o] of this._$Ep) this[a] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [a, o] of r) {
        const { wrapped: l } = o, n = this[a];
        l !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, o, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var a;
        return (a = r.hostUpdate) == null ? void 0 : a.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[B("elementProperties")] = /* @__PURE__ */ new Map(), O[B("finalized")] = /* @__PURE__ */ new Map(), F == null || F({ ReactiveElement: O }), (A.reactiveElementVersions ?? (A.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, lt = (s) => s, W = U.trustedTypes, ht = W ? W.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, mt = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, bt = "?" + k, Mt = `<${bt}>`, M = document, L = () => M.createComment(""), N = (s) => s === null || typeof s != "object" && typeof s != "function", st = Array.isArray, zt = (s) => st(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, pt = />/g, S = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), dt = /'/g, ut = /"/g, vt = /^(?:script|style|textarea|title)$/i, yt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), h = yt(1), b = yt(2), H = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ft = /* @__PURE__ */ new WeakMap(), T = M.createTreeWalker(M, 129);
function $t(s, t) {
  if (!st(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ht !== void 0 ? ht.createHTML(t) : t;
}
const Ot = (s, t) => {
  const e = s.length - 1, i = [];
  let r, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = R;
  for (let l = 0; l < e; l++) {
    const n = s[l];
    let u, c, p = -1, g = 0;
    for (; g < n.length && (o.lastIndex = g, c = o.exec(n), c !== null); ) g = o.lastIndex, o === R ? c[1] === "!--" ? o = ct : c[1] !== void 0 ? o = pt : c[2] !== void 0 ? (vt.test(c[2]) && (r = RegExp("</" + c[2], "g")), o = S) : c[3] !== void 0 && (o = S) : o === S ? c[0] === ">" ? (o = r ?? R, p = -1) : c[1] === void 0 ? p = -2 : (p = o.lastIndex - c[2].length, u = c[1], o = c[3] === void 0 ? S : c[3] === '"' ? ut : dt) : o === ut || o === dt ? o = S : o === ct || o === pt ? o = R : (o = S, r = void 0);
    const w = o === S && s[l + 1].startsWith("/>") ? " " : "";
    a += o === R ? n + Mt : p >= 0 ? (i.push(u), n.slice(0, p) + mt + n.slice(p) + k + w) : n + k + (p === -2 ? l : w);
  }
  return [$t(s, a + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class j {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let a = 0, o = 0;
    const l = t.length - 1, n = this.parts, [u, c] = Ot(t, e);
    if (this.el = j.createElement(u, i), T.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = T.nextNode()) !== null && n.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(mt)) {
          const g = c[o++], w = r.getAttribute(p).split(k), I = /([.?@])?(.*)/.exec(g);
          n.push({ type: 1, index: a, name: I[2], strings: w, ctor: I[1] === "." ? Dt : I[1] === "?" ? Rt : I[1] === "@" ? Bt : Q }), r.removeAttribute(p);
        } else p.startsWith(k) && (n.push({ type: 6, index: a }), r.removeAttribute(p));
        if (vt.test(r.tagName)) {
          const p = r.textContent.split(k), g = p.length - 1;
          if (g > 0) {
            r.textContent = W ? W.emptyScript : "";
            for (let w = 0; w < g; w++) r.append(p[w], L()), T.nextNode(), n.push({ type: 2, index: ++a });
            r.append(p[g], L());
          }
        }
      } else if (r.nodeType === 8) if (r.data === bt) n.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(k, p + 1)) !== -1; ) n.push({ type: 7, index: a }), p += k.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = M.createElement("template");
    return i.innerHTML = t, i;
  }
}
function D(s, t, e = s, i) {
  var o, l;
  if (t === H) return t;
  let r = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const a = N(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== a && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), a === void 0 ? r = void 0 : (r = new a(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = D(s, r._$AS(s, t.values), r, i)), t;
}
class Ht {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? M).importNode(e, !0);
    T.currentNode = r;
    let a = T.nextNode(), o = 0, l = 0, n = i[0];
    for (; n !== void 0; ) {
      if (o === n.index) {
        let u;
        n.type === 2 ? u = new q(a, a.nextSibling, this, t) : n.type === 1 ? u = new n.ctor(a, n.name, n.strings, this, t) : n.type === 6 && (u = new Ut(a, this, t)), this._$AV.push(u), n = i[++l];
      }
      o !== (n == null ? void 0 : n.index) && (a = T.nextNode(), o++);
    }
    return T.currentNode = M, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class q {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = D(this, t, e), N(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== H && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(M.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = j.createElement($t(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === r) this._$AH.p(e);
    else {
      const o = new Ht(r, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ft.get(t.strings);
    return e === void 0 && ft.set(t.strings, e = new j(t)), e;
  }
  k(t) {
    st(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const a of t) r === e.length ? e.push(i = new q(this.O(L()), this.O(L()), this, this.options)) : i = e[r], i._$AI(a), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = lt(t).nextSibling;
      lt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class Q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, r) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = D(this, t, e, 0), o = !N(t) || t !== this._$AH && t !== H, o && (this._$AH = t);
    else {
      const l = t;
      let n, u;
      for (t = a[0], n = 0; n < a.length - 1; n++) u = D(this, l[i + n], e, n), u === H && (u = this._$AH[n]), o || (o = !N(u) || u !== this._$AH[n]), u === d ? t = d : t !== d && (t += (u ?? "") + a[n + 1]), this._$AH[n] = u;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Dt extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Rt extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Bt extends Q {
  constructor(t, e, i, r, a) {
    super(t, e, i, r, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = D(this, t, e, 0) ?? d) === H) return;
    const i = this._$AH, r = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ut {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    D(this, t);
  }
}
const Z = U.litHtmlPolyfillSupport;
Z == null || Z(j, q), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.2");
const Lt = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new q(t.insertBefore(L(), a), a, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
class E extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return H;
  }
}
var _t;
E._$litElement$ = !0, E.finalized = !0, (_t = C.litElementHydrateSupport) == null || _t.call(C, { LitElement: E });
const J = C.litElementPolyfillSupport;
J == null || J({ LitElement: E });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nt = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: et }, jt = (s = Nt, t, e) => {
  const { kind: i, metadata: r } = e;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), a.set(e.name, s), i === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, n, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(l) {
      const n = this[o];
      t.call(this, l), this.requestUpdate(o, n, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function y(s) {
  return (t, e) => typeof e == "object" ? jt(s, t, e) : ((i, r, a) => {
    const o = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, i), o ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(s) {
  return y({ ...s, state: !0, attribute: !1 });
}
class qt {
  constructor(t) {
    this._hass = t;
  }
  set hass(t) {
    this._hass = t;
  }
  async request(t, e, i, r) {
    return this._hass.callWS({
      type: "lovelace_spotify_browser/request",
      method: t,
      endpoint: e,
      ...i ? { body: i } : {},
      ...r ? { params: r } : {}
    });
  }
  async getPlaylists() {
    return this.request("GET", "/me/playlists", void 0, { limit: "50" });
  }
  async getRecentlyPlayed() {
    return this.request("GET", "/me/player/recently-played", void 0, { limit: "50" });
  }
  async getTopTracks() {
    return this.request("GET", "/me/top/tracks", void 0, { limit: "50" });
  }
  async getAlbum(t) {
    return this.request("GET", `/albums/${t}`);
  }
  async getAlbumTracks(t) {
    return this.request("GET", `/albums/${t}/tracks`, void 0, { limit: "50" });
  }
  async getPlaylistTracks(t) {
    return this.request("GET", `/playlists/${t}/tracks`, void 0, {
      limit: "50"
    });
  }
  async search(t) {
    return this.request("GET", "/search", void 0, {
      q: t,
      type: "track,playlist"
    });
  }
  async getDevices() {
    return this.request("GET", "/me/player/devices");
  }
  async getCurrentPlayback() {
    return this.request("GET", "/me/player");
  }
  async play(t, e, i) {
    const r = {};
    return t && (r.context_uri = t), e && (r.uris = e), i && (r.offset = { uri: i }), this.request("PUT", "/me/player/play", Object.keys(r).length ? r : void 0);
  }
  async setShuffle(t) {
    return this.request("PUT", "/me/player/shuffle", void 0, { state: t ? "true" : "false" });
  }
  async setRepeat(t) {
    return this.request("PUT", "/me/player/repeat", void 0, { state: t });
  }
  async pause() {
    return this.request("PUT", "/me/player/pause");
  }
  async next() {
    return this.request("POST", "/me/player/next");
  }
  async previous() {
    return this.request("POST", "/me/player/previous");
  }
  async setVolume(t) {
    return this.request("PUT", "/me/player/volume", void 0, { volume_percent: String(t) });
  }
  async seek(t) {
    return this.request("PUT", "/me/player/seek", void 0, { position_ms: String(t) });
  }
}
var It = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, $ = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Vt(t, e) : t, a = s.length - 1, o; a >= 0; a--)
    (o = s[a]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && It(t, e, r), r;
};
let v = class extends E {
  constructor() {
    super(...arguments), this.api = null, this.playbackState = null, this.hass = null, this.sonosCoordinator = null, this.progressMs = 0, this._seekDragging = !1, this._seekValue = 0, this._shuffle = !1, this._repeat = "off", this._suppressShuffleUntil = 0, this._suppressRepeatUntil = 0;
  }
  _fmtMs(s) {
    const t = Math.floor(s / 1e3);
    return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
  }
  _onPlayPause() {
    this._emitTransport("play-pause");
  }
  _onNext() {
    this._emitTransport("next");
  }
  _onPrevious() {
    this._emitTransport("prev");
  }
  _emitTransport(s) {
    this.dispatchEvent(new CustomEvent("transport-action", { detail: { action: s }, bubbles: !0, composed: !0 }));
  }
  async _onShuffle() {
    if (this._shuffle = !this._shuffle, this._suppressShuffleUntil = Date.now() + 3e3, this.sonosCoordinator && this.hass)
      this.hass.callService("media_player", "shuffle_set", {
        entity_id: this.sonosCoordinator,
        shuffle: this._shuffle
      }).then(() => this._emit()).catch(() => {
      });
    else if (this.api)
      try {
        await this.api.setShuffle(this._shuffle), this._emit();
      } catch {
      }
  }
  async _onRepeat() {
    const s = ["off", "context", "track"], t = s.indexOf(this._repeat);
    if (this._repeat = s[(t + 1) % 3], this._suppressRepeatUntil = Date.now() + 3e3, this.sonosCoordinator && this.hass) {
      const e = this._repeat === "context" ? "all" : this._repeat === "track" ? "one" : "off";
      this.hass.callService("media_player", "repeat_set", {
        entity_id: this.sonosCoordinator,
        repeat: e
      }).then(() => this._emit()).catch(() => {
      });
    } else if (this.api)
      try {
        await this.api.setRepeat(this._repeat), this._emit();
      } catch {
      }
  }
  _onSeekClick(s) {
    const t = this.playbackState;
    if (!(t != null && t.item)) return;
    const i = s.currentTarget.getBoundingClientRect(), r = Math.min(1, Math.max(0, (s.clientX - i.left) / i.width)), a = Math.round(r * t.item.duration_ms);
    this.sonosCoordinator && this.hass ? this.hass.callService("media_player", "media_seek", {
      entity_id: this.sonosCoordinator,
      seek_position: a / 1e3
    }).then(() => this._emit()).catch(() => {
    }) : this.api && this.api.seek(a).then(() => this._emit()).catch(() => {
    });
  }
  _onAlbumClick() {
    var t, e;
    const s = (e = (t = this.playbackState) == null ? void 0 : t.item) == null ? void 0 : e.album;
    s && this.dispatchEvent(new CustomEvent("browse-album", { detail: { album: s }, bubbles: !0, composed: !0 }));
  }
  _emit() {
    this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
  }
  updated(s) {
    if (s.has("playbackState") && this.playbackState) {
      const t = Date.now();
      t > this._suppressShuffleUntil && (this._shuffle = this.playbackState.shuffle_state ?? !1), t > this._suppressRepeatUntil && (this._repeat = this.playbackState.repeat_state ?? "off");
    }
  }
  render() {
    var n, u, c, p;
    const s = this.playbackState, t = (s == null ? void 0 : s.item) ?? null, e = (s == null ? void 0 : s.is_playing) ?? !1, i = this._seekDragging ? this._seekValue : this.progressMs, r = (t == null ? void 0 : t.duration_ms) ?? 0, a = r > 0 ? Math.min(100, i / r * 100) : 0, o = ((c = (u = (n = t == null ? void 0 : t.album) == null ? void 0 : n.images) == null ? void 0 : u[0]) == null ? void 0 : c.url) ?? null, l = ((p = t == null ? void 0 : t.artists) == null ? void 0 : p.map((g) => g.name).join(", ")) ?? "";
    return h`
      ${o ? h`<div class="artwork-bg" style="background-image: url(${o})"></div>` : d}

      <div class="content">
        <div class="header">
          <span class="header-label">Now Playing</span>
          <button class="icon-btn" @click=${() => this.dispatchEvent(new CustomEvent("show-browse", { bubbles: !0, composed: !0 }))} title="Browse">
            ${Kt}
          </button>
        </div>

        <div class="artwork-wrap">
          ${o ? h`<img src=${o} alt="Album art" />` : h`<div class="artwork-placeholder">🎵</div>`}
        </div>

        ${t ? h`
          <div class="track-info">
            <div class="track-name">${t.name}</div>
            <div class="track-artist">${l}</div>
            <div class="track-album" @click=${this._onAlbumClick} title="Browse album">${t.album.name}</div>
          </div>

          <div class="progress-section">
            <div class="progress-bar-wrap" @click=${this._onSeekClick}>
              <div class="progress-fill" style="width: ${a.toFixed(2)}%">
                <div class="progress-thumb"></div>
              </div>
            </div>
            <div class="progress-times">
              <span>${this._fmtMs(i)}</span>
              <span>${this._fmtMs(r)}</span>
            </div>
          </div>
        ` : h`<div class="no-track">No active Spotify session</div>`}

        <div class="controls">
          <button
            class="ctrl-btn ctrl-sm ${this._shuffle ? "active" : ""}"
            @click=${this._onShuffle}
            title="Shuffle"
          >${Yt}</button>

          <button class="ctrl-btn ctrl-md" @click=${this._onPrevious} title="Previous">
            ${Qt}
          </button>

          <button class="ctrl-btn ctrl-play" @click=${this._onPlayPause} title=${e ? "Pause" : "Play"}>
            ${e ? Wt : Gt}
          </button>

          <button class="ctrl-btn ctrl-md" @click=${this._onNext} title="Next">
            ${Ft}
          </button>

          <button
            class="ctrl-btn ctrl-sm ${this._repeat !== "off" ? "active" : ""}"
            @click=${this._onRepeat}
            title=${this._repeat === "off" ? "Repeat off" : this._repeat === "context" ? "Repeat all" : "Repeat one"}
          >${this._repeat === "track" ? Jt : Zt}</button>
        </div>

      </div>
    `;
  }
};
v.styles = tt`
    :host {
      display: block;
      position: relative;
      background: #0a0a0a;
      color: #fff;
      overflow: hidden;
    }

    /* Blurred artwork background */
    .artwork-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      filter: blur(60px) saturate(1.8) brightness(0.22);
      transform: scale(1.3);
      pointer-events: none;
      transition: background-image 0.6s ease;
    }

    .content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 20px 16px;
      gap: 0;
    }

    /* Header row */
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .header-label {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
      font-weight: 500;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 5px;
      transition: color 0.18s, background 0.18s;
    }
    .icon-btn:hover {
      color: #fff;
      background: rgba(255,255,255,0.08);
    }

    /* Artwork */
    .artwork-wrap {
      width: 200px;
      height: 200px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06) inset;
      flex-shrink: 0;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    .artwork-wrap:hover {
      transform: scale(1.015);
    }
    .artwork-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .artwork-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.06);
      font-size: 56px;
    }

    /* Track info */
    .track-info {
      margin-top: 18px;
      text-align: center;
      width: 100%;
    }
    .track-name {
      font-size: 17px;
      font-weight: 600;
      color: #fff;
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: -0.01em;
    }
    .track-artist {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .track-album {
      font-size: 12px;
      color: rgba(255,255,255,0.3);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: color 0.15s;
    }
    .track-album:hover {
      color: rgba(255,255,255,0.7);
    }

    .no-track {
      text-align: center;
      color: rgba(255,255,255,0.4);
      font-style: italic;
      padding: 40px 0;
      font-size: 14px;
    }

    /* Progress */
    .progress-section {
      width: 100%;
      margin-top: 16px;
    }
    .progress-bar-wrap {
      position: relative;
      height: 3px;
      background: rgba(255,255,255,0.12);
      border-radius: 2px;
      cursor: pointer;
    }
    .progress-fill {
      height: 100%;
      background: #1DB954;
      border-radius: 2px;
      position: relative;
      pointer-events: none;
    }
    .progress-thumb {
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.15s ease;
    }
    .progress-bar-wrap:hover .progress-thumb {
      transform: translateY(-50%) scale(1);
    }
    .progress-times {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      font-size: 10px;
      color: rgba(255,255,255,0.3);
      font-variant-numeric: tabular-nums;
    }

    /* Controls */
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-top: 14px;
      width: 100%;
    }

    .ctrl-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.18s, transform 0.18s, background 0.18s;
      flex-shrink: 0;
      position: relative;
    }
    .ctrl-btn:hover { color: #fff; }
    .ctrl-btn:active { transform: scale(0.9); }

    .ctrl-btn.active {
      color: #1DB954;
    }
    .ctrl-btn.active::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 3px;
      background: #1DB954;
      border-radius: 50%;
    }

    .ctrl-sm { width: 36px; height: 36px; padding: 8px; }
    .ctrl-md { width: 42px; height: 42px; padding: 9px; }
    .ctrl-play {
      width: 52px;
      height: 52px;
      background: #1DB954;
      color: #000 !important;
      border-radius: 50%;
      padding: 14px;
      box-shadow: 0 4px 20px rgba(29,185,84,0.35);
    }
    .ctrl-play:hover {
      background: #1ed760 !important;
      transform: scale(1.05);
      box-shadow: 0 6px 28px rgba(29,185,84,0.5);
    }

  `;
$([
  y({ attribute: !1 })
], v.prototype, "api", 2);
$([
  y({ attribute: !1 })
], v.prototype, "playbackState", 2);
$([
  y({ attribute: !1 })
], v.prototype, "hass", 2);
$([
  y({ attribute: !1 })
], v.prototype, "sonosCoordinator", 2);
$([
  y({ attribute: !1 })
], v.prototype, "progressMs", 2);
$([
  f()
], v.prototype, "_seekDragging", 2);
$([
  f()
], v.prototype, "_seekValue", 2);
$([
  f()
], v.prototype, "_shuffle", 2);
$([
  f()
], v.prototype, "_repeat", 2);
v = $([
  it("spotify-now-playing")
], v);
const Gt = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M8 5v14l11-7z"/></svg>`, Wt = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`, Qt = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>`, Ft = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8zM16 6h2v12h-2z"/></svg>`, Yt = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>`, Zt = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`, Jt = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v6H13z"/></svg>`, Kt = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`;
var Xt = Object.defineProperty, te = Object.getOwnPropertyDescriptor, m = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? te(t, e) : t, a = s.length - 1, o; a >= 0; a--)
    (o = s[a]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && Xt(t, e, r), r;
};
let _ = class extends E {
  constructor() {
    super(...arguments), this.api = null, this.initialAlbum = null, this.hass = null, this.sonosCoordinator = null, this._activeTab = "playlists", this._playlists = [], this._recentTracks = [], this._topTracks = [], this._searchResults = { tracks: [], playlists: [] }, this._searchQuery = "", this._loading = !1, this._searchLoading = !1, this._error = "", this._drill = null, this._drillAlbumTracks = [], this._drillPlaylistTracks = [], this._drillLoading = !1, this._searchDebounceTimer = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadTab(this._activeTab);
  }
  updated(s) {
    s.has("api") && this.api && !s.get("api") && this._loadTab(this._activeTab), s.has("initialAlbum") && this.initialAlbum && this._openAlbumDrill(this.initialAlbum);
  }
  drillAlbum(s) {
    this._openAlbumDrill(s);
  }
  async _openAlbumDrill(s) {
    this._drill = { kind: "album", album: s }, this._drillAlbumTracks = [], this._drillPlaylistTracks = [], this._drillLoading = !0;
    try {
      if (!this.api) return;
      const t = await this.api.getAlbumTracks(s.id);
      this._drillAlbumTracks = t.items ?? [];
    } catch {
    } finally {
      this._drillLoading = !1;
    }
  }
  async _openPlaylistDrill(s) {
    this._drill = { kind: "playlist", playlist: s }, this._drillAlbumTracks = [], this._drillPlaylistTracks = [], this._drillLoading = !0;
    try {
      if (!this.api) return;
      const t = await this.api.getPlaylistTracks(s.id);
      this._drillPlaylistTracks = (t.items ?? []).map((e) => e.track).filter((e) => e != null && !!e.uri);
    } catch {
    } finally {
      this._drillLoading = !1;
    }
  }
  async _loadTab(s) {
    if (!(!this.api || s === "search")) {
      this._loading = !0, this._error = "";
      try {
        if (s === "playlists") {
          const t = await this.api.getPlaylists();
          this._playlists = (t.items ?? []).filter((e) => e != null && e.uri != null);
        } else if (s === "recently-played") {
          const t = await this.api.getRecentlyPlayed();
          this._recentTracks = (t.items ?? []).map((e) => e.track).filter((e) => e && e.uri);
        } else if (s === "top-tracks") {
          const t = await this.api.getTopTracks();
          this._topTracks = (t.items ?? []).filter((e) => e && e.uri);
        }
      } catch (t) {
        this._error = t instanceof Error ? t.message : "Failed to load";
      } finally {
        this._loading = !1;
      }
    }
  }
  _switchTab(s) {
    this._activeTab !== s && (this._activeTab = s, this._loadTab(s));
  }
  _onSearchInput(s) {
    const t = s.target.value;
    if (this._searchQuery = t, this._searchDebounceTimer && clearTimeout(this._searchDebounceTimer), !t.trim()) {
      this._searchResults = { tracks: [], playlists: [] };
      return;
    }
    this._searchDebounceTimer = setTimeout(() => this._doSearch(t), 300);
  }
  async _doSearch(s) {
    var t, e;
    if (this.api) {
      this._searchLoading = !0, this._error = "";
      try {
        const i = await this.api.search(s);
        this._searchResults = {
          tracks: ((t = i.tracks) == null ? void 0 : t.items) ?? [],
          playlists: ((e = i.playlists) == null ? void 0 : e.items) ?? []
        };
      } catch (i) {
        this._error = i instanceof Error ? i.message : "Search failed";
      } finally {
        this._searchLoading = !1;
      }
    }
  }
  async _playViaHa(s, t, e = !1) {
    if (!this.hass || !this.sonosCoordinator) return !1;
    try {
      return e && await this.hass.callService("media_player", "shuffle_set", {
        entity_id: this.sonosCoordinator,
        shuffle: !0
      }), await this.hass.callService("media_player", "play_media", {
        entity_id: this.sonosCoordinator,
        media_content_id: s,
        media_content_type: t
      }), !0;
    } catch {
      return !1;
    }
  }
  async _playPlaylist(s, t = !1) {
    if (this.sonosCoordinator && await this._playViaHa(s.uri, "playlist", t)) {
      this._emit();
      return;
    }
    if (this.api)
      try {
        t && await this.api.setShuffle(!0), await this.api.play(s.uri), this._emit();
      } catch {
      }
  }
  async _playTrack(s) {
    if (this.sonosCoordinator && await this._playViaHa(s.uri, "music", !1)) {
      this._emit();
      return;
    }
    if (this.api)
      try {
        await this.api.play(void 0, [s.uri]), this._emit();
      } catch {
      }
  }
  async _playAlbum(s, t = !1, e) {
    if (this.sonosCoordinator && await this._playViaHa(s.uri, "album", t)) {
      this._emit();
      return;
    }
    if (this.api)
      try {
        t && await this.api.setShuffle(!0), await this.api.play(s.uri, void 0, e), this._emit();
      } catch {
      }
  }
  async _playAlbumTrack(s) {
    if (this.sonosCoordinator && await this._playViaHa(s, "music", !1)) {
      this._emit();
      return;
    }
    const t = this._drill;
    if (!(!this.api || !t || t.kind !== "album"))
      try {
        await this.api.setShuffle(!1), await this.api.play(t.album.uri, void 0, s), this._emit();
      } catch {
      }
  }
  async _playPlaylistTrack(s) {
    const t = this._drill;
    if (!(!t || t.kind !== "playlist")) {
      if (this.sonosCoordinator && await this._playViaHa(s.uri, "music", !1)) {
        this._emit();
        return;
      }
      if (this.api)
        try {
          await this.api.play(t.playlist.uri, void 0, s.uri), this._emit();
        } catch {
        }
    }
  }
  _emit() {
    this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
  }
  // ── Rendering helpers ───────────────────────────────────────────────────
  _thumb(s, t = !1) {
    var i;
    const e = (i = s == null ? void 0 : s[0]) == null ? void 0 : i.url;
    return e ? h`<img class="item-thumb ${t ? "round" : ""}" src=${e} alt="" />` : h`<div class="item-thumb-placeholder">🎵</div>`;
  }
  _renderLoading() {
    return h`<div class="loading"><div class="spinner"></div>Loading…</div>`;
  }
  // ── Drill-down view ─────────────────────────────────────────────────────
  _renderDrill() {
    var l, n, u;
    const s = this._drill, t = s.kind === "album", e = t ? s.album : s.playlist, i = t ? s.album.images : s.playlist.images ?? [], r = (l = i == null ? void 0 : i[0]) == null ? void 0 : l.url, a = t ? (n = s.album.artists) == null ? void 0 : n.map((c) => c.name).join(", ") : ((u = s.playlist.owner) == null ? void 0 : u.display_name) ?? "", o = t ? this._drillAlbumTracks : this._drillPlaylistTracks;
    return h`
      <div class="drill-header">
        <button class="back-btn" @click=${() => {
      this._drill = null, this._drillAlbumTracks = [], this._drillPlaylistTracks = [];
    }}>${ie}</button>
        ${r ? h`<img class="drill-thumb" src=${r} alt="" />` : d}
        <div class="drill-info">
          <div class="drill-title">${e.name}</div>
          <div class="drill-sub">${a}</div>
        </div>
      </div>

      <div class="drill-actions">
        <button
          class="drill-action-btn btn-play"
          @click=${() => t ? this._playAlbum(s.album) : this._playPlaylist(s.playlist)}
        >
          <span class="btn-icon">${P}</span>
          Play
        </button>
        <button
          class="drill-action-btn btn-shuffle"
          @click=${() => t ? this._playAlbum(s.album, !0) : this._playPlaylist(s.playlist, !0)}
        >
          <span class="btn-icon">${ae}</span>
          Shuffle
        </button>
      </div>

      <div class="tab-content">
        ${this._drillLoading ? this._renderLoading() : d}
        ${!this._drillLoading && o.length === 0 ? h`<div class="empty">No tracks</div>` : d}
        ${t ? this._drillAlbumTracks.map((c, p) => h`
            <div class="item" @click=${() => this._playAlbumTrack(c.uri)}>
              <div class="item-thumb-placeholder" style="font-size:12px;color:rgba(255,255,255,0.35);width:42px;height:42px;">
                ${c.track_number ?? p + 1}
              </div>
              <div class="item-info">
                <div class="item-name">${c.name}</div>
                <div class="item-sub">${(c.artists ?? []).map((g) => g.name).join(", ")}</div>
              </div>
              <button class="item-play" @click=${(g) => {
      g.stopPropagation(), this._playAlbumTrack(c.uri);
    }}>
                ${P}
              </button>
            </div>
          `) : this._drillPlaylistTracks.map((c) => {
      var p;
      return h`
            <div class="item" @click=${() => this._playPlaylistTrack(c)}>
              ${this._thumb((p = c.album) == null ? void 0 : p.images)}
              <div class="item-info">
                <div class="item-name">${c.name}</div>
                <div class="item-sub">${(c.artists ?? []).map((g) => g.name).join(", ")}</div>
              </div>
              <button class="item-play" @click=${(g) => {
        g.stopPropagation(), this._playPlaylistTrack(c);
      }}>
                ${P}
              </button>
            </div>
          `;
    })}
      </div>
    `;
  }
  // ── Tab content renders ─────────────────────────────────────────────────
  _renderPlaylists() {
    return this._loading ? this._renderLoading() : this._error ? h`<div class="error">${this._error}</div>` : this._playlists.length ? this._playlists.map((s) => {
      var t;
      return h`
      <div class="item" @click=${() => this._openPlaylistDrill(s)}>
        ${this._thumb(s.images, !0)}
        <div class="item-info">
          <div class="item-name">${s.name}</div>
          <div class="item-sub">${((t = s.owner) == null ? void 0 : t.display_name) ?? ""}</div>
        </div>
        <button class="item-play" @click=${(e) => {
        e.stopPropagation(), this._playPlaylist(s);
      }}>
          ${P}
        </button>
      </div>
    `;
    }) : h`<div class="empty">No playlists found</div>`;
  }
  _renderTrackList(s, t) {
    return s.map((e) => {
      var i;
      return h`
      <div class="item ${e.uri === t ? "active" : ""}" @click=${() => this._playTrack(e)}>
        ${this._thumb((i = e.album) == null ? void 0 : i.images)}
        <div class="item-info">
          <div class="item-name">${e.name}</div>
          <div class="item-sub">
            ${e.uri === t ? h`<span style="display:flex;align-items:center;gap:5px">
                  <span class="eq"><span></span><span></span><span></span></span>
                  Playing
                </span>` : (e.artists ?? []).map((r) => r.name).join(", ")}
          </div>
        </div>
        <button class="item-play" @click=${(r) => {
        r.stopPropagation(), this._playTrack(e);
      }}>
          ${P}
        </button>
      </div>
    `;
    });
  }
  _renderSearch() {
    const s = this._searchResults.tracks.length > 0 || this._searchResults.playlists.length > 0;
    return h`
      <div class="search-box">
        <div class="search-inner">
          <span class="search-icon">${re}</span>
          <input
            class="search-input"
            type="search"
            placeholder="Search tracks, artists, playlists…"
            .value=${this._searchQuery}
            @input=${this._onSearchInput}
          />
        </div>
      </div>
      ${this._searchLoading ? this._renderLoading() : d}
      ${this._error ? h`<div class="error">${this._error}</div>` : d}
      ${!this._searchLoading && this._searchQuery && !s ? h`<div class="empty">No results for "${this._searchQuery}"</div>` : d}
      ${this._searchResults.tracks.length ? h`
        <div class="search-section-label">Tracks</div>
        ${this._renderTrackList(this._searchResults.tracks)}
      ` : d}
      ${this._searchResults.playlists.length ? h`
        <div class="search-section-label">Playlists</div>
        ${this._searchResults.playlists.map((t) => {
      var e;
      return h`
          <div class="item" @click=${() => this._openPlaylistDrill(t)}>
            ${this._thumb(t.images, !0)}
            <div class="item-info">
              <div class="item-name">${t.name}</div>
              <div class="item-sub">${((e = t.owner) == null ? void 0 : e.display_name) ?? ""}</div>
            </div>
            <button class="item-play" @click=${(i) => {
        i.stopPropagation(), this._playPlaylist(t);
      }}>
              ${P}
            </button>
          </div>
        `;
    })}
      ` : d}
    `;
  }
  // ── Main render ─────────────────────────────────────────────────────────
  render() {
    return this._drill ? h`
        ${this._renderDrill()}
        ${this._renderMiniBar()}
      ` : h`
      <div class="tab-bar">
        ${[
      { id: "playlists", label: "Playlists" },
      { id: "recently-played", label: "Recent" },
      { id: "top-tracks", label: "Top" },
      { id: "search", label: "Search" }
    ].map((t) => h`
          <button
            class="tab-btn ${this._activeTab === t.id ? "active" : ""}"
            @click=${() => this._switchTab(t.id)}
          >${t.label}</button>
        `)}
      </div>

      ${this._activeTab === "search" ? h`${this._renderSearch()}` : h`
          <div class="tab-content">
            ${this._activeTab === "playlists" ? this._renderPlaylists() : d}
            ${this._activeTab === "recently-played" ? this._loading ? this._renderLoading() : this._error ? h`<div class="error">${this._error}</div>` : this._recentTracks.length ? this._renderTrackList(this._recentTracks) : h`<div class="empty">No recent tracks</div>` : d}
            ${this._activeTab === "top-tracks" ? this._loading ? this._renderLoading() : this._error ? h`<div class="error">${this._error}</div>` : this._topTracks.length ? this._renderTrackList(this._topTracks) : h`<div class="empty">No top tracks</div>` : d}
          </div>
        `}

      ${this._renderMiniBar()}
    `;
  }
  _renderMiniBar() {
    return h`
      <div class="mini-bar" @click=${() => this.dispatchEvent(new CustomEvent("show-now-playing", { bubbles: !0, composed: !0 }))}>
        <div class="mini-art">
          <slot name="mini-art"></slot>
        </div>
        <div class="mini-meta">
          <slot name="mini-title"></slot>
        </div>
        <div class="mini-controls">
          <button class="mini-btn" @click=${(s) => {
      s.stopPropagation(), this._emitControl("prev");
    }}>${ee}</button>
          <button class="mini-btn play" @click=${(s) => {
      s.stopPropagation(), this._emitControl("play-pause");
    }}>${P}</button>
          <button class="mini-btn" @click=${(s) => {
      s.stopPropagation(), this._emitControl("next");
    }}>${se}</button>
        </div>
      </div>
    `;
  }
  _emitControl(s) {
    this.dispatchEvent(new CustomEvent("mini-control", { detail: { action: s }, bubbles: !0, composed: !0 }));
  }
};
_.styles = tt`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
      background: #0a0a0a;
      color: #fff;
    }

    /* ── Tab bar ── */
    .tab-bar {
      display: flex;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      flex-shrink: 0;
      padding: 0 4px;
    }
    .tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      padding: 10px 4px;
      font-size: 11px;
      font-weight: 500;
      color: rgba(255,255,255,0.35);
      white-space: nowrap;
      transition: color 0.15s, border-color 0.15s;
      position: relative;
    }
    .tab-btn.active {
      color: #fff;
      border-bottom-color: #1DB954;
    }
    .tab-btn:hover:not(.active) { color: rgba(255,255,255,0.65); }

    /* ── Drill header ── */
    .drill-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px 10px;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .back-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 5px;
      flex-shrink: 0;
      transition: color 0.15s, background 0.15s;
    }
    .back-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

    .drill-thumb {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      background: rgba(255,255,255,0.06);
    }
    .drill-info { flex: 1; min-width: 0; }
    .drill-title {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .drill-sub {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      margin-top: 2px;
    }

    .drill-actions {
      display: flex;
      gap: 8px;
      padding: 10px 14px;
      flex-shrink: 0;
    }
    .drill-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: opacity 0.15s, transform 0.15s;
    }
    .drill-action-btn:hover { opacity: 0.85; transform: scale(1.02); }
    .btn-play { background: #1DB954; color: #000; }
    .btn-shuffle { background: rgba(255,255,255,0.1); color: #fff; }
    .btn-icon { width: 14px; height: 14px; }

    /* ── Scroll list ── */
    .tab-content {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0 8px;
      min-height: 0;
    }
    .tab-content::-webkit-scrollbar { width: 3px; }
    .tab-content::-webkit-scrollbar-track { background: transparent; }
    .tab-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    /* ── List items ── */
    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 14px;
      cursor: pointer;
      border-radius: 4px;
      margin: 0 4px;
      transition: background 0.14s;
    }
    .item:hover { background: rgba(255,255,255,0.07); }
    .item.active { background: rgba(29,185,84,0.08); }
    .item.active .item-name { color: #1DB954; }

    .item-thumb {
      width: 42px;
      height: 42px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      background: rgba(255,255,255,0.06);
    }
    .item-thumb.round { border-radius: 50%; }
    .item-thumb-placeholder {
      width: 42px;
      height: 42px;
      border-radius: 4px;
      background: rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .item-info { flex: 1; min-width: 0; }
    .item-name {
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-sub {
      font-size: 11px;
      color: rgba(255,255,255,0.45);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .item-play {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #1DB954;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      padding: 7px;
      opacity: 0;
      transform: scale(0.8);
      transition: opacity 0.15s, transform 0.15s;
      flex-shrink: 0;
    }
    .item:hover .item-play { opacity: 1; transform: scale(1); }

    /* ── Search bar ── */
    .search-box {
      padding: 10px 14px;
      flex-shrink: 0;
    }
    .search-inner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 0 12px;
      transition: border-color 0.15s;
    }
    .search-inner:focus-within { border-color: rgba(29,185,84,0.5); }
    .search-icon { color: rgba(255,255,255,0.3); width: 14px; height: 14px; flex-shrink: 0; }
    .search-input {
      background: none;
      border: none;
      outline: none;
      font-size: 13px;
      color: #fff;
      padding: 10px 0;
      width: 100%;
    }
    .search-input::placeholder { color: rgba(255,255,255,0.3); }

    .search-section-label {
      padding: 8px 14px 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255,255,255,0.3);
    }

    /* ── States ── */
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      color: rgba(255,255,255,0.4);
      gap: 10px;
      font-size: 13px;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.15);
      border-top-color: #1DB954;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .error { padding: 16px 14px; color: #f44336; font-size: 13px; text-align: center; }
    .empty { padding: 24px 14px; color: rgba(255,255,255,0.3); font-style: italic; text-align: center; font-size: 13px; }

    /* ── Mini now-playing bar ── */
    .mini-bar {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0,0,0,0.35);
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .mini-bar:hover { background: rgba(255,255,255,0.03); }
    .mini-art {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .mini-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .mini-meta { flex: 1; min-width: 0; }
    .mini-title { font-size: 12px; font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mini-artist { font-size: 11px; color: rgba(255,255,255,0.45); }
    .mini-controls { display: flex; gap: 2px; }
    .mini-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 7px;
      transition: color 0.15s, background 0.15s;
    }
    .mini-btn:hover { color: #fff; background: rgba(255,255,255,0.07); }
    .mini-btn.play {
      background: #1DB954;
      color: #000;
      width: 28px;
      height: 28px;
    }
    .mini-btn.play:hover { background: #1ed760; }

    /* Equalizer animation */
    @keyframes eq1 { 0%,100%{height:4px} 50%{height:12px} }
    @keyframes eq2 { 0%,100%{height:10px} 50%{height:3px} }
    @keyframes eq3 { 0%,100%{height:7px} 50%{height:14px} }
    .eq { display: flex; align-items: flex-end; gap: 2px; height: 14px; }
    .eq span { width: 3px; background: #1DB954; border-radius: 1px; display: block; }
    .eq span:nth-child(1) { animation: eq1 0.8s ease-in-out infinite; }
    .eq span:nth-child(2) { animation: eq2 0.8s ease-in-out infinite 0.15s; }
    .eq span:nth-child(3) { animation: eq3 0.8s ease-in-out infinite 0.3s; }
  `;
m([
  y({ attribute: !1 })
], _.prototype, "api", 2);
m([
  y({ attribute: !1 })
], _.prototype, "initialAlbum", 2);
m([
  y({ attribute: !1 })
], _.prototype, "hass", 2);
m([
  y({ attribute: !1 })
], _.prototype, "sonosCoordinator", 2);
m([
  f()
], _.prototype, "_activeTab", 2);
m([
  f()
], _.prototype, "_playlists", 2);
m([
  f()
], _.prototype, "_recentTracks", 2);
m([
  f()
], _.prototype, "_topTracks", 2);
m([
  f()
], _.prototype, "_searchResults", 2);
m([
  f()
], _.prototype, "_searchQuery", 2);
m([
  f()
], _.prototype, "_loading", 2);
m([
  f()
], _.prototype, "_searchLoading", 2);
m([
  f()
], _.prototype, "_error", 2);
m([
  f()
], _.prototype, "_drill", 2);
m([
  f()
], _.prototype, "_drillAlbumTracks", 2);
m([
  f()
], _.prototype, "_drillPlaylistTracks", 2);
m([
  f()
], _.prototype, "_drillLoading", 2);
_ = m([
  it("spotify-browse-panel")
], _);
const P = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M8 5v14l11-7z"/></svg>`;
b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const ee = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>`, se = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8zM16 6h2v12h-2z"/></svg>`, ie = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`, re = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`, ae = b`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>`;
var oe = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, z = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? ne(t, e) : t, a = s.length - 1, o; a >= 0; a--)
    (o = s[a]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && oe(t, e, r), r;
};
const le = "sensor.sonos_active_coordinator", he = [
  "media_player.kitchen",
  "media_player.sonos_move",
  "media_player.living_room",
  "media_player.garage",
  "media_player.patio"
];
let x = class extends E {
  constructor() {
    super(...arguments), this._config = null, this._playbackState = null, this._progressMs = 0, this._view = "now-playing", this._error = "", this._pendingAlbumDrill = null, this._hass = null, this._api = null, this._pollInterval = null, this._progressInterval = null, this._progressBaseMs = 0, this._progressBaseTime = 0;
  }
  setConfig(s) {
    this._config = s, this.style.setProperty("--spotify-card-height", `${s.height ?? 500}px`);
  }
  set hass(s) {
    this._hass = s, this._api ? this._api.hass = s : this._api = new qt(s);
  }
  static getConfigElement() {
    const s = document.createElement("div");
    return s.innerHTML = '<p style="padding:8px;font-size:13px;">Edit config YAML directly.</p>', s;
  }
  static getStubConfig() {
    return {};
  }
  connectedCallback() {
    super.connectedCallback(), this._startPolling();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._stopPolling();
  }
  _startPolling() {
    this._fetchState(), this._pollInterval = setInterval(() => this._fetchState(), 5e3), this._progressInterval = setInterval(() => {
      var s, t;
      if ((s = this._playbackState) != null && s.is_playing) {
        const e = Date.now() - this._progressBaseTime, i = ((t = this._playbackState.item) == null ? void 0 : t.duration_ms) ?? 0;
        this._progressMs = Math.min(this._progressBaseMs + e, i);
      }
    }, 1e3);
  }
  _stopPolling() {
    this._pollInterval !== null && (clearInterval(this._pollInterval), this._pollInterval = null), this._progressInterval !== null && (clearInterval(this._progressInterval), this._progressInterval = null);
  }
  async _fetchState() {
    var s;
    if (this._api)
      try {
        this._error = "", this._playbackState = await this._api.getCurrentPlayback(), this._progressBaseMs = ((s = this._playbackState) == null ? void 0 : s.progress_ms) ?? 0, this._progressBaseTime = Date.now(), this._progressMs = this._progressBaseMs;
      } catch (t) {
        const e = t instanceof Error ? t.message : String(t);
        e.includes("token_expired") || e.includes("401") ? this._error = "Spotify token expired. Re-authenticate in Home Assistant." : e.includes("no_spotify_entry") && (this._error = "Spotify integration not configured.");
      }
  }
  _onPlaybackChanged() {
    setTimeout(() => this._fetchState(), 500);
  }
  // Returns the relevant Sonos entity for transport commands.
  // Prefers the active coordinator (playing), falls back to any paused Sonos speaker.
  _sonosCoordinator() {
    var t, e, i;
    const s = (e = (t = this._hass) == null ? void 0 : t.states[le]) == null ? void 0 : e.state;
    if (s && s !== "unknown" && s !== "unavailable" && s !== "")
      return s;
    if (this._hass) {
      for (const r of he)
        if (((i = this._hass.states[r]) == null ? void 0 : i.state) === "paused") return r;
    }
    return null;
  }
  _onBrowseAlbum(s) {
    this._pendingAlbumDrill = s.detail.album, this._view = "browse";
  }
  _onMiniControl(s) {
    this._handleTransportAction(s.detail.action);
  }
  _onTransportAction(s) {
    this._handleTransportAction(s.detail.action);
  }
  _handleTransportAction(s) {
    var e, i;
    if (!this._hass) return;
    const t = this._sonosCoordinator();
    if (t) {
      const a = {
        "play-pause": (e = this._playbackState) != null && e.is_playing ? "media_pause" : "media_play",
        next: "media_next_track",
        prev: "media_previous_track"
      }[s];
      a && this._hass.callService("media_player", a, { entity_id: t }).then(() => this._onPlaybackChanged()).catch(() => {
      });
      return;
    }
    this._api && (s === "play-pause" ? ((i = this._playbackState) != null && i.is_playing ? this._api.pause() : this._api.play()).then(() => this._onPlaybackChanged()).catch(() => {
    }) : s === "next" ? this._api.next().then(() => this._onPlaybackChanged()).catch(() => {
    }) : s === "prev" && this._api.previous().then(() => this._onPlaybackChanged()).catch(() => {
    }));
  }
  render() {
    var a, o, l, n;
    if (!this._config) return d;
    const s = this._config.height ?? 500, t = this._playbackState, e = t == null ? void 0 : t.item, i = ((l = (o = (a = e == null ? void 0 : e.album) == null ? void 0 : a.images) == null ? void 0 : o[0]) == null ? void 0 : l.url) ?? null, r = ((n = e == null ? void 0 : e.artists) == null ? void 0 : n.map((u) => u.name).join(", ")) ?? "";
    return h`
      <ha-card style="height: ${s}px; overflow: hidden;">
        <div class="card-content">
          ${this._error ? h`
                <div class="error-state">
                  <span class="error-icon">⚠️</span>
                  <span class="error-msg">${this._error}</span>
                </div>
              ` : this._view === "now-playing" ? h`
                  <div class="panel">
                    <spotify-now-playing
                      .api=${this._api}
                      .playbackState=${this._playbackState}
                      .progressMs=${this._progressMs}
                      .hass=${this._hass}
                      .sonosCoordinator=${this._sonosCoordinator()}
                      @playback-changed=${this._onPlaybackChanged}
                      @transport-action=${this._onTransportAction}
                      @show-browse=${() => this._view = "browse"}
                      @browse-album=${this._onBrowseAlbum}
                    ></spotify-now-playing>
                  </div>
                ` : h`
                  <div class="panel">
                    <spotify-browse-panel
                      .api=${this._api}
                      .initialAlbum=${this._pendingAlbumDrill}
                      .hass=${this._hass}
                      .sonosCoordinator=${this._sonosCoordinator()}
                      @playback-changed=${this._onPlaybackChanged}
                      @show-now-playing=${() => {
      this._view = "now-playing", this._pendingAlbumDrill = null;
    }}
                      @mini-control=${this._onMiniControl}
                    >
                      ${i ? h`<img slot="mini-art" src=${i} alt="" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:4px" />` : d}
                      <span slot="mini-title" style="display:flex;flex-direction:column">
                        <span style="font-size:12px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(e == null ? void 0 : e.name) ?? "Not playing"}</span>
                        <span style="font-size:11px;color:rgba(255,255,255,0.45)">${r}</span>
                      </span>
                    </spotify-browse-panel>
                  </div>
                `}
        </div>
      </ha-card>
    `;
  }
};
x.styles = tt`
    :host { display: block; }

    ha-card {
      overflow: hidden;
      background: #0a0a0a;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      height: var(--spotify-card-height, 500px);
      overflow: hidden;
    }

    .panel {
      flex: 1;
      overflow: hidden;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 12px;
      padding: 24px;
      text-align: center;
      color: #f44336;
      background: #0a0a0a;
    }
    .error-icon { font-size: 36px; }
    .error-msg { font-size: 14px; line-height: 1.5; color: rgba(255,255,255,0.6); }

    @keyframes spin { to { transform: rotate(360deg); } }
  `;
z([
  f()
], x.prototype, "_config", 2);
z([
  f()
], x.prototype, "_playbackState", 2);
z([
  f()
], x.prototype, "_progressMs", 2);
z([
  f()
], x.prototype, "_view", 2);
z([
  f()
], x.prototype, "_error", 2);
z([
  f()
], x.prototype, "_pendingAlbumDrill", 2);
x = z([
  it("lovelace-spotify-browser")
], x);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lovelace-spotify-browser",
  name: "Spotify Browser",
  description: "Browse and control Spotify from your Home Assistant dashboard"
});
export {
  x as SpotifyBrowserCard
};
