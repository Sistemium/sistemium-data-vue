export default class ReactiveModel {
    /**
     * Offset interceptor
     * @param response
     * @returns {*}
     * @package
     */
    static responseInterceptor(response: any): any;
    constructor(config: any);
    /**
     * Returns array of records with filter depending on model.ts
     * @param {object} [filter]
     * @returns {object[]}
     */
    reactiveFilter(filter?: object): object[];
    /**
     * Get one record reactively
     * @param {string} id
     * @returns {object}
     */
    reactiveGet(id: string): object;
}
