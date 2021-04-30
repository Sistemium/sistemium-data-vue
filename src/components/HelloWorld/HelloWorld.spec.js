import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import '@/../tests/mocks';
import Person from '@/models/Person';

import HelloWorld from './HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text())
      .to
      .include(msg);
  });

  it('renders people after findAll', async () => {
    const wrapper = shallowMount(HelloWorld, {});
    expect(wrapper.text())
      .equals('');
    const people = await Person.findAll();
    expect(wrapper.text())
      .to
      .include(people[0].name);
  });
});
