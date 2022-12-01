<template>
  <v-container class="px-6 mb-12" fluid>
    <v-row>
      <v-col cols="12" xl="2" lg="3">
        <v-card class="mt-2 pb-2" :loading="loadingRiders">
          <v-toolbar color="grey darken-1" dense dark>
            <v-col cols="10">
              Riders
            </v-col>
          </v-toolbar>
          <v-row class="px-3 py-3">
            <v-col cols="12" sm="12">
              <autocompletes-core-center
                v-model="riderFilters['employee.center.id']"
                hide-details="auto"
                outlined
                clearable
                dense
                label="Centros de trabajo"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="riderFilters.query"
                label="Nombre/Apellido/DNI"
                hide-details="auto"
                outlined
                clearable
                dense
              />
            </v-col>
          </v-row>
          <draggable
            :list="riders"
            :group="{ name: 'riders', pull: 'clone', put: false }"
            class="full-height-layout"
            style="min-height: 200px"
          >
            <work-area-rider-card
              v-for="rider in riders"
              :id="rider['@id']"
              :key="rider.id"
              :rider="rider"
            />
          </draggable>
          <v-overlay :value="loadingRiders" :absolute="true">
            <v-progress-circular indeterminate size="30" />
          </v-overlay>
        </v-card>
        <v-pagination
          v-model="ridersPaginationOptions.page"
          :length="ridersPaginationOptions.totalItems"
          :total-visible="5"
          class="rider-pagination"
          @input="loadRiders"
        />
      </v-col>
      <v-col cols="12" xl="10" lg="9">
        <v-card class="mt-2" :loading="loadingWorkAreas">
          <v-toolbar color="grey darken-1" dense dark>
            <v-col cols="10">
              Áreas
            </v-col>
          </v-toolbar>
          <v-container class="m-4">
            <v-row class="p-3">
              <v-col cols="8" sm="4" class="p-3">
                <v-text-field
                  v-model="workAreaFilters.name"
                  label="Nombre"
                  hide-details="auto"
                  outlined
                  clearable
                  dense
                />
              </v-col>
              <v-col cols="4" sm="2">
                <bool-select
                  v-model="workAreaFilters.status"
                  :value="workAreaFilters.status"
                  outlined
                  label="Activo"
                  hide-details="auto"
                  clearable
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="workAreaFilters.riderQuery"
                  label="Nombre/Apellidos/DNI del rider"
                  hide-details="auto"
                  outlined
                  clearable
                  dense
                />
              </v-col>
            </v-row>
          </v-container>
          <v-overlay :value="loadingWorkAreas" :absolute="true">
            <v-progress-circular indeterminate size="30" />
          </v-overlay>
          <v-row v-if="workAreas" class="mx-2">
            <v-col
              v-for="workArea in workAreas"
              :key="workArea.id"
              cols="12"
              xl="3"
              lg="4"
            >
              <v-card height="100%">
                <v-card-title>
                  <v-icon
                    :color="workArea.status ? 'success' : 'red'"
                    x-small
                    class="mr-1"
                  >
                    mdi-circle
                  </v-icon>
                  {{ workArea.name }}
                </v-card-title>
                <v-card-subtitle class="pa-0">
                  <v-expansion-panels flat>
                    <v-expansion-panel>
                      <v-expansion-panel-header class="text-caption">
                        Mostrar mapa
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <work-area-map
                          :areas="workArea.zones.map(zones => (zones.map(zone => ({lat: zone.latitude, lng: zone.longitude}))))"
                          :map-height="'150px'"
                          :map-zoom="9"
                          :editable="false"
                        />
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-subtitle>
                <v-card-text
                  v-if="assignationsByWorkArea[workArea.id]"
                  class="px-0"
                >
                  <v-container class="pa-0 text-center">
                    <small>
                      <v-icon x-small>
                        mdi-cursor-pointer
                      </v-icon>
                      Arrastre aqui el rider que desee asignar
                    </small>
                  </v-container>
                  <draggable
                    :list="assignationsByWorkArea[workArea.id].riders"
                    :group="{ name: 'riders', pull: false }"
                    class="full-height-layout"
                    style="min-height: 200px"
                    @add="(evt) => insertRiderToArea(evt, workArea)"
                  >
                    <work-area-rider-card
                      v-for="assignation in assignationsByWorkArea[workArea.id]"
                      :key="assignation.id"
                      :rider="assignation.rider"
                      :assignation="assignation"
                      @remove="removeRiderFromArea"
                    />
                  </draggable>
                  <v-pagination
                    v-if="assignationPaginationOptions[workArea.id] && assignationPaginationOptions[workArea.id].totalItems > 1"
                    v-model="assignationPaginationOptions[workArea.id].page"
                    :length="assignationPaginationOptions[workArea.id].totalItems"
                    :total-visible="5"
                    class="rider-pagination"
                    @input="loadAssignationsByArea(workArea.id)"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-card v-else class="mx-2" flat>
            <v-card-text cols="12">
              No se han encontrado zonas de trabajo
            </v-card-text>
          </v-card>
        </v-card>
        <v-container>
          <v-pagination
            v-if="workAreasPaginationOptions.totalItems > 1"
            v-model="workAreasPaginationOptions.page"
            :length="workAreasPaginationOptions.totalItems"
            @input="loadWorkAreas"
          />
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import draggable from 'vuedraggable'
import qs from 'qs'
import paginationMixin from '~/mixins/pagination'

