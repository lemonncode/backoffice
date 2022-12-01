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
                  label="cuentas"
                />
              </v-col>
            </v-row>
          </template>
          <template #item.id="{ item }">
            <v-chip
              class="ma-2"
              color="#F57C00"
            >
              {{ item.id }}
            </v-chip>
          </template>
          <template #item.uuid="{ item }">
            <v-chip
              label
              class="ma-2"
              color="#90CAF9"
            >
              {{ item.uuid }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              color="primary"
              x-small
              fab
              depressed
              @click="detailHandler(item)"
            >
              <v-icon small dense>
                mdi-eye
              </v-icon>
            </v-btn>
            <v-btn
              color="secondary"
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

export default {
  data: () => ({
    items: [],
    options: {},
    totalItems: 0,
    filters: {
      account: null,
      name: null,
      id: null

    },
    centerFilters: {
      q: '',
      accountId: null
    },

    loading: false

  }),

  computed: {
    headers () {
      return [

        {
          text: 'Cuenta',
          value: 'name'
        },

        {
          text: 'Fecha de creación',
          value: 'name'
        },
        {
          text: 'Nº centros asociados',
          value: 'id'
        },
        {
          text: 'Nº pedidos',
          value: 'uuid'
        },
        {
          text: '',
          value: 'actions',
          align: 'right'

        }
      ]
    }
  },

  watch: {

    filters: {
      async handler () {
        this.page = 1
        await this.loadItems()
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
        const response = await this.$api.account.cget(
          {
            params,
            paramsSerializer: (params) => {
              return qs.stringify(params)
            }
          }
        )

        this.items = response.data['hydra:member']
        this.totalItems = response.data['hydra:totalItems']
        console.log(this.items)
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
        if (value === null || (Array.isArray(value) && value.length === 0)) {
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
      console.log(params)
    },
    detailHandler (item) {
      this.$router.push(({
        name: 'accounts-id',
        params: { id: item['@id'] }
      }))
    },

    editHandler (item) {
      this.$router.push(({
        name: 'accounts-edit-id',
        params: { id: item['@id'] }
      }))
    },
    addHandler () {
      this.$router.push(({
        name: 'accounts-new'
      }))
    }
  }
}
</script>
