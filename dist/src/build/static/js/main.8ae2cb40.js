"use strict";
/*! For license information please see main.8ae2cb40.js.LICENSE.txt */
(() => { var e = { 730(e, t, n) {
        "use strict";
        var r = n(43), i = n(853);
        function a(e) { for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++)
            t += "&args[]=" + encodeURIComponent(arguments[n]); return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."; }
        var o = new Set, s = {};
        function l(e, t) { c(e, t), c(e + "Capture", t); }
        function c(e, t) { for (s[e] = t, e = 0; e < t.length; e++)
            o.add(t[e]); }
        var d = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), u = Object.prototype.hasOwnProperty, p = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, h = {}, f = {};
        function g(e, t, n, r, i, a, o) { this.acceptsBooleans = 2 === t || 3 === t || 4 === t, this.attributeName = r, this.attributeNamespace = i, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = a, this.removeEmptyString = o; }
        var m = {};
        "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (e) { m[e] = new g(e, 0, !1, e, null, !1, !1); }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (e) { var t = e[0]; m[t] = new g(t, 1, !1, e[1], null, !1, !1); }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) { m[e] = new g(e, 2, !1, e.toLowerCase(), null, !1, !1); }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) { m[e] = new g(e, 2, !1, e, null, !1, !1); }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (e) { m[e] = new g(e, 3, !1, e.toLowerCase(), null, !1, !1); }), ["checked", "multiple", "muted", "selected"].forEach(function (e) { m[e] = new g(e, 3, !0, e, null, !1, !1); }), ["capture", "download"].forEach(function (e) { m[e] = new g(e, 4, !1, e, null, !1, !1); }), ["cols", "rows", "size", "span"].forEach(function (e) { m[e] = new g(e, 6, !1, e, null, !1, !1); }), ["rowSpan", "start"].forEach(function (e) { m[e] = new g(e, 5, !1, e.toLowerCase(), null, !1, !1); });
        var x = /[\-:]([a-z])/g;
        function b(e) { return e[1].toUpperCase(); }
        function y(e, t, n, r) { var i = m.hasOwnProperty(t) ? m[t] : null; (null !== i ? 0 !== i.type : r || !(2 < t.length) || "o" !== t[0] && "O" !== t[0] || "n" !== t[1] && "N" !== t[1]) && (function (e, t, n, r) { if (null === t || "undefined" === typeof t || function (e, t, n, r) { if (null !== n && 0 === n.type)
            return !1; switch (typeof t) {
            case "function":
            case "symbol": return !0;
            case "boolean": return !r && (null !== n ? !n.acceptsBooleans : "data-" !== (e = e.toLowerCase().slice(0, 5)) && "aria-" !== e);
            default: return !1;
        } }(e, t, n, r))
            return !0; if (r)
            return !1; if (null !== n)
            switch (n.type) {
                case 3: return !t;
                case 4: return !1 === t;
                case 5: return isNaN(t);
                case 6: return isNaN(t) || 1 > t;
            } return !1; }(t, n, i, r) && (n = null), r || null === i ? function (e) { return !!u.call(f, e) || !u.call(h, e) && (p.test(e) ? f[e] = !0 : (h[e] = !0, !1)); }(t) && (null === n ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : i.mustUseProperty ? e[i.propertyName] = null === n ? 3 !== i.type && "" : n : (t = i.attributeName, r = i.attributeNamespace, null === n ? e.removeAttribute(t) : (n = 3 === (i = i.type) || 4 === i && !0 === n ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n)))); }
        "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (e) { var t = e.replace(x, b); m[t] = new g(t, 1, !1, e, null, !1, !1); }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (e) { var t = e.replace(x, b); m[t] = new g(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1); }), ["xml:base", "xml:lang", "xml:space"].forEach(function (e) { var t = e.replace(x, b); m[t] = new g(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1); }), ["tabIndex", "crossOrigin"].forEach(function (e) { m[e] = new g(e, 1, !1, e.toLowerCase(), null, !1, !1); }), m.xlinkHref = new g("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function (e) { m[e] = new g(e, 1, !1, e.toLowerCase(), null, !0, !0); });
        var v = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, w = Symbol.for("react.element"), j = Symbol.for("react.portal"), k = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), C = Symbol.for("react.provider"), T = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), E = Symbol.for("react.suspense"), R = Symbol.for("react.suspense_list"), P = Symbol.for("react.memo"), L = Symbol.for("react.lazy");
        Symbol.for("react.scope"), Symbol.for("react.debug_trace_mode");
        var O = Symbol.for("react.offscreen");
        Symbol.for("react.legacy_hidden"), Symbol.for("react.cache"), Symbol.for("react.tracing_marker");
        var z = Symbol.iterator;
        function B(e) { return null === e || "object" !== typeof e ? null : "function" === typeof (e = z && e[z] || e["@@iterator"]) ? e : null; }
        var D, F = Object.assign;
        function M(e) { if (void 0 === D)
            try {
                throw Error();
            }
            catch (n) {
                var t = n.stack.trim().match(/\n( *(at )?)/);
                D = t && t[1] || "";
            } return "\n" + D + e; }
        var I = !1;
        function U(e, t) { if (!e || I)
            return ""; I = !0; var n = Error.prepareStackTrace; Error.prepareStackTrace = void 0; try {
            if (t)
                if (t = function () { throw Error(); }, Object.defineProperty(t.prototype, "props", { set: function () { throw Error(); } }), "object" === typeof Reflect && Reflect.construct) {
                    try {
                        Reflect.construct(t, []);
                    }
                    catch (c) {
                        var r = c;
                    }
                    Reflect.construct(e, [], t);
                }
                else {
                    try {
                        t.call();
                    }
                    catch (c) {
                        r = c;
                    }
                    e.call(t.prototype);
                }
            else {
                try {
                    throw Error();
                }
                catch (c) {
                    r = c;
                }
                e();
            }
        }
        catch (c) {
            if (c && r && "string" === typeof c.stack) {
                for (var i = c.stack.split("\n"), a = r.stack.split("\n"), o = i.length - 1, s = a.length - 1; 1 <= o && 0 <= s && i[o] !== a[s];)
                    s--;
                for (; 1 <= o && 0 <= s; o--, s--)
                    if (i[o] !== a[s]) {
                        if (1 !== o || 1 !== s)
                            do {
                                if (o--, 0 > --s || i[o] !== a[s]) {
                                    var l = "\n" + i[o].replace(" at new ", " at ");
                                    return e.displayName && l.includes("<anonymous>") && (l = l.replace("<anonymous>", e.displayName)), l;
                                }
                            } while (1 <= o && 0 <= s);
                        break;
                    }
            }
        }
        finally {
            I = !1, Error.prepareStackTrace = n;
        } return (e = e ? e.displayName || e.name : "") ? M(e) : ""; }
        function _(e) { switch (e.tag) {
            case 5: return M(e.type);
            case 16: return M("Lazy");
            case 13: return M("Suspense");
            case 19: return M("SuspenseList");
            case 0:
            case 2:
            case 15: return e = U(e.type, !1);
            case 11: return e = U(e.type.render, !1);
            case 1: return e = U(e.type, !0);
            default: return "";
        } }
        function W(e) { if (null == e)
            return null; if ("function" === typeof e)
            return e.displayName || e.name || null; if ("string" === typeof e)
            return e; switch (e) {
            case k: return "Fragment";
            case j: return "Portal";
            case N: return "Profiler";
            case S: return "StrictMode";
            case E: return "Suspense";
            case R: return "SuspenseList";
        } if ("object" === typeof e)
            switch (e.$$typeof) {
                case T: return (e.displayName || "Context") + ".Consumer";
                case C: return (e._context.displayName || "Context") + ".Provider";
                case A:
                    var t = e.render;
                    return (e = e.displayName) || (e = "" !== (e = t.displayName || t.name || "") ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
                case P: return null !== (t = e.displayName || null) ? t : W(e.type) || "Memo";
                case L:
                    t = e._payload, e = e._init;
                    try {
                        return W(e(t));
                    }
                    catch (n) { }
            } return null; }
        function H(e) { var t = e.type; switch (e.tag) {
            case 24: return "Cache";
            case 9: return (t.displayName || "Context") + ".Consumer";
            case 10: return (t._context.displayName || "Context") + ".Provider";
            case 18: return "DehydratedFragment";
            case 11: return e = (e = t.render).displayName || e.name || "", t.displayName || ("" !== e ? "ForwardRef(" + e + ")" : "ForwardRef");
            case 7: return "Fragment";
            case 5: return t;
            case 4: return "Portal";
            case 3: return "Root";
            case 6: return "Text";
            case 16: return W(t);
            case 8: return t === S ? "StrictMode" : "Mode";
            case 22: return "Offscreen";
            case 12: return "Profiler";
            case 21: return "Scope";
            case 13: return "Suspense";
            case 19: return "SuspenseList";
            case 25: return "TracingMarker";
            case 1:
            case 0:
            case 17:
            case 2:
            case 14:
            case 15:
                if ("function" === typeof t)
                    return t.displayName || t.name || null;
                if ("string" === typeof t)
                    return t;
        } return null; }
        function V(e) { switch (typeof e) {
            case "boolean":
            case "number":
            case "string":
            case "undefined":
            case "object": return e;
            default: return "";
        } }
        function q(e) { var t = e.type; return (e = e.nodeName) && "input" === e.toLowerCase() && ("checkbox" === t || "radio" === t); }
        function K(e) { e._valueTracker || (e._valueTracker = function (e) { var t = q(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t]; if (!e.hasOwnProperty(t) && "undefined" !== typeof n && "function" === typeof n.get && "function" === typeof n.set) {
            var i = n.get, a = n.set;
            return Object.defineProperty(e, t, { configurable: !0, get: function () { return i.call(this); }, set: function (e) { r = "" + e, a.call(this, e); } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function () { return r; }, setValue: function (e) { r = "" + e; }, stopTracking: function () { e._valueTracker = null, delete e[t]; } };
        } }(e)); }
        function G(e) { if (!e)
            return !1; var t = e._valueTracker; if (!t)
            return !0; var n = t.getValue(), r = ""; return e && (r = q(e) ? e.checked ? "true" : "false" : e.value), (e = r) !== n && (t.setValue(e), !0); }
        function Y(e) { if ("undefined" === typeof (e = e || ("undefined" !== typeof document ? document : void 0)))
            return null; try {
            return e.activeElement || e.body;
        }
        catch (t) {
            return e.body;
        } }
        function X(e, t) { var n = t.checked; return F({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != n ? n : e._wrapperState.initialChecked }); }
        function J(e, t) { var n = null == t.defaultValue ? "" : t.defaultValue, r = null != t.checked ? t.checked : t.defaultChecked; n = V(null != t.value ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: "checkbox" === t.type || "radio" === t.type ? null != t.checked : null != t.value }; }
        function Q(e, t) { null != (t = t.checked) && y(e, "checked", t, !1); }
        function Z(e, t) { Q(e, t); var n = V(t.value), r = t.type; if (null != n)
            "number" === r ? (0 === n && "" === e.value || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
        else if ("submit" === r || "reset" === r)
            return void e.removeAttribute("value"); t.hasOwnProperty("value") ? ee(e, t.type, n) : t.hasOwnProperty("defaultValue") && ee(e, t.type, V(t.defaultValue)), null == t.checked && null != t.defaultChecked && (e.defaultChecked = !!t.defaultChecked); }
        function $(e, t, n) { if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
            var r = t.type;
            if (!("submit" !== r && "reset" !== r || void 0 !== t.value && null !== t.value))
                return;
            t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
        } "" !== (n = e.name) && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, "" !== n && (e.name = n); }
        function ee(e, t, n) { "number" === t && Y(e.ownerDocument) === e || (null == n ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n)); }
        var te = Array.isArray;
        function ne(e, t, n, r) { if (e = e.options, t) {
            t = {};
            for (var i = 0; i < n.length; i++)
                t["$" + n[i]] = !0;
            for (n = 0; n < e.length; n++)
                i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
        }
        else {
            for (n = "" + V(n), t = null, i = 0; i < e.length; i++) {
                if (e[i].value === n)
                    return e[i].selected = !0, void (r && (e[i].defaultSelected = !0));
                null !== t || e[i].disabled || (t = e[i]);
            }
            null !== t && (t.selected = !0);
        } }
        function re(e, t) { if (null != t.dangerouslySetInnerHTML)
            throw Error(a(91)); return F({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue }); }
        function ie(e, t) { var n = t.value; if (null == n) {
            if (n = t.children, t = t.defaultValue, null != n) {
                if (null != t)
                    throw Error(a(92));
                if (te(n)) {
                    if (1 < n.length)
                        throw Error(a(93));
                    n = n[0];
                }
                t = n;
            }
            null == t && (t = ""), n = t;
        } e._wrapperState = { initialValue: V(n) }; }
        function ae(e, t) { var n = V(t.value), r = V(t.defaultValue); null != n && ((n = "" + n) !== e.value && (e.value = n), null == t.defaultValue && e.defaultValue !== n && (e.defaultValue = n)), null != r && (e.defaultValue = "" + r); }
        function oe(e) { var t = e.textContent; t === e._wrapperState.initialValue && "" !== t && null !== t && (e.value = t); }
        function se(e) { switch (e) {
            case "svg": return "http://www.w3.org/2000/svg";
            case "math": return "http://www.w3.org/1998/Math/MathML";
            default: return "http://www.w3.org/1999/xhtml";
        } }
        function le(e, t) { return null == e || "http://www.w3.org/1999/xhtml" === e ? se(t) : "http://www.w3.org/2000/svg" === e && "foreignObject" === t ? "http://www.w3.org/1999/xhtml" : e; }
        var ce, de, ue = (de = function (e, t) { if ("http://www.w3.org/2000/svg" !== e.namespaceURI || "innerHTML" in e)
            e.innerHTML = t;
        else {
            for ((ce = ce || document.createElement("div")).innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = ce.firstChild; e.firstChild;)
                e.removeChild(e.firstChild);
            for (; t.firstChild;)
                e.appendChild(t.firstChild);
        } }, "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function (e, t, n, r) { MSApp.execUnsafeLocalFunction(function () { return de(e, t); }); } : de);
        function pe(e, t) { if (t) {
            var n = e.firstChild;
            if (n && n === e.lastChild && 3 === n.nodeType)
                return void (n.nodeValue = t);
        } e.textContent = t; }
        var he = { animationIterationCount: !0, aspectRatio: !0, borderImageOutset: !0, borderImageSlice: !0, borderImageWidth: !0, boxFlex: !0, boxFlexGroup: !0, boxOrdinalGroup: !0, columnCount: !0, columns: !0, flex: !0, flexGrow: !0, flexPositive: !0, flexShrink: !0, flexNegative: !0, flexOrder: !0, gridArea: !0, gridRow: !0, gridRowEnd: !0, gridRowSpan: !0, gridRowStart: !0, gridColumn: !0, gridColumnEnd: !0, gridColumnSpan: !0, gridColumnStart: !0, fontWeight: !0, lineClamp: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, tabSize: !0, widows: !0, zIndex: !0, zoom: !0, fillOpacity: !0, floodOpacity: !0, stopOpacity: !0, strokeDasharray: !0, strokeDashoffset: !0, strokeMiterlimit: !0, strokeOpacity: !0, strokeWidth: !0 }, fe = ["Webkit", "ms", "Moz", "O"];
        function ge(e, t, n) { return null == t || "boolean" === typeof t || "" === t ? "" : n || "number" !== typeof t || 0 === t || he.hasOwnProperty(e) && he[e] ? ("" + t).trim() : t + "px"; }
        function me(e, t) { for (var n in e = e.style, t)
            if (t.hasOwnProperty(n)) {
                var r = 0 === n.indexOf("--"), i = ge(n, t[n], r);
                "float" === n && (n = "cssFloat"), r ? e.setProperty(n, i) : e[n] = i;
            } }
        Object.keys(he).forEach(function (e) { fe.forEach(function (t) { t = t + e.charAt(0).toUpperCase() + e.substring(1), he[t] = he[e]; }); });
        var xe = F({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
        function be(e, t) { if (t) {
            if (xe[e] && (null != t.children || null != t.dangerouslySetInnerHTML))
                throw Error(a(137, e));
            if (null != t.dangerouslySetInnerHTML) {
                if (null != t.children)
                    throw Error(a(60));
                if ("object" !== typeof t.dangerouslySetInnerHTML || !("__html" in t.dangerouslySetInnerHTML))
                    throw Error(a(61));
            }
            if (null != t.style && "object" !== typeof t.style)
                throw Error(a(62));
        } }
        function ye(e, t) { if (-1 === e.indexOf("-"))
            return "string" === typeof t.is; switch (e) {
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph": return !1;
            default: return !0;
        } }
        var ve = null;
        function we(e) { return (e = e.target || e.srcElement || window).correspondingUseElement && (e = e.correspondingUseElement), 3 === e.nodeType ? e.parentNode : e; }
        var je = null, ke = null, Se = null;
        function Ne(e) { if (e = yi(e)) {
            if ("function" !== typeof je)
                throw Error(a(280));
            var t = e.stateNode;
            t && (t = wi(t), je(e.stateNode, e.type, t));
        } }
        function Ce(e) { ke ? Se ? Se.push(e) : Se = [e] : ke = e; }
        function Te() { if (ke) {
            var e = ke, t = Se;
            if (Se = ke = null, Ne(e), t)
                for (e = 0; e < t.length; e++)
                    Ne(t[e]);
        } }
        function Ae(e, t) { return e(t); }
        function Ee() { }
        var Re = !1;
        function Pe(e, t, n) { if (Re)
            return e(t, n); Re = !0; try {
            return Ae(e, t, n);
        }
        finally {
            Re = !1, (null !== ke || null !== Se) && (Ee(), Te());
        } }
        function Le(e, t) { var n = e.stateNode; if (null === n)
            return null; var r = wi(n); if (null === r)
            return null; n = r[t]; e: switch (t) {
            case "onClick":
            case "onClickCapture":
            case "onDoubleClick":
            case "onDoubleClickCapture":
            case "onMouseDown":
            case "onMouseDownCapture":
            case "onMouseMove":
            case "onMouseMoveCapture":
            case "onMouseUp":
            case "onMouseUpCapture":
            case "onMouseEnter":
                (r = !r.disabled) || (r = !("button" === (e = e.type) || "input" === e || "select" === e || "textarea" === e)), e = !r;
                break e;
            default: e = !1;
        } if (e)
            return null; if (n && "function" !== typeof n)
            throw Error(a(231, t, typeof n)); return n; }
        var Oe = !1;
        if (d)
            try {
                var ze = {};
                Object.defineProperty(ze, "passive", { get: function () { Oe = !0; } }), window.addEventListener("test", ze, ze), window.removeEventListener("test", ze, ze);
            }
            catch (de) {
                Oe = !1;
            }
        function Be(e, t, n, r, i, a, o, s, l) { var c = Array.prototype.slice.call(arguments, 3); try {
            t.apply(n, c);
        }
        catch (d) {
            this.onError(d);
        } }
        var De = !1, Fe = null, Me = !1, Ie = null, Ue = { onError: function (e) { De = !0, Fe = e; } };
        function _e(e, t, n, r, i, a, o, s, l) { De = !1, Fe = null, Be.apply(Ue, arguments); }
        function We(e) { var t = e, n = e; if (e.alternate)
            for (; t.return;)
                t = t.return;
        else {
            e = t;
            do {
                0 !== (4098 & (t = e).flags) && (n = t.return), e = t.return;
            } while (e);
        } return 3 === t.tag ? n : null; }
        function He(e) { if (13 === e.tag) {
            var t = e.memoizedState;
            if (null === t && (null !== (e = e.alternate) && (t = e.memoizedState)), null !== t)
                return t.dehydrated;
        } return null; }
        function Ve(e) { if (We(e) !== e)
            throw Error(a(188)); }
        function qe(e) { return null !== (e = function (e) { var t = e.alternate; if (!t) {
            if (null === (t = We(e)))
                throw Error(a(188));
            return t !== e ? null : e;
        } for (var n = e, r = t;;) {
            var i = n.return;
            if (null === i)
                break;
            var o = i.alternate;
            if (null === o) {
                if (null !== (r = i.return)) {
                    n = r;
                    continue;
                }
                break;
            }
            if (i.child === o.child) {
                for (o = i.child; o;) {
                    if (o === n)
                        return Ve(i), e;
                    if (o === r)
                        return Ve(i), t;
                    o = o.sibling;
                }
                throw Error(a(188));
            }
            if (n.return !== r.return)
                n = i, r = o;
            else {
                for (var s = !1, l = i.child; l;) {
                    if (l === n) {
                        s = !0, n = i, r = o;
                        break;
                    }
                    if (l === r) {
                        s = !0, r = i, n = o;
                        break;
                    }
                    l = l.sibling;
                }
                if (!s) {
                    for (l = o.child; l;) {
                        if (l === n) {
                            s = !0, n = o, r = i;
                            break;
                        }
                        if (l === r) {
                            s = !0, r = o, n = i;
                            break;
                        }
                        l = l.sibling;
                    }
                    if (!s)
                        throw Error(a(189));
                }
            }
            if (n.alternate !== r)
                throw Error(a(190));
        } if (3 !== n.tag)
            throw Error(a(188)); return n.stateNode.current === n ? e : t; }(e)) ? Ke(e) : null; }
        function Ke(e) { if (5 === e.tag || 6 === e.tag)
            return e; for (e = e.child; null !== e;) {
            var t = Ke(e);
            if (null !== t)
                return t;
            e = e.sibling;
        } return null; }
        var Ge = i.unstable_scheduleCallback, Ye = i.unstable_cancelCallback, Xe = i.unstable_shouldYield, Je = i.unstable_requestPaint, Qe = i.unstable_now, Ze = i.unstable_getCurrentPriorityLevel, $e = i.unstable_ImmediatePriority, et = i.unstable_UserBlockingPriority, tt = i.unstable_NormalPriority, nt = i.unstable_LowPriority, rt = i.unstable_IdlePriority, it = null, at = null;
        var ot = Math.clz32 ? Math.clz32 : function (e) { return e >>>= 0, 0 === e ? 32 : 31 - (st(e) / lt | 0) | 0; }, st = Math.log, lt = Math.LN2;
        var ct = 64, dt = 4194304;
        function ut(e) { switch (e & -e) {
            case 1: return 1;
            case 2: return 2;
            case 4: return 4;
            case 8: return 8;
            case 16: return 16;
            case 32: return 32;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152: return 4194240 & e;
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864: return 130023424 & e;
            case 134217728: return 134217728;
            case 268435456: return 268435456;
            case 536870912: return 536870912;
            case 1073741824: return 1073741824;
            default: return e;
        } }
        function pt(e, t) { var n = e.pendingLanes; if (0 === n)
            return 0; var r = 0, i = e.suspendedLanes, a = e.pingedLanes, o = 268435455 & n; if (0 !== o) {
            var s = o & ~i;
            0 !== s ? r = ut(s) : 0 !== (a &= o) && (r = ut(a));
        }
        else
            0 !== (o = n & ~i) ? r = ut(o) : 0 !== a && (r = ut(a)); if (0 === r)
            return 0; if (0 !== t && t !== r && 0 === (t & i) && ((i = r & -r) >= (a = t & -t) || 16 === i && 0 !== (4194240 & a)))
            return t; if (0 !== (4 & r) && (r |= 16 & n), 0 !== (t = e.entangledLanes))
            for (e = e.entanglements, t &= r; 0 < t;)
                i = 1 << (n = 31 - ot(t)), r |= e[n], t &= ~i; return r; }
        function ht(e, t) { switch (e) {
            case 1:
            case 2:
            case 4: return t + 250;
            case 8:
            case 16:
            case 32:
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152: return t + 5e3;
            default: return -1;
        } }
        function ft(e) { return 0 !== (e = -1073741825 & e.pendingLanes) ? e : 1073741824 & e ? 1073741824 : 0; }
        function gt() { var e = ct; return 0 === (4194240 & (ct <<= 1)) && (ct = 64), e; }
        function mt(e) { for (var t = [], n = 0; 31 > n; n++)
            t.push(e); return t; }
        function xt(e, t, n) { e.pendingLanes |= t, 536870912 !== t && (e.suspendedLanes = 0, e.pingedLanes = 0), (e = e.eventTimes)[t = 31 - ot(t)] = n; }
        function bt(e, t) { var n = e.entangledLanes |= t; for (e = e.entanglements; n;) {
            var r = 31 - ot(n), i = 1 << r;
            i & t | e[r] & t && (e[r] |= t), n &= ~i;
        } }
        var yt = 0;
        function vt(e) { return 1 < (e &= -e) ? 4 < e ? 0 !== (268435455 & e) ? 16 : 536870912 : 4 : 1; }
        var wt, jt, kt, St, Nt, Ct = !1, Tt = [], At = null, Et = null, Rt = null, Pt = new Map, Lt = new Map, Ot = [], zt = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
        function Bt(e, t) { switch (e) {
            case "focusin":
            case "focusout":
                At = null;
                break;
            case "dragenter":
            case "dragleave":
                Et = null;
                break;
            case "mouseover":
            case "mouseout":
                Rt = null;
                break;
            case "pointerover":
            case "pointerout":
                Pt.delete(t.pointerId);
                break;
            case "gotpointercapture":
            case "lostpointercapture": Lt.delete(t.pointerId);
        } }
        function Dt(e, t, n, r, i, a) { return null === e || e.nativeEvent !== a ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: a, targetContainers: [i] }, null !== t && (null !== (t = yi(t)) && jt(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, null !== i && -1 === t.indexOf(i) && t.push(i), e); }
        function Ft(e) { var t = bi(e.target); if (null !== t) {
            var n = We(t);
            if (null !== n)
                if (13 === (t = n.tag)) {
                    if (null !== (t = He(n)))
                        return e.blockedOn = t, void Nt(e.priority, function () { kt(n); });
                }
                else if (3 === t && n.stateNode.current.memoizedState.isDehydrated)
                    return void (e.blockedOn = 3 === n.tag ? n.stateNode.containerInfo : null);
        } e.blockedOn = null; }
        function Mt(e) { if (null !== e.blockedOn)
            return !1; for (var t = e.targetContainers; 0 < t.length;) {
            var n = Xt(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
            if (null !== n)
                return null !== (t = yi(n)) && jt(t), e.blockedOn = n, !1;
            var r = new (n = e.nativeEvent).constructor(n.type, n);
            ve = r, n.target.dispatchEvent(r), ve = null, t.shift();
        } return !0; }
        function It(e, t, n) { Mt(e) && n.delete(t); }
        function Ut() { Ct = !1, null !== At && Mt(At) && (At = null), null !== Et && Mt(Et) && (Et = null), null !== Rt && Mt(Rt) && (Rt = null), Pt.forEach(It), Lt.forEach(It); }
        function _t(e, t) { e.blockedOn === t && (e.blockedOn = null, Ct || (Ct = !0, i.unstable_scheduleCallback(i.unstable_NormalPriority, Ut))); }
        function Wt(e) { function t(t) { return _t(t, e); } if (0 < Tt.length) {
            _t(Tt[0], e);
            for (var n = 1; n < Tt.length; n++) {
                var r = Tt[n];
                r.blockedOn === e && (r.blockedOn = null);
            }
        } for (null !== At && _t(At, e), null !== Et && _t(Et, e), null !== Rt && _t(Rt, e), Pt.forEach(t), Lt.forEach(t), n = 0; n < Ot.length; n++)
            (r = Ot[n]).blockedOn === e && (r.blockedOn = null); for (; 0 < Ot.length && null === (n = Ot[0]).blockedOn;)
            Ft(n), null === n.blockedOn && Ot.shift(); }
        var Ht = v.ReactCurrentBatchConfig, Vt = !0;
        function qt(e, t, n, r) { var i = yt, a = Ht.transition; Ht.transition = null; try {
            yt = 1, Gt(e, t, n, r);
        }
        finally {
            yt = i, Ht.transition = a;
        } }
        function Kt(e, t, n, r) { var i = yt, a = Ht.transition; Ht.transition = null; try {
            yt = 4, Gt(e, t, n, r);
        }
        finally {
            yt = i, Ht.transition = a;
        } }
        function Gt(e, t, n, r) { if (Vt) {
            var i = Xt(e, t, n, r);
            if (null === i)
                Vr(e, t, r, Yt, n), Bt(e, r);
            else if (function (e, t, n, r, i) { switch (t) {
                case "focusin": return At = Dt(At, e, t, n, r, i), !0;
                case "dragenter": return Et = Dt(Et, e, t, n, r, i), !0;
                case "mouseover": return Rt = Dt(Rt, e, t, n, r, i), !0;
                case "pointerover":
                    var a = i.pointerId;
                    return Pt.set(a, Dt(Pt.get(a) || null, e, t, n, r, i)), !0;
                case "gotpointercapture": return a = i.pointerId, Lt.set(a, Dt(Lt.get(a) || null, e, t, n, r, i)), !0;
            } return !1; }(i, e, t, n, r))
                r.stopPropagation();
            else if (Bt(e, r), 4 & t && -1 < zt.indexOf(e)) {
                for (; null !== i;) {
                    var a = yi(i);
                    if (null !== a && wt(a), null === (a = Xt(e, t, n, r)) && Vr(e, t, r, Yt, n), a === i)
                        break;
                    i = a;
                }
                null !== i && r.stopPropagation();
            }
            else
                Vr(e, t, r, null, n);
        } }
        var Yt = null;
        function Xt(e, t, n, r) { if (Yt = null, null !== (e = bi(e = we(r))))
            if (null === (t = We(e)))
                e = null;
            else if (13 === (n = t.tag)) {
                if (null !== (e = He(t)))
                    return e;
                e = null;
            }
            else if (3 === n) {
                if (t.stateNode.current.memoizedState.isDehydrated)
                    return 3 === t.tag ? t.stateNode.containerInfo : null;
                e = null;
            }
            else
                t !== e && (e = null); return Yt = e, null; }
        function Jt(e) { switch (e) {
            case "cancel":
            case "click":
            case "close":
            case "contextmenu":
            case "copy":
            case "cut":
            case "auxclick":
            case "dblclick":
            case "dragend":
            case "dragstart":
            case "drop":
            case "focusin":
            case "focusout":
            case "input":
            case "invalid":
            case "keydown":
            case "keypress":
            case "keyup":
            case "mousedown":
            case "mouseup":
            case "paste":
            case "pause":
            case "play":
            case "pointercancel":
            case "pointerdown":
            case "pointerup":
            case "ratechange":
            case "reset":
            case "resize":
            case "seeked":
            case "submit":
            case "touchcancel":
            case "touchend":
            case "touchstart":
            case "volumechange":
            case "change":
            case "selectionchange":
            case "textInput":
            case "compositionstart":
            case "compositionend":
            case "compositionupdate":
            case "beforeblur":
            case "afterblur":
            case "beforeinput":
            case "blur":
            case "fullscreenchange":
            case "focus":
            case "hashchange":
            case "popstate":
            case "select":
            case "selectstart": return 1;
            case "drag":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "mousemove":
            case "mouseout":
            case "mouseover":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "scroll":
            case "toggle":
            case "touchmove":
            case "wheel":
            case "mouseenter":
            case "mouseleave":
            case "pointerenter":
            case "pointerleave": return 4;
            case "message": switch (Ze()) {
                case $e: return 1;
                case et: return 4;
                case tt:
                case nt: return 16;
                case rt: return 536870912;
                default: return 16;
            }
            default: return 16;
        } }
        var Qt = null, Zt = null, $t = null;
        function en() { if ($t)
            return $t; var e, t, n = Zt, r = n.length, i = "value" in Qt ? Qt.value : Qt.textContent, a = i.length; for (e = 0; e < r && n[e] === i[e]; e++)
            ; var o = r - e; for (t = 1; t <= o && n[r - t] === i[a - t]; t++)
            ; return $t = i.slice(e, 1 < t ? 1 - t : void 0); }
        function tn(e) { var t = e.keyCode; return "charCode" in e ? 0 === (e = e.charCode) && 13 === t && (e = 13) : e = t, 10 === e && (e = 13), 32 <= e || 13 === e ? e : 0; }
        function nn() { return !0; }
        function rn() { return !1; }
        function an(e) { function t(t, n, r, i, a) { for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e)
            e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]); return this.isDefaultPrevented = (null != i.defaultPrevented ? i.defaultPrevented : !1 === i.returnValue) ? nn : rn, this.isPropagationStopped = rn, this; } return F(t.prototype, { preventDefault: function () { this.defaultPrevented = !0; var e = this.nativeEvent; e && (e.preventDefault ? e.preventDefault() : "unknown" !== typeof e.returnValue && (e.returnValue = !1), this.isDefaultPrevented = nn); }, stopPropagation: function () { var e = this.nativeEvent; e && (e.stopPropagation ? e.stopPropagation() : "unknown" !== typeof e.cancelBubble && (e.cancelBubble = !0), this.isPropagationStopped = nn); }, persist: function () { }, isPersistent: nn }), t; }
        var on, sn, ln, cn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function (e) { return e.timeStamp || Date.now(); }, defaultPrevented: 0, isTrusted: 0 }, dn = an(cn), un = F({}, cn, { view: 0, detail: 0 }), pn = an(un), hn = F({}, un, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Nn, button: 0, buttons: 0, relatedTarget: function (e) { return void 0 === e.relatedTarget ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget; }, movementX: function (e) { return "movementX" in e ? e.movementX : (e !== ln && (ln && "mousemove" === e.type ? (on = e.screenX - ln.screenX, sn = e.screenY - ln.screenY) : sn = on = 0, ln = e), on); }, movementY: function (e) { return "movementY" in e ? e.movementY : sn; } }), fn = an(hn), gn = an(F({}, hn, { dataTransfer: 0 })), mn = an(F({}, un, { relatedTarget: 0 })), xn = an(F({}, cn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 })), bn = F({}, cn, { clipboardData: function (e) { return "clipboardData" in e ? e.clipboardData : window.clipboardData; } }), yn = an(bn), vn = an(F({}, cn, { data: 0 })), wn = { Esc: "Escape", Spacebar: " ", Left: "ArrowLeft", Up: "ArrowUp", Right: "ArrowRight", Down: "ArrowDown", Del: "Delete", Win: "OS", Menu: "ContextMenu", Apps: "ContextMenu", Scroll: "ScrollLock", MozPrintableKey: "Unidentified" }, jn = { 8: "Backspace", 9: "Tab", 12: "Clear", 13: "Enter", 16: "Shift", 17: "Control", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Escape", 32: " ", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 45: "Insert", 46: "Delete", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NumLock", 145: "ScrollLock", 224: "Meta" }, kn = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
        function Sn(e) { var t = this.nativeEvent; return t.getModifierState ? t.getModifierState(e) : !!(e = kn[e]) && !!t[e]; }
        function Nn() { return Sn; }
        var Cn = F({}, un, { key: function (e) { if (e.key) {
                var t = wn[e.key] || e.key;
                if ("Unidentified" !== t)
                    return t;
            } return "keypress" === e.type ? 13 === (e = tn(e)) ? "Enter" : String.fromCharCode(e) : "keydown" === e.type || "keyup" === e.type ? jn[e.keyCode] || "Unidentified" : ""; }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Nn, charCode: function (e) { return "keypress" === e.type ? tn(e) : 0; }, keyCode: function (e) { return "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0; }, which: function (e) { return "keypress" === e.type ? tn(e) : "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0; } }), Tn = an(Cn), An = an(F({}, hn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 })), En = an(F({}, un, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Nn })), Rn = an(F({}, cn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })), Pn = F({}, hn, { deltaX: function (e) { return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0; }, deltaY: function (e) { return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0; }, deltaZ: 0, deltaMode: 0 }), Ln = an(Pn), On = [9, 13, 27, 32], zn = d && "CompositionEvent" in window, Bn = null;
        d && "documentMode" in document && (Bn = document.documentMode);
        var Dn = d && "TextEvent" in window && !Bn, Fn = d && (!zn || Bn && 8 < Bn && 11 >= Bn), Mn = String.fromCharCode(32), In = !1;
        function Un(e, t) { switch (e) {
            case "keyup": return -1 !== On.indexOf(t.keyCode);
            case "keydown": return 229 !== t.keyCode;
            case "keypress":
            case "mousedown":
            case "focusout": return !0;
            default: return !1;
        } }
        function _n(e) { return "object" === typeof (e = e.detail) && "data" in e ? e.data : null; }
        var Wn = !1;
        var Hn = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
        function Vn(e) { var t = e && e.nodeName && e.nodeName.toLowerCase(); return "input" === t ? !!Hn[e.type] : "textarea" === t; }
        function qn(e, t, n, r) { Ce(r), 0 < (t = Kr(t, "onChange")).length && (n = new dn("onChange", "change", null, n, r), e.push({ event: n, listeners: t })); }
        var Kn = null, Gn = null;
        function Yn(e) { Mr(e, 0); }
        function Xn(e) { if (G(vi(e)))
            return e; }
        function Jn(e, t) { if ("change" === e)
            return t; }
        var Qn = !1;
        if (d) {
            var Zn;
            if (d) {
                var $n = "oninput" in document;
                if (!$n) {
                    var er = document.createElement("div");
                    er.setAttribute("oninput", "return;"), $n = "function" === typeof er.oninput;
                }
                Zn = $n;
            }
            else
                Zn = !1;
            Qn = Zn && (!document.documentMode || 9 < document.documentMode);
        }
        function tr() { Kn && (Kn.detachEvent("onpropertychange", nr), Gn = Kn = null); }
        function nr(e) { if ("value" === e.propertyName && Xn(Gn)) {
            var t = [];
            qn(t, Gn, e, we(e)), Pe(Yn, t);
        } }
        function rr(e, t, n) { "focusin" === e ? (tr(), Gn = n, (Kn = t).attachEvent("onpropertychange", nr)) : "focusout" === e && tr(); }
        function ir(e) { if ("selectionchange" === e || "keyup" === e || "keydown" === e)
            return Xn(Gn); }
        function ar(e, t) { if ("click" === e)
            return Xn(t); }
        function or(e, t) { if ("input" === e || "change" === e)
            return Xn(t); }
        var sr = "function" === typeof Object.is ? Object.is : function (e, t) { return e === t && (0 !== e || 1 / e === 1 / t) || e !== e && t !== t; };
        function lr(e, t) { if (sr(e, t))
            return !0; if ("object" !== typeof e || null === e || "object" !== typeof t || null === t)
            return !1; var n = Object.keys(e), r = Object.keys(t); if (n.length !== r.length)
            return !1; for (r = 0; r < n.length; r++) {
            var i = n[r];
            if (!u.call(t, i) || !sr(e[i], t[i]))
                return !1;
        } return !0; }
        function cr(e) { for (; e && e.firstChild;)
            e = e.firstChild; return e; }
        function dr(e, t) { var n, r = cr(e); for (e = 0; r;) {
            if (3 === r.nodeType) {
                if (n = e + r.textContent.length, e <= t && n >= t)
                    return { node: r, offset: t - e };
                e = n;
            }
            e: {
                for (; r;) {
                    if (r.nextSibling) {
                        r = r.nextSibling;
                        break e;
                    }
                    r = r.parentNode;
                }
                r = void 0;
            }
            r = cr(r);
        } }
        function ur(e, t) { return !(!e || !t) && (e === t || (!e || 3 !== e.nodeType) && (t && 3 === t.nodeType ? ur(e, t.parentNode) : "contains" in e ? e.contains(t) : !!e.compareDocumentPosition && !!(16 & e.compareDocumentPosition(t)))); }
        function pr() { for (var e = window, t = Y(); t instanceof e.HTMLIFrameElement;) {
            try {
                var n = "string" === typeof t.contentWindow.location.href;
            }
            catch (r) {
                n = !1;
            }
            if (!n)
                break;
            t = Y((e = t.contentWindow).document);
        } return t; }
        function hr(e) { var t = e && e.nodeName && e.nodeName.toLowerCase(); return t && ("input" === t && ("text" === e.type || "search" === e.type || "tel" === e.type || "url" === e.type || "password" === e.type) || "textarea" === t || "true" === e.contentEditable); }
        function fr(e) { var t = pr(), n = e.focusedElem, r = e.selectionRange; if (t !== n && n && n.ownerDocument && ur(n.ownerDocument.documentElement, n)) {
            if (null !== r && hr(n))
                if (t = r.start, void 0 === (e = r.end) && (e = t), "selectionStart" in n)
                    n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
                else if ((e = (t = n.ownerDocument || document) && t.defaultView || window).getSelection) {
                    e = e.getSelection();
                    var i = n.textContent.length, a = Math.min(r.start, i);
                    r = void 0 === r.end ? a : Math.min(r.end, i), !e.extend && a > r && (i = r, r = a, a = i), i = dr(n, a);
                    var o = dr(n, r);
                    i && o && (1 !== e.rangeCount || e.anchorNode !== i.node || e.anchorOffset !== i.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && ((t = t.createRange()).setStart(i.node, i.offset), e.removeAllRanges(), a > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
                }
            for (t = [], e = n; e = e.parentNode;)
                1 === e.nodeType && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
            for ("function" === typeof n.focus && n.focus(), n = 0; n < t.length; n++)
                (e = t[n]).element.scrollLeft = e.left, e.element.scrollTop = e.top;
        } }
        var gr = d && "documentMode" in document && 11 >= document.documentMode, mr = null, xr = null, br = null, yr = !1;
        function vr(e, t, n) { var r = n.window === n ? n.document : 9 === n.nodeType ? n : n.ownerDocument; yr || null == mr || mr !== Y(r) || ("selectionStart" in (r = mr) && hr(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : r = { anchorNode: (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection()).anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }, br && lr(br, r) || (br = r, 0 < (r = Kr(xr, "onSelect")).length && (t = new dn("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = mr))); }
        function wr(e, t) { var n = {}; return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n; }
        var jr = { animationend: wr("Animation", "AnimationEnd"), animationiteration: wr("Animation", "AnimationIteration"), animationstart: wr("Animation", "AnimationStart"), transitionend: wr("Transition", "TransitionEnd") }, kr = {}, Sr = {};
        function Nr(e) { if (kr[e])
            return kr[e]; if (!jr[e])
            return e; var t, n = jr[e]; for (t in n)
            if (n.hasOwnProperty(t) && t in Sr)
                return kr[e] = n[t]; return e; }
        d && (Sr = document.createElement("div").style, "AnimationEvent" in window || (delete jr.animationend.animation, delete jr.animationiteration.animation, delete jr.animationstart.animation), "TransitionEvent" in window || delete jr.transitionend.transition);
        var Cr = Nr("animationend"), Tr = Nr("animationiteration"), Ar = Nr("animationstart"), Er = Nr("transitionend"), Rr = new Map, Pr = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
        function Lr(e, t) { Rr.set(e, t), l(t, [e]); }
        for (var Or = 0; Or < Pr.length; Or++) {
            var zr = Pr[Or];
            Lr(zr.toLowerCase(), "on" + (zr[0].toUpperCase() + zr.slice(1)));
        }
        Lr(Cr, "onAnimationEnd"), Lr(Tr, "onAnimationIteration"), Lr(Ar, "onAnimationStart"), Lr("dblclick", "onDoubleClick"), Lr("focusin", "onFocus"), Lr("focusout", "onBlur"), Lr(Er, "onTransitionEnd"), c("onMouseEnter", ["mouseout", "mouseover"]), c("onMouseLeave", ["mouseout", "mouseover"]), c("onPointerEnter", ["pointerout", "pointerover"]), c("onPointerLeave", ["pointerout", "pointerover"]), l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
        var Br = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Dr = new Set("cancel close invalid load scroll toggle".split(" ").concat(Br));
        function Fr(e, t, n) { var r = e.type || "unknown-event"; e.currentTarget = n, function (e, t, n, r, i, o, s, l, c) { if (_e.apply(this, arguments), De) {
            if (!De)
                throw Error(a(198));
            var d = Fe;
            De = !1, Fe = null, Me || (Me = !0, Ie = d);
        } }(r, t, void 0, e), e.currentTarget = null; }
        function Mr(e, t) { t = 0 !== (4 & t); for (var n = 0; n < e.length; n++) {
            var r = e[n], i = r.event;
            r = r.listeners;
            e: {
                var a = void 0;
                if (t)
                    for (var o = r.length - 1; 0 <= o; o--) {
                        var s = r[o], l = s.instance, c = s.currentTarget;
                        if (s = s.listener, l !== a && i.isPropagationStopped())
                            break e;
                        Fr(i, s, c), a = l;
                    }
                else
                    for (o = 0; o < r.length; o++) {
                        if (l = (s = r[o]).instance, c = s.currentTarget, s = s.listener, l !== a && i.isPropagationStopped())
                            break e;
                        Fr(i, s, c), a = l;
                    }
            }
        } if (Me)
            throw e = Ie, Me = !1, Ie = null, e; }
        function Ir(e, t) { var n = t[gi]; void 0 === n && (n = t[gi] = new Set); var r = e + "__bubble"; n.has(r) || (Hr(t, e, 2, !1), n.add(r)); }
        function Ur(e, t, n) { var r = 0; t && (r |= 4), Hr(n, e, r, t); }
        var _r = "_reactListening" + Math.random().toString(36).slice(2);
        function Wr(e) { if (!e[_r]) {
            e[_r] = !0, o.forEach(function (t) { "selectionchange" !== t && (Dr.has(t) || Ur(t, !1, e), Ur(t, !0, e)); });
            var t = 9 === e.nodeType ? e : e.ownerDocument;
            null === t || t[_r] || (t[_r] = !0, Ur("selectionchange", !1, t));
        } }
        function Hr(e, t, n, r) { switch (Jt(t)) {
            case 1:
                var i = qt;
                break;
            case 4:
                i = Kt;
                break;
            default: i = Gt;
        } n = i.bind(null, t, n, e), i = void 0, !Oe || "touchstart" !== t && "touchmove" !== t && "wheel" !== t || (i = !0), r ? void 0 !== i ? e.addEventListener(t, n, { capture: !0, passive: i }) : e.addEventListener(t, n, !0) : void 0 !== i ? e.addEventListener(t, n, { passive: i }) : e.addEventListener(t, n, !1); }
        function Vr(e, t, n, r, i) { var a = r; if (0 === (1 & t) && 0 === (2 & t) && null !== r)
            e: for (;;) {
                if (null === r)
                    return;
                var o = r.tag;
                if (3 === o || 4 === o) {
                    var s = r.stateNode.containerInfo;
                    if (s === i || 8 === s.nodeType && s.parentNode === i)
                        break;
                    if (4 === o)
                        for (o = r.return; null !== o;) {
                            var l = o.tag;
                            if ((3 === l || 4 === l) && ((l = o.stateNode.containerInfo) === i || 8 === l.nodeType && l.parentNode === i))
                                return;
                            o = o.return;
                        }
                    for (; null !== s;) {
                        if (null === (o = bi(s)))
                            return;
                        if (5 === (l = o.tag) || 6 === l) {
                            r = a = o;
                            continue e;
                        }
                        s = s.parentNode;
                    }
                }
                r = r.return;
            } Pe(function () { var r = a, i = we(n), o = []; e: {
            var s = Rr.get(e);
            if (void 0 !== s) {
                var l = dn, c = e;
                switch (e) {
                    case "keypress": if (0 === tn(n))
                        break e;
                    case "keydown":
                    case "keyup":
                        l = Tn;
                        break;
                    case "focusin":
                        c = "focus", l = mn;
                        break;
                    case "focusout":
                        c = "blur", l = mn;
                        break;
                    case "beforeblur":
                    case "afterblur":
                        l = mn;
                        break;
                    case "click": if (2 === n.button)
                        break e;
                    case "auxclick":
                    case "dblclick":
                    case "mousedown":
                    case "mousemove":
                    case "mouseup":
                    case "mouseout":
                    case "mouseover":
                    case "contextmenu":
                        l = fn;
                        break;
                    case "drag":
                    case "dragend":
                    case "dragenter":
                    case "dragexit":
                    case "dragleave":
                    case "dragover":
                    case "dragstart":
                    case "drop":
                        l = gn;
                        break;
                    case "touchcancel":
                    case "touchend":
                    case "touchmove":
                    case "touchstart":
                        l = En;
                        break;
                    case Cr:
                    case Tr:
                    case Ar:
                        l = xn;
                        break;
                    case Er:
                        l = Rn;
                        break;
                    case "scroll":
                        l = pn;
                        break;
                    case "wheel":
                        l = Ln;
                        break;
                    case "copy":
                    case "cut":
                    case "paste":
                        l = yn;
                        break;
                    case "gotpointercapture":
                    case "lostpointercapture":
                    case "pointercancel":
                    case "pointerdown":
                    case "pointermove":
                    case "pointerout":
                    case "pointerover":
                    case "pointerup": l = An;
                }
                var d = 0 !== (4 & t), u = !d && "scroll" === e, p = d ? null !== s ? s + "Capture" : null : s;
                d = [];
                for (var h, f = r; null !== f;) {
                    var g = (h = f).stateNode;
                    if (5 === h.tag && null !== g && (h = g, null !== p && (null != (g = Le(f, p)) && d.push(qr(f, g, h)))), u)
                        break;
                    f = f.return;
                }
                0 < d.length && (s = new l(s, c, null, n, i), o.push({ event: s, listeners: d }));
            }
        } if (0 === (7 & t)) {
            if (l = "mouseout" === e || "pointerout" === e, (!(s = "mouseover" === e || "pointerover" === e) || n === ve || !(c = n.relatedTarget || n.fromElement) || !bi(c) && !c[fi]) && (l || s) && (s = i.window === i ? i : (s = i.ownerDocument) ? s.defaultView || s.parentWindow : window, l ? (l = r, null !== (c = (c = n.relatedTarget || n.toElement) ? bi(c) : null) && (c !== (u = We(c)) || 5 !== c.tag && 6 !== c.tag) && (c = null)) : (l = null, c = r), l !== c)) {
                if (d = fn, g = "onMouseLeave", p = "onMouseEnter", f = "mouse", "pointerout" !== e && "pointerover" !== e || (d = An, g = "onPointerLeave", p = "onPointerEnter", f = "pointer"), u = null == l ? s : vi(l), h = null == c ? s : vi(c), (s = new d(g, f + "leave", l, n, i)).target = u, s.relatedTarget = h, g = null, bi(i) === r && ((d = new d(p, f + "enter", c, n, i)).target = h, d.relatedTarget = u, g = d), u = g, l && c)
                    e: {
                        for (p = c, f = 0, h = d = l; h; h = Gr(h))
                            f++;
                        for (h = 0, g = p; g; g = Gr(g))
                            h++;
                        for (; 0 < f - h;)
                            d = Gr(d), f--;
                        for (; 0 < h - f;)
                            p = Gr(p), h--;
                        for (; f--;) {
                            if (d === p || null !== p && d === p.alternate)
                                break e;
                            d = Gr(d), p = Gr(p);
                        }
                        d = null;
                    }
                else
                    d = null;
                null !== l && Yr(o, s, l, d, !1), null !== c && null !== u && Yr(o, u, c, d, !0);
            }
            if ("select" === (l = (s = r ? vi(r) : window).nodeName && s.nodeName.toLowerCase()) || "input" === l && "file" === s.type)
                var m = Jn;
            else if (Vn(s))
                if (Qn)
                    m = or;
                else {
                    m = ir;
                    var x = rr;
                }
            else
                (l = s.nodeName) && "input" === l.toLowerCase() && ("checkbox" === s.type || "radio" === s.type) && (m = ar);
            switch (m && (m = m(e, r)) ? qn(o, m, n, i) : (x && x(e, s, r), "focusout" === e && (x = s._wrapperState) && x.controlled && "number" === s.type && ee(s, "number", s.value)), x = r ? vi(r) : window, e) {
                case "focusin":
                    (Vn(x) || "true" === x.contentEditable) && (mr = x, xr = r, br = null);
                    break;
                case "focusout":
                    br = xr = mr = null;
                    break;
                case "mousedown":
                    yr = !0;
                    break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                    yr = !1, vr(o, n, i);
                    break;
                case "selectionchange": if (gr)
                    break;
                case "keydown":
                case "keyup": vr(o, n, i);
            }
            var b;
            if (zn)
                e: {
                    switch (e) {
                        case "compositionstart":
                            var y = "onCompositionStart";
                            break e;
                        case "compositionend":
                            y = "onCompositionEnd";
                            break e;
                        case "compositionupdate":
                            y = "onCompositionUpdate";
                            break e;
                    }
                    y = void 0;
                }
            else
                Wn ? Un(e, n) && (y = "onCompositionEnd") : "keydown" === e && 229 === n.keyCode && (y = "onCompositionStart");
            y && (Fn && "ko" !== n.locale && (Wn || "onCompositionStart" !== y ? "onCompositionEnd" === y && Wn && (b = en()) : (Zt = "value" in (Qt = i) ? Qt.value : Qt.textContent, Wn = !0)), 0 < (x = Kr(r, y)).length && (y = new vn(y, e, null, n, i), o.push({ event: y, listeners: x }), b ? y.data = b : null !== (b = _n(n)) && (y.data = b))), (b = Dn ? function (e, t) { switch (e) {
                case "compositionend": return _n(t);
                case "keypress": return 32 !== t.which ? null : (In = !0, Mn);
                case "textInput": return (e = t.data) === Mn && In ? null : e;
                default: return null;
            } }(e, n) : function (e, t) { if (Wn)
                return "compositionend" === e || !zn && Un(e, t) ? (e = en(), $t = Zt = Qt = null, Wn = !1, e) : null; switch (e) {
                case "paste":
                default: return null;
                case "keypress":
                    if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
                        if (t.char && 1 < t.char.length)
                            return t.char;
                        if (t.which)
                            return String.fromCharCode(t.which);
                    }
                    return null;
                case "compositionend": return Fn && "ko" !== t.locale ? null : t.data;
            } }(e, n)) && (0 < (r = Kr(r, "onBeforeInput")).length && (i = new vn("onBeforeInput", "beforeinput", null, n, i), o.push({ event: i, listeners: r }), i.data = b));
        } Mr(o, t); }); }
        function qr(e, t, n) { return { instance: e, listener: t, currentTarget: n }; }
        function Kr(e, t) { for (var n = t + "Capture", r = []; null !== e;) {
            var i = e, a = i.stateNode;
            5 === i.tag && null !== a && (i = a, null != (a = Le(e, n)) && r.unshift(qr(e, a, i)), null != (a = Le(e, t)) && r.push(qr(e, a, i))), e = e.return;
        } return r; }
        function Gr(e) { if (null === e)
            return null; do {
            e = e.return;
        } while (e && 5 !== e.tag); return e || null; }
        function Yr(e, t, n, r, i) { for (var a = t._reactName, o = []; null !== n && n !== r;) {
            var s = n, l = s.alternate, c = s.stateNode;
            if (null !== l && l === r)
                break;
            5 === s.tag && null !== c && (s = c, i ? null != (l = Le(n, a)) && o.unshift(qr(n, l, s)) : i || null != (l = Le(n, a)) && o.push(qr(n, l, s))), n = n.return;
        } 0 !== o.length && e.push({ event: t, listeners: o }); }
        var Xr = /\r\n?/g, Jr = /\u0000|\uFFFD/g;
        function Qr(e) { return ("string" === typeof e ? e : "" + e).replace(Xr, "\n").replace(Jr, ""); }
        function Zr(e, t, n) { if (t = Qr(t), Qr(e) !== t && n)
            throw Error(a(425)); }
        function $r() { }
        var ei = null, ti = null;
        function ni(e, t) { return "textarea" === e || "noscript" === e || "string" === typeof t.children || "number" === typeof t.children || "object" === typeof t.dangerouslySetInnerHTML && null !== t.dangerouslySetInnerHTML && null != t.dangerouslySetInnerHTML.__html; }
        var ri = "function" === typeof setTimeout ? setTimeout : void 0, ii = "function" === typeof clearTimeout ? clearTimeout : void 0, ai = "function" === typeof Promise ? Promise : void 0, oi = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof ai ? function (e) { return ai.resolve(null).then(e).catch(si); } : ri;
        function si(e) { setTimeout(function () { throw e; }); }
        function li(e, t) { var n = t, r = 0; do {
            var i = n.nextSibling;
            if (e.removeChild(n), i && 8 === i.nodeType)
                if ("/$" === (n = i.data)) {
                    if (0 === r)
                        return e.removeChild(i), void Wt(t);
                    r--;
                }
                else
                    "$" !== n && "$?" !== n && "$!" !== n || r++;
            n = i;
        } while (n); Wt(t); }
        function ci(e) { for (; null != e; e = e.nextSibling) {
            var t = e.nodeType;
            if (1 === t || 3 === t)
                break;
            if (8 === t) {
                if ("$" === (t = e.data) || "$!" === t || "$?" === t)
                    break;
                if ("/$" === t)
                    return null;
            }
        } return e; }
        function di(e) { e = e.previousSibling; for (var t = 0; e;) {
            if (8 === e.nodeType) {
                var n = e.data;
                if ("$" === n || "$!" === n || "$?" === n) {
                    if (0 === t)
                        return e;
                    t--;
                }
                else
                    "/$" === n && t++;
            }
            e = e.previousSibling;
        } return null; }
        var ui = Math.random().toString(36).slice(2), pi = "__reactFiber$" + ui, hi = "__reactProps$" + ui, fi = "__reactContainer$" + ui, gi = "__reactEvents$" + ui, mi = "__reactListeners$" + ui, xi = "__reactHandles$" + ui;
        function bi(e) { var t = e[pi]; if (t)
            return t; for (var n = e.parentNode; n;) {
            if (t = n[fi] || n[pi]) {
                if (n = t.alternate, null !== t.child || null !== n && null !== n.child)
                    for (e = di(e); null !== e;) {
                        if (n = e[pi])
                            return n;
                        e = di(e);
                    }
                return t;
            }
            n = (e = n).parentNode;
        } return null; }
        function yi(e) { return !(e = e[pi] || e[fi]) || 5 !== e.tag && 6 !== e.tag && 13 !== e.tag && 3 !== e.tag ? null : e; }
        function vi(e) { if (5 === e.tag || 6 === e.tag)
            return e.stateNode; throw Error(a(33)); }
        function wi(e) { return e[hi] || null; }
        var ji = [], ki = -1;
        function Si(e) { return { current: e }; }
        function Ni(e) { 0 > ki || (e.current = ji[ki], ji[ki] = null, ki--); }
        function Ci(e, t) { ki++, ji[ki] = e.current, e.current = t; }
        var Ti = {}, Ai = Si(Ti), Ei = Si(!1), Ri = Ti;
        function Pi(e, t) { var n = e.type.contextTypes; if (!n)
            return Ti; var r = e.stateNode; if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
            return r.__reactInternalMemoizedMaskedChildContext; var i, a = {}; for (i in n)
            a[i] = t[i]; return r && ((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = a), a; }
        function Li(e) { return null !== (e = e.childContextTypes) && void 0 !== e; }
        function Oi() { Ni(Ei), Ni(Ai); }
        function zi(e, t, n) { if (Ai.current !== Ti)
            throw Error(a(168)); Ci(Ai, t), Ci(Ei, n); }
        function Bi(e, t, n) { var r = e.stateNode; if (t = t.childContextTypes, "function" !== typeof r.getChildContext)
            return n; for (var i in r = r.getChildContext())
            if (!(i in t))
                throw Error(a(108, H(e) || "Unknown", i)); return F({}, n, r); }
        function Di(e) { return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ti, Ri = Ai.current, Ci(Ai, e), Ci(Ei, Ei.current), !0; }
        function Fi(e, t, n) { var r = e.stateNode; if (!r)
            throw Error(a(169)); n ? (e = Bi(e, t, Ri), r.__reactInternalMemoizedMergedChildContext = e, Ni(Ei), Ni(Ai), Ci(Ai, e)) : Ni(Ei), Ci(Ei, n); }
        var Mi = null, Ii = !1, Ui = !1;
        function _i(e) { null === Mi ? Mi = [e] : Mi.push(e); }
        function Wi() { if (!Ui && null !== Mi) {
            Ui = !0;
            var e = 0, t = yt;
            try {
                var n = Mi;
                for (yt = 1; e < n.length; e++) {
                    var r = n[e];
                    do {
                        r = r(!0);
                    } while (null !== r);
                }
                Mi = null, Ii = !1;
            }
            catch (i) {
                throw null !== Mi && (Mi = Mi.slice(e + 1)), Ge($e, Wi), i;
            }
            finally {
                yt = t, Ui = !1;
            }
        } return null; }
        var Hi = [], Vi = 0, qi = null, Ki = 0, Gi = [], Yi = 0, Xi = null, Ji = 1, Qi = "";
        function Zi(e, t) { Hi[Vi++] = Ki, Hi[Vi++] = qi, qi = e, Ki = t; }
        function $i(e, t, n) { Gi[Yi++] = Ji, Gi[Yi++] = Qi, Gi[Yi++] = Xi, Xi = e; var r = Ji; e = Qi; var i = 32 - ot(r) - 1; r &= ~(1 << i), n += 1; var a = 32 - ot(t) + i; if (30 < a) {
            var o = i - i % 5;
            a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Ji = 1 << 32 - ot(t) + i | n << i | r, Qi = a + e;
        }
        else
            Ji = 1 << a | n << i | r, Qi = e; }
        function ea(e) { null !== e.return && (Zi(e, 1), $i(e, 1, 0)); }
        function ta(e) { for (; e === qi;)
            qi = Hi[--Vi], Hi[Vi] = null, Ki = Hi[--Vi], Hi[Vi] = null; for (; e === Xi;)
            Xi = Gi[--Yi], Gi[Yi] = null, Qi = Gi[--Yi], Gi[Yi] = null, Ji = Gi[--Yi], Gi[Yi] = null; }
        var na = null, ra = null, ia = !1, aa = null;
        function oa(e, t) { var n = Rc(5, null, null, 0); n.elementType = "DELETED", n.stateNode = t, n.return = e, null === (t = e.deletions) ? (e.deletions = [n], e.flags |= 16) : t.push(n); }
        function sa(e, t) { switch (e.tag) {
            case 5:
                var n = e.type;
                return null !== (t = 1 !== t.nodeType || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t) && (e.stateNode = t, na = e, ra = ci(t.firstChild), !0);
            case 6: return null !== (t = "" === e.pendingProps || 3 !== t.nodeType ? null : t) && (e.stateNode = t, na = e, ra = null, !0);
            case 13: return null !== (t = 8 !== t.nodeType ? null : t) && (n = null !== Xi ? { id: Ji, overflow: Qi } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, (n = Rc(18, null, null, 0)).stateNode = t, n.return = e, e.child = n, na = e, ra = null, !0);
            default: return !1;
        } }
        function la(e) { return 0 !== (1 & e.mode) && 0 === (128 & e.flags); }
        function ca(e) { if (ia) {
            var t = ra;
            if (t) {
                var n = t;
                if (!sa(e, t)) {
                    if (la(e))
                        throw Error(a(418));
                    t = ci(n.nextSibling);
                    var r = na;
                    t && sa(e, t) ? oa(r, n) : (e.flags = -4097 & e.flags | 2, ia = !1, na = e);
                }
            }
            else {
                if (la(e))
                    throw Error(a(418));
                e.flags = -4097 & e.flags | 2, ia = !1, na = e;
            }
        } }
        function da(e) { for (e = e.return; null !== e && 5 !== e.tag && 3 !== e.tag && 13 !== e.tag;)
            e = e.return; na = e; }
        function ua(e) { if (e !== na)
            return !1; if (!ia)
            return da(e), ia = !0, !1; var t; if ((t = 3 !== e.tag) && !(t = 5 !== e.tag) && (t = "head" !== (t = e.type) && "body" !== t && !ni(e.type, e.memoizedProps)), t && (t = ra)) {
            if (la(e))
                throw pa(), Error(a(418));
            for (; t;)
                oa(e, t), t = ci(t.nextSibling);
        } if (da(e), 13 === e.tag) {
            if (!(e = null !== (e = e.memoizedState) ? e.dehydrated : null))
                throw Error(a(317));
            e: {
                for (e = e.nextSibling, t = 0; e;) {
                    if (8 === e.nodeType) {
                        var n = e.data;
                        if ("/$" === n) {
                            if (0 === t) {
                                ra = ci(e.nextSibling);
                                break e;
                            }
                            t--;
                        }
                        else
                            "$" !== n && "$!" !== n && "$?" !== n || t++;
                    }
                    e = e.nextSibling;
                }
                ra = null;
            }
        }
        else
            ra = na ? ci(e.stateNode.nextSibling) : null; return !0; }
        function pa() { for (var e = ra; e;)
            e = ci(e.nextSibling); }
        function ha() { ra = na = null, ia = !1; }
        function fa(e) { null === aa ? aa = [e] : aa.push(e); }
        var ga = v.ReactCurrentBatchConfig;
        function ma(e, t, n) { if (null !== (e = n.ref) && "function" !== typeof e && "object" !== typeof e) {
            if (n._owner) {
                if (n = n._owner) {
                    if (1 !== n.tag)
                        throw Error(a(309));
                    var r = n.stateNode;
                }
                if (!r)
                    throw Error(a(147, e));
                var i = r, o = "" + e;
                return null !== t && null !== t.ref && "function" === typeof t.ref && t.ref._stringRef === o ? t.ref : (t = function (e) { var t = i.refs; null === e ? delete t[o] : t[o] = e; }, t._stringRef = o, t);
            }
            if ("string" !== typeof e)
                throw Error(a(284));
            if (!n._owner)
                throw Error(a(290, e));
        } return e; }
        function xa(e, t) { throw e = Object.prototype.toString.call(t), Error(a(31, "[object Object]" === e ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)); }
        function ba(e) { return (0, e._init)(e._payload); }
        function ya(e) { function t(t, n) { if (e) {
            var r = t.deletions;
            null === r ? (t.deletions = [n], t.flags |= 16) : r.push(n);
        } } function n(n, r) { if (!e)
            return null; for (; null !== r;)
            t(n, r), r = r.sibling; return null; } function r(e, t) { for (e = new Map; null !== t;)
            null !== t.key ? e.set(t.key, t) : e.set(t.index, t), t = t.sibling; return e; } function i(e, t) { return (e = Lc(e, t)).index = 0, e.sibling = null, e; } function o(t, n, r) { return t.index = r, e ? null !== (r = t.alternate) ? (r = r.index) < n ? (t.flags |= 2, n) : r : (t.flags |= 2, n) : (t.flags |= 1048576, n); } function s(t) { return e && null === t.alternate && (t.flags |= 2), t; } function l(e, t, n, r) { return null === t || 6 !== t.tag ? ((t = Dc(n, e.mode, r)).return = e, t) : ((t = i(t, n)).return = e, t); } function c(e, t, n, r) { var a = n.type; return a === k ? u(e, t, n.props.children, r, n.key) : null !== t && (t.elementType === a || "object" === typeof a && null !== a && a.$$typeof === L && ba(a) === t.type) ? ((r = i(t, n.props)).ref = ma(e, t, n), r.return = e, r) : ((r = Oc(n.type, n.key, n.props, null, e.mode, r)).ref = ma(e, t, n), r.return = e, r); } function d(e, t, n, r) { return null === t || 4 !== t.tag || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? ((t = Fc(n, e.mode, r)).return = e, t) : ((t = i(t, n.children || [])).return = e, t); } function u(e, t, n, r, a) { return null === t || 7 !== t.tag ? ((t = zc(n, e.mode, r, a)).return = e, t) : ((t = i(t, n)).return = e, t); } function p(e, t, n) { if ("string" === typeof t && "" !== t || "number" === typeof t)
            return (t = Dc("" + t, e.mode, n)).return = e, t; if ("object" === typeof t && null !== t) {
            switch (t.$$typeof) {
                case w: return (n = Oc(t.type, t.key, t.props, null, e.mode, n)).ref = ma(e, null, t), n.return = e, n;
                case j: return (t = Fc(t, e.mode, n)).return = e, t;
                case L: return p(e, (0, t._init)(t._payload), n);
            }
            if (te(t) || B(t))
                return (t = zc(t, e.mode, n, null)).return = e, t;
            xa(e, t);
        } return null; } function h(e, t, n, r) { var i = null !== t ? t.key : null; if ("string" === typeof n && "" !== n || "number" === typeof n)
            return null !== i ? null : l(e, t, "" + n, r); if ("object" === typeof n && null !== n) {
            switch (n.$$typeof) {
                case w: return n.key === i ? c(e, t, n, r) : null;
                case j: return n.key === i ? d(e, t, n, r) : null;
                case L: return h(e, t, (i = n._init)(n._payload), r);
            }
            if (te(n) || B(n))
                return null !== i ? null : u(e, t, n, r, null);
            xa(e, n);
        } return null; } function f(e, t, n, r, i) { if ("string" === typeof r && "" !== r || "number" === typeof r)
            return l(t, e = e.get(n) || null, "" + r, i); if ("object" === typeof r && null !== r) {
            switch (r.$$typeof) {
                case w: return c(t, e = e.get(null === r.key ? n : r.key) || null, r, i);
                case j: return d(t, e = e.get(null === r.key ? n : r.key) || null, r, i);
                case L: return f(e, t, n, (0, r._init)(r._payload), i);
            }
            if (te(r) || B(r))
                return u(t, e = e.get(n) || null, r, i, null);
            xa(t, r);
        } return null; } function g(i, a, s, l) { for (var c = null, d = null, u = a, g = a = 0, m = null; null !== u && g < s.length; g++) {
            u.index > g ? (m = u, u = null) : m = u.sibling;
            var x = h(i, u, s[g], l);
            if (null === x) {
                null === u && (u = m);
                break;
            }
            e && u && null === x.alternate && t(i, u), a = o(x, a, g), null === d ? c = x : d.sibling = x, d = x, u = m;
        } if (g === s.length)
            return n(i, u), ia && Zi(i, g), c; if (null === u) {
            for (; g < s.length; g++)
                null !== (u = p(i, s[g], l)) && (a = o(u, a, g), null === d ? c = u : d.sibling = u, d = u);
            return ia && Zi(i, g), c;
        } for (u = r(i, u); g < s.length; g++)
            null !== (m = f(u, i, g, s[g], l)) && (e && null !== m.alternate && u.delete(null === m.key ? g : m.key), a = o(m, a, g), null === d ? c = m : d.sibling = m, d = m); return e && u.forEach(function (e) { return t(i, e); }), ia && Zi(i, g), c; } function m(i, s, l, c) { var d = B(l); if ("function" !== typeof d)
            throw Error(a(150)); if (null == (l = d.call(l)))
            throw Error(a(151)); for (var u = d = null, g = s, m = s = 0, x = null, b = l.next(); null !== g && !b.done; m++, b = l.next()) {
            g.index > m ? (x = g, g = null) : x = g.sibling;
            var y = h(i, g, b.value, c);
            if (null === y) {
                null === g && (g = x);
                break;
            }
            e && g && null === y.alternate && t(i, g), s = o(y, s, m), null === u ? d = y : u.sibling = y, u = y, g = x;
        } if (b.done)
            return n(i, g), ia && Zi(i, m), d; if (null === g) {
            for (; !b.done; m++, b = l.next())
                null !== (b = p(i, b.value, c)) && (s = o(b, s, m), null === u ? d = b : u.sibling = b, u = b);
            return ia && Zi(i, m), d;
        } for (g = r(i, g); !b.done; m++, b = l.next())
            null !== (b = f(g, i, m, b.value, c)) && (e && null !== b.alternate && g.delete(null === b.key ? m : b.key), s = o(b, s, m), null === u ? d = b : u.sibling = b, u = b); return e && g.forEach(function (e) { return t(i, e); }), ia && Zi(i, m), d; } return function e(r, a, o, l) { if ("object" === typeof o && null !== o && o.type === k && null === o.key && (o = o.props.children), "object" === typeof o && null !== o) {
            switch (o.$$typeof) {
                case w:
                    e: {
                        for (var c = o.key, d = a; null !== d;) {
                            if (d.key === c) {
                                if ((c = o.type) === k) {
                                    if (7 === d.tag) {
                                        n(r, d.sibling), (a = i(d, o.props.children)).return = r, r = a;
                                        break e;
                                    }
                                }
                                else if (d.elementType === c || "object" === typeof c && null !== c && c.$$typeof === L && ba(c) === d.type) {
                                    n(r, d.sibling), (a = i(d, o.props)).ref = ma(r, d, o), a.return = r, r = a;
                                    break e;
                                }
                                n(r, d);
                                break;
                            }
                            t(r, d), d = d.sibling;
                        }
                        o.type === k ? ((a = zc(o.props.children, r.mode, l, o.key)).return = r, r = a) : ((l = Oc(o.type, o.key, o.props, null, r.mode, l)).ref = ma(r, a, o), l.return = r, r = l);
                    }
                    return s(r);
                case j:
                    e: {
                        for (d = o.key; null !== a;) {
                            if (a.key === d) {
                                if (4 === a.tag && a.stateNode.containerInfo === o.containerInfo && a.stateNode.implementation === o.implementation) {
                                    n(r, a.sibling), (a = i(a, o.children || [])).return = r, r = a;
                                    break e;
                                }
                                n(r, a);
                                break;
                            }
                            t(r, a), a = a.sibling;
                        }
                        (a = Fc(o, r.mode, l)).return = r, r = a;
                    }
                    return s(r);
                case L: return e(r, a, (d = o._init)(o._payload), l);
            }
            if (te(o))
                return g(r, a, o, l);
            if (B(o))
                return m(r, a, o, l);
            xa(r, o);
        } return "string" === typeof o && "" !== o || "number" === typeof o ? (o = "" + o, null !== a && 6 === a.tag ? (n(r, a.sibling), (a = i(a, o)).return = r, r = a) : (n(r, a), (a = Dc(o, r.mode, l)).return = r, r = a), s(r)) : n(r, a); }; }
        var va = ya(!0), wa = ya(!1), ja = Si(null), ka = null, Sa = null, Na = null;
        function Ca() { Na = Sa = ka = null; }
        function Ta(e) { var t = ja.current; Ni(ja), e._currentValue = t; }
        function Aa(e, t, n) { for (; null !== e;) {
            var r = e.alternate;
            if ((e.childLanes & t) !== t ? (e.childLanes |= t, null !== r && (r.childLanes |= t)) : null !== r && (r.childLanes & t) !== t && (r.childLanes |= t), e === n)
                break;
            e = e.return;
        } }
        function Ea(e, t) { ka = e, Na = Sa = null, null !== (e = e.dependencies) && null !== e.firstContext && (0 !== (e.lanes & t) && (ys = !0), e.firstContext = null); }
        function Ra(e) { var t = e._currentValue; if (Na !== e)
            if (e = { context: e, memoizedValue: t, next: null }, null === Sa) {
                if (null === ka)
                    throw Error(a(308));
                Sa = e, ka.dependencies = { lanes: 0, firstContext: e };
            }
            else
                Sa = Sa.next = e; return t; }
        var Pa = null;
        function La(e) { null === Pa ? Pa = [e] : Pa.push(e); }
        function Oa(e, t, n, r) { var i = t.interleaved; return null === i ? (n.next = n, La(t)) : (n.next = i.next, i.next = n), t.interleaved = n, za(e, r); }
        function za(e, t) { e.lanes |= t; var n = e.alternate; for (null !== n && (n.lanes |= t), n = e, e = e.return; null !== e;)
            e.childLanes |= t, null !== (n = e.alternate) && (n.childLanes |= t), n = e, e = e.return; return 3 === n.tag ? n.stateNode : null; }
        var Ba = !1;
        function Da(e) { e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null }; }
        function Fa(e, t) { e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects }); }
        function Ma(e, t) { return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null }; }
        function Ia(e, t, n) { var r = e.updateQueue; if (null === r)
            return null; if (r = r.shared, 0 !== (2 & Tl)) {
            var i = r.pending;
            return null === i ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, za(e, n);
        } return null === (i = r.interleaved) ? (t.next = t, La(r)) : (t.next = i.next, i.next = t), r.interleaved = t, za(e, n); }
        function Ua(e, t, n) { if (null !== (t = t.updateQueue) && (t = t.shared, 0 !== (4194240 & n))) {
            var r = t.lanes;
            n |= r &= e.pendingLanes, t.lanes = n, bt(e, n);
        } }
        function _a(e, t) { var n = e.updateQueue, r = e.alternate; if (null !== r && n === (r = r.updateQueue)) {
            var i = null, a = null;
            if (null !== (n = n.firstBaseUpdate)) {
                do {
                    var o = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
                    null === a ? i = a = o : a = a.next = o, n = n.next;
                } while (null !== n);
                null === a ? i = a = t : a = a.next = t;
            }
            else
                i = a = t;
            return n = { baseState: r.baseState, firstBaseUpdate: i, lastBaseUpdate: a, shared: r.shared, effects: r.effects }, void (e.updateQueue = n);
        } null === (e = n.lastBaseUpdate) ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t; }
        function Wa(e, t, n, r) { var i = e.updateQueue; Ba = !1; var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending; if (null !== s) {
            i.shared.pending = null;
            var l = s, c = l.next;
            l.next = null, null === o ? a = c : o.next = c, o = l;
            var d = e.alternate;
            null !== d && ((s = (d = d.updateQueue).lastBaseUpdate) !== o && (null === s ? d.firstBaseUpdate = c : s.next = c, d.lastBaseUpdate = l));
        } if (null !== a) {
            var u = i.baseState;
            for (o = 0, d = c = l = null, s = a;;) {
                var p = s.lane, h = s.eventTime;
                if ((r & p) === p) {
                    null !== d && (d = d.next = { eventTime: h, lane: 0, tag: s.tag, payload: s.payload, callback: s.callback, next: null });
                    e: {
                        var f = e, g = s;
                        switch (p = t, h = n, g.tag) {
                            case 1:
                                if ("function" === typeof (f = g.payload)) {
                                    u = f.call(h, u, p);
                                    break e;
                                }
                                u = f;
                                break e;
                            case 3: f.flags = -65537 & f.flags | 128;
                            case 0:
                                if (null === (p = "function" === typeof (f = g.payload) ? f.call(h, u, p) : f) || void 0 === p)
                                    break e;
                                u = F({}, u, p);
                                break e;
                            case 2: Ba = !0;
                        }
                    }
                    null !== s.callback && 0 !== s.lane && (e.flags |= 64, null === (p = i.effects) ? i.effects = [s] : p.push(s));
                }
                else
                    h = { eventTime: h, lane: p, tag: s.tag, payload: s.payload, callback: s.callback, next: null }, null === d ? (c = d = h, l = u) : d = d.next = h, o |= p;
                if (null === (s = s.next)) {
                    if (null === (s = i.shared.pending))
                        break;
                    s = (p = s).next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
                }
            }
            if (null === d && (l = u), i.baseState = l, i.firstBaseUpdate = c, i.lastBaseUpdate = d, null !== (t = i.shared.interleaved)) {
                i = t;
                do {
                    o |= i.lane, i = i.next;
                } while (i !== t);
            }
            else
                null === a && (i.shared.lanes = 0);
            Bl |= o, e.lanes = o, e.memoizedState = u;
        } }
        function Ha(e, t, n) { if (e = t.effects, t.effects = null, null !== e)
            for (t = 0; t < e.length; t++) {
                var r = e[t], i = r.callback;
                if (null !== i) {
                    if (r.callback = null, r = n, "function" !== typeof i)
                        throw Error(a(191, i));
                    i.call(r);
                }
            } }
        var Va = {}, qa = Si(Va), Ka = Si(Va), Ga = Si(Va);
        function Ya(e) { if (e === Va)
            throw Error(a(174)); return e; }
        function Xa(e, t) { switch (Ci(Ga, t), Ci(Ka, e), Ci(qa, Va), e = t.nodeType) {
            case 9:
            case 11:
                t = (t = t.documentElement) ? t.namespaceURI : le(null, "");
                break;
            default: t = le(t = (e = 8 === e ? t.parentNode : t).namespaceURI || null, e = e.tagName);
        } Ni(qa), Ci(qa, t); }
        function Ja() { Ni(qa), Ni(Ka), Ni(Ga); }
        function Qa(e) { Ya(Ga.current); var t = Ya(qa.current), n = le(t, e.type); t !== n && (Ci(Ka, e), Ci(qa, n)); }
        function Za(e) { Ka.current === e && (Ni(qa), Ni(Ka)); }
        var $a = Si(0);
        function eo(e) { for (var t = e; null !== t;) {
            if (13 === t.tag) {
                var n = t.memoizedState;
                if (null !== n && (null === (n = n.dehydrated) || "$?" === n.data || "$!" === n.data))
                    return t;
            }
            else if (19 === t.tag && void 0 !== t.memoizedProps.revealOrder) {
                if (0 !== (128 & t.flags))
                    return t;
            }
            else if (null !== t.child) {
                t.child.return = t, t = t.child;
                continue;
            }
            if (t === e)
                break;
            for (; null === t.sibling;) {
                if (null === t.return || t.return === e)
                    return null;
                t = t.return;
            }
            t.sibling.return = t.return, t = t.sibling;
        } return null; }
        var to = [];
        function no() { for (var e = 0; e < to.length; e++)
            to[e]._workInProgressVersionPrimary = null; to.length = 0; }
        var ro = v.ReactCurrentDispatcher, io = v.ReactCurrentBatchConfig, ao = 0, oo = null, so = null, lo = null, co = !1, uo = !1, po = 0, ho = 0;
        function fo() { throw Error(a(321)); }
        function go(e, t) { if (null === t)
            return !1; for (var n = 0; n < t.length && n < e.length; n++)
            if (!sr(e[n], t[n]))
                return !1; return !0; }
        function mo(e, t, n, r, i, o) { if (ao = o, oo = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ro.current = null === e || null === e.memoizedState ? $o : es, e = n(r, i), uo) {
            o = 0;
            do {
                if (uo = !1, po = 0, 25 <= o)
                    throw Error(a(301));
                o += 1, lo = so = null, t.updateQueue = null, ro.current = ts, e = n(r, i);
            } while (uo);
        } if (ro.current = Zo, t = null !== so && null !== so.next, ao = 0, lo = so = oo = null, co = !1, t)
            throw Error(a(300)); return e; }
        function xo() { var e = 0 !== po; return po = 0, e; }
        function bo() { var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null }; return null === lo ? oo.memoizedState = lo = e : lo = lo.next = e, lo; }
        function yo() { if (null === so) {
            var e = oo.alternate;
            e = null !== e ? e.memoizedState : null;
        }
        else
            e = so.next; var t = null === lo ? oo.memoizedState : lo.next; if (null !== t)
            lo = t, so = e;
        else {
            if (null === e)
                throw Error(a(310));
            e = { memoizedState: (so = e).memoizedState, baseState: so.baseState, baseQueue: so.baseQueue, queue: so.queue, next: null }, null === lo ? oo.memoizedState = lo = e : lo = lo.next = e;
        } return lo; }
        function vo(e, t) { return "function" === typeof t ? t(e) : t; }
        function wo(e) { var t = yo(), n = t.queue; if (null === n)
            throw Error(a(311)); n.lastRenderedReducer = e; var r = so, i = r.baseQueue, o = n.pending; if (null !== o) {
            if (null !== i) {
                var s = i.next;
                i.next = o.next, o.next = s;
            }
            r.baseQueue = i = o, n.pending = null;
        } if (null !== i) {
            o = i.next, r = r.baseState;
            var l = s = null, c = null, d = o;
            do {
                var u = d.lane;
                if ((ao & u) === u)
                    null !== c && (c = c.next = { lane: 0, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null }), r = d.hasEagerState ? d.eagerState : e(r, d.action);
                else {
                    var p = { lane: u, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null };
                    null === c ? (l = c = p, s = r) : c = c.next = p, oo.lanes |= u, Bl |= u;
                }
                d = d.next;
            } while (null !== d && d !== o);
            null === c ? s = r : c.next = l, sr(r, t.memoizedState) || (ys = !0), t.memoizedState = r, t.baseState = s, t.baseQueue = c, n.lastRenderedState = r;
        } if (null !== (e = n.interleaved)) {
            i = e;
            do {
                o = i.lane, oo.lanes |= o, Bl |= o, i = i.next;
            } while (i !== e);
        }
        else
            null === i && (n.lanes = 0); return [t.memoizedState, n.dispatch]; }
        function jo(e) { var t = yo(), n = t.queue; if (null === n)
            throw Error(a(311)); n.lastRenderedReducer = e; var r = n.dispatch, i = n.pending, o = t.memoizedState; if (null !== i) {
            n.pending = null;
            var s = i = i.next;
            do {
                o = e(o, s.action), s = s.next;
            } while (s !== i);
            sr(o, t.memoizedState) || (ys = !0), t.memoizedState = o, null === t.baseQueue && (t.baseState = o), n.lastRenderedState = o;
        } return [o, r]; }
        function ko() { }
        function So(e, t) { var n = oo, r = yo(), i = t(), o = !sr(r.memoizedState, i); if (o && (r.memoizedState = i, ys = !0), r = r.queue, Do(To.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || null !== lo && 1 & lo.memoizedState.tag) {
            if (n.flags |= 2048, Po(9, Co.bind(null, n, r, i, t), void 0, null), null === Al)
                throw Error(a(349));
            0 !== (30 & ao) || No(n, t, i);
        } return i; }
        function No(e, t, n) { e.flags |= 16384, e = { getSnapshot: t, value: n }, null === (t = oo.updateQueue) ? (t = { lastEffect: null, stores: null }, oo.updateQueue = t, t.stores = [e]) : null === (n = t.stores) ? t.stores = [e] : n.push(e); }
        function Co(e, t, n, r) { t.value = n, t.getSnapshot = r, Ao(t) && Eo(e); }
        function To(e, t, n) { return n(function () { Ao(t) && Eo(e); }); }
        function Ao(e) { var t = e.getSnapshot; e = e.value; try {
            var n = t();
            return !sr(e, n);
        }
        catch (r) {
            return !0;
        } }
        function Eo(e) { var t = za(e, 1); null !== t && tc(t, e, 1, -1); }
        function Ro(e) { var t = bo(); return "function" === typeof e && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: vo, lastRenderedState: e }, t.queue = e, e = e.dispatch = Yo.bind(null, oo, e), [t.memoizedState, e]; }
        function Po(e, t, n, r) { return e = { tag: e, create: t, destroy: n, deps: r, next: null }, null === (t = oo.updateQueue) ? (t = { lastEffect: null, stores: null }, oo.updateQueue = t, t.lastEffect = e.next = e) : null === (n = t.lastEffect) ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e; }
        function Lo() { return yo().memoizedState; }
        function Oo(e, t, n, r) { var i = bo(); oo.flags |= e, i.memoizedState = Po(1 | t, n, void 0, void 0 === r ? null : r); }
        function zo(e, t, n, r) { var i = yo(); r = void 0 === r ? null : r; var a = void 0; if (null !== so) {
            var o = so.memoizedState;
            if (a = o.destroy, null !== r && go(r, o.deps))
                return void (i.memoizedState = Po(t, n, a, r));
        } oo.flags |= e, i.memoizedState = Po(1 | t, n, a, r); }
        function Bo(e, t) { return Oo(8390656, 8, e, t); }
        function Do(e, t) { return zo(2048, 8, e, t); }
        function Fo(e, t) { return zo(4, 2, e, t); }
        function Mo(e, t) { return zo(4, 4, e, t); }
        function Io(e, t) { return "function" === typeof t ? (e = e(), t(e), function () { t(null); }) : null !== t && void 0 !== t ? (e = e(), t.current = e, function () { t.current = null; }) : void 0; }
        function Uo(e, t, n) { return n = null !== n && void 0 !== n ? n.concat([e]) : null, zo(4, 4, Io.bind(null, t, e), n); }
        function _o() { }
        function Wo(e, t) { var n = yo(); t = void 0 === t ? null : t; var r = n.memoizedState; return null !== r && null !== t && go(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e); }
        function Ho(e, t) { var n = yo(); t = void 0 === t ? null : t; var r = n.memoizedState; return null !== r && null !== t && go(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e); }
        function Vo(e, t, n) { return 0 === (21 & ao) ? (e.baseState && (e.baseState = !1, ys = !0), e.memoizedState = n) : (sr(n, t) || (n = gt(), oo.lanes |= n, Bl |= n, e.baseState = !0), t); }
        function qo(e, t) { var n = yt; yt = 0 !== n && 4 > n ? n : 4, e(!0); var r = io.transition; io.transition = {}; try {
            e(!1), t();
        }
        finally {
            yt = n, io.transition = r;
        } }
        function Ko() { return yo().memoizedState; }
        function Go(e, t, n) { var r = ec(e); if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Xo(e))
            Jo(t, n);
        else if (null !== (n = Oa(e, t, n, r))) {
            tc(n, e, r, $l()), Qo(n, t, r);
        } }
        function Yo(e, t, n) { var r = ec(e), i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }; if (Xo(e))
            Jo(t, i);
        else {
            var a = e.alternate;
            if (0 === e.lanes && (null === a || 0 === a.lanes) && null !== (a = t.lastRenderedReducer))
                try {
                    var o = t.lastRenderedState, s = a(o, n);
                    if (i.hasEagerState = !0, i.eagerState = s, sr(s, o)) {
                        var l = t.interleaved;
                        return null === l ? (i.next = i, La(t)) : (i.next = l.next, l.next = i), void (t.interleaved = i);
                    }
                }
                catch (c) { }
            null !== (n = Oa(e, t, i, r)) && (tc(n, e, r, i = $l()), Qo(n, t, r));
        } }
        function Xo(e) { var t = e.alternate; return e === oo || null !== t && t === oo; }
        function Jo(e, t) { uo = co = !0; var n = e.pending; null === n ? t.next = t : (t.next = n.next, n.next = t), e.pending = t; }
        function Qo(e, t, n) { if (0 !== (4194240 & n)) {
            var r = t.lanes;
            n |= r &= e.pendingLanes, t.lanes = n, bt(e, n);
        } }
        var Zo = { readContext: Ra, useCallback: fo, useContext: fo, useEffect: fo, useImperativeHandle: fo, useInsertionEffect: fo, useLayoutEffect: fo, useMemo: fo, useReducer: fo, useRef: fo, useState: fo, useDebugValue: fo, useDeferredValue: fo, useTransition: fo, useMutableSource: fo, useSyncExternalStore: fo, useId: fo, unstable_isNewReconciler: !1 }, $o = { readContext: Ra, useCallback: function (e, t) { return bo().memoizedState = [e, void 0 === t ? null : t], e; }, useContext: Ra, useEffect: Bo, useImperativeHandle: function (e, t, n) { return n = null !== n && void 0 !== n ? n.concat([e]) : null, Oo(4194308, 4, Io.bind(null, t, e), n); }, useLayoutEffect: function (e, t) { return Oo(4194308, 4, e, t); }, useInsertionEffect: function (e, t) { return Oo(4, 2, e, t); }, useMemo: function (e, t) { var n = bo(); return t = void 0 === t ? null : t, e = e(), n.memoizedState = [e, t], e; }, useReducer: function (e, t, n) { var r = bo(); return t = void 0 !== n ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Go.bind(null, oo, e), [r.memoizedState, e]; }, useRef: function (e) { return e = { current: e }, bo().memoizedState = e; }, useState: Ro, useDebugValue: _o, useDeferredValue: function (e) { return bo().memoizedState = e; }, useTransition: function () { var e = Ro(!1), t = e[0]; return e = qo.bind(null, e[1]), bo().memoizedState = e, [t, e]; }, useMutableSource: function () { }, useSyncExternalStore: function (e, t, n) { var r = oo, i = bo(); if (ia) {
                if (void 0 === n)
                    throw Error(a(407));
                n = n();
            }
            else {
                if (n = t(), null === Al)
                    throw Error(a(349));
                0 !== (30 & ao) || No(r, t, n);
            } i.memoizedState = n; var o = { value: n, getSnapshot: t }; return i.queue = o, Bo(To.bind(null, r, o, e), [e]), r.flags |= 2048, Po(9, Co.bind(null, r, o, n, t), void 0, null), n; }, useId: function () { var e = bo(), t = Al.identifierPrefix; if (ia) {
                var n = Qi;
                t = ":" + t + "R" + (n = (Ji & ~(1 << 32 - ot(Ji) - 1)).toString(32) + n), 0 < (n = po++) && (t += "H" + n.toString(32)), t += ":";
            }
            else
                t = ":" + t + "r" + (n = ho++).toString(32) + ":"; return e.memoizedState = t; }, unstable_isNewReconciler: !1 }, es = { readContext: Ra, useCallback: Wo, useContext: Ra, useEffect: Do, useImperativeHandle: Uo, useInsertionEffect: Fo, useLayoutEffect: Mo, useMemo: Ho, useReducer: wo, useRef: Lo, useState: function () { return wo(vo); }, useDebugValue: _o, useDeferredValue: function (e) { return Vo(yo(), so.memoizedState, e); }, useTransition: function () { return [wo(vo)[0], yo().memoizedState]; }, useMutableSource: ko, useSyncExternalStore: So, useId: Ko, unstable_isNewReconciler: !1 }, ts = { readContext: Ra, useCallback: Wo, useContext: Ra, useEffect: Do, useImperativeHandle: Uo, useInsertionEffect: Fo, useLayoutEffect: Mo, useMemo: Ho, useReducer: jo, useRef: Lo, useState: function () { return jo(vo); }, useDebugValue: _o, useDeferredValue: function (e) { var t = yo(); return null === so ? t.memoizedState = e : Vo(t, so.memoizedState, e); }, useTransition: function () { return [jo(vo)[0], yo().memoizedState]; }, useMutableSource: ko, useSyncExternalStore: So, useId: Ko, unstable_isNewReconciler: !1 };
        function ns(e, t) { if (e && e.defaultProps) {
            for (var n in t = F({}, t), e = e.defaultProps)
                void 0 === t[n] && (t[n] = e[n]);
            return t;
        } return t; }
        function rs(e, t, n, r) { n = null === (n = n(r, t = e.memoizedState)) || void 0 === n ? t : F({}, t, n), e.memoizedState = n, 0 === e.lanes && (e.updateQueue.baseState = n); }
        var is = { isMounted: function (e) { return !!(e = e._reactInternals) && We(e) === e; }, enqueueSetState: function (e, t, n) { e = e._reactInternals; var r = $l(), i = ec(e), a = Ma(r, i); a.payload = t, void 0 !== n && null !== n && (a.callback = n), null !== (t = Ia(e, a, i)) && (tc(t, e, i, r), Ua(t, e, i)); }, enqueueReplaceState: function (e, t, n) { e = e._reactInternals; var r = $l(), i = ec(e), a = Ma(r, i); a.tag = 1, a.payload = t, void 0 !== n && null !== n && (a.callback = n), null !== (t = Ia(e, a, i)) && (tc(t, e, i, r), Ua(t, e, i)); }, enqueueForceUpdate: function (e, t) { e = e._reactInternals; var n = $l(), r = ec(e), i = Ma(n, r); i.tag = 2, void 0 !== t && null !== t && (i.callback = t), null !== (t = Ia(e, i, r)) && (tc(t, e, r, n), Ua(t, e, r)); } };
        function as(e, t, n, r, i, a, o) { return "function" === typeof (e = e.stateNode).shouldComponentUpdate ? e.shouldComponentUpdate(r, a, o) : !t.prototype || !t.prototype.isPureReactComponent || (!lr(n, r) || !lr(i, a)); }
        function os(e, t, n) { var r = !1, i = Ti, a = t.contextType; return "object" === typeof a && null !== a ? a = Ra(a) : (i = Li(t) ? Ri : Ai.current, a = (r = null !== (r = t.contextTypes) && void 0 !== r) ? Pi(e, i) : Ti), t = new t(n, a), e.memoizedState = null !== t.state && void 0 !== t.state ? t.state : null, t.updater = is, e.stateNode = t, t._reactInternals = e, r && ((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = i, e.__reactInternalMemoizedMaskedChildContext = a), t; }
        function ss(e, t, n, r) { e = t.state, "function" === typeof t.componentWillReceiveProps && t.componentWillReceiveProps(n, r), "function" === typeof t.UNSAFE_componentWillReceiveProps && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && is.enqueueReplaceState(t, t.state, null); }
        function ls(e, t, n, r) { var i = e.stateNode; i.props = n, i.state = e.memoizedState, i.refs = {}, Da(e); var a = t.contextType; "object" === typeof a && null !== a ? i.context = Ra(a) : (a = Li(t) ? Ri : Ai.current, i.context = Pi(e, a)), i.state = e.memoizedState, "function" === typeof (a = t.getDerivedStateFromProps) && (rs(e, t, a, n), i.state = e.memoizedState), "function" === typeof t.getDerivedStateFromProps || "function" === typeof i.getSnapshotBeforeUpdate || "function" !== typeof i.UNSAFE_componentWillMount && "function" !== typeof i.componentWillMount || (t = i.state, "function" === typeof i.componentWillMount && i.componentWillMount(), "function" === typeof i.UNSAFE_componentWillMount && i.UNSAFE_componentWillMount(), t !== i.state && is.enqueueReplaceState(i, i.state, null), Wa(e, n, i, r), i.state = e.memoizedState), "function" === typeof i.componentDidMount && (e.flags |= 4194308); }
        function cs(e, t) { try {
            var n = "", r = t;
            do {
                n += _(r), r = r.return;
            } while (r);
            var i = n;
        }
        catch (a) {
            i = "\nError generating stack: " + a.message + "\n" + a.stack;
        } return { value: e, source: t, stack: i, digest: null }; }
        function ds(e, t, n) { return { value: e, source: null, stack: null != n ? n : null, digest: null != t ? t : null }; }
        function us(e, t) { try {
            console.error(t.value);
        }
        catch (n) {
            setTimeout(function () { throw n; });
        } }
        var ps = "function" === typeof WeakMap ? WeakMap : Map;
        function hs(e, t, n) { (n = Ma(-1, n)).tag = 3, n.payload = { element: null }; var r = t.value; return n.callback = function () { Hl || (Hl = !0, Vl = r), us(0, t); }, n; }
        function fs(e, t, n) { (n = Ma(-1, n)).tag = 3; var r = e.type.getDerivedStateFromError; if ("function" === typeof r) {
            var i = t.value;
            n.payload = function () { return r(i); }, n.callback = function () { us(0, t); };
        } var a = e.stateNode; return null !== a && "function" === typeof a.componentDidCatch && (n.callback = function () { us(0, t), "function" !== typeof r && (null === ql ? ql = new Set([this]) : ql.add(this)); var e = t.stack; this.componentDidCatch(t.value, { componentStack: null !== e ? e : "" }); }), n; }
        function gs(e, t, n) { var r = e.pingCache; if (null === r) {
            r = e.pingCache = new ps;
            var i = new Set;
            r.set(t, i);
        }
        else
            void 0 === (i = r.get(t)) && (i = new Set, r.set(t, i)); i.has(n) || (i.add(n), e = Sc.bind(null, e, t, n), t.then(e, e)); }
        function ms(e) { do {
            var t;
            if ((t = 13 === e.tag) && (t = null === (t = e.memoizedState) || null !== t.dehydrated), t)
                return e;
            e = e.return;
        } while (null !== e); return null; }
        function xs(e, t, n, r, i) { return 0 === (1 & e.mode) ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, 1 === n.tag && (null === n.alternate ? n.tag = 17 : ((t = Ma(-1, 1)).tag = 2, Ia(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = i, e); }
        var bs = v.ReactCurrentOwner, ys = !1;
        function vs(e, t, n, r) { t.child = null === e ? wa(t, null, n, r) : va(t, e.child, n, r); }
        function ws(e, t, n, r, i) { n = n.render; var a = t.ref; return Ea(t, i), r = mo(e, t, n, r, a, i), n = xo(), null === e || ys ? (ia && n && ea(t), t.flags |= 1, vs(e, t, r, i), t.child) : (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~i, Hs(e, t, i)); }
        function js(e, t, n, r, i) { if (null === e) {
            var a = n.type;
            return "function" !== typeof a || Pc(a) || void 0 !== a.defaultProps || null !== n.compare || void 0 !== n.defaultProps ? ((e = Oc(n.type, null, r, t, t.mode, i)).ref = t.ref, e.return = t, t.child = e) : (t.tag = 15, t.type = a, ks(e, t, a, r, i));
        } if (a = e.child, 0 === (e.lanes & i)) {
            var o = a.memoizedProps;
            if ((n = null !== (n = n.compare) ? n : lr)(o, r) && e.ref === t.ref)
                return Hs(e, t, i);
        } return t.flags |= 1, (e = Lc(a, r)).ref = t.ref, e.return = t, t.child = e; }
        function ks(e, t, n, r, i) { if (null !== e) {
            var a = e.memoizedProps;
            if (lr(a, r) && e.ref === t.ref) {
                if (ys = !1, t.pendingProps = r = a, 0 === (e.lanes & i))
                    return t.lanes = e.lanes, Hs(e, t, i);
                0 !== (131072 & e.flags) && (ys = !0);
            }
        } return Cs(e, t, n, r, i); }
        function Ss(e, t, n) { var r = t.pendingProps, i = r.children, a = null !== e ? e.memoizedState : null; if ("hidden" === r.mode)
            if (0 === (1 & t.mode))
                t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ci(Ll, Pl), Pl |= n;
            else {
                if (0 === (1073741824 & n))
                    return e = null !== a ? a.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Ci(Ll, Pl), Pl |= e, null;
                t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = null !== a ? a.baseLanes : n, Ci(Ll, Pl), Pl |= r;
            }
        else
            null !== a ? (r = a.baseLanes | n, t.memoizedState = null) : r = n, Ci(Ll, Pl), Pl |= r; return vs(e, t, i, n), t.child; }
        function Ns(e, t) { var n = t.ref; (null === e && null !== n || null !== e && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152); }
        function Cs(e, t, n, r, i) { var a = Li(n) ? Ri : Ai.current; return a = Pi(t, a), Ea(t, i), n = mo(e, t, n, r, a, i), r = xo(), null === e || ys ? (ia && r && ea(t), t.flags |= 1, vs(e, t, n, i), t.child) : (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~i, Hs(e, t, i)); }
        function Ts(e, t, n, r, i) { if (Li(n)) {
            var a = !0;
            Di(t);
        }
        else
            a = !1; if (Ea(t, i), null === t.stateNode)
            Ws(e, t), os(t, n, r), ls(t, n, r, i), r = !0;
        else if (null === e) {
            var o = t.stateNode, s = t.memoizedProps;
            o.props = s;
            var l = o.context, c = n.contextType;
            "object" === typeof c && null !== c ? c = Ra(c) : c = Pi(t, c = Li(n) ? Ri : Ai.current);
            var d = n.getDerivedStateFromProps, u = "function" === typeof d || "function" === typeof o.getSnapshotBeforeUpdate;
            u || "function" !== typeof o.UNSAFE_componentWillReceiveProps && "function" !== typeof o.componentWillReceiveProps || (s !== r || l !== c) && ss(t, o, r, c), Ba = !1;
            var p = t.memoizedState;
            o.state = p, Wa(t, r, o, i), l = t.memoizedState, s !== r || p !== l || Ei.current || Ba ? ("function" === typeof d && (rs(t, n, d, r), l = t.memoizedState), (s = Ba || as(t, n, s, r, p, l, c)) ? (u || "function" !== typeof o.UNSAFE_componentWillMount && "function" !== typeof o.componentWillMount || ("function" === typeof o.componentWillMount && o.componentWillMount(), "function" === typeof o.UNSAFE_componentWillMount && o.UNSAFE_componentWillMount()), "function" === typeof o.componentDidMount && (t.flags |= 4194308)) : ("function" === typeof o.componentDidMount && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), o.props = r, o.state = l, o.context = c, r = s) : ("function" === typeof o.componentDidMount && (t.flags |= 4194308), r = !1);
        }
        else {
            o = t.stateNode, Fa(e, t), s = t.memoizedProps, c = t.type === t.elementType ? s : ns(t.type, s), o.props = c, u = t.pendingProps, p = o.context, "object" === typeof (l = n.contextType) && null !== l ? l = Ra(l) : l = Pi(t, l = Li(n) ? Ri : Ai.current);
            var h = n.getDerivedStateFromProps;
            (d = "function" === typeof h || "function" === typeof o.getSnapshotBeforeUpdate) || "function" !== typeof o.UNSAFE_componentWillReceiveProps && "function" !== typeof o.componentWillReceiveProps || (s !== u || p !== l) && ss(t, o, r, l), Ba = !1, p = t.memoizedState, o.state = p, Wa(t, r, o, i);
            var f = t.memoizedState;
            s !== u || p !== f || Ei.current || Ba ? ("function" === typeof h && (rs(t, n, h, r), f = t.memoizedState), (c = Ba || as(t, n, c, r, p, f, l) || !1) ? (d || "function" !== typeof o.UNSAFE_componentWillUpdate && "function" !== typeof o.componentWillUpdate || ("function" === typeof o.componentWillUpdate && o.componentWillUpdate(r, f, l), "function" === typeof o.UNSAFE_componentWillUpdate && o.UNSAFE_componentWillUpdate(r, f, l)), "function" === typeof o.componentDidUpdate && (t.flags |= 4), "function" === typeof o.getSnapshotBeforeUpdate && (t.flags |= 1024)) : ("function" !== typeof o.componentDidUpdate || s === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), "function" !== typeof o.getSnapshotBeforeUpdate || s === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = f), o.props = r, o.state = f, o.context = l, r = c) : ("function" !== typeof o.componentDidUpdate || s === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), "function" !== typeof o.getSnapshotBeforeUpdate || s === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), r = !1);
        } return As(e, t, n, r, a, i); }
        function As(e, t, n, r, i, a) { Ns(e, t); var o = 0 !== (128 & t.flags); if (!r && !o)
            return i && Fi(t, n, !1), Hs(e, t, a); r = t.stateNode, bs.current = t; var s = o && "function" !== typeof n.getDerivedStateFromError ? null : r.render(); return t.flags |= 1, null !== e && o ? (t.child = va(t, e.child, null, a), t.child = va(t, null, s, a)) : vs(e, t, s, a), t.memoizedState = r.state, i && Fi(t, n, !0), t.child; }
        function Es(e) { var t = e.stateNode; t.pendingContext ? zi(0, t.pendingContext, t.pendingContext !== t.context) : t.context && zi(0, t.context, !1), Xa(e, t.containerInfo); }
        function Rs(e, t, n, r, i) { return ha(), fa(i), t.flags |= 256, vs(e, t, n, r), t.child; }
        var Ps, Ls, Os, zs = { dehydrated: null, treeContext: null, retryLane: 0 };
        function Bs(e) { return { baseLanes: e, cachePool: null, transitions: null }; }
        function Ds(e, t, n) { var r, i = t.pendingProps, o = $a.current, s = !1, l = 0 !== (128 & t.flags); if ((r = l) || (r = (null === e || null !== e.memoizedState) && 0 !== (2 & o)), r ? (s = !0, t.flags &= -129) : null !== e && null === e.memoizedState || (o |= 1), Ci($a, 1 & o), null === e)
            return ca(t), null !== (e = t.memoizedState) && null !== (e = e.dehydrated) ? (0 === (1 & t.mode) ? t.lanes = 1 : "$!" === e.data ? t.lanes = 8 : t.lanes = 1073741824, null) : (l = i.children, e = i.fallback, s ? (i = t.mode, s = t.child, l = { mode: "hidden", children: l }, 0 === (1 & i) && null !== s ? (s.childLanes = 0, s.pendingProps = l) : s = Bc(l, i, 0, null), e = zc(e, i, n, null), s.return = t, e.return = t, s.sibling = e, t.child = s, t.child.memoizedState = Bs(n), t.memoizedState = zs, e) : Fs(t, l)); if (null !== (o = e.memoizedState) && null !== (r = o.dehydrated))
            return function (e, t, n, r, i, o, s) { if (n)
                return 256 & t.flags ? (t.flags &= -257, Ms(e, t, s, r = ds(Error(a(422))))) : null !== t.memoizedState ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, i = t.mode, r = Bc({ mode: "visible", children: r.children }, i, 0, null), (o = zc(o, i, s, null)).flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, 0 !== (1 & t.mode) && va(t, e.child, null, s), t.child.memoizedState = Bs(s), t.memoizedState = zs, o); if (0 === (1 & t.mode))
                return Ms(e, t, s, null); if ("$!" === i.data) {
                if (r = i.nextSibling && i.nextSibling.dataset)
                    var l = r.dgst;
                return r = l, Ms(e, t, s, r = ds(o = Error(a(419)), r, void 0));
            } if (l = 0 !== (s & e.childLanes), ys || l) {
                if (null !== (r = Al)) {
                    switch (s & -s) {
                        case 4:
                            i = 2;
                            break;
                        case 16:
                            i = 8;
                            break;
                        case 64:
                        case 128:
                        case 256:
                        case 512:
                        case 1024:
                        case 2048:
                        case 4096:
                        case 8192:
                        case 16384:
                        case 32768:
                        case 65536:
                        case 131072:
                        case 262144:
                        case 524288:
                        case 1048576:
                        case 2097152:
                        case 4194304:
                        case 8388608:
                        case 16777216:
                        case 33554432:
                        case 67108864:
                            i = 32;
                            break;
                        case 536870912:
                            i = 268435456;
                            break;
                        default: i = 0;
                    }
                    0 !== (i = 0 !== (i & (r.suspendedLanes | s)) ? 0 : i) && i !== o.retryLane && (o.retryLane = i, za(e, i), tc(r, e, i, -1));
                }
                return fc(), Ms(e, t, s, r = ds(Error(a(421))));
            } return "$?" === i.data ? (t.flags |= 128, t.child = e.child, t = Cc.bind(null, e), i._reactRetry = t, null) : (e = o.treeContext, ra = ci(i.nextSibling), na = t, ia = !0, aa = null, null !== e && (Gi[Yi++] = Ji, Gi[Yi++] = Qi, Gi[Yi++] = Xi, Ji = e.id, Qi = e.overflow, Xi = t), t = Fs(t, r.children), t.flags |= 4096, t); }(e, t, l, i, r, o, n); if (s) {
            s = i.fallback, l = t.mode, r = (o = e.child).sibling;
            var c = { mode: "hidden", children: i.children };
            return 0 === (1 & l) && t.child !== o ? ((i = t.child).childLanes = 0, i.pendingProps = c, t.deletions = null) : (i = Lc(o, c)).subtreeFlags = 14680064 & o.subtreeFlags, null !== r ? s = Lc(r, s) : (s = zc(s, l, n, null)).flags |= 2, s.return = t, i.return = t, i.sibling = s, t.child = i, i = s, s = t.child, l = null === (l = e.child.memoizedState) ? Bs(n) : { baseLanes: l.baseLanes | n, cachePool: null, transitions: l.transitions }, s.memoizedState = l, s.childLanes = e.childLanes & ~n, t.memoizedState = zs, i;
        } return e = (s = e.child).sibling, i = Lc(s, { mode: "visible", children: i.children }), 0 === (1 & t.mode) && (i.lanes = n), i.return = t, i.sibling = null, null !== e && (null === (n = t.deletions) ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = i, t.memoizedState = null, i; }
        function Fs(e, t) { return (t = Bc({ mode: "visible", children: t }, e.mode, 0, null)).return = e, e.child = t; }
        function Ms(e, t, n, r) { return null !== r && fa(r), va(t, e.child, null, n), (e = Fs(t, t.pendingProps.children)).flags |= 2, t.memoizedState = null, e; }
        function Is(e, t, n) { e.lanes |= t; var r = e.alternate; null !== r && (r.lanes |= t), Aa(e.return, t, n); }
        function Us(e, t, n, r, i) { var a = e.memoizedState; null === a ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: i } : (a.isBackwards = t, a.rendering = null, a.renderingStartTime = 0, a.last = r, a.tail = n, a.tailMode = i); }
        function _s(e, t, n) { var r = t.pendingProps, i = r.revealOrder, a = r.tail; if (vs(e, t, r.children, n), 0 !== (2 & (r = $a.current)))
            r = 1 & r | 2, t.flags |= 128;
        else {
            if (null !== e && 0 !== (128 & e.flags))
                e: for (e = t.child; null !== e;) {
                    if (13 === e.tag)
                        null !== e.memoizedState && Is(e, n, t);
                    else if (19 === e.tag)
                        Is(e, n, t);
                    else if (null !== e.child) {
                        e.child.return = e, e = e.child;
                        continue;
                    }
                    if (e === t)
                        break e;
                    for (; null === e.sibling;) {
                        if (null === e.return || e.return === t)
                            break e;
                        e = e.return;
                    }
                    e.sibling.return = e.return, e = e.sibling;
                }
            r &= 1;
        } if (Ci($a, r), 0 === (1 & t.mode))
            t.memoizedState = null;
        else
            switch (i) {
                case "forwards":
                    for (n = t.child, i = null; null !== n;)
                        null !== (e = n.alternate) && null === eo(e) && (i = n), n = n.sibling;
                    null === (n = i) ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Us(t, !1, i, n, a);
                    break;
                case "backwards":
                    for (n = null, i = t.child, t.child = null; null !== i;) {
                        if (null !== (e = i.alternate) && null === eo(e)) {
                            t.child = i;
                            break;
                        }
                        e = i.sibling, i.sibling = n, n = i, i = e;
                    }
                    Us(t, !0, n, null, a);
                    break;
                case "together":
                    Us(t, !1, null, null, void 0);
                    break;
                default: t.memoizedState = null;
            } return t.child; }
        function Ws(e, t) { 0 === (1 & t.mode) && null !== e && (e.alternate = null, t.alternate = null, t.flags |= 2); }
        function Hs(e, t, n) { if (null !== e && (t.dependencies = e.dependencies), Bl |= t.lanes, 0 === (n & t.childLanes))
            return null; if (null !== e && t.child !== e.child)
            throw Error(a(153)); if (null !== t.child) {
            for (n = Lc(e = t.child, e.pendingProps), t.child = n, n.return = t; null !== e.sibling;)
                e = e.sibling, (n = n.sibling = Lc(e, e.pendingProps)).return = t;
            n.sibling = null;
        } return t.child; }
        function Vs(e, t) { if (!ia)
            switch (e.tailMode) {
                case "hidden":
                    t = e.tail;
                    for (var n = null; null !== t;)
                        null !== t.alternate && (n = t), t = t.sibling;
                    null === n ? e.tail = null : n.sibling = null;
                    break;
                case "collapsed":
                    n = e.tail;
                    for (var r = null; null !== n;)
                        null !== n.alternate && (r = n), n = n.sibling;
                    null === r ? t || null === e.tail ? e.tail = null : e.tail.sibling = null : r.sibling = null;
            } }
        function qs(e) { var t = null !== e.alternate && e.alternate.child === e.child, n = 0, r = 0; if (t)
            for (var i = e.child; null !== i;)
                n |= i.lanes | i.childLanes, r |= 14680064 & i.subtreeFlags, r |= 14680064 & i.flags, i.return = e, i = i.sibling;
        else
            for (i = e.child; null !== i;)
                n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling; return e.subtreeFlags |= r, e.childLanes = n, t; }
        function Ks(e, t, n) { var r = t.pendingProps; switch (ta(t), t.tag) {
            case 2:
            case 16:
            case 15:
            case 0:
            case 11:
            case 7:
            case 8:
            case 12:
            case 9:
            case 14: return qs(t), null;
            case 1:
            case 17: return Li(t.type) && Oi(), qs(t), null;
            case 3: return r = t.stateNode, Ja(), Ni(Ei), Ni(Ai), no(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), null !== e && null !== e.child || (ua(t) ? t.flags |= 4 : null === e || e.memoizedState.isDehydrated && 0 === (256 & t.flags) || (t.flags |= 1024, null !== aa && (ac(aa), aa = null))), qs(t), null;
            case 5:
                Za(t);
                var i = Ya(Ga.current);
                if (n = t.type, null !== e && null != t.stateNode)
                    Ls(e, t, n, r), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
                else {
                    if (!r) {
                        if (null === t.stateNode)
                            throw Error(a(166));
                        return qs(t), null;
                    }
                    if (e = Ya(qa.current), ua(t)) {
                        r = t.stateNode, n = t.type;
                        var o = t.memoizedProps;
                        switch (r[pi] = t, r[hi] = o, e = 0 !== (1 & t.mode), n) {
                            case "dialog":
                                Ir("cancel", r), Ir("close", r);
                                break;
                            case "iframe":
                            case "object":
                            case "embed":
                                Ir("load", r);
                                break;
                            case "video":
                            case "audio":
                                for (i = 0; i < Br.length; i++)
                                    Ir(Br[i], r);
                                break;
                            case "source":
                                Ir("error", r);
                                break;
                            case "img":
                            case "image":
                            case "link":
                                Ir("error", r), Ir("load", r);
                                break;
                            case "details":
                                Ir("toggle", r);
                                break;
                            case "input":
                                J(r, o), Ir("invalid", r);
                                break;
                            case "select":
                                r._wrapperState = { wasMultiple: !!o.multiple }, Ir("invalid", r);
                                break;
                            case "textarea": ie(r, o), Ir("invalid", r);
                        }
                        for (var l in be(n, o), i = null, o)
                            if (o.hasOwnProperty(l)) {
                                var c = o[l];
                                "children" === l ? "string" === typeof c ? r.textContent !== c && (!0 !== o.suppressHydrationWarning && Zr(r.textContent, c, e), i = ["children", c]) : "number" === typeof c && r.textContent !== "" + c && (!0 !== o.suppressHydrationWarning && Zr(r.textContent, c, e), i = ["children", "" + c]) : s.hasOwnProperty(l) && null != c && "onScroll" === l && Ir("scroll", r);
                            }
                        switch (n) {
                            case "input":
                                K(r), $(r, o, !0);
                                break;
                            case "textarea":
                                K(r), oe(r);
                                break;
                            case "select":
                            case "option": break;
                            default: "function" === typeof o.onClick && (r.onclick = $r);
                        }
                        r = i, t.updateQueue = r, null !== r && (t.flags |= 4);
                    }
                    else {
                        l = 9 === i.nodeType ? i : i.ownerDocument, "http://www.w3.org/1999/xhtml" === e && (e = se(n)), "http://www.w3.org/1999/xhtml" === e ? "script" === n ? ((e = l.createElement("div")).innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : "string" === typeof r.is ? e = l.createElement(n, { is: r.is }) : (e = l.createElement(n), "select" === n && (l = e, r.multiple ? l.multiple = !0 : r.size && (l.size = r.size))) : e = l.createElementNS(e, n), e[pi] = t, e[hi] = r, Ps(e, t), t.stateNode = e;
                        e: {
                            switch (l = ye(n, r), n) {
                                case "dialog":
                                    Ir("cancel", e), Ir("close", e), i = r;
                                    break;
                                case "iframe":
                                case "object":
                                case "embed":
                                    Ir("load", e), i = r;
                                    break;
                                case "video":
                                case "audio":
                                    for (i = 0; i < Br.length; i++)
                                        Ir(Br[i], e);
                                    i = r;
                                    break;
                                case "source":
                                    Ir("error", e), i = r;
                                    break;
                                case "img":
                                case "image":
                                case "link":
                                    Ir("error", e), Ir("load", e), i = r;
                                    break;
                                case "details":
                                    Ir("toggle", e), i = r;
                                    break;
                                case "input":
                                    J(e, r), i = X(e, r), Ir("invalid", e);
                                    break;
                                case "option":
                                default:
                                    i = r;
                                    break;
                                case "select":
                                    e._wrapperState = { wasMultiple: !!r.multiple }, i = F({}, r, { value: void 0 }), Ir("invalid", e);
                                    break;
                                case "textarea": ie(e, r), i = re(e, r), Ir("invalid", e);
                            }
                            for (o in be(n, i), c = i)
                                if (c.hasOwnProperty(o)) {
                                    var d = c[o];
                                    "style" === o ? me(e, d) : "dangerouslySetInnerHTML" === o ? null != (d = d ? d.__html : void 0) && ue(e, d) : "children" === o ? "string" === typeof d ? ("textarea" !== n || "" !== d) && pe(e, d) : "number" === typeof d && pe(e, "" + d) : "suppressContentEditableWarning" !== o && "suppressHydrationWarning" !== o && "autoFocus" !== o && (s.hasOwnProperty(o) ? null != d && "onScroll" === o && Ir("scroll", e) : null != d && y(e, o, d, l));
                                }
                            switch (n) {
                                case "input":
                                    K(e), $(e, r, !1);
                                    break;
                                case "textarea":
                                    K(e), oe(e);
                                    break;
                                case "option":
                                    null != r.value && e.setAttribute("value", "" + V(r.value));
                                    break;
                                case "select":
                                    e.multiple = !!r.multiple, null != (o = r.value) ? ne(e, !!r.multiple, o, !1) : null != r.defaultValue && ne(e, !!r.multiple, r.defaultValue, !0);
                                    break;
                                default: "function" === typeof i.onClick && (e.onclick = $r);
                            }
                            switch (n) {
                                case "button":
                                case "input":
                                case "select":
                                case "textarea":
                                    r = !!r.autoFocus;
                                    break e;
                                case "img":
                                    r = !0;
                                    break e;
                                default: r = !1;
                            }
                        }
                        r && (t.flags |= 4);
                    }
                    null !== t.ref && (t.flags |= 512, t.flags |= 2097152);
                }
                return qs(t), null;
            case 6:
                if (e && null != t.stateNode)
                    Os(0, t, e.memoizedProps, r);
                else {
                    if ("string" !== typeof r && null === t.stateNode)
                        throw Error(a(166));
                    if (n = Ya(Ga.current), Ya(qa.current), ua(t)) {
                        if (r = t.stateNode, n = t.memoizedProps, r[pi] = t, (o = r.nodeValue !== n) && null !== (e = na))
                            switch (e.tag) {
                                case 3:
                                    Zr(r.nodeValue, n, 0 !== (1 & e.mode));
                                    break;
                                case 5: !0 !== e.memoizedProps.suppressHydrationWarning && Zr(r.nodeValue, n, 0 !== (1 & e.mode));
                            }
                        o && (t.flags |= 4);
                    }
                    else
                        (r = (9 === n.nodeType ? n : n.ownerDocument).createTextNode(r))[pi] = t, t.stateNode = r;
                }
                return qs(t), null;
            case 13:
                if (Ni($a), r = t.memoizedState, null === e || null !== e.memoizedState && null !== e.memoizedState.dehydrated) {
                    if (ia && null !== ra && 0 !== (1 & t.mode) && 0 === (128 & t.flags))
                        pa(), ha(), t.flags |= 98560, o = !1;
                    else if (o = ua(t), null !== r && null !== r.dehydrated) {
                        if (null === e) {
                            if (!o)
                                throw Error(a(318));
                            if (!(o = null !== (o = t.memoizedState) ? o.dehydrated : null))
                                throw Error(a(317));
                            o[pi] = t;
                        }
                        else
                            ha(), 0 === (128 & t.flags) && (t.memoizedState = null), t.flags |= 4;
                        qs(t), o = !1;
                    }
                    else
                        null !== aa && (ac(aa), aa = null), o = !0;
                    if (!o)
                        return 65536 & t.flags ? t : null;
                }
                return 0 !== (128 & t.flags) ? (t.lanes = n, t) : ((r = null !== r) !== (null !== e && null !== e.memoizedState) && r && (t.child.flags |= 8192, 0 !== (1 & t.mode) && (null === e || 0 !== (1 & $a.current) ? 0 === Ol && (Ol = 3) : fc())), null !== t.updateQueue && (t.flags |= 4), qs(t), null);
            case 4: return Ja(), null === e && Wr(t.stateNode.containerInfo), qs(t), null;
            case 10: return Ta(t.type._context), qs(t), null;
            case 19:
                if (Ni($a), null === (o = t.memoizedState))
                    return qs(t), null;
                if (r = 0 !== (128 & t.flags), null === (l = o.rendering))
                    if (r)
                        Vs(o, !1);
                    else {
                        if (0 !== Ol || null !== e && 0 !== (128 & e.flags))
                            for (e = t.child; null !== e;) {
                                if (null !== (l = eo(e))) {
                                    for (t.flags |= 128, Vs(o, !1), null !== (r = l.updateQueue) && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; null !== n;)
                                        e = r, (o = n).flags &= 14680066, null === (l = o.alternate) ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = l.childLanes, o.lanes = l.lanes, o.child = l.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = l.memoizedProps, o.memoizedState = l.memoizedState, o.updateQueue = l.updateQueue, o.type = l.type, e = l.dependencies, o.dependencies = null === e ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
                                    return Ci($a, 1 & $a.current | 2), t.child;
                                }
                                e = e.sibling;
                            }
                        null !== o.tail && Qe() > _l && (t.flags |= 128, r = !0, Vs(o, !1), t.lanes = 4194304);
                    }
                else {
                    if (!r)
                        if (null !== (e = eo(l))) {
                            if (t.flags |= 128, r = !0, null !== (n = e.updateQueue) && (t.updateQueue = n, t.flags |= 4), Vs(o, !0), null === o.tail && "hidden" === o.tailMode && !l.alternate && !ia)
                                return qs(t), null;
                        }
                        else
                            2 * Qe() - o.renderingStartTime > _l && 1073741824 !== n && (t.flags |= 128, r = !0, Vs(o, !1), t.lanes = 4194304);
                    o.isBackwards ? (l.sibling = t.child, t.child = l) : (null !== (n = o.last) ? n.sibling = l : t.child = l, o.last = l);
                }
                return null !== o.tail ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Qe(), t.sibling = null, n = $a.current, Ci($a, r ? 1 & n | 2 : 1 & n), t) : (qs(t), null);
            case 22:
            case 23: return dc(), r = null !== t.memoizedState, null !== e && null !== e.memoizedState !== r && (t.flags |= 8192), r && 0 !== (1 & t.mode) ? 0 !== (1073741824 & Pl) && (qs(t), 6 & t.subtreeFlags && (t.flags |= 8192)) : qs(t), null;
            case 24:
            case 25: return null;
        } throw Error(a(156, t.tag)); }
        function Gs(e, t) { switch (ta(t), t.tag) {
            case 1: return Li(t.type) && Oi(), 65536 & (e = t.flags) ? (t.flags = -65537 & e | 128, t) : null;
            case 3: return Ja(), Ni(Ei), Ni(Ai), no(), 0 !== (65536 & (e = t.flags)) && 0 === (128 & e) ? (t.flags = -65537 & e | 128, t) : null;
            case 5: return Za(t), null;
            case 13:
                if (Ni($a), null !== (e = t.memoizedState) && null !== e.dehydrated) {
                    if (null === t.alternate)
                        throw Error(a(340));
                    ha();
                }
                return 65536 & (e = t.flags) ? (t.flags = -65537 & e | 128, t) : null;
            case 19: return Ni($a), null;
            case 4: return Ja(), null;
            case 10: return Ta(t.type._context), null;
            case 22:
            case 23: return dc(), null;
            default: return null;
        } }
        Ps = function (e, t) { for (var n = t.child; null !== n;) {
            if (5 === n.tag || 6 === n.tag)
                e.appendChild(n.stateNode);
            else if (4 !== n.tag && null !== n.child) {
                n.child.return = n, n = n.child;
                continue;
            }
            if (n === t)
                break;
            for (; null === n.sibling;) {
                if (null === n.return || n.return === t)
                    return;
                n = n.return;
            }
            n.sibling.return = n.return, n = n.sibling;
        } }, Ls = function (e, t, n, r) { var i = e.memoizedProps; if (i !== r) {
            e = t.stateNode, Ya(qa.current);
            var a, o = null;
            switch (n) {
                case "input":
                    i = X(e, i), r = X(e, r), o = [];
                    break;
                case "select":
                    i = F({}, i, { value: void 0 }), r = F({}, r, { value: void 0 }), o = [];
                    break;
                case "textarea":
                    i = re(e, i), r = re(e, r), o = [];
                    break;
                default: "function" !== typeof i.onClick && "function" === typeof r.onClick && (e.onclick = $r);
            }
            for (d in be(n, r), n = null, i)
                if (!r.hasOwnProperty(d) && i.hasOwnProperty(d) && null != i[d])
                    if ("style" === d) {
                        var l = i[d];
                        for (a in l)
                            l.hasOwnProperty(a) && (n || (n = {}), n[a] = "");
                    }
                    else
                        "dangerouslySetInnerHTML" !== d && "children" !== d && "suppressContentEditableWarning" !== d && "suppressHydrationWarning" !== d && "autoFocus" !== d && (s.hasOwnProperty(d) ? o || (o = []) : (o = o || []).push(d, null));
            for (d in r) {
                var c = r[d];
                if (l = null != i ? i[d] : void 0, r.hasOwnProperty(d) && c !== l && (null != c || null != l))
                    if ("style" === d)
                        if (l) {
                            for (a in l)
                                !l.hasOwnProperty(a) || c && c.hasOwnProperty(a) || (n || (n = {}), n[a] = "");
                            for (a in c)
                                c.hasOwnProperty(a) && l[a] !== c[a] && (n || (n = {}), n[a] = c[a]);
                        }
                        else
                            n || (o || (o = []), o.push(d, n)), n = c;
                    else
                        "dangerouslySetInnerHTML" === d ? (c = c ? c.__html : void 0, l = l ? l.__html : void 0, null != c && l !== c && (o = o || []).push(d, c)) : "children" === d ? "string" !== typeof c && "number" !== typeof c || (o = o || []).push(d, "" + c) : "suppressContentEditableWarning" !== d && "suppressHydrationWarning" !== d && (s.hasOwnProperty(d) ? (null != c && "onScroll" === d && Ir("scroll", e), o || l === c || (o = [])) : (o = o || []).push(d, c));
            }
            n && (o = o || []).push("style", n);
            var d = o;
            (t.updateQueue = d) && (t.flags |= 4);
        } }, Os = function (e, t, n, r) { n !== r && (t.flags |= 4); };
        var Ys = !1, Xs = !1, Js = "function" === typeof WeakSet ? WeakSet : Set, Qs = null;
        function Zs(e, t) { var n = e.ref; if (null !== n)
            if ("function" === typeof n)
                try {
                    n(null);
                }
                catch (r) {
                    kc(e, t, r);
                }
            else
                n.current = null; }
        function $s(e, t, n) { try {
            n();
        }
        catch (r) {
            kc(e, t, r);
        } }
        var el = !1;
        function tl(e, t, n) { var r = t.updateQueue; if (null !== (r = null !== r ? r.lastEffect : null)) {
            var i = r = r.next;
            do {
                if ((i.tag & e) === e) {
                    var a = i.destroy;
                    i.destroy = void 0, void 0 !== a && $s(t, n, a);
                }
                i = i.next;
            } while (i !== r);
        } }
        function nl(e, t) { if (null !== (t = null !== (t = t.updateQueue) ? t.lastEffect : null)) {
            var n = t = t.next;
            do {
                if ((n.tag & e) === e) {
                    var r = n.create;
                    n.destroy = r();
                }
                n = n.next;
            } while (n !== t);
        } }
        function rl(e) { var t = e.ref; if (null !== t) {
            var n = e.stateNode;
            e.tag, e = n, "function" === typeof t ? t(e) : t.current = e;
        } }
        function il(e) { var t = e.alternate; null !== t && (e.alternate = null, il(t)), e.child = null, e.deletions = null, e.sibling = null, 5 === e.tag && (null !== (t = e.stateNode) && (delete t[pi], delete t[hi], delete t[gi], delete t[mi], delete t[xi])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null; }
        function al(e) { return 5 === e.tag || 3 === e.tag || 4 === e.tag; }
        function ol(e) { e: for (;;) {
            for (; null === e.sibling;) {
                if (null === e.return || al(e.return))
                    return null;
                e = e.return;
            }
            for (e.sibling.return = e.return, e = e.sibling; 5 !== e.tag && 6 !== e.tag && 18 !== e.tag;) {
                if (2 & e.flags)
                    continue e;
                if (null === e.child || 4 === e.tag)
                    continue e;
                e.child.return = e, e = e.child;
            }
            if (!(2 & e.flags))
                return e.stateNode;
        } }
        function sl(e, t, n) { var r = e.tag; if (5 === r || 6 === r)
            e = e.stateNode, t ? 8 === n.nodeType ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (8 === n.nodeType ? (t = n.parentNode).insertBefore(e, n) : (t = n).appendChild(e), null !== (n = n._reactRootContainer) && void 0 !== n || null !== t.onclick || (t.onclick = $r));
        else if (4 !== r && null !== (e = e.child))
            for (sl(e, t, n), e = e.sibling; null !== e;)
                sl(e, t, n), e = e.sibling; }
        function ll(e, t, n) { var r = e.tag; if (5 === r || 6 === r)
            e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
        else if (4 !== r && null !== (e = e.child))
            for (ll(e, t, n), e = e.sibling; null !== e;)
                ll(e, t, n), e = e.sibling; }
        var cl = null, dl = !1;
        function ul(e, t, n) { for (n = n.child; null !== n;)
            pl(e, t, n), n = n.sibling; }
        function pl(e, t, n) { if (at && "function" === typeof at.onCommitFiberUnmount)
            try {
                at.onCommitFiberUnmount(it, n);
            }
            catch (s) { } switch (n.tag) {
            case 5: Xs || Zs(n, t);
            case 6:
                var r = cl, i = dl;
                cl = null, ul(e, t, n), dl = i, null !== (cl = r) && (dl ? (e = cl, n = n.stateNode, 8 === e.nodeType ? e.parentNode.removeChild(n) : e.removeChild(n)) : cl.removeChild(n.stateNode));
                break;
            case 18:
                null !== cl && (dl ? (e = cl, n = n.stateNode, 8 === e.nodeType ? li(e.parentNode, n) : 1 === e.nodeType && li(e, n), Wt(e)) : li(cl, n.stateNode));
                break;
            case 4:
                r = cl, i = dl, cl = n.stateNode.containerInfo, dl = !0, ul(e, t, n), cl = r, dl = i;
                break;
            case 0:
            case 11:
            case 14:
            case 15:
                if (!Xs && (null !== (r = n.updateQueue) && null !== (r = r.lastEffect))) {
                    i = r = r.next;
                    do {
                        var a = i, o = a.destroy;
                        a = a.tag, void 0 !== o && (0 !== (2 & a) || 0 !== (4 & a)) && $s(n, t, o), i = i.next;
                    } while (i !== r);
                }
                ul(e, t, n);
                break;
            case 1:
                if (!Xs && (Zs(n, t), "function" === typeof (r = n.stateNode).componentWillUnmount))
                    try {
                        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
                    }
                    catch (s) {
                        kc(n, t, s);
                    }
                ul(e, t, n);
                break;
            case 21:
                ul(e, t, n);
                break;
            case 22:
                1 & n.mode ? (Xs = (r = Xs) || null !== n.memoizedState, ul(e, t, n), Xs = r) : ul(e, t, n);
                break;
            default: ul(e, t, n);
        } }
        function hl(e) { var t = e.updateQueue; if (null !== t) {
            e.updateQueue = null;
            var n = e.stateNode;
            null === n && (n = e.stateNode = new Js), t.forEach(function (t) { var r = Tc.bind(null, e, t); n.has(t) || (n.add(t), t.then(r, r)); });
        } }
        function fl(e, t) { var n = t.deletions; if (null !== n)
            for (var r = 0; r < n.length; r++) {
                var i = n[r];
                try {
                    var o = e, s = t, l = s;
                    e: for (; null !== l;) {
                        switch (l.tag) {
                            case 5:
                                cl = l.stateNode, dl = !1;
                                break e;
                            case 3:
                            case 4:
                                cl = l.stateNode.containerInfo, dl = !0;
                                break e;
                        }
                        l = l.return;
                    }
                    if (null === cl)
                        throw Error(a(160));
                    pl(o, s, i), cl = null, dl = !1;
                    var c = i.alternate;
                    null !== c && (c.return = null), i.return = null;
                }
                catch (d) {
                    kc(i, t, d);
                }
            } if (12854 & t.subtreeFlags)
            for (t = t.child; null !== t;)
                gl(t, e), t = t.sibling; }
        function gl(e, t) { var n = e.alternate, r = e.flags; switch (e.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
                if (fl(t, e), ml(e), 4 & r) {
                    try {
                        tl(3, e, e.return), nl(3, e);
                    }
                    catch (m) {
                        kc(e, e.return, m);
                    }
                    try {
                        tl(5, e, e.return);
                    }
                    catch (m) {
                        kc(e, e.return, m);
                    }
                }
                break;
            case 1:
                fl(t, e), ml(e), 512 & r && null !== n && Zs(n, n.return);
                break;
            case 5:
                if (fl(t, e), ml(e), 512 & r && null !== n && Zs(n, n.return), 32 & e.flags) {
                    var i = e.stateNode;
                    try {
                        pe(i, "");
                    }
                    catch (m) {
                        kc(e, e.return, m);
                    }
                }
                if (4 & r && null != (i = e.stateNode)) {
                    var o = e.memoizedProps, s = null !== n ? n.memoizedProps : o, l = e.type, c = e.updateQueue;
                    if (e.updateQueue = null, null !== c)
                        try {
                            "input" === l && "radio" === o.type && null != o.name && Q(i, o), ye(l, s);
                            var d = ye(l, o);
                            for (s = 0; s < c.length; s += 2) {
                                var u = c[s], p = c[s + 1];
                                "style" === u ? me(i, p) : "dangerouslySetInnerHTML" === u ? ue(i, p) : "children" === u ? pe(i, p) : y(i, u, p, d);
                            }
                            switch (l) {
                                case "input":
                                    Z(i, o);
                                    break;
                                case "textarea":
                                    ae(i, o);
                                    break;
                                case "select":
                                    var h = i._wrapperState.wasMultiple;
                                    i._wrapperState.wasMultiple = !!o.multiple;
                                    var f = o.value;
                                    null != f ? ne(i, !!o.multiple, f, !1) : h !== !!o.multiple && (null != o.defaultValue ? ne(i, !!o.multiple, o.defaultValue, !0) : ne(i, !!o.multiple, o.multiple ? [] : "", !1));
                            }
                            i[hi] = o;
                        }
                        catch (m) {
                            kc(e, e.return, m);
                        }
                }
                break;
            case 6:
                if (fl(t, e), ml(e), 4 & r) {
                    if (null === e.stateNode)
                        throw Error(a(162));
                    i = e.stateNode, o = e.memoizedProps;
                    try {
                        i.nodeValue = o;
                    }
                    catch (m) {
                        kc(e, e.return, m);
                    }
                }
                break;
            case 3:
                if (fl(t, e), ml(e), 4 & r && null !== n && n.memoizedState.isDehydrated)
                    try {
                        Wt(t.containerInfo);
                    }
                    catch (m) {
                        kc(e, e.return, m);
                    }
                break;
            case 4:
            default:
                fl(t, e), ml(e);
                break;
            case 13:
                fl(t, e), ml(e), 8192 & (i = e.child).flags && (o = null !== i.memoizedState, i.stateNode.isHidden = o, !o || null !== i.alternate && null !== i.alternate.memoizedState || (Ul = Qe())), 4 & r && hl(e);
                break;
            case 22:
                if (u = null !== n && null !== n.memoizedState, 1 & e.mode ? (Xs = (d = Xs) || u, fl(t, e), Xs = d) : fl(t, e), ml(e), 8192 & r) {
                    if (d = null !== e.memoizedState, (e.stateNode.isHidden = d) && !u && 0 !== (1 & e.mode))
                        for (Qs = e, u = e.child; null !== u;) {
                            for (p = Qs = u; null !== Qs;) {
                                switch (f = (h = Qs).child, h.tag) {
                                    case 0:
                                    case 11:
                                    case 14:
                                    case 15:
                                        tl(4, h, h.return);
                                        break;
                                    case 1:
                                        Zs(h, h.return);
                                        var g = h.stateNode;
                                        if ("function" === typeof g.componentWillUnmount) {
                                            r = h, n = h.return;
                                            try {
                                                t = r, g.props = t.memoizedProps, g.state = t.memoizedState, g.componentWillUnmount();
                                            }
                                            catch (m) {
                                                kc(r, n, m);
                                            }
                                        }
                                        break;
                                    case 5:
                                        Zs(h, h.return);
                                        break;
                                    case 22: if (null !== h.memoizedState) {
                                        vl(p);
                                        continue;
                                    }
                                }
                                null !== f ? (f.return = h, Qs = f) : vl(p);
                            }
                            u = u.sibling;
                        }
                    e: for (u = null, p = e;;) {
                        if (5 === p.tag) {
                            if (null === u) {
                                u = p;
                                try {
                                    i = p.stateNode, d ? "function" === typeof (o = i.style).setProperty ? o.setProperty("display", "none", "important") : o.display = "none" : (l = p.stateNode, s = void 0 !== (c = p.memoizedProps.style) && null !== c && c.hasOwnProperty("display") ? c.display : null, l.style.display = ge("display", s));
                                }
                                catch (m) {
                                    kc(e, e.return, m);
                                }
                            }
                        }
                        else if (6 === p.tag) {
                            if (null === u)
                                try {
                                    p.stateNode.nodeValue = d ? "" : p.memoizedProps;
                                }
                                catch (m) {
                                    kc(e, e.return, m);
                                }
                        }
                        else if ((22 !== p.tag && 23 !== p.tag || null === p.memoizedState || p === e) && null !== p.child) {
                            p.child.return = p, p = p.child;
                            continue;
                        }
                        if (p === e)
                            break e;
                        for (; null === p.sibling;) {
                            if (null === p.return || p.return === e)
                                break e;
                            u === p && (u = null), p = p.return;
                        }
                        u === p && (u = null), p.sibling.return = p.return, p = p.sibling;
                    }
                }
                break;
            case 19: fl(t, e), ml(e), 4 & r && hl(e);
            case 21:
        } }
        function ml(e) { var t = e.flags; if (2 & t) {
            try {
                e: {
                    for (var n = e.return; null !== n;) {
                        if (al(n)) {
                            var r = n;
                            break e;
                        }
                        n = n.return;
                    }
                    throw Error(a(160));
                }
                switch (r.tag) {
                    case 5:
                        var i = r.stateNode;
                        32 & r.flags && (pe(i, ""), r.flags &= -33), ll(e, ol(e), i);
                        break;
                    case 3:
                    case 4:
                        var o = r.stateNode.containerInfo;
                        sl(e, ol(e), o);
                        break;
                    default: throw Error(a(161));
                }
            }
            catch (s) {
                kc(e, e.return, s);
            }
            e.flags &= -3;
        } 4096 & t && (e.flags &= -4097); }
        function xl(e, t, n) { Qs = e, bl(e, t, n); }
        function bl(e, t, n) { for (var r = 0 !== (1 & e.mode); null !== Qs;) {
            var i = Qs, a = i.child;
            if (22 === i.tag && r) {
                var o = null !== i.memoizedState || Ys;
                if (!o) {
                    var s = i.alternate, l = null !== s && null !== s.memoizedState || Xs;
                    s = Ys;
                    var c = Xs;
                    if (Ys = o, (Xs = l) && !c)
                        for (Qs = i; null !== Qs;)
                            l = (o = Qs).child, 22 === o.tag && null !== o.memoizedState ? wl(i) : null !== l ? (l.return = o, Qs = l) : wl(i);
                    for (; null !== a;)
                        Qs = a, bl(a, t, n), a = a.sibling;
                    Qs = i, Ys = s, Xs = c;
                }
                yl(e);
            }
            else
                0 !== (8772 & i.subtreeFlags) && null !== a ? (a.return = i, Qs = a) : yl(e);
        } }
        function yl(e) { for (; null !== Qs;) {
            var t = Qs;
            if (0 !== (8772 & t.flags)) {
                var n = t.alternate;
                try {
                    if (0 !== (8772 & t.flags))
                        switch (t.tag) {
                            case 0:
                            case 11:
                            case 15:
                                Xs || nl(5, t);
                                break;
                            case 1:
                                var r = t.stateNode;
                                if (4 & t.flags && !Xs)
                                    if (null === n)
                                        r.componentDidMount();
                                    else {
                                        var i = t.elementType === t.type ? n.memoizedProps : ns(t.type, n.memoizedProps);
                                        r.componentDidUpdate(i, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
                                    }
                                var o = t.updateQueue;
                                null !== o && Ha(t, o, r);
                                break;
                            case 3:
                                var s = t.updateQueue;
                                if (null !== s) {
                                    if (n = null, null !== t.child)
                                        switch (t.child.tag) {
                                            case 5:
                                            case 1: n = t.child.stateNode;
                                        }
                                    Ha(t, s, n);
                                }
                                break;
                            case 5:
                                var l = t.stateNode;
                                if (null === n && 4 & t.flags) {
                                    n = l;
                                    var c = t.memoizedProps;
                                    switch (t.type) {
                                        case "button":
                                        case "input":
                                        case "select":
                                        case "textarea":
                                            c.autoFocus && n.focus();
                                            break;
                                        case "img": c.src && (n.src = c.src);
                                    }
                                }
                                break;
                            case 6:
                            case 4:
                            case 12:
                            case 19:
                            case 17:
                            case 21:
                            case 22:
                            case 23:
                            case 25: break;
                            case 13:
                                if (null === t.memoizedState) {
                                    var d = t.alternate;
                                    if (null !== d) {
                                        var u = d.memoizedState;
                                        if (null !== u) {
                                            var p = u.dehydrated;
                                            null !== p && Wt(p);
                                        }
                                    }
                                }
                                break;
                            default: throw Error(a(163));
                        }
                    Xs || 512 & t.flags && rl(t);
                }
                catch (h) {
                    kc(t, t.return, h);
                }
            }
            if (t === e) {
                Qs = null;
                break;
            }
            if (null !== (n = t.sibling)) {
                n.return = t.return, Qs = n;
                break;
            }
            Qs = t.return;
        } }
        function vl(e) { for (; null !== Qs;) {
            var t = Qs;
            if (t === e) {
                Qs = null;
                break;
            }
            var n = t.sibling;
            if (null !== n) {
                n.return = t.return, Qs = n;
                break;
            }
            Qs = t.return;
        } }
        function wl(e) { for (; null !== Qs;) {
            var t = Qs;
            try {
                switch (t.tag) {
                    case 0:
                    case 11:
                    case 15:
                        var n = t.return;
                        try {
                            nl(4, t);
                        }
                        catch (l) {
                            kc(t, n, l);
                        }
                        break;
                    case 1:
                        var r = t.stateNode;
                        if ("function" === typeof r.componentDidMount) {
                            var i = t.return;
                            try {
                                r.componentDidMount();
                            }
                            catch (l) {
                                kc(t, i, l);
                            }
                        }
                        var a = t.return;
                        try {
                            rl(t);
                        }
                        catch (l) {
                            kc(t, a, l);
                        }
                        break;
                    case 5:
                        var o = t.return;
                        try {
                            rl(t);
                        }
                        catch (l) {
                            kc(t, o, l);
                        }
                }
            }
            catch (l) {
                kc(t, t.return, l);
            }
            if (t === e) {
                Qs = null;
                break;
            }
            var s = t.sibling;
            if (null !== s) {
                s.return = t.return, Qs = s;
                break;
            }
            Qs = t.return;
        } }
        var jl, kl = Math.ceil, Sl = v.ReactCurrentDispatcher, Nl = v.ReactCurrentOwner, Cl = v.ReactCurrentBatchConfig, Tl = 0, Al = null, El = null, Rl = 0, Pl = 0, Ll = Si(0), Ol = 0, zl = null, Bl = 0, Dl = 0, Fl = 0, Ml = null, Il = null, Ul = 0, _l = 1 / 0, Wl = null, Hl = !1, Vl = null, ql = null, Kl = !1, Gl = null, Yl = 0, Xl = 0, Jl = null, Ql = -1, Zl = 0;
        function $l() { return 0 !== (6 & Tl) ? Qe() : -1 !== Ql ? Ql : Ql = Qe(); }
        function ec(e) { return 0 === (1 & e.mode) ? 1 : 0 !== (2 & Tl) && 0 !== Rl ? Rl & -Rl : null !== ga.transition ? (0 === Zl && (Zl = gt()), Zl) : 0 !== (e = yt) ? e : e = void 0 === (e = window.event) ? 16 : Jt(e.type); }
        function tc(e, t, n, r) { if (50 < Xl)
            throw Xl = 0, Jl = null, Error(a(185)); xt(e, n, r), 0 !== (2 & Tl) && e === Al || (e === Al && (0 === (2 & Tl) && (Dl |= n), 4 === Ol && oc(e, Rl)), nc(e, r), 1 === n && 0 === Tl && 0 === (1 & t.mode) && (_l = Qe() + 500, Ii && Wi())); }
        function nc(e, t) { var n = e.callbackNode; !function (e, t) { for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes; 0 < a;) {
            var o = 31 - ot(a), s = 1 << o, l = i[o];
            -1 === l ? 0 !== (s & n) && 0 === (s & r) || (i[o] = ht(s, t)) : l <= t && (e.expiredLanes |= s), a &= ~s;
        } }(e, t); var r = pt(e, e === Al ? Rl : 0); if (0 === r)
            null !== n && Ye(n), e.callbackNode = null, e.callbackPriority = 0;
        else if (t = r & -r, e.callbackPriority !== t) {
            if (null != n && Ye(n), 1 === t)
                0 === e.tag ? function (e) { Ii = !0, _i(e); }(sc.bind(null, e)) : _i(sc.bind(null, e)), oi(function () { 0 === (6 & Tl) && Wi(); }), n = null;
            else {
                switch (vt(r)) {
                    case 1:
                        n = $e;
                        break;
                    case 4:
                        n = et;
                        break;
                    case 16:
                    default:
                        n = tt;
                        break;
                    case 536870912: n = rt;
                }
                n = Ac(n, rc.bind(null, e));
            }
            e.callbackPriority = t, e.callbackNode = n;
        } }
        function rc(e, t) { if (Ql = -1, Zl = 0, 0 !== (6 & Tl))
            throw Error(a(327)); var n = e.callbackNode; if (wc() && e.callbackNode !== n)
            return null; var r = pt(e, e === Al ? Rl : 0); if (0 === r)
            return null; if (0 !== (30 & r) || 0 !== (r & e.expiredLanes) || t)
            t = gc(e, r);
        else {
            t = r;
            var i = Tl;
            Tl |= 2;
            var o = hc();
            for (Al === e && Rl === t || (Wl = null, _l = Qe() + 500, uc(e, t));;)
                try {
                    xc();
                    break;
                }
                catch (l) {
                    pc(e, l);
                }
            Ca(), Sl.current = o, Tl = i, null !== El ? t = 0 : (Al = null, Rl = 0, t = Ol);
        } if (0 !== t) {
            if (2 === t && (0 !== (i = ft(e)) && (r = i, t = ic(e, i))), 1 === t)
                throw n = zl, uc(e, 0), oc(e, r), nc(e, Qe()), n;
            if (6 === t)
                oc(e, r);
            else {
                if (i = e.current.alternate, 0 === (30 & r) && !function (e) { for (var t = e;;) {
                    if (16384 & t.flags) {
                        var n = t.updateQueue;
                        if (null !== n && null !== (n = n.stores))
                            for (var r = 0; r < n.length; r++) {
                                var i = n[r], a = i.getSnapshot;
                                i = i.value;
                                try {
                                    if (!sr(a(), i))
                                        return !1;
                                }
                                catch (s) {
                                    return !1;
                                }
                            }
                    }
                    if (n = t.child, 16384 & t.subtreeFlags && null !== n)
                        n.return = t, t = n;
                    else {
                        if (t === e)
                            break;
                        for (; null === t.sibling;) {
                            if (null === t.return || t.return === e)
                                return !0;
                            t = t.return;
                        }
                        t.sibling.return = t.return, t = t.sibling;
                    }
                } return !0; }(i) && (2 === (t = gc(e, r)) && (0 !== (o = ft(e)) && (r = o, t = ic(e, o))), 1 === t))
                    throw n = zl, uc(e, 0), oc(e, r), nc(e, Qe()), n;
                switch (e.finishedWork = i, e.finishedLanes = r, t) {
                    case 0:
                    case 1: throw Error(a(345));
                    case 2:
                    case 5:
                        vc(e, Il, Wl);
                        break;
                    case 3:
                        if (oc(e, r), (130023424 & r) === r && 10 < (t = Ul + 500 - Qe())) {
                            if (0 !== pt(e, 0))
                                break;
                            if (((i = e.suspendedLanes) & r) !== r) {
                                $l(), e.pingedLanes |= e.suspendedLanes & i;
                                break;
                            }
                            e.timeoutHandle = ri(vc.bind(null, e, Il, Wl), t);
                            break;
                        }
                        vc(e, Il, Wl);
                        break;
                    case 4:
                        if (oc(e, r), (4194240 & r) === r)
                            break;
                        for (t = e.eventTimes, i = -1; 0 < r;) {
                            var s = 31 - ot(r);
                            o = 1 << s, (s = t[s]) > i && (i = s), r &= ~o;
                        }
                        if (r = i, 10 < (r = (120 > (r = Qe() - r) ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * kl(r / 1960)) - r)) {
                            e.timeoutHandle = ri(vc.bind(null, e, Il, Wl), r);
                            break;
                        }
                        vc(e, Il, Wl);
                        break;
                    default: throw Error(a(329));
                }
            }
        } return nc(e, Qe()), e.callbackNode === n ? rc.bind(null, e) : null; }
        function ic(e, t) { var n = Ml; return e.current.memoizedState.isDehydrated && (uc(e, t).flags |= 256), 2 !== (e = gc(e, t)) && (t = Il, Il = n, null !== t && ac(t)), e; }
        function ac(e) { null === Il ? Il = e : Il.push.apply(Il, e); }
        function oc(e, t) { for (t &= ~Fl, t &= ~Dl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t;) {
            var n = 31 - ot(t), r = 1 << n;
            e[n] = -1, t &= ~r;
        } }
        function sc(e) { if (0 !== (6 & Tl))
            throw Error(a(327)); wc(); var t = pt(e, 0); if (0 === (1 & t))
            return nc(e, Qe()), null; var n = gc(e, t); if (0 !== e.tag && 2 === n) {
            var r = ft(e);
            0 !== r && (t = r, n = ic(e, r));
        } if (1 === n)
            throw n = zl, uc(e, 0), oc(e, t), nc(e, Qe()), n; if (6 === n)
            throw Error(a(345)); return e.finishedWork = e.current.alternate, e.finishedLanes = t, vc(e, Il, Wl), nc(e, Qe()), null; }
        function lc(e, t) { var n = Tl; Tl |= 1; try {
            return e(t);
        }
        finally {
            0 === (Tl = n) && (_l = Qe() + 500, Ii && Wi());
        } }
        function cc(e) { null !== Gl && 0 === Gl.tag && 0 === (6 & Tl) && wc(); var t = Tl; Tl |= 1; var n = Cl.transition, r = yt; try {
            if (Cl.transition = null, yt = 1, e)
                return e();
        }
        finally {
            yt = r, Cl.transition = n, 0 === (6 & (Tl = t)) && Wi();
        } }
        function dc() { Pl = Ll.current, Ni(Ll); }
        function uc(e, t) { e.finishedWork = null, e.finishedLanes = 0; var n = e.timeoutHandle; if (-1 !== n && (e.timeoutHandle = -1, ii(n)), null !== El)
            for (n = El.return; null !== n;) {
                var r = n;
                switch (ta(r), r.tag) {
                    case 1:
                        null !== (r = r.type.childContextTypes) && void 0 !== r && Oi();
                        break;
                    case 3:
                        Ja(), Ni(Ei), Ni(Ai), no();
                        break;
                    case 5:
                        Za(r);
                        break;
                    case 4:
                        Ja();
                        break;
                    case 13:
                    case 19:
                        Ni($a);
                        break;
                    case 10:
                        Ta(r.type._context);
                        break;
                    case 22:
                    case 23: dc();
                }
                n = n.return;
            } if (Al = e, El = e = Lc(e.current, null), Rl = Pl = t, Ol = 0, zl = null, Fl = Dl = Bl = 0, Il = Ml = null, null !== Pa) {
            for (t = 0; t < Pa.length; t++)
                if (null !== (r = (n = Pa[t]).interleaved)) {
                    n.interleaved = null;
                    var i = r.next, a = n.pending;
                    if (null !== a) {
                        var o = a.next;
                        a.next = i, r.next = o;
                    }
                    n.pending = r;
                }
            Pa = null;
        } return e; }
        function pc(e, t) { for (;;) {
            var n = El;
            try {
                if (Ca(), ro.current = Zo, co) {
                    for (var r = oo.memoizedState; null !== r;) {
                        var i = r.queue;
                        null !== i && (i.pending = null), r = r.next;
                    }
                    co = !1;
                }
                if (ao = 0, lo = so = oo = null, uo = !1, po = 0, Nl.current = null, null === n || null === n.return) {
                    Ol = 1, zl = t, El = null;
                    break;
                }
                e: {
                    var o = e, s = n.return, l = n, c = t;
                    if (t = Rl, l.flags |= 32768, null !== c && "object" === typeof c && "function" === typeof c.then) {
                        var d = c, u = l, p = u.tag;
                        if (0 === (1 & u.mode) && (0 === p || 11 === p || 15 === p)) {
                            var h = u.alternate;
                            h ? (u.updateQueue = h.updateQueue, u.memoizedState = h.memoizedState, u.lanes = h.lanes) : (u.updateQueue = null, u.memoizedState = null);
                        }
                        var f = ms(s);
                        if (null !== f) {
                            f.flags &= -257, xs(f, s, l, 0, t), 1 & f.mode && gs(o, d, t), c = d;
                            var g = (t = f).updateQueue;
                            if (null === g) {
                                var m = new Set;
                                m.add(c), t.updateQueue = m;
                            }
                            else
                                g.add(c);
                            break e;
                        }
                        if (0 === (1 & t)) {
                            gs(o, d, t), fc();
                            break e;
                        }
                        c = Error(a(426));
                    }
                    else if (ia && 1 & l.mode) {
                        var x = ms(s);
                        if (null !== x) {
                            0 === (65536 & x.flags) && (x.flags |= 256), xs(x, s, l, 0, t), fa(cs(c, l));
                            break e;
                        }
                    }
                    o = c = cs(c, l), 4 !== Ol && (Ol = 2), null === Ml ? Ml = [o] : Ml.push(o), o = s;
                    do {
                        switch (o.tag) {
                            case 3:
                                o.flags |= 65536, t &= -t, o.lanes |= t, _a(o, hs(0, c, t));
                                break e;
                            case 1:
                                l = c;
                                var b = o.type, y = o.stateNode;
                                if (0 === (128 & o.flags) && ("function" === typeof b.getDerivedStateFromError || null !== y && "function" === typeof y.componentDidCatch && (null === ql || !ql.has(y)))) {
                                    o.flags |= 65536, t &= -t, o.lanes |= t, _a(o, fs(o, l, t));
                                    break e;
                                }
                        }
                        o = o.return;
                    } while (null !== o);
                }
                yc(n);
            }
            catch (v) {
                t = v, El === n && null !== n && (El = n = n.return);
                continue;
            }
            break;
        } }
        function hc() { var e = Sl.current; return Sl.current = Zo, null === e ? Zo : e; }
        function fc() { 0 !== Ol && 3 !== Ol && 2 !== Ol || (Ol = 4), null === Al || 0 === (268435455 & Bl) && 0 === (268435455 & Dl) || oc(Al, Rl); }
        function gc(e, t) { var n = Tl; Tl |= 2; var r = hc(); for (Al === e && Rl === t || (Wl = null, uc(e, t));;)
            try {
                mc();
                break;
            }
            catch (i) {
                pc(e, i);
            } if (Ca(), Tl = n, Sl.current = r, null !== El)
            throw Error(a(261)); return Al = null, Rl = 0, Ol; }
        function mc() { for (; null !== El;)
            bc(El); }
        function xc() { for (; null !== El && !Xe();)
            bc(El); }
        function bc(e) { var t = jl(e.alternate, e, Pl); e.memoizedProps = e.pendingProps, null === t ? yc(e) : El = t, Nl.current = null; }
        function yc(e) { var t = e; do {
            var n = t.alternate;
            if (e = t.return, 0 === (32768 & t.flags)) {
                if (null !== (n = Ks(n, t, Pl)))
                    return void (El = n);
            }
            else {
                if (null !== (n = Gs(n, t)))
                    return n.flags &= 32767, void (El = n);
                if (null === e)
                    return Ol = 6, void (El = null);
                e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
            }
            if (null !== (t = t.sibling))
                return void (El = t);
            El = t = e;
        } while (null !== t); 0 === Ol && (Ol = 5); }
        function vc(e, t, n) { var r = yt, i = Cl.transition; try {
            Cl.transition = null, yt = 1, function (e, t, n, r) { do {
                wc();
            } while (null !== Gl); if (0 !== (6 & Tl))
                throw Error(a(327)); n = e.finishedWork; var i = e.finishedLanes; if (null === n)
                return null; if (e.finishedWork = null, e.finishedLanes = 0, n === e.current)
                throw Error(a(177)); e.callbackNode = null, e.callbackPriority = 0; var o = n.lanes | n.childLanes; if (function (e, t) { var n = e.pendingLanes & ~t; e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements; var r = e.eventTimes; for (e = e.expirationTimes; 0 < n;) {
                var i = 31 - ot(n), a = 1 << i;
                t[i] = 0, r[i] = -1, e[i] = -1, n &= ~a;
            } }(e, o), e === Al && (El = Al = null, Rl = 0), 0 === (2064 & n.subtreeFlags) && 0 === (2064 & n.flags) || Kl || (Kl = !0, Ac(tt, function () { return wc(), null; })), o = 0 !== (15990 & n.flags), 0 !== (15990 & n.subtreeFlags) || o) {
                o = Cl.transition, Cl.transition = null;
                var s = yt;
                yt = 1;
                var l = Tl;
                Tl |= 4, Nl.current = null, function (e, t) { if (ei = Vt, hr(e = pr())) {
                    if ("selectionStart" in e)
                        var n = { start: e.selectionStart, end: e.selectionEnd };
                    else
                        e: {
                            var r = (n = (n = e.ownerDocument) && n.defaultView || window).getSelection && n.getSelection();
                            if (r && 0 !== r.rangeCount) {
                                n = r.anchorNode;
                                var i = r.anchorOffset, o = r.focusNode;
                                r = r.focusOffset;
                                try {
                                    n.nodeType, o.nodeType;
                                }
                                catch (w) {
                                    n = null;
                                    break e;
                                }
                                var s = 0, l = -1, c = -1, d = 0, u = 0, p = e, h = null;
                                t: for (;;) {
                                    for (var f; p !== n || 0 !== i && 3 !== p.nodeType || (l = s + i), p !== o || 0 !== r && 3 !== p.nodeType || (c = s + r), 3 === p.nodeType && (s += p.nodeValue.length), null !== (f = p.firstChild);)
                                        h = p, p = f;
                                    for (;;) {
                                        if (p === e)
                                            break t;
                                        if (h === n && ++d === i && (l = s), h === o && ++u === r && (c = s), null !== (f = p.nextSibling))
                                            break;
                                        h = (p = h).parentNode;
                                    }
                                    p = f;
                                }
                                n = -1 === l || -1 === c ? null : { start: l, end: c };
                            }
                            else
                                n = null;
                        }
                    n = n || { start: 0, end: 0 };
                }
                else
                    n = null; for (ti = { focusedElem: e, selectionRange: n }, Vt = !1, Qs = t; null !== Qs;)
                    if (e = (t = Qs).child, 0 !== (1028 & t.subtreeFlags) && null !== e)
                        e.return = t, Qs = e;
                    else
                        for (; null !== Qs;) {
                            t = Qs;
                            try {
                                var g = t.alternate;
                                if (0 !== (1024 & t.flags))
                                    switch (t.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                        case 5:
                                        case 6:
                                        case 4:
                                        case 17: break;
                                        case 1:
                                            if (null !== g) {
                                                var m = g.memoizedProps, x = g.memoizedState, b = t.stateNode, y = b.getSnapshotBeforeUpdate(t.elementType === t.type ? m : ns(t.type, m), x);
                                                b.__reactInternalSnapshotBeforeUpdate = y;
                                            }
                                            break;
                                        case 3:
                                            var v = t.stateNode.containerInfo;
                                            1 === v.nodeType ? v.textContent = "" : 9 === v.nodeType && v.documentElement && v.removeChild(v.documentElement);
                                            break;
                                        default: throw Error(a(163));
                                    }
                            }
                            catch (w) {
                                kc(t, t.return, w);
                            }
                            if (null !== (e = t.sibling)) {
                                e.return = t.return, Qs = e;
                                break;
                            }
                            Qs = t.return;
                        } g = el, el = !1; }(e, n), gl(n, e), fr(ti), Vt = !!ei, ti = ei = null, e.current = n, xl(n, e, i), Je(), Tl = l, yt = s, Cl.transition = o;
            }
            else
                e.current = n; if (Kl && (Kl = !1, Gl = e, Yl = i), o = e.pendingLanes, 0 === o && (ql = null), function (e) { if (at && "function" === typeof at.onCommitFiberRoot)
                try {
                    at.onCommitFiberRoot(it, e, void 0, 128 === (128 & e.current.flags));
                }
                catch (t) { } }(n.stateNode), nc(e, Qe()), null !== t)
                for (r = e.onRecoverableError, n = 0; n < t.length; n++)
                    i = t[n], r(i.value, { componentStack: i.stack, digest: i.digest }); if (Hl)
                throw Hl = !1, e = Vl, Vl = null, e; 0 !== (1 & Yl) && 0 !== e.tag && wc(), o = e.pendingLanes, 0 !== (1 & o) ? e === Jl ? Xl++ : (Xl = 0, Jl = e) : Xl = 0, Wi(); }(e, t, n, r);
        }
        finally {
            Cl.transition = i, yt = r;
        } return null; }
        function wc() { if (null !== Gl) {
            var e = vt(Yl), t = Cl.transition, n = yt;
            try {
                if (Cl.transition = null, yt = 16 > e ? 16 : e, null === Gl)
                    var r = !1;
                else {
                    if (e = Gl, Gl = null, Yl = 0, 0 !== (6 & Tl))
                        throw Error(a(331));
                    var i = Tl;
                    for (Tl |= 4, Qs = e.current; null !== Qs;) {
                        var o = Qs, s = o.child;
                        if (0 !== (16 & Qs.flags)) {
                            var l = o.deletions;
                            if (null !== l) {
                                for (var c = 0; c < l.length; c++) {
                                    var d = l[c];
                                    for (Qs = d; null !== Qs;) {
                                        var u = Qs;
                                        switch (u.tag) {
                                            case 0:
                                            case 11:
                                            case 15: tl(8, u, o);
                                        }
                                        var p = u.child;
                                        if (null !== p)
                                            p.return = u, Qs = p;
                                        else
                                            for (; null !== Qs;) {
                                                var h = (u = Qs).sibling, f = u.return;
                                                if (il(u), u === d) {
                                                    Qs = null;
                                                    break;
                                                }
                                                if (null !== h) {
                                                    h.return = f, Qs = h;
                                                    break;
                                                }
                                                Qs = f;
                                            }
                                    }
                                }
                                var g = o.alternate;
                                if (null !== g) {
                                    var m = g.child;
                                    if (null !== m) {
                                        g.child = null;
                                        do {
                                            var x = m.sibling;
                                            m.sibling = null, m = x;
                                        } while (null !== m);
                                    }
                                }
                                Qs = o;
                            }
                        }
                        if (0 !== (2064 & o.subtreeFlags) && null !== s)
                            s.return = o, Qs = s;
                        else
                            e: for (; null !== Qs;) {
                                if (0 !== (2048 & (o = Qs).flags))
                                    switch (o.tag) {
                                        case 0:
                                        case 11:
                                        case 15: tl(9, o, o.return);
                                    }
                                var b = o.sibling;
                                if (null !== b) {
                                    b.return = o.return, Qs = b;
                                    break e;
                                }
                                Qs = o.return;
                            }
                    }
                    var y = e.current;
                    for (Qs = y; null !== Qs;) {
                        var v = (s = Qs).child;
                        if (0 !== (2064 & s.subtreeFlags) && null !== v)
                            v.return = s, Qs = v;
                        else
                            e: for (s = y; null !== Qs;) {
                                if (0 !== (2048 & (l = Qs).flags))
                                    try {
                                        switch (l.tag) {
                                            case 0:
                                            case 11:
                                            case 15: nl(9, l);
                                        }
                                    }
                                    catch (j) {
                                        kc(l, l.return, j);
                                    }
                                if (l === s) {
                                    Qs = null;
                                    break e;
                                }
                                var w = l.sibling;
                                if (null !== w) {
                                    w.return = l.return, Qs = w;
                                    break e;
                                }
                                Qs = l.return;
                            }
                    }
                    if (Tl = i, Wi(), at && "function" === typeof at.onPostCommitFiberRoot)
                        try {
                            at.onPostCommitFiberRoot(it, e);
                        }
                        catch (j) { }
                    r = !0;
                }
                return r;
            }
            finally {
                yt = n, Cl.transition = t;
            }
        } return !1; }
        function jc(e, t, n) { e = Ia(e, t = hs(0, t = cs(n, t), 1), 1), t = $l(), null !== e && (xt(e, 1, t), nc(e, t)); }
        function kc(e, t, n) { if (3 === e.tag)
            jc(e, e, n);
        else
            for (; null !== t;) {
                if (3 === t.tag) {
                    jc(t, e, n);
                    break;
                }
                if (1 === t.tag) {
                    var r = t.stateNode;
                    if ("function" === typeof t.type.getDerivedStateFromError || "function" === typeof r.componentDidCatch && (null === ql || !ql.has(r))) {
                        t = Ia(t, e = fs(t, e = cs(n, e), 1), 1), e = $l(), null !== t && (xt(t, 1, e), nc(t, e));
                        break;
                    }
                }
                t = t.return;
            } }
        function Sc(e, t, n) { var r = e.pingCache; null !== r && r.delete(t), t = $l(), e.pingedLanes |= e.suspendedLanes & n, Al === e && (Rl & n) === n && (4 === Ol || 3 === Ol && (130023424 & Rl) === Rl && 500 > Qe() - Ul ? uc(e, 0) : Fl |= n), nc(e, t); }
        function Nc(e, t) { 0 === t && (0 === (1 & e.mode) ? t = 1 : (t = dt, 0 === (130023424 & (dt <<= 1)) && (dt = 4194304))); var n = $l(); null !== (e = za(e, t)) && (xt(e, t, n), nc(e, n)); }
        function Cc(e) { var t = e.memoizedState, n = 0; null !== t && (n = t.retryLane), Nc(e, n); }
        function Tc(e, t) { var n = 0; switch (e.tag) {
            case 13:
                var r = e.stateNode, i = e.memoizedState;
                null !== i && (n = i.retryLane);
                break;
            case 19:
                r = e.stateNode;
                break;
            default: throw Error(a(314));
        } null !== r && r.delete(t), Nc(e, n); }
        function Ac(e, t) { return Ge(e, t); }
        function Ec(e, t, n, r) { this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null; }
        function Rc(e, t, n, r) { return new Ec(e, t, n, r); }
        function Pc(e) { return !(!(e = e.prototype) || !e.isReactComponent); }
        function Lc(e, t) { var n = e.alternate; return null === n ? ((n = Rc(e.tag, t, e.key, e.mode)).elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = 14680064 & e.flags, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = null === t ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n; }
        function Oc(e, t, n, r, i, o) { var s = 2; if (r = e, "function" === typeof e)
            Pc(e) && (s = 1);
        else if ("string" === typeof e)
            s = 5;
        else
            e: switch (e) {
                case k: return zc(n.children, i, o, t);
                case S:
                    s = 8, i |= 8;
                    break;
                case N: return (e = Rc(12, n, t, 2 | i)).elementType = N, e.lanes = o, e;
                case E: return (e = Rc(13, n, t, i)).elementType = E, e.lanes = o, e;
                case R: return (e = Rc(19, n, t, i)).elementType = R, e.lanes = o, e;
                case O: return Bc(n, i, o, t);
                default:
                    if ("object" === typeof e && null !== e)
                        switch (e.$$typeof) {
                            case C:
                                s = 10;
                                break e;
                            case T:
                                s = 9;
                                break e;
                            case A:
                                s = 11;
                                break e;
                            case P:
                                s = 14;
                                break e;
                            case L:
                                s = 16, r = null;
                                break e;
                        }
                    throw Error(a(130, null == e ? e : typeof e, ""));
            } return (t = Rc(s, n, t, i)).elementType = e, t.type = r, t.lanes = o, t; }
        function zc(e, t, n, r) { return (e = Rc(7, e, r, t)).lanes = n, e; }
        function Bc(e, t, n, r) { return (e = Rc(22, e, r, t)).elementType = O, e.lanes = n, e.stateNode = { isHidden: !1 }, e; }
        function Dc(e, t, n) { return (e = Rc(6, e, null, t)).lanes = n, e; }
        function Fc(e, t, n) { return (t = Rc(4, null !== e.children ? e.children : [], e.key, t)).lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t; }
        function Mc(e, t, n, r, i) { this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = mt(0), this.expirationTimes = mt(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = mt(0), this.identifierPrefix = r, this.onRecoverableError = i, this.mutableSourceEagerHydrationData = null; }
        function Ic(e, t, n, r, i, a, o, s, l) { return e = new Mc(e, t, n, s, l), 1 === t ? (t = 1, !0 === a && (t |= 8)) : t = 0, a = Rc(3, null, null, t), e.current = a, a.stateNode = e, a.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Da(a), e; }
        function Uc(e) { if (!e)
            return Ti; e: {
            if (We(e = e._reactInternals) !== e || 1 !== e.tag)
                throw Error(a(170));
            var t = e;
            do {
                switch (t.tag) {
                    case 3:
                        t = t.stateNode.context;
                        break e;
                    case 1: if (Li(t.type)) {
                        t = t.stateNode.__reactInternalMemoizedMergedChildContext;
                        break e;
                    }
                }
                t = t.return;
            } while (null !== t);
            throw Error(a(171));
        } if (1 === e.tag) {
            var n = e.type;
            if (Li(n))
                return Bi(e, n, t);
        } return t; }
        function _c(e, t, n, r, i, a, o, s, l) { return (e = Ic(n, r, !0, e, 0, a, 0, s, l)).context = Uc(null), n = e.current, (a = Ma(r = $l(), i = ec(n))).callback = void 0 !== t && null !== t ? t : null, Ia(n, a, i), e.current.lanes = i, xt(e, i, r), nc(e, r), e; }
        function Wc(e, t, n, r) { var i = t.current, a = $l(), o = ec(i); return n = Uc(n), null === t.context ? t.context = n : t.pendingContext = n, (t = Ma(a, o)).payload = { element: e }, null !== (r = void 0 === r ? null : r) && (t.callback = r), null !== (e = Ia(i, t, o)) && (tc(e, i, o, a), Ua(e, i, o)), o; }
        function Hc(e) { return (e = e.current).child ? (e.child.tag, e.child.stateNode) : null; }
        function Vc(e, t) { if (null !== (e = e.memoizedState) && null !== e.dehydrated) {
            var n = e.retryLane;
            e.retryLane = 0 !== n && n < t ? n : t;
        } }
        function qc(e, t) { Vc(e, t), (e = e.alternate) && Vc(e, t); }
        jl = function (e, t, n) { if (null !== e)
            if (e.memoizedProps !== t.pendingProps || Ei.current)
                ys = !0;
            else {
                if (0 === (e.lanes & n) && 0 === (128 & t.flags))
                    return ys = !1, function (e, t, n) { switch (t.tag) {
                        case 3:
                            Es(t), ha();
                            break;
                        case 5:
                            Qa(t);
                            break;
                        case 1:
                            Li(t.type) && Di(t);
                            break;
                        case 4:
                            Xa(t, t.stateNode.containerInfo);
                            break;
                        case 10:
                            var r = t.type._context, i = t.memoizedProps.value;
                            Ci(ja, r._currentValue), r._currentValue = i;
                            break;
                        case 13:
                            if (null !== (r = t.memoizedState))
                                return null !== r.dehydrated ? (Ci($a, 1 & $a.current), t.flags |= 128, null) : 0 !== (n & t.child.childLanes) ? Ds(e, t, n) : (Ci($a, 1 & $a.current), null !== (e = Hs(e, t, n)) ? e.sibling : null);
                            Ci($a, 1 & $a.current);
                            break;
                        case 19:
                            if (r = 0 !== (n & t.childLanes), 0 !== (128 & e.flags)) {
                                if (r)
                                    return _s(e, t, n);
                                t.flags |= 128;
                            }
                            if (null !== (i = t.memoizedState) && (i.rendering = null, i.tail = null, i.lastEffect = null), Ci($a, $a.current), r)
                                break;
                            return null;
                        case 22:
                        case 23: return t.lanes = 0, Ss(e, t, n);
                    } return Hs(e, t, n); }(e, t, n);
                ys = 0 !== (131072 & e.flags);
            }
        else
            ys = !1, ia && 0 !== (1048576 & t.flags) && $i(t, Ki, t.index); switch (t.lanes = 0, t.tag) {
            case 2:
                var r = t.type;
                Ws(e, t), e = t.pendingProps;
                var i = Pi(t, Ai.current);
                Ea(t, n), i = mo(null, t, r, e, i, n);
                var o = xo();
                return t.flags |= 1, "object" === typeof i && null !== i && "function" === typeof i.render && void 0 === i.$$typeof ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Li(r) ? (o = !0, Di(t)) : o = !1, t.memoizedState = null !== i.state && void 0 !== i.state ? i.state : null, Da(t), i.updater = is, t.stateNode = i, i._reactInternals = t, ls(t, r, e, n), t = As(null, t, r, !0, o, n)) : (t.tag = 0, ia && o && ea(t), vs(null, t, i, n), t = t.child), t;
            case 16:
                r = t.elementType;
                e: {
                    switch (Ws(e, t), e = t.pendingProps, r = (i = r._init)(r._payload), t.type = r, i = t.tag = function (e) { if ("function" === typeof e)
                        return Pc(e) ? 1 : 0; if (void 0 !== e && null !== e) {
                        if ((e = e.$$typeof) === A)
                            return 11;
                        if (e === P)
                            return 14;
                    } return 2; }(r), e = ns(r, e), i) {
                        case 0:
                            t = Cs(null, t, r, e, n);
                            break e;
                        case 1:
                            t = Ts(null, t, r, e, n);
                            break e;
                        case 11:
                            t = ws(null, t, r, e, n);
                            break e;
                        case 14:
                            t = js(null, t, r, ns(r.type, e), n);
                            break e;
                    }
                    throw Error(a(306, r, ""));
                }
                return t;
            case 0: return r = t.type, i = t.pendingProps, Cs(e, t, r, i = t.elementType === r ? i : ns(r, i), n);
            case 1: return r = t.type, i = t.pendingProps, Ts(e, t, r, i = t.elementType === r ? i : ns(r, i), n);
            case 3:
                e: {
                    if (Es(t), null === e)
                        throw Error(a(387));
                    r = t.pendingProps, i = (o = t.memoizedState).element, Fa(e, t), Wa(t, r, null, n);
                    var s = t.memoizedState;
                    if (r = s.element, o.isDehydrated) {
                        if (o = { element: r, isDehydrated: !1, cache: s.cache, pendingSuspenseBoundaries: s.pendingSuspenseBoundaries, transitions: s.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, 256 & t.flags) {
                            t = Rs(e, t, r, n, i = cs(Error(a(423)), t));
                            break e;
                        }
                        if (r !== i) {
                            t = Rs(e, t, r, n, i = cs(Error(a(424)), t));
                            break e;
                        }
                        for (ra = ci(t.stateNode.containerInfo.firstChild), na = t, ia = !0, aa = null, n = wa(t, null, r, n), t.child = n; n;)
                            n.flags = -3 & n.flags | 4096, n = n.sibling;
                    }
                    else {
                        if (ha(), r === i) {
                            t = Hs(e, t, n);
                            break e;
                        }
                        vs(e, t, r, n);
                    }
                    t = t.child;
                }
                return t;
            case 5: return Qa(t), null === e && ca(t), r = t.type, i = t.pendingProps, o = null !== e ? e.memoizedProps : null, s = i.children, ni(r, i) ? s = null : null !== o && ni(r, o) && (t.flags |= 32), Ns(e, t), vs(e, t, s, n), t.child;
            case 6: return null === e && ca(t), null;
            case 13: return Ds(e, t, n);
            case 4: return Xa(t, t.stateNode.containerInfo), r = t.pendingProps, null === e ? t.child = va(t, null, r, n) : vs(e, t, r, n), t.child;
            case 11: return r = t.type, i = t.pendingProps, ws(e, t, r, i = t.elementType === r ? i : ns(r, i), n);
            case 7: return vs(e, t, t.pendingProps, n), t.child;
            case 8:
            case 12: return vs(e, t, t.pendingProps.children, n), t.child;
            case 10:
                e: {
                    if (r = t.type._context, i = t.pendingProps, o = t.memoizedProps, s = i.value, Ci(ja, r._currentValue), r._currentValue = s, null !== o)
                        if (sr(o.value, s)) {
                            if (o.children === i.children && !Ei.current) {
                                t = Hs(e, t, n);
                                break e;
                            }
                        }
                        else
                            for (null !== (o = t.child) && (o.return = t); null !== o;) {
                                var l = o.dependencies;
                                if (null !== l) {
                                    s = o.child;
                                    for (var c = l.firstContext; null !== c;) {
                                        if (c.context === r) {
                                            if (1 === o.tag) {
                                                (c = Ma(-1, n & -n)).tag = 2;
                                                var d = o.updateQueue;
                                                if (null !== d) {
                                                    var u = (d = d.shared).pending;
                                                    null === u ? c.next = c : (c.next = u.next, u.next = c), d.pending = c;
                                                }
                                            }
                                            o.lanes |= n, null !== (c = o.alternate) && (c.lanes |= n), Aa(o.return, n, t), l.lanes |= n;
                                            break;
                                        }
                                        c = c.next;
                                    }
                                }
                                else if (10 === o.tag)
                                    s = o.type === t.type ? null : o.child;
                                else if (18 === o.tag) {
                                    if (null === (s = o.return))
                                        throw Error(a(341));
                                    s.lanes |= n, null !== (l = s.alternate) && (l.lanes |= n), Aa(s, n, t), s = o.sibling;
                                }
                                else
                                    s = o.child;
                                if (null !== s)
                                    s.return = o;
                                else
                                    for (s = o; null !== s;) {
                                        if (s === t) {
                                            s = null;
                                            break;
                                        }
                                        if (null !== (o = s.sibling)) {
                                            o.return = s.return, s = o;
                                            break;
                                        }
                                        s = s.return;
                                    }
                                o = s;
                            }
                    vs(e, t, i.children, n), t = t.child;
                }
                return t;
            case 9: return i = t.type, r = t.pendingProps.children, Ea(t, n), r = r(i = Ra(i)), t.flags |= 1, vs(e, t, r, n), t.child;
            case 14: return i = ns(r = t.type, t.pendingProps), js(e, t, r, i = ns(r.type, i), n);
            case 15: return ks(e, t, t.type, t.pendingProps, n);
            case 17: return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : ns(r, i), Ws(e, t), t.tag = 1, Li(r) ? (e = !0, Di(t)) : e = !1, Ea(t, n), os(t, r, i), ls(t, r, i, n), As(null, t, r, !0, e, n);
            case 19: return _s(e, t, n);
            case 22: return Ss(e, t, n);
        } throw Error(a(156, t.tag)); };
        var Kc = "function" === typeof reportError ? reportError : function (e) { console.error(e); };
        function Gc(e) { this._internalRoot = e; }
        function Yc(e) { this._internalRoot = e; }
        function Xc(e) { return !(!e || 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType); }
        function Jc(e) { return !(!e || 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType && (8 !== e.nodeType || " react-mount-point-unstable " !== e.nodeValue)); }
        function Qc() { }
        function Zc(e, t, n, r, i) { var a = n._reactRootContainer; if (a) {
            var o = a;
            if ("function" === typeof i) {
                var s = i;
                i = function () { var e = Hc(o); s.call(e); };
            }
            Wc(t, o, e, i);
        }
        else
            o = function (e, t, n, r, i) { if (i) {
                if ("function" === typeof r) {
                    var a = r;
                    r = function () { var e = Hc(o); a.call(e); };
                }
                var o = _c(t, r, e, 0, null, !1, 0, "", Qc);
                return e._reactRootContainer = o, e[fi] = o.current, Wr(8 === e.nodeType ? e.parentNode : e), cc(), o;
            } for (; i = e.lastChild;)
                e.removeChild(i); if ("function" === typeof r) {
                var s = r;
                r = function () { var e = Hc(l); s.call(e); };
            } var l = Ic(e, 0, !1, null, 0, !1, 0, "", Qc); return e._reactRootContainer = l, e[fi] = l.current, Wr(8 === e.nodeType ? e.parentNode : e), cc(function () { Wc(t, l, n, r); }), l; }(n, t, e, i, r); return Hc(o); }
        Yc.prototype.render = Gc.prototype.render = function (e) { var t = this._internalRoot; if (null === t)
            throw Error(a(409)); Wc(e, t, null, null); }, Yc.prototype.unmount = Gc.prototype.unmount = function () { var e = this._internalRoot; if (null !== e) {
            this._internalRoot = null;
            var t = e.containerInfo;
            cc(function () { Wc(null, e, null, null); }), t[fi] = null;
        } }, Yc.prototype.unstable_scheduleHydration = function (e) { if (e) {
            var t = St();
            e = { blockedOn: null, target: e, priority: t };
            for (var n = 0; n < Ot.length && 0 !== t && t < Ot[n].priority; n++)
                ;
            Ot.splice(n, 0, e), 0 === n && Ft(e);
        } }, wt = function (e) { switch (e.tag) {
            case 3:
                var t = e.stateNode;
                if (t.current.memoizedState.isDehydrated) {
                    var n = ut(t.pendingLanes);
                    0 !== n && (bt(t, 1 | n), nc(t, Qe()), 0 === (6 & Tl) && (_l = Qe() + 500, Wi()));
                }
                break;
            case 13: cc(function () { var t = za(e, 1); if (null !== t) {
                var n = $l();
                tc(t, e, 1, n);
            } }), qc(e, 1);
        } }, jt = function (e) { if (13 === e.tag) {
            var t = za(e, 134217728);
            if (null !== t)
                tc(t, e, 134217728, $l());
            qc(e, 134217728);
        } }, kt = function (e) { if (13 === e.tag) {
            var t = ec(e), n = za(e, t);
            if (null !== n)
                tc(n, e, t, $l());
            qc(e, t);
        } }, St = function () { return yt; }, Nt = function (e, t) { var n = yt; try {
            return yt = e, t();
        }
        finally {
            yt = n;
        } }, je = function (e, t, n) { switch (t) {
            case "input":
                if (Z(e, n), t = n.name, "radio" === n.type && null != t) {
                    for (n = e; n.parentNode;)
                        n = n.parentNode;
                    for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
                        var r = n[t];
                        if (r !== e && r.form === e.form) {
                            var i = wi(r);
                            if (!i)
                                throw Error(a(90));
                            G(r), Z(r, i);
                        }
                    }
                }
                break;
            case "textarea":
                ae(e, n);
                break;
            case "select": null != (t = n.value) && ne(e, !!n.multiple, t, !1);
        } }, Ae = lc, Ee = cc;
        var $c = { usingClientEntryPoint: !1, Events: [yi, vi, wi, Ce, Te, lc] }, ed = { findFiberByHostInstance: bi, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, td = { bundleType: ed.bundleType, version: ed.version, rendererPackageName: ed.rendererPackageName, rendererConfig: ed.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: v.ReactCurrentDispatcher, findHostInstanceByFiber: function (e) { return null === (e = qe(e)) ? null : e.stateNode; }, findFiberByHostInstance: ed.findFiberByHostInstance || function () { return null; }, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
        if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
            var nd = __REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (!nd.isDisabled && nd.supportsFiber)
                try {
                    it = nd.inject(td), at = nd;
                }
                catch (de) { }
        }
        t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = $c, t.createPortal = function (e, t) { var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null; if (!Xc(t))
            throw Error(a(200)); return function (e, t, n) { var r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null; return { $$typeof: j, key: null == r ? null : "" + r, children: e, containerInfo: t, implementation: n }; }(e, t, null, n); }, t.createRoot = function (e, t) { if (!Xc(e))
            throw Error(a(299)); var n = !1, r = "", i = Kc; return null !== t && void 0 !== t && (!0 === t.unstable_strictMode && (n = !0), void 0 !== t.identifierPrefix && (r = t.identifierPrefix), void 0 !== t.onRecoverableError && (i = t.onRecoverableError)), t = Ic(e, 1, !1, null, 0, n, 0, r, i), e[fi] = t.current, Wr(8 === e.nodeType ? e.parentNode : e), new Gc(t); }, t.findDOMNode = function (e) { if (null == e)
            return null; if (1 === e.nodeType)
            return e; var t = e._reactInternals; if (void 0 === t) {
            if ("function" === typeof e.render)
                throw Error(a(188));
            throw e = Object.keys(e).join(","), Error(a(268, e));
        } return e = null === (e = qe(t)) ? null : e.stateNode; }, t.flushSync = function (e) { return cc(e); }, t.hydrate = function (e, t, n) { if (!Jc(t))
            throw Error(a(200)); return Zc(null, e, t, !0, n); }, t.hydrateRoot = function (e, t, n) { if (!Xc(e))
            throw Error(a(405)); var r = null != n && n.hydratedSources || null, i = !1, o = "", s = Kc; if (null !== n && void 0 !== n && (!0 === n.unstable_strictMode && (i = !0), void 0 !== n.identifierPrefix && (o = n.identifierPrefix), void 0 !== n.onRecoverableError && (s = n.onRecoverableError)), t = _c(t, null, e, 1, null != n ? n : null, i, 0, o, s), e[fi] = t.current, Wr(e), r)
            for (e = 0; e < r.length; e++)
                i = (i = (n = r[e])._getVersion)(n._source), null == t.mutableSourceEagerHydrationData ? t.mutableSourceEagerHydrationData = [n, i] : t.mutableSourceEagerHydrationData.push(n, i); return new Yc(t); }, t.render = function (e, t, n) { if (!Jc(t))
            throw Error(a(200)); return Zc(null, e, t, !1, n); }, t.unmountComponentAtNode = function (e) { if (!Jc(e))
            throw Error(a(40)); return !!e._reactRootContainer && (cc(function () { Zc(null, null, e, !1, function () { e._reactRootContainer = null, e[fi] = null; }); }), !0); }, t.unstable_batchedUpdates = lc, t.unstable_renderSubtreeIntoContainer = function (e, t, n, r) { if (!Jc(n))
            throw Error(a(200)); if (null == e || void 0 === e._reactInternals)
            throw Error(a(38)); return Zc(e, t, n, !1, r); }, t.version = "18.3.1-next-f1338f8080-20240426";
    }, 391(e, t, n) {
        "use strict";
        var r = n(950);
        t.createRoot = r.createRoot, t.hydrateRoot = r.hydrateRoot;
    }, 950(e, t, n) {
        "use strict";
        !function e() { if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
            }
            catch (t) {
                console.error(t);
            } }(), e.exports = n(730);
    }, 534(e, t, n) {
        "use strict";
        var r = n(43), i = Symbol.for("react.element"), a = Symbol.for("react.fragment"), o = Object.prototype.hasOwnProperty, s = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, l = { key: !0, ref: !0, __self: !0, __source: !0 };
        function c(e, t, n) { var r, a = {}, c = null, d = null; for (r in void 0 !== n && (c = "" + n), void 0 !== t.key && (c = "" + t.key), void 0 !== t.ref && (d = t.ref), t)
            o.call(t, r) && !l.hasOwnProperty(r) && (a[r] = t[r]); if (e && e.defaultProps)
            for (r in t = e.defaultProps)
                void 0 === a[r] && (a[r] = t[r]); return { $$typeof: i, type: e, key: c, ref: d, props: a, _owner: s.current }; }
        t.Fragment = a, t.jsx = c, t.jsxs = c;
    }, 202(e, t) {
        "use strict";
        var n = Symbol.for("react.element"), r = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), a = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), s = Symbol.for("react.provider"), l = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), p = Symbol.for("react.lazy"), h = Symbol.iterator;
        var f = { isMounted: function () { return !1; }, enqueueForceUpdate: function () { }, enqueueReplaceState: function () { }, enqueueSetState: function () { } }, g = Object.assign, m = {};
        function x(e, t, n) { this.props = e, this.context = t, this.refs = m, this.updater = n || f; }
        function b() { }
        function y(e, t, n) { this.props = e, this.context = t, this.refs = m, this.updater = n || f; }
        x.prototype.isReactComponent = {}, x.prototype.setState = function (e, t) { if ("object" !== typeof e && "function" !== typeof e && null != e)
            throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables."); this.updater.enqueueSetState(this, e, t, "setState"); }, x.prototype.forceUpdate = function (e) { this.updater.enqueueForceUpdate(this, e, "forceUpdate"); }, b.prototype = x.prototype;
        var v = y.prototype = new b;
        v.constructor = y, g(v, x.prototype), v.isPureReactComponent = !0;
        var w = Array.isArray, j = Object.prototype.hasOwnProperty, k = { current: null }, S = { key: !0, ref: !0, __self: !0, __source: !0 };
        function N(e, t, r) { var i, a = {}, o = null, s = null; if (null != t)
            for (i in void 0 !== t.ref && (s = t.ref), void 0 !== t.key && (o = "" + t.key), t)
                j.call(t, i) && !S.hasOwnProperty(i) && (a[i] = t[i]); var l = arguments.length - 2; if (1 === l)
            a.children = r;
        else if (1 < l) {
            for (var c = Array(l), d = 0; d < l; d++)
                c[d] = arguments[d + 2];
            a.children = c;
        } if (e && e.defaultProps)
            for (i in l = e.defaultProps)
                void 0 === a[i] && (a[i] = l[i]); return { $$typeof: n, type: e, key: o, ref: s, props: a, _owner: k.current }; }
        function C(e) { return "object" === typeof e && null !== e && e.$$typeof === n; }
        var T = /\/+/g;
        function A(e, t) { return "object" === typeof e && null !== e && null != e.key ? function (e) { var t = { "=": "=0", ":": "=2" }; return "$" + e.replace(/[=:]/g, function (e) { return t[e]; }); }("" + e.key) : t.toString(36); }
        function E(e, t, i, a, o) { var s = typeof e; "undefined" !== s && "boolean" !== s || (e = null); var l = !1; if (null === e)
            l = !0;
        else
            switch (s) {
                case "string":
                case "number":
                    l = !0;
                    break;
                case "object": switch (e.$$typeof) {
                    case n:
                    case r: l = !0;
                }
            } if (l)
            return o = o(l = e), e = "" === a ? "." + A(l, 0) : a, w(o) ? (i = "", null != e && (i = e.replace(T, "$&/") + "/"), E(o, t, i, "", function (e) { return e; })) : null != o && (C(o) && (o = function (e, t) { return { $$typeof: n, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner }; }(o, i + (!o.key || l && l.key === o.key ? "" : ("" + o.key).replace(T, "$&/") + "/") + e)), t.push(o)), 1; if (l = 0, a = "" === a ? "." : a + ":", w(e))
            for (var c = 0; c < e.length; c++) {
                var d = a + A(s = e[c], c);
                l += E(s, t, i, d, o);
            }
        else if (d = function (e) { return null === e || "object" !== typeof e ? null : "function" === typeof (e = h && e[h] || e["@@iterator"]) ? e : null; }(e), "function" === typeof d)
            for (e = d.call(e), c = 0; !(s = e.next()).done;)
                l += E(s = s.value, t, i, d = a + A(s, c++), o);
        else if ("object" === s)
            throw t = String(e), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead."); return l; }
        function R(e, t, n) { if (null == e)
            return e; var r = [], i = 0; return E(e, r, "", "", function (e) { return t.call(n, e, i++); }), r; }
        function P(e) { if (-1 === e._status) {
            var t = e._result;
            (t = t()).then(function (t) { 0 !== e._status && -1 !== e._status || (e._status = 1, e._result = t); }, function (t) { 0 !== e._status && -1 !== e._status || (e._status = 2, e._result = t); }), -1 === e._status && (e._status = 0, e._result = t);
        } if (1 === e._status)
            return e._result.default; throw e._result; }
        var L = { current: null }, O = { transition: null }, z = { ReactCurrentDispatcher: L, ReactCurrentBatchConfig: O, ReactCurrentOwner: k };
        function B() { throw Error("act(...) is not supported in production builds of React."); }
        t.Children = { map: R, forEach: function (e, t, n) { R(e, function () { t.apply(this, arguments); }, n); }, count: function (e) { var t = 0; return R(e, function () { t++; }), t; }, toArray: function (e) { return R(e, function (e) { return e; }) || []; }, only: function (e) { if (!C(e))
                throw Error("React.Children.only expected to receive a single React element child."); return e; } }, t.Component = x, t.Fragment = i, t.Profiler = o, t.PureComponent = y, t.StrictMode = a, t.Suspense = d, t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = z, t.act = B, t.cloneElement = function (e, t, r) { if (null === e || void 0 === e)
            throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + "."); var i = g({}, e.props), a = e.key, o = e.ref, s = e._owner; if (null != t) {
            if (void 0 !== t.ref && (o = t.ref, s = k.current), void 0 !== t.key && (a = "" + t.key), e.type && e.type.defaultProps)
                var l = e.type.defaultProps;
            for (c in t)
                j.call(t, c) && !S.hasOwnProperty(c) && (i[c] = void 0 === t[c] && void 0 !== l ? l[c] : t[c]);
        } var c = arguments.length - 2; if (1 === c)
            i.children = r;
        else if (1 < c) {
            l = Array(c);
            for (var d = 0; d < c; d++)
                l[d] = arguments[d + 2];
            i.children = l;
        } return { $$typeof: n, type: e.type, key: a, ref: o, props: i, _owner: s }; }, t.createContext = function (e) { return (e = { $$typeof: l, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }).Provider = { $$typeof: s, _context: e }, e.Consumer = e; }, t.createElement = N, t.createFactory = function (e) { var t = N.bind(null, e); return t.type = e, t; }, t.createRef = function () { return { current: null }; }, t.forwardRef = function (e) { return { $$typeof: c, render: e }; }, t.isValidElement = C, t.lazy = function (e) { return { $$typeof: p, _payload: { _status: -1, _result: e }, _init: P }; }, t.memo = function (e, t) { return { $$typeof: u, type: e, compare: void 0 === t ? null : t }; }, t.startTransition = function (e) { var t = O.transition; O.transition = {}; try {
            e();
        }
        finally {
            O.transition = t;
        } }, t.unstable_act = B, t.useCallback = function (e, t) { return L.current.useCallback(e, t); }, t.useContext = function (e) { return L.current.useContext(e); }, t.useDebugValue = function () { }, t.useDeferredValue = function (e) { return L.current.useDeferredValue(e); }, t.useEffect = function (e, t) { return L.current.useEffect(e, t); }, t.useId = function () { return L.current.useId(); }, t.useImperativeHandle = function (e, t, n) { return L.current.useImperativeHandle(e, t, n); }, t.useInsertionEffect = function (e, t) { return L.current.useInsertionEffect(e, t); }, t.useLayoutEffect = function (e, t) { return L.current.useLayoutEffect(e, t); }, t.useMemo = function (e, t) { return L.current.useMemo(e, t); }, t.useReducer = function (e, t, n) { return L.current.useReducer(e, t, n); }, t.useRef = function (e) { return L.current.useRef(e); }, t.useState = function (e) { return L.current.useState(e); }, t.useSyncExternalStore = function (e, t, n) { return L.current.useSyncExternalStore(e, t, n); }, t.useTransition = function () { return L.current.useTransition(); }, t.version = "18.3.1";
    }, 43(e, t, n) {
        "use strict";
        e.exports = n(202);
    }, 579(e, t, n) {
        "use strict";
        e.exports = n(534);
    }, 234(e, t) {
        "use strict";
        function n(e, t) { var n = e.length; e.push(t); e: for (; 0 < n;) {
            var r = n - 1 >>> 1, i = e[r];
            if (!(0 < a(i, t)))
                break e;
            e[r] = t, e[n] = i, n = r;
        } }
        function r(e) { return 0 === e.length ? null : e[0]; }
        function i(e) { if (0 === e.length)
            return null; var t = e[0], n = e.pop(); if (n !== t) {
            e[0] = n;
            e: for (var r = 0, i = e.length, o = i >>> 1; r < o;) {
                var s = 2 * (r + 1) - 1, l = e[s], c = s + 1, d = e[c];
                if (0 > a(l, n))
                    c < i && 0 > a(d, l) ? (e[r] = d, e[c] = n, r = c) : (e[r] = l, e[s] = n, r = s);
                else {
                    if (!(c < i && 0 > a(d, n)))
                        break e;
                    e[r] = d, e[c] = n, r = c;
                }
            }
        } return t; }
        function a(e, t) { var n = e.sortIndex - t.sortIndex; return 0 !== n ? n : e.id - t.id; }
        if ("object" === typeof performance && "function" === typeof performance.now) {
            var o = performance;
            t.unstable_now = function () { return o.now(); };
        }
        else {
            var s = Date, l = s.now();
            t.unstable_now = function () { return s.now() - l; };
        }
        var c = [], d = [], u = 1, p = null, h = 3, f = !1, g = !1, m = !1, x = "function" === typeof setTimeout ? setTimeout : null, b = "function" === typeof clearTimeout ? clearTimeout : null, y = "undefined" !== typeof setImmediate ? setImmediate : null;
        function v(e) { for (var t = r(d); null !== t;) {
            if (null === t.callback)
                i(d);
            else {
                if (!(t.startTime <= e))
                    break;
                i(d), t.sortIndex = t.expirationTime, n(c, t);
            }
            t = r(d);
        } }
        function w(e) { if (m = !1, v(e), !g)
            if (null !== r(c))
                g = !0, O(j);
            else {
                var t = r(d);
                null !== t && z(w, t.startTime - e);
            } }
        function j(e, n) { g = !1, m && (m = !1, b(C), C = -1), f = !0; var a = h; try {
            for (v(n), p = r(c); null !== p && (!(p.expirationTime > n) || e && !E());) {
                var o = p.callback;
                if ("function" === typeof o) {
                    p.callback = null, h = p.priorityLevel;
                    var s = o(p.expirationTime <= n);
                    n = t.unstable_now(), "function" === typeof s ? p.callback = s : p === r(c) && i(c), v(n);
                }
                else
                    i(c);
                p = r(c);
            }
            if (null !== p)
                var l = !0;
            else {
                var u = r(d);
                null !== u && z(w, u.startTime - n), l = !1;
            }
            return l;
        }
        finally {
            p = null, h = a, f = !1;
        } }
        "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
        var k, S = !1, N = null, C = -1, T = 5, A = -1;
        function E() { return !(t.unstable_now() - A < T); }
        function R() { if (null !== N) {
            var e = t.unstable_now();
            A = e;
            var n = !0;
            try {
                n = N(!0, e);
            }
            finally {
                n ? k() : (S = !1, N = null);
            }
        }
        else
            S = !1; }
        if ("function" === typeof y)
            k = function () { y(R); };
        else if ("undefined" !== typeof MessageChannel) {
            var P = new MessageChannel, L = P.port2;
            P.port1.onmessage = R, k = function () { L.postMessage(null); };
        }
        else
            k = function () { x(R, 0); };
        function O(e) { N = e, S || (S = !0, k()); }
        function z(e, n) { C = x(function () { e(t.unstable_now()); }, n); }
        t.unstable_IdlePriority = 5, t.unstable_ImmediatePriority = 1, t.unstable_LowPriority = 4, t.unstable_NormalPriority = 3, t.unstable_Profiling = null, t.unstable_UserBlockingPriority = 2, t.unstable_cancelCallback = function (e) { e.callback = null; }, t.unstable_continueExecution = function () { g || f || (g = !0, O(j)); }, t.unstable_forceFrameRate = function (e) { 0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : T = 0 < e ? Math.floor(1e3 / e) : 5; }, t.unstable_getCurrentPriorityLevel = function () { return h; }, t.unstable_getFirstCallbackNode = function () { return r(c); }, t.unstable_next = function (e) { switch (h) {
            case 1:
            case 2:
            case 3:
                var t = 3;
                break;
            default: t = h;
        } var n = h; h = t; try {
            return e();
        }
        finally {
            h = n;
        } }, t.unstable_pauseExecution = function () { }, t.unstable_requestPaint = function () { }, t.unstable_runWithPriority = function (e, t) { switch (e) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5: break;
            default: e = 3;
        } var n = h; h = e; try {
            return t();
        }
        finally {
            h = n;
        } }, t.unstable_scheduleCallback = function (e, i, a) { var o = t.unstable_now(); switch ("object" === typeof a && null !== a ? a = "number" === typeof (a = a.delay) && 0 < a ? o + a : o : a = o, e) {
            case 1:
                var s = -1;
                break;
            case 2:
                s = 250;
                break;
            case 5:
                s = 1073741823;
                break;
            case 4:
                s = 1e4;
                break;
            default: s = 5e3;
        } return e = { id: u++, callback: i, priorityLevel: e, startTime: a, expirationTime: s = a + s, sortIndex: -1 }, a > o ? (e.sortIndex = a, n(d, e), null === r(c) && e === r(d) && (m ? (b(C), C = -1) : m = !0, z(w, a - o))) : (e.sortIndex = s, n(c, e), g || f || (g = !0, O(j))), e; }, t.unstable_shouldYield = E, t.unstable_wrapCallback = function (e) { var t = h; return function () { var n = h; h = t; try {
            return e.apply(this, arguments);
        }
        finally {
            h = n;
        } }; };
    }, 853(e, t, n) {
        "use strict";
        e.exports = n(234);
    }, 844(e) { e.exports = { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 }; } }, t = {}; function n(r) { var i = t[r]; if (void 0 !== i)
    return i.exports; var a = t[r] = { exports: {} }; return e[r](a, a.exports, n), a.exports; } n.m = e, n.n = e => { var t = e && e.__esModule ? () => e.default : () => e; return n.d(t, { a: t }), t; }, (() => { var e, t = Object.getPrototypeOf ? e => Object.getPrototypeOf(e) : e => e.__proto__; n.t = function (r, i) { if (1 & i && (r = this(r)), 8 & i)
    return r; if ("object" === typeof r && r) {
    if (4 & i && r.__esModule)
        return r;
    if (16 & i && "function" === typeof r.then)
        return r;
} var a = Object.create(null); n.r(a); var o = {}; e = e || [null, t({}), t([]), t(t)]; for (var s = 2 & i && r; ("object" == typeof s || "function" == typeof s) && !~e.indexOf(s); s = t(s))
    Object.getOwnPropertyNames(s).forEach(e => o[e] = () => r[e]); return o.default = () => r, n.d(a, o), a; }; })(), n.d = (e, t) => { for (var r in t)
    n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: t[r] }); }, n.f = {}, n.e = e => Promise.all(Object.keys(n.f).reduce((t, r) => (n.f[r](e, t), t), [])), n.u = e => "static/js/" + e + ".a6998d7e.chunk.js", n.miniCssF = e => { }, n.g = function () { if ("object" === typeof globalThis)
    return globalThis; try {
    return this || new Function("return this")();
}
catch (e) {
    if ("object" === typeof window)
        return window;
} }(), n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => { var e = {}, t = "frontend:"; n.l = (r, i, a, o) => { if (e[r])
    e[r].push(i);
else {
    var s, l;
    if (void 0 !== a)
        for (var c = document.getElementsByTagName("script"), d = 0; d < c.length; d++) {
            var u = c[d];
            if (u.getAttribute("src") == r || u.getAttribute("data-webpack") == t + a) {
                s = u;
                break;
            }
        }
    s || (l = !0, (s = document.createElement("script")).charset = "utf-8", n.nc && s.setAttribute("nonce", n.nc), s.setAttribute("data-webpack", t + a), s.src = r), e[r] = [i];
    var p = (t, n) => { s.onerror = s.onload = null, clearTimeout(h); var i = e[r]; if (delete e[r], s.parentNode && s.parentNode.removeChild(s), i && i.forEach(e => e(n)), t)
        return t(n); }, h = setTimeout(p.bind(null, void 0, { type: "timeout", target: s }), 12e4);
    s.onerror = p.bind(null, s.onerror), s.onload = p.bind(null, s.onload), l && document.head.appendChild(s);
} }; })(), n.r = e => { "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }); }, n.p = "/", (() => { var e = { 792: 0 }; n.f.j = (t, r) => { var i = n.o(e, t) ? e[t] : void 0; if (0 !== i)
    if (i)
        r.push(i[2]);
    else {
        var a = new Promise((n, r) => i = e[t] = [n, r]);
        r.push(i[2] = a);
        var o = n.p + n.u(t), s = new Error;
        n.l(o, r => { if (n.o(e, t) && (0 !== (i = e[t]) && (e[t] = void 0), i)) {
            var a = r && ("load" === r.type ? "missing" : r.type), o = r && r.target && r.target.src;
            s.message = "Loading chunk " + t + " failed.\n(" + a + ": " + o + ")", s.name = "ChunkLoadError", s.type = a, s.request = o, i[1](s);
        } }, "chunk-" + t, t);
    } }; var t = (t, r) => { var i, a, [o, s, l] = r, c = 0; if (o.some(t => 0 !== e[t])) {
    for (i in s)
        n.o(s, i) && (n.m[i] = s[i]);
    if (l)
        l(n);
} for (t && t(r); c < o.length; c++)
    a = o[c], n.o(e, a) && e[a] && e[a][0](), e[a] = 0; }, r = self.webpackChunkfrontend = self.webpackChunkfrontend || []; r.forEach(t.bind(null, 0)), r.push = t.bind(null, r.push.bind(r)); })(), (() => {
    "use strict";
    var e = {};
    n.r(e), n.d(e, { hasBrowserEnv: () => vr, hasStandardBrowserEnv: () => jr, hasStandardBrowserWebWorkerEnv: () => kr, navigator: () => wr, origin: () => Sr });
    var t = {};
    n.r(t), n.d(t, { Decoder: () => no, Encoder: () => to, PacketType: () => eo, isPacketValid: () => oo, protocol: () => $a });
    var r = n(43), i = n.t(r, 2), a = n(391);
    function o(e, t) { (null == t || t > e.length) && (t = e.length); for (var n = 0, r = Array(t); n < t; n++)
        r[n] = e[n]; return r; }
    function s(e) { if (Array.isArray(e))
        return e; }
    function l(e, t) { if (e) {
        if ("string" == typeof e)
            return o(e, t);
        var n = {}.toString.call(e).slice(8, -1);
        return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? o(e, t) : void 0;
    } }
    function c() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    function d(e) { return s(e) || function (e) { if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"])
        return Array.from(e); }(e) || l(e) || c(); }
    function u(e, t) { return s(e) || function (e, t) { var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"]; if (null != n) {
        var r, i, a, o, s = [], l = !0, c = !1;
        try {
            if (a = (n = n.call(e)).next, 0 === t) {
                if (Object(n) !== n)
                    return;
                l = !1;
            }
            else
                for (; !(l = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); l = !0)
                    ;
        }
        catch (e) {
            c = !0, i = e;
        }
        finally {
            try {
                if (!l && null != n.return && (o = n.return(), Object(o) !== o))
                    return;
            }
            finally {
                if (c)
                    throw i;
            }
        }
        return s;
    } }(e, t) || l(e, t) || c(); }
    function p(e) { return p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) { return typeof e; } : function (e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e; }, p(e); }
    function h(e) { var t = function (e, t) { if ("object" != p(e) || !e)
        return e; var n = e[Symbol.toPrimitive]; if (void 0 !== n) {
        var r = n.call(e, t || "default");
        if ("object" != p(r))
            return r;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    } return ("string" === t ? String : Number)(e); }(e, "string"); return "symbol" == p(t) ? t : t + ""; }
    function f(e, t, n) { return (t = h(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e; }
    function g(e, t) { var n = Object.keys(e); if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter(function (t) { return Object.getOwnPropertyDescriptor(e, t).enumerable; })), n.push.apply(n, r);
    } return n; }
    function m(e) { for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? g(Object(n), !0).forEach(function (t) { f(e, t, n[t]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : g(Object(n)).forEach(function (t) { Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t)); });
    } return e; }
    const x = e => "string" === typeof e, b = () => { let e, t; const n = new Promise((n, r) => { e = n, t = r; }); return n.resolve = e, n.reject = t, n; }, y = e => null == e ? "" : "" + e, v = /###/g, w = e => e && e.indexOf("###") > -1 ? e.replace(v, ".") : e, j = e => !e || x(e), k = (e, t, n) => { const r = x(t) ? t.split(".") : t; let i = 0; for (; i < r.length - 1;) {
        if (j(e))
            return {};
        const t = w(r[i]);
        !e[t] && n && (e[t] = new n), e = Object.prototype.hasOwnProperty.call(e, t) ? e[t] : {}, ++i;
    } return j(e) ? {} : { obj: e, k: w(r[i]) }; }, S = (e, t, n) => { const r = k(e, t, Object), i = r.obj, a = r.k; if (void 0 !== i || 1 === t.length)
        return void (i[a] = n); let o = t[t.length - 1], s = t.slice(0, t.length - 1), l = k(e, s, Object); for (; void 0 === l.obj && s.length;)
        o = "".concat(s[s.length - 1], ".").concat(o), s = s.slice(0, s.length - 1), l = k(e, s, Object), l && l.obj && "undefined" !== typeof l.obj["".concat(l.k, ".").concat(o)] && (l.obj = void 0); l.obj["".concat(l.k, ".").concat(o)] = n; }, N = (e, t) => { const n = k(e, t), r = n.obj, i = n.k; if (r)
        return r[i]; }, C = (e, t, n) => { for (const r in t)
        "__proto__" !== r && "constructor" !== r && (r in e ? x(e[r]) || e[r] instanceof String || x(t[r]) || t[r] instanceof String ? n && (e[r] = t[r]) : C(e[r], t[r], n) : e[r] = t[r]); return e; }, T = e => e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    var A = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;" };
    const E = e => x(e) ? e.replace(/[&<>"'\/]/g, e => A[e]) : e;
    const R = [" ", ",", "?", "!", ";"], P = new class {
        constructor(e) { this.capacity = e, this.regExpMap = new Map, this.regExpQueue = []; }
        getRegExp(e) { const t = this.regExpMap.get(e); if (void 0 !== t)
            return t; const n = new RegExp(e); return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, n), this.regExpQueue.push(e), n; }
    }(20), L = function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "."; if (!e)
        return; if (e[t])
        return e[t]; const r = t.split(n); let i = e; for (let a = 0; a < r.length;) {
        if (!i || "object" !== typeof i)
            return;
        let e, t = "";
        for (let o = a; o < r.length; ++o)
            if (o !== a && (t += n), t += r[o], e = i[t], void 0 !== e) {
                if (["string", "number", "boolean"].indexOf(typeof e) > -1 && o < r.length - 1)
                    continue;
                a += o - a + 1;
                break;
            }
        i = e;
    } return i; }, O = e => e && e.replace("_", "-"), z = { type: "logger", log(e) { this.output("log", e); }, warn(e) { this.output("warn", e); }, error(e) { this.output("error", e); }, output(e, t) { console && console[e] && console[e].apply(console, t); } };
    class B {
        constructor(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; this.init(e, t); }
        init(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; this.prefix = t.prefix || "i18next:", this.logger = e || z, this.options = t, this.debug = t.debug; }
        log() { for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n]; return this.forward(t, "log", "", !0); }
        warn() { for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n]; return this.forward(t, "warn", "", !0); }
        error() { for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n]; return this.forward(t, "error", ""); }
        deprecate() { for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n]; return this.forward(t, "warn", "WARNING DEPRECATED: ", !0); }
        forward(e, t, n, r) { return r && !this.debug ? null : (x(e[0]) && (e[0] = "".concat(n).concat(this.prefix, " ").concat(e[0])), this.logger[t](e)); }
        create(e) { return new B(this.logger, m(m({}, { prefix: "".concat(this.prefix, ":").concat(e, ":") }), this.options)); }
        clone(e) { return (e = e || this.options).prefix = e.prefix || this.prefix, new B(this.logger, e); }
    }
    var D = new B;
    class F {
        constructor() { this.observers = {}; }
        on(e, t) { return e.split(" ").forEach(e => { this.observers[e] || (this.observers[e] = new Map); const n = this.observers[e].get(t) || 0; this.observers[e].set(t, n + 1); }), this; }
        off(e, t) { this.observers[e] && (t ? this.observers[e].delete(t) : delete this.observers[e]); }
        emit(e) { for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
            n[r - 1] = arguments[r]; if (this.observers[e]) {
            Array.from(this.observers[e].entries()).forEach(e => { let t = u(e, 2), r = t[0], i = t[1]; for (let a = 0; a < i; a++)
                r(...n); });
        } if (this.observers["*"]) {
            Array.from(this.observers["*"].entries()).forEach(t => { let r = u(t, 2), i = r[0], a = r[1]; for (let o = 0; o < a; o++)
                i.apply(i, [e, ...n]); });
        } }
    }
    class M extends F {
        constructor(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { ns: ["translation"], defaultNS: "translation" }; super(), this.data = e || {}, this.options = t, void 0 === this.options.keySeparator && (this.options.keySeparator = "."), void 0 === this.options.ignoreJSONStructure && (this.options.ignoreJSONStructure = !0); }
        addNamespaces(e) { this.options.ns.indexOf(e) < 0 && this.options.ns.push(e); }
        removeNamespaces(e) { const t = this.options.ns.indexOf(e); t > -1 && this.options.ns.splice(t, 1); }
        getResource(e, t, n) { let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}; const i = void 0 !== r.keySeparator ? r.keySeparator : this.options.keySeparator, a = void 0 !== r.ignoreJSONStructure ? r.ignoreJSONStructure : this.options.ignoreJSONStructure; let o; e.indexOf(".") > -1 ? o = e.split(".") : (o = [e, t], n && (Array.isArray(n) ? o.push(...n) : x(n) && i ? o.push(...n.split(i)) : o.push(n))); const s = N(this.data, o); return !s && !t && !n && e.indexOf(".") > -1 && (e = o[0], t = o[1], n = o.slice(2).join(".")), !s && a && x(n) ? L(this.data && this.data[e] && this.data[e][t], n, i) : s; }
        addResource(e, t, n, r) { let i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : { silent: !1 }; const a = void 0 !== i.keySeparator ? i.keySeparator : this.options.keySeparator; let o = [e, t]; n && (o = o.concat(a ? n.split(a) : n)), e.indexOf(".") > -1 && (o = e.split("."), r = t, t = o[1]), this.addNamespaces(t), S(this.data, o, r), i.silent || this.emit("added", e, t, n, r); }
        addResources(e, t, n) { let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : { silent: !1 }; for (const i in n)
            (x(n[i]) || Array.isArray(n[i])) && this.addResource(e, t, i, n[i], { silent: !0 }); r.silent || this.emit("added", e, t, n); }
        addResourceBundle(e, t, n, r, i) { let a = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : { silent: !1, skipCopy: !1 }, o = [e, t]; e.indexOf(".") > -1 && (o = e.split("."), r = n, n = t, t = o[1]), this.addNamespaces(t); let s = N(this.data, o) || {}; a.skipCopy || (n = JSON.parse(JSON.stringify(n))), r ? C(s, n, i) : s = m(m({}, s), n), S(this.data, o, s), a.silent || this.emit("added", e, t, n); }
        removeResourceBundle(e, t) { this.hasResourceBundle(e, t) && delete this.data[e][t], this.removeNamespaces(t), this.emit("removed", e, t); }
        hasResourceBundle(e, t) { return void 0 !== this.getResource(e, t); }
        getResourceBundle(e, t) { return t || (t = this.options.defaultNS), "v1" === this.options.compatibilityAPI ? m(m({}, {}), this.getResource(e, t)) : this.getResource(e, t); }
        getDataByLanguage(e) { return this.data[e]; }
        hasLanguageSomeTranslations(e) { const t = this.getDataByLanguage(e); return !!(t && Object.keys(t) || []).find(e => t[e] && Object.keys(t[e]).length > 0); }
        toJSON() { return this.data; }
    }
    var I = { processors: {}, addPostProcessor(e) { this.processors[e.name] = e; }, handle(e, t, n, r, i) { return e.forEach(e => { this.processors[e] && (t = this.processors[e].process(t, n, r, i)); }), t; } };
    const U = {};
    class _ extends F {
        constructor(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; super(), ((e, t, n) => { e.forEach(e => { t[e] && (n[e] = t[e]); }); })(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], e, this), this.options = t, void 0 === this.options.keySeparator && (this.options.keySeparator = "."), this.logger = D.create("translator"); }
        changeLanguage(e) { e && (this.language = e); }
        exists(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { interpolation: {} }; if (void 0 === e || null === e)
            return !1; const n = this.resolve(e, t); return n && void 0 !== n.res; }
        extractFromKey(e, t) { let n = void 0 !== t.nsSeparator ? t.nsSeparator : this.options.nsSeparator; void 0 === n && (n = ":"); const r = void 0 !== t.keySeparator ? t.keySeparator : this.options.keySeparator; let i = t.ns || this.options.defaultNS || []; const a = n && e.indexOf(n) > -1, o = !this.options.userDefinedKeySeparator && !t.keySeparator && !this.options.userDefinedNsSeparator && !t.nsSeparator && !((e, t, n) => { t = t || "", n = n || ""; const r = R.filter(e => t.indexOf(e) < 0 && n.indexOf(e) < 0); if (0 === r.length)
            return !0; const i = P.getRegExp("(".concat(r.map(e => "?" === e ? "\\?" : e).join("|"), ")")); let a = !i.test(e); if (!a) {
            const t = e.indexOf(n);
            t > 0 && !i.test(e.substring(0, t)) && (a = !0);
        } return a; })(e, n, r); if (a && !o) {
            const t = e.match(this.interpolator.nestingRegexp);
            if (t && t.length > 0)
                return { key: e, namespaces: x(i) ? [i] : i };
            const a = e.split(n);
            (n !== r || n === r && this.options.ns.indexOf(a[0]) > -1) && (i = a.shift()), e = a.join(r);
        } return { key: e, namespaces: x(i) ? [i] : i }; }
        translate(e, t, n) { if ("object" !== typeof t && this.options.overloadTranslationOptionHandler && (t = this.options.overloadTranslationOptionHandler(arguments)), "object" === typeof t && (t = m({}, t)), t || (t = {}), void 0 === e || null === e)
            return ""; Array.isArray(e) || (e = [String(e)]); const r = void 0 !== t.returnDetails ? t.returnDetails : this.options.returnDetails, i = void 0 !== t.keySeparator ? t.keySeparator : this.options.keySeparator, a = this.extractFromKey(e[e.length - 1], t), o = a.key, s = a.namespaces, l = s[s.length - 1], c = t.lng || this.language, d = t.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode; if (c && "cimode" === c.toLowerCase()) {
            if (d) {
                const e = t.nsSeparator || this.options.nsSeparator;
                return r ? { res: "".concat(l).concat(e).concat(o), usedKey: o, exactUsedKey: o, usedLng: c, usedNS: l, usedParams: this.getUsedParamsDetails(t) } : "".concat(l).concat(e).concat(o);
            }
            return r ? { res: o, usedKey: o, exactUsedKey: o, usedLng: c, usedNS: l, usedParams: this.getUsedParamsDetails(t) } : o;
        } const u = this.resolve(e, t); let p = u && u.res; const h = u && u.usedKey || o, f = u && u.exactUsedKey || o, g = Object.prototype.toString.apply(p), b = void 0 !== t.joinArrays ? t.joinArrays : this.options.joinArrays, y = !this.i18nFormat || this.i18nFormat.handleAsObject, v = !x(p) && "boolean" !== typeof p && "number" !== typeof p; if (!(y && p && v && ["[object Number]", "[object Function]", "[object RegExp]"].indexOf(g) < 0) || x(b) && Array.isArray(p))
            if (y && x(b) && Array.isArray(p))
                p = p.join(b), p && (p = this.extendTranslation(p, e, t, n));
            else {
                let r = !1, a = !1;
                const s = void 0 !== t.count && !x(t.count), d = _.hasDefaultValue(t), h = s ? this.pluralResolver.getSuffix(c, t.count, t) : "", f = t.ordinal && s ? this.pluralResolver.getSuffix(c, t.count, { ordinal: !1 }) : "", g = s && !t.ordinal && 0 === t.count && this.pluralResolver.shouldUseIntlApi(), b = g && t["defaultValue".concat(this.options.pluralSeparator, "zero")] || t["defaultValue".concat(h)] || t["defaultValue".concat(f)] || t.defaultValue;
                !this.isValidLookup(p) && d && (r = !0, p = b), this.isValidLookup(p) || (a = !0, p = o);
                const y = (t.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && a ? void 0 : p, v = d && b !== p && this.options.updateMissing;
                if (a || r || v) {
                    if (this.logger.log(v ? "updateKey" : "missingKey", c, l, o, v ? b : p), i) {
                        const e = this.resolve(o, m(m({}, t), {}, { keySeparator: !1 }));
                        e && e.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
                    }
                    let e = [];
                    const n = this.languageUtils.getFallbackCodes(this.options.fallbackLng, t.lng || this.language);
                    if ("fallback" === this.options.saveMissingTo && n && n[0])
                        for (let t = 0; t < n.length; t++)
                            e.push(n[t]);
                    else
                        "all" === this.options.saveMissingTo ? e = this.languageUtils.toResolveHierarchy(t.lng || this.language) : e.push(t.lng || this.language);
                    const r = (e, n, r) => { const i = d && r !== p ? r : y; this.options.missingKeyHandler ? this.options.missingKeyHandler(e, l, n, i, v, t) : this.backendConnector && this.backendConnector.saveMissing && this.backendConnector.saveMissing(e, l, n, i, v, t), this.emit("missingKey", e, l, n, p); };
                    this.options.saveMissing && (this.options.saveMissingPlurals && s ? e.forEach(e => { const n = this.pluralResolver.getSuffixes(e, t); g && t["defaultValue".concat(this.options.pluralSeparator, "zero")] && n.indexOf("".concat(this.options.pluralSeparator, "zero")) < 0 && n.push("".concat(this.options.pluralSeparator, "zero")), n.forEach(n => { r([e], o + n, t["defaultValue".concat(n)] || b); }); }) : r(e, o, b));
                }
                p = this.extendTranslation(p, e, t, u, n), a && p === o && this.options.appendNamespaceToMissingKey && (p = "".concat(l, ":").concat(o)), (a || r) && this.options.parseMissingKeyHandler && (p = "v1" !== this.options.compatibilityAPI ? this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? "".concat(l, ":").concat(o) : o, r ? p : void 0) : this.options.parseMissingKeyHandler(p));
            }
        else {
            if (!t.returnObjects && !this.options.returnObjects) {
                this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
                const e = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(h, p, m(m({}, t), {}, { ns: s })) : "key '".concat(o, " (").concat(this.language, ")' returned an object instead of string.");
                return r ? (u.res = e, u.usedParams = this.getUsedParamsDetails(t), u) : e;
            }
            if (i) {
                const e = Array.isArray(p), n = e ? [] : {}, r = e ? f : h;
                for (const a in p)
                    if (Object.prototype.hasOwnProperty.call(p, a)) {
                        const e = "".concat(r).concat(i).concat(a);
                        n[a] = this.translate(e, m(m({}, t), { joinArrays: !1, ns: s })), n[a] === e && (n[a] = p[a]);
                    }
                p = n;
            }
        } return r ? (u.res = p, u.usedParams = this.getUsedParamsDetails(t), u) : p; }
        extendTranslation(e, t, n, r, i) { var a = this; if (this.i18nFormat && this.i18nFormat.parse)
            e = this.i18nFormat.parse(e, m(m({}, this.options.interpolation.defaultVariables), n), n.lng || this.language || r.usedLng, r.usedNS, r.usedKey, { resolved: r });
        else if (!n.skipInterpolation) {
            n.interpolation && this.interpolator.init(m(m({}, n), { interpolation: m(m({}, this.options.interpolation), n.interpolation) }));
            const o = x(e) && (n && n.interpolation && void 0 !== n.interpolation.skipOnVariables ? n.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
            let s;
            if (o) {
                const t = e.match(this.interpolator.nestingRegexp);
                s = t && t.length;
            }
            let l = n.replace && !x(n.replace) ? n.replace : n;
            if (this.options.interpolation.defaultVariables && (l = m(m({}, this.options.interpolation.defaultVariables), l)), e = this.interpolator.interpolate(e, l, n.lng || this.language || r.usedLng, n), o) {
                const t = e.match(this.interpolator.nestingRegexp);
                s < (t && t.length) && (n.nest = !1);
            }
            !n.lng && "v1" !== this.options.compatibilityAPI && r && r.res && (n.lng = this.language || r.usedLng), !1 !== n.nest && (e = this.interpolator.nest(e, function () { for (var e = arguments.length, r = new Array(e), o = 0; o < e; o++)
                r[o] = arguments[o]; return i && i[0] === r[0] && !n.context ? (a.logger.warn("It seems you are nesting recursively key: ".concat(r[0], " in key: ").concat(t[0])), null) : a.translate(...r, t); }, n)), n.interpolation && this.interpolator.reset();
        } const o = n.postProcess || this.options.postProcess, s = x(o) ? [o] : o; return void 0 !== e && null !== e && s && s.length && !1 !== n.applyPostProcessor && (e = I.handle(s, e, t, this.options && this.options.postProcessPassResolved ? m({ i18nResolved: m(m({}, r), {}, { usedParams: this.getUsedParamsDetails(n) }) }, n) : n, this)), e; }
        resolve(e) { let t, n, r, i, a, o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return x(e) && (e = [e]), e.forEach(e => { if (this.isValidLookup(t))
            return; const s = this.extractFromKey(e, o), l = s.key; n = l; let c = s.namespaces; this.options.fallbackNS && (c = c.concat(this.options.fallbackNS)); const d = void 0 !== o.count && !x(o.count), u = d && !o.ordinal && 0 === o.count && this.pluralResolver.shouldUseIntlApi(), p = void 0 !== o.context && (x(o.context) || "number" === typeof o.context) && "" !== o.context, h = o.lngs ? o.lngs : this.languageUtils.toResolveHierarchy(o.lng || this.language, o.fallbackLng); c.forEach(e => { this.isValidLookup(t) || (a = e, !U["".concat(h[0], "-").concat(e)] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(a) && (U["".concat(h[0], "-").concat(e)] = !0, this.logger.warn('key "'.concat(n, '" for languages "').concat(h.join(", "), '" won\'t get resolved as namespace "').concat(a, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), h.forEach(n => { if (this.isValidLookup(t))
            return; i = n; const a = [l]; if (this.i18nFormat && this.i18nFormat.addLookupKeys)
            this.i18nFormat.addLookupKeys(a, l, n, e, o);
        else {
            let e;
            d && (e = this.pluralResolver.getSuffix(n, o.count, o));
            const t = "".concat(this.options.pluralSeparator, "zero"), r = "".concat(this.options.pluralSeparator, "ordinal").concat(this.options.pluralSeparator);
            if (d && (a.push(l + e), o.ordinal && 0 === e.indexOf(r) && a.push(l + e.replace(r, this.options.pluralSeparator)), u && a.push(l + t)), p) {
                const n = "".concat(l).concat(this.options.contextSeparator).concat(o.context);
                a.push(n), d && (a.push(n + e), o.ordinal && 0 === e.indexOf(r) && a.push(n + e.replace(r, this.options.pluralSeparator)), u && a.push(n + t));
            }
        } let s; for (; s = a.pop();)
            this.isValidLookup(t) || (r = s, t = this.getResource(n, e, s, o)); })); }); }), { res: t, usedKey: n, exactUsedKey: r, usedLng: i, usedNS: a }; }
        isValidLookup(e) { return void 0 !== e && !(!this.options.returnNull && null === e) && !(!this.options.returnEmptyString && "" === e); }
        getResource(e, t, n) { let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}; return this.i18nFormat && this.i18nFormat.getResource ? this.i18nFormat.getResource(e, t, n, r) : this.resourceStore.getResource(e, t, n, r); }
        getUsedParamsDetails() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; const t = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], n = e.replace && !x(e.replace); let r = n ? e.replace : e; if (n && "undefined" !== typeof e.count && (r.count = e.count), this.options.interpolation.defaultVariables && (r = m(m({}, this.options.interpolation.defaultVariables), r)), !n) {
            r = m({}, r);
            for (const e of t)
                delete r[e];
        } return r; }
        static hasDefaultValue(e) { const t = "defaultValue"; for (const n in e)
            if (Object.prototype.hasOwnProperty.call(e, n) && t === n.substring(0, 12) && void 0 !== e[n])
                return !0; return !1; }
    }
    const W = e => e.charAt(0).toUpperCase() + e.slice(1);
    class H {
        constructor(e) { this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = D.create("languageUtils"); }
        getScriptPartFromCode(e) { if (!(e = O(e)) || e.indexOf("-") < 0)
            return null; const t = e.split("-"); return 2 === t.length ? null : (t.pop(), "x" === t[t.length - 1].toLowerCase() ? null : this.formatLanguageCode(t.join("-"))); }
        getLanguagePartFromCode(e) { if (!(e = O(e)) || e.indexOf("-") < 0)
            return e; const t = e.split("-"); return this.formatLanguageCode(t[0]); }
        formatLanguageCode(e) { if (x(e) && e.indexOf("-") > -1) {
            if ("undefined" !== typeof Intl && "undefined" !== typeof Intl.getCanonicalLocales)
                try {
                    let t = Intl.getCanonicalLocales(e)[0];
                    if (t && this.options.lowerCaseLng && (t = t.toLowerCase()), t)
                        return t;
                }
                catch (t) { }
            const n = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
            let r = e.split("-");
            return this.options.lowerCaseLng ? r = r.map(e => e.toLowerCase()) : 2 === r.length ? (r[0] = r[0].toLowerCase(), r[1] = r[1].toUpperCase(), n.indexOf(r[1].toLowerCase()) > -1 && (r[1] = W(r[1].toLowerCase()))) : 3 === r.length && (r[0] = r[0].toLowerCase(), 2 === r[1].length && (r[1] = r[1].toUpperCase()), "sgn" !== r[0] && 2 === r[2].length && (r[2] = r[2].toUpperCase()), n.indexOf(r[1].toLowerCase()) > -1 && (r[1] = W(r[1].toLowerCase())), n.indexOf(r[2].toLowerCase()) > -1 && (r[2] = W(r[2].toLowerCase()))), r.join("-");
        } return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e; }
        isSupportedCode(e) { return ("languageOnly" === this.options.load || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1; }
        getBestMatchFromCodes(e) { if (!e)
            return null; let t; return e.forEach(e => { if (t)
            return; const n = this.formatLanguageCode(e); this.options.supportedLngs && !this.isSupportedCode(n) || (t = n); }), !t && this.options.supportedLngs && e.forEach(e => { if (t)
            return; const n = this.getLanguagePartFromCode(e); if (this.isSupportedCode(n))
            return t = n; t = this.options.supportedLngs.find(e => e === n ? e : e.indexOf("-") < 0 && n.indexOf("-") < 0 ? void 0 : e.indexOf("-") > 0 && n.indexOf("-") < 0 && e.substring(0, e.indexOf("-")) === n || 0 === e.indexOf(n) && n.length > 1 ? e : void 0); }), t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]), t; }
        getFallbackCodes(e, t) { if (!e)
            return []; if ("function" === typeof e && (e = e(t)), x(e) && (e = [e]), Array.isArray(e))
            return e; if (!t)
            return e.default || []; let n = e[t]; return n || (n = e[this.getScriptPartFromCode(t)]), n || (n = e[this.formatLanguageCode(t)]), n || (n = e[this.getLanguagePartFromCode(t)]), n || (n = e.default), n || []; }
        toResolveHierarchy(e, t) { const n = this.getFallbackCodes(t || this.options.fallbackLng || [], e), r = [], i = e => { e && (this.isSupportedCode(e) ? r.push(e) : this.logger.warn("rejecting language code not found in supportedLngs: ".concat(e))); }; return x(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1) ? ("languageOnly" !== this.options.load && i(this.formatLanguageCode(e)), "languageOnly" !== this.options.load && "currentOnly" !== this.options.load && i(this.getScriptPartFromCode(e)), "currentOnly" !== this.options.load && i(this.getLanguagePartFromCode(e))) : x(e) && i(this.formatLanguageCode(e)), n.forEach(e => { r.indexOf(e) < 0 && i(this.formatLanguageCode(e)); }), r; }
    }
    let V = [{ lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"], nr: [1, 2], fc: 1 }, { lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"], nr: [1, 2], fc: 2 }, { lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"], nr: [1], fc: 3 }, { lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"], nr: [1, 2, 5], fc: 4 }, { lngs: ["ar"], nr: [0, 1, 2, 3, 11, 100], fc: 5 }, { lngs: ["cs", "sk"], nr: [1, 2, 5], fc: 6 }, { lngs: ["csb", "pl"], nr: [1, 2, 5], fc: 7 }, { lngs: ["cy"], nr: [1, 2, 3, 8], fc: 8 }, { lngs: ["fr"], nr: [1, 2], fc: 9 }, { lngs: ["ga"], nr: [1, 2, 3, 7, 11], fc: 10 }, { lngs: ["gd"], nr: [1, 2, 3, 20], fc: 11 }, { lngs: ["is"], nr: [1, 2], fc: 12 }, { lngs: ["jv"], nr: [0, 1], fc: 13 }, { lngs: ["kw"], nr: [1, 2, 3, 4], fc: 14 }, { lngs: ["lt"], nr: [1, 2, 10], fc: 15 }, { lngs: ["lv"], nr: [1, 2, 0], fc: 16 }, { lngs: ["mk"], nr: [1, 2], fc: 17 }, { lngs: ["mnk"], nr: [0, 1, 2], fc: 18 }, { lngs: ["mt"], nr: [1, 2, 11, 20], fc: 19 }, { lngs: ["or"], nr: [2, 1], fc: 2 }, { lngs: ["ro"], nr: [1, 2, 20], fc: 20 }, { lngs: ["sl"], nr: [5, 1, 2, 3], fc: 21 }, { lngs: ["he", "iw"], nr: [1, 2, 20, 21], fc: 22 }], q = { 1: e => Number(e > 1), 2: e => Number(1 != e), 3: e => 0, 4: e => Number(e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2), 5: e => Number(0 == e ? 0 : 1 == e ? 1 : 2 == e ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5), 6: e => Number(1 == e ? 0 : e >= 2 && e <= 4 ? 1 : 2), 7: e => Number(1 == e ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2), 8: e => Number(1 == e ? 0 : 2 == e ? 1 : 8 != e && 11 != e ? 2 : 3), 9: e => Number(e >= 2), 10: e => Number(1 == e ? 0 : 2 == e ? 1 : e < 7 ? 2 : e < 11 ? 3 : 4), 11: e => Number(1 == e || 11 == e ? 0 : 2 == e || 12 == e ? 1 : e > 2 && e < 20 ? 2 : 3), 12: e => Number(e % 10 != 1 || e % 100 == 11), 13: e => Number(0 !== e), 14: e => Number(1 == e ? 0 : 2 == e ? 1 : 3 == e ? 2 : 3), 15: e => Number(e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2), 16: e => Number(e % 10 == 1 && e % 100 != 11 ? 0 : 0 !== e ? 1 : 2), 17: e => Number(1 == e || e % 10 == 1 && e % 100 != 11 ? 0 : 1), 18: e => Number(0 == e ? 0 : 1 == e ? 1 : 2), 19: e => Number(1 == e ? 0 : 0 == e || e % 100 > 1 && e % 100 < 11 ? 1 : e % 100 > 10 && e % 100 < 20 ? 2 : 3), 20: e => Number(1 == e ? 0 : 0 == e || e % 100 > 0 && e % 100 < 20 ? 1 : 2), 21: e => Number(e % 100 == 1 ? 1 : e % 100 == 2 ? 2 : e % 100 == 3 || e % 100 == 4 ? 3 : 0), 22: e => Number(1 == e ? 0 : 2 == e ? 1 : (e < 0 || e > 10) && e % 10 == 0 ? 2 : 3) };
    const K = ["v1", "v2", "v3"], G = ["v4"], Y = { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 };
    class X {
        constructor(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; this.languageUtils = e, this.options = t, this.logger = D.create("pluralResolver"), this.options.compatibilityJSON && !G.includes(this.options.compatibilityJSON) || "undefined" !== typeof Intl && Intl.PluralRules || (this.options.compatibilityJSON = "v3", this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.")), this.rules = (() => { const e = {}; return V.forEach(t => { t.lngs.forEach(n => { e[n] = { numbers: t.nr, plurals: q[t.fc] }; }); }), e; })(), this.pluralRulesCache = {}; }
        addRule(e, t) { this.rules[e] = t; }
        clearCache() { this.pluralRulesCache = {}; }
        getRule(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; if (this.shouldUseIntlApi()) {
            const r = O("dev" === e ? "en" : e), i = t.ordinal ? "ordinal" : "cardinal", a = JSON.stringify({ cleanedCode: r, type: i });
            if (a in this.pluralRulesCache)
                return this.pluralRulesCache[a];
            let o;
            try {
                o = new Intl.PluralRules(r, { type: i });
            }
            catch (n) {
                if (!e.match(/-|_/))
                    return;
                const r = this.languageUtils.getLanguagePartFromCode(e);
                o = this.getRule(r, t);
            }
            return this.pluralRulesCache[a] = o, o;
        } return this.rules[e] || this.rules[this.languageUtils.getLanguagePartFromCode(e)]; }
        needsPlural(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; const n = this.getRule(e, t); return this.shouldUseIntlApi() ? n && n.resolvedOptions().pluralCategories.length > 1 : n && n.numbers.length > 1; }
        getPluralFormsOfKey(e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; return this.getSuffixes(e, n).map(e => "".concat(t).concat(e)); }
        getSuffixes(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; const n = this.getRule(e, t); return n ? this.shouldUseIntlApi() ? n.resolvedOptions().pluralCategories.sort((e, t) => Y[e] - Y[t]).map(e => "".concat(this.options.prepend).concat(t.ordinal ? "ordinal".concat(this.options.prepend) : "").concat(e)) : n.numbers.map(n => this.getSuffix(e, n, t)) : []; }
        getSuffix(e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; const r = this.getRule(e, n); return r ? this.shouldUseIntlApi() ? "".concat(this.options.prepend).concat(n.ordinal ? "ordinal".concat(this.options.prepend) : "").concat(r.select(t)) : this.getSuffixRetroCompatible(r, t) : (this.logger.warn("no plural rule found for: ".concat(e)), ""); }
        getSuffixRetroCompatible(e, t) { const n = e.noAbs ? e.plurals(t) : e.plurals(Math.abs(t)); let r = e.numbers[n]; this.options.simplifyPluralSuffix && 2 === e.numbers.length && 1 === e.numbers[0] && (2 === r ? r = "plural" : 1 === r && (r = "")); const i = () => this.options.prepend && r.toString() ? this.options.prepend + r.toString() : r.toString(); return "v1" === this.options.compatibilityJSON ? 1 === r ? "" : "number" === typeof r ? "_plural_".concat(r.toString()) : i() : "v2" === this.options.compatibilityJSON || this.options.simplifyPluralSuffix && 2 === e.numbers.length && 1 === e.numbers[0] ? i() : this.options.prepend && n.toString() ? this.options.prepend + n.toString() : n.toString(); }
        shouldUseIntlApi() { return !K.includes(this.options.compatibilityJSON); }
    }
    const J = function (e, t, n) { let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : ".", i = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4], a = ((e, t, n) => { const r = N(e, n); return void 0 !== r ? r : N(t, n); })(e, t, n); return !a && i && x(n) && (a = L(e, n, r), void 0 === a && (a = L(t, n, r))), a; }, Q = e => e.replace(/\$/g, "$$$$");
    class Z {
        constructor() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; this.logger = D.create("interpolator"), this.options = e, this.format = e.interpolation && e.interpolation.format || (e => e), this.init(e); }
        init() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; e.interpolation || (e.interpolation = { escapeValue: !0 }); const t = e.interpolation, n = t.escape, r = t.escapeValue, i = t.useRawValueToEscape, a = t.prefix, o = t.prefixEscaped, s = t.suffix, l = t.suffixEscaped, c = t.formatSeparator, d = t.unescapeSuffix, u = t.unescapePrefix, p = t.nestingPrefix, h = t.nestingPrefixEscaped, f = t.nestingSuffix, g = t.nestingSuffixEscaped, m = t.nestingOptionsSeparator, x = t.maxReplaces, b = t.alwaysFormat; this.escape = void 0 !== n ? n : E, this.escapeValue = void 0 === r || r, this.useRawValueToEscape = void 0 !== i && i, this.prefix = a ? T(a) : o || "{{", this.suffix = s ? T(s) : l || "}}", this.formatSeparator = c || ",", this.unescapePrefix = d ? "" : u || "-", this.unescapeSuffix = this.unescapePrefix ? "" : d || "", this.nestingPrefix = p ? T(p) : h || T("$t("), this.nestingSuffix = f ? T(f) : g || T(")"), this.nestingOptionsSeparator = m || ",", this.maxReplaces = x || 1e3, this.alwaysFormat = void 0 !== b && b, this.resetRegExp(); }
        reset() { this.options && this.init(this.options); }
        resetRegExp() { const e = (e, t) => e && e.source === t ? (e.lastIndex = 0, e) : new RegExp(t, "g"); this.regexp = e(this.regexp, "".concat(this.prefix, "(.+?)").concat(this.suffix)), this.regexpUnescape = e(this.regexpUnescape, "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix)), this.nestingRegexp = e(this.nestingRegexp, "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix)); }
        interpolate(e, t, n, r) { let i, a, o; const s = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, l = e => { if (e.indexOf(this.formatSeparator) < 0) {
            const i = J(t, s, e, this.options.keySeparator, this.options.ignoreJSONStructure);
            return this.alwaysFormat ? this.format(i, void 0, n, m(m(m({}, r), t), {}, { interpolationkey: e })) : i;
        } const i = e.split(this.formatSeparator), a = i.shift().trim(), o = i.join(this.formatSeparator).trim(); return this.format(J(t, s, a, this.options.keySeparator, this.options.ignoreJSONStructure), o, n, m(m(m({}, r), t), {}, { interpolationkey: a })); }; this.resetRegExp(); const c = r && r.missingInterpolationHandler || this.options.missingInterpolationHandler, d = r && r.interpolation && void 0 !== r.interpolation.skipOnVariables ? r.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables; return [{ regex: this.regexpUnescape, safeValue: e => Q(e) }, { regex: this.regexp, safeValue: e => this.escapeValue ? Q(this.escape(e)) : Q(e) }].forEach(t => { for (o = 0; i = t.regex.exec(e);) {
            const n = i[1].trim();
            if (a = l(n), void 0 === a)
                if ("function" === typeof c) {
                    const t = c(e, i, r);
                    a = x(t) ? t : "";
                }
                else if (r && Object.prototype.hasOwnProperty.call(r, n))
                    a = "";
                else {
                    if (d) {
                        a = i[0];
                        continue;
                    }
                    this.logger.warn("missed to pass in variable ".concat(n, " for interpolating ").concat(e)), a = "";
                }
            else
                x(a) || this.useRawValueToEscape || (a = y(a));
            const s = t.safeValue(a);
            if (e = e.replace(i[0], s), d ? (t.regex.lastIndex += a.length, t.regex.lastIndex -= i[0].length) : t.regex.lastIndex = 0, o++, o >= this.maxReplaces)
                break;
        } }), e; }
        nest(e, t) { let n, r, i, a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; const o = (e, t) => { const n = this.nestingOptionsSeparator; if (e.indexOf(n) < 0)
            return e; const r = e.split(new RegExp("".concat(n, "[ ]*{"))); let a = "{".concat(r[1]); e = r[0], a = this.interpolate(a, i); const o = a.match(/'/g), s = a.match(/"/g); (o && o.length % 2 === 0 && !s || s.length % 2 !== 0) && (a = a.replace(/'/g, '"')); try {
            i = JSON.parse(a), t && (i = m(m({}, t), i));
        }
        catch (l) {
            return this.logger.warn("failed parsing options string in nesting for key ".concat(e), l), "".concat(e).concat(n).concat(a);
        } return i.defaultValue && i.defaultValue.indexOf(this.prefix) > -1 && delete i.defaultValue, e; }; for (; n = this.nestingRegexp.exec(e);) {
            let s = [];
            i = m({}, a), i = i.replace && !x(i.replace) ? i.replace : i, i.applyPostProcessor = !1, delete i.defaultValue;
            let l = !1;
            if (-1 !== n[0].indexOf(this.formatSeparator) && !/{.*}/.test(n[1])) {
                const e = n[1].split(this.formatSeparator).map(e => e.trim());
                n[1] = e.shift(), s = e, l = !0;
            }
            if (r = t(o.call(this, n[1].trim(), i), i), r && n[0] === e && !x(r))
                return r;
            x(r) || (r = y(r)), r || (this.logger.warn("missed to resolve ".concat(n[1], " for nesting ").concat(e)), r = ""), l && (r = s.reduce((e, t) => this.format(e, t, a.lng, m(m({}, a), {}, { interpolationkey: n[1].trim() })), r.trim())), e = e.replace(n[0], r), this.regexp.lastIndex = 0;
        } return e; }
    }
    const $ = e => { const t = {}; return (n, r, i) => { let a = i; i && i.interpolationkey && i.formatParams && i.formatParams[i.interpolationkey] && i[i.interpolationkey] && (a = m(m({}, a), {}, { [i.interpolationkey]: void 0 })); const o = r + JSON.stringify(a); let s = t[o]; return s || (s = e(O(r), i), t[o] = s), s(n); }; };
    class ee {
        constructor() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; this.logger = D.create("formatter"), this.options = e, this.formats = { number: $((e, t) => { const n = new Intl.NumberFormat(e, m({}, t)); return e => n.format(e); }), currency: $((e, t) => { const n = new Intl.NumberFormat(e, m(m({}, t), {}, { style: "currency" })); return e => n.format(e); }), datetime: $((e, t) => { const n = new Intl.DateTimeFormat(e, m({}, t)); return e => n.format(e); }), relativetime: $((e, t) => { const n = new Intl.RelativeTimeFormat(e, m({}, t)); return e => n.format(e, t.range || "day"); }), list: $((e, t) => { const n = new Intl.ListFormat(e, m({}, t)); return e => n.format(e); }) }, this.init(e); }
        init(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { interpolation: {} }; this.formatSeparator = t.interpolation.formatSeparator || ","; }
        add(e, t) { this.formats[e.toLowerCase().trim()] = t; }
        addCached(e, t) { this.formats[e.toLowerCase().trim()] = $(t); }
        format(e, t, n) { let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}; const i = t.split(this.formatSeparator); if (i.length > 1 && i[0].indexOf("(") > 1 && i[0].indexOf(")") < 0 && i.find(e => e.indexOf(")") > -1)) {
            const e = i.findIndex(e => e.indexOf(")") > -1);
            i[0] = [i[0], ...i.splice(1, e)].join(this.formatSeparator);
        } return i.reduce((e, t) => { const i = (e => { let t = e.toLowerCase().trim(); const n = {}; if (e.indexOf("(") > -1) {
            const r = e.split("(");
            t = r[0].toLowerCase().trim();
            const i = r[1].substring(0, r[1].length - 1);
            "currency" === t && i.indexOf(":") < 0 ? n.currency || (n.currency = i.trim()) : "relativetime" === t && i.indexOf(":") < 0 ? n.range || (n.range = i.trim()) : i.split(";").forEach(e => { if (e) {
                const t = d(e.split(":")), r = t[0], i = o(t).slice(1).join(":").trim().replace(/^'+|'+$/g, ""), a = r.trim();
                n[a] || (n[a] = i), "false" === i && (n[a] = !1), "true" === i && (n[a] = !0), isNaN(i) || (n[a] = parseInt(i, 10));
            } });
        } return { formatName: t, formatOptions: n }; })(t), a = i.formatName, s = i.formatOptions; if (this.formats[a]) {
            let t = e;
            try {
                const i = r && r.formatParams && r.formatParams[r.interpolationkey] || {}, o = i.locale || i.lng || r.locale || r.lng || n;
                t = this.formats[a](e, o, m(m(m({}, s), r), i));
            }
            catch (l) {
                this.logger.warn(l);
            }
            return t;
        } return this.logger.warn("there was no format function for ".concat(a)), e; }, e); }
    }
    class te extends F {
        constructor(e, t, n) { let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}; super(), this.backend = e, this.store = t, this.services = n, this.languageUtils = n.languageUtils, this.options = r, this.logger = D.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = r.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = r.maxRetries >= 0 ? r.maxRetries : 5, this.retryTimeout = r.retryTimeout >= 1 ? r.retryTimeout : 350, this.state = {}, this.queue = [], this.backend && this.backend.init && this.backend.init(n, r.backend, r); }
        queueLoad(e, t, n, r) { const i = {}, a = {}, o = {}, s = {}; return e.forEach(e => { let r = !0; t.forEach(t => { const o = "".concat(e, "|").concat(t); !n.reload && this.store.hasResourceBundle(e, t) ? this.state[o] = 2 : this.state[o] < 0 || (1 === this.state[o] ? void 0 === a[o] && (a[o] = !0) : (this.state[o] = 1, r = !1, void 0 === a[o] && (a[o] = !0), void 0 === i[o] && (i[o] = !0), void 0 === s[t] && (s[t] = !0))); }), r || (o[e] = !0); }), (Object.keys(i).length || Object.keys(a).length) && this.queue.push({ pending: a, pendingCount: Object.keys(a).length, loaded: {}, errors: [], callback: r }), { toLoad: Object.keys(i), pending: Object.keys(a), toLoadLanguages: Object.keys(o), toLoadNamespaces: Object.keys(s) }; }
        loaded(e, t, n) { const r = e.split("|"), i = r[0], a = r[1]; t && this.emit("failedLoading", i, a, t), !t && n && this.store.addResourceBundle(i, a, n, void 0, void 0, { skipCopy: !0 }), this.state[e] = t ? -1 : 2, t && n && (this.state[e] = 0); const o = {}; this.queue.forEach(n => { ((e, t, n) => { const r = k(e, t, Object), i = r.obj, a = r.k; i[a] = i[a] || [], i[a].push(n); })(n.loaded, [i], a), ((e, t) => { void 0 !== e.pending[t] && (delete e.pending[t], e.pendingCount--); })(n, e), t && n.errors.push(t), 0 !== n.pendingCount || n.done || (Object.keys(n.loaded).forEach(e => { o[e] || (o[e] = {}); const t = n.loaded[e]; t.length && t.forEach(t => { void 0 === o[e][t] && (o[e][t] = !0); }); }), n.done = !0, n.errors.length ? n.callback(n.errors) : n.callback()); }), this.emit("loaded", o), this.queue = this.queue.filter(e => !e.done); }
        read(e, t, n) { let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0, i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : this.retryTimeout, a = arguments.length > 5 ? arguments[5] : void 0; if (!e.length)
            return a(null, {}); if (this.readingCalls >= this.maxParallelReads)
            return void this.waitingReads.push({ lng: e, ns: t, fcName: n, tried: r, wait: i, callback: a }); this.readingCalls++; const o = (o, s) => { if (this.readingCalls--, this.waitingReads.length > 0) {
            const e = this.waitingReads.shift();
            this.read(e.lng, e.ns, e.fcName, e.tried, e.wait, e.callback);
        } o && s && r < this.maxRetries ? setTimeout(() => { this.read.call(this, e, t, n, r + 1, 2 * i, a); }, i) : a(o, s); }, s = this.backend[n].bind(this.backend); if (2 !== s.length)
            return s(e, t, o); try {
            const n = s(e, t);
            n && "function" === typeof n.then ? n.then(e => o(null, e)).catch(o) : o(null, n);
        }
        catch (l) {
            o(l);
        } }
        prepareLoading(e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, r = arguments.length > 3 ? arguments[3] : void 0; if (!this.backend)
            return this.logger.warn("No backend was added via i18next.use. Will not load resources."), r && r(); x(e) && (e = this.languageUtils.toResolveHierarchy(e)), x(t) && (t = [t]); const i = this.queueLoad(e, t, n, r); if (!i.toLoad.length)
            return i.pending.length || r(), null; i.toLoad.forEach(e => { this.loadOne(e); }); }
        load(e, t, n) { this.prepareLoading(e, t, {}, n); }
        reload(e, t, n) { this.prepareLoading(e, t, { reload: !0 }, n); }
        loadOne(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ""; const n = e.split("|"), r = n[0], i = n[1]; this.read(r, i, "read", void 0, void 0, (n, a) => { n && this.logger.warn("".concat(t, "loading namespace ").concat(i, " for language ").concat(r, " failed"), n), !n && a && this.logger.log("".concat(t, "loaded namespace ").concat(i, " for language ").concat(r), a), this.loaded(e, n, a); }); }
        saveMissing(e, t, n, r, i) { let a = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {}, o = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : () => { }; if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(t))
            this.logger.warn('did not save key "'.concat(n, '" as the namespace "').concat(t, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        else if (void 0 !== n && null !== n && "" !== n) {
            if (this.backend && this.backend.create) {
                const l = m(m({}, a), {}, { isUpdate: i }), c = this.backend.create.bind(this.backend);
                if (c.length < 6)
                    try {
                        let i;
                        i = 5 === c.length ? c(e, t, n, r, l) : c(e, t, n, r), i && "function" === typeof i.then ? i.then(e => o(null, e)).catch(o) : o(null, i);
                    }
                    catch (s) {
                        o(s);
                    }
                else
                    c(e, t, n, r, o, l);
            }
            e && e[0] && this.store.addResource(e[0], t, n, r);
        } }
    }
    const ne = () => ({ debug: !1, initImmediate: !0, ns: ["translation"], defaultNS: ["translation"], fallbackLng: ["dev"], fallbackNS: !1, supportedLngs: !1, nonExplicitSupportedLngs: !1, load: "all", preload: !1, simplifyPluralSuffix: !0, keySeparator: ".", nsSeparator: ":", pluralSeparator: "_", contextSeparator: "_", partialBundledLanguages: !1, saveMissing: !1, updateMissing: !1, saveMissingTo: "fallback", saveMissingPlurals: !0, missingKeyHandler: !1, missingInterpolationHandler: !1, postProcess: !1, postProcessPassResolved: !1, returnNull: !1, returnEmptyString: !0, returnObjects: !1, joinArrays: !1, returnedObjectHandler: !1, parseMissingKeyHandler: !1, appendNamespaceToMissingKey: !1, appendNamespaceToCIMode: !1, overloadTranslationOptionHandler: e => { let t = {}; if ("object" === typeof e[1] && (t = e[1]), x(e[1]) && (t.defaultValue = e[1]), x(e[2]) && (t.tDescription = e[2]), "object" === typeof e[2] || "object" === typeof e[3]) {
            const n = e[3] || e[2];
            Object.keys(n).forEach(e => { t[e] = n[e]; });
        } return t; }, interpolation: { escapeValue: !0, format: e => e, prefix: "{{", suffix: "}}", formatSeparator: ",", unescapePrefix: "-", nestingPrefix: "$t(", nestingSuffix: ")", nestingOptionsSeparator: ",", maxReplaces: 1e3, skipOnVariables: !0 } }), re = e => (x(e.ns) && (e.ns = [e.ns]), x(e.fallbackLng) && (e.fallbackLng = [e.fallbackLng]), x(e.fallbackNS) && (e.fallbackNS = [e.fallbackNS]), e.supportedLngs && e.supportedLngs.indexOf("cimode") < 0 && (e.supportedLngs = e.supportedLngs.concat(["cimode"])), e), ie = () => { };
    class ae extends F {
        constructor() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0; var n; if (super(), this.options = re(e), this.services = {}, this.logger = D, this.modules = { external: [] }, n = this, Object.getOwnPropertyNames(Object.getPrototypeOf(n)).forEach(e => { "function" === typeof n[e] && (n[e] = n[e].bind(n)); }), t && !this.isInitialized && !e.isClone) {
            if (!this.options.initImmediate)
                return this.init(e, t), this;
            setTimeout(() => { this.init(e, t); }, 0);
        } }
        init() { var e = this; let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0; this.isInitializing = !0, "function" === typeof t && (n = t, t = {}), !t.defaultNS && !1 !== t.defaultNS && t.ns && (x(t.ns) ? t.defaultNS = t.ns : t.ns.indexOf("translation") < 0 && (t.defaultNS = t.ns[0])); const r = ne(); this.options = m(m(m({}, r), this.options), re(t)), "v1" !== this.options.compatibilityAPI && (this.options.interpolation = m(m({}, r.interpolation), this.options.interpolation)), void 0 !== t.keySeparator && (this.options.userDefinedKeySeparator = t.keySeparator), void 0 !== t.nsSeparator && (this.options.userDefinedNsSeparator = t.nsSeparator); const i = e => e ? "function" === typeof e ? new e : e : null; if (!this.options.isClone) {
            let t;
            this.modules.logger ? D.init(i(this.modules.logger), this.options) : D.init(null, this.options), this.modules.formatter ? t = this.modules.formatter : "undefined" !== typeof Intl && (t = ee);
            const n = new H(this.options);
            this.store = new M(this.options.resources, this.options);
            const a = this.services;
            a.logger = D, a.resourceStore = this.store, a.languageUtils = n, a.pluralResolver = new X(n, { prepend: this.options.pluralSeparator, compatibilityJSON: this.options.compatibilityJSON, simplifyPluralSuffix: this.options.simplifyPluralSuffix }), !t || this.options.interpolation.format && this.options.interpolation.format !== r.interpolation.format || (a.formatter = i(t), a.formatter.init(a, this.options), this.options.interpolation.format = a.formatter.format.bind(a.formatter)), a.interpolator = new Z(this.options), a.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) }, a.backendConnector = new te(i(this.modules.backend), a.resourceStore, a, this.options), a.backendConnector.on("*", function (t) { for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
                r[i - 1] = arguments[i]; e.emit(t, ...r); }), this.modules.languageDetector && (a.languageDetector = i(this.modules.languageDetector), a.languageDetector.init && a.languageDetector.init(a, this.options.detection, this.options)), this.modules.i18nFormat && (a.i18nFormat = i(this.modules.i18nFormat), a.i18nFormat.init && a.i18nFormat.init(this)), this.translator = new _(this.services, this.options), this.translator.on("*", function (t) { for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
                r[i - 1] = arguments[i]; e.emit(t, ...r); }), this.modules.external.forEach(e => { e.init && e.init(this); });
        } if (this.format = this.options.interpolation.format, n || (n = ie), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
            const e = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            e.length > 0 && "dev" !== e[0] && (this.options.lng = e[0]);
        } this.services.languageDetector || this.options.lng || this.logger.warn("init: no languageDetector is used and no lng is defined"); ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach(t => { this[t] = function () { return e.store[t](...arguments); }; }); ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach(t => { this[t] = function () { return e.store[t](...arguments), e; }; }); const a = b(), o = () => { const e = (e, t) => { this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), a.resolve(t), n(e, t); }; if (this.languages && "v1" !== this.options.compatibilityAPI && !this.isInitialized)
            return e(null, this.t.bind(this)); this.changeLanguage(this.options.lng, e); }; return this.options.resources || !this.options.initImmediate ? o() : setTimeout(o, 0), a; }
        loadResources(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ie; const n = x(e) ? e : this.language; if ("function" === typeof e && (t = e), !this.options.resources || this.options.partialBundledLanguages) {
            if (n && "cimode" === n.toLowerCase() && (!this.options.preload || 0 === this.options.preload.length))
                return t();
            const e = [], r = t => { if (!t)
                return; if ("cimode" === t)
                return; this.services.languageUtils.toResolveHierarchy(t).forEach(t => { "cimode" !== t && e.indexOf(t) < 0 && e.push(t); }); };
            if (n)
                r(n);
            else {
                this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach(e => r(e));
            }
            this.options.preload && this.options.preload.forEach(e => r(e)), this.services.backendConnector.load(e, this.options.ns, e => { e || this.resolvedLanguage || !this.language || this.setResolvedLanguage(this.language), t(e); });
        }
        else
            t(null); }
        reloadResources(e, t, n) { const r = b(); return "function" === typeof e && (n = e, e = void 0), "function" === typeof t && (n = t, t = void 0), e || (e = this.languages), t || (t = this.options.ns), n || (n = ie), this.services.backendConnector.reload(e, t, e => { r.resolve(), n(e); }), r; }
        use(e) { if (!e)
            throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()"); if (!e.type)
            throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()"); return "backend" === e.type && (this.modules.backend = e), ("logger" === e.type || e.log && e.warn && e.error) && (this.modules.logger = e), "languageDetector" === e.type && (this.modules.languageDetector = e), "i18nFormat" === e.type && (this.modules.i18nFormat = e), "postProcessor" === e.type && I.addPostProcessor(e), "formatter" === e.type && (this.modules.formatter = e), "3rdParty" === e.type && this.modules.external.push(e), this; }
        setResolvedLanguage(e) { if (e && this.languages && !(["cimode", "dev"].indexOf(e) > -1))
            for (let t = 0; t < this.languages.length; t++) {
                const e = this.languages[t];
                if (!(["cimode", "dev"].indexOf(e) > -1) && this.store.hasLanguageSomeTranslations(e)) {
                    this.resolvedLanguage = e;
                    break;
                }
            } }
        changeLanguage(e, t) { var n = this; this.isLanguageChangingTo = e; const r = b(); this.emit("languageChanging", e); const i = e => { this.language = e, this.languages = this.services.languageUtils.toResolveHierarchy(e), this.resolvedLanguage = void 0, this.setResolvedLanguage(e); }, a = (e, a) => { a ? (i(a), this.translator.changeLanguage(a), this.isLanguageChangingTo = void 0, this.emit("languageChanged", a), this.logger.log("languageChanged", a)) : this.isLanguageChangingTo = void 0, r.resolve(function () { return n.t(...arguments); }), t && t(e, function () { return n.t(...arguments); }); }, o = t => { e || t || !this.services.languageDetector || (t = []); const n = x(t) ? t : this.services.languageUtils.getBestMatchFromCodes(t); n && (this.language || i(n), this.translator.language || this.translator.changeLanguage(n), this.services.languageDetector && this.services.languageDetector.cacheUserLanguage && this.services.languageDetector.cacheUserLanguage(n)), this.loadResources(n, e => { a(e, n); }); }; return e || !this.services.languageDetector || this.services.languageDetector.async ? !e && this.services.languageDetector && this.services.languageDetector.async ? 0 === this.services.languageDetector.detect.length ? this.services.languageDetector.detect().then(o) : this.services.languageDetector.detect(o) : o(e) : o(this.services.languageDetector.detect()), r; }
        getFixedT(e, t, n) { var r = this; const i = function (e, t) { let a; if ("object" !== typeof t) {
            for (var o = arguments.length, s = new Array(o > 2 ? o - 2 : 0), l = 2; l < o; l++)
                s[l - 2] = arguments[l];
            a = r.options.overloadTranslationOptionHandler([e, t].concat(s));
        }
        else
            a = m({}, t); a.lng = a.lng || i.lng, a.lngs = a.lngs || i.lngs, a.ns = a.ns || i.ns, "" !== a.keyPrefix && (a.keyPrefix = a.keyPrefix || n || i.keyPrefix); const c = r.options.keySeparator || "."; let d; return d = a.keyPrefix && Array.isArray(e) ? e.map(e => "".concat(a.keyPrefix).concat(c).concat(e)) : a.keyPrefix ? "".concat(a.keyPrefix).concat(c).concat(e) : e, r.t(d, a); }; return x(e) ? i.lng = e : i.lngs = e, i.ns = t, i.keyPrefix = n, i; }
        t() { return this.translator && this.translator.translate(...arguments); }
        exists() { return this.translator && this.translator.exists(...arguments); }
        setDefaultNamespace(e) { this.options.defaultNS = e; }
        hasLoadedNamespace(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; if (!this.isInitialized)
            return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1; if (!this.languages || !this.languages.length)
            return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1; const n = t.lng || this.resolvedLanguage || this.languages[0], r = !!this.options && this.options.fallbackLng, i = this.languages[this.languages.length - 1]; if ("cimode" === n.toLowerCase())
            return !0; const a = (e, t) => { const n = this.services.backendConnector.state["".concat(e, "|").concat(t)]; return -1 === n || 0 === n || 2 === n; }; if (t.precheck) {
            const e = t.precheck(this, a);
            if (void 0 !== e)
                return e;
        } return !!this.hasResourceBundle(n, e) || (!(this.services.backendConnector.backend && (!this.options.resources || this.options.partialBundledLanguages)) || !(!a(n, e) || r && !a(i, e))); }
        loadNamespaces(e, t) { const n = b(); return this.options.ns ? (x(e) && (e = [e]), e.forEach(e => { this.options.ns.indexOf(e) < 0 && this.options.ns.push(e); }), this.loadResources(e => { n.resolve(), t && t(e); }), n) : (t && t(), Promise.resolve()); }
        loadLanguages(e, t) { const n = b(); x(e) && (e = [e]); const r = this.options.preload || [], i = e.filter(e => r.indexOf(e) < 0 && this.services.languageUtils.isSupportedCode(e)); return i.length ? (this.options.preload = r.concat(i), this.loadResources(e => { n.resolve(), t && t(e); }), n) : (t && t(), Promise.resolve()); }
        dir(e) { if (e || (e = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language)), !e)
            return "rtl"; const t = this.services && this.services.languageUtils || new H(ne()); return ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"].indexOf(t.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr"; }
        static createInstance() { return new ae(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, arguments.length > 1 ? arguments[1] : void 0); }
        cloneInstance() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ie; const n = e.forkResourceStore; n && delete e.forkResourceStore; const r = m(m(m({}, this.options), e), { isClone: !0 }), i = new ae(r); void 0 === e.debug && void 0 === e.prefix || (i.logger = i.logger.clone(e)); return ["store", "services", "language"].forEach(e => { i[e] = this[e]; }), i.services = m({}, this.services), i.services.utils = { hasLoadedNamespace: i.hasLoadedNamespace.bind(i) }, n && (i.store = new M(this.store.data, r), i.services.resourceStore = i.store), i.translator = new _(i.services, r), i.translator.on("*", function (e) { for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
            n[r - 1] = arguments[r]; i.emit(e, ...n); }), i.init(r, t), i.translator.options = r, i.translator.backendConnector.services.utils = { hasLoadedNamespace: i.hasLoadedNamespace.bind(i) }, i; }
        toJSON() { return { options: this.options, store: this.store, language: this.language, languages: this.languages, resolvedLanguage: this.resolvedLanguage }; }
    }
    const oe = ae.createInstance();
    oe.createInstance = ae.createInstance;
    oe.createInstance, oe.dir, oe.init, oe.loadResources, oe.reloadResources, oe.use, oe.changeLanguage, oe.getFixedT, oe.t, oe.exists, oe.setDefaultNamespace, oe.hasLoadedNamespace, oe.loadNamespaces, oe.loadLanguages;
    n(844);
    Object.create(null);
    const se = {};
    function le() { for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
        t[n] = arguments[n]; "string" === typeof t[0] && se[t[0]] || ("string" === typeof t[0] && (se[t[0]] = new Date), function () { if (console && console.warn) {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n];
        "string" === typeof t[0] && (t[0] = "react-i18next:: ".concat(t[0])), console.warn(...t);
    } }(...t)); }
    const ce = (e, t) => () => { if (e.isInitialized)
        t();
    else {
        const n = () => { setTimeout(() => { e.off("initialized", n); }, 0), t(); };
        e.on("initialized", n);
    } };
    function de(e, t, n) { e.loadNamespaces(t, ce(e, n)); }
    function ue(e, t, n, r) { "string" === typeof n && (n = [n]), n.forEach(t => { e.options.ns.indexOf(t) < 0 && e.options.ns.push(t); }), e.loadLanguages(t, ce(e, r)); }
    const pe = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g, he = { "&amp;": "&", "&#38;": "&", "&lt;": "<", "&#60;": "<", "&gt;": ">", "&#62;": ">", "&apos;": "'", "&#39;": "'", "&quot;": '"', "&#34;": '"', "&nbsp;": " ", "&#160;": " ", "&copy;": "\xa9", "&#169;": "\xa9", "&reg;": "\xae", "&#174;": "\xae", "&hellip;": "\u2026", "&#8230;": "\u2026", "&#x2F;": "/", "&#47;": "/" }, fe = e => he[e];
    let ge = { bindI18n: "languageChanged", bindI18nStore: "", transEmptyNodeValue: "", transSupportBasicHtmlNodes: !0, transWrapTextNodes: "", transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"], useSuspense: !0, unescape: e => e.replace(pe, fe) };
    let me;
    const xe = { type: "3rdParty", init(e) { !function () { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; ge = m(m({}, ge), e); }(e.options.react), function (e) { me = e; }(e); } };
    const be = (0, r.createContext)();
    class ye {
        constructor() { this.usedNamespaces = {}; }
        addUsedNamespaces(e) { e.forEach(e => { this.usedNamespaces[e] || (this.usedNamespaces[e] = !0); }); }
        getUsedNamespaces() { return Object.keys(this.usedNamespaces); }
    }
    function ve(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; const n = t.i18n, i = (0, r.useContext)(be) || {}, a = i.i18n, o = i.defaultNS, s = n || a || me; if (s && !s.reportNamespaces && (s.reportNamespaces = new ye), !s) {
        le("You will need to pass in an i18next instance by using initReactI18next");
        const e = (e, t) => "string" === typeof t ? t : t && "object" === typeof t && "string" === typeof t.defaultValue ? t.defaultValue : Array.isArray(e) ? e[e.length - 1] : e, t = [e, {}, !1];
        return t.t = e, t.i18n = {}, t.ready = !1, t;
    } s.options.react && void 0 !== s.options.react.wait && le("It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour."); const l = m(m(m({}, ge), s.options.react), t), c = l.useSuspense, d = l.keyPrefix; let p = e || o || s.options && s.options.defaultNS; p = "string" === typeof p ? [p] : p || ["translation"], s.reportNamespaces.addUsedNamespaces && s.reportNamespaces.addUsedNamespaces(p); const h = (s.isInitialized || s.initializedStoreOnce) && p.every(e => function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; return t.languages && t.languages.length ? void 0 !== t.options.ignoreJSONStructure ? t.hasLoadedNamespace(e, { lng: n.lng, precheck: (t, r) => { if (n.bindI18n && n.bindI18n.indexOf("languageChanging") > -1 && t.services.backendConnector.backend && t.isLanguageChangingTo && !r(t.isLanguageChangingTo, e))
            return !1; } }) : function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; const r = t.languages[0], i = !!t.options && t.options.fallbackLng, a = t.languages[t.languages.length - 1]; if ("cimode" === r.toLowerCase())
        return !0; const o = (e, n) => { const r = t.services.backendConnector.state["".concat(e, "|").concat(n)]; return -1 === r || 2 === r; }; return !(n.bindI18n && n.bindI18n.indexOf("languageChanging") > -1 && t.services.backendConnector.backend && t.isLanguageChangingTo && !o(t.isLanguageChangingTo, e)) && (!!t.hasResourceBundle(r, e) || !(t.services.backendConnector.backend && (!t.options.resources || t.options.partialBundledLanguages)) || !(!o(r, e) || i && !o(a, e))); }(e, t, n) : (le("i18n.languages were undefined or empty", t.languages), !0); }(e, s, l)); function f() { return s.getFixedT(t.lng || null, "fallback" === l.nsMode ? p : p[0], d); } const g = u((0, r.useState)(f), 2), x = g[0], b = g[1]; let y = p.join(); t.lng && (y = "".concat(t.lng).concat(y)); const v = ((e, t) => { const n = (0, r.useRef)(); return (0, r.useEffect)(() => { n.current = t ? n.current : e; }, [e, t]), n.current; })(y), w = (0, r.useRef)(!0); (0, r.useEffect)(() => { const e = l.bindI18n, n = l.bindI18nStore; function r() { w.current && b(f); } return w.current = !0, h || c || (t.lng ? ue(s, t.lng, p, () => { w.current && b(f); }) : de(s, p, () => { w.current && b(f); })), h && v && v !== y && w.current && b(f), e && s && s.on(e, r), n && s && s.store.on(n, r), () => { w.current = !1, e && s && e.split(" ").forEach(e => s.off(e, r)), n && s && n.split(" ").forEach(e => s.store.off(e, r)); }; }, [s, y]); const j = (0, r.useRef)(!0); (0, r.useEffect)(() => { w.current && !j.current && b(f), j.current = !1; }, [s, d]); const k = [x, s, h]; if (k.t = x, k.i18n = s, k.ready = h, h)
        return k; if (!h && !c)
        return k; throw new Promise(e => { t.lng ? ue(s, t.lng, p, () => e()) : de(s, p, () => e()); }); }
    const we = JSON.parse('{"en":{"translation":{"welcome":"Welcome to SwanCore","login":"Login","continue":"Continue","email":"Enter email or phone","agree":"I agree to Terms","google":"Continue with Google","apple":"Continue with Apple","or":"or","verify":"Verify OTP","price":"Price","balance":"Balance","history":"Trade History","buy":"BUY","sell":"SELL"}},"hi":{"translation":{"welcome":"\u0938\u094d\u0935\u093e\u0928\u0915\u094b\u0930 \u092e\u0947\u0902 \u0906\u092a\u0915\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u0939\u0948","login":"\u0932\u0949\u0917\u093f\u0928","continue":"\u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902","email":"\u0908\u092e\u0947\u0932 \u092f\u093e \u092b\u094b\u0928 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902","agree":"\u092e\u0948\u0902 \u0936\u0930\u094d\u0924\u094b\u0902 \u0938\u0947 \u0938\u0939\u092e\u0924 \u0939\u0942\u0901","google":"Google \u0938\u0947 \u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902","apple":"Apple \u0938\u0947 \u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902","or":"\u092f\u093e","verify":"OTP \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0915\u0930\u0947\u0902","price":"\u0915\u0940\u092e\u0924","balance":"\u092c\u0948\u0932\u0947\u0902\u0938","history":"\u091f\u094d\u0930\u0947\u0921 \u0907\u0924\u093f\u0939\u093e\u0938","buy":"\u0916\u0930\u0940\u0926\u0947\u0902","sell":"\u092c\u0947\u091a\u0947\u0902"}},"ja":{"translation":{"welcome":"SwanCore\u3078\u3088\u3046\u3053\u305d","login":"\u30ed\u30b0\u30a4\u30f3","continue":"\u7d9a\u884c","email":"\u30e1\u30fc\u30eb\u307e\u305f\u306f\u96fb\u8a71\u3092\u5165\u529b","agree":"\u5229\u7528\u898f\u7d04\u306b\u540c\u610f\u3057\u307e\u3059","google":"Google\u3067\u7d9a\u884c","apple":"Apple\u3067\u7d9a\u884c","or":"\u307e\u305f\u306f","verify":"OTP\u3092\u78ba\u8a8d","price":"\u4fa1\u683c","balance":"\u6b8b\u9ad8","history":"\u53d6\u5f15\u5c65\u6b74","buy":"\u8cfc\u5165","sell":"\u58f2\u5374"}},"zh":{"translation":{"welcome":"\u6b22\u8fce\u6765\u5230 SwanCore","login":"\u767b\u5f55","continue":"\u7ee7\u7eed","email":"\u8f93\u5165\u90ae\u7bb1\u6216\u624b\u673a\u53f7","agree":"\u6211\u540c\u610f\u6761\u6b3e","google":"\u4f7f\u7528 Google \u7ee7\u7eed","apple":"\u4f7f\u7528 Apple \u7ee7\u7eed","or":"\u6216","verify":"\u9a8c\u8bc1 OTP","price":"\u4ef7\u683c","balance":"\u4f59\u989d","history":"\u4ea4\u6613\u8bb0\u5f55","buy":"\u4e70\u5165","sell":"\u5356\u51fa"}},"es":{"translation":{"welcome":"Bienvenido a SwanCore","login":"Iniciar sesi\xf3n","continue":"Continuar","email":"Ingrese correo o tel\xe9fono","agree":"Acepto los t\xe9rminos","google":"Continuar con Google","apple":"Continuar con Apple","or":"o","verify":"Verificar OTP","price":"Precio","balance":"Saldo","history":"Historial de operaciones","buy":"COMPRAR","sell":"VENDER"}},"fr":{"translation":{"welcome":"Bienvenue sur SwanCore","login":"Connexion","continue":"Continuer","email":"Entrez email ou t\xe9l\xe9phone","agree":"J\'accepte les conditions","google":"Continuer avec Google","apple":"Continuer avec Apple","or":"ou","verify":"V\xe9rifier OTP","price":"Prix","balance":"Solde","history":"Historique des trades","buy":"ACHETER","sell":"VENDRE"}},"de":{"translation":{"welcome":"Willkommen bei SwanCore","login":"Anmelden","continue":"Weiter","email":"E-Mail oder Telefon eingeben","agree":"Ich stimme den Bedingungen zu","google":"Mit Google fortfahren","apple":"Mit Apple fortfahren","or":"oder","verify":"OTP best\xe4tigen","price":"Preis","balance":"Kontostand","history":"Handelsverlauf","buy":"KAUFEN","sell":"VERKAUFEN"}},"ru":{"translation":{"welcome":"\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 SwanCore","login":"\u0412\u043e\u0439\u0442\u0438","continue":"\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c","email":"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 email \u0438\u043b\u0438 \u0442\u0435\u043b\u0435\u0444\u043e\u043d","agree":"\u042f \u0441\u043e\u0433\u043b\u0430\u0441\u0435\u043d \u0441 \u0443\u0441\u043b\u043e\u0432\u0438\u044f\u043c\u0438","google":"\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u0441 Google","apple":"\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u0441 Apple","or":"\u0438\u043b\u0438","verify":"\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c OTP","price":"\u0426\u0435\u043d\u0430","balance":"\u0411\u0430\u043b\u0430\u043d\u0441","history":"\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0441\u0434\u0435\u043b\u043e\u043a","buy":"\u041a\u0423\u041f\u0418\u0422\u042c","sell":"\u041f\u0420\u041e\u0414\u0410\u0422\u042c"}},"ar":{"translation":{"welcome":"\u0645\u0631\u062d\u0628\u064b\u0627 \u0628\u0643 \u0641\u064a SwanCore","login":"\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644","continue":"\u0645\u062a\u0627\u0628\u0639\u0629","email":"\u0623\u062f\u062e\u0644 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641","agree":"\u0623\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0627\u0644\u0634\u0631\u0648\u0637","google":"\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Google","apple":"\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Apple","or":"\u0623\u0648","verify":"\u062a\u0623\u0643\u064a\u062f \u0631\u0645\u0632 OTP","price":"\u0627\u0644\u0633\u0639\u0631","balance":"\u0627\u0644\u0631\u0635\u064a\u062f","history":"\u0633\u062c\u0644 \u0627\u0644\u062a\u062f\u0627\u0648\u0644","buy":"\u0634\u0631\u0627\u0621","sell":"\u0628\u064a\u0639"}},"pt":{"translation":{"welcome":"Bem-vindo ao SwanCore","login":"Entrar","continue":"Continuar","email":"Digite e-mail ou telefone","agree":"Concordo com os termos","google":"Continuar com Google","apple":"Continuar com Apple","or":"ou","verify":"Verificar OTP","price":"Pre\xe7o","balance":"Saldo","history":"Hist\xf3rico de negocia\xe7\xf5es","buy":"COMPRAR","sell":"VENDER"}},"tr":{"translation":{"welcome":"SwanCore\'a Ho\u015f Geldiniz","login":"Giri\u015f Yap","continue":"Devam Et","email":"E-posta veya telefon girin","agree":"\u015eartlar\u0131 kabul ediyorum","google":"Google ile devam et","apple":"Apple ile devam et","or":"veya","verify":"OTP\'yi do\u011frula","price":"Fiyat","balance":"Bakiye","history":"\u0130\u015flem Ge\xe7mi\u015fi","buy":"SATIN AL","sell":"SAT"}},"ko":{"translation":{"welcome":"SwanCore\uc5d0 \uc624\uc2e0 \uac83\uc744 \ud658\uc601\ud569\ub2c8\ub2e4","login":"\ub85c\uadf8\uc778","continue":"\uacc4\uc18d\ud558\uae30","email":"\uc774\uba54\uc77c \ub610\ub294 \uc804\ud654\ubc88\ud638\ub97c \uc785\ub825\ud558\uc138\uc694","agree":"\uc57d\uad00\uc5d0 \ub3d9\uc758\ud569\ub2c8\ub2e4","google":"Google\ub85c \uacc4\uc18d\ud558\uae30","apple":"Apple\ub85c \uacc4\uc18d\ud558\uae30","or":"\ub610\ub294","verify":"OTP \ud655\uc778","price":"\uac00\uaca9","balance":"\uc794\uc561","history":"\uac70\ub798 \ub0b4\uc5ed","buy":"\uad6c\ub9e4","sell":"\ud310\ub9e4"}},"it":{"translation":{"welcome":"Benvenuto su SwanCore","login":"Accedi","continue":"Continua","email":"Inserisci email o telefono","agree":"Accetto i termini","google":"Continua con Google","apple":"Continua con Apple","or":"oppure","verify":"Verifica OTP","price":"Prezzo","balance":"Saldo","history":"Storico delle operazioni","buy":"ACQUISTA","sell":"VENDI"}},"nl":{"translation":{"welcome":"Welkom bij SwanCore","login":"Inloggen","continue":"Doorgaan","email":"Voer e-mail of telefoon in","agree":"Ik ga akkoord met de voorwaarden","google":"Doorgaan met Google","apple":"Doorgaan met Apple","or":"of","verify":"OTP verifi\xebren","price":"Prijs","balance":"Saldo","history":"Transactiegeschiedenis","buy":"KOPEN","sell":"VERKOPEN"}},"pl":{"translation":{"welcome":"Witamy w SwanCore","login":"Zaloguj si\u0119","continue":"Kontynuuj","email":"Wprowad\u017a e-mail lub telefon","agree":"Akceptuj\u0119 warunki","google":"Kontynuuj z Google","apple":"Kontynuuj z Apple","or":"lub","verify":"Zweryfikuj OTP","price":"Cena","balance":"Saldo","history":"Historia transakcji","buy":"KUP","sell":"SPRZEDAJ"}},"uk":{"translation":{"welcome":"\u041b\u0430\u0441\u043a\u0430\u0432\u043e \u043f\u0440\u043e\u0441\u0438\u043c\u043e \u0434\u043e SwanCore","login":"\u0423\u0432\u0456\u0439\u0442\u0438","continue":"\u041f\u0440\u043e\u0434\u043e\u0432\u0436\u0438\u0442\u0438","email":"\u0412\u0432\u0435\u0434\u0456\u0442\u044c email \u0430\u0431\u043e \u0442\u0435\u043b\u0435\u0444\u043e\u043d","agree":"\u042f \u043f\u043e\u0433\u043e\u0434\u0436\u0443\u044e\u0441\u044c \u0437 \u0443\u043c\u043e\u0432\u0430\u043c\u0438","google":"\u041f\u0440\u043e\u0434\u043e\u0432\u0436\u0438\u0442\u0438 \u0437 Google","apple":"\u041f\u0440\u043e\u0434\u043e\u0432\u0436\u0438\u0442\u0438 \u0437 Apple","or":"\u0430\u0431\u043e","verify":"\u041f\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0438 OTP","price":"\u0426\u0456\u043d\u0430","balance":"\u0411\u0430\u043b\u0430\u043d\u0441","history":"\u0406\u0441\u0442\u043e\u0440\u0456\u044f \u0442\u043e\u0440\u0433\u0456\u0432","buy":"\u041a\u0423\u041f\u0418\u0422\u0418","sell":"\u041f\u0420\u041e\u0414\u0410\u0422\u0418"}},"th":{"translation":{"welcome":"\u0e22\u0e34\u0e19\u0e14\u0e35\u0e15\u0e49\u0e2d\u0e19\u0e23\u0e31\u0e1a\u0e2a\u0e39\u0e48 SwanCore","login":"\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a","continue":"\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23\u0e15\u0e48\u0e2d","email":"\u0e01\u0e23\u0e2d\u0e01\u0e2d\u0e35\u0e40\u0e21\u0e25\u0e2b\u0e23\u0e37\u0e2d\u0e40\u0e1a\u0e2d\u0e23\u0e4c\u0e42\u0e17\u0e23","agree":"\u0e09\u0e31\u0e19\u0e22\u0e2d\u0e21\u0e23\u0e31\u0e1a\u0e40\u0e07\u0e37\u0e48\u0e2d\u0e19\u0e44\u0e02","google":"\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23\u0e15\u0e48\u0e2d\u0e14\u0e49\u0e27\u0e22 Google","apple":"\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23\u0e15\u0e48\u0e2d\u0e14\u0e49\u0e27\u0e22 Apple","or":"\u0e2b\u0e23\u0e37\u0e2d","verify":"\u0e22\u0e37\u0e19\u0e22\u0e31\u0e19 OTP","price":"\u0e23\u0e32\u0e04\u0e32","balance":"\u0e22\u0e2d\u0e14\u0e04\u0e07\u0e40\u0e2b\u0e25\u0e37\u0e2d","history":"\u0e1b\u0e23\u0e30\u0e27\u0e31\u0e15\u0e34\u0e01\u0e32\u0e23\u0e40\u0e17\u0e23\u0e14","buy":"\u0e0b\u0e37\u0e49\u0e2d","sell":"\u0e02\u0e32\u0e22"}},"vi":{"translation":{"welcome":"Ch\xe0o m\u1eebng \u0111\u1ebfn v\u1edbi SwanCore","login":"\u0110\u0103ng nh\u1eadp","continue":"Ti\u1ebfp t\u1ee5c","email":"Nh\u1eadp email ho\u1eb7c s\u1ed1 \u0111i\u1ec7n tho\u1ea1i","agree":"T\xf4i \u0111\u1ed3ng \xfd v\u1edbi \u0111i\u1ec1u kho\u1ea3n","google":"Ti\u1ebfp t\u1ee5c v\u1edbi Google","apple":"Ti\u1ebfp t\u1ee5c v\u1edbi Apple","or":"ho\u1eb7c","verify":"X\xe1c minh OTP","price":"Gi\xe1","balance":"S\u1ed1 d\u01b0","history":"L\u1ecbch s\u1eed giao d\u1ecbch","buy":"MUA","sell":"B\xc1N"}},"id":{"translation":{"welcome":"Selamat datang di SwanCore","login":"Masuk","continue":"Lanjutkan","email":"Masukkan email atau nomor telepon","agree":"Saya setuju dengan syarat","google":"Lanjutkan dengan Google","apple":"Lanjutkan dengan Apple","or":"atau","verify":"Verifikasi OTP","price":"Harga","balance":"Saldo","history":"Riwayat transaksi","buy":"BELI","sell":"JUAL"}},"ms":{"translation":{"welcome":"Selamat datang ke SwanCore","login":"Log masuk","continue":"Teruskan","email":"Masukkan e-mel atau telefon","agree":"Saya bersetuju dengan terma","google":"Teruskan dengan Google","apple":"Teruskan dengan Apple","or":"atau","verify":"Sahkan OTP","price":"Harga","balance":"Baki","history":"Sejarah dagangan","buy":"BELI","sell":"JUAL"}},"tl":{"translation":{"welcome":"Maligayang pagdating sa SwanCore","login":"Mag-login","continue":"Magpatuloy","email":"Ilagay ang email o telepono","agree":"Sumasang-ayon ako sa mga tuntunin","google":"Magpatuloy gamit ang Google","apple":"Magpatuloy gamit ang Apple","or":"o","verify":"I-verify ang OTP","price":"Presyo","balance":"Balanse","history":"Kasaysayan ng kalakalan","buy":"BUMILI","sell":"MAGBENTA"}},"cs":{"translation":{"welcome":"V\xedtejte ve SwanCore","login":"P\u0159ihl\xe1sit se","continue":"Pokra\u010dovat","email":"Zadejte e-mail nebo telefon","agree":"Souhlas\xedm s podm\xednkami","google":"Pokra\u010dovat s Google","apple":"Pokra\u010dovat s Apple","or":"nebo","verify":"Ov\u011b\u0159it OTP","price":"Cena","balance":"Z\u016fstatek","history":"Historie obchod\u016f","buy":"KOUPIT","sell":"PRODAT"}},"hu":{"translation":{"welcome":"\xdcdv\xf6z\xf6lj\xfck a SwanCore-ban","login":"Bejelentkez\xe9s","continue":"Folytat\xe1s","email":"Adja meg az e-mailt vagy telefonsz\xe1mot","agree":"Elfogadom a felt\xe9teleket","google":"Folytat\xe1s Google-lel","apple":"Folytat\xe1s Apple-lel","or":"vagy","verify":"OTP ellen\u0151rz\xe9se","price":"\xc1r","balance":"Egyenleg","history":"Keresked\xe9si el\u0151zm\xe9nyek","buy":"V\xc9TEL","sell":"ELAD\xc1S"}},"ro":{"translation":{"welcome":"Bine ai venit la SwanCore","login":"Autentificare","continue":"Continu\u0103","email":"Introdu email sau telefon","agree":"Sunt de acord cu termenii","google":"Continu\u0103 cu Google","apple":"Continu\u0103 cu Apple","or":"sau","verify":"Verific\u0103 OTP","price":"Pre\u021b","balance":"Sold","history":"Istoric tranzac\u021bii","buy":"CUMP\u0102R\u0102","sell":"VINDE"}},"sv":{"translation":{"welcome":"V\xe4lkommen till SwanCore","login":"Logga in","continue":"Forts\xe4tt","email":"Ange e-post eller telefon","agree":"Jag godk\xe4nner villkoren","google":"Forts\xe4tt med Google","apple":"Forts\xe4tt med Apple","or":"eller","verify":"Verifiera OTP","price":"Pris","balance":"Saldo","history":"Handelshistorik","buy":"K\xd6P","sell":"S\xc4LJ"}},"da":{"translation":{"welcome":"Velkommen til SwanCore","login":"Log ind","continue":"Forts\xe6t","email":"Indtast e-mail eller telefon","agree":"Jeg accepterer vilk\xe5rene","google":"Forts\xe6t med Google","apple":"Forts\xe6t med Apple","or":"eller","verify":"Bekr\xe6ft OTP","price":"Pris","balance":"Saldo","history":"Handelshistorik","buy":"K\xd8B","sell":"S\xc6LG"}},"fi":{"translation":{"welcome":"Tervetuloa SwanCoreen","login":"Kirjaudu sis\xe4\xe4n","continue":"Jatka","email":"Sy\xf6t\xe4 s\xe4hk\xf6posti tai puhelin","agree":"Hyv\xe4ksyn ehdot","google":"Jatka Googlen kanssa","apple":"Jatka Applen kanssa","or":"tai","verify":"Vahvista OTP","price":"Hinta","balance":"Saldo","history":"Kauppahistoria","buy":"OSTA","sell":"MYY"}},"no":{"translation":{"welcome":"Velkommen til SwanCore","login":"Logg inn","continue":"Fortsett","email":"Skriv inn e-post eller telefon","agree":"Jeg godtar vilk\xe5rene","google":"Fortsett med Google","apple":"Fortsett med Apple","or":"eller","verify":"Bekreft OTP","price":"Pris","balance":"Saldo","history":"Handelshistorikk","buy":"KJ\xd8P","sell":"SELG"}},"el":{"translation":{"welcome":"\u039a\u03b1\u03bb\u03ce\u03c2 \u03ae\u03c1\u03b8\u03b1\u03c4\u03b5 \u03c3\u03c4\u03bf SwanCore","login":"\u03a3\u03cd\u03bd\u03b4\u03b5\u03c3\u03b7","continue":"\u03a3\u03c5\u03bd\u03ad\u03c7\u03b5\u03b9\u03b1","email":"\u0395\u03b9\u03c3\u03b1\u03b3\u03ac\u03b3\u03b5\u03c4\u03b5 email \u03ae \u03c4\u03b7\u03bb\u03ad\u03c6\u03c9\u03bd\u03bf","agree":"\u03a3\u03c5\u03bc\u03c6\u03c9\u03bd\u03ce \u03bc\u03b5 \u03c4\u03bf\u03c5\u03c2 \u03cc\u03c1\u03bf\u03c5\u03c2","google":"\u03a3\u03c5\u03bd\u03ad\u03c7\u03b5\u03b9\u03b1 \u03bc\u03b5 Google","apple":"\u03a3\u03c5\u03bd\u03ad\u03c7\u03b5\u03b9\u03b1 \u03bc\u03b5 Apple","or":"\u03ae","verify":"\u0395\u03c0\u03b1\u03bb\u03ae\u03b8\u03b5\u03c5\u03c3\u03b7 OTP","price":"\u03a4\u03b9\u03bc\u03ae","balance":"\u03a5\u03c0\u03cc\u03bb\u03bf\u03b9\u03c0\u03bf","history":"\u0399\u03c3\u03c4\u03bf\u03c1\u03b9\u03ba\u03cc \u03c3\u03c5\u03bd\u03b1\u03bb\u03bb\u03b1\u03b3\u03ce\u03bd","buy":"\u0391\u0393\u039f\u03a1\u0391","sell":"\u03a0\u03a9\u039b\u0397\u03a3\u0397"}},"he":{"translation":{"welcome":"\u05d1\u05e8\u05d5\u05db\u05d9\u05dd \u05d4\u05d1\u05d0\u05d9\u05dd \u05dc-SwanCore","login":"\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea","continue":"\u05d4\u05de\u05e9\u05da","email":"\u05d4\u05d6\u05df \u05d0\u05d9\u05de\u05d9\u05d9\u05dc \u05d0\u05d5 \u05d8\u05dc\u05e4\u05d5\u05df","agree":"\u05d0\u05e0\u05d9 \u05de\u05e1\u05db\u05d9\u05dd \u05dc\u05ea\u05e0\u05d0\u05d9\u05dd","google":"\u05d4\u05de\u05e9\u05da \u05e2\u05dd Google","apple":"\u05d4\u05de\u05e9\u05da \u05e2\u05dd Apple","or":"\u05d0\u05d5","verify":"\u05d0\u05de\u05ea OTP","price":"\u05de\u05d7\u05d9\u05e8","balance":"\u05d9\u05ea\u05e8\u05d4","history":"\u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d9\u05ea \u05de\u05e1\u05d7\u05e8","buy":"\u05e7\u05e0\u05d4","sell":"\u05de\u05db\u05d5\u05e8"}}}');
    oe.use(xe).init({ resources: we, lng: "undefined" !== typeof window && localStorage.getItem("lang") || "en", fallbackLng: "en", interpolation: { escapeValue: !1 } });
    const je = oe, ke = e => { e && e instanceof Function && n.e(488).then(n.bind(n, 488)).then(t => { let n = t.getCLS, r = t.getFID, i = t.getFCP, a = t.getLCP, o = t.getTTFB; n(e), r(e), i(e), a(e), o(e); }); };
    var Se, Ne = n(950), Ce = n.t(Ne, 2);
    function Te() { return Te = Object.assign ? Object.assign.bind() : function (e) { for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    } return e; }, Te.apply(this, arguments); }
    !function (e) { e.Pop = "POP", e.Push = "PUSH", e.Replace = "REPLACE"; }(Se || (Se = {}));
    const Ae = "popstate";
    function Ee(e, t) { if (!1 === e || null === e || "undefined" === typeof e)
        throw new Error(t); }
    function Re(e, t) { if (!e) {
        "undefined" !== typeof console && console.warn(t);
        try {
            throw new Error(t);
        }
        catch (n) { }
    } }
    function Pe(e, t) { return { usr: e.state, key: e.key, idx: t }; }
    function Le(e, t, n, r) { return void 0 === n && (n = null), Te({ pathname: "string" === typeof e ? e : e.pathname, search: "", hash: "" }, "string" === typeof t ? ze(t) : t, { state: n, key: t && t.key || r || Math.random().toString(36).substr(2, 8) }); }
    function Oe(e) { let t = e.pathname, n = void 0 === t ? "/" : t, r = e.search, i = void 0 === r ? "" : r, a = e.hash, o = void 0 === a ? "" : a; return i && "?" !== i && (n += "?" === i.charAt(0) ? i : "?" + i), o && "#" !== o && (n += "#" === o.charAt(0) ? o : "#" + o), n; }
    function ze(e) { let t = {}; if (e) {
        let n = e.indexOf("#");
        n >= 0 && (t.hash = e.substr(n), e = e.substr(0, n));
        let r = e.indexOf("?");
        r >= 0 && (t.search = e.substr(r), e = e.substr(0, r)), e && (t.pathname = e);
    } return t; }
    function Be(e, t, n, r) { void 0 === r && (r = {}); let i = r, a = i.window, o = void 0 === a ? document.defaultView : a, s = i.v5Compat, l = void 0 !== s && s, c = o.history, d = Se.Pop, u = null, p = h(); function h() { return (c.state || { idx: null }).idx; } function f() { d = Se.Pop; let e = h(), t = null == e ? null : e - p; p = e, u && u({ action: d, location: m.location, delta: t }); } function g(e) { let t = "null" !== o.location.origin ? o.location.origin : o.location.href, n = "string" === typeof e ? e : Oe(e); return n = n.replace(/ $/, "%20"), Ee(t, "No window.location.(origin|href) available to create URL for href: " + n), new URL(n, t); } null == p && (p = 0, c.replaceState(Te({}, c.state, { idx: p }), "")); let m = { get action() { return d; }, get location() { return e(o, c); }, listen(e) { if (u)
            throw new Error("A history only accepts one active listener"); return o.addEventListener(Ae, f), u = e, () => { o.removeEventListener(Ae, f), u = null; }; }, createHref: e => t(o, e), createURL: g, encodeLocation(e) { let t = g(e); return { pathname: t.pathname, search: t.search, hash: t.hash }; }, push: function (e, t) { d = Se.Push; let r = Le(m.location, e, t); n && n(r, e), p = h() + 1; let i = Pe(r, p), a = m.createHref(r); try {
            c.pushState(i, "", a);
        }
        catch (s) {
            if (s instanceof DOMException && "DataCloneError" === s.name)
                throw s;
            o.location.assign(a);
        } l && u && u({ action: d, location: m.location, delta: 1 }); }, replace: function (e, t) { d = Se.Replace; let r = Le(m.location, e, t); n && n(r, e), p = h(); let i = Pe(r, p), a = m.createHref(r); c.replaceState(i, "", a), l && u && u({ action: d, location: m.location, delta: 0 }); }, go: e => c.go(e) }; return m; }
    var De;
    !function (e) { e.data = "data", e.deferred = "deferred", e.redirect = "redirect", e.error = "error"; }(De || (De = {}));
    new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
    function Fe(e, t, n) { return void 0 === n && (n = "/"), Me(e, t, n, !1); }
    function Me(e, t, n, r) { let i = Ze(("string" === typeof t ? ze(t) : t).pathname || "/", n); if (null == i)
        return null; let a = Ie(e); !function (e) { e.sort((e, t) => e.score !== t.score ? t.score - e.score : function (e, t) { let n = e.length === t.length && e.slice(0, -1).every((e, n) => e === t[n]); return n ? e[e.length - 1] - t[t.length - 1] : 0; }(e.routesMeta.map(e => e.childrenIndex), t.routesMeta.map(e => e.childrenIndex))); }(a); let o = null; for (let s = 0; null == o && s < a.length; ++s) {
        let e = Qe(i);
        o = Xe(a[s], e, r);
    } return o; }
    function Ie(e, t, n, r) { void 0 === t && (t = []), void 0 === n && (n = []), void 0 === r && (r = ""); let i = (e, i, a) => { let o = { relativePath: void 0 === a ? e.path || "" : a, caseSensitive: !0 === e.caseSensitive, childrenIndex: i, route: e }; o.relativePath.startsWith("/") && (Ee(o.relativePath.startsWith(r), 'Absolute route path "' + o.relativePath + '" nested under path "' + r + '" is not valid. An absolute child route path must start with the combined path of all its parent routes.'), o.relativePath = o.relativePath.slice(r.length)); let s = ot([r, o.relativePath]), l = n.concat(o); e.children && e.children.length > 0 && (Ee(!0 !== e.index, 'Index routes must not have child routes. Please remove all child routes from route path "' + s + '".'), Ie(e.children, t, l, s)), (null != e.path || e.index) && t.push({ path: s, score: Ye(s, e.index), routesMeta: l }); }; return e.forEach((e, t) => { var n; if ("" !== e.path && null != (n = e.path) && n.includes("?"))
        for (let r of Ue(e.path))
            i(e, t, r);
    else
        i(e, t); }), t; }
    function Ue(e) { let t = e.split("/"); if (0 === t.length)
        return []; let n = d(t), r = n[0], i = o(n).slice(1), a = r.endsWith("?"), s = r.replace(/\?$/, ""); if (0 === i.length)
        return a ? [s, ""] : [s]; let l = Ue(i.join("/")), c = []; return c.push(...l.map(e => "" === e ? s : [s, e].join("/"))), a && c.push(...l), c.map(t => e.startsWith("/") && "" === t ? "/" : t); }
    const _e = /^:[\w-]+$/, We = 3, He = 2, Ve = 1, qe = 10, Ke = -2, Ge = e => "*" === e;
    function Ye(e, t) { let n = e.split("/"), r = n.length; return n.some(Ge) && (r += Ke), t && (r += He), n.filter(e => !Ge(e)).reduce((e, t) => e + (_e.test(t) ? We : "" === t ? Ve : qe), r); }
    function Xe(e, t, n) { void 0 === n && (n = !1); let r = e.routesMeta, i = {}, a = "/", o = []; for (let s = 0; s < r.length; ++s) {
        let e = r[s], l = s === r.length - 1, c = "/" === a ? t : t.slice(a.length) || "/", d = Je({ path: e.relativePath, caseSensitive: e.caseSensitive, end: l }, c), u = e.route;
        if (!d && l && n && !r[r.length - 1].route.index && (d = Je({ path: e.relativePath, caseSensitive: e.caseSensitive, end: !1 }, c)), !d)
            return null;
        Object.assign(i, d.params), o.push({ params: i, pathname: ot([a, d.pathname]), pathnameBase: st(ot([a, d.pathnameBase])), route: u }), "/" !== d.pathnameBase && (a = ot([a, d.pathnameBase]));
    } return o; }
    function Je(e, t) { "string" === typeof e && (e = { path: e, caseSensitive: !1, end: !0 }); let n = function (e, t, n) { void 0 === t && (t = !1); void 0 === n && (n = !0); Re("*" === e || !e.endsWith("*") || e.endsWith("/*"), 'Route path "' + e + '" will be treated as if it were "' + e.replace(/\*$/, "/*") + '" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, please change the route path to "' + e.replace(/\*$/, "/*") + '".'); let r = [], i = "^" + e.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (e, t, n) => (r.push({ paramName: t, isOptional: null != n }), n ? "/?([^\\/]+)?" : "/([^\\/]+)")); e.endsWith("*") ? (r.push({ paramName: "*" }), i += "*" === e || "/*" === e ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : n ? i += "\\/*$" : "" !== e && "/" !== e && (i += "(?:(?=\\/|$))"); let a = new RegExp(i, t ? void 0 : "i"); return [a, r]; }(e.path, e.caseSensitive, e.end), r = u(n, 2), i = r[0], a = r[1], o = t.match(i); if (!o)
        return null; let s = o[0], l = s.replace(/(.)\/+$/, "$1"), c = o.slice(1), d = a.reduce((e, t, n) => { let r = t.paramName, i = t.isOptional; if ("*" === r) {
        let e = c[n] || "";
        l = s.slice(0, s.length - e.length).replace(/(.)\/+$/, "$1");
    } const a = c[n]; return e[r] = i && !a ? void 0 : (a || "").replace(/%2F/g, "/"), e; }, {}); return { params: d, pathname: s, pathnameBase: l, pattern: e }; }
    function Qe(e) { try {
        return e.split("/").map(e => decodeURIComponent(e).replace(/\//g, "%2F")).join("/");
    }
    catch (t) {
        return Re(!1, 'The URL path "' + e + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent encoding (' + t + ")."), e;
    } }
    function Ze(e, t) { if ("/" === t)
        return e; if (!e.toLowerCase().startsWith(t.toLowerCase()))
        return null; let n = t.endsWith("/") ? t.length - 1 : t.length, r = e.charAt(n); return r && "/" !== r ? null : e.slice(n) || "/"; }
    const $e = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
    function et(e, t) { void 0 === t && (t = "/"); let n, r = "string" === typeof e ? ze(e) : e, i = r.pathname, a = r.search, o = void 0 === a ? "" : a, s = r.hash, l = void 0 === s ? "" : s; if (i)
        if ((e => $e.test(e))(i))
            n = i;
        else {
            if (i.includes("//")) {
                let e = i;
                i = i.replace(/\/\/+/g, "/"), Re(!1, "Pathnames cannot have embedded double slashes - normalizing " + e + " -> " + i);
            }
            n = i.startsWith("/") ? tt(i.substring(1), "/") : tt(i, t);
        }
    else
        n = t; return { pathname: n, search: lt(o), hash: ct(l) }; }
    function tt(e, t) { let n = t.replace(/\/+$/, "").split("/"); return e.split("/").forEach(e => { ".." === e ? n.length > 1 && n.pop() : "." !== e && n.push(e); }), n.length > 1 ? n.join("/") : "/"; }
    function nt(e, t, n, r) { return "Cannot include a '" + e + "' character in a manually specified `to." + t + "` field [" + JSON.stringify(r) + "].  Please separate it out to the `to." + n + '` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.'; }
    function rt(e) { return e.filter((e, t) => 0 === t || e.route.path && e.route.path.length > 0); }
    function it(e, t) { let n = rt(e); return t ? n.map((e, t) => t === n.length - 1 ? e.pathname : e.pathnameBase) : n.map(e => e.pathnameBase); }
    function at(e, t, n, r) { let i; void 0 === r && (r = !1), "string" === typeof e ? i = ze(e) : (i = Te({}, e), Ee(!i.pathname || !i.pathname.includes("?"), nt("?", "pathname", "search", i)), Ee(!i.pathname || !i.pathname.includes("#"), nt("#", "pathname", "hash", i)), Ee(!i.search || !i.search.includes("#"), nt("#", "search", "hash", i))); let a, o = "" === e || "" === i.pathname, s = o ? "/" : i.pathname; if (null == s)
        a = n;
    else {
        let e = t.length - 1;
        if (!r && s.startsWith("..")) {
            let t = s.split("/");
            for (; ".." === t[0];)
                t.shift(), e -= 1;
            i.pathname = t.join("/");
        }
        a = e >= 0 ? t[e] : "/";
    } let l = et(i, a), c = s && "/" !== s && s.endsWith("/"), d = (o || "." === s) && n.endsWith("/"); return l.pathname.endsWith("/") || !c && !d || (l.pathname += "/"), l; }
    const ot = e => e.join("/").replace(/\/\/+/g, "/"), st = e => e.replace(/\/+$/, "").replace(/^\/*/, "/"), lt = e => e && "?" !== e ? e.startsWith("?") ? e : "?" + e : "", ct = e => e && "#" !== e ? e.startsWith("#") ? e : "#" + e : "";
    Error;
    function dt(e) { return null != e && "number" === typeof e.status && "string" === typeof e.statusText && "boolean" === typeof e.internal && "data" in e; }
    const ut = ["post", "put", "patch", "delete"], pt = (new Set(ut), ["get", ...ut]);
    new Set(pt), new Set([301, 302, 303, 307, 308]), new Set([307, 308]);
    Symbol("deferred");
    function ht() { return ht = Object.assign ? Object.assign.bind() : function (e) { for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    } return e; }, ht.apply(this, arguments); }
    const ft = r.createContext(null);
    const gt = r.createContext(null);
    const mt = r.createContext(null);
    const xt = r.createContext(null);
    const bt = r.createContext({ outlet: null, matches: [], isDataRoute: !1 });
    const yt = r.createContext(null);
    function vt() { return null != r.useContext(xt); }
    function wt() { return vt() || Ee(!1), r.useContext(xt).location; }
    function jt(e) { r.useContext(mt).static || r.useLayoutEffect(e); }
    function kt() { return r.useContext(bt).isDataRoute ? function () { let e = Ot(Pt.UseNavigateStable).router, t = Bt(Lt.UseNavigateStable), n = r.useRef(!1); return jt(() => { n.current = !0; }), r.useCallback(function (r, i) { void 0 === i && (i = {}), n.current && ("number" === typeof r ? e.navigate(r) : e.navigate(r, ht({ fromRouteId: t }, i))); }, [e, t]); }() : function () { vt() || Ee(!1); let e = r.useContext(ft), t = r.useContext(mt), n = t.basename, i = t.future, a = t.navigator, o = r.useContext(bt).matches, s = wt().pathname, l = JSON.stringify(it(o, i.v7_relativeSplatPath)), c = r.useRef(!1); return jt(() => { c.current = !0; }), r.useCallback(function (t, r) { if (void 0 === r && (r = {}), !c.current)
        return; if ("number" === typeof t)
        return void a.go(t); let i = at(t, JSON.parse(l), s, "path" === r.relative); null == e && "/" !== n && (i.pathname = "/" === i.pathname ? n : ot([n, i.pathname])), (r.replace ? a.replace : a.push)(i, r.state, r); }, [n, a, l, s, e]); }(); }
    function St(e, t) { let n = (void 0 === t ? {} : t).relative, i = r.useContext(mt).future, a = r.useContext(bt).matches, o = wt().pathname, s = JSON.stringify(it(a, i.v7_relativeSplatPath)); return r.useMemo(() => at(e, JSON.parse(s), o, "path" === n), [e, s, o, n]); }
    function Nt(e, t, n, i) { vt() || Ee(!1); let a = r.useContext(mt).navigator, o = r.useContext(bt).matches, s = o[o.length - 1], l = s ? s.params : {}, c = (s && s.pathname, s ? s.pathnameBase : "/"); s && s.route; let d, u = wt(); if (t) {
        var p;
        let e = "string" === typeof t ? ze(t) : t;
        "/" === c || (null == (p = e.pathname) ? void 0 : p.startsWith(c)) || Ee(!1), d = e;
    }
    else
        d = u; let h = d.pathname || "/", f = h; if ("/" !== c) {
        let e = c.replace(/^\//, "").split("/");
        f = "/" + h.replace(/^\//, "").split("/").slice(e.length).join("/");
    } let g = Fe(e, { pathname: f }); let m = Rt(g && g.map(e => Object.assign({}, e, { params: Object.assign({}, l, e.params), pathname: ot([c, a.encodeLocation ? a.encodeLocation(e.pathname).pathname : e.pathname]), pathnameBase: "/" === e.pathnameBase ? c : ot([c, a.encodeLocation ? a.encodeLocation(e.pathnameBase).pathname : e.pathnameBase]) })), o, n, i); return t && m ? r.createElement(xt.Provider, { value: { location: ht({ pathname: "/", search: "", hash: "", state: null, key: "default" }, d), navigationType: Se.Pop } }, m) : m; }
    function Ct() { let e = function () { var e; let t = r.useContext(yt), n = zt(Lt.UseRouteError), i = Bt(Lt.UseRouteError); if (void 0 !== t)
        return t; return null == (e = n.errors) ? void 0 : e[i]; }(), t = dt(e) ? e.status + " " + e.statusText : e instanceof Error ? e.message : JSON.stringify(e), n = e instanceof Error ? e.stack : null, i = "rgba(200,200,200, 0.5)", a = { padding: "0.5rem", backgroundColor: i }; return r.createElement(r.Fragment, null, r.createElement("h2", null, "Unexpected Application Error!"), r.createElement("h3", { style: { fontStyle: "italic" } }, t), n ? r.createElement("pre", { style: a }, n) : null, null); }
    const Tt = r.createElement(Ct, null);
    class At extends r.Component {
        constructor(e) { super(e), this.state = { location: e.location, revalidation: e.revalidation, error: e.error }; }
        static getDerivedStateFromError(e) { return { error: e }; }
        static getDerivedStateFromProps(e, t) { return t.location !== e.location || "idle" !== t.revalidation && "idle" === e.revalidation ? { error: e.error, location: e.location, revalidation: e.revalidation } : { error: void 0 !== e.error ? e.error : t.error, location: t.location, revalidation: e.revalidation || t.revalidation }; }
        componentDidCatch(e, t) { console.error("React Router caught the following error during render", e, t); }
        render() { return void 0 !== this.state.error ? r.createElement(bt.Provider, { value: this.props.routeContext }, r.createElement(yt.Provider, { value: this.state.error, children: this.props.component })) : this.props.children; }
    }
    function Et(e) { let t = e.routeContext, n = e.match, i = e.children, a = r.useContext(ft); return a && a.static && a.staticContext && (n.route.errorElement || n.route.ErrorBoundary) && (a.staticContext._deepestRenderedBoundaryId = n.route.id), r.createElement(bt.Provider, { value: t }, i); }
    function Rt(e, t, n, i) { var a; if (void 0 === t && (t = []), void 0 === n && (n = null), void 0 === i && (i = null), null == e) {
        var o;
        if (!n)
            return null;
        if (n.errors)
            e = n.matches;
        else {
            if (!(null != (o = i) && o.v7_partialHydration && 0 === t.length && !n.initialized && n.matches.length > 0))
                return null;
            e = n.matches;
        }
    } let s = e, l = null == (a = n) ? void 0 : a.errors; if (null != l) {
        let e = s.findIndex(e => e.route.id && void 0 !== (null == l ? void 0 : l[e.route.id]));
        e >= 0 || Ee(!1), s = s.slice(0, Math.min(s.length, e + 1));
    } let c = !1, d = -1; if (n && i && i.v7_partialHydration)
        for (let r = 0; r < s.length; r++) {
            let e = s[r];
            if ((e.route.HydrateFallback || e.route.hydrateFallbackElement) && (d = r), e.route.id) {
                let t = n, r = t.loaderData, i = t.errors, a = e.route.loader && void 0 === r[e.route.id] && (!i || void 0 === i[e.route.id]);
                if (e.route.lazy || a) {
                    c = !0, s = d >= 0 ? s.slice(0, d + 1) : [s[0]];
                    break;
                }
            }
        } return s.reduceRight((e, i, a) => { let o, u = !1, p = null, h = null; var f; n && (o = l && i.route.id ? l[i.route.id] : void 0, p = i.route.errorElement || Tt, c && (d < 0 && 0 === a ? (f = "route-fallback", !1 || Dt[f] || (Dt[f] = !0), u = !0, h = null) : d === a && (u = !0, h = i.route.hydrateFallbackElement || null))); let g = t.concat(s.slice(0, a + 1)), m = () => { let t; return t = o ? p : u ? h : i.route.Component ? r.createElement(i.route.Component, null) : i.route.element ? i.route.element : e, r.createElement(Et, { match: i, routeContext: { outlet: e, matches: g, isDataRoute: null != n }, children: t }); }; return n && (i.route.ErrorBoundary || i.route.errorElement || 0 === a) ? r.createElement(At, { location: n.location, revalidation: n.revalidation, component: p, error: o, children: m(), routeContext: { outlet: null, matches: g, isDataRoute: !0 } }) : m(); }, null); }
    var Pt = function (e) { return e.UseBlocker = "useBlocker", e.UseRevalidator = "useRevalidator", e.UseNavigateStable = "useNavigate", e; }(Pt || {}), Lt = function (e) { return e.UseBlocker = "useBlocker", e.UseLoaderData = "useLoaderData", e.UseActionData = "useActionData", e.UseRouteError = "useRouteError", e.UseNavigation = "useNavigation", e.UseRouteLoaderData = "useRouteLoaderData", e.UseMatches = "useMatches", e.UseRevalidator = "useRevalidator", e.UseNavigateStable = "useNavigate", e.UseRouteId = "useRouteId", e; }(Lt || {});
    function Ot(e) { let t = r.useContext(ft); return t || Ee(!1), t; }
    function zt(e) { let t = r.useContext(gt); return t || Ee(!1), t; }
    function Bt(e) { let t = function () { let e = r.useContext(bt); return e || Ee(!1), e; }(), n = t.matches[t.matches.length - 1]; return n.route.id || Ee(!1), n.route.id; }
    const Dt = {};
    function Ft(e, t) { null == e || e.v7_startTransition, void 0 === (null == e ? void 0 : e.v7_relativeSplatPath) && (!t || t.v7_relativeSplatPath), t && (t.v7_fetcherPersist, t.v7_normalizeFormMethod, t.v7_partialHydration, t.v7_skipActionErrorRevalidation); }
    i.startTransition;
    function Mt(e) { let t = e.to, n = e.replace, i = e.state, a = e.relative; vt() || Ee(!1); let o = r.useContext(mt), s = o.future, l = (o.static, r.useContext(bt).matches), c = wt().pathname, d = kt(), u = at(t, it(l, s.v7_relativeSplatPath), c, "path" === a), p = JSON.stringify(u); return r.useEffect(() => d(JSON.parse(p), { replace: n, state: i, relative: a }), [d, p, a, n, i]), null; }
    function It(e) { Ee(!1); }
    function Ut(e) { let t = e.basename, n = void 0 === t ? "/" : t, i = e.children, a = void 0 === i ? null : i, o = e.location, s = e.navigationType, l = void 0 === s ? Se.Pop : s, c = e.navigator, d = e.static, u = void 0 !== d && d, p = e.future; vt() && Ee(!1); let h = n.replace(/^\/*/, "/"), f = r.useMemo(() => ({ basename: h, navigator: c, static: u, future: ht({ v7_relativeSplatPath: !1 }, p) }), [h, p, c, u]); "string" === typeof o && (o = ze(o)); let g = o, m = g.pathname, x = void 0 === m ? "/" : m, b = g.search, y = void 0 === b ? "" : b, v = g.hash, w = void 0 === v ? "" : v, j = g.state, k = void 0 === j ? null : j, S = g.key, N = void 0 === S ? "default" : S, C = r.useMemo(() => { let e = Ze(x, h); return null == e ? null : { location: { pathname: e, search: y, hash: w, state: k, key: N }, navigationType: l }; }, [h, x, y, w, k, N, l]); return null == C ? null : r.createElement(mt.Provider, { value: f }, r.createElement(xt.Provider, { children: a, value: C })); }
    function _t(e) { let t = e.children, n = e.location; return Nt(Wt(t), n); }
    new Promise(() => { });
    r.Component;
    function Wt(e, t) { void 0 === t && (t = []); let n = []; return r.Children.forEach(e, (e, i) => { if (!r.isValidElement(e))
        return; let a = [...t, i]; if (e.type === r.Fragment)
        return void n.push.apply(n, Wt(e.props.children, a)); e.type !== It && Ee(!1), e.props.index && e.props.children && Ee(!1); let o = { id: e.props.id || a.join("-"), caseSensitive: e.props.caseSensitive, element: e.props.element, Component: e.props.Component, index: e.props.index, path: e.props.path, loader: e.props.loader, action: e.props.action, errorElement: e.props.errorElement, ErrorBoundary: e.props.ErrorBoundary, hasErrorBoundary: null != e.props.ErrorBoundary || null != e.props.errorElement, shouldRevalidate: e.props.shouldRevalidate, handle: e.props.handle, lazy: e.props.lazy }; e.props.children && (o.children = Wt(e.props.children, a)), n.push(o); }), n; }
    function Ht() { return Ht = Object.assign ? Object.assign.bind() : function (e) { for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    } return e; }, Ht.apply(this, arguments); }
    function Vt(e, t) { if (null == e)
        return {}; var n, r, i = {}, a = Object.keys(e); for (r = 0; r < a.length; r++)
        n = a[r], t.indexOf(n) >= 0 || (i[n] = e[n]); return i; }
    new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
    const qt = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], Kt = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"];
    try {
        window.__reactRouterVersion = "6";
    }
    catch (El) { }
    const Gt = r.createContext({ isTransitioning: !1 });
    new Map;
    const Yt = i.startTransition;
    Ce.flushSync, i.useId;
    function Xt(e) { let t = e.basename, n = e.children, i = e.future, a = e.window, o = r.useRef(); var s; null == o.current && (o.current = (void 0 === (s = { window: a, v5Compat: !0 }) && (s = {}), Be(function (e, t) { let n = e.location; return Le("", { pathname: n.pathname, search: n.search, hash: n.hash }, t.state && t.state.usr || null, t.state && t.state.key || "default"); }, function (e, t) { return "string" === typeof t ? t : Oe(t); }, null, s))); let l = o.current, c = u(r.useState({ action: l.action, location: l.location }), 2), d = c[0], p = c[1], h = (i || {}).v7_startTransition, f = r.useCallback(e => { h && Yt ? Yt(() => p(e)) : p(e); }, [p, h]); return r.useLayoutEffect(() => l.listen(f), [l, f]), r.useEffect(() => Ft(i), [i]), r.createElement(Ut, { basename: t, children: n, location: d.location, navigationType: d.action, navigator: l, future: i }); }
    const Jt = "undefined" !== typeof window && "undefined" !== typeof window.document && "undefined" !== typeof window.document.createElement, Qt = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, Zt = r.forwardRef(function (e, t) { let n, i = e.onClick, a = e.relative, o = e.reloadDocument, s = e.replace, l = e.state, c = e.target, d = e.to, u = e.preventScrollReset, p = e.viewTransition, h = Vt(e, qt), f = r.useContext(mt).basename, g = !1; if ("string" === typeof d && Qt.test(d) && (n = d, Jt))
        try {
            let e = new URL(window.location.href), t = d.startsWith("//") ? new URL(e.protocol + d) : new URL(d), n = Ze(t.pathname, f);
            t.origin === e.origin && null != n ? d = n + t.search + t.hash : g = !0;
        }
        catch (El) { } let m = function (e, t) { let n = (void 0 === t ? {} : t).relative; vt() || Ee(!1); let i = r.useContext(mt), a = i.basename, o = i.navigator, s = St(e, { relative: n }), l = s.hash, c = s.pathname, d = s.search, u = c; return "/" !== a && (u = "/" === c ? a : ot([a, c])), o.createHref({ pathname: u, search: d, hash: l }); }(d, { relative: a }), x = function (e, t) { let n = void 0 === t ? {} : t, i = n.target, a = n.replace, o = n.state, s = n.preventScrollReset, l = n.relative, c = n.viewTransition, d = kt(), u = wt(), p = St(e, { relative: l }); return r.useCallback(t => { if (function (e, t) { return 0 === e.button && (!t || "_self" === t) && !function (e) { return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey); }(e); }(t, i)) {
        t.preventDefault();
        let n = void 0 !== a ? a : Oe(u) === Oe(p);
        d(e, { replace: n, state: o, preventScrollReset: s, relative: l, viewTransition: c });
    } }, [u, d, p, a, o, i, e, s, l, c]); }(d, { replace: s, state: l, target: c, preventScrollReset: u, relative: a, viewTransition: p }); return r.createElement("a", Ht({}, h, { href: n || m, onClick: g || o ? i : function (e) { i && i(e), e.defaultPrevented || x(e); }, ref: t, target: c })); });
    const $t = r.forwardRef(function (e, t) { let n = e["aria-current"], i = void 0 === n ? "page" : n, a = e.caseSensitive, o = void 0 !== a && a, s = e.className, l = void 0 === s ? "" : s, c = e.end, d = void 0 !== c && c, u = e.style, p = e.to, h = e.viewTransition, f = e.children, g = Vt(e, Kt), m = St(p, { relative: g.relative }), x = wt(), b = r.useContext(gt), y = r.useContext(mt), v = y.navigator, w = y.basename, j = null != b && function (e, t) { void 0 === t && (t = {}); let n = r.useContext(Gt); null == n && Ee(!1); let i = nn(en.useViewTransitionState).basename, a = St(e, { relative: t.relative }); if (!n.isTransitioning)
        return !1; let o = Ze(n.currentLocation.pathname, i) || n.currentLocation.pathname, s = Ze(n.nextLocation.pathname, i) || n.nextLocation.pathname; return null != Je(a.pathname, s) || null != Je(a.pathname, o); }(m) && !0 === h, k = v.encodeLocation ? v.encodeLocation(m).pathname : m.pathname, S = x.pathname, N = b && b.navigation && b.navigation.location ? b.navigation.location.pathname : null; o || (S = S.toLowerCase(), N = N ? N.toLowerCase() : null, k = k.toLowerCase()), N && w && (N = Ze(N, w) || N); const C = "/" !== k && k.endsWith("/") ? k.length - 1 : k.length; let T, A = S === k || !d && S.startsWith(k) && "/" === S.charAt(C), E = null != N && (N === k || !d && N.startsWith(k) && "/" === N.charAt(k.length)), R = { isActive: A, isPending: E, isTransitioning: j }, P = A ? i : void 0; T = "function" === typeof l ? l(R) : [l, A ? "active" : null, E ? "pending" : null, j ? "transitioning" : null].filter(Boolean).join(" "); let L = "function" === typeof u ? u(R) : u; return r.createElement(Zt, Ht({}, g, { "aria-current": P, className: T, ref: t, style: L, to: p, viewTransition: h }), "function" === typeof f ? f(R) : f); });
    var en, tn;
    function nn(e) { let t = r.useContext(ft); return t || Ee(!1), t; }
    (function (e) { e.UseScrollRestoration = "useScrollRestoration", e.UseSubmit = "useSubmit", e.UseSubmitFetcher = "useSubmitFetcher", e.UseFetcher = "useFetcher", e.useViewTransitionState = "useViewTransitionState"; })(en || (en = {})), function (e) { e.UseFetcher = "useFetcher", e.UseFetchers = "useFetchers", e.UseScrollRestoration = "useScrollRestoration"; }(tn || (tn = {}));
    function rn() { const e = wt().pathname; return (0, r.useEffect)(() => { window.scrollTo(0, 0); }, [e]), null; }
    function an(e, t) { return function () { return e.apply(t, arguments); }; }
    const on = Object.prototype.toString, sn = Object.getPrototypeOf, ln = Symbol.iterator, cn = Symbol.toStringTag, dn = (e => t => { const n = on.call(t); return e[n] || (e[n] = n.slice(8, -1).toLowerCase()); })(Object.create(null)), un = e => (e = e.toLowerCase(), t => dn(t) === e), pn = e => t => typeof t === e, hn = Array.isArray, fn = pn("undefined");
    function gn(e) { return null !== e && !fn(e) && null !== e.constructor && !fn(e.constructor) && bn(e.constructor.isBuffer) && e.constructor.isBuffer(e); }
    const mn = un("ArrayBuffer");
    const xn = pn("string"), bn = pn("function"), yn = pn("number"), vn = e => null !== e && "object" === typeof e, wn = e => { if ("object" !== dn(e))
        return !1; const t = sn(e); return (null === t || t === Object.prototype || null === Object.getPrototypeOf(t)) && !(cn in e) && !(ln in e); }, jn = un("Date"), kn = un("File"), Sn = un("Blob"), Nn = un("FileList");
    const Cn = "undefined" !== typeof globalThis ? globalThis : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof n.g ? n.g : {}, Tn = "undefined" !== typeof Cn.FormData ? Cn.FormData : void 0, An = un("URLSearchParams"), En = u(["ReadableStream", "Request", "Response", "Headers"].map(un), 4), Rn = En[0], Pn = En[1], Ln = En[2], On = En[3];
    function zn(e, t) { let n, r, i = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).allOwnKeys, a = void 0 !== i && i; if (null !== e && "undefined" !== typeof e)
        if ("object" !== typeof e && (e = [e]), hn(e))
            for (n = 0, r = e.length; n < r; n++)
                t.call(null, e[n], n, e);
        else {
            if (gn(e))
                return;
            const r = a ? Object.getOwnPropertyNames(e) : Object.keys(e), i = r.length;
            let o;
            for (n = 0; n < i; n++)
                o = r[n], t.call(null, e[o], o, e);
        } }
    function Bn(e, t) { if (gn(e))
        return null; t = t.toLowerCase(); const n = Object.keys(e); let r, i = n.length; for (; i-- > 0;)
        if (r = n[i], t === r.toLowerCase())
            return r; return null; }
    const Dn = "undefined" !== typeof globalThis ? globalThis : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : n.g, Fn = e => !fn(e) && e !== Dn;
    const Mn = (In = "undefined" !== typeof Uint8Array && sn(Uint8Array), e => In && e instanceof In);
    var In;
    const Un = un("HTMLFormElement"), _n = (() => { let e = Object.prototype.hasOwnProperty; return (t, n) => e.call(t, n); })(), Wn = un("RegExp"), Hn = (e, t) => { const n = Object.getOwnPropertyDescriptors(e), r = {}; zn(n, (n, i) => { let a; !1 !== (a = t(n, i, e)) && (r[i] = a || n); }), Object.defineProperties(e, r); };
    const Vn = un("AsyncFunction"), qn = ((e, t) => { return e ? setImmediate : t ? (n = "axios@".concat(Math.random()), r = [], Dn.addEventListener("message", e => { let t = e.source, i = e.data; t === Dn && i === n && r.length && r.shift()(); }, !1), e => { r.push(e), Dn.postMessage(n, "*"); }) : e => setTimeout(e); var n, r; })("function" === typeof setImmediate, bn(Dn.postMessage)), Kn = "undefined" !== typeof queueMicrotask ? queueMicrotask.bind(Dn) : "undefined" !== typeof process && process.nextTick || qn, Gn = { isArray: hn, isArrayBuffer: mn, isBuffer: gn, isFormData: e => { if (!e)
            return !1; if (Tn && e instanceof Tn)
            return !0; const t = sn(e); if (!t || t === Object.prototype)
            return !1; if (!bn(e.append))
            return !1; const n = dn(e); return "formdata" === n || "object" === n && bn(e.toString) && "[object FormData]" === e.toString(); }, isArrayBufferView: function (e) { let t; return t = "undefined" !== typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && mn(e.buffer), t; }, isString: xn, isNumber: yn, isBoolean: e => !0 === e || !1 === e, isObject: vn, isPlainObject: wn, isEmptyObject: e => { if (!vn(e) || gn(e))
            return !1; try {
            return 0 === Object.keys(e).length && Object.getPrototypeOf(e) === Object.prototype;
        }
        catch (El) {
            return !1;
        } }, isReadableStream: Rn, isRequest: Pn, isResponse: Ln, isHeaders: On, isUndefined: fn, isDate: jn, isFile: kn, isReactNativeBlob: e => !(!e || "undefined" === typeof e.uri), isReactNative: e => e && "undefined" !== typeof e.getParts, isBlob: Sn, isRegExp: Wn, isFunction: bn, isStream: e => vn(e) && bn(e.pipe), isURLSearchParams: An, isTypedArray: Mn, isFileList: Nn, forEach: zn, merge: function e() { const t = Fn(this) && this || {}, n = t.caseless, r = t.skipUndefined, i = {}, a = (t, a) => { if ("__proto__" === a || "constructor" === a || "prototype" === a)
            return; const o = n && Bn(i, a) || a, s = _n(i, o) ? i[o] : void 0; wn(s) && wn(t) ? i[o] = e(s, t) : wn(t) ? i[o] = e({}, t) : hn(t) ? i[o] = t.slice() : r && fn(t) || (i[o] = t); }; for (var o = arguments.length, s = new Array(o), l = 0; l < o; l++)
            s[l] = arguments[l]; for (let c = 0, d = s.length; c < d; c++)
            s[c] && zn(s[c], a); return i; }, extend: function (e, t, n) { return zn(t, (t, r) => { n && bn(t) ? Object.defineProperty(e, r, { __proto__: null, value: an(t, n), writable: !0, enumerable: !0, configurable: !0 }) : Object.defineProperty(e, r, { __proto__: null, value: t, writable: !0, enumerable: !0, configurable: !0 }); }, { allOwnKeys: (arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}).allOwnKeys }), e; }, trim: e => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""), stripBOM: e => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e), inherits: (e, t, n, r) => { e.prototype = Object.create(t.prototype, r), Object.defineProperty(e.prototype, "constructor", { __proto__: null, value: e, writable: !0, enumerable: !1, configurable: !0 }), Object.defineProperty(e, "super", { __proto__: null, value: t.prototype }), n && Object.assign(e.prototype, n); }, toFlatObject: (e, t, n, r) => { let i, a, o; const s = {}; if (t = t || {}, null == e)
            return t; do {
            for (i = Object.getOwnPropertyNames(e), a = i.length; a-- > 0;)
                o = i[a], r && !r(o, e, t) || s[o] || (t[o] = e[o], s[o] = !0);
            e = !1 !== n && sn(e);
        } while (e && (!n || n(e, t)) && e !== Object.prototype); return t; }, kindOf: dn, kindOfTest: un, endsWith: (e, t, n) => { e = String(e), (void 0 === n || n > e.length) && (n = e.length), n -= t.length; const r = e.indexOf(t, n); return -1 !== r && r === n; }, toArray: e => { if (!e)
            return null; if (hn(e))
            return e; let t = e.length; if (!yn(t))
            return null; const n = new Array(t); for (; t-- > 0;)
            n[t] = e[t]; return n; }, forEachEntry: (e, t) => { const n = (e && e[ln]).call(e); let r; for (; (r = n.next()) && !r.done;) {
            const n = r.value;
            t.call(e, n[0], n[1]);
        } }, matchAll: (e, t) => { let n; const r = []; for (; null !== (n = e.exec(t));)
            r.push(n); return r; }, isHTMLForm: Un, hasOwnProperty: _n, hasOwnProp: _n, reduceDescriptors: Hn, freezeMethods: e => { Hn(e, (t, n) => { if (bn(e) && ["arguments", "caller", "callee"].includes(n))
            return !1; const r = e[n]; bn(r) && (t.enumerable = !1, "writable" in t ? t.writable = !1 : t.set || (t.set = () => { throw Error("Can not rewrite read-only method '" + n + "'"); })); }); }, toObjectSet: (e, t) => { const n = {}, r = e => { e.forEach(e => { n[e] = !0; }); }; return hn(e) ? r(e) : r(String(e).split(t)), n; }, toCamelCase: e => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (e, t, n) { return t.toUpperCase() + n; }), noop: () => { }, toFiniteNumber: (e, t) => null != e && Number.isFinite(e = +e) ? e : t, findKey: Bn, global: Dn, isContextDefined: Fn, isSpecCompliantForm: function (e) { return !!(e && bn(e.append) && "FormData" === e[cn] && e[ln]); }, toJSONObject: e => { const t = new Array(10), n = (e, r) => { if (vn(e)) {
            if (t.indexOf(e) >= 0)
                return;
            if (gn(e))
                return e;
            if (!("toJSON" in e)) {
                t[r] = e;
                const i = hn(e) ? [] : {};
                return zn(e, (e, t) => { const a = n(e, r + 1); !fn(a) && (i[t] = a); }), t[r] = void 0, i;
            }
        } return e; }; return n(e, 0); }, isAsyncFn: Vn, isThenable: e => e && (vn(e) || bn(e)) && bn(e.then) && bn(e.catch), setImmediate: qn, asap: Kn, isIterable: e => null != e && bn(e[ln]) }, Yn = Gn.toObjectSet(["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"]), Xn = e => { const t = {}; let n, r, i; return e && e.split("\n").forEach(function (e) { i = e.indexOf(":"), n = e.substring(0, i).trim().toLowerCase(), r = e.substring(i + 1).trim(), !n || t[n] && Yn[n] || ("set-cookie" === n ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r); }), t; };
    (Object.getOwnPropertyDescriptor(Xn, "name") || {}).writable || Object.defineProperty(Xn, "name", { value: "default", configurable: !0 });
    const Jn = Symbol("internals"), Qn = /[^\x09\x20-\x7E\x80-\xFF]/g;
    function Zn(e) { return e && String(e).trim().toLowerCase(); }
    function $n(e) { return !1 === e || null == e ? e : Gn.isArray(e) ? e.map($n) : function (e) { let t = 0, n = e.length; for (; t < n;) {
        const n = e.charCodeAt(t);
        if (9 !== n && 32 !== n)
            break;
        t += 1;
    } for (; n > t;) {
        const t = e.charCodeAt(n - 1);
        if (9 !== t && 32 !== t)
            break;
        n -= 1;
    } return 0 === t && n === e.length ? e : e.slice(t, n); }(String(e).replace(Qn, "")); }
    function er(e, t, n, r, i) { return Gn.isFunction(r) ? r.call(this, t, n) : (i && (t = n), Gn.isString(t) ? Gn.isString(r) ? -1 !== t.indexOf(r) : Gn.isRegExp(r) ? r.test(t) : void 0 : void 0); }
    class tr {
        constructor(e) { e && this.set(e); }
        set(e, t, n) { const r = this; function i(e, t, n) { const i = Zn(t); if (!i)
            throw new Error("header name must be a non-empty string"); const a = Gn.findKey(r, i); (!a || void 0 === r[a] || !0 === n || void 0 === n && !1 !== r[a]) && (r[a || t] = $n(e)); } const a = (e, t) => Gn.forEach(e, (e, n) => i(e, n, t)); if (Gn.isPlainObject(e) || e instanceof this.constructor)
            a(e, t);
        else if (Gn.isString(e) && (e = e.trim()) && !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim()))
            a(Xn(e), t);
        else if (Gn.isObject(e) && Gn.isIterable(e)) {
            let n, r, i = {};
            for (const t of e) {
                if (!Gn.isArray(t))
                    throw TypeError("Object iterator must return a key-value pair");
                i[r = t[0]] = (n = i[r]) ? Gn.isArray(n) ? [...n, t[1]] : [n, t[1]] : t[1];
            }
            a(i, t);
        }
        else
            null != e && i(t, e, n); return this; }
        get(e, t) { if (e = Zn(e)) {
            const n = Gn.findKey(this, e);
            if (n) {
                const e = this[n];
                if (!t)
                    return e;
                if (!0 === t)
                    return function (e) { const t = Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g; let r; for (; r = n.exec(e);)
                        t[r[1]] = r[2]; return t; }(e);
                if (Gn.isFunction(t))
                    return t.call(this, e, n);
                if (Gn.isRegExp(t))
                    return t.exec(e);
                throw new TypeError("parser must be boolean|regexp|function");
            }
        } }
        has(e, t) { if (e = Zn(e)) {
            const n = Gn.findKey(this, e);
            return !(!n || void 0 === this[n] || t && !er(0, this[n], n, t));
        } return !1; }
        delete(e, t) { const n = this; let r = !1; function i(e) { if (e = Zn(e)) {
            const i = Gn.findKey(n, e);
            !i || t && !er(0, n[i], i, t) || (delete n[i], r = !0);
        } } return Gn.isArray(e) ? e.forEach(i) : i(e), r; }
        clear(e) { const t = Object.keys(this); let n = t.length, r = !1; for (; n--;) {
            const i = t[n];
            e && !er(0, this[i], i, e, !0) || (delete this[i], r = !0);
        } return r; }
        normalize(e) { const t = this, n = {}; return Gn.forEach(this, (r, i) => { const a = Gn.findKey(n, i); if (a)
            return t[a] = $n(r), void delete t[i]; const o = e ? function (e) { return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n); }(i) : String(i).trim(); o !== i && delete t[i], t[o] = $n(r), n[o] = !0; }), this; }
        concat() { for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n]; return this.constructor.concat(this, ...t); }
        toJSON(e) { const t = Object.create(null); return Gn.forEach(this, (n, r) => { null != n && !1 !== n && (t[r] = e && Gn.isArray(n) ? n.join(", ") : n); }), t; }
        [Symbol.iterator]() { return Object.entries(this.toJSON())[Symbol.iterator](); }
        toString() { return Object.entries(this.toJSON()).map(e => { let t = u(e, 2); return t[0] + ": " + t[1]; }).join("\n"); }
        getSetCookie() { return this.get("set-cookie") || []; }
        get [Symbol.toStringTag]() { return "AxiosHeaders"; }
        static from(e) { return e instanceof this ? e : new this(e); }
        static concat(e) { const t = new this(e); for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
            r[i - 1] = arguments[i]; return r.forEach(e => t.set(e)), t; }
        static accessor(e) { const t = (this[Jn] = this[Jn] = { accessors: {} }).accessors, n = this.prototype; function r(e) { const r = Zn(e); t[r] || (!function (e, t) { const n = Gn.toCamelCase(" " + t); ["get", "set", "has"].forEach(r => { Object.defineProperty(e, r + n, { __proto__: null, value: function (e, n, i) { return this[r].call(this, t, e, n, i); }, configurable: !0 }); }); }(n, e), t[r] = !0); } return Gn.isArray(e) ? e.forEach(r) : r(e), this; }
    }
    tr.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]), Gn.reduceDescriptors(tr.prototype, (e, t) => { let n = e.value, r = t[0].toUpperCase() + t.slice(1); return { get: () => n, set(e) { this[r] = e; } }; }), Gn.freezeMethods(tr);
    const nr = tr;
    function rr(e, t) { const n = new Set(t.map(e => String(e).toLowerCase())), r = [], i = e => { if (null === e || "object" !== typeof e)
        return e; if (Gn.isBuffer(e))
        return e; if (-1 !== r.indexOf(e))
        return; let t; if (e instanceof nr && (e = e.toJSON()), r.push(e), Gn.isArray(e))
        t = [], e.forEach((e, n) => { const r = i(e); Gn.isUndefined(r) || (t[n] = r); });
    else {
        if (!Gn.isPlainObject(e) && function (e) { if (Gn.hasOwnProp(e, "toJSON"))
            return !0; let t = Object.getPrototypeOf(e); for (; t && t !== Object.prototype;) {
            if (Gn.hasOwnProp(t, "toJSON"))
                return !0;
            t = Object.getPrototypeOf(t);
        } return !1; }(e))
            return r.pop(), e;
        t = Object.create(null);
        for (const r of Object.entries(e)) {
            var a = u(r, 2);
            const e = a[0], o = a[1], s = n.has(e.toLowerCase()) ? "[REDACTED ****]" : i(o);
            Gn.isUndefined(s) || (t[e] = s);
        }
    } return r.pop(), t; }; return i(e); }
    class ir extends Error {
        static from(e, t, n, r, i, a) { const o = new ir(e.message, t || e.code, n, r, i); return o.cause = e, o.name = e.name, null != e.status && null == o.status && (o.status = e.status), a && Object.assign(o, a), o; }
        constructor(e, t, n, r, i) { super(e), Object.defineProperty(this, "message", { __proto__: null, value: e, enumerable: !0, writable: !0, configurable: !0 }), this.name = "AxiosError", this.isAxiosError = !0, t && (this.code = t), n && (this.config = n), r && (this.request = r), i && (this.response = i, this.status = i.status); }
        toJSON() { const e = this.config, t = e && Gn.hasOwnProp(e, "redact") ? e.redact : void 0, n = Gn.isArray(t) && t.length > 0 ? rr(e, t) : Gn.toJSONObject(e); return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: n, code: this.code, status: this.status }; }
    }
    ir.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE", ir.ERR_BAD_OPTION = "ERR_BAD_OPTION", ir.ECONNABORTED = "ECONNABORTED", ir.ETIMEDOUT = "ETIMEDOUT", ir.ECONNREFUSED = "ECONNREFUSED", ir.ERR_NETWORK = "ERR_NETWORK", ir.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS", ir.ERR_DEPRECATED = "ERR_DEPRECATED", ir.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE", ir.ERR_BAD_REQUEST = "ERR_BAD_REQUEST", ir.ERR_CANCELED = "ERR_CANCELED", ir.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT", ir.ERR_INVALID_URL = "ERR_INVALID_URL", ir.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
    const ar = ir;
    function or(e) { return Gn.isPlainObject(e) || Gn.isArray(e); }
    function sr(e) { return Gn.endsWith(e, "[]") ? e.slice(0, -2) : e; }
    function lr(e, t, n) { return e ? e.concat(t).map(function (e, t) { return e = sr(e), !n && t ? "[" + e + "]" : e; }).join(n ? "." : "") : t; }
    const cr = Gn.toFlatObject(Gn, {}, null, function (e) { return /^is[A-Z]/.test(e); });
    const dr = function (e, t, n) { if (!Gn.isObject(e))
        throw new TypeError("target must be an object"); t = t || new FormData; const r = (n = Gn.toFlatObject(n, { metaTokens: !0, dots: !1, indexes: !1 }, !1, function (e, t) { return !Gn.isUndefined(t[e]); })).metaTokens, i = n.visitor || u, a = n.dots, o = n.indexes, s = n.Blob || "undefined" !== typeof Blob && Blob, l = void 0 === n.maxDepth ? 100 : n.maxDepth, c = s && Gn.isSpecCompliantForm(t); if (!Gn.isFunction(i))
        throw new TypeError("visitor must be a function"); function d(e) { if (null === e)
        return ""; if (Gn.isDate(e))
        return e.toISOString(); if (Gn.isBoolean(e))
        return e.toString(); if (!c && Gn.isBlob(e))
        throw new ar("Blob is not supported. Use a Buffer instead."); return Gn.isArrayBuffer(e) || Gn.isTypedArray(e) ? c && "function" === typeof Blob ? new Blob([e]) : Buffer.from(e) : e; } function u(e, n, i) { let s = e; if (Gn.isReactNative(t) && Gn.isReactNativeBlob(e))
        return t.append(lr(i, n, a), d(e)), !1; if (e && !i && "object" === typeof e)
        if (Gn.endsWith(n, "{}"))
            n = r ? n : n.slice(0, -2), e = JSON.stringify(e);
        else if (Gn.isArray(e) && function (e) { return Gn.isArray(e) && !e.some(or); }(e) || (Gn.isFileList(e) || Gn.endsWith(n, "[]")) && (s = Gn.toArray(e)))
            return n = sr(n), s.forEach(function (e, r) { !Gn.isUndefined(e) && null !== e && t.append(!0 === o ? lr([n], r, a) : null === o ? n : n + "[]", d(e)); }), !1; return !!or(e) || (t.append(lr(i, n, a), d(e)), !1); } const p = [], h = Object.assign(cr, { defaultVisitor: u, convertValue: d, isVisitable: or }); if (!Gn.isObject(e))
        throw new TypeError("data must be an object"); return function e(n, r) { let a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0; if (!Gn.isUndefined(n)) {
        if (a > l)
            throw new ar("Object is too deeply nested (" + a + " levels). Max depth: " + l, ar.ERR_FORM_DATA_DEPTH_EXCEEDED);
        if (-1 !== p.indexOf(n))
            throw Error("Circular reference detected in " + r.join("."));
        p.push(n), Gn.forEach(n, function (n, o) { !0 === (!(Gn.isUndefined(n) || null === n) && i.call(t, n, Gn.isString(o) ? o.trim() : o, r, h)) && e(n, r ? r.concat(o) : [o], a + 1); }), p.pop();
    } }(e), t; };
    function ur(e) { const t = { "!": "%21", "'": "%27", "(": "%28", ")": "%29", "~": "%7E", "%20": "+" }; return encodeURIComponent(e).replace(/[!'()~]|%20/g, function (e) { return t[e]; }); }
    function pr(e, t) { this._pairs = [], e && dr(e, this, t); }
    const hr = pr.prototype;
    hr.append = function (e, t) { this._pairs.push([e, t]); }, hr.toString = function (e) { const t = e ? function (t) { return e.call(this, t, ur); } : ur; return this._pairs.map(function (e) { return t(e[0]) + "=" + t(e[1]); }, "").join("&"); };
    const fr = pr;
    function gr(e) { return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+"); }
    function mr(e, t, n) { if (!t)
        return e; const r = n && n.encode || gr, i = Gn.isFunction(n) ? { serialize: n } : n, a = i && i.serialize; let o; if (o = a ? a(t, i) : Gn.isURLSearchParams(t) ? t.toString() : new fr(t, i).toString(r), o) {
        const t = e.indexOf("#");
        -1 !== t && (e = e.slice(0, t)), e += (-1 === e.indexOf("?") ? "?" : "&") + o;
    } return e; }
    const xr = class {
        constructor() { this.handlers = []; }
        use(e, t, n) { return this.handlers.push({ fulfilled: e, rejected: t, synchronous: !!n && n.synchronous, runWhen: n ? n.runWhen : null }), this.handlers.length - 1; }
        eject(e) { this.handlers[e] && (this.handlers[e] = null); }
        clear() { this.handlers && (this.handlers = []); }
        forEach(e) { Gn.forEach(this.handlers, function (t) { null !== t && e(t); }); }
    }, br = { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1, legacyInterceptorReqResOrdering: !0 }, yr = { isBrowser: !0, classes: { URLSearchParams: "undefined" !== typeof URLSearchParams ? URLSearchParams : fr, FormData: "undefined" !== typeof FormData ? FormData : null, Blob: "undefined" !== typeof Blob ? Blob : null }, protocols: ["http", "https", "file", "blob", "url", "data"] }, vr = "undefined" !== typeof window && "undefined" !== typeof document, wr = "object" === typeof navigator && navigator || void 0, jr = vr && (!wr || ["ReactNative", "NativeScript", "NS"].indexOf(wr.product) < 0), kr = "undefined" !== typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && "function" === typeof self.importScripts, Sr = vr && window.location.href || "http://localhost", Nr = m(m({}, e), yr);
    const Cr = function (e) { function t(e, n, r, i) { let a = e[i++]; if ("__proto__" === a)
        return !0; const o = Number.isFinite(+a), s = i >= e.length; if (a = !a && Gn.isArray(r) ? r.length : a, s)
        return Gn.hasOwnProp(r, a) ? r[a] = Gn.isArray(r[a]) ? r[a].concat(n) : [r[a], n] : r[a] = n, !o; r[a] && Gn.isObject(r[a]) || (r[a] = []); return t(e, n, r[a], i) && Gn.isArray(r[a]) && (r[a] = function (e) { const t = {}, n = Object.keys(e); let r; const i = n.length; let a; for (r = 0; r < i; r++)
        a = n[r], t[a] = e[a]; return t; }(r[a])), !o; } if (Gn.isFormData(e) && Gn.isFunction(e.entries)) {
        const n = {};
        return Gn.forEachEntry(e, (e, r) => { t(function (e) { return Gn.matchAll(/\w+|\[(\w*)]/g, e).map(e => "[]" === e[0] ? "" : e[1] || e[0]); }(e), r, n, 0); }), n;
    } return null; }, Tr = (e, t) => null != e && Gn.hasOwnProp(e, t) ? e[t] : void 0;
    const Ar = { transitional: br, adapter: ["xhr", "http", "fetch"], transformRequest: [function (e, t) { const n = t.getContentType() || "", r = n.indexOf("application/json") > -1, i = Gn.isObject(e); i && Gn.isHTMLForm(e) && (e = new FormData(e)); if (Gn.isFormData(e))
                return r ? JSON.stringify(Cr(e)) : e; if (Gn.isArrayBuffer(e) || Gn.isBuffer(e) || Gn.isStream(e) || Gn.isFile(e) || Gn.isBlob(e) || Gn.isReadableStream(e))
                return e; if (Gn.isArrayBufferView(e))
                return e.buffer; if (Gn.isURLSearchParams(e))
                return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString(); let a; if (i) {
                const t = Tr(this, "formSerializer");
                if (n.indexOf("application/x-www-form-urlencoded") > -1)
                    return function (e, t) { return dr(e, new Nr.classes.URLSearchParams, m({ visitor: function (e, t, n, r) { return Nr.isNode && Gn.isBuffer(e) ? (this.append(t, e.toString("base64")), !1) : r.defaultVisitor.apply(this, arguments); } }, t)); }(e, t).toString();
                if ((a = Gn.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
                    const n = Tr(this, "env"), r = n && n.FormData;
                    return dr(a ? { "files[]": e } : e, r && new r, t);
                }
            } return i || r ? (t.setContentType("application/json", !1), function (e, t, n) { if (Gn.isString(e))
                try {
                    return (t || JSON.parse)(e), Gn.trim(e);
                }
                catch (El) {
                    if ("SyntaxError" !== El.name)
                        throw El;
                } return (n || JSON.stringify)(e); }(e)) : e; }], transformResponse: [function (e) { const t = Tr(this, "transitional") || Ar.transitional, n = t && t.forcedJSONParsing, r = Tr(this, "responseType"), i = "json" === r; if (Gn.isResponse(e) || Gn.isReadableStream(e))
                return e; if (e && Gn.isString(e) && (n && !r || i)) {
                const n = !(t && t.silentJSONParsing) && i;
                try {
                    return JSON.parse(e, Tr(this, "parseReviver"));
                }
                catch (El) {
                    if (n) {
                        if ("SyntaxError" === El.name)
                            throw ar.from(El, ar.ERR_BAD_RESPONSE, this, null, Tr(this, "response"));
                        throw El;
                    }
                }
            } return e; }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, env: { FormData: Nr.classes.FormData, Blob: Nr.classes.Blob }, validateStatus: function (e) { return e >= 200 && e < 300; }, headers: { common: { Accept: "application/json, text/plain, */*", "Content-Type": void 0 } } };
    Gn.forEach(["delete", "get", "head", "post", "put", "patch", "query"], e => { Ar.headers[e] = {}; });
    const Er = Ar;
    function Rr(e, t) { const n = this || Er, r = t || n, i = nr.from(r.headers); let a = r.data; return Gn.forEach(e, function (e) { a = e.call(n, a, i.normalize(), t ? t.status : void 0); }), i.normalize(), a; }
    function Pr(e) { return !(!e || !e.__CANCEL__); }
    const Lr = class extends ar {
        constructor(e, t, n) { super(null == e ? "canceled" : e, ar.ERR_CANCELED, t, n), this.name = "CanceledError", this.__CANCEL__ = !0; }
    };
    function Or(e, t, n) { const r = n.config.validateStatus; n.status && r && !r(n.status) ? t(new ar("Request failed with status code " + n.status, n.status >= 400 && n.status < 500 ? ar.ERR_BAD_REQUEST : ar.ERR_BAD_RESPONSE, n.config, n.request, n)) : e(n); }
    const zr = function (e, t) { e = e || 10; const n = new Array(e), r = new Array(e); let i, a = 0, o = 0; return t = void 0 !== t ? t : 1e3, function (s) { const l = Date.now(), c = r[o]; i || (i = l), n[a] = s, r[a] = l; let d = o, u = 0; for (; d !== a;)
        u += n[d++], d %= e; if (a = (a + 1) % e, a === o && (o = (o + 1) % e), l - i < t)
        return; const p = c && l - c; return p ? Math.round(1e3 * u / p) : void 0; }; };
    const Br = function (e, t) { let n, r, i = 0, a = 1e3 / t; const o = function (t) { let a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Date.now(); i = a, n = null, r && (clearTimeout(r), r = null), e(...t); }; return [function () { const e = Date.now(), t = e - i; for (var s = arguments.length, l = new Array(s), c = 0; c < s; c++)
            l[c] = arguments[c]; t >= a ? o(l, e) : (n = l, r || (r = setTimeout(() => { r = null, o(n); }, a - t))); }, () => n && o(n)]; }, Dr = function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3, r = 0; const i = zr(50, 250); return Br(n => { const a = n.loaded, o = n.lengthComputable ? n.total : void 0, s = null != o ? Math.min(a, o) : a, l = Math.max(0, s - r), c = i(l); r = Math.max(r, s); e({ loaded: s, total: o, progress: o ? s / o : void 0, bytes: l, rate: c || void 0, estimated: c && o ? (o - s) / c : void 0, event: n, lengthComputable: null != o, [t ? "download" : "upload"]: !0 }); }, n); }, Fr = (e, t) => { const n = null != e; return [r => t[0]({ lengthComputable: n, total: e, loaded: r }), t[1]]; }, Mr = e => function () { for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
        n[r] = arguments[r]; return Gn.asap(() => e(...n)); }, Ir = Nr.hasStandardBrowserEnv ? ((e, t) => n => (n = new URL(n, Nr.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(new URL(Nr.origin), Nr.navigator && /(msie|trident)/i.test(Nr.navigator.userAgent)) : () => !0, Ur = Nr.hasStandardBrowserEnv ? { write(e, t, n, r, i, a, o) { if ("undefined" === typeof document)
            return; const s = ["".concat(e, "=").concat(encodeURIComponent(t))]; Gn.isNumber(n) && s.push("expires=".concat(new Date(n).toUTCString())), Gn.isString(r) && s.push("path=".concat(r)), Gn.isString(i) && s.push("domain=".concat(i)), !0 === a && s.push("secure"), Gn.isString(o) && s.push("SameSite=".concat(o)), document.cookie = s.join("; "); }, read(e) { if ("undefined" === typeof document)
            return null; const t = document.cookie.split(";"); for (let n = 0; n < t.length; n++) {
            const r = t[n].replace(/^\s+/, ""), i = r.indexOf("=");
            if (-1 !== i && r.slice(0, i) === e)
                return decodeURIComponent(r.slice(i + 1));
        } return null; }, remove(e) { this.write(e, "", Date.now() - 864e5, "/"); } } : { write() { }, read: () => null, remove() { } };
    function _r(e, t, n) { let r = !function (e) { return "string" === typeof e && /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e); }(t); return e && (r || !1 === n) ? function (e, t) { return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e; }(e, t) : t; }
    const Wr = e => e instanceof nr ? m({}, e) : e;
    function Hr(e, t) { t = t || {}; const n = Object.create(null); function r(e, t, n, r) { return Gn.isPlainObject(e) && Gn.isPlainObject(t) ? Gn.merge.call({ caseless: r }, e, t) : Gn.isPlainObject(t) ? Gn.merge({}, t) : Gn.isArray(t) ? t.slice() : t; } function i(e, t, n, i) { return Gn.isUndefined(t) ? Gn.isUndefined(e) ? void 0 : r(void 0, e, 0, i) : r(e, t, 0, i); } function a(e, t) { if (!Gn.isUndefined(t))
        return r(void 0, t); } function o(e, t) { return Gn.isUndefined(t) ? Gn.isUndefined(e) ? void 0 : r(void 0, e) : r(void 0, t); } function s(n, i, a) { return Gn.hasOwnProp(t, a) ? r(n, i) : Gn.hasOwnProp(e, a) ? r(void 0, n) : void 0; } Object.defineProperty(n, "hasOwnProperty", { __proto__: null, value: Object.prototype.hasOwnProperty, enumerable: !1, writable: !0, configurable: !0 }); const l = { url: a, method: a, data: a, baseURL: o, transformRequest: o, transformResponse: o, paramsSerializer: o, timeout: o, timeoutMessage: o, withCredentials: o, withXSRFToken: o, adapter: o, responseType: o, xsrfCookieName: o, xsrfHeaderName: o, onUploadProgress: o, onDownloadProgress: o, decompress: o, maxContentLength: o, maxBodyLength: o, beforeRedirect: o, transport: o, httpAgent: o, httpsAgent: o, cancelToken: o, socketPath: o, allowedSocketPaths: o, responseEncoding: o, validateStatus: s, headers: (e, t, n) => i(Wr(e), Wr(t), 0, !0) }; return Gn.forEach(Object.keys(m(m({}, e), t)), function (r) { if ("__proto__" === r || "constructor" === r || "prototype" === r)
        return; const a = Gn.hasOwnProp(l, r) ? l[r] : i, o = a(Gn.hasOwnProp(e, r) ? e[r] : void 0, Gn.hasOwnProp(t, r) ? t[r] : void 0, r); Gn.isUndefined(o) && a !== s || (n[r] = o); }), n; }
    const Vr = ["content-type", "content-length"];
    const qr = e => { const t = Hr({}, e), n = e => Gn.hasOwnProp(t, e) ? t[e] : void 0, r = n("data"); let i = n("withXSRFToken"); const a = n("xsrfHeaderName"), o = n("xsrfCookieName"); let s = n("headers"); const l = n("auth"), c = n("baseURL"), d = n("allowAbsoluteUrls"), p = n("url"); var h; if (t.headers = s = nr.from(s), t.url = mr(_r(c, p, d), e.params, e.paramsSerializer), l && s.set("Authorization", "Basic " + btoa((l.username || "") + ":" + (l.password ? (h = l.password, encodeURIComponent(h).replace(/%([0-9A-F]{2})/gi, (e, t) => String.fromCharCode(parseInt(t, 16)))) : ""))), Gn.isFormData(r) && (Nr.hasStandardBrowserEnv || Nr.hasStandardBrowserWebWorkerEnv ? s.setContentType(void 0) : Gn.isFunction(r.getHeaders) && function (e, t, n) { "content-only" === n ? Object.entries(t).forEach(t => { let n = u(t, 2), r = n[0], i = n[1]; Vr.includes(r.toLowerCase()) && e.set(r, i); }) : e.set(t); }(s, r.getHeaders(), n("formDataHeaderPolicy"))), Nr.hasStandardBrowserEnv) {
        Gn.isFunction(i) && (i = i(t));
        if (!0 === i || null == i && Ir(t.url)) {
            const e = a && o && Ur.read(o);
            e && s.set(a, e);
        }
    } return t; };
    (Object.getOwnPropertyDescriptor(qr, "name") || {}).writable || Object.defineProperty(qr, "name", { value: "default", configurable: !0 });
    const Kr = "undefined" !== typeof XMLHttpRequest && function (e) { return new Promise(function (t, n) { const r = qr(e); let i = r.data; const a = nr.from(r.headers).normalize(); let o, s, l, c, d, p = r.responseType, h = r.onUploadProgress, f = r.onDownloadProgress; function g() { c && c(), d && d(), r.cancelToken && r.cancelToken.unsubscribe(o), r.signal && r.signal.removeEventListener("abort", o); } let m = new XMLHttpRequest; function x() { if (!m)
        return; const r = nr.from("getAllResponseHeaders" in m && m.getAllResponseHeaders()); Or(function (e) { t(e), g(); }, function (e) { n(e), g(); }, { data: p && "text" !== p && "json" !== p ? m.response : m.responseText, status: m.status, statusText: m.statusText, headers: r, config: e, request: m }), m = null; } if (m.open(r.method.toUpperCase(), r.url, !0), m.timeout = r.timeout, "onloadend" in m ? m.onloadend = x : m.onreadystatechange = function () { m && 4 === m.readyState && (0 !== m.status || m.responseURL && m.responseURL.startsWith("file:")) && setTimeout(x); }, m.onabort = function () { m && (n(new ar("Request aborted", ar.ECONNABORTED, e, m)), g(), m = null); }, m.onerror = function (t) { const r = t && t.message ? t.message : "Network Error", i = new ar(r, ar.ERR_NETWORK, e, m); i.event = t || null, n(i), g(), m = null; }, m.ontimeout = function () { let t = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded"; const i = r.transitional || br; r.timeoutErrorMessage && (t = r.timeoutErrorMessage), n(new ar(t, i.clarifyTimeoutError ? ar.ETIMEDOUT : ar.ECONNABORTED, e, m)), g(), m = null; }, void 0 === i && a.setContentType(null), "setRequestHeader" in m && Gn.forEach(a.toJSON(), function (e, t) { m.setRequestHeader(t, e); }), Gn.isUndefined(r.withCredentials) || (m.withCredentials = !!r.withCredentials), p && "json" !== p && (m.responseType = r.responseType), f) {
        var b = u(Dr(f, !0), 2);
        l = b[0], d = b[1], m.addEventListener("progress", l);
    } if (h && m.upload) {
        var y = u(Dr(h), 2);
        s = y[0], c = y[1], m.upload.addEventListener("progress", s), m.upload.addEventListener("loadend", c);
    } (r.cancelToken || r.signal) && (o = t => { m && (n(!t || t.type ? new Lr(null, e, m) : t), m.abort(), g(), m = null); }, r.cancelToken && r.cancelToken.subscribe(o), r.signal && (r.signal.aborted ? o() : r.signal.addEventListener("abort", o))); const v = function (e) { const t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e); return t && t[1] || ""; }(r.url); !v || Nr.protocols.includes(v) ? m.send(i || null) : n(new ar("Unsupported protocol " + v + ":", ar.ERR_BAD_REQUEST, e)); }); }, Gr = (e, t) => { const n = (e = e ? e.filter(Boolean) : []).length; if (t || n) {
        let n, r = new AbortController;
        const i = function (e) { if (!n) {
            n = !0, o();
            const t = e instanceof Error ? e : this.reason;
            r.abort(t instanceof ar ? t : new Lr(t instanceof Error ? t.message : t));
        } };
        let a = t && setTimeout(() => { a = null, i(new ar("timeout of ".concat(t, "ms exceeded"), ar.ETIMEDOUT)); }, t);
        const o = () => { e && (a && clearTimeout(a), a = null, e.forEach(e => { e.unsubscribe ? e.unsubscribe(i) : e.removeEventListener("abort", i); }), e = null); };
        e.forEach(e => e.addEventListener("abort", i));
        const s = r.signal;
        return s.unsubscribe = () => Gn.asap(o), s;
    } };
    function Yr(e, t) { this.v = e, this.k = t; }
    function Xr(e) { return function () { return new Jr(e.apply(this, arguments)); }; }
    function Jr(e) { var t, n; function r(t, n) { try {
        var a = e[t](n), o = a.value, s = o instanceof Yr;
        Promise.resolve(s ? o.v : o).then(function (n) { if (s) {
            var l = "return" === t && o.k ? t : "next";
            if (!o.k || n.done)
                return r(l, n);
            n = e[l](n).value;
        } i(!!a.done, n); }, function (e) { r("throw", e); });
    }
    catch (e) {
        i(2, e);
    } } function i(e, i) { 2 === e ? t.reject(i) : t.resolve({ value: i, done: e }), (t = t.next) ? r(t.key, t.arg) : n = null; } this._invoke = function (e, i) { return new Promise(function (a, o) { var s = { key: e, arg: i, resolve: a, reject: o, next: null }; n ? n = n.next = s : (t = n = s, r(e, i)); }); }, "function" != typeof e.return && (this.return = void 0); }
    function Qr(e) { return new Yr(e, 0); }
    function Zr(e) { var t = {}, n = !1; function r(t, r) { return n = !0, r = new Promise(function (n) { n(e[t](r)); }), { done: !1, value: new Yr(r, 1) }; } return t["undefined" != typeof Symbol && Symbol.iterator || "@@iterator"] = function () { return this; }, t.next = function (e) { return n ? (n = !1, e) : r("next", e); }, "function" == typeof e.throw && (t.throw = function (e) { if (n)
        throw n = !1, e; return r("throw", e); }), "function" == typeof e.return && (t.return = function (e) { return n ? (n = !1, e) : r("return", e); }), t; }
    function $r(e) { var t, n, r, i = 2; for ("undefined" != typeof Symbol && (n = Symbol.asyncIterator, r = Symbol.iterator); i--;) {
        if (n && null != (t = e[n]))
            return t.call(e);
        if (r && null != (t = e[r]))
            return new ei(t.call(e));
        n = "@@asyncIterator", r = "@@iterator";
    } throw new TypeError("Object is not async iterable"); }
    function ei(e) { function t(e) { if (Object(e) !== e)
        return Promise.reject(new TypeError(e + " is not an object.")); var t = e.done; return Promise.resolve(e.value).then(function (e) { return { value: e, done: t }; }); } return ei = function (e) { this.s = e, this.n = e.next; }, ei.prototype = { s: null, n: null, next: function () { return t(this.n.apply(this.s, arguments)); }, return: function (e) { var n = this.s.return; return void 0 === n ? Promise.resolve({ value: e, done: !0 }) : t(n.apply(this.s, arguments)); }, throw: function (e) { var n = this.s.return; return void 0 === n ? Promise.reject(e) : t(n.apply(this.s, arguments)); } }, new ei(e); }
    Jr.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; }, Jr.prototype.next = function (e) { return this._invoke("next", e); }, Jr.prototype.throw = function (e) { return this._invoke("throw", e); }, Jr.prototype.return = function (e) { return this._invoke("return", e); };
    const ti = function* (e, t) { let n = e.byteLength; if (!t || n < t)
        return void (yield e); let r, i = 0; for (; i < n;)
        r = i + t, yield e.slice(i, r), i = r; }, ni = function () { var e = Xr(function* (e, t) { var n, r = !1, i = !1; try {
        for (var a, o = $r(ri(e)); r = !(a = yield Qr(o.next())).done; r = !1) {
            const e = a.value;
            yield* Zr($r(ti(e, t)));
        }
    }
    catch (s) {
        i = !0, n = s;
    }
    finally {
        try {
            r && null != o.return && (yield Qr(o.return()));
        }
        finally {
            if (i)
                throw n;
        }
    } }); return function (t, n) { return e.apply(this, arguments); }; }(), ri = function () { var e = Xr(function* (e) { if (e[Symbol.asyncIterator])
        return void (yield* Zr($r(e))); const t = e.getReader(); try {
        for (;;) {
            const e = yield Qr(t.read()), n = e.done, r = e.value;
            if (n)
                break;
            yield r;
        }
    }
    finally {
        yield Qr(t.cancel());
    } }); return function (t) { return e.apply(this, arguments); }; }(), ii = (e, t, n, r) => { const i = ni(e, t); let a, o = 0, s = e => { a || (a = !0, r && r(e)); }; return new ReadableStream({ async pull(e) { try {
            const t = await i.next(), r = t.done, a = t.value;
            if (r)
                return s(), void e.close();
            let l = a.byteLength;
            if (n) {
                let e = o += l;
                n(e);
            }
            e.enqueue(new Uint8Array(a));
        }
        catch (t) {
            throw s(t), t;
        } }, cancel: e => (s(e), i.return()) }, { highWaterMark: 2 }); };
    const ai = "1.16.0", oi = Gn.isFunction, si = function (e) { try {
        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
            n[r - 1] = arguments[r];
        return !!e(...n);
    }
    catch (El) {
        return !1;
    } }, li = e => { var t; const n = null !== (t = Gn.global) && void 0 !== t ? t : globalThis, r = n.ReadableStream, i = n.TextEncoder, a = e = Gn.merge.call({ skipUndefined: !0 }, { Request: n.Request, Response: n.Response }, e), o = a.fetch, s = a.Request, l = a.Response, c = o ? oi(o) : "function" === typeof fetch, d = oi(s), p = oi(l); if (!c)
        return !1; const h = c && oi(r), f = c && ("function" === typeof i ? (g = new i, e => g.encode(e)) : async (e) => new Uint8Array(await new s(e).arrayBuffer())); var g; const x = d && h && si(() => { let e = !1; const t = new s(Nr.origin, { body: new r, method: "POST", get duplex() { return e = !0, "half"; } }), n = t.headers.has("Content-Type"); return null != t.body && t.body.cancel(), e && !n; }), b = p && h && si(() => Gn.isReadableStream(new l("").body)), y = { stream: b && (e => e.body) }; c && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach(e => { !y[e] && (y[e] = (t, n) => { let r = t && t[e]; if (r)
        return r.call(t); throw new ar("Response type '".concat(e, "' is not supported"), ar.ERR_NOT_SUPPORT, n); }); }); const v = async (e, t) => { const n = Gn.toFiniteNumber(e.getContentLength()); return null == n ? (async (e) => { if (null == e)
        return 0; if (Gn.isBlob(e))
        return e.size; if (Gn.isSpecCompliantForm(e)) {
        const t = new s(Nr.origin, { method: "POST", body: e });
        return (await t.arrayBuffer()).byteLength;
    } return Gn.isArrayBufferView(e) || Gn.isArrayBuffer(e) ? e.byteLength : (Gn.isURLSearchParams(e) && (e += ""), Gn.isString(e) ? (await f(e)).byteLength : void 0); })(t) : n; }; return async (e) => { let t = qr(e), n = t.url, r = t.method, a = t.data, c = t.signal, p = t.cancelToken, h = t.timeout, f = t.onDownloadProgress, g = t.onUploadProgress, w = t.responseType, j = t.headers, k = t.withCredentials, S = void 0 === k ? "same-origin" : k, N = t.fetchOptions, C = t.maxContentLength, T = t.maxBodyLength; const A = Gn.isNumber(C) && C > -1, E = Gn.isNumber(T) && T > -1; let R = o || fetch; w = w ? (w + "").toLowerCase() : "text"; let P = Gr([c, p && p.toAbortSignal()], h), L = null; const O = P && P.unsubscribe && (() => { P.unsubscribe(); }); let z; try {
        if (A && "string" === typeof n && n.startsWith("data:")) {
            const t = function (e) { if (!e || "string" !== typeof e)
                return 0; if (!e.startsWith("data:"))
                return 0; const t = e.indexOf(","); if (t < 0)
                return 0; const n = e.slice(5, t), r = e.slice(t + 1); if (/;base64/i.test(n)) {
                let e = r.length;
                const t = r.length;
                for (let s = 0; s < t; s++)
                    if (37 === r.charCodeAt(s) && s + 2 < t) {
                        const t = r.charCodeAt(s + 1), n = r.charCodeAt(s + 2);
                        (t >= 48 && t <= 57 || t >= 65 && t <= 70 || t >= 97 && t <= 102) && (n >= 48 && n <= 57 || n >= 65 && n <= 70 || n >= 97 && n <= 102) && (e -= 2, s += 2);
                    }
                let n = 0, i = t - 1;
                const a = e => e >= 2 && 37 === r.charCodeAt(e - 2) && 51 === r.charCodeAt(e - 1) && (68 === r.charCodeAt(e) || 100 === r.charCodeAt(e));
                i >= 0 && (61 === r.charCodeAt(i) ? (n++, i--) : a(i) && (n++, i -= 3)), 1 === n && i >= 0 && (61 === r.charCodeAt(i) || a(i)) && n++;
                const o = 3 * Math.floor(e / 4) - (n || 0);
                return o > 0 ? o : 0;
            } if ("undefined" !== typeof Buffer && "function" === typeof Buffer.byteLength)
                return Buffer.byteLength(r, "utf8"); let i = 0; for (let a = 0, o = r.length; a < o; a++) {
                const e = r.charCodeAt(a);
                if (e < 128)
                    i += 1;
                else if (e < 2048)
                    i += 2;
                else if (e >= 55296 && e <= 56319 && a + 1 < o) {
                    const e = r.charCodeAt(a + 1);
                    e >= 56320 && e <= 57343 ? (i += 4, a++) : i += 3;
                }
                else
                    i += 3;
            } return i; }(n);
            if (t > C)
                throw new ar("maxContentLength size of " + C + " exceeded", ar.ERR_BAD_RESPONSE, e, L);
        }
        if (E && "get" !== r && "head" !== r) {
            const t = await v(j, a);
            if ("number" === typeof t && isFinite(t) && t > T)
                throw new ar("Request body larger than maxBodyLength limit", ar.ERR_BAD_REQUEST, e, L);
        }
        if (g && x && "get" !== r && "head" !== r && 0 !== (z = await v(j, a))) {
            let e, t = new s(n, { method: "POST", body: a, duplex: "half" });
            if (Gn.isFormData(a) && (e = t.headers.get("content-type")) && j.setContentType(e), t.body) {
                const e = u(Fr(z, Dr(Mr(g))), 2), n = e[0], r = e[1];
                a = ii(t.body, 65536, n, r);
            }
        }
        Gn.isString(S) || (S = S ? "include" : "omit");
        const t = d && "credentials" in s.prototype;
        if (Gn.isFormData(a)) {
            const e = j.getContentType();
            e && /^multipart\/form-data/i.test(e) && !/boundary=/i.test(e) && j.delete("content-type");
        }
        j.set("User-Agent", "axios/" + ai, !1);
        const o = m(m({}, N), {}, { signal: P, method: r.toUpperCase(), headers: j.normalize().toJSON(), body: a, duplex: "half", credentials: t ? S : void 0 });
        L = d && new s(n, o);
        let c = await (d ? R(L, N) : R(n, o));
        if (A) {
            const t = Gn.toFiniteNumber(c.headers.get("content-length"));
            if (null != t && t > C)
                throw new ar("maxContentLength size of " + C + " exceeded", ar.ERR_BAD_RESPONSE, e, L);
        }
        const p = b && ("stream" === w || "response" === w);
        if (b && c.body && (f || A || p && O)) {
            const t = {};
            ["status", "statusText", "headers"].forEach(e => { t[e] = c[e]; });
            const n = Gn.toFiniteNumber(c.headers.get("content-length")), r = u(f && Fr(n, Dr(Mr(f), !0)) || [], 2), i = r[0], a = r[1];
            let o = 0;
            const s = t => { if (A && (o = t, o > C))
                throw new ar("maxContentLength size of " + C + " exceeded", ar.ERR_BAD_RESPONSE, e, L); i && i(t); };
            c = new l(ii(c.body, 65536, s, () => { a && a(), O && O(); }), t);
        }
        w = w || "text";
        let h = await y[Gn.findKey(y, w) || "text"](c, e);
        if (A && !b && !p) {
            let t;
            if (null != h && ("number" === typeof h.byteLength ? t = h.byteLength : "number" === typeof h.size ? t = h.size : "string" === typeof h && (t = "function" === typeof i ? (new i).encode(h).byteLength : h.length)), "number" === typeof t && t > C)
                throw new ar("maxContentLength size of " + C + " exceeded", ar.ERR_BAD_RESPONSE, e, L);
        }
        return !p && O && O(), await new Promise((t, n) => { Or(t, n, { data: h, headers: nr.from(c.headers), status: c.status, statusText: c.statusText, config: e, request: L }); });
    }
    catch (B) {
        if (O && O(), P && P.aborted && P.reason instanceof ar) {
            const t = P.reason;
            throw t.config = e, L && (t.request = L), B !== t && (t.cause = B), t;
        }
        if (B && "TypeError" === B.name && /Load failed|fetch/i.test(B.message))
            throw Object.assign(new ar("Network Error", ar.ERR_NETWORK, e, L, B && B.response), { cause: B.cause || B });
        throw ar.from(B, B && B.code, e, L, B && B.response);
    } }; }, ci = new Map, di = e => { let t = e && e.env || {}; const n = t.fetch, r = [t.Request, t.Response, n]; let i, a, o = r.length, s = ci; for (; o--;)
        i = r[o], a = s.get(i), void 0 === a && s.set(i, a = o ? new Map : li(t)), s = a; return a; }, ui = (di(), { http: null, xhr: Kr, fetch: { get: di } });
    Gn.forEach(ui, (e, t) => { if (e) {
        try {
            Object.defineProperty(e, "name", { __proto__: null, value: t });
        }
        catch (El) { }
        Object.defineProperty(e, "adapterName", { __proto__: null, value: t });
    } });
    const pi = e => "- ".concat(e), hi = e => Gn.isFunction(e) || null === e || !1 === e;
    const fi = { getAdapter: function (e, t) { const n = (e = Gn.isArray(e) ? e : [e]).length; let r, i; const a = {}; for (let o = 0; o < n; o++) {
            let n;
            if (r = e[o], i = r, !hi(r) && (i = ui[(n = String(r)).toLowerCase()], void 0 === i))
                throw new ar("Unknown adapter '".concat(n, "'"));
            if (i && (Gn.isFunction(i) || (i = i.get(t))))
                break;
            a[n || "#" + o] = i;
        } if (!i) {
            const e = Object.entries(a).map(e => { let t = u(e, 2), n = t[0], r = t[1]; return "adapter ".concat(n, " ") + (!1 === r ? "is not supported by the environment" : "is not available in the build"); });
            let t = n ? e.length > 1 ? "since :\n" + e.map(pi).join("\n") : " " + pi(e[0]) : "as no adapter specified";
            throw new ar("There is no suitable adapter to dispatch the request " + t, "ERR_NOT_SUPPORT");
        } return i; }, adapters: ui };
    function gi(e) { if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
        throw new Lr(null, e); }
    function mi(e) { gi(e), e.headers = nr.from(e.headers), e.data = Rr.call(e, e.transformRequest), -1 !== ["post", "put", "patch"].indexOf(e.method) && e.headers.setContentType("application/x-www-form-urlencoded", !1); return fi.getAdapter(e.adapter || Er.adapter, e)(e).then(function (t) { gi(e), e.response = t; try {
        t.data = Rr.call(e, e.transformResponse, t);
    }
    finally {
        delete e.response;
    } return t.headers = nr.from(t.headers), t; }, function (t) { if (!Pr(t) && (gi(e), t && t.response)) {
        e.response = t.response;
        try {
            t.response.data = Rr.call(e, e.transformResponse, t.response);
        }
        finally {
            delete e.response;
        }
        t.response.headers = nr.from(t.response.headers);
    } return Promise.reject(t); }); }
    const xi = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => { xi[e] = function (n) { return typeof n === e || "a" + (t < 1 ? "n " : " ") + e; }; });
    const bi = {};
    xi.transitional = function (e, t, n) { function r(e, t) { return "[Axios v" + ai + "] Transitional option '" + e + "'" + t + (n ? ". " + n : ""); } return (n, i, a) => { if (!1 === e)
        throw new ar(r(i, " has been removed" + (t ? " in " + t : "")), ar.ERR_DEPRECATED); return t && !bi[i] && (bi[i] = !0, console.warn(r(i, " has been deprecated since v" + t + " and will be removed in the near future"))), !e || e(n, i, a); }; }, xi.spelling = function (e) { return (t, n) => (console.warn("".concat(n, " is likely a misspelling of ").concat(e)), !0); };
    const yi = { assertOptions: function (e, t, n) { if ("object" !== typeof e)
            throw new ar("options must be an object", ar.ERR_BAD_OPTION_VALUE); const r = Object.keys(e); let i = r.length; for (; i-- > 0;) {
            const a = r[i], o = Object.prototype.hasOwnProperty.call(t, a) ? t[a] : void 0;
            if (o) {
                const t = e[a], n = void 0 === t || o(t, a, e);
                if (!0 !== n)
                    throw new ar("option " + a + " must be " + n, ar.ERR_BAD_OPTION_VALUE);
                continue;
            }
            if (!0 !== n)
                throw new ar("Unknown option " + a, ar.ERR_BAD_OPTION);
        } }, validators: xi }, vi = yi.validators;
    class wi {
        constructor(e) { this.defaults = e || {}, this.interceptors = { request: new xr, response: new xr }; }
        async request(e, t) { try {
            return await this._request(e, t);
        }
        catch (n) {
            if (n instanceof Error) {
                let e = {};
                Error.captureStackTrace ? Error.captureStackTrace(e) : e = new Error;
                const t = (() => { if (!e.stack)
                    return ""; const t = e.stack.indexOf("\n"); return -1 === t ? "" : e.stack.slice(t + 1); })();
                try {
                    if (n.stack) {
                        if (t) {
                            const e = t.indexOf("\n"), r = -1 === e ? -1 : t.indexOf("\n", e + 1), i = -1 === r ? "" : t.slice(r + 1);
                            String(n.stack).endsWith(i) || (n.stack += "\n" + t);
                        }
                    }
                    else
                        n.stack = t;
                }
                catch (El) { }
            }
            throw n;
        } }
        _request(e, t) { "string" === typeof e ? (t = t || {}).url = e : t = e || {}; const n = t = Hr(this.defaults, t), r = n.transitional, i = n.paramsSerializer, a = n.headers; void 0 !== r && yi.assertOptions(r, { silentJSONParsing: vi.transitional(vi.boolean), forcedJSONParsing: vi.transitional(vi.boolean), clarifyTimeoutError: vi.transitional(vi.boolean), legacyInterceptorReqResOrdering: vi.transitional(vi.boolean) }, !1), null != i && (Gn.isFunction(i) ? t.paramsSerializer = { serialize: i } : yi.assertOptions(i, { encode: vi.function, serialize: vi.function }, !0)), void 0 !== t.allowAbsoluteUrls || (void 0 !== this.defaults.allowAbsoluteUrls ? t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : t.allowAbsoluteUrls = !0), yi.assertOptions(t, { baseUrl: vi.spelling("baseURL"), withXsrfToken: vi.spelling("withXSRFToken") }, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase(); let o = a && Gn.merge(a.common, a[t.method]); a && Gn.forEach(["delete", "get", "head", "post", "put", "patch", "query", "common"], e => { delete a[e]; }), t.headers = nr.concat(o, a); const s = []; let l = !0; this.interceptors.request.forEach(function (e) { if ("function" === typeof e.runWhen && !1 === e.runWhen(t))
            return; l = l && e.synchronous; const n = t.transitional || br; n && n.legacyInterceptorReqResOrdering ? s.unshift(e.fulfilled, e.rejected) : s.push(e.fulfilled, e.rejected); }); const c = []; let d; this.interceptors.response.forEach(function (e) { c.push(e.fulfilled, e.rejected); }); let u, p = 0; if (!l) {
            const e = [mi.bind(this), void 0];
            for (e.unshift(...s), e.push(...c), u = e.length, d = Promise.resolve(t); p < u;)
                d = d.then(e[p++], e[p++]);
            return d;
        } u = s.length; let h = t; for (; p < u;) {
            const e = s[p++], t = s[p++];
            try {
                h = e(h);
            }
            catch (f) {
                t.call(this, f);
                break;
            }
        } try {
            d = mi.call(this, h);
        }
        catch (f) {
            return Promise.reject(f);
        } for (p = 0, u = c.length; p < u;)
            d = d.then(c[p++], c[p++]); return d; }
        getUri(e) { return mr(_r((e = Hr(this.defaults, e)).baseURL, e.url, e.allowAbsoluteUrls), e.params, e.paramsSerializer); }
    }
    Gn.forEach(["delete", "get", "head", "options"], function (e) { wi.prototype[e] = function (t, n) { return this.request(Hr(n || {}, { method: e, url: t, data: (n || {}).data })); }; }), Gn.forEach(["post", "put", "patch", "query"], function (e) { function t(t) { return function (n, r, i) { return this.request(Hr(i || {}, { method: e, headers: t ? { "Content-Type": "multipart/form-data" } : {}, url: n, data: r })); }; } wi.prototype[e] = t(), "query" !== e && (wi.prototype[e + "Form"] = t(!0)); });
    const ji = wi;
    class ki {
        constructor(e) { if ("function" !== typeof e)
            throw new TypeError("executor must be a function."); let t; this.promise = new Promise(function (e) { t = e; }); const n = this; this.promise.then(e => { if (!n._listeners)
            return; let t = n._listeners.length; for (; t-- > 0;)
            n._listeners[t](e); n._listeners = null; }), this.promise.then = e => { let t; const r = new Promise(e => { n.subscribe(e), t = e; }).then(e); return r.cancel = function () { n.unsubscribe(t); }, r; }, e(function (e, r, i) { n.reason || (n.reason = new Lr(e, r, i), t(n.reason)); }); }
        throwIfRequested() { if (this.reason)
            throw this.reason; }
        subscribe(e) { this.reason ? e(this.reason) : this._listeners ? this._listeners.push(e) : this._listeners = [e]; }
        unsubscribe(e) { if (!this._listeners)
            return; const t = this._listeners.indexOf(e); -1 !== t && this._listeners.splice(t, 1); }
        toAbortSignal() { const e = new AbortController, t = t => { e.abort(t); }; return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal; }
        static source() { let e; const t = new ki(function (t) { e = t; }); return { token: t, cancel: e }; }
    }
    const Si = ki;
    const Ni = { Continue: 100, SwitchingProtocols: 101, Processing: 102, EarlyHints: 103, Ok: 200, Created: 201, Accepted: 202, NonAuthoritativeInformation: 203, NoContent: 204, ResetContent: 205, PartialContent: 206, MultiStatus: 207, AlreadyReported: 208, ImUsed: 226, MultipleChoices: 300, MovedPermanently: 301, Found: 302, SeeOther: 303, NotModified: 304, UseProxy: 305, Unused: 306, TemporaryRedirect: 307, PermanentRedirect: 308, BadRequest: 400, Unauthorized: 401, PaymentRequired: 402, Forbidden: 403, NotFound: 404, MethodNotAllowed: 405, NotAcceptable: 406, ProxyAuthenticationRequired: 407, RequestTimeout: 408, Conflict: 409, Gone: 410, LengthRequired: 411, PreconditionFailed: 412, PayloadTooLarge: 413, UriTooLong: 414, UnsupportedMediaType: 415, RangeNotSatisfiable: 416, ExpectationFailed: 417, ImATeapot: 418, MisdirectedRequest: 421, UnprocessableEntity: 422, Locked: 423, FailedDependency: 424, TooEarly: 425, UpgradeRequired: 426, PreconditionRequired: 428, TooManyRequests: 429, RequestHeaderFieldsTooLarge: 431, UnavailableForLegalReasons: 451, InternalServerError: 500, NotImplemented: 501, BadGateway: 502, ServiceUnavailable: 503, GatewayTimeout: 504, HttpVersionNotSupported: 505, VariantAlsoNegotiates: 506, InsufficientStorage: 507, LoopDetected: 508, NotExtended: 510, NetworkAuthenticationRequired: 511, WebServerIsDown: 521, ConnectionTimedOut: 522, OriginIsUnreachable: 523, TimeoutOccurred: 524, SslHandshakeFailed: 525, InvalidSslCertificate: 526 };
    Object.entries(Ni).forEach(e => { let t = u(e, 2), n = t[0], r = t[1]; Ni[r] = n; });
    const Ci = Ni;
    const Ti = function e(t) { const n = new ji(t), r = an(ji.prototype.request, n); return Gn.extend(r, ji.prototype, n, { allOwnKeys: !0 }), Gn.extend(r, n, null, { allOwnKeys: !0 }), r.create = function (n) { return e(Hr(t, n)); }, r; }(Er);
    Ti.Axios = ji, Ti.CanceledError = Lr, Ti.CancelToken = Si, Ti.isCancel = Pr, Ti.VERSION = ai, Ti.toFormData = dr, Ti.AxiosError = ar, Ti.Cancel = Ti.CanceledError, Ti.all = function (e) { return Promise.all(e); }, Ti.spread = function (e) { return function (t) { return e.apply(null, t); }; }, Ti.isAxiosError = function (e) { return Gn.isObject(e) && !0 === e.isAxiosError; }, Ti.mergeConfig = Hr, Ti.AxiosHeaders = nr, Ti.formToJSON = e => Cr(Gn.isHTMLForm(e) ? new FormData(e) : e), Ti.getAdapter = fi.getAdapter, Ti.HttpStatusCode = Ci, Ti.default = Ti;
    const Ai = Ti;
    var Ei = { color: void 0, size: void 0, className: void 0, style: void 0, attr: void 0 }, Ri = r.createContext && r.createContext(Ei), Pi = function () { return Pi = Object.assign || function (e) { for (var t, n = 1, r = arguments.length; n < r; n++)
        for (var i in t = arguments[n])
            Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]); return e; }, Pi.apply(this, arguments); }, Li = function (e, t) { var n = {}; for (var r in e)
        Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]); if (null != e && "function" === typeof Object.getOwnPropertySymbols) {
        var i = 0;
        for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
            t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
    } return n; };
    function Oi(e) { return e && e.map(function (e, t) { return r.createElement(e.tag, Pi({ key: t }, e.attr), Oi(e.child)); }); }
    function zi(e) { return function (t) { return r.createElement(Bi, Pi({ attr: Pi({}, e.attr) }, t), Oi(e.child)); }; }
    function Bi(e) { var t = function (t) { var n, i = e.attr, a = e.size, o = e.title, s = Li(e, ["attr", "size", "title"]), l = a || t.size || "1em"; return t.className && (n = t.className), e.className && (n = (n ? n + " " : "") + e.className), r.createElement("svg", Pi({ stroke: "currentColor", fill: "currentColor", strokeWidth: "0" }, t.attr, i, s, { className: n, style: Pi(Pi({ color: e.color || t.color }, t.style), e.style), height: l, width: l, xmlns: "http://www.w3.org/2000/svg" }), o && r.createElement("title", null, o), e.children); }; return void 0 !== Ri ? r.createElement(Ri.Consumer, null, function (e) { return t(e); }) : t(Ei); }
    function Di(e) { return zi({ tag: "svg", attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" } }] })(e); }
    function Fi(e) { return zi({ tag: "svg", attr: { viewBox: "0 0 640 512" }, child: [{ tag: "path", attr: { d: "M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" } }] })(e); }
    function Mi(e) { return zi({ tag: "svg", attr: { viewBox: "0 0 576 512" }, child: [{ tag: "path", attr: { d: "M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" } }] })(e); }
    function Ii(e) { return zi({ tag: "svg", attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" } }] })(e); }
    const Ui = n.p + "static/media/logo.3f99fbf40a7a7141f150.jpg";
    var _i = n(579);
    const Wi = () => { const e = kt(), t = (ve().t, u((0, r.useState)(""), 2)), n = t[0], i = t[1], a = u((0, r.useState)(""), 2), o = a[0], s = a[1], l = u((0, r.useState)(!1), 2), c = l[0], d = l[1], p = u((0, r.useState)(!1), 2), h = p[0], f = p[1], g = u((0, r.useState)({ type: null, title: "", message: "" }), 2), m = g[0], x = g[1], b = localStorage.getItem("lang") || "en", y = (e, t, n) => { x({ type: e, title: t, message: n }), "success" === e && setTimeout(() => x({ type: null, title: "", message: "" }), 3e3); }, v = () => { x({ type: null, title: "", message: "" }); }; return (0, _i.jsxs)("div", { className: "login-page", children: [m.type && (0, _i.jsx)("div", { className: "modal-overlay", onClick: v, children: (0, _i.jsxs)("div", { className: "modal-box", onClick: e => e.stopPropagation(), children: [(0, _i.jsxs)("div", { className: "modal-header ".concat(m.type), children: [(0, _i.jsxs)("div", { className: "modal-icon", children: ["success" === m.type && "\u2705", "error" === m.type && "\u274c", "warning" === m.type && "\u26a0\ufe0f"] }), (0, _i.jsx)("h3", { children: m.title })] }), (0, _i.jsx)("p", { children: m.message }), (0, _i.jsx)("button", { className: "modal-close", onClick: v, children: "Close" })] }) }), (0, _i.jsx)("div", { className: "lang-selector", children: (0, _i.jsx)("select", { value: b, onChange: e => { return t = e.target.value, je.changeLanguage(t), void localStorage.setItem("lang", t); var t; }, className: "lang-select", children: Object.entries({ en: "English", hi: "\u0939\u093f\u0902\u0926\u0940", ja: "\u65e5\u672c\u8a9e", zh: "\u4e2d\u6587", es: "Espa\xf1ol", fr: "Fran\xe7ais", de: "Deutsch", ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", pt: "Portugu\xeas", tr: "T\xfcrk\xe7e", ko: "\ud55c\uad6d\uc5b4", it: "Italiano", nl: "Nederlands", pl: "Polski", uk: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430" }).map(e => { let t = u(e, 2), n = t[0], r = t[1]; return (0, _i.jsx)("option", { value: n, children: r }, n); }) }) }), (0, _i.jsx)("div", { className: "login-container", children: (0, _i.jsxs)("div", { className: "login-card", children: [(0, _i.jsxs)("div", { className: "login-header", children: [(0, _i.jsx)("img", { src: Ui, alt: "SwanCore Logo", className: "login-logo" }), (0, _i.jsx)("h1", { children: "Welcome Back" }), (0, _i.jsx)("p", { children: "Sign in to your SwanCore account" })] }), (0, _i.jsxs)("form", { onSubmit: async (t) => { if (t.preventDefault(), f(!0), !n.trim())
                                return y("warning", "Email Required", "Please enter your registered email address."), void f(!1); if (!(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()))(n))
                                return y("error", "Invalid Email", "Please enter a valid email address."), void f(!1); if (!o.trim())
                                return y("warning", "Password Required", "Please enter your password"), void f(!1); try {
                                var r;
                                const t = await Ai.post("/api/auth/login", { identifier: n.toLowerCase().trim(), email: n.toLowerCase().trim(), password: o.trim() }, { headers: { "Content-Type": "application/json" } }), i = t.data.accessToken || t.data.token || t.data.sessionToken || "", a = t.data.refreshToken;
                                if (!i)
                                    throw new Error(t.data.message || "Login failed. Please try again.");
                                localStorage.setItem("token", i), a && localStorage.setItem("refreshToken", a), localStorage.setItem("userEmail", n.toLowerCase().trim()), localStorage.setItem("userId", (null === (r = t.data.user) || void 0 === r ? void 0 : r.userId) || "");
                                const s = t.data.expiresIn ? 1e3 * Number(t.data.expiresIn) : 6048e5;
                                localStorage.setItem("sessionExpiry", (Date.now() + s).toString()), y("success", "Login Successful", "Welcome back! Redirecting..."), setTimeout(() => { e("/home"); }, 2e3);
                            }
                            catch (s) {
                                var i, a;
                                const e = (null === s || void 0 === s || null === (i = s.response) || void 0 === i || null === (a = i.data) || void 0 === a ? void 0 : a.message) || "Login failed. Please try again.";
                                y("error", "Login Error", e), console.error("Login Error:", s);
                            }
                            finally {
                                f(!1);
                            } }, className: "login-form", children: [(0, _i.jsxs)("div", { className: "form-group", children: [(0, _i.jsx)("label", { htmlFor: "identifier", children: "Email" }), (0, _i.jsx)("input", { type: "email", id: "identifier", value: n, onChange: e => i(e.target.value), placeholder: "Enter your registered email address", required: !0 })] }), (0, _i.jsxs)("div", { className: "form-group", children: [(0, _i.jsx)("label", { htmlFor: "password", children: "Password" }), (0, _i.jsxs)("div", { className: "password-input", children: [(0, _i.jsx)("input", { type: c ? "text" : "password", id: "password", value: o, onChange: e => s(e.target.value), placeholder: "Enter your password", required: !0 }), (0, _i.jsx)("button", { type: "button", className: "password-toggle", onClick: () => d(!c), children: c ? (0, _i.jsx)(Fi, {}) : (0, _i.jsx)(Mi, {}) })] })] }), (0, _i.jsx)("button", { type: "submit", className: "login-btn", disabled: h, children: h ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)(Ii, { className: "spinner" }), "Signing In..."] }) : "Sign In" })] }), (0, _i.jsx)("div", { className: "login-links", children: (0, _i.jsxs)("p", { children: ["Don't have an account?", " ", (0, _i.jsx)("a", { href: "/register", className: "link", children: "Sign up here" })] }) })] }) }), (0, _i.jsxs)("div", { className: "login-footer", children: [(0, _i.jsx)("span", { onClick: () => e("/cookies"), children: "Cookies" }), (0, _i.jsx)("span", { children: "\u2022" }), (0, _i.jsx)("span", { onClick: () => e("/privacy"), children: "Privacy" })] })] }); }, Hi = Object.create(null);
    Hi.open = "0", Hi.close = "1", Hi.ping = "2", Hi.pong = "3", Hi.message = "4", Hi.upgrade = "5", Hi.noop = "6";
    const Vi = Object.create(null);
    Object.keys(Hi).forEach(e => { Vi[Hi[e]] = e; });
    const qi = { type: "error", data: "parser error" }, Ki = "function" === typeof Blob || "undefined" !== typeof Blob && "[object BlobConstructor]" === Object.prototype.toString.call(Blob), Gi = "function" === typeof ArrayBuffer, Yi = e => "function" === typeof ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer instanceof ArrayBuffer, Xi = (e, t, n) => { let r = e.type, i = e.data; return Ki && i instanceof Blob ? t ? n(i) : Ji(i, n) : Gi && (i instanceof ArrayBuffer || Yi(i)) ? t ? n(i) : Ji(new Blob([i]), n) : n(Hi[r] + (i || "")); }, Ji = (e, t) => { const n = new FileReader; return n.onload = function () { const e = n.result.split(",")[1]; t("b" + (e || "")); }, n.readAsDataURL(e); };
    function Qi(e) { return e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength); }
    let Zi;
    const $i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ea = "undefined" === typeof Uint8Array ? [] : new Uint8Array(256);
    for (let n = 0; n < 64; n++)
        ea[$i.charCodeAt(n)] = n;
    const ta = "function" === typeof ArrayBuffer, na = (e, t) => { if ("string" !== typeof e)
        return { type: "message", data: ia(e, t) }; const n = e.charAt(0); if ("b" === n)
        return { type: "message", data: ra(e.substring(1), t) }; return Vi[n] ? e.length > 1 ? { type: Vi[n], data: e.substring(1) } : { type: Vi[n] } : qi; }, ra = (e, t) => { if (ta) {
        const n = (e => { let t, n, r, i, a, o = .75 * e.length, s = e.length, l = 0; "=" === e[e.length - 1] && (o--, "=" === e[e.length - 2] && o--); const c = new ArrayBuffer(o), d = new Uint8Array(c); for (t = 0; t < s; t += 4)
            n = ea[e.charCodeAt(t)], r = ea[e.charCodeAt(t + 1)], i = ea[e.charCodeAt(t + 2)], a = ea[e.charCodeAt(t + 3)], d[l++] = n << 2 | r >> 4, d[l++] = (15 & r) << 4 | i >> 2, d[l++] = (3 & i) << 6 | 63 & a; return c; })(e);
        return ia(n, t);
    } return { base64: !0, data: e }; }, ia = (e, t) => "blob" === t ? e instanceof Blob ? e : new Blob([e]) : e instanceof ArrayBuffer ? e : e.buffer, aa = String.fromCharCode(30);
    function oa() { return new TransformStream({ transform(e, t) { !function (e, t) { Ki && e.data instanceof Blob ? e.data.arrayBuffer().then(Qi).then(t) : Gi && (e.data instanceof ArrayBuffer || Yi(e.data)) ? t(Qi(e.data)) : Xi(e, !1, e => { Zi || (Zi = new TextEncoder), t(Zi.encode(e)); }); }(e, n => { const r = n.length; let i; if (r < 126)
            i = new Uint8Array(1), new DataView(i.buffer).setUint8(0, r);
        else if (r < 65536) {
            i = new Uint8Array(3);
            const e = new DataView(i.buffer);
            e.setUint8(0, 126), e.setUint16(1, r);
        }
        else {
            i = new Uint8Array(9);
            const e = new DataView(i.buffer);
            e.setUint8(0, 127), e.setBigUint64(1, BigInt(r));
        } e.data && "string" !== typeof e.data && (i[0] |= 128), t.enqueue(i), t.enqueue(n); }); } }); }
    let sa;
    function la(e) { return e.reduce((e, t) => e + t.length, 0); }
    function ca(e, t) { if (e[0].length === t)
        return e.shift(); const n = new Uint8Array(t); let r = 0; for (let i = 0; i < t; i++)
        n[i] = e[0][r++], r === e[0].length && (e.shift(), r = 0); return e.length && r < e[0].length && (e[0] = e[0].slice(r)), n; }
    function da(e) { if (e)
        return function (e) { for (var t in da.prototype)
            e[t] = da.prototype[t]; return e; }(e); }
    da.prototype.on = da.prototype.addEventListener = function (e, t) { return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this; }, da.prototype.once = function (e, t) { function n() { this.off(e, n), t.apply(this, arguments); } return n.fn = t, this.on(e, n), this; }, da.prototype.off = da.prototype.removeListener = da.prototype.removeAllListeners = da.prototype.removeEventListener = function (e, t) { if (this._callbacks = this._callbacks || {}, 0 == arguments.length)
        return this._callbacks = {}, this; var n, r = this._callbacks["$" + e]; if (!r)
        return this; if (1 == arguments.length)
        return delete this._callbacks["$" + e], this; for (var i = 0; i < r.length; i++)
        if ((n = r[i]) === t || n.fn === t) {
            r.splice(i, 1);
            break;
        } return 0 === r.length && delete this._callbacks["$" + e], this; }, da.prototype.emit = function (e) { this._callbacks = this._callbacks || {}; for (var t = new Array(arguments.length - 1), n = this._callbacks["$" + e], r = 1; r < arguments.length; r++)
        t[r - 1] = arguments[r]; if (n) {
        r = 0;
        for (var i = (n = n.slice(0)).length; r < i; ++r)
            n[r].apply(this, t);
    } return this; }, da.prototype.emitReserved = da.prototype.emit, da.prototype.listeners = function (e) { return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || []; }, da.prototype.hasListeners = function (e) { return !!this.listeners(e).length; };
    const ua = "function" === typeof Promise && "function" === typeof Promise.resolve ? e => Promise.resolve().then(e) : (e, t) => t(e, 0), pa = "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : Function("return this")();
    function ha(e) { for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
        n[r - 1] = arguments[r]; return n.reduce((t, n) => (e.hasOwnProperty(n) && (t[n] = e[n]), t), {}); }
    const fa = pa.setTimeout, ga = pa.clearTimeout;
    function ma(e, t) { t.useNativeTimers ? (e.setTimeoutFn = fa.bind(pa), e.clearTimeoutFn = ga.bind(pa)) : (e.setTimeoutFn = pa.setTimeout.bind(pa), e.clearTimeoutFn = pa.clearTimeout.bind(pa)); }
    function xa(e) { return "string" === typeof e ? function (e) { let t = 0, n = 0; for (let r = 0, i = e.length; r < i; r++)
        t = e.charCodeAt(r), t < 128 ? n += 1 : t < 2048 ? n += 2 : t < 55296 || t >= 57344 ? n += 3 : (r++, n += 4); return n; }(e) : Math.ceil(1.33 * (e.byteLength || e.size)); }
    function ba() { return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5); }
    class ya extends Error {
        constructor(e, t, n) { super(e), this.description = t, this.context = n, this.type = "TransportError"; }
    }
    class va extends da {
        constructor(e) { super(), this.writable = !1, ma(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64; }
        onError(e, t, n) { return super.emitReserved("error", new ya(e, t, n)), this; }
        open() { return this.readyState = "opening", this.doOpen(), this; }
        close() { return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this; }
        send(e) { "open" === this.readyState && this.write(e); }
        onOpen() { this.readyState = "open", this.writable = !0, super.emitReserved("open"); }
        onData(e) { const t = na(e, this.socket.binaryType); this.onPacket(t); }
        onPacket(e) { super.emitReserved("packet", e); }
        onClose(e) { this.readyState = "closed", super.emitReserved("close", e); }
        pause(e) { }
        createUri(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t); }
        _hostname() { const e = this.opts.hostname; return -1 === e.indexOf(":") ? e : "[" + e + "]"; }
        _port() { return this.opts.port && (this.opts.secure && 443 !== Number(this.opts.port) || !this.opts.secure && 80 !== Number(this.opts.port)) ? ":" + this.opts.port : ""; }
        _query(e) { const t = function (e) { let t = ""; for (let n in e)
            e.hasOwnProperty(n) && (t.length && (t += "&"), t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n])); return t; }(e); return t.length ? "?" + t : ""; }
    }
    class wa extends va {
        constructor() { super(...arguments), this._polling = !1; }
        get name() { return "polling"; }
        doOpen() { this._poll(); }
        pause(e) { this.readyState = "pausing"; const t = () => { this.readyState = "paused", e(); }; if (this._polling || !this.writable) {
            let e = 0;
            this._polling && (e++, this.once("pollComplete", function () { --e || t(); })), this.writable || (e++, this.once("drain", function () { --e || t(); }));
        }
        else
            t(); }
        _poll() { this._polling = !0, this.doPoll(), this.emitReserved("poll"); }
        onData(e) { ((e, t) => { const n = e.split(aa), r = []; for (let i = 0; i < n.length; i++) {
            const e = na(n[i], t);
            if (r.push(e), "error" === e.type)
                break;
        } return r; })(e, this.socket.binaryType).forEach(e => { if ("opening" === this.readyState && "open" === e.type && this.onOpen(), "close" === e.type)
            return this.onClose({ description: "transport closed by the server" }), !1; this.onPacket(e); }), "closed" !== this.readyState && (this._polling = !1, this.emitReserved("pollComplete"), "open" === this.readyState && this._poll()); }
        doClose() { const e = () => { this.write([{ type: "close" }]); }; "open" === this.readyState ? e() : this.once("open", e); }
        write(e) { this.writable = !1, ((e, t) => { const n = e.length, r = new Array(n); let i = 0; e.forEach((e, a) => { Xi(e, !1, e => { r[a] = e, ++i === n && t(r.join(aa)); }); }); })(e, e => { this.doWrite(e, () => { this.writable = !0, this.emitReserved("drain"); }); }); }
        uri() { const e = this.opts.secure ? "https" : "http", t = this.query || {}; return !1 !== this.opts.timestampRequests && (t[this.opts.timestampParam] = ba()), this.supportsBinary || t.sid || (t.b64 = 1), this.createUri(e, t); }
    }
    let ja = !1;
    try {
        ja = "undefined" !== typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest;
    }
    catch (Rl) { }
    const ka = ja;
    function Sa() { }
    class Na extends wa {
        constructor(e) { if (super(e), "undefined" !== typeof location) {
            const t = "https:" === location.protocol;
            let n = location.port;
            n || (n = t ? "443" : "80"), this.xd = "undefined" !== typeof location && e.hostname !== location.hostname || n !== e.port;
        } }
        doWrite(e, t) { const n = this.request({ method: "POST", data: e }); n.on("success", t), n.on("error", (e, t) => { this.onError("xhr post error", e, t); }); }
        doPoll() { const e = this.request(); e.on("data", this.onData.bind(this)), e.on("error", (e, t) => { this.onError("xhr poll error", e, t); }), this.pollXhr = e; }
    }
    class Ca extends da {
        constructor(e, t, n) { super(), this.createRequest = e, ma(this, n), this._opts = n, this._method = n.method || "GET", this._uri = t, this._data = void 0 !== n.data ? n.data : null, this._create(); }
        _create() { var e; const t = ha(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref"); t.xdomain = !!this._opts.xd; const n = this._xhr = this.createRequest(t); try {
            n.open(this._method, this._uri, !0);
            try {
                if (this._opts.extraHeaders) {
                    n.setDisableHeaderCheck && n.setDisableHeaderCheck(!0);
                    for (let e in this._opts.extraHeaders)
                        this._opts.extraHeaders.hasOwnProperty(e) && n.setRequestHeader(e, this._opts.extraHeaders[e]);
                }
            }
            catch (El) { }
            if ("POST" === this._method)
                try {
                    n.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                }
                catch (El) { }
            try {
                n.setRequestHeader("Accept", "*/*");
            }
            catch (El) { }
            null === (e = this._opts.cookieJar) || void 0 === e || e.addCookies(n), "withCredentials" in n && (n.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (n.timeout = this._opts.requestTimeout), n.onreadystatechange = () => { var e; 3 === n.readyState && (null === (e = this._opts.cookieJar) || void 0 === e || e.parseCookies(n.getResponseHeader("set-cookie"))), 4 === n.readyState && (200 === n.status || 1223 === n.status ? this._onLoad() : this.setTimeoutFn(() => { this._onError("number" === typeof n.status ? n.status : 0); }, 0)); }, n.send(this._data);
        }
        catch (El) {
            return void this.setTimeoutFn(() => { this._onError(El); }, 0);
        } "undefined" !== typeof document && (this._index = Ca.requestsCount++, Ca.requests[this._index] = this); }
        _onError(e) { this.emitReserved("error", e, this._xhr), this._cleanup(!0); }
        _cleanup(e) { if ("undefined" !== typeof this._xhr && null !== this._xhr) {
            if (this._xhr.onreadystatechange = Sa, e)
                try {
                    this._xhr.abort();
                }
                catch (El) { }
            "undefined" !== typeof document && delete Ca.requests[this._index], this._xhr = null;
        } }
        _onLoad() { const e = this._xhr.responseText; null !== e && (this.emitReserved("data", e), this.emitReserved("success"), this._cleanup()); }
        abort() { this._cleanup(); }
    }
    if (Ca.requestsCount = 0, Ca.requests = {}, "undefined" !== typeof document)
        if ("function" === typeof attachEvent)
            attachEvent("onunload", Ta);
        else if ("function" === typeof addEventListener) {
            addEventListener("onpagehide" in pa ? "pagehide" : "unload", Ta, !1);
        }
    function Ta() { for (let e in Ca.requests)
        Ca.requests.hasOwnProperty(e) && Ca.requests[e].abort(); }
    const Aa = function () { const e = Ea({ xdomain: !1 }); return e && null !== e.responseType; }();
    function Ea(e) { const t = e.xdomain; try {
        if ("undefined" !== typeof XMLHttpRequest && (!t || ka))
            return new XMLHttpRequest;
    }
    catch (El) { } if (!t)
        try {
            return new (pa[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP");
        }
        catch (El) { } }
    const Ra = "undefined" !== typeof navigator && "string" === typeof navigator.product && "reactnative" === navigator.product.toLowerCase();
    class Pa extends va {
        get name() { return "websocket"; }
        doOpen() { const e = this.uri(), t = this.opts.protocols, n = Ra ? {} : ha(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity"); this.opts.extraHeaders && (n.headers = this.opts.extraHeaders); try {
            this.ws = this.createSocket(e, t, n);
        }
        catch (Rl) {
            return this.emitReserved("error", Rl);
        } this.ws.binaryType = this.socket.binaryType, this.addEventListeners(); }
        addEventListeners() { this.ws.onopen = () => { this.opts.autoUnref && this.ws._socket.unref(), this.onOpen(); }, this.ws.onclose = e => this.onClose({ description: "websocket connection closed", context: e }), this.ws.onmessage = e => this.onData(e.data), this.ws.onerror = e => this.onError("websocket error", e); }
        write(e) { this.writable = !1; for (let t = 0; t < e.length; t++) {
            const n = e[t], r = t === e.length - 1;
            Xi(n, this.supportsBinary, e => { try {
                this.doWrite(n, e);
            }
            catch (El) { } r && ua(() => { this.writable = !0, this.emitReserved("drain"); }, this.setTimeoutFn); });
        } }
        doClose() { "undefined" !== typeof this.ws && (this.ws.onerror = () => { }, this.ws.close(), this.ws = null); }
        uri() { const e = this.opts.secure ? "wss" : "ws", t = this.query || {}; return this.opts.timestampRequests && (t[this.opts.timestampParam] = ba()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t); }
    }
    const La = pa.WebSocket || pa.MozWebSocket;
    const Oa = { websocket: class extends Pa {
            createSocket(e, t, n) { return Ra ? new La(e, t, n) : t ? new La(e, t) : new La(e); }
            doWrite(e, t) { this.ws.send(t); }
        }, webtransport: class extends va {
            get name() { return "webtransport"; }
            doOpen() { try {
                this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
            }
            catch (Rl) {
                return this.emitReserved("error", Rl);
            } this._transport.closed.then(() => { this.onClose(); }).catch(e => { this.onError("webtransport error", e); }), this._transport.ready.then(() => { this._transport.createBidirectionalStream().then(e => { const t = function (e, t) { sa || (sa = new TextDecoder); const n = []; let r = 0, i = -1, a = !1; return new TransformStream({ transform(o, s) { for (n.push(o);;) {
                    if (0 === r) {
                        if (la(n) < 1)
                            break;
                        const e = ca(n, 1);
                        a = 128 === (128 & e[0]), i = 127 & e[0], r = i < 126 ? 3 : 126 === i ? 1 : 2;
                    }
                    else if (1 === r) {
                        if (la(n) < 2)
                            break;
                        const e = ca(n, 2);
                        i = new DataView(e.buffer, e.byteOffset, e.length).getUint16(0), r = 3;
                    }
                    else if (2 === r) {
                        if (la(n) < 8)
                            break;
                        const e = ca(n, 8), t = new DataView(e.buffer, e.byteOffset, e.length), a = t.getUint32(0);
                        if (a > Math.pow(2, 21) - 1) {
                            s.enqueue(qi);
                            break;
                        }
                        i = a * Math.pow(2, 32) + t.getUint32(4), r = 3;
                    }
                    else {
                        if (la(n) < i)
                            break;
                        const e = ca(n, i);
                        s.enqueue(na(a ? e : sa.decode(e), t)), r = 0;
                    }
                    if (0 === i || i > e) {
                        s.enqueue(qi);
                        break;
                    }
                } } }); }(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(t).getReader(), r = oa(); r.readable.pipeTo(e.writable), this._writer = r.writable.getWriter(); const i = () => { n.read().then(e => { let t = e.done, n = e.value; t || (this.onPacket(n), i()); }).catch(e => { }); }; i(); const a = { type: "open" }; this.query.sid && (a.data = '{"sid":"'.concat(this.query.sid, '"}')), this._writer.write(a).then(() => this.onOpen()); }); }); }
            write(e) { this.writable = !1; for (let t = 0; t < e.length; t++) {
                const n = e[t], r = t === e.length - 1;
                this._writer.write(n).then(() => { r && ua(() => { this.writable = !0, this.emitReserved("drain"); }, this.setTimeoutFn); });
            } }
            doClose() { var e; null === (e = this._transport) || void 0 === e || e.close(); }
        }, polling: class extends Na {
            constructor(e) { super(e); const t = e && e.forceBase64; this.supportsBinary = Aa && !t; }
            request() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; return Object.assign(e, { xd: this.xd }, this.opts), new Ca(Ea, this.uri(), e); }
        } }, za = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Ba = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
    function Da(e) { if (e.length > 8e3)
        throw "URI too long"; const t = e, n = e.indexOf("["), r = e.indexOf("]"); -1 != n && -1 != r && (e = e.substring(0, n) + e.substring(n, r).replace(/:/g, ";") + e.substring(r, e.length)); let i = za.exec(e || ""), a = {}, o = 14; for (; o--;)
        a[Ba[o]] = i[o] || ""; return -1 != n && -1 != r && (a.source = t, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a.pathNames = function (e, t) { const n = /\/{2,9}/g, r = t.replace(n, "/").split("/"); "/" != t.slice(0, 1) && 0 !== t.length || r.splice(0, 1); "/" == t.slice(-1) && r.splice(r.length - 1, 1); return r; }(0, a.path), a.queryKey = function (e, t) { const n = {}; return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (e, t, r) { t && (n[t] = r); }), n; }(0, a.query), a; }
    const Fa = "function" === typeof addEventListener && "function" === typeof removeEventListener, Ma = [];
    Fa && addEventListener("offline", () => { Ma.forEach(e => e()); }, !1);
    class Ia extends da {
        constructor(e, t) { if (super(), this.binaryType = "arraybuffer", this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && "object" === typeof e && (t = e, e = null), e) {
            const n = Da(e);
            t.hostname = n.host, t.secure = "https" === n.protocol || "wss" === n.protocol, t.port = n.port, n.query && (t.query = n.query);
        }
        else
            t.host && (t.hostname = Da(t.host).host); ma(this, t), this.secure = null != t.secure ? t.secure : "undefined" !== typeof location && "https:" === location.protocol, t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || ("undefined" !== typeof location ? location.hostname : "localhost"), this.port = t.port || ("undefined" !== typeof location && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, t.transports.forEach(e => { const t = e.prototype.name; this.transports.push(t), this._transportsByName[t] = e; }), this.opts = Object.assign({ path: "/engine.io", agent: !1, withCredentials: !1, upgrade: !0, timestampParam: "t", rememberUpgrade: !1, addTrailingSlash: !0, rejectUnauthorized: !0, perMessageDeflate: { threshold: 1024 }, transportOptions: {}, closeOnBeforeunload: !1 }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), "string" === typeof this.opts.query && (this.opts.query = function (e) { let t = {}, n = e.split("&"); for (let r = 0, i = n.length; r < i; r++) {
            let e = n[r].split("=");
            t[decodeURIComponent(e[0])] = decodeURIComponent(e[1]);
        } return t; }(this.opts.query)), Fa && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => { this.transport && (this.transport.removeAllListeners(), this.transport.close()); }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), "localhost" !== this.hostname && (this._offlineEventListener = () => { this._onClose("transport close", { description: "network connection lost" }); }, Ma.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open(); }
        createTransport(e) { const t = Object.assign({}, this.opts.query); t.EIO = 4, t.transport = e, this.id && (t.sid = this.id); const n = Object.assign({}, this.opts, { query: t, socket: this, hostname: this.hostname, secure: this.secure, port: this.port }, this.opts.transportOptions[e]); return new this._transportsByName[e](n); }
        _open() { if (0 === this.transports.length)
            return void this.setTimeoutFn(() => { this.emitReserved("error", "No transports available"); }, 0); const e = this.opts.rememberUpgrade && Ia.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket") ? "websocket" : this.transports[0]; this.readyState = "opening"; const t = this.createTransport(e); t.open(), this.setTransport(t); }
        setTransport(e) { this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", e => this._onClose("transport close", e)); }
        onOpen() { this.readyState = "open", Ia.priorWebsocketSuccess = "websocket" === this.transport.name, this.emitReserved("open"), this.flush(); }
        _onPacket(e) { if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState)
            switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), e.type) {
                case "open":
                    this.onHandshake(JSON.parse(e.data));
                    break;
                case "ping":
                    this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
                    break;
                case "error":
                    const t = new Error("server error");
                    t.code = e.data, this._onError(t);
                    break;
                case "message": this.emitReserved("data", e.data), this.emitReserved("message", e.data);
            } }
        onHandshake(e) { this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this._pingInterval = e.pingInterval, this._pingTimeout = e.pingTimeout, this._maxPayload = e.maxPayload, this.onOpen(), "closed" !== this.readyState && this._resetPingTimeout(); }
        _resetPingTimeout() { this.clearTimeoutFn(this._pingTimeoutTimer); const e = this._pingInterval + this._pingTimeout; this._pingTimeoutTime = Date.now() + e, this._pingTimeoutTimer = this.setTimeoutFn(() => { this._onClose("ping timeout"); }, e), this.opts.autoUnref && this._pingTimeoutTimer.unref(); }
        _onDrain() { this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emitReserved("drain") : this.flush(); }
        flush() { if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
            const e = this._getWritablePackets();
            this.transport.send(e), this._prevBufferLen = e.length, this.emitReserved("flush");
        } }
        _getWritablePackets() { if (!(this._maxPayload && "polling" === this.transport.name && this.writeBuffer.length > 1))
            return this.writeBuffer; let e = 1; for (let t = 0; t < this.writeBuffer.length; t++) {
            const n = this.writeBuffer[t].data;
            if (n && (e += xa(n)), t > 0 && e > this._maxPayload)
                return this.writeBuffer.slice(0, t);
            e += 2;
        } return this.writeBuffer; }
        _hasPingExpired() { if (!this._pingTimeoutTime)
            return !0; const e = Date.now() > this._pingTimeoutTime; return e && (this._pingTimeoutTime = 0, ua(() => { this._onClose("ping timeout"); }, this.setTimeoutFn)), e; }
        write(e, t, n) { return this._sendPacket("message", e, t, n), this; }
        send(e, t, n) { return this._sendPacket("message", e, t, n), this; }
        _sendPacket(e, t, n, r) { if ("function" === typeof t && (r = t, t = void 0), "function" === typeof n && (r = n, n = null), "closing" === this.readyState || "closed" === this.readyState)
            return; (n = n || {}).compress = !1 !== n.compress; const i = { type: e, data: t, options: n }; this.emitReserved("packetCreate", i), this.writeBuffer.push(i), r && this.once("flush", r), this.flush(); }
        close() { const e = () => { this._onClose("forced close"), this.transport.close(); }, t = () => { this.off("upgrade", t), this.off("upgradeError", t), e(); }, n = () => { this.once("upgrade", t), this.once("upgradeError", t); }; return "opening" !== this.readyState && "open" !== this.readyState || (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => { this.upgrading ? n() : e(); }) : this.upgrading ? n() : e()), this; }
        _onError(e) { if (Ia.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && "opening" === this.readyState)
            return this.transports.shift(), this._open(); this.emitReserved("error", e), this._onClose("transport error", e); }
        _onClose(e, t) { if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
            if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), Fa && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
                const e = Ma.indexOf(this._offlineEventListener);
                -1 !== e && Ma.splice(e, 1);
            }
            this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this._prevBufferLen = 0;
        } }
    }
    Ia.protocol = 4;
    class Ua extends Ia {
        constructor() { super(...arguments), this._upgrades = []; }
        onOpen() { if (super.onOpen(), "open" === this.readyState && this.opts.upgrade)
            for (let e = 0; e < this._upgrades.length; e++)
                this._probe(this._upgrades[e]); }
        _probe(e) { let t = this.createTransport(e), n = !1; Ia.priorWebsocketSuccess = !1; const r = () => { n || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", e => { if (!n)
            if ("pong" === e.type && "probe" === e.data) {
                if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
                    return;
                Ia.priorWebsocketSuccess = "websocket" === t.name, this.transport.pause(() => { n || "closed" !== this.readyState && (c(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush()); });
            }
            else {
                const e = new Error("probe error");
                e.transport = t.name, this.emitReserved("upgradeError", e);
            } })); }; function i() { n || (n = !0, c(), t.close(), t = null); } const a = e => { const n = new Error("probe error: " + e); n.transport = t.name, i(), this.emitReserved("upgradeError", n); }; function o() { a("transport closed"); } function s() { a("socket closed"); } function l(e) { t && e.name !== t.name && i(); } const c = () => { t.removeListener("open", r), t.removeListener("error", a), t.removeListener("close", o), this.off("close", s), this.off("upgrading", l); }; t.once("open", r), t.once("error", a), t.once("close", o), this.once("close", s), this.once("upgrading", l), -1 !== this._upgrades.indexOf("webtransport") && "webtransport" !== e ? this.setTimeoutFn(() => { n || t.open(); }, 200) : t.open(); }
        onHandshake(e) { this._upgrades = this._filterUpgrades(e.upgrades), super.onHandshake(e); }
        _filterUpgrades(e) { const t = []; for (let n = 0; n < e.length; n++)
            ~this.transports.indexOf(e[n]) && t.push(e[n]); return t; }
    }
    class _a extends Ua {
        constructor(e) { const t = "object" === typeof e ? e : arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; (!t.transports || t.transports && "string" === typeof t.transports[0]) && (t.transports = (t.transports || ["polling", "websocket", "webtransport"]).map(e => Oa[e]).filter(e => !!e)), super(e, t); }
    }
    const Wa = "function" === typeof ArrayBuffer, Ha = Object.prototype.toString, Va = "function" === typeof Blob || "undefined" !== typeof Blob && "[object BlobConstructor]" === Ha.call(Blob), qa = "function" === typeof File || "undefined" !== typeof File && "[object FileConstructor]" === Ha.call(File);
    function Ka(e) { return Wa && (e instanceof ArrayBuffer || (e => "function" === typeof ArrayBuffer.isView ? ArrayBuffer.isView(e) : e.buffer instanceof ArrayBuffer)(e)) || Va && e instanceof Blob || qa && e instanceof File; }
    function Ga(e, t) { if (!e || "object" !== typeof e)
        return !1; if (Array.isArray(e)) {
        for (let t = 0, n = e.length; t < n; t++)
            if (Ga(e[t]))
                return !0;
        return !1;
    } if (Ka(e))
        return !0; if (e.toJSON && "function" === typeof e.toJSON && 1 === arguments.length)
        return Ga(e.toJSON(), !0); for (const n in e)
        if (Object.prototype.hasOwnProperty.call(e, n) && Ga(e[n]))
            return !0; return !1; }
    function Ya(e) { const t = [], n = e.data, r = e; return r.data = Xa(n, t), r.attachments = t.length, { packet: r, buffers: t }; }
    function Xa(e, t) { if (!e)
        return e; if (Ka(e)) {
        const n = { _placeholder: !0, num: t.length };
        return t.push(e), n;
    } if (Array.isArray(e)) {
        const n = new Array(e.length);
        for (let r = 0; r < e.length; r++)
            n[r] = Xa(e[r], t);
        return n;
    } if ("object" === typeof e && !(e instanceof Date)) {
        const n = {};
        for (const r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (n[r] = Xa(e[r], t));
        return n;
    } return e; }
    function Ja(e, t) { return e.data = Qa(e.data, t), delete e.attachments, e; }
    function Qa(e, t) { if (!e)
        return e; if (e && !0 === e._placeholder) {
        if ("number" === typeof e.num && e.num >= 0 && e.num < t.length)
            return t[e.num];
        throw new Error("illegal attachments");
    } if (Array.isArray(e))
        for (let n = 0; n < e.length; n++)
            e[n] = Qa(e[n], t);
    else if ("object" === typeof e)
        for (const n in e)
            Object.prototype.hasOwnProperty.call(e, n) && (e[n] = Qa(e[n], t)); return e; }
    const Za = ["connect", "connect_error", "disconnect", "disconnecting", "newListener", "removeListener"], $a = 5;
    var eo;
    !function (e) { e[e.CONNECT = 0] = "CONNECT", e[e.DISCONNECT = 1] = "DISCONNECT", e[e.EVENT = 2] = "EVENT", e[e.ACK = 3] = "ACK", e[e.CONNECT_ERROR = 4] = "CONNECT_ERROR", e[e.BINARY_EVENT = 5] = "BINARY_EVENT", e[e.BINARY_ACK = 6] = "BINARY_ACK"; }(eo || (eo = {}));
    class to {
        constructor(e) { this.replacer = e; }
        encode(e) { return e.type !== eo.EVENT && e.type !== eo.ACK || !Ga(e) ? [this.encodeAsString(e)] : this.encodeAsBinary({ type: e.type === eo.EVENT ? eo.BINARY_EVENT : eo.BINARY_ACK, nsp: e.nsp, data: e.data, id: e.id }); }
        encodeAsString(e) { let t = "" + e.type; return e.type !== eo.BINARY_EVENT && e.type !== eo.BINARY_ACK || (t += e.attachments + "-"), e.nsp && "/" !== e.nsp && (t += e.nsp + ","), null != e.id && (t += e.id), null != e.data && (t += JSON.stringify(e.data, this.replacer)), t; }
        encodeAsBinary(e) { const t = Ya(e), n = this.encodeAsString(t.packet), r = t.buffers; return r.unshift(n), r; }
    }
    class no extends da {
        constructor(e) { super(), this.opts = Object.assign({ reviver: void 0, maxAttachments: 10 }, "function" === typeof e ? { reviver: e } : e); }
        add(e) { let t; if ("string" === typeof e) {
            if (this.reconstructor)
                throw new Error("got plaintext data when reconstructing a packet");
            t = this.decodeString(e);
            const n = t.type === eo.BINARY_EVENT;
            n || t.type === eo.BINARY_ACK ? (t.type = n ? eo.EVENT : eo.ACK, this.reconstructor = new ro(t), 0 === t.attachments && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
        }
        else {
            if (!Ka(e) && !e.base64)
                throw new Error("Unknown type: " + e);
            if (!this.reconstructor)
                throw new Error("got binary data when not reconstructing a packet");
            t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
        } }
        decodeString(e) { let t = 0; const n = { type: Number(e.charAt(0)) }; if (void 0 === eo[n.type])
            throw new Error("unknown packet type " + n.type); if (n.type === eo.BINARY_EVENT || n.type === eo.BINARY_ACK) {
            const r = t + 1;
            for (; "-" !== e.charAt(++t) && t != e.length;)
                ;
            const i = e.substring(r, t);
            if (i != Number(i) || "-" !== e.charAt(t))
                throw new Error("Illegal attachments");
            const a = Number(i);
            if (!io(a) || a < 0)
                throw new Error("Illegal attachments");
            if (a > this.opts.maxAttachments)
                throw new Error("too many attachments");
            n.attachments = a;
        } if ("/" === e.charAt(t + 1)) {
            const r = t + 1;
            for (; ++t;) {
                if ("," === e.charAt(t))
                    break;
                if (t === e.length)
                    break;
            }
            n.nsp = e.substring(r, t);
        }
        else
            n.nsp = "/"; const r = e.charAt(t + 1); if ("" !== r && Number(r) == r) {
            const r = t + 1;
            for (; ++t;) {
                const n = e.charAt(t);
                if (null == n || Number(n) != n) {
                    --t;
                    break;
                }
                if (t === e.length)
                    break;
            }
            n.id = Number(e.substring(r, t + 1));
        } if (e.charAt(++t)) {
            const r = this.tryParse(e.substr(t));
            if (!no.isPayloadValid(n.type, r))
                throw new Error("invalid payload");
            n.data = r;
        } return n; }
        tryParse(e) { try {
            return JSON.parse(e, this.opts.reviver);
        }
        catch (El) {
            return !1;
        } }
        static isPayloadValid(e, t) { switch (e) {
            case eo.CONNECT: return ao(t);
            case eo.DISCONNECT: return void 0 === t;
            case eo.CONNECT_ERROR: return "string" === typeof t || ao(t);
            case eo.EVENT:
            case eo.BINARY_EVENT: return Array.isArray(t) && ("number" === typeof t[0] || "string" === typeof t[0] && -1 === Za.indexOf(t[0]));
            case eo.ACK:
            case eo.BINARY_ACK: return Array.isArray(t);
        } }
        destroy() { this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null); }
    }
    class ro {
        constructor(e) { this.packet = e, this.buffers = [], this.reconPack = e; }
        takeBinaryData(e) { if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
            const e = Ja(this.reconPack, this.buffers);
            return this.finishedReconstruction(), e;
        } return null; }
        finishedReconstruction() { this.reconPack = null, this.buffers = []; }
    }
    const io = Number.isInteger || function (e) { return "number" === typeof e && isFinite(e) && Math.floor(e) === e; };
    function ao(e) { return "[object Object]" === Object.prototype.toString.call(e); }
    function oo(e) { return "string" === typeof e.nsp && (void 0 === (t = e.id) || io(t)) && function (e, t) { switch (e) {
        case eo.CONNECT: return void 0 === t || ao(t);
        case eo.DISCONNECT: return void 0 === t;
        case eo.EVENT: return Array.isArray(t) && ("number" === typeof t[0] || "string" === typeof t[0] && -1 === Za.indexOf(t[0]));
        case eo.ACK: return Array.isArray(t);
        case eo.CONNECT_ERROR: return "string" === typeof t || ao(t);
        default: return !1;
    } }(e.type, e.data); var t; }
    function so(e, t, n) { return e.on(t, n), function () { e.off(t, n); }; }
    const lo = Object.freeze({ connect: 1, connect_error: 1, disconnect: 1, disconnecting: 1, newListener: 1, removeListener: 1 });
    class co extends da {
        constructor(e, t, n) { super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, n && n.auth && (this.auth = n.auth), this._opts = Object.assign({}, n), this.io._autoConnect && this.open(); }
        get disconnected() { return !this.connected; }
        subEvents() { if (this.subs)
            return; const e = this.io; this.subs = [so(e, "open", this.onopen.bind(this)), so(e, "packet", this.onpacket.bind(this)), so(e, "error", this.onerror.bind(this)), so(e, "close", this.onclose.bind(this))]; }
        get active() { return !!this.subs; }
        connect() { return this.connected || (this.subEvents(), this.io._reconnecting || this.io.open(), "open" === this.io._readyState && this.onopen()), this; }
        open() { return this.connect(); }
        send() { for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n]; return t.unshift("message"), this.emit.apply(this, t), this; }
        emit(e) { var t, n, r; if (lo.hasOwnProperty(e))
            throw new Error('"' + e.toString() + '" is a reserved event name'); for (var i = arguments.length, a = new Array(i > 1 ? i - 1 : 0), o = 1; o < i; o++)
            a[o - 1] = arguments[o]; if (a.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
            return this._addToQueue(a), this; const s = { type: eo.EVENT, data: a, options: {} }; if (s.options.compress = !1 !== this.flags.compress, "function" === typeof a[a.length - 1]) {
            const e = this.ids++, t = a.pop();
            this._registerAckCallback(e, t), s.id = e;
        } const l = null === (n = null === (t = this.io.engine) || void 0 === t ? void 0 : t.transport) || void 0 === n ? void 0 : n.writable, c = this.connected && !(null === (r = this.io.engine) || void 0 === r ? void 0 : r._hasPingExpired()); return this.flags.volatile && !l || (c ? (this.notifyOutgoingListeners(s), this.packet(s)) : this.sendBuffer.push(s)), this.flags = {}, this; }
        _registerAckCallback(e, t) { var n, r = this; const i = null !== (n = this.flags.timeout) && void 0 !== n ? n : this._opts.ackTimeout; if (void 0 === i)
            return void (this.acks[e] = t); const a = this.io.setTimeoutFn(() => { delete this.acks[e]; for (let t = 0; t < this.sendBuffer.length; t++)
            this.sendBuffer[t].id === e && this.sendBuffer.splice(t, 1); t.call(this, new Error("operation has timed out")); }, i), o = function () { r.io.clearTimeoutFn(a); for (var e = arguments.length, n = new Array(e), i = 0; i < e; i++)
            n[i] = arguments[i]; t.apply(r, n); }; o.withError = !0, this.acks[e] = o; }
        emitWithAck(e) { for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
            n[r - 1] = arguments[r]; return new Promise((t, r) => { const i = (e, n) => e ? r(e) : t(n); i.withError = !0, n.push(i), this.emit(e, ...n); }); }
        _addToQueue(e) { var t = this; let n; "function" === typeof e[e.length - 1] && (n = e.pop()); const r = { id: this._queueSeq++, tryCount: 0, pending: !1, args: e, flags: Object.assign({ fromQueue: !0 }, this.flags) }; e.push(function (e) { t._queue[0]; if (null !== e)
            r.tryCount > t._opts.retries && (t._queue.shift(), n && n(e));
        else if (t._queue.shift(), n) {
            for (var i = arguments.length, a = new Array(i > 1 ? i - 1 : 0), o = 1; o < i; o++)
                a[o - 1] = arguments[o];
            n(null, ...a);
        } return r.pending = !1, t._drainQueue(); }), this._queue.push(r), this._drainQueue(); }
        _drainQueue() { let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0]; if (!this.connected || 0 === this._queue.length)
            return; const t = this._queue[0]; t.pending && !e || (t.pending = !0, t.tryCount++, this.flags = t.flags, this.emit.apply(this, t.args)); }
        packet(e) { e.nsp = this.nsp, this.io._packet(e); }
        onopen() { "function" == typeof this.auth ? this.auth(e => { this._sendConnectPacket(e); }) : this._sendConnectPacket(this.auth); }
        _sendConnectPacket(e) { this.packet({ type: eo.CONNECT, data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e }); }
        onerror(e) { this.connected || this.emitReserved("connect_error", e); }
        onclose(e, t) { this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t), this._clearAcks(); }
        _clearAcks() { Object.keys(this.acks).forEach(e => { if (!this.sendBuffer.some(t => String(t.id) === e)) {
            const t = this.acks[e];
            delete this.acks[e], t.withError && t.call(this, new Error("socket has been disconnected"));
        } }); }
        onpacket(e) { if (e.nsp === this.nsp)
            switch (e.type) {
                case eo.CONNECT:
                    e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                    break;
                case eo.EVENT:
                case eo.BINARY_EVENT:
                    this.onevent(e);
                    break;
                case eo.ACK:
                case eo.BINARY_ACK:
                    this.onack(e);
                    break;
                case eo.DISCONNECT:
                    this.ondisconnect();
                    break;
                case eo.CONNECT_ERROR:
                    this.destroy();
                    const t = new Error(e.data.message);
                    t.data = e.data.data, this.emitReserved("connect_error", t);
            } }
        onevent(e) { const t = e.data || []; null != e.id && t.push(this.ack(e.id)), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t)); }
        emitEvent(e) { if (this._anyListeners && this._anyListeners.length) {
            const t = this._anyListeners.slice();
            for (const n of t)
                n.apply(this, e);
        } super.emit.apply(this, e), this._pid && e.length && "string" === typeof e[e.length - 1] && (this._lastOffset = e[e.length - 1]); }
        ack(e) { const t = this; let n = !1; return function () { if (!n) {
            n = !0;
            for (var r = arguments.length, i = new Array(r), a = 0; a < r; a++)
                i[a] = arguments[a];
            t.packet({ type: eo.ACK, id: e, data: i });
        } }; }
        onack(e) { const t = this.acks[e.id]; "function" === typeof t && (delete this.acks[e.id], t.withError && e.data.unshift(null), t.apply(this, e.data)); }
        onconnect(e, t) { this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this._drainQueue(!0), this.emitReserved("connect"); }
        emitBuffered() { this.receiveBuffer.forEach(e => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach(e => { this.notifyOutgoingListeners(e), this.packet(e); }), this.sendBuffer = []; }
        ondisconnect() { this.destroy(), this.onclose("io server disconnect"); }
        destroy() { this.subs && (this.subs.forEach(e => e()), this.subs = void 0), this.io._destroy(this); }
        disconnect() { return this.connected && this.packet({ type: eo.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this; }
        close() { return this.disconnect(); }
        compress(e) { return this.flags.compress = e, this; }
        get volatile() { return this.flags.volatile = !0, this; }
        timeout(e) { return this.flags.timeout = e, this; }
        onAny(e) { return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this; }
        prependAny(e) { return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this; }
        offAny(e) { if (!this._anyListeners)
            return this; if (e) {
            const t = this._anyListeners;
            for (let n = 0; n < t.length; n++)
                if (e === t[n])
                    return t.splice(n, 1), this;
        }
        else
            this._anyListeners = []; return this; }
        listenersAny() { return this._anyListeners || []; }
        onAnyOutgoing(e) { return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this; }
        prependAnyOutgoing(e) { return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this; }
        offAnyOutgoing(e) { if (!this._anyOutgoingListeners)
            return this; if (e) {
            const t = this._anyOutgoingListeners;
            for (let n = 0; n < t.length; n++)
                if (e === t[n])
                    return t.splice(n, 1), this;
        }
        else
            this._anyOutgoingListeners = []; return this; }
        listenersAnyOutgoing() { return this._anyOutgoingListeners || []; }
        notifyOutgoingListeners(e) { if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const t = this._anyOutgoingListeners.slice();
            for (const n of t)
                n.apply(this, e.data);
        } }
    }
    function uo(e) { e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0; }
    uo.prototype.duration = function () { var e = this.ms * Math.pow(this.factor, this.attempts++); if (this.jitter) {
        var t = Math.random(), n = Math.floor(t * this.jitter * e);
        e = 0 == (1 & Math.floor(10 * t)) ? e - n : e + n;
    } return 0 | Math.min(e, this.max); }, uo.prototype.reset = function () { this.attempts = 0; }, uo.prototype.setMin = function (e) { this.ms = e; }, uo.prototype.setMax = function (e) { this.max = e; }, uo.prototype.setJitter = function (e) { this.jitter = e; };
    class po extends da {
        constructor(e, n) { var r; super(), this.nsps = {}, this.subs = [], e && "object" === typeof e && (n = e, e = void 0), (n = n || {}).path = n.path || "/socket.io", this.opts = n, ma(this, n), this.reconnection(!1 !== n.reconnection), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor(null !== (r = n.randomizationFactor) && void 0 !== r ? r : .5), this.backoff = new uo({ min: this.reconnectionDelay(), max: this.reconnectionDelayMax(), jitter: this.randomizationFactor() }), this.timeout(null == n.timeout ? 2e4 : n.timeout), this._readyState = "closed", this.uri = e; const i = n.parser || t; this.encoder = new i.Encoder, this.decoder = new i.Decoder, this._autoConnect = !1 !== n.autoConnect, this._autoConnect && this.open(); }
        reconnection(e) { return arguments.length ? (this._reconnection = !!e, e || (this.skipReconnect = !0), this) : this._reconnection; }
        reconnectionAttempts(e) { return void 0 === e ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this); }
        reconnectionDelay(e) { var t; return void 0 === e ? this._reconnectionDelay : (this._reconnectionDelay = e, null === (t = this.backoff) || void 0 === t || t.setMin(e), this); }
        randomizationFactor(e) { var t; return void 0 === e ? this._randomizationFactor : (this._randomizationFactor = e, null === (t = this.backoff) || void 0 === t || t.setJitter(e), this); }
        reconnectionDelayMax(e) { var t; return void 0 === e ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, null === (t = this.backoff) || void 0 === t || t.setMax(e), this); }
        timeout(e) { return arguments.length ? (this._timeout = e, this) : this._timeout; }
        maybeReconnectOnOpen() { !this._reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect(); }
        open(e) { if (~this._readyState.indexOf("open"))
            return this; this.engine = new _a(this.uri, this.opts); const t = this.engine, n = this; this._readyState = "opening", this.skipReconnect = !1; const r = so(t, "open", function () { n.onopen(), e && e(); }), i = t => { this.cleanup(), this._readyState = "closed", this.emitReserved("error", t), e ? e(t) : this.maybeReconnectOnOpen(); }, a = so(t, "error", i); if (!1 !== this._timeout) {
            const e = this._timeout, n = this.setTimeoutFn(() => { r(), i(new Error("timeout")), t.close(); }, e);
            this.opts.autoUnref && n.unref(), this.subs.push(() => { this.clearTimeoutFn(n); });
        } return this.subs.push(r), this.subs.push(a), this; }
        connect(e) { return this.open(e); }
        onopen() { this.cleanup(), this._readyState = "open", this.emitReserved("open"); const e = this.engine; this.subs.push(so(e, "ping", this.onping.bind(this)), so(e, "data", this.ondata.bind(this)), so(e, "error", this.onerror.bind(this)), so(e, "close", this.onclose.bind(this)), so(this.decoder, "decoded", this.ondecoded.bind(this))); }
        onping() { this.emitReserved("ping"); }
        ondata(e) { try {
            this.decoder.add(e);
        }
        catch (El) {
            this.onclose("parse error", El);
        } }
        ondecoded(e) { ua(() => { this.emitReserved("packet", e); }, this.setTimeoutFn); }
        onerror(e) { this.emitReserved("error", e); }
        socket(e, t) { let n = this.nsps[e]; return n ? this._autoConnect && !n.active && n.connect() : (n = new co(this, e, t), this.nsps[e] = n), n; }
        _destroy(e) { const t = Object.keys(this.nsps); for (const n of t) {
            if (this.nsps[n].active)
                return;
        } this._close(); }
        _packet(e) { const t = this.encoder.encode(e); for (let n = 0; n < t.length; n++)
            this.engine.write(t[n], e.options); }
        cleanup() { this.subs.forEach(e => e()), this.subs.length = 0, this.decoder.destroy(); }
        _close() { this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close"); }
        disconnect() { return this._close(); }
        onclose(e, t) { var n; this.cleanup(), null === (n = this.engine) || void 0 === n || n.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect(); }
        reconnect() { if (this._reconnecting || this.skipReconnect)
            return this; const e = this; if (this.backoff.attempts >= this._reconnectionAttempts)
            this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
        else {
            const t = this.backoff.duration();
            this._reconnecting = !0;
            const n = this.setTimeoutFn(() => { e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), e.skipReconnect || e.open(t => { t ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", t)) : e.onreconnect(); })); }, t);
            this.opts.autoUnref && n.unref(), this.subs.push(() => { this.clearTimeoutFn(n); });
        } }
        onreconnect() { const e = this.backoff.attempts; this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e); }
    }
    const ho = {};
    function fo(e, t) { "object" === typeof e && (t = e, e = void 0); const n = function (e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", n = arguments.length > 2 ? arguments[2] : void 0, r = e; n = n || "undefined" !== typeof location && location, null == e && (e = n.protocol + "//" + n.host), "string" === typeof e && ("/" === e.charAt(0) && (e = "/" === e.charAt(1) ? n.protocol + e : n.host + e), /^(https?|wss?):\/\//.test(e) || (e = "undefined" !== typeof n ? n.protocol + "//" + e : "https://" + e), r = Da(e)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/"; const i = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host; return r.id = r.protocol + "://" + i + ":" + r.port + t, r.href = r.protocol + "://" + i + (n && n.port === r.port ? "" : ":" + r.port), r; }(e, (t = t || {}).path || "/socket.io"), r = n.source, i = n.id, a = n.path, o = ho[i] && a in ho[i].nsps; let s; return t.forceNew || t["force new connection"] || !1 === t.multiplex || o ? s = new po(r, t) : (ho[i] || (ho[i] = new po(r, t)), s = ho[i]), n.query && !t.query && (t.query = n.queryKey), s.socket(n.path, t); }
    function go(e) { return e.replace("https://", "wss://").replace("http://", "ws://"); }
    Object.assign(fo, { Manager: po, Socket: co, io: fo, connect: fo });
    const mo = "http://localhost:5000", xo = "http://localhost:5000".replace(/\/+$/, ""), bo = "last_good_api";
    function yo(e) { localStorage.setItem(bo, e); }
    let vo = null;
    async function wo(e) { try {
        return (await fetch("".concat(e, "/health"), { method: "GET", mode: "cors" })).ok;
    }
    catch (t) {
        return !1;
    } }
    async function jo() { const e = localStorage.getItem(bo), t = "undefined" !== typeof window ? window.location.origin.replace(/\/+$/, "") : null; return xo && await wo(xo) ? (yo(xo), vo = xo, xo) : e && await wo(e) ? (vo = e, e) : t && t !== mo && t !== xo && await wo(t) ? (yo(t), vo = t, t) : await wo(mo) ? (yo(mo), vo = mo, mo) : (vo = mo, mo); }
    async function ko() { return jo(); }
    let So = null;
    async function No() { const e = await ko(); if (!So || So.defaults.baseURL !== e) {
        So = Ai.create({ baseURL: e, withCredentials: !0 });
        const t = localStorage.getItem("token");
        t && (So.defaults.headers.common.Authorization = "Bearer " + t);
    } return So; }
    let Co = null, To = null;
    async function Ao() { if (!Co) {
        const e = await jo();
        To = go(e);
        const t = { transports: ["websocket", "polling"], withCredentials: !0, reconnection: !0, reconnectionDelay: 1e3, reconnectionDelayMax: 5e3, reconnectionAttempts: 5, path: "/socket.io" };
        "undefined" !== typeof window && window.location.hostname.includes("app.github.dev") && (t.transports = ["polling"]), Co = fo(To, t), window.socket = Co, Co.on("connect", () => { console.log("Socket connected successfully to", To); }), Co.on("connect_error", async (e) => { console.warn("Socket connect error:", e.message); const n = go(mo); if (To !== n) {
            console.warn("Falling back to local socket:", n);
            try {
                Co.disconnect(), To = n, Co = fo(To, t), window.socket = Co;
            }
            catch (El) {
                console.error("Fallback socket failed:", El);
            }
        } }), Co.on("disconnect", () => { console.log("Socket disconnected from", To); });
    } return Co; }
    const Eo = () => { const e = kt(), t = u((0, r.useState)(1), 2), n = t[0], i = t[1], a = u((0, r.useState)(""), 2), o = a[0], s = a[1], l = u((0, r.useState)(""), 2), c = l[0], d = l[1], p = u((0, r.useState)(""), 2), h = p[0], f = p[1], g = u((0, r.useState)(!1), 2), m = g[0], x = g[1], b = u((0, r.useState)(""), 2), y = b[0], v = b[1], w = u((0, r.useState)(!1), 2), j = w[0], k = w[1], S = u((0, r.useState)(!1), 2), N = S[0], C = S[1], T = u((0, r.useState)(""), 2), A = T[0], E = T[1], R = u((0, r.useState)(""), 2), P = R[0], L = R[1], O = u((0, r.useState)(0), 2), z = O[0], B = O[1], D = u((0, r.useState)(0), 2), F = D[0], M = D[1], I = u((0, r.useState)(!1), 2), U = I[0], _ = I[1], W = u((0, r.useState)({ type: null, title: "", message: "" }), 2), H = W[0], V = W[1], q = { en: "English", hi: "\u0939\u093f\u0902\u0926\u0940", ja: "\u65e5\u672c\u8a9e", zh: "\u4e2d\u6587", es: "Espa\xf1ol", fr: "Fran\xe7ais", de: "Deutsch", ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", pt: "Portugu\xeas", tr: "T\xfcrk\xe7e", ko: "\ud55c\uad6d\uc5b4", it: "Italiano", nl: "Nederlands", pl: "Polski", uk: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430" }, K = localStorage.getItem("lang") || "en", G = (e, t, n) => { V({ type: e, title: t, message: n }), "success" === e && setTimeout(() => V({ type: null, title: "", message: "" }), 3e3); }, Y = () => { V({ type: null, title: "", message: "" }); }; (0, r.useEffect)(() => { let e; return z > 0 && (e = setInterval(() => { B(e => e - 1); }, 1e3)), () => clearInterval(e); }, [z]); const X = () => C(!N); return (0, _i.jsxs)(_i.Fragment, { children: [U && (0, _i.jsx)("div", { className: "welcome-screen", children: (0, _i.jsxs)("div", { className: "welcome-content", children: [(0, _i.jsx)("img", { src: Ui, alt: "SwanCore Logo", className: "welcome-logo" }), (0, _i.jsx)("h1", { children: "Welcome to SwanCore!" }), (0, _i.jsx)("p", { children: "Your account has been created successfully." }), (0, _i.jsxs)("div", { className: "user-id-display", children: [(0, _i.jsx)("p", { children: (0, _i.jsx)("strong", { children: "Your User ID:" }) }), (0, _i.jsx)("p", { className: "user-id", children: localStorage.getItem("userId") || "Generating..." }), (0, _i.jsx)("p", { className: "user-id-note", children: "Save this ID! You can use it to login along with your email." })] }), (0, _i.jsx)("p", { children: "Redirecting to home page..." }), (0, _i.jsx)("div", { className: "welcome-spinner" })] }) }), !U && (0, _i.jsxs)("div", { className: "login-page registration-page", children: [H.type && (0, _i.jsx)("div", { className: "modal-overlay", onClick: Y, children: (0, _i.jsxs)("div", { className: "modal-box", onClick: e => e.stopPropagation(), children: [(0, _i.jsxs)("div", { className: "modal-header ".concat(H.type), children: [(0, _i.jsxs)("div", { className: "modal-icon", children: ["success" === H.type && "\u2705", "error" === H.type && "\u274c", "warning" === H.type && "\u26a0\ufe0f"] }), (0, _i.jsx)("h3", { children: H.title }), (0, _i.jsx)("button", { className: "modal-close", onClick: Y, children: "\u2715" })] }), (0, _i.jsx)("p", { className: "modal-message", children: H.message }), (0, _i.jsx)("div", { className: "modal-actions", children: (0, _i.jsx)("button", { className: "modal-btn", onClick: Y, children: "success" === H.type ? "Continue" : "Dismiss" }) })] }) }), (0, _i.jsx)("div", { className: "login-left", children: (0, _i.jsxs)("div", { className: "promo-box", children: [(0, _i.jsxs)("h1", { children: ["Up to ", (0, _i.jsx)("span", { children: "500 USD" })] }), (0, _i.jsx)("h2", { children: "Sign Up Rewards" }), (0, _i.jsx)("img", { src: "/promo.png", alt: "promo", className: "promo-img" }), (0, _i.jsxs)("div", { className: "promo-text", children: [(0, _i.jsxs)("p", { children: [(0, _i.jsx)(Di, { className: "check-icon" }), " 316,616,661 Users Trust SwanCore"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)(Di, { className: "check-icon" }), " No.1 Trading Volume & Customer Asset"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)(Di, { className: "check-icon" }), " 1,000,000,000 USDC SAFU Fund"] }), (0, _i.jsxs)("p", { className: "safu-wallet", children: [(0, _i.jsx)("span", { className: "safu-label", children: "SAFU Wallet:" }), " ", "0x420ef1f25563593aF5FE3f9b9d3bC56a8bd47c8"] })] })] }) }), (0, _i.jsx)("div", { className: "login-middle", children: (0, _i.jsxs)("p", { children: ["Already have an account?", " ", (0, _i.jsx)("span", { className: "link", onClick: () => e("/login"), children: "Sign in here" })] }) }), (0, _i.jsx)("div", { className: "login-right", children: (0, _i.jsxs)("div", { className: "login-card", children: [(0, _i.jsxs)("div", { className: "brand", children: [(0, _i.jsx)("img", { src: Ui, alt: "SwanCore", className: "brand-logo" }), (0, _i.jsx)("span", { className: "brand-text", children: "SwanCore" })] }), (0, _i.jsx)("h2", { children: "Welcome to SwanCore" }), 1 === n && (0, _i.jsxs)("form", { onSubmit: async (e) => { if (e.preventDefault(), k(!0), !o.trim())
                                        return G("warning", "Email Required", "Please enter your email address"), void k(!1); if (!(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))(o))
                                        return G("error", "Invalid Email", "Please enter a valid email address"), void k(!1); try {
                                        var t;
                                        const e = await jo(), n = await Ai.post("".concat(e, "/api/auth/send-otp"), { email: o.toLowerCase().trim() }, { headers: { "Content-Type": "application/json" } });
                                        (null === (t = n.data.success) || void 0 === t || t) && (L(n.data.otpId || o.toLowerCase().trim()), M(0), B(60), i(2), G("success", "OTP Sent", "Verification code sent to ".concat(o, ". Check your inbox.")));
                                    }
                                    catch (a) {
                                        var n, r;
                                        const e = (null === a || void 0 === a || null === (n = a.response) || void 0 === n || null === (r = n.data) || void 0 === r ? void 0 : r.message) || "Failed to send OTP. Please try again.";
                                        G("error", "OTP Error", e), console.error("OTP Send Error:", a);
                                    }
                                    finally {
                                        k(!1);
                                    } }, className: "login-form", children: [j && (0, _i.jsx)("div", { className: "verification-overlay", children: (0, _i.jsxs)("div", { className: "verification-message", children: [(0, _i.jsx)(Ii, { className: "spinner" }), " Please wait while we send your verification code..."] }) }), (0, _i.jsxs)("div", { className: "form-group", children: [(0, _i.jsx)("label", { htmlFor: "email", children: "Email Address" }), (0, _i.jsx)("input", { id: "email", type: "email", placeholder: "your@email.com", value: o, onChange: e => s(e.target.value), disabled: j, required: !0 })] }), (0, _i.jsxs)("div", { className: "agreement", children: [(0, _i.jsx)("div", { className: "checkbox-row", children: (0, _i.jsx)("input", { type: "checkbox", required: !0, defaultChecked: !0 }) }), (0, _i.jsxs)("span", { className: "agreement-text", children: ["By creating an account, I agree to SwanCore's", " ", (0, _i.jsx)("span", { className: "link", onClick: () => e("/privacy"), children: "Privacy Notice" }), " ", "and", " ", (0, _i.jsx)("span", { className: "link", onClick: () => e("/terms"), children: "Terms of Service" })] })] }), (0, _i.jsx)("button", { type: "submit", className: "login-btn", disabled: j, children: j ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)(Ii, { className: "spinner" }), " Verifying..."] }) : "Continue" }), (0, _i.jsx)("div", { className: "divider", children: (0, _i.jsx)("span", { children: "or" }) }), (0, _i.jsxs)("button", { type: "button", className: "social-btn", disabled: j, children: [(0, _i.jsx)("img", { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg", alt: "Google" }), "Continue with Google"] }), (0, _i.jsxs)("button", { type: "button", className: "social-btn", disabled: j, children: [(0, _i.jsx)("img", { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", alt: "Apple", className: "apple-icon" }), "Continue with Apple"] }), (0, _i.jsxs)("div", { className: "bottom-auth", children: [(0, _i.jsx)("span", { onClick: () => e("/register"), children: "Sign Up" }), (0, _i.jsx)("span", { className: "or", children: "or" }), (0, _i.jsx)("span", { onClick: () => e("/login"), children: "Log in" })] })] }), 2 === n && (0, _i.jsxs)("form", { onSubmit: async (e) => { if (e.preventDefault(), k(!0), !c.trim())
                                        return G("warning", "OTP Required", "Please enter the verification code"), void k(!1); if (6 !== c.length && 8 !== c.length)
                                        return G("warning", "Invalid OTP", "Verification code should be 6-8 digits"), void k(!1); try {
                                        const e = await jo(), t = await Ai.post("".concat(e, "/api/auth/verify-otp"), { email: o.toLowerCase().trim(), otp: c.trim(), otpId: P });
                                        t.data.success && (E(t.data.token || t.data.sessionToken || ""), M(0), i(3), G("success", "OTP Verified", "Proceeding to password setup..."));
                                    }
                                    catch (r) {
                                        var t, n;
                                        const e = (null === r || void 0 === r || null === (t = r.response) || void 0 === t || null === (n = t.data) || void 0 === n ? void 0 : n.message) || "Invalid OTP. Please try again.";
                                        M(e => e + 1), F >= 4 ? (G("error", "Too Many Attempts", "Maximum OTP attempts exceeded. Please resend OTP."), i(1)) : G("error", "Invalid OTP", "".concat(e, " (Attempt ").concat(F + 1, "/5)")), console.error("OTP Verify Error:", r);
                                    }
                                    finally {
                                        k(!1);
                                    } }, className: "login-form", children: [j && (0, _i.jsx)("div", { className: "verification-overlay", children: (0, _i.jsxs)("div", { className: "verification-message", children: [(0, _i.jsx)(Ii, { className: "spinner" }), " Please wait while we verify your code..."] }) }), (0, _i.jsx)("div", { className: "step-info", children: (0, _i.jsxs)("p", { children: ["Verification code sent to ", (0, _i.jsx)("strong", { children: o })] }) }), (0, _i.jsxs)("div", { className: "form-group", children: [(0, _i.jsx)("label", { htmlFor: "otp", children: "Verification Code" }), (0, _i.jsx)("input", { id: "otp", type: "text", placeholder: "000000", value: c, onChange: e => d(e.target.value.replace(/\D/g, "").slice(0, 8)), disabled: j, maxLength: 8, required: !0, className: "otp-input" }), (0, _i.jsx)("small", { className: "otp-hint", children: "Enter the 6-8 digit code from your email" })] }), (0, _i.jsx)("button", { type: "submit", className: "login-btn", disabled: j || c.length < 6, children: j ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)(Ii, { className: "spinner" }), " Verifying..."] }) : "Verify Code" }), (0, _i.jsx)("button", { type: "button", className: "resend-btn", onClick: async () => { k(!0); try {
                                                var e;
                                                const t = await jo(), n = await Ai.post("".concat(t, "/api/auth/resend-otp"), { email: o.toLowerCase().trim(), otpId: P });
                                                (null === (e = n.data.success) || void 0 === e || e) && (M(0), B(60), d(""), L(n.data.otpId || P), G("success", "OTP Resent", "New verification code sent to ".concat(o)));
                                            }
                                            catch (r) {
                                                var t, n;
                                                const e = (null === r || void 0 === r || null === (t = r.response) || void 0 === t || null === (n = t.data) || void 0 === n ? void 0 : n.message) || "Failed to resend OTP";
                                                G("error", "Resend Failed", e), console.error("Resend OTP Error:", r);
                                            }
                                            finally {
                                                k(!1);
                                            } }, disabled: z > 0 || j, children: z > 0 ? "Resend in ".concat(z, "s") : "Resend Code" }), (0, _i.jsx)("button", { type: "button", className: "back-btn", onClick: () => i(1), disabled: j, children: "\u2190 Change Email" })] }), 3 === n && (0, _i.jsxs)("form", { onSubmit: async (t) => { if (t.preventDefault(), k(!0), h.length < 8)
                                        return G("warning", "Password Too Short", "Password must be at least 8 characters long"), void k(!1); if (!/[A-Z]/.test(h))
                                        return G("warning", "Missing Uppercase", "Password must contain at least 1 uppercase letter"), void k(!1); if (!/[a-z]/.test(h))
                                        return G("warning", "Missing Lowercase", "Password must contain at least 1 lowercase letter"), void k(!1); if (!/[0-9]/.test(h))
                                        return G("warning", "Missing Number", "Password must contain at least 1 number"), void k(!1); if (!/[!@#$%^&*]/.test(h))
                                        return G("warning", "Missing Special Character", "Password must contain at least 1 special character (!@#$%^&*)"), void k(!1); if (["123456", "password", "qwerty", "111111", "abc123", "123123"].includes(h.toLowerCase()))
                                        return G("warning", "Weak Password", "Please choose a stronger password"), void k(!1); try {
                                        const t = await jo(), r = await Ai.post("".concat(t, "/api/auth/set-password"), { email: o.toLowerCase().trim(), password: h, sessionToken: A });
                                        var n;
                                        if (r.data.success)
                                            localStorage.setItem("token", r.data.token || r.data.sessionToken || ""), localStorage.removeItem("sessionToken"), localStorage.setItem("userEmail", o), localStorage.setItem("userId", (null === (n = r.data.user) || void 0 === n ? void 0 : n.userId) || ""), r.data.expiresIn && localStorage.setItem("sessionExpiry", (Date.now() + 1e3 * r.data.expiresIn).toString()), _(!0), setTimeout(() => { e("/home"); }, 3e3);
                                        else
                                            G("error", "Account Creation Failed", r.data.message || "Unable to complete registration. Please try again.");
                                    }
                                    catch (a) {
                                        var r, i;
                                        const e = (null === a || void 0 === a || null === (r = a.response) || void 0 === r || null === (i = r.data) || void 0 === i ? void 0 : i.message) || "Failed to create account";
                                        G("error", "Account Creation Error", e), console.error("Password Setup Error:", a);
                                    }
                                    finally {
                                        k(!1);
                                    } }, className: "login-form", children: [(0, _i.jsx)("div", { className: "step-info", children: (0, _i.jsx)("p", { children: "Create your secure password" }) }), (0, _i.jsxs)("div", { className: "form-group", children: [(0, _i.jsx)("label", { htmlFor: "password", children: "Password" }), (0, _i.jsxs)("div", { className: "password-input-wrapper", children: [(0, _i.jsx)("input", { id: "password", type: m ? "text" : "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: h, onChange: e => { const t = e.target.value; var n; f(t), v((n = t).length < 8 ? "Weak" : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(n) ? "Strong" : "Medium"); }, disabled: j, required: !0 }), (0, _i.jsx)("button", { type: "button", className: "toggle-password", onClick: () => x(!m), children: m ? (0, _i.jsx)(Fi, {}) : (0, _i.jsx)(Mi, {}) })] })] }), h && (0, _i.jsxs)("div", { className: "strength-indicator ".concat(y.toLowerCase()), children: [(0, _i.jsx)("div", { className: "strength-bar", children: (0, _i.jsx)("div", { className: "strength-fill", style: { width: "Weak" === y ? "33%" : "Medium" === y ? "66%" : "100%" } }) }), (0, _i.jsxs)("span", { className: "strength-text", children: ["Strength: ", (0, _i.jsx)("strong", { children: y })] })] }), (0, _i.jsxs)("div", { className: "password-requirements", children: [(0, _i.jsx)("p", { className: "req-title", children: "Password must contain:" }), (0, _i.jsxs)("ul", { children: [(0, _i.jsxs)("li", { className: h.length >= 8 ? "met" : "", children: [h.length >= 8 ? "\u2713" : "\u25cb", " At least 8 characters"] }), (0, _i.jsxs)("li", { className: /[A-Z]/.test(h) ? "met" : "", children: [/[A-Z]/.test(h) ? "\u2713" : "\u25cb", " Uppercase letter (A-Z)"] }), (0, _i.jsxs)("li", { className: /[a-z]/.test(h) ? "met" : "", children: [/[a-z]/.test(h) ? "\u2713" : "\u25cb", " Lowercase letter (a-z)"] }), (0, _i.jsxs)("li", { className: /[0-9]/.test(h) ? "met" : "", children: [/[0-9]/.test(h) ? "\u2713" : "\u25cb", " Number (0-9)"] }), (0, _i.jsxs)("li", { className: /[!@#$%^&*]/.test(h) ? "met" : "", children: [/[!@#$%^&*]/.test(h) ? "\u2713" : "\u25cb", " Special character (!@#$%^&*)"] })] })] }), (0, _i.jsx)("button", { type: "submit", className: "login-btn", disabled: j || "Strong" !== y, children: j ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)(Ii, { className: "spinner" }), " Creating Account..."] }) : "Create Account" }), (0, _i.jsx)("button", { type: "button", className: "back-btn", onClick: () => i(2), disabled: j, children: "\u2190 Back to Verification" })] })] }) }), (0, _i.jsxs)("div", { className: "footer-bar", children: [(0, _i.jsxs)("div", { className: "footer-left", onClick: X, children: ["\ud83c\udf10 ", q[K]] }), (0, _i.jsxs)("div", { className: "footer-links", children: [(0, _i.jsx)("span", { onClick: () => e("/cookies"), children: "Cookies" }), (0, _i.jsx)("span", { onClick: () => e("/terms"), children: "Terms" }), (0, _i.jsx)("span", { onClick: () => e("/privacy"), children: "Privacy" })] })] }), N && (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("div", { className: "lang-overlay", onClick: X }), (0, _i.jsxs)("div", { className: "lang-panel open", children: [(0, _i.jsxs)("div", { className: "lang-header", children: [(0, _i.jsx)("span", { children: "Select Language" }), (0, _i.jsx)("button", { onClick: X, children: "\u2715" })] }), (0, _i.jsx)("div", { className: "lang-list", children: Object.entries(q).map(e => { let t = u(e, 2), n = t[0], r = t[1]; return (0, _i.jsx)("div", { className: "lang-item ".concat(n === K ? "active" : ""), onClick: () => { return e = n, je.changeLanguage(e), localStorage.setItem("lang", e), void C(!1); var e; }, children: r }, n); }) })] })] })] })] }); };
    function Ro() { const e = u((0, r.useState)([]), 2), t = e[0], n = e[1], i = u((0, r.useState)([]), 2), a = i[0], o = i[1], s = u((0, r.useState)([]), 2), l = s[0], c = s[1], d = u((0, r.useState)([]), 2), p = d[0], h = d[1], f = u((0, r.useState)([]), 2), g = f[0], x = f[1], b = u((0, r.useState)(!0), 2), y = b[0], v = b[1], w = u((0, r.useState)(""), 2), j = w[0], k = w[1], S = u((0, r.useState)(null), 2), N = S[0], C = S[1], T = e => null == e || Number.isNaN(Number(e)) ? "-" : Number(e).toLocaleString(void 0, { style: "currency", currency: "USD", maximumFractionDigits: 2 }), A = e => { if (null == e || Number.isNaN(Number(e)))
        return "-"; const t = Number(e), n = Math.abs(t) < .1 ? 4 : 2; return "".concat(t.toFixed(n), "%"); }, E = e => null == e || Number.isNaN(Number(e)) ? "-" : Number(e).toLocaleString(void 0, { maximumFractionDigits: 0 }), R = e => null == e || Number.isNaN(Number(e)) ? "-" : Number(e).toLocaleString(void 0, { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 2 }), P = e => null == e || Number.isNaN(Number(e)) ? "" : Number(e) > 0 ? "green" : Number(e) < 0 ? "red" : "", L = e => null == e || Number.isNaN(Number(e)) ? "" : Number(e) > 0 ? "+" : "", O = e => m(m({}, e), {}, { current_price: Number(null === e || void 0 === e ? void 0 : e.current_price), price_change_24h: Number(null === e || void 0 === e ? void 0 : e.price_change_24h), price_change_percentage_24h: Number(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h), total_volume: Number(null === e || void 0 === e ? void 0 : e.total_volume), market_cap: Number(null === e || void 0 === e ? void 0 : e.market_cap) }), z = async () => { try {
        if (!N)
            return;
        k("");
        const t = [N, N === mo ? "https://fishing-recipient-outstanding-oak.trycloudflare.com" : mo];
        let r = null, i = null;
        for (const n of t)
            try {
                r = (await Ai.get("".concat(n, "/api/coins"))).data, i = n;
                break;
            }
            catch (e) { }
        if (!r)
            throw new Error("Both local and cloud sources are unreachable");
        if (i !== N && (C(i), yo(i)), !Array.isArray(r))
            return k("Invalid data from server"), void v(!1);
        const a = r.map(O);
        n(a), o(a.slice(0, 3));
        const s = [...a].filter(e => null != (null === e || void 0 === e ? void 0 : e.price_change_percentage_24h)).sort((e, t) => t.price_change_percentage_24h - e.price_change_percentage_24h);
        c(s.slice(0, 3));
        const l = [...a].filter(e => null != (null === e || void 0 === e ? void 0 : e.total_volume)).sort((e, t) => t.total_volume - e.total_volume);
        h(l.slice(0, 3));
        const d = [...a].sort(() => .5 - Math.random());
        x(d.slice(0, 3)), v(!1);
    }
    catch (Rl) {
        console.log("Market error:", Rl.message), 0 === t.length ? k("Backend not reachable") : k("Unable to refresh market data"), v(!1);
    } }; return (0, r.useEffect)(() => { (async () => { const e = await ko(); C(e); })(); }, []), (0, r.useEffect)(() => { if (!N)
        return; z(); const e = setInterval(z, 1e4); return () => clearInterval(e); }, [N]), (0, _i.jsxs)("div", { className: "markets-container", children: [(0, _i.jsx)("div", { className: "markets-header", children: (0, _i.jsx)("h1", { children: "\ud83d\udcca Markets" }) }), j && (0, _i.jsxs)("div", { style: { color: "#f6465d", padding: "10px" }, children: ["\u26a0\ufe0f ", j] }), (0, _i.jsxs)("div", { className: "top-cards", children: [(0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("div", { className: "card-title", children: "Hot" }), y ? "Loading..." : a.map(e => { var t; return (0, _i.jsxs)("div", { className: "mini-row", children: [(0, _i.jsx)("span", { children: null === e || void 0 === e || null === (t = e.symbol) || void 0 === t ? void 0 : t.toUpperCase() }), (0, _i.jsx)("span", { children: T(null === e || void 0 === e ? void 0 : e.current_price) }), (0, _i.jsx)("span", { className: P(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h), children: A(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h) })] }, e.id); })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("div", { className: "card-title", children: "New" }), y ? "Loading..." : g.map(e => { var t; return (0, _i.jsxs)("div", { className: "mini-row", children: [(0, _i.jsx)("span", { children: null === e || void 0 === e || null === (t = e.symbol) || void 0 === t ? void 0 : t.toUpperCase() }), (0, _i.jsx)("span", { children: T(null === e || void 0 === e ? void 0 : e.current_price) }), (0, _i.jsx)("span", { className: P(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h), children: A(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h) })] }, e.id); })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("div", { className: "card-title", children: "Top Gainer" }), y ? "Loading..." : l.map(e => { var t; return (0, _i.jsxs)("div", { className: "mini-row", children: [(0, _i.jsx)("span", { children: null === e || void 0 === e || null === (t = e.symbol) || void 0 === t ? void 0 : t.toUpperCase() }), (0, _i.jsx)("span", { children: T(null === e || void 0 === e ? void 0 : e.current_price) }), (0, _i.jsxs)("span", { className: P(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h), children: [L(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h), A(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h)] })] }, e.id); })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("div", { className: "card-title", children: "Top Volume" }), y ? "Loading..." : p.map(e => { var t; return (0, _i.jsxs)("div", { className: "mini-row", children: [(0, _i.jsx)("span", { children: null === e || void 0 === e || null === (t = e.symbol) || void 0 === t ? void 0 : t.toUpperCase() }), (0, _i.jsx)("span", { children: T(null === e || void 0 === e ? void 0 : e.current_price) }), (0, _i.jsx)("span", { children: R(null === e || void 0 === e ? void 0 : e.total_volume) })] }, e.id); })] })] }), (0, _i.jsxs)("div", { className: "table-header", children: [(0, _i.jsx)("div", { className: "cell", children: "Name" }), (0, _i.jsx)("div", { className: "cell right", children: "Price" }), (0, _i.jsx)("div", { className: "cell right", children: "24h %" }), (0, _i.jsx)("div", { className: "cell right", children: "Volume" }), (0, _i.jsx)("div", { className: "cell right", children: "Market Cap" })] }), y ? (0, _i.jsx)("div", { style: { padding: "20px" }, children: "Loading market data..." }) : t.map(e => { var t; return (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsxs)("div", { className: "cell name", children: [(0, _i.jsx)("img", { src: null === e || void 0 === e ? void 0 : e.image, alt: null === e || void 0 === e ? void 0 : e.name }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { className: "symbol", children: null === e || void 0 === e || null === (t = e.symbol) || void 0 === t ? void 0 : t.toUpperCase() }), (0, _i.jsx)("div", { className: "fullname", children: null === e || void 0 === e ? void 0 : e.name })] })] }), (0, _i.jsx)("div", { className: "cell right price", children: T(null === e || void 0 === e ? void 0 : e.current_price) }), (0, _i.jsx)("div", { className: "cell right ".concat(P(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h)), children: A(null === e || void 0 === e ? void 0 : e.price_change_percentage_24h) }), (0, _i.jsx)("div", { className: "cell right volume", children: E(null === e || void 0 === e ? void 0 : e.total_volume) }), (0, _i.jsx)("div", { className: "cell right marketcap", children: E(null === e || void 0 === e ? void 0 : e.market_cap) })] }, e.id); })] }); }
    function Po() { return (0, _i.jsx)("h1", { style: { padding: 40 }, children: "Discover Page" }); }
    function Lo() { return (0, _i.jsxs)("div", { className: "privacy-hero", children: [(0, _i.jsxs)("div", { className: "hero-text", children: [(0, _i.jsx)("h1", { children: "Swancore Privacy Portal" }), (0, _i.jsx)("h3", { children: "Your Data, Your Control" }), (0, _i.jsx)("p", { children: "Welcome to our Privacy Portal. This page is designed to help you easily understand the key aspects of our Privacy Program and clearly know your rights regarding your personal data. At SwanCore, we are fully committed to protecting your privacy and securing your information. Safeguarding your personal data is a top priority for us. We follow strict internal controls, global regulatory standards, and industry-leading security practices to ensure your data remains protected, confidential, and used only for legitimate and authorized financial purposes." })] }), (0, _i.jsx)("div", { className: "hero-image", children: (0, _i.jsx)("img", { src: "/privacy/lock.png", alt: "Privacy Lock" }) })] }); }
    function Oo() { return (0, _i.jsxs)("div", { className: "region-container", children: [(0, _i.jsx)("h1", { className: "title", children: "Privacy Notice Dashboard" }), (0, _i.jsxs)("div", { className: "region-table", children: [(0, _i.jsx)("div", { className: "row full", children: "GLOBAL" }), (0, _i.jsx)("div", { className: "row full section", children: "APAC" }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell", children: "Australia" }), (0, _i.jsx)("div", { className: "cell", children: "Japan (Japanese | English)" })] }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell", children: "New Zealand" }), (0, _i.jsx)("div", { className: "cell" })] }), (0, _i.jsx)("div", { className: "row full section", children: "Europe" }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell", children: "France" }), (0, _i.jsx)("div", { className: "cell", children: "Italy" })] }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell", children: "Poland" }), (0, _i.jsx)("div", { className: "cell", children: "Portugal" })] }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell", children: "Spain" }), (0, _i.jsx)("div", { className: "cell", children: "UK" })] }), (0, _i.jsx)("div", { className: "row full section highlight", children: "LATAM" }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell", children: "Argentina" }), (0, _i.jsx)("div", { className: "cell", children: "Brazil" })] }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell wide", children: "Latin America, excluding Argentina, Mexico and Brazil" }), (0, _i.jsx)("div", { className: "cell", children: "Mexico" })] }), (0, _i.jsx)("div", { className: "row full section", children: "MENA" }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell", children: "Bahrain (Arabic | English)" }), (0, _i.jsx)("div", { className: "cell", children: "Dubai" })] }), (0, _i.jsxs)("div", { className: "row", children: [(0, _i.jsx)("div", { className: "cell", children: "Kazakhstan (Kazakh | Russian)" }), (0, _i.jsx)("div", { className: "cell" })] })] })] }); }
    function zo() { return (0, _i.jsxs)("div", { className: "principles-section", children: [(0, _i.jsx)("h2", { className: "principles-title", children: "Swancore's Privacy Principles" }), (0, _i.jsxs)("div", { className: "principles-grid", children: [(0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "Transparency" }), (0, _i.jsx)("p", { children: "Our commitment to transparency ensures that you are always aware of how your data is collected, used, and shared across our platform. We continuously update this portal and our privacy policies to reflect any important changes that may impact you. This approach is designed to keep you fully informed and in control, enabling you to make confident and well-informed decisions about your personal data and financial interactions with us." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "Data Minimization" }), (0, _i.jsx)("p", { children: "We have established robust governance and control frameworks focused on data minimization, ensuring that every Swancore product and service collects only the user data that is necessary for clearly defined purposes. Our Privacy Notice clearly outlines the specific and legitimate business reasons for data collection, reflecting our commitment to responsible data handling and maintaining trust across all financial services we provide." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "Privacy & Security" }), (0, _i.jsx)("p", { children: "We place the highest priority on your privacy and security, applying strong protective measures to safeguard your data against loss, misuse, or any unauthorized access, while maintaining strict internal access controls. Our advanced encryption technologies and secure verification protocols help ensure the confidentiality, integrity, and reliability of your personal information. We also maintain well-structured processes to ensure that privacy and data protection are embedded into every product and service from the very beginning. Our dedicated privacy team collaborates closely with our engineering and product teams to implement \u201cprivacy by design and by default,\u201d fully aligned with global regulatory standards and financial compliance requirements." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "Accountability & User's Rights" }), (0, _i.jsx)("p", { children: "We take our privacy obligations with the utmost seriousness and operate in full alignment with applicable global data protection laws and regulatory frameworks. To maintain the highest level of trust, we conduct regular compliance audits and continuously refine our internal processes to strengthen data protection, security, and privacy standards. Our privacy and security program has also earned recognized certifications across multiple jurisdictions in which we operate, reflecting our commitment to global best practices. We fully recognize and respect your fundamental rights regarding your personal data. To make these rights easy to exercise, we provide user-friendly tools within the Binance app as well as a dedicated web form where you can submit requests and receive support. For detailed information about the rights available in your region, please refer to our Privacy Notice via the link below. If you wish to exercise any of your rights, kindly review the section titled \u201cExercising your Privacy Rights\u201d on this page for step-by-step guidance." })] })] })] }); }
    function Bo() { const e = u((0, r.useState)("personal"), 2), t = e[0], n = e[1]; return (0, _i.jsxs)("div", { className: "data-section", children: [(0, _i.jsx)("h2", { className: "section-title", children: "How Swancore uses your data" }), (0, _i.jsxs)("div", { className: "tabs", children: [(0, _i.jsx)("span", { className: "personal" === t ? "active" : "", onClick: () => n("personal"), children: "What is Personal Data?" }), (0, _i.jsx)("span", { className: "usage" === t ? "active" : "", onClick: () => n("usage"), children: "Using your Data" }), (0, _i.jsx)("span", { className: "retention" === t ? "active" : "", onClick: () => n("retention"), children: "Retention" }), (0, _i.jsx)("span", { className: "sharing" === t ? "active" : "", onClick: () => n("sharing"), children: "Sharing" }), (0, _i.jsx)("span", { className: "cookies" === t ? "active" : "", onClick: () => n("cookies"), children: "Cookies" })] }), (0, _i.jsxs)("div", { className: "tab-content", children: ["personal" === t && (0, _i.jsxs)("div", { className: "tab-box", children: [(0, _i.jsx)("h3", { children: "Definition of personal data" }), (0, _i.jsx)("p", { children: "Personal data refers to any information that identifies an individual or can be used to recognize an identifiable person. This includes details you directly share with us, information collected automatically through your use of our services, and data obtained from trusted third-party sources. Such information may include your name, Swancore ID, location data, email address, and any other data points which, when combined, could reasonably be used to identify an individual." })] }), "usage" === t && (0, _i.jsxs)("div", { className: "tab-box", children: [(0, _i.jsx)("h3", { children: "How we use your data?" }), (0, _i.jsx)("p", { children: "We collect and process your personal data to deliver secure, reliable, and efficient services. This includes maintaining and managing your account, fulfilling legal and regulatory obligations such as Anti-Money Laundering requirements, and communicating important service-related updates. We also use this information to protect the safety, security, and integrity of our platform and its users. In addition, your personal data may be used to provide customer support, enhance and improve our services, send relevant marketing communications where permitted, and facilitate smooth and efficient transaction processing across our platform." })] }), "retention" === t && (0, _i.jsxs)("div", { className: "tab-box", children: [(0, _i.jsx)("h3", { children: "Data retention" }), (0, _i.jsx)("p", { children: "We retain your personal data for as long as it is necessary to provide you with continued access to SwanCore services and to ensure a secure and compliant user experience. This retention is based on the purposes outlined in our Privacy Notice, including fulfilling legal and regulatory obligations such as taxation, accounting standards, Anti-Money Laundering requirements, as well as managing disputes, legal claims, and other compliance-related needs where applicable. For detailed information on how long specific categories of personal data are stored, please refer to the Privacy Notice relevant to your jurisdiction by selecting your country of residence through the link below." })] }), "sharing" === t && (0, _i.jsxs)("div", { className: "tab-box", children: [(0, _i.jsx)("h3", { children: "Is my data shared with third parties?" }), (0, _i.jsx)("p", { children: "In accordance with applicable laws, regulations, and compliance requirements, we may share your personal data with trusted third parties, including other SwanCore affiliated entities, where necessary to fulfill contractual obligations, meet legal and regulatory duties, or support essential business operations. Whenever such sharing takes place, we ensure your data remains protected through our Privacy Notice provisions or other appropriate safeguard mechanisms designed to maintain the highest standards of privacy, security, and data integrity." })] }), "cookies" === t && (0, _i.jsxs)("div", { className: "tab-box", children: [(0, _i.jsx)("h3", { children: "How do we use cookies?" }), (0, _i.jsx)("p", { children: "We utilize cookies and similar technologies to improve your overall experience, optimize the delivery of our services, and support more effective marketing strategies. These tools also help us understand how users interact with our platform, enabling us to continuously enhance performance, usability, and customer satisfaction. Depending on the applicable regulations in your region, the cookie consent banner on your browser allows you to manage your preferences, including accepting or rejecting certain types of cookies. For more detailed information, you can refer to our full Cookie Policy." })] })] })] }); }
    function Do() { return (0, _i.jsxs)("div", { className: "privacy-page", children: [(0, _i.jsx)("section", { className: "section-block", children: (0, _i.jsx)(Lo, {}) }), (0, _i.jsx)("section", { className: "section-block", children: (0, _i.jsx)(Oo, {}) }), (0, _i.jsx)("section", { className: "section-block", children: (0, _i.jsx)(zo, {}) }), (0, _i.jsx)("section", { className: "section-block", children: (0, _i.jsx)(Bo, {}) })] }); }
    function Fo() { return (0, _i.jsxs)("div", { style: { padding: 20 }, children: [(0, _i.jsx)("h1", { children: "Terms & Conditions" }), (0, _i.jsx)("p", { children: "Your terms go here..." })] }); }
    function Mo() { return (0, _i.jsxs)("div", { style: { padding: 20 }, children: [(0, _i.jsx)("h1", { children: "Cookies Policy" }), (0, _i.jsx)("p", { children: "Cookie details go here..." })] }); }
    const Io = n.p + "static/media/phone.59da7fd384d40cc71547.png", Uo = () => (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsxs)("div", { className: "ticker-item", children: [(0, _i.jsx)("img", { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABsCAYAAACy9DarAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABc6SURBVHhe7d11exzHsgfg8zFuyLFkjJliZmZmZrZjO5wDNznBc7/03HprtqXRau0ka2+kec78UY92ehrr14Xdu/rbex+MV2cuP6huPPyquvno645aQLCCGez+9v6H41mwfPXmav6iFR21gGAFM9glgFD14n/en9tRCwhWMOsAbCl1ALacOgBbTh2ALacOwJZTB2DLqQOw5dQB2HLqAGw5dQC2nDoAW04dgC2nDsCWUwdgy6kDsOXUAdhymnEA3/tg7A/RoLbDUt3fu+1zpmhGARybv7RaumL979KSoPEFywb28WfowzkLqvmLV1bLVm2qFi9bO7BO22hGAVyweFV1/Nyt6uGrH6rHn/876faT76ord14m3Xr8bfXw5ff5/sCxiwP7+CNE4rbuPlrdjv4evPjfHOfkhTsD67aNZhRAjP14/JPq2r3Pq8++/U/14rv/C6AupaSgufFu576TAeIP1enL9wf28UfIOB98NK/atudY9fybX2Os36oT528PrNs2mlEAEca6FlcA3Hv43JT37384r9of0nfq4r3e83j1frRJis/T7GM8u2JX3iF9GGfVum3Vky9/DhB/q46cutZ7N1l3Sj89yjrRVvtB9Uof3r+uzihpxgHEnGNnbw4EsDBi4Serq22hAj/8eEG1ZeeRrH/i/J1q14HT8W5Vr14N1ryFy6v1W/ZVuw+eqeaMLQ57t7E6HtJ26MSVauXardWTL35KAPWxbuOuHG/73uOhzldOYbzPtMCGrfuqo2duVCcv3q127DuRtrjU83fx0rUx1uncYKR614FT1Tz8a/Q1SpoVAB49cz0BRJikHHPWBoPnzF1UvRfzAsStx9+kjZy/aGXeh7z3/J/Vo7CPm7YfrD4KcI+FPX361S8JENu5ZdeRfP/8619TyguAxnGX8sjpa6m+n8X7By++rz7dvGdiXouWrEk7zP6SXHN5/PmP1fX7X+SGMr8163dUj8KeXrn7qvpk+afV0pUb4vPLBJI0lr5GSbMOQFJF0oB0NZjLU10QUsb5AMyB45cm1NW+oxeyDZAWhSSwp3ee/j0lWd07z/6eAAETACvXbqkBjHdHT1/PPoyjb/3c/+xfKdEfzV1Y3Xz4dQJ79uqjZA5pvvfZP7NfIH04Z37W0W5/zIOaBuqS5eurw6eu/vcCeOnWZykZl2+/SMaOL1ieoGIcxgOCjcMsu14bgB0+eTWlldR4JjmkyGawCbxbsaYGUF9sYM4h+jl54W7081sA9ku1cduBnq2s65FiqhSoJF7f5kXlkmzPt4Jn6zbtzjofBLAkndboX+soaHZKoHgt5kB62DT2rkgV0ICnrXdPv/q5ZmKo14/HF1cXbz3P5/shLYAr42izYs3m6QAGCTGAoZw07TtyPj57/jVDmQs3nsbGel7dDYkmpbcefZPzsFm0MW/gX7r5vFr16bacf5njqGmWAHijAeCpLMeA9Vv2Jgjnrj0eCCCHgvr07l4wlgodBkBSR10qp6IPhTT7rGzLzsPV3HmfTCEbBa8W9uxkAdG4bDCHh+SX/kdJMw4gW2HBhQH9Xqg5Cbq9o0Lt8AIgCaTqvKN6Pw47NQyAxiyAbd5xqNq66+gEoHv6wppC5v1RqGXzo3I5LvpOECNUke0Z1O5d06wA8MyVyTiQu18AqmksGHpkYpdvj2DcPL1jh5ShTTt4ogtT1emHDWym35oA2ggFQOXA14c2Umxs5eMvfsyyu8/+0dsIk3PSBkDUPQ3i2dhFk1DrQC31R0kzCqCFz523pLoWrrmFYzx1Sf14V+qRNO47EM/He8ziLLBVnI/Lt0P6Qq1xIoQZKQWhyqTqODxlrHRiQmKNdTrCCusVjggFlO8M9f3BR/OzbyFJLYXhiV55mDHj4mXrsg8ZHQACF+DaGPtEaArzuXY/vOdYV5n/KGlGAZSkFlDz6ux+RPUdOnkl35V6Begrd16kEyG9tjlsEwZevPmsGg+ASQKJ4ClmXy9/qI5H38tX16qsAOi9XOjFcDjWbdoVG+PLKPtHSnnT9eeImIe5ARfIxtZOWLNo6Zqcq9Di0InL4Tlfr+5H3ZsRXy7oxYmlr1HSjALI6Vi0ZPU0Eih711/fTgfs6k+3p4oS+xWmkzQxXH9fTTuorjqSAvpYHYE4CRybH9IygOE2hTjRWOo6GSH95T0VTRJX6StIv+xis49R04wCWBPG9dOgejXZ2YUGp6ua/Qx6P7WP7GdAnSa9qW7z3aD3o6ZZAGBHb0MdgC2nDsCWU+sALHamaXPK5yYNKu9v11+nLpvettSdjdQqADHTicKKoNXrt6frz2MV3PMOt+89kWHJzv2n8jRfGffeKT8vUnupMvGc/uaMLcorHQcjDJBOE//J9EjXCfqdWEgsvIv7OKOioQDEiA1b9+eiR03l7K2My6WX/HaUdOfpdwHWyWrH3uOZNxW3CRuc4B8+dS3zluevP0n3/8L1p9lenFayJOpKmBvj2NlbeYoAfOGKdjaIuk1+4JFEg3Bh5BQbsKz9dTQ0gGevPqzOXX00chJfNRchLjNHAMmmyNCI5Q6GZCXzQ4okoB3gAujGgy8zu7Mr3iWA0bb06f3Ve6/yL8l0KoEHxpEAcKx1+tL9lMYyh7EFSzOBLdsyanIe2lz7IBoKQCQozrTTiKl/AQ5OHeccPH45pU6mRBkmA5x6PXXxbialJbcdyKonYS3YJ4FSYdQk4GwAku7ISIaljKMdLbP3yPk8qS/zwKP6fHCAxLxrGpUEzjSROJLokJaKs0gkS0P62ElrscmWrtgQjFiQwCojfQDxF4McxDokljdtjlHfrdmb9f6qo6FhqJUANndl/+dCpaz5blCd5ud+etO72UKtBLCjSeoAbDmNFsDZpn5muTochv40gGyCeqjYCDewpjyHtyf41U8pl+Hw18Erb69cw0Olv7puuPFZv/b4+qm/filL6n0ubfVV3hnXHRaOTSmb0kev7ZT+ejTZ32Q755P1OqaWF2qOPaU835VxptbJz406zfLC/3760wDmPZTevRKxEs/Ps1tZMiLO8WQ/yi0v/anjxFp5uWviYu2yaJ8Xb+O5kPq8PnNxYFrfDvPu1zxQXbNhZ4z3Y5bp6/qDL9LrlJkxD6fzpa2D20+WrcuA3Gdt9CFgdxBcxkTa6tt1CKf+TtTdMZWpwY9nX/1SHTtzI8//3Act7Yzn+iLPeKK/mJdY0UVfcWRZM3IwbHxlPuvbnR/840G7+fbo1b/zuojb6G4WNMOYfhoCwBXZqWsLrq+7eo65rinIiOw5dDZPsPXjrqZJu/LnFjMmyXwcPHEl+5AxEZOVOzGyH25Zm4cJb9y2PwLy+8kQ91Y2bT8wweSrd1/l7TGMFf8JB5RjnPblJF25TeKUXiyoDFOFCOVKv7hyx94TudHUcyfVYbG6NhqGu0fjxB+gmO0SUw3OLxmTZp3oS5zpKn/OMdZqvlJ11muc7XuOpxDgi40IKHGrqxgbtuzLbJJLUfuPXsxEhRsE4tVBWKC3AhBTDWTiBUD3RywKuKTRRF0QApRFuXTkOoL3YizBuuv02mOE5zIWFbM7mGY8WRHzsxH04/6JxWO4TWEjDQIQUDaO6w5yoEAQuNd5z+3JOOsg9aTu9pNvEzQXem0O/UjXmR9JILn6E1eKH83NBhSPqmP9zIe5YL5Y00k9HmgrCeCkvwbwp1TDpy/dy3mYqzmqax42g4ySNk0MmjQkgD8nc5CMhclMABjPFi51pb+y01au2zqhLu1euwpA6minvaQz29gcTz/Gc4uMVEpKe/Z1MyqKGgKAxSvvB5CavxXMMK5si7V5r68iWa4iAlRym9S4I2M8G9GcXXvU3hdZgEAdL4uxy2Y6E6BJglsDLUJtK3fBClhysXkP58az3KCFL8Cn3m3AAqCkgz70RfN4r36TJ00aGkA3yQDlCx8uG/0egL6xQz2qr67r6BiizjAAIiBpJwdaS8N0AI1BNZIGdSXA61zo+DQAkbypC1GYSvWbL4kEpGwNEF4HYH0b7ufcVNQgn8CcXwfgi5iPOdVUA5j8SI1U20vpwCY/+mk4AGNyJk3UEdtiEm8CkFrBtKUrN+YuVw4wXuEwAGIw5vqs71LeDyB1rR11SwLtarYLWP0AkhZ2UR3zMaYxSCKVxna9CUBtODh4cjekmAl5E4DaUuekugCIR/ryrjhkTX7001AAYgwHApOAwZ5NABiLSQDD1kjImqgFmagvkWTucUMtLYWRwwB4KuxG3sOM/vW9ZkMTwHnVg5ff5zzZRvV27DuZCWySdO3eq7R50wCM9e/s7X7z5hUCztz0K3SoAfwx7dradKim28DLUdfYzMabAJywgRcnbWACGH0REgAKKZr86KehAXSp1o4+dvbGhJEHBMJIEsKjUo5hHAATrh2fC7lwYcWwEsj1JgEAACZGYCzg9KM/apOzwS3nnttU5s7GDJJA/dtgyswPI3md+uLpckhIqA0qpEhtE9Lq+/vZV9TjdPA0zZGdfjOAU73QvwRA6sqFWsxwuZZ3aadinL+kDrB2Oh2OcZwN6oR7zmv0LpkbsZMxS3shiOfmePpXF+iYgVGefQfPXPxwAc+WB+lqu74xy3cCgUHS9hw6U48b5bQGiTUOB8czFVgCfOGDMo6M+I490pfzwrrN5ly/MWwM/HIgvDQkUj2A2+TmyHayYZwathe41DRQjKEfl5IdUFu/29/m4GhMe9LsucmPfvrTAKrjcixAMEeAjizCX3Uc85g04Gpvs56EXc6psCMztumVl/ZUVH+6yzhlPM/G9Ky9uThWQpgCBP0vCzurjvfa+JvBdgThdvzEfKK+cX0HsZTpRxmHRbsyt3r8uo71UaFUclmzL3wuXBJ99eZlnBwrPhtHf2xoGWdijHhn3Z4n+uqt0Qb1/Cb60wD+YYqJDtw9ryt/hzS4/7cZd3o7fU3vb7TrGkRvBaBdwxGhGnmiZaeJm2QR2ADXFNgOmQ5OjF3rx3aoGupJtqWu+yCDdV9RtiN9uUT78s4VCgxj93w/AbHDk0HuWLWh0RfyTD37AQIORfYbNiznGhLDLl8Iu2T+5qGvTzfvzTUJNayFA3Tg+OUcm5RR094buy5bkHXqlNvKVPGepdzYO6f6lyPMcifH57S9MZdT0UfOM/7uDdMxdW3Pqk83vT591qQhARxL8OhwtkXGgKstdcYz81MeHAq5RAaf/WDfGOY6/bY/37NvHA4GXV8cDLnK5WEDeH3iscyBhr2wMIviCLEPcp3qiwEtFLlBpi99iOFsEAAa12bgHLBdUlsYzA6xW+mxRr+uYQDXmH65Qh2OBltGFdp8xjSGdvhFnWprzWyuNWnD+5XNKWvyIwrWAyTxoTH0YZ4cMmq/9g3+lfV9VvZ7IA4FoE43bq+/1co7tFOBxXnhST3teaE8Q96VSWKexfBI7VYTlDYqHiNvU7m2mMce2O1iMkldPzLA61N3ZfRFUmya4qklgL3cK2nSnkfLLgljMDhzkvEXc3nAOe6BU5mvxDTzr7+y9p+cAydHu8KgOmz4eeLHDtgoToo+PZN07axT0oLHrS9z5TjZdNKFxevO7/WP1XdfgIpXNrqNx/mjQUYGIKZirh2rXTHSJbiVbOZhWRgAqS8XiEzSzj93LdzyYHIB0KS55toCkzttcwCJZFBVGKwuFZyudtQtk58AMOaUGY1Q5+wtlaWdLAkvFJg8zdp1r0MfTOQ0WEMBUNzo62jAKWO4+aZ9JsFjXebAuQGYrArJsw5tNu84mOtWj8rMMWIz4W0BMHO/MT8bbVMAnLx69E16ofjFJA3if5PeCYDNd2yHGEomonx1mpsOAJLh2URLIrsAyGXmumNQfY1vOAABpQ61OD6//lEeqk05Es9hZhNA7c0d6AVAfZuLz2UMthIopEu5UAqjqdCbwXhtXFOs59wDMDasxAVic827AIhIuMwLz9PvzeCNjcbM0CxN3g6ikQFIvbI3pM3O1obK8UxdZRgQDCsAYoLyXQdP564cWgKDAVSTmKre3eNplwqAVD2pGQhg/C0AMgGcCeswBm1hg1HZJFOdkpQH9KUoV8/4+NIEEOBsPMlk2wuA568/TnVuE9AW+mIm8I9vIVSxriZ/+2loAMtPcxSPjupcFaqiJJU5Nhhgh3F4ygQ5IKlSg4lUx4QNDFtU262amQMBDE9OXfFVnS/8JXOP2hQAMXx92JzSD9tJLRWHAROB3wSQHSOl5l4AlF2SxSmbxJg234MXbGV9GCyBwGwAUBK8nC9yUJoA4g01yqGTeiwAUsm0kLXikXnxZDPbE+s2h5EBaOcYhLsveLY77S6/U2bRdjBwa2bUie03AdiUhHqMqQBaKLdbXarIMQuGXAypVLcAiLE8T9JuQ1DHpNs8gaM/f9XV176YI6eI/XK6XwBsOjE2gCQAjUKCgQU03mmm8OIzM0H7FAl0+Hz59svoq5ZA5gNfzscmLABypGwAfNl35EJuLnMHnHnKII0EQGEEtWhHGhQodp0J2cWMOjCpGou5/uDLlFLpLqrEGNSY8eQR020PNTcVwLFUhbVDcChB4gWSMP1TMd5hjroJYC+MIG33Yhy5WAfO6vMESQIw5UJliWr3/6cEBnNpFZuuP4ww3/oqh7DlZEoshwyY6eVG+0zMh0ngPdIMTteLR24+0m7miz8ljBBK2fgcPhvN2niq+KpPV0VGBCAay7yg4FsymU2k5sZi53OFNwdjgYYhYj85UobaDxSwSYJik6M21HFm15ysz+656Ev8VcqAQJqEHOxcM/ntRIIEuQ6P1m7cnRrB+CSSreF4mIO5am/TsWXqscmYZj4A1mZ3jL9td30Vv8yFNhDj6Vef/tog5idcUI9K1B9tIc7za1NlDLbNGGWePFfrsDbJjuPnbifQTX68jt4CwJqhBjapIj11GZVWP+fnfK6lxHNdt57cZP3pkx30ri4znuTzpMQ26xdK1TrxOfoo/fWeJ/qK+WdfE2WT75vtJ/ox1kR50MDy3rN2+FPGiHWXvgppMzn/wWt7Hb0VgB3NPHUAtpw6AFtOHYAtp6EAZGx5TDyujkZH0mk890EYFBoaQFccuMfc3r+SZPzlCsVMfwUJ0qW3Bs1l1CT0kEkahEGhoQBE6hYX/K8kiWjHOSW3iQTFmC2Il+FQ5m+zvNQt5RIMpbwucxNNWa+810859hKkD5rPSCn4O4j3TRoawJkiAbjMTwEEswXash4OjgEGEBkRWRrldXqsBkuKTxBOPdW35n6Lsi8y3ecIyd/MqX5Vf31AxseP5pW4dbZRqwGUsnJMIxsiD8leSIdhuoyQdJ/MijZsCmlyY8wtcfXtcjfFTl96kDlJCW3fl5BZ6QAcETUBlC/M3OLeE5k/dIAMNKko2Q3X/ydU4Jz5mXx2wuB+je8t5F2dkDp2VVrQcRaSsyyquAPwHVMTQEyWtadGgSWrX1QhR+uuOzlOM3YezgX6nBTS5UhImZwqlSnvuWTlhpROKpl0dwCOgPptIHKi4LyNpPFQnS0CMC9VNQAENNBJq9OQJSs2pDNz/tqTTEDXl2t35zuS2AE4AuoHMJ0Ypxth/5zTAcSBKBV65vLDPAICLulUl5PjFAJIrkEA1FGQts7+qOP8Ly29MToA3zE1ASRdHA7zZv8wf/+xS5V/1gEw6tARjqMrB8AAcrCqvt+1pm6B7MyQPeSdaudoiyR3AI6ApjgxEWRvd/dz1+FkPg+UKiRVHJZte45Xa8Oz9Gv06vqmkTJ1EcllA72TlPD9hvVb96WK7ZyYEdF0J2Zq5oSanPqudnJKWQnuC7n2512tXuvLWJ4LdQC+YxIOCMaLyz9qcmnKhaZBc5kN1DoAnZq7k9L//4xGRX5f5o+ejs8EtQ/AjqZQB2DLqQOw5dQB2HLqAGw5dQC2nDoAW04dgC2nDsCWUwdgy6kDsOXUAdhy6gBsOXUAtpw6AFtOHYAtpw7AllMHYMtpEsDx6v8B93YieFHFdW8AAAAASUVORK5CYII=", alt: "forbes" }), (0, _i.jsx)("span", { children: "Recognized as Forbes' Most Trusted Crypto Exchanges 2025" })] }), (0, _i.jsxs)("div", { className: "ticker-item", children: [(0, _i.jsx)("img", { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAB0CAYAAAB9sSvlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAB83SURBVHhe7d13fxw3li5gfozdcVSyFaxkS7KtaFlWzpatLFnJCpZky2GcZmf37t7ZGft+6b54UASJRqGa3aTYSvXH+yO76iC/BRwcHAAzr72xevDamz16LC9mLtx4PLh489sePZYNFwJmvvvtz8GT3/9fjx7LBhzridZj2dETrcdU0BOtx1TQE63HVNATrcdU0BOtx1TQE63HVNATrcdU0BOtx1SwaKIJMylq8cwjl/1jFuOEm8d8+DqeQCXcMOphx0EtvmclB2PLVuQWgnqqxtUBYSYm2r3v/2tw8cajwYXrD8fGldtPqnGB9G89/H1w9uLXgz2fnhjs2HVwsOuTY4Pjn18bXL/702zB6mETbj/6WzXdiK8eDi7f+m5w4/7Pg0d//d9q+AZ/Dr7+9u9BfrKyRYQwd0Ie8rx+89M/2nGF354nGfI3v/ltWC78f+3rH1vlfvzLP6vx3f3uP1uy3/z4P6GNHmdyDweXbn4b48jl4Mb9X9rxjkKQVU+TkE3+JiIa2S+uPhi8ueLdwetvrhkb7274oB1fiOvbX/4VCHV9sHL1hrjC/5fXVw7+/bWV8e9f3lg1eGvF2sH7H34yuPukXZk5Dp24UE034Y233xm8tXLtYO17Hww+v/R1qPB/teIQ/6kvbgzefHuyssEbb70zOHj8/ODbX/+Yi+vGN7/GdIfkwm+kT2Uhv/ezUzF8HtfWHfta5b3/5L/a8QXZ3fuPh3jmyyPcldvfD95etX5e9q01g1XvbBzcC3HkccJHew4Ppb8Q1M/hU5da+RsFshMT7dzle4PXAgn+7S9vj43Vaze34nr413+ESjoR4/r311ZUwwHSrd+0Y/DVvb92Fu6zY19Ww5aQzuuB0Dv3HYlffR6f/08E0iN4LewoiPfA0S+GiPbVg19i3ofkwm89TUrXh7b70+ND5ff/5g92D76bjSsBSVrxBdl1G7cPHoSyJDlxX771JJIyl31r5brY++Vxwvadnw2lvxDk4bPwUeV1txDIPhOiaZCTX94MBRyuuC6oiI1bPw7Dzv8diidhXKIlSPfD3QeHhlJle9GIBnoZqkMaysT9yhJtTUG0m2FYUfCarELXCu7Z2TDs1fI7KdEAoQyjJh7iEC+iTVo2QNxnRTQ4evrKUNrLS7RVz5BoIaNvBn1KYWow9OXxHD1zpVK4FYMVQVejk7235aNYoOH3b8d4agp9jWgahY4n/deDDlK+h3zYUbZToZeVh/m8r632cEl/THL0ocMnLz0zouX1Iu6lEs3vrvZUP0fPXJ0rwzgg+1SIJvHrQYdSkBruf/9/5uLQGDvDrDIPD+ve2xZmM/8xePTzP+MQ+cGH+2PD5DKU1luPfh/KE9SIZqg1E5T+rYe/xcYo4zPsmOGleOiNd0ODpnybXX0QiF8SYdP7u8Jw9fucHAib6tLfaRJNOa7fbcoh7qUSbfXaTa3yzSHkQ1nLeEZBnp4K0bpmNDWY8W3ZvmcoPJgYpB4BuJiX6TTE+GEoPqgRbcu2PUPT+Ruh4c2Ychk905mLd4biymFY3bFLQ8w3sEZ5f8fe8EF0m0rU0zSJJn9HTl2O8cJSifbuhvdHlm9SyNMzINo/Iwny8LDvs9NzDQB8zZk8chlEu3pncUR7GHrJFWs2DMloeJOSPK4cLwrR4IOP9sePWNw90QJ6oi0P0agv94KKIu6eaAE90ZaHaNqEGiDunmgBPdGWh2jCbdj8UdRzX1qirVyzMRZCIROaimrH3RNteYgGzCyMt5dufbckor2zfmuor38Mt+cEPCkh7FMhGpuLxj56+vIcTn5xo9oYz4poTCb0mFxGw7Gd5XHleNGIpr60z6WbSyMa2cMnLw6155fXvmnlaVwo71MhWg1dw+mzIhqbGjtcLsMozGskjyvHi0Y08e/cdzTW3VKIVoM8Pf55vj4ngfK+EkRDiu07D7QqVHxckcr4El40olldUe/nrz9sfVQ90WaxHESzLAP7D5+t5vmd9VtGWrlfPKI14a27qqv8eU+0WSwH0SyLWXqqNZAyHDtzNSq6ZXwJLwLR3l3/fosolPmyjV4KoqmAlavfC+TaFLE64L0tHw8e/PDfrTimSbRb3/zW0lUAcTZ/sGvwzY91t6OE551oZHkll71XjTiTEE37rlwz356wY/fB0HZth9FxoLxPhWh6rzuP/xYrPyHpRyWmSTQVu/a9ba2GtOBuwXyhsr8IROOhXM6ma5iEaHpEncRQey6yNwPlfWpEqw2TNUyTaHosrspDDRkaa8+BkyOHzITnn2grB3z0Pt57JMadvysxCdH6lYEJiUbRZ8/LicJ3jmFTI5fxlHgRiMZ5k42rrKsSPdFmsRxEU1mGyFKH0WDiX6jsLwrR9NyGu/xdiZ5os1gOotErDJE8acvG3H/48/BudK/2ohBNne7af3zoXYmeaLNYFqKFtMT5yaGzQ42kYkdtdkl4UYgmn6fP32q9z/EKEu1foaH2DYUHCnqel6dJNJte7W3M39PTahWfYylEsym6RrQvrz2I8ZJTF5aMngbR7jz+j7jmnL/P8coRzVBmOSgPD1xceAxIg8y+g2daFWtZxQ6qMs5RRONBYjf426Gi8/cq99xVjd5d/sUSDfSWbWKsiLNgYaV7/4f/jgZlE5Q5mRCGt2wiY8JCRLPXwl6G/H2OSYi2Zt2WwYMf/ifmsw3qyGT2NGWdOtHEgRhl4VTipg92DT49ci7qG2UPBKzgNv6WcY4mWtNzRGW5SFOjjzJCLoVoPpa4IaZI0wZmRz4o58atOyv1sGpw5HTj/5/HtxDR4Isr98Pz4fgSJiGaul8f9NoNmz9sgSHeMD0pb6ZONHAsQI1Io6Ay7Lus2b8WIhp8UukhbVbJd2iVWArR1JWjA8q6WggIUduVvxDRyCASlSCXSZiEaKMgD89sX+ekRDMb3HPgxNgFJPfOuq2BFO0lLRiHaBpPb5LLNJuI7w7FlWMpRAMNu2btlrHLqRF3f3pijjg5xiEauyH9rpbeK0k0MATaLLxQIb0Xf344SolxiKYR6B7Dco2ZoyvepRINLt18HPM/nG4dMc8dSz3jEE1vrxftiZZBXMiWFoVrhdXj0K2aoaT9lSeMQzSN8NHeIy05PQAFN48v4WkQTbq3wgRGOUqiJKjPj/cdieuLXe0xDtGE5bFSS+eFIlozg/t1cPD4hdi4CY44qB1VMA6Es4TC1oUcFE42Lut33KzN3hbKo94uzw+cuXBnWJ8LcTgjrJST965ZlHR9WI6kysOcvVjEvQDEY0ZNif5o7+FA7l2xnEi+98DJqMQj7qhyPgo9cpkPv28++HUoHLPIoZMXh+RAT1fzvauVbxTIXr79ZME2yUF2QqItH+TDDFCFN1Po0JDPSd6eJpTL8KiMetxRPfXLgueKaD1eXvRE6zEV9ETrMRX0ROsxFfRE6zEV9ETrMRX0ROsxFfRE6zEV9ETrMRX0ROsxFUSiWfaxLNKjx3IBx2asxvfosdyY4SIyLpKrSO0djPt+lNyodwshuWrX3o1CSrML3HG48rz2xuoIFTcyXBF/wqLlXgLMxBP9zlxZEEdOXYo3mjj84+CJ8633Tghc/e6m6MxYvgN+8Ft37I2bLyTshrzDpy4OyYjDvgDpSC9/txDEv+3jT2NDcb0Zu1xB7sM9h1oVg0x8yOzOOnHuq7h76eJXjyMc3sddRllbXrshnGOyynS46bhdL30MfO3cylfKHTp5YbAq1GMe58uAsScD9iByv+ZHVdsgwr3HZgtX1ZTvQDqu90uXSjihpnQe9NtNJdKRXv5uIdAFjp29Gol25db4/lLkzl6+N1chwjuByDa46IgY4u0Kx83naigTx8/UE3Hi5CNWytNT8sMA7Zmo1SO/tY3v75qTe1kwNaKByt68bU+sxOeVaIbIMxduTxT+9sPfY28u7Z5odUyVaBA384bGeB6JZhjkGi2ummwXxPHFlXuRPD3R6qgSjdenRs/Bpdp+xA2bdiyJaLxL7d/sIppd7Lv2H4vpNWl3b1iNU+forfq/sYHSxowuoomniXMe3JtPX7wTw3Elr7k7z4flFVvPi/waQnui1VElmgu69Fw5bIZ14Ju/SyGa9OwFeGfdlhgmf+c3oqV0pNu1YdVvx5zbX5Dy1+w26iba8bPXYnw5hHUVt5mla7xrOhky7zt4Ok5U3F7ctZnFRhb6XY1oPoqPdh+K75Hs7VXrqqR+dYgWflNwm+l8A7unNYTC28G8FKKBY5a2bm/vJGqIFmamWSWbxdV23fhd25EFdaL9OfgyEGnvgVNz2PPpybjvUhjnfGjk4TANnLHGrEHOrPnc5btxV1IJs0aTnRrR5Adh9XzqD8lqPfUr1aOZbWnEBNN5PcdiiSaNXO/x224qFZ/LLS/R2qAHbp81iawNvVqXbpbKnuK3G9xtMXrQHC6S1VvViDYuXimigecJhooPQ7e/WKKpvFGX7yc8S6IZRruI5qruMo0udOlo4+KVI1oOiiyj5mKJZlixT7OrIROeJdHoaV35cztyfngKefmiUuQwrPY9Wh1TIZod0hT85hC6brItN9FMcj4PYRKoBCYDwlDSu46Dd0igfJCTN2GEzeMC5hUrHl06mvTVgdUFE5maCeeVIhrdyf3mCe7XdmbXUohGrxllPoDlJJrfB46ei0cD5EAMw5104sValQ/BhasOp0NGYZhRar3fhUAgelqNaBT/D3cfjGmZWLj8H6lKuVeGaH6bdTJeJpiRaYilEE0DqeRRhxSLYzl7NFcMusuyhHgQjmml1vjg0GVHAVy/91Po4WvmjT8H1kW7Zp29Ha3SgBqqJrxUoonDwcUPKuFhuYmWwpVAIvmjZxkSu3S1JN9+18RBPegNtnVMnWi8Fk53rCVOg2g15PkzPDLcLjRxmUNIB4kswstrT7Q6pk40oKvVrOvPA9GkTZ/kwmO2PIpw9C6HFO/85FjMp/A90eqYUVG54u83y3dNGCjFN+7/PBQGbj38LZJw/+HPW++ufv3D0InRlOGzl+625FwStun94XNdmQz2Hjwd75rKZeXzxLnrcw2cQ/7Lco1CmT8QL78wy2XiYsRGDMO+40g9MykwXOb5RfxLNx630jChshqSZOm9ZqGlHJLGmfDLRrRc6c+V/5pwRKgA72thVGIzfLTflRXXJVf7ki1/lbJgGC5loZa/UajlLwcSWuf0IYFlqximIgu19GtlG1fuZcBM7eGLAg2CBJaDwJBX3rz79PD8uVrr7dNyGMQJTcfHt1zQCUh3fhluXfUjnHHxgvvGc5jy0yG+vP4wdvnle8Ok9b8moRXRPuRZes+MwO/M2f7Hzl4bCptg2OCynRqO/lLmxeUVdJ48w+Q9syR2wRD13d/nFrXpWobY459fi94cuf6mAeQpjx/k1dXQOYH8v3XHvpasPG/cEsod3js6Pi9zDnWWfONSfE56rMkuhEMnLrbyxgbn+HjHiCpzXn5ryJ8d+yIQ0Cx6WK3wu6s9QF0o05XbTwafHDoTz/wt42jQeCEz51y+/X0rD9SKU+dvDx0UPVNTdukKInLNTE2p9kxFyoSIXDMzZOUO7xXY/gIW8zxsgnSZElJBdn5ytKV43wuZfmPW9RsQh+GYVd1kokvhFw99iqdsuq9TOu62rJ0iqYLkNU/nZNDNWnJBN7Pu6T239K70Pb8b4vSxik/avEVqsgtBPub2WYS62PvZqUh4k4vu8v8rlsmV13q8VC7mm672yCFecVgp8dGqm0QYPRgTlfI3J1Z2twFd1tKjj3xRRANfrS9rsUQDhaH4imMhomksjpePwsw0lxmF2ODf/j1OYDSWw5KlWcpZrXDrSKpMaZbLUeK6dOPbKLP63c2RdPn7Evza0maZpRINQd4IpDX5QbCaXA3KevXO97F3m4RoOayUMPekj2ZFIC6id/GiBLcoR/cvmmjCHT51OTbgYokmbhebGtNHEU1jbd2+J2Y6fz+HEE9XPj03S/Zl8+uvWf7lXU+RiEYtKM0vGpiKQMYKwkKEly6S6P3miCaPCZUwc8jk+MJpZAdUjypj1ztkE4c86FkWao/ac2Vfv2l7jIMKUFumG5WHMxfvLJ5ooHs2DjvCfTFEAxZ1cmxRNaIZLszGutyMVAJdRVcuP+V7EM6p3yYKZy+3L7Dw/tyV+3NDVHkBGsinOjF0MHnU6i2H8Ahu7VMYQ4g6SWAuqYVD8FzOtj7eyF03vOh56bLXvv5xhBv6H4Mt2/fGD7rWHvJKrxKH+6lqH4KTvpX/QujVy3fSdXfX7v3Hq+XSLksiGnKxm2mYxRJN/I4Vd2NIjWiGZ4p5LZ/CujdKY+r5KK/C1PLs1hUzIhOQ2nv2MV+8r/ZE6AHK94jY9E6rIunyOPxvIlPGyzlhfnfU6jg5SjgSRoNctsGfsbFzObNqdVxrfHXuCHkfo7Va/9fIJl9WY7RprT3ULX1OWnrt0iEVuNNLw8dTvqOrmTwYNbizmyi57N8dBkCvXhLRvDNb+fSIS1azeMLzcYkGGvnomatVoqnso2Hi0cpH+N30GPMrDhqUHlfTYwx1Vi5Uhq+3fC/tje/vjL2exs7f0bfSnZ+GzTyf8mWm1frYZmF2KFzKY4KPq5QVV7kqg6A3Ql22ZEMe9Kx53Gbj7iwo68rvSOBQ9jrRmg7DR9SlFpw+fzN+zD648p34xaE3uxV094uh1zNcfxyGWWnK48REI18+o3AOPQv/jyJaGYcx/05Is4wX0VjemR/Kd357nps/EK1r8wzycXI0fJy7cq8a38ETF6LiWl7OoeLFq8ezGpCHVRYNbjJR0yGtdiRFOse4RFOHtXiROl7aH8qcZDWoXfpl2fSUPi52rlp7IK0ZuqGvUfSHOSE+I4e603O142+DDPLpDPTqExHN/3SlLgfBOQS5UUSL+lQgUf6slvmFiFaudap0vv81PUHDRG/a0Bi69nK3k/jY2ehEZc907d5PsT4MHXqGPC8ILD5lvfukfQUOkhquUx4TxiUactQmMPHDydZOAdHoyzVlXZt2EW0U5ImFQTtIQzlvP/7bUB0sBGSbmGh6A0a/Wrg5BLlRRNP9OreiNsTlmCcah8Q20S4WNwurdOaS2ocgLboCudfD8FhzVWLsrfXi0RYUGpEOWDa6tJKJ5krZswf4vSfMOFMeE8Yl2orV6zt7ND1QSbSaA4IeDVm62qML4qF75uvP/vrNqFtzjKhBzzY50UJGNb6xOA8zhCA3kmjhmbF7lNETko7mkJVa5Ukj2YhSJdh8XNOVKMnsaVEuNIi7omq9WpmOYZTdjP5iwpK/AwTWEyonI235HuhNec8L4+toa+KlZTVZd1IhVy7beAkPl8Fvqz302cmI9kdcmZhPwxJcYyYxSfPhuQf1Uojb0OwjrPFJ+osiml7kQKiozl4tyI0immcqxcxkVM+IaAqk96vJeeY0IOlQ4l3m5cstKxoo1GkdFCENOwt9keLRSzUmljWDryozriTXpNlOFyyT5ZMWGJdoCM60UMqC/Puw0qzT5uZaTy1epzNpt1p7qMfz1x+1ZqzCUQdWrG5WBgy9VlfYB4Fuevr87dgG2sl7k4CmLobTWBTRfJ16tc7be4PcQkRrTAmrBlcLnScHoqlEedFb1OTkX+U6aKWZLVVkZofNZCcDX+Oo24dBesfCbFg+6VmLvcHP9N9sLifQuETTwHZoPexIW4/KTqWuai7m4tTT8D7hnlVrD3HorZvNQ8P15/ehk5die2nzmlpiaDfrdsxX1KcLTukZF020Rqk+1MpYRHi2INFC46lEyzRdDajy0sqAtBbT0PJ3PgwnylM2oEX5av5noW5YxMnSh9p11fRkJYZlmjyY8ufpj0s0YOLI7+WcBMjH/KQM6ryLaPRQRt1aGQ2LSGbWqS6H3y8M7bZooqkAw0F13Sv8Hodo4ojp3K/EEZCIRk4hLfCOq4CCL8sskQOjik4Nl6ByVXI1bMgPTwb6ifLWrsRmuI13YwYFPIHHS60semSNldKehGi8RRil9Ti19uoCwysH01SHo4jmQ1bW80HfbOe/WVnRq3FSiKsHQ++74eOgSy6JaDL2ycHT7YyF3+MSDeIMtEKgnGjgy04nDY2qcPkxjCKmSUeNZECv6Vq2Ej9Th7B0O+UpZVjL01GjCc1sul0WXzUX9pSXiYgWIJwPO35sIa5WnWfQuA9DHemFk14Ko4iW9u12bYmknlhuVEaj0Nehl1uoDSLRA8moPzOUt6TcJTjiE5kYMIfeh//jlDokFjOvEUIkrTjCb40kAWP/0LsAxr+88fVWeoNS7sjpK7EhkxwoKKVTPhgZGYtvfvNbJII1P+YXyykWxsuwJXyh1ujKdIGnRHIxWvXusBKcUOpdoNeqyZo5O64rlds5cKWMejPMlXHm0C4bNu8Y7A89jLJev/vT4Gboeb+636z3qhNGW3lWV3lYM8Zae8gbgzQZph/LYzUZKytNPCuiu5RDcqSnpzWyyYcRxCycYXvztt0xv+RnkKaF2coY9S5HXQ7yowPyd5U4wrOh8EmuIpsgTr2c2VRE+B95avF3oZouzOZ/TsbvlkwtncYLty07LF+ViXLj5Z2cspoNI4fy+2BLcpWo563J80iZWbk8Lm0jPR+09PWe8pPIlcu2XLkJNOSoo5VYgRRewuxWlmZY633pc+GLOLrS7EqrSz7B+66wPZ4NhoimcdI2sxosHlv8TjpaCYy2+m9Ht+m4MTwH5dmQyrSQh7NSQB8r06P/5XIJdAV6ZCmfwNRBP6yF7fFsMES0xij5S1W5AwqetU7GuTxcCmtmRgnvUlQ9RzizuZxsFOBaGApzngbosegZXWkA5Xbb7HJTj+cDQ0Rj1KvNOHKY8fBwyIc/PSHrcJepoIRZkYVWsz7hJyGaMLUZYA5xUWjpRWX4Hs8GQ0Sz4USPU2u8HNa39Cwp3MowCzRklXIWU7ns1EwXCJ1mYZMQ7b2Km3UN1+7+GHvZMnyPOrSDyQRLgb+5jmvSwdwFebvnYdR1HiaBri7MHNHoV1bqa41WwvBphiecyKPHRMXDgM3tvc0fzVrV7dr5IxpRAVkcQCz8JERjjhg1bCZYdlm/sZmy9xgNbcBccfB44+nsUGkTuObdyuiDxqGUC9KhoGMjnHfvhBGQKSmF0eHkIx2C2enmxphINAlplHJBlvJecyKkhyW7i7A8U2s+U3o5XpZbtu+JZLMX04UWXI7NRlfPHtk5LtF8WaWFXg9sKC2XZzzneZCH71GH3oghmGVAe7JT+qD1Vq4bavbfNrN565lWVOjp7IX+em49Nvf08JedDREt480RrXSB1vAMb1x4y+HUO0sS2Ctsl1crOXEaJr23RY1RlWVZlyqs9MclGuOw7XO5DJ3RDqZyOBWfSUfXDLnHPBBNZ5HaQ4/FOweJ7J9gQ8tlT577KsrowVIYxOJ6leyYVjFYIBim7QNtiBaESj8m/2toF4XVdKy4jDTbiCK1y7lGlhJkmD50qWntb1yi6RXLCYdel6twzRNDD62QqTJ6jEJTR+qKY6OOR7vqkfL68+Fqu/wZ/vAyjis+4X+diD0I2tfqybqN2wLRQgDrgaWzoF4My83yyl4EOD7m65C6Uy4k45ANpIdIMjwO0cjFCycKOXY/XxffqPw5WHOUr7xSenRDPRkancakThFN/eb11xCtuWkmhfGhG2L1asC0tCEMt/5HNCNevBh2Txh6Sh3HUIdI2MnHKH8HGpHzYMpAivTyre9iXAiRYJG9DO958o4Yh2i+jpoHK13PxMS+0PKdfPBuzbv+HnUgDN2M/106wsts0g603Exk6DwWdLNItACTBpOFtHi/Ys2GuGZr2MQPepuzg2cofGaHZUMbom48+DV6ptZsa+QRUILiwH49I0Lwa5KAhWkybGYlkUGvOQ7RpMErgj6WvxfmZpgp8zLpci03TCd7XY8urBg4jWj/kXOxY0nPrVF/FoZOloOGbM3sNDpWhDaxsTmddJnC4IHFd6OhTsAQ6hSCGeSgX9U8UzVkjQAJlqR8Bbb7c47zG8w26Uy6TF0wn3ur+2X4SYh29PSV1qQEUh6/q+Q/vg9hdoWC9r1aNyzXXQojETuqk4joZQiU9C2X7BpCGeWPnr0WycTHTxiePk2Yc9HCgJzaKyKE53YUdTTuNLXNHONAT7dl2+6oCNZ8sBCYuwh/9dJZDjnuBN1vHKKRIVuTWQjCUF71umUF92hA77LJJwe1CVm8p5ogFkKmWfx8mPVzYYwcKcxc3CGs3nCGP1GtcR79nF836CrD+tCH6U5BjLO+CYjAgOu8WxkbRTTv9Yy19OUrz2d1CSzESxe0myqvgB7TxQzzQN4wGpwB1KHFCWwhbCS5XJJtbFWrIyliQ49BNuFsQjXsysQooumKEbJ8T+fb/vGBOAFp8rkvGghr8chXPLoqkNaXR4/sMU2sH8yUQ55hNB3hlMMyU60R9TRmHrpSS0p0tZrin6DRGYJZkhPbRxFNd2zdMn/v/2t3fxrWBwLkoevcMu5NZkZnwjAqzz2mBxybsU2KMp9gPWtFxZeLUsiIl8tG+RC+uVh1RTTgYi8F0KYNGx3clAJ28SAizw8TBPIpbktTZbyA3KbTbGH5c2lyE87jAL8td5VlAnEgpolJOuWmx7RwoLGj5UhrWnkDzjfksGyUj2HaDa5RDamUwYhAQvL5ouuwfCXuWdky3VqaCZ57n8vHMORjmPkesMe0sGLw/wHDEyxeFi75NAAAAABJRU5ErkJggg==", alt: "fortune" }), (0, _i.jsx)("span", { children: "Listed #1 in Fortune's FinTech Innovators Asia 2024" })] }), (0, _i.jsxs)("div", { className: "ticker-item", children: [(0, _i.jsx)("img", { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAABvCAYAAADczDNrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACAoSURBVHhe7d13e1vHlQbw/RjZJLYlSlax1Syry+rNalazerd6l5tiJ3E21d7sl8bOby4POLgckAAlSwCDP87Di3unzzunzZnhf/3mt0s6C6X//t3Szm9/PzWhMSXzV5vXfrRgsKhox95jnbvP/tx5/sP/TmjM6PG3f++cvfKgs3T5x9X5rdGCwAIoH6/f2nn4zd86L378d+flH/9vQmNIz/7wc2ffkbMDc5gFg2XbrsOpsl+qjZjQeNCLxGEu3nia5nOqOs9tWjBYDh47n9lZrRETGg8CltMX7/7aYJnqnPzyVg9YXvxYl40TGl169urnzoGjX+bFX5vnNi0MLEmTvvLVy66+8uibv3c+2bKns3rtps7qNRMaF1qV6P0lK6tzXKMFgYXZdf/FT12u4vn9pSszQic0XlSb3360ILC898GKzMYCLLcf/1BNN+pksD6YWtVZ/+nOzsfrtnZ+996y7rffvb88W3xrNmzr/P6DD3vy/afS0GAxwNhXgIUoOnvlXjXtKJN+fLhqfefO0z91nr76V+fJ9//sHDt9LQFmeeeDpauSmH2R36Ezl+9NA2a4lbjYaEFg2Zj0E5o0sADN4RMXq2lHmUz++euPe/xEgLFh067O7oNfZOUv3lPedx84mcVvrazFQr9//8OkTqxKc1zv59BgMWB7Dp7qDjJfy/bdn1fTjjIZlBv3v+sBS/RF/y7eeNIFjDS4y28LMbUYae+h05nLnrtyvzP14drMGMrvCwDLss7xM9e7g6zwNeu3VdOOEun4R+u2dPYcOpW5xwdTq9OgPOgBi77gmlzgl24+7XLPhrN8kS2HLTsPdrbv+TyLqvZgjjPpy+dfXO68TONBWlxIi4VuWqYZGixk+pfXHnUH+fF3/8iWUC3tqBBuuG3Xkc7Dr/+auUezeh50tuw42KOo6wuFFmCefv+vaaD8u/Pg5f9kU/P6vW9T3p8zx7n16A9Zd1ssgDFGpy/d7RmLZSvW9qQZGizvLVnR42NhCbUROGoEzNfvf9vDRegnQAEA8R6YPly1ofPJ5t1dsADT0VNXO4dPXkrPM9sb8py6cGfRiCZM4NKtZz39W75yfU+aocGC/d58+Ko7wFfvvEyK0fJq2lGhJUnkfPXkx8xiy8EwOMQKTuPdvRc/5f4xmR9/+4/87tE3f+us/WRHBlI7PwWZiV2rc9yIwn8rzWv0z6701IdretIMDRby/P6Lv3QLPXf1wcivLlr+qQtfdQEehGts3Lq3cz+JmZc/Ji6ZRAuxsmzFuiR6/toAKuku9sHoLWVeANu2+0hKvzgsJPpYXhDT/bv79E+dJcs+6kkzNFjIsWDR6MTZGyMvt7WPKCJOtD1A4++ZS/c6R5JiRw85m6wA6YnVe89/yoBY/+lnnWuFqPKXPKcDNYtkcegsy1et73JYfbx295tZWwFDg2XVmk+7QMGWbUTV0o0Kmfgde48mTf9KtmhMMpM59A/KKyuJmNr/+bluvpsPvs8Wwabt+3Pch7SUY6Jny85DnUPHL2Ras2H7ovC/lP0EFiK67bkeCixWqIEKsGDNO/YcraYdBTKJHIYRd0PsfPX4x866jTvzrvmT7/6ZB+az/Sc6x85cz1wk8hJbzOwrSSeT5uHXf8sLQ/8BzDuLJRTlcbeK9h85211A+nb28v2e7Q80FFgMvtUXYFE4BbGWdhQIV7nz9I/d9gY9SLL52OmrnU3b9mcOIjT002378j5R5P006TJWG5FzMa0yu+pEFoC1y/N+3LlLo9PNbOGw/tp9GgoskMaTGYNExvFL1NKOAmXdIwEh2lsShxtLDiiOJ71r62eHergD5yMxc+BYw00AKnOTSlnnrz3K6cu6x424EMLaA5qde4+9HlhYFaV5hQW3bfFRIp3lCykdbyWZfJzjyMnL2QL6TQ9YprLT7cKNxz1KcZuIOOJqnMUQH4vFEH0yXvS4dp+GAov9FIMbhTK1vKulHRVavnJd1jWs/ks3n1WJ0mo/qFTo+BjsQlNya3kQt8HOfcdG3ik5H3GH0MNKsBi3drqhwLLyo42Zm0ShWWMeYaeUlYFDcJy9l4CgrVYRDgkY/vodxBSWB+V0KQ0gIM/K6aZPz5GfCBpff8vSPK9OasS8soraIggNBRaeTHsjUSj9pa0xjwqZ8JUff5q5ytnUTr6U2MvBYsnkFR99kn9Lv/Ljjdmys8pWpXw79x3vfLbvRCJ/j2dFvuutTXneW7Iym+RfnL+diQI8qmMxF+k/vTMkBnH71eMfXh8sBqzcHyGra4W+azIA2ZL59u9ZCQ8HG08toMTJBP6Wxku5NIcmWF3MakCip5DjNgyR38xtHEaey7eed54nfUWeR+pJ31mKAb5xIe3lxQ4mACwXrj/JcdbttEOBhVOrVPRG0b+gPcIPTCBwmPzMLRJXceyBVxJYtB9gTl28k8UTriKPEEtchbhlKdFdeK3lBYwPV2/IIRpYtXLIdsoxy+njilI46qS9+g74MSZ8U7V+DAwWmRUSQAEa7LqW9l2SFcHJxvxj8pacr9EtmjNP3Ptc2jgCrkLUlGDx/vLt59k5JZwBmz557mYGnXTMbvoKrqTMoLIt40DaTEQDSQOW/tbd4GBJg042B1jsxrZ3JUeBgIM4ABZcpVQ8M2tNgwAsJp+ecfvRD/mZU6oHLElsNWC5lxV5Ik1aXl7p2o648QXLVF4Q4ZDjCticRPhrgYXyxvwMsNh5xt5rad8l6eTaT7bnFcJVT0SYVOIH9xCPAywmnP5CuQN8gwQ0ARYhCr4ZTFaSuFyiCRfiwJIfGHErJKxBveMGGGNTxvroozF4LbAwEymEClSw51H1seAgeYc5cQf+g0tJGaXkYrX7jpzJ4jSDZe3mPCi7DpzMYocrf4az/Jwj/HEWK09+fiViSBgp/UWerAA/fJXBJsQBGGttGlUCFoslmIADg6ICXwssBiEOlgELa2CUnVHAzaoxmQbgzpM/Zu6Aw+xKOg19JXQuJjEv7o3EMXAT1gFn3MWbTzsXbj7JJHzBt4aTTGVTmzPPQAPkl9ceZn/FuHEWxkDoK4hR0E9iDAwW+omVFGBxt0ej4NXTjwKZVJYOUxew/Y732l5OLBA0DrbmohtiNzvhgtLvHiCkZ+lF4YmVmfV9DEh7LYASLDhoP+44MFhExJdHI5iKBriWdkLjQfQxG6ih3KKvEgeupUUDg4ViF3EhwGIvJVbqhMaTzN/+z8/m+Yx5JU5radHAYDl+9nqXXdnex2nGje1OqJdYeV98easLFvN7+MSlalo0MFj4HMpCHZmYgGW8iT53oTjCyytNua+lRQOBBbvKRylSgehpMknHfVt+Qk1EP6swwGJe+Z5qadFAYGFexfEPBd969OoN6SuJM83HndL3NgfzO6h8P9D3PnnQnPmmv7d/z5UelWlK6peu/b69nVBPszDK56keYwINWPiZ5jpdOhBY4hxNgIWzqrYrOQzptE05vok4d0Q796509gkj4A+JYwnS8HHYVeaulzYG0F8be+XtRn5nYKdvrDf1tY9l+qaPZT7mtj5G2dq4ftNnTZxueqcdogQ3bz/QWbtxR15Q7YmUpywziGPP7rX0SF3rkw5oYzbXW5QztXxNTl/mFR7RrmshNCXo6euZoCfxynNJjHnBolHlCT36iphVg1VLPygZSDclhlfUBGCB9mD2H22OZJgAdr+TggbIyX77U0x4Sra2iLq38RX+kFsPXuX3M/RLBre7WFYm4HGgCTUowQ5EvLTtfJxyq6e9vFz7xsAeEuDyENupjXbYKuD0m5nENG7rtrbKbIhuYI9JOeJt5PVeWSxOSqZJU5bv+lvmNya8yK8LGAspLFw03+nSgcDSe/b3l87ew2deu6HyiyAnJ0XW+30k/db4Gw++zxPPYWQgHcTPMSRJyTZwwGqVGfCINcFpOJNuPfxDBqDzPAYUMHyXB4fipge4UowCrp1lbBjw+B5OnLuZPb9iWoAZB5PvZCIgsB3w5dWHuUwcwfaHM0nluPAif5zasHHL3uzpdexXAJnFpz8Hj13Iddpr0heL5fyNx/mdskX32ccyRq7D0B876saIDlmeRhiWtFM7AihIuMZcvrOBwLL1s5k7b/1tR8IvlDYlkNi4Onr6ambLjmVY+fQj4kiIgYEyYCbFM+3dilQ/7mAiAQpouKnt0zxI+cMba0DkwyXmA4sjIkSLcuU3MYCmfrL88u0XmcMo0wpXZsTLACqAl/1D2gkY+hRhqN7J452F4Tn3J5FxsJcFXDlQ63gCVBojC9ZE+m7jD5fDLdv1DUokgxvSS7A0EqP/vA4EFoOFoygQ6tclGT1XoYOSQTQoNuBWrP4kDx5OADAbNu/KcRYGyvmextPYHAjrmej0nEMIEmBMYnCWrbsO5zz5rE+a8BxWOR9YUr2lPuNIp3KBQhouffkcnr965+tcrvYRCw6pNXsqs8clDARB3rHNYIda2e22+CbEAkiZsTzlwH7oxMXcHycrLVjcaC6RMR8BnrJKsBB5tbRBA4BlKiPOSlIgRJuUNwEWA4fdKtumn4m06+saDw23+WcCgWrzjgNZprfPs3i+evfrPPDEFrBopzKBi35AzwCCCEweFCyU6wBLqePoe7QpwK2+60kUleUG1cBClBlLAVVtsBw6fjGDhXgGFgtVX9SBcODXnQPtOH99JuQkj+2+Y9W0QfODJXWEgqixCmUV5TM2lbTDks4aEGVTYu8++1PWDYglv9V3OslRHRN8beKIAiZfzp/aRgwYQOzcpGQxlCbPKgeKrM9M60QU3EHBQt/IqzjpJu3YWumJvzzxqRz1mkCT6jnSBbXB4h0rRx9vJ9MVKCPtkmWr8/03uCNu24ihf2VVQDlI218HKEj/ytOauJW5qKUNmhcsGnY/sdmwxbHcMGPfBJkcoghgWBgGkxKYwZkoRB6Wi0OYPCzYPyjA8VhDLCjpWBChs2g3cUERdH0E8ARn8U5dn5+6kgHhG7Bg9ziFcimjRK7+lhGB2kI8KEeIAguIoh5pawpiDSzKiVhf3w6fvJhPP1ow3jmzpCwqgLKJ5Xa5r0M4o8UXYNF3lx7U0gbNCxYTUB7/4MQpV+XrkvJF4BkwYsQg6ohJR56l8575bPCIJwAxYVbhtrTqQqdgMbFMpNdOXMH1pbv2n8xKMzFlUh1rZekQeUxyABGv470Vx7N57My1nEdZM21e2lmeOCtryQ4toGuHevvpcpRjbWpCMWfApL0Aoy6cJOtvqT37krVJWVaWIHn9tYDKMl+XuARw3ZhXgFxWOVhW0pxg0VjsFptXoNUed5i8KVKH1caaCBDSk2j9jeOqF5jSe28CcLgY1J6ycr7mnQkBSGxX+f6qqyTvow1BOFm0p0a+KVcboh21dA3hjM0htWhXUG5zep/LSX2KdsZ37Wq/exPEuqLPBVgA1bjW0gbNCxa7y5QfBQKN3eda2gmNF/EJBRNA4pXnBvw8YIHmxXDn7YRm097Dp7vziohVXLiWNmgesCzLcjsKpbvQK2ppJzQ+RGLkO2+ngYLcjzefqJsTLOQlKyHAQntuHE/19G+LdAqQS6LbGATfwifSpOs1Mz37nmk6fbusyFP71tahpLEiUfnNc63upsw3q38MS+ov77xFdJiyrTWaEywUvfLOWwemKXW1tG+LKIIHkoVjH6kkezo2xlhL/AWAzrz2u9xDYap7ZweZ/8WmXbss+zDMbpaUqP/yG3+HQUWsKOzcgnKPi7Pg2mcyWGgci2HNISY4J1uUEe/fNhkbXu8Aivnlra6lLWlOsHCQMfkCLJ5p5rW0b4tMNucZ/clfPhV0+faz7P3F/ZxF1s7mtqbmavHQ9PkrpDlw9Fw+P8SH9HD6GlPOLya8fjKZPVMCow6kbFyEmcwk1w5+nPDicgMACAAxqTkCYwuA15WJ6ixSm0O9TTIW3BIBFm6IQU6XzgkWIseARaGjcOdtgOXc1YddkxJZqbFLXYJFuznyKOrSBFgcNvNbXk6zPIlX7jdlJcIh9F0ZUUfUw8vKH8I3gkMRT+rDiYQ6ANoog0XftD3mtXbnbY3mBIuJsdqi0ObO23crbwMstiAEP5l8JGQhNudKsDTbCH/O76WRJ4Pl8JlumTiodyYx3hHBwGJQow7E72TSufZtG3TNzQQiHEe93oVHWGwO5ZGpSvwB7rsGyyB33tZoTrDYpQ0RxPVO3tZ2Vd8mzYihnzP75ExCjjDwcrbBYnNv7Ybt2WtrUOgLVvegYAGKqAPxM4mOMy64E24TeYJir4lYUq64GHm58bX7XYNF7E845PQjh07M45BDfcGC3Y7inbcBFh1c8dHGfMrA32VJ2axxllg1JtYA2fCzqgYFC1JHkPpxFrqKfSTKovTGC0cpOUvs0FOW1UFkqftdg2WQO29r1BcsVgwLI8Ci8FG48zbAYjLa+pOJqYElT2CaVDvYOQwyTfSgYFFGW2cx+ZRg7bBKtYOViPMKubBbPMo6yyB33taoL1ggbRTvvF0oWOgUFE/iCFcYXAz1t4aUBXilNaRdQihGGSyD3Hlbo75gsZFmmz7AQt6Owp23RAo/Cz+GVV5+Y/61/SzlQEhvkkWdrUtmduSTVj76zMy7ZfP6WQBXPLLgKOEKdpC1T32j6mfRV4so5hXAhW8O0p6+YLHaxIpEoawC72pp3zY14mD2StDh/G0aHOXzrDTF4My8m0kb7wbz4Da3LHieyT8jtmbeRZm9ZbxN4g7BBUuwcGbW0rapL1hwEdwkCo1g41raCY0LDX7nbY36goV+Qk+JQkf5ztsJDUY4WzguzSnltt+dtzXqC5ZxufN2QoMTsAx6522N+oJlIXfe8i+wIih5nDzt9GR+/r50ZTY1S2sGEOUR5VZyMGXkcnO0WxNpxrpRTlCuq9XhSOfbrHq8T1S2T5057bRu4tk75bbry3Wmd9h6tE+fc7+n2xjlBuV0SbcRGlpL51mdzbfe/kQbfJNff6SfKXN228qyu+Wkd4PeeVujPmBxHOFCFyhAw5tbT5smIDXesYhLt5/nO8lc7sf5xRGWQZE6i/3xc3C/+24D79T5r7oxrlzx9luYo+X5FR0X3+q9OFmDzPSTP+Jobz78Pp8ICEVNeTR88cLy4YpRnom9dvfrHLTN4xsDZRC9c1qAc098rXbwqThRoJx7z5v6BFWzfvQLB3aGSJ8YAdfufZODuBswTY/PdDr9kAbpg0uZfTN+6md9Ksc4xD+esLBYZTb+eKyZ83w5LDFAsQXjnbbFeCi7ttejr4PeeVujKlho8hoRYOGq7rcrKe0nm/c0AdTJejKhBvn63W+yT0FkHb+DDvgNMEAk0p2HU+eWpo6ZXAMFmCbGJCnfgNpP0UH+CQMoj7oc7BKlb5+Iosa5pOPaZMU8TToX+Wzw5VMe8PqtHpMTh8z3TF9dioMyq7VV5L9Bl94i4GOJEwFuTLLHwrLQ3t1pci2wmw9eZWPARMYYqVuoB5DJzwRXlzFzyJ8Tz1gAKxP+SgLnk9RufaeQygfg6uS/MRaXbj/Lbbfg9EV8irFAyojxK8m4DHrnbY2qYIF0O8wBFsjtF/TEnHb2xcRYlcE+xZBs23U4g8yk+g5E0TAN91uEuatFHboCFsA0wVzjBtwgAUfsqQRYcA0sVznOFMknFIHowK5NIi+rupXLIabuEizq9h23spL7guXRDzlGVV/1T504QuxFRViCdxZGALMk47B0ebPglGFS1aE+CwgAcF9tnHHe3c914braLS+OdSeBR5+cPQIWeXEaFqx56jf52jfonbc1qoJFgwy0AhXsuZ+PxVkTA+ZUoMaU3zRCZ8PDaRLL7wbHoLC0DJABwGKBwb6LQcKyraZm8GbAcv/lX/KxVoOdD4OlVUIUATqQGkB7W3aZDYpzOCVYlOtoBsAQoQKe5uIs+kgc4RqccLiDb0SQuuLeXCIIMPpNgPcmFgcyJjgHEaMdMX766JtFWo6pZwfobVnEmW9gMU8O2RkD3IpUqAFWfosqmMBcd97WqAoWK3bQO2/DxU6slEpZkMnLk5s63gZLXkFpgi6mvAEWMb88rEQPdqrzzi2rowSLCTKhviujOS+9IQPdSicaTIpYFeydb8FzgEUZTlbm4KcEHAHL84FFHSaZPnb6wp28ELB79+oCClECNMoWRVf2FUlv5d948F2eNCcnjHXWR1J9JVi0vwQLpZuotuXgXFNz78yy7KXGZXmPtZ240/ZamKT+G7cAy1x33taoChbsUoUBlrnuvAUANxhYCWI9GjbdrOA8GOmvS+5MBE5Qdp5yRTxR4EIMfZ7YMzlucgDGHS4GyUT0cJYEZm5zG3nMwRADVrUjttJTQl3XQfmzGh0spzBmsCRup50G2AozyVZ3FSxJDOGcdCv1AyRF2eRrW7xzq4H2Kkdfy3EiHukHJhZQ6HLKMK429kyisoyfXXQ6i/tS9EnZRLZ8gGrLwiLUfnU3wGlEY9wO7gKBEiyecfISLAAJrGU756IqWBRa2uIUN5NbS6uBJswAAQ02ibVh8SaMPkKWahil1DUPWK/3Vg7lzVnfUHBNEABeTiuVto7jsMTaYDHhbW6nLZRnbQYmgEDq1h/iw0oKsMhjEE98eTOzcMDtx1mcZKRHuW9Fm5zo025twfaFL3y0dkte2fphDKNd6oiFEYo4bslCMtH6LsiMuNVXIlj9AGUslKl9rgQR8xuLhGrgWb+0RxuIJwutfZsoYDc3UcyAZa47b2tUBcuwd95aIQYDGCDXKgYegx2nAymDrI/47i8LKW5W8ld+G3dWDTBJj3WaFKv/TNL4rTKxr4AJOGU7DJ5vxEqpYwGVO0+8Z3nIWw4Uq4JyHOzbyjXh2kJhlV57Z+iXvMJNtPBOfov4pt/Gy5hE+foAsL1l0HMaDiQtzhE3SRl7YlG7YlzaebWPggssnrVJPqA7mvSz2kIa5s7bGlXBspA7b303QRRKqCdKepHdOJBYTBRK/2RBhyINELBqrOT8O32jU/ge34gYHA5nop+U5SPlScd3E2EBSDpl5ZsP0sTIW95cIC0RI2+IlGgLsaA8eXFM5Dn8Q77jnFt2HMynBTy322WitDnyz5ST6kt1SSOPvKLw8gKaXpzRlnZe73L9iXAfviFtyOM+nbckC3CYO29rVAUL51FZKPbWHoB+FB3ol36u7/3yZMrfpr+Xzy3qV3Z8a57T30qaMl/7uUa17/3apb4y3Uz6mTSDvJ/5PljeIO6BYe68rdEssFgFrAcFIqyyzdImNH6E+wgEC7CYV7pSLW0/mgUWhZKvClTwm7vzdkLvkuheLLFB77yt0SywkO1v+s7bCb17GvbO2xr1gIW8y062ZKYqkL5ir4fZVaab0PgRyy0sXDTfnbc1mgUWpiPzrwFL/ztvad/NP8j2j7InNCpUC74OJhBAQfPdeVujWWBhtwcC/eXIqYGF74CpZ+d1QiNEiYO054tkGPbO2xrNAgtOgqMokBLEQTVsoRMaLcJBOEhLsHAC1tLORS2w/Hp33k7o3RFn6Pkh77ytUS9Ykqxj/YQt/ibvvJ3QuyNe4GHvvK1RD1goRr/mnbe/FtklZwZqPy6IPHNx53eJ7Prmd9OEi6Lm97Lsc7DXYhfW7zKtOpSB6GrKsiFZc+2PItm2sLkYYOGQm+/O2xr1gMWAx24z4sSJwRpdWpo3Bynior4AhKVm78aurn0tO+Fc2/ZT1qRvnr2zuWmH2V6V/SxB6vZw7DyzCuUVQKUO36WX1h6V/zrC8li67N1fmzYf2WsKCxfRRee787ZGXbBYIfaAuhuISRS96Ttvfy2ywrFVm4PAEiEE23cfycCxebnn0Om8AQhAeeKT4i6MQFrPwCOQSCwJ4NkUFC4QYLFBylIEGAFPgARouFGtTaNEgG8vKMAiLqa9Yz8I9YDFAFB+FNg45Mb3zluiwt9wKOof2R2hA6WPIZ7j7yCiZRzET9BC7rytURcsxI04jFBuKUGTO28XBy3kztsaFWCZ3Hm7GAkHXMidtzXqgoUtLqwvwEJ7HiaYd9TIIDWioldchIXTWEMz3yJ9+S5IeuODdWfyvICV+S5I2xdy522NumBhCYniD7CMwp23w5IBCBNZrEYOip7+7S+AODlAqXVyQIB193sCgRXYBD+7BLkJyEb2wMS5OgYiCNw5H4fY2kAcRdIP7Q6gmF/bArW081EXLEIinQ8KsHiOkL9xISBwBsmtkjzR+kBpFwAtpNAJAoHazhA5Y8RMBhoHvlhATgE4mbh5x8HMZVlNwOQkonGh/Dunw1Qfl4XE6lnInbc16oKFyBFtH4WOwp23w5IboUT3M3fFowKBI6AHj5/Pq2tDYr9CRlkHTgps2LQ7HxKj2DOJRdH7y4T+dOu+vDNrsAMsAsYB7IsEGIfhwtIaZeJUFage82qxRJzzsNQFC7SVp9VG4c7bYcnBLqGDDplzrNks45xziqA5prIzgwYQgMWxjp17jmXxS/z4y7dC7DjLQ9zgrsQT7mRBCXLms+h3qG7UiMh5+mr4O29r1AVLT3BMKtRZoXGQySVxuKELN59kJc5kA8zpi3czR+GcAxaeV+KKI44Yoo9450C6fMQXwMhPl+GEowMdSGkdSbErL884LCaiNBxywKL/C3HIoZYY+qkrm0fhztthiSf3iwu3s7dVf+gl9A83YQNF3hbYdTifRyaKHG/1LA+3PfHlnLQTku6KbUzMZRk4J8/fylYFkJ25fDeLqoVYFG+bFnrnbY26YKGfGEDyDduyB1ImnNB40kLvvK1RFywom57Y7tTqoeMzJzSaRF9byJ23NeoBy4QWF/GxOIud9dBE9ofoXgsVnxOwLGKit7ndogQLQ6aWdhCagGXR0uvdeVujgcCCbWXXd6poQuNBQMHB6J4XQKHcDnPnbY3mBQug8Ia6koKNPqHxIVeHAUmAZZg7b2s0EFj4KDjsVDih8aIQQfSVYe68rdFAYIlrrKLiCY0fuXKNo/VXB4tIqyaQewapExofstBtIIqxfp0tnIEUXMckhOLZ3lbxhMaHRPLbIRfAXpvbwWlJ5/8B3OvBMRol/9cAAAAASUVORK5CYII=", alt: "cnbc" }), (0, _i.jsx)("span", { children: "Named CNBC\u2019s Top FinTech Companies 2025" })] })] });
    function _o() { const e = kt(), t = u((0, r.useState)([]), 2), n = t[0], i = t[1], a = u((0, r.useState)([]), 2), o = a[0], s = a[1], l = u((0, r.useState)(315735436), 2), c = (l[0], l[1]), d = { NODE_ENV: "production", PUBLIC_URL: "", WDS_SOCKET_HOST: void 0, WDS_SOCKET_PATH: void 0, WDS_SOCKET_PORT: void 0, WDS_SOCKET_PROTOCOL: void 0, FAST_REFRESH: !0, REACT_APP_API_URL: "http://localhost:5000" }.REACT_APP_QR_CODE_URL || window.location.origin, p = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=".concat(encodeURIComponent(d)), h = u((0, r.useState)(315735436), 2), f = h[0], g = h[1], m = u((0, r.useState)(null), 2), x = m[0], b = m[1]; (0, r.useEffect)(() => { y(), v(); }, []); const y = async () => { try {
        const e = await ko(), t = await Ai.get("".concat(e, "/api/coins"), { params: { vs_currency: "usd", order: "market_cap_desc", per_page: 5, page: 1 } });
        i(t.data || []);
    }
    catch (Rl) {
        console.log("Coins error:", Rl.message), i([]);
    } }, v = async () => { try {
        const e = await ko(), t = await Ai.get("".concat(e, "/api/news"));
        s(Array.isArray(t.data) ? t.data.slice(0, 5) : []);
    }
    catch (Rl) {
        console.log("News error:", Rl.message), s([]);
    } }; (0, r.useEffect)(() => { const e = setInterval(() => { const e = Math.floor(7 * Math.random()) + 2; c(t => { const n = t + e; return w(t, n), n; }); }, Math.floor(2e3 * Math.random()) + 4e3); return () => clearInterval(e); }, []); const w = (e, t) => { let n = 0; const r = t - e, i = setInterval(() => { n++; const a = n / 30, o = Math.floor(e + r * a); g(o), 30 === n && (clearInterval(i), g(t)); }, 800 / 30); }; return (0, _i.jsxs)("div", { className: "landing", children: [(0, _i.jsxs)("div", { className: "hero", children: [(0, _i.jsxs)("div", { className: "hero-left slide-left", children: [(0, _i.jsx)("h1", { className: "big-number", children: f.toLocaleString() }), (0, _i.jsxs)("h2", { className: "trust-text", children: ["USERS ", (0, _i.jsx)("br", {}), " TRUST US"] }), (0, _i.jsx)("p", { className: "tagline", children: "The World\u2019s Leading Cryptocurrency Exchange" }), (0, _i.jsxs)("div", { className: "badges", children: [(0, _i.jsxs)("div", { className: "badge", children: [(0, _i.jsxs)("div", { className: "badge-top", children: [(0, _i.jsx)("img", { src: "https://cdn-icons-png.flaticon.com/512/616/616490.png", className: "laurel-img", alt: "" }), (0, _i.jsx)("div", { className: "badge-title", children: "No.1" }), (0, _i.jsx)("img", { src: "https://cdn-icons-png.flaticon.com/512/616/616490.png", className: "laurel-img", alt: "" })] }), (0, _i.jsx)("div", { className: "badge-sub", children: "Customer Assets" })] }), (0, _i.jsxs)("div", { className: "badge", children: [(0, _i.jsxs)("div", { className: "badge-top", children: [(0, _i.jsx)("img", { src: "https://cdn-icons-png.flaticon.com/512/616/616490.png", className: "laurel-img", alt: "" }), (0, _i.jsx)("div", { className: "badge-title", children: "No.1" }), (0, _i.jsx)("img", { src: "https://cdn-icons-png.flaticon.com/512/616/616490.png", className: "laurel-img", alt: "" })] }), (0, _i.jsx)("div", { className: "badge-sub", children: "Trading Volume" })] })] }), (0, _i.jsxs)("div", { className: "cta", children: [(0, _i.jsx)("button", { className: "btn-outline", children: "Up to $100 Bonus" }), (0, _i.jsx)("button", { className: "btn-main", onClick: () => e("/login"), children: "Sign Up" })] }), (0, _i.jsxs)("div", { className: "socials", children: [(0, _i.jsx)("button", { className: "social-box google", children: (0, _i.jsx)("img", { src: "https://www.svgrepo.com/show/475656/google-color.svg", alt: "Google" }) }), (0, _i.jsx)("button", { className: "social-box apple", children: (0, _i.jsx)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "white", xmlns: "http://www.w3.org/2000/svg", children: (0, _i.jsx)("path", { d: "M16.365 1.43c0 1.14-.47 2.28-1.23 3.12-.8.9-2.1 1.6-3.18 1.5-.13-1.1.5-2.3 1.2-3.08.8-.9 2.2-1.57 3.21-1.54zM20.5 17.5c-.9 2.1-1.9 4.2-3.7 4.24-1.2.02-1.6-.7-3-.7-1.4 0-1.9.68-3.05.72-1.8.06-3.1-2.2-4-4.3-1.8-4.1-.5-10.2 3.4-10.3 1.3-.03 2.5.9 3.3.9.8 0 2.2-1.1 3.7-.94 1.1.04 4.1.45 4.8 4.2-.1.06-2.8 1.7-2.7 5.2.1 4.2 3.7 5.6 3.7 5.6z" }) }) })] })] }), (0, _i.jsxs)("div", { className: "hero-right", children: [(0, _i.jsxs)("div", { className: "card slide-right right-top", children: [(0, _i.jsxs)("div", { className: "card-header", children: [(0, _i.jsx)("span", { children: "Popular" }), (0, _i.jsx)("span", { className: "link", children: "View More" })] }), (0, _i.jsx)("div", { className: "market-list", children: n.map(e => { var t; return (0, _i.jsxs)("div", { className: "coin", children: [(0, _i.jsxs)("div", { className: "coin-name", children: [(0, _i.jsx)("img", { src: e.image, alt: "" }), e.symbol.toUpperCase()] }), (0, _i.jsxs)("div", { children: ["$", e.current_price] }), (0, _i.jsxs)("div", { className: e.price_change_percentage_24h > 0 ? "green" : "red", children: [null === (t = e.price_change_percentage_24h) || void 0 === t ? void 0 : t.toFixed(2), "%"] })] }, e.id); }) })] }), (0, _i.jsxs)("div", { className: "card slide-right right-bottom", children: [(0, _i.jsxs)("div", { className: "card-header", children: [(0, _i.jsx)("span", { children: "News" }), (0, _i.jsx)("span", { className: "link", onClick: () => e("/news"), children: "View All" })] }), (0, _i.jsx)("div", { className: "news-list", children: 0 === o.length ? (0, _i.jsx)("div", { style: { opacity: .6 }, children: "Loading news..." }) : o.map((e, t) => (0, _i.jsx)("div", { className: "news-item", children: e.title }, t)) })] })] })] }), (0, _i.jsx)("div", { className: "ticker", children: (0, _i.jsxs)("div", { className: "ticker-track", children: [(0, _i.jsx)("div", { className: "ticker-content", children: (0, _i.jsx)(Uo, {}) }), (0, _i.jsx)("div", { className: "ticker-content", children: (0, _i.jsx)(Uo, {}) })] }) }), (0, _i.jsxs)("div", { className: "safu-section", children: [(0, _i.jsxs)("div", { className: "safu-left", children: [(0, _i.jsxs)("h2", { children: ["FUNDS ARE ", (0, _i.jsx)("br", {}), (0, _i.jsx)("span", { children: "SAFU" })] }), (0, _i.jsx)("p", { children: "The Security of User Assets Fund (SAFU) was established in 2018 to protect your funds in rare emergencies. Your security is our priority." })] }), (0, _i.jsxs)("div", { className: "safu-right", children: [(0, _i.jsx)("p", { className: "safu-top", children: "As of February 2026, the SAFU fund wallet comprises a reserve of" }), (0, _i.jsx)("h3", { children: "15,000 BTC" }), (0, _i.jsx)("p", { className: "wallet", children: "SAFU Wallet: 1BAuq7Vho2CEKvKJxbfU26LhwQjbCmWQkD" }), (0, _i.jsxs)("div", { className: "safu-stats", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h2", { children: "7,488,223" }), (0, _i.jsx)("span", { children: "Users helped" })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("h2", { children: "$229,433,449" }), (0, _i.jsx)("span", { children: "Funds recovered" })] })] })] })] }), (0, _i.jsx)("div", { className: "app-section", children: (0, _i.jsxs)("div", { className: "app-container", children: [(0, _i.jsxs)("div", { className: "app-phone", children: [(0, _i.jsx)("img", { src: Io, alt: "app", className: "phone-img" }), (0, _i.jsxs)("div", { className: "app-tabs", children: [(0, _i.jsx)("span", { children: "Desktop" }), (0, _i.jsx)("span", { children: "Lite" }), (0, _i.jsx)("span", { className: "active", children: "Pro" })] })] }), (0, _i.jsxs)("div", { className: "app-content", children: [(0, _i.jsxs)("h2", { children: ["Trade on the go. Anywhere,", (0, _i.jsx)("br", {}), " anytime."] }), (0, _i.jsxs)("div", { className: "qr-row", children: [(0, _i.jsx)("div", { className: "qr-box", children: (0, _i.jsx)("img", { src: p, alt: "Download app QR code" }) }), (0, _i.jsxs)("div", { className: "qr-text", children: [(0, _i.jsx)("p", { className: "scan-text", children: "Scan to Download App" }), (0, _i.jsx)("p", { className: "platform-text", children: "iOS and Android" })] })] }), (0, _i.jsxs)("div", { className: "platforms", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("span", { children: "\uf8ff" }), (0, _i.jsx)("p", { children: "MacOS" })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("span", { children: "\ud83e\ude9f" }), (0, _i.jsx)("p", { children: "Windows" })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("span", { children: "\ud83d\udc27" }), (0, _i.jsx)("p", { children: "Linux" })] })] })] })] }) }), (0, _i.jsx)("div", { className: "faq-section", children: (0, _i.jsxs)("div", { className: "faq-container", children: [(0, _i.jsx)("h2", { className: "faq-title", children: "Frequently Asked Questions" }), [{ q: "Why is Swancore the best exchange for crypto traders?", a: "Swancore stands out as a premier cryptocurrency exchange by combining deep global liquidity with competitive fees, helping traders execute efficiently across market conditions. The platform brings together Spot, Futures, Earn, and P2P markets in one seamless ecosystem, so users can diversify strategies without switching tools. Real-time price tracking, curated insights on top gainers and losers, and discovery of emerging assets make it easier to spot opportunities as they develop.\n\nBeyond trading, Swancore offers early participation in promising projects through MegaDrop and access to innovative pre-listing opportunities via Alpha\u2014giving users a potential edge before broader market exposure. Backed by strong security infrastructure and an intuitive interface, Swancore delivers both performance and confidence, making it an attractive choice for traders looking to grow and manage their crypto portfolios effectively." }, { q: "What products does Swancore provide?", a: 'Swancore supports <span class="highlight">Spot</span>, <span class="highlight">Futures</span>, <span class="highlight">Earn</span>, and <span class="highlight">P2P</span>.' }, { q: "How to buy crypto?", a: "Sign up, verify, deposit funds, and start trading instantly." }, { q: "How to track prices?", a: 'Use real-time dashboard for <span class="highlight">live market tracking</span>.' }, { q: "How to trade?", a: "Choose market \u2192 place order \u2192 manage positions." }, { q: "How to earn?", a: 'Earn via <span class="highlight">staking</span> and savings.' }].map((e, t) => (0, _i.jsxs)("div", { children: [(0, _i.jsxs)("div", { className: "faq-item ".concat(x === t ? "active" : ""), onClick: () => b(x === t ? null : t), children: [(0, _i.jsxs)("div", { className: "faq-left", children: [(0, _i.jsx)("div", { className: "faq-number", children: t + 1 }), (0, _i.jsx)("div", { className: "faq-question", children: e.q })] }), (0, _i.jsx)("div", { className: "faq-icon", children: x === t ? "\u2212" : "+" })] }), x === t && (0, _i.jsx)("div", { className: "faq-answer", children: (0, _i.jsx)("div", { dangerouslySetInnerHTML: { __html: e.a } }) })] }, t))] }) }), (0, _i.jsx)("div", { className: "cta-banner", children: (0, _i.jsxs)("div", { className: "cta-content", children: [(0, _i.jsx)("h2", { children: "Secure, Low-Fee Trading on SwanCore" }), (0, _i.jsx)("button", { className: "cta-btn", onClick: () => e("/login"), children: "Sign Up Now" })] }) }), (0, _i.jsx)("div", { className: "footer", children: (0, _i.jsxs)("div", { className: "footer-container", children: [(0, _i.jsxs)("div", { className: "footer-col", children: [(0, _i.jsx)("h4", { children: "About Us" }), (0, _i.jsx)("span", { onClick: () => { console.log("clicked about"), e("/about"); }, children: "About" }), (0, _i.jsx)("span", { className: "footer-link", onClick: () => e("/careers"), children: "Careers" }), (0, _i.jsx)("span", { className: "footer-link", onClick: () => e("/imformation"), children: "Imformation" }), (0, _i.jsx)("span", { className: "footer-link", onClick: () => e("/building-trust"), children: "Building Trust" }), (0, _i.jsx)("span", { className: "footer-link", onClick: () => e("/legal/privacy"), children: "Privacy Notice" }), (0, _i.jsx)("span", { children: "Community" }), (0, _i.jsx)("span", { children: "Risk Warning" }), (0, _i.jsx)("span", { children: "Notices" }), (0, _i.jsx)("span", { children: "Secure Internal Communication Channel" })] }), (0, _i.jsxs)("div", { className: "footer-col", children: [(0, _i.jsx)("h4", { children: "Products" }), (0, _i.jsx)("span", { children: "Exchange" }), (0, _i.jsx)("span", { children: "Buy Crypto" }), (0, _i.jsx)("span", { children: "Pay" }), (0, _i.jsx)("span", { children: "Crypto Payments" }), (0, _i.jsx)("span", { children: "Gift Card" }), (0, _i.jsx)("span", { children: "Auto-Invest" }), (0, _i.jsx)("span", { children: "ETH Staking" }), (0, _i.jsx)("span", { children: "Charity" })] }), (0, _i.jsxs)("div", { className: "footer-col", children: [(0, _i.jsx)("h4", { children: "Business" }), (0, _i.jsx)("span", { children: "Institutional & VIP Services" }), (0, _i.jsx)("h4", { className: "footer-sub", children: "Learn" }), (0, _i.jsx)("span", { children: "Learn & Earn" }), (0, _i.jsx)("span", { children: "Browse Crypto Prices" }), (0, _i.jsx)("span", { children: "Bitcoin Price" }), (0, _i.jsx)("span", { children: "Ethereum Price" }), (0, _i.jsx)("span", { children: "Ethereum Upgrade (Pectra)" })] }), (0, _i.jsxs)("div", { className: "footer-col", children: [(0, _i.jsx)("h4", { children: "Service" }), (0, _i.jsx)("span", { children: "Historical Market Data" }), (0, _i.jsx)("span", { children: "Trading Insight" }), (0, _i.jsx)("span", { children: "Proof of Reserves" }), (0, _i.jsx)("h4", { className: "footer-sub", children: "Support" }), (0, _i.jsx)("span", { children: "24/7 Chat Support" }), (0, _i.jsx)("span", { children: "Support Center" }), (0, _i.jsx)("span", { children: "Fees" }), (0, _i.jsx)("span", { children: "Trading Parameters" }), (0, _i.jsx)("span", { children: "Law Enforcement Requests" }), (0, _i.jsx)("span", { children: "How to Raise a Complaint" })] })] }) })] }); }
    const Wo = function () { const e = u((0, r.useState)([]), 2), t = e[0], n = e[1], i = u((0, r.useState)(null), 2), a = i[0], o = i[1]; (0, r.useEffect)(() => { let e = null; return (async () => { e = await Ao(); const t = localStorage.getItem("news-cache"); t && n(JSON.parse(t)), e.on("news-update", e => { const t = Array.isArray(e) ? e : []; n(t), localStorage.setItem("news-cache", JSON.stringify(t)); }); })(), () => { e && (e.off("news-update"), e.disconnect()); }; }, []); const s = e => { o(t => t === e ? null : e); }; return (0, _i.jsxs)("div", { className: "feed", children: [(0, _i.jsxs)("h2", { className: "feed-title", children: [(0, _i.jsx)("span", { style: { color: "#F0B90B" }, children: "Swancore" }), "'s News"] }), t.map(e => { const t = a === e.id; return (0, _i.jsxs)("div", { className: "news-wrapper", children: [(0, _i.jsxs)("div", { className: "outside-header", children: [(0, _i.jsxs)("div", { className: "header-left", children: [(0, _i.jsx)("img", { src: "https://cdn-icons-png.flaticon.com/512/5968/5968260.png", className: "avatar", alt: "source" }), (0, _i.jsx)("span", { className: "source", children: "Swancore's News" })] }), (0, _i.jsx)("span", { className: "time", children: e.time })] }), (0, _i.jsxs)("div", { className: "card", children: [!t && e.image && (0, _i.jsx)("img", { className: "card-img", src: e.image, alt: "" }), (0, _i.jsx)("div", { className: "title", children: e.title }), t ? (0, _i.jsxs)("div", { className: "expanded-scroll", children: [(0, _i.jsx)("p", { children: e.content || "No article content available." }), (0, _i.jsx)("div", { className: "read-more", onClick: () => s(e.id), children: "Hide Article" })] }) : (0, _i.jsx)("div", { className: "read-more", onClick: () => s(e.id), children: "Read More" })] })] }, e.id); })] }); };
    function Ho() { const e = u((0, r.useState)(null), 2), t = e[0], n = e[1], i = (0, r.useRef)(null), a = (0, r.useRef)(null); return (0, _i.jsxs)("div", { className: "about-page", children: [(0, _i.jsxs)("div", { className: "about-hero", children: [(0, _i.jsx)("h1", { children: "Welcome to SwanCore" }), (0, _i.jsx)("p", { children: "At SwanCore, we believe everyone deserves the freedom to earn, store, spend, share, and transfer their money\u2014regardless of who they are or where they come from." })] }), (0, _i.jsxs)("div", { className: "about-stats", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h2", { children: "$65 bn" }), (0, _i.jsx)("p", { children: "Average daily trading volume" })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("h2", { children: "300 bn" }), (0, _i.jsx)("p", { children: "Spot transactions in 2022" })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("h2", { children: "24/7" }), (0, _i.jsx)("p", { children: "Customer support in 40+ languages" })] })] }), (0, _i.jsxs)("div", { className: "about-section", children: [(0, _i.jsx)("h2", { children: "Our Mission" }), (0, _i.jsx)("p", { children: "Today, SwanCore stands as a leading blockchain ecosystem, offering a wide range of products including one of the largest digital asset exchanges. Our mission is to build the infrastructure that will power the future of crypto and digital finance." })] }), (0, _i.jsxs)("div", { className: "about-section", children: [(0, _i.jsx)("h2", { children: "Our Ecosystem" }), (0, _i.jsxs)("div", { className: "grid", children: [(0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "SwanCore Exchange" }), (0, _i.jsx)("p", { children: "SwanCore ranks among the largest digital asset exchanges by trading volume and is regulated by the ADGM Financial Services Regulatory Authority, ensuring compliance within the crypto and digital finance ecosystem." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "SwanCore Research" }), (0, _i.jsx)("p", { children: "SwanCore Research offers institutional-grade research, comprehensive market insights, and unbiased intelligence for stakeholders across the digital asset and cryptocurrency markets." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "SwanCore Academy" }), (0, _i.jsx)("p", { children: "SwanCore Academy is a global open-learning platform delivering free education in blockchain technology, cryptocurrency, and digital financial systems in 10+ languages." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "SwanCore Charity" }), (0, _i.jsx)("p", { children: "Swancore Charity is a non-profit initiative focused on leveraging Web3, blockchain, and digital finance innovations to create positive global social impact and drive meaningful change." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "SwanCore NFT" }), (0, _i.jsx)("p", { children: "Swancore NFT is the official digital asset marketplace within the Swancore ecosystem, designed to support a community-driven platform that enhances user experience in crypto, blockchain, and digital asset trading." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "SwanCore Square" }), (0, _i.jsx)("p", { children: "Swancore Square is a unified real-time hub for the latest trends in Web3, crypto markets, and digital finance, bringing together insights from industry experts, analysts, enthusiasts, and media sources as they emerge live across the ecosystem." })] })] })] }), (0, _i.jsxs)("div", { className: "bg-[#0b0e11] text-[#EAECEF] py-20 px-6 md:px-16", children: [(0, _i.jsxs)("div", { className: "text-center mb-14", children: [(0, _i.jsx)("h2", { className: "text-4xl font-semibold", children: "Putting Our Users First" }), (0, _i.jsx)("p", { className: "text-gray-400 mt-3 max-w-2xl mx-auto text-sm", children: "Security, compliance, and trust built into every layer of SwanCore." })] }), (0, _i.jsxs)("div", { className: "space-y-8", children: [(0, _i.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [(0, _i.jsxs)("div", { className: "bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6 hover:border-yellow-400/40 transition", children: [(0, _i.jsx)("h3", { className: "text-white font-medium mb-2", children: "Our Commitment to User Protection" }), (0, _i.jsx)("p", { className: "text-gray-400 text-sm leading-relaxed", children: "Users are at the core of everything we build. We prioritize security, privacy, and compliance across the SwanCore ecosystem with global regulatory alignment." })] }), (0, _i.jsxs)("div", { className: "bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6 hover:border-yellow-400/40 transition", children: [(0, _i.jsx)("h3", { className: "text-white font-medium mb-2", children: "Secure From Day One" }), (0, _i.jsx)("p", { className: "text-gray-400 text-sm leading-relaxed", children: "Real-time monitoring, advanced risk systems, and continuous protection ensure a safe trading environment at all times." })] })] }), (0, _i.jsx)("div", { className: "grid md:grid-cols-4 gap-4", children: [{ title: "Secure Storage", desc: "Cold storage protects majority of user assets." }, { title: "Real-Time Monitoring", desc: "Risk engine tracks all sensitive account actions." }, { title: "Organizational Security", desc: "Multisig + TSS infrastructure for fund safety." }, { title: "Encryption", desc: "End-to-end encrypted data protection." }].map((e, t) => (0, _i.jsxs)("div", { className: "bg-[#1a1f2b] border border-[#2a2f3a] rounded-xl p-5 hover:border-yellow-400/40 hover:-translate-y-1 transition", children: [(0, _i.jsx)("h4", { className: "text-white text-sm font-medium mb-2", children: e.title }), (0, _i.jsx)("p", { className: "text-gray-400 text-xs", children: e.desc })] }, t)) }), (0, _i.jsxs)("div", { className: "grid md:grid-cols-3 gap-6", children: [(0, _i.jsxs)("div", { className: "bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6", children: [(0, _i.jsx)("h3", { className: "text-white font-medium mb-3", children: "Safe Sign-In" }), (0, _i.jsx)("p", { className: "text-gray-400 text-sm", children: "Multi-factor authentication and hardware keys." })] }), (0, _i.jsxs)("div", { className: "bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6", children: [(0, _i.jsx)("h3", { className: "text-white font-medium mb-3", children: "Access Control" }), (0, _i.jsx)("p", { className: "text-gray-400 text-sm", children: "IP + wallet whitelist + device controls." })] }), (0, _i.jsxs)("div", { className: "bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6", children: [(0, _i.jsx)("h3", { className: "text-white font-medium mb-3", children: "Security Alerts" }), (0, _i.jsx)("p", { className: "text-gray-400 text-sm", children: "Instant fraud detection notifications." })] })] }), (0, _i.jsxs)("div", { className: "bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-8", children: [(0, _i.jsx)("h3", { className: "text-white font-medium mb-4", children: "Opening New Doors for Digital Finance" }), (0, _i.jsx)("p", { className: "text-gray-400 text-sm mb-6", children: "We maintain strict global compliance standards to ensure transparency and trust." }), (0, _i.jsxs)("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [(0, _i.jsxs)("div", { className: "bg-[#0f141c] border border-[#2a2f3a] rounded-xl p-4 text-center", children: [(0, _i.jsx)("p", { className: "text-white text-lg font-semibold", children: "500%" }), (0, _i.jsx)("p", { className: "text-gray-500 text-xs", children: "Team Growth" })] }), (0, _i.jsxs)("div", { className: "bg-[#0f141c] border border-[#2a2f3a] rounded-xl p-4 text-center", children: [(0, _i.jsx)("p", { className: "text-white text-lg font-semibold", children: "5,600+" }), (0, _i.jsx)("p", { className: "text-gray-500 text-xs", children: "Legal Requests" })] }), (0, _i.jsxs)("div", { className: "bg-[#0f141c] border border-[#2a2f3a] rounded-xl p-4 text-center", children: [(0, _i.jsx)("p", { className: "text-white text-lg font-semibold", children: "80+" }), (0, _i.jsx)("p", { className: "text-gray-500 text-xs", children: "Countries" })] })] }), (0, _i.jsx)("div", { className: "flex flex-wrap gap-2", children: ["KYC", "AML", "Sanctions", "Compliance"].map((e, t) => (0, _i.jsx)("span", { className: "px-3 py-1 text-xs rounded-full bg-[#0f141c] border border-[#2a2f3a] text-gray-300", children: e }, t)) })] })] }), (0, _i.jsx)("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "5vh" }, children: (0, _i.jsx)(Zt, { to: "/legal", style: { background: "#facc15", color: "black", padding: "12px 30px", borderRadius: "8px", fontWeight: "600" }, children: "Learn More" }) })] }), (0, _i.jsxs)("div", { className: "about-section", children: [(0, _i.jsx)("h2", { children: "Our Founders" }), (0, _i.jsxs)("div", { className: "grid", children: [(0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "CZ (Changpeng Zhao)" }), (0, _i.jsx)("p", { children: "Founder & visionary leader." })] }), (0, _i.jsxs)("div", { className: "card", children: [(0, _i.jsx)("h3", { children: "Yi He" }), (0, _i.jsx)("p", { children: "Co-founder & strategist." })] })] })] }), (0, _i.jsxs)("div", { className: "about-section", children: [(0, _i.jsx)("h2", { children: "SwanCore Board of Directors" }), (0, _i.jsx)("div", { className: "grid", children: ["Zakir Khan", "Tin Wang", "Max Zang", "Richard Jeng", "Roger Smith", "Salman Hussain"].map((e, r) => (0, _i.jsxs)("div", { className: "card ".concat(t === e ? "active" : ""), onClick: () => (e => { n(e), setTimeout(() => { var t, n; "Zakir Khan" === e && (null === (t = i.current) || void 0 === t || t.scrollIntoView({ behavior: "smooth", block: "start" })), "Tin Wang" === e && (null === (n = a.current) || void 0 === n || n.scrollIntoView({ behavior: "smooth", block: "start" })); }, 100); })(e), style: { cursor: "pointer" }, children: [(0, _i.jsx)("h3", { children: e }), (0, _i.jsx)("p", { children: "Click to view details" })] }, r)) }), "Zakir Khan" === t && (0, _i.jsxs)("div", { ref: i, className: "details-box", children: [(0, _i.jsx)("h2", { children: "Zakir Khan" }), (0, _i.jsx)("p", { style: { whiteSpace: "pre-line" }, children: "\nZakir Khan is a globally recognized technology entrepreneur, experienced board member, and former diplomat known for his work at the intersection of regulatory innovation and financial technology. With over 13 years in the blockchain sector, he has navigated complex financial systems across Asia, the Middle East, Europe, and the United States, working within diverse regulatory environments and industries.\n\nMr. Khan played a key role in strengthening international relations by helping establish Barbados\u2019 diplomatic presence in the Middle East, serving as Ambassador to the United Arab Emirates and Non-Resident Ambassador to Kuwait.\n\nIn 2013, he became the founding CEO of Bitt, a pioneering company behind one of the earliest Central Bank Digital Currency (CBDC) initiatives. He later co-founded Digital Asset Capital Management (DACM) in 2016, a hedge fund that quickly gained recognition as a top performer in the digital asset space.\n\nIn April 2018, he was appointed Special Technology Advisor to Bermuda\u2019s Prime Minister, David Burt. He also contributed to global policy discussions as part of the World Economic Forum\u2019s Global Future Council on Cryptocurrencies.\n\nHe holds a Bachelor\u2019s Degree in Information Technology with a specialization in Network Security from Ontario Tech University and has received an Honorary Doctorate in Law from the University of the West Indies.\n\nAs Chairman of SwanCore\u2019s Board of Directors, he focuses on collaboration between governments, regulators, and technology leaders worldwide.\n" })] }), "Tin Wang" === t && (0, _i.jsxs)("div", { ref: a, className: "details-box", children: [(0, _i.jsx)("h2", { children: "Tin Wang" }), (0, _i.jsx)("p", { style: { whiteSpace: "pre-line" }, children: "\nTin Wang is a highly qualified legal and financial professional, recognized for her expertise across Asian and international markets. She is admitted to practice law in the State of California and is also a Solicitor of England and Wales. With extensive experience in leveraged finance, acquisitions, project financing, and mergers & acquisitions (M&A), she brings a strong financial and regulatory perspective to cross-border transactions.\n\nMs. Wang serves as an independent board member of SwanCore\u2019s Board of Directors, focusing on financial structuring, compliance, and global expansion.\n\nShe is the CEO of Bayview Acquisition Corp and a consulting partner at BHR Partners.\n\nShe holds a Bachelor of Commerce from McGill University and a Juris Doctor from Boston University School of Law.\n" })] })] })] }); }
    function Vo() { return (0, _i.jsxs)("div", { className: "text-[#EAECEF] min-h-screen px-6 md:px-20 py-16", style: { background: "radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%), radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%), radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%), linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%)", backgroundRepeat: "no-repeat", backgroundSize: "cover" }, children: [(0, _i.jsxs)("div", { className: "text-center mb-14", children: [(0, _i.jsx)("h1", { className: "text-4xl font-semibold text-white", children: "Licenses, Registrations & Legal Matters" }), (0, _i.jsx)("p", { className: "text-gray-400 mt-3 text-sm max-w-3xl mx-auto", children: "SwanCore operates under a global regulatory framework with licensed entities across multiple jurisdictions." })] }), (0, _i.jsxs)("div", { className: "space-y-10", children: [(0, _i.jsx)(qo, { title: "Global - ADM (Abu Dhabi)", children: "Abu Dhabi  Markets (ADM) SwanCore\u2019s global platform, SwanCore.com, is now regulated by the ADGM Financial Services Regulatory Authority (FSRA) via three separate licensed entities: \u2022 Nest Exchange Limited is recognised as a Recognised Investment Exchange (Derivatives), with a stipulation for Operating a Multilateral Trading Facility for Virtual Assets and Fiat-Referenced Tokens. \u2022 Nest Clearing and Custody Limited is recognised as a Recognised Clearing House (Derivatives), with a stipulation for Providing Custody and operating a Central Securities Depository. \u2022 Nest Trading Limited holds a Financial Services Permission to provide various Regulated Activities, including Dealing in Investments as Principal, Dealing in Investments as Agent, Arranging Deals in Investments, Managing Assets, Providing Money Services, and Arranging Custody." }), (0, _i.jsxs)(qo, { title: "Europe", children: [(0, _i.jsx)(Ko, { title: "France", children: "SwanCore France SAS has been granted registration as a Digital Service Provider (DSP) by the Autorit\xe9 des Financiers (AF) (registration number E22-307). SwanCore France SAS can provide the following regulated services in France: digital assets custody; purchase/sale of digital assets for legal tender; exchange of digital assets for other digital assets; and operation of a trading platform for digital assets." }), (0, _i.jsx)(Ko, { title: "Italy", children: "SwanCore Italy S.R. has been granted a Digital Asset Provider (DAP) registration by the Organismo Mediatori (OM) (registration number PV5). The registration enables SwanCore Italy S.R. to provide crypto asset exchange and custody services." }), (0, _i.jsx)(Ko, { title: "Spain", children: "Spain, has been granted registration as a Virtual Asset Provider by the Bank of Spain (registration number D462). The registration enables SwanCore Spain, to provide crypto asset exchange and custody services." }), (0, _i.jsx)(Ko, { title: "Poland", children: "SwanCore Poland Sp\xf3\u0142ka z Ograniczon\u0105 has been granted Virtual Service Provider (VSP) registration by the Polish Tax Administration Chamber of Poland i (registration number RERT \u2013 675). The registration enables the company to provide crypto asset exchange and custody services." }), (0, _i.jsx)(Ko, { title: "Sweden", children: "SwanCore AB has been granted registration as a Financial Institution for management and trading in virtual currency by the Swedish Supervisory Authority (registration number 73342). The registration enables the company to provide a comprehensive range of products, including (amongst others) spot trading, OTC convert, custody, staking, savings, card and pay services." })] }), (0, _i.jsxs)(qo, { title: "Middle East", children: [(0, _i.jsx)(Ko, { title: "Bahrain", children: "SwanCore Bahrain BST has been granted a Category 4 licence as a Crypto-Asset Provider (CAP) by the Central Bank of Bahrain. The licence enables SwanCore Bahrain BS(c) to operate as a crypto-asset exchange and custody services provider. BPay Global BS(c) has been granted a Category 5, Type 7 license as an Ancillary Services Provider by the Central Bank of Bahrain. This license enables BPay Global BS(c) to operate as a Payment Service Provider." }), (0, _i.jsx)(Ko, { title: "Dubai", children: "SwanCore ZE has been granted a Virtual Asset Provider (VAP) Licence by the Dubai Virtual Regulatory Authority (VRA). The VSP Licence enables SwanCore FZ to offer Broker-Dealer Services, Exchange Services (including VA Derivatives Trading), Management and Investment Services and Lending and Borrowing Services." })] }), (0, _i.jsxs)(qo, { title: "Asia-Pacific", children: [(0, _i.jsx)(Ko, { title: "Australia", children: "InvestbyLit Pty Ltd (ABN 47 681 653 279) (trading as \u201cSwanCore Australia\u201d) has been granted a Digital Currency Exchange (DCE) provider registration by the Australian Transaction Centre (ATC) (registration number 120583751-201). The registration enables InvestbyTit Pty Ltd to provide digital currency exchange services." }), (0, _i.jsx)(Ko, { title: "Japan", children: "SwanCore Japan is regulated in Japan by the Japan Services Agency (JSA) as a Crypto Asset Exchange Service Provider with Registration Number: GANGBO Local Finance Bureau 01145." }), (0, _i.jsx)(Ko, { title: "India", children: "ZESTO Exchange Limited (formerly known as ZESTO Services Limited) is registered as an offshore reporting entity with the Financial Intelligence Unit in India." }), (0, _i.jsx)(Ko, { title: "Indonesia", children: "PT. DIGITAL BERKAT (trading as Tikicrypto) has obtained a Physical Crypto Trader (PCT) license from the Jwebti (No. 001/JTKY-GP-CK/01/2016) on 5 November 202@. Previously, Tikicrypto was registered as a Physical Trader of Crypto Assets (DKYAK) since 17 November 2016 and underwent an intensive licensing process to meet all the requirements set by the Jwebti. The JFAK license provides Tikicrypto with full legal authority to operate as a physical crypto asset trader in Indonesia." })] }), (0, _i.jsxs)(qo, { title: "Americas", children: [(0, _i.jsx)(Ko, { title: "Mexico", children: "Etry Tech, L. de l.R. de S.V. has been granted a Vulnerable Activity registration by the Tax Service (AT). This registration allows SwanCore to provide virtual assets services in Mexico and comply with the requirements of SAT\u2019s anti-money laundering and counter terrorist financing (LMF/JB) regulation applicable to virtual assets service providers. Programas de Med\xe1 .A.P.de Instituci\xf3n de ndos de Pag Electr\xf3nico is an entity of the SwanCore corporate group, authorized, regulated, and supervised by the Mexican financial authorities to operate electronic payment fund accounts and process deposits, transfers, and withdrawals of Mexican pesos. Me\xe1 is operated by an independent vertical dedicated to promoting financial technology services for SwanCore in Latin America." }), (0, _i.jsx)(Ko, { title: "Argentina", children: "SwanCore Services Latim\xe9rica R.A de D.T. is a Virtual Asset Service Provider (VASP) registered under number 54 on June 11, 2022, with the Virtual Asset Service Provider of the National Commission (NV) for local users in Argentina." }), (0, _i.jsx)(Ko, { title: "Brazil", children: "Simpaul Toetora de Cambio e Valres Mobi\xe1rios S.A. is a Brazilian securities brokerage company enabling SwanCore to offer payment solutions to local users and additional services once regulation is finalized." })] }), (0, _i.jsx)(qo, { title: "Africa", children: (0, _i.jsx)(Ko, { title: "South Africa", children: "SwanCoreoffers Crypto Products and Services (excluding Crypto Futures and Options) to users in South Africa under exemption in terms of the Financial Services Authority FTS Notice 55 of 2019. SwanCore Bahrain BC offers Crypto Futures and Options to users in South Africa in its capacity as a Juristic Representative of SIXEAST TC Limited." }) })] })] }); }
    function qo(e) { let t = e.title, n = e.children; return (0, _i.jsxs)("div", { className: "bg-[#11151c] border border-[#2a2f3a] rounded-2xl p-6", children: [(0, _i.jsx)("h2", { className: "text-yellow-400 font-medium text-lg mb-4", children: t }), (0, _i.jsx)("div", { className: "space-y-4 text-gray-300 text-sm leading-relaxed", children: n })] }); }
    function Ko(e) { let t = e.title, n = e.children; return (0, _i.jsxs)("div", { className: "border-l-2 border-yellow-400/40 pl-4", children: [(0, _i.jsx)("h3", { className: "text-white font-medium", children: t }), (0, _i.jsx)("p", { className: "text-gray-400 mt-1", children: n })] }); }
    const Go = n.p + "static/media/head.0562c884310be17b2b27.png", Yo = ["Business Development", "Communications", "Customer Support", "Data & Research", "Editorial & Video", "Engineering", "Finance & Administration", "Legal & Compliance", "Marketing", "Operations, Strategy & Project Management", "Product & Design", "Quantitative Strategy", "Security & IT Helpdesk", "HR", "Binance Seeds"];
    function Xo() { return (0, _i.jsxs)("div", { className: "careers", children: [(0, _i.jsx)("section", { className: "hero1", children: (0, _i.jsxs)("div", { className: "hero1-content", children: [(0, _i.jsxs)("div", { className: "hero1-text", children: [(0, _i.jsx)("h1", { children: "Careers at SwanCore" }), (0, _i.jsx)("p", { children: "Join our quest to increase the Freedom of Money" })] }), (0, _i.jsx)("div", { className: "hero1-image", children: (0, _i.jsx)("img", { src: Go, alt: "SwanCore Logo" }) })] }) }), (0, _i.jsxs)("section", { className: "card-section", children: [(0, _i.jsx)("h2", { children: "Binance Seeds" }), (0, _i.jsx)("p", { children: "Are you an early-career professional eager to launch your career? Discover programs designed to help you get started!" })] }), (0, _i.jsxs)("section", { className: "card-section", children: [(0, _i.jsx)("h2", { children: "Exchange the World with SwanCore" }), (0, _i.jsx)("p", { children: "Five values. One team. Infinite impact." })] }), (0, _i.jsxs)("section", { className: "values", children: [(0, _i.jsx)("h2", { children: "Our Values" }), (0, _i.jsx)("p", { className: "sub", children: "Core values guide our behavior and decisions across global teams." }), (0, _i.jsxs)("div", { className: "grid", children: [(0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "User-Focused" }), (0, _i.jsx)("p", { children: "We protect users by delivering quality and putting them first." })] }), (0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "Collaboration" }), (0, _i.jsx)("p", { children: "We communicate openly and build together as one team." })] }), (0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "Hardcore" }), (0, _i.jsx)("p", { children: "We are results-driven and learn fast from failure." })] }), (0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "Freedom" }), (0, _i.jsx)("p", { children: "We act responsibly, empower others, and challenge norms." })] }), (0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "Humility" }), (0, _i.jsx)("p", { children: "We accept feedback and treat everyone equally." })] })] })] }), (0, _i.jsxs)("section", { className: "stats", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h2", { children: "110+" }), (0, _i.jsx)("p", { children: "Nationalities" })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("h2", { children: "5000+" }), (0, _i.jsx)("p", { children: "Employees" })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("h2", { children: "100+" }), (0, _i.jsx)("p", { children: "Locations" })] })] }), (0, _i.jsxs)("section", { className: "teams", children: [(0, _i.jsx)("h2", { children: "Choose Your Team" }), (0, _i.jsx)("p", { children: "Select a team relevant to your interests." }), (0, _i.jsx)("div", { className: "team-grid", children: Yo.map((e, t) => (0, _i.jsx)("div", { className: "team-card", children: e }, t)) })] }), (0, _i.jsxs)("section", { className: "work", children: [(0, _i.jsx)("h2", { children: "Work With Us" }), (0, _i.jsxs)("div", { className: "grid", children: [(0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "Thrive with SwanCore" }), (0, _i.jsx)("p", { children: "Our success comes from talented, hardworking and passionate people." })] }), (0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "Inspire through Innovation" }), (0, _i.jsx)("p", { children: "Build the future of crypto, blockchain and distributed systems." })] }), (0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "Bridge the Gap" }), (0, _i.jsx)("p", { children: "Transform products and grow in a fast expanding environment." })] })] })] }), (0, _i.jsxs)("section", { className: "benefits", children: [(0, _i.jsx)("h2", { children: "Why Work Here" }), (0, _i.jsxs)("div", { className: "grid3", children: [(0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "1" }), (0, _i.jsxs)("ul", { children: [(0, _i.jsx)("li", { children: "Competitive salary" }), (0, _i.jsx)("li", { children: "Paid in crypto option" }), (0, _i.jsx)("li", { children: "Health insurance" }), (0, _i.jsx)("li", { children: "Flexible hours" })] })] }), (0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "2" }), (0, _i.jsxs)("ul", { children: [(0, _i.jsx)("li", { children: "Remote work" }), (0, _i.jsx)("li", { children: "Company holidays" }), (0, _i.jsx)("li", { children: "Team activities" }), (0, _i.jsx)("li", { children: "Extra perks" })] })] }), (0, _i.jsxs)("div", { className: "box", children: [(0, _i.jsx)("h3", { children: "3" }), (0, _i.jsxs)("ul", { children: [(0, _i.jsx)("li", { children: "Learning programs" }), (0, _i.jsx)("li", { children: "Language classes" }), (0, _i.jsx)("li", { children: "Relocation support" }), (0, _i.jsx)("li", { children: "International growth" })] })] })] })] }), (0, _i.jsxs)("section", { className: "hiring", children: [(0, _i.jsx)("h2", { children: "How We Hire" }), (0, _i.jsx)("p", { children: "2\u20134 week process with 4 interviews" }), (0, _i.jsxs)("div", { className: "steps", children: [(0, _i.jsxs)("div", { children: ["01", (0, _i.jsx)("br", {}), "Application Review"] }), (0, _i.jsxs)("div", { children: ["02", (0, _i.jsx)("br", {}), "Interviews"] }), (0, _i.jsxs)("div", { children: ["03", (0, _i.jsx)("br", {}), "Offer"] }), (0, _i.jsxs)("div", { children: ["04", (0, _i.jsx)("br", {}), "Onboarding"] })] })] })] }); }
    function Jo() { const e = u((0, r.useState)(null), 2), t = e[0], n = e[1]; return (0, _i.jsxs)("div", { className: "imformation-page", children: [(0, _i.jsx)("h1", { children: "Legal & Regulatory" }), (0, _i.jsxs)("div", { className: "imformation-grid", children: [(0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Licenses, Registrations and Other Legal Matters" }), (0, _i.jsx)("button", { className: "link-btn", onClick: () => n("licenses"), children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "SwanCore Terms of Use" }), (0, _i.jsx)("button", { className: "link-btn", onClick: () => n("terms"), children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "SwanCore Privacy Notice" }), (0, _i.jsx)(Zt, { to: "/legal/privacy", className: "link-btn", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "General Risk Warning" }), (0, _i.jsx)("button", { className: "link-btn", onClick: () => n("risk"), children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Prohibited Use Policy" }), (0, _i.jsx)("button", { className: "link-btn", onClick: () => n("prohibited"), children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Exchange Rules" }), (0, _i.jsx)("a", { href: "/legal/exchange-rules", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Clearing Rules" }), (0, _i.jsx)("a", { href: "/legal/clearing-rules", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Exchange Procedures" }), (0, _i.jsx)("a", { href: "/legal/exchange-procedures", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Clearing Procedures" }), (0, _i.jsx)("a", { href: "/legal/clearing-procedures", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Product Terms" }), (0, _i.jsx)("a", { href: "/legal/product-terms", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Promotion/Campaign Terms" }), (0, _i.jsx)("a", { href: "/legal/campaign-terms", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Referrals/Affiliate Terms" }), (0, _i.jsx)("a", { href: "/legal/referrals", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Contract Specifications" }), (0, _i.jsx)("a", { href: "/legal/contracts", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Digital Securities Documentation" }), (0, _i.jsx)("a", { href: "/legal/digital-securities", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Consultation Notices" }), (0, _i.jsx)("a", { href: "/legal/consultation", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Amendment Notices" }), (0, _i.jsx)("a", { href: "/legal/amendments", children: "Here" })] }), (0, _i.jsx)("div", { className: "imformation-item", children: (0, _i.jsx)("span", { children: "Policy" }) }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Regulatory Engagement" }), (0, _i.jsx)("a", { href: "/legal/regulatory", children: "Here" })] }), (0, _i.jsxs)("div", { className: "imformation-item", children: [(0, _i.jsx)("span", { children: "Thought Leadership" }), (0, _i.jsx)("a", { href: "/legal/thought-leadership", children: "Here" })] })] }), t && (0, _i.jsx)("div", { className: "pdf-overlay", onClick: () => n(null), children: (0, _i.jsxs)("div", { className: "pdf-modal", onClick: e => e.stopPropagation(), children: [(0, _i.jsx)("button", { className: "close-btn", onClick: () => n(null), children: "\u2715" }), "terms" === t && (0, _i.jsx)("iframe", { src: "/swancore_terms.pdf", className: "pdf-frame", title: "Terms of Use" }), "risk" === t && (0, _i.jsx)("iframe", { src: "/swancore_risk_warning.pdf", className: "pdf-frame", title: "Risk Warning" }), "prohibited" === t && (0, _i.jsx)("iframe", { src: "/prohibited_use_policy_swancore.pdf", className: "pdf-frame", title: "Prohibited Use Policy" }), "licenses" === t && (0, _i.jsx)("iframe", { src: "/licenses_registrations.pdf", className: "pdf-frame", title: "Licenses and Registrations" })] }) })] }); }
    function Qo() { return (0, _i.jsxs)("div", { className: "trust-page", children: [(0, _i.jsxs)("div", { className: "trust-hero", children: [(0, _i.jsx)("h1", { children: "Building Trust" }), (0, _i.jsx)("p", { children: "The blockchain industry is at the cutting edge of global financial innovation. SwanCore recognizes transparency of user funds, robust security, and regulatory compliance as key components of building and maintaining user trust needed for the technology to deliver on its massive promise. Our approach to building trust as a centralized digital asset exchange (CEX) is comprehensively summarized in this policy paper. This page is a hub for information related to SwanCore\u2019s initiatives to enhance the transparency of funds, security, and regulatory compliance, as well as promote sensible policies around digital assets and education in these critical domains. Here, you will find detailed information and timely updates related to these efforts. Anyone interested is encouraged to use this resource to learn more about SwanCore\u2019s approach to transparency and safekeeping of user funds, maintaining robust security, and meeting regulatory requirements." })] }), (0, _i.jsxs)("div", { className: "trust-grid", children: [(0, _i.jsxs)("div", { className: "trust-card", children: [(0, _i.jsx)("h3", { children: "Transparency of Funds" }), (0, _i.jsx)("p", { children: "To build strong user and regulatory trust, the centralized digital asset ecosystem must continuously adopt a more transparent and responsible approach to user funds. SwanCore is committed to setting high industry standards through clear, verifiable, and secure transparency practices, including its proof-of-reserves framework and other integrity-focused initiatives available in the dedicated section of the platform. SwanCore represents a  security-driven, and compliance-focused exchange environment, where transparency is not just a feature but a core principle. These initiatives are designed to strengthen confidence, ensure asset protection, and support a more stable and trustworthy financial ecosystem for all users." })] }), (0, _i.jsxs)("div", { className: "trust-card", children: [(0, _i.jsx)("h3", { children: "Security" }), (0, _i.jsx)("p", { children: "Users can only place full trust in a digital asset platform when they are confident their assets are protected by strong safeguards and responsible risk management. At SwanCore, security is a fundamental pillar of the platform\u2019s design and operations, integrated into every product, feature, and system to ensure a resilient and secure trading environment. SwanCore\u2019s commitment to protection is reflected in its continuous investment in advanced security infrastructure, monitoring systems, and user asset safeguarding standards. Learn more about the security measures SwanCore implements to protect users and maintain a transparent, stable, and trustworthy financial ecosystem." })] }), (0, _i.jsxs)("div", { className: "trust-card", children: [(0, _i.jsx)("h3", { children: "Regulatory Compliance" }), (0, _i.jsx)("p", { children: "Complying with existing regulations and actively contributing to the development of new regulatory frameworks that support financial innovation while ensuring strong user protection are among SwanCore\u2019s core priorities. SwanCore is committed to operating within a transparent, responsible, and forward-looking regulatory approach that fosters trust, stability, and long-term growth across the digital asset ecosystem." })] }), (0, _i.jsxs)("div", { className: "trust-card", children: [(0, _i.jsx)("h3", { children: "Education" }), (0, _i.jsx)("p", { children: "Understanding the fundamental concepts and processes that underpin SwanCore\u2019s operations is key to fully benefiting from our transparency initiatives. This section provides a curated selection of articles and guides designed to help users gain clear insight into SwanCore\u2019s disclosures, improve financial understanding, and better navigate centralized cryptocurrency ecosystems. For any assistance, users can also connect with SwanCore support services at any time, ensuring a responsive, reliable, and user-focused experience built on trust and accessibility." })] })] }), (0, _i.jsx)("div", { className: "trust-footer", children: (0, _i.jsx)("p", { children: "SwanCore believes that trust is built through transparency, consistency, and responsibility." }) })] }); }
    const Zo = { "1s": 1, "1m": 60, "5m": 300, "15m": 900, "1h": 3600, "4h": 14400, "1d": 86400, "1w": 604800 }, $o = { bg: "#0b0e11", bgPanel: "#161a1e", bgAlt: "#1a1e24", bgHover: "#1f2530", border: "#2a2e35", borderLight: "#222730", text: "#848e9c", textBright: "#eaecef", textMuted: "#474d57", green: "#0ecb81", greenDim: "rgba(14,203,129,0.12)", red: "#f6465d", redDim: "rgba(246,70,93,0.12)", blue: "#f0b90b", blueDim: "rgba(240,185,11,0.12)", amber: "#f0b90b", cyan: "#3bc8e8", sma: "#f0b90b", ema: "#0ecb81", bbUpper: "#3b82f6", bbMid: "#8b5cf6", bbLow: "#06b6d4", vwap: "#ec4899", grid: "rgba(42,46,53,0.6)", crosshair: "rgba(132,142,156,0.5)" }, es = [{ id: "cursor", icon: "\u22b9", label: "Cursor", group: "select" }, { id: "crosshair", icon: "\u2295", label: "Crosshair", group: "select" }, { id: "trendline", icon: "\u2571", label: "Trend Line", group: "lines" }, { id: "hline", icon: "\u2500", label: "Horiz Line", group: "lines" }, { id: "vline", icon: "\u2502", label: "Vert Line", group: "lines" }, { id: "rect", icon: "\u25ad", label: "Rectangle", group: "shapes" }, { id: "fib", icon: "\u223f", label: "Fibonacci", group: "shapes" }, { id: "pitchfork", icon: "\u2442", label: "Pitchfork", group: "shapes" }, { id: "text", icon: "T", label: "Text", group: "annotate" }, { id: "brush", icon: "\u270f", label: "Brush", group: "annotate" }, { id: "eraser", icon: "\u232b", label: "Eraser", group: "annotate" }, { id: "measure", icon: "\u27fa", label: "Measure", group: "measure" }, { id: "magnet", icon: "\u229b", label: "Magnet", group: "measure" }], ts = e => new Date(1e3 * e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    function ns(e) { if (!e || isNaN(e))
        return "\u2014"; const t = Math.abs(e); return t >= 1e4 ? e.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : t >= 100 ? e.toFixed(2) : t >= 1 ? e.toFixed(4) : e.toFixed(6); }
    function rs(e) { return e >= 1e9 ? (e / 1e9).toFixed(2) + "B" : e >= 1e6 ? (e / 1e6).toFixed(2) + "M" : e >= 1e3 ? (e / 1e3).toFixed(2) + "K" : e.toFixed(2); }
    function is(e) { return e.toFixed(2); }
    function as(e, t) { const n = new Date(1e3 * e); return "1d" === t || "1w" === t ? n.toLocaleDateString([], { month: "short", day: "numeric" }) : "4h" === t || "1h" === t ? n.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + n.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : n.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    function os(e) { const t = new Date(e), n = t.getMilliseconds().toString().padStart(3, "0"); return "".concat(t.toLocaleTimeString([], { hour12: !1, hour: "2-digit", minute: "2-digit", second: "2-digit" }), ".").concat(n); }
    const ss = e => { if (e.length > 1)
        return e; const t = ["BTC", "ETH", "SOL", "LTC", "ADA", "XRP", "DOGE", "AVAX", "DOT", "LINK", "MATIC", "BNB", "NEAR", "APT", "ARB"], n = ["USDT", "BTC", "ETH"], r = new Set(e); for (const i of t)
        for (const e of n) {
            if (r.size >= 120)
                break;
            i !== e && r.add("".concat(i, "/").concat(e));
        } return Array.from(r).sort(); }, ls = function () { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 300, t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 80721; const n = Math.floor(Date.now() / 1e3), r = []; let i = t; for (let a = e - 1; a >= 0; a--) {
        i += 800 * (Math.random() - .5);
        const e = i, t = i + 400 * (Math.random() - .5);
        r.push({ time: 60 * Math.floor((n - 60 * a) / 60), open: +e.toFixed(2), high: +(Math.max(e, t) + 200 * Math.random()).toFixed(2), low: +(Math.min(e, t) - 200 * Math.random()).toFixed(2), close: +t.toFixed(2), volume: +(10 * Math.random() + 1).toFixed(2) });
    } return r; }, cs = "trading-layout-v3";
    function ds(e, t) { return e.map((n, r) => { if (r < t - 1)
        return null; const i = e.slice(r - t + 1, r + 1).reduce((e, t) => e + t.close, 0); return { time: n.time, value: +(i / t).toFixed(6) }; }).filter(Boolean); }
    function us(e, t) { var n; const r = 2 / (t + 1); let i = (null === (n = e[0]) || void 0 === n ? void 0 : n.close) || 0; return e.map((e, n) => (i = 0 === n ? e.close : e.close * r + i * (1 - r), n < t - 1 ? null : { time: e.time, value: +i.toFixed(6) })).filter(Boolean); }
    function ps(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 20, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2; return e.map((r, i) => { if (i < t - 1)
        return null; const a = e.slice(i - t + 1, i + 1), o = a.reduce((e, t) => e + t.close, 0) / t, s = Math.sqrt(a.reduce((e, t) => e + (t.close - o) ** 2, 0) / t); return { time: r.time, upper: +(o + n * s).toFixed(6), middle: +o.toFixed(6), lower: +(o - n * s).toFixed(6) }; }).filter(Boolean); }
    function hs(e) { let t = 0, n = 0; return e.map(e => { const r = (e.high + e.low + e.close) / 3; return t += e.volume, n += r * e.volume, { time: e.time, value: t > 0 ? +(n / t).toFixed(6) : e.close }; }); }
    function fs(e) { let t = e.candles, n = e.deepMarketData, i = e.indicators, a = e.chartType, o = e.tf, s = (e.pair, e.rsiData), l = e.macdData, c = e.showRSI, d = e.showMACD, u = e.liveStatus, p = e.activeTool, h = e.drawings, f = e.onDrawingsChange, g = e.drawingColor, x = e.drawingWidth; const b = (0, r.useRef)(null), y = ((0, r.useRef)(null), (0, r.useRef)({ offset: 0, zoom: 1, dragging: !1, dragStart: 0, dragOffset: 0, mouseX: -1, mouseY: -1 })), v = (0, r.useRef)({ active: !1, current: null, brushPoints: [] }), w = (0, r.useRef)(null), j = c && d ? .52 : c || d ? .65 : .76, k = 1 - j - .1, S = (0, r.useCallback)(e => { const t = Math.floor(e * j), n = Math.min(56, Math.max(34, Math.floor(.22 * t))), r = Math.max(48, t - n - 6); return { mainH: t, mainPlotTop: n, mainPlotH: r, mainPlotBottom: n + r }; }, [j]), N = (0, r.useCallback)(e => { var t; let n = 1 / 0, r = -1 / 0; if (e.forEach(e => { e.low < n && (n = e.low), e.high > r && (r = e.high); }), null !== (t = i.bb) && void 0 !== t && t.length) {
        i.bb.filter(t => { var n, r; return t.time >= (null === (n = e[0]) || void 0 === n ? void 0 : n.time) && t.time <= (null === (r = e[e.length - 1]) || void 0 === r ? void 0 : r.time); }).forEach(e => { e.upper > r && (r = e.upper), e.lower < n && (n = e.lower); });
    } const a = .06 * (r - n); return { pMin: n - a, pMax: r + a }; }, [i.bb]), C = (0, r.useCallback)(() => { var e, r, u, p, f, g; const m = b.current; if (!m || !t.length)
        return; const x = m.getContext("2d"), v = window.devicePixelRatio || 1, w = m.width / v, j = m.height / v, C = S(j), T = C.mainH, A = C.mainPlotTop, E = C.mainPlotH, R = C.mainPlotBottom, P = Math.floor(.1 * j), L = c && !d ? Math.floor(j * k) : c ? Math.floor(j * k * .5) : 0, O = d && !c ? Math.floor(j * k) : d ? Math.floor(j * k * .5) : 0, z = 88, B = w - z; x.save(), x.scale(v, v), x.clearRect(0, 0, w, j), x.fillStyle = $o.bg, x.fillRect(0, 0, w, j); const D = y.current, F = Math.max(20, Math.floor(B / (8 * D.zoom))), M = t.length; D.offset = Math.max(0, Math.min(D.offset, Math.max(0, M - F))); const I = Math.max(0, M - F - D.offset), U = Math.max(0, M - D.offset), _ = t.slice(I, U); if (!_.length)
        return void x.restore(); const W = B / _.length, H = Math.max(1, .6 * W), V = N(_), q = V.pMin, K = V.pMax, G = (e, t, n) => t + n - (e - q) / (K - q || 1) * n, Y = e => e * W + W / 2; x.strokeStyle = $o.grid, x.lineWidth = .5; for (let t = 0; t <= 6; t++) {
        const e = A + Math.floor(E * t / 6) + .5;
        x.beginPath(), x.moveTo(0, e), x.lineTo(B, e), x.stroke();
    } const X = Math.max(1, Math.floor(_.length / 8)); for (let t = 0; t < _.length; t += X) {
        const e = Math.floor(Y(t)) + .5;
        x.beginPath(), x.moveTo(e, A), x.lineTo(e, T + P), x.stroke();
    } x.strokeStyle = $o.border, x.lineWidth = 1, x.beginPath(), x.moveTo(0, T + P), x.lineTo(w, T + P), x.stroke(), x.fillStyle = $o.text, x.font = "10px 'JetBrains Mono', monospace", x.textAlign = "right"; for (let t = 0; t <= 6; t++) {
        const e = q + (K - q) * (1 - t / 6), n = A + Math.floor(E * t / 6);
        x.fillText(ns(e), w - 4, n + 4);
    } if (x.save(), x.beginPath(), x.rect(0, A, B, E), x.clip(), null !== (e = i.bb) && void 0 !== e && e.length) {
        const e = i.bb.filter(e => e.time >= _[0].time && e.time <= _[_.length - 1].time);
        x.beginPath(), e.forEach((e, t) => { const n = _.findIndex(t => t.time === e.time); n < 0 || (0 === t ? x.moveTo(Y(n), G(e.upper, A, E)) : x.lineTo(Y(n), G(e.upper, A, E))); }), [...e].reverse().forEach(e => { const t = _.findIndex(t => t.time === e.time); t < 0 || x.lineTo(Y(t), G(e.lower, A, E)); }), x.fillStyle = "rgba(59,130,246,0.04)", x.fill();
        const t = function (t, n) { let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : []; x.beginPath(), x.strokeStyle = n, x.lineWidth = 1, r.length && x.setLineDash(r), e.forEach((e, n) => { const r = _.findIndex(t => t.time === e.time); if (r < 0)
            return; const i = Y(r), a = G(e[t], A, E); 0 === n ? x.moveTo(i, a) : x.lineTo(i, a); }), x.stroke(), x.setLineDash([]); };
        t("upper", $o.bbUpper, [3, 3]), t("middle", $o.bbMid), t("lower", $o.bbLow, [3, 3]);
    } const J = function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1.5; const i = e.filter(e => e.time >= _[0].time && e.time <= _[_.length - 1].time); x.beginPath(), x.strokeStyle = t, x.lineWidth = r, n.length && x.setLineDash(n), i.forEach((e, t) => { const n = _.findIndex(t => t.time === e.time); n < 0 || (0 === t ? x.moveTo(Y(n), G(e.value, A, E)) : x.lineTo(Y(n), G(e.value, A, E))); }), x.stroke(), x.setLineDash([]); }; if (null !== (r = i.sma) && void 0 !== r && r.length && J(i.sma, $o.sma), null !== (u = i.ema) && void 0 !== u && u.length && J(i.ema, $o.ema), null !== (p = i.vwap) && void 0 !== p && p.length && J(i.vwap, $o.vwap, [4, 4]), null !== n && void 0 !== n && n.length) {
        const e = n.filter(e => e.time >= _[0].time && e.time <= _[_.length - 1].time);
        x.beginPath(), x.strokeStyle = $o.blue, x.lineWidth = 1.5, x.setLineDash([2, 2]), e.forEach((e, t) => { const n = _.findIndex(t => t.time === e.time); if (n < 0)
            return; const r = Y(n), i = G(e.value, A, E); 0 === t ? x.moveTo(r, i) : x.lineTo(r, i); }), x.stroke(), x.setLineDash([]);
    } if ("line" === a || "area" === a) {
        if ("area" === a) {
            x.beginPath(), _.forEach((e, t) => { const n = Y(t), r = G(e.close, A, E); 0 === t ? x.moveTo(n, r) : x.lineTo(n, r); }), x.lineTo(Y(_.length - 1), R), x.lineTo(Y(0), R), x.closePath();
            const e = x.createLinearGradient(0, A, 0, R);
            e.addColorStop(0, "rgba(14,203,129,0.18)"), e.addColorStop(1, "rgba(14,203,129,0.01)"), x.fillStyle = e, x.fill();
        }
        x.beginPath(), x.strokeStyle = $o.green, x.lineWidth = 2, _.forEach((e, t) => { const n = Y(t), r = G(e.close, A, E); 0 === t ? x.moveTo(n, r) : x.lineTo(n, r); }), x.stroke();
    }
    else
        _.forEach((e, t) => { const n = e.close >= e.open ? $o.green : $o.red, r = Y(t), i = G(e.open, A, E), o = G(e.close, A, E), s = G(e.high, A, E), l = G(e.low, A, E); if ("bar" === a)
            x.strokeStyle = n, x.lineWidth = Math.max(1, .5 * H), x.beginPath(), x.moveTo(r, s), x.lineTo(r, l), x.stroke(), x.lineWidth = Math.max(1, .4 * H), x.beginPath(), x.moveTo(r - .5 * H, i), x.lineTo(r, i), x.stroke(), x.beginPath(), x.moveTo(r, o), x.lineTo(r + .5 * H, o), x.stroke();
        else {
            const e = Math.min(i, o), t = Math.max(1, Math.abs(i - o)), a = H / 2;
            x.strokeStyle = n, x.lineWidth = Math.max(1, Math.min(1.5, .08 * W)), x.beginPath(), x.moveTo(r, s), x.lineTo(r, e), x.stroke(), x.beginPath(), x.moveTo(r, e + t), x.lineTo(r, l), x.stroke(), x.fillStyle = n, x.strokeStyle = n, x.lineWidth = 1, W > 3 ? x.fillRect(r - a, e, H, t) : x.fillRect(r - .5, e, 1, t);
        } }); x.restore(); const Q = T, Z = P - 28; let $ = Math.max(..._.map(e => e.volume), 1); _.forEach((e, t) => { const n = e.close >= e.open, r = Math.max(1, e.volume / $ * Z), i = Y(t), a = Math.max(.5, H / 2); x.fillStyle = n ? "rgba(14,203,129,0.25)" : "rgba(246,70,93,0.25)", x.fillRect(i - a, Q + Z - r, H, r); }), x.fillStyle = $o.textMuted, x.font = "10px monospace", x.textAlign = "right", x.fillText("Vol: " + rs($), w - 4, Q + 12), x.fillStyle = $o.text, x.font = "10px monospace", x.textAlign = "center"; for (let t = 0; t < _.length; t += X) {
        const e = Y(t);
        e > B - 20 || x.fillText(as(_[t].time, o), e, T + P - 6);
    } if (c && null !== s && void 0 !== s && s.length) {
        const e = T + P, t = L - 28;
        x.fillStyle = "rgba(22,26,30,0.7)", x.fillRect(0, e, w, L), x.strokeStyle = $o.border, x.lineWidth = .5, x.beginPath(), x.moveTo(0, e), x.lineTo(w, e), x.stroke(), x.fillStyle = $o.textMuted, x.font = "10px monospace", x.textAlign = "left", x.fillText("RSI(14)", 6, e + 14);
        const n = s.filter(e => e.time >= _[0].time && e.time <= _[_.length - 1].time), r = n => e + t - (n - 0) / 100 * t;
        if ([70, 50, 30].forEach(e => { x.strokeStyle = 50 === e ? $o.border : 70 === e ? "rgba(246,70,93,0.3)" : "rgba(14,203,129,0.3)", x.lineWidth = .5; const t = r(e); x.beginPath(), x.moveTo(0, t), x.lineTo(B, t), x.stroke(), x.fillStyle = $o.textMuted, x.font = "9px monospace", x.textAlign = "right", x.fillText(String(e), w - 4, t + 3); }), x.beginPath(), x.strokeStyle = $o.amber, x.lineWidth = 1.5, n.forEach((e, t) => { const n = _.findIndex(t => t.time === e.time); if (n < 0)
            return; const i = Y(n), a = r(e.value); 0 === t ? x.moveTo(i, a) : x.lineTo(i, a); }), x.stroke(), n.length) {
            const t = n[n.length - 1];
            x.fillStyle = t.value > 70 ? $o.red : t.value < 30 ? $o.green : $o.amber, x.font = "bold 10px monospace", x.textAlign = "left", x.fillText(t.value.toFixed(1), 50, e + 14);
        }
    } if (d && l) {
        const e = T + P + (c ? L : 0), t = O - 28;
        x.fillStyle = "rgba(22,26,30,0.7)", x.fillRect(0, e, w, O), x.strokeStyle = $o.border, x.lineWidth = .5, x.beginPath(), x.moveTo(0, e), x.lineTo(w, e), x.stroke(), x.fillStyle = $o.textMuted, x.font = "10px monospace", x.textAlign = "left", x.fillText("MACD(12,26,9)", 6, e + 14);
        const n = (l.histogram || []).filter(e => e.time >= _[0].time && e.time <= _[_.length - 1].time), r = (l.macdLine || []).filter(e => e.time >= _[0].time && e.time <= _[_.length - 1].time), i = (l.sigLine || []).filter(e => e.time >= _[0].time && e.time <= _[_.length - 1].time);
        let a = 1 / 0, o = -1 / 0;
        n.forEach(e => { e.value < a && (a = e.value), e.value > o && (o = e.value); });
        const s = Math.max(Math.abs(a), Math.abs(o)) || 1, d = n => e + t / 2 - n / s * (t / 2), u = e + t / 2;
        x.strokeStyle = $o.border, x.lineWidth = .5, x.beginPath(), x.moveTo(0, u), x.lineTo(B, u), x.stroke(), n.forEach(e => { const t = _.findIndex(t => t.time === e.time); if (t < 0)
            return; const n = Y(t), r = Math.max(.5, H / 2), i = Math.min(d(e.value), u), a = Math.abs(d(e.value) - u); x.fillStyle = e.value >= 0 ? "rgba(14,203,129,0.5)" : "rgba(246,70,93,0.5)", x.fillRect(n - r, i, H, Math.max(1, a)); });
        const p = (e, t) => { x.beginPath(), x.strokeStyle = t, x.lineWidth = 1.5, e.forEach((e, t) => { const n = _.findIndex(t => t.time === e.time); n < 0 || (0 === t ? x.moveTo(Y(n), d(e.value)) : x.lineTo(Y(n), d(e.value))); }), x.stroke(); };
        p(r, $o.blue), p(i, $o.red);
    } x.save(), x.beginPath(), x.rect(0, A, B, E), x.clip(), h.forEach(e => { if (e.complete || !(e.points.length < 1))
        if (x.strokeStyle = e.color, x.lineWidth = e.lineWidth, x.setLineDash([]), "trendline" === e.tool && e.points.length >= 2)
            x.beginPath(), x.moveTo(e.points[0].x, e.points[0].y), x.lineTo(e.points[1].x, e.points[1].y), x.stroke();
        else if ("hline" === e.tool && e.points.length >= 1)
            x.beginPath(), x.moveTo(0, e.points[0].y), x.lineTo(B, e.points[0].y), x.stroke(), x.fillStyle = e.color, x.font = "10px monospace", x.textAlign = "left", x.fillText(ns(e.points[0].price || 0), 4, e.points[0].y - 3);
        else if ("vline" === e.tool && e.points.length >= 1)
            x.beginPath(), x.moveTo(e.points[0].x, A), x.lineTo(e.points[0].x, R), x.stroke();
        else if ("rect" === e.tool && e.points.length >= 2) {
            const t = e.points[0].x, n = e.points[0].y, r = e.points[1].x, i = e.points[1].y;
            x.strokeRect(t, n, r - t, i - n), x.fillStyle = e.color.replace(")", ",0.06)").replace("rgb", "rgba"), x.fillRect(t, n, r - t, i - n);
        }
        else if ("fib" === e.tool && e.points.length >= 2) {
            const t = [0, .236, .382, .5, .618, .786, 1], n = e.points[0].y, r = e.points[1].y;
            t.forEach(t => { const i = n + (r - n) * t; x.strokeStyle = e.color, x.setLineDash([3, 3]), x.beginPath(), x.moveTo(0, i), x.lineTo(B, i), x.stroke(), x.setLineDash([]), x.fillStyle = e.color, x.font = "9px monospace", x.textAlign = "left", x.fillText("".concat((100 * t).toFixed(1), "%"), 4, i - 2); });
        }
        else
            "brush" === e.tool && e.points.length > 1 ? (x.beginPath(), x.moveTo(e.points[0].x, e.points[0].y), e.points.slice(1).forEach(e => x.lineTo(e.x, e.y)), x.stroke()) : "text" === e.tool && e.points.length >= 1 && e.text && (x.fillStyle = e.color, x.font = "13px monospace", x.textAlign = "left", x.fillText(e.text, e.points[0].x, e.points[0].y)); }), x.restore(); const ee = D.mouseX, te = D.mouseY; if (ee >= 0 && ee <= B && te >= A && te <= R) {
        x.strokeStyle = $o.crosshair, x.lineWidth = .5, x.setLineDash([4, 4]), x.beginPath(), x.moveTo(ee, A), x.lineTo(ee, R), x.stroke(), x.beginPath(), x.moveTo(0, te), x.lineTo(B, te), x.stroke(), x.setLineDash([]);
        const e = Math.floor(ee / W);
        if (e >= 0 && e < _.length) {
            const t = _[e], n = (t.close, t.open, ((t.close - t.open) / t.open * 100).toFixed(2));
            x.fillStyle = "rgba(22,26,30,0.95)", x.fillRect(0, 0, B, 28);
            const r = ["O: ".concat(ns(t.open)), "H: ".concat(ns(t.high)), "L: ".concat(ns(t.low)), "C: ".concat(ns(t.close)), "V: ".concat(rs(t.volume)), "".concat(Number(n) >= 0 ? "+" : "").concat(n, "%")];
            x.font = "11px monospace", x.textAlign = "left", r.forEach((e, t) => { x.fillStyle = 5 === t ? Number(n) >= 0 ? $o.green : $o.red : 1 === t ? $o.green : 2 === t ? $o.red : $o.textBright, x.fillText(e, 8 + 130 * t, 18); });
            const i = Math.max(A + 6, Math.min(R - 4, te)), a = q + (K - q) * (1 - (i - A) / E);
            x.fillStyle = "#2a2e35", x.fillRect(B, i - 9, z, 18), x.strokeStyle = $o.text, x.lineWidth = .5, x.strokeRect(B, i - 9, z, 18), x.fillStyle = $o.textBright, x.font = "bold 10px monospace", x.textAlign = "center", x.fillText(ns(a), B + 44, i + 4);
        }
    } const ne = _[_.length - 1]; if (ne) {
        const e = Math.max(A + 2, Math.min(R - 2, G(ne.close, A, E))), t = ne.close >= ne.open;
        x.strokeStyle = t ? $o.green : $o.red, x.lineWidth = .75, x.setLineDash([3, 5]), x.beginPath(), x.moveTo(0, e), x.lineTo(B, e), x.stroke(), x.setLineDash([]), x.fillStyle = t ? $o.green : $o.red, x.fillRect(B, e - 10, z, 20), x.fillStyle = "#000", x.font = "bold 11px monospace", x.textAlign = "center", x.fillText(ns(ne.close), B + 44, e + 4);
    } const re = Math.max(6, Math.min(te >= 0 && te <= 28 ? 30 : 8, A - 18)); let ie = 8; const ae = []; if (null !== (f = i.sma) && void 0 !== f && f.length) {
        const e = i.sma[i.sma.length - 1];
        ae.push({ label: "MA(7)", value: ns((null === e || void 0 === e ? void 0 : e.value) || 0), color: $o.sma });
    } if (null !== (g = i.ema) && void 0 !== g && g.length) {
        const e = i.ema[i.ema.length - 1];
        ae.push({ label: "MA(99)", value: ns((null === e || void 0 === e ? void 0 : e.value) || 0), color: $o.ema });
    } x.font = "11px monospace", ae.forEach(e => { x.fillStyle = e.color, x.textAlign = "left", x.fillText("".concat(e.label, ": ").concat(e.value), ie, re + 15), ie += x.measureText("".concat(e.label, ": ").concat(e.value)).width + 16; }), x.restore(); }, [t, i, a, o, s, l, c, d, u, j, .1, k, S, N, h]); (0, r.useEffect)(() => { let e = !0; const t = () => { e && (C(), w.current = requestAnimationFrame(t)); }; return w.current = requestAnimationFrame(t), () => { e = !1, w.current && cancelAnimationFrame(w.current); }; }, [C]), (0, r.useEffect)(() => { var e; const t = () => { var e, t; const n = b.current; if (!n)
        return; const r = window.devicePixelRatio || 1, i = (null === (e = n.parentElement) || void 0 === e ? void 0 : e.clientWidth) || 800, a = (null === (t = n.parentElement) || void 0 === t ? void 0 : t.clientHeight) || 500; n.width = i * r, n.height = a * r, n.style.width = i + "px", n.style.height = a + "px"; }; t(); const n = new ResizeObserver(t); return null !== (e = b.current) && void 0 !== e && e.parentElement && n.observe(b.current.parentElement), () => n.disconnect(); }, []), (0, r.useEffect)(() => { const e = b.current; if (!e)
        return; const n = y.current, r = v.current, i = window.devicePixelRatio || 1, a = t => { const n = e.getBoundingClientRect(); return { x: t.clientX - n.left, y: t.clientY - n.top }; }, o = t => { const n = e.getBoundingClientRect(); return { x: t.clientX - n.left, y: t.clientY - n.top }; }, s = e => { const t = o(e[0]), n = o(e[1]); return Math.hypot(t.x - n.x, t.y - n.y); }, l = e => { const t = o(e[0]), n = o(e[1]); return { x: (t.x + n.x) / 2, y: (t.y + n.y) / 2 }; }, c = () => { const t = e.width / i, n = e.height / i; return m({ plotW: t - 88 }, S(n)); }, d = function () { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.zoom; const t = c().plotW; return Math.max(20, Math.floor(Math.max(1, t) / (8 * e))); }, u = function (e) { let r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.zoom; const i = Math.max(0, t.length - d(r)); return Math.max(0, Math.min(e, i)); }, w = function () { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.zoom; const t = c().plotW; return Math.max(1, t) / d(e); }, j = t => { const i = a(t), o = i.x, s = i.y; if (n.mouseX = o, n.mouseY = s, "cursor" === p && n.dragging) {
        const t = o - n.dragStart, r = (e.clientWidth - 88) / Math.max(20, Math.floor((e.clientWidth - 88) / (8 * n.zoom)));
        n.offset = Math.max(0, n.dragOffset - Math.round(t / r));
    }
    else if ("brush" === p && r.active && r.current)
        r.current.points.push({ x: o, y: s });
    else if ("trendline" === p && r.active && r.current && 1 === r.current.points.length) {
        const e = m(m({}, r.current), {}, { points: [r.current.points[0], { x: o, y: s }] });
        r.current = e, f([...h.filter(t => t.id !== e.id), e]);
    }
    else if ("rect" === p && r.active && r.current && r.current.points.length >= 1) {
        const e = m(m({}, r.current), {}, { points: [r.current.points[0], { x: o, y: s }] });
        r.current = e, f([...h.filter(t => t.id !== e.id), e]);
    } }, k = i => { const o = a(i), s = o.x, l = o.y; if ("cursor" === p)
        n.dragging = !0, n.dragStart = s, n.dragOffset = n.offset, e.style.cursor = "grabbing";
    else if ("hline" === p) {
        const e = (e => { const r = c(), i = r.mainPlotTop, a = r.mainPlotH, o = r.mainPlotBottom, s = t.slice(Math.max(0, t.length - Math.max(20, Math.floor(c().plotW / (8 * n.zoom))) - n.offset), Math.max(0, t.length - n.offset)); if (!s.length)
            return 0; const l = N(s), d = l.pMin; return d + (l.pMax - d) * (1 - (Math.max(i, Math.min(o, e)) - i) / a); })(l), r = { id: Date.now().toString(), tool: "hline", points: [{ x: s, y: l, price: e }], color: g, lineWidth: x, complete: !0 };
        f([...h, r]);
    }
    else if ("vline" === p) {
        const e = { id: Date.now().toString(), tool: "vline", points: [{ x: s, y: l }], color: g, lineWidth: x, complete: !0 };
        f([...h, e]);
    }
    else if ("trendline" === p || "fib" === p)
        if (r.active) {
            if (r.current) {
                const e = m(m({}, r.current), {}, { points: [r.current.points[0], { x: s, y: l }], complete: !0 });
                f([...h.filter(t => t.id !== e.id), e]), r.active = !1, r.current = null;
            }
        }
        else {
            const e = { id: Date.now().toString(), tool: p, points: [{ x: s, y: l }], color: g, lineWidth: x, complete: !1 };
            r.current = e, r.active = !0, f([...h, e]);
        }
    else if ("rect" === p) {
        if (!r.active) {
            const e = { id: Date.now().toString(), tool: "rect", points: [{ x: s, y: l }], color: g, lineWidth: x, complete: !1 };
            r.current = e, r.active = !0, f([...h, e]);
        }
    }
    else if ("brush" === p) {
        const e = { id: Date.now().toString(), tool: "brush", points: [{ x: s, y: l }], color: g, lineWidth: x, complete: !1 };
        r.current = e, r.active = !0, f([...h, e]);
    }
    else if ("text" === p) {
        const e = window.prompt("Enter text:");
        if (e) {
            const t = { id: Date.now().toString(), tool: "text", points: [{ x: s, y: l }], color: g, lineWidth: x, text: e, complete: !0 };
            f([...h, t]);
        }
    }
    else if ("eraser" === p) {
        const e = h.filter(e => "hline" === e.tool && e.points.length > 0 ? Math.abs(e.points[0].y - l) > 10 : !("vline" === e.tool && e.points.length > 0) || Math.abs(e.points[0].x - s) > 10);
        f(e);
    } }, C = t => { const i = a(t), o = i.x, s = i.y; if (n.dragging = !1, e.style.cursor = "cursor" === p ? "default" : "crosshair", "rect" === p && r.active && r.current) {
        const e = m(m({}, r.current), {}, { points: [r.current.points[0], { x: o, y: s }], complete: !0 });
        f([...h.filter(t => t.id !== e.id), e]), r.active = !1, r.current = null;
    }
    else if ("brush" === p && r.active && r.current) {
        const e = m(m({}, r.current), {}, { complete: !0 });
        f([...h.filter(t => t.id !== e.id), e]), r.active = !1, r.current = null;
    } }, T = e => { window.innerWidth < 1024 && !e.ctrlKey && !e.metaKey || (e.preventDefault(), n.zoom = Math.max(.3, Math.min(5, n.zoom * (e.deltaY > 0 ? .9 : 1.1))), n.offset = u(n.offset)); }, A = () => { n.mouseX = -1, n.mouseY = -1; }; let E = "none", R = 0, P = 0, L = 0, O = 0, z = 1, B = 0, D = 0, F = .5; const M = r => { E = "pinch"; const i = l(r), a = c().plotW, o = d(n.zoom), u = Math.max(0, t.length - o - n.offset); O = Math.max(1, s(r)), z = n.zoom, B = i.x, F = Math.max(0, Math.min(1, i.x / Math.max(1, a))), D = u + F * o, n.dragging = !1, e.style.cursor = "grabbing"; }, I = e => { if (e.touches.length >= 2)
        return e.preventDefault(), void M(e.touches); if (1 === e.touches.length) {
        const t = o(e.touches[0]);
        E = "none", R = t.x, P = t.y, L = n.offset, n.mouseX = t.x, n.mouseY = t.y;
    } }, U = e => { if (e.touches.length >= 2) {
        e.preventDefault(), "pinch" !== E && M(e.touches);
        const r = Math.max(1, s(e.touches)), i = l(e.touches), a = Math.max(.3, Math.min(5, z * (r / O))), o = d(a), c = w(a), p = t.length - D - o * (1 - F), h = (i.x - B) / Math.max(1, c);
        return n.zoom = a, n.offset = u(Math.round(p - h), a), n.mouseX = i.x, void (n.mouseY = i.y);
    } if (1 === e.touches.length) {
        const t = o(e.touches[0]), r = t.x - R, i = t.y - P;
        n.mouseX = t.x, n.mouseY = t.y, "cursor" === p && "pan" !== E && Math.abs(r) > 8 && Math.abs(r) > 1.15 * Math.abs(i) && (E = "pan"), "pan" === E && (e.preventDefault(), n.offset = u(L - Math.round(r / Math.max(1, w(n.zoom)))));
    } }, _ = t => { if (t.touches.length >= 2)
        M(t.touches);
    else {
        if (1 === t.touches.length) {
            const e = o(t.touches[0]);
            return E = "none", R = e.x, P = e.y, void (L = n.offset);
        }
        E = "none", n.dragging = !1, e.style.cursor = "cursor" === p ? "default" : "crosshair";
    } }, W = () => { E = "none", n.dragging = !1, e.style.cursor = "cursor" === p ? "default" : "crosshair"; }; return e.addEventListener("mousemove", j), e.addEventListener("mousedown", k), e.addEventListener("mouseup", C), e.addEventListener("mouseleave", A), e.addEventListener("wheel", T, { passive: !1 }), e.addEventListener("touchstart", I, { passive: !1 }), e.addEventListener("touchmove", U, { passive: !1 }), e.addEventListener("touchend", _, { passive: !1 }), e.addEventListener("touchcancel", W, { passive: !1 }), document.addEventListener("mouseup", C), () => { e.removeEventListener("mousemove", j), e.removeEventListener("mousedown", k), e.removeEventListener("mouseup", C), e.removeEventListener("mouseleave", A), e.removeEventListener("wheel", T), e.removeEventListener("touchstart", I), e.removeEventListener("touchmove", U), e.removeEventListener("touchend", _), e.removeEventListener("touchcancel", W), document.removeEventListener("mouseup", C); }; }, [p, h, f, g, x, t, N, S]); const T = "cursor" === p ? "default" : "eraser" === p ? "cell" : "crosshair"; return (0, _i.jsx)("canvas", { ref: b, style: { display: "block", cursor: T, width: "100%", height: "100%", touchAction: "pan-y" } }); }
    function gs(e) { let t = e.buyLevels, n = e.sellLevels, i = e.depthLimit; const a = (0, r.useMemo)(() => { var e, r, i, a, o, s, l, c, d, u, p, h, f, g, x, b; const y = t.map(e => m({}, e)).sort((e, t) => e.price - t.price), v = n.map(e => m({}, e)).sort((e, t) => e.price - t.price), w = null !== (e = null === (r = y[y.length - 1]) || void 0 === r ? void 0 : r.cumulative) && void 0 !== e ? e : 0, j = null !== (i = null === (a = v[v.length - 1]) || void 0 === a ? void 0 : a.cumulative) && void 0 !== i ? i : 0, k = null !== (o = null !== (s = null === (l = y[0]) || void 0 === l ? void 0 : l.price) && void 0 !== s ? s : null === (c = v[0]) || void 0 === c ? void 0 : c.price) && void 0 !== o ? o : 0, S = null !== (d = null !== (u = null === (p = v[v.length - 1]) || void 0 === p ? void 0 : p.price) && void 0 !== u ? u : null === (h = y[y.length - 1]) || void 0 === h ? void 0 : h.price) && void 0 !== d ? d : k + 1, N = null !== (f = null === (g = y[y.length - 1]) || void 0 === g ? void 0 : g.price) && void 0 !== f ? f : k, C = null !== (x = null === (b = v[0]) || void 0 === b ? void 0 : b.price) && void 0 !== x ? x : S; return { buy: y, sell: v, bidTotal: w, askTotal: j, minPrice: k, maxPrice: Math.max(S, k + 1), bestBid: N, bestAsk: C, maxVolume: Math.max(w, j, 1) }; }, [t, n]), o = a.buy, s = a.sell, l = a.bidTotal, c = a.askTotal, d = a.minPrice, u = a.maxPrice, p = a.bestBid, h = a.bestAsk, f = a.maxVolume, g = o.length || s.length, x = 1e3, b = 300, y = 64, v = 24, w = 34, j = 40, k = x - y - v, S = b - w - j, N = e => y + (e - d) / Math.max(1, u - d) * k, C = b - j, T = e => C - e / f * S * .92, A = e => { if (!e.length)
        return ""; let t = "M ".concat(N(e[0].price), " ").concat(C, " L ").concat(N(e[0].price), " ").concat(T(e[0].cumulative)); for (let n = 1; n < e.length; n += 1) {
        const r = e[n];
        t += " L ".concat(N(r.price), " ").concat(T(r.cumulative));
    } return t += " L ".concat(N(e[e.length - 1].price), " ").concat(C, " Z"), t; }, E = e => { if (!e.length)
        return ""; let t = "M ".concat(N(e[0].price), " ").concat(T(e[0].cumulative)); for (let n = 1; n < e.length; n += 1) {
        const r = e[n];
        t += " L ".concat(N(r.price), " ").concat(T(r.cumulative));
    } return t; }, R = A(o.map(e => { var t; return { price: e.price, cumulative: null !== (t = e.cumulative) && void 0 !== t ? t : 0 }; })), P = A(s.map(e => { var t; return { price: e.price, cumulative: null !== (t = e.cumulative) && void 0 !== t ? t : 0 }; })), L = E(o.map(e => { var t; return { price: e.price, cumulative: null !== (t = e.cumulative) && void 0 !== t ? t : 0 }; })), O = E(s.map(e => { var t; return { price: e.price, cumulative: null !== (t = e.cumulative) && void 0 !== t ? t : 0 }; })), z = N(p), B = N(h), D = Array.from(new Set([d, p, h, u])).filter(e => e > 0); return (0, _i.jsxs)("div", { style: { height: "100%", display: "flex", flexDirection: "column", gap: 16 }, children: [(0, _i.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: { fontSize: 14, fontWeight: 700, color: $o.textBright }, children: "Depth Chart" }), (0, _i.jsxs)("div", { style: { fontSize: 12, color: $o.textMuted }, children: ["Cumulative orderbook curves for the top ", i, " levels"] })] }), (0, _i.jsxs)("div", { style: { display: "flex", gap: 12, flexWrap: "wrap", color: $o.textMuted, fontSize: 12 }, children: [(0, _i.jsxs)("span", { style: { color: $o.green }, children: ["Bids ", rs(l)] }), (0, _i.jsxs)("span", { style: { color: $o.red }, children: ["Asks ", rs(c)] }), (0, _i.jsxs)("span", { children: ["Spread ", h > 0 ? ns(h - p) : "\u2014"] })] })] }), (0, _i.jsx)("div", { style: { flex: 1, minHeight: 280, background: $o.bg, border: "1px solid ".concat($o.border), borderRadius: 18, padding: 12, display: "flex", flexDirection: "column" }, children: g ? (0, _i.jsxs)("svg", { viewBox: "0 0 ".concat(x, " ").concat(b), preserveAspectRatio: "none", style: { width: "100%", height: "100%", overflow: "visible" }, children: [(0, _i.jsxs)("defs", { children: [(0, _i.jsxs)("linearGradient", { id: "depthBidGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, _i.jsx)("stop", { offset: "0%", stopColor: $o.green, stopOpacity: "0.24" }), (0, _i.jsx)("stop", { offset: "100%", stopColor: $o.green, stopOpacity: "0" })] }), (0, _i.jsxs)("linearGradient", { id: "depthAskGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, _i.jsx)("stop", { offset: "0%", stopColor: $o.red, stopOpacity: "0.24" }), (0, _i.jsx)("stop", { offset: "100%", stopColor: $o.red, stopOpacity: "0" })] })] }), (0, _i.jsx)("rect", { x: "0", y: "0", width: x, height: b, fill: "transparent" }), (0, _i.jsx)("line", { x1: y, y1: C, x2: x - v, y2: C, stroke: $o.border, strokeWidth: "1" }), D.map(e => (0, _i.jsx)("g", { children: (0, _i.jsx)("line", { x1: N(e), y1: w, x2: N(e), y2: C, stroke: $o.border, strokeWidth: "0.5" }) }, e)), (0, _i.jsx)("path", { d: R, fill: "url(#depthBidGrad)" }), (0, _i.jsx)("path", { d: P, fill: "url(#depthAskGrad)" }), (0, _i.jsx)("path", { d: L, fill: "none", stroke: $o.green, strokeWidth: "2", strokeLinecap: "round" }), (0, _i.jsx)("path", { d: O, fill: "none", stroke: $o.red, strokeWidth: "2", strokeLinecap: "round" }), D.map(e => (0, _i.jsxs)("g", { children: [(0, _i.jsx)("line", { x1: N(e), y1: C, x2: N(e), y2: C + 6, stroke: $o.textMuted, strokeWidth: "1" }), (0, _i.jsx)("text", { x: N(e), y: C + 20, fill: $o.textMuted, fontSize: "10", textAnchor: "middle", children: ns(e) })] }, "label-".concat(e))), (0, _i.jsx)("text", { x: y, y: w - 8, fill: $o.textMuted, fontSize: "10", children: "Depth volume" }), (0, _i.jsxs)("text", { x: z, y: C - 12, fill: $o.green, fontSize: "10", textAnchor: "middle", fontWeight: "700", children: ["Bid ", ns(p)] }), (0, _i.jsxs)("text", { x: B, y: C - 12, fill: $o.red, fontSize: "10", textAnchor: "middle", fontWeight: "700", children: ["Ask ", ns(h)] })] }) : (0, _i.jsx)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: $o.textMuted, fontSize: 13 }, children: "No depth data available yet" }) })] }); }
    function ms() { var e; const t = (() => { try {
        const e = localStorage.getItem(cs);
        return e ? JSON.parse(e) : {};
    }
    catch (e) {
        return {};
    } })(), n = (0, r.useState)([]), i = u(n, 2), a = i[0], o = i[1], s = (0, r.useState)(t.symbol || "BTC/USDT"), l = u(s, 2), c = l[0], d = l[1], p = (0, r.useState)(t.timeframe || "1d"), h = u(p, 2), f = h[0], g = h[1], x = (0, r.useState)({ buy: [], sell: [] }), b = u(x, 2), y = b[0], v = b[1], w = (0, r.useState)([]), j = u(w, 2), k = j[0], S = j[1], N = (0, r.useState)([]), C = u(N, 2), T = C[0], A = C[1], E = (0, r.useState)([]), R = u(E, 2), P = R[0], L = R[1], O = (0, r.useState)(""), z = u(O, 2), B = z[0], D = z[1], F = (0, r.useState)([]), M = u(F, 2), I = M[0], U = M[1], _ = (0, r.useState)([]), W = u(_, 2), H = W[0], V = W[1], q = (0, r.useState)(""), K = u(q, 2), G = K[0], Y = K[1], X = u((0, r.useState)(""), 2), J = X[0], Q = X[1], Z = u((0, r.useState)(""), 2), $ = Z[0], ee = Z[1], te = u((0, r.useState)(0), 2), ne = te[0], re = te[1], ie = u((0, r.useState)(0), 2), ae = ie[0], oe = ie[1], se = u((0, r.useState)("up"), 2), le = se[0], ce = se[1], de = (0, r.useRef)({ direction: "up", streak: 0, targetGreenCount: 2 }), ue = u((0, r.useState)(0), 2), pe = (ue[0], ue[1]), he = u((0, r.useState)(0), 2), fe = he[0], ge = he[1], me = u((0, r.useState)(0), 2), xe = me[0], be = me[1], ye = u((0, r.useState)(0), 2), ve = ye[0], we = ye[1], je = u((0, r.useState)(0), 2), ke = je[0], Se = je[1], Ne = u((0, r.useState)(0), 2), Ce = Ne[0], Te = Ne[1], Ae = u((0, r.useState)(Date.now()), 2), Ee = Ae[0], Re = Ae[1], Pe = u((0, r.useState)(void 0 === t.showSMA || t.showSMA), 2), Le = Pe[0], Oe = Pe[1], ze = u((0, r.useState)(void 0 === t.showEMA || t.showEMA), 2), Be = ze[0], De = ze[1], Fe = u((0, r.useState)(!1), 2), Me = Fe[0], Ie = Fe[1], Ue = u((0, r.useState)(void 0 !== t.showBollinger && t.showBollinger), 2), _e = Ue[0], We = Ue[1], He = u((0, r.useState)(!1), 2), Ve = He[0], qe = He[1], Ke = u((0, r.useState)(!1), 2), Ge = Ke[0], Ye = Ke[1], Xe = u((0, r.useState)("candlestick"), 2), Je = Xe[0], Qe = Xe[1], Ze = u((0, r.useState)("original"), 2), $e = Ze[0], et = Ze[1], tt = u((0, r.useState)("chart"), 2), nt = tt[0], rt = tt[1], it = u((0, r.useState)("limit"), 2), at = it[0], ot = it[1], st = u((0, r.useState)("buy"), 2), lt = (st[0], st[1], u((0, r.useState)(""), 2)), ct = lt[0], dt = lt[1], ut = u((0, r.useState)(""), 2), pt = ut[0], ht = ut[1], ft = u((0, r.useState)(0), 2), gt = ft[0], mt = ft[1], xt = u((0, r.useState)("name"), 2), bt = xt[0], yt = xt[1], vt = u((0, r.useState)(t.depthLimit || 15), 2), wt = vt[0], jt = vt[1], kt = u((0, r.useState)("offline"), 2), St = kt[0], Nt = kt[1], Ct = u((0, r.useState)({ available: 0, locked: 0, holdings: [{ asset: "BTC", amount: 0, value: 0 }, { asset: "ETH", amount: 0, value: 0 }, { asset: "USDT", amount: 0, value: 0 }] }), 2), Tt = Ct[0], At = Ct[1], Et = u((0, r.useState)([{ id: "o-1", pair: "BTC/USDT", type: "limit", side: "buy", price: 79750, amount: .12, status: "open", createdAt: Math.floor(Date.now() / 1e3) - 4300 }, { id: "o-2", pair: "BTC/USDT", type: "stop-loss", side: "sell", price: 81200, amount: .05, stopLoss: 8e4, takeProfit: 82400, status: "open", createdAt: Math.floor(Date.now() / 1e3) - 7800 }]), 2), Rt = Et[0], Pt = Et[1], Lt = u((0, r.useState)([{ time: Math.floor(Date.now() / 1e3) - 480, price: 80080, quantity: .09, side: "buy", pair: "BTC/USDT", type: "market" }, { time: Math.floor(Date.now() / 1e3) - 1280, price: 80145, quantity: .03, side: "sell", pair: "BTC/USDT", type: "limit" }]), 2), Ot = Lt[0], zt = Lt[1], Bt = u((0, r.useState)("market"), 2), Dt = Bt[0], Ft = Bt[1], Mt = u((0, r.useState)("openorders"), 2), It = Mt[0], Ut = Mt[1], _t = u((0, r.useState)("usdt"), 2), Wt = _t[0], Ht = _t[1], Vt = u((0, r.useState)("cursor"), 2), qt = Vt[0], Kt = Vt[1], Gt = u((0, r.useState)([]), 2), Yt = Gt[0], Xt = Gt[1], Jt = u((0, r.useState)("#f0b90b"), 2), Qt = Jt[0], Zt = Jt[1], $t = u((0, r.useState)(1.5), 2), en = $t[0], tn = $t[1], nn = u((0, r.useState)(!1), 2), rn = nn[0], an = nn[1], on = u((0, r.useState)(0), 2), sn = (on[0], on[1]), ln = u((0, r.useState)(!1), 2), cn = ln[0], dn = ln[1], un = u((0, r.useState)("spot"), 2), pn = un[0], hn = un[1], fn = u((0, r.useState)(!1), 2), gn = (fn[0], fn[1], u((0, r.useState)(!1), 2)), mn = gn[0], xn = gn[1], bn = u((0, r.useState)({ lowerPrice: "", upperPrice: "", gridNum: "10", investAmount: "" }), 2), yn = (bn[0], bn[1], u((0, r.useState)("undefined" !== typeof window ? window.innerWidth : 1200), 2)), vn = yn[0], wn = yn[1], jn = u((0, r.useState)("combined"), 2), kn = jn[0], Sn = jn[1], Nn = (0, r.useRef)(null), Cn = (0, r.useRef)(null), Tn = "chart" === nt, An = vn >= 1024, En = !An; (0, r.useEffect)(() => { const e = () => wn(window.innerWidth); return window.addEventListener("resize", e), () => window.removeEventListener("resize", e); }, []), (0, r.useEffect)(() => { (e => { try {
        localStorage.setItem(cs, JSON.stringify(e));
    }
    catch (t) { } })({ symbol: c, timeframe: f, showSMA: Le, showEMA: Be, showBollinger: _e, depthLimit: wt }); }, [c, f, Le, Be, _e, wt]), (0, r.useEffect)(() => { const e = e => { mn && !e.target.closest(".time-dropdown") && xn(!1); }; return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e); }, [mn]); const Rn = (0, r.useMemo)(() => ({ sma: Le ? ds(T, 7) : [], ema: Be ? us(T, 99) : [], bb: _e ? ps(T, 20, 2) : [], vwap: Ge ? hs(T) : [] }), [T, Le, Be, _e, Ge]), Pn = (0, r.useMemo)(() => Me ? function (e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 14, n = 0, r = 0; const i = []; for (let a = 1; a < e.length; a++) {
        const o = e[a].close - e[a - 1].close, s = Math.max(o, 0), l = Math.max(-o, 0);
        a <= t ? (n += s / t, r += l / t, a === t && i.push({ time: e[a].time, value: +(100 - 100 / (1 + n / (r || 1e-4))).toFixed(2) })) : (n = (n * (t - 1) + s) / t, r = (r * (t - 1) + l) / t, i.push({ time: e[a].time, value: +(100 - 100 / (1 + n / (r || 1e-4))).toFixed(2) }));
    } return i; }(T, 14) : [], [T, Me]), Ln = (0, r.useMemo)(() => Ve ? function (e) { var t; let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 26, r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 9; const i = us(e, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 12), a = us(e, n), o = Object.fromEntries(i.map(e => [e.time, e.value])), s = a.map(e => ({ time: e.time, value: +(o[e.time] - e.value).toFixed(6) })).filter(e => void 0 !== o[e.time]), l = 2 / (r + 1); let c = (null === (t = s[0]) || void 0 === t ? void 0 : t.value) || 0; const d = s.map((e, t) => (c = 0 === t ? e.value : e.value * l + c * (1 - l), { time: e.time, value: +c.toFixed(6) })), u = s.map((e, t) => { var n; return { time: e.time, value: +(e.value - ((null === (n = d[t]) || void 0 === n ? void 0 : n.value) || 0)).toFixed(6) }; }); return { macdLine: s, sigLine: d, histogram: u }; }(T, 12, 26, 9) : null, [T, Ve]), On = y.buy.slice().sort((e, t) => t.price - e.price).slice(0, wt).map(e => m(m({}, e), {}, { total: +(e.price * e.amount).toFixed(2) })), zn = y.sell.slice().sort((e, t) => e.price - t.price).slice(0, wt).map(e => m(m({}, e), {}, { total: +(e.price * e.amount).toFixed(2) })); let Bn = 0, Dn = 0; const Fn = On.map(e => (Bn += e.total || 0, m(m({}, e), {}, { cumulative: Bn }))), Mn = zn.map(e => (Dn += e.total || 0, m(m({}, e), {}, { cumulative: Dn }))), In = Math.max(...Fn.map(e => e.total || 0), 1), Un = Math.max(...Mn.map(e => e.total || 0), 1), _n = Bn, Wn = Dn, Hn = _n + Wn > 0 ? (_n / (_n + Wn) * 100).toFixed(1) : "50.0", Vn = _n + Wn > 0 ? (Wn / (_n + Wn) * 100).toFixed(1) : "50.0", qn = Rt.filter(e => "open" === e.status), Kn = parseFloat(Hn) || 0, Gn = parseFloat(Vn) || 0, Yn = (0, _i.jsx)("div", { style: { padding: "10px 12px", borderBottom: "1px solid ".concat($o.border), background: $o.bgAlt }, children: (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "10px", borderRadius: 12, border: "1px solid ".concat($o.red), background: "rgba(246,70,93,0.08)" }, children: [(0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: "1 1 auto" }, children: [(0, _i.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: $o.textBright, whiteSpace: "nowrap" }, children: "Bid / Ask Balance" }), (0, _i.jsxs)("span", { style: { padding: "2px 8px", borderRadius: 999, background: $o.greenDim, color: $o.green, fontSize: 11, fontWeight: 700 }, children: ["B ", Hn, "%"] }), (0, _i.jsxs)("span", { style: { padding: "2px 8px", borderRadius: 999, background: $o.redDim, color: $o.red, fontSize: 11, fontWeight: 700 }, children: ["S ", Vn, "%"] })] }), (0, _i.jsxs)("div", { style: { flex: "1 1 120px", minWidth: 120, height: 10, borderRadius: 999, overflow: "hidden", background: $o.border }, children: [(0, _i.jsx)("div", { style: { width: "".concat(Kn, "%"), height: "100%", background: $o.green, float: "left" } }), (0, _i.jsx)("div", { style: { width: "".concat(Gn, "%"), height: "100%", background: $o.red, float: "right" } })] })] }) }), Xn = () => { const e = Mn.slice().reverse(), t = Fn, n = "asks" !== kn, r = "bids" !== kn ? [...e.map(e => m(m({}, e), {}, { side: "sell" })), ...n ? t.map(e => m(m({}, e), {}, { side: "buy" })) : []] : n ? t.map(e => m(m({}, e), {}, { side: "buy" })) : []; if ("combined" === kn) {
        const n = Math.max(e.length, t.length);
        return (0, _i.jsxs)(_i.Fragment, { children: [Yn, (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 0.9fr 0.9fr 1fr", padding: "6px 8px", fontSize: 10, fontWeight: 600, color: $o.textMuted, borderBottom: "1px solid ".concat($o.border) }, children: [(0, _i.jsx)("span", { style: { textAlign: "left" }, children: "Bid Amount" }), (0, _i.jsx)("span", { style: { textAlign: "left" }, children: "Price" }), (0, _i.jsx)("span", { style: { textAlign: "right" }, children: "Price" }), (0, _i.jsx)("span", { style: { textAlign: "right" }, children: "Ask Amount" })] }), (0, _i.jsx)("div", { style: { flex: 1, overflow: "auto" }, children: Array.from({ length: n }).map((n, r) => { const i = e[r], a = t[r]; return (0, _i.jsxs)("div", { onClick: () => { const e = a || i; e && Y(e.price.toFixed(2)); }, style: { display: "grid", gridTemplateColumns: "1fr 0.9fr 0.9fr 1fr", padding: "4px 8px", alignItems: "center", minHeight: 24, fontSize: 10, fontFamily: "monospace", color: $o.text, background: r % 2 === 0 ? $o.bg : "transparent", cursor: a || i ? "pointer" : "default" }, children: [(0, _i.jsx)("span", { style: { color: $o.textBright, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: a ? a.amount.toFixed(5) : "" }), (0, _i.jsx)("span", { style: { color: a ? $o.green : $o.textMuted, textAlign: "left", whiteSpace: "nowrap" }, children: a ? a.price.toFixed(2) : "" }), (0, _i.jsx)("span", { style: { color: i ? $o.red : $o.textMuted, textAlign: "right", whiteSpace: "nowrap" }, children: i ? i.price.toFixed(2) : "" }), (0, _i.jsx)("span", { style: { color: $o.textBright, textAlign: "right", whiteSpace: "nowrap" }, children: i ? i.amount.toFixed(5) : "" })] }, r); }) })] });
    } const i = (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: $o.textMuted, borderBottom: "1px solid ".concat($o.border) }, children: [(0, _i.jsx)("span", { children: "Price" }), (0, _i.jsx)("span", { style: { textAlign: "center" }, children: "Amount" }), (0, _i.jsx)("span", { style: { textAlign: "right" }, children: "Total" })] }); return (0, _i.jsxs)(_i.Fragment, { children: [Yn, i, (0, _i.jsx)("div", { style: { flex: 1, overflow: "auto" }, children: r.map((e, t) => (0, _i.jsxs)("div", { onClick: () => Y(e.price.toFixed(2)), style: { position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 10px", alignItems: "center", minHeight: 32, fontSize: 11, fontFamily: "monospace", color: "sell" === e.side ? $o.red : $o.green, background: t % 2 === 0 ? $o.bg : "transparent", cursor: "pointer" }, children: [(0, _i.jsx)("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: "".concat(Math.min(100, (e.total || 0) / Math.max(Un, In) * 100), "%"), background: "sell" === e.side ? $o.redDim : $o.greenDim, zIndex: 0 } }), (0, _i.jsx)("span", { style: { position: "relative", zIndex: 1, textAlign: "left" }, children: e.price.toFixed(2) }), (0, _i.jsx)("span", { style: { position: "relative", zIndex: 1, textAlign: "center", color: $o.textBright }, children: e.amount.toFixed(5) }), (0, _i.jsx)("span", { style: { position: "relative", zIndex: 1, textAlign: "right", color: $o.text }, children: (e.total || 0).toFixed(2) })] }, t)) })] }); }, Jn = e => (0, _i.jsxs)("aside", { className: "trading-orderbook trading-orderbook--".concat(e), style: { width: "side" === e ? 260 : "100%", background: $o.bgPanel, borderLeft: "side" === e ? "1px solid ".concat($o.border) : "none", borderTop: "embedded" === e ? "1px solid ".concat($o.border) : "none", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", minHeight: "side" === e ? 0 : 320 }, children: [(0, _i.jsxs)("div", { style: { padding: "8px 10px", borderBottom: "1px solid ".concat($o.border), display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }, children: [(0, _i.jsx)("span", { style: { fontWeight: 700, fontSize: 13, color: $o.textBright }, children: "Order Book" }), (0, _i.jsxs)("div", { style: { display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }, children: [["combined", "bids", "asks"].map(e => (0, _i.jsx)("button", { onClick: () => Sn(e), style: { background: kn === e ? $o.bgHover : "transparent", border: "1px solid ".concat(kn === e ? $o.border : "transparent"), color: kn === e ? $o.textBright : $o.text, cursor: "pointer", padding: "2px 6px", borderRadius: 3, fontSize: 10, textTransform: "capitalize" }, children: "combined" === e ? "Both" : e }, e)), [10, 15, 20].map(e => (0, _i.jsx)("button", { onClick: () => jt(e), style: { background: wt === e ? $o.bgHover : "transparent", border: "1px solid ".concat(wt === e ? $o.border : "transparent"), color: wt === e ? $o.amber : $o.text, cursor: "pointer", padding: "2px 5px", borderRadius: 3, fontSize: 10, fontFamily: "monospace" }, children: e }, e))] })] }), Xn()] }), Qn = () => (0, _i.jsxs)("div", { style: { borderTop: "1px solid ".concat($o.border), background: $o.bgPanel, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [(0, _i.jsxs)("div", { style: { padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [(0, _i.jsx)("span", { style: { fontSize: 12, fontWeight: 600, color: $o.textBright }, children: "Top Movers" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.text }, children: "FAQ \u25be" })] }), (0, _i.jsx)("div", { style: { display: "flex", gap: 4, padding: "0 10px 6px" }, children: ["All", "Change", "New High/Low", "Fluctuation", "Volume"].map(e => (0, _i.jsx)("button", { style: { fontSize: 10, padding: "2px 6px", background: "All" === e ? $o.bgAlt : "transparent", border: "1px solid ".concat("All" === e ? $o.border : "transparent"), borderRadius: 3, color: $o.text, cursor: "pointer", whiteSpace: "nowrap" }, children: e }, e)) }), H.slice().sort((e, t) => Math.abs(t.change) - Math.abs(e.change)).slice(0, 3).map(e => (0, _i.jsxs)("div", { onClick: () => d(e.pair), style: { display: "flex", alignItems: "center", padding: "4px 10px", cursor: "pointer", gap: 8 }, onMouseEnter: e => e.currentTarget.style.background = $o.bgAlt, onMouseLeave: e => e.currentTarget.style.background = "transparent", children: [(0, _i.jsxs)("div", { style: { flex: 1 }, children: [(0, _i.jsx)("div", { style: { fontSize: 11, fontWeight: 600, color: $o.textBright }, children: e.pair }), (0, _i.jsx)("div", { style: { fontSize: 10, color: $o.textMuted }, children: (new Date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })] }), (0, _i.jsxs)("div", { style: { textAlign: "right" }, children: [(0, _i.jsxs)("span", { style: { fontSize: 11, background: e.change >= 0 ? $o.greenDim : $o.redDim, color: e.change >= 0 ? $o.green : $o.red, padding: "2px 6px", borderRadius: 3 }, children: [e.change >= 0 ? "+" : "", e.change.toFixed(2), "%"] }), (0, _i.jsx)("div", { style: { fontSize: 9, color: $o.textMuted, marginTop: 1 }, children: "New 7day High" })] })] }, e.pair))] }), Zn = () => (0, _i.jsxs)("div", { style: { background: $o.bgPanel, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }, children: [(0, _i.jsx)("div", { style: { padding: "8px 10px", borderBottom: "1px solid ".concat($o.border) }, children: (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", background: $o.bgAlt, border: "1px solid ".concat($o.border), borderRadius: 4, padding: "4px 10px", gap: 6 }, children: [(0, _i.jsx)("span", { style: { color: $o.textMuted, fontSize: 13 }, children: "\ud83d\udd0d" }), (0, _i.jsx)("input", { type: "text", placeholder: "Search", value: B, onChange: e => D(e.target.value), style: { background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, flex: 1 } })] }) }), (0, _i.jsx)("div", { style: { display: "flex", borderBottom: "1px solid ".concat($o.border), padding: "0 6px" }, children: ["fav", "usdt"].map(e => (0, _i.jsx)("button", { onClick: () => Ht(e), style: { flex: 1, padding: "6px 0", background: "transparent", border: "none", cursor: "pointer", fontSize: 11, color: Wt === e ? $o.amber : $o.text, borderBottom: Wt === e ? "2px solid ".concat($o.amber) : "2px solid transparent", fontWeight: Wt === e ? 700 : 400 }, children: "fav" === e ? "\u2605" : e.toUpperCase() }, e)) }), (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "4px 10px", fontSize: 10, color: $o.textMuted, borderBottom: "1px solid ".concat($o.border) }, children: [(0, _i.jsxs)("button", { onClick: () => yt("name"), style: { background: "none", border: "none", color: $o.textMuted, cursor: "pointer", textAlign: "left", fontSize: 10 }, children: ["Pair ", "name" === bt ? "\u2195" : ""] }), (0, _i.jsxs)("button", { onClick: () => yt("change"), style: { background: "none", border: "none", color: $o.textMuted, cursor: "pointer", textAlign: "right", fontSize: 10 }, children: ["Last Price ", "change" === bt ? "\u2195" : ""] }), (0, _i.jsxs)("button", { onClick: () => yt("volume"), style: { background: "none", border: "none", color: $o.textMuted, cursor: "pointer", textAlign: "right", fontSize: 10 }, children: ["24h Chg% ", "volume" === bt ? "\u2195" : ""] })] }), (0, _i.jsx)("div", { style: { flex: 1, overflowY: "auto", maxHeight: 336 }, children: dr.map(e => { const t = H.find(t => t.pair === e), n = (null === t || void 0 === t ? void 0 : t.change) || 0, r = e.split("/")[0]; return (0, _i.jsxs)("div", { onClick: () => d(e), style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "5px 10px", minHeight: 46, cursor: "pointer", background: e === c ? $o.bgHover : "transparent", borderLeft: e === c ? "2px solid ".concat($o.amber) : "2px solid transparent" }, onMouseEnter: t => { e !== c && (t.currentTarget.style.background = $o.bgAlt); }, onMouseLeave: t => { e !== c && (t.currentTarget.style.background = "transparent"); }, children: [(0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [(0, _i.jsx)("div", { style: { width: 28, height: 28, borderRadius: 999, background: $o.bgAlt, display: "grid", placeItems: "center", color: $o.amber, fontSize: 11, fontWeight: 700 }, children: r.slice(0, 3) }), (0, _i.jsxs)("div", { children: [(0, _i.jsxs)("div", { style: { fontSize: 12, fontWeight: e === c ? 700 : 500, color: $o.textBright }, children: [r, "/", (0, _i.jsx)("span", { style: { color: $o.textMuted, fontSize: 10 }, children: e.split("/")[1] })] }), t && (0, _i.jsxs)("div", { style: { fontSize: 9, color: $o.textMuted }, children: [rs(t.volume), "M"] })] })] }), (0, _i.jsx)("div", { style: { textAlign: "right", fontFamily: "monospace", fontSize: 11, color: $o.textBright }, children: ns(e === c ? ne : 3e4 + 5e4 * Math.random()) }), (0, _i.jsx)("div", { style: { textAlign: "right" }, children: (0, _i.jsxs)("span", { style: { fontSize: 11, fontFamily: "monospace", background: n >= 0 ? $o.greenDim : $o.redDim, color: n >= 0 ? $o.green : $o.red, padding: "1px 5px", borderRadius: 3 }, children: [n >= 0 ? "+" : "", n.toFixed(2), "%"] }) })] }, e); }) })] }), $n = e => (0, _i.jsxs)("div", { style: { borderTop: "1px solid ".concat($o.border), flexShrink: 0, background: $o.bgPanel }, children: [(0, _i.jsx)("div", { style: { display: "flex", borderBottom: "1px solid ".concat($o.border) }, children: ["market", "mytrades"].map(e => (0, _i.jsx)("button", { onClick: () => Ft(e), style: { flex: 1, padding: "6px 0", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: Dt === e ? $o.textBright : $o.text, borderBottom: Dt === e ? "2px solid ".concat($o.amber) : "2px solid transparent", fontWeight: Dt === e ? 600 : 400 }, children: "market" === e ? "Market Trades" : "My Trades" }, e)) }), (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "4px 10px", fontSize: 10, color: $o.textMuted }, children: [(0, _i.jsx)("span", { children: "Price (USDT)" }), (0, _i.jsx)("span", { style: { textAlign: "right" }, children: "Amount (BTC)" }), (0, _i.jsx)("span", { style: { textAlign: "right" }, children: "Time" })] }), (0, _i.jsx)("div", { style: { maxHeight: 180, overflow: "auto" }, children: ("market" === Dt ? k : Ot).slice(0, 15).map((e, t) => { const n = e.side, r = e.price, i = "amount" in e ? e.amount : e.quantity, a = e.time; return (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "2px 10px", fontSize: 11, fontFamily: "monospace" }, children: [(0, _i.jsx)("span", { style: { color: "buy" === n ? $o.green : $o.red }, children: r.toFixed(2) }), (0, _i.jsx)("span", { style: { textAlign: "right", color: $o.textBright }, children: i.toFixed(4) }), (0, _i.jsx)("span", { style: { textAlign: "right", color: $o.textMuted }, children: ts(a) })] }, t); }) }), e && Qn()] }), er = (0, r.useMemo)(() => { const e = u(c.split("/"), 2), t = e[0], n = e[1], r = { USDT: "USDT", USD: "USD", BTC: "XBT", ETH: "ETH" }[n] || n; return "".concat({ BTC: "XBT", ETH: "ETH", LTC: "LTC", XRP: "XRP", ADA: "ADA", DOT: "DOT", SOL: "SOL", USDT: "USDT", USDC: "USDC", BNB: "BNB", AVAX: "AVAX", MATIC: "MATIC" }[t] || t).concat(r); }, [c]); (0, r.useEffect)(() => { c && (async (e, t) => { try {
        const a = await No(), o = u(await Promise.all([a.get("/api/market/candles/".concat(encodeURIComponent(e), "?timeframe=").concat(t)), a.get("/api/market/trades/".concat(encodeURIComponent(e))), a.get("/api/market/candles/".concat(encodeURIComponent(e), "?timeframe=1d")), a.get("/api/market/deepmarket/".concat(encodeURIComponent(e), "?timeframe=").concat(t))]), 4), s = o[0], l = o[1], c = o[2], d = o[3], p = s.data, h = (p.length ? p : ls()).map(e => m(m({}, e), {}, { time: Math.floor(Number(e.time)) })).sort((e, t) => e.time - t.time);
        A(h);
        const f = l.data || [];
        S(f.sort((e, t) => t.time - e.time).slice(0, 50));
        const g = (d.data || []).map(e => ({ time: Math.floor(Number(e.time)), value: Number(e.value) })).sort((e, t) => e.time - t.time);
        L(g);
        const x = h[h.length - 1];
        x && (re(x.close), oe(x.close), Y(x.close.toFixed(2)), Re(Date.now()));
        const b = c.data, y = (b.length ? b : ls(30, 8e4)).map(e => m(m({}, e), {}, { time: Math.floor(Number(e.time)) })).sort((e, t) => e.time - t.time);
        if (y.length) {
            var n, r, i;
            be(Math.max(...y.map(e => e.high))), we(Math.min(...y.map(e => e.low))), Se(y.reduce((e, t) => e + t.volume, 0));
            const e = (null === (n = y[0]) || void 0 === n ? void 0 : n.close) || (null === (r = y[y.length - 1]) || void 0 === r ? void 0 : r.close), t = (null === (i = y[y.length - 1]) || void 0 === i ? void 0 : i.close) || e;
            pe(+(t - e).toFixed(2)), ge(+((t - e) / e * 100).toFixed(2));
        }
        Nt("live");
    }
    catch (o) {
        var a;
        Nt("offline");
        const e = ls();
        A(e), L([]), re((null === (a = e[e.length - 1]) || void 0 === a ? void 0 : a.close) || 80721), Y("80721.22"), be(80817.99), we(79920), Se(9305.28), pe(720.52), ge(.9);
    } })(c, f); }, [c, f]), (0, r.useEffect)(() => { if (!c)
        return; const e = () => { (async (e) => { try {
        const t = await No(), n = (await t.get("/api/market/orderbook/".concat(encodeURIComponent(e)))).data;
        let r = 0;
        const i = n.sell.map(e => (r += e.amount, m(m({}, e), {}, { total: r })));
        let a = 0;
        const o = n.buy.map(e => (a += e.amount, m(m({}, e), {}, { total: a })));
        v({ buy: o, sell: i });
    }
    catch (t) {
        v({ buy: [], sell: [] });
    } })(c), (async () => { try {
        var e, t, n, r, i, a, o, s, l;
        const c = (null === (e = (await Ai.get("https://api.kraken.com/0/public/Ticker?pair=".concat(er))).data) || void 0 === e ? void 0 : e.result) || {}, d = c[Object.keys(c)[0]] || {}, u = parseFloat((null === (t = d.c) || void 0 === t ? void 0 : t[0]) || (null === (n = d.a) || void 0 === n ? void 0 : n[0]) || "0") || 0, p = parseFloat((null === (r = d.h) || void 0 === r ? void 0 : r[1]) || (null === (i = d.h) || void 0 === i ? void 0 : i[0]) || "0") || 0, h = parseFloat((null === (a = d.l) || void 0 === a ? void 0 : a[1]) || (null === (o = d.l) || void 0 === o ? void 0 : o[0]) || "0") || 0, f = parseFloat((null === (s = d.v) || void 0 === s ? void 0 : s[1]) || (null === (l = d.v) || void 0 === l ? void 0 : l[0]) || "0") || 0, g = parseFloat(d.o || "0") || 0, m = u - g, x = g ? m / g * 100 : 0;
        be(p), we(h), Se(f), Te(f * u), pe(m), ge(x), re(u), oe(u), Re(Date.now()), Nt("live");
    }
    catch (c) {
        Nt("offline"), Te(ke * ne);
    } })(); }; e(); const t = window.setInterval(e, 1e3); return () => window.clearInterval(t); }, [c]), (0, r.useEffect)(() => { const e = B.toLowerCase(), t = a.filter(t => t.toLowerCase().includes(e)).sort((e, t) => { var n, r, i, a; return "change" === bt ? Math.abs((null === (n = H.find(e => e.pair === t)) || void 0 === n ? void 0 : n.change) || 0) - Math.abs((null === (r = H.find(t => t.pair === e)) || void 0 === r ? void 0 : r.change) || 0) : "volume" === bt ? ((null === (i = H.find(e => e.pair === t)) || void 0 === i ? void 0 : i.volume) || 0) - ((null === (a = H.find(t => t.pair === e)) || void 0 === a ? void 0 : a.volume) || 0) : e.localeCompare(t); }); U(t); }, [B, a, bt, H]), (0, r.useEffect)(() => { let e; return (async () => { e = await Ao(), e.on("trade", e => { if (e.pair !== c)
        return; const t = Number(e.price), n = Zo[f] || 60, r = Math.floor(Date.now() / 1e3 / n) * n; S(n => [{ time: r, price: t, amount: Number(e.amount), side: e.side || "buy" }, ...n.slice(0, 49)]), A(n => { const i = [...n], a = i[i.length - 1]; return a && a.time === r ? i[i.length - 1] = m(m({}, a), {}, { high: Math.max(a.high, t), low: Math.min(a.low, t), close: t, volume: a.volume + Number(e.amount) }) : (i.push({ time: r, open: t, high: t, low: t, close: t, volume: Number(e.amount) }), i.length > 1e3 && i.shift()), i; }), re(t), Re(Date.now()), Nt("live"); }), e.on("priceUpdate", e => { if (e.pair !== c)
        return; const t = Number(e.price); re(t), Re(e.time || Date.now()), Nt("live"), tr(t); }), e.on("orderbook", e => { if (e.pair !== c)
        return; let t = 0; const n = e.sell.map(e => (t += e.amount, m(m({}, e), {}, { total: t }))); let r = 0; const i = e.buy.map(e => (r += e.amount, m(m({}, e), {}, { total: r }))); v({ buy: i, sell: n }); }), e.on("balanceUpdate", e => { const t = localStorage.getItem("userId"); e.userId === t && At(t => m(m({}, t), {}, { available: e.balance, locked: e.frozenBalance || t.locked })); }), e.on("connect", () => Nt("live")), e.on("disconnect", () => Nt("offline")); })(), () => { var t, n, r, i, a, o, s; null === (t = e) || void 0 === t || t.off("trade"), null === (n = e) || void 0 === n || n.off("priceUpdate"), null === (r = e) || void 0 === r || r.off("orderbook"), null === (i = e) || void 0 === i || i.off("balanceUpdate"), null === (a = e) || void 0 === a || a.off("connect"), null === (o = e) || void 0 === o || o.off("disconnect"), null === (s = e) || void 0 === s || s.disconnect(); }; }, [c, f]), (0, r.useEffect)(() => { (async () => { try {
        const e = await No(), t = await e.get("/api/market/symbols"), n = ss(t.data.symbols || ["BTC/USDT"]).filter(e => e.endsWith("/USDT"));
        o(n), U(n), V(n.map(e => ({ pair: e, change: +(12 * (Math.random() - .5)).toFixed(2), volume: +(150 * Math.random() + 10).toFixed(2), high: 81e3 + 1e3 * Math.random(), low: 79e3 + 1e3 * Math.random() })));
    }
    catch (e) {
        const t = ss(["BTC/USDT"]).filter(e => e.endsWith("/USDT"));
        o(t), U(t), V(t.slice(0, 30).map(e => ({ pair: e, change: +(12 * (Math.random() - .5)).toFixed(2), volume: +(150 * Math.random() + 10).toFixed(2), high: 81e3 + 1e3 * Math.random(), low: 79e3 + 1e3 * Math.random() })));
    } })(); }, []); const tr = (0, r.useCallback)(e => { const t = de.current; let n = t.direction; "up" === n ? t.streak >= t.targetGreenCount ? (n = "down", t.direction = "down", t.streak = 1) : t.streak += 1 : (n = "up", t.direction = "up", t.targetGreenCount = 2 + Math.floor(2 * Math.random()), t.streak = 1); const r = "up" === n ? 3e-4 + 45e-5 * Math.random() : 18e-5 + 32e-5 * Math.random(); oe(Number(("up" === n ? e * (1 + r) : e * (1 - r)).toFixed(2))), ce(n); }, []); (0, r.useEffect)(() => { if (!ne)
        return; const e = window.setInterval(() => tr(ne), 1e3); return () => window.clearInterval(e); }, [ne, tr]); const nr = async (e) => { if (!G || !J)
        return; const t = Number(G), n = Number(J); if (isNaN(t) || isNaN(n) || n <= 0)
        return; const r = ct ? Number(ct) : void 0, i = pt ? Number(pt) : void 0, a = { id: "u-".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 8)), pair: c, type: "stop-limit" === at ? "stop-loss" : at, side: e, price: t, amount: n, stopLoss: r, takeProfit: i, status: "market" === at ? "filled" : "open", createdAt: Math.floor(Date.now() / 1e3) }; Pt(e => [a, ...e.slice(0, 29)]), zt(r => [{ time: Math.floor(Date.now() / 1e3), price: t, quantity: n, side: e, pair: c, type: "market" === at ? "market" : "limit" }, ...r.slice(0, 39)]); const o = t * n; "buy" === e && At(e => m(m({}, e), {}, { available: Math.max(0, e.available - o) })); try {
        const a = await No();
        await a.post("/api/trade/place", { pair: c, amount: n, side: e, price: t, type: at, stopLoss: r, takeProfit: i, slippageTolerance: cn ? .01 : 0 });
    }
    catch (Rl) {
        console.error(Rl), At({ available: 0, locked: 0, holdings: [{ asset: "BTC", amount: 0, value: 0 }, { asset: "ETH", amount: 0, value: 0 }, { asset: "USDT", amount: 0, value: 0 }] });
    } Q(""), ee(""), dt(""), ht(""), sn(0), mt(0); }, rr = "up" === le, ir = Tt.holdings.reduce((e, t) => e + t.value, Tt.available + Tt.locked), ar = (null === (e = Tt.holdings.find(e => "BTC" === e.asset)) || void 0 === e ? void 0 : e.amount) || 0, or = Tt.available > 0 ? (Tt.available / (Number(G) || ne)).toFixed(4) : "0.0000", sr = (ar * (Number(G) || ne)).toFixed(2), lr = (0, r.useMemo)(() => { const e = Math.max(0, Tt.available - Tt.locked), t = ((Number(J) || 0) * (Number(G) || ne)).toFixed(2); return "cross" === pn ? [{ label: "Cross Balance", value: "$".concat(Tt.available.toFixed(2)) }, { label: "Cross Used Margin", value: "$".concat(Tt.locked.toFixed(2)) }, { label: "Available Margin", value: "$".concat(e.toFixed(2)) }] : "isolated" === pn ? [{ label: "Available USDT", value: "$".concat(Tt.available.toFixed(2)) }, { label: "Estimated Max BTC", value: "".concat(or, " BTC") }, { label: "Pair Exposure", value: "$".concat(t) }] : [{ label: "Available USDT", value: "$".concat(Tt.available.toFixed(2)) }, { label: "Locked USDT", value: "$".concat(Tt.locked.toFixed(2)) }, { label: "Total Portfolio", value: "$".concat(ir.toFixed(2)) }]; }, [pn, Tt.available, Tt.locked, J, G, ne, ir]), cr = "fav" === Wt ? [] : "USDT", dr = I.filter(e => "fav" === Wt || e.endsWith("/" + cr)).slice(0, 50); return (0, _i.jsxs)("div", { ref: Nn, className: "trading-page", style: { display: "flex", flexDirection: "column", height: "auto", background: $o.bg, color: $o.textBright, fontFamily: "'IBM Plex Sans', 'Helvetica Neue', sans-serif", fontSize: 13, overflowY: "auto", overflowX: "hidden", minHeight: "100dvh", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", touchAction: "pan-y", overscrollBehaviorY: "auto" }, children: [(0, _i.jsx)("div", { className: "trading-rotate-prompt", role: "status", "aria-live": "polite", children: (0, _i.jsxs)("div", { className: "trading-rotate-prompt__panel", children: [(0, _i.jsx)("div", { className: "trading-rotate-prompt__icon", children: "\u21bb" }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { className: "trading-rotate-prompt__title", children: "Rotate Device" }), (0, _i.jsx)("div", { className: "trading-rotate-prompt__text", children: "Landscape gives the trading chart and order entry room to breathe." })] })] }) }), (0, _i.jsxs)("div", { className: "trading-header", style: { display: "flex", alignItems: "center", height: 52, borderBottom: "1px solid ".concat($o.border), padding: "0 16px", gap: 24, background: $o.bgPanel, flexShrink: 0, overflow: "hidden", marginLeft: An && Tn ? 44 : 0, width: An && Tn ? "calc(100% - 44px - 280px)" : "100%" }, children: [(0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }, children: [(0, _i.jsx)("div", { style: { width: 28, height: 28, background: $o.amber, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#000" }, children: "\u20bf" }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: { fontWeight: 700, fontSize: 15, letterSpacing: .3 }, children: c }), (0, _i.jsx)("div", { style: { fontSize: 10, color: $o.text }, children: "Bitcoin Price \u2191" })] }), (0, _i.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 2, marginLeft: 8 }, children: [(0, _i.jsx)("div", { style: { fontWeight: 700, fontSize: 22, color: rr ? $o.green : $o.red }, children: ns(ae || ne) }), (0, _i.jsx)("div", { style: { fontSize: 10, color: $o.textMuted }, children: os(Ee) })] })] }), (0, _i.jsxs)("div", { style: { display: "flex", gap: 24, alignItems: "center", flex: 1, overflow: "hidden" }, children: [[{ label: "24h Chg", value: "".concat(fe.toFixed(2), "%"), color: rr ? $o.green : $o.red }, { label: "24h High", value: ns(xe), color: $o.textBright }, { label: "24h Low", value: ns(ve), color: $o.textBright }, { label: "24h Vol(BTC)", value: is(ke), color: $o.textBright }, { label: "24h Vol(USDT)", value: is(Ce), color: $o.textBright }, { label: "Networks", value: "BTC (5)", color: $o.textBright }].map(e => (0, _i.jsxs)("div", { style: { flexShrink: 0 }, children: [(0, _i.jsx)("div", { style: { fontSize: 10, color: $o.text, marginBottom: 2 }, children: e.label }), (0, _i.jsx)("div", { style: { fontSize: 12, color: e.color, fontWeight: e.color !== $o.textBright ? 700 : 400, fontFamily: "monospace" }, children: e.value })] }, e.label)), (0, _i.jsxs)("div", { style: { flexShrink: 0 }, children: [(0, _i.jsx)("div", { style: { fontSize: 10, color: $o.text, marginBottom: 2 }, children: "Token Tags" }), (0, _i.jsx)("div", { style: { display: "flex", gap: 4 }, children: ["POW", "Payments", "Vol", "Hot", "Price Protection"].map(e => (0, _i.jsx)("span", { style: { fontSize: 10, padding: "1px 5px", borderRadius: 2, background: $o.bgAlt, color: $o.text, border: "1px solid ".concat($o.border) }, children: e }, e)) })] })] }), (0, _i.jsxs)("div", { style: { flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }, children: [(0, _i.jsx)("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "live" === St ? $o.green : $o.red, display: "inline-block", boxShadow: "live" === St ? "0 0 6px ".concat($o.green) : "none" } }), (0, _i.jsx)("span", { style: { fontSize: 11, color: "live" === St ? $o.green : $o.red }, children: St.toUpperCase() })] })] }), (0, _i.jsxs)("div", { className: "trading-body", style: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }, children: [Tn && (0, _i.jsxs)("div", { className: "trading-toolbar", style: { width: 44, background: $o.bgPanel, borderRight: "1px solid ".concat($o.border), display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8, gap: 2, flexShrink: 0 }, children: [es.map(e => (0, _i.jsx)("button", { title: e.label, onClick: () => Kt(e.id), style: { width: 32, height: 32, background: qt === e.id ? $o.bgHover : "transparent", border: qt === e.id ? "1px solid ".concat($o.border) : "1px solid transparent", borderRadius: 4, color: qt === e.id ? $o.amber : $o.text, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }, onMouseEnter: t => { qt !== e.id && (t.currentTarget.style.background = $o.bgHover); }, onMouseLeave: t => { qt !== e.id && (t.currentTarget.style.background = "transparent"); }, children: e.icon }, e.id)), (0, _i.jsx)("div", { style: { width: 24, height: 1, background: $o.border, margin: "4px 0" } }), (0, _i.jsx)("div", { title: "Drawing color", style: { position: "relative" }, children: (0, _i.jsx)("input", { type: "color", value: Qt, onChange: e => Zt(e.target.value), style: { width: 28, height: 28, border: "2px solid ".concat($o.border), borderRadius: 4, cursor: "pointer", padding: 2, background: "none" } }) }), [1, 2, 3].map(e => (0, _i.jsx)("button", { title: "Line ".concat(e, "px"), onClick: () => tn(e), style: { width: 32, height: 20, background: en === e ? $o.bgHover : "transparent", border: en === e ? "1px solid ".concat($o.amber) : "1px solid transparent", borderRadius: 3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }, children: (0, _i.jsx)("div", { style: { width: 18, height: e, background: en === e ? $o.amber : $o.text, borderRadius: 1 } }) }, e)), (0, _i.jsx)("button", { title: "Clear all drawings", onClick: () => Xt([]), style: { width: 32, height: 32, background: "transparent", border: "1px solid transparent", borderRadius: 4, color: $o.red, fontSize: 13, cursor: "pointer", marginTop: 4 }, children: "\u2715" })] }), (0, _i.jsxs)("div", { className: "trading-main", style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }, children: [(0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", height: 38, borderBottom: "1px solid ".concat($o.border), background: $o.bgPanel, padding: "0 12px", gap: 0, flexShrink: 0 }, children: [[{ id: "chart", label: "Chart" }, { id: "trades", label: "Trades" }, { id: "info", label: "Info" }, { id: "tradingdata", label: "Trading Data" }].map(e => (0, _i.jsx)("button", { onClick: () => rt(e.id), style: { padding: "0 16px", height: "100%", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: nt === e.id ? $o.textBright : $o.text, borderBottom: nt === e.id ? "2px solid ".concat($o.amber) : "2px solid transparent", fontWeight: nt === e.id ? 600 : 400 }, children: e.label }, e.id)), (0, _i.jsxs)("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: $o.bgAlt, border: "1px solid ".concat($o.border) }, children: [(0, _i.jsx)("img", { src: Ui, alt: "SwanCore logo", style: { width: 32, height: 32, borderRadius: 4, objectFit: "contain", imageRendering: "auto", background: $o.bg, padding: 2 } }), (0, _i.jsxs)("div", { style: { display: "flex", flexDirection: "column", lineHeight: 1.1 }, children: [(0, _i.jsx)("span", { style: { color: $o.amber, fontSize: 14, fontWeight: 800 }, children: "SwanCore" }), (0, _i.jsx)("span", { style: { color: $o.textMuted, fontSize: 10 }, children: "Simplified Trading" })] })] })] }), Tn && (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", height: 34, borderBottom: "1px solid ".concat($o.border), background: $o.bgPanel, padding: "0 10px", gap: 2, flexShrink: 0, flexWrap: "nowrap", overflow: "visible" }, children: [(0, _i.jsx)("div", { style: { display: "flex", gap: 1 }, children: ["1s", "15m", "1H", "4H", "1D", "1W"].map(e => (0, _i.jsx)("button", { onClick: () => g(e), style: { padding: "3px 6px", background: f === e ? $o.bgHover : "transparent", border: f === e ? "1px solid ".concat($o.border) : "1px solid transparent", borderRadius: 3, color: f === e ? $o.amber : $o.text, cursor: "pointer", fontSize: 11, fontWeight: f === e ? 700 : 400, minWidth: "32px", textAlign: "center" }, children: e }, e)) }), (0, _i.jsxs)("div", { className: "time-dropdown", style: { position: "relative", marginLeft: 4, zIndex: 1e3 }, children: [(0, _i.jsxs)("button", { onClick: () => xn(!mn), style: { padding: "3px 6px", background: "transparent", border: "1px solid ".concat($o.border), borderRadius: 3, color: $o.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 2, zIndex: 1001, position: "relative" }, children: [(0, _i.jsx)("span", { children: "Time" }), (0, _i.jsx)("span", { style: { fontSize: 8 }, children: mn ? "\u25b2" : "\u25bc" })] }), mn && (0, _i.jsxs)("div", { style: { position: "absolute", top: "100%", left: 0, background: $o.bgPanel, border: "1px solid ".concat($o.border), borderRadius: 4, zIndex: 1002, minWidth: "120px", maxHeight: "200px", overflow: "auto" }, children: [(0, _i.jsx)("div", { style: { padding: "4px 8px", fontSize: 10, color: $o.textMuted, fontWeight: 700, borderBottom: "1px solid ".concat($o.borderLight) }, children: "Available" }), ["1m", "3m", "5m", "30m", "2H", "6H", "8H", "12H", "1M"].map(e => (0, _i.jsx)("button", { onClick: () => { g(e), xn(!1); }, style: { width: "100%", padding: "6px 8px", background: f === e ? $o.bgHover : "transparent", border: "none", color: f === e ? $o.amber : $o.text, cursor: "pointer", fontSize: 11, textAlign: "left", display: "block" }, children: e }, e))] })] }), (0, _i.jsx)("div", { style: { width: 1, height: 18, background: $o.border, margin: "0 6px" } }), [["\u2635", "candlestick"], ["\u223f", "line"], ["\u25ec", "area"], ["\u229f", "bar"]].map(e => { let t = u(e, 2), n = t[0], r = t[1]; return (0, _i.jsx)("button", { onClick: () => Qe(r), title: r, style: { width: 26, height: 26, background: Je === r ? $o.bgHover : "transparent", border: Je === r ? "1px solid ".concat($o.border) : "1px solid transparent", borderRadius: 3, color: Je === r ? $o.amber : $o.text, cursor: "pointer", fontSize: 14 }, children: n }, r); }), (0, _i.jsx)("div", { style: { width: 1, height: 18, background: $o.border, margin: "0 6px" } }), ["original", "tradingview", "depth"].map(e => (0, _i.jsx)("button", { onClick: () => et(e), style: { padding: "3px 8px", background: $e === e ? $o.bgHover : "transparent", border: $e === e ? "1px solid ".concat($o.border) : "1px solid transparent", borderRadius: 3, color: $e === e ? $o.amber : $o.text, cursor: "pointer", fontSize: 11, fontWeight: $e === e ? 700 : 400 }, children: "original" === e ? "Original" : "tradingview" === e ? "Trading View" : "Depth" }, e)), (0, _i.jsx)("div", { style: { width: 1, height: 18, background: $o.border, margin: "0 6px" } }), [{ k: "SMA", a: Le, s: Oe, c: $o.sma }, { k: "EMA", a: Be, s: De, c: $o.ema }, { k: "BB", a: _e, s: We, c: $o.bbUpper }, { k: "VWAP", a: Ge, s: Ye, c: $o.vwap }, { k: "RSI", a: Me, s: Ie, c: $o.amber }, { k: "MACD", a: Ve, s: qe, c: "#8b5cf6" }].map(e => (0, _i.jsx)("button", { onClick: () => e.s(e => !e), style: { padding: "2px 7px", borderRadius: 3, border: "1px solid ".concat(e.a ? e.c : $o.border), background: e.a ? "".concat(e.c, "22") : "transparent", color: e.a ? e.c : $o.text, cursor: "pointer", fontSize: 10, fontWeight: e.a ? 700 : 400 }, children: e.k }, e.k))] }), (0, _i.jsxs)("div", { className: "trading-chart-panel", style: { flex: 1, position: "relative", overflow: "hidden", minHeight: 300, background: $o.bg }, children: ["chart" === nt && (0, _i.jsx)("div", { className: "trading-chart-layout", style: { display: "flex", height: "100%" }, children: (0, _i.jsxs)("div", { className: "trading-chart-stage", style: { flex: 1, position: "relative", minWidth: 0 }, children: ["original" === $e && (0, _i.jsx)(fs, { candles: T, deepMarketData: P, indicators: Rn, chartType: Je, tf: f, pair: c, rsiData: Pn, macdData: Ln, showRSI: Me, showMACD: Ve, liveStatus: St, activeTool: qt, drawings: Yt, onDrawingsChange: Xt, drawingColor: Qt, drawingWidth: en }), "depth" === $e && (0, _i.jsx)("div", { style: { height: "100%", display: "flex", flexDirection: "column", padding: 16, gap: 16, background: $o.bgPanel, minHeight: 360 }, children: (0, _i.jsx)(gs, { buyLevels: Fn, sellLevels: Mn, depthLimit: wt }) }), "tradingview" === $e && (0, _i.jsx)("div", { style: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: $o.text }, children: (0, _i.jsxs)("div", { style: { textAlign: "center" }, children: [(0, _i.jsx)("div", { style: { fontSize: 48, marginBottom: 12 }, children: "\ud83d\udcc8" }), (0, _i.jsx)("div", { children: "TradingView chart widget" })] }) })] }) }), "trades" === nt && (0, _i.jsxs)("div", { style: { height: "100%", display: "flex", flexDirection: "column", background: $o.bgPanel, overflow: "hidden" }, children: [(0, _i.jsx)("div", { style: { padding: "10px 12px", borderBottom: "1px solid ".concat($o.border), display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }, children: (0, _i.jsx)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: (0, _i.jsx)("span", { style: { fontWeight: 700, fontSize: 13, color: $o.textBright }, children: "Trades" }) }) }), (0, _i.jsx)("div", { style: { flex: 1, overflow: "auto", padding: "10px 12px" }, children: k.slice(0, 50).map((e, t) => (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8, fontSize: 11, fontFamily: "monospace", color: "buy" === e.side ? $o.green : $o.red }, children: [(0, _i.jsx)("span", { children: ts(e.time) }), (0, _i.jsx)("span", { children: e.side.toUpperCase() }), (0, _i.jsx)("span", { style: { textAlign: "right" }, children: e.price.toFixed(2) }), (0, _i.jsx)("span", { style: { textAlign: "right" }, children: e.amount.toFixed(5) })] }, t)) })] }), "info" === nt && (0, _i.jsxs)("div", { style: { height: "100%", display: "flex", flexDirection: "column", background: $o.bgPanel, overflow: "hidden" }, children: [(0, _i.jsx)("div", { style: { padding: "10px 12px", borderBottom: "1px solid ".concat($o.border), display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }, children: (0, _i.jsx)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: (0, _i.jsx)("span", { style: { fontWeight: 700, fontSize: 13, color: $o.textBright }, children: "Info" }) }) }), (0, _i.jsx)("div", { style: { flex: 1, overflow: "auto", padding: "10px 12px" }, children: (0, _i.jsxs)("div", { style: { fontSize: 12, color: $o.text }, children: [(0, _i.jsx)("p", { children: "Bitcoin (BTC) is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries." }), (0, _i.jsx)("p", { children: "Market Cap: $1.2T | Volume: $50B | Circulating Supply: 19.7M BTC" })] }) })] }), "tradingdata" === nt && (0, _i.jsxs)("div", { style: { height: "100%", display: "flex", flexDirection: "column", background: $o.bgPanel, overflow: "hidden" }, children: [(0, _i.jsx)("div", { style: { padding: "10px 12px", borderBottom: "1px solid ".concat($o.border), display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }, children: (0, _i.jsx)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: (0, _i.jsx)("span", { style: { fontWeight: 700, fontSize: 13, color: $o.textBright }, children: "Trading Data" }) }) }), (0, _i.jsx)("div", { style: { flex: 1, overflow: "auto", padding: "10px 12px" }, children: (0, _i.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: Ot.slice(0, 6).map((e, t) => (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8, fontSize: 11 }, children: [(0, _i.jsx)("span", { children: e.pair }), (0, _i.jsx)("span", { style: { color: "buy" === e.side ? $o.green : $o.red }, children: e.side }), (0, _i.jsxs)("span", { style: { textAlign: "right" }, children: ["$", e.price.toFixed(2)] })] }, t)) }) })] })] }), Tn && (0, _i.jsx)("div", { className: "trading-order-form", style: { height: An ? "auto" : 210, minHeight: An ? 430 : void 0, borderTop: "1px solid ".concat($o.border), background: $o.bgPanel, display: "flex", flexShrink: 0, overflow: An ? "visible" : "hidden" }, children: (0, _i.jsxs)("div", { className: "trading-order-form__inner", style: { width: "100%", display: "flex", flexDirection: "column", minHeight: 0 }, children: [(0, _i.jsx)("div", { className: "trading-order-form__tabs", style: { display: "flex", alignItems: "center", height: 36, borderBottom: "1px solid ".concat($o.border), padding: "0 12px", gap: 0, flexShrink: 0 }, children: ["Spot", "Cross", "Isolated", "Grid"].map(e => (0, _i.jsx)("button", { onClick: () => hn(e.toLowerCase()), style: { padding: "0 14px", height: "100%", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: pn === e.toLowerCase() ? $o.textBright : $o.text, borderBottom: pn === e.toLowerCase() ? "2px solid ".concat($o.amber) : "2px solid transparent", fontWeight: pn === e.toLowerCase() ? 600 : 400 }, children: e }, e)) }), "grid" === pn ? (0, _i.jsx)("div", { style: { flex: 1, padding: "10px 12px" }, children: "Grid bot placeholder" }) : (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("div", { className: "trading-balance-strip", children: lr.map(e => (0, _i.jsxs)("div", { style: { padding: "10px", borderRadius: 10, background: $o.bg, border: "1px solid ".concat($o.border) }, children: [(0, _i.jsx)("div", { style: { fontSize: 10, color: $o.textMuted, marginBottom: 6 }, children: e.label }), (0, _i.jsx)("div", { style: { fontSize: 14, fontWeight: 700, color: $o.textBright, fontFamily: "monospace" }, children: e.value })] }, e.label)) }), (0, _i.jsxs)("div", { className: "trading-order-form__columns", style: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }, children: [(0, _i.jsxs)("div", { className: "trading-order-form__side trading-order-form__side--buy", style: { flex: 1, padding: "10px 16px", borderRight: "1px solid ".concat($o.border), display: "flex", flexDirection: "column", gap: 6 }, children: [(0, _i.jsxs)("div", { style: { display: "flex", gap: 12, marginBottom: 2 }, children: [["Limit", "Market", "Stop Limit", "OCO"].map(e => (0, _i.jsx)("button", { onClick: () => ot(e.toLowerCase().replace(" ", "-")), style: { background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: at === e.toLowerCase().replace(" ", "-") ? $o.textBright : $o.text, borderBottom: at === e.toLowerCase().replace(" ", "-") ? "2px solid ".concat($o.amber) : "2px solid transparent", paddingBottom: 2 }, children: e }, e)), (0, _i.jsx)("span", { style: { fontSize: 12, color: $o.text, marginLeft: 4, cursor: "pointer" }, children: "\u24d8" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 34 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 40 }, children: "Price" }), (0, _i.jsx)("input", { type: "number", value: G, onChange: e => Y(e.target.value), style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "market" === at ? "Market Price" : "0.00", disabled: "market" === at }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "USDT" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 34 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 50 }, children: "Amount" }), (0, _i.jsx)("input", { type: "number", value: J, onChange: e => { Q(e.target.value), ee(((Number(e.target.value) || 0) * (Number(G) || ne)).toFixed(2)); }, style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "Minimum 5 USDT" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "BTC \u25be" })] }), (0, _i.jsxs)("div", { style: { padding: "2px 0" }, children: [(0, _i.jsx)("input", { type: "range", min: 0, max: 100, value: gt, onChange: e => { const t = Number(e.target.value); mt(t), sn(t); const n = Tt.available * t / 100 / (Number(G) || ne); Q(n.toFixed(6)); }, style: { width: "100%", accentColor: $o.green } }), (0, _i.jsx)("div", { style: { display: "flex", justifyContent: "space-between" }, children: [0, 25, 50, 75, 100].map(e => (0, _i.jsxs)("button", { onClick: () => { mt(e); const t = Tt.available * e / 100 / (Number(G) || ne); Q(t.toFixed(6)); }, style: { background: "transparent", border: "none", fontSize: 10, color: $o.textMuted, cursor: "pointer", padding: 0 }, children: [e, "%"] }, e)) })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 32 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 40 }, children: "Total" }), (0, _i.jsx)("input", { type: "number", value: $, onChange: e => { ee(e.target.value), Q(((Number(e.target.value) || 0) / (Number(G) || ne)).toFixed(6)); }, style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "Minimum 5 USDT" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "USDT \u25be" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 32 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 50 }, children: "Stop Loss" }), (0, _i.jsx)("input", { type: "number", value: ct, onChange: e => dt(e.target.value), style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "Optional" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "USDT" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 32 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 50 }, children: "Take Profit" }), (0, _i.jsx)("input", { type: "number", value: pt, onChange: e => ht(e.target.value), style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "Optional" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "USDT" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [(0, _i.jsx)("input", { type: "checkbox", id: "slip-buy", checked: cn, onChange: e => dn(e.target.checked), style: { accentColor: $o.amber, width: 13, height: 13 } }), (0, _i.jsx)("label", { htmlFor: "slip-buy", style: { fontSize: 11, color: $o.text, cursor: "pointer" }, children: "Slippage Tolerance (1%)" })] })] }), (0, _i.jsxs)("div", { className: "trading-order-form__side trading-order-form__side--sell", style: { flex: 1, padding: "10px 16px", display: "flex", flexDirection: "column", gap: 6 }, children: [(0, _i.jsx)("div", { style: { display: "flex", gap: 12, marginBottom: 2 }, children: ["Limit", "Market", "Stop Limit", "OCO"].map(e => (0, _i.jsx)("button", { onClick: () => ot(e.toLowerCase().replace(" ", "-")), style: { background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: at === e.toLowerCase().replace(" ", "-") ? $o.textBright : $o.text, borderBottom: at === e.toLowerCase().replace(" ", "-") ? "2px solid ".concat($o.amber) : "2px solid transparent", paddingBottom: 2 }, children: e }, e)) }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 34 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 40 }, children: "Price" }), (0, _i.jsx)("input", { type: "number", value: G, onChange: e => Y(e.target.value), style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "Market Price", disabled: "market" === at }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "USDT" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 34 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 50 }, children: "Amount" }), (0, _i.jsx)("input", { type: "number", value: J, onChange: e => Q(e.target.value), style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "0.00" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "BTC \u25be" })] }), (0, _i.jsxs)("div", { style: { padding: "2px 0" }, children: [(0, _i.jsx)("input", { type: "range", min: 0, max: 100, value: gt, onChange: e => { const t = Number(e.target.value); mt(t); }, style: { width: "100%", accentColor: $o.red } }), (0, _i.jsx)("div", { style: { display: "flex", justifyContent: "space-between" }, children: [0, 25, 50, 75, 100].map(e => (0, _i.jsxs)("button", { onClick: () => mt(e), style: { background: "transparent", border: "none", fontSize: 10, color: $o.textMuted, cursor: "pointer", padding: 0 }, children: [e, "%"] }, e)) })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 32 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 40 }, children: "Total" }), (0, _i.jsx)("input", { type: "number", value: $, onChange: e => { ee(e.target.value), Q(((Number(e.target.value) || 0) / (Number(G) || ne)).toFixed(6)); }, style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "0.00" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "USDT \u25be" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 32 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 50 }, children: "Stop Loss" }), (0, _i.jsx)("input", { type: "number", value: ct, onChange: e => dt(e.target.value), style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "Optional" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "USDT" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", border: "1px solid ".concat($o.border), borderRadius: 4, background: $o.bgAlt, padding: "0 10px", height: 32 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, width: 50 }, children: "Take Profit" }), (0, _i.jsx)("input", { type: "number", value: pt, onChange: e => ht(e.target.value), style: { flex: 1, background: "transparent", border: "none", outline: "none", color: $o.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }, placeholder: "Optional" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: $o.textMuted, marginLeft: 8 }, children: "USDT" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [(0, _i.jsx)("input", { type: "checkbox", id: "slip-sell", checked: cn, onChange: e => dn(e.target.checked), style: { accentColor: $o.amber, width: 13, height: 13 } }), (0, _i.jsx)("label", { htmlFor: "slip-sell", style: { fontSize: 11, color: $o.text, cursor: "pointer" }, children: "Slippage Tolerance (1%)" })] })] })] }), (0, _i.jsxs)("div", { className: "trading-order-actions", style: { display: "flex", gap: 8, padding: "8px 16px", borderTop: "1px solid ".concat($o.border), flexShrink: 0 }, children: [(0, _i.jsxs)("div", { className: "trading-order-actions__balance", style: { flex: 1, display: "flex", flexDirection: "column", gap: 4 }, children: [(0, _i.jsx)("div", { style: { fontSize: 10, color: $o.textMuted }, children: "Available USDT" }), (0, _i.jsxs)("div", { style: { fontSize: 12, color: $o.textBright, fontFamily: "monospace" }, children: ["$", Tt.available.toFixed(2)] }), (0, _i.jsx)("div", { style: { fontSize: 10, color: $o.textMuted }, children: "Estimated Max Buy" }), (0, _i.jsxs)("div", { style: { fontSize: 12, color: $o.textBright, fontFamily: "monospace" }, children: [or, " BTC"] })] }), (0, _i.jsx)("button", { className: "trading-order-actions__button", onClick: () => nr("buy"), style: { flex: 1, height: 36, background: $o.green, border: "none", borderRadius: 4, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }, children: "Buy / Long" }), (0, _i.jsx)("button", { className: "trading-order-actions__button", onClick: () => nr("sell"), style: { flex: 1, height: 36, background: $o.red, border: "none", borderRadius: 4, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }, children: "Sell / Short" }), (0, _i.jsxs)("div", { className: "trading-order-actions__balance", style: { flex: 1, display: "flex", flexDirection: "column", gap: 4 }, children: [(0, _i.jsx)("div", { style: { fontSize: 10, color: $o.textMuted }, children: "Available BTC" }), (0, _i.jsxs)("div", { style: { fontSize: 12, color: $o.textBright, fontFamily: "monospace" }, children: [ar.toFixed(6), " BTC"] }), (0, _i.jsx)("div", { style: { fontSize: 10, color: $o.textMuted }, children: "Estimated Max Sell" }), (0, _i.jsxs)("div", { style: { fontSize: 12, color: $o.textBright, fontFamily: "monospace" }, children: ["$", sr] })] })] })] })] }) }), En && Tn && Jn("embedded"), (0, _i.jsxs)("div", { ref: Cn, className: "trading-bottom-panel", style: { borderTop: "1px solid ".concat($o.border), background: $o.bgPanel, flexShrink: 0 }, children: [(0, _i.jsx)("div", { style: { display: "flex", alignItems: "center", height: 36, padding: "0 12px", gap: 0, borderBottom: "1px solid ".concat($o.border) }, children: [["openorders", "Open Orders(0)"], ["orderhistory", "Order History"], ["tradehistory", "Trade History"], ["holdings", "Holdings"], ["bots", "Bots"]].map(e => { let t = u(e, 2), n = t[0], r = t[1]; return (0, _i.jsx)("button", { onClick: () => Ut(n), style: { padding: "0 14px", height: "100%", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: It === n ? $o.textBright : $o.text, borderBottom: It === n ? "2px solid ".concat($o.amber) : "2px solid transparent", whiteSpace: "nowrap" }, children: r }, n); }) }), (0, _i.jsxs)("div", { style: { maxHeight: 120, overflow: "auto" }, children: ["openorders" === It && (0 === qn.length ? (0, _i.jsx)("div", { style: { padding: 20, textAlign: "center", color: $o.textMuted, fontSize: 12 }, children: "No open orders" }) : qn.map(e => (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 80px", padding: "6px 14px", fontSize: 11, fontFamily: "monospace", borderBottom: "1px solid ".concat($o.border) }, children: [(0, _i.jsx)("span", { style: { color: $o.text }, children: new Date(1e3 * e.createdAt).toLocaleString() }), (0, _i.jsx)("span", { style: { color: $o.textBright }, children: e.pair }), (0, _i.jsxs)("span", { style: { color: "buy" === e.side ? $o.green : $o.red }, children: [e.type, " ", e.side.toUpperCase()] }), (0, _i.jsx)("span", { style: { color: $o.textBright }, children: e.price.toFixed(2) }), (0, _i.jsx)("span", { style: { color: $o.textBright }, children: e.amount.toFixed(4) }), (0, _i.jsx)("button", { onClick: () => (async (e) => { Pt(t => t.map(t => t.id === e ? m(m({}, t), {}, { status: "cancelled" }) : t)); try {
                                                            const t = await No();
                                                            await t.post("/api/trade/cancel", { orderId: e });
                                                        }
                                                        catch (Rl) {
                                                            console.error(Rl), Pt(t => t.map(t => t.id === e ? m(m({}, t), {}, { status: "open" }) : t));
                                                        } })(e.id), style: { background: "transparent", border: "1px solid ".concat($o.red), color: $o.red, borderRadius: 3, cursor: "pointer", fontSize: 10, padding: "2px 6px" }, children: "Cancel" })] }, e.id))), "tradehistory" === It && Ot.slice(0, 10).map((e, t) => (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "6px 14px", fontSize: 11, fontFamily: "monospace", borderBottom: "1px solid ".concat($o.border) }, children: [(0, _i.jsx)("span", { style: { color: $o.text }, children: new Date(1e3 * e.time).toLocaleString() }), (0, _i.jsx)("span", { style: { color: $o.textBright }, children: e.pair }), (0, _i.jsx)("span", { style: { color: "buy" === e.side ? $o.green : $o.red }, children: e.side.toUpperCase() }), (0, _i.jsx)("span", { style: { color: $o.textBright }, children: e.price.toFixed(2) }), (0, _i.jsx)("span", { style: { color: $o.textBright }, children: e.quantity.toFixed(6) })] }, t)), "holdings" === It && Tt.holdings.map(e => (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "6px 14px", fontSize: 11, fontFamily: "monospace", borderBottom: "1px solid ".concat($o.border) }, children: [(0, _i.jsx)("span", { style: { color: $o.textBright }, children: e.asset }), (0, _i.jsx)("span", { style: { color: $o.text }, children: e.amount.toFixed(6) }), (0, _i.jsxs)("span", { style: { color: $o.textBright }, children: ["$", e.value.toLocaleString()] })] }, e.asset))] })] })] }), An && (0, _i.jsxs)("aside", { className: "trading-right", style: { display: "flex", flexDirection: "column", flexShrink: 0, minHeight: 0, width: 280, background: $o.bgPanel, borderLeft: "1px solid ".concat($o.border) }, children: [Zn(), Jn("side"), $n(!1), Qn()] }), En && (0, _i.jsxs)("aside", { className: "trading-right trading-market-panel", style: { width: En ? 240 : "100%", background: $o.bgPanel, borderLeft: En ? "1px solid ".concat($o.border) : "none", borderTop: An ? "1px solid ".concat($o.border) : "none", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }, children: [Zn(), $n(!0)] })] }), rn && (0, _i.jsx)("div", { onClick: () => an(!1), style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center" }, children: (0, _i.jsxs)("div", { onClick: e => e.stopPropagation(), style: { width: 520, background: $o.bgPanel, border: "1px solid ".concat($o.border), borderRadius: 8, overflow: "hidden", maxHeight: "80vh", display: "flex", flexDirection: "column" }, children: [(0, _i.jsxs)("div", { style: { padding: "16px 20px", borderBottom: "1px solid ".concat($o.border), display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: { fontSize: 10, color: $o.text, marginBottom: 2 }, children: "Portfolio" }), (0, _i.jsx)("div", { style: { fontWeight: 700, fontSize: 18 }, children: "Portfolio Overview" })] }), (0, _i.jsx)("button", { onClick: () => an(!1), style: { background: "transparent", border: "none", color: $o.text, fontSize: 22, cursor: "pointer" }, children: "\xd7" })] }), (0, _i.jsxs)("div", { style: { padding: "14px 20px", borderBottom: "1px solid ".concat($o.border), display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: { fontSize: 11, color: $o.text }, children: "Total value" }), (0, _i.jsxs)("div", { style: { fontSize: 20, fontWeight: 700 }, children: ["$", ir.toLocaleString(void 0, { minimumFractionDigits: 2 }), " ", (0, _i.jsx)("span", { style: { fontSize: 12, color: $o.text }, children: "USD" })] })] }), (0, _i.jsx)("div", { style: { display: "flex", gap: 8 }, children: ["Withdraw", "Deposit", "Convert"].map(e => (0, _i.jsx)("button", { style: { padding: "6px 14px", borderRadius: 4, background: "Deposit" === e ? $o.amber : "transparent", border: "1px solid ".concat("Deposit" === e ? $o.amber : $o.border), color: "Deposit" === e ? "#000" : $o.textBright, cursor: "pointer", fontWeight: "Deposit" === e ? 700 : 400, fontSize: 12 }, children: e }, e)) })] }), (0, _i.jsxs)("div", { style: { overflow: "auto", flex: 1 }, children: [(0, _i.jsx)("div", { style: { padding: "10px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }, children: [{ label: "Available", value: "$".concat(Tt.available.toLocaleString(void 0, { minimumFractionDigits: 2 })) }, { label: "Locked", value: "$".concat(Tt.locked.toLocaleString(void 0, { minimumFractionDigits: 2 })) }, { label: "Realized P&L", value: "$0.00" }, { label: "Rewards earned", value: "$0.00 USD" }].map(e => (0, _i.jsxs)("div", { style: { background: $o.bgAlt, borderRadius: 6, padding: "10px 14px" }, children: [(0, _i.jsx)("div", { style: { fontSize: 11, color: $o.text }, children: e.label }), (0, _i.jsx)("div", { style: { fontSize: 15, fontWeight: 700, marginTop: 4 }, children: e.value })] }, e.label)) }), (0, _i.jsxs)("div", { style: { padding: "0 20px 14px" }, children: [(0, _i.jsx)("div", { style: { fontWeight: 600, marginBottom: 8, fontSize: 13 }, children: "Holdings" }), Tt.holdings.map(e => (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 0", borderBottom: "1px solid ".concat($o.border), fontSize: 12 }, children: [(0, _i.jsx)("span", { style: { fontWeight: 700 }, children: e.asset }), (0, _i.jsx)("span", { style: { color: $o.text, fontFamily: "monospace" }, children: e.amount.toFixed(6) }), (0, _i.jsxs)("span", { style: { textAlign: "right", fontFamily: "monospace", fontWeight: 600 }, children: ["$", e.value.toLocaleString()] })] }, e.asset))] }), (0, _i.jsxs)("div", { style: { padding: "0 20px 14px" }, children: [(0, _i.jsx)("div", { style: { fontWeight: 600, marginBottom: 8, fontSize: 13 }, children: "Trade History" }), Ot.slice(0, 8).map((e, t) => (0, _i.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "5px 0", borderBottom: "1px solid ".concat($o.border), fontSize: 11, fontFamily: "monospace" }, children: [(0, _i.jsx)("span", { style: { color: "buy" === e.side ? $o.green : $o.red }, children: e.side.toUpperCase() }), (0, _i.jsx)("span", { style: { color: $o.textBright }, children: e.pair }), (0, _i.jsx)("span", { style: { color: $o.text }, children: e.quantity.toFixed(6) }), (0, _i.jsxs)("span", { style: { textAlign: "right" }, children: ["$", e.price.toFixed(2)] })] }, t))] })] })] }) }), (0, _i.jsx)("style", { children: "\n        * { box-sizing: border-box; }\n        body { margin: 0; }\n        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }\n        input[type=range] { height: 3px; }\n        ::-webkit-scrollbar { width: 3px; height: 3px; }\n        ::-webkit-scrollbar-track { background: transparent; }\n        ::-webkit-scrollbar-thumb { background: #2a2e35; border-radius: 2px; }\n        ::-webkit-scrollbar-thumb:hover { background: #3a3e45; }\n        input:focus { outline: none; border-color: #f0b90b !important; }\n\n        .trading-header { flex-wrap: nowrap; gap: 12px; }\n        .trading-body { display: flex !important; align-items: stretch !important; }\n        .trading-toolbar,\n        .trading-orderbook,\n        .trading-right,\n        .trading-main { display: flex !important; }\n        .trading-toolbar { flex: 0 0 44px !important; width: 44px !important; min-width: 44px !important; flex-direction: column !important; align-items: center !important; justify-content: flex-start !important; padding-top: 8px !important; gap: 2px !important; order: 0 !important; }\n        .trading-main { flex: 1 1 auto !important; min-width: 0 !important; order: 1 !important; }\n        .trading-right { order: 2 !important; }\n        .trading-right > * { order: 0 !important; }\n        .trading-chart-stage,\n        .trading-chart-stage canvas { touch-action: pan-y; }\n        .trading-balance-strip {\n          display: grid;\n          grid-template-columns: repeat(3, minmax(0, 1fr));\n          gap: 8px;\n          padding: 8px 12px;\n          border-bottom: 1px solid #2a2e35;\n          flex-shrink: 0;\n        }\n        .trading-orderbook--embedded { display: none !important; }\n        .trading-rotate-prompt {\n          display: none;\n          position: fixed;\n          inset: 0;\n          z-index: 4000;\n          align-items: center;\n          justify-content: center;\n          padding: 24px;\n          background: rgba(11, 14, 17, 0.88);\n          backdrop-filter: blur(8px);\n        }\n        .trading-rotate-prompt__panel {\n          display: flex;\n          align-items: center;\n          gap: 14px;\n          max-width: 360px;\n          padding: 18px;\n          border: 1px solid #2a2e35;\n          border-radius: 8px;\n          background: #161a1e;\n          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);\n        }\n        .trading-rotate-prompt__icon {\n          width: 42px;\n          height: 42px;\n          border-radius: 50%;\n          display: grid;\n          place-items: center;\n          background: rgba(240, 185, 11, 0.12);\n          color: #f0b90b;\n          font-size: 24px;\n          flex: 0 0 auto;\n        }\n        .trading-rotate-prompt__title {\n          color: #eaecef;\n          font-size: 15px;\n          font-weight: 800;\n          margin-bottom: 4px;\n        }\n        .trading-rotate-prompt__text {\n          color: #848e9c;\n          font-size: 12px;\n          line-height: 1.4;\n        }\n\n        @media (min-width: 1024px) {\n          .trading-page { height: auto !important; min-height: 100dvh !important; overflow-y: auto !important; }\n          .trading-body { flex: 1 1 auto !important; flex-wrap: nowrap !important; gap: 0 !important; min-height: 0 !important; overflow: visible !important; }\n          .trading-toolbar { flex: 0 0 44px !important; width: 44px !important; }\n          .trading-main { width: auto !important; min-height: 0 !important; overflow: visible !important; }\n          .trading-chart-panel { flex: 0 0 clamp(300px, 44dvh, 520px) !important; min-height: 300px !important; overflow: hidden !important; }\n          .trading-chart-layout,\n          .trading-chart-stage { height: 100% !important; min-height: 0 !important; }\n          .trading-order-form {\n            height: auto !important;\n            min-height: 430px !important;\n            overflow: visible !important;\n          }\n          .trading-order-form__inner {\n            min-height: 0 !important;\n            overflow: visible !important;\n          }\n          .trading-order-form__columns {\n            flex: 0 0 auto !important;\n            min-height: 0 !important;\n            overflow: visible !important;\n          }\n          .trading-order-form__side {\n            flex: 1 1 0 !important;\n            min-height: 280px !important;\n            overflow: visible !important;\n          }\n          .trading-order-actions {\n            flex: 0 0 auto !important;\n          }\n          .trading-orderbook--side {\n            flex: 0 0 280px !important;\n            width: 280px !important;\n            max-width: 280px !important;\n            min-height: 0 !important;\n            height: auto !important;\n            order: 2 !important;\n            align-self: stretch !important;\n          }\n          .trading-orderbook--embedded { display: none !important; }\n          .trading-bottom-panel { max-height: 160px; overflow: hidden; }\n        }\n\n        @media (min-width: 1024px) and (max-width: 1439px) {\n          .trading-orderbook--side {\n            flex-basis: 248px !important;\n            width: 248px !important;\n            max-width: 248px !important;\n          }\n          .trading-balance-strip { grid-template-columns: repeat(3, minmax(110px, 1fr)); }\n        }\n\n        @media (max-width: 1023px) {\n          html, body, #root { height: auto !important; min-height: 100%; overflow-y: auto !important; }\n          body { overflow: auto !important; }\n          .trading-page {\n            height: auto !important;\n            min-height: 100svh !important;\n            overflow-y: visible !important;\n            -webkit-overflow-scrolling: touch;\n            overscroll-behavior-y: auto;\n            touch-action: pan-y;\n          }\n          .trading-header { flex-wrap: wrap !important; height: auto !important; min-height: 56px !important; padding: 6px 10px !important; gap: 8px !important; overflow: visible !important; }\n          .trading-body {\n            flex-direction: column !important;\n            flex-wrap: nowrap !important;\n            gap: 0 !important;\n            min-height: auto !important;\n            overflow: visible !important;\n            align-items: stretch !important;\n          }\n          .trading-toolbar,\n          .trading-orderbook--side { display: none !important; }\n          .trading-main {\n            flex: 0 0 auto !important;\n            width: 100% !important;\n            min-height: 0 !important;\n            overflow: visible !important;\n            order: 1 !important;\n          }\n          .trading-chart-panel {\n            flex: 0 0 auto !important;\n            min-height: 0 !important;\n            height: auto !important;\n            overflow: visible !important;\n          }\n          .trading-chart-layout { display: block !important; height: auto !important; }\n          .trading-chart-stage {\n            height: clamp(260px, 38dvh, 420px) !important;\n            min-height: 260px !important;\n            width: 100% !important;\n            border-bottom: 1px solid #2a2e35;\n            touch-action: pan-y !important;\n          }\n          .trading-chart-stage canvas {\n            touch-action: pan-y !important;\n          }\n          .trading-order-form {\n            height: auto !important;\n            min-height: 0 !important;\n            overflow: visible !important;\n          }\n          .trading-order-form__inner { min-height: 0 !important; overflow: visible !important; }\n          .trading-balance-strip {\n            grid-template-columns: repeat(3, minmax(126px, 1fr));\n            overflow-x: auto;\n            padding: 8px;\n            -webkit-overflow-scrolling: touch;\n          }\n          .trading-order-form__columns { overflow: visible !important; min-height: 0 !important; }\n          .trading-bottom-panel { order: 4 !important; overflow: visible !important; }\n          .trading-bottom-panel > div:last-child { max-height: none !important; overflow: visible !important; }\n          .trading-orderbook--embedded {\n            display: flex !important;\n            flex: 0 0 auto !important;\n            width: 100% !important;\n            max-width: 100% !important;\n            min-height: 360px !important;\n            height: 360px !important;\n            order: 3 !important;\n            border-left: none !important;\n            border-top: 1px solid #2a2e35 !important;\n          }\n          .trading-market-panel {\n            display: flex !important;\n            width: 100% !important;\n            max-width: 100% !important;\n            min-height: 420px !important;\n            height: auto !important;\n            order: 5 !important;\n            border-left: none !important;\n            border-top: 1px solid #2a2e35 !important;\n          }\n        }\n\n        @media (max-width: 767px) {\n          .trading-header > div:nth-child(2) { width: 100%; overflow-x: auto !important; padding-bottom: 2px; }\n          .trading-header > div:nth-child(2) > div:nth-child(n+5) { display: none !important; }\n          .trading-chart-stage { height: 240px !important; min-height: 240px !important; }\n          .trading-order-form { height: auto !important; min-height: 0 !important; }\n          .trading-order-form__columns { flex-direction: column !important; }\n          .trading-order-form__side {\n            flex: 0 0 auto !important;\n            min-height: 0 !important;\n            padding: 8px 10px !important;\n          }\n          .trading-order-form__side--buy {\n            border-right: none !important;\n            border-bottom: 1px solid #2a2e35 !important;\n          }\n          .trading-order-actions {\n            flex-wrap: wrap !important;\n            padding: 8px 10px !important;\n          }\n          .trading-order-actions__balance { display: none !important; }\n          .trading-order-actions__button {\n            flex: 1 1 calc(50% - 4px) !important;\n            min-width: 120px !important;\n          }\n          .trading-orderbook--embedded { height: 340px !important; min-height: 340px !important; }\n          .trading-bottom-panel > div:first-child { overflow-x: auto; }\n        }\n\n        @media (max-width: 479px) {\n          .trading-header { min-height: 62px !important; }\n          .trading-header button,\n          .trading-header span,\n          .trading-header div { max-width: 100%; }\n          .trading-chart-stage { height: 220px !important; min-height: 220px !important; }\n          .trading-order-form { height: auto !important; min-height: 0 !important; }\n          .trading-order-form__tabs { overflow-x: auto !important; }\n          .trading-order-form__tabs button { padding: 0 10px !important; white-space: nowrap; }\n          .trading-balance-strip { display: none !important; }\n          .trading-order-form__side { min-height: 0 !important; }\n          .trading-order-actions__button { min-width: 0 !important; height: 38px !important; }\n          .trading-orderbook--embedded { height: 320px !important; min-height: 320px !important; }\n        }\n\n        @media (max-width: 1023px) and (orientation: portrait) and (pointer: coarse) {\n          .trading-rotate-prompt { display: none; }\n        }\n\n        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n      " })] }); }
    const xs = "swancore_kyc_state", bs = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Singapore", "India", "Brazil", "Mexico"], ys = { status: "not-started", currentStep: 1, personal: { fullName: "", dob: "", country: "", address: "", city: "" }, documentType: "passport", documentFront: null, documentBack: null, selfie: null, rejectionReason: "", submittedAt: null, approvedAt: null }, vs = [{ id: 1, label: "Personal Information" }, { id: 2, label: "Identity Document" }, { id: 3, label: "Face Verification" }, { id: 4, label: "Review & Approval" }], ws = { "not-started": { label: "Not Started", color: "#9CA3AF", background: "rgba(156,163,175,0.12)" }, pending: { label: "Pending", color: "#F59E0B", background: "rgba(245,158,11,0.12)" }, verified: { label: "Verified", color: "#10B981", background: "rgba(16,185,129,0.12)" }, rejected: { label: "Rejected", color: "#EF4444", background: "rgba(239,68,68,0.12)" } };
    const js = { page: { minHeight: "100vh", background: "radial-gradient(circle at top, rgba(240,185,11,0.1), transparent 28%), #01050f", color: "#e2e8f0", padding: "24px", fontFamily: "Inter, system-ui, sans-serif" }, container: { maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }, headerPane: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }, title: { fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 6 }, subtitle: { fontSize: 14, color: "#cbd5e1", maxWidth: 520, lineHeight: 1.6 }, benefitsBar: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }, benefitCard: { display: "flex", alignItems: "center", minHeight: 72, padding: "16px", borderRadius: 18, background: "rgba(255,255,255,0.95)", color: "#111827", boxShadow: "0 20px 60px rgba(15,23,42,0.12)", fontWeight: 600 }, mainGrid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 18 }, sidebarCard: { padding: 24, borderRadius: 24, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(148,163,184,0.16)", backdropFilter: "blur(20px)" }, sidebarNote: { marginTop: 18, color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }, stepperLabel: { color: "#f8fafc", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }, stepper: { display: "flex", flexDirection: "column", gap: 12 }, stepNumber: { width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center", color: "#fff", background: "rgba(240,185,11,0.22)", fontWeight: 700 }, stepName: { fontSize: 14, color: "#e2e8f0" }, bodyCard: { display: "flex", flexDirection: "column", gap: 18, padding: 26, borderRadius: 24, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(148,163,184,0.14)", backdropFilter: "blur(20px)" }, stepCard: { display: "flex", flexDirection: "column", gap: 18 }, sectionTitle: { fontSize: 18, fontWeight: 700, color: "#fff" }, sectionCopy: { color: "#cbd5e1", fontSize: 14, lineHeight: 1.8 }, formGrid: { display: "grid", gap: 16 }, inputLabel: { display: "grid", gap: 8, fontSize: 13, color: "#cbd5e1" }, input: { width: "100%", minHeight: 48, borderRadius: 14, border: "1px solid rgba(148,163,184,0.24)", background: "rgba(255,255,255,0.92)", padding: "0 14px", color: "#111827", fontSize: 14, outline: "none" }, docSelector: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }, docTypeButton: { height: 54, borderRadius: 16, border: "1px solid rgba(148,163,184,0.24)", cursor: "pointer", fontSize: 13, fontWeight: 600 }, uploadGrid: { display: "grid", gap: 16 }, uploadCard: { display: "flex", flexDirection: "column", gap: 12, padding: 18, borderRadius: 20, border: "1px solid rgba(148,163,184,0.16)", background: "rgba(255,255,255,0.92)" }, uploadTitle: { fontSize: 13, fontWeight: 700, color: "#0f172a" }, dropZone: { minHeight: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 18, border: "2px dashed rgba(148,163,184,0.32)", background: "#f8fafc", cursor: "pointer", position: "relative", overflow: "hidden" }, dropLabel: { fontSize: 14, fontWeight: 700, color: "#0f172a" }, dropNote: { fontSize: 12, color: "#475569" }, fileInput: { position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }, uploadPreview: { width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 14, background: "#e2e8f0" }, uploadMeta: { fontSize: 13, color: "#0f172a", textAlign: "center" }, removeButton: { marginTop: 8, padding: "10px 14px", borderRadius: 14, border: "1px solid rgba(15,23,42,0.12)", background: "#fff", color: "#0f172a", cursor: "pointer", fontWeight: 700 }, actionBar: { marginTop: 12, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }, primaryButton: { minWidth: 180, borderRadius: 16, border: "none", background: "#f0b90b", color: "#0f172a", padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer" }, secondaryButton: { minWidth: 140, borderRadius: 16, border: "1px solid rgba(148,163,184,0.24)", background: "rgba(255,255,255,0.08)", color: "#e2e8f0", padding: "14px 24px", fontSize: 15, cursor: "pointer" }, linkButton: { border: "none", background: "transparent", color: "#f0b90b", textDecoration: "underline", cursor: "pointer", fontSize: 13, fontWeight: 700 }, summaryList: { display: "grid", gap: 14 }, summaryItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderRadius: 18, border: "1px solid rgba(148,163,184,0.16)", background: "rgba(255,255,255,0.94)" }, summaryLabel: { fontSize: 12, color: "#64748b", marginBottom: 4 }, successCard: { padding: 24, borderRadius: 24, background: "rgba(255,255,255,0.96)", color: "#111827", textAlign: "center" }, statusRow: { display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18, color: "#475569" }, hintText: { color: "#64748b", fontSize: 13, lineHeight: 1.7 }, validationWarning: { padding: "12px 14px", borderRadius: 16, background: "rgba(248,113,113,0.12)", color: "#b91c1c", fontSize: 13 }, limitsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }, limitCard: { padding: "18px 16px", borderRadius: 18, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(148,163,184,0.16)", backdropFilter: "blur(20px)" } }, ks = { stepItem: (e, t, n) => ({ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, border: n ? "1px solid rgba(16,185,129,0.16)" : "1px solid rgba(148,163,184,0.18)", background: e === t ? "rgba(240,185,11,0.12)" : "rgba(255,255,255,0.04)" }), statusDot: e => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 84, borderRadius: 999, padding: "6px 12px", background: ws[e].background, color: ws[e].color, fontSize: 12, fontWeight: 700 }) }, Ss = function () { const e = kt(), t = u((0, r.useState)(ys), 2), n = t[0], i = t[1], a = u((0, r.useState)(""), 2), o = a[0], s = a[1], l = u((0, r.useState)(!1), 2), c = l[0], d = l[1], p = u((0, r.useState)(null), 2), h = p[0], f = p[1], g = u((0, r.useState)(!0), 2), x = (g[0], g[1]); (0, r.useEffect)(() => { (async () => { try {
        const i = await fetch("".concat("http://localhost:5000", "/api/profile"), { headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")) } }), a = await i.json();
        var e, t, n, r;
        a.success && f({ kycVerified: (null === (e = a.user) || void 0 === e ? void 0 : e.kycVerified) || !1, kycStatus: (null === (t = a.user) || void 0 === t ? void 0 : t.kycStatus) || "pending", email: null === (n = a.user) || void 0 === n ? void 0 : n.email, name: null === (r = a.user) || void 0 === r ? void 0 : r.name });
    }
    catch (Rl) {
        console.log("Error fetching user profile:", Rl);
    }
    finally {
        x(!1);
    } })(); try {
        const e = localStorage.getItem(xs);
        e && i(JSON.parse(e));
    }
    catch (e) { } }, []), (0, r.useEffect)(() => { localStorage.setItem(xs, JSON.stringify(n)); }, [n]); const b = ws[n.status], y = (0, r.useMemo)(() => { const e = n.personal, t = e.fullName, r = e.dob, i = e.country, a = e.address, o = e.city; return Boolean(t.trim().length > 2 && r && i && a.trim().length > 5 && o.trim().length > 2); }, [n.personal]), v = (0, r.useMemo)(() => { const e = n.personal, t = e.address, r = e.city; return !(!t || !r) && !t.toLowerCase().includes(r.toLowerCase()); }, [n.personal]), w = Boolean(n.documentFront && n.documentBack), j = Boolean(n.selfie), k = e => 1 === e ? y : 2 === e ? w : 3 !== e || j, S = (e, t) => { i(n => m(m({}, n), {}, { personal: m(m({}, n.personal), {}, { [e]: t }) })); }, N = async (e, t) => { s(""); if (!["image/jpeg", "image/png"].includes(t.type))
        return void s("Only JPG and PNG images are supported."); if (t.size > 5242880)
        return void s("File too large. Max size is 5MB."); const n = await function (e) { return new Promise((t, n) => { const r = new FileReader; r.onload = () => t(r.result), r.onerror = n, r.readAsDataURL(e); }); }(t); i(r => m(m({}, r), {}, { [e]: { name: t.name, type: t.type, size: t.size, preview: n } })); }, C = async (e, t) => { var n; t.preventDefault(); const r = null === (n = t.dataTransfer.files) || void 0 === n ? void 0 : n[0]; r && await N(e, r); }, T = e => { i(t => m(m({}, t), {}, { [e]: null })); }, A = e => e ? { name: e.name, type: e.type, size: e.size, data: e.preview } : null, E = e => 1 === e ? y : 2 === e ? w : 3 === e ? j : 4 === e && (w && j && y); return (0, _i.jsx)("div", { style: js.page, children: (0, _i.jsxs)("div", { style: js.container, children: [(0, _i.jsxs)("div", { style: js.headerPane, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: js.title, children: "Identity Verification" }), (0, _i.jsx)("div", { style: js.subtitle, children: "Verify your identity to unlock deposits, withdrawals, and trading." }), h && (0, _i.jsxs)("div", { style: { marginTop: 12, fontSize: 13, color: "#cbd5e1" }, children: [h.name && (0, _i.jsxs)("div", { children: ["Welcome, ", (0, _i.jsx)("strong", { children: h.name })] }), h.email && (0, _i.jsx)("div", { style: { marginTop: 4, color: "#94a3b8" }, children: h.email })] })] }), (0, _i.jsxs)("div", { style: { display: "flex", gap: 12, flexDirection: "column", alignItems: "flex-end" }, children: [(0, _i.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [null !== h && void 0 !== h && h.kycVerified ? (0, _i.jsx)("span", { style: { padding: "8px 12px", borderRadius: 12, background: "rgba(16,185,129,0.12)", color: "#10B981", fontSize: 12, fontWeight: 700 }, children: "\u2713 Verified" }) : (0, _i.jsx)("span", { style: { padding: "8px 12px", borderRadius: 12, background: "rgba(239,68,68,0.12)", color: "#EF4444", fontSize: 12, fontWeight: 700 }, children: "\u26a0 Unverified" }), (0, _i.jsx)("span", { style: { padding: "8px 12px", borderRadius: 12, background: "rgba(240,185,11,0.12)", color: "#F0B90B", fontSize: 12, fontWeight: 700 }, children: "New" })] }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [(0, _i.jsx)("div", { style: { padding: "10px 14px", borderRadius: 16, background: b.background, color: b.color, fontWeight: 700, fontSize: 12 }, children: b.label }), (0, _i.jsx)("button", { onClick: () => e("/"), style: js.linkButton, children: "Back to dashboard" })] })] })] }), (0, _i.jsx)("div", { style: js.benefitsBar, children: ["Enable Trading", "Increase Withdrawal Limits", "Improve Account Security", "Unlock Full Platform Access"].map(e => (0, _i.jsxs)("div", { style: js.benefitCard, children: [(0, _i.jsx)("span", { style: { marginRight: 8, fontSize: 16 }, children: "\u2714" }), (0, _i.jsx)("span", { children: e })] }, e)) }), (0, _i.jsx)("div", { style: js.limitsGrid, children: [{ label: "Daily withdrawal", value: null !== h && void 0 !== h && h.kycVerified ? "Unlimited" : "0 USDT", sub: null !== h && void 0 !== h && h.kycVerified ? "Verified account" : "Verify to unlock" }, { label: "Trading limit", value: null !== h && void 0 !== h && h.kycVerified ? "Unlimited" : "Locked", sub: null !== h && void 0 !== h && h.kycVerified ? "Full access" : "KYC required" }, { label: "Account status", value: null !== h && void 0 !== h && h.kycVerified ? "Active" : "Pending", sub: null !== h && void 0 !== h && h.kycVerified ? "All features available" : "Complete verification" }, { label: "Verification status", value: null !== h && void 0 !== h && h.kycStatus ? h.kycStatus.charAt(0).toUpperCase() + h.kycStatus.slice(1) : "Pending", sub: "Identity document verification" }].map((e, t) => (0, _i.jsxs)("div", { style: js.limitCard, children: [(0, _i.jsx)("div", { style: { fontSize: 12, color: "#94a3b8", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }, children: e.label }), (0, _i.jsx)("div", { style: { fontSize: 20, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }, children: e.value }), (0, _i.jsx)("div", { style: { fontSize: 12, color: "#64748b" }, children: e.sub })] }, t)) }), (0, _i.jsxs)("div", { style: js.mainGrid, children: [(0, _i.jsxs)("div", { style: js.sidebarCard, children: [(0, _i.jsx)("div", { style: js.stepperLabel, children: "Progress" }), (0, _i.jsx)("div", { style: js.stepper, children: vs.map(e => (0, _i.jsxs)("div", { style: ks.stepItem(n.currentStep, e.id, E(e.id)), children: [(0, _i.jsx)("div", { style: js.stepNumber, children: e.id }), (0, _i.jsx)("div", { children: (0, _i.jsx)("div", { style: js.stepName, children: e.label }) })] }, e.id)) }), (0, _i.jsx)("div", { style: js.sidebarNote, children: "Your progress is saved automatically." })] }), (0, _i.jsxs)("div", { style: js.bodyCard, children: [(() => { switch (n.currentStep) {
                                    case 1: return (0, _i.jsxs)("div", { style: js.stepCard, children: [(0, _i.jsx)("div", { style: js.sectionTitle, children: "Personal details" }), (0, _i.jsxs)("div", { style: js.formGrid, children: [(0, _i.jsxs)("label", { style: js.inputLabel, children: ["Full Name", (0, _i.jsx)("input", { value: n.personal.fullName, onChange: e => S("fullName", e.target.value), placeholder: "Jane Doe", style: js.input })] }), (0, _i.jsxs)("label", { style: js.inputLabel, children: ["Date of Birth", (0, _i.jsx)("input", { type: "date", value: n.personal.dob, onChange: e => S("dob", e.target.value), style: js.input })] }), (0, _i.jsxs)("label", { style: js.inputLabel, children: ["Country", (0, _i.jsxs)("select", { value: n.personal.country, onChange: e => S("country", e.target.value), style: js.input, children: [(0, _i.jsx)("option", { value: "", children: "Select your country" }), bs.map(e => (0, _i.jsx)("option", { value: e, children: e }, e))] })] }), (0, _i.jsxs)("label", { style: js.inputLabel, children: ["Address", (0, _i.jsx)("input", { value: n.personal.address, onChange: e => S("address", e.target.value), placeholder: "123 Market Street", style: js.input })] }), (0, _i.jsxs)("label", { style: js.inputLabel, children: ["City", (0, _i.jsx)("input", { value: n.personal.city, onChange: e => S("city", e.target.value), placeholder: "New York", style: js.input })] })] }), (0, _i.jsx)("div", { style: js.hintText, children: "Keep your address and city accurate so your verification can process smoothly." }), v && (0, _i.jsx)("div", { style: js.validationWarning, children: "Address and city do not seem to match. Please double-check your entries." })] });
                                    case 2: return (0, _i.jsxs)("div", { style: js.stepCard, children: [(0, _i.jsx)("div", { style: js.sectionTitle, children: "Upload your identity document" }), (0, _i.jsx)("div", { style: js.docSelector, children: [{ key: "passport", label: "Passport" }, { key: "national_id", label: "National ID" }, { key: "driver_license", label: "Driver License" }].map(e => (0, _i.jsx)("button", { onClick: () => { return t = e.key, void i(e => m(m({}, e), {}, { documentType: t })); var t; }, style: m(m({}, js.docTypeButton), {}, { borderColor: n.documentType === e.key ? "#f0b90b" : "rgba(148,163,184,0.24)", color: n.documentType === e.key ? "#111827" : "#cbd5e1", background: n.documentType === e.key ? "rgba(240,185,11,0.16)" : "transparent" }), children: e.label }, e.key)) }), (0, _i.jsx)("div", { style: js.uploadGrid, children: ["documentFront", "documentBack"].map(e => { const t = n[e]; return (0, _i.jsxs)("div", { style: js.uploadCard, children: [(0, _i.jsx)("div", { style: js.uploadTitle, children: "documentFront" === e ? "Front Side" : "Back Side" }), (0, _i.jsxs)("div", { style: js.dropZone, onDrop: t => C(e, t), onDragOver: e => e.preventDefault(), children: [t ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("img", { src: t.preview, alt: t.name, style: js.uploadPreview }), (0, _i.jsx)("div", { style: js.uploadMeta, children: t.name }), (0, _i.jsx)("button", { onClick: () => T(e), style: js.removeButton, children: "Remove" })] }) : (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("span", { style: { fontSize: 32 }, children: "\ud83d\udce4" }), (0, _i.jsx)("div", { style: js.dropLabel, children: "Drag & drop or click to upload" }), (0, _i.jsx)("div", { style: js.dropNote, children: "JPG, PNG \u2022 Max 5MB" })] }), (0, _i.jsx)("input", { type: "file", accept: "image/png,image/jpeg", onChange: async (t) => { var n; const r = null === (n = t.target.files) || void 0 === n ? void 0 : n[0]; r && await N(e, r); }, style: js.fileInput })] })] }, e); }) }), (0, _i.jsx)("div", { style: js.hintText, children: "Your document should be sharp, fully visible, and unobstructed." }), o && (0, _i.jsx)("div", { style: js.validationWarning, children: o })] });
                                    case 3: return (0, _i.jsxs)("div", { style: js.stepCard, children: [(0, _i.jsx)("div", { style: js.sectionTitle, children: "Face verification" }), (0, _i.jsx)("div", { style: js.sectionCopy, children: "Upload a clear selfie photo so we can match your face to the document." }), (0, _i.jsxs)("div", { style: js.uploadCard, children: [(0, _i.jsx)("div", { style: js.uploadTitle, children: "Selfie photo" }), (0, _i.jsxs)("div", { style: js.dropZone, onDrop: e => C("selfie", e), onDragOver: e => e.preventDefault(), children: [n.selfie ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("img", { src: n.selfie.preview, alt: n.selfie.name, style: js.uploadPreview }), (0, _i.jsx)("div", { style: js.uploadMeta, children: n.selfie.name }), (0, _i.jsx)("button", { onClick: () => T("selfie"), style: js.removeButton, children: "Retake" })] }) : (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("span", { style: { fontSize: 32 }, children: "\ud83e\udd33" }), (0, _i.jsx)("div", { style: js.dropLabel, children: "Drag & drop or click to upload" }), (0, _i.jsx)("div", { style: js.dropNote, children: "Front camera or gallery image" })] }), (0, _i.jsx)("input", { type: "file", accept: "image/png,image/jpeg", onChange: async (e) => { var t; const n = null === (t = e.target.files) || void 0 === t ? void 0 : t[0]; n && await N("selfie", n); }, style: js.fileInput })] })] }), o && (0, _i.jsx)("div", { style: js.validationWarning, children: o })] });
                                    case 4: return (0, _i.jsxs)("div", { style: js.stepCard, children: [(0, _i.jsx)("div", { style: js.sectionTitle, children: "Review & submit" }), (0, _i.jsxs)("div", { style: js.summaryList, children: [(0, _i.jsxs)("div", { style: js.summaryItem, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: js.summaryLabel, children: "Full Name" }), (0, _i.jsx)("div", { children: n.personal.fullName || "\u2014" })] }), (0, _i.jsx)("button", { onClick: () => i(e => m(m({}, e), {}, { currentStep: 1 })), style: js.linkButton, children: "Edit" })] }), (0, _i.jsxs)("div", { style: js.summaryItem, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: js.summaryLabel, children: "Country" }), (0, _i.jsx)("div", { children: n.personal.country || "\u2014" })] }), (0, _i.jsx)("button", { onClick: () => i(e => m(m({}, e), {}, { currentStep: 1 })), style: js.linkButton, children: "Edit" })] }), (0, _i.jsxs)("div", { style: js.summaryItem, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: js.summaryLabel, children: "Document type" }), (0, _i.jsx)("div", { children: n.documentType.replace("_", " ") })] }), (0, _i.jsx)("button", { onClick: () => i(e => m(m({}, e), {}, { currentStep: 2 })), style: js.linkButton, children: "Edit" })] }), (0, _i.jsxs)("div", { style: js.summaryItem, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: js.summaryLabel, children: "Document upload" }), (0, _i.jsx)("div", { children: w ? "Ready" : "Missing files" })] }), (0, _i.jsx)("button", { onClick: () => i(e => m(m({}, e), {}, { currentStep: 2 })), style: js.linkButton, children: "Edit" })] }), (0, _i.jsxs)("div", { style: js.summaryItem, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: js.summaryLabel, children: "Face verification" }), (0, _i.jsx)("div", { children: j ? "Uploaded" : "Missing selfie" })] }), (0, _i.jsx)("button", { onClick: () => i(e => m(m({}, e), {}, { currentStep: 3 })), style: js.linkButton, children: "Edit" })] })] }), (0, _i.jsx)("div", { style: js.hintText, children: "Make sure everything is accurate before submission. Approval is usually completed within 5\u201330 minutes." })] });
                                    case 5: return (0, _i.jsxs)("div", { style: js.stepCard, children: [(0, _i.jsx)("div", { style: m(m({}, js.sectionTitle), {}, { marginBottom: 12 }), children: "Verification Submitted" }), (0, _i.jsxs)("div", { style: js.successCard, children: [(0, _i.jsx)("div", { style: { fontSize: 32, marginBottom: 12 }, children: "\u2705" }), (0, _i.jsx)("div", { style: { fontSize: 20, fontWeight: 700, marginBottom: 8 }, children: "Your documents are under review" }), (0, _i.jsx)("div", { style: { color: "#64748b", marginBottom: 16 }, children: "Thank you \u2014 we\u2019re reviewing your identity details now." }), (0, _i.jsxs)("div", { style: js.statusRow, children: [(0, _i.jsx)("span", { style: ks.statusDot("pending"), children: "Pending" }), (0, _i.jsx)("span", { children: "Estimated review time: 5\u201330 minutes" })] }), (0, _i.jsx)("button", { onClick: () => e("/"), style: js.primaryButton, children: "Return to dashboard" })] })] });
                                    default: return null;
                                } })(), 5 !== n.currentStep && (0, _i.jsxs)("div", { style: js.actionBar, children: [(0, _i.jsx)("button", { onClick: () => { 5 !== n.currentStep ? i(e => m(m({}, e), {}, { currentStep: Math.max(e.currentStep - 1, 1) })) : i(e => m(m({}, e), {}, { currentStep: 4 })); }, disabled: 1 === n.currentStep, style: m(m({}, js.secondaryButton), {}, { opacity: 1 === n.currentStep ? .4 : 1, cursor: 1 === n.currentStep ? "not-allowed" : "pointer" }), children: "Back" }), (0, _i.jsx)("button", { onClick: () => { 4 !== n.currentStep ? i(e => m(m({}, e), {}, { currentStep: Math.min(e.currentStep + 1, 5) })) : (async () => { if (!c) {
                                                d(!0);
                                                try {
                                                    const e = localStorage.getItem("token");
                                                    if (!e)
                                                        return void s("Please log in before submitting verification.");
                                                    const t = { personal: n.personal, documentType: n.documentType, documentFront: A(n.documentFront), documentBack: A(n.documentBack), selfie: A(n.selfie) }, r = await fetch("".concat("http://localhost:5000", "/api/auth/submit-kyc"), { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer ".concat(e) }, body: JSON.stringify(t) });
                                                    if (!r.ok) {
                                                        const e = await r.json();
                                                        return void s(e.message || "Failed to submit verification.");
                                                    }
                                                    i(e => m(m({}, e), {}, { status: "pending", submittedAt: (new Date).toISOString(), currentStep: 5 }));
                                                }
                                                catch (e) {
                                                    console.error("KYC submission error:", e), s("Could not submit your verification. Try again.");
                                                }
                                                finally {
                                                    d(!1);
                                                }
                                            } })(); }, disabled: !k(n.currentStep) || c, style: m(m({}, js.primaryButton), {}, { opacity: k(n.currentStep) && !c ? 1 : .6, cursor: k(n.currentStep) && !c ? "pointer" : "not-allowed" }), children: c ? "Submitting..." : 4 === n.currentStep ? "Submit Verification" : "Continue" })] })] })] })] }) }); }, Ns = [{ symbol: "\u20bf", pair: "BTC / USDT", volume: "Vol $42.1B", price: "$95,412", change: 2.1, sparkUp: !0 }, { symbol: "\u039e", pair: "ETH / USDT", volume: "Vol $18.7B", price: "$2,841", change: .8, sparkUp: !0 }, { symbol: "BNB", pair: "BNB / USDT", volume: "Vol $3.2B", price: "$612.30", change: 1.4, sparkUp: !0 }, { symbol: "AVAX", pair: "AVAX / USDT", volume: "Vol $890M", price: "$64.97", change: -3.4, sparkUp: !1 }], Cs = [{ name: "BTC", price: "$95,412", change: "+2.1%", up: !0 }, { name: "ETH", price: "$2,841", change: "+0.8%", up: !0 }, { name: "BNB", price: "$612", change: "+1.4%", up: !0 }, { name: "SOL", price: "$178", change: "\u22121.2%", up: !1 }, { name: "AVAX", price: "$64.97", change: "\u22123.4%", up: !1 }], Ts = { "\u20bf": { bg: "#F7931A22", color: "#F7931A" }, "\u039e": { bg: "#627EEA22", color: "#627EEA" }, BNB: { bg: "#F3BA2F22", color: "#F3BA2F" }, AVAX: { bg: "#E8414222", color: "#E84142" } }, As = [{ id: "home", label: "Home", icon: "\ud83c\udfe0" }, { id: "portfolio", label: "Portfolio", icon: "\ud83e\udd67" }, { id: "markets", label: "Markets", icon: "\ud83d\udcc8" }, { id: "trade", label: "Trade", icon: "\u21c4" }, { id: "account", label: "Account", icon: "\ud83d\udc64" }];
    function Es(e) { let t = e.up; const n = t ? "#0ecb81" : "#f6465d", r = t ? "M0,20 L10,17 L20,12 L30,14 L40,7 L50,4 L56,2" : "M0,8 L10,10 L20,16 L30,13 L40,20 L50,18 L56,24"; return (0, _i.jsx)("svg", { width: 56, height: 28, viewBox: "0 0 56 28", style: { flexShrink: 0 }, children: (0, _i.jsx)("path", { d: r, fill: "none", stroke: n, strokeWidth: 1.5 }) }); }
    function Rs(e) { let t = e.showSearch, n = void 0 !== t && t, r = e.showNotifications, i = void 0 !== r && r, a = e.unreadCount, o = void 0 === a ? 0 : a, s = e.onNotificationClick; return (0, _i.jsxs)("div", { style: Os.topBar, children: [(0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [(0, _i.jsx)("img", { src: Ui, alt: "SwanCore Logo", style: { width: 30, height: 30, borderRadius: "50%" } }), (0, _i.jsxs)("span", { style: Os.logo, children: ["S", (0, _i.jsx)("span", { style: { color: "#F0B90B" }, children: "wancore" })] })] }), (0, _i.jsxs)("div", { style: { display: "flex", gap: 16, alignItems: "center" }, children: [n && (0, _i.jsx)("span", { style: Os.topIcon, children: "\ud83d\udd0d" }), i && (0, _i.jsxs)("button", { onClick: s, style: m(m({}, Os.topIcon), {}, { position: "relative", background: "none", border: "none", cursor: "pointer", padding: 0 }), "aria-label": "Notifications", children: ["\ud83d\udd14", o > 0 && (0, _i.jsx)("span", { style: Os.notificationBadge, children: o > 99 ? "99+" : o })] })] })] }); }
    function Ps(e) { let t = e.active, n = e.onNavigate; return (0, _i.jsx)("div", { style: Os.bottomNav, children: As.map((e, r) => { const i = 0 === r && "home" === t || 1 === r && "portfolio" === t || 2 === r && "markets" === t || 3 === r && "trade" === t || 4 === r && "account" === t; return (0, _i.jsxs)("button", { onClick: () => n(e.id), style: m(m({}, Os.navItem), i ? Os.navItemActive : {}), "aria-label": e.label, children: [(0, _i.jsx)("span", { style: { fontSize: 18 }, children: e.icon }), (0, _i.jsx)("span", { style: { fontSize: 10 }, children: e.label })] }, r); }) }); }
    function Ls(e) { let t = e.onNavigate; const n = u((0, r.useState)("Hot"), 2), i = n[0], a = n[1]; return (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsxs)("div", { style: Os.balanceHero, children: [(0, _i.jsx)("div", { style: Os.balLabel, children: "Total balance" }), (0, _i.jsxs)("div", { style: Os.balAmount, children: ["0.00 ", (0, _i.jsx)("span", { style: Os.balUnit, children: "USDT" })] }), (0, _i.jsx)("div", { style: Os.balChange, children: "No change \xb7 deposit to get started" })] }), (0, _i.jsx)("div", { style: Os.quickActions, children: [{ label: "Deposit", icon: "\uff0b", bg: "#0ecb8118", color: "#0ecb81" }, { label: "Withdraw", icon: "\u2191", bg: "#378ADD18", color: "#378ADD" }, { label: "Trade", icon: "\u21c4", bg: "#7C5CFC18", color: "#a78bfa" }, { label: "Transfer", icon: "\u27a4", bg: "#5DCAA518", color: "#5DCAA5" }].map((e, t) => (0, _i.jsxs)("div", { style: Os.qaItem, children: [(0, _i.jsx)("div", { style: m(m({}, Os.qaIcon), {}, { background: e.bg }), children: (0, _i.jsx)("span", { style: { fontSize: 18, color: e.color }, children: e.icon }) }), (0, _i.jsx)("span", { style: Os.qaLabel, children: e.label })] }, t)) }), (0, _i.jsx)("div", { style: Os.tickerStrip, children: Cs.map(e => (0, _i.jsxs)("div", { style: Os.tick, children: [(0, _i.jsx)("span", { style: Os.tickName, children: e.name }), (0, _i.jsx)("span", { style: Os.tickPrice, children: e.price }), (0, _i.jsx)("span", { style: { fontSize: 11, color: e.up ? "#0ecb81" : "#f6465d" }, children: e.change })] }, e.name)) }), (0, _i.jsxs)("div", { style: Os.banner, children: [(0, _i.jsx)("span", { style: { fontSize: 20, color: "#a78bfa" }, children: "\ud83c\udf81" }), (0, _i.jsxs)("div", { style: { flex: 1 }, children: [(0, _i.jsx)("div", { style: Os.bannerTitle, children: "Refer a friend, earn 50 USDT" }), (0, _i.jsx)("div", { style: Os.bannerSub, children: "Invite friends and get commission rewards" })] }), (0, _i.jsx)("div", { style: Os.bannerBtn, children: "Invite" })] }), (0, _i.jsx)("div", { style: Os.tabRow, children: ["Hot", "Gainers", "Losers", "New"].map(e => (0, _i.jsx)("button", { onClick: () => a(e), style: m(m({}, Os.mktTab), i === e ? Os.mktTabActive : {}), children: e }, e)) }), (0, _i.jsxs)("div", { style: Os.sectionHeader, children: [(0, _i.jsx)("span", { style: Os.sectionLabel, children: "Markets" }), (0, _i.jsx)("button", { type: "button", onClick: () => t("/markets"), style: m(m({}, Os.sectionLink), {}, { border: "none", background: "none", padding: 0, cursor: "pointer" }), children: "See all" })] }), Ns.map(e => { var n, r, i, a; return (0, _i.jsxs)("button", { type: "button", onClick: () => t("/markets"), style: m(m({}, Os.marketRow), {}, { border: "none", background: "transparent", width: "100%", textAlign: "left", cursor: "pointer" }), children: [(0, _i.jsx)("div", { style: m(m({}, Os.coinDot), {}, { background: null !== (n = null === (r = Ts[e.symbol]) || void 0 === r ? void 0 : r.bg) && void 0 !== n ? n : "#ffffff11", color: null !== (i = null === (a = Ts[e.symbol]) || void 0 === a ? void 0 : a.color) && void 0 !== i ? i : "#fff", fontSize: e.symbol.length > 1 ? 11 : 13 }), children: e.symbol }), (0, _i.jsxs)("div", { style: { flex: 1 }, children: [(0, _i.jsx)("div", { style: Os.mName, children: e.pair }), (0, _i.jsx)("div", { style: Os.mVol, children: e.volume })] }), (0, _i.jsx)(Es, { up: e.sparkUp }), (0, _i.jsxs)("div", { style: { textAlign: "right" }, children: [(0, _i.jsx)("div", { style: Os.mPrice, children: e.price }), (0, _i.jsxs)("div", { style: { fontSize: 12, color: e.change >= 0 ? "#0ecb81" : "#f6465d", marginTop: 2 }, children: [e.change >= 0 ? "+" : "", e.change.toFixed(2), "%"] })] })] }, e.pair); }), (0, _i.jsxs)("div", { style: m(m({}, Os.sectionHeader), {}, { marginTop: 4 }), children: [(0, _i.jsx)("span", { style: Os.sectionLabel, children: "News" }), (0, _i.jsx)("button", { type: "button", onClick: () => t("/news"), style: m(m({}, Os.sectionLink), {}, { border: "none", background: "none", padding: 0, cursor: "pointer" }), children: "More" })] }), (0, _i.jsx)("div", { style: { padding: "4px 16px 12px", background: "#1a1a2e" }, children: [{ src: "CoinDesk", title: "Bitcoin breaks past $95K as institutional demand surges ahead of ETF rebalancing", time: "2 hours ago" }, { src: "The Block", title: "Ethereum gas fees hit 3-month low as Layer 2 adoption accelerates", time: "5 hours ago" }].map((e, n) => (0, _i.jsxs)("button", { type: "button", onClick: () => t("/news"), style: m(m({}, Os.newsCard), {}, { width: "100%", border: "none", background: "transparent", textAlign: "left", cursor: "pointer" }), children: [(0, _i.jsx)("div", { style: Os.newsSrc, children: e.src }), (0, _i.jsx)("div", { style: Os.newsTitle, children: e.title }), (0, _i.jsx)("div", { style: Os.newsTime, children: e.time })] }, n)) })] }); }
    const Os = { topBar: { background: "#16213e", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }, logo: { fontSize: 15, fontWeight: 500, color: "#F0B90B", letterSpacing: "0.3px" }, topIcon: { fontSize: 18, color: "rgba(255,255,255,0.4)", cursor: "pointer" }, notificationBadge: { position: "absolute", top: -2, right: -2, background: "#f6465d", color: "white", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }, bottomNav: { background: "#16213e", borderTop: "0.5px solid rgba(255,255,255,0.08)", display: "flex", padding: "12px 0 8px" }, navItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", background: "transparent", border: "none", color: "rgba(255,255,255,0.28)", fontSize: 10, padding: 0 }, navItemActive: { color: "#a78bfa" }, notificationOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1e3, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 60 }, notificationPane: { background: "white", borderRadius: 12, width: "90%", maxWidth: 400, maxHeight: "70vh", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }, notificationHeader: { padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }, notificationTitle: { margin: 0, fontSize: 18, fontWeight: 600, color: "#1f2937" }, notificationButton: { padding: "4px 8px", fontSize: 12, background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", color: "#374151" }, notificationCloseButton: { padding: "4px 8px", fontSize: 14, background: "none", border: "none", cursor: "pointer", color: "#6b7280" }, notificationList: { maxHeight: "calc(70vh - 80px)", overflowY: "auto" }, notificationEmpty: { padding: "40px 20px", textAlign: "center", color: "#6b7280" }, notificationEmptyTitle: { fontSize: 16, fontWeight: 500, marginBottom: 8 }, notificationEmptyText: { fontSize: 14 }, notificationItem: { padding: "16px 20px", borderBottom: "1px solid #f3f4f6", cursor: "pointer", transition: "background 0.2s" }, notificationItemTitle: { fontSize: 14, fontWeight: 600, color: "#1f2937", marginBottom: 4 }, notificationItemText: { fontSize: 14, color: "#4b5563", lineHeight: 1.4, marginBottom: 8 }, notificationItemDate: { fontSize: 12, color: "#9ca3af" }, balanceHero: { background: "#16213e", padding: "22px 20px 18px", textAlign: "center", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }, balLabel: { fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px", marginBottom: 6 }, balAmount: { fontSize: 30, fontWeight: 500, color: "#fff" }, balUnit: { fontSize: 14, color: "rgba(255,255,255,0.4)", marginLeft: 4 }, balChange: { fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 5 }, quickActions: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#16213e", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }, qaItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", cursor: "pointer", borderRight: "0.5px solid rgba(255,255,255,0.06)" }, qaIcon: { width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }, qaLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)" }, tickerStrip: { background: "#0f0f1a", padding: "9px 20px", display: "flex", gap: 18, overflow: "hidden", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }, tick: { display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }, tickName: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, tickPrice: { fontSize: 11, color: "#fff", fontWeight: 500 }, banner: { background: "#7C5CFC18", border: "0.5px solid #7C5CFC55", margin: "12px 16px", borderRadius: 8, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }, bannerTitle: { fontSize: 13, color: "#a78bfa", fontWeight: 500 }, bannerSub: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }, bannerBtn: { fontSize: 11, color: "#a78bfa", border: "0.5px solid #a78bfa", borderRadius: 12, padding: "4px 10px", cursor: "pointer", flexShrink: 0, background: "transparent" }, tabRow: { display: "flex", padding: "0 20px", background: "#16213e", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }, mktTab: { fontSize: 13, padding: "10px 14px 8px", color: "rgba(255,255,255,0.35)", cursor: "pointer", borderBottom: "2px solid transparent", background: "transparent", border: "none" }, mktTabActive: { color: "#a78bfa", borderBottomColor: "#a78bfa" }, sectionHeader: { padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f0f1a" }, sectionLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px" }, sectionLink: { fontSize: 12, color: "#a78bfa", cursor: "pointer" }, marketRow: { background: "#1a1a2e", borderBottom: "0.5px solid rgba(255,255,255,0.06)", padding: "11px 20px", display: "flex", alignItems: "center", gap: 12 }, coinDot: { width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, flexShrink: 0 }, mName: { fontSize: 14, color: "#fff", fontWeight: 500 }, mVol: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }, mPrice: { fontSize: 14, color: "#fff", fontWeight: 500 }, newsCard: { background: "#16213e", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.07)", padding: "12px 14px", marginTop: 8 }, newsSrc: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 }, newsTitle: { fontSize: 13, color: "#fff", lineHeight: "1.4" }, newsTime: { fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 5 } };
    function zs(e) { let t = e.notifications, n = e.isVisible, r = e.onClose, i = e.onMarkAsRead, a = e.onMarkAllAsRead; if (!n)
        return null; const o = e => { switch (e) {
        case "success": return "#0ecb81";
        case "warning": return "#f0b90b";
        case "error": return "#f6465d";
        case "admin": return "#a78bfa";
        default: return "#378ADD";
    } }, s = e => { switch (e) {
        case "success": return "\u2705";
        case "warning": return "\u26a0\ufe0f";
        case "error": return "\u274c";
        case "admin": return "\ud83d\udce2";
        default: return "\u2139\ufe0f";
    } }, l = e => { const t = new Date(e), n = (new Date).getTime() - t.getTime(), r = Math.floor(n / 6e4), i = Math.floor(n / 36e5), a = Math.floor(n / 864e5); return r < 1 ? "Just now" : r < 60 ? "".concat(r, "m ago") : i < 24 ? "".concat(i, "h ago") : a < 7 ? "".concat(a, "d ago") : t.toLocaleDateString(); }; return (0, _i.jsx)("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1e3, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 60 }, onClick: r, children: (0, _i.jsxs)("div", { style: { background: "white", borderRadius: 12, width: "90%", maxWidth: 400, maxHeight: "70vh", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }, onClick: e => e.stopPropagation(), children: [(0, _i.jsxs)("div", { style: { padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [(0, _i.jsx)("h3", { style: { margin: 0, fontSize: 18, fontWeight: 600, color: "#1f2937" }, children: "Notifications" }), (0, _i.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [t.some(e => !e.isRead) && (0, _i.jsx)("button", { onClick: a, style: { padding: "4px 8px", fontSize: 12, background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", color: "#374151" }, children: "Mark all read" }), (0, _i.jsx)("button", { onClick: r, style: { padding: "4px 8px", fontSize: 14, background: "none", border: "none", cursor: "pointer", color: "#6b7280" }, children: "\u2715" })] })] }), (0, _i.jsx)("div", { style: { maxHeight: "calc(70vh - 80px)", overflowY: "auto" }, children: 0 === t.length ? (0, _i.jsxs)("div", { style: { padding: "40px 20px", textAlign: "center", color: "#6b7280" }, children: [(0, _i.jsx)("div", { style: { fontSize: 48, marginBottom: 16 }, children: "\ud83d\udd14" }), (0, _i.jsx)("div", { style: { fontSize: 16, fontWeight: 500, marginBottom: 8 }, children: "No notifications yet" }), (0, _i.jsx)("div", { style: { fontSize: 14 }, children: "You'll receive notifications about important updates and activities here." })] }) : t.map(e => (0, _i.jsx)("div", { style: { padding: "16px 20px", borderBottom: "1px solid #f3f4f6", background: e.isRead ? "white" : "#fefce8", cursor: "pointer", transition: "background 0.2s" }, onClick: () => !e.isRead && i(e.id), children: (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: 12 }, children: [(0, _i.jsx)("div", { style: { fontSize: 20, color: o(e.type), flexShrink: 0 }, children: s(e.type) }), (0, _i.jsxs)("div", { style: { flex: 1 }, children: [(0, _i.jsx)("div", { style: { fontSize: 14, fontWeight: 600, color: "#1f2937", marginBottom: 4 }, children: e.title }), (0, _i.jsx)("div", { style: { fontSize: 14, color: "#4b5563", lineHeight: 1.4, marginBottom: 8 }, children: e.message }), (0, _i.jsx)("div", { style: { fontSize: 12, color: "#9ca3af" }, children: l(e.createdAt) })] }), !e.isRead && (0, _i.jsx)("div", { style: { width: 8, height: 8, borderRadius: "50%", background: o(e.type), flexShrink: 0, marginTop: 6 } })] }) }, e.id)) })] }) }); }
    function Bs(e) { let t = e.onNavigate, n = e.showTopBar, i = void 0 === n || n, a = e.showBottomNav, o = void 0 === a || a; const s = u((0, r.useState)("Hot"), 2), l = (s[0], s[1], kt()), c = u((0, r.useState)(null), 2), d = (c[0], c[1]), p = u((0, r.useState)([]), 2), h = p[0], f = p[1], g = u((0, r.useState)(!1), 2), x = g[0], b = g[1], y = u((0, r.useState)(0), 2), v = y[0], w = y[1]; (0, r.useEffect)(() => { j(), k(), S(); }, []); const j = async () => { try {
        const e = await fetch("".concat("http://localhost:5000", "/api/profile"), { method: "GET", headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")), "Content-Type": "application/json" } });
        if (e.ok) {
            const t = await e.json();
            t.success && d({ kycVerified: t.user.kycVerified || !1, kycStatus: t.user.kycStatus || "pending" });
        }
    }
    catch (e) {
        console.error("Error fetching user profile:", e);
    } }, k = async () => { try {
        const e = await fetch("".concat("http://localhost:5000", "/api/notifications"), { method: "GET", headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")), "Content-Type": "application/json" } });
        if (e.ok) {
            const t = await e.json();
            t.success && f(t.notifications);
        }
    }
    catch (e) {
        console.error("Error fetching notifications:", e);
    } }, S = async () => { try {
        const e = await fetch("".concat("http://localhost:5000", "/api/notifications/unread-count"), { method: "GET", headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")), "Content-Type": "application/json" } });
        if (e.ok) {
            const t = await e.json();
            t.success && w(t.unreadCount);
        }
    }
    catch (e) {
        console.error("Error fetching unread count:", e);
    } }; return (0, _i.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100vh" }, children: [(0, _i.jsxs)("div", { style: { flex: 1, overflow: "auto" }, children: [i && (0, _i.jsx)(Rs, { showSearch: !0, showNotifications: !0, unreadCount: v, onNotificationClick: () => { b(!0); } }), (0, _i.jsx)(Ls, { onNavigate: l })] }), o && (0, _i.jsx)(Ps, { active: "home", onNavigate: t }), (0, _i.jsx)(zs, { notifications: h, isVisible: x, onClose: () => { b(!1); }, onMarkAsRead: async (e) => { try {
                    (await fetch("".concat("http://localhost:5000", "/api/notifications/").concat(e, "/read"), { method: "PUT", headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")), "Content-Type": "application/json" } })).ok && (f(t => t.map(t => t.id === e ? m(m({}, t), {}, { isRead: !0 }) : t)), w(e => Math.max(0, e - 1)));
                }
                catch (t) {
                    console.error("Error marking notification as read:", t);
                } }, onMarkAllAsRead: async () => { try {
                    (await fetch("".concat("http://localhost:5000", "/api/notifications/mark-all-read"), { method: "PUT", headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")), "Content-Type": "application/json" } })).ok && (f(e => e.map(e => m(m({}, e), {}, { isRead: !0 }))), w(0));
                }
                catch (e) {
                    console.error("Error marking all notifications as read:", e);
                } } })] }); }
    function Ds(e) { let t = e.onNavigate, n = e.showTopBar, r = void 0 === n || n, i = e.showBottomNav, a = void 0 === i || i; return (0, _i.jsxs)("div", { children: [r && (0, _i.jsx)(Rs, {}), (0, _i.jsxs)("div", { style: Ws.balanceHero, children: [(0, _i.jsx)("div", { style: Ws.balLabel, children: "Total portfolio value" }), (0, _i.jsxs)("div", { style: Ws.balAmount, children: ["0.00 ", (0, _i.jsx)("span", { style: Ws.balUnit, children: "USDT" })] }), (0, _i.jsx)("div", { style: Ws.balChange, children: "Deposit to start building your portfolio" })] }), (0, _i.jsx)("div", { style: Ws.pnlBar, children: [["24h P&L", "\u2014"], ["7d P&L", "\u2014"], ["All-time", "\u2014"], ["Invested", "0.00"]].map((e, t) => { let n = u(e, 2), r = n[0], i = n[1]; return (0, _i.jsxs)("div", { style: Ws.pnlCell, children: [(0, _i.jsx)("div", { style: Ws.pnlLabel, children: r }), (0, _i.jsx)("div", { style: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.25)" }, children: i })] }, t); }) }), (0, _i.jsx)("div", { style: Ws.sectionHeader, children: (0, _i.jsx)("span", { style: Ws.sectionLabel, children: "Holdings (0)" }) }), (0, _i.jsxs)("div", { style: Ws.emptyState, children: [(0, _i.jsx)("div", { style: Ws.emptyIcon, children: (0, _i.jsx)("span", { style: { fontSize: 24, color: "#a78bfa" }, children: "\ud83e\udd67" }) }), (0, _i.jsx)("div", { style: Ws.emptyTitle, children: "No holdings yet" }), (0, _i.jsx)("div", { style: Ws.emptySub, children: "Deposit USDT and make your first trade to see your portfolio here." }), (0, _i.jsx)("button", { onClick: () => t("home"), style: Ws.depBtn, children: "\uff0b Deposit now" })] }), (0, _i.jsxs)("div", { style: { padding: "14px 20px", background: "#1a1a2e" }, children: [(0, _i.jsx)("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }, children: "Allocation" }), (0, _i.jsx)("div", { style: { height: 7, borderRadius: 4, background: "rgba(255,255,255,0.07)", marginBottom: 10 } }), (0, _i.jsx)("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.2)" }, children: "No assets to display" })] }), a && (0, _i.jsx)(Ps, { active: "portfolio", onNavigate: t })] }); }
    const Fs = [...Ns, { symbol: "SOL", pair: "SOL / USDT", volume: "Vol $5.6B", price: "$178.40", change: -1.2, sparkUp: !1 }, { symbol: "USDC", pair: "USDC / USDT", volume: "Vol $1.1B", price: "$1.00", change: 0, sparkUp: !0 }], Ms = m(m({}, Ts), {}, { SOL: { bg: "#14F19522", color: "#14F195" }, USDC: { bg: "#2775CA22", color: "#2775CA" } });
    function Is(e) { let t = e.onNavigate, n = e.showTopBar, i = void 0 === n || n, a = e.showBottomNav, o = void 0 === a || a; const s = u((0, r.useState)("All"), 2), l = s[0], c = s[1]; return (0, _i.jsxs)("div", { children: [i && (0, _i.jsx)(Rs, { showSearch: !0 }), (0, _i.jsx)("div", { style: Ws.tabRow, children: ["All", "Gainers", "Losers", "Watchlist"].map(e => (0, _i.jsx)("button", { onClick: () => c(e), style: m(m({}, Ws.mktTab), l === e ? Ws.mktTabActive : {}), children: e }, e)) }), (0, _i.jsxs)("div", { style: Ws.sectionHeader, children: [(0, _i.jsx)("span", { style: Ws.sectionLabel, children: "Top markets" }), (0, _i.jsx)("span", { style: Ws.sectionLink, children: "Filter" })] }), Fs.map(e => { var t, n, r, i; return (0, _i.jsxs)("div", { style: Ws.marketRow, children: [(0, _i.jsx)("div", { style: m(m({}, Ws.coinDot), {}, { background: null !== (t = null === (n = Ms[e.symbol]) || void 0 === n ? void 0 : n.bg) && void 0 !== t ? t : "#ffffff11", color: null !== (r = null === (i = Ms[e.symbol]) || void 0 === i ? void 0 : i.color) && void 0 !== r ? r : "#fff", fontSize: e.symbol.length > 1 ? 11 : 13 }), children: e.symbol }), (0, _i.jsxs)("div", { style: { flex: 1 }, children: [(0, _i.jsx)("div", { style: Ws.mName, children: e.pair }), (0, _i.jsx)("div", { style: Ws.mVol, children: e.volume })] }), (0, _i.jsx)(Es, { up: e.sparkUp }), (0, _i.jsxs)("div", { style: { textAlign: "right" }, children: [(0, _i.jsx)("div", { style: Ws.mPrice, children: e.price }), (0, _i.jsxs)("div", { style: { fontSize: 12, color: e.change > 0 ? "#0ecb81" : e.change < 0 ? "#f6465d" : "rgba(255,255,255,0.25)", marginTop: 2 }, children: [e.change > 0 ? "+" : "", e.change.toFixed(2), "%"] })] })] }, e.pair); }), o && (0, _i.jsx)(Ps, { active: "markets", onNavigate: t })] }); }
    function Us(e) { let t = e.onNavigate, n = e.showTopBar, i = void 0 === n || n, a = e.showBottomNav, o = void 0 === a || a; const s = kt(), l = u((0, r.useState)(null), 2), c = l[0], d = l[1], p = u((0, r.useState)(!0), 2), h = p[0], f = p[1], g = u((0, r.useState)(!1), 2), x = g[0], b = g[1], y = u((0, r.useState)([]), 2), v = y[0], w = y[1], j = u((0, r.useState)(!1), 2), k = j[0], S = j[1], N = u((0, r.useState)(0), 2), C = N[0], T = N[1]; (0, r.useEffect)(() => { A(); }, []); const A = async () => { try {
        const n = await fetch("".concat("http://localhost:5000", "/api/profile"), { method: "GET", headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")), "Content-Type": "application/json" } });
        if (n.ok) {
            const r = await n.json();
            var e, t;
            if (r.success)
                d({ kycVerified: (null === (e = r.user) || void 0 === e ? void 0 : e.kycVerified) || !1, kycStatus: (null === (t = r.user) || void 0 === t ? void 0 : t.kycStatus) || "pending" });
        }
    }
    catch (n) {
        console.error("Error fetching user profile:", n);
    } }, E = localStorage.getItem("userEmail") || "user@example.com", R = localStorage.getItem("userId") || "SW-000000", P = E.includes("@") ? E.split("@")[0].charAt(0).toUpperCase() + E.split("@")[0].slice(1) : "User", L = P.charAt(0).toUpperCase(); (0, r.useEffect)(() => { O(); }, []); const O = async () => { try {
        const e = localStorage.getItem("token");
        if (!e)
            return;
        const t = await fetch("/api/notifications", { headers: { Authorization: "Bearer ".concat(e) } });
        if (t.ok) {
            const e = await t.json();
            w(e.notifications), T(e.notifications.filter(e => !e.isRead).length);
        }
    }
    catch (e) {
        console.error("Error fetching notifications:", e);
    } }, z = async (e) => { try {
        const t = localStorage.getItem("token");
        if (!t)
            return;
        (await fetch("/api/notifications/".concat(e, "/read"), { method: "PUT", headers: { Authorization: "Bearer ".concat(t) } })).ok && (w(v.map(t => t.id === e ? m(m({}, t), {}, { isRead: !0 }) : t)), T(e => Math.max(0, e - 1)));
    }
    catch (t) {
        console.error("Error marking notification as read:", t);
    } }; return (0, _i.jsxs)("div", { children: [i && (0, _i.jsx)(Rs, { onNotificationClick: () => { S(!k); }, unreadCount: C }), (0, _i.jsxs)("div", { style: Ws.profileHero, children: [(0, _i.jsx)("div", { style: Ws.avatar, children: L }), (0, _i.jsxs)("div", { style: { flex: 1 }, children: [(0, _i.jsx)("div", { style: { fontSize: 16, fontWeight: 500, color: "#fff" }, children: P }), (0, _i.jsx)("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }, children: E }), (0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 4 }, children: [(0, _i.jsx)("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.25)" }, children: "UID:" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }, children: R })] })] }), (0, _i.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }, children: [null !== c && void 0 !== c && c.kycVerified ? (0, _i.jsx)("span", { style: Ws.badgeVerified, children: "\u2713 Verified" }) : (0, _i.jsx)("span", { style: Ws.badgeUnverified, children: "\u26a0 Unverified" }), (0, _i.jsx)("span", { style: Ws.badgePurple, children: "New" })] })] }), !(null !== c && void 0 !== c && c.kycVerified) && (0, _i.jsxs)("button", { onClick: () => s("/verification"), style: m(m({}, Ws.kycBanner), {}, { cursor: "pointer", border: "1px solid rgba(240,185,11,0.35)", background: "rgba(240,185,11,0.08)" }), children: [(0, _i.jsx)("span", { style: { fontSize: 18, color: "#F0B90B" }, children: "\ud83e\udeaa" }), (0, _i.jsxs)("div", { style: { flex: 1, textAlign: "left" }, children: [(0, _i.jsx)("div", { style: { fontSize: 13, color: "#F0B90B", fontWeight: 500 }, children: "Complete identity verification" }), (0, _i.jsx)("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }, children: "Unlock deposits, withdrawals and trading" })] }), (0, _i.jsx)("div", { style: { fontSize: 11, color: "#0f172a", background: "#f0b90b", borderRadius: 12, padding: "8px 14px" }, children: "Verify" })] }), (0, _i.jsx)("div", { style: Ws.limitsGrid, children: (null !== c && void 0 !== c && c.kycVerified ? [{ label: "Daily withdrawal", val: "Unlimited", sub: "Verified account" }, { label: "Trading limit", val: "Unlimited", sub: "Full access" }] : [{ label: "Daily withdrawal", val: "0 USDT", sub: "Verify to unlock" }, { label: "Trading limit", val: "Locked", sub: "KYC required" }]).map((e, t) => (0, _i.jsxs)("div", { style: Ws.limCell, children: [(0, _i.jsx)("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 }, children: e.label }), (0, _i.jsx)("div", { style: { fontSize: 14, color: "#fff", fontWeight: 500 }, children: e.val }), (0, _i.jsx)("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }, children: e.sub }), (0, _i.jsx)("div", { style: { height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginTop: 6 } })] }, t)) }), [{ section: "Identity & verification", rows: [{ icon: "\ud83e\udeaa", color: "#F0B90B", bg: "#F0B90B15", title: "KYC verification", sub: null !== c && void 0 !== c && c.kycVerified ? "Verified \xb7 full access" : "Not started \xb7 required to trade", badge: null !== c && void 0 !== c && c.kycVerified ? (0, _i.jsx)("span", { style: Ws.badgeVerified, children: "Verified" }) : (0, _i.jsx)("span", { style: Ws.badgeUnverified, children: "Pending" }), link: null !== c && void 0 !== c && c.kycVerified ? void 0 : "/verification" }, { icon: "\ud83d\udcb3", color: "#378ADD", bg: "#378ADD15", title: "Payment methods", sub: "No methods linked yet" }] }, { section: "Security", rows: [{ icon: "\ud83d\udd12", color: "#a78bfa", bg: "#a78bfa15", title: "Password", sub: "Set during registration" }, { icon: "\ud83d\udcf1", color: "#0ecb81", bg: "#0ecb8115", title: "Two-factor authentication", sub: x ? "Authenticator app enabled" : "Not enabled \xb7 recommended", badge: (0, _i.jsx)("button", { onClick: () => b(!x), style: m(m({}, Ws.toggle), {}, { background: x ? "#0ecb81" : "rgba(255,255,255,0.12)" }), "aria-label": "Toggle 2FA", children: (0, _i.jsx)("div", { style: m(m({}, Ws.toggleKnob), {}, { marginLeft: x ? "auto" : 0 }) }) }) }, { icon: "\ud83d\udda5", color: "#a78bfa", bg: "#a78bfa15", title: "Active devices", sub: "1 device (this device)" }] }, { section: "Preferences", rows: [{ icon: "\ud83d\udd14", color: "#5DCAA5", bg: "#5DCAA515", title: "Notifications", sub: "Price alerts, security notices" }, { icon: "\ud83c\udf10", color: "#378ADD", bg: "#378ADD15", title: "Language & region", sub: "English \xb7 USDT \xb7 UTC+2" }, { icon: "\ud83c\udf19", color: "#EF9F27", bg: "#EF9F2715", title: "Dark mode", sub: h ? "Currently enabled" : "Currently disabled", badge: (0, _i.jsx)("button", { onClick: () => f(!h), style: m(m({}, Ws.toggle), {}, { background: h ? "#0ecb81" : "rgba(255,255,255,0.12)" }), "aria-label": "Toggle dark mode", children: (0, _i.jsx)("div", { style: m(m({}, Ws.toggleKnob), {}, { marginLeft: h ? "auto" : 0 }) }) }) }, { icon: "\ud83c\udfa7", color: "#378ADD", bg: "#378ADD15", title: "Support & help center", sub: "Chat, tickets, FAQs" }] }].map(e => { let t = e.section, n = e.rows; return (0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { style: Ws.sectionDivider, children: t }), n.map((e, t) => { var n; return (0, _i.jsxs)("button", { style: m(m({}, Ws.accRow), {}, { cursor: e.link ? "pointer" : "default", textAlign: "left", border: e.link ? "1px solid rgba(240,185,11,0.12)" : "none", background: e.link ? "rgba(240,185,11,0.06)" : "transparent" }), onClick: () => e.link && s(e.link), children: [(0, _i.jsx)("div", { style: m(m({}, Ws.accIcon), {}, { background: e.bg }), children: (0, _i.jsx)("span", { style: { fontSize: 16 }, children: e.icon }) }), (0, _i.jsxs)("div", { style: { flex: 1 }, children: [(0, _i.jsx)("div", { style: { fontSize: 14, color: "#fff" }, children: e.title }), (0, _i.jsx)("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }, children: e.sub })] }), (0, _i.jsx)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: null !== (n = e.badge) && void 0 !== n ? n : (0, _i.jsx)("span", { style: { fontSize: 14, color: "rgba(255,255,255,0.2)" }, children: "\u203a" }) })] }, t); })] }, t); }), (0, _i.jsxs)("div", { style: Ws.logoutRow, children: [(0, _i.jsx)("span", { style: { fontSize: 18 }, children: "\ud83d\udeaa" }), (0, _i.jsx)("span", { style: { fontSize: 14, color: "#f6465d" }, children: "Log out" })] }), o && (0, _i.jsx)(Ps, { active: "account", onNavigate: t }), (0, _i.jsx)(zs, { notifications: v, isVisible: k, onClose: () => { S(!1); }, onMarkAsRead: z, onMarkAllAsRead: async () => { try {
                    if (!localStorage.getItem("token"))
                        return;
                    w(v.map(e => m(m({}, e), {}, { isRead: !0 }))), T(0), await Promise.all(v.filter(e => !e.isRead).map(e => z(e.id)));
                }
                catch (e) {
                    console.error("Error marking all notifications as read:", e);
                } } })] }); }
    function _s(e) { let t = e.showTopBar, n = void 0 === t || t, i = e.showBottomNav, a = void 0 === i || i; const o = u((0, r.useState)("home"), 2), s = o[0], l = o[1], c = kt(), d = e => { "markets" !== e ? "trade" !== e ? l(e) : c("/trade") : c("/markets"); }; return (0, _i.jsxs)(_i.Fragment, { children: ["home" === s && (0, _i.jsx)(Bs, { onNavigate: d, showTopBar: n, showBottomNav: a }), "portfolio" === s && (0, _i.jsx)(Ds, { onNavigate: d, showTopBar: n, showBottomNav: a }), "markets" === s && (0, _i.jsx)(Is, { onNavigate: d, showTopBar: n, showBottomNav: a }), "account" === s && (0, _i.jsx)(Us, { onNavigate: d, showTopBar: n, showBottomNav: a })] }); }
    const Ws = { page: { width: "100vw", height: "100vh", background: "radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n      radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n      radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n      linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%)", backgroundRepeat: "no-repeat", backgroundSize: "cover", display: "flex", justifyContent: "center", padding: 0, boxSizing: "border-box", overflow: "hidden" }, app: { fontFamily: "sans-serif", background: "#0f1320", borderRadius: 12, overflow: "hidden", maxWidth: 420, width: "100%", margin: 0, height: "100vh", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }, topBar: { background: "#16213e", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }, logo: { fontSize: 15, fontWeight: 500, color: "#F0B90B", letterSpacing: "0.3px" }, topIcon: { fontSize: 18, color: "rgba(255,255,255,0.4)", cursor: "pointer" }, balanceHero: { background: "#16213e", padding: "22px 20px 18px", textAlign: "center", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }, balLabel: { fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px", marginBottom: 6 }, balAmount: { fontSize: 30, fontWeight: 500, color: "#fff" }, balUnit: { fontSize: 14, color: "rgba(255,255,255,0.4)", marginLeft: 4 }, balChange: { fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 5 }, quickActions: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#16213e", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }, qaItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", cursor: "pointer", borderRight: "0.5px solid rgba(255,255,255,0.06)" }, qaIcon: { width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }, qaLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)" }, tickerStrip: { background: "#0f0f1a", padding: "9px 20px", display: "flex", gap: 18, overflow: "hidden", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }, tick: { display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }, tickName: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, tickPrice: { fontSize: 11, color: "#fff", fontWeight: 500 }, banner: { background: "#7C5CFC18", border: "0.5px solid #7C5CFC55", margin: "12px 16px", borderRadius: 8, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }, bannerTitle: { fontSize: 13, color: "#a78bfa", fontWeight: 500 }, bannerSub: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }, bannerBtn: { fontSize: 11, color: "#a78bfa", border: "0.5px solid #a78bfa", borderRadius: 12, padding: "4px 10px", cursor: "pointer", flexShrink: 0, background: "transparent" }, tabRow: { display: "flex", padding: "0 20px", background: "#16213e", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }, mktTab: { fontSize: 13, padding: "10px 14px 8px", color: "rgba(255,255,255,0.35)", cursor: "pointer", borderBottom: "2px solid transparent", background: "transparent", border: "none", borderBottomStyle: "solid", borderBottomWidth: 2, borderBottomColor: "transparent" }, mktTabActive: { color: "#a78bfa", borderBottomColor: "#a78bfa" }, sectionHeader: { padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f0f1a" }, sectionLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px" }, sectionLink: { fontSize: 12, color: "#a78bfa", cursor: "pointer" }, sectionDivider: { fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 20px 6px", background: "#0f0f1a" }, marketRow: { background: "#1a1a2e", borderBottom: "0.5px solid rgba(255,255,255,0.06)", padding: "11px 20px", display: "flex", alignItems: "center", gap: 12 }, coinDot: { width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, flexShrink: 0 }, mName: { fontSize: 14, color: "#fff", fontWeight: 500 }, mVol: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }, mPrice: { fontSize: 14, color: "#fff", fontWeight: 500 }, newsCard: { background: "#16213e", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.07)", padding: "12px 14px", marginTop: 8 }, newsSrc: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 }, newsTitle: { fontSize: 13, color: "#fff", lineHeight: "1.4" }, newsTime: { fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 5 }, pnlBar: { background: "#0f0f1a", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }, pnlCell: { padding: "12px 14px", textAlign: "center", borderRight: "0.5px solid rgba(255,255,255,0.06)" }, pnlLabel: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 3 }, emptyState: { padding: "32px 20px", textAlign: "center", background: "#1a1a2e" }, emptyIcon: { width: 56, height: 56, borderRadius: "50%", background: "#7C5CFC18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }, emptyTitle: { fontSize: 15, color: "#fff", fontWeight: 500, marginBottom: 6 }, emptySub: { fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }, depBtn: { display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, background: "#7C5CFC", borderRadius: 8, padding: "9px 20px", fontSize: 13, color: "#fff", cursor: "pointer", fontWeight: 500, border: "none" }, profileHero: { background: "#16213e", padding: 20, display: "flex", alignItems: "center", gap: 14, borderBottom: "0.5px solid rgba(255,255,255,0.07)" }, avatar: { width: 52, height: 52, borderRadius: "50%", background: "#7C5CFC22", border: "2px solid #7C5CFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 500, color: "#a78bfa", flexShrink: 0 }, badgeUnverified: { background: "#F0B90B18", color: "#F0B90B", fontSize: 11, padding: "2px 8px", borderRadius: 10 }, badgeVerified: { background: "#0ecb8118", color: "#0ecb81", fontSize: 11, padding: "2px 8px", borderRadius: 10 }, badgePurple: { background: "#7C5CFC20", color: "#a78bfa", fontSize: 11, padding: "2px 8px", borderRadius: 10 }, kycBanner: { background: "#F0B90B12", border: "0.5px solid #F0B90B44", margin: "12px 16px", borderRadius: 8, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }, limitsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.06)" }, limCell: { background: "#1a1a2e", padding: "13px 20px" }, accRow: { background: "#1a1a2e", borderBottom: "0.5px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }, accIcon: { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, toggle: { width: 36, height: 20, borderRadius: 10, display: "flex", alignItems: "center", padding: 2, cursor: "pointer", border: "none", transition: "background 0.2s" }, toggleKnob: { width: 16, height: 16, borderRadius: "50%", background: "#fff" }, logoutRow: { padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "#1a1a2e" } }, Hs = function () { return (0, _i.jsx)("div", { style: Ws.page, children: (0, _i.jsx)("div", { style: Ws.app, children: (0, _i.jsx)(_s, {}) }) }); }, Vs = [{ symbol: "\u20bf", pair: "BTC / USDT", volume: "Vol $42.1B", price: "$95,412", change: 2.1, sparkUp: !0 }, { symbol: "\u039e", pair: "ETH / USDT", volume: "Vol $18.7B", price: "$2,841", change: .8, sparkUp: !0 }, { symbol: "BNB", pair: "BNB / USDT", volume: "Vol $3.2B", price: "$612.30", change: 1.4, sparkUp: !0 }, { symbol: "AVAX", pair: "AVAX / USDT", volume: "Vol $890M", price: "$64.97", change: -3.4, sparkUp: !1 }, { symbol: "SOL", pair: "SOL / USDT", volume: "Vol $5.6B", price: "$178.40", change: -1.2, sparkUp: !1 }, { symbol: "USDC", pair: "USDC / USDT", volume: "Vol $1.1B", price: "$1.00", change: 0, sparkUp: !0 }], qs = [{ name: "BTC", price: "$95,412", change: "+2.1%", up: !0 }, { name: "ETH", price: "$2,841", change: "+0.8%", up: !0 }, { name: "BNB", price: "$612", change: "+1.4%", up: !0 }, { name: "SOL", price: "$178", change: "\u22121.2%", up: !1 }, { name: "AVAX", price: "$64.97", change: "\u22123.4%", up: !1 }, { name: "USDC", price: "$1.00", change: "0.0%", up: !0 }], Ks = [{ id: "sample-1", src: "CoinDesk", title: "Bitcoin breaks past $95K as institutional demand surges ahead of ETF rebalancing", time: "2 hours ago" }, { id: "sample-2", src: "The Block", title: "Ethereum gas fees hit 3-month low as Layer 2 adoption accelerates", time: "5 hours ago" }, { id: "sample-3", src: "Reuters", title: "SEC signals clearer crypto regulatory framework expected before year-end", time: "8 hours ago" }, { id: "sample-4", src: "Bloomberg", title: "BNB Chain daily active addresses hit all-time high driven by DeFi growth", time: "11 hours ago" }], Gs = [{ symbol: "MATIC", pair: "MATIC / USDT", volume: "Vol $1.2B", price: "$0.90", change: 4.12, sparkUp: !0 }, { symbol: "LINK", pair: "LINK / USDT", volume: "Vol $630M", price: "$18.45", change: 3.02, sparkUp: !0 }, { symbol: "ADA", pair: "ADA / USDT", volume: "Vol $1.9B", price: "$0.66", change: 2.28, sparkUp: !0 }, { symbol: "SOL", pair: "SOL / USDT", volume: "Vol $5.6B", price: "$178.40", change: -1.2, sparkUp: !1 }], Ys = qs.map(e => ({ symbol: e.name, pair: "".concat(e.name, " / USDT"), volume: "Vol live", price: e.price, change: parseFloat(e.change.replace("%", "").replace("+", "").replace("\u2212", "-")) || 0, sparkUp: e.up })), Xs = { "\u20bf": { bg: "#F7931A22", color: "#F7931A" }, "\u039e": { bg: "#627EEA22", color: "#627EEA" }, BNB: { bg: "#F3BA2F22", color: "#F3BA2F" }, AVAX: { bg: "#E8414222", color: "#E84142" }, SOL: { bg: "#14F19522", color: "#14F195" }, USDC: { bg: "#2775CA22", color: "#2775CA" } }, Js = ["Dashboard", "Markets", "Trade", "Portfolio", "Account"], Qs = [{ label: "History", icon: "\ud83d\udd50" }, { label: "Verification", icon: "\ud83e\udeaa", link: "/verification" }, { label: "Security", icon: "\ud83d\udd12" }];
    function Zs(e) { let t = e.up; const n = t ? "#0ecb81" : "#f6465d", r = t ? "M0,20 L10,17 L20,12 L30,14 L40,7 L50,4 L56,2" : "M0,8 L10,10 L20,16 L30,13 L40,20 L50,18 L56,24"; return (0, _i.jsxs)("svg", { width: 56, height: 28, viewBox: "0 0 56 28", style: { flexShrink: 0 }, children: [(0, _i.jsx)("defs", { children: (0, _i.jsxs)("linearGradient", { id: "sg-".concat(t ? "up" : "dn"), x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, _i.jsx)("stop", { offset: "0%", stopColor: n, stopOpacity: "0.3" }), (0, _i.jsx)("stop", { offset: "100%", stopColor: n, stopOpacity: "0" })] }) }), (0, _i.jsx)("path", { d: t ? "M0,20 L10,17 L20,12 L30,14 L40,7 L50,4 L56,2 L56,28 L0,28 Z" : "M0,8 L10,10 L20,16 L30,13 L40,20 L50,18 L56,24 L56,28 L0,28 Z", fill: "url(#sg-".concat(t ? "up" : "dn", ")") }), (0, _i.jsx)("path", { d: r, fill: "none", stroke: n, strokeWidth: 1.5 })] }); }
    function $s(e) { let t = e.notifications, n = e.isVisible, r = e.onClose, i = e.onMarkAsRead, a = e.onMarkAllAsRead; if (!n)
        return null; const o = e => { var t; return null !== (t = { success: "#0ecb81", warning: "#f0b90b", error: "#f6465d", admin: "#a78bfa" }[e]) && void 0 !== t ? t : "#378ADD"; }, s = e => { var t; return null !== (t = { success: "\u2705", warning: "\u26a0\ufe0f", error: "\u274c", admin: "\ud83d\udce2" }[e]) && void 0 !== t ? t : "\u2139\ufe0f"; }, l = e => { const t = Date.now() - new Date(e).getTime(), n = Math.floor(t / 6e4); if (n < 1)
        return "Just now"; if (n < 60)
        return "".concat(n, "m ago"); const r = Math.floor(n / 60); return r < 24 ? "".concat(r, "h ago") : "".concat(Math.floor(r / 24), "d ago"); }; return (0, _i.jsx)("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingTop: 70, paddingRight: 24 }, onClick: r, children: (0, _i.jsxs)("div", { style: { background: "#13102a", border: "1px solid #2a2550", borderRadius: 16, width: 360, maxHeight: "70vh", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }, onClick: e => e.stopPropagation(), children: [(0, _i.jsxs)("div", { style: { padding: "16px 20px", borderBottom: "1px solid #2a2550", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [(0, _i.jsx)("h3", { style: { margin: 0, fontSize: 16, fontWeight: 700, color: "#e8e4ff", fontFamily: "'Syne', sans-serif" }, children: "Notifications" }), (0, _i.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [t.some(e => !e.isRead) && (0, _i.jsx)("button", { onClick: a, style: { padding: "4px 10px", fontSize: 11, background: "rgba(124,106,247,0.12)", border: "1px solid rgba(124,106,247,0.3)", borderRadius: 8, cursor: "pointer", color: "#a78bfa" }, children: "Mark all read" }), (0, _i.jsx)("button", { onClick: r, style: { padding: "4px 8px", fontSize: 14, background: "none", border: "none", cursor: "pointer", color: "#6b6590" }, children: "\u2715" })] })] }), (0, _i.jsx)("div", { style: { maxHeight: "calc(70vh - 60px)", overflowY: "auto" }, children: 0 === t.length ? (0, _i.jsxs)("div", { style: { padding: "40px 20px", textAlign: "center", color: "#6b6590" }, children: [(0, _i.jsx)("div", { style: { fontSize: 40, marginBottom: 12 }, children: "\ud83d\udd14" }), (0, _i.jsx)("div", { style: { fontSize: 14, color: "#9b95c4", fontWeight: 500, marginBottom: 6 }, children: "No notifications yet" }), (0, _i.jsx)("div", { style: { fontSize: 13 }, children: "Updates and alerts will appear here." })] }) : t.map(e => (0, _i.jsx)("div", { style: { padding: "14px 20px", borderBottom: "1px solid #1a1638", background: e.isRead ? "transparent" : "rgba(124,106,247,0.05)", cursor: "pointer" }, onClick: () => !e.isRead && i(e.id), children: (0, _i.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [(0, _i.jsx)("span", { style: { fontSize: 18, color: o(e.type), flexShrink: 0 }, children: s(e.type) }), (0, _i.jsxs)("div", { style: { flex: 1 }, children: [(0, _i.jsx)("div", { style: { fontSize: 13, fontWeight: 600, color: "#e8e4ff", marginBottom: 3 }, children: e.title }), (0, _i.jsx)("div", { style: { fontSize: 12, color: "#9b95c4", lineHeight: 1.4, marginBottom: 6 }, children: e.message }), (0, _i.jsx)("div", { style: { fontSize: 11, color: "#6b6590" }, children: l(e.createdAt) })] }), !e.isRead && (0, _i.jsx)("div", { style: { width: 7, height: 7, borderRadius: "50%", background: o(e.type), flexShrink: 0, marginTop: 4 } })] }) }, e.id)) })] }) }); }
    const el = function () { const e = u((0, r.useState)(null), 2), t = e[0], n = e[1], i = u((0, r.useState)("Dashboard"), 2), a = i[0], o = i[1], s = u((0, r.useState)("Dashboard"), 2), l = (s[0], s[1]), c = u((0, r.useState)("Hot"), 2), d = c[0], p = c[1], h = u((0, r.useState)(""), 2), f = h[0], g = h[1], x = u((0, r.useState)([]), 2), b = x[0], y = x[1], v = u((0, r.useState)(!0), 2), w = v[0], j = v[1], k = u((0, r.useState)(!1), 2), S = k[0], N = k[1], C = u((0, r.useState)(0), 2), T = C[0], A = C[1], E = u((0, r.useState)([]), 2), R = E[0], P = E[1], L = u((0, r.useState)(0), 2), O = L[0], z = L[1]; (0, r.useEffect)(() => { B(), D(); const e = window.socket; return e && e.on("balanceUpdated", e => { z(e.balance); }), () => { e && e.off("balanceUpdated"); }; }, []); const B = async () => { try {
        const e = await fetch("".concat("http://localhost:5000", "/api/profile"), { headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")) } }), t = await e.json();
        t.success && z(t.user.balance || 0);
    }
    catch (Rl) {
        console.log(Rl);
    } }, D = async () => { try {
        const r = await fetch("".concat("http://localhost:5000", "/api/profile"), { headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")) } }), i = await r.json();
        var e, t;
        if (i.success)
            n({ kycVerified: (null === (e = i.user) || void 0 === e ? void 0 : e.kycVerified) || !1, kycStatus: (null === (t = i.user) || void 0 === t ? void 0 : t.kycStatus) || "pending" });
    }
    catch (Rl) {
        console.log(Rl);
    } }; (0, r.useEffect)(() => { const e = localStorage.getItem("news-cache"); if (e)
        try {
            const t = JSON.parse(e);
            Array.isArray(t) && t.length && P(t);
        }
        catch (t) {
            console.warn("Failed to parse news cache", t);
        } }, []); const F = R.length > 0 ? R.slice(0, 4).map(e => ({ id: e.id, src: "Swancore's News", title: e.title, time: e.time || "Just now" })) : Ks, M = localStorage.getItem("userEmail") || "user@example.com", I = localStorage.getItem("userId") || "SW-000000", U = M.includes("@") ? M.split("@")[0].charAt(0).toUpperCase() + M.split("@")[0].slice(1) : "User", _ = U.charAt(0).toUpperCase(), W = kt(); (0, r.useRef)(null), (0, r.useEffect)(() => { H(), V(); }, []); const H = async () => { try {
        const e = await fetch("".concat("http://localhost:5000", "/api/notifications"), { headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")), "Content-Type": "application/json" } });
        if (e.ok) {
            const t = await e.json();
            t.success && y(t.notifications);
        }
    }
    catch (e) { } }, V = async () => { try {
        const e = await fetch("".concat("http://localhost:5000", "/api/notifications/unread-count"), { headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")) } });
        if (e.ok) {
            const t = await e.json();
            t.success && A(t.unreadCount);
        }
    }
    catch (e) { } }, q = () => { o("Dashboard"), l("Dashboard"), W("/home"); }, K = "dt-body".concat("Account" === a || !w ? " dt-body-collapsed" : ""); return (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("style", { children: "\n        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');\n\n        :root {\n          --bg: #0a0d1a;\n          --surface: #10132a;\n          --surface2: #161938;\n          --surface3: #1c2040;\n          --border: #232649;\n          --border2: #2c3060;\n          --accent: #7c6af7;\n          --accent2: #9b8fff;\n          --accent-glow: rgba(124,106,247,0.18);\n          --green: #0ecb81;\n          --red: #f6465d;\n          --gold: #F0B90B;\n          --text: #e8e4ff;\n          --text2: #9b95c4;\n          --text3: #6b6590;\n        }\n\n        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n\n        html, body, #root {\n          height: 100%;\n          background: var(--bg);\n          font-family: 'DM Sans', sans-serif;\n          color: var(--text);\n        }\n\n        /* \u2500\u2500 Topbar \u2500\u2500 */\n        .dt-root { min-height: 100vh; display: flex; flex-direction: column; background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%), radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%), radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%), linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%); }\n\n        .dt-topbar {\n          position: sticky; top: 0; z-index: 100;\n          display: flex !important; align-items: center; justify-content: space-between;\n          padding: 0 28px; height: 64px;\n          background: rgba(10,13,26,0.92);\n          backdrop-filter: blur(16px);\n          border-bottom: 1px solid var(--border);\n        }\n\n        .dt-logo-wrap { display: flex; align-items: center; gap: 10px; }\n        .dt-logo-img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }\n        .dt-logo-text {\n          font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;\n          color: var(--text); letter-spacing: -0.04em;\n        }\n        .dt-logo-text span { color: var(--gold); }\n\n        .dt-nav { display: flex; gap: 4px; margin-left: 28px; }\n        .dt-nav-btn {\n          padding: 8px 14px; border-radius: 10px;\n          border: 1px solid transparent; background: transparent;\n          color: var(--text2); font-size: 13px; font-weight: 500;\n          cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;\n        }\n        .dt-nav-btn:hover { background: var(--accent-glow); color: var(--text); }\n        .dt-nav-btn.active {\n          background: var(--accent-glow); border-color: rgba(124,106,247,0.3);\n          color: var(--text); box-shadow: 0 0 0 1px rgba(124,106,247,0.15) inset;\n        }\n\n        .dt-top-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }\n        .dt-search-wrap { position: relative; }\n        .dt-search-input {\n          width: 220px; height: 38px;\n          padding: 0 38px 0 14px;\n          border-radius: 10px; border: 1px solid var(--border2);\n          background: var(--surface2); color: var(--text);\n          font-size: 13px; outline: none;\n          transition: border-color 0.2s, box-shadow 0.2s;\n          font-family: 'DM Sans', sans-serif;\n        }\n        .dt-search-input::placeholder { color: var(--text3); }\n        .dt-search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,106,247,0.12); }\n        .dt-search-icon {\n          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);\n          color: var(--text3); font-size: 14px; pointer-events: none;\n        }\n        .dt-icon-btn {\n          width: 38px; height: 38px; border-radius: 10px;\n          background: var(--surface2); border: 1px solid var(--border);\n          color: var(--text2); cursor: pointer; display: grid; place-items: center;\n          font-size: 16px; transition: all 0.15s; position: relative;\n        }\n        .dt-icon-btn:hover { border-color: var(--border2); color: var(--text); }\n        .dt-notif-badge {\n          position: absolute; top: -3px; right: -3px;\n          background: var(--red); color: white;\n          width: 16px; height: 16px; border-radius: 50%;\n          font-size: 9px; font-weight: 700;\n          display: flex; align-items: center; justify-content: center;\n          border: 2px solid var(--bg);\n        }\n        .dt-avatar {\n          width: 38px; height: 38px; border-radius: 10px;\n          background: linear-gradient(135deg, var(--accent), var(--accent2));\n          color: white; font-family: 'Syne', sans-serif; font-weight: 800;\n          font-size: 14px; display: grid; place-items: center;\n          box-shadow: 0 0 16px rgba(124,106,247,0.3); cursor: pointer;\n        }\n\n        /* \u2500\u2500 Body grid \u2500\u2500 */\n        .dt-body {\n          display: grid;\n          grid-template-columns: 220px minmax(0, 1fr) 280px;\n          gap: 20px;\n          padding: 20px 28px;\n          flex: 1;\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);\n        }\n\n        .dt-body.dt-body-collapsed {\n          grid-template-columns: 0 minmax(0, 1fr) 280px;\n        }\n\n        .dt-body.dt-body-collapsed .dt-sidebar {\n          display: none;\n        }\n\n        .dt-account-overlay {\n          position: fixed;\n          inset: 0;\n          z-index: 300;\n          background: rgba(0, 0, 0, 0.45);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          padding: 28px;\n        }\n\n        .dt-account-panel {\n          width: min(1080px, 100%);\n          max-height: calc(100vh - 56px);\n          overflow: auto;\n          background: rgba(8, 12, 27, 0.98);\n          border: 1px solid rgba(255, 255, 255, 0.08);\n          border-radius: 24px;\n          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);\n          position: relative;\n          padding: 24px;\n        }\n\n        .dt-account-close {\n          position: absolute;\n          top: 18px;\n          left: 18px;\n          color: var(--text);\n          background: rgba(255, 255, 255, 0.08);\n          border: 1px solid rgba(255, 255, 255, 0.12);\n          border-radius: 999px;\n          padding: 10px 14px;\n          font-size: 13px;\n          cursor: pointer;\n          transition: transform 0.15s ease, background 0.15s ease;\n        }\n\n        .dt-account-close:hover {\n          transform: translateX(-2px);\n          background: rgba(255, 255, 255, 0.12);\n        }\n\n        .dt-menu-btn {\n          width: 38px;\n          height: 38px;\n          border-radius: 10px;\n          border: 1px solid var(--border);\n          background: var(--surface2);\n          display: inline-flex;\n          align-items: center;\n          justify-content: center;\n          padding: 8px;\n          gap: 4px;\n          cursor: pointer;\n          transition: border-color 0.2s, color 0.2s, transform 0.2s;\n          color: var(--text2);\n        }\n\n        .dt-menu-btn:hover {\n          border-color: var(--border2);\n          color: var(--text);\n          transform: translateY(-1px);\n        }\n\n        .dt-menu-btn span {\n          display: block;\n          width: 18px;\n          height: 2px;\n          border-radius: 999px;\n          background: currentColor;\n        }\n\n        /* \u2500\u2500 Sidebar \u2500\u2500 */\n        .dt-sidebar {\n          display: flex; flex-direction: column; gap: 14px;\n          position: sticky; top: 84px; align-self: start;\n          max-height: calc(100vh - 104px); overflow-y: auto;\n        }\n        .dt-sidebar::-webkit-scrollbar { display: none; }\n\n        .dt-card {\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);\n          border: 1px solid rgba(255,255,255,0.08);\n          border-radius: 18px; padding: 16px; overflow: hidden;\n          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);\n        }\n\n        .dt-account-summary-card {\n          padding: 18px;\n          display: flex;\n          flex-direction: column;\n          gap: 16px;\n        }\n\n        .dt-account-summary-top {\n          display: flex;\n          align-items: center;\n          gap: 14px;\n        }\n\n        .dt-account-avatar {\n          width: 44px;\n          height: 44px;\n          border-radius: 14px;\n          background: rgba(255,255,255,0.08);\n          display: grid;\n          place-items: center;\n          color: #fff;\n          font-weight: 700;\n          font-size: 18px;\n        }\n\n        .dt-account-name {\n          font-size: 15px;\n          font-weight: 600;\n          color: #fff;\n        }\n\n        .dt-account-email,\n        .dt-account-uid {\n          font-size: 12px;\n          color: rgba(255,255,255,0.5);\n          margin-top: 4px;\n        }\n\n        .dt-account-badges {\n          display: flex;\n          gap: 8px;\n          flex-wrap: wrap;\n        }\n\n        .dt-badge {\n          padding: 6px 10px;\n          border-radius: 999px;\n          font-size: 11px;\n          font-weight: 600;\n          letter-spacing: 0.02em;\n        }\n\n        .dt-badge-unverified {\n          background: rgba(240,185,11,0.13);\n          color: #F0B90B;\n        }\n\n        .dt-badge-verified {\n          background: rgba(16,185,129,0.14);\n          color: #10B981;\n        }\n\n        .dt-badge-new {\n          background: rgba(146,120,255,0.16);\n          color: #c9b8ff;\n        }\n\n        .dt-kyc-banner {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          width: 100%;\n          padding: 14px;\n          border-radius: 16px;\n          border: 1px solid rgba(240,185,11,0.25);\n          background: rgba(240,185,11,0.08);\n          color: #fff;\n          cursor: pointer;\n          transition: transform 0.18s ease, box-shadow 0.18s ease;\n        }\n\n        .dt-kyc-banner:hover {\n          transform: translateY(-1px);\n          box-shadow: 0 10px 30px rgba(240,185,11,0.12);\n        }\n\n        .dt-kyc-icon {\n          width: 38px;\n          height: 38px;\n          border-radius: 14px;\n          display: grid;\n          place-items: center;\n          background: rgba(240,185,11,0.18);\n          font-size: 18px;\n        }\n\n        .dt-kyc-title {\n          font-size: 13px;\n          font-weight: 700;\n          color: #f8f3e8;\n        }\n\n        .dt-kyc-sub {\n          font-size: 11px;\n          color: rgba(255,255,255,0.72);\n          margin-top: 2px;\n        }\n\n        .dt-kyc-action {\n          font-size: 11px;\n          font-weight: 700;\n          color: #0f172a;\n          background: #f0b90b;\n          border-radius: 999px;\n          padding: 8px 12px;\n        }\n\n        .dt-limits-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 10px;\n        }\n\n        .dt-limit-card {\n          background: rgba(255,255,255,0.05);\n          border: 1px solid rgba(255,255,255,0.08);\n          border-radius: 14px;\n          padding: 12px;\n          min-width: 0;\n        }\n\n        .dt-limit-label {\n          font-size: 10px;\n          color: rgba(255,255,255,0.5);\n          text-transform: uppercase;\n          letter-spacing: 0.06em;\n          margin-bottom: 6px;\n        }\n\n        .dt-limit-value {\n          font-size: 14px;\n          font-weight: 700;\n          color: #fff;\n          margin-bottom: 4px;\n        }\n\n        .dt-limit-sub {\n          font-size: 11px;\n          color: rgba(255,255,255,0.55);\n        }\n\n        .dt-menu-card {\n          border-color: rgba(255,255,255,0.08);\n          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);\n        }\n\n        .dt-card-title {\n          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;\n          color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px;\n          margin-bottom: 12px;\n        }\n\n        .dt-side-btn {\n          display: flex; align-items: center; gap: 10px;\n          width: 100%; padding: 10px 12px; border-radius: 12px;\n          border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.02);\n          color: var(--text2); font-size: 13px; font-weight: 500;\n          cursor: pointer; transition: all 0.15s; text-align: left;\n          font-family: 'DM Sans', sans-serif;\n        }\n        .dt-side-btn:hover { background: rgba(255,255,255,0.06); color: var(--text); }\n        .dt-side-btn.active {\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.18), transparent 40%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.14), transparent 50%),\n            linear-gradient(180deg, rgba(10,26,42,0.95) 0%, rgba(6,18,31,0.95) 100%);\n          border-color: rgba(255,255,255,0.10);\n          color: var(--text);\n        }\n        .dt-side-btn.active .dt-side-icon { color: var(--accent2); }\n        .dt-side-icon { font-size: 15px; flex-shrink: 0; }\n        .dt-side-arrow { margin-left: auto; color: var(--text3); font-size: 12px; }\n\n        .dt-divider { height: 1px; background: var(--border); margin: 4px 0; }\n\n        /* Balance card in sidebar */\n        .dt-bal-card {\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);\n          border: 1px solid rgba(255,255,255,0.08);\n        }\n        .dt-bal-amount {\n          font-family: 'DM Mono', monospace; font-size: 20px; font-weight: 500;\n          color: var(--text); margin-bottom: 4px;\n        }\n        .dt-bal-sub { font-size: 11px; color: var(--text3); margin-bottom: 14px; }\n        .dt-deposit-btn {\n          display: flex; align-items: center; justify-content: center; gap: 6px;\n          width: 100%; padding: 10px; border-radius: 12px;\n          background: var(--accent); border: none;\n          color: white; font-size: 13px; font-weight: 600;\n          cursor: pointer; transition: opacity 0.15s;\n          font-family: 'DM Sans', sans-serif;\n        }\n        .dt-deposit-btn:hover { opacity: 0.88; }\n\n\n\n        /* \u2500\u2500 Main content \u2500\u2500 */\n        .dt-main { display: flex; flex-direction: column; gap: 16px; min-width: 0; }\n\n        /* Balance hero */\n        .dt-balance-hero {\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);\n          border: 1px solid rgba(255,255,255,0.08);\n          border-radius: 20px; overflow: hidden;\n          padding: 28px 28px 0;\n          position: relative;\n        }\n        .dt-hero-glow {\n          position: absolute; top: -40px; left: 50%; transform: translateX(-50%);\n          width: 300px; height: 200px;\n          background: radial-gradient(circle, rgba(124,106,247,0.15) 0%, transparent 70%);\n          pointer-events: none;\n        }\n        .dt-hero-label { font-size: 12px; color: var(--text3); letter-spacing: 0.5px; margin-bottom: 6px; }\n        .dt-hero-amount {\n          font-family: 'DM Mono', monospace; font-size: 38px; font-weight: 500;\n          color: var(--text); margin-bottom: 4px;\n        }\n        .dt-hero-amount span { font-size: 18px; color: var(--text2); margin-left: 6px; }\n        .dt-hero-sub { font-size: 13px; color: var(--text3); margin-bottom: 24px; }\n\n        /* Quick actions bar */\n        .dt-quick-actions {\n          display: grid; grid-template-columns: repeat(4, 1fr);\n          border-top: 1px solid rgba(255,255,255,0.08);\n        }\n        .dt-qa-item {\n          display: flex; flex-direction: column; align-items: center; gap: 8px;\n          padding: 16px 8px; cursor: pointer;\n          border-right: 1px solid var(--border);\n          transition: background 0.15s;\n        }\n        .dt-qa-item:last-child { border-right: none; }\n        .dt-qa-item:hover { background: var(--surface2); }\n        .dt-qa-icon {\n          width: 44px; height: 44px; border-radius: 14px;\n          display: flex; align-items: center; justify-content: center; font-size: 20px;\n        }\n        .dt-qa-label { font-size: 12px; color: var(--text2); font-weight: 500; }\n\n        /* Ticker strip */\n        .dt-ticker-outer {\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);\n          border: 1px solid rgba(255,255,255,0.08);\n          border-radius: 14px; overflow: hidden;\n        }\n        .dt-ticker-inner {\n          display: flex; gap: 0; overflow: hidden;\n        }\n        .dt-ticker-item {\n          display: flex; align-items: center; gap: 8px;\n          padding: 12px 20px; border-right: 1px solid var(--border);\n          flex: 1; min-width: 0;\n        }\n        .dt-ticker-item:last-child { border-right: none; }\n        .dt-tick-name { font-size: 12px; color: var(--text3); font-weight: 500; flex-shrink: 0; }\n        .dt-tick-price { font-size: 13px; color: var(--text); font-weight: 600; font-family: 'DM Mono', monospace; }\n        .dt-tick-change { font-size: 11px; font-weight: 600; flex-shrink: 0; font-family: 'DM Mono', monospace; }\n\n        /* Referral banner */\n        .dt-banner {\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);\n          border: 1px solid rgba(255,255,255,0.08);\n          border-radius: 16px; padding: 18px 22px;\n          display: flex; align-items: center; gap: 14px;\n          position: relative; overflow: hidden;\n        }\n        .dt-banner-glow {\n          position: absolute; right: -20px; top: -20px;\n          width: 120px; height: 120px;\n          background: radial-gradient(circle, rgba(124,106,247,0.18) 0%, transparent 70%);\n          pointer-events: none;\n        }\n        .dt-banner-icon {\n          width: 48px; height: 48px; border-radius: 14px;\n          background: rgba(124,106,247,0.15); display: grid; place-items: center;\n          font-size: 22px; flex-shrink: 0;\n        }\n        .dt-banner-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 3px; }\n        .dt-banner-sub { font-size: 12px; color: var(--text2); }\n        .dt-banner-btn {\n          margin-left: auto; flex-shrink: 0;\n          padding: 8px 18px; border-radius: 10px;\n          background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.3);\n          color: var(--accent2); font-size: 13px; font-weight: 600;\n          cursor: pointer; font-family: 'DM Sans', sans-serif;\n          transition: all 0.15s;\n        }\n        .dt-banner-btn:hover { background: rgba(124,106,247,0.25); }\n\n        /* Markets section */\n        .dt-section {\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);\n          border: 1px solid rgba(255,255,255,0.08);\n          border-radius: 20px; overflow: hidden;\n        }\n        .dt-section-header {\n          display: flex; align-items: center; justify-content: space-between;\n          padding: 16px 20px 0;\n        }\n        .dt-section-title {\n          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--text);\n        }\n        .dt-section-link {\n          font-size: 12px; color: var(--accent2); cursor: pointer;\n          background: none; border: none; font-family: 'DM Sans', sans-serif;\n        }\n        .dt-tabs {\n          display: flex; gap: 4px; padding: 12px 20px 0;\n          border-bottom: 1px solid rgba(255,255,255,0.08);\n        }\n        .dt-tab {\n          padding: 8px 14px 10px; font-size: 13px; color: var(--text3);\n          cursor: pointer; border: none; background: transparent;\n          border-bottom: 2px solid transparent; margin-bottom: -1px;\n          transition: color 0.15s; font-family: 'DM Sans', sans-serif; font-weight: 500;\n        }\n        .dt-tab.active { color: var(--accent2); border-bottom-color: var(--accent2); }\n        .dt-tab:hover { color: var(--text2); }\n\n        /* Market rows */\n        .dt-mkt-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n        }\n        .dt-mkt-row {\n          display: flex; align-items: center; gap: 12px;\n          padding: 13px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);\n          border-right: 1px solid rgba(255,255,255,0.08);\n          cursor: pointer; transition: background 0.15s;\n          background: transparent; border-width: 0 1px 1px 0;\n          border-style: solid; border-color: rgba(255,255,255,0.08);\n          width: 100%; text-align: left;\n        }\n        .dt-mkt-row:nth-child(2n) { border-right: none; }\n        .dt-mkt-row:nth-last-child(-n+2) { border-bottom: none; }\n        .dt-mkt-row:hover { background: var(--surface2); }\n        .dt-coin-dot {\n          width: 36px; height: 36px; border-radius: 50%;\n          display: flex; align-items: center; justify-content: center;\n          font-weight: 600; flex-shrink: 0; font-size: 13px;\n        }\n        .dt-mkt-name { font-size: 14px; color: var(--text); font-weight: 600; }\n        .dt-mkt-vol { font-size: 11px; color: var(--text3); margin-top: 2px; }\n        .dt-mkt-price { font-size: 14px; color: var(--text); font-weight: 600; font-family: 'DM Mono', monospace; }\n        .dt-mkt-change { font-size: 11px; margin-top: 2px; font-family: 'DM Mono', monospace; font-weight: 500; }\n\n        /* News */\n        .dt-news-grid {\n          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\n          padding: 16px;\n        }\n        .dt-news-item {\n          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),\n            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),\n            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),\n            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);\n          border: 1px solid rgba(255,255,255,0.08);\n          border-radius: 12px; padding: 14px;\n          cursor: pointer; transition: border-color 0.15s;\n          display: block; text-align: left; width: 100%;\n          font-family: 'DM Sans', sans-serif;\n        }\n        .dt-news-item:hover { border-color: rgba(255,255,255,0.12); }\n        .dt-news-src { font-size: 10px; color: var(--text3); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }\n        .dt-news-title { font-size: 13px; color: var(--text); line-height: 1.45; margin-bottom: 8px; }\n        .dt-news-time { font-size: 11px; color: var(--text3); }\n\n        /* \u2500\u2500 Right panel \u2500\u2500 */\n        .dt-right {\n          display: flex; flex-direction: column; gap: 14px;\n          position: sticky; top: 84px; align-self: start;\n          max-height: calc(100vh - 104px); overflow-y: auto;\n        }\n        .dt-right::-webkit-scrollbar { display: none; }\n\n        /* Live prices */\n        .dt-price-row {\n          display: flex; align-items: center; justify-content: space-between;\n          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);\n        }\n        .dt-price-row:last-child { border-bottom: none; }\n        .dt-pr-symbol { display: flex; align-items: center; gap: 8px; }\n        .dt-pr-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }\n        .dt-pr-name { font-size: 13px; color: var(--text); font-weight: 500; }\n        .dt-pr-vol { font-size: 11px; color: var(--text3); }\n        .dt-pr-right { text-align: right; }\n        .dt-pr-price { font-size: 13px; color: var(--text); font-weight: 600; font-family: 'DM Mono', monospace; }\n        .dt-pr-change { font-size: 11px; font-family: 'DM Mono', monospace; font-weight: 500; }\n\n        /* Insights */\n        .dt-insight-row {\n          display: flex; align-items: center; justify-content: space-between;\n          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);\n        }\n        .dt-insight-row:last-child { border-bottom: none; }\n        .dt-insight-label { font-size: 12px; color: var(--text2); }\n        .dt-pill {\n          padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600;\n          background: rgba(14,203,129,0.12); color: var(--green);\n          font-family: 'DM Mono', monospace;\n        }\n\n        .dt-ticker-container {\n          background: rgba(255, 255, 255, 0.03);\n          border: 1px solid var(--border);\n          border-radius: 12px;\n          overflow: hidden;\n          position: relative;\n          height: 48px;\n          display: flex;\n          align-items: center;\n          margin-top: 15px;\n        }\n\n        .dt-ticker-track {\n          display: flex;\n          width: max-content;\n          animation: scrollTicker 30s linear infinite;\n        }\n\n        .dt-ticker-track:hover {\n          animation-play-state: paused;\n        }\n\n        @keyframes scrollTicker {\n          0% { transform: translateX(0); }\n          100% { transform: translateX(-50%); }\n        }\n\n        .dt-ticker-item {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 0 30px;\n          white-space: nowrap;\n          border-right: 1px solid var(--border);\n        }\n      \n        .dt-pill.warn { background: rgba(240,185,11,0.12); color: var(--gold); }\n\n        /* Summary line */\n        .dt-summary-line {\n          display: flex; justify-content: space-between; align-items: center;\n          padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08);\n        }\n        .dt-summary-line:last-child { border-bottom: none; }\n        .dt-sum-label { font-size: 12px; color: var(--text3); }\n        .dt-sum-val { font-size: 13px; font-weight: 600; color: var(--text); font-family: 'DM Mono', monospace; }\n\n        /* Responsive */\n        @media (max-width: 1100px) {\n          .dt-body { grid-template-columns: 200px minmax(0, 1fr); }\n          .dt-right { display: none; }\n        }\n        @media (max-width: 767px) {\n          .dt-body { display: none; }\n        }\n      " }), (0, _i.jsxs)("div", { className: "dt-root", children: [(0, _i.jsxs)("header", { className: "dt-topbar", children: [(0, _i.jsxs)("div", { style: { display: "flex", alignItems: "center" }, children: [(0, _i.jsxs)("div", { className: "dt-logo-wrap", children: [(0, _i.jsx)("img", { src: Ui, className: "dt-logo-img", alt: "SwanCore" }), (0, _i.jsxs)("span", { className: "dt-logo-text", children: ["S", (0, _i.jsx)("span", { children: "wancore" })] })] }), (0, _i.jsx)("nav", { className: "dt-nav", children: Js.map(e => (0, _i.jsx)("button", { className: "dt-nav-btn".concat(a === e ? " active" : ""), onClick: () => (e => { var t; o(e), l(e), W("Account" !== e && null !== (t = { Markets: "/markets", Trade: "/trade" }[e]) && void 0 !== t ? t : "/home"); })(e), children: e }, e)) })] }), (0, _i.jsxs)("div", { className: "dt-top-right", children: [(0, _i.jsxs)("div", { className: "dt-search-wrap", children: [(0, _i.jsx)("input", { className: "dt-search-input", value: f, onChange: e => g(e.target.value), placeholder: "Search markets\u2026" }), (0, _i.jsx)("span", { className: "dt-search-icon", children: "\u2315" })] }), (0, _i.jsxs)("button", { className: "dt-icon-btn", "aria-label": "Notifications", onClick: () => N(!0), children: ["\ud83d\udd14", T > 0 && (0, _i.jsx)("span", { className: "dt-notif-badge", children: T > 99 ? "99+" : T })] }), (0, _i.jsxs)("button", { className: "dt-menu-btn", "aria-label": "Toggle menu", onClick: () => j(e => !e), children: [(0, _i.jsx)("span", {}), (0, _i.jsx)("span", {}), (0, _i.jsx)("span", {})] })] })] }), (0, _i.jsxs)("div", { className: K, children: [(0, _i.jsxs)("aside", { className: "dt-sidebar", children: [(0, _i.jsxs)("div", { className: "dt-card dt-account-summary-card", children: [(0, _i.jsxs)("div", { className: "dt-account-summary-top", children: [(0, _i.jsx)("div", { className: "dt-account-avatar", children: _ }), (0, _i.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [(0, _i.jsx)("div", { className: "dt-account-name", children: U }), (0, _i.jsx)("div", { className: "dt-account-email", children: M }), (0, _i.jsxs)("div", { className: "dt-account-uid", children: ["UID: ", I] })] })] }), (0, _i.jsx)("div", { className: "dt-account-badges", style: { display: "flex", justifyContent: "center", marginTop: "12px" }, children: (0, _i.jsx)("div", { className: "dt-badge ".concat(null !== t && void 0 !== t && t.kycVerified ? "dt-badge-verified" : "dt-badge-unverified"), children: null !== t && void 0 !== t && t.kycVerified ? "\u2713 Verified" : "\u26a0 Unverified" }) })] }), (0, _i.jsx)("div", { className: "dt-divider" }), (0, _i.jsxs)("div", { className: "dt-card", style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [(0, _i.jsx)("div", { className: "dt-card-title", children: "Account" }), Qs.map(e => { const n = e.label.toLowerCase().includes("verification") && (null === t || void 0 === t ? void 0 : t.kycVerified); return (0, _i.jsxs)("button", { className: "dt-side-btn", onClick: () => { !n && e.link && W(e.link); }, style: { cursor: "pointer", opacity: n ? .7 : 1 }, disabled: n, children: [(0, _i.jsx)("span", { className: "dt-side-icon", children: e.icon }), (0, _i.jsx)("span", { children: n ? "KYC Verified" : e.label }), !n && (0, _i.jsx)("span", { className: "dt-side-arrow", children: "\u203a" })] }, e.label); })] }), (0, _i.jsxs)("div", { className: "dt-card", children: [(0, _i.jsx)("div", { className: "dt-card-title", children: "Your account" }), (0, _i.jsxs)("div", { className: "dt-summary-line", children: [(0, _i.jsx)("span", { className: "dt-sum-label", children: "24h P&L" }), (0, _i.jsx)("span", { className: "dt-sum-val", style: { color: "var(--text3)" }, children: "\u2014" })] }), (0, _i.jsxs)("div", { className: "dt-summary-line", children: [(0, _i.jsx)("span", { className: "dt-sum-label", children: "7d P&L" }), (0, _i.jsx)("span", { className: "dt-sum-val", style: { color: "var(--text3)" }, children: "\u2014" })] }), (0, _i.jsxs)("div", { className: "dt-summary-line", children: [(0, _i.jsx)("span", { className: "dt-sum-label", children: "Open positions" }), (0, _i.jsx)("span", { className: "dt-sum-val", children: "0" })] }), (0, _i.jsxs)("div", { className: "dt-summary-line", children: [(0, _i.jsx)("span", { className: "dt-sum-label", children: "KYC status" }), (0, _i.jsx)("span", { style: { fontSize: 11, color: "var(--gold)", background: "rgba(240,185,11,0.1)", padding: "3px 8px", borderRadius: 6 }, children: "Pending" })] })] })] }), (0, _i.jsx)("main", { className: "dt-main", children: "Account" === a ? (0, _i.jsx)("div", { className: "dt-account-content", children: (0, _i.jsx)(Us, { onNavigate: e => "markets" === e ? W("/markets") : "trade" === e ? W("/trade") : "home" === e ? W("/home") : void o("Dashboard"), showTopBar: !1, showBottomNav: !1 }) }) : (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsxs)("div", { className: "dt-balance-hero", children: [(0, _i.jsx)("div", { className: "dt-hero-glow" }), (0, _i.jsx)("div", { className: "dt-hero-label", children: "Total balance" }), (0, _i.jsxs)("div", { className: "dt-hero-amount", children: [O.toFixed(2), (0, _i.jsx)("span", { children: "USDT" })] }), (0, _i.jsx)("div", { className: "dt-hero-sub", children: O > 0 ? "Simplified Trading" : "No change \xb7 deposit to get started" }), (0, _i.jsx)("div", { className: "dt-quick-actions", children: [{ label: "Deposit", icon: "\uff0b", bg: "rgba(14,203,129,0.12)", color: "#0ecb81" }, { label: "Withdraw", icon: "\u2191", bg: "rgba(55,138,221,0.12)", color: "#378ADD" }, { label: "Trade", icon: "\u21c4", bg: "rgba(124,106,247,0.12)", color: "#a78bfa" }, { label: "Transfer", icon: "\u27a4", bg: "rgba(93,202,165,0.12)", color: "#5DCAA5" }].map((e, t) => (0, _i.jsxs)("div", { className: "dt-qa-item", children: [(0, _i.jsx)("div", { className: "dt-qa-icon", style: { background: e.bg }, children: (0, _i.jsx)("span", { style: { fontSize: 20, color: e.color }, children: e.icon }) }), (0, _i.jsx)("span", { className: "dt-qa-label", children: e.label })] }, t)) })] }), (0, _i.jsx)("div", { className: "dt-ticker-container", children: (0, _i.jsx)("div", { className: "dt-ticker-track", children: [...Ys, ...Ys].map((e, t) => (0, _i.jsxs)("div", { className: "dt-ticker-item", children: [(0, _i.jsx)("span", { style: { fontWeight: 700, color: "var(--accent2)" }, children: e.symbol }), (0, _i.jsx)("span", { style: { fontFamily: "DM Mono", fontWeight: 500 }, children: e.price }), (0, _i.jsxs)("span", { style: { fontSize: 12, fontWeight: 600, color: e.change >= 0 ? "var(--green)" : "var(--red)" }, children: [e.change >= 0 ? "\u25b2" : "\u25bc", " ", Math.abs(e.change), "%"] })] }, t)) }) }), (0, _i.jsxs)("div", { className: "dt-banner", children: [(0, _i.jsx)("div", { className: "dt-banner-glow" }), (0, _i.jsx)("div", { className: "dt-banner-icon", children: "\ud83c\udf81" }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("div", { className: "dt-banner-title", children: "Refer a friend, earn 50 USDT" }), (0, _i.jsx)("div", { className: "dt-banner-sub", children: "Invite friends and earn commission rewards on every trade" })] }), (0, _i.jsx)("button", { className: "dt-banner-btn", children: "Invite now" })] }), (0, _i.jsxs)("div", { className: "dt-section", children: [(0, _i.jsxs)("div", { className: "dt-section-header", children: [(0, _i.jsx)("span", { className: "dt-section-title", children: "Markets" }), (0, _i.jsx)("button", { className: "dt-section-link", onClick: () => W("/markets"), children: "See all \u2192" })] }), (0, _i.jsx)("div", { className: "dt-tabs", children: ["Hot", "Gainers", "Losers", "New", "Live"].map(e => (0, _i.jsx)("button", { className: "dt-tab".concat(d === e ? " active" : ""), onClick: () => p(e), children: e }, e)) }), (0, _i.jsx)("div", { className: "dt-mkt-grid", children: ("Hot" === d ? Vs : "Gainers" === d ? Vs.filter(e => e.change > 0) : "Losers" === d ? Vs.filter(e => e.change < 0) : "New" === d ? Gs : "Live" === d ? Ys : Vs).map(e => { var t, n, r, i; return (0, _i.jsxs)("button", { className: "dt-mkt-row", onClick: () => W("/markets"), children: [(0, _i.jsx)("div", { className: "dt-coin-dot", style: { background: null !== (t = null === (n = Xs[e.symbol]) || void 0 === n ? void 0 : n.bg) && void 0 !== t ? t : "#ffffff11", color: null !== (r = null === (i = Xs[e.symbol]) || void 0 === i ? void 0 : i.color) && void 0 !== r ? r : "#fff", fontSize: e.symbol.length > 1 ? 10 : 14 }, children: e.symbol }), (0, _i.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [(0, _i.jsx)("div", { className: "dt-mkt-name", children: e.pair }), (0, _i.jsx)("div", { className: "dt-mkt-vol", children: e.volume })] }), (0, _i.jsx)(Zs, { up: e.sparkUp }), (0, _i.jsxs)("div", { style: { textAlign: "right", flexShrink: 0 }, children: [(0, _i.jsx)("div", { className: "dt-mkt-price", children: e.price }), (0, _i.jsxs)("div", { className: "dt-mkt-change", style: { color: e.change > 0 ? "var(--green)" : e.change < 0 ? "var(--red)" : "var(--text3)" }, children: [e.change > 0 ? "+" : "", e.change.toFixed(2), "%"] })] })] }, e.pair); }) })] }), (0, _i.jsxs)("div", { className: "dt-section", children: [(0, _i.jsxs)("div", { className: "dt-section-header", style: { paddingBottom: 4 }, children: [(0, _i.jsx)("span", { className: "dt-section-title", children: "Latest News" }), (0, _i.jsx)("button", { className: "dt-section-link", onClick: () => W("/news"), children: "More \u2192" })] }), (0, _i.jsx)("div", { className: "dt-news-grid", children: F.map(e => (0, _i.jsxs)("button", { className: "dt-news-item", onClick: () => W("/news"), children: [(0, _i.jsx)("div", { className: "dt-news-src", children: e.src }), (0, _i.jsx)("div", { className: "dt-news-title", children: e.title }), (0, _i.jsx)("div", { className: "dt-news-time", children: e.time })] }, e.id)) })] })] }) }), (0, _i.jsxs)("aside", { className: "dt-right", children: [(0, _i.jsxs)("div", { className: "dt-card", children: [(0, _i.jsx)("div", { className: "dt-card-title", children: "Live prices" }), qs.map(e => { var t, n; return (0, _i.jsxs)("div", { className: "dt-price-row", children: [(0, _i.jsxs)("div", { className: "dt-pr-symbol", children: [(0, _i.jsx)("div", { className: "dt-pr-dot", style: { background: null !== (t = null === (n = Xs["BTC" === e.name ? "\u20bf" : "ETH" === e.name ? "\u039e" : e.name]) || void 0 === n ? void 0 : n.color) && void 0 !== t ? t : "var(--text3)" } }), (0, _i.jsx)("div", { children: (0, _i.jsx)("div", { className: "dt-pr-name", children: e.name }) })] }), (0, _i.jsxs)("div", { className: "dt-pr-right", children: [(0, _i.jsx)("div", { className: "dt-pr-price", children: e.price }), (0, _i.jsx)("div", { className: "dt-pr-change", style: { color: e.up ? "var(--green)" : "var(--red)" }, children: e.change })] })] }, e.name); })] }), (0, _i.jsxs)("div", { className: "dt-card", children: [(0, _i.jsx)("div", { className: "dt-card-title", children: "Market insights" }), (0, _i.jsxs)("div", { className: "dt-insight-row", children: [(0, _i.jsx)("span", { className: "dt-insight-label", children: "Market momentum" }), (0, _i.jsx)("span", { className: "dt-pill", children: "Strong \u2191" })] }), (0, _i.jsxs)("div", { className: "dt-insight-row", children: [(0, _i.jsx)("span", { className: "dt-insight-label", children: "BTC dominance" }), (0, _i.jsx)("span", { style: { fontSize: 13, color: "var(--text)", fontWeight: 600, fontFamily: "'DM Mono', monospace" }, children: "54.2%" })] }), (0, _i.jsxs)("div", { className: "dt-insight-row", children: [(0, _i.jsx)("span", { className: "dt-insight-label", children: "Fear & Greed" }), (0, _i.jsx)("span", { className: "dt-pill warn", children: "72 \xb7 Greed" })] }), (0, _i.jsxs)("div", { className: "dt-insight-row", children: [(0, _i.jsx)("span", { className: "dt-insight-label", children: "24h Volume" }), (0, _i.jsx)("span", { style: { fontSize: 13, color: "var(--text)", fontWeight: 600, fontFamily: "'DM Mono', monospace" }, children: "$86.4B" })] })] })] })] })] }), "Account" === a && (0, _i.jsx)("div", { className: "dt-account-overlay", onClick: q, children: (0, _i.jsxs)("div", { className: "dt-account-panel", onClick: e => e.stopPropagation(), children: [(0, _i.jsx)("button", { className: "dt-account-close", onClick: q, children: "\u2190 Back to dashboard" }), (0, _i.jsx)(Us, { onNavigate: e => "markets" === e ? W("/markets") : "trade" === e ? W("/trade") : "home" === e ? W("/home") : void o("Dashboard"), showTopBar: !1, showBottomNav: !1 })] }) }), (0, _i.jsx)($s, { notifications: b, isVisible: S, onClose: () => N(!1), onMarkAsRead: async (e) => { try {
                    (await fetch("".concat("http://localhost:5000", "/api/notifications/").concat(e, "/read"), { method: "PUT", headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")) } })).ok && (y(t => t.map(t => t.id === e ? m(m({}, t), {}, { isRead: !0 }) : t)), A(e => Math.max(0, e - 1)));
                }
                catch (t) { } }, onMarkAllAsRead: async () => { try {
                    await fetch("".concat("http://localhost:5000", "/api/notifications/mark-all-read"), { method: "PUT", headers: { Authorization: "Bearer ".concat(localStorage.getItem("token")) } }), y(e => e.map(e => m(m({}, e), {}, { isRead: !0 }))), A(0);
                }
                catch (e) { } } })] }); }, tl = () => { const e = u((0, r.useState)(() => "undefined" !== typeof window && window.innerWidth <= 768), 2), t = e[0], n = e[1], i = (0, r.useCallback)(() => { n(window.innerWidth <= 768); }, []); return (0, r.useEffect)(() => { let e; const t = () => { clearTimeout(e), e = setTimeout(i, 100); }; return window.addEventListener("resize", t), () => { clearTimeout(e), window.removeEventListener("resize", t); }; }, [i]), t ? (0, _i.jsx)(Hs, {}) : (0, _i.jsx)(el, {}); }, nl = "http://localhost:5000".replace(/\/+$/, ""), rl = Ai.create({ baseURL: nl, headers: { "Content-Type": "application/json" }, timeout: 1e4 });
    async function il() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1, r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 25; return (await rl.get("/api/admin/users", { params: { search: e, status: t, page: n, limit: r } })).data; }
    async function al(e) { return (await rl.get("/api/admin/user/".concat(e))).data; }
    async function ol(e) { return (await rl.get("/api/admin/deposits", { params: { userId: e } })).data; }
    async function sl(e) { return (await rl.get("/api/admin/withdrawals", { params: { userId: e } })).data; }
    async function ll(e) { return (await rl.get("/api/admin/balance-history/".concat(e))).data; }
    function cl() { localStorage.removeItem("adminToken"), localStorage.removeItem("adminEmail"); }
    rl.interceptors.request.use(e => { const t = localStorage.getItem("adminToken"); return t && (e.headers.Authorization = "Bearer ".concat(t)), e; });
    const dl = () => { const e = kt(), t = u((0, r.useState)(""), 2), n = t[0], i = t[1], a = u((0, r.useState)(""), 2), o = a[0], s = a[1], l = u((0, r.useState)(!1), 2), c = l[0], d = l[1], p = u((0, r.useState)(!1), 2), h = p[0], f = p[1], g = u((0, r.useState)(null), 2), m = g[0], x = g[1], b = u((0, r.useState)(null), 2), y = b[0], v = b[1]; return (0, _i.jsx)("div", { className: "login-page", children: (0, _i.jsx)("div", { className: "login-container", children: (0, _i.jsxs)("div", { className: "login-card", children: [(0, _i.jsxs)("div", { className: "login-header", children: [(0, _i.jsx)("img", { src: Ui, alt: "SwanCore Logo", className: "login-logo" }), (0, _i.jsx)("h1", { children: "Admin Login" }), (0, _i.jsx)("p", { children: "Secure admin access only" })] }), m && (0, _i.jsx)("div", { className: "login-alert ".concat(y), children: m }), (0, _i.jsxs)("form", { onSubmit: async (t) => { if (t.preventDefault(), x(null), !n.trim() || !(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))(n))
                            return v("error"), void x("Please provide a valid email address."); if (!o.trim())
                            return v("error"), void x("Password is required."); f(!0); try {
                            const t = await async function (e, t) { return (await rl.post("/api/admin/login", { email: e.toLowerCase().trim(), password: t.trim() })).data; }(n, o);
                            t.token && (localStorage.setItem("adminToken", t.token), localStorage.setItem("adminEmail", n.toLowerCase().trim()), v("success"), x("Admin login successful. Redirecting to dashboard..."), setTimeout(() => { e("/admin"); }, 1200));
                        }
                        catch (a) {
                            var r, i;
                            v("error"), x((null === a || void 0 === a || null === (r = a.response) || void 0 === r || null === (i = r.data) || void 0 === i ? void 0 : i.message) || "Admin login failed. Check your credentials.");
                        }
                        finally {
                            f(!1);
                        } }, className: "login-form", children: [(0, _i.jsxs)("div", { className: "form-group", children: [(0, _i.jsx)("label", { htmlFor: "email", children: "Email Address" }), (0, _i.jsx)("input", { id: "email", type: "email", value: n, onChange: e => i(e.target.value), placeholder: "admin@swancore.com" })] }), (0, _i.jsxs)("div", { className: "form-group", children: [(0, _i.jsx)("label", { htmlFor: "password", children: "Password" }), (0, _i.jsxs)("div", { className: "password-input", children: [(0, _i.jsx)("input", { id: "password", type: c ? "text" : "password", value: o, onChange: e => s(e.target.value), placeholder: "Enter admin password" }), (0, _i.jsx)("button", { type: "button", className: "password-toggle", onClick: () => d(!c), children: c ? (0, _i.jsx)(Fi, {}) : (0, _i.jsx)(Mi, {}) })] })] }), (0, _i.jsx)("button", { className: "login-btn", type: "submit", disabled: h, children: h ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)(Ii, { className: "spinner" }), " Signing In..."] }) : "Sign In" })] }), (0, _i.jsx)("div", { className: "login-links", children: (0, _i.jsxs)("p", { children: ["Not an admin? ", (0, _i.jsx)("a", { href: "/login", className: "link", children: "Go to user login" })] }) })] }) }) }); }, ul = () => { var e, t, n, i, a, o, s, l, c, d, p, h, f, g, m, x, b, y, v, w, j, k, S; const N = kt(), C = u((0, r.useState)(!0), 2), T = C[0], A = C[1], E = u((0, r.useState)({}), 2), R = E[0], P = E[1], L = u((0, r.useState)([]), 2), O = L[0], z = L[1], B = u((0, r.useState)(null), 2), D = B[0], F = B[1], M = u((0, r.useState)(!1), 2), I = M[0], U = M[1], _ = u((0, r.useState)(!1), 2), W = _[0], H = _[1], V = u((0, r.useState)(null), 2), q = V[0], K = V[1]; (0, r.useEffect)(() => { if (!localStorage.getItem("adminToken"))
        return void N("/admin/login"); async function e() { try {
        const e = await async function () { return (await rl.get("/api/admin/stats")).data; }();
        P(e);
    }
    catch (Rl) {
        console.error(Rl), K("Unable to load admin stats. Please sign in again.");
    } } async function t() { try {
        const e = await async function () { return (await rl.get("/api/admin/kyc-submissions")).data; }();
        z(e.submissions || []);
    }
    catch (Rl) {
        console.error(Rl);
    } } let n; return async function () { try {
        await Promise.all([e(), t()]);
    }
    finally {
        A(!1);
    } }(), (async () => { try {
        n = await Ao(), n.on("kycSubmitted", t);
    }
    catch (Rl) {
        console.error("Socket error:", Rl);
    } })(), () => { n && n.off("kycSubmitted", t); }; }, [N]); const G = () => { F(null), U(!1); }; return (0, _i.jsxs)("div", { className: "admin-page", children: [(0, _i.jsxs)("div", { className: "admin-header", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h1", { children: "Admin Dashboard" }), (0, _i.jsx)("p", { children: "Control center for platform monitoring" })] }), (0, _i.jsx)("button", { className: "admin-logout", onClick: () => { cl(), N("/admin/login"); }, children: "Logout" })] }), (0, _i.jsxs)("div", { className: "admin-nav", children: [(0, _i.jsx)("button", { onClick: () => N("/admin/users"), children: "Users" }), (0, _i.jsx)("button", { onClick: () => N("/admin/deposits"), children: "Deposits" }), (0, _i.jsx)("button", { onClick: () => N("/admin/withdrawals"), children: "Withdrawals" }), (0, _i.jsx)("button", { onClick: () => N("/admin/balances"), children: "Balances" })] }), T ? (0, _i.jsx)("p", { children: "Loading dashboard..." }) : q ? (0, _i.jsx)("div", { className: "admin-error", children: q }) : (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsxs)("div", { className: "admin-card-grid", children: [(0, _i.jsxs)("div", { className: "admin-card", children: [(0, _i.jsx)("h3", { children: "Users" }), (0, _i.jsx)("p", { children: null !== (e = R.totalUsers) && void 0 !== e ? e : 0 })] }), (0, _i.jsxs)("div", { className: "admin-card", children: [(0, _i.jsx)("h3", { children: "Pending Deposits" }), (0, _i.jsx)("p", { children: null !== (t = R.pendingDeposits) && void 0 !== t ? t : 0 })] }), (0, _i.jsxs)("div", { className: "admin-card", children: [(0, _i.jsx)("h3", { children: "Pending Withdrawals" }), (0, _i.jsx)("p", { children: null !== (n = R.pendingWithdrawals) && void 0 !== n ? n : 0 })] }), (0, _i.jsxs)("div", { className: "admin-card", children: [(0, _i.jsx)("h3", { children: "Pending KYC Submissions" }), (0, _i.jsx)("p", { children: null !== (i = R.pendingKycCount) && void 0 !== i ? i : 0 })] }), (0, _i.jsxs)("div", { className: "admin-card", children: [(0, _i.jsx)("h3", { children: "Total Platform Balance" }), (0, _i.jsxs)("p", { children: ["$", null !== (a = null === (o = R.totalPlatformBalance) || void 0 === o ? void 0 : o.toLocaleString(void 0, { maximumFractionDigits: 2 })) && void 0 !== a ? a : 0] })] })] }), (0, _i.jsxs)("section", { className: "admin-section", children: [(0, _i.jsx)("div", { className: "admin-section-header", children: (0, _i.jsx)("h2", { children: "Recent KYC Submissions" }) }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "User" }), (0, _i.jsx)("th", { children: "Email" }), (0, _i.jsx)("th", { children: "Status" }), (0, _i.jsx)("th", { children: "Submitted" }), (0, _i.jsx)("th", { children: "Action" })] }) }), (0, _i.jsx)("tbody", { children: O.length ? O.map(e => (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("td", { children: e.name }), (0, _i.jsx)("td", { children: e.email }), (0, _i.jsx)("td", { children: e.kycVerified ? "Verified" : e.kycStatus || "Pending" }), (0, _i.jsx)("td", { children: e.submittedAt ? new Date(e.submittedAt).toLocaleString() : "\u2014" }), (0, _i.jsx)("td", { children: (0, _i.jsx)("button", { className: "admin-table-button", onClick: () => (async (e) => { try {
                                                                H(!0);
                                                                const t = await al(e);
                                                                F(t.user), U(!0);
                                                            }
                                                            catch (Rl) {
                                                                console.error(Rl), K("Unable to load KYC details.");
                                                            }
                                                            finally {
                                                                H(!1);
                                                            } })(e.id), children: "View KYC" }) })] }, e.id)) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 5, children: "No KYC submissions yet." }) }) })] }) })] }), (0, _i.jsxs)("section", { className: "admin-section", children: [(0, _i.jsx)("div", { className: "admin-section-header", children: (0, _i.jsx)("h2", { children: "Recent Transactions" }) }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "User" }), (0, _i.jsx)("th", { children: "Type" }), (0, _i.jsx)("th", { children: "Amount" }), (0, _i.jsx)("th", { children: "Description" }), (0, _i.jsx)("th", { children: "Date" })] }) }), (0, _i.jsx)("tbody", { children: Array.isArray(R.recentTransactions) && R.recentTransactions.length ? R.recentTransactions.map(e => { var t, n; return (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("td", { children: (null === (t = e.userId) || void 0 === t ? void 0 : t.email) || (null === (n = e.userId) || void 0 === n ? void 0 : n.name) || "Unknown" }), (0, _i.jsx)("td", { children: e.type }), (0, _i.jsxs)("td", { children: ["$", Number(e.amount).toFixed(2)] }), (0, _i.jsx)("td", { children: e.description || "\u2014" }), (0, _i.jsx)("td", { children: new Date(e.createdAt).toLocaleString() })] }, e._id); }) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 5, children: "No recent transactions available." }) }) })] }) })] }), I && D && (0, _i.jsx)("div", { className: "admin-modal-backdrop", onClick: G, children: (0, _i.jsxs)("div", { className: "admin-modal", onClick: e => e.stopPropagation(), children: [(0, _i.jsxs)("div", { className: "admin-modal-header", children: [(0, _i.jsx)("h3", { children: "KYC Submission" }), (0, _i.jsx)("button", { className: "admin-modal-close", onClick: G, children: "\xd7" })] }), W ? (0, _i.jsx)("div", { children: "Loading..." }) : (0, _i.jsxs)("div", { children: [(0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Name:" }), " ", D.name || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Email:" }), " ", D.email] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "KYC Status:" }), " ", D.kycVerified ? "Verified" : D.kycStatus || "Pending"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Submitted:" }), " ", null !== (s = D.kycSubmission) && void 0 !== s && s.submittedAt ? new Date(D.kycSubmission.submittedAt).toLocaleString() : "\u2014"] }), (0, _i.jsxs)("div", { className: "admin-modal-section", children: [(0, _i.jsx)("h4", { children: "Personal Data" }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Full Name:" }), " ", (null === (l = D.kycSubmission) || void 0 === l || null === (c = l.personal) || void 0 === c ? void 0 : c.fullName) || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "DOB:" }), " ", (null === (d = D.kycSubmission) || void 0 === d || null === (p = d.personal) || void 0 === p ? void 0 : p.dob) || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Country:" }), " ", (null === (h = D.kycSubmission) || void 0 === h || null === (f = h.personal) || void 0 === f ? void 0 : f.country) || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Address:" }), " ", (null === (g = D.kycSubmission) || void 0 === g || null === (m = g.personal) || void 0 === m ? void 0 : m.address) || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "City:" }), " ", (null === (x = D.kycSubmission) || void 0 === x || null === (b = x.personal) || void 0 === b ? void 0 : b.city) || "\u2014"] })] }), (0, _i.jsxs)("div", { className: "admin-modal-section", children: [(0, _i.jsx)("h4", { children: "Documents" }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("strong", { children: "Front:" }), null !== (y = D.kycSubmission) && void 0 !== y && null !== (v = y.documentFront) && void 0 !== v && v.data ? (0, _i.jsx)("img", { src: D.kycSubmission.documentFront.data, alt: "Front document", style: { maxWidth: "100%", maxHeight: 280, display: "block", margin: "12px 0" } }) : (0, _i.jsx)("div", { children: "No front document uploaded." })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("strong", { children: "Back:" }), null !== (w = D.kycSubmission) && void 0 !== w && null !== (j = w.documentBack) && void 0 !== j && j.data ? (0, _i.jsx)("img", { src: D.kycSubmission.documentBack.data, alt: "Back document", style: { maxWidth: "100%", maxHeight: 280, display: "block", margin: "12px 0" } }) : (0, _i.jsx)("div", { children: "No back document uploaded." })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("strong", { children: "Selfie:" }), null !== (k = D.kycSubmission) && void 0 !== k && null !== (S = k.selfie) && void 0 !== S && S.data ? (0, _i.jsx)("img", { src: D.kycSubmission.selfie.data, alt: "Selfie", style: { maxWidth: "100%", maxHeight: 280, display: "block", margin: "12px 0" } }) : (0, _i.jsx)("div", { children: "No selfie uploaded." })] })] })] })] }) })] })] }); }, pl = () => { const e = kt(), t = u((0, r.useState)([]), 2), n = t[0], i = t[1], a = u((0, r.useState)(""), 2), o = a[0], s = a[1], l = u((0, r.useState)(""), 2), c = l[0], d = l[1], p = u((0, r.useState)(!1), 2), h = p[0], f = p[1], g = u((0, r.useState)(null), 2), m = g[0], x = g[1], b = async () => { f(!0), x(null); try {
        const e = await il(o, c, 1, 100);
        i(e.users || []);
    }
    catch (Rl) {
        console.error(Rl), x("Unable to load users.");
    }
    finally {
        f(!1);
    } }; (0, r.useEffect)(() => { localStorage.getItem("adminToken") ? b() : e("/admin/login"); }, [e]); const y = async (e, t) => { try {
        await async function (e, t) { return (await rl.patch("/api/admin/user/".concat(e), { isBanned: t })).data; }(e, !t), b();
    }
    catch (Rl) {
        console.error(Rl), x("Unable to update user status.");
    } }; return (0, _i.jsxs)("div", { className: "admin-page", children: [(0, _i.jsxs)("div", { className: "admin-header", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h1", { children: "Users" }), (0, _i.jsx)("p", { children: "Search, filter and manage user accounts." })] }), (0, _i.jsx)("button", { className: "admin-logout", onClick: () => { cl(), e("/admin/login"); }, children: "Logout" })] }), (0, _i.jsxs)("div", { className: "admin-filters", children: [(0, _i.jsx)("input", { type: "text", value: o, placeholder: "Search by name or email", onChange: e => s(e.target.value) }), (0, _i.jsxs)("select", { value: c, onChange: e => d(e.target.value), children: [(0, _i.jsx)("option", { value: "", children: "All statuses" }), (0, _i.jsx)("option", { value: "active", children: "Active" }), (0, _i.jsx)("option", { value: "banned", children: "Banned" }), (0, _i.jsx)("option", { value: "kyc_verified", children: "KYC Verified" }), (0, _i.jsx)("option", { value: "kyc_pending", children: "KYC Pending" }), (0, _i.jsx)("option", { value: "kyc_rejected", children: "KYC Rejected" })] }), (0, _i.jsx)("button", { onClick: b, children: "Refresh" }), (0, _i.jsx)("button", { onClick: () => e("/admin"), children: "Dashboard" })] }), m && (0, _i.jsx)("div", { className: "admin-error", children: m }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "Name" }), (0, _i.jsx)("th", { children: "Email" }), (0, _i.jsx)("th", { children: "Balance" }), (0, _i.jsx)("th", { children: "Frozen" }), (0, _i.jsx)("th", { children: "Role" }), (0, _i.jsx)("th", { children: "KYC" }), (0, _i.jsx)("th", { children: "Last Login" }), (0, _i.jsx)("th", { children: "Status" }), (0, _i.jsx)("th", { children: "Actions" })] }) }), (0, _i.jsx)("tbody", { children: h ? (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 9, children: "Loading users..." }) }) : n.length ? n.map(t => (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("td", { children: t.name || "-" }), (0, _i.jsx)("td", { children: t.email }), (0, _i.jsxs)("td", { children: ["$", Number(t.balance || 0).toFixed(2)] }), (0, _i.jsxs)("td", { children: ["$", Number(t.frozenBalance || 0).toFixed(2)] }), (0, _i.jsx)("td", { children: t.role || "user" }), (0, _i.jsx)("td", { children: t.kycVerified ? "Verified" : t.kycStatus || "Pending" }), (0, _i.jsx)("td", { children: t.lastLogin ? new Date(t.lastLogin).toLocaleString() : "-" }), (0, _i.jsx)("td", { children: t.isBanned ? "Banned" : "Active" }), (0, _i.jsxs)("td", { children: [(0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => e("/admin/user/".concat(t._id)), children: "Profile" }), (0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => y(t._id, t.isBanned), children: t.isBanned ? "Unban" : "Ban" })] })] }, t._id)) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 9, children: "No users found." }) }) })] }) })] }); }, hl = () => { var e, t, n, i, a; const o = function () { let e = r.useContext(bt).matches, t = e[e.length - 1]; return t ? t.params : {}; }().id, s = kt(), l = u((0, r.useState)(null), 2), c = l[0], d = l[1], p = u((0, r.useState)([]), 2), h = p[0], f = p[1], g = u((0, r.useState)([]), 2), m = g[0], x = g[1], b = u((0, r.useState)([]), 2), y = b[0], v = b[1], w = u((0, r.useState)(!0), 2), j = w[0], k = w[1], S = u((0, r.useState)(null), 2), N = S[0], C = S[1]; (0, r.useEffect)(() => { if (!localStorage.getItem("adminToken"))
        return void s("/admin/login"); (async () => { try {
        if (!o)
            throw new Error("User ID is required");
        const e = u(await Promise.all([al(o), ol(o), sl(o), ll(o)]), 4), t = e[0], n = e[1], r = e[2], i = e[3];
        d(t.user), f(n.deposits || []), x(r.withdrawals || []), v(i.transactions || []);
    }
    catch (Rl) {
        console.error(Rl), C("Unable to load user details.");
    }
    finally {
        k(!1);
    } })(); }, [o, s]); const T = async (e) => { if (o)
        try {
            await async function (e, t) { return (await rl.patch("/api/admin/user/".concat(e), t)).data; }(o, e);
            const t = await al(o);
            d(t.user);
        }
        catch (Rl) {
            console.error(Rl), C("Unable to update user.");
        } }; return (0, _i.jsxs)("div", { className: "admin-page", children: [(0, _i.jsxs)("div", { className: "admin-header", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h1", { children: "User Details" }), (0, _i.jsx)("p", { children: "Review this user's profile and account activity." })] }), (0, _i.jsx)("button", { className: "admin-logout", onClick: () => { cl(), s("/admin/login"); }, children: "Logout" })] }), (0, _i.jsxs)("div", { className: "admin-nav", children: [(0, _i.jsx)("button", { onClick: () => s("/admin"), children: "Dashboard" }), (0, _i.jsx)("button", { onClick: () => s("/admin/users"), children: "Back to users" })] }), j ? (0, _i.jsx)("p", { children: "Loading user details..." }) : N ? (0, _i.jsx)("div", { className: "admin-error", children: N }) : c ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsxs)("div", { className: "admin-card-grid", children: [(0, _i.jsxs)("div", { className: "admin-card admin-card-large", children: [(0, _i.jsx)("h3", { children: "Profile" }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Name:" }), " ", c.name || "-"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Email:" }), " ", c.email] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Role:" }), " ", c.role] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Status:" }), " ", c.isBanned ? "Banned" : "Active"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "KYC:" }), " ", c.kycVerified ? "Verified" : c.kycStatus || "Pending"] }), (null === (e = c.kycSubmission) || void 0 === e ? void 0 : e.submittedAt) && (0, _i.jsxs)("div", { style: { marginTop: 12 }, children: [(0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "KYC submitted:" }), " ", new Date(c.kycSubmission.submittedAt).toLocaleString()] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Document:" }), " ", c.kycSubmission.documentType || "\u2014"] })] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Last Login:" }), " ", c.lastLogin ? new Date(c.lastLogin).toLocaleString() : "-"] })] }), (0, _i.jsxs)("div", { className: "admin-card admin-card-large", children: [(0, _i.jsx)("h3", { children: "Balances" }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Available:" }), " $", Number(c.balance || 0).toFixed(2)] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Frozen:" }), " $", Number(c.frozenBalance || 0).toFixed(2)] })] })] }), (0, _i.jsxs)("div", { className: "admin-actions", children: [(0, _i.jsx)("button", { onClick: () => T({ isBanned: !c.isBanned }), children: c.isBanned ? "Unban User" : "Ban User" }), (0, _i.jsx)("button", { onClick: () => T({ kycVerified: !0, kycStatus: "approved" }), children: "Verify KYC" }), (0, _i.jsx)("button", { onClick: () => T({ kycVerified: !1, kycStatus: "rejected" }), children: "Reject KYC" })] }), (null === (t = c.kycSubmission) || void 0 === t ? void 0 : t.submittedAt) && (0, _i.jsxs)("section", { className: "admin-section", children: [(0, _i.jsx)("h2", { children: "KYC Submission Details" }), (0, _i.jsxs)("div", { style: { display: "grid", gap: 16 }, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Document type:" }), " ", c.kycSubmission.documentType || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Submitted At:" }), " ", new Date(c.kycSubmission.submittedAt).toLocaleString()] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Full Name:" }), " ", c.kycSubmission.personal.fullName || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "DOB:" }), " ", c.kycSubmission.personal.dob || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Country:" }), " ", c.kycSubmission.personal.country || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Address:" }), " ", c.kycSubmission.personal.address || "\u2014"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "City:" }), " ", c.kycSubmission.personal.city || "\u2014"] })] }), (0, _i.jsxs)("div", { style: { display: "grid", gap: 12 }, children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("strong", { children: "Document Front" }), null !== (n = c.kycSubmission.documentFront) && void 0 !== n && n.data ? (0, _i.jsx)("img", { src: c.kycSubmission.documentFront.data, alt: "Document front", style: { width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, marginTop: 8 } }) : (0, _i.jsx)("p", { children: "No front image uploaded." })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("strong", { children: "Document Back" }), null !== (i = c.kycSubmission.documentBack) && void 0 !== i && i.data ? (0, _i.jsx)("img", { src: c.kycSubmission.documentBack.data, alt: "Document back", style: { width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, marginTop: 8 } }) : (0, _i.jsx)("p", { children: "No back image uploaded." })] }), (0, _i.jsxs)("div", { children: [(0, _i.jsx)("strong", { children: "Selfie" }), null !== (a = c.kycSubmission.selfie) && void 0 !== a && a.data ? (0, _i.jsx)("img", { src: c.kycSubmission.selfie.data, alt: "Selfie", style: { width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, marginTop: 8 } }) : (0, _i.jsx)("p", { children: "No selfie uploaded." })] })] })] })] }), (0, _i.jsxs)("section", { className: "admin-section", children: [(0, _i.jsx)("h2", { children: "Recent Deposits" }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "Amount" }), (0, _i.jsx)("th", { children: "Payment Method" }), (0, _i.jsx)("th", { children: "Status" }), (0, _i.jsx)("th", { children: "Reference" }), (0, _i.jsx)("th", { children: "Date" })] }) }), (0, _i.jsx)("tbody", { children: h.length ? h.map(e => (0, _i.jsxs)("tr", { children: [(0, _i.jsxs)("td", { children: ["$", Number(e.amount).toFixed(2)] }), (0, _i.jsx)("td", { children: e.paymentMethod || "-" }), (0, _i.jsx)("td", { children: e.status }), (0, _i.jsx)("td", { children: e.transactionRef || "-" }), (0, _i.jsx)("td", { children: new Date(e.createdAt).toLocaleString() })] }, e._id)) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 5, children: "No deposit history." }) }) })] }) })] }), (0, _i.jsxs)("section", { className: "admin-section", children: [(0, _i.jsx)("h2", { children: "Recent Withdrawals" }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "Amount" }), (0, _i.jsx)("th", { children: "Wallet" }), (0, _i.jsx)("th", { children: "Status" }), (0, _i.jsx)("th", { children: "Network" }), (0, _i.jsx)("th", { children: "Date" })] }) }), (0, _i.jsx)("tbody", { children: m.length ? m.map(e => (0, _i.jsxs)("tr", { children: [(0, _i.jsxs)("td", { children: ["$", Number(e.amount).toFixed(2)] }), (0, _i.jsx)("td", { children: e.walletAddress || "-" }), (0, _i.jsx)("td", { children: e.status }), (0, _i.jsx)("td", { children: e.network || "-" }), (0, _i.jsx)("td", { children: new Date(e.createdAt).toLocaleString() })] }, e._id)) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 5, children: "No withdrawals found." }) }) })] }) })] }), (0, _i.jsxs)("section", { className: "admin-section", children: [(0, _i.jsx)("h2", { children: "Recent Transactions" }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "Type" }), (0, _i.jsx)("th", { children: "Amount" }), (0, _i.jsx)("th", { children: "Description" }), (0, _i.jsx)("th", { children: "Date" })] }) }), (0, _i.jsx)("tbody", { children: y.length ? y.map(e => (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("td", { children: e.type }), (0, _i.jsxs)("td", { children: ["$", Number(e.amount).toFixed(2)] }), (0, _i.jsx)("td", { children: e.description || "-" }), (0, _i.jsx)("td", { children: new Date(e.createdAt).toLocaleString() })] }, e._id)) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 4, children: "No recent transaction history." }) }) })] }) })] })] }) : (0, _i.jsx)("div", { className: "admin-error", children: "User not found." })] }); }, fl = () => { const e = kt(), t = u((0, r.useState)([]), 2), n = t[0], i = t[1], a = u((0, r.useState)("pending"), 2), o = a[0], s = a[1], l = u((0, r.useState)(!0), 2), c = l[0], d = l[1], p = u((0, r.useState)(null), 2), h = p[0], f = p[1], g = async () => { d(!0), f(null); try {
        const e = await async function () { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""; return (await rl.get("/api/admin/deposits", { params: { status: e } })).data; }(o);
        i(e.deposits || []);
    }
    catch (Rl) {
        console.error(Rl), f("Unable to load deposit requests.");
    }
    finally {
        d(!1);
    } }; (0, r.useEffect)(() => { localStorage.getItem("adminToken") ? g() : e("/admin/login"); }, [e, o]); const m = async (e) => { const t = window.prompt("Transaction reference (optional):", ""); if (null !== t)
        try {
            await async function (e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ""; return (await rl.post("/api/admin/deposit/approve", { depositId: e, transactionRef: t })).data; }(e, t || ""), g();
        }
        catch (Rl) {
            console.error(Rl), f("Unable to approve deposit.");
        } }, x = async (e) => { const t = window.prompt("Rejection reason:", "Insufficient information"); if (null !== t)
        try {
            await async function (e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ""; return (await rl.post("/api/admin/deposit/reject", { depositId: e, reason: t })).data; }(e, t || "Rejected by admin"), g();
        }
        catch (Rl) {
            console.error(Rl), f("Unable to reject deposit.");
        } }; return (0, _i.jsxs)("div", { className: "admin-page", children: [(0, _i.jsxs)("div", { className: "admin-header", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h1", { children: "Deposits" }), (0, _i.jsx)("p", { children: "Approve or reject pending deposit requests." })] }), (0, _i.jsx)("button", { className: "admin-logout", onClick: () => { cl(), e("/admin/login"); }, children: "Logout" })] }), (0, _i.jsxs)("div", { className: "admin-nav", children: [(0, _i.jsx)("button", { onClick: () => e("/admin"), children: "Dashboard" }), (0, _i.jsx)("button", { onClick: () => e("/admin/users"), children: "Users" }), (0, _i.jsx)("button", { onClick: () => e("/admin/withdrawals"), children: "Withdrawals" }), (0, _i.jsx)("button", { onClick: () => e("/admin/balances"), children: "Balances" })] }), (0, _i.jsxs)("div", { className: "admin-filters", children: [(0, _i.jsxs)("select", { value: o, onChange: e => s(e.target.value), children: [(0, _i.jsx)("option", { value: "", children: "All" }), (0, _i.jsx)("option", { value: "pending", children: "Pending" }), (0, _i.jsx)("option", { value: "approved", children: "Approved" }), (0, _i.jsx)("option", { value: "rejected", children: "Rejected" })] }), (0, _i.jsx)("button", { onClick: g, children: "Refresh" })] }), h && (0, _i.jsx)("div", { className: "admin-error", children: h }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "User" }), (0, _i.jsx)("th", { children: "Amount" }), (0, _i.jsx)("th", { children: "Coin" }), (0, _i.jsx)("th", { children: "Wallet" }), (0, _i.jsx)("th", { children: "Status" }), (0, _i.jsx)("th", { children: "Reference" }), (0, _i.jsx)("th", { children: "Date" }), (0, _i.jsx)("th", { children: "Actions" })] }) }), (0, _i.jsx)("tbody", { children: c ? (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 8, children: "Loading deposits..." }) }) : n.length ? n.map(e => { var t, n; return (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("td", { children: (null === (t = e.userId) || void 0 === t ? void 0 : t.email) || (null === (n = e.userId) || void 0 === n ? void 0 : n.name) || "Unknown" }), (0, _i.jsxs)("td", { children: ["$", Number(e.amount || 0).toFixed(2)] }), (0, _i.jsx)("td", { children: e.coin || e.paymentMethod || "N/A" }), (0, _i.jsx)("td", { children: e.walletAddress || e.notes || "-" }), (0, _i.jsx)("td", { children: e.status }), (0, _i.jsx)("td", { children: e.transactionRef || "-" }), (0, _i.jsx)("td", { children: new Date(e.createdAt).toLocaleString() }), (0, _i.jsx)("td", { children: "pending" === e.status ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => m(e._id || e.id), children: "Approve" }), (0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => x(e._id || e.id), children: "Reject" })] }) : "\u2014" })] }, e._id || e.id); }) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 8, children: "No deposits found." }) }) })] }) })] }); }, gl = () => { const e = kt(), t = u((0, r.useState)([]), 2), n = t[0], i = t[1], a = u((0, r.useState)("pending"), 2), o = a[0], s = a[1], l = u((0, r.useState)(!0), 2), c = l[0], d = l[1], p = u((0, r.useState)(null), 2), h = p[0], f = p[1], g = async () => { d(!0), f(null); try {
        const e = await async function () { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""; return (await rl.get("/api/admin/withdrawals", { params: { status: e } })).data; }(o);
        i(e.withdrawals || []);
    }
    catch (Rl) {
        console.error(Rl), f("Unable to load withdrawal requests.");
    }
    finally {
        d(!1);
    } }; (0, r.useEffect)(() => { localStorage.getItem("adminToken") ? g() : e("/admin/login"); }, [e, o]); const m = async (e) => { const t = window.prompt("Approval notes (optional):", ""); if (null !== t)
        try {
            await async function (e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ""; return (await rl.post("/api/admin/withdrawal/approve", { withdrawalId: e, notes: t })).data; }(e, t || "Approved by admin"), g();
        }
        catch (Rl) {
            console.error(Rl), f("Unable to approve withdrawal.");
        } }, x = async (e) => { const t = window.prompt("Rejection reason:", "Insufficient funds"); if (null !== t)
        try {
            await async function (e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ""; return (await rl.post("/api/admin/withdrawal/reject", { withdrawalId: e, reason: t })).data; }(e, t || "Rejected by admin"), g();
        }
        catch (Rl) {
            console.error(Rl), f("Unable to reject withdrawal.");
        } }; return (0, _i.jsxs)("div", { className: "admin-page", children: [(0, _i.jsxs)("div", { className: "admin-header", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h1", { children: "Withdrawals" }), (0, _i.jsx)("p", { children: "Review and manage withdrawal requests." })] }), (0, _i.jsx)("button", { className: "admin-logout", onClick: () => { cl(), e("/admin/login"); }, children: "Logout" })] }), (0, _i.jsxs)("div", { className: "admin-nav", children: [(0, _i.jsx)("button", { onClick: () => e("/admin"), children: "Dashboard" }), (0, _i.jsx)("button", { onClick: () => e("/admin/users"), children: "Users" }), (0, _i.jsx)("button", { onClick: () => e("/admin/deposits"), children: "Deposits" }), (0, _i.jsx)("button", { onClick: () => e("/admin/balances"), children: "Balances" })] }), (0, _i.jsxs)("div", { className: "admin-filters", children: [(0, _i.jsxs)("select", { value: o, onChange: e => s(e.target.value), children: [(0, _i.jsx)("option", { value: "", children: "All" }), (0, _i.jsx)("option", { value: "pending", children: "Pending" }), (0, _i.jsx)("option", { value: "approved", children: "Approved" }), (0, _i.jsx)("option", { value: "rejected", children: "Rejected" })] }), (0, _i.jsx)("button", { onClick: g, children: "Refresh" })] }), h && (0, _i.jsx)("div", { className: "admin-error", children: h }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "User" }), (0, _i.jsx)("th", { children: "Amount" }), (0, _i.jsx)("th", { children: "Wallet" }), (0, _i.jsx)("th", { children: "Status" }), (0, _i.jsx)("th", { children: "Requested At" }), (0, _i.jsx)("th", { children: "Actions" })] }) }), (0, _i.jsx)("tbody", { children: c ? (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 6, children: "Loading withdrawals..." }) }) : n.length ? n.map(e => { var t, n; return (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("td", { children: (null === (t = e.userId) || void 0 === t ? void 0 : t.email) || (null === (n = e.userId) || void 0 === n ? void 0 : n.name) || "Unknown" }), (0, _i.jsxs)("td", { children: ["$", Number(e.amount || 0).toFixed(2)] }), (0, _i.jsx)("td", { children: e.walletAddress || e.wallet || "-" }), (0, _i.jsx)("td", { children: e.status }), (0, _i.jsx)("td", { children: new Date(e.createdAt).toLocaleString() }), (0, _i.jsx)("td", { children: "pending" === e.status ? (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => m(e._id || e.id), children: "Approve" }), (0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => x(e._id || e.id), children: "Reject" })] }) : "\u2014" })] }, e._id || e.id); }) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 6, children: "No withdrawals found." }) }) })] }) })] }); }, ml = () => { const e = kt(), t = u((0, r.useState)(""), 2), n = t[0], i = t[1], a = u((0, r.useState)([]), 2), o = a[0], s = a[1], l = u((0, r.useState)(null), 2), c = l[0], d = l[1], p = u((0, r.useState)(0), 2), h = p[0], f = p[1], g = u((0, r.useState)(""), 2), m = g[0], x = g[1], b = u((0, r.useState)([]), 2), y = b[0], v = b[1], w = u((0, r.useState)(null), 2), j = w[0], k = w[1], S = async (e) => { try {
        const t = await ll(e);
        v(t.transactions || []);
    }
    catch (Rl) {
        console.error(Rl), k("Unable to load transaction history.");
    } }; (0, r.useEffect)(() => { localStorage.getItem("adminToken") || e("/admin/login"); }, [e]); const N = async (e) => { if (c) {
        k(null);
        try {
            "add" === e ? await async function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ""; return (await rl.post("/api/admin/add-balance", { userId: e, amount: t, description: n })).data; }(c._id || c.id, h, m) : "remove" === e ? await async function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ""; return (await rl.post("/api/admin/remove-balance", { userId: e, amount: t, description: n })).data; }(c._id || c.id, h, m) : "credit" === e ? await async function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ""; return (await rl.post("/api/admin/credit-bonus", { userId: e, amount: t, description: n })).data; }(c._id || c.id, h, m) : "freeze" === e && await async function (e, t) { let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ""; return (await rl.post("/api/admin/freeze-funds", { userId: e, amount: t, description: n })).data; }(c._id || c.id, h, m);
            const t = await al(c._id || c.id);
            d(t.user || c), S(c._id || c.id), f(0), x("");
        }
        catch (Rl) {
            console.error(Rl), k("Unable to perform balance action.");
        }
    } }; return (0, _i.jsxs)("div", { className: "admin-page", children: [(0, _i.jsxs)("div", { className: "admin-header", children: [(0, _i.jsxs)("div", { children: [(0, _i.jsx)("h1", { children: "Balance Management" }), (0, _i.jsx)("p", { children: "Adjust user balances, provide bonuses, or freeze funds." })] }), (0, _i.jsx)("button", { className: "admin-logout", onClick: () => { cl(), e("/admin/login"); }, children: "Logout" })] }), (0, _i.jsxs)("div", { className: "admin-nav", children: [(0, _i.jsx)("button", { onClick: () => e("/admin"), children: "Dashboard" }), (0, _i.jsx)("button", { onClick: () => e("/admin/users"), children: "Users" }), (0, _i.jsx)("button", { onClick: () => e("/admin/deposits"), children: "Deposits" }), (0, _i.jsx)("button", { onClick: () => e("/admin/withdrawals"), children: "Withdrawals" })] }), (0, _i.jsxs)("div", { className: "admin-search-section", children: [(0, _i.jsxs)("div", { className: "admin-search-row", children: [(0, _i.jsx)("input", { type: "text", value: n, placeholder: "Search users by email or name", onChange: e => i(e.target.value) }), (0, _i.jsx)("button", { onClick: async () => { k(null); try {
                                    const e = await il(n, "", 1, 50);
                                    s(e.users || []);
                                }
                                catch (Rl) {
                                    console.error(Rl), k("Unable to load users.");
                                } }, children: "Search Users" })] }), o.length > 0 && (0, _i.jsxs)("div", { className: "admin-user-list", children: [(0, _i.jsx)("h3", { children: "Select a user" }), (0, _i.jsx)("ul", { children: o.map(e => (0, _i.jsx)("li", { children: (0, _i.jsxs)("button", { className: "admin-link-button", onClick: () => (async (e) => { k(null); try {
                                            const t = await al(e);
                                            d(t.user || null), S(e);
                                        }
                                        catch (Rl) {
                                            console.error(Rl), k("Unable to select user.");
                                        } })(e._id || e.id), children: [e.email, " \u2014 ", e.name || "No name"] }) }, e._id || e.id)) })] })] }), c ? (0, _i.jsxs)("div", { className: "admin-card", children: [(0, _i.jsx)("h2", { children: "Selected User" }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Email:" }), " ", c.email] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Name:" }), " ", c.name || "N/A"] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Balance:" }), " $", Number(c.balance || c.walletBalance || 0).toFixed(2)] }), (0, _i.jsxs)("p", { children: [(0, _i.jsx)("strong", { children: "Frozen:" }), " $", Number(c.frozenBalance || 0).toFixed(2)] }), (0, _i.jsxs)("div", { className: "admin-form-row", children: [(0, _i.jsx)("input", { type: "number", value: h, placeholder: "Amount", onChange: e => f(Number(e.target.value)) }), (0, _i.jsx)("input", { type: "text", value: m, placeholder: "Description", onChange: e => x(e.target.value) })] }), (0, _i.jsxs)("div", { className: "admin-actions-row", children: [(0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => N("add"), children: "Add Balance" }), (0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => N("remove"), children: "Remove Balance" }), (0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => N("credit"), children: "Credit Bonus" }), (0, _i.jsx)("button", { className: "admin-action-btn", onClick: () => N("freeze"), children: "Freeze Funds" })] })] }) : (0, _i.jsx)("div", { className: "admin-card", children: (0, _i.jsx)("p", { children: "Search for a user above to manage balances." }) }), j && (0, _i.jsx)("div", { className: "admin-error", children: j }), c && (0, _i.jsxs)("div", { className: "admin-card", children: [(0, _i.jsx)("h2", { children: "Recent Balance Activity" }), (0, _i.jsx)("div", { className: "admin-table-wrap", children: (0, _i.jsxs)("table", { className: "admin-table", children: [(0, _i.jsx)("thead", { children: (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("th", { children: "Date" }), (0, _i.jsx)("th", { children: "Action" }), (0, _i.jsx)("th", { children: "Amount" }), (0, _i.jsx)("th", { children: "Description" })] }) }), (0, _i.jsx)("tbody", { children: y.length ? y.map(e => (0, _i.jsxs)("tr", { children: [(0, _i.jsx)("td", { children: new Date(e.createdAt || e.date || e.timestamp).toLocaleString() }), (0, _i.jsx)("td", { children: e.type || e.action || "Balance" }), (0, _i.jsxs)("td", { children: ["$", Number(e.amount || 0).toFixed(2)] }), (0, _i.jsx)("td", { children: e.description || e.notes || "-" })] }, e._id || e.id || "".concat(e.date, "-").concat(e.amount))) : (0, _i.jsx)("tr", { children: (0, _i.jsx)("td", { colSpan: 4, children: "No balance history available." }) }) })] }) })] })] }); }, xl = "http://localhost:5000".replace(/\/+$/, ""), bl = "token", yl = "sessionToken", vl = Ai.create({ baseURL: xl, headers: { "Content-Type": "application/json" }, timeout: 1e4 }), wl = () => localStorage.getItem(bl) || localStorage.getItem(yl) || "", jl = () => { localStorage.removeItem(bl), localStorage.removeItem(yl), localStorage.removeItem("refreshToken"), localStorage.removeItem("userEmail"), localStorage.removeItem("sessionExpiry"); };
    vl.interceptors.request.use(e => { const t = wl(); return t && (e.headers.Authorization = "Bearer ".concat(t)), e; }), vl.interceptors.response.use(e => e, e => { var t; return 401 === (null === (t = e.response) || void 0 === t ? void 0 : t.status) && (jl(), window.location.href = "/login"), Promise.reject(e); });
    const kl = () => { jl(); }, Sl = () => { const e = wl(), t = localStorage.getItem("sessionExpiry"); if (!e)
        return !1; if (!t)
        return !0; const n = parseInt(t, 10); return Date.now() < n; }, Nl = () => { const e = u((0, r.useState)(null), 2), t = e[0], n = e[1]; return (0, r.useEffect)(() => { const e = Sl(); e || kl(), n(e); }, []), null === t ? null : t ? (0, _i.jsx)(Mt, { to: "/home", replace: !0 }) : (0, _i.jsx)(_o, {}); }, Cl = e => { let t = e.children; const n = u((0, r.useState)(null), 2), i = n[0], a = n[1]; return (0, r.useEffect)(() => { const e = Sl(); e || kl(), a(e); }, []), null === i ? null : i ? t : (0, _i.jsx)(Mt, { to: "/", replace: !0 }); };
    function Tl() { return (0, _i.jsxs)(_i.Fragment, { children: [(0, _i.jsx)(rn, {}), (0, _i.jsxs)(_t, { children: [(0, _i.jsx)(It, { path: "/", element: (0, _i.jsx)(Nl, {}) }), (0, _i.jsx)(It, { path: "/login", element: (0, _i.jsx)(Wi, {}) }), (0, _i.jsx)(It, { path: "/register", element: (0, _i.jsx)(Eo, {}) }), (0, _i.jsx)(It, { path: "/markets", element: (0, _i.jsx)(Ro, {}) }), (0, _i.jsx)(It, { path: "/discover", element: (0, _i.jsx)(Po, {}) }), (0, _i.jsx)(It, { path: "/news", element: (0, _i.jsx)(Wo, {}) }), (0, _i.jsx)(It, { path: "/privacy", element: (0, _i.jsx)(Do, {}) }), (0, _i.jsx)(It, { path: "/terms", element: (0, _i.jsx)(Fo, {}) }), (0, _i.jsx)(It, { path: "/cookies", element: (0, _i.jsx)(Mo, {}) }), (0, _i.jsx)(It, { path: "/about", element: (0, _i.jsx)(Ho, {}) }), (0, _i.jsx)(It, { path: "/legal", element: (0, _i.jsx)(Vo, {}) }), (0, _i.jsx)(It, { path: "/careers", element: (0, _i.jsx)(Xo, {}) }), (0, _i.jsx)(It, { path: "/imformation", element: (0, _i.jsx)(Jo, {}) }), (0, _i.jsx)(It, { path: "/legal/privacy", element: (0, _i.jsx)(Do, {}) }), (0, _i.jsx)(It, { path: "/trade", element: (0, _i.jsx)(ms, {}) }), (0, _i.jsx)(It, { path: "/verification", element: (0, _i.jsx)(Ss, {}) }), (0, _i.jsx)(It, { path: "/home", element: (0, _i.jsx)(Cl, { children: (0, _i.jsx)(tl, {}) }) }), (0, _i.jsx)(It, { path: "/building-trust", element: (0, _i.jsx)(Qo, {}) }), (0, _i.jsx)(It, { path: "/admin/login", element: (0, _i.jsx)(dl, {}) }), (0, _i.jsx)(It, { path: "/admin", element: (0, _i.jsx)(ul, {}) }), (0, _i.jsx)(It, { path: "/admin/users", element: (0, _i.jsx)(pl, {}) }), (0, _i.jsx)(It, { path: "/admin/user/:id", element: (0, _i.jsx)(hl, {}) }), (0, _i.jsx)(It, { path: "/admin/deposits", element: (0, _i.jsx)(fl, {}) }), (0, _i.jsx)(It, { path: "/admin/withdrawals", element: (0, _i.jsx)(gl, {}) }), (0, _i.jsx)(It, { path: "/admin/balances", element: (0, _i.jsx)(ml, {}) })] })] }); }
    function Al() { const e = kt(), t = wt(); return "/" === t.pathname || "/register" === t.pathname || "/login" === t.pathname || "/home" === t.pathname || "/markets" === t.pathname || "/news" === t.pathname || "/trade" === t.pathname ? null : (0, _i.jsxs)("div", { className: "navbar", children: [(0, _i.jsxs)("div", { className: "nav-left", children: [(0, _i.jsxs)("div", { className: "logo-box", children: [(0, _i.jsx)("img", { src: Ui, alt: "logo", className: "logo-img" }), (0, _i.jsx)("span", { className: "logo-text", children: "SwanCore" })] }), (0, _i.jsxs)("div", { className: "nav-links", children: [(0, _i.jsx)($t, { to: "/markets", className: e => e.isActive ? "nav-item active" : "nav-item", children: "Markets" }), (0, _i.jsx)($t, { to: "/discover", className: e => e.isActive ? "nav-item active" : "nav-item", children: "Discover" }), (0, _i.jsx)($t, { to: "/news", className: e => e.isActive ? "nav-item active" : "nav-item", children: "News" }), (0, _i.jsx)($t, { to: "/about", className: e => e.isActive ? "nav-item active" : "nav-item", children: "About" }), (0, _i.jsx)($t, { to: "/trade", className: e => e.isActive ? "nav-item active" : "nav-item", children: "Trade" })] })] }), (0, _i.jsxs)("div", { className: "nav-right", children: [(0, _i.jsx)("span", { className: "nav-btn", onClick: () => e("/login"), children: "Login" }), (0, _i.jsx)("span", { className: "nav-btn primary", onClick: () => e("/register"), children: "Register" })] })] }); }
    a.createRoot(document.getElementById("root")).render((0, _i.jsx)(r.StrictMode, { children: (0, _i.jsx)(Xt, { future: { v7_startTransition: !0, v7_relativeSplatPath: !0 }, children: (0, _i.jsxs)("div", { className: "app-layout", children: [(0, _i.jsx)(Al, {}), (0, _i.jsx)(Tl, {})] }) }) })), ke();
})(); })();
//# sourceMappingURL=main.8ae2cb40.js.map
