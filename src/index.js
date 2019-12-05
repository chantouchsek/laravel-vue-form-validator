import ErrorValidator from './Validator';
import Vue from 'vue'

const bus = new Vue();

class Validator {
    install(Vue) {
        const axios = bus.$axios || require('axios');
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
