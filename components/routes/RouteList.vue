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
              <v-col cols="4">
                <v-text-field v-model="filters.name" type="text" label="Nombre" outlined clearable />
              </v-col>
            </v-row>
          </template>

          <template #item.actions="{ item }">
            <!--trip-edit-dialog :resource="item['@id']" @updated="loadItems" /-->
            <button>Press me! {{ item.id }}</button>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <trip-add-dialog @added="loadItems" />
  </v-container>
</template>

<script>
import qs from 'qs'
import paginationMixin from '~/mixins/pagination'

export default {
  components: {
  },
  mixins: [
    paginationMixin
  ],

  data: () => ({
    headers: [
      {
        text: 'Id',
        value: 'id',
        width: '250'
      }, {
        text: 'Nombre',
        value: 'name'
      }, {
        text: '',
        value: 'actions',
        align: 'right',
        sortable: false
      }
    ],
    items: [],
    totalItems: 0,
    filters: {
      name: null
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

        const response = await this.$axios.get('/api/delivery/routes', {
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
