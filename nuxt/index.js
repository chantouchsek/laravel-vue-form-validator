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

const { resolve, join } = require('path');
import merge from 'lodash.merge'

module.exports = function nuxtVueFormValidatorModule(moduleOptions = {}) {
    const { vueFormValidator = {} } = this.options;
    const options = merge({}, moduleOptions, vueFormValidator);
    this.addPlugin({
        src: resolve(__dirname, 'vue-form-validator.template.js'),
        fileName: join('vue-form-validator.js'),
        options,
    });
    this.options.build.transpile.push(/^escape-string-regexp/);
};

// required by nuxt
module.exports.meta = require('../package.json');
