/**
 * Extends interfaces in Vue.js
 */

import { Validator } from './';

declare module 'vue/types/vue' {
    interface Vue {
        $errors: Validator;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        $errors?: Validator;
    }
}
