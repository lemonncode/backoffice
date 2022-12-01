<template>
  <section>
    <v-form ref="form" v-model="valid">
      <v-card class="ma-1">
        <v-card-title class="text--disabled">
          Datos generales
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-if="trip"
              cols="4"
            >
              <v-text-field
                :value="$moment(trip.createdAt).format('YYYY-MM-DD HH:MM')"
                label="Fecha de creación"
                outlined
                dense
                readonly
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <bool-select
                v-model="form.isAsap"
                :readonly="readonly"
                :rules="[validationRules.required]"
                outlined
                dense
                label="ASAP"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-show="readonly || !form.isAsap"
                v-model="form.date"
                :rules="!form.isAsap ? [validationRules.required] : []"
                label="Fecha de entrega"
                outlined
                dense
                :readonly="readonly"
                hide-details="auto"
                type="datetime-local"
              />
            </v-col>
            <v-col cols="12" md="6">
              <autocompletes-account
                v-model="filter.account"
                :rules="[validationRules.required, validationRules.resource]"
                label="Cuenta"
                outlined
                dense
                :readonly="readonly"
                hide-details="auto"
                :multiple="false"
                :clearable="!readonly"
              />
            </v-col>
            <v-col cols="6">
              <autocompletes-center
                v-model="form.center"
                :rules="[validationRules.required, validationRules.resource]"
                label="Centro"
                outlined
                dense
                :disabled="!filter.account"
                :readonly="readonly"
                hide-details="auto"
                :multiple="false"
                :clearable="!readonly"
                :account="filter.account"
              />
            </v-col>
            <v-col cols="6">
              <autocompletes-trip-status
                v-if="readonly"
                value="trip.status"
                label="Estado"
                outlined
                dense
                :readonly="readonly"
                hide-details="auto"
                :clearable="!readonly"
              />
            </v-col>
            <v-col cols="6">
              <autocompletes-trip-source
                v-if="readonly"
                :value="trip.source"
                label="Fuente"
                outlined
                dense
                :readonly="readonly"
                hide-details="auto"
                :clearable="!readonly"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="ma-1">
        <v-card-title class="text--disabled">
          Dirección de entrega
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <vuetify-google-autocomplete
                v-if="!readonly"
                id="deliveryAddress"
                v-model="form.deliveryAddress.full_name"
                :rules="[validationRules.required]"
                label="Dirección de entrega"
                autocomplete="off"
                prepend-icon-inner="mdi-map-marker"
                country="es"
                persistent-hint
                outlined
                dense
                required
                :readonly="readonly"
                @placechanged="form.deliveryAddress = $event"
              />
              <v-text-field
                v-else
                v-model="form.deliveryAddress.full_name"
                label="Dirección completa"
                :rules="[validationRules.required]"
                outlined
                dense
                :readonly="true"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="form.deliveryAddress.name"
                label="Calle"
                :rules="[validationRules.required]"
                outlined
                dense
                :disabled="!readonly"
                :readonly="readonly"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="form.deliveryAddress.locality"
                label="Ciudad"
                :rules="[validationRules.required]"
                outlined
                dense
                :disabled="!readonly"
                :readonly="readonly"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="form.deliveryAddress.country"
                label="País"
                :rules="[validationRules.required]"
                outlined
                dense
                :disabled="!readonly"
                :readonly="readonly"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="form.deliveryAddress.postal_code"
                label="Código postal"
                :rules="[validationRules.required]"
                outlined
                dense
                :disabled="!readonly"
                :readonly="readonly"
                hide-details="auto"
                type="number"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model.number="form.deliveryAddress.latitude"
                label="Latitud"
                :rules="[validationRules.required]"
                outlined
                dense
                :disabled="!readonly"
                :readonly="readonly"
                hide-details="auto"
                type="number"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model.number="form.deliveryAddress.longitude"
                label="Longitud"
                :rules="[validationRules.required]"
                outlined
                dense
                :disabled="!readonly"
                :readonly="readonly"
                hide-details="auto"
                type="number"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="ma-1">
        <v-card-title class="text--disabled">
          Cliente
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="form.customer.name"
                label="Nombre"
                :rules="[validationRules.required]"
                outlined
                dense
                :readonly="readonly"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="form.customer.email"
                label="Email"
                :rules="[validationRules.email]"
                outlined
                dense
                :readonly="readonly"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="form.customer.phoneNumber"
                label="Teléfono"
                :rules="[validationRules.required]"
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
          Envío
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.shipment.packageNumber"
                label="Bultos"
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
                v-model="form.shipment.trackingNumber"
                label="Número de seguimiento"
                :rules="[validationRules.required]"
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
          Notas
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="form.notes"
                outlined
                dense
                :readonly="readonly"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card v-if="trip && trip.driver" class="ma-1">
        <v-card-title class="text--disabled">
          Rider
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                :value="trip.driver.firstName"
                label="Nombre"
                outlined
                dense
                readonly
                hide-details="auto"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                :value="trip.driver.lastName"
                label="Apellidos"
                outlined
                dense
                readonly
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
    <v-row v-if="!readonly" class="mt-3">
      <v-col
        cols="12"
        class="text-right"
      >
        <v-btn
          text
          :disabled="submitting"
          to="/trips"
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
  </section>
