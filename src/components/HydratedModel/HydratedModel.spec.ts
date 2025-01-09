import { expect } from 'vitest'
import '../../../tests/mocks'
import HydratedModel from '.'
import { StoreAdapter } from 'sistemium-data'

interface IPerson extends Record<string, any> {
  id: string
  name: string
  fatherId: string
}

interface HydratedPerson extends IPerson {
  children: IPerson[]
}

const Person = new HydratedModel<IPerson, HydratedPerson>({
  collection: 'Person',
  schema: {
    name: String,
    id: String,
    fatherId: String,
  },
  computed: {
    children(this: IPerson, store: StoreAdapter) {
      const model = store.getStoreModel('Person') as HydratedModel<IPerson>
      return model.reactiveFilter({ fatherId: this.id })
    },
  },
})

describe('HydratedModel', () => {
  it('hydrates computes', async () => {
    const people = await Person.findAll()
    const fatherId = people[0].id
    const father = Person.hydratedGet(fatherId)
    const childId = 'child1'
    await Person.create({
      id: childId,
      fatherId,
      name: 'Child 1',
    })
    expect(father.children.length).equal(1)
    expect(father.children[0].id).equal(childId)
  })
})
