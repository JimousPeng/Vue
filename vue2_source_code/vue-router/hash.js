/** 分析Vue-Router location控制, 以hash模式为例 */

/** vue-router\src\history\base.js */
class History {
    constructor(router: Router, base: ?string) {
        this.router = router;
        // this.base在new VueRouter没传的时候，浏览器环境这里为''
        this.base = normalizeBase(base);
        function normalizeBase(base: ?string): string {
            if (!base) {
                if (inBrowser) {
                    // respect <base> tag
                    const baseEl = document.querySelector('base');
                    base = (baseEl && baseEl.getAttribute('href')) || '/';
                    // strip full URL origin
                    base = base.replace(/^https?:\/\/[^\/]+/, '');
                } else {
                    base = '/';
                }
            }
            // make sure there's the starting slash
            if (base.charAt(0) !== '/') {
                base = '/' + base;
            }
            // remove trailing slash
            return base.replace(/\/$/, '');
        }
        // start with a route object that stands for "nowhere"
        this.current = START;
        this.pending = null;
        this.ready = false;
        this.readyCbs = [];
        this.readyErrorCbs = [];
        this.errorCbs = [];
        this.listeners = [];
    }
    listen(cb: Function) {
        this.cb = cb;
    }
    onReady(cb: Function, errorCb: ?Function) {
        if (this.ready) {
            cb();
        } else {
            this.readyCbs.push(cb);
            if (errorCb) {
                this.readyErrorCbs.push(errorCb);
            }
        }
    }
    onError(errorCb: Function) {
        this.errorCbs.push(errorCb);
    }
    transitionTo(location: RawLocation, onComplete?: Function, onAbort?: Function) {
        let route;
        // catch redirect option https://github.com/vuejs/vue-router/issues/3201
        try {
            /** this.router指向vue-router实例 */
            route = this.router.match(location, this.current);
        } catch (e) {
            this.errorCbs.forEach((cb) => {
                cb(e);
            });
            // Exception should still be thrown
            throw e;
        }
        const prev = this.current;
        this.confirmTransition(
            route,
            () => {
                this.updateRoute(route);
                onComplete && onComplete(route);
                this.ensureURL();
                this.router.afterHooks.forEach((hook) => {
                    hook && hook(route, prev);
                });

                // fire ready cbs once
                if (!this.ready) {
                    this.ready = true;
                    this.readyCbs.forEach((cb) => {
                        cb(route);
                    });
                }
            },
            (err) => {
                if (onAbort) {
                    onAbort(err);
                }
                if (err && !this.ready) {
                    // Initial redirection should not mark the history as ready yet
                    // because it's triggered by the redirection instead
                    // https://github.com/vuejs/vue-router/issues/3225
                    // https://github.com/vuejs/vue-router/issues/3331
                    if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) {
                        this.ready = true;
                        this.readyErrorCbs.forEach((cb) => {
                            cb(err);
                        });
                    }
                }
            }
        );
    }
    confirmTransition(route: Route, onComplete: Function, onAbort?: Function) {
        const current = this.current;
        this.pending = route;
        const abort = (err) => {
            // changed after adding errors with
            // https://github.com/vuejs/vue-router/pull/3047 before that change,
            // redirect and aborted navigation would produce an err == null
            if (!isNavigationFailure(err) && isError(err)) {
                if (this.errorCbs.length) {
                    this.errorCbs.forEach((cb) => {
                        cb(err);
                    });
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        warn(false, 'uncaught error during route navigation:');
                    }
                    console.error(err);
                }
            }
            onAbort && onAbort(err);
        };
        const lastRouteIndex = route.matched.length - 1;
        const lastCurrentIndex = current.matched.length - 1;
        if (
            isSameRoute(route, current) &&
            // in the case the route map has been dynamically appended to
            lastRouteIndex === lastCurrentIndex &&
            route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
        ) {
            this.ensureURL();
            if (route.hash) {
                handleScroll(this.router, current, route, false);
            }
            return abort(createNavigationDuplicatedError(current, route));
        }
        function resolveQueue(current, next) {
            let i;
            const max = Math.max(current.length, next.length);
            for (i = 0; i < max; i++) {
                if (current[i] !== next[i]) {
                    break;
                }
            }
            return {
                updated: next.slice(0, i),
                activated: next.slice(i),
                deactivated: current.slice(i),
            };
        }
        const { updated, deactivated, activated } = resolveQueue(this.current.matched, route.matched);
        const queue: Array<?NavigationGuard> = [].concat(
            // in-component leave guards
            extractLeaveGuards(deactivated),
            // global before hooks
            this.router.beforeHooks,
            // in-component update hooks
            extractUpdateHooks(updated),
            // in-config enter guards
            activated.map((m) => m.beforeEnter),
            // async components
            resolveAsyncComponents(activated)
        );
        const iterator = (hook: NavigationGuard, next) => {
            if (this.pending !== route) {
                return abort(createNavigationCancelledError(current, route));
            }
            try {
                hook(route, current, (to: any) => {
                    if (to === false) {
                        // next(false) -> abort navigation, ensure current URL
                        this.ensureURL(true);
                        abort(createNavigationAbortedError(current, route));
                    } else if (isError(to)) {
                        this.ensureURL(true);
                        abort(to);
                    } else if (
                        typeof to === 'string' ||
                        (typeof to === 'object' && (typeof to.path === 'string' || typeof to.name === 'string'))
                    ) {
                        // next('/') or next({ path: '/' }) -> redirect
                        abort(createNavigationRedirectedError(current, route));
                        if (typeof to === 'object' && to.replace) {
                            this.replace(to);
                        } else {
                            this.push(to);
                        }
                    } else {
                        // confirm transition and pass on the value
                        next(to);
                    }
                });
            } catch (e) {
                abort(e);
            }
        };
        runQueue(queue, iterator, () => {
            // wait until async components are resolved before
            // extracting in-component enter guards
            const enterGuards = extractEnterGuards(activated);
            const queue = enterGuards.concat(this.router.resolveHooks);
            runQueue(queue, iterator, () => {
                if (this.pending !== route) {
                    return abort(createNavigationCancelledError(current, route));
                }
                this.pending = null;
                onComplete(route);
                if (this.router.app) {
                    this.router.app.$nextTick(() => {
                        handleRouteEntered(route);
                    });
                }
            });
        });
    }
    updateRoute(route: Route) {
        this.current = route;
        this.cb && this.cb(route);
    }
    setupListeners() {
        // Default implementation is empty
    }
    teardown() {
        // clean up event listeners
        // https://github.com/vuejs/vue-router/issues/2341
        this.listeners.forEach((cleanupListener) => {
            cleanupListener();
        });
        this.listeners = [];

        // reset current history route
        // https://github.com/vuejs/vue-router/issues/3294
        this.current = START;
        this.pending = null;
    }
}

