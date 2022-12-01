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
import { source } from '@/constants/trip_source'

export default {
  props: {
    value: {
      required: true
    }
  },

  data: () => ({
    items: source
  })
}
</script>
