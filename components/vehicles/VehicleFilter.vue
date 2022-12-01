<template>
  <v-autocomplete
    :value="value"
    :items="items"
    :search-input.sync="search"
    :loading="loading"
    item-value="id"
    item-text="licensePlateNumber"
    label="Vehículos"
    multiple
    cache-items
    outlined
    small-chips
    deletable-chips
    hide-no-data
    hide-selected
    clearable
    @change="change($event)"
  />
</template>

<script>
import qs from 'qs'

export default {
  props: {
    value: {
      required: true
    }
  },

  data: () => ({
    items: [],
    search: '',
    loading: false
  }),

  watch: {
    async search (value) {
      this.loading = true

      try {
        const params = {
          licensePlateNumber: value,
          'order[licensePlateNumber]': 'asc'
        }

        const response = await this.$axios.get('/vehicles', {
          params,
          paramsSerializer: (params) => {
            return qs.stringify(params)
          }
        })

        this.items = response.data['hydra:member']
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },

  methods: {
    change (event) {
      this.search = ''
      this.$emit('input', event)
    }
  }
}
</script>
