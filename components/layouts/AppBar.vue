<template>
  <v-app-bar
    dark
    absolute
    app
    flat
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      light
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon>
        mdi-view-headline
      </v-icon>
    </v-btn>

    <v-toolbar-title class="hidden-sm-and-down font-weight-light" v-text="title" />

    <v-spacer />

    <v-btn class="ml-2" min-width="0" text @click="$router.push({ name: 'index' })">
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-menu offset-y>
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>
            mdi-account
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$auth.logout()">
          <v-list-item-action>
            <v-icon color="primary">
              mdi-exit-to-app
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { titles } from '~/constants/layout'

export default {
  computed: {
    ...mapGetters({
      drawer: 'layout/navigationDrawer'
    }),

    title () {
      return titles[this.$route.name] ?? ''
    }
  },

  methods: {
    ...mapMutations({
      setDrawer: 'layout/setNavigationDrawer'
    })
  }
}
</script>
