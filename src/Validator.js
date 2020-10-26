import { is, isArray } from './util';

class Validator {
    constructor(options = {}) {
        const defaults = { ...options };
        this.processing = false;
        this.successful = false;
        this.errors = {};
        this.options = defaults;
    }

    /**
     * Add new error message for given attribute
     *
     * @param  {string} attribute
     * @param  {string} message
     * @return {void}
     */
    add(attribute, message) {
        if (!this.has(attribute)) {
            this.errors[attribute] = [];
        }
        if (!this.errors[attribute].includes(message)) {
            this.errors[attribute].push(message);
        }
    }

    /**
     * Determine if any errors exists for the given field or object.
     *
     * @param {string|null|Array} field
     */
    has(field) {
        if (isArray(field)) {
            return is(Object.keys(this.errors), field);
        }
        let hasError = this.errors.hasOwnProperty(field);
        if (!hasError) {
            const errors = Object.keys(this.errors).filter(
                (e) => e.startsWith(`${field}.`) || e.startsWith(`${field}[`)
            );
            hasError = errors.length > 0;
        }
        return hasError;
    }

    /**
     * Get first message of field given
     * @param {Array|string} field
     * @returns {*}
     */
    first(field) {
        if (isArray(field)) {
            for (let i = 0; i < field.length; i++) {
                if (!this.errors.hasOwnProperty(field[i])) {
                    continue;
                }
                return this.first(field[i]);
            }
        }
        return this.get(field)[0];
    }

    /**
     * Missed field method
     * @param {string|null} field
     */
    missed(field = null) {
        return !this.has(field);
    }

    /**
     * Missed field method
     * @param {string|null} field
     */
    nullState(field = null) {
        return this.has(field) ? !this.has(field) : null;
    }

    /**
     * Determine if we have any errors.
     */
    any() {
        return Object.keys(this.errors).length > 0;
    }

    /**
     * Get field that error
     * @param {string} field
     * @returns {*|*[]}
     */
    get(field) {
        return this.errors[field] || [];
    }

    /**
     * Get all errors
     * @returns {{}}
     */
    all() {
        return this.errors;
    }

    /**
     * Fill the error object
     * @param errors
     */
    fill(errors = {}) {
        this.errors = errors;
    }

    /**
     * Flush error
     */
    flush() {
        this.errors = {};
    }

    /**
     * Clear one or all error fields.
     *
     * @param {String|undefined|Array} attribute
     */
    clear(attribute) {
        if (!attribute) return this.flush();
        let errors = Object.assign({}, this.errors);
        if (isArray(attribute)) {
            attribute.map((field) => {
                Object.keys(errors)
                    .filter(
                        (e) => e === field || e.startsWith(`${field}.`) || e.startsWith(`${field}[`)
                    )
                    .forEach((e) => delete errors[e]);
            });
        } else {
            Object.keys(errors)
                .filter(
                    (e) =>
                        e === attribute ||
                        e.startsWith(`${attribute}.`) ||
                        e.startsWith(`${attribute}[`)
                )
                .forEach((e) => delete errors[e]);
        }
        this.fill(errors);
    }

    /**
     * Check if form still has error
     * @returns {boolean}
     */
    isValid() {
        return !this.any();
    }

    /**
     * Clear errors on keydown.
     *
     * @param {KeyboardEvent} event
     * @param {string} prefix
     */
    onKeydown(event, prefix = '') {
        const { name } = event.target;
        if (!name) return;
        let name2 = '';
        if (prefix) {
            name2 = `${prefix}.${name}`;
        }
        this.clear([name, name2]);
    }
}

export default new Validator();
