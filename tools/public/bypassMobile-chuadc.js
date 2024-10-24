! function () {
    function e() {
        try {
            const e = ["bybitcoinsweeper.com"];
            document.querySelectorAll("iframe").forEach((t => {
                let n = t.getAttribute("src");
                n && n.includes("tgWebAppPlatform=web") && !e.some((e => n.includes(e))) && (n = n.replace(/tgWebAppPlatform=web[a-z]?/, "tgWebAppPlatform=android"), t.setAttribute("src", n))
            }))
        } catch (e) { }
    } ! function (e, t, n) {
        "use strict";

        function r(e, t, n) {
            l.addMethod(t, n, e.unbindEvent), l.addMethod(t, n, e.unbindEventWithSelectorOrCallback), l.addMethod(t, n, e.unbindEventWithSelectorAndCallback)
        }

        function i(e) {
            e.arrive = s.bindEvent, r(s, e, "unbindArrive"), e.leave = u.bindEvent, r(u, e, "unbindLeave")
        }
        if (e.MutationObserver && "undefined" != typeof HTMLElement) {
            var o = 0,
                l = function () {
                    var t = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector;
                    return {
                        matchesSelector: function (e, n) {
                            return e instanceof HTMLElement && t.call(e, n)
                        },
                        addMethod: function (e, t, r) {
                            var i = e[t];
                            e[t] = function () {
                                return r.length == arguments.length ? r.apply(this, arguments) : "function" == typeof i ? i.apply(this, arguments) : n
                            }
                        },
                        callCallbacks: function (e, t) {
                            t && t.options.onceOnly && 1 == t.firedElems.length && (e = [e[0]]);
                            for (var n, r = 0; n = e[r]; r++) n && n.callback && n.callback.call(n.elem, n.elem);
                            t && t.options.onceOnly && 1 == t.firedElems.length && t.me.unbindEventWithSelectorAndCallback.call(t.target, t.selector, t.callback)
                        },
                        checkChildNodesRecursively: function (e, t, n, r) {
                            for (var i, o = 0; i = e[o]; o++) n(i, t, r) && r.push({
                                callback: t.callback,
                                elem: i
                            }), i.childNodes.length > 0 && l.checkChildNodesRecursively(i.childNodes, t, n, r)
                        },
                        mergeArrays: function (e, t) {
                            var n, r = {};
                            for (n in e) e.hasOwnProperty(n) && (r[n] = e[n]);
                            for (n in t) t.hasOwnProperty(n) && (r[n] = t[n]);
                            return r
                        },
                        toElementsArray: function (t) {
                            return n === t || "number" == typeof t.length && t !== e || (t = [t]), t
                        }
                    }
                }(),
                c = function () {
                    var e = function () {
                        this._eventsBucket = [], this._beforeAdding = null, this._beforeRemoving = null
                    };
                    return e.prototype.addEvent = function (e, t, n, r) {
                        var i = {
                            target: e,
                            selector: t,
                            options: n,
                            callback: r,
                            firedElems: []
                        };
                        return this._beforeAdding && this._beforeAdding(i), this._eventsBucket.push(i), i
                    }, e.prototype.removeEvent = function (e) {
                        for (var t, n = this._eventsBucket.length - 1; t = this._eventsBucket[n]; n--)
                            if (e(t)) {
                                this._beforeRemoving && this._beforeRemoving(t);
                                var r = this._eventsBucket.splice(n, 1);
                                r && r.length && (r[0].callback = null)
                            }
                    }, e.prototype.beforeAdding = function (e) {
                        this._beforeAdding = e
                    }, e.prototype.beforeRemoving = function (e) {
                        this._beforeRemoving = e
                    }, e
                }(),
                a = function (t, r) {
                    var i = new c,
                        o = this,
                        a = {
                            fireOnAttributesModification: !1
                        };
                    return i.beforeAdding((function (n) {
                        var i, l = n.target;
                        (l === e.document || l === e) && (l = document.getElementsByTagName("html")[0]), i = new MutationObserver((function (e) {
                            r.call(this, e, n)
                        }));
                        var c = t(n.options);
                        i.observe(l, c), n.observer = i, n.me = o
                    })), i.beforeRemoving((function (e) {
                        e.observer.disconnect()
                    })), this.bindEvent = function (e, t, n) {
                        t = l.mergeArrays(a, t);
                        for (var r = l.toElementsArray(this), o = 0; o < r.length; o++) i.addEvent(r[o], e, t, n)
                    }, this.unbindEvent = function () {
                        var e = l.toElementsArray(this);
                        i.removeEvent((function (t) {
                            for (var r = 0; r < e.length; r++)
                                if (this === n || t.target === e[r]) return !0;
                            return !1
                        }))
                    }, this.unbindEventWithSelectorOrCallback = function (e) {
                        var t, r = l.toElementsArray(this),
                            o = e;
                        t = "function" == typeof e ? function (e) {
                            for (var t = 0; t < r.length; t++)
                                if ((this === n || e.target === r[t]) && e.callback === o) return !0;
                            return !1
                        } : function (t) {
                            for (var i = 0; i < r.length; i++)
                                if ((this === n || t.target === r[i]) && t.selector === e) return !0;
                            return !1
                        }, i.removeEvent(t)
                    }, this.unbindEventWithSelectorAndCallback = function (e, t) {
                        var r = l.toElementsArray(this);
                        i.removeEvent((function (i) {
                            for (var o = 0; o < r.length; o++)
                                if ((this === n || i.target === r[o]) && i.selector === e && i.callback === t) return !0;
                            return !1
                        }))
                    }, this
                },
                s = new function () {
                    function e(e, t) {
                        return !(!l.matchesSelector(e, t.selector) || (e._id === n && (e._id = o++), -1 != t.firedElems.indexOf(e._id)) || (t.firedElems.push(e._id), 0))
                    }
                    var t = {
                        fireOnAttributesModification: !1,
                        onceOnly: !1,
                        existing: !1
                    };
                    s = new a((function (e) {
                        var t = {
                            attributes: !1,
                            childList: !0,
                            subtree: !0
                        };
                        return e.fireOnAttributesModification && (t.attributes = !0), t
                    }), (function (t, n) {
                        t.forEach((function (t) {
                            var r = t.addedNodes,
                                i = t.target,
                                o = [];
                            null !== r && r.length > 0 ? l.checkChildNodesRecursively(r, n, e, o) : "attributes" === t.type && e(i, n) && o.push({
                                callback: n.callback,
                                elem: i
                            }), l.callCallbacks(o, n)
                        }))
                    }));
                    var r = s.bindEvent;
                    return s.bindEvent = function (e, i, o) {
                        n === o ? (o = i, i = t) : i = l.mergeArrays(t, i);
                        var c = l.toElementsArray(this);
                        if (i.existing) {
                            for (var a = [], s = 0; s < c.length; s++)
                                for (var u = c[s].querySelectorAll(e), f = 0; f < u.length; f++) a.push({
                                    callback: o,
                                    elem: u[f]
                                });
                            if (i.onceOnly && a.length) return o.call(a[0].elem, a[0].elem);
                            setTimeout(l.callCallbacks, 1, a)
                        }
                        r.call(this, e, i, o)
                    }, s
                },
                u = new function () {
                    function e(e, t) {
                        return l.matchesSelector(e, t.selector)
                    }
                    var t = {};
                    u = new a((function () {
                        return {
                            childList: !0,
                            subtree: !0
                        }
                    }), (function (t, n) {
                        t.forEach((function (t) {
                            var r = t.removedNodes,
                                i = [];
                            null !== r && r.length > 0 && l.checkChildNodesRecursively(r, n, e, i), l.callCallbacks(i, n)
                        }))
                    }));
                    var r = u.bindEvent;
                    return u.bindEvent = function (e, i, o) {
                        n === o ? (o = i, i = t) : i = l.mergeArrays(t, i), r.call(this, e, i, o)
                    }, u
                };
            t && i(t.fn), i(HTMLElement.prototype), i(NodeList.prototype), i(HTMLCollection.prototype), i(HTMLDocument.prototype), i(Window.prototype);
            var f = {};
            r(s, f, "unbindAllArrive"), r(u, f, "unbindAllLeave")
        }
    }(window, "undefined" == typeof jQuery ? null : jQuery, void 0), chrome.storage.local.get("is_enabled", (function (t) {
        if (t.is_enabled) {
            document.arrive("iframe", (function (t) {
                try {
                    e()
                } catch (e) { }
            }));
            try {
                e()
            } catch (e) { }
        }
    }))
}();