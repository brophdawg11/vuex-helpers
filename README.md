# vuex-helpers

<!-- MarkdownTOC -->

* [Description](#description)
* [Usage](#usage)
* [Methods](#methods)
  * [mapInstance* Helpers](#mapinstance-helpers)

<!-- /MarkdownTOC -->

## Description

This library is a collection of small utility/helper functions to make working with Vuex easier.

## Usage

Install and save the library:

```
npm install --save @urbn/vuex-helpers
```


## Methods

### mapInstance* Helpers

The `mapInstance*` helpers are 4 helper functions that correspond to existing [Vuex Component Binding Helper functions](https://vuex.vuejs.org/api/#component-binding-helpers) but allow the consumer to use a function to determine a dynamic Vuex module namespace at runtime:

* `mapInstanceState`
* `mapInstanceGetters`
* `mapInstanceMutations`
* `mapInstanceActions`

For example, normally we would use the methods provided by Vuex for static namespaces:

```js
const store = new Vuex.Store({
    modules: {
        auth: {
            namespaced: true,
            state: {
                loggedIn: false,
            },
        },
    },
});

export default {
    name: 'MyComponent',
    computed: {
        ...mapState('auth', {
            loggedIn: state => state.loggedIn,
        }),
    },
};
```

However, this does not work if you are using dynamically generated namespaces.  Consider using a `product` module for multiple products in an e-commerce application:

```
const productModule = {
    namespaced: true,
    state: () => ({
        name: null,
        price: null,
    }),
    mutations: { ... },
};

// At runtime, we may dynamically create multiple modules per product:
store.registerModule(`product-${slug1}`, productModule);
store.registerModule(`product-${slug2}`, productModule);
```

Once we've done this, we can no longer leverage the `map*` helpers because we ave no way to make the namespace dynamic.  This is the problem solved by the `mapInstance*` helpers, in that they let you provide a function that takes your component instance as an argument and you can return a dynamic Vuex module namespace.

Assume we are rendering components as such:

```html
<MyProduct :slug="slug1" />
<MyProduct :slug="slug2" />
```

Then inside `MyProduct` we can choose the proper namespaced Vuex module using a namespace function:

```js
const getNamespace = cmp => `product-${cmp.slug}`;

export default {
    name: 'MyProduct',
    computed: {
        ...mapInstanceState(getNamespace, {
            name: state => state.name,
            price: state => state.price,
        }),
    },
};
```

It should be noted that these helpers are trying to solve a [denied feature request](https://github.com/vuejs/vuex/issues/863) in the core Vuex library.
