import Validator from './Validator';
import { guardAgainstReservedFieldName, isArray, isFile, merge, objectToFormData } from './util';

class BaseProxy {
    /**
     * Create a new BaseProxy instance.
     *
     * @param {string} endpoint   The endpoint being used.
     * @param {Object} parameters The parameters for the request.
     * @param {object} options
     */
    constructor(endpoint, parameters = {}, options = {}) {
        this.processing = false;
        this.successful = false;
        this.endpoint = endpoint;
        this.parameters = parameters;

        this.withOptions(options).withErrors({});
    }

    /**
     * Get with data
     * @param data
     * @returns {BaseProxy}
     */
    withData(data) {
        if (isArray(data)) {
            data = data.reduce((carry, element) => {
                carry[element] = '';
                return carry;
            }, {});
        }

        this.setInitialValues(data);

        this.errors = new Validator();
        this.processing = false;
        this.successful = false;

        for (const field in data) {
            guardAgainstReservedFieldName(field);

            this[field] = data[field];
        }

        return this;
    }

    withErrors(errors) {
        this.errors = new Validator(errors);

        return this;
    }

    withOptions(options) {
        this.__options = {
            resetOnSuccess: true,
        };

        if (options.hasOwnProperty('resetOnSuccess')) {
            this.__options.resetOnSuccess = options.resetOnSuccess;
        }

        if (options.hasOwnProperty('onSuccess')) {
            this.onSuccess = options.onSuccess;
        }

        if (options.hasOwnProperty('onFail')) {
            this.onFail = options.onFail;
        }

        const windowAxios = typeof window === 'undefined' ? false : window.axios;

        this.__http = options.http || windowAxios || require('axios');

        if (!this.__http) {
            throw new Error(
                'No http library provided. Either pass an http option, or install axios.'
            );
        }

        return this;
    }

    /**
     * Fetch all relevant data for the form.
     */
    data() {
        const data = {};

        for (const property in this.initial) {
            data[property] = this[property];
        }

        return data;
    }

    /**
     * Fetch specific data for the form.
     *
     * @param {array} fields
     * @return {object}
     */
    only(fields) {
        return fields.reduce((filtered, field) => {
            filtered[field] = this[field];
            return filtered;
        }, {});
    }

    /**
     * Reset the form fields.
     */
    reset() {
        merge(this, this.initial);

        this.errors.clear();
    }

    setInitialValues(values) {
        this.initial = {};

        merge(this.initial, values);
    }

    populate(data) {
        Object.keys(data).forEach(field => {
            guardAgainstReservedFieldName(field);

            if (this.hasOwnProperty(field)) {
                merge(this, { [field]: data[field] });
            }
        });

        return this;
    }

    /**
     * Clear the form fields.
     */
    clear() {
        for (const field in this.initial) {
            this[field] = '';
        }

        this.errors.clear();
    }

    /**
     * Method used to fetch all items from the API.
     *
     * @returns {Promise} The result in a promise.
     */
    all() {
        return this.submit('get', `/${this.endpoint}`);
    }

    /**
     * Method used to fetch a single item from the API.
     *
     * @param {string|int} id The given identifier.
     *
     * @returns {Promise} The result in a promise.
     */
    find(id) {
        return this.submit('get', `/${this.endpoint}/${id}`);
    }

    /**
     * Send a POST request to the given URL.
     *
     * @param {Object} item
     */
    post(item) {
        return this.submit('post', `/${this.endpoint}`, item);
    }

    /**
     * Send a PUT request to the given URL.
     *
     * @param {string|int} id
     * @param {Object} item
     */
    put(id, item) {
        return this.submit('put', `/${this.endpoint}/${id}`, item);
    }

    /**
     * Send a PATCH request to the given URL.
     *
     * @param {string|int} id
     * @param {Object} item
     */
    patch(id, item) {
        return this.submit('patch', `/${this.endpoint}/${id}`, item);
    }

    /**
     * Send a DELETE request to the given URL.
     *
     * @param {string|int} id
     */
    delete(id) {
        return this.submit('delete', `/${this.endpoint}/${id}`);
    }

