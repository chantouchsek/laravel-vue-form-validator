/*
Nuxt.js module for laravel-vue-form-validator

Usage:
    - Install laravel-vue-form-validator package
    - Add this into your nuxt.config.js file:
    {
        modules: [
            // Optionally passing options in module configuration
            ['vue-form-validator/nuxt', { baseUrl: 'http://localhost:3000/api' }]
        ],
        // Optionally passing options in module top level configuration
        vueFormValidator: { baseUrl: 'http://localhost:3000/api' }
    }
*/

const { resolve } = require('path');

module.exports = function nuxtVueFormValidatorModule (moduleOptions) {
  const options = Object.assign({}, this.options.vueFormValidator, moduleOptions);

  // Register plugin
  this.addPlugin({
    src: resolve(__dirname, 'vue-form-validator-plugin.template.js'),
    fileName: 'vue-form-validator-plugin.js',
    options: options
  });
};

// required by nuxt
module.exports.meta = require('../package.json');
