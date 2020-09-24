import Vue from 'vue';
import FormValidator, { BaseProxy, Validator } from 'laravel-vue-form-validator';

export default ({ app, $axios }) => {
    Vue.use(FormValidator);
    app.$errors = Validator;
    BaseProxy.$http = $axios;
}
