<template>
  <v-form :readonly="!editMode" :disabled="!editMode">
    <v-container fluid>
      <v-row dense>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h5">
              Datos Generales
              <v-spacer />
              <shipment-status-label v-model="shipment.status" :extended="true" />
              <v-chip
                class="ml-2"
                :color="shipment.complete ? 'success' : 'error'"
                label
                text-color="white"
              >
                <v-icon>
                  {{ shipment.complete ? 'mdi-check' : 'mdi-cancel' }}
                </v-icon>
                Completo
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <v-combobox
                    v-model="shipmentType"
                    :items="typeShipmentTypes"
                    label="Tipo"
                    outlined
                    :readonly="!editMode"
                    :clearable="editMode"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <distributor-select v-model="distributor" :read-only="!editMode" />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="shipment.date"
                    type="date"
                    label="Fecha"
                    outlined
                    :clearable="editMode"
                    :readonly="!editMode"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.trackingNumber"
                    prepend-inner-icon="mdi-map-search-outline"
                    label="Numero de seguimiento"
                    :readonly="!editMode"
                    :clearable="editMode"
                    outlined
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.referenceNumber"
                    prepend-inner-icon="mdi-map-marker-distance"
                    label="Numero de referencia"
                    :readonly="!editMode"
                    :clearable="editMode"
                    outlined
                    required
                  />
                </v-col>
                <v-expand-transition>
                  <v-row v-if="!editMode">
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="shipment.numberOfPackages"
                        prepend-inner-icon="mdi-package-variant-closed"
                        label="Numero de paquetes"
                        readonly
                        outlined
                      />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="shipment.weight"
                        prepend-inner-icon="mdi-weight-kilogram"
                        label="Peso"
                        outlined
                        readonly
                      />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="shipment.numberOfDeliveryAttempts"
                        readonly
                        prepend-inner-icon="mdi-truck-delivery"
                        label="Intentos de entrega"
                        outlined
                      />
                    </v-col>
                  </v-row>
                </v-expand-transition>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- REMITENTE -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-h5">
              Remitente
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.origin.name"
                    prepend-inner-icon="mdi-account"
                    label="Nombre"
                    outlined
                    required
                  />
                </v-col>
              </v-row>
              <v-subheader>Dirección</v-subheader>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.origin.street"
                    prepend-inner-icon="mdi-road-variant"
                    label="Calle"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.origin.city"
                    prepend-inner-icon="mdi-city-variant"
                    label="Ciudad"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="shipment.origin.postalCode"
                    prepend-inner-icon="mdi-mailbox"
                    label="Código Postal"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12" sm="4">
                  <country-select
                    id="country-select"
                    v-model="shipment.origin.country"
                    placeholder="Seleccionar pais"
                    :rules="[validationRules.required]"
                  />
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="shipment.origin.phoneNumber"
                    prepend-inner-icon="mdi-phone"
                    label="Teléfono"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="shipment.origin.notes"
                    prepend-inner-icon="mdi-note"
                    label="Observaciones"
                    outlined
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-h5">
              Destinatario
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.destination.name"
                    prepend-inner-icon="mdi-account"
                    label="Nombre"
                    outlined
                    required
                  />
                </v-col>
              </v-row>
              <v-subheader>Dirección</v-subheader>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.destination.street"
                    prepend-inner-icon="mdi-road-variant"
                    label="Calle"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.destination.city"
                    prepend-inner-icon="mdi-city-variant"
                    label="Ciudad"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="shipment.destination.postalCode"
                    prepend-inner-icon="mdi-mailbox"
                    label="Código Postal"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12" sm="4">
                  <country-select
                    id="country-select"
                    v-model="shipment.destination.country"
                    placeholder="Seleccionar pais"
                    :rules="[validationRules.required]"
                  />
                </v-col>

                <v-col cols="12" sm="4">
                  <zone-select
                    v-model="shipment.destination.zone"
                    placeholder="Seleccionar zona"
                    :rules="[validationRules.required]"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.destination.phoneNumber"
                    prepend-inner-icon="mdi-phone"
                    label="Teléfono"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shipment.destination.email"
                    prepend-inner-icon="mdi-email"
                    label="Email"
                    outlined
                    required
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="shipment.destination.notes"
                    prepend-inner-icon="mdi-note"
                    label="Observaciones"
                    outlined
                  />
                </v-col>

                <!--GmapMap
                  :center="{lat: shipment.destination.latitude, lng: shipment.destination.longitude}"
                  :zoom="7"
                  map-type-id="terrain"
                  style="height: 300px"
                /-->
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import DistributorSelect from '../../distributors/DistributorSelect.vue'
import ShipmentStatusLabel from '../ShipmentStatusLabel.vue'
import { typeShipmentTypes, getTypeShipmentType } from '@/constants/shipment_types'

export default {
  components: {
    DistributorSelect,
    ShipmentStatusLabel
  },
  mixins: [
  ],
  props: {
    value: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  data (vm) {
    return {
      editMode: this.edit,
      typeShipmentTypes,
      shipment: vm.value,
      shipmentType: getTypeShipmentType(vm.value.type),
      distributor: vm.value.distributor
    }
  },

  watch: {
    edit (newValue) {
      this.editMode = newValue
    },
    shipmentType (newValue) {
      this.shipment.type = newValue.value
    },
    distributor (newValue) {
      this.shipment.distributor = newValue['@id']
    }
  },

  methods: {
    loadItems () {
    }
  }
}
</script>
