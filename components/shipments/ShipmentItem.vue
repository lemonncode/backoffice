<template>
  <div>
    <v-toolbar
      dark
      flat
      dense
    >
      <v-btn icon title="Volver" @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-fade-transition>
        <v-toolbar-title class="text-truncate" v-if="!editMode">
          Expedicion {{ shipment.uuid }}
        </v-toolbar-title>
      </v-fade-transition>
      <v-spacer />
      <v-scroll-x-transition mode="out-in">
        <div v-if="!editMode" key="icons">
          <v-btn v-if="!editMode" key="issueBtn" icon title="Añadir Incidencia">
            <v-icon>mdi-alert-plus</v-icon>
          </v-btn>
          <v-btn  key="editBtn" icon title="Editar" @click="editMode = true">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
        <div v-if="editMode" key="buttons">
        <v-btn v-if="editMode" key="saveBtn" color="success" class="mr-2" @click="save()">
          Guardar
        </v-btn>
        <v-btn v-if="editMode" key="cancelBtn" light @click="editMode = false">
          Cancelar
        </v-btn>
      </div>
      </v-scroll-x-transition>
      <template #extension>
        <v-tabs v-model="tab">
          <v-tab key="General">
            General
          </v-tab>
          <v-tab key="package">
            Paquetes
          </v-tab>
          <v-tab key="note">
            Notas
          </v-tab>
          <v-tab key="files">
            Documentos
          </v-tab>
          <v-tab key="routes">
            Rutas
          </v-tab>
          <v-tab key="issues">
            Incidencias
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <!-- Tabs -->
    <v-tabs-items v-model="tab">
      <v-tab-item key="General">
        <shipment-general-tab v-model="shipment" :edit="editMode" />
      </v-tab-item>
      <v-tab-item key="package">
        <shipment-package-tab />
      </v-tab-item>
      <v-tab-item key="files">
        Item Three
      </v-tab-item>
    </v-tabs-items>
    <!--incidence-add-dialog @added="loadItems" /-->
  </div>
</template>

<script>
import ShipmentPackageTab from './tabs/ShipmentPackageTab.vue'

export default {
  components: {
    ShipmentPackageTab
  },
  mixins: [
  ],
  props: {
    value: {
      required: true
    }
  },

  data: vm => (
    {
      tab: 'General',
      editMode: false,
      shipment: vm.value
    }
  ),

  watch: {
  },

  methods: {
    save () {
      console.log('guardando shipment to API')
      console.log(this.shipment)
      // this.$axios.
      this.editMode = false
    }
  }
}
</script>
