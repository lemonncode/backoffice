<template>
  <section>
    <v-breadcrumbs :items="breadcrumbs" />

    <v-sheet v-if="loading">
      <v-skeleton-loader type="card" />
    </v-sheet>
    <v-container v-else class="px-6 mb-12" fluid>
      <v-row>
        <v-col cols="12" md="7">
          <trip-form
            :readonly="false"
            @centerChanged="centerChanged"
            @destinationChanged="destinationChanged"
          />
        </v-col>
        <v-col cols="12" md="5">
          <trip-map
            :origin-geo-location="originGeoLocation"
            :destination-geo-location="destinationGeoLocation"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>

export default {
  data: () => ({
    loading: false,
    valid: true,
    originGeoLocation: null,
    destinationGeoLocation: null,
    breadcrumbs: [
      {
        text: 'Dashboard',
        link: true,
        exact: true,
        disabled: false,
        to: { name: 'index' }
      },
      {
        text: 'Viajes',
        link: true,
        exact: true,
        disabled: false,
        to: { name: 'trips' }
      },
      {
        text: 'Añadir',
        link: true,
        exact: true,
        disabled: true,
        to: { name: 'trips-new' }
      }
    ]
  }),
  methods: {
    centerChanged (center) {
      this.originGeoLocation = (center && center.address && center.address.geolocation.latitude && center.address.geolocation.longitude)
        ? center.address.geolocation
        : null
    },
    destinationChanged (geoLocation) {
      this.destinationGeoLocation = (!geoLocation.latitude || !geoLocation.longitude)
        ? null
        : { latitude: geoLocation.latitude, longitude: geoLocation.longitude }
    }
  }
}
</script>
