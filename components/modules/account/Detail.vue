<template>
  <section>
    <v-breadcrumbs :items="breadcrumbs" />

    <v-sheet v-if="loading">
      <v-skeleton-loader type="card" />
    </v-sheet>
    <v-container v-else class="px-6 mb-12" fluid>
      <v-row>
        <v-col cols="12" md="12">
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
              <account-form :account="account" :readonly="true" />
            </v-tab-item>

            <v-tab-item>
              <account-trips-list :account="account" :readonly="true" />
            </v-tab-item>
          </v-tabs>
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
  data () {
    return {
      loading: false,
      account: null

    }
  },
  computed: {
    breadcrumbs () {
      return [
        {
          text: 'Dashboard',
          link: true,
          exact: true,
          disabled: false,
          to: { name: 'index' }

        },
        {
          text: 'Cuentas',
          link: true,
          exact: true,
          disabled: false,
          to: { name: 'accounts' }

        },
        {
          text: 'Detalle',
          link: true,
          exact: true,
          disabled: true,
          to: { name: 'accounts-id' }

        }
      ]
    },
    tabs () {
      return [
        { code: 'center_data', name: 'centros de cuenta' },
        { code: 'trips_data', name: 'viajes de cuenta' }
      ]
    }

  },
  async created () {
    await this.loadAccount()
  },
  methods: {
    async loadAccount () {
      this.loading = true

      try {
        const response = await this.$api.account.get(this.resource)
        this.account = response.data
        console.log(response)
      } catch (e) {
        this.$toast.error(e)
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async loadCentersbyAccount () {
      this.loading = true

      try {
        const response = await this.$api.center.get(this.resource)
        this.account = response.data
        console.log(response)
      } catch (e) {
        this.$toast.error(e)
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async loadTripsbyAccount () {
      this.loading = true

      try {
        const response = await this.$api.trip.get(this.resource)
        this.account = response.data
        console.log(response)
      } catch (e) {
        this.$toast.error(e)
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}

</script>
