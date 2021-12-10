import { createStore } from 'vuex';
import mapValues from 'lodash/mapValues';
import keyBy from 'lodash/keyBy';

import getSwapiData from '@/api/get-data';
import Person from '@/types/Person';
import Planet from '@/types/Planet';

export const STORE_CACHE_KEY = 'store';

const store = createStore({
  state: {
    people: [],
    planets: [],
    loading: false,
  },
  mutations: {
    initialiseStore(state) {
      const cache = localStorage.getItem(STORE_CACHE_KEY);
      if (cache) {
        this.replaceState(Object.assign(state, JSON.parse(cache)));
      }
    },
    setPeople(state, payload) {
      state.people = payload;
    },
    setPlanets(state, payload) {
      state.planets = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    async fetchData({ state, commit }, { useCache = false }) {
      if (useCache && state.people.length && state.planets.length) {
        return;
      }

      commit('setLoading', true);

      const [people, planets] = await Promise.all([
        getSwapiData({ resource: 'people' }),
        getSwapiData({ resource: 'planets' }),
      ]);

      commit('setPeople', people);
      commit('setPlanets', planets);
      commit('setLoading', false);
    },
  },
  getters: {
    planetNameMap({ planets }) {
      return mapValues(keyBy(planets, 'url'), 'name');
    },
    getPlanetName: (_, getter) => (person: Person) => {
      return getter.planetNameMap[person.homeworld];
    },
    getPlanetByUrl: (state) => (url: string) => {
      return state.planets.find((planet: Planet) => planet.url === url);
    },
  },
  modules: {},
});

store.subscribe((mutation, state) => {
  // Store the current state as a cache in local storage
  localStorage.setItem(STORE_CACHE_KEY, JSON.stringify(state));
});

export default store;
