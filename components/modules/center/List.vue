<template>
  <v-container class="px-6 mb-12" fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="10"
          :server-items-length="totalItems"
          :options.sync="options"
          :footer-props="{ itemsPerPageOptions: [5, 10, 15] }"
          :loading="loading"

          multi-sort
        >
          <template slot="top">
            <v-row>
              <v-col cols="12" md="4">
                <autocompletes-account
                  v-model="filters.account"
                  hide-details="auto"
                  outlined
                  clearable
                  label="Cuenta"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filters.name"
                  label="Centro"
                  outlined
                  clearable
                  prepend-inner-icon="mdi-magnify"
                  :loading="loading"
                  item-value="name"
                  item-text="name"
                  placeholder="Buscar centro"
                />
              </v-col>
            </v-row>
          </template>
          <template
            #item.actions="{ item }"
          >
            <v-btn
              color="secondary"
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

            <v-btn
              color="primary"
              x-small
              fab
              depressed
              @click="editHandler(item)"
            >
              <v-icon small dense>
                mdi-pencil
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-btn
      color="primary"
      bottom
      right
      fixed
      fab
      @click="addHandler"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
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
    totalItems: 0,
    centers: [],
    accounts: [],
    filters: {
      name: null,
      account: null
    },
    headers: [
      {
        text: 'Cuenta',
        value: 'account.name'
      },
      {
        text: 'Nombre',
        value: 'name'
      },
      {
        text: 'Dirección',
        value: 'address.street'
      },
      {
        text: 'Ciudad',
        value: 'address.city'
      },
      {
        text: 'Actions',
        value: 'actions'
      }
    ]
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
        const params = this.getParameters()
        const response = await this.$api.center.cget(
          {
            params,
            paramsSerializer: (params) => {
              return qs.stringify(params)
            }
          }
        )

        this.items = response.data['hydra:member']
        this.totalItems = response.data['hydra:totalItems']
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    getParameters () {
      const params = {
        page: this.options.page ? this.options.page : 1,
        itemsPerPage: this.options.itemsPerPage,
        order: {}
      }

      for (const [key, value] of Object.entries(this.filters)) {
        if (value === null || (Array.isArray(value) && value.lenght === 0)) {
          continue
        }
        let data = null
        if (Array.isArray(value)) {
          if (typeof value[0] === 'object') {
            data = value.map(value => value.id)
          } else {
            data = value
          }
        } else if (typeof value === 'object') {
          data = value.id
        } else {
          data = value
        }

        params[key] = data
      }

      if (this.options.sortBy.length) {
        for (let i = 0; i < this.options.sortBy.length; i++) {
          params.order[this.options.sortBy[i]] = this.options.sortDesc[i]
            ? 'desc'
            : 'asc'
        }
      } else {
        params.order.date = 'desc'
      }

      return params
    },
    detailHandler (item) {
      this.$router.push({
        name: 'centers-id',
        params: { id: item['@id'] }
      })
    },
    editHandler (item) {
      this.$router.push({
        name: 'centers-edit-id',
        params: { id: item['@id'] }
      })
    },

    addHandler () {
      this.$router.push({
        name: 'centers-new'
      })
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
