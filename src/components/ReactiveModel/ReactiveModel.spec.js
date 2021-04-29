import { expect } from 'chai';
import Person from '../../models/Person';
import '../../../tests/mocks';

describe('ReactiveModel', () => {
  it('responds to findAll', async () => {
    const people = await Person.findAll();
    expect(people.length)
      .to
      // .not
      .equals(2);
  });
});
