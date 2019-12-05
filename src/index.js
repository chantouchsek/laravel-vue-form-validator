import BaseProxy from './BaseProxy';

import ErrorComponent from './views/Error';

class ClassValidator {
    install(Vue) {
        const windowAxios = typeof window === 'undefined' ? false : window.axios;
        const axios = windowAxios || require('axios');
        Vue.component('error-message', ErrorComponent);
        axios.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                if (error.response.status === 422) {
                    Validator.record(error.response.data.errors);
                }
                return Promise.reject(error);
            }
        );
        Vue.mixin({
            beforeCreate() {
                this.$options.$errors = {};
                Vue.util.defineReactive(this.$options, '$errors', BaseProxy);
                if (!this.$options.computed) {
                    this.$options.computed = {};
                }
                this.$options.computed['$errors'] = function() {
                    return this.$options.$errors;
                };
            },
        });
    }
}

export default new ClassValidator();
