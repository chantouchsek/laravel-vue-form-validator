import ErrorValidator from './Validator';

class Validator {
    install(Vue) {
        const windowAxios = typeof window === 'undefined' ? false : window.axios;
        const axios = windowAxios || require('axios');
        axios.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                if (error.response.status === 422) {
                    ErrorValidator.fill(error.response.data.errors);
                }
                return Promise.reject(error);
            }
        );
        Vue.mixin({
            beforeCreate() {
                this.$options.$errors = {};
                Vue.util.defineReactive(this.$options, '$errors', ErrorValidator);
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

export { default as BaseProxy } from './BaseProxy';
export default new Validator();
