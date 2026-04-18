/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, it = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), nt = /* @__PURE__ */ new WeakMap();
let _t = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (it && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = nt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && nt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const At = (i) => new _t(typeof i == "string" ? i : i + "", void 0, st), Y = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, o) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new _t(e, i, st);
}, St = (i, t) => {
  if (it) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = G.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, lt = it ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return At(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Pt, defineProperty: Ct, getOwnPropertyDescriptor: Et, getOwnPropertyNames: Tt, getOwnPropertySymbols: Dt, getPrototypeOf: zt } = Object, S = globalThis, ct = S.trustedTypes, Mt = ct ? ct.emptyScript : "", K = S.reactiveElementPolyfillSupport, L = (i, t) => i, Q = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Mt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, rt = (i, t) => !Pt(i, t), ht = { attribute: !0, type: String, converter: Q, reflect: !1, useDefault: !1, hasChanged: rt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), S.litPropertyMetadata ?? (S.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ht) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && Ct(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: o } = Et(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: r, set(a) {
      const l = r == null ? void 0 : r.call(this);
      o == null || o.call(this, a), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const t = zt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const e = this.properties, s = [...Tt(e), ...Dt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(lt(r));
    } else t !== void 0 && e.push(lt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return St(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var o;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const a = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : Q).toAttribute(e, s.type);
      this._$Em = t, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, a;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = s.getPropertyOptions(r), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : Q;
      this._$Em = r;
      const h = n.fromAttribute(e, l.type);
      this[r] = h ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, o) {
    var a;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (o = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? rt)(o, e) || s.useDefault && s.reflect && o === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: o }, a) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var s;
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
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
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
    (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
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
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[L("elementProperties")] = /* @__PURE__ */ new Map(), O[L("finalized")] = /* @__PURE__ */ new Map(), K == null || K({ ReactiveElement: O }), (S.reactiveElementVersions ?? (S.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, dt = (i) => i, F = N.trustedTypes, pt = F ? F.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, yt = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, xt = "?" + A, Ht = `<${xt}>`, M = document, U = () => M.createComment(""), j = (i) => i === null || typeof i != "object" && typeof i != "function", at = Array.isArray, Ot = (i) => at(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", X = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ut = /-->/g, vt = />/g, T = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, gt = /"/g, $t = /^(?:script|style|textarea|title)$/i, wt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), c = wt(1), f = wt(2), B = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), bt = /* @__PURE__ */ new WeakMap(), D = M.createTreeWalker(M, 129);
function kt(i, t) {
  if (!at(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pt !== void 0 ? pt.createHTML(t) : t;
}
const Bt = (i, t) => {
  const e = i.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = I;
  for (let l = 0; l < e; l++) {
    const n = i[l];
    let h, v, p = -1, m = 0;
    for (; m < n.length && (a.lastIndex = m, v = a.exec(n), v !== null); ) m = a.lastIndex, a === I ? v[1] === "!--" ? a = ut : v[1] !== void 0 ? a = vt : v[2] !== void 0 ? ($t.test(v[2]) && (r = RegExp("</" + v[2], "g")), a = T) : v[3] !== void 0 && (a = T) : a === T ? v[0] === ">" ? (a = r ?? I, p = -1) : v[1] === void 0 ? p = -2 : (p = a.lastIndex - v[2].length, h = v[1], a = v[3] === void 0 ? T : v[3] === '"' ? gt : ft) : a === gt || a === ft ? a = T : a === ut || a === vt ? a = I : (a = T, r = void 0);
    const y = a === T && i[l + 1].startsWith("/>") ? " " : "";
    o += a === I ? n + Ht : p >= 0 ? (s.push(h), n.slice(0, p) + yt + n.slice(p) + A + y) : n + A + (p === -2 ? l : y);
  }
  return [kt(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class q {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const l = t.length - 1, n = this.parts, [h, v] = Bt(t, e);
    if (this.el = q.createElement(h, s), D.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = D.nextNode()) !== null && n.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(yt)) {
          const m = v[a++], y = r.getAttribute(p).split(A), E = /([.?@])?(.*)/.exec(m);
          n.push({ type: 1, index: o, name: E[2], strings: y, ctor: E[1] === "." ? It : E[1] === "?" ? Lt : E[1] === "@" ? Nt : Z }), r.removeAttribute(p);
        } else p.startsWith(A) && (n.push({ type: 6, index: o }), r.removeAttribute(p));
        if ($t.test(r.tagName)) {
          const p = r.textContent.split(A), m = p.length - 1;
          if (m > 0) {
            r.textContent = F ? F.emptyScript : "";
            for (let y = 0; y < m; y++) r.append(p[y], U()), D.nextNode(), n.push({ type: 2, index: ++o });
            r.append(p[m], U());
          }
        }
      } else if (r.nodeType === 8) if (r.data === xt) n.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(A, p + 1)) !== -1; ) n.push({ type: 7, index: o }), p += A.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = M.createElement("template");
    return s.innerHTML = t, s;
  }
}
function R(i, t, e = i, s) {
  var a, l;
  if (t === B) return t;
  let r = s !== void 0 ? (a = e._$Co) == null ? void 0 : a[s] : e._$Cl;
  const o = j(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = R(i, r._$AS(i, t.values), r, s)), t;
}
class Rt {
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
    const { el: { content: e }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? M).importNode(e, !0);
    D.currentNode = r;
    let o = D.nextNode(), a = 0, l = 0, n = s[0];
    for (; n !== void 0; ) {
      if (a === n.index) {
        let h;
        n.type === 2 ? h = new W(o, o.nextSibling, this, t) : n.type === 1 ? h = new n.ctor(o, n.name, n.strings, this, t) : n.type === 6 && (h = new Ut(o, this, t)), this._$AV.push(h), n = s[++l];
      }
      a !== (n == null ? void 0 : n.index) && (o = D.nextNode(), a++);
    }
    return D.currentNode = M, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class W {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = R(this, t, e), j(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== B && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ot(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(M.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = q.createElement(kt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(e);
    else {
      const a = new Rt(r, this), l = a.u(this.options);
      a.p(e), this.T(l), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = bt.get(t.strings);
    return e === void 0 && bt.set(t.strings, e = new q(t)), e;
  }
  k(t) {
    at(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const o of t) r === e.length ? e.push(s = new W(this.O(U()), this.O(U()), this, this.options)) : s = e[r], s._$AI(o), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = dt(t).nextSibling;
      dt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class Z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = R(this, t, e, 0), a = !j(t) || t !== this._$AH && t !== B, a && (this._$AH = t);
    else {
      const l = t;
      let n, h;
      for (t = o[0], n = 0; n < o.length - 1; n++) h = R(this, l[s + n], e, n), h === B && (h = this._$AH[n]), a || (a = !j(h) || h !== this._$AH[n]), h === d ? t = d : t !== d && (t += (h ?? "") + o[n + 1]), this._$AH[n] = h;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class It extends Z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Lt extends Z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Nt extends Z {
  constructor(t, e, s, r, o) {
    super(t, e, s, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = R(this, t, e, 0) ?? d) === B) return;
    const s = this._$AH, r = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== d && (s === d || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ut {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const tt = N.litHtmlPolyfillSupport;
tt == null || tt(q, W), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.2");
const jt = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = r = new W(t.insertBefore(U(), o), o, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis;
class P extends O {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = jt(e, this.renderRoot, this.renderOptions);
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
    return B;
  }
}
var mt;
P._$litElement$ = !0, P.finalized = !0, (mt = z.litElementHydrateSupport) == null || mt.call(z, { LitElement: P });
const et = z.litElementPolyfillSupport;
et == null || et({ LitElement: P });
(z.litElementVersions ?? (z.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = { attribute: !0, type: String, converter: Q, reflect: !1, hasChanged: rt }, Vt = (i = qt, t, e) => {
  const { kind: s, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: a } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(a, n, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, i, l), l;
    } };
  }
  if (s === "setter") {
    const { name: a } = e;
    return function(l) {
      const n = this[a];
      t.call(this, l), this.requestUpdate(a, n, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function w(i) {
  return (t, e) => typeof e == "object" ? Vt(i, t, e) : ((s, r, o) => {
    const a = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), a ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function u(i) {
  return w({ ...i, state: !0, attribute: !1 });
}
class Wt {
  constructor(t) {
    this._hass = t;
  }
  set hass(t) {
    this._hass = t;
  }
  async request(t, e, s, r) {
    return this._hass.callWS({
      type: "lovelace_spotify_browser/request",
      method: t,
      endpoint: e,
      ...s ? { body: s } : {},
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
  async getAlbum(t) {
    return this.request("GET", `/albums/${t}`);
  }
  async getAlbumTracks(t) {
    return this.request("GET", `/albums/${t}/tracks`, void 0, { limit: 50 });
  }
  async search(t) {
    return this.request("GET", "/search", void 0, {
      q: t,
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
  async play(t, e, s, r) {
    const o = {};
    t && (o.device_id = t);
    const a = {};
    return e && (a.context_uri = e), s && (a.uris = s), r && (a.offset = { uri: r }), this.request("PUT", "/me/player/play", Object.keys(a).length ? a : void 0, Object.keys(o).length ? o : void 0);
  }
  async setShuffle(t, e) {
    const s = { state: t ? "true" : "false" };
    return e && (s.device_id = e), this.request("PUT", "/me/player/shuffle", void 0, s);
  }
  async setRepeat(t, e) {
    const s = { state: t };
    return e && (s.device_id = e), this.request("PUT", "/me/player/repeat", void 0, s);
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
    return this.request("PUT", "/me/player/volume", void 0, { volume_percent: t });
  }
  async seek(t) {
    return this.request("PUT", "/me/player/seek", void 0, { position_ms: t });
  }
}
var Gt = Object.defineProperty, Qt = Object.getOwnPropertyDescriptor, k = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Qt(t, e) : t, o = i.length - 1, a; o >= 0; o--)
    (a = i[o]) && (r = (s ? a(t, e, r) : a(r)) || r);
  return s && r && Gt(t, e, r), r;
};
let _ = class extends P {
  constructor() {
    super(...arguments), this.api = null, this.playbackState = null, this.devices = [], this.selectedDeviceId = "", this._seekDragging = !1, this._seekValue = 0, this._shuffle = !1, this._repeat = "off", this._showDevices = !1;
  }
  _fmtMs(i) {
    const t = Math.floor(i / 1e3);
    return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
  }
  async _onPlayPause() {
    var i;
    if (this.api)
      try {
        (i = this.playbackState) != null && i.is_playing ? await this.api.pause() : await this.api.play(this.selectedDeviceId || void 0), this._emit();
      } catch {
      }
  }
  async _onNext() {
    if (this.api)
      try {
        await this.api.next(), this._emit();
      } catch {
      }
  }
  async _onPrevious() {
    if (this.api)
      try {
        await this.api.previous(), this._emit();
      } catch {
      }
  }
  async _onShuffle() {
    if (this.api) {
      this._shuffle = !this._shuffle;
      try {
        await this.api.setShuffle(this._shuffle, this.selectedDeviceId || void 0);
      } catch {
      }
    }
  }
  async _onRepeat() {
    if (!this.api) return;
    const i = ["off", "context", "track"], t = i.indexOf(this._repeat);
    this._repeat = i[(t + 1) % 3];
    try {
      await this.api.setRepeat(this._repeat, this.selectedDeviceId || void 0);
    } catch {
    }
  }
  _onSeekClick(i) {
    const t = this.playbackState;
    if (!this.api || !(t != null && t.item)) return;
    const s = i.currentTarget.getBoundingClientRect(), r = Math.min(1, Math.max(0, (i.clientX - s.left) / s.width)), o = Math.round(r * t.item.duration_ms);
    this.api.seek(o).then(() => this._emit()).catch(() => {
    });
  }
  async _onVolumeChange(i) {
    if (this.api)
      try {
        await this.api.setVolume(Number(i.target.value));
      } catch {
      }
  }
  _onDeviceSelect(i) {
    this._showDevices = !1, this.dispatchEvent(new CustomEvent("device-selected", { detail: { deviceId: i }, bubbles: !0, composed: !0 }));
  }
  _onAlbumClick() {
    var t, e;
    const i = (e = (t = this.playbackState) == null ? void 0 : t.item) == null ? void 0 : e.album;
    i && this.dispatchEvent(new CustomEvent("browse-album", { detail: { album: i }, bubbles: !0, composed: !0 }));
  }
  _emit() {
    this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
  }
  updated(i) {
    i.has("playbackState") && this.playbackState && (this._shuffle = this.playbackState.shuffle_state ?? !1, this._repeat = this.playbackState.repeat_state ?? "off");
  }
  render() {
    var v, p, m, y, E;
    const i = this.playbackState, t = (i == null ? void 0 : i.item) ?? null, e = (i == null ? void 0 : i.is_playing) ?? !1, s = this._seekDragging ? this._seekValue : (i == null ? void 0 : i.progress_ms) ?? 0, r = (t == null ? void 0 : t.duration_ms) ?? 0, o = r > 0 ? Math.min(100, s / r * 100) : 0, a = ((v = i == null ? void 0 : i.device) == null ? void 0 : v.volume_percent) ?? 50, l = ((y = (m = (p = t == null ? void 0 : t.album) == null ? void 0 : p.images) == null ? void 0 : m[0]) == null ? void 0 : y.url) ?? null, n = ((E = t == null ? void 0 : t.artists) == null ? void 0 : E.map((x) => x.name).join(", ")) ?? "", h = this.devices.find((x) => x.id === this.selectedDeviceId) ?? this.devices.find((x) => x.is_active);
    return c`
      ${l ? c`<div class="artwork-bg" style="background-image: url(${l})"></div>` : d}

      <div class="content">
        <div class="header">
          <span class="header-label">Now Playing</span>
          <button class="icon-btn" @click=${() => this.dispatchEvent(new CustomEvent("show-browse", { bubbles: !0, composed: !0 }))} title="Browse">
            ${ee}
          </button>
        </div>

        <div class="artwork-wrap">
          ${l ? c`<img src=${l} alt="Album art" />` : c`<div class="artwork-placeholder">🎵</div>`}
        </div>

        ${t ? c`
          <div class="track-info">
            <div class="track-name">${t.name}</div>
            <div class="track-artist">${n}</div>
            <div class="track-album" @click=${this._onAlbumClick} title="Browse album">${t.album.name}</div>
          </div>

          <div class="progress-section">
            <div class="progress-bar-wrap" @click=${this._onSeekClick}>
              <div class="progress-fill" style="width: ${o.toFixed(2)}%">
                <div class="progress-thumb"></div>
              </div>
            </div>
            <div class="progress-times">
              <span>${this._fmtMs(s)}</span>
              <span>${this._fmtMs(r)}</span>
            </div>
          </div>
        ` : c`<div class="no-track">No active Spotify session</div>`}

        <div class="controls">
          <button
            class="ctrl-btn ctrl-sm ${this._shuffle ? "active" : ""}"
            @click=${this._onShuffle}
            title="Shuffle"
          >${Kt}</button>

          <button class="ctrl-btn ctrl-md" @click=${this._onPrevious} title="Previous">
            ${Zt}
          </button>

          <button class="ctrl-btn ctrl-play" @click=${this._onPlayPause} title=${e ? "Pause" : "Play"}>
            ${e ? Yt : Ft}
          </button>

          <button class="ctrl-btn ctrl-md" @click=${this._onNext} title="Next">
            ${Jt}
          </button>

          <button
            class="ctrl-btn ctrl-sm ${this._repeat !== "off" ? "active" : ""}"
            @click=${this._onRepeat}
            title=${this._repeat === "off" ? "Repeat off" : this._repeat === "context" ? "Repeat all" : "Repeat one"}
          >${this._repeat === "track" ? te : Xt}</button>
        </div>

        <div class="volume-row">
          <span class="vol-icon">${re}</span>
          <input
            type="range"
            class="volume-slider"
            min="0"
            max="100"
            .value=${String(a)}
            @change=${this._onVolumeChange}
          />
          <span class="vol-icon">${ae}</span>
        </div>

        ${this.devices.length > 0 ? c`
          <div class="device-row">
            <button class="device-btn" @click=${() => this._showDevices = !this._showDevices}>
              <span class="device-btn-icon">${ie}</span>
              <span class="device-btn-label">${(h == null ? void 0 : h.name) ?? "No device"}</span>
              ${se}
            </button>
            ${this._showDevices ? c`
              <div class="device-menu">
                ${this.devices.map((x) => c`
                  <div
                    class="device-option ${x.id === this.selectedDeviceId || x.is_active ? "active" : ""}"
                    @click=${() => this._onDeviceSelect(x.id)}
                  >
                    <div class="device-option-dot"></div>
                    ${x.name}
                  </div>
                `)}
              </div>
            ` : d}
          </div>
        ` : d}
      </div>
    `;
  }
};
_.styles = Y`
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

    /* Volume row */
    .volume-row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      margin-top: 12px;
    }
    .vol-icon {
      color: rgba(255,255,255,0.4);
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    .volume-slider {
      -webkit-appearance: none;
      appearance: none;
      flex: 1;
      height: 3px;
      border-radius: 2px;
      background: rgba(255,255,255,0.15);
      outline: none;
      cursor: pointer;
    }
    .volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
    }
    .volume-slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border: none;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
    }

    /* Device picker */
    .device-row {
      width: 100%;
      margin-top: 10px;
      position: relative;
    }
    .device-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      transition: background 0.15s, color 0.15s;
    }
    .device-btn:hover {
      background: rgba(255,255,255,0.09);
      color: #fff;
    }
    .device-btn-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
    .device-btn-label {
      flex: 1;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .device-menu {
      position: absolute;
      bottom: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #1e1e1e;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      overflow: hidden;
      z-index: 10;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .device-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      cursor: pointer;
      font-size: 13px;
      color: rgba(255,255,255,0.7);
      transition: background 0.12s;
    }
    .device-option:hover { background: rgba(255,255,255,0.07); }
    .device-option.active { color: #1DB954; }
    .device-option-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #1DB954;
      flex-shrink: 0;
      opacity: 0;
    }
    .device-option.active .device-option-dot { opacity: 1; }
  `;
k([
  w({ attribute: !1 })
], _.prototype, "api", 2);
k([
  w({ attribute: !1 })
], _.prototype, "playbackState", 2);
k([
  w({ attribute: !1 })
], _.prototype, "devices", 2);
k([
  w({ type: String })
], _.prototype, "selectedDeviceId", 2);
k([
  u()
], _.prototype, "_seekDragging", 2);
k([
  u()
], _.prototype, "_seekValue", 2);
k([
  u()
], _.prototype, "_shuffle", 2);
k([
  u()
], _.prototype, "_repeat", 2);
k([
  u()
], _.prototype, "_showDevices", 2);
_ = k([
  J("spotify-now-playing")
], _);
const Ft = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M8 5v14l11-7z"/></svg>`, Yt = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`, Zt = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>`, Jt = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8zM16 6h2v12h-2z"/></svg>`, Kt = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>`, Xt = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`, te = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v6H13z"/></svg>`, ee = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`, ie = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M17 2H7L4 8v14h16V8l-3-6zm1 18H6V8.58L8.29 4h7.42L18 8.58V20z"/></svg>`, se = f`<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" style="flex-shrink:0;color:rgba(255,255,255,0.4)"><path d="M7 10l5 5 5-5z"/></svg>`, re = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>`, ae = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
var oe = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, b = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? ne(t, e) : t, o = i.length - 1, a; o >= 0; o--)
    (a = i[o]) && (r = (s ? a(t, e, r) : a(r)) || r);
  return s && r && oe(t, e, r), r;
};
let g = class extends P {
  constructor() {
    super(...arguments), this.api = null, this.selectedDeviceId = "", this.initialAlbum = null, this._activeTab = "playlists", this._playlists = [], this._recentTracks = [], this._topTracks = [], this._searchResults = { tracks: [], playlists: [] }, this._searchQuery = "", this._loading = !1, this._error = "", this._drill = null, this._drillTracks = [], this._drillLoading = !1, this._searchDebounceTimer = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadTab(this._activeTab);
  }
  updated(i) {
    i.has("api") && this.api && !i.get("api") && this._loadTab(this._activeTab), i.has("initialAlbum") && this.initialAlbum && this._openAlbumDrill(this.initialAlbum);
  }
  // Called externally (from parent) to drill into an album from now-playing view
  drillAlbum(i) {
    this._openAlbumDrill(i);
  }
  async _openAlbumDrill(i) {
    this._drill = { kind: "album", album: i }, this._drillTracks = [], this._drillLoading = !0;
    try {
      if (!this.api) return;
      const t = await this.api.getAlbumTracks(i.id);
      this._drillTracks = t.items ?? [];
    } catch {
    } finally {
      this._drillLoading = !1;
    }
  }
  async _loadTab(i) {
    if (!(!this.api || i === "search")) {
      this._loading = !0, this._error = "";
      try {
        if (i === "playlists") {
          const t = await this.api.getPlaylists();
          this._playlists = (t.items ?? []).filter((e) => e != null && e.uri != null);
        } else if (i === "recently-played") {
          const t = await this.api.getRecentlyPlayed();
          this._recentTracks = (t.items ?? []).map((e) => e.track).filter((e) => e && e.uri);
        } else if (i === "top-tracks") {
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
  _switchTab(i) {
    this._activeTab !== i && (this._activeTab = i, this._loadTab(i));
  }
  _onSearchInput(i) {
    const t = i.target.value;
    if (this._searchQuery = t, this._searchDebounceTimer && clearTimeout(this._searchDebounceTimer), !t.trim()) {
      this._searchResults = { tracks: [], playlists: [] };
      return;
    }
    this._searchDebounceTimer = setTimeout(() => this._doSearch(t), 300);
  }
  async _doSearch(i) {
    var t, e;
    if (this.api) {
      this._loading = !0, this._error = "";
      try {
        const s = await this.api.search(i);
        this._searchResults = {
          tracks: ((t = s.tracks) == null ? void 0 : t.items) ?? [],
          playlists: ((e = s.playlists) == null ? void 0 : e.items) ?? []
        };
      } catch (s) {
        this._error = s instanceof Error ? s.message : "Search failed";
      } finally {
        this._loading = !1;
      }
    }
  }
  async _playPlaylist(i, t = !1) {
    if (this.api)
      try {
        t && await this.api.setShuffle(!0, this.selectedDeviceId || void 0), await this.api.play(this.selectedDeviceId || void 0, i.uri), this._emit();
      } catch {
      }
  }
  async _playTrack(i) {
    if (this.api)
      try {
        await this.api.play(this.selectedDeviceId || void 0, void 0, [i.uri]), this._emit();
      } catch {
      }
  }
  async _playAlbum(i, t = !1, e) {
    if (this.api)
      try {
        t && await this.api.setShuffle(!0, this.selectedDeviceId || void 0), await this.api.play(this.selectedDeviceId || void 0, i.uri, void 0, e), this._emit();
      } catch {
      }
  }
  async _playAlbumTrack(i) {
    const t = this._drill;
    if (!(!this.api || !t || t.kind !== "album"))
      try {
        await this.api.setShuffle(!1, this.selectedDeviceId || void 0), await this.api.play(this.selectedDeviceId || void 0, t.album.uri, void 0, i), this._emit();
      } catch {
      }
  }
  _emit() {
    this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
  }
  // ── Rendering helpers ───────────────────────────────────────────────────
  _thumb(i, t = !1) {
    var s;
    const e = (s = i == null ? void 0 : i[0]) == null ? void 0 : s.url;
    return e ? c`<img class="item-thumb ${t ? "round" : ""}" src=${e} alt="" />` : c`<div class="item-thumb-placeholder">🎵</div>`;
  }
  _renderLoading() {
    return c`<div class="loading"><div class="spinner"></div>Loading…</div>`;
  }
  // ── Drill-down view ─────────────────────────────────────────────────────
  _renderDrill() {
    var a, l, n;
    const i = this._drill, t = i.kind === "album", e = t ? i.album : i.playlist, s = t ? i.album.images : i.playlist.images ?? [], r = (a = s == null ? void 0 : s[0]) == null ? void 0 : a.url, o = t ? `${(l = i.album.artists) == null ? void 0 : l.map((h) => h.name).join(", ")}` : `${((n = i.playlist.tracks) == null ? void 0 : n.total) ?? 0} songs`;
    return c`
      <div class="drill-header">
        <button class="back-btn" @click=${() => {
      this._drill = null, this._drillTracks = [];
    }}>${he}</button>
        ${r ? c`<img class="drill-thumb" src=${r} alt="" />` : d}
        <div class="drill-info">
          <div class="drill-title">${e.name}</div>
          <div class="drill-sub">${o}</div>
        </div>
      </div>

      <div class="drill-actions">
        <button
          class="drill-action-btn btn-play"
          @click=${() => t ? this._playAlbum(i.album) : this._playPlaylist(i.playlist)}
        >
          <span class="btn-icon">${H}</span>
          Play
        </button>
        <button
          class="drill-action-btn btn-shuffle"
          @click=${() => t ? this._playAlbum(i.album, !0) : this._playPlaylist(i.playlist, !0)}
        >
          <span class="btn-icon">${pe}</span>
          Shuffle
        </button>
      </div>

      <div class="tab-content">
        ${this._drillLoading ? this._renderLoading() : d}
        ${!this._drillLoading && this._drillTracks.length === 0 ? c`<div class="empty">No tracks</div>` : d}
        ${this._drillTracks.map((h, v) => c`
          <div class="item" @click=${() => this._playAlbumTrack(h.uri)}>
            <div class="item-thumb-placeholder" style="font-size:12px;color:rgba(255,255,255,0.35);width:42px;height:42px;">
              ${h.track_number ?? v + 1}
            </div>
            <div class="item-info">
              <div class="item-name">${h.name}</div>
              <div class="item-sub">${(h.artists ?? []).map((p) => p.name).join(", ")}</div>
            </div>
            <button class="item-play" @click=${(p) => {
      p.stopPropagation(), this._playAlbumTrack(h.uri);
    }}>
              ${H}
            </button>
          </div>
        `)}
      </div>
    `;
  }
  // ── Tab content renders ─────────────────────────────────────────────────
  _renderPlaylists() {
    return this._loading ? this._renderLoading() : this._error ? c`<div class="error">${this._error}</div>` : this._playlists.length ? this._playlists.map((i) => {
      var t, e;
      return c`
      <div class="item" @click=${() => this._playPlaylist(i)}>
        ${this._thumb(i.images, !0)}
        <div class="item-info">
          <div class="item-name">${i.name}</div>
          <div class="item-sub">${((t = i.tracks) == null ? void 0 : t.total) ?? 0} songs · ${((e = i.owner) == null ? void 0 : e.display_name) ?? ""}</div>
        </div>
        <button class="item-play" @click=${(s) => {
        s.stopPropagation(), this._playPlaylist(i);
      }}>
          ${H}
        </button>
      </div>
    `;
    }) : c`<div class="empty">No playlists found</div>`;
  }
  _renderTrackList(i, t) {
    return i.map((e) => {
      var s;
      return c`
      <div class="item ${e.uri === t ? "active" : ""}" @click=${() => this._playTrack(e)}>
        ${this._thumb((s = e.album) == null ? void 0 : s.images)}
        <div class="item-info">
          <div class="item-name">${e.name}</div>
          <div class="item-sub">
            ${e.uri === t ? c`<span style="display:flex;align-items:center;gap:5px">
                  <span class="eq"><span></span><span></span><span></span></span>
                  Playing
                </span>` : (e.artists ?? []).map((r) => r.name).join(", ")}
          </div>
        </div>
        <button class="item-play" @click=${(r) => {
        r.stopPropagation(), this._playTrack(e);
      }}>
          ${H}
        </button>
      </div>
    `;
    });
  }
  _renderSearch() {
    const i = this._searchResults.tracks.length > 0 || this._searchResults.playlists.length > 0;
    return c`
      <div class="search-box">
        <div class="search-inner">
          <span class="search-icon">${de}</span>
          <input
            class="search-input"
            type="search"
            placeholder="Search tracks, artists, playlists…"
            .value=${this._searchQuery}
            @input=${this._onSearchInput}
          />
        </div>
      </div>
      ${this._loading ? this._renderLoading() : d}
      ${this._error ? c`<div class="error">${this._error}</div>` : d}
      ${!this._loading && this._searchQuery && !i ? c`<div class="empty">No results for "${this._searchQuery}"</div>` : d}
      ${this._searchResults.tracks.length ? c`
        <div class="search-section-label">Tracks</div>
        ${this._renderTrackList(this._searchResults.tracks)}
      ` : d}
      ${this._searchResults.playlists.length ? c`
        <div class="search-section-label">Playlists</div>
        ${this._searchResults.playlists.map((t) => {
      var e;
      return c`
          <div class="item" @click=${() => this._playPlaylist(t)}>
            ${this._thumb(t.images, !0)}
            <div class="item-info">
              <div class="item-name">${t.name}</div>
              <div class="item-sub">${((e = t.tracks) == null ? void 0 : e.total) ?? 0} songs</div>
            </div>
            <button class="item-play" @click=${(s) => {
        s.stopPropagation(), this._playPlaylist(t);
      }}>
              ${H}
            </button>
          </div>
        `;
    })}
      ` : d}
    `;
  }
  // ── Main render ─────────────────────────────────────────────────────────
  render() {
    return this._drill ? c`
        ${this._renderDrill()}
        ${this._renderMiniBar()}
      ` : c`
      <div class="tab-bar">
        ${[
      { id: "playlists", label: "Playlists" },
      { id: "recently-played", label: "Recent" },
      { id: "top-tracks", label: "Top" },
      { id: "search", label: "Search" }
    ].map((t) => c`
          <button
            class="tab-btn ${this._activeTab === t.id ? "active" : ""}"
            @click=${() => this._switchTab(t.id)}
          >${t.label}</button>
        `)}
      </div>

      ${this._activeTab === "search" ? c`${this._renderSearch()}` : c`
          <div class="tab-content">
            ${this._activeTab === "playlists" ? this._renderPlaylists() : d}
            ${this._activeTab === "recently-played" ? this._loading ? this._renderLoading() : this._error ? c`<div class="error">${this._error}</div>` : this._recentTracks.length ? this._renderTrackList(this._recentTracks) : c`<div class="empty">No recent tracks</div>` : d}
            ${this._activeTab === "top-tracks" ? this._loading ? this._renderLoading() : this._error ? c`<div class="error">${this._error}</div>` : this._topTracks.length ? this._renderTrackList(this._topTracks) : c`<div class="empty">No top tracks</div>` : d}
          </div>
        `}

      ${this._renderMiniBar()}
    `;
  }
  _renderMiniBar() {
    return c`
      <div class="mini-bar" @click=${() => this.dispatchEvent(new CustomEvent("show-now-playing", { bubbles: !0, composed: !0 }))}>
        <div class="mini-art">
          <slot name="mini-art"></slot>
        </div>
        <div class="mini-meta">
          <slot name="mini-title"></slot>
        </div>
        <div class="mini-controls">
          <button class="mini-btn" @click=${(i) => {
      i.stopPropagation(), this._emitControl("prev");
    }}>${le}</button>
          <button class="mini-btn play" @click=${(i) => {
      i.stopPropagation(), this._emitControl("play-pause");
    }}>${H}</button>
          <button class="mini-btn" @click=${(i) => {
      i.stopPropagation(), this._emitControl("next");
    }}>${ce}</button>
        </div>
      </div>
    `;
  }
  _emitControl(i) {
    this.dispatchEvent(new CustomEvent("mini-control", { detail: { action: i }, bubbles: !0, composed: !0 }));
  }
};
g.styles = Y`
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
b([
  w({ attribute: !1 })
], g.prototype, "api", 2);
b([
  w({ type: String })
], g.prototype, "selectedDeviceId", 2);
b([
  w({ attribute: !1 })
], g.prototype, "initialAlbum", 2);
b([
  u()
], g.prototype, "_activeTab", 2);
b([
  u()
], g.prototype, "_playlists", 2);
b([
  u()
], g.prototype, "_recentTracks", 2);
b([
  u()
], g.prototype, "_topTracks", 2);
b([
  u()
], g.prototype, "_searchResults", 2);
b([
  u()
], g.prototype, "_searchQuery", 2);
b([
  u()
], g.prototype, "_loading", 2);
b([
  u()
], g.prototype, "_error", 2);
b([
  u()
], g.prototype, "_drill", 2);
b([
  u()
], g.prototype, "_drillTracks", 2);
b([
  u()
], g.prototype, "_drillLoading", 2);
g = b([
  J("spotify-browse-panel")
], g);
const H = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M8 5v14l11-7z"/></svg>`;
f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const le = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>`, ce = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8zM16 6h2v12h-2z"/></svg>`, he = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`, de = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`, pe = f`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>`;
var ue = Object.defineProperty, ve = Object.getOwnPropertyDescriptor, ot = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? ve(t, e) : t, o = i.length - 1, a; o >= 0; o--)
    (a = i[o]) && (r = (s ? a(t, e, r) : a(r)) || r);
  return s && r && ue(t, e, r), r;
};
let V = class extends P {
  constructor() {
    super(...arguments), this.devices = [], this.selectedDeviceId = "";
  }
  _onChange(i) {
    const t = i.target;
    this.dispatchEvent(
      new CustomEvent("device-selected", {
        detail: { deviceId: t.value },
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
      (i) => c`
              <option
                value=${i.id}
                ?selected=${i.id === this.selectedDeviceId}
              >
                ${i.name}${i.is_active ? " ✓" : ""}
              </option>
            `
    )}
        </select>
      </div>
    `;
  }
};
V.styles = Y`
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
ot([
  w({ attribute: !1 })
], V.prototype, "devices", 2);
ot([
  w({ type: String })
], V.prototype, "selectedDeviceId", 2);
V = ot([
  J("spotify-device-picker")
], V);
var fe = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, C = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? ge(t, e) : t, o = i.length - 1, a; o >= 0; o--)
    (a = i[o]) && (r = (s ? a(t, e, r) : a(r)) || r);
  return s && r && fe(t, e, r), r;
};
let $ = class extends P {
  constructor() {
    super(...arguments), this._config = null, this._playbackState = null, this._devices = [], this._selectedDeviceId = "", this._view = "now-playing", this._error = "", this._pendingAlbumDrill = null, this._api = null, this._pollInterval = null;
  }
  setConfig(i) {
    this._config = i, this.style.setProperty("--spotify-card-height", `${i.height ?? 500}px`);
  }
  set hass(i) {
    this._api ? this._api.hass = i : this._api = new Wt(i);
  }
  static getConfigElement() {
    const i = document.createElement("div");
    return i.innerHTML = '<p style="padding:8px;font-size:13px;">Edit config YAML directly.</p>', i;
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
    this._fetchState(), this._pollInterval = setInterval(() => this._fetchState(), 5e3);
  }
  _stopPolling() {
    this._pollInterval !== null && (clearInterval(this._pollInterval), this._pollInterval = null);
  }
  async _fetchState() {
    if (this._api)
      try {
        this._error = "";
        const [i, t] = await Promise.all([
          this._api.getCurrentPlayback(),
          this._api.getDevices()
        ]);
        if (this._playbackState = i, this._devices = t.devices, !this._selectedDeviceId) {
          const e = t.devices.find((s) => s.is_active);
          e ? this._selectedDeviceId = e.id : t.devices.length > 0 && (this._selectedDeviceId = t.devices[0].id);
        }
      } catch (i) {
        const t = i instanceof Error ? i.message : String(i);
        t.includes("token_expired") || t.includes("401") ? this._error = "Spotify token expired. Re-authenticate in Home Assistant." : t.includes("no_spotify_entry") && (this._error = "Spotify integration not configured.");
      }
  }
  _onPlaybackChanged() {
    setTimeout(() => this._fetchState(), 500);
  }
  _onDeviceSelected(i) {
    this._selectedDeviceId = i.detail.deviceId;
  }
  _onBrowseAlbum(i) {
    const t = i.detail.album;
    this._pendingAlbumDrill = t, this._view = "browse";
  }
  _onMiniControl(i) {
    var e;
    const t = i.detail.action;
    this._api && (t === "play-pause" ? (e = this._playbackState) != null && e.is_playing ? this._api.pause().then(() => this._onPlaybackChanged()).catch(() => {
    }) : this._api.play(this._selectedDeviceId || void 0).then(() => this._onPlaybackChanged()).catch(() => {
    }) : t === "next" ? this._api.next().then(() => this._onPlaybackChanged()).catch(() => {
    }) : t === "prev" && this._api.previous().then(() => this._onPlaybackChanged()).catch(() => {
    }));
  }
  render() {
    var o, a, l, n;
    if (!this._config) return d;
    const i = this._config.height ?? 500, t = this._playbackState, e = t == null ? void 0 : t.item, s = ((l = (a = (o = e == null ? void 0 : e.album) == null ? void 0 : o.images) == null ? void 0 : a[0]) == null ? void 0 : l.url) ?? null, r = ((n = e == null ? void 0 : e.artists) == null ? void 0 : n.map((h) => h.name).join(", ")) ?? "";
    return c`
      <ha-card style="height: ${i}px; overflow: hidden;">
        <div class="card-content">
          ${this._error ? c`
                <div class="error-state">
                  <span class="error-icon">⚠️</span>
                  <span class="error-msg">${this._error}</span>
                </div>
              ` : this._view === "now-playing" ? c`
                  <div class="panel">
                    <spotify-now-playing
                      .api=${this._api}
                      .playbackState=${this._playbackState}
                      .devices=${this._devices}
                      .selectedDeviceId=${this._selectedDeviceId}
                      @device-selected=${this._onDeviceSelected}
                      @playback-changed=${this._onPlaybackChanged}
                      @show-browse=${() => this._view = "browse"}
                      @browse-album=${this._onBrowseAlbum}
                    ></spotify-now-playing>
                  </div>
                ` : c`
                  <div class="panel">
                    <spotify-browse-panel
                      .api=${this._api}
                      .selectedDeviceId=${this._selectedDeviceId}
                      .initialAlbum=${this._pendingAlbumDrill}
                      @playback-changed=${this._onPlaybackChanged}
                      @show-now-playing=${() => {
      this._view = "now-playing", this._pendingAlbumDrill = null;
    }}
                      @mini-control=${this._onMiniControl}
                    >
                      ${s ? c`<img slot="mini-art" src=${s} alt="" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:4px" />` : d}
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
$.styles = Y`
    :host {
      display: block;
    }

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

    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #0a0a0a;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #1DB954;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `;
C([
  u()
], $.prototype, "_config", 2);
C([
  u()
], $.prototype, "_playbackState", 2);
C([
  u()
], $.prototype, "_devices", 2);
C([
  u()
], $.prototype, "_selectedDeviceId", 2);
C([
  u()
], $.prototype, "_view", 2);
C([
  u()
], $.prototype, "_error", 2);
C([
  u()
], $.prototype, "_pendingAlbumDrill", 2);
$ = C([
  J("lovelace-spotify-browser")
], $);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lovelace-spotify-browser",
  name: "Spotify Browser",
  description: "Browse and control Spotify from your Home Assistant dashboard"
});
export {
  $ as SpotifyBrowserCard
};
