export function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

export function isFile(object) {
    if (typeof window === 'undefined') {
        return false
    }
    if (typeof File !== 'function' || typeof FileList !== 'function') {
        return false
    }
    return object instanceof File || object instanceof FileList;
}

export function merge(a, b) {
    for (const key in b) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) {
            continue
        }
        a[key] = cloneDeep(b[key])
    }
    return a
}

export function cloneDeep(object) {
    if (object === null) {
        return null;
    }

    if (isFile(object)) {
        return object;
    }

    if (Array.isArray(object)) {
        const clone = [];

        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                clone[key] = cloneDeep(object[key]);
            }
        }

        return clone;
    }

    if (typeof object === 'object') {
        const clone = {};

        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                clone[key] = cloneDeep(object[key]);
            }
        }

        return clone;
    }

    return object;
}

/**
 * Check if errors exist
 * @param {Array} errors
 * @param {Array|string} error
 * @returns {boolean}
 */
export function is(errors, error) {
    return Array.isArray(error) ? error.some((w) => is(errors, w)) : errors.includes(error);
}
