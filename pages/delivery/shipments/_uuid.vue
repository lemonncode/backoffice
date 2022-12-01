<template>
  <div>
    <shipment-item :value="shipment" />
  </div>
</template>

<style>
  .fade-enter-active, .fade-leave-active { transition: opacity .5s; }
  .fade-enter, .fade-leave-active { opacity: 0; }
</style>
<script>
import ShipmentItem from '../../../components/shipments/ShipmentItem.vue'

export default {
  components: {
    ShipmentItem
  },
  async asyncData ({ params, $axios }) {
    const uuid = params.uuid
    console.log(uuid)
    const shipment = await $axios.get(`/api/delivery/shipments/${uuid}`).then(res =>
      res.data
    )
    return { uuid, shipment }
  },
  data: () => (
    {}
  )
}
</script>
