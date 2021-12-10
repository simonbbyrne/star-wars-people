import { shallowMount } from '@vue/test-utils';
import Header from '@/components/Header.vue';

describe('Header.vue', () => {
  it('renders the brand logo', () => {
    const wrapper = shallowMount(Header, {});
    expect(wrapper.find('img').exists()).toBe(true);
  });
});
