import Vue from 'vue';
import Vlidator, { Validator } from 'vue-vlidator';

Vue.use(Vlidator); // add vue-vlidator as Vue plugin

export default ({ app }) => {
    // inject options from module
    const i18n = app.i18n;
    const [pluginOptions] = [<%= serialize(options) %>]
    if (i18n && i18n.locale && !pluginOptions.locale) {
        Object.assign(pluginOptions, { locale: i18n.locale })
    }
    app.$vlidator = new Validator({}, {}, pluginOptions);
}
