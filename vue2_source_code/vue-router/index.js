/** 分析Vue-Router 路由配置生成 */
const routes = [
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: '/index',
        name: 'index',
        component: 'IndexPage',
        children: [{ path: 'jimous', name: 'jimous', component: 'UserInfo' }],
    },
    {
        path: '/poster/:id',
        name: 'poster',
        component: 'IndexPoster',
        // meta: {
        //     requireAuth: true,
        // },
    },
];

new VueRouter({ routes });

/** vue-router\src\index.js */
class VueRouter {
    constructor(options) {
        this.app = null;
        this.apps = [];
        this.options = options;
        this.beforeHooks = [];
        this.resolveHooks = [];
        this.afterHooks = [];
        /** 到这一步，就生成了对应的路由匹配器，通过match,addRoute,getRoutes,addRoutes来操作pathList,pathMap,nameMap */
        this.matcher = createMatcher(options.routes || [], this);
        /** 有了路由匹配表和操作配置表的函数，接着是处理浏览器location操作
         *  vue-router提供了三种模式，hash(默认模式) | history(需要结合后端配置) | abstract(非浏览器终端环境)
         */
        let mode = options.mode || 'hash';
        this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
        if (this.fallback) {
            mode = 'hash';
        }
        if (!inBrowser) {
            mode = 'abstract';
        }
        this.mode = mode;
        switch (mode) {
            case 'history':
                this.history = new HTML5History(this, options.base);
                break;
            case 'hash':
                this.history = new HashHistory(this, options.base, this.fallback);
                break;
            case 'abstract':
                this.history = new AbstractHistory(this, options.base);
                break;
            default:
                if (process.env.NODE_ENV !== 'production') {
                    assert(false, `invalid mode: ${mode}`);
                }
        }
    }
    match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
        /** 调用路由匹配器的match */
        return this.matcher.match(raw, current, redirectedFrom);
    }
    get currentRoute(): ?Route {
        return this.history && this.history.current;
    }
    init(app: any /* Vue component instance */) {
        process.env.NODE_ENV !== 'production' &&
            assert(
                install.installed,
                `not installed. Make sure to call \`Vue.use(VueRouter)\` ` + `before creating root instance.`
            );

        this.apps.push(app);
        // set up app destroyed handler
        // https://github.com/vuejs/vue-router/issues/2639
        app.$once('hook:destroyed', () => {
            // clean out app from this.apps array once destroyed
            const index = this.apps.indexOf(app);
            if (index > -1) this.apps.splice(index, 1);
            // ensure we still have a main app or null if no apps
            // we do not release the router so it can be reused
            if (this.app === app) this.app = this.apps[0] || null;

            if (!this.app) this.history.teardown();
        });

        // main app previously initialized
        // return as we don't need to set up new history listener
        if (this.app) {
            return;
        }
        this.app = app;
        const history = this.history;
        if (history instanceof HTML5History || history instanceof HashHistory) {
            const handleInitialScroll = (routeOrError) => {
                const from = history.current;
                const expectScroll = this.options.scrollBehavior;
                const supportsScroll = supportsPushState && expectScroll;

                if (supportsScroll && 'fullPath' in routeOrError) {
                    handleScroll(this, routeOrError, from, false);
                }
            };
            const setupListeners = (routeOrError) => {
                history.setupListeners();
                handleInitialScroll(routeOrError);
            };
            history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners);
        }
        history.listen((route) => {
            this.apps.forEach((app) => {
                app._route = route;
            });
        });
    }
    beforeEach(fn: Function): Function {
        return registerHook(this.beforeHooks, fn);
    }
    beforeResolve(fn: Function): Function {
        return registerHook(this.resolveHooks, fn);
    }
    afterEach(fn: Function): Function {
        return registerHook(this.afterHooks, fn);
    }
    onReady(cb: Function, errorCb?: Function) {
        this.history.onReady(cb, errorCb);
    }
    onError(errorCb: Function) {
        this.history.onError(errorCb);
    }
    /** 调用route.push实际是调用history.push */
    push(location: RawLocation, onComplete?: Function, onAbort?: Function) {
        // $flow-disable-line
        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject) => {
                this.history.push(location, resolve, reject);
            });
        } else {
            this.history.push(location, onComplete, onAbort);
        }
    }
    replace(location: RawLocation, onComplete?: Function, onAbort?: Function) {
        // $flow-disable-line
        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject) => {
                this.history.replace(location, resolve, reject);
            });
        } else {
            this.history.replace(location, onComplete, onAbort);
        }
    }
    go(n: number) {
        this.history.go(n);
    }
    back() {
        this.go(-1);
    }
    forward() {
        this.go(1);
    }
    getMatchedComponents(to?: RawLocation | Route): Array<any> {
        const route: any = to ? (to.matched ? to : this.resolve(to).route) : this.currentRoute;
        if (!route) {
            return [];
        }
        return [].concat.apply(
            [],
            route.matched.map((m) => {
                return Object.keys(m.components).map((key) => {
                    return m.components[key];
                });
            })
        );
    }
    resolve(
        to: RawLocation,
        current?: Route,
        append?: boolean
    ): {
        location: Location,
        route: Route,
        href: string,
        // for backwards compat
        normalizedTo: Location,
        resolved: Route,
    } {
        current = current || this.history.current;
        const location = normalizeLocation(to, current, append, this);
        const route = this.match(location, current);
        const fullPath = route.redirectedFrom || route.fullPath;
        const base = this.history.base;
        const href = createHref(base, fullPath, this.mode);
        return {
            location,
            route,
            href,
            // for backwards compat
            normalizedTo: location,
            resolved: route,
        };
    }
    getRoutes() {
        return this.matcher.getRoutes();
    }
    addRoute(parentOrRoute: string | RouteConfig, route?: RouteConfig) {
        this.matcher.addRoute(parentOrRoute, route);
        if (this.history.current !== START) {
            this.history.transitionTo(this.history.getCurrentLocation());
        }
    }
    addRoutes(routes: Array<RouteConfig>) {
        if (process.env.NODE_ENV !== 'production') {
            warn(
                false,
                'router.addRoutes() is deprecated and has been removed in Vue Router 4. Use router.addRoute() instead.'
            );
        }
        this.matcher.addRoutes(routes);
        if (this.history.current !== START) {
            this.history.transitionTo(this.history.getCurrentLocation());
        }
    }
}

