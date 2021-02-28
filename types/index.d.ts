import { PluginFunction } from 'vue';
import { AxiosStatic } from 'axios';
import './vue'

type AsyncFunction = ((arg0: any) => Promise<any>) | Promise<any>;

export class BaseProxy {
    constructor(endpoint: string, parameters: object);
    static $http: AxiosStatic;
    /**
     * Get axios instance
     * @return {Promise|BaseProxy.$http}
     * @memberOf BaseProxy
     */
    get $http(): AsyncFunction;

    /**
     * Get all records
     * @return {Promise}
     * @memberOf BaseProxy
     */
    all(): AsyncFunction;

    /**
     * Get item by id
     * @return {Promise}
     * @param {string} id
     * @memberOf BaseProxy
     */
    find(id: string): AsyncFunction;

    /**
     * Post data to server api
     * @return {Promise}
     * @param {FormData|object} item
     * @memberOf BaseProxy
     */
    post(item?: FormData | object): AsyncFunction;

    /**
     * Put {put} data for server api
     * @param {string|number} id
     * @param {FormData|object} item
     * @memberOf BaseProxy
     */
    put(id: string, item?: FormData | object): AsyncFunction;

    /**
     * Put {put} data for server api
     * @param {string|number} id
     * @param {FormData|object} item
     * @memberOf BaseProxy
     */
    putWithFile(id: string, item?: FormData | object): AsyncFunction;

    /**
     * Patch {method} data for server api
     * @param {string|number} id
     * @param {FormData|object} item
     * @memberOf BaseProxy
     */
    patch(id: string, item?: FormData | object): AsyncFunction;

    /**
     * Delete {method} data for server api
     * @param {string|number} id
     * @memberOf BaseProxy
     */
    delete(id: string): AsyncFunction;

    /**
     * To set parameters of query string to url
     * @return self
     * @param parameters
     * @memberOf BaseProxy
     */
    setParameters(parameters?: object): BaseProxy

    /**
     * Set parameter by key and value provided for query string url
     * @return self
     * @param {string} key
     * @param {string|string[]} value
     * @memberOf BaseProxy
     */
    setParameter(key: string, value?: string | string[]): BaseProxy
    setParameter(key: string): BaseProxy

    /**
     * To remove parameters
     * @return self
     * @param {Array} parameters
     * @memberOf BaseProxy
     */
    removeParameters(parameters?: string[]): BaseProxy
    removeParameters(): BaseProxy

    /**
     * To remove param for query string
     * @return self
     * @param parameter
     * @memberOf BaseProxy
     */
    removeParameter(parameter?: string): BaseProxy

    /**
     * The submit method for send to server api
     * @param {string} requestType
     * @param {string} url
     * @param {FormData|object} form
     * @memberOf BaseProxy
     */
    submit(requestType: string, url: string, form?: FormData | object): Promise<any>
}

/**
 * The vue-wait Instance
 */

export class Validator {
    constructor(options?: FormValidatorOptions);

    processing: boolean;
    successful: boolean;
    errors: ErrorsOptions;

    static install(): PluginFunction<any>;

    /**
     * To clear all errors
     * @return string|object
     * @memberOf Validator
     */
    flush(): string
    /**
     * Get add error message by attribute
     * @return {object}
     * @memberOf Validator
     */
    add(attribute: string, message: string): object[];

    /**
     * Get all errors object
     * @return {object}
     * @memberOf Validator
     */
    all(): object[];

    /**
     * Check if field has any error
     * @return {boolean}
     * @param {string} field
     * @memberOf Validator
     */
    has(field: string | string[]): boolean;

    /**
     * Returns boolean value if any errors exists in page.
     *
     * @returns {boolean}
     * @memberOf Validator
     */
    any(): boolean;
    any(fields: string | string[]): boolean | object;
    any(fields: string | string[], returnObject?: boolean): boolean | object;

    /**
     * Check if field is missed in errors object
     * @return {boolean}
     * @param {string} field
     * @memberOf Validator
     */
    missed(field: string | string[]): boolean;

    /**
     * Check if field is null or exist in errors object
     * @return {boolean|number}
     * @param {string} field
     * @memberOf Validator
     */
    nullState(field: string | string[]): boolean | null;

    /**
     * Get error message by field
     * @return string
     * @param {string} field
     * @memberOf Validator
     */
    get(field: string | string[]): string

    /**
     * Fill errors object
     * @return Object
     * @param errors
     * @memberOf Validator
     */
    fill(errors: object): object

    /**
     * Fill message by key/value
     * @param {string} attribute
     * @param {string|[]} message
     * @memberOf Validator
     */
    add(attribute: string, message?: string | string[]): object

    /**
     * To clear specific field from errors, if field null or undefined it will clear all errors
     * @return object
     * @param field
     * @memberOf Validator
     */
    clear(field: string | string[]): object

    /**
     * Check if there is any errors exist
     * @return {boolean}
     * @memberOf Validator
     */
    isValid(): boolean

    /**
     * Returns boolean value if some of given loaders exists in page.
     *
     * @param {(string|string[])} attribute
     * @returns {boolean}
     * @memberOf Validator
     */
    first(attribute: string | string[]): boolean;

    /**
     * To clear all errors
     * @return string|object
     * @memberOf Validator
     */
    flush(): string

    /**
     * Keyboard event on form
     * @return self
     * @param {KeyboardEvent} event
     * @param {string|null} prefix
     * @memberOf Validator
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

/**
 * A sleep function to delay the transaction
 * @param {number} ms
 * @return {Promise<any>}
 */
export declare function sleep(ms: number): Promise<any>;
