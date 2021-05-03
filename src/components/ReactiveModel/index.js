import Vue from 'vue';
import { CachedModel } from 'sistemium-data';

import { OFFSET_HEADER } from 'sistemium-data/src/Model';

function noop(arg) {
  return arg;
}

export default class ReactiveModel extends CachedModel {
  constructor(config) {
    super(config);
    Vue.util.defineReactive(this, 'ts', null);
    Vue.util.defineReactive(this, 'lastFetchOffset', null);
  }

  /**
   * Offset interceptor
   * @param response
   * @returns {*}
   * @package
   */

  static responseInterceptor(response) {
    const { model } = response.config;
    const { [OFFSET_HEADER]: offset } = response.headers || {};
    const parentResponse = CachedModel.responseInterceptor(response);
    model.ts = new Date();
    if (offset) {
      model.lastFetchOffset = offset;
    }
    return parentResponse;
  }

  /**
   * Returns array of records with filter depending on model.ts
   * @param {object} [filter]
   * @returns {object[]}
   */

  reactiveFilter(filter) {
    noop(this.ts);
    return this.filter(filter);
  }

  /**
   * Get one record reactively
   * @param {string} id
   * @returns {object}
   */

  reactiveGet(id) {
    noop(this.ts);
    return this.getByID(id);
  }
}
