import { isMatch } from './matcher';

export function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

export function isFile(object) {
    return object instanceof File || object instanceof FileList;
}

export function merge(a, b) {
    for (const key in b) {
        a[key] = cloneDeep(b[key]);
    }
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
            if (object.hasOwnProperty(key)) {
                clone[key] = cloneDeep(object[key]);
            }
        }

        return clone;
    }

    if (typeof object === 'object') {
        const clone = {};

        for (const key in object) {
            if (object.hasOwnProperty(key)) {
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
    if (typeof error === 'string' && error.match(/[\*\!]/)) {
        return errors.filter(w => isMatch(w, error)).length > 0;
    }
    return Array.isArray(error) ? error.some(w => is(errors, w)) : errors.includes(error);
}