/** 
 * vue-router\src\history\hash.js */
function ensureSlash() {
    const path = getHash();
    if (path.charAt(0) === '/') {
        return true;
    }
    /** 走hash模式 */
    replaceHash('/' + path);
    return false;
}
/**
 * supportsPushState
 * pushState
 * replaceState
 *
 * vue-router\src\util\push-state.js
 */
var supportsPushState =
    inBrowser &&
    (function () {
        const ua = window.navigator.userAgent;
        if (
            (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
            ua.indexOf('Mobile Safari') !== -1 &&
            ua.indexOf('Chrome') === -1 &&
            ua.indexOf('Windows Phone') === -1
        ) {
            return false;
        }
        return window.history && typeof window.history.pushState === 'function';
    })();
function pushState(url?: string, replace?: boolean) {
    saveScrollPosition();
    // try...catch the pushState call to get around Safari
    // DOM Exception 18 where it limits to 100 pushState calls
    const history = window.history;
    try {
        if (replace) {
            // preserve existing history state as it could be overriden by the user
            const stateCopy = extend({}, history.state);
            stateCopy.key = getStateKey();
            history.replaceState(stateCopy, '', url);
        } else {
            history.pushState({ key: setStateKey(genStateKey()) }, '', url);
        }
    } catch (e) {
        window.location[replace ? 'replace' : 'assign'](url);
    }
}
function replaceState(url?: string) {
    pushState(url, true);
}
function replaceHash(path) {
    if (supportsPushState) {
        /** history模式 */
        replaceState(getUrl(path));
    } else {
        window.location.replace(getUrl(path));
    }
}
function getUrl(path) {
    const href = window.location.href;
    const i = href.indexOf('#');
    const base = i >= 0 ? href.slice(0, i) : href;
    return `${base}#${path}`;
}
/** getHash: 获取当前hash值
 * eg: 'http://localhost:8080/#/index'.slice(23) -> '/index'
 */
function getHash() {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    let href = window.location.href;
    const index = href.indexOf('#');
    // empty path
    if (index < 0) return '';
    href = href.slice(index + 1);
    return href;
}
function pushHash(path) {
    if (supportsPushState) {
        pushState(getUrl(path));
    } else {
        window.location.hash = path;
    }
}
class HashHistory extends History {
    constructor(router: Router, base: ?string, fallback: boolean) {
        super(router, base);
        // check history fallback deeplinking
        if (fallback && checkFallback(this.base)) {
            return;
        }
        ensureSlash();
    }
    // this is delayed until the app mounts
    // to avoid the hashchange listener being fired too early
    setupListeners() {
        if (this.listeners.length > 0) {
            return;
        }
        const router = this.router;
        const expectScroll = router.options.scrollBehavior;
        const supportsScroll = supportsPushState && expectScroll;
        if (supportsScroll) {
            this.listeners.push(setupScroll());
        }

        const handleRoutingEvent = () => {
            const current = this.current;
            if (!ensureSlash()) {
                return;
            }
            this.transitionTo(getHash(), (route) => {
                if (supportsScroll) {
                    handleScroll(this.router, route, current, true);
                }
                if (!supportsPushState) {
                    replaceHash(route.fullPath);
                }
            });
        };
        const eventType = supportsPushState ? 'popstate' : 'hashchange';
        window.addEventListener(eventType, handleRoutingEvent);
        this.listeners.push(() => {
            window.removeEventListener(eventType, handleRoutingEvent);
        });
    }
    push(location: RawLocation, onComplete?: Function, onAbort?: Function) {
        const { current: fromRoute } = this;
        this.transitionTo(
            location,
            (route) => {
                pushHash(route.fullPath);
                handleScroll(this.router, route, fromRoute, false);
                onComplete && onComplete(route);
            },
            onAbort
        );
    }
    replace(location: RawLocation, onComplete?: Function, onAbort?: Function) {
        const { current: fromRoute } = this;
        this.transitionTo(
            location,
            (route) => {
                replaceHash(route.fullPath);
                handleScroll(this.router, route, fromRoute, false);
                onComplete && onComplete(route);
            },
            onAbort
        );
    }
    go(n: number) {
        window.history.go(n);
    }
    ensureURL(push?: boolean) {
        const current = this.current.fullPath;
        if (getHash() !== current) {
            push ? pushHash(current) : replaceHash(current);
        }
    }
    getCurrentLocation() {
        return getHash();
    }
}

/** vue-router\src\util\route.js */
var START = createRoute(null, {
    path: '/',
});
function createRoute(record: ?RouteRecord, location: Location, redirectedFrom?: ?Location, router?: VueRouter): Route {
    const stringifyQuery = router && router.options.stringifyQuery;
    let query: any = location.query || {};
    try {
        query = clone(query);
    } catch (e) {}
    const route: Route = {
        name: location.name || (record && record.name),
        meta: (record && record.meta) || {},
        path: location.path || '/',
        hash: location.hash || '',
        query,
        params: location.params || {},
        fullPath: getFullPath(location, stringifyQuery),
        matched: record ? formatMatch(record) : [],
    };
    if (redirectedFrom) {
        route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
    }
    return Object.freeze(route);
}
function isSameRoute(a: Route, b: ?Route, onlyPath: ?boolean): boolean {
    if (b === START) {
        return a === b;
    } else if (!b) {
        return false;
    } else if (a.path && b.path) {
        return (
            a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
            (onlyPath || (a.hash === b.hash && isObjectEqual(a.query, b.query)))
        );
    } else if (a.name && b.name) {
        return (
            a.name === b.name &&
            (onlyPath || (a.hash === b.hash && isObjectEqual(a.query, b.query) && isObjectEqual(a.params, b.params)))
        );
    } else {
        return false;
    }
}
function runQueue(queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
    const step = (index) => {
        if (index >= queue.length) {
            cb();
        } else {
            if (queue[index]) {
                fn(queue[index], () => {
                    step(index + 1);
                });
            } else {
                step(index + 1);
            }
        }
    };
    step(0);
}
