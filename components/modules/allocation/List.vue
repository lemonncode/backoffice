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
              <v-select
                v-model="employeeFilters.centerId"
                :items="employeeCenters"
                item-text="name"
                item-value="id"
                label="Centros de trabajo"
                outlined
                dense
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="employeeFilters.q"
                label="Nombre/Apellido/DNI"
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
            <allocation-rider-card
              v-for="rider in riders"
              :key="rider.id"
              :rider="rider"
              @remove="removeRiderFromCenter"
            />
          </draggable>
        </v-card>
      </v-col>
      <v-col cols="12" xl="10" lg="9">
        <v-card class="mt-2" :loading="loadingCenters">
          <v-container class="m-4">
            <v-row class="p-3">
              <v-col cols="12" sm="4" class="p-3">
                <v-select
                  v-model="centerFilters.accountId"
                  :items="accounts"
                  item-text="name"
                  item-value="id"
                  label="Cuentas"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-show="centerFilters.accountId"
                  v-model="centerFilters.q"
                  label="Centro"
                  outlined
                  clearable
                  dense
                />
              </v-col>
            </v-row>
          </v-container>
          <v-row class="mx-2">
            <v-col
              v-for="center in centers"
              :key="center.id"
              cols="12"
              xl="3"
              lg="4"
            >
              <v-card>
                <v-card-title>
                  {{ center.name }}
                </v-card-title>
                <v-card-text class="px-0">
                  <draggable
                    :list="riders"
                    :group="{ name: 'riders', pull: false }"
                    class="full-height-layout"
                    style="min-height: 200px"
                  >
                    <allocation-rider-card
                      v-for="rider in riders"
                      :key="rider.id"
                      :rider="rider"
                      @remove="removeRiderFromCenter"
                    />
                  </draggable>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import draggable from 'vuedraggable'
import paginationMixin from '~/mixins/pagination'

export default {
  components: {
    draggable
  },
  mixins: [paginationMixin],
  data () {
    return {
      riders: [],
      accounts: [],
      centers: [],
      centerFilters: {
        q: '',
        accountId: null
      },
      employeeCenters: [],
      employeeFilters: {
        q: null,
        centerId: null
      },
      loadingRiders: false,
      loadingCenters: false
    }
  },
  watch: {
    employeeFilters: {
      handler () {
        this.loadRiders()
      },
      deep: true
    },
    centerFilters: {
      handler () {
        this.loadCenters()
      },
      deep: true
    }
  },
  created () {
    this.loadAccounts()
    this.loadCenters()

    this.loadRiders()
    this.loadEmployeeCenters()
  },
  methods: {
    removeRiderFromCenter (allocationId, centerId) {
      // TODO: CALL API REMOVE RIDER ALLOCATION
      console.log('emit')
    },
    insertRiderToCenter (evt, centerId) {
      // TODO: CALL API INSERT RIDER ALLOCATION
    },
    loadRiders () {
      this.loadingRiders = true
      // TODO: API FOR GET RIDERS
      this.riders = [
        {
          full_name: 'Juan Fernandez Rodriguez',
          document_number: '000000A',
          vehicle: 'bike',
          hasAllocationId: true
        },
        {
          full_name: 'Antonio Arenas Hernandez',
          document_number: '09999D',
          vehicle: 'moto',
          hasAllocationId: false

        }
      ]
      this.loadingRiders = false
    },
    loadCenters () {
      this.loadingCenters = true
      // TODO: API FOR GET CENTERS
      this.centers = [
        { id: 1, name: 'Madrid' },
        { id: 2, name: 'Barcelona' },
        { id: 3, name: 'Leganés' },
        { id: 4, name: 'Palma' }
      ]
      this.loadingCenters = false
    },
    loadAccounts () {
      // TODO: API FOR GET ACCOUNTS
      this.accounts = [
        { name: 'LGF', id: 1 },
        { name: 'Test', id: 2 }
      ]
    },
    loadEmployeeCenters () {
      this.employeeCenters = [
        { id: 1, name: 'Auro' },
        { id: 2, name: 'Goiko' },
        { id: 3, name: 'Temporal' },
        { id: 4, name: 'Test' }
      ]
    }
  }
}
</script>
