import Validator from './Validator';
import axios from 'axios';

class FormValidator {
    install(Vue, options = {}) {
        axios.interceptors.response.use(
            response => {
                return response;
            },
            (error) => {
                const { status = 0, data = {} } = error.response
                if (status === 422) {
                    Validator.fill(data.errors);
                }
                return Promise.reject(error);
            }
        );
        Vue.mixin({
            beforeCreate() {
                this.$options.$errors = {};
                Vue.util.defineReactive(this.$options, '$errors', Validator);
                if (!this.$options.computed) {
                    this.$options.computed = {};
                }
                this.$options.computed.$errors = function() {
                    return this.$options.$errors;
                };
            },
        });
    }
}

export { default as Validator } from './Validator';
export { default as BaseProxy } from './BaseProxy';
export { default as BaseTransformer } from './BaseTransformer';
export default new FormValidator();
