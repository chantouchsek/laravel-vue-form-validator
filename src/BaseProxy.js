import Validator from './Validator';
import { guardAgainstReservedFieldName, isFile, merge, objectToFormData } from './util';

class BaseProxy {
    /**
     * Create a new BaseProxy instance.
     *
     * @param {string} endpoint   The endpoint being used.
     * @param {Object} parameters The parameters for the request.
     * @param {object} options
     */
    constructor(endpoint, parameters = {}, options = {}) {
        this.endpoint = endpoint;
        this.parameters = parameters;
        this.withOptions(options).withErrors({});
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
        this.errors.flush();
        this.errors.processing = true;
        this.errors.successful = false;

        return new Promise((resolve, reject) => {
            const data = this.hasFiles(form) ? objectToFormData(form) : form;
            url = requestType.toUpperCase() === 'GET' ? url + this.getParameterString() : url;
            this.__http[requestType](url, data)
                .then(response => {
                    this.errors.processing = false;
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
        this.errors.successful = true;
        if (this.__options.resetOnSuccess) {
            this.errors.flush();
        }
    }

    /**
     * Handle a failed form submission.
     *
     * @param {Object} response
     */
    onFail(response) {
        this.errors.successful = false;
        if (response && response.data.errors) {
            this.errors.fill(response.data.errors);
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
}

export default BaseProxy;
