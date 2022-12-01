<template>
  <v-combobox
    v-model="item"
    v-bind="$attrs"
    :items="items"
    :search-input.sync="search"
    :loading="searching"
    :disabled="loading"
    :menu-props="{ closeOnClick: true }"
    item-value="countryShortCode"
    item-text="countryName"
    prepend-inner-icon="mdi-flag"
    label="País"
    cache-items
    hide-no-data
    hide-selected
    outlined
    clearable
    v-on="$listeners"
    @change="change($event)"
  />
</template>

<script>

import countryRegionData from 'country-region-data'

export default {
  props: {
    value: {
      required: true
    }
  },

  data: vm => ({
    item: vm.value,
    items: countryRegionData,
    search: null,
    loading: false,
    searching: false
  }),

  methods: {
    change (event) {
      this.search = null
      this.$emit('input', event)
    }
  }
}
</script>