VueRouter.install = install;
/** install
 * 
 * @param {*} Vue 
 * @returns 
 * 
 * vue-router\src\install.js
 */
function install (Vue) {
    if (install.installed && _Vue === Vue) return
    install.installed = true  
    _Vue = Vue  
    const isDef = v => v !== undefined  
    const registerInstance = (vm, callVal) => {
      let i = vm.$options._parentVnode
      if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
        i(vm, callVal)
      }
    }  
    Vue.mixin({
      beforeCreate () {
        if (isDef(this.$options.router)) {
          this._routerRoot = this
          this._router = this.$options.router
          this._router.init(this)
          Vue.util.defineReactive(this, '_route', this._router.history.current)
        } else {
          this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
        }
        registerInstance(this, this)
      },
      destroyed () {
        registerInstance(this)
      }
    })
VueRouter.version = '__VERSION__';
VueRouter.isNavigationFailure = isNavigationFailure;
VueRouter.NavigationFailureType = NavigationFailureType;
VueRouter.START_LOCATION = START;

if (inBrowser && window.Vue) {
    window.Vue.use(VueRouter);
}

/** createMatcher -> 生成路由匹配器
 *
 * vue-router\src\create-matcher.js
 */
function createMatcher(routes, router) {
    const { pathList, pathMap, nameMap } = createRouteMap(routes);
    function addRoutes(routes) {
        createRouteMap(routes, pathList, pathMap, nameMap);
    }
    function addRoute(parentOrRoute, route) {
        const parent = typeof parentOrRoute !== 'object' ? nameMap[parentOrRoute] : undefined;
        // $flow-disable-line
        createRouteMap([route || parentOrRoute], pathList, pathMap, nameMap, parent);

        // add aliases of parent
        if (parent && parent.alias.length) {
            createRouteMap(
                // $flow-disable-line route is defined if parent is
                parent.alias.map((alias) => ({ path: alias, children: [route] })),
                pathList,
                pathMap,
                nameMap,
                parent
            );
        }
    }
    function getRoutes() {
        return pathList.map((path) => pathMap[path]);
    }
    function match(raw: RawLocation, currentRoute?: Route, redirectedFrom?: Location): Route {
        const location = normalizeLocation(raw, currentRoute, false, router);
        const { name } = location;
        /** 走name跳转 */
        if (name) {
            const record = nameMap[name];
            if (process.env.NODE_ENV !== 'production') {
                warn(record, `Route with name '${name}' does not exist`);
            }
            if (!record) return _createRoute(null, location);
            const paramNames = record.regex.keys.filter((key) => !key.optional).map((key) => key.name);

            if (typeof location.params !== 'object') {
                location.params = {};
            }
            if (currentRoute && typeof currentRoute.params === 'object') {
                for (const key in currentRoute.params) {
                    if (!(key in location.params) && paramNames.indexOf(key) > -1) {
                        location.params[key] = currentRoute.params[key];
                    }
                }
            }
            location.path = fillParams(record.path, location.params, `named route "${name}"`);
            return _createRoute(record, location, redirectedFrom);
        } else if (location.path) {
            /** 走path跳转 */
            location.params = {};
            for (let i = 0; i < pathList.length; i++) {
                const path = pathList[i];
                const record = pathMap[path];
                function matchRoute(regex: RouteRegExp, path: string, params: Object): boolean {
                    const m = path.match(regex);
                    if (!m) {
                        return false;
                    } else if (!params) {
                        return true;
                    }
                    for (let i = 1, len = m.length; i < len; ++i) {
                        const key = regex.keys[i - 1];
                        if (key) {
                            // Fix #1994: using * with props: true generates a param named 0
                            params[key.name || 'pathMatch'] = typeof m[i] === 'string' ? decode(m[i]) : m[i];
                        }
                    }
                    return true;
                }
                if (matchRoute(record.regex, location.path, location.params)) {
                    return _createRoute(record, location, redirectedFrom);
                }
            }
        }
        // no match
        return _createRoute(null, location);
    }
    function redirect(record: RouteRecord, location: Location): Route {
        const originalRedirect = record.redirect;
        let redirect =
            typeof originalRedirect === 'function'
                ? originalRedirect(createRoute(record, location, null, router))
                : originalRedirect;

        if (typeof redirect === 'string') {
            redirect = { path: redirect };
        }

        if (!redirect || typeof redirect !== 'object') {
            if (process.env.NODE_ENV !== 'production') {
                warn(false, `invalid redirect option: ${JSON.stringify(redirect)}`);
            }
            return _createRoute(null, location);
        }
        const re: Object = redirect;
        const { name, path } = re;
        let { query, hash, params } = location;
        query = re.hasOwnProperty('query') ? re.query : query;
        hash = re.hasOwnProperty('hash') ? re.hash : hash;
        params = re.hasOwnProperty('params') ? re.params : params;
        if (name) {
            // resolved named direct
            const targetRecord = nameMap[name];
            if (process.env.NODE_ENV !== 'production') {
                assert(targetRecord, `redirect failed: named route "${name}" not found.`);
            }
            return match(
                {
                    _normalized: true,
                    name,
                    query,
                    hash,
                    params,
                },
                undefined,
                location
            );
        } else if (path) {
            // 1. resolve relative redirect
            const rawPath = resolveRecordPath(path, record);
            // 2. resolve params
            const resolvedPath = fillParams(rawPath, params, `redirect route with path "${rawPath}"`);
            // 3. rematch with existing query and hash
            return match(
                {
                    _normalized: true,
                    path: resolvedPath,
                    query,
                    hash,
                },
                undefined,
                location
            );
        } else {
            if (process.env.NODE_ENV !== 'production') {
                warn(false, `invalid redirect option: ${JSON.stringify(redirect)}`);
            }
            return _createRoute(null, location);
        }
    }
    function alias(record: RouteRecord, location: Location, matchAs: string): Route {
        const aliasedPath = fillParams(matchAs, location.params, `aliased route with path "${matchAs}"`);
        const aliasedMatch = match({
            _normalized: true,
            path: aliasedPath,
        });
        if (aliasedMatch) {
            const matched = aliasedMatch.matched;
            const aliasedRecord = matched[matched.length - 1];
            location.params = aliasedMatch.params;
            return _createRoute(aliasedRecord, location);
        }
        return _createRoute(null, location);
    }
    function _createRoute(record: ?RouteRecord, location: Location, redirectedFrom?: Location): Route {
        if (record && record.redirect) {
            return redirect(record, redirectedFrom || location);
        }
        if (record && record.matchAs) {
            return alias(record, location, record.matchAs);
        }
        return createRoute(record, location, redirectedFrom, router);
    }
    return {
        match,
        addRoute,
        getRoutes,
        addRoutes,
    };
}
/** createRouteMap -> 生成路由映射MAP表，包含以下三个字段
 * pathList： 路由数组列表 Array
 * pathMap：路由path-map  Object
 * nameMap：路由name-map  Object
 *
 * vue-router\src\create-route-map.js
 */
