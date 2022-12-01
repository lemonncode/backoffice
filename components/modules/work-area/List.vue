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
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="filters.name"
                  label="Nombre"
                  outlined
                />
              </v-col>
              <v-col cols="6" md="3">
                <bool-select
                  v-model="filters.status"
                  outlined
                  label="Activo"
                  hide-details="auto"
                  clearable
                />
              </v-col>
            </v-row>
          </template>
          <template #item.status="{ item }">
            <dialogs-confirm @confirm="changeStatus(item)">
              <template #button="{ on, attrs }">
                <v-switch
                  v-model="item.status"
                  v-bind="attrs"
                  class="mt-4"
                  :readonly="true"
                  v-on="on"
                />
              </template>
            </dialogs-confirm>
          </template>
          <template #item.centers="{ item }">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  color="info"
                  dark
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ item.centers.length + ' centros' }}
                </v-btn>
              </template>
              <v-chip-group>
                <v-chip
                  v-for="center in item.centers"
                  :key="center.id"
                  small
                >
                  {{ center.account.name +' | '+ center.name }}
                </v-chip>
              </v-chip-group>
            </v-tooltip>
          </template>
          <template #item.createdAt="{ item }">
            {{ $moment(item.createdAt).format("DD/MM/Y HH:mm") }}
          </template>
          <template #item.actions="{ item }">
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
  mixins: [paginationMixin],
  data: () => ({
    items: [],
    options: {},
    totalItems: 0,
    filters: {
      name: null,
      status: null
    },
    loading: false,
    page: 1,
    headers: [
      {
        text: 'Nombre',
        value: 'name'
      },
      {
        text: 'Activo',
        value: 'status'
      },
      {
        text: 'Centros asociados',
        value: 'centers'
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
        const response = await this.$api.workArea.cget(
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
    async changeStatus (item) {
      this.loading = true

      try {
        const data = {
          name: item.name,
          status: !item.status
        }

        await this.$api.workArea.put(item['@id'], data)
        this.$toast.success('Estado modificado con éxito')
        this.loadItems()
      } catch (e) {
        console.log(e.response)
        this.$toast.error(e.response.data.message)
      } finally {
        this.loading = false
      }
    },
    detailHandler (item) {
      this.$router.push({
        name: 'work-areas-id',
        params: { id: item['@id'] }
      })
    },
    editHandler (item) {
      this.$router.push({
        name: 'work-areas-edit-id',
        params: { id: item['@id'] }
      })
    },
    addHandler () {
      this.$router.push({
        name: 'work-areas-new'
      })
    }
  }
}
</script>
