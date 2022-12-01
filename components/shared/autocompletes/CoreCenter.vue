<template>
  <v-combobox
    v-bind="$attrs"
    :value="value"
    :items="items"
    :search-input.sync="search"
    :loading="loading"
    :menu-props="{ closeOnClick: true, closeOnContentClick: true }"
    item-value="@id"
    item-text="name"
    hide-no-data
    hide-selected
    outlined
    v-on="$listeners"
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
    search (value) {
      this.loadResources(value)
    }
  },

  methods: {
    change (event) {
      this.search = ''
      this.$emit('input', event)
    },
    async loadResources (query) {
      this.loading = true
      const params = { 'order[name]': 'asc' }
      if (this.query) { params.name = query }

      try {
        const response = await this.$api.coreCenter.cget({
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
  }
}
</script>
