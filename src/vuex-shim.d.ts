import { Store } from 'vuex';

import Person from './types/Person';
import Planet from './types/Planet';

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    people: Array<Person>;
    planets: Array<Planet>;
    loading: boolean;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
