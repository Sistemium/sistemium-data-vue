import { mount } from '@vue/test-utils';
import { expect } from 'vitest';
import '../../../tests/mocks';
import Person from '@/models/Person';

import HelloWorld from './HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = mount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text())
      .to
      .include(msg);
  });

  it('renders people after findAll', async () => {
    Person.clearCache();
    const wrapper = mount(HelloWorld, {});
    expect(wrapper.text())
      .equals('');
    const people = await Person.findAll();
    await wrapper.vm.$nextTick();
    expect(wrapper.text())
      .to
      .include(people[0].name);
  });

  it('renders people by index', async () => {
    Person.clearCache();
    const propsData = { fatherId: 'fatherId1' };
    const wrapper = mount(HelloWorld, { propsData });
    const people = await Person.findAll(propsData);
    await wrapper.vm.$nextTick();
    expect(wrapper.text())
      .to
      .include(people[0].name);
  });

  it('renders people after create and clears after destroy', async () => {
    Person.clearCache();
    const wrapper = mount(HelloWorld, {});
    const name = 'test';
    await Person.create({ id: name, name });
    await wrapper.vm.$nextTick();
    expect(wrapper.text())
      .to
      .include(name);
    await Person.destroy(name);
    await wrapper.vm.$nextTick();
    expect(wrapper.text())
      .equals('');
  });
});
