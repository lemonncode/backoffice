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
    <gmap-marker
      v-if="destinationGeoLocation"
      :position="{ lat: destinationGeoLocation.latitude, lng: destinationGeoLocation.longitude }"
      :icon="{
        url: require('assets/images/delivery.png')
      }"
    />
    <gmap-marker
      v-for="(statusLocation, loopIndex) in statusChanges"
      :key="statusLocation.id"
      :color="statusColor(statusLocation.status)"
      :position="(statusLocation.geolocation.latitude && statusLocation.geolocation.longitude) ? { lat: statusLocation.geolocation.latitude, lng: statusLocation.geolocation.longitude } : null"
      :class="statusColor(statusLocation.status)"
      :label="(loopIndex + 1).toString()"
    />
  </GmapMap>
</template>

<script>
import { getStatus } from '~/constants/trip_status'

export default {
  props: {
    originGeoLocation: {
      required: false,
      type: [Object, null]
    },
    destinationGeoLocation: {
      required: false,
      type: [Object, null]
    },
    statusChanges: {
      required: false,
      type: Array
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
    },
    destinationGeoLocation () {
      this.initGoogle()
    }
  },
  async mounted () {
    await this.initGoogle()
  },
  methods: {
    statusColor (status) {
      return getStatus(status).color
    },
    async initGoogle () {
      await this.$gmapApiPromiseLazy()

      this.directionsService = new window.google.maps.DirectionsService()
      this.directionsRenderer = new window.google.maps.DirectionsRenderer()

      this.directionsRenderer.setMap(null)
      this.directionsRenderer.setMap(this.$refs.map.$mapObject)
      this.autofit()
    },

    autofit () {
      const bounds = new window.google.maps.LatLngBounds()

      if (this.originGeoLocation) {
        const center = new window.google.maps.LatLng(this.originGeoLocation.latitude, this.originGeoLocation.longitude)
        bounds.extend(center)
      }

      if (this.destinationGeoLocation) {
        const address = new window.google.maps.LatLng(this.destinationGeoLocation.latitude, this.destinationGeoLocation.longitude)
        bounds.extend(address)
      }

      this.$refs.map.fitBounds(bounds)
      this.$refs.map.panToBounds(bounds)
    }
  }
}
</script>
