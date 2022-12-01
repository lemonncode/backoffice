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
              <v-col cols="12" md="2">
                <autocompletes-center
                  v-model="filters.center"
                  label="Centro"
                  hide-details="auto"
                  multiple
                  outlined
                  :account="filters.account"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="2">
                <bool-select
                  v-model="filters.isAsap"
                  outlined
                  label="ASAP"
                  hide-details="auto"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="2">
                <autocompletes-trip-status
                  v-model="filters.status"
                  label="Estado"
                  hide-details="auto"
                  multiple
                  outlined
                  clearable
                />
              </v-col>
              <v-col cols="12" md="2">
                <autocompletes-trip-source
                  v-model="filters.source"
                  label="Fuente"
                  hide-details="auto"
                  multiple
                  outlined
                  clearable
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters['date[after]']"
                  type="date"
                  label="Fecha de entrega (desde)"
                  outlined
                  clearable
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters['date[before]']"
                  type="date"
                  label="Fecha de entrega (hasta)"
                  outlined
                  clearable
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters['createdAt[after]']"
                  type="date"
                  label="Fecha de creación (desde)"
                  outlined
                  clearable
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters['createdAt[before]']"
                  type="date"
                  label="Fecha de creación (hasta)"
                  outlined
                  clearable
                />
              </v-col>
            </v-row>
          </template>
          <template #item.date="{ item }">
            {{ $moment(item.date).format("DD/MM/Y HH:mm") }}
          </template>
          <template #item.createdAt="{ item }">
            {{ $moment(item.createdAt).format("DD/MM/Y HH:mm") }}
          </template>
          <template #item.isAsap="{ item }">
            <v-icon
              small
              :color="item.isAsap ? 'green' : 'red'"
            >
              {{ item.isAsap ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
          </template>
          <template #item.driver="{ item }">
            {{ item.driver ? (item.driver.firstName +' '+ item.driver.lastName) : '' }}
          </template>
          <template #item.status="{ item }">
            <labels-trip-status :value="item.status" />
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
      center: null,
      'shipment.trackingNumber': null,
      'customer.name': null,
      'date[after]': null,
      'date[before]': null,
      status: null,
      source: null,
      isAsap: null
    },
    accountUser: null,
    loading: false,
    eventSource: null,
    headers: [
      {
        text: 'Fuente',
        value: 'source'
      },
      {
        text: 'Cuenta',
        value: 'account.name'
      },
      {
        text: 'Centro',
        value: 'center.name'
      },
      {
        text: 'Destino',
        value: 'deliveryAddress.name',
        sortable: false,
        width: '300'
      },
      {
        text: 'Dirección de entrega',
        value: 'date'
      },
      {
        text: 'ASAP',
        value: 'isAsap'
      },
      {
        text: 'Rider',
        value: 'driver'
      },
      {
        text: 'Estado',
        value: 'status'
      },
      {
        text: 'Fecha de creación',
        value: 'createdAt'
      },
      {
        text: '',
        value: 'actions',
        align: 'right',
        sortable: false
      }
    ]
  }),

  watch: {
    'filters.account' () {
      this.filters.center = null
    },
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
        const response = await this.$api.trip.cget(
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
    },
    detailHandler (item) {
      this.$router.push({
        name: 'trips-id',
        params: { id: item['@id'] }
      })
    },
    addHandler () {
      this.$router.push({
        name: 'trips-new'
      })
    }
  }
}
</script>
