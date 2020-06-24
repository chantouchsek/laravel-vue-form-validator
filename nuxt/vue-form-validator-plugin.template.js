import Vue from 'vue';
import FormValidator from 'laravel-vue-form-validator';

Vue.use(FormValidator);

export default ({ app }) => {
    // inject options from module
    const [pluginOptions] = [<%= serialize(options) %>]
    app.$errors = FormValidator;
}