function createRouteMap(routes) {
    const pathList = [];
    const pathMap = Object.create(null);
    const nameMap = Object.create(null);
    routes.forEach((route) => {
        addRouteRecord(pathList, pathMap, nameMap, route, parentRoute);
    });

    function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
        const { path, name } = route;
        const pathToRegexpOptions = {};
        const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);
        function normalizePath(path, parent, strict) {
            if (!strict) path = path.replace(/\/$/, '');
            if (path[0] === '/') return path;
            if (parent == null) return path;
            /** 格式化匹配到的'//'路径为'/' */
            function cleanPath(path) {
                return path.replace(/\/+/g, '/');
            }
            /** 如果是嵌套子路由，则拼上父路由拼成完整路由链接 */
            return cleanPath(`${parent.path}/${path}`);
        }
        if (typeof route.caseSensitive === 'boolean') {
            pathToRegexpOptions.sensitive = route.caseSensitive;
        }
        const record = {
            path: normalizedPath,
            regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
            components: route.components || { default: route.component },
            alias: route.alias ? (typeof route.alias === 'string' ? [route.alias] : route.alias) : [],
            instances: {},
            enteredCbs: {},
            name,
            parent,
            matchAs,
            redirect: route.redirect,
            beforeEnter: route.beforeEnter,
            meta: route.meta || {},
            props: route.props == null ? {} : route.components ? route.props : { default: route.props },
        };
        function compileRouteRegex(path, pathToRegexpOptions) {
            /** Regexp -> 来自npm包path-to-regexp, 生成path的正则表达式 */
            const regex = Regexp(path, [], pathToRegexpOptions);
            if (process.env.NODE_ENV !== 'production') {
                const keys = Object.create(null);
                regex.keys.forEach((key) => {
                    warn(!keys[key.name], `Duplicate param keys in route with path: "${path}"`);
                    keys[key.name] = true;
                });
            }
            return regex;
        }
        /** 如果路由有嵌套子路由 */
        if (route.children) {
            // Warn if route is named, does not redirect and has a default child route.
            // If users navigate to this route by name, the default child will
            // not be rendered (GH Issue #629)
            if (process.env.NODE_ENV !== 'production') {
                if (route.name && !route.redirect && route.children.some((child) => /^\/?$/.test(child.path))) {
                    warn(
                        false,
                        `Named Route '${route.name}' has a default child route. ` +
                            `When navigating to this named route (:to="{name: '${route.name}'"), ` +
                            `the default child route will not be rendered. Remove the name from ` +
                            `this route and use the name of the default child route for named ` +
                            `links instead.`
                    );
                }
            }
            route.children.forEach((child) => {
                const childMatchAs = matchAs ? cleanPath(`${matchAs}/${child.path}`) : undefined;
                /** 对子路由进行递归处理,将当前record当做子路由的parent参数传递 */
                addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
            });
        }

        if (!pathMap[record.path]) {
            pathList.push(record.path);
            pathMap[record.path] = record;
        }

        if (route.alias !== undefined) {
            const aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
            for (let i = 0; i < aliases.length; ++i) {
                const alias = aliases[i];
                if (process.env.NODE_ENV !== 'production' && alias === path) {
                    warn(
                        false,
                        `Found an alias with the same value as the path: "${path}". You have to remove that alias. It will be ignored in development.`
                    );
                    // skip in dev to make it work
                    continue;
                }
                const aliasRoute = {
                    path: alias,
                    children: route.children,
                };
                addRouteRecord(
                    pathList,
                    pathMap,
                    nameMap,
                    aliasRoute,
                    parent,
                    record.path || '/' // matchAs
                );
            }
        }
        if (name) {
            if (!nameMap[name]) {
                nameMap[name] = record;
            } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
                warn(false, `Duplicate named routes definition: ` + `{ name: "${name}", path: "${record.path}" }`);
            }
        }
    }
    // ensure wildcard routes are always at the end
    for (let i = 0, l = pathList.length; i < l; i++) {
        if (pathList[i] === '*') {
            pathList.push(pathList.splice(i, 1)[0]);
            l--;
            i--;
        }
    }
    if (process.env.NODE_ENV === 'development') {
        // warn if routes do not include leading slashes
        const found = pathList
            // check for missing leading slash
            .filter((path) => path && path.charAt(0) !== '*' && path.charAt(0) !== '/');

        if (found.length > 0) {
            const pathNames = found.map((path) => `- ${path}`).join('\n');
            warn(
                false,
                `Non-nested routes must include a leading slash character. Fix the following routes: \n${pathNames}`
            );
        }
    }
    return {
        pathList,
        pathMap,
        nameMap,
    };
}

/**
 * createRoute | formatMatch
 *
 * vue-router\src\util\route.js
 */
function createRoute(record: ?RouteRecord, location: Location, redirectedFrom?: ?Location, router?: VueRouter): Route {
    const stringifyQuery = router && router.options.stringifyQuery;
    let query: any = location.query || {};
    try {
        query = clone(query);
    } catch (e) {}
    const route = {
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
function formatMatch(record) {
    const res = [];
    while (record) {
        res.unshift(record);
        record = record.parent;
    }
    return res;
}
