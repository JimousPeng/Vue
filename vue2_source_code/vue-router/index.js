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
            location.params = {};
            for (let i = 0; i < pathList.length; i++) {
                const path = pathList[i];
                const record = pathMap[path];
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
