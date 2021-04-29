import Vue from 'vue';
import CachedModel from 'sistemium-data/src/CachedModel';

import { OFFSET_HEADER } from 'sistemium-data/src/Model';

export default class ReactiveModel extends CachedModel {
  constructor(config) {
    super(config);
    Vue.util.defineReactive(this, 'ts', null);
    Vue.util.defineReactive(this, 'lastFetchOffset', null);
  }

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

  reactiveFilter(filter) {
    this.ts; // eslint-disable-line
    return this.filter(filter);
  }
}
