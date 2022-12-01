<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="mapZoom"
    :options="{
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      disableDefaultUi: true
    }"
    :style="'width: 100%; height: ' + mapHeight"
  >
    <gmap-marker
      v-for="(center, loopIndex) in centers"
      :key="center.id"
      :position="(center.address && center.address.geolocation.latitude && center.address.geolocation.longitude) ? { lat: center.address.geolocation.latitude, lng: center.address.geolocation.longitude } : null"
      :label="{text: (loopIndex + 1).toString(), color:'white'}"
    />
    <gmap-marker
      v-for="(deleteMarker, index) in deleteMarkers"
      v-if="editable"
      :key="index"
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
    mapHeight: {
      required: false,
      type: String,
      default: '500px'
    },
    mapZoom: {
      required: false,
      type: Number,
      default: 11
    },
    centers: {
      required: false,
      type: Array
    },
    areas: {
      required: false,
      type: Array
    },
    editable: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    center: {
      lat: 40.417372,
      lng: -3.703284
    },
    drawingManager: null,
    selectedShape: null,
    deleteMarkers: [],
    polygons: [],
    centerPolygons: []
  }),
  watch: {
    centers () {
      this.autofit()
      this.calculateCenterPolygons()
    }
  },
  async mounted () {
    await this.initGoogle()
  },
  methods: {
    async initGoogle () {
      await this.$gmapApiPromiseLazy()
      const self = this

      if (this.areas) {
        this.areas.forEach(function (coordinates) {
          const polygon = new window.google.maps.Polygon({
            paths: coordinates,
            strokeWeight: self.editable ? 3 : 1
          })
          polygon.setMap(self.$refs.map.$mapObject)
          self.addPolygon(polygon)
        })
      }

      if (this.editable) {
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
          self.drawingManager.setDrawingMode(null)
          this.addPolygon(event.overlay)
        })
      }

      this.autofit()
      this.calculateCenterPolygons()
    },
    addPolygon (polygon) {
      if (this.editable) {
        this.calculateDeleteMarker(polygon)
        this.addPolygonListener(polygon)
      }
      this.polygons.push(polygon)
      this.emitCoordinates()
    },
    addPolygonListener (polygon) {
      polygon.setEditable(true)
      polygon.setDraggable(true)
      const self = this
      polygon.getPath().addListener('set_at', function () {
        const deleteMarker = self.deleteMarkers.find(element => element.polygon === polygon)
        self.calculateDeleteMarker(polygon, deleteMarker)
        self.emitCoordinates()
      })
    },
    autofit () {
      if ((!this.areas || this.areas.length < 1) && (!this.centers || this.centers.length < 1)) {
        return
      }

      const bounds = new window.google.maps.LatLngBounds()

      if (this.centers && this.centers.length > 0) {
        this.centers.forEach(function (center) {
          if (center.address) {
            const address = new window.google.maps.LatLng(center.address.geolocation.latitude, center.address.geolocation.longitude)
            bounds.extend(address)
          }
        })
      }

      if (this.areas && this.areas.length > 0) {
        this.areas.forEach(function (area) {
          area.forEach(function (coordinates) {
            bounds.extend(coordinates)
          })
        })
      }

      this.$refs.map.fitBounds(bounds)
      this.$refs.map.panToBounds(bounds)
    },
    calculateDeleteMarker (polygon, deleteMarker = null) {
      let btnPosition = null
      polygon.getPath().getArray().forEach(function (eventCoordinate) {
        if (!btnPosition || btnPosition.lat() < eventCoordinate.lat()) { btnPosition = eventCoordinate }
      })

      if (deleteMarker) {
        this.$set(this.deleteMarkers, this.deleteMarkers.indexOf(deleteMarker), { position: btnPosition, polygon })
      } else {
        this.deleteMarkers.push({ position: btnPosition, polygon })
      }
    },
    getAreas () {
      const zoneCoordenates = []
      this.polygons.forEach(function (polygon) {
        const polygonCoordenates = []
        polygon.getPath().getArray().forEach(function (coordenates) {
          polygonCoordenates.push({ latitude: coordenates.lat(), longitude: coordenates.lng() })
        })

        zoneCoordenates.push(polygonCoordenates)
      })

      return zoneCoordenates
    },
    removePolygon (deleteMarker) {
      deleteMarker.polygon.setMap(null)
      this.polygons.splice(this.polygons.indexOf(deleteMarker.polygon), 1)
      this.deleteMarkers.splice(this.deleteMarkers.indexOf(deleteMarker), 1)
      this.emitCoordinates()
    },
    calculateCenterPolygons () {
      const self = this
      const centerIds = []

      if (this.centers && this.centers.length > 0) {
        this.centers.forEach(function (center) {
          centerIds.push(center.id)
          const centerPolygon = self.centerPolygons.find(element => (element.centerId === center.id))
          if (centerPolygon) {
            centerPolygon.polygon.setMap(self.$refs.map.$mapObject)
            return
          }

          if (center.zones && center.zones.length > 0) {
            const polygon = new window.google.maps.Polygon({
              paths: center.zones.map(element => ({ lat: Number(element.latitude), lng: Number(element.longitude) })),
              strokeWeight: 1,
              strokeColor: 'red',
              fillColor: 'red'
            })

            polygon.setMap(self.$refs.map.$mapObject)
            self.centerPolygons.push({ centerId: center.id, polygon })
          }
        })
      }
      this.centerPolygons.forEach(function (centerPolygon) {
        if (!centerIds.includes(centerPolygon.centerId)) {
          centerPolygon.polygon.setMap(null)
        }
      })
    },
    emitCoordinates () {
      this.$emit('input', this.getAreas())
    }
  }
}
</script>