    /**
     * Method used to set the query parameters.
     *
     * @param {Object} parameters The given parameters.
     *
     * @returns {BaseProxy} The instance of the proxy.
     */
    setParameters(parameters) {
        Object.keys(parameters).forEach(key => {
            this.parameters[key] = parameters[key];
        });

        return this;
    }

    /**
     * Method used to set a single parameter.
     *
     * @param {string} parameter The given parameter.
     * @param {*} value The value to be set.
     *
     * @returns {BaseProxy} The instance of the proxy.
     */
    setParameter(parameter, value) {
        this.parameters[parameter] = value;

        return this;
    }

    /**
     * Method used to remove all the parameters.
     *
     * @param {Array} parameters The given parameters.
     *
     * @returns {BaseProxy} The instance of the proxy.
     */
    removeParameters(parameters) {
        parameters.forEach(parameter => {
            delete this.parameters[parameter];
        });

        return this;
    }

    /**
     * Method used to remove a single parameter.
     *
     * @param {string} parameter The given parameter.
     *
     * @returns {BaseProxy} The instance of the proxy.
     */
    removeParameter(parameter) {
        delete this.parameters[parameter];

        return this;
    }

    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     * @param {Object|null} form The data that's being send to the API.
     */
    submit(requestType, url, form = null) {
        this.__validateRequestType(requestType);
        this.errors.clear();
        this.processing = true;
        this.successful = false;

        return new Promise((resolve, reject) => {
            const data = this.hasFiles(form) ? objectToFormData(form) : form;
            url = requestType.toUpperCase() === 'GET' ? url + this.getParameterString() : url;
            this.__http[requestType](url, data)
                .then(response => {
                    this.processing = false;
                    this.onSuccess(response.data);
                    resolve(response.data);
                })
                .catch(({ response }) => {
                    this.processing = false;
                    if (response) {
                        this.onFail(response);
                        reject(response.data);
                    } else {
                        reject(new Error('Something went wrong.'));
                    }
                });
        });
    }

    /**
     * @returns {boolean}
     */
    hasFiles(form) {
        for (const property in form) {
            if (this.hasFilesDeep(property)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param {Object|Array} object
     * @returns {boolean}
     */
    hasFilesDeep(object) {
        if (object === null) {
            return false;
        }

        if (typeof object === 'object') {
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    if (isFile(object[key])) {
                        return true;
                    }
                }
            }
        }

        if (Array.isArray(object)) {
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    return this.hasFilesDeep(object[key]);
                }
            }
        }

        return isFile(object);
    }

    /**
     * Handle a successful form submission.
     *
     * @param {object} data
     */
    onSuccess(data) {
        this.successful = true;
        if (this.__options.resetOnSuccess) {
            this.reset();
        }
    }

    /**
     * Handle a failed form submission.
     *
     * @param {Object} response
     */
    onFail(response) {
        this.successful = false;
        if (response && response.data.errors) {
            this.errors.record(response.data.errors);
        }
    }

    /**
     * Get the error message(s) for the given field.
     *
     * @param field
     */
    hasError(field) {
        return this.errors.has(field);
    }

    /**
     * Get the first error message for the given field.
     *
     * @param {string} field
     * @return {string}
     */
    getError(field) {
        return this.errors.first(field);
    }

    /**
     * Get the error messages for the given field.
     *
     * @param {string} field
     * @return {array}
     */
    getErrors(field) {
        return this.errors.get(field);
    }

    __validateRequestType(requestType) {
        const requestTypes = ['get', 'delete', 'head', 'post', 'put', 'patch'];

        if (requestTypes.indexOf(requestType) === -1) {
            throw new Error(
                `\`${requestType}\` is not a valid request type, ` +
                    `must be one of: \`${requestTypes.join('`, `')}\`.`
            );
        }
    }

    /**
     * Method used to transform a parameters object to a parameters string.
     *
     * @returns {string} The parameter string.
     */
    getParameterString() {
        const keys = Object.keys(this.parameters);

        const parameterStrings = keys
            .filter(key => !!this.parameters[key])
            .map(key => `${key}=${this.parameters[key]}`);

        return parameterStrings.length === 0 ? '' : `?${parameterStrings.join('&')}`;
    }

    static create(data = {}) {
        return new BaseProxy().withData(data);
    }
}

export default BaseProxy;
