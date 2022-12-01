<template>
  <section>
    <v-breadcrumbs :items="breadcrumbs" />

    <v-sheet v-if="loading">
      <v-skeleton-loader type="card" />
    </v-sheet>
    <v-container v-else class="px-6 mb-12" fluid>
      <v-row>
        <v-col cols="12" md="7">
          <v-tabs
            background-color="transparent"
            color="basil"
            grow
          >
            <v-tab
              v-for="item in tabs"
              :key="item.code"
            >
              {{ item.name }}
            </v-tab>
            <v-tab-item>
              <trip-form :trip="trip" />
            </v-tab-item>
            <v-tab-item
              key="general-data"
            >
              <v-card class="ma-1">
                <v-card-text>
                  <v-timeline dense>
                    <v-timeline-item
                      v-for="(tripHistoricStatus, loopIndex) in trip.tripHistoricStatus"
                      :key="tripHistoricStatus.id"
                      color="red darken-2"
                      fill-dot
                    >
                      <template #icon>
                        <span class="white--text">{{ loopIndex + 1 }}</span>
                      </template>
                      <v-card>
                        <v-list class="py-0">
                          <v-list-item dense class="mx-auto">
                            <labels-trip-status :value="tripHistoricStatus.status" />
                          </v-list-item>
                          <v-list-item dense>
                            {{ $moment(tripHistoricStatus.createdAt).format('YYYY/MM/DD HH:mm:ss') }}
                          </v-list-item>
                          <v-list-item v-if="tripHistoricStatus.geolocation.latitude && tripHistoricStatus.geolocation.longitude" dense>
                            {{ tripHistoricStatus.geolocation.latitude +', '+ tripHistoricStatus.geolocation.longitude }}
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                  <v-card-text />
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
        <v-col cols="12" md="5">
          <trip-map
            :origin-geo-location="originGeoLocation"
            :destination-geo-location="destinationGeoLocation"
            :status-changes="statusChanges"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>

export default {
  props: {
    resource: {
      required: false,
      type: String
    }
  },

  data: () => ({
    loading: false,
    trip: null,
    originGeoLocation: {},
    destinationGeoLocation: {},
    statusChanges: null,
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
        text: 'Detalle',
        link: true,
        exact: true,
        disabled: true,
        to: { name: 'trips-id' }
      }
    ],
    tabs: [
      { code: 'general-data', name: 'Detalle del viaje' },
      { code: 'historic', name: 'Cambios de estado' }
    ]
  }),
  async created () {
    await this.loadResource()
  },

  methods: {
    async loadResource () {
      this.loading = true

      try {
        const response = await this.$api.trip.get(this.resource)
        this.trip = response.data
        this.originGeoLocation = this.trip.center.address.geolocation
        this.destinationGeoLocation = this.trip.deliveryAddress.geolocation
        this.statusChanges = this.trip.tripHistoricStatus
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
