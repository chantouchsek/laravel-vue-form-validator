import Vue from 'vue';
import FormValidator, { BaseProxy, Validator } from 'laravel-vue-form-validator';

Vue.use(FormValidator);

export default ({ app, $axios }) => {
    const [pluginOptions] = [<%= serialize(options) %>]
    const { baseUrl } = pluginOptions || {}
    app.$errors = Validator;
    BaseProxy.$http = $axios;
    if (pluginOptions && baseUrl) {
        BaseProxy.$baseUrl = baseUrl
    }
}
