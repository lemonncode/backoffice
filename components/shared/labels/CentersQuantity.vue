<template>
  <v-chip
    :color="red"
    class="white--text"
    small
    v-on="$listeners"
    v-text="status.text"
  />
</template>

<script>
import { getStatus } from '~/constants/trip_status'

export default {
  props: {
    value: {
      required: true,
      type: String
    }
  },

  computed: {
    status () {
      return getStatus(this.value)
    }
  }
}
</script>
