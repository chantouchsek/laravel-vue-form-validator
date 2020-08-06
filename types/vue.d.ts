/**
 * Extends interfaces in Vue.js
 */

import { Validator } from './';

declare module 'vue/types/vue' {
    interface Vue {
        $errors: Validator;
    }
}
