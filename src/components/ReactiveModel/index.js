import { ref } from 'vue';
import { CachedModel } from 'sistemium-data';
import { OFFSET_HEADER, OP_DELETE_ONE } from 'sistemium-data/src/Model';

function noop(arg) {
  return arg.value;
}

/**
 * Checks if response has any data
 * @param {object | import('axios').AxiosResponse}response
 * @returns {boolean}
 */

function isEmpty(response) {
  return !(Array.isArray(response) ? response.length : response);
}

export default class ReactiveModel extends CachedModel {
  constructor(config) {
    super(config);
    this.ts = ref(null);
    this.lastFetchOffset = ref('');
  }

  /**
   * Offset interceptor
   * @param {object | import('axios').AxiosResponse}response
   * @returns {*}
   * @package
   */

  static responseInterceptor(response) {
    const { config: { model, op } } = response;
    const { [OFFSET_HEADER]: offset } = response.headers || {};
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
   * @param {string} column
   * @param {string|number|boolean} value
   * @returns {array}
   */

  reactiveManyByIndex(column, value) {
    noop(this.ts);
    return this.getManyByIndex(column, value);
  }

  /**
   * Returns array of records with filter depending on model.ts
   * @param {object|function} [filter]
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
