/*
Nuxt.js module for laravel-vue-form-validator

Usage:
    - Install laravel-vue-form-validator package
    - Add this into your nuxt.config.js file:
    {
        modules: [
            // Optionally passing options in module configuration
            ['vue-form-validator/nuxt', { baseURL: 'http://localhost:3000', prefix: '/api' }]
        ],
        // Optionally passing options in module top level configuration
        vueFormValidator: { baseURL: 'http://localhost:3000', prefix: '/api' }
    }
*/

const { resolve } = require('path');

module.exports = function nuxtVueFormValidatorModule(moduleOptions = {}) {
    const { vueFormValidator = {} } = this.options;
    const options = {
        ...vueFormValidator,
        ...moduleOptions,
    };
    const { baseURL = null } = options;
    let baseUrl = baseURL;
    if (process.env.API_HOST) {
        baseUrl = process.env.API_HOST;
    } else if (process.env.API_URL) {
        baseUrl = process.env.API_URL;
    }
    Object.assign(options, { baseUrl });
    this.addPlugin({
        src: resolve(__dirname, 'vue-form-validator-plugin.template.js'),
        fileName: 'vue-form-validator-plugin.js',
        options,
    });
    this.options.build.transpile.push(/^escape-string-regexp/);
};

// required by nuxt
module.exports.meta = require('../package.json');
