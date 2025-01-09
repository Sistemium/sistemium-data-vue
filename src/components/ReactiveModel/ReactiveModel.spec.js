import { expect } from 'vitest'
import Person from '@/models/Person'
import '../../../tests/mocks'

describe('ReactiveModel', () => {
  it('responds to findAll', async () => {
    Person.clearCache()
    expect(Person.filter()).to.eql([])
    const people = await Person.findAll()
    expect(people.length).greaterThan(0)
    Person.clearCache()
    expect(Person.filter()).to.eql([])
  })

  it('updates toOneIndexes after create', async () => {
    const [child] = await Person.findAll()
    const { id, name, fatherId } = child
    await Person.create({
      ...child,
      name: `${name}-2`,
    })
    expect(Person.getByID(id).name).not.equals(name)
    const [updated] = Person.reactiveManyByIndex('fatherId', fatherId)
    expect(updated.name).not.equals(name)
  })
})
