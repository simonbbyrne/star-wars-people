<template>
  <section class="home">
    <div class="container">
      <div class="search">
        <input type="text" v-model="filter" placeholder="Search for a name.." />
      </div>

      <Loader v-if="this.$store.state.loading" class="loader" />
      <table v-else class="table">
        <thead>
          <tr>
            <th @click="sortBy('name')">Name</th>
            <th @click="sortBy('height')">Height</th>
            <th @click="sortBy('mass')">Mass</th>
            <th @click="sortBy('created')">Created</th>
            <th @click="sortBy('edited')">Edited</th>
            <th @click="sortBy('planetName')">Planet Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in sortedPeople" :key="person.url">
            <td>{{ person.name }}</td>
            <td>{{ person.height }}</td>
            <td>{{ person.mass }}</td>
            <td>{{ formatDate(person.created) }}</td>
            <td>{{ formatDate(person.edited) }}</td>
            <td>
              <a
                href="#"
                @click.prevent="
                  person.planetName !== 'unknown' &&
                    selectPlanet(person.homeworld)
                "
                >{{ person.planetName }}</a
              >
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6">
              <div class="paging">
                <span
                  >{{ from }} -
                  {{ to }}
                  of {{ filteredPeople.length }}</span
                >
                <a href="#" @click.prevent="prevPage()" class="prev"
                  ><img src="@/assets/images/arrow-left.svg" alt="Arrow Left"
                /></a>
                <a href="#" @click.prevent="nextPage()" class="next"
                  ><img src="@/assets/images/arrow-right.svg" alt="Arrow Right"
                /></a>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
  <Modal :modalOpen="modalOpen" @close="toggleModal">
    <div class="modal-content">
      <h1>{{ selectedPlanet.name }}</h1>
      <div>Diameter: {{ selectedPlanet.diameter }}</div>
      <div>Climate: {{ selectedPlanet.climate }}</div>
      <div>Population: {{ selectedPlanet.population }}</div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import formatDateMixin from '@/mixins/format-date';
import SortTerm from '@/types/SortTerm';
import { alphaCompare, numericCompare } from '@/utils/sort';
import Modal from '@/components/Modal.vue';
import Loader from '@/components/Loader.vue';

export default defineComponent({
  name: 'Home',
  mixins: [formatDateMixin],
  components: {
    Modal,
    Loader,
  },
  data() {
    return {
      filter: '',
      currentSort: 'name',
      currentSortDir: 'asc',
      pageSize: 10,
      currentPage: 1,
      modalOpen: false,
      selectedPlanet: null,
    };
  },
  mounted() {
    this.$store.dispatch('fetchData', {
      useCache: true,
    });
  },
  computed: {
    filteredPeople() {
      return this.$store.state.people
        .filter(({ name }) =>
          name.toLowerCase().includes(this.filter.toLowerCase())
        )
        .map((person) => ({
          ...person,
          planetName: this.$store.getters.getPlanetName(person),
        }));
    },
    sortedPeople() {
      const ascending = this.currentSortDir === 'asc';
      const compareFn = ['height', 'mass'].includes(this.currentSort)
        ? numericCompare(ascending, this.currentSort)
        : alphaCompare(ascending, this.currentSort);

      return [...this.filteredPeople].sort(compareFn).filter((_, index) => {
        let start = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        return index >= start && index < end;
      });
    },
    from() {
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    to() {
      return this.currentPage * this.pageSize < this.filteredPeople.length
        ? this.currentPage * this.pageSize
        : this.filteredPeople.length;
    },
  },
  watch: {
    filter() {
      if (this.currentPage > 1) {
        this.currentPage = 1;
      }
    },
  },
  methods: {
    selectPlanet(homeworld: string) {
      this.selectedPlanet = this.$store.getters.getPlanetByUrl(homeworld);
      this.toggleModal();
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    sortBy(newSort: SortTerm) {
      if (newSort === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = newSort;
    },
    nextPage() {
      if (this.currentPage * this.pageSize < this.filteredPeople.length) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
}

.search {
  margin-bottom: 10px;

  input {
    font-size: 1rem;
    border: 0;
    padding: 12px 32px;
    width: 100%;
  }
}

.table-wrapper {
  position: relative;
}

.table {
  background-color: #fff;
  text-align: left;
  width: 100%;
  max-width: 100%;

  thead {
    background-color: #636363;
    color: #fff;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.1rem;
    font-weight: 600;
  }

  thead th {
    cursor: pointer;
  }

  th,
  td {
    padding: 12px 32px;
  }

  td {
    font-size: 0.875rem;
  }

  th:last-of-type,
  td:last-of-type {
    text-align: right !important;
  }

  tbody tr,
  tfoot tr {
    border-top: 1px solid #e5e5e5;
  }

  tbody tr:hover {
    transition: 0.1s;
    background-color: #f5f5f5;
  }

  tfoot {
    text-align: right;
  }

  a {
    text-decoration: none;
  }
}

.paging {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  a {
    display: inline-flex;
  }

  a.prev {
    margin-left: 20px;
  }

  a.next {
    margin-left: 5px;
    margin-right: -8px;
  }
}

.loader {
  padding: 100px 0;
  text-align: center;
}
</style>
