
<template>
  <section>
    <v-breadcrumbs :items="breadcrumbs" />

    <v-sheet v-if="loading">
      <v-skeleton-loader type="card" />
    </v-sheet>
    <v-container v-else class="px-6 mb-12" fluid>
      <v-row>
        <v-col cols="12" md="7">
          <v-form ref="form" v-model="valid">
            <v-card class="ma-1">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <autocompletes-account
                      v-model="form.account"
                      :rules="[validationRules.required, validationRules.resource]"
                      label="Cuenta"
                      outlined
                      dense
                      :readonly="readonly"
                      :disabled="!!center"
                      hide-details="auto"
                      :multiple="false"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.name"
                      label="Nombre"
                      :rules="[validationRules.required]"
                      outlined
                      dense
                      :readonly="readonly"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.phoneNumber"
                      label="Teléfono"

                      outlined
                      dense
                      :readonly="readonly"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card class="ma-1">
              <v-card-title class="text--disabled">
                Dirección
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.address.street"
                      label="Calle"
                      :rules="[validationRules.required]"
                      outlined
                      dense
                      :readonly="readonly"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.address.city"
                      label="Ciudad"
                      :rules="[validationRules.required]"
                      outlined
                      dense
                      :readonly="readonly"
                      hide-details="auto"
                    />
                  </v-col>

                  <v-col cols="6">
                    <v-text-field
                      v-model.number="form.address.latitude"
                      label="Latitud"
                      :rules="[validationRules.required]"
                      outlined
                      dense
                      :readonly="readonly"
                      hide-details="auto"
                      type="number"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model.number="form.address.longitude"
                      label="Longitud"
                      :rules="[validationRules.required]"
                      outlined
                      dense
                      :readonly="readonly"
                      hide-details="auto"
                      type="number"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-row v-if="!readonly" class="mt-3">
              <v-col
                cols="12"
                class="text-right"
              >
                <v-btn
                  text
                  :disabled="submitting"
                  to="/centers"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="submitting"
                  @click="submit"
                >
                  Guardar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="12" md="5">
          <center-map
            v-model="form.zones"
            :origin-geo-location="geoLocation"
            :readonly="readonly"
            :area="initialArea"
          />
          <v-row>
            <v-col align="right">
              <v-dialog
                v-model="mapDialog"
                persistent
                max-width="900"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    class="mt-2"
                    dense
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left>
                      mdi-information-outline
                    </v-icon>
                    Instrucciones del mapa
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="title">
                    <v-icon size="20" color="grey lighten-2">
                      mdi-map
                    </v-icon>
                    <span class="ml-2">Instrucciones del mapa</span>
                  </v-card-title>
                  <v-card-text class="pb-0">
                    <v-list>
                      <v-list-item>
                        <v-list-item-icon
                          class="mr-2 mr-md-4"
                        >
                          <v-chip>1</v-chip>
                        </v-list-item-icon>
                        <v-list-item-content>
                          Introduce latitud y longitud del centro para ver su localización en el mapa
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-icon
                          class="mr-2 mr-md-4"
                        >
                          <v-chip>2</v-chip>
                        </v-list-item-icon>
                        <v-list-item-content>
                          Dibuja, edita o elimina en el mapa la zona.
                          <v-container>
                            <video width="100%" height="auto" controls autoplay>
                              <source src="/videos/centerMapInstructions.mov">
                            </video>
                          </v-container>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      class="ma-2"
                      outlined
                      @click="mapDialog = false"
                    >
                      Cerrar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import validation from '~/mixins/validation.js'
export default {
  mixins: [
    validation
  ],
  props: {
    resource: {
      required: false,
      type: String
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loading: false,
    submitting: false,
    valid: true,
    form: {
      account: null,
      name: null,
      address: {
        street: null,
        city: null,
        latitude: null,
        longitude: null
      },
      phoneNumber: null,
      zones: []
    },
    initialArea: null,
    center: null,
    geoLocation: null,
    mapDialog: null,
    breadcrumbs: [
      {
        text: 'Dashboard',
        link: true,
        exact: true,
        disabled: false,
        to: { name: 'index' }
      },
      {
        text: 'Centro',
        link: true,
        exact: true,
        disabled: false,
        to: { name: 'centers' }
      }
    ]
  }),
  watch: {
    'form.address.latitude' () {
      this.coordinatesChanged()
    },
    'form.address.longitude' () {
      this.coordinatesChanged()
    }
  },
  created () {
    const currentBreadcrum = {
      text: 'Añadir',
      link: false,
      exact: true,
      disabled: true
    }

    if (this.resource) {
      currentBreadcrum.text = this.readonly ? 'Detalle' : 'Editar'
      this.loadResource()
    }

    this.breadcrumbs.push(currentBreadcrum)
  },
  methods: {
    async loadResource () {
      this.loading = true

      try {
        const response = await this.$api.center.get(this.resource)
        this.center = response.data
        this.form.account = this.center.account
        this.form.name = this.center.name
        this.form.address.street = this.center.address.street
        this.form.address.city = this.center.address.city
        this.form.address.latitude = this.center.address.geolocation.latitude
        this.form.address.longitude = this.center.address.geolocation.longitude
        this.form.phoneNumber = this.center.phoneNumber
        this.centerGeoLocation = this.center.address.geolocation

        this.initialArea = this.center.zones.map(element => ({ lat: element.latitude, lng: element.longitude }))
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.loading = false
      }
    },
    coordinatesChanged () {
      this.geoLocation = (this.form.address.latitude && this.form.address.longitude)
        ? { latitude: this.form.address.latitude, longitude: this.form.address.longitude }
        : null
    },
    refreshMapDestination () {
      this.$emit('coordinatesChanged', this.form.address)
    },
    async submit () {
      if (this.readonly || !this.$refs.form.validate()) {
        return
      }

      this.submitting = true
      try {
        const data = {
          ...this.form,
          account: this.form.account['@id']
        }

        let message = 'Centro' + ' '
        if (this.center) {
          delete data.account
          await this.$api.center.put(this.center['@id'], data)
          message += ' editado'
        } else {
          await this.$api.center.post(data)
          message += ' añadido'
        }
        message += ' con éxito'
        this.$toast.success(message)
        await this.$router.push({ name: 'centers' })
      } catch (e) {
        if (e.response.data.violations) {
          const errorMessage = e.response.data.violations.lastItem.message
          this.$toast.error(errorMessage)
        } else if (e.response.message) {
          this.$toast.error(e.response.message)
        }

        console.log(e.response)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.v-input--is-readonly >>> fieldset {
  border-color: #EEEEEE;
}
</style>
