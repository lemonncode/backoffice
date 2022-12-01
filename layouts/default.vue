<template>
  <v-app>
    <app-bar />
    <app-navigation-drawer />
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '~/components/layouts/AppBar'
import AppNavigationDrawer from '~/components/layouts/AppNavigationDrawer'

export default {
  components: {
    AppBar,
    AppNavigationDrawer
  }
}
</script>
