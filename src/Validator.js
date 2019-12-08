class Validator {
    constructor() {
        this.processing = false;
        this.successful = false;
        this.errors = {};
    }

    /**
     * Determine if any errors exists for the given field or object.
     *
     * @param {string} field
     */
    has(field) {
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
     * Determine if we have any errors.
     */
    any() {
        return Object.keys(this.errors).length > 0;
    }

    get(field) {
        return this.errors[field] || [];
    }

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

    flush() {
        this.errors = {};
    }

    /**
     * Clear one or all error fields.
     *
     * @param {String|undefined} field
     */
    clear(field) {
        if (!field) {
            this.flush();
            return;
        }
        let errors = Object.assign({}, this.errors);
        Object.keys(errors)
            .filter(e => e === field || e.startsWith(`${field}.`) || e.startsWith(`${field}[`))
            .forEach(e => delete errors[e]);
        this.fill(errors);
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
