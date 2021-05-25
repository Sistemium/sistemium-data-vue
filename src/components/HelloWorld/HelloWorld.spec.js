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
    Person.clearCache();
    const wrapper = shallowMount(HelloWorld, {});
    expect(wrapper.text())
      .equals('');
    const people = await Person.findAll();
    await wrapper.vm.$nextTick();
    expect(wrapper.text())
      .to
      .include(people[0].name);
  });

  it('renders people after create', async () => {
    Person.clearCache();
    const wrapper = shallowMount(HelloWorld, {});
    const name = 'test';
    await Person.create({ id: name, name });
    await wrapper.vm.$nextTick();
    expect(wrapper.text())
      .to
      .include(name);
  });
});
