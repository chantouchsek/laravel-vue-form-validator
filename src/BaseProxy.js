import Validator from './Validator';
import { isArray, isFile, objectToFormData } from './util';
import qs from 'qs';

const UNPROCESSABLE_ENTITY = 422;

class BaseProxy {
    static $http;

    /**
     * Create a new BaseProxy instance.
     *
     * @param {string} endpoint   The endpoint being used.
     * @param {Object} parameters The parameters for the request.
     */
    constructor(endpoint, parameters) {
        this.endpoint = endpoint;
        this.parameters = parameters;
    }

    /**
     * Get axios instance
     * @return {*}
     */
    get $http() {
        return BaseProxy.$http;
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

    store(item) {
        return this.post(item);
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

    putWithFile(id, payload) {
        payload._method = 'put';
        return this.submit('post', `/${this.endpoint}/${id}`, payload);
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
        Object.keys(parameters).forEach((key) => {
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
    setParameter(parameter, value = '') {
        if (!value) {
            const options = {
                comma: true,
                allowDots: true,
                ignoreQueryPrefix: true,
            };
            const params = qs.parse(parameter, options);
            return this.setParameters(params);
        }
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
            parameters.forEach((parameter) => {
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
        this.__validateRequestType(requestType);
        Validator.flush();
        Validator.processing = true;
        Validator.successful = false;
        return new Promise((resolve, reject) => {
            if (!this.$http) {
                return reject(new Error('Axios must be set.'));
            }
            const data = this.hasFiles(form) ? objectToFormData(form) : form;
            this.$http[requestType](this.getParameterString(url), data)
                .then((response) => {
                    Validator.processing = false;
                    this.onSuccess(response.data);
                    resolve(response.data);
                })
                .catch((error) => {
                    Validator.processing = false;
                    Validator.processing = false;
                    const { response } = error || {};
                    if (response) {
                        const { data, status } = response;
                        if (status === UNPROCESSABLE_ENTITY) {
                            const errors = {};
                            Object.assign(errors, data['errors']);
                            this.onFail(errors);
                            Validator.fill(errors);
                        }
                        reject(error);
                    } else {
                        reject();
                    }
                });
        });
    }

    /**
     * @returns {boolean}
     */
    hasFiles(form) {
        for (const property in form) {
            if (!Object.prototype.hasOwnProperty.call(form, property)) {
                return false;
            }
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
                if (!Object.prototype.hasOwnProperty.call(object, key)) {
                    continue
                }
                if (isFile(object[key])) {
                    return true;
                }
            }
        }

        if (isArray(object)) {
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
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
     * @param {Object} errors
     */
    onFail(errors) {
        Validator.successful = false;
        Validator.fill(errors);
    }

    __validateRequestType(requestType) {
        const requestTypes = ['get', 'delete', 'head', 'post', 'put', 'patch'];

        if (!requestTypes.includes(requestType)) {
            throw new Error(
                `\`${requestType}\` is not a valid request type, ` +
                `must be one of: \`${requestTypes.join('`, `')}\`.`,
            );
        }
    }

    /**
     * Method used to transform a parameters object to a parameters string.
     *
     * @returns {string} The parameter string.
     */
    getParameterString(url) {
        const query = qs.stringify(this.parameters, {
            encode: false,
            skipNulls: true,
            addQueryPrefix: true,
        })
        return `${url}${query}`
    }
}

export default BaseProxy;
