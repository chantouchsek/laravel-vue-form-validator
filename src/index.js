export { default } from './Form';
export { default as Form } from './Form';
export { default as Validator } from './Validator';

import Validator from './Validator';
import ErrorComponent from './views/Error';
import axios from 'axios';

class Validator {
    install (Vue) {
        Vue.component('error-message', ErrorComponent);
        if (axios) {
            axios.interceptors.response.use((response) => {
                return response;
            }, (error) => {
                if (error.response.status === 422) {
                    Validator.fill(error.response.data.errors);
                }
                return Promise.reject(error);
            });
        }
        Vue.mixin({
            beforeCreate () {
                this.$options.$errors = {};
                Vue.util.defineReactive(this.$options, '$errors', Validator);
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

export default new Validator();
