<template>
  <v-card>
    <v-card-title class="text-h5">
      Paquetes (reusar componente packageList)
      <v-spacer />
    </v-card-title>
    <v-card-text>
      <v-row />
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  components: {
  },
  mixins: [
  ],
  props: {
    shipmentProp: {
      type: Object,
      required: false
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      shipment: this.shipmentProp
    }
  },

  watch: {
  },

  methods: {
    loadItems () {
    }
  }
}
</script>
