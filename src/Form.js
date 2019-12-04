import Validator from './Validator';
import { guardAgainstReservedFieldName, isArray, isFile, merge, objectToFormData } from './util';

class Form {
    /**
     * Create a new Form instance.
     *
     * @param {object} data
     * @param {object} options
     */
    constructor (data = {}, options = {}) {
        this.processing = false;
        this.successful = false;

        this.withData(data).withOptions(options).withErrors({});
    }

    /**
     * Get with data
     * @param data
     * @returns {Form}
     */
    withData (data) {
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

    withErrors (errors) {
        this.errors = new Validator(errors);

        return this;
    }

    withOptions (options) {
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
                'No http library provided. Either pass an http option, or install axios.',
            );
        }

        return this;
    }

    /**
     * Fetch all relevant data for the form.
     */
    data () {
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
    only (fields) {
        return fields.reduce((filtered, field) => {
            filtered[field] = this[field];
            return filtered;
        }, {});
    }

    /**
     * Reset the form fields.
     */
    reset () {
        merge(this, this.initial);

        this.errors.clear();
    }

    setInitialValues (values) {
        this.initial = {};

        merge(this.initial, values);
    }

    populate (data) {
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
    clear () {
        for (const field in this.initial) {
            this[field] = '';
        }

        this.errors.clear();
    }

    /**
     * Send a POST request to the given URL.
     *
     * @param {string} url
     */
    post (url) {
        return this.submit('post', url);
    }

    /**
     * Send a PUT request to the given URL.
     *
     * @param {string} url
     */
    put (url) {
        return this.submit('put', url);
    }

    /**
     * Send a PATCH request to the given URL.
     *
     * @param {string} url
     */
    patch (url) {
        return this.submit('patch', url);
    }

    /**
     * Send a DELETE request to the given URL.
     *
     * @param {string} url
     */
    delete (url) {
        return this.submit('delete', url);
    }

    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     */
    submit (requestType, url) {
        this.__validateRequestType(requestType);
        this.errors.clear();
        this.processing = true;
        this.successful = false;

        return new Promise((resolve, reject) => {
            const data = this.hasFiles() ? objectToFormData(this.data()) : this.data();
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
                        reject(response.data)
                    } else {
                        reject(new Error('Something went wrong.'))
                    }
                });
        });
    }

    /**
     * @returns {boolean}
     */
    hasFiles () {
        for (const property in this.initial) {
            if (this.hasFilesDeep(this[property])) {
                return true;
            }
        }

        return false;
    };

    /**
     * @param {Object|Array} object
     * @returns {boolean}
     */
    hasFilesDeep (object) {
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
    onSuccess (data) {
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
    onFail (response) {
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
    hasError (field) {
        return this.errors.has(field);
    }

    /**
     * Get the first error message for the given field.
     *
     * @param {string} field
     * @return {string}
     */
    getError (field) {
        return this.errors.first(field);
    }

    /**
     * Get the error messages for the given field.
     *
     * @param {string} field
     * @return {array}
     */
    getErrors (field) {
        return this.errors.get(field);
    }

    __validateRequestType (requestType) {
        const requestTypes = ['get', 'delete', 'head', 'post', 'put', 'patch'];

        if (requestTypes.indexOf(requestType) === -1) {
            throw new Error(
                `\`${requestType}\` is not a valid request type, ` +
                `must be one of: \`${requestTypes.join('`, `')}\`.`,
            );
        }
    }

    static create (data = {}) {
        return new Form().withData(data);
    }
}

export default Form;
