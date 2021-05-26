export default class ReactiveModel extends CachedModel {
    /**
     * Offset interceptor
     * @param response
     * @returns {*}
     * @package
     */
    static responseInterceptor(response: any): any;
    constructor(config: any);
    /**
     * Get array of indexed records
     * @param {string} column
     * @param {string|number|boolean} value
     * @returns {array}
     */
    reactiveManyByIndex(column: string, value: string | number | boolean): any[];
    /**
     * Returns array of records with filter depending on model.ts
     * @param {object|function} [filter]
     * @returns {object[]}
     */
    reactiveFilter(filter?: object | Function): object[];
    /**
     * Get one record reactively
     * @param {string} id
     * @returns {object}
     */
    reactiveGet(id: string): object;
}
import { CachedModel } from "sistemium-data";
