import { expect } from 'chai';
import Person from '@/models/Person';
import '@/../tests/mocks';

describe('ReactiveModel', () => {
  it('responds to findAll', async () => {
    Person.clearCache();
    expect(Person.filter())
      .to
      .eql([]);
    const people = await Person.findAll();
    expect(people.length)
      .greaterThan(0);
    Person.clearCache();
    expect(Person.filter())
      .to
      .eql([]);
  });
});
