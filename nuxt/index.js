/*
Nuxt.js module for vue-vlidator

Usage:
    - Install vue-vlidator package
    - Add this into your nuxt.config.js file:
    {
        modules: [
            // Simple usage
            'vue-vlidator/nuxt'

            // Optionally passing options in module configuration
            ['vue-vlidator/nuxt', { locale: 'km' }]
        ],

        // Optionally passing options in module top level configuration
        vlidator: { locale: 'km' }
    }
*/

const { resolve } = require('path');

module.exports = function nuxtVueVlidatorModule (moduleOptions) {
  const options = Object.assign({}, this.options.$vlidator, moduleOptions);

  // Register plugin
  this.addPlugin({
    src: resolve(__dirname, 'vue-vlidator-plugin.template.js'),
    fileName: 'vue-vlidator-plugin.js',
    options: options
  });
};

// required by nuxt
module.exports.meta = require('../package.json');
