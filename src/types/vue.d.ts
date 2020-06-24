/**
 * Extends interfaces in Vue.js
 */

import FormValidator from './';

declare module 'vue/types/vue' {
  interface Vue {
    $errors: FormValidator;
  }
}
