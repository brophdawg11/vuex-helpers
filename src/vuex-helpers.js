function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function getModuleState(state, ns) {
    // "Walk" the state tree step by step to support nested namespaces
    return ns.split('/').reduce((s, p) => s[p], state);
}

/**
 * @description
 * mapState implementation that supports a dynamic module namespaced based on
 * the component instance
 *
 * @param   {Function}        getNamespace Function accepting a component instance
 *                                         and returning a slash-separated Vuex
 *                                         module namespace
 * @param   {Object|String[]} mappers      Object of mapper functions or arrays of
 *                                         state field strings
 * @returns {Object}          instance-aware state computed property methods
 */
export function mapInstanceState(getNamespace, mappers) {
    if (Array.isArray(mappers)) {
        return mappers.reduce((acc, name) => Object.assign(acc, {
            // Note: Do not use an arrow function as we need to capture `this` at runtime
            [name]() {
                const moduleState = getModuleState(this.$store.state, getNamespace(this));
                return moduleState[name];
            },
        }), {});
    }

    // istanbul ignore else
    if (isPlainObject(mappers)) {
        return Object.entries(mappers).reduce((acc, [name, mapper]) => Object.assign(acc, {
            // Note: Do not use an arrow function as we need to capture `this` at runtime
            [name]() {
                const moduleState = getModuleState(this.$store.state, getNamespace(this));
                return mapper.call(this, moduleState);
            },
        }), {});
    }

    // istanbul ignore next
    console.warn('mapInstanceState requires an array or object as the second argument');
    // istanbul ignore next
    return {};
}

/**
 * @description
 * mapGetters implementation that supports a dynamic module namespaced based on
 * the component instance
 *
 * @param   {Function}        getNamespace Function accepting a component instance
 *                                         and returning a slash-separated Vuex
 *                                         module namespace
 * @param   {String[]|Object} mappers      Array of getter names or object of
 *                                         getter aliases
 * @returns {Object}          instance-aware state computed property methods
 */
export function mapInstanceGetters(getNamespace, mappers) {
    if (Array.isArray(mappers)) {
        return mappers.reduce((acc, name) => Object.assign(acc, {
            // Note: Do not use an arrow function as we need to capture `this` at runtime
            [name]() {
                return this.$store.getters[`${getNamespace(this)}/${name}`];
            },
        }), {});
    }

    // istanbul ignore else
    if (isPlainObject(mappers)) {
        return Object.entries(mappers).reduce((acc, [alias, name]) => Object.assign(acc, {
            // Note: Do not use an arrow function as we need to capture `this` at runtime
            [alias]() {
                return this.$store.getters[`${getNamespace(this)}/${name}`];
            },
        }), {});
    }

    // istanbul ignore next
    console.warn('mapInstanceGetters requires an array or object as the second argument');
    // istanbul ignore next
    return {};
}

/**
 * @description
 * mapMutations implementation that supports a dynamic module namespaced based on
 * the component instance
 *
 * @param   {Function}        getNamespace Function accepting a component instance
 *                                         and returning a slash-separated Vuex
 *                                         module namespace
 * @param   {String[]|Object} mutations    Array of mutation names or object of
 *                                         mutation aliases
 * @returns {Object}          instance-aware state computed property methods
 */
export function mapInstanceMutations(getNamespace, mutations) {
    if (Array.isArray(mutations)) {
        return mutations.reduce((acc, name) => Object.assign(acc, {
            [name](payload) {
                return this.$store.commit(`${getNamespace(this)}/${name}`, payload);
            },
        }), {});
    }

    // istanbul ignore else
    if (isPlainObject(mutations)) {
        return Object.entries(mutations).reduce((acc, [alias, name]) => Object.assign(acc, {
            [alias](payload) {
                return this.$store.commit(`${getNamespace(this)}/${name}`, payload);
            },
        }), {});
    }

    // istanbul ignore next
    console.warn('mapInstanceMutations requires an array or object as the second argument');
    // istanbul ignore next
    return {};
}

/**
 * @description
 * mapMutations implementation that supports a dynamic module namespaced based on
 * the component instance
 *
 * @param   {Function}        getNamespace Function accepting a component instance
 *                                         and returning a slash-separated Vuex
 *                                         module namespace
 * @param   {String[]|Object} actions      Array of action names or object of
 *                                         action aliases
 * @returns {Object}          instance-aware state computed property methods
 */
export function mapInstanceActions(getNamespace, actions) {
    if (Array.isArray(actions)) {
        return actions.reduce((acc, name) => Object.assign(acc, {
            [name](payload) {
                return this.$store.dispatch(`${getNamespace(this)}/${name}`, payload);
            },
        }), {});
    }

    // istanbul ignore else
    if (isPlainObject(actions)) {
        return Object.entries(actions).reduce((acc, [alias, name]) => Object.assign(acc, {
            [alias](payload) {
                return this.$store.dispatch(`${getNamespace(this)}/${name}`, payload);
            },
        }), {});
    }

    // istanbul ignore next
    console.warn('mapInstanceActions requires an array or object as the second argument');
    // istanbul ignore next
    return {};
}
