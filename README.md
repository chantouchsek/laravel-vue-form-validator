# An easy way to validate forms using back end logic

[![Latest Version on NPM](https://img.shields.io/npm/v/laravel-vue-form-validator.svg?style=flat-square)](https://npmjs.com/package/laravel-vue-form-validator)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![npm](https://img.shields.io/npm/dt/laravel-vue-form-validator.svg?style=flat-square)](https://npmjs.com/package/laravel-vue-form-validator)
[![npm](https://img.shields.io/npm/dm/laravel-vue-form-validator.svg?style=flat-square)](https://npmjs.com/package/laravel-vue-form-validator)

Wouldn't it be great if you could just use your back end to validate forms on the front end? This package provides a `BaseProxy` class that does exactly that. It can post itself to a configured endpoint and manage errors. The class is meant to be used with a Laravel back end.

Take a look at the [usage section](#usage) to view a detailed example on how to use it.

## Install

You can install the package via yarn (or npm):

```npm
npm install laravel-vue-form-validator
```
```yarn
yarn add laravel-vue-form-validator
```

## Usage

```vuejs
import Vue from 'vue'
import FormValidator from 'laravel-vue-form-validator'

Vue.use(FormValidator)
```

## Nuxt Support

- Create plugin
```bash
form-validator.js
```

```vuejs
import Vue from 'vue'
import FormValidator from 'laravel-vue-form-validator'

Vue.use(FormValidator)
```
```bash
nuxt.config.js

plugins: [
    .....
    { src: '~/plugins/form-validator', mode: 'all' },
    .....
]
```

It will create ```$errors``` object inside components.

## Methods are available:

- has(field = null): check specific field error
- first(field): get message by field name
- missed(field = null): check if there is no any error of given field name
- nullState(field = null: false|null of given field
- any(): check if any errors exist
- get(field): get specific field
- all(): get all errors
- fill(errors = {}): fill the errors object
- flush(): clear all errors
- clear(field): clear specific error by field name
- onKeydown(event): event to clear error by event.target.name. (input the has name)