</template>

<script>
import validation from '~/mixins/validation.js'
export default {
  mixins: [
    validation
  ],
  props: {
    trip: {
      required: false,
      type: Object
    },
    readonly: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    submitting: false,
    valid: true,
    filter: {
      account: null
    },
    form: {
      isAsap: false,
      date: null,
      center: null,
      notes: null,
      deliveryAddress: {
        full_name: null,
        name: null,
        postal_code: null,
        locality: null,
        country: null,
        latitude: null,
        longitude: null
      },
      customer: {
        name: null,
        email: null,
        phoneNumber: null
      },
      shipment: {
        packageNumber: null,
        trackingNumber: null
      }
    }
  }),
  watch: {
    'form.center' (newVal) {
      this.$emit('centerChanged', newVal)
    },
    'form.deliveryAddress.latitude' () {
      this.refreshMapDestination()
    },
    'form.deliveryAddress.longitude' () {
      this.refreshMapDestination()
    }
  },
  mounted () {
    this.form.date = this.$moment().format('YYYY-MM-DDTHH:mm')
  },
  created () {
    if (this.trip) {
      this.form.date = this.$moment(this.trip.date).format('YYYY-MM-DDTHH:mm')
      this.filter.account = this.trip.account
      this.form.center = this.trip.center
      this.form.isAsap = Boolean(this.trip.isAsap)
      this.form.notes = this.trip.notes

      this.form.deliveryAddress.full_name = this.trip.deliveryAddress.name
      this.form.deliveryAddress.name = this.trip.deliveryAddress.street
      this.form.deliveryAddress.postal_code = this.trip.deliveryAddress.postalCode
      this.form.deliveryAddress.locality = this.trip.deliveryAddress.city
      this.form.deliveryAddress.country = this.trip.deliveryAddress.country
      this.form.deliveryAddress.latitude = this.trip.deliveryAddress.geolocation.latitude
      this.form.deliveryAddress.longitude = this.trip.deliveryAddress.geolocation.longitude

      this.form.customer.name = this.trip.customer.name
      this.form.customer.email = this.trip.customer.email
      this.form.customer.phoneNumber = this.trip.customer.phoneNumber

      this.form.shipment.packageNumber = this.trip.shipment.packageNumber
      this.form.shipment.trackingNumber = this.trip.shipment.trackingNumber
    }
  },
  methods: {
    refreshMapDestination () {
      this.$emit('destinationChanged', this.form.deliveryAddress)
    },
    async submit () {
      if (this.readonly || !this.$refs.form.validate()) {
        return
      }

      this.submitting = true
      try {
        const data = {
          ...this.form,
          date: this.form.isAsap ? null : this.form.date,
          center: this.form.center['@id'],
          deliveryAddress: {
            name: this.form.deliveryAddress.full_name,
            street: this.form.deliveryAddress.name,
            postalCode: this.form.deliveryAddress.postal_code,
            city: this.form.deliveryAddress.locality,
            country: 'ES',
            latitude: this.form.deliveryAddress.latitude,
            longitude: this.form.deliveryAddress.longitude
          }
        }

        if (this.trip) {
          await this.$axios.put(this.trip['@id'], data)
        } else {
          await this.$api.trip.post(data)
        }

        this.$toast.success('Viaje añadido con éxito')
        await this.$router.push({ name: 'trips' })
      } catch (e) {
        console.log(e.response)
        this.$toast.error(e.response.data.message)
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
