import Vue from 'vue';
import FormValidator, { BaseProxy, Validator } from 'laravel-vue-form-validator';

Vue.use(FormValidator);

export default ({ app, $axios }) => {
    const [pluginOptions] = [<%= serialize(options) %>]
    const { baseUrl, prefix } = pluginOptions || {}
    app.$errors = Validator;
    BaseProxy.$http = $axios;
    if (baseUrl) {
        BaseProxy.$baseUrl = baseUrl
    }
    if (prefix) {
        BaseProxy.$prefix = prefix
    }
}
