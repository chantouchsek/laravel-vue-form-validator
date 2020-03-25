class Validator {
    constructor() {
        this.processing = false;
        this.successful = false;
        this.errors = {};
    }

    /**
     * Determine if any errors exists for the given field or object.
     *
     * @param {string|null} field
     */
    has(field = null) {
        let hasError = this.errors.hasOwnProperty(field);
        if (!hasError) {
            const errors = Object.keys(this.errors).filter(
                e => e.startsWith(`${field}.`) || e.startsWith(`${field}[`)
            );
            hasError = errors.length > 0;
        }
        return hasError;
    }

    first(field) {
        return this.get(field)[0];
    }

    /**
     * Missed field method
     * @param {string|null} field
     */
    missed(field = null) {
        return !this.has(field)
    }

    /**
     * Missed field method
     * @param {string|null} field
     */
    nullState(field = null) {
        return this.has(field) ? !this.has(field) : null
    }

    /**
     * Determine if we have any errors.
     */
    any() {
        return Object.keys(this.errors).length > 0;
    }

    /**
     * Get field that error
     * @param field
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
     * @param {String|undefined} field
     */
    clear(field) {
        if (!field) return this.flush();
        let errors = Object.assign({}, this.errors);
        Object.keys(errors)
            .filter(e => e === field || e.startsWith(`${field}.`) || e.startsWith(`${field}[`))
            .forEach(e => delete errors[e]);
        this.fill(errors);
    }

    /**
     * Check if form still has error
     * @returns {function(): boolean}
     */
    isValid() {
        return this.any()
    }

    /**
     * Clear errors on keydown.
     *
     * @param {KeyboardEvent} event
     */
    onKeydown(event) {
        if (event.target.name) {
            this.clear(event.target.name);
        }
    }
}

export default new Validator();
