import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import {
    mapInstanceState,
    mapInstanceGetters,
    mapInstanceMutations,
    mapInstanceActions,
} from '../src/vuex-helpers';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Vuex Store Utils', () => {

    describe('instance-aware map* functions', () => {

        describe('mapInstanceState', () => {

            const testModule = {
                namespaced: true,
                state: () => ({
                    value: 1,
                }),
            };

            const getModuleName = cmp => cmp.vuexNamespace;

            function getComponent() {
                return localVue.component('test-component', {
                    props: ['vuexNamespace'],
                    computed: {
                        ...mapInstanceState(getModuleName, ['value']),
                        ...mapInstanceState(getModuleName, {
                            value2: state => state.value,
                        }),
                    },
                    render(h) {
                        return h('div');
                    },
                });
            }

            it('should provide mapState based on an instance-aware function', () => {
                const store = new Vuex.Store({
                    state: {},
                    modules: {
                        myNamespace: testModule,
                    },
                });

                const wrapper = mount(getComponent(), {
                    propsData: {
                        vuexNamespace: 'myNamespace',
                    },
                    mocks: {
                        $store: store,
                    },
                });

                expect(wrapper.vm.value).toBe(store.state.myNamespace.value);
                expect(wrapper.vm.value).toBe(1);
                expect(wrapper.vm.value2).toBe(store.state.myNamespace.value);
                expect(wrapper.vm.value2).toBe(1);
            });

            it('should work for nested modules', () => {
                const store = new Vuex.Store({
                    state: {},
                    modules: {
                        parent: {
                            namespaced: true,
                            modules: {
                                child: {
                                    namespaced: true,
                                    modules: {
                                        grandchild: testModule,
                                    },
                                },
                            },
                        },
                    },
                });

                const wrapper = mount(getComponent(), {
                    propsData: {
                        vuexNamespace: 'parent/child/grandchild',
                    },
                    mocks: {
                        $store: store,
                    },
                });

                expect(wrapper.vm.value).toBe(store.state.parent.child.grandchild.value);
                expect(wrapper.vm.value).toBe(1);
                expect(wrapper.vm.value2).toBe(store.state.parent.child.grandchild.value);
                expect(wrapper.vm.value2).toBe(1);
            });

        });

        describe('mapInstanceGetters', () => {
            const testModule = {
                namespaced: true,
                state: () => ({
                    value: 1,
                }),
                getters: {
                    valueGetter(state) {
                        return state.value;
                    },
                },
            };

            const getModuleName = cmp => cmp.vuexNamespace;

            function getComponent() {
                return localVue.component('test-component', {
                    props: ['vuexNamespace'],
                    computed: {
                        ...mapInstanceGetters(getModuleName, ['valueGetter']),
                        ...mapInstanceGetters(getModuleName, {
                            valueGetter2: 'valueGetter',
                        }),
                    },
                    render(h) {
                        return h('div');
                    },
                });
            }

            it('should provide mapGetters based on an instance-aware function', () => {
                const store = new Vuex.Store({
                    state: {},
                    modules: {
                        myNamespace: testModule,
                    },
                });

                const wrapper = mount(getComponent(), {
                    propsData: {
                        vuexNamespace: 'myNamespace',
                    },
                    mocks: {
                        $store: store,
                    },
                });

                expect(wrapper.vm.valueGetter).toBe(store.state.myNamespace.value);
                expect(wrapper.vm.valueGetter).toBe(1);
                expect(wrapper.vm.valueGetter2).toBe(store.state.myNamespace.value);
                expect(wrapper.vm.valueGetter2).toBe(1);
            });

            it('should work for nested modules', () => {
                const store = new Vuex.Store({
                    state: {},
                    modules: {
                        parent: {
                            namespaced: true,
                            modules: {
                                child: {
                                    namespaced: true,
                                    modules: {
                                        grandchild: testModule,
                                    },
                                },
                            },
                        },
                    },
                });

                const wrapper = mount(getComponent(), {
                    propsData: {
                        vuexNamespace: 'parent/child/grandchild',
                    },
                    mocks: {
                        $store: store,
                    },
                });

                expect(wrapper.vm.valueGetter).toBe(store.state.parent.child.grandchild.value);
                expect(wrapper.vm.valueGetter).toBe(1);
                expect(wrapper.vm.valueGetter2).toBe(store.state.parent.child.grandchild.value);
                expect(wrapper.vm.valueGetter2).toBe(1);
            });

        });

        describe('mapInstanceMutations', () => {

            const testModule = {
                namespaced: true,
                state: () => ({
                    value: 1,
                }),
                mutations: {
                    SET_VALUE(state, payload) {
                        // eslint-disable-next-line no-param-reassign
                        state.value = payload;
                    },
                },
            };

            const getModuleName = cmp => cmp.vuexNamespace;

            function getComponent() {
                return localVue.component('test-component', {
                    props: ['vuexNamespace'],
                    methods: {
                        ...mapInstanceMutations(getModuleName, ['SET_VALUE']),
                        ...mapInstanceMutations(getModuleName, {
                            setValue: 'SET_VALUE',
                        }),
                    },
                    render(h) {
                        return h('div');
                    },
                });
            }

            it('should provide mapMutations based on an instance-aware function', () => {
                const store = new Vuex.Store({
                    state: {},
                    modules: {
                        myNamespace: testModule,
                    },
                });

                const wrapper = mount(getComponent(), {
                    propsData: {
                        vuexNamespace: 'myNamespace',
                    },
                    mocks: {
                        $store: store,
                    },
                });

                expect(store.state.myNamespace.value).toBe(1);
                wrapper.vm.SET_VALUE(2);
                expect(store.state.myNamespace.value).toBe(2);
                wrapper.vm.setValue(3);
                expect(store.state.myNamespace.value).toBe(3);
            });

            it('should work for nested modules', () => {
                const store = new Vuex.Store({
                    state: {},
                    modules: {
                        parent: {
                            namespaced: true,
                            modules: {
                                child: {
                                    namespaced: true,
                                    modules: {
                                        grandchild: testModule,
                                    },
                                },
                            },
                        },
                    },
                });

                const wrapper = mount(getComponent(), {
                    propsData: {
                        vuexNamespace: 'parent/child/grandchild',
                    },
                    mocks: {
                        $store: store,
                    },
                });

                expect(store.state.parent.child.grandchild.value).toBe(1);
                wrapper.vm.SET_VALUE(2);
                expect(store.state.parent.child.grandchild.value).toBe(2);
                wrapper.vm.setValue(3);
                expect(store.state.parent.child.grandchild.value).toBe(3);
            });

        });

        describe('mapInstanceActions', () => {

            const testModule = {
                namespaced: true,
                state: () => ({
                    value: 1,
                }),
                mutations: {
                    SET_VALUE(state, payload) {
                        // eslint-disable-next-line no-param-reassign
                        state.value = payload;
                    },
                },
                actions: {
                    SET_VALUE_ASYNC({ commit }, payload) {
                        return new Promise(r => setTimeout(() => {
                            commit('SET_VALUE', payload);
                            r();
                        }, 1));
                    },
                },
            };

            const getModuleName = cmp => cmp.vuexNamespace;

            function getComponent() {
                return localVue.component('test-component', {
                    props: ['vuexNamespace'],
                    methods: {
                        ...mapInstanceActions(getModuleName, ['SET_VALUE_ASYNC']),
                        ...mapInstanceActions(getModuleName, {
                            setValueAsync: 'SET_VALUE_ASYNC',
                        }),
                    },
                    render(h) {
                        return h('div');
                    },
                });
            }

            it('should provide mapActions based on an instance-aware function', (done) => {
                const store = new Vuex.Store({
                    state: {},
                    modules: {
                        myNamespace: testModule,
                    },
                });

                const wrapper = mount(getComponent(), {
                    propsData: {
                        vuexNamespace: 'myNamespace',
                    },
                    mocks: {
                        $store: store,
                    },
                });

                expect(store.state.myNamespace.value).toBe(1);
                wrapper.vm.SET_VALUE_ASYNC(2)
                    .then(() => {
                        expect(store.state.myNamespace.value).toBe(2);
                        return wrapper.vm.setValueAsync(3);
                    })
                    .then(() => {
                        expect(store.state.myNamespace.value).toBe(3);
                        done();
                    });
            });

            it('should work for nested modules', (done) => {
                const store = new Vuex.Store({
                    state: {},
                    modules: {
                        parent: {
                            namespaced: true,
                            modules: {
                                child: {
                                    namespaced: true,
                                    modules: {
                                        grandchild: testModule,
                                    },
                                },
                            },
                        },
                    },
                });

                const wrapper = mount(getComponent(), {
                    propsData: {
                        vuexNamespace: 'parent/child/grandchild',
                    },
                    mocks: {
                        $store: store,
                    },
                });

                expect(store.state.parent.child.grandchild.value).toBe(1);
                wrapper.vm.SET_VALUE_ASYNC(2)
                    .then(() => {
                        expect(store.state.parent.child.grandchild.value).toBe(2);
                        return wrapper.vm.setValueAsync(3);
                    })
                    .then(() => {
                        expect(store.state.parent.child.grandchild.value).toBe(3);
                        done();
                    });
            });

        });

    });

});
