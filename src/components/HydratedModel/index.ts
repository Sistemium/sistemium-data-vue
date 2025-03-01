import ReactiveModel from '../ReactiveModel'
import { StoreAdapter } from 'sistemium-data'
import type { PredicateFn } from 'sistemium-data/lib/util/predicates'
import type { BaseItem } from 'sistemium-data'

export const storeAdapter = new StoreAdapter()

export interface RelationsConfig {
  [relationName: string]: string
}

export interface ComputedConfig {
  [getterName: string]: (adapter: StoreAdapter) => any
}

export interface HydratedModelConfig {
  collection: string
  schema: Record<string, any>
  relations?: RelationsConfig
  computed?: ComputedConfig
}

export type ScalarType = string | boolean | number | null | Date
export type ModelInstanceValue = ScalarType | ScalarType[]

export default class HydratedModel<
  T extends Record<string, ModelInstanceValue>,
  HT extends T = T,
> extends ReactiveModel<T> {
  private relations: RelationsConfig
  private computed: ComputedConfig

  constructor(config: HydratedModelConfig) {
    const cfg = { ...config }
    const { relations = {} } = config
    Object.keys(relations).forEach((key) => {
      cfg.schema[`${key}Id`] = String
    })
    super(cfg)
    this.relations = relations
    this.computed = config.computed || {}
    storeAdapter.setupModel(this.collection, config, this)
  }

  hydrate(instance: T): HT {
    const { relations, computed } = this
    const result = { ...instance }
    Object.keys(relations).forEach((key) => {
      const parentName = relations[key]
      const parent = storeAdapter.getStoreModel(parentName) as HydratedModel<T>
      const propertyValue = instance[`${key}Id`] as string
      Object.defineProperty(result, key, {
        get() {
          return parent.hydratedGet(propertyValue)
        },
        enumerable: false,
      })
    })
    Object.keys(computed).forEach((key) => {
      Object.defineProperty(result, key, {
        get() {
          return computed[key].call(this, storeAdapter)
        },
        enumerable: false,
      })
    })
    return result as HT
  }

  hydratedGet(id?: string): HT {
    const instance: T = this.reactiveGet(id)
    return instance && this.hydrate(instance)
  }

  hydratedFilter(filter?: (Partial<T> & BaseItem) | PredicateFn): HT[] {
    return this.reactiveFilter(filter).map((instance) => this.hydrate(instance))
  }
}
