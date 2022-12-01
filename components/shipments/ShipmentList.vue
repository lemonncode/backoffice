<template>
  <v-container class="px-6 mb-12" fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="items"
          :server-items-length="totalItems"
          :options.sync="options"
          :footer-props="{ itemsPerPageOptions: [10, 25, 50, 75, 100] }"
          :loading="loading"
          :page="page"
          multi-sort
        >
          <template #top>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="filters.trackingNumber" type="text" label="Seguimiento" outlined clearable />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field v-model="filters['destination.name']" type="text" label="Destino" outlined clearable />
              </v-col>
              <v-col ccols="12" sm="4" md="2">
                <distributor-select v-model="filters['distributor.uuid']" :multiple="true" />
              </v-col>
              <v-col cols="12" sm="4" md="2">
                <v-combobox
                  v-model="filters.type"
                  :items="typeShipmentTypes"
                  label="Tipo"
                  outlined
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <v-combobox
                  v-model="filters.status"
                  :items="statusShipmentTypes"
                  label="Estado"
                  multiple
                  :background-color="(filters.status && filters.status.length !== 0 ) ? '#3066ff1f' : 'none'"
                  small-chips
                  deletable-chips
                  outlined
                  clearable
                >
                  <template #item="{ item }">
                    <shipment-status-label :value="item.value" />
                  </template>
                </v-combobox>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="filters['date[after]']" type="date" label="Fecha inicial" outlined clearable />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="filters['date[before]']" type="date" label="Fecha final" outlined clearable />
              </v-col>
            </v-row>
          </template>

          <template #item.date="{ item }">
            {{ $moment(item.date).format('LLL') }}
          </template>

          <template #item.type="{ item }">
            {{ getTypeShipmentType(item.type).text }}
          </template>

          <template #item.status="{ item }">
            <shipment-status-label :value="item.status" />
          </template>

          <template #item.complete="{ item }">
            <v-icon :color="item.complete ? 'success' : 'error'">
              {{ item.complete ? 'mdi-check' : 'mdi-cancel' }}
            </v-icon>
          </template>

          <template #item.actions="{ item }">
            <NuxtLink :to="'/shipments/' + item.uuid">
              <v-btn x-small fab depressed color="primary">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </NuxtLink>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <trip-add-dialog @added="loadItems" />
  </v-container>
</template>

<script>
import qs from 'qs'
import DistributorSelect from '../distributors/DistributorSelect.vue'
import ShipmentStatusLabel from './ShipmentStatusLabel.vue'
import { statusShipmentTypes, typeShipmentTypes, getTypeShipmentType } from '@/constants/shipment_types'
import paginationMixin from '~/mixins/pagination'

export default {
  components: {
    DistributorSelect,
    ShipmentStatusLabel
  },
  mixins: [
    paginationMixin
  ],

  data: () => ({
    statusShipmentTypes,
    typeShipmentTypes,
    getTypeShipmentType,
    headers: [
      {
        text: 'Id',
        value: 'id'
      }, {
        text: 'Tipo',
        value: 'type'
      }, {
        text: 'Seguimiento',
        value: 'trackingNumber'
      }, {
        text: 'Distribuidor',
        value: 'distributor.name'
      }, {
        text: 'Destino',
        value: 'destination.name'
      }, {
        text: 'Fecha',
        value: 'date'
      }, {
        text: 'Estado',
        value: 'status'
      }, {
        text: 'Paquetes',
        value: 'numberOfPackages'
      }, {
        text: 'Intentos',
        value: 'numberOfDeliveryAttempts'
      }, {
        text: 'Completo',
        value: 'complete'
      }, {
        text: '',
        value: 'actions',
        align: 'right',
        sortable: false
      }
    ],
    items: [],
    page: 1,
    totalItems: 0,
    options: {},
    filters: {
      trackingNumber: null,
      'destination.name': null,
      'distributor.uuid': null,
      type: null,
      status: [],
      'date[after]': null,
      'date[before]': null

    },
    loading: false
  }),

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
        const params = this.getParameters(this.filters)

        const response = await this.$axios.get('/api/delivery/shipments', {
          params,
          paramsSerializer: (params) => {
            return qs.stringify(params)
          }
        })

        this.items = response.data['hydra:member']
        this.totalItems = response.data['hydra:totalItems']
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
