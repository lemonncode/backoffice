<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="11"
    :options="{
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      disableDefaultUi: true
    }"
    style="width: 100%; height: 500px"
  >
    <gmap-marker
      v-if="originGeoLocation"
      :position="{ lat: originGeoLocation.latitude, lng: originGeoLocation.longitude }"
      :icon="{
        url: require('assets/images/center.png')
      }"
    />
  </GmapMap>
</template>

<script>

export default {
  props: {
    originGeoLocation: {
      required: false,
      type: [Object, null]
    }
  },
  data: () => ({
    center: {
      lat: 40.417372,
      lng: -3.703284
    }
  }),
  watch: {
    originGeoLocation () {
      this.initGoogle()
    }
  },
  async created () {
    await this.initGoogle()
  },
  methods: {
    async initGoogle () {
      await this.$gmapApiPromiseLazy()
      this.autofit()
    },

    autofit () {
      if (this.originGeoLocation) {
        this.center = new window.google.maps.LatLng(this.originGeoLocation.latitude, this.originGeoLocation.longitude)
      }
    }
  }
}
</script>
