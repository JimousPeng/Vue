class Observer {
    value: any
    dep: Dep
    vmCount: number // number of vms that have this object as root $data

    constructor(value: any) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        function def(obj: Object, key: string, val: any, enumerable?: boolean) {
            Object.defineProperty(obj, key, {
                value: val,
                enumerable: !!enumerable,
                writable: true,
                configurable: true,
            })
        }
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            if (hasProto) {
                protoAugment(value, arrayMethods)
            } else {
                copyAugment(value, arrayMethods, arrayKeys)
            }
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    /**
     * Walk through all properties and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    walk(obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
            function defineReactive(obj: Object, key: string, val: any, customSetter?: ?Function, shallow?: boolean) {
                const dep = new Dep()
                const property = Object.getOwnPropertyDescriptor(obj, key)
                if (property && property.configurable === false) {
                    return
                }
                // cater for pre-defined getter/setters
                const getter = property && property.get
                const setter = property && property.set
                if ((!getter || setter) && arguments.length === 2) {
                    val = obj[key]
                }
                let childOb = !shallow && observe(val)
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    get: function reactiveGetter() {
                        const value = getter ? getter.call(obj) : val
                        if (Dep.target) {
                            dep.depend()
                            if (childOb) {
                                childOb.dep.depend()
                                if (Array.isArray(value)) {
                                    dependArray(value)
                                }
                            }
                        }
                        return value
                    },
                    set: function reactiveSetter(newVal) {
                        const value = getter ? getter.call(obj) : val
                        /* eslint-disable no-self-compare */
                        if (newVal === value || (newVal !== newVal && value !== value)) {
                            return
                        }
                        /* eslint-enable no-self-compare */
                        if (process.env.NODE_ENV !== 'production' && customSetter) {
                            customSetter()
                        }
                        // #7981: for accessor properties without setter
                        if (getter && !setter) return
                        if (setter) {
                            setter.call(obj, newVal)
                        } else {
                            val = newVal
                        }
                        childOb = !shallow && observe(newVal)
                        dep.notify()
                    },
                })
            }
        }
    }

    /**
     * Observe a list of Array items.
     */
    observeArray(items: Array<any>) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}
