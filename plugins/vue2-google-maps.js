import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

export default ({ $config }) => {
  Vue.use(VueGoogleMaps, {
    load: {
      key: $config.googleApiKey,
      libraries: ['places', 'drawing']
    }
  })

  Vue.use(VuetifyGoogleAutocomplete, {
    vueGoogleMapsCompatibility: true
  })
}
