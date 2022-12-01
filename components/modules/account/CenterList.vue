<template>
  <div>
    <section>
      <v-container>
        <h3 class="mb-3">
          Centros activos
        </h3>
        <v-card outlined flat tile>
          <div v-if="loading" class="pa-6 text-center">
            <v-progress-circular color="primary" indeterminate />
          </div>

          <v-list v-for="center in centers" :key="center.id" three-line>
            <v-list-item-group v-model="totalItems" color="primary" />
            <span class="white--text text-body-1" />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="mb-3">
                  {{ center.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="mb-3">
                  <v-icon left>
                    mdi-map-marker-radius
                  </v-icon>
                  {{ center.address.street }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="mb-2 text--secondary text-caption">
                  <v-icon color="grey" small left>
                    mdi-package-variant-closed
                  </v-icon>
                  {{ center.address.city }}
                  <v-icon class="ml-5" color="grey" small left>
                    mdi-calendar-clock
                  </v-icon>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
          </v-list>
        </v-card>
      </v-container>
    </section>
    <section />
    <v-row />

    <v-row>
      <v-col cols="12">
        <v-data-table

          :items="items"
          :items-per-page="10"
          :server-items-length="totalItems"
          :options.sync="options"
        >
          <template
            #item.actions="{ item }"
          >
            <v-btn
              color="primary"
              x-small
              fab
              depressed
              :readonly="true"
              @click="detailHandler(item)"
            >
              <v-icon small dense>
                mdi-eye
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script>
import qs from 'qs'
import paginationMixin from '~/mixins/pagination'
export default {
  components: {},
  mixins: [paginationMixin],
  data: () => ({
    loading: false,
    options: {},
    items: [],
    centers: [],
    accounts: [],
    filters: {
      name: null,
      account: null
    }

  }),
  watch: {
    'filters.center' () {
      this.filters.center = null
    },

    filters: {
      async handler () {
        this.page = 1
        await this.loadItems()
      },
      deep: true
    },
    centerFilters: {
      handler () {
        this.setSearch()
      },
      deep: true
    },

    options: {
      async handler () {
        await this.loadItems()
      },
      deep: true
    }
  },

  methods: {
    async loadItems () {
      this.loading = true
      try {
        const response = await this.$api.center.cget()
        this.centers = response.data['hydra:member']
        this.totalItems = response.data['hydra:totalItems']
      } catch (e) {

      } finally {
        this.loading = false
      }

      // getParameters () {
      //   const params = {
      //     page: this.options.page ? this.options.page : 1,
      //     itemsPerPage: this.options.itemsPerPage,
      //     order: {}
      //   }

      //   for (const [key, value] of Object.entries(this.filters)) {
      //     if (value === null || (Array.isArray(value) && value.lenght === 0)) {
      //       continue
      //     }
      //     let data = null
      //     if (Array.isArray(value)) {
      //       if (typeof value[0] === 'object') {
      //         data = value.map(value => value.id)
      //       } else {
      //         data = value
      //       }
      //     } else if (typeof value === 'object') {
      //       data = value.id
      //     } else {
      //       data = value
      //     }

      //     params[key] = data
      //   }

      //   if (this.options.sortBy.length) {
      //     for (let i = 0; i < this.options.sortBy.length; i++) {
      //       params.order[this.options.sortBy[i]] = this.options.sortDesc[i]
      //         ? 'desc'
      //         : 'asc'
      //     }
      //   } else {
      //     params.order.date = 'desc'
      //   }

      //   return params
      // }
    }
  }
}

</script>

<style scoped>
.v-text-field .v-input__control .v-input__slot{
  height:876px !important;
  width:56px !important;
}
</style>
