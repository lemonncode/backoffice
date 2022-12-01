<template>
  <v-autocomplete
    v-bind="$attrs"
    :value="value"
    :items="items"
    outlined
    hide-no-data
    hide-selected
    v-on="$listeners"
    @change="$emit('input', $event)"
  />
</template>

<script>
import { country } from '@/constants/countries'

export default {
  props: {
    value: {
      required: true
    }
  },

  data: () => ({
    items: country
  })
}
</script>
