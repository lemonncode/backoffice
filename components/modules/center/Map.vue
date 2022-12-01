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
      v-if="deleteMarker"
      :position="deleteMarker.position"
      :icon="{
        url: require('assets/images/close-circle.png')
      }"
      @click="removePolygon(deleteMarker)"
    />
  </GmapMap>
</template>

<script>

export default {
  props: {
    originGeoLocation: {
      required: false,
      type: [Object, null]
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false
    },
    area: {
      required: false,
      type: Array
    }
  },
  data: () => ({
    center: {
      lat: 40.417372,
      lng: -3.703284
    },
    drawingManager: null,
    deleteMarker: null,
    polygon: null
  }),
  watch: {
    originGeoLocation () {
      this.autofit()
    },
    polygon () {
      if (this.drawingManager) {
        if (this.polygon) {
          this.drawingManager.setMap(null)

          if (!this.readonly) {
            this.calculateDeleteMarker()
            this.addPolygonListener()
          }

          this.emitCoordinates()
        } else {
          this.drawingManager.setMap(this.$refs.map.$mapObject)
        }
      }
    }
  },
  async mounted () {
    await this.initGoogle()
  },
  methods: {
    async initGoogle () {
      await this.$gmapApiPromiseLazy()

      if (this.area && this.area.length > 0) {
        this.polygon = new window.google.maps.Polygon({
          paths: this.area,
          map: this.$refs.map.$mapObject
        })
      }

      if (!this.readonly) {
        this.drawingManager = new window.google.maps.drawing.DrawingManager(
          {
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                window.google.maps.drawing.OverlayType.POLYGON
              ],
              clickable: true,
              suppressUndo: true
            }
          }
        )
        this.drawingManager.setMap(this.$refs.map.$mapObject)

        window.google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
          if (event.type !== 'polygon') {
            return
          }
          this.polygon = event.overlay
        })
      }

      this.autofit()
    },
    calculateDeleteMarker () {
      let btnPosition = null

      this.polygon.getPath().getArray().forEach(function (eventCoordinate) {
        if (!btnPosition || btnPosition.lat() < eventCoordinate.lat()) { btnPosition = eventCoordinate }
      })

      this.deleteMarker = { position: btnPosition, polygon: this.polygon }
    },
    removePolygon () {
      this.deleteMarker.polygon.setMap(null)
      this.polygon = null
      this.deleteMarker = null
      this.emitCoordinates()
    },
    addPolygonListener () {
      this.polygon.setEditable(true)
      this.polygon.setDraggable(true)
      const self = this

      this.polygon.getPath().addListener('set_at', function () {
        self.calculateDeleteMarker()
        self.emitCoordinates()
      })
    },
    emitCoordinates () {
      const zoneCoordenates = []
      if (this.polygon) {
        this.polygon.getPath().getArray().forEach(function (coordenates) {
          zoneCoordenates.push({ latitude: coordenates.lat(), longitude: coordenates.lng() })
        })
      }

      this.$emit('input', zoneCoordenates)
    },
    autofit () {
      if (this.originGeoLocation) {
        this.center = new window.google.maps.LatLng(this.originGeoLocation.latitude, this.originGeoLocation.longitude)
      }
    }
  }
}
</script>
