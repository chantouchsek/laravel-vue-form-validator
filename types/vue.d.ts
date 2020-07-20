/**
 * Extends interfaces in Vue.js
 */

import FormValidator from './index';

declare module 'vue/types/vue' {
  interface Vue {
    $errors: FormValidator;
  }
}
