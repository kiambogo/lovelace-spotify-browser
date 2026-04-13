/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, X = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ee = Symbol(), re = /* @__PURE__ */ new WeakMap();
let ye = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== ee) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (X && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = re.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && re.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const $e = (s) => new ye(typeof s == "string" ? s : s + "", void 0, ee), G = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, r, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1], s[0]);
  return new ye(t, s, ee);
}, xe = (s, e) => {
  if (X) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), r = B.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = t.cssText, s.appendChild(i);
  }
}, oe = X ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return $e(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: we, defineProperty: ke, getOwnPropertyDescriptor: Ae, getOwnPropertyNames: Se, getOwnPropertySymbols: Pe, getPrototypeOf: Ee } = Object, w = globalThis, ae = w.trustedTypes, Te = ae ? ae.emptyScript : "", Z = w.reactiveElementPolyfillSupport, U = (s, e) => s, V = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Te : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, te = (s, e) => !we(s, e), ne = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: te };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let D = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ne) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, t);
      r !== void 0 && ke(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: r, set: o } = Ae(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: r, set(a) {
      const l = r == null ? void 0 : r.call(this);
      o == null || o.call(this, a), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ne;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const e = Ee(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const t = this.properties, i = [...Se(t), ...Pe(t)];
      for (const r of i) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, r] of t) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const r = this._$Eu(t, i);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) t.unshift(oe(r));
    } else e !== void 0 && t.push(oe(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return xe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var o;
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const a = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : V).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var o, a;
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : V;
      this._$Em = r;
      const p = n.fromAttribute(t, l.type);
      this[r] = p ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, r = !1, o) {
    var a;
    if (e !== void 0) {
      const l = this.constructor;
      if (r === !1 && (o = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? te)(o, t) || i.useDefault && i.reflect && o === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: r, wrapped: o }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), o !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, a] of this._$Ep) this[o] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, a] of r) {
        const { wrapped: l } = a, n = this[o];
        l !== !0 || this._$AL.has(o) || n === void 0 || this.C(o, void 0, a, n);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
      }), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[U("elementProperties")] = /* @__PURE__ */ new Map(), D[U("finalized")] = /* @__PURE__ */ new Map(), Z == null || Z({ ReactiveElement: D }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, le = (s) => s, W = N.trustedTypes, ce = W ? W.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, fe = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, me = "?" + x, Ce = `<${me}>`, C = document, R = () => C.createComment(""), z = (s) => s === null || typeof s != "object" && typeof s != "function", se = Array.isArray, De = (s) => se(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", J = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, de = />/g, P = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, ue = /"/g, ge = /^(?:script|style|textarea|title)$/i, Oe = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), c = Oe(1), O = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ve = /* @__PURE__ */ new WeakMap(), E = C.createTreeWalker(C, 129);
function be(s, e) {
  if (!se(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ce !== void 0 ? ce.createHTML(e) : e;
}
const Ie = (s, e) => {
  const t = s.length - 1, i = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = M;
  for (let l = 0; l < t; l++) {
    const n = s[l];
    let p, u, d = -1, y = 0;
    for (; y < n.length && (a.lastIndex = y, u = a.exec(n), u !== null); ) y = a.lastIndex, a === M ? u[1] === "!--" ? a = he : u[1] !== void 0 ? a = de : u[2] !== void 0 ? (ge.test(u[2]) && (r = RegExp("</" + u[2], "g")), a = P) : u[3] !== void 0 && (a = P) : a === P ? u[0] === ">" ? (a = r ?? M, d = -1) : u[1] === void 0 ? d = -2 : (d = a.lastIndex - u[2].length, p = u[1], a = u[3] === void 0 ? P : u[3] === '"' ? ue : pe) : a === ue || a === pe ? a = P : a === he || a === de ? a = M : (a = P, r = void 0);
    const $ = a === P && s[l + 1].startsWith("/>") ? " " : "";
    o += a === M ? n + Ce : d >= 0 ? (i.push(p), n.slice(0, d) + fe + n.slice(d) + x + $) : n + x + (d === -2 ? l : $);
  }
  return [be(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const l = e.length - 1, n = this.parts, [p, u] = Ie(e, t);
    if (this.el = H.createElement(p, i), E.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = E.nextNode()) !== null && n.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(fe)) {
          const y = u[a++], $ = r.getAttribute(d).split(x), L = /([.?@])?(.*)/.exec(y);
          n.push({ type: 1, index: o, name: L[2], strings: $, ctor: L[1] === "." ? Ue : L[1] === "?" ? Ne : L[1] === "@" ? Re : Q }), r.removeAttribute(d);
        } else d.startsWith(x) && (n.push({ type: 6, index: o }), r.removeAttribute(d));
        if (ge.test(r.tagName)) {
          const d = r.textContent.split(x), y = d.length - 1;
          if (y > 0) {
            r.textContent = W ? W.emptyScript : "";
            for (let $ = 0; $ < y; $++) r.append(d[$], R()), E.nextNode(), n.push({ type: 2, index: ++o });
            r.append(d[y], R());
          }
        }
      } else if (r.nodeType === 8) if (r.data === me) n.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(x, d + 1)) !== -1; ) n.push({ type: 7, index: o }), d += x.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const i = C.createElement("template");
    return i.innerHTML = e, i;
  }
}
function I(s, e, t = s, i) {
  var a, l;
  if (e === O) return e;
  let r = i !== void 0 ? (a = t._$Co) == null ? void 0 : a[i] : t._$Cl;
  const o = z(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = r : t._$Cl = r), r !== void 0 && (e = I(s, r._$AS(s, e.values), r, i)), e;
}
class Me {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? C).importNode(t, !0);
    E.currentNode = r;
    let o = E.nextNode(), a = 0, l = 0, n = i[0];
    for (; n !== void 0; ) {
      if (a === n.index) {
        let p;
        n.type === 2 ? p = new q(o, o.nextSibling, this, e) : n.type === 1 ? p = new n.ctor(o, n.name, n.strings, this, e) : n.type === 6 && (p = new ze(o, this, e)), this._$AV.push(p), n = i[++l];
      }
      a !== (n == null ? void 0 : n.index) && (o = E.nextNode(), a++);
    }
    return E.currentNode = C, r;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class q {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = I(this, e, t), z(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : De(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && z(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: t, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = H.createElement(be(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(t);
    else {
      const a = new Me(r, this), l = a.u(this.options);
      a.p(t), this.T(l), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = ve.get(e.strings);
    return t === void 0 && ve.set(e.strings, t = new H(e)), t;
  }
  k(e) {
    se(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const o of e) r === t.length ? t.push(i = new q(this.O(R()), this.O(R()), this, this.options)) : i = t[r], i._$AI(o), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const r = le(e).nextSibling;
      le(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, r, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(e, t = this, i, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) e = I(this, e, t, 0), a = !z(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
    else {
      const l = e;
      let n, p;
      for (e = o[0], n = 0; n < o.length - 1; n++) p = I(this, l[i + n], t, n), p === O && (p = this._$AH[n]), a || (a = !z(p) || p !== this._$AH[n]), p === h ? e = h : e !== h && (e += (p ?? "") + o[n + 1]), this._$AH[n] = p;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ue extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Ne extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Re extends Q {
  constructor(e, t, i, r, o) {
    super(e, t, i, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = I(this, e, t, 0) ?? h) === O) return;
    const i = this._$AH, r = e === h && i !== h || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ze {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    I(this, e);
  }
}
const K = N.litHtmlPolyfillSupport;
K == null || K(H, q), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.2");
const He = (s, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = r = new q(e.insertBefore(R(), o), o, void 0, t ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis;
class k extends D {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = He(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return O;
  }
}
var _e;
k._$litElement$ = !0, k.finalized = !0, (_e = T.litElementHydrateSupport) == null || _e.call(T, { LitElement: k });
const Y = T.litElementPolyfillSupport;
Y == null || Y({ LitElement: k });
(T.litElementVersions ?? (T.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = { attribute: !0, type: String, converter: V, reflect: !1, hasChanged: te }, qe = (s = je, e, t) => {
  const { kind: i, metadata: r } = t;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(t.name, s), i === "accessor") {
    const { name: a } = t;
    return { set(l) {
      const n = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(a, n, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: a } = t;
    return function(l) {
      const n = this[a];
      e.call(this, l), this.requestUpdate(a, n, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function b(s) {
  return (e, t) => typeof t == "object" ? qe(s, e, t) : ((i, r, o) => {
    const a = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), a ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(s) {
  return b({ ...s, state: !0, attribute: !1 });
}
class Le {
  constructor(e) {
    this._hass = e;
  }
  set hass(e) {
    this._hass = e;
  }
  async request(e, t, i, r) {
    return this._hass.callWS({
      type: "lovelace_spotify_browser/request",
      method: e,
      endpoint: t,
      ...i ? { body: i } : {},
      ...r ? { params: r } : {}
    });
  }
  async getPlaylists() {
    return this.request("GET", "/me/playlists", void 0, { limit: 50 });
  }
  async getRecentlyPlayed() {
    return this.request("GET", "/me/player/recently-played", void 0, { limit: 50 });
  }
  async getTopTracks() {
    return this.request("GET", "/me/top/tracks", void 0, { limit: 50 });
  }
  async search(e) {
    return this.request("GET", "/search", void 0, {
      q: e,
      type: "track,playlist,album,artist",
      limit: 20
    });
  }
  async getDevices() {
    return this.request("GET", "/me/player/devices");
  }
  async getCurrentPlayback() {
    return this.request("GET", "/me/player");
  }
  async play(e, t, i) {
    const r = e ? { device_id: e } : void 0, o = {};
    return t && (o.context_uri = t), i && (o.uris = i), this.request("PUT", "/me/player/play", Object.keys(o).length ? o : void 0, r);
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
  async setVolume(e) {
    return this.request("PUT", "/me/player/volume", void 0, { volume_percent: e });
  }
  async seek(e) {
    return this.request("PUT", "/me/player/seek", void 0, { position_ms: e });
  }
}
var Be = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, A = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Ve(e, t) : e, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (r = (i ? a(e, t, r) : a(r)) || r);
  return i && r && Be(e, t, r), r;
};
let m = class extends k {
  constructor() {
    super(...arguments), this.api = null, this.playbackState = null, this.devices = [], this.selectedDeviceId = "", this._heartActive = !1, this._seekDragging = !1, this._seekValue = 0;
  }
  _formatMs(s) {
    const e = Math.floor(s / 1e3), t = Math.floor(e / 60), i = e % 60;
    return `${t}:${i.toString().padStart(2, "0")}`;
  }
  async _onPlayPause() {
    var s;
    if (this.api)
      try {
        (s = this.playbackState) != null && s.is_playing ? await this.api.pause() : await this.api.play(this.selectedDeviceId || void 0), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  async _onNext() {
    if (this.api)
      try {
        await this.api.next(), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  async _onPrevious() {
    if (this.api)
      try {
        await this.api.previous(), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  _onSeekInput(s) {
    this._seekDragging = !0, this._seekValue = Number(s.target.value);
  }
  async _onSeekChange(s) {
    var t;
    if (this._seekDragging = !1, !this.api || !((t = this.playbackState) != null && t.item)) return;
    const e = Number(s.target.value);
    try {
      await this.api.seek(e), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
    } catch {
    }
  }
  async _onVolumeChange(s) {
    if (!this.api) return;
    const e = Number(s.target.value);
    try {
      await this.api.setVolume(e);
    } catch {
    }
  }
  _onDeviceSelected(s) {
    this.dispatchEvent(
      new CustomEvent("device-selected", {
        detail: s.detail,
        bubbles: !0,
        composed: !0
      })
    );
  }
  _toggleHeart() {
    this._heartActive = !this._heartActive;
  }
  render() {
    var n, p, u, d;
    const s = this.playbackState, e = (s == null ? void 0 : s.item) ?? null, t = (s == null ? void 0 : s.is_playing) ?? !1, i = !this._seekDragging && (s == null ? void 0 : s.progress_ms) != null ? s.progress_ms : this._seekDragging ? this._seekValue : 0, r = (e == null ? void 0 : e.duration_ms) ?? 0, o = r > 0 ? i / r * 100 : 0, a = ((n = s == null ? void 0 : s.device) == null ? void 0 : n.volume_percent) ?? 50, l = ((d = (u = (p = e == null ? void 0 : e.album) == null ? void 0 : p.images) == null ? void 0 : u[0]) == null ? void 0 : d.url) ?? null;
    return c`
      <div class="album-art">
        ${l ? c`<img src=${l} alt="Album art" />` : c`<div class="album-art-placeholder">🎵</div>`}
      </div>

      ${e ? c`
            <div class="track-info">
              <p class="track-name">${e.name}</p>
              <p class="track-artist">${e.artists.map((y) => y.name).join(", ")}</p>
              <p class="track-album">${e.album.name}</p>
            </div>

            <div class="progress-section">
              <input
                type="range"
                class="progress-bar"
                min="0"
                max=${r}
                .value=${String(i)}
                style="--progress-pct: ${o.toFixed(1)}%"
                @input=${this._onSeekInput}
                @change=${this._onSeekChange}
              />
              <div class="progress-times">
                <span>${this._formatMs(i)}</span>
                <span>${this._formatMs(r)}</span>
              </div>
            </div>
          ` : c`<div class="no-track">No active Spotify session</div>`}

      <div class="transport">
        <button @click=${this._onPrevious} title="Previous">⏮</button>
        <button class="play-pause" @click=${this._onPlayPause} title=${t ? "Pause" : "Play"}>
          ${t ? "⏸" : "▶"}
        </button>
        <button @click=${this._onNext} title="Next">⏭</button>
        <button
          class="heart-btn ${this._heartActive ? "active" : ""}"
          @click=${this._toggleHeart}
          title="Save track"
        >♥</button>
      </div>

      <div class="volume-section">
        <span class="volume-icon">🔈</span>
        <input
          type="range"
          class="volume-slider"
          min="0"
          max="100"
          .value=${String(a)}
          @change=${this._onVolumeChange}
        />
        <span class="volume-icon">🔊</span>
      </div>

      <spotify-device-picker
        .devices=${this.devices}
        .selectedDeviceId=${this.selectedDeviceId}
        @device-selected=${this._onDeviceSelected}
      ></spotify-device-picker>
    `;
  }
};
m.styles = G`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .album-art {
      width: 100%;
      max-width: 280px;
      aspect-ratio: 1;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      background: var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .album-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .album-art-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
    }

    .track-info {
      text-align: center;
    }

    .track-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-artist {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-album {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 0;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .no-track {
      text-align: center;
      color: var(--secondary-text-color);
      font-style: italic;
      padding: 32px 0;
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .progress-bar {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color, #e0e0e0);
      outline: none;
      cursor: pointer;
    }

    .progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .progress-bar::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .progress-bar::-webkit-slider-runnable-track {
      background: linear-gradient(
        to right,
        var(--primary-color, #03a9f4) var(--progress-pct, 0%),
        var(--divider-color, #e0e0e0) var(--progress-pct, 0%)
      );
      border-radius: 2px;
      height: 4px;
    }

    .progress-times {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--secondary-text-color);
    }

    .transport {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .transport button {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 20px;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }

    .transport button:hover {
      background: var(--divider-color, #e0e0e0);
    }

    .transport button.play-pause {
      font-size: 28px;
      background: var(--primary-color, #03a9f4);
      color: white;
      padding: 12px;
    }

    .transport button.play-pause:hover {
      opacity: 0.85;
      background: var(--primary-color, #03a9f4);
    }

    .heart-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 20px;
      padding: 8px;
      color: var(--secondary-text-color);
      transition: color 0.15s;
    }

    .heart-btn.active {
      color: #e91e63;
    }

    .volume-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .volume-icon {
      font-size: 16px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }

    .volume-slider {
      -webkit-appearance: none;
      appearance: none;
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color, #e0e0e0);
      outline: none;
      cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .volume-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      cursor: pointer;
    }
  `;
A([
  b({ attribute: !1 })
], m.prototype, "api", 2);
A([
  b({ attribute: !1 })
], m.prototype, "playbackState", 2);
A([
  b({ attribute: !1 })
], m.prototype, "devices", 2);
A([
  b({ type: String })
], m.prototype, "selectedDeviceId", 2);
A([
  v()
], m.prototype, "_heartActive", 2);
A([
  v()
], m.prototype, "_seekDragging", 2);
A([
  v()
], m.prototype, "_seekValue", 2);
m = A([
  F("spotify-now-playing")
], m);
var We = Object.defineProperty, Ge = Object.getOwnPropertyDescriptor, f = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Ge(e, t) : e, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (r = (i ? a(e, t, r) : a(r)) || r);
  return i && r && We(e, t, r), r;
};
let _ = class extends k {
  constructor() {
    super(...arguments), this.api = null, this.selectedDeviceId = "", this._activeTab = "playlists", this._playlists = [], this._recentTracks = [], this._topTracks = [], this._searchResults = {
      tracks: [],
      playlists: []
    }, this._searchQuery = "", this._loading = !1, this._error = "", this._searchDebounceTimer = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadTab(this._activeTab);
  }
  async _loadTab(s) {
    if (!(!this.api || s === "search")) {
      this._loading = !0, this._error = "";
      try {
        if (s === "playlists") {
          const e = await this.api.getPlaylists();
          this._playlists = e.items;
        } else if (s === "recently-played") {
          const e = await this.api.getRecentlyPlayed();
          this._recentTracks = e.items.map((t) => t.track);
        } else if (s === "top-tracks") {
          const e = await this.api.getTopTracks();
          this._topTracks = e.items;
        }
      } catch (e) {
        this._error = e instanceof Error ? e.message : "Failed to load data";
      } finally {
        this._loading = !1;
      }
    }
  }
  _switchTab(s) {
    this._activeTab !== s && (this._activeTab = s, this._loadTab(s));
  }
  _onSearchInput(s) {
    const e = s.target.value;
    if (this._searchQuery = e, this._searchDebounceTimer && clearTimeout(this._searchDebounceTimer), !e.trim()) {
      this._searchResults = { tracks: [], playlists: [] };
      return;
    }
    this._searchDebounceTimer = setTimeout(() => this._doSearch(e), 300);
  }
  async _doSearch(s) {
    var e, t;
    if (this.api) {
      this._loading = !0, this._error = "";
      try {
        const i = await this.api.search(s);
        this._searchResults = {
          tracks: ((e = i.tracks) == null ? void 0 : e.items) ?? [],
          playlists: ((t = i.playlists) == null ? void 0 : t.items) ?? []
        };
      } catch (i) {
        this._error = i instanceof Error ? i.message : "Search failed";
      } finally {
        this._loading = !1;
      }
    }
  }
  async _playPlaylist(s) {
    if (this.api)
      try {
        await this.api.play(this.selectedDeviceId || void 0, s.uri), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  async _playTrack(s) {
    if (this.api)
      try {
        await this.api.play(this.selectedDeviceId || void 0, void 0, [s.uri]), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  _renderThumb(s, e) {
    var i;
    const t = (i = s == null ? void 0 : s[0]) == null ? void 0 : i.url;
    return t ? c`<img class="item-thumb" src=${t} alt="" />` : c`<div class="item-thumb-placeholder">${e}</div>`;
  }
  _renderPlaylists() {
    return this._loading ? this._renderLoading() : this._error ? c`<div class="error">${this._error}</div>` : this._playlists.length ? this._playlists.map(
      (s) => c`
        <div class="item" @click=${() => this._playPlaylist(s)}>
          ${this._renderThumb(s.images, "🎵")}
          <div class="item-info">
            <div class="item-name">${s.name}</div>
            <div class="item-sub">${s.tracks.total} tracks · ${s.owner.display_name}</div>
          </div>
        </div>
      `
    ) : c`<div class="empty">No playlists found</div>`;
  }
  _renderRecentlyPlayed() {
    return this._loading ? this._renderLoading() : this._error ? c`<div class="error">${this._error}</div>` : this._recentTracks.length ? this._recentTracks.map(
      (s) => c`
        <div class="item" @click=${() => this._playTrack(s)}>
          ${this._renderThumb(s.album.images, "🎵")}
          <div class="item-info">
            <div class="item-name">${s.name}</div>
            <div class="item-sub">${s.artists.map((e) => e.name).join(", ")}</div>
          </div>
        </div>
      `
    ) : c`<div class="empty">No recent tracks</div>`;
  }
  _renderTopTracks() {
    return this._loading ? this._renderLoading() : this._error ? c`<div class="error">${this._error}</div>` : this._topTracks.length ? this._topTracks.map(
      (s) => c`
        <div class="item" @click=${() => this._playTrack(s)}>
          ${this._renderThumb(s.album.images, "🎵")}
          <div class="item-info">
            <div class="item-name">${s.name}</div>
            <div class="item-sub">${s.artists.map((e) => e.name).join(", ")}</div>
          </div>
        </div>
      `
    ) : c`<div class="empty">No top tracks found</div>`;
  }
  _renderSearch() {
    const s = this._searchResults.tracks.length > 0 || this._searchResults.playlists.length > 0;
    return c`
      <div class="search-box">
        <input
          class="search-input"
          type="search"
          placeholder="Search tracks, artists, playlists…"
          .value=${this._searchQuery}
          @input=${this._onSearchInput}
        />
      </div>
      ${this._loading ? this._renderLoading() : h}
      ${this._error ? c`<div class="error">${this._error}</div>` : h}
      ${!this._loading && this._searchQuery && !s ? c`<div class="empty">No results for "${this._searchQuery}"</div>` : h}
      ${this._searchResults.tracks.length ? c`
            <div class="search-section-label">Tracks</div>
            ${this._searchResults.tracks.map(
      (e) => c`
                <div class="item" @click=${() => this._playTrack(e)}>
                  ${this._renderThumb(e.album.images, "🎵")}
                  <div class="item-info">
                    <div class="item-name">${e.name}</div>
                    <div class="item-sub">${e.artists.map((t) => t.name).join(", ")}</div>
                  </div>
                </div>
              `
    )}
          ` : h}
      ${this._searchResults.playlists.length ? c`
            <div class="search-section-label">Playlists</div>
            ${this._searchResults.playlists.map(
      (e) => c`
                <div class="item" @click=${() => this._playPlaylist(e)}>
                  ${this._renderThumb(e.images, "🎵")}
                  <div class="item-info">
                    <div class="item-name">${e.name}</div>
                    <div class="item-sub">${e.tracks.total} tracks</div>
                  </div>
                </div>
              `
    )}
          ` : h}
    `;
  }
  _renderLoading() {
    return c`
      <div class="loading">
        <div class="spinner"></div>
        Loading…
      </div>
    `;
  }
  render() {
    return c`
      <div class="tab-bar">
        ${[
      { id: "playlists", label: "Playlists" },
      { id: "recently-played", label: "Recent" },
      { id: "top-tracks", label: "Top Tracks" },
      { id: "search", label: "Search" }
    ].map(
      (e) => c`
            <button
              class="tab-btn ${this._activeTab === e.id ? "active" : ""}"
              @click=${() => this._switchTab(e.id)}
            >
              ${e.label}
            </button>
          `
    )}
      </div>

      <div class="tab-content">
        ${this._activeTab === "playlists" ? this._renderPlaylists() : h}
        ${this._activeTab === "recently-played" ? this._renderRecentlyPlayed() : h}
        ${this._activeTab === "top-tracks" ? this._renderTopTracks() : h}
        ${this._activeTab === "search" ? this._renderSearch() : h}
      </div>
    `;
  }
};
_.styles = G`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    .tab-bar {
      display: flex;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      padding: 10px 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      transition: color 0.15s, border-color 0.15s;
    }

    .tab-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
      font-weight: 600;
    }

    .tab-content {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    .error {
      padding: 16px;
      color: var(--error-color, #f44336);
      font-size: 13px;
      text-align: center;
    }

    .empty {
      padding: 16px;
      color: var(--secondary-text-color);
      font-style: italic;
      text-align: center;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.15s;
    }

    .item:hover {
      background: var(--divider-color, rgba(0, 0, 0, 0.05));
    }

    .item-thumb {
      width: 44px;
      height: 44px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      background: var(--divider-color, #e0e0e0);
    }

    .item-thumb-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 4px;
      background: var(--divider-color, #e0e0e0);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .search-box {
      padding: 8px 16px;
      flex-shrink: 0;
    }

    .search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 20px;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      outline: none;
    }

    .search-input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .search-section-label {
      padding: 8px 16px 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
f([
  b({ attribute: !1 })
], _.prototype, "api", 2);
f([
  b({ type: String })
], _.prototype, "selectedDeviceId", 2);
f([
  v()
], _.prototype, "_activeTab", 2);
f([
  v()
], _.prototype, "_playlists", 2);
f([
  v()
], _.prototype, "_recentTracks", 2);
f([
  v()
], _.prototype, "_topTracks", 2);
f([
  v()
], _.prototype, "_searchResults", 2);
f([
  v()
], _.prototype, "_searchQuery", 2);
f([
  v()
], _.prototype, "_loading", 2);
f([
  v()
], _.prototype, "_error", 2);
_ = f([
  F("spotify-browse-panel")
], _);
var Qe = Object.defineProperty, Fe = Object.getOwnPropertyDescriptor, ie = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Fe(e, t) : e, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (r = (i ? a(e, t, r) : a(r)) || r);
  return i && r && Qe(e, t, r), r;
};
let j = class extends k {
  constructor() {
    super(...arguments), this.devices = [], this.selectedDeviceId = "";
  }
  _onChange(s) {
    const e = s.target;
    this.dispatchEvent(
      new CustomEvent("device-selected", {
        detail: { deviceId: e.value },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return !this.devices || this.devices.length === 0 ? c`<div class="no-devices">No devices available</div>` : c`
      <div class="device-picker">
        <span class="device-icon">🔊</span>
        <select @change=${this._onChange} .value=${this.selectedDeviceId}>
          ${this.devices.map(
      (s) => c`
              <option
                value=${s.id}
                ?selected=${s.id === this.selectedDeviceId}
              >
                ${s.name}${s.is_active ? " ✓" : ""}
              </option>
            `
    )}
        </select>
      </div>
    `;
  }
};
j.styles = G`
    :host {
      display: block;
    }

    .device-picker {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .device-icon {
      font-size: 16px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }

    select {
      flex: 1;
      background: transparent;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      color: var(--primary-text-color);
      font-size: 13px;
      padding: 4px 8px;
      cursor: pointer;
      min-width: 0;
      outline: none;
    }

    select:focus {
      border-color: var(--primary-color);
    }

    option {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }

    .no-devices {
      font-size: 13px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `;
ie([
  b({ attribute: !1 })
], j.prototype, "devices", 2);
ie([
  b({ type: String })
], j.prototype, "selectedDeviceId", 2);
j = ie([
  F("spotify-device-picker")
], j);
var Ze = Object.defineProperty, Je = Object.getOwnPropertyDescriptor, S = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Je(e, t) : e, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (r = (i ? a(e, t, r) : a(r)) || r);
  return i && r && Ze(e, t, r), r;
};
let g = class extends k {
  constructor() {
    super(...arguments), this._config = null, this._hass = null, this._playbackState = null, this._devices = [], this._selectedDeviceId = "", this._activeTab = "now-playing", this._error = "", this._api = null, this._pollInterval = null;
  }
  setConfig(s) {
    this._config = s;
    const e = s.height ?? 500;
    this.style.setProperty("--spotify-card-height", `${e}px`), s.default_device && (this._selectedDeviceId = s.default_device);
  }
  set hass(s) {
    this._hass = s, this._api ? this._api.hass = s : this._api = new Le(s);
  }
  static getConfigElement() {
    const s = document.createElement("div");
    return s.innerHTML = '<p style="padding:8px;font-size:13px;">Edit config YAML directly. No spotify_entity needed — the integration reads the token server-side.</p>', s;
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
    this._fetchPlaybackAndDevices(), this._pollInterval = setInterval(() => this._fetchPlaybackAndDevices(), 5e3);
  }
  _stopPolling() {
    this._pollInterval !== null && (clearInterval(this._pollInterval), this._pollInterval = null);
  }
  async _fetchPlaybackAndDevices() {
    if (this._api)
      try {
        this._error = "";
        const [s, e] = await Promise.all([
          this._api.getCurrentPlayback(),
          this._api.getDevices()
        ]);
        if (this._playbackState = s, this._devices = e.devices, !this._selectedDeviceId) {
          const t = e.devices.find((i) => i.is_active);
          t ? this._selectedDeviceId = t.id : e.devices.length > 0 && (this._selectedDeviceId = e.devices[0].id);
        }
      } catch (s) {
        const e = s instanceof Error ? s.message : String(s);
        e.includes("token_expired") || e.includes("401") ? this._error = "Spotify token expired. Please re-authenticate in Home Assistant." : e.includes("no_spotify_entry") && (this._error = "Spotify integration not configured. Add the lovelace_spotify_browser integration to Home Assistant.");
      }
  }
  _onDeviceSelected(s) {
    this._selectedDeviceId = s.detail.deviceId;
  }
  _onPlaybackChanged() {
    setTimeout(() => this._fetchPlaybackAndDevices(), 500);
  }
  _switchMainTab(s) {
    this._activeTab = s;
  }
  render() {
    if (!this._config) return h;
    const s = this._config.height ?? 500;
    return c`
      <ha-card style="height: ${s}px; overflow: hidden;">
        <div class="card-content">
          ${this._error ? c`
                <div class="error-state">
                  <span class="error-icon">⚠️</span>
                  <span class="error-msg">${this._error}</span>
                </div>
              ` : c`
                <div class="main-tabs">
                  <button
                    class="main-tab-btn ${this._activeTab === "now-playing" ? "active" : ""}"
                    @click=${() => this._switchMainTab("now-playing")}
                  >
                    Now Playing
                  </button>
                  <button
                    class="main-tab-btn ${this._activeTab === "browse" ? "active" : ""}"
                    @click=${() => this._switchMainTab("browse")}
                  >
                    Browse
                  </button>
                </div>

                <div class="panel">
                  ${this._activeTab === "now-playing" ? c`
                        <spotify-now-playing
                          .api=${this._api}
                          .playbackState=${this._playbackState}
                          .devices=${this._devices}
                          .selectedDeviceId=${this._selectedDeviceId}
                          @device-selected=${this._onDeviceSelected}
                          @playback-changed=${this._onPlaybackChanged}
                        ></spotify-now-playing>
                      ` : c`
                        <spotify-browse-panel
                          .api=${this._api}
                          .selectedDeviceId=${this._selectedDeviceId}
                          @playback-changed=${this._onPlaybackChanged}
                        ></spotify-browse-panel>
                      `}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
};
g.styles = G`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      height: var(--spotify-card-height, 500px);
      overflow: hidden;
    }

    .main-tabs {
      display: flex;
      border-bottom: 2px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .main-tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      cursor: pointer;
      padding: 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color);
      transition: color 0.15s, border-color 0.15s;
    }

    .main-tab-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
    }

    .panel {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
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
      color: var(--error-color, #f44336);
    }

    .error-state .error-icon {
      font-size: 36px;
    }

    .error-state .error-msg {
      font-size: 14px;
      line-height: 1.5;
    }

    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--secondary-text-color);
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
S([
  v()
], g.prototype, "_config", 2);
S([
  v()
], g.prototype, "_hass", 2);
S([
  v()
], g.prototype, "_playbackState", 2);
S([
  v()
], g.prototype, "_devices", 2);
S([
  v()
], g.prototype, "_selectedDeviceId", 2);
S([
  v()
], g.prototype, "_activeTab", 2);
S([
  v()
], g.prototype, "_error", 2);
g = S([
  F("lovelace-spotify-browser")
], g);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lovelace-spotify-browser",
  name: "Spotify Browser",
  description: "Browse and control Spotify from your Home Assistant dashboard"
});
export {
  g as SpotifyBrowserCard
};
