/*
Nuxt.js module for laravel-vue-form-validator

Usage:
    - Install vue-form-validator package
    - Add this into your nuxt.config.js file:
    {
        modules: [
            // Simple usage
            'laravel-vue-form-validator/nuxt'
            // Optionally passing options in module configuration
            ['vue-form-validator/nuxt', { baseUrl: 'http://localhost:3000/api' }]
        ],
        // Optionally passing options in module top level configuration
        vue-form-validator: { baseUrl: 'http://localhost:3000/api' }
    }
*/

const { resolve } = require('path');

module.exports = function nuxtVueFormValidatorModule (moduleOptions) {
  const options = Object.assign({}, this.options['vue-form-validator'], moduleOptions);

  // Register plugin
  this.addPlugin({
    src: resolve(__dirname, 'vue-form-validator-plugin.template.js'),
    fileName: 'vue-form-validator-plugin.js',
    options: options
  });
};

// required by nuxt
module.exports.meta = require('../package.json');
