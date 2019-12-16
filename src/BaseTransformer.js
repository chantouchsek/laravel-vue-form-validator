/* ============
 * Transformer
 * ============
 *
 * The base transformer
 *
 * Transformers are used to transform the fetched data
 * to a more suitable format.
 * For instance, when the fetched data contains snake_cased values,
 * they will be camelCased.
 */

class BaseTransformer {
    /**
     * Method used to transform a fetched collection.
     *
     * @param {Array} items The items to be transformed.
     *
     * @returns {Array} The transformed items.
     */
    static fetchCollection(items) {
        return items.map(item => this.fetch(item));
    }

    /**
     * Method used to transform a collection to be send.
     *
     * @param {Array} items The items to be transformed.
     *
     * @returns {Array} The transformed items.
     */
    static sendCollection(items) {
        return items.map(item => this.send(item));
    }
}

export default BaseTransformer;
