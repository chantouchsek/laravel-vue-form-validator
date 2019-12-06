import Validator from './Validator'
import ErrorComponent from './ErrorComponent'
import axios from 'axios'

class FormValidator {
    install (Vue) {
        Vue.component('error', ErrorComponent);
        if (axios) {
            axios.interceptors.response.use((response) => {
                return response;
            }, (error) => {
                if (error.response.status === 422) {
                    Validator.fill(error.response.data.errors)
                }
                return Promise.reject(error);
            });
        }
        Vue.mixin({
            beforeCreate () {
                this.$options.$errors = {};
                Vue.util.defineReactive(this.$options, '$errors', Errors);
                if (!this.$options.computed) {
                    this.$options.computed = {}
                }
                this.$options.computed["$errors"] = function () {
                    return this.$options.$errors;
                };
            },
        })
    }
}

export { default as Validator } from './Validator'
export default new FormValidator()
