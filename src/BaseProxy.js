import Vue from 'vue';

class BaseProxy {
    /**
     * The constructor of the BaseProxy.
     *
     * @param {string} endpoint   The endpoint being used.
     * @param {Object} parameters The parameters for the request.
     */
    constructor (endpoint, parameters = {}) {
        this.endpoint = endpoint;
        this.parameters = parameters;
    }

    /**
     * Method used to set the query parameters.
     *
     * @param {Object} parameters The given parameters.
     *
     * @returns {BaseProxy} The instance of the proxy.
     */
    setParameters (parameters) {
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
    setParameter (parameter, value) {
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
    removeParameters (parameters) {
        parameters.forEach((parameter) => {
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
    removeParameter (parameter) {
        delete this.parameters[parameter];

        return this;
    }

    /**
     * The method used to perform an AJAX-request.
     *
     * @param {string}      requestType The request type.
     * @param {string}      url         The URL for the request.
     * @param {Object|null} data        The data that's being send to the API.
     *
     * @returns {Promise} The result in a promise.
     */
    submit (requestType, url, data = null) {
        Errors.busy = true;
        Errors.busyModal = true;
        return new Promise((resolve, reject) => {
            Vue.$http[requestType](url + this.getParameterString(), data)
                .then((response) => {
                    Errors.busy = false;
                    Errors.busyModal = false;
                    resolve(response.data);
                })
                .catch(({ response }) => {
                    Errors.busy = false;
                    Errors.busyModal = false;
                    if (response) {
                        reject(response.data);
                    } else {
                        reject(new Error('Something went wrong.'));
                    }
                });
        });
    }

    /**
     * Method used to fetch all items from the API.
     *
     * @returns {Promise} The result in a promise.
     */
    all () {
        return this.submit('get', `/${this.endpoint}`);
    }

    /**
     * Method used to fetch a single item from the API.
     *
     * @param {int} id The given identifier.
     *
     * @returns {Promise} The result in a promise.
     */
    find (id) {
        return this.submit('get', `/${this.endpoint}/${id}`);
    }

    /**
     * Method used to create an item.
     *
     * @param {Object} item The given item.
     *
     * @param formData The FormData will send to the server
     * @returns {Promise} The result in a promise.
     */
    create (item, formData = false) {
        if (formData) item = this.objectToFormData(item);
        return this.submit('post', `/${this.endpoint}`, item);
    }

    /**
     * Method used to update a given item.
     *
     * @param {int} id The given identifier.
     * @param {Object} item The given item.
     *
     * @param formData The FormData will be send to server
     * @returns {Promise} The result in a promise.
     */
    update (id, item, formData = false) {
        if (formData) item = this.objectToFormData(item);
        return this.submit('put', `/${this.endpoint}/${id}`, item);
    }

    /**
     * Method used to destroy a given item.
     *
     * @param {int} id The given identifier.
     *
     * @returns {Promise} The result in a promise.
     */
    destroy (id) {
        return this.submit('delete', `/${this.endpoint}/${id}`);
    }

    /**
     * Method used to transform a parameters object to a parameters string.
     *
     * @returns {string} The parameter string.
     */
    getParameterString () {
        const keys = Object.keys(this.parameters);

        const parameterStrings = keys
            .filter(key => !!this.parameters[key])
            .map(key => `${key}=${this.parameters[key]}`);

        return parameterStrings.length === 0
            ? ''
            : `?${parameterStrings.join('&')}`;
    }

    /**
     * Convert object to formData
     * @param obj
     * @param form
     * @param namespace
     * @returns {*|FormData}
     */
    objectToFormData (obj, form, namespace) {
        const fd = form || new FormData();
        for (const property in obj) {
            if (!obj.hasOwnProperty(property)) {
                continue;
            }
            const formKey = namespace ? `${namespace}[${property}]` : property;
            if (obj[property] === null) {
                fd.append(formKey, '');
                continue;
            }
            if (typeof obj[property] === 'boolean') {
                fd.append(formKey, obj[property] ? '1' : '0');
                continue;
            }
            if (obj[property] instanceof Date) {
                fd.append(formKey, obj[property].toISOString());
                continue;
            }
            if (
                typeof obj[property] === 'object' &&
                !(obj[property] instanceof File)
            ) {
                this.objectToFormData(obj[property], fd, formKey);
                continue;
            }
            fd.append(formKey, obj[property]);
        }
        return fd;
    }
}

export default BaseProxy;
