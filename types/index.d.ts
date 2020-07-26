import { PluginFunction } from 'vue';
import { AxiosStatic } from 'axios';

type AsyncFunction = ((arg0: any) => Promise<any>) | Promise<any>;

export default class FormValidator extends FormValidatorInstance {
    constructor(options?: FormValidatorOptions);

    processing: boolean;
    successful: boolean;
    errors: ErrorsOptions;

    static install(): PluginFunction<any>;

    /**
     * To clear all errors
     * @return string|object
     * @memberOf FormValidator
     */
    flush(): string
}

export class BaseProxyInstance {
    constructor(endpoint: string, parameters: object);

    static $baseUrl: string;
    static $http: AxiosStatic;
}

export class BaseProxy extends BaseProxyInstance {
    /**
     * Get all records
     * @return {Promise|BaseProxyInstance.$http}
     * @memberOf BaseProxyInstance
     */
    get $http(): AsyncFunction;

    /**
     * Get all records
     * @return {BaseProxyInstance.$baseUrl|Promise}
     * @memberOf BaseProxyInstance
     */
    get $baseUrl(): AsyncFunction;

    /**
     * Get all records
     * @return {Promise}
     * @memberOf BaseProxyInstance
     */
    all(): AsyncFunction;

    /**
     * Get item by id
     * @return {Promise}
     * @param {string} id
     * @memberOf BaseProxyInstance
     */
    find(id: string): AsyncFunction;

    /**
     * Post data to server api
     * @return {Promise}
     * @param {FormData|object} item
     * @memberOf BaseProxyInstance
     */
    post(item?: FormData | object): AsyncFunction;

    /**
     * Put {put} data for server api
     * @param {string|number} id
     * @param {FormData|object} item
     * @memberOf BaseProxyInstance
     */
    put(id: string, item?: FormData | object): AsyncFunction;

    /**
     * Patch {method} data for server api
     * @param {string|number} id
     * @param {FormData|object} item
     * @memberOf BaseProxyInstance
     */
    patch(id: string, item?: FormData | object): AsyncFunction;

    /**
     * Delete {method} data for server api
     * @param {string|number} id
     * @memberOf BaseProxyInstance
     */
    delete(id: string): AsyncFunction;

    /**
     * To set parameters of query string to url
     * @return self
     * @param parameters
     * @memberOf BaseProxyInstance
     */
    setParameters(parameters?: object): BaseProxyInstance

    /**
     * Set parameter by key and value provided for query string url
     * @return self
     * @param {string} key
     * @param {string|string[]} value
     * @memberOf BaseProxyInstance
     */
    setParameter(key: string, value?: string | string[]): BaseProxyInstance

    /**
     * To remove parameters
     * @return self
     * @param {Array} parameters
     * @memberOf BaseProxyInstance
     */
    removeParameters(parameters?: string[]): BaseProxyInstance

    /**
     * To remove param for query string
     * @return self
     * @param parameter
     * @memberOf BaseProxyInstance
     */
    removeParameter(parameter?: string): BaseProxyInstance

    /**
     * The submit method for send to server api
     * @param {string} requestType
     * @param {string} url
     * @param {FormData|object} form
     * @memberOf BaseProxyInstance
     */
    submit(requestType: string, url: string, form?: FormData | object): Promise<any>
}

/**
 * The vue-wait Instance
 */

export class FormValidatorInstance extends BaseProxyInstance {
    /**
     * Get add error message by attribute
     * @return {object}
     * @memberOf FormValidatorInstance
     */
    add(attribute: string, message: string): object[];

    /**
     * Get all errors object
     * @return {object}
     * @memberOf FormValidatorInstance
     */
    all(): object[];

    /**
     * Check if field has any error
     * @return {boolean}
     * @param {string} field
     * @memberOf FormValidatorInstance
     */
    has(field: string | string[]): boolean;

    /**
     * Returns boolean value if any errors exists in page.
     *
     * @returns {boolean}
     * @memberOf FormValidatorInstance
     */
    any(): boolean;

    /**
     * Check if field is missed in errors object
     * @return {boolean}
     * @param {string} field
     * @memberOf FormValidatorInstance
     */
    missed(field: string | string[]): boolean;

    /**
     * Check if field is null or exist in errors object
     * @return {boolean|number}
     * @param {string} field
     * @memberOf FormValidatorInstance
     */
    nullState(field: string | string[]): boolean | null;

    /**
     * Get error message by field
     * @return string
     * @param {string} field
     * @memberOf FormValidatorInstance
     */
    get(field: string | string[]): string

    /**
     * Fill errors object
     * @return Object
     * @param errors
     * @memberOf FormValidatorInstance
     */
    fill(errors: object): object

    /**
     * Fill message by key/value
     * @param {string} attribute
     * @param {string|[]} message
     * @memberOf FormValidatorInstance
     */
    fillKey(attribute: string, message?: string | string[]): object

    /**
     * To clear specific field from errors, if field null or undefined it will clear all errors
     * @return object
     * @param field
     * @memberOf FormValidatorInstance
     */
    clear(field: string | string[]): object

    /**
     * Check if there is any errors exist
     * @return {boolean}
     * @memberOf FormValidatorInstance
     */
    isValid(): boolean

    /**
     * Returns boolean value if some of given loaders exists in page.
     *
     * @param {(string|string[])} attribute
     * @returns {boolean}
     * @memberOf FormValidatorInstance
     */
    first(attribute: string | string[]): boolean;

    /**
     * To clear all errors
     * @return string|object
     * @memberOf FormValidatorInstance
     */
    flush(): string

    /**
     * Keyboard event on form
     * @return self
     * @param {KeyboardEvent} event
     * @param {string|null} prefix
     * @memberOf FormValidatorInstance
     */
    onKeydown<T extends Function | AsyncFunction>(event?: KeyboardEvent, prefix?: string): T;
}

export interface FormValidatorOptions {
}

export interface ErrorsOptions {
    errors: {
        [key: string]: any
    }
}

export class BaseTransformer {
    /**
     * To loop on items and show on client-side
     * @return {Array}
     * @param {Array} items
     * @memberOf BaseTransformer
     */
    static fetchCollection(items: object[]): object[]

    /**
     * To loop on items and send back to server api
     * @param items
     * @memberOf BaseTransformer
     */
    static sendCollection(items: object[]): object[]

    /**
     * To transform object item to show client-side
     * @return {Object}
     * @param {Object} item
     * @memberOf BaseTransformer
     */
    static fetch(item: object): object

    /**
     * To transform object send to server
     * @return {Object}
     * @param {Object} item
     * @memberOf BaseTransformer
     */
    static send(item: object): object
}

export class Validator extends FormValidatorInstance {
    constructor(options?: FormValidatorOptions);

    processing: boolean;
    successful: boolean;
    errors: ErrorsOptions;
}
