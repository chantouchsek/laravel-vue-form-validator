/*
Nuxt.js module for laravel-vue-form-validator

Usage:
    - Install laravel-vue-form-validator package
    - Add this into your nuxt.config.js file:
    {
        modules: [
            // Optionally passing options in module configuration
            ['vue-form-validator/nuxt', { baseUrl: 'http://localhost:3000', prefix: '/api' }]
        ],
        // Optionally passing options in module top level configuration
        vueFormValidator: { baseUrl: 'http://localhost:3000', prefix: '/api' }
    }
*/

const { resolve } = require('path');

module.exports = function nuxtVueFormValidatorModule (moduleOptions = {}) {
    const { vueFormValidator = {} } = this.options
    const options = {
        ...vueFormValidator,
        ...moduleOptions
    }
    const { prefix = null, baseURL = null } = options
    let baseUrl = undefined;
    if (baseURL) {
        baseUrl = prefix ? baseURL + prefix : baseURL
    } else if (process.env.API_HOST) {
        baseUrl = prefix ? process.env.API_HOST + prefix : process.env.API_HOST
    } else if (process.env.API_URL) {
        baseUrl = prefix ? process.env.API_URL + prefix : process.env.API_URL
    }
    Object.assign(options, { baseUrl })
    this.addPlugin({
        src: resolve(__dirname, 'vue-form-validator-plugin.template.js'),
        fileName: 'vue-form-validator-plugin.js',
        options,
    });
};

// required by nuxt
module.exports.meta = require('../package.json');
