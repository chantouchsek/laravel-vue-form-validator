import Validator from './Validator';
import { isFile, objectToFormData } from './util';

class BaseProxy {
    static $baseUrl;
    static $http;
    /**
     * Create a new BaseProxy instance.
     *
     * @param {string} endpoint   The endpoint being used.
     * @param {Object} parameters The parameters for the request.
     */
    constructor(endpoint, parameters = {}) {
        this.endpoint = endpoint;
        this.parameters = parameters;
    }

    get $http() {
        return BaseProxy.$http;
    }

    get $baseUrl() {
        return BaseProxy.$baseUrl;
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
    removeParameters(parameters = []) {
        if (parameters.length === 0) {
            this.parameters = [];
        } else {
            parameters.forEach(parameter => {
                delete this.parameters[parameter];
            });
        }
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
        const baseUrl = this.$baseUrl + url;
        this.__validateRequestType(requestType);
        Validator.flush();
        Validator.processing = true;
        Validator.successful = false;
        return new Promise((resolve, reject) => {
            const data = this.hasFiles(form) ? objectToFormData(form) : form;
            this.$http[requestType](baseUrl + this.getParameterString(), data)
                .then(response => {
                    Validator.processing = false;
                    this.onSuccess(response.data);
                    resolve(response.data);
                })
                .catch(({ response }) => {
                    Validator.processing = false;
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
            if (this.hasFilesDeep(form[property])) {
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
        Validator.successful = true;
        Validator.flush();
    }

    /**
     * Handle a failed form submission.
     *
     * @param {Object} response
     */
    onFail(response) {
        Validator.successful = false;
        if (response && response.data.errors) {
            Validator.fill(response.data.errors);
        }
    }

    /**
     * Get the error message(s) for the given field.
     *
     * @param field
     */
    hasError(field) {
        return Validator.has(field);
    }

    /**
     * Get the first error message for the given field.
     *
     * @param {string} field
     * @return {string}
     */
    getError(field) {
        return Validator.first(field);
    }

    /**
     * Get the error messages for the given field.
     *
     * @param {string} field
     * @return {array}
     */
    getErrors(field) {
        return Validator.get(field);
    }

    __validateRequestType(requestType) {
        const requestTypes = ['get', 'delete', 'head', 'post', 'put', 'patch'];

        if (!requestTypes.includes(requestType)) {
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
