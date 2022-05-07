/** 分析Vue-Router location控制, 以hash模式为例 */

/** vue-router\src\history\base.js */
class History {
    constructor(router: Router, base: ?string) {
        this.router = router;
        this.base = normalizeBase(base);
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

/** vue-router\src\history\hash.js */
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
