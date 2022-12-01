<template>
  <v-chip :color="status.color" small v-text="getText()" />
</template>

<script>
import { getStatusShipmentType } from '@/constants/shipment_types'

export default {
  props: {
    value: {
      required: true,
      type: String
    },
    extended: {
      default: false,
      type: Boolean
    }
  },

  data: vm => ({
    status: getStatusShipmentType(vm.value)
  }),

  methods: {
    getText () {
      return this.extended ? 'Estado: ' + this.status.text : this.status.text
    }
  }
}
</script>
