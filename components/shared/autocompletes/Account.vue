<template>
  <v-combobox
    v-model="item"
    v-bind="$attrs"
    :items="items"
    :search-input.sync="search"
    :loading="loading"
    :menu-props="{ closeOnClick: true, closeOnContentClick: true }"
    item-value="@id"
    item-text="name"
    label="Cuenta"
    cache-items
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

  data: vm => ({
    item: vm.value,
    items: [],
    search: null,
    loading: false
  }),
  watch: {
    search (value) {
      this.loadResource(value)
    }
  },

  created () {
    this.loadResource(null)
  },

  methods: {
    async loadResource (query) {
      this.loading = true

      try {
        const params = {
          name: query,
          'order[name]': 'asc'
        }

        const response = await this.$api.account.cget({
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
    },
    change (event) {
      this.search = null
      this.$emit('input', event)
    }
  }
}
</script>