export default {
  components: {
    draggable
  },
  mixins: [paginationMixin],
  data: () => ({
    riders: [],
    loadingRiders: false,
    riderFilters: {
      query: null,
      'employee.center.id': null
    },
    ridersPaginationOptions: {
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
      order: {
        firstName: 'asc'
      }
    },
    workAreas: [],
    loadingWorkAreas: false,
    workAreaFilters: {
      name: null,
      riderQuery: null,
      status: true
    },
    workAreasPaginationOptions: {
      page: 1,
      itemsPerPage: 8,
      totalItems: 0,
      order: {
        name: 'asc'
      }
    },
    assignationsByWorkArea: {},
    assignationPaginationOptions: [],
    defaultAssignationPaginationOptions: {
      page: 1,
      itemsPerPage: 5,
      totalItems: 0,
      order: {
        firstName: 'asc'
      }
    }
  }),
  watch: {
    riderFilters: {
      handler () {
        this.loadRiders()
      },
      deep: true
    },
    workAreaFilters: {
      handler () {
        this.loadWorkAreas()
      },
      deep: true
    }
  },
  created () {
    this.loadRiders()
    this.loadWorkAreas()
  },
  methods: {
    async removeRiderFromArea (assignation) {
      this.loadingWorkAreas = true
      const self = this

      try {
        await this.$api.workAreaRider.delete(assignation['@id']).then(function () {
          self.loadAssignationsByArea(assignation.zone.id)
        })
      } catch (e) {
        console.log(e)
        this.$toast.error(e.response.data.message)
      } finally {
        this.loadingWorkAreas = false
      }
    },
    async insertRiderToArea (evt, area) {
      this.loadingWorkAreas = true
      const self = this

      try {
        await this.$api.workAreaRider.post({
          rider: evt.item.getAttribute('id'),
          workingZone: area['@id']
        }).then(function () {
          self.loadAssignationsByArea(area.id)
        })
      } catch (e) {
        console.log(e)
        this.$toast.error(e.response.data.message)
      } finally {
        this.loadingWorkAreas = false
      }
    },
    async loadAssignationsByArea (workAreaId) {
      this.loadingWorkAreas = true
      const paginationOptions =
        this.assignationPaginationOptions[workAreaId]
          ? this.assignationPaginationOptions[workAreaId]
          : { ...this.defaultAssignationPaginationOptions }

      const params = this.getParameters({ 'workingZone.id': workAreaId }, paginationOptions)
      try {
        const response = await this.$api.workAreaRider.cget({
          params,
          paramsSerializer: (params) => {
            return qs.stringify(params)
          }
        })

        this.$set(this.assignationsByWorkArea, workAreaId, response.data['hydra:member'])
        paginationOptions.totalItems = Math.ceil(response.data['hydra:totalItems'] / paginationOptions.itemsPerPage)
        this.$set(this.assignationPaginationOptions, workAreaId, paginationOptions)
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingWorkAreas = false
      }
    },
    async loadRiders () {
      this.loadingRiders = true
      const params = this.getParameters(this.riderFilters, this.ridersPaginationOptions)

      try {
        const response = await this.$api.rider.cget({
          params,
          paramsSerializer: (params) => {
            return qs.stringify(params)
          }
        })

        this.riders = response.data['hydra:member']
        this.ridersPaginationOptions.totalItems = Math.ceil(response.data['hydra:totalItems'] / this.ridersPaginationOptions.itemsPerPage)
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingRiders = false
      }
    },
    async loadWorkAreas () {
      this.loadingWorkAreas = true
      const params = this.getParameters(this.workAreaFilters, this.workAreasPaginationOptions)
      const self = this
      let loadingAssignations = false
      try {
        const response = await this.$api.workArea.cget({
          params,
          paramsSerializer: (params) => {
            return qs.stringify(params)
          }
        })

        this.workAreas = response.data['hydra:member']
        this.workAreasPaginationOptions.totalItems = Math.ceil(response.data['hydra:totalItems'] / this.workAreasPaginationOptions.itemsPerPage)
        this.workAreas.forEach(function (element) {
          self.loadAssignationsByArea(element.id)
          loadingAssignations = true
        })
      } catch (e) {
        console.log(e)
      } finally {
        if (!loadingAssignations) {
          this.loadingWorkAreas = false
        }
      }
    }
  }
}
</script>

<style lang="scss" >
 .rider-pagination {
   width: auto;
    button {
      colo: red;
      height: 25px !important;
      min-width: 25px !important;
      margin: 1px;
    }
 }
</style>
