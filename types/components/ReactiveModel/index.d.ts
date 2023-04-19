export default class ReactiveModel extends CachedModel {
    /**
     * Offset interceptor
     * @param {object | import('axios').AxiosResponse}response
     * @returns {*}
     * @package
     */
    static responseInterceptor(response: object | import('axios').AxiosResponse): any;
    constructor(config: any);
    ts: any;
    lastFetchOffset: import("vue").Ref<string>;
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
import { CachedModel } from 'sistemium-data';
