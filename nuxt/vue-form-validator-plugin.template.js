import Vue from 'vue';
import FormValidator, { BaseProxy } from 'laravel-vue-form-validator';

Vue.use(FormValidator);

export default ({ app, $axios }) => {
    const [pluginOptions] = [<%= serialize(options) %>]
    const { baseUrl } = pluginOptions || {}
    app.$errors = FormValidator;
    BaseProxy.$http = $axios;
    BaseProxy.$baseUrl = baseUrl
}
