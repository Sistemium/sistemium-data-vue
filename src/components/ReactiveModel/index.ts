import { Ref, ref } from 'vue';
import { CachedModel, OFFSET_HEADER, OP_DELETE_ONE } from 'sistemium-data';
import type { BaseItem, AxiosResponse, ModelConfig } from 'sistemium-data';
import type { CachedRequestConfig, KeyType } from 'sistemium-data/lib/CachedModel';
import type { PredicateFn } from 'sistemium-data/lib/util/predicates';

function noop(arg: { value: any }) {
  return arg.value;
}

/**
 * Checks if response has any data
 */

function isEmpty(response: any) {
  return !(Array.isArray(response) ? response.length : response);
}

interface IReactiveModel { ts: Ref<any>, lastFetchOffset: Ref<string> }

export type ReactiveRequestConfig = CachedRequestConfig & { model: IReactiveModel }

export default class ReactiveModel<T extends BaseItem = BaseItem> extends CachedModel<T> implements IReactiveModel {

  ts = ref()
  lastFetchOffset = ref('');

  constructor(config: ModelConfig) {
    super(config);
  }

  /**
   * Offset interceptor
   */

  static responseInterceptor(response: AxiosResponse & {
    config: ReactiveRequestConfig;
  }) {
    const { config: { model, op } } = response;
    const { [OFFSET_HEADER]: offset } = response.headers || {};
    if (!model) {
      return;
    }
    const parentResponse = CachedModel.responseInterceptor(response);
    const shouldUpdateTs = op === OP_DELETE_ONE
      || !model.ts.value
      || !isEmpty(parentResponse);
    if (shouldUpdateTs) {
      model.ts.value = new Date();
    }
    if (offset && offset !== model.lastFetchOffset.value) {
      model.lastFetchOffset.value = offset;
    }
    return parentResponse;
  }

  /**
   * Get array of indexed records
   */

  reactiveManyByIndex(column: string, value: KeyType) {
    noop(this.ts);
    return this.getManyByIndex(column, value);
  }

  /**
   * Returns array of records with filter depending on model.ts
   */

  reactiveFilter(filter: (Partial<T> & BaseItem) | PredicateFn = {}) {
    noop(this.ts);
    return this.filter(filter);
  }

  /**
   * Get one record reactively
   */

  reactiveGet(id?: string) {
    noop(this.ts);
    if (!id) {
      return undefined
    }
    return this.getByID(id);
  }

  eject(id: string) {
    super.eject(id)
    this.ts.value = new Date()
  }

  clearCache() {
    super.clearCache()
    this.ts.value = new Date()
  }

}
