/**
 * A sleep function to delay the transaction
 * @param {Number} ms
 * @return {Promise<any>}
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
