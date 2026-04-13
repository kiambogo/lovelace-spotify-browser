/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, ie = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, re = Symbol(), le = /* @__PURE__ */ new WeakMap();
let xe = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== re) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ie && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = le.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && le.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Se = (s) => new xe(typeof s == "string" ? s : s + "", void 0, re), Z = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1], s[0]);
  return new xe(t, s, re);
}, Pe = (s, e) => {
  if (ie) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), r = W.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = t.cssText, s.appendChild(i);
  }
}, he = ie ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return Se(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Te, defineProperty: Ce, getOwnPropertyDescriptor: De, getOwnPropertyNames: Oe, getOwnPropertySymbols: Ie, getPrototypeOf: Ue } = Object, S = globalThis, de = S.trustedTypes, Me = de ? de.emptyScript : "", K = S.reactiveElementPolyfillSupport, N = (s, e) => s, G = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Me : null;
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
} }, oe = (s, e) => !Te(s, e), pe = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: oe };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), S.litPropertyMetadata ?? (S.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let I = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = pe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, t);
      r !== void 0 && Ce(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: r, set: o } = De(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: r, set(n) {
      const c = r == null ? void 0 : r.call(this);
      o == null || o.call(this, n), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? pe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const e = Ue(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const t = this.properties, i = [...Oe(t), ...Ie(t)];
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
      for (const r of i) t.unshift(he(r));
    } else e !== void 0 && t.push(he(e));
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
    return Pe(e, this.constructor.elementStyles), e;
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
      const n = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : G).toAttribute(t, i.type);
      this._$Em = e, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var o, n;
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const c = i.getPropertyOptions(r), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : G;
      this._$Em = r;
      const p = a.fromAttribute(t, c.type);
      this[r] = p ?? ((n = this._$Ej) == null ? void 0 : n.get(r)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, r = !1, o) {
    var n;
    if (e !== void 0) {
      const c = this.constructor;
      if (r === !1 && (o = this[e]), i ?? (i = c.getPropertyOptions(e)), !((i.hasChanged ?? oe)(o, t) || i.useDefault && i.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(c._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, n] of r) {
        const { wrapped: c } = n, a = this[o];
        c !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
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
I.elementStyles = [], I.shadowRootOptions = { mode: "open" }, I[N("elementProperties")] = /* @__PURE__ */ new Map(), I[N("finalized")] = /* @__PURE__ */ new Map(), K == null || K({ ReactiveElement: I }), (S.reactiveElementVersions ?? (S.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, ue = (s) => s, Q = z.trustedTypes, fe = Q ? Q.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, we = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, ke = "?" + E, Re = `<${ke}>`, O = document, j = () => O.createComment(""), H = (s) => s === null || typeof s != "object" && typeof s != "function", ne = Array.isArray, Ne = (s) => ne(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ye = /-->/g, ve = />/g, T = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, me = /"/g, Ae = /^(?:script|style|textarea|title)$/i, ze = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), l = ze(1), U = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ge = /* @__PURE__ */ new WeakMap(), C = O.createTreeWalker(O, 129);
function Ee(s, e) {
  if (!ne(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return fe !== void 0 ? fe.createHTML(e) : e;
}
const je = (s, e) => {
  const t = s.length - 1, i = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = R;
  for (let c = 0; c < t; c++) {
    const a = s[c];
    let p, u, d = -1, g = 0;
    for (; g < a.length && (n.lastIndex = g, u = n.exec(a), u !== null); ) g = n.lastIndex, n === R ? u[1] === "!--" ? n = ye : u[1] !== void 0 ? n = ve : u[2] !== void 0 ? (Ae.test(u[2]) && (r = RegExp("</" + u[2], "g")), n = T) : u[3] !== void 0 && (n = T) : n === T ? u[0] === ">" ? (n = r ?? R, d = -1) : u[1] === void 0 ? d = -2 : (d = n.lastIndex - u[2].length, p = u[1], n = u[3] === void 0 ? T : u[3] === '"' ? me : _e) : n === me || n === _e ? n = T : n === ye || n === ve ? n = R : (n = T, r = void 0);
    const A = n === T && s[c + 1].startsWith("/>") ? " " : "";
    o += n === R ? a + Re : d >= 0 ? (i.push(p), a.slice(0, d) + we + a.slice(d) + E + A) : a + E + (d === -2 ? c : A);
  }
  return [Ee(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class L {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const c = e.length - 1, a = this.parts, [p, u] = je(e, t);
    if (this.el = L.createElement(p, i), C.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = C.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(we)) {
          const g = u[n++], A = r.getAttribute(d).split(E), q = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: o, name: q[2], strings: A, ctor: q[1] === "." ? Le : q[1] === "?" ? Be : q[1] === "@" ? Ve : F }), r.removeAttribute(d);
        } else d.startsWith(E) && (a.push({ type: 6, index: o }), r.removeAttribute(d));
        if (Ae.test(r.tagName)) {
          const d = r.textContent.split(E), g = d.length - 1;
          if (g > 0) {
            r.textContent = Q ? Q.emptyScript : "";
            for (let A = 0; A < g; A++) r.append(d[A], j()), C.nextNode(), a.push({ type: 2, index: ++o });
            r.append(d[g], j());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ke) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(E, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += E.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const i = O.createElement("template");
    return i.innerHTML = e, i;
  }
}
function M(s, e, t = s, i) {
  var n, c;
  if (e === U) return e;
  let r = i !== void 0 ? (n = t._$Co) == null ? void 0 : n[i] : t._$Cl;
  const o = H(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((c = r == null ? void 0 : r._$AO) == null || c.call(r, !1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = r : t._$Cl = r), r !== void 0 && (e = M(s, r._$AS(s, e.values), r, i)), e;
}
class He {
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
    const { el: { content: t }, parts: i } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? O).importNode(t, !0);
    C.currentNode = r;
    let o = C.nextNode(), n = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let p;
        a.type === 2 ? p = new V(o, o.nextSibling, this, e) : a.type === 1 ? p = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (p = new qe(o, this, e)), this._$AV.push(p), a = i[++c];
      }
      n !== (a == null ? void 0 : a.index) && (o = C.nextNode(), n++);
    }
    return C.currentNode = O, r;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class V {
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
    e = M(this, e, t), H(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== U && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ne(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && H(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: t, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = L.createElement(Ee(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(t);
    else {
      const n = new He(r, this), c = n.u(this.options);
      n.p(t), this.T(c), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = ge.get(e.strings);
    return t === void 0 && ge.set(e.strings, t = new L(e)), t;
  }
  k(e) {
    ne(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const o of e) r === t.length ? t.push(i = new V(this.O(j()), this.O(j()), this, this.options)) : i = t[r], i._$AI(o), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const r = ue(e).nextSibling;
      ue(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class F {
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
    let n = !1;
    if (o === void 0) e = M(this, e, t, 0), n = !H(e) || e !== this._$AH && e !== U, n && (this._$AH = e);
    else {
      const c = e;
      let a, p;
      for (e = o[0], a = 0; a < o.length - 1; a++) p = M(this, c[i + a], t, a), p === U && (p = this._$AH[a]), n || (n = !H(p) || p !== this._$AH[a]), p === h ? e = h : e !== h && (e += (p ?? "") + o[a + 1]), this._$AH[a] = p;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Le extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Be extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Ve extends F {
  constructor(e, t, i, r, o) {
    super(e, t, i, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = M(this, e, t, 0) ?? h) === U) return;
    const i = this._$AH, r = e === h && i !== h || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class qe {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    M(this, e);
  }
}
const X = z.litHtmlPolyfillSupport;
X == null || X(L, V), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.2");
const We = (s, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = r = new V(e.insertBefore(j(), o), o, void 0, t ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis;
class P extends I {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = We(t, this.renderRoot, this.renderOptions);
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
    return U;
  }
}
var $e;
P._$litElement$ = !0, P.finalized = !0, ($e = D.litElementHydrateSupport) == null || $e.call(D, { LitElement: P });
const ee = D.litElementPolyfillSupport;
ee == null || ee({ LitElement: P });
(D.litElementVersions ?? (D.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ge = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: oe }, Qe = (s = Ge, e, t) => {
  const { kind: i, metadata: r } = t;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(t.name, s), i === "accessor") {
    const { name: n } = t;
    return { set(c) {
      const a = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, a, s, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, s, c), c;
    } };
  }
  if (i === "setter") {
    const { name: n } = t;
    return function(c) {
      const a = this[n];
      e.call(this, c), this.requestUpdate(n, a, s, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function x(s) {
  return (e, t) => typeof t == "object" ? Qe(s, e, t) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(s) {
  return x({ ...s, state: !0, attribute: !1 });
}
const Ze = "https://api.spotify.com/v1";
class ae extends Error {
  constructor(e, t) {
    super(t), this.status = e, this.name = "SpotifyApiError";
  }
}
class te extends Error {
  constructor(e) {
    super(e), this.name = "TokenError";
  }
}
function be(s) {
  return typeof s != "string" ? !1 : s.length > 20 && /^[A-Za-z0-9\-_=]+$/.test(s);
}
function v(s, e) {
  const t = s.states[e];
  if (!t)
    throw new te(
      `Entity "${e}" not found. Check your spotify_entity config.`
    );
  const i = t.attributes;
  if (be(i.access_token))
    return i.access_token;
  if (be(i.media_content_id))
    return i.media_content_id;
  throw new te(
    "Could not read Spotify token from entity. Check your spotify_entity config."
  );
}
async function _(s, e, t, i) {
  const r = {
    Authorization: `Bearer ${t}`,
    "Content-Type": "application/json"
  }, o = await fetch(`${Ze}${e}`, {
    method: s,
    headers: r,
    body: i !== void 0 ? JSON.stringify(i) : void 0
  });
  if (o.status !== 204) {
    if (!o.ok) {
      const n = await o.text().catch(() => o.statusText);
      throw new ae(o.status, `Spotify API error ${o.status}: ${n}`);
    }
    return o.json();
  }
}
async function Fe(s, e) {
  const t = v(s, e);
  try {
    return await _("GET", "/me/player", t);
  } catch (i) {
    if (i instanceof ae && i.status === 204) return null;
    throw i;
  }
}
async function Je(s, e, t = 50) {
  const i = v(s, e);
  return _(
    "GET",
    `/me/playlists?limit=${t}`,
    i
  );
}
async function Ke(s, e, t = 50) {
  const i = v(s, e);
  return _(
    "GET",
    `/me/top/tracks?limit=${t}`,
    i
  );
}
async function Ye(s, e, t = 50) {
  const i = v(s, e);
  return _(
    "GET",
    `/me/player/recently-played?limit=${t}`,
    i
  );
}
async function Xe(s, e, t, i = 20) {
  const r = v(s, e), o = encodeURIComponent(t);
  return _(
    "GET",
    `/search?q=${o}&type=track,album,artist,playlist&limit=${i}`,
    r
  );
}
async function et(s, e) {
  const t = v(s, e);
  return _("GET", "/me/player/devices", t);
}
async function se(s, e, t) {
  const i = v(s, e), r = t.device_id ? `/me/player/play?device_id=${encodeURIComponent(t.device_id)}` : "/me/player/play", o = {};
  t.context_uri && (o.context_uri = t.context_uri), t.uris && (o.uris = t.uris), await _("PUT", r, i, o);
}
async function tt(s, e) {
  const t = v(s, e);
  await _("PUT", "/me/player/pause", t);
}
async function st(s, e) {
  const t = v(s, e);
  await _("POST", "/me/player/next", t);
}
async function it(s, e) {
  const t = v(s, e);
  await _("POST", "/me/player/previous", t);
}
async function rt(s, e, t) {
  const i = v(s, e);
  await _(
    "PUT",
    `/me/player/volume?volume_percent=${Math.round(t)}`,
    i
  );
}
async function ot(s, e, t) {
  const i = v(s, e);
  await _(
    "PUT",
    `/me/player/seek?position_ms=${Math.round(t)}`,
    i
  );
}
var nt = Object.defineProperty, at = Object.getOwnPropertyDescriptor, w = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? at(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && nt(e, t, r), r;
};
let b = class extends P {
  constructor() {
    super(...arguments), this.hass = null, this.spotifyEntity = "", this.playbackState = null, this.devices = [], this.selectedDeviceId = "", this._heartActive = !1, this._seekDragging = !1, this._seekValue = 0;
  }
  _formatMs(s) {
    const e = Math.floor(s / 1e3), t = Math.floor(e / 60), i = e % 60;
    return `${t}:${i.toString().padStart(2, "0")}`;
  }
  async _onPlayPause() {
    var s;
    if (this.hass)
      try {
        (s = this.playbackState) != null && s.is_playing ? await tt(this.hass, this.spotifyEntity) : await se(this.hass, this.spotifyEntity, {
          device_id: this.selectedDeviceId || void 0
        }), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  async _onNext() {
    if (this.hass)
      try {
        await st(this.hass, this.spotifyEntity), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  async _onPrevious() {
    if (this.hass)
      try {
        await it(this.hass, this.spotifyEntity), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  _onSeekInput(s) {
    this._seekDragging = !0, this._seekValue = Number(s.target.value);
  }
  async _onSeekChange(s) {
    var t;
    if (this._seekDragging = !1, !this.hass || !((t = this.playbackState) != null && t.item)) return;
    const e = Number(s.target.value);
    try {
      await ot(this.hass, this.spotifyEntity, e), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
    } catch {
    }
  }
  async _onVolumeChange(s) {
    if (!this.hass) return;
    const e = Number(s.target.value);
    try {
      await rt(this.hass, this.spotifyEntity, e);
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
    var a, p, u, d;
    const s = this.playbackState, e = (s == null ? void 0 : s.item) ?? null, t = (s == null ? void 0 : s.is_playing) ?? !1, i = !this._seekDragging && (s == null ? void 0 : s.progress_ms) != null ? s.progress_ms : this._seekDragging ? this._seekValue : 0, r = (e == null ? void 0 : e.duration_ms) ?? 0, o = r > 0 ? i / r * 100 : 0, n = ((a = s == null ? void 0 : s.device) == null ? void 0 : a.volume_percent) ?? 50, c = ((d = (u = (p = e == null ? void 0 : e.album) == null ? void 0 : p.images) == null ? void 0 : u[0]) == null ? void 0 : d.url) ?? null;
    return l`
      <div class="album-art">
        ${c ? l`<img src=${c} alt="Album art" />` : l`<div class="album-art-placeholder">🎵</div>`}
      </div>

      ${e ? l`
            <div class="track-info">
              <p class="track-name">${e.name}</p>
              <p class="track-artist">${e.artists.map((g) => g.name).join(", ")}</p>
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
          ` : l`<div class="no-track">No active Spotify session</div>`}

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
          .value=${String(n)}
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
b.styles = Z`
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
w([
  x({ attribute: !1 })
], b.prototype, "hass", 2);
w([
  x({ type: String })
], b.prototype, "spotifyEntity", 2);
w([
  x({ attribute: !1 })
], b.prototype, "playbackState", 2);
w([
  x({ attribute: !1 })
], b.prototype, "devices", 2);
w([
  x({ type: String })
], b.prototype, "selectedDeviceId", 2);
w([
  f()
], b.prototype, "_heartActive", 2);
w([
  f()
], b.prototype, "_seekDragging", 2);
w([
  f()
], b.prototype, "_seekValue", 2);
b = w([
  J("spotify-now-playing")
], b);
var ct = Object.defineProperty, lt = Object.getOwnPropertyDescriptor, m = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? lt(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && ct(e, t, r), r;
};
let y = class extends P {
  constructor() {
    super(...arguments), this.hass = null, this.spotifyEntity = "", this.selectedDeviceId = "", this._activeTab = "playlists", this._playlists = [], this._recentTracks = [], this._topTracks = [], this._searchResults = {
      tracks: [],
      playlists: []
    }, this._searchQuery = "", this._loading = !1, this._error = "", this._searchDebounceTimer = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadTab(this._activeTab);
  }
  async _loadTab(s) {
    if (!(!this.hass || !this.spotifyEntity || s === "search")) {
      this._loading = !0, this._error = "";
      try {
        if (s === "playlists") {
          const e = await Je(this.hass, this.spotifyEntity);
          this._playlists = e.items;
        } else if (s === "recently-played") {
          const e = await Ye(this.hass, this.spotifyEntity);
          this._recentTracks = e.items.map((t) => t.track);
        } else if (s === "top-tracks") {
          const e = await Ke(this.hass, this.spotifyEntity);
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
    if (!(!this.hass || !this.spotifyEntity)) {
      this._loading = !0, this._error = "";
      try {
        const i = await Xe(this.hass, this.spotifyEntity, s);
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
    if (this.hass)
      try {
        await se(this.hass, this.spotifyEntity, {
          context_uri: s.uri,
          device_id: this.selectedDeviceId || void 0
        }), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  async _playTrack(s) {
    if (this.hass)
      try {
        await se(this.hass, this.spotifyEntity, {
          uris: [s.uri],
          device_id: this.selectedDeviceId || void 0
        }), this.dispatchEvent(new CustomEvent("playback-changed", { bubbles: !0, composed: !0 }));
      } catch {
      }
  }
  _renderThumb(s, e) {
    var i;
    const t = (i = s == null ? void 0 : s[0]) == null ? void 0 : i.url;
    return t ? l`<img class="item-thumb" src=${t} alt="" />` : l`<div class="item-thumb-placeholder">${e}</div>`;
  }
  _renderPlaylists() {
    return this._loading ? this._renderLoading() : this._error ? l`<div class="error">${this._error}</div>` : this._playlists.length ? this._playlists.map(
      (s) => l`
        <div class="item" @click=${() => this._playPlaylist(s)}>
          ${this._renderThumb(s.images, "🎵")}
          <div class="item-info">
            <div class="item-name">${s.name}</div>
            <div class="item-sub">${s.tracks.total} tracks · ${s.owner.display_name}</div>
          </div>
        </div>
      `
    ) : l`<div class="empty">No playlists found</div>`;
  }
  _renderRecentlyPlayed() {
    return this._loading ? this._renderLoading() : this._error ? l`<div class="error">${this._error}</div>` : this._recentTracks.length ? this._recentTracks.map(
      (s) => l`
        <div class="item" @click=${() => this._playTrack(s)}>
          ${this._renderThumb(s.album.images, "🎵")}
          <div class="item-info">
            <div class="item-name">${s.name}</div>
            <div class="item-sub">${s.artists.map((e) => e.name).join(", ")}</div>
          </div>
        </div>
      `
    ) : l`<div class="empty">No recent tracks</div>`;
  }
  _renderTopTracks() {
    return this._loading ? this._renderLoading() : this._error ? l`<div class="error">${this._error}</div>` : this._topTracks.length ? this._topTracks.map(
      (s) => l`
        <div class="item" @click=${() => this._playTrack(s)}>
          ${this._renderThumb(s.album.images, "🎵")}
          <div class="item-info">
            <div class="item-name">${s.name}</div>
            <div class="item-sub">${s.artists.map((e) => e.name).join(", ")}</div>
          </div>
        </div>
      `
    ) : l`<div class="empty">No top tracks found</div>`;
  }
  _renderSearch() {
    const s = this._searchResults.tracks.length > 0 || this._searchResults.playlists.length > 0;
    return l`
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
      ${this._error ? l`<div class="error">${this._error}</div>` : h}
      ${!this._loading && this._searchQuery && !s ? l`<div class="empty">No results for "${this._searchQuery}"</div>` : h}
      ${this._searchResults.tracks.length ? l`
            <div class="search-section-label">Tracks</div>
            ${this._searchResults.tracks.map(
      (e) => l`
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
      ${this._searchResults.playlists.length ? l`
            <div class="search-section-label">Playlists</div>
            ${this._searchResults.playlists.map(
      (e) => l`
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
    return l`
      <div class="loading">
        <div class="spinner"></div>
        Loading…
      </div>
    `;
  }
  render() {
    return l`
      <div class="tab-bar">
        ${[
      { id: "playlists", label: "Playlists" },
      { id: "recently-played", label: "Recent" },
      { id: "top-tracks", label: "Top Tracks" },
      { id: "search", label: "Search" }
    ].map(
      (e) => l`
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
y.styles = Z`
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
m([
  x({ attribute: !1 })
], y.prototype, "hass", 2);
m([
  x({ type: String })
], y.prototype, "spotifyEntity", 2);
m([
  x({ type: String })
], y.prototype, "selectedDeviceId", 2);
m([
  f()
], y.prototype, "_activeTab", 2);
m([
  f()
], y.prototype, "_playlists", 2);
m([
  f()
], y.prototype, "_recentTracks", 2);
m([
  f()
], y.prototype, "_topTracks", 2);
m([
  f()
], y.prototype, "_searchResults", 2);
m([
  f()
], y.prototype, "_searchQuery", 2);
m([
  f()
], y.prototype, "_loading", 2);
m([
  f()
], y.prototype, "_error", 2);
y = m([
  J("spotify-browse-panel")
], y);
var ht = Object.defineProperty, dt = Object.getOwnPropertyDescriptor, ce = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? dt(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && ht(e, t, r), r;
};
let B = class extends P {
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
    return !this.devices || this.devices.length === 0 ? l`<div class="no-devices">No devices available</div>` : l`
      <div class="device-picker">
        <span class="device-icon">🔊</span>
        <select @change=${this._onChange} .value=${this.selectedDeviceId}>
          ${this.devices.map(
      (s) => l`
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
B.styles = Z`
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
ce([
  x({ attribute: !1 })
], B.prototype, "devices", 2);
ce([
  x({ type: String })
], B.prototype, "selectedDeviceId", 2);
B = ce([
  J("spotify-device-picker")
], B);
var pt = Object.defineProperty, ut = Object.getOwnPropertyDescriptor, k = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? ut(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && pt(e, t, r), r;
};
let $ = class extends P {
  constructor() {
    super(...arguments), this._config = null, this._hass = null, this._playbackState = null, this._devices = [], this._selectedDeviceId = "", this._activeTab = "now-playing", this._error = "", this._loading = !1, this._pollInterval = null;
  }
  setConfig(s) {
    if (!s.spotify_entity)
      throw new Error("spotify_entity is required in card config");
    this._config = s;
    const e = s.height ?? 500;
    this.style.setProperty("--spotify-card-height", `${e}px`), s.default_device && (this._selectedDeviceId = s.default_device);
  }
  set hass(s) {
    this._hass = s;
  }
  static getConfigElement() {
    const s = document.createElement("div");
    return s.innerHTML = '<p style="padding:8px;font-size:13px;">Edit config YAML directly. Required: <code>spotify_entity</code></p>', s;
  }
  static getStubConfig() {
    return { spotify_entity: "media_player.spotify" };
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
    if (!(!this._hass || !this._config))
      try {
        this._error = "";
        const [s, e] = await Promise.all([
          Fe(this._hass, this._config.spotify_entity),
          et(this._hass, this._config.spotify_entity)
        ]);
        if (this._playbackState = s, this._devices = e.devices, !this._selectedDeviceId) {
          const t = e.devices.find((i) => i.is_active);
          t ? this._selectedDeviceId = t.id : e.devices.length > 0 && (this._selectedDeviceId = e.devices[0].id);
        }
      } catch (s) {
        s instanceof te ? this._error = s.message : s instanceof ae && (s.status === 401 ? this._error = "Spotify token expired. HA should refresh it shortly." : this._error = `Spotify API error: ${s.message}`);
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
    return l`
      <ha-card style="height: ${s}px; overflow: hidden;">
        <div class="card-content">
          ${this._error ? l`
                <div class="error-state">
                  <span class="error-icon">⚠️</span>
                  <span class="error-msg">${this._error}</span>
                </div>
              ` : l`
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
                  ${this._activeTab === "now-playing" ? l`
                        <spotify-now-playing
                          .hass=${this._hass}
                          .spotifyEntity=${this._config.spotify_entity}
                          .playbackState=${this._playbackState}
                          .devices=${this._devices}
                          .selectedDeviceId=${this._selectedDeviceId}
                          @device-selected=${this._onDeviceSelected}
                          @playback-changed=${this._onPlaybackChanged}
                        ></spotify-now-playing>
                      ` : l`
                        <spotify-browse-panel
                          .hass=${this._hass}
                          .spotifyEntity=${this._config.spotify_entity}
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
$.styles = Z`
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
k([
  f()
], $.prototype, "_config", 2);
k([
  f()
], $.prototype, "_hass", 2);
k([
  f()
], $.prototype, "_playbackState", 2);
k([
  f()
], $.prototype, "_devices", 2);
k([
  f()
], $.prototype, "_selectedDeviceId", 2);
k([
  f()
], $.prototype, "_activeTab", 2);
k([
  f()
], $.prototype, "_error", 2);
k([
  f()
], $.prototype, "_loading", 2);
$ = k([
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
