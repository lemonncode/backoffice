<template>
  <v-navigation-drawer :value="drawer" app dark @input="setDrawer($event)">
    <template #img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>

    <v-list nav>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>
            mdi-account-circle
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-medium"
            v-text="$auth.user.username"
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" dark />

    <v-list dense nav>
      <template v-for="item in navigationItems">
        <v-list-group
          v-if="item.group"
          :key="item.title"
          :prepend-icon="item.icon"
          :value="false"
          no-action
        >
          <template #activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>

          <v-list-item
            v-for="(itemGroup, index) in item.group"
            :key="index"
            :to="itemGroup.to"
            link
          >
            <v-list-item-icon>
              <v-icon small>
                {{ itemGroup.icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ itemGroup.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item v-else :key="item.title" :to="item.to" link exact>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    navigationItems: [
      {
        icon: 'mdi-view-dashboard',
        title: 'Dashboard',
        to: { name: 'index' }
      },
      {
        icon: 'mdi-map-marker-path',
        title: 'Áreas de trabajo',
        group: [
          {
            icon: 'mdi-vector-square-plus',
            title: 'Áreas',
            to: { name: 'work-areas' }
          },
          {
            icon: 'mdi-account-group',
            title: 'Asignaciones',
            to: { name: 'work-areas-assignations' }
          }
        ]
      },
      // {
      //   icon: 'mdi-clipboard-text',
      //   title: 'Asignaciones',
      //   to: { name: 'allocations' }
      // },
      {
        icon: 'mdi-office-building-marker',
        title: 'Centros',
        to: { name: 'centers' }
      },
      {
        icon: 'mdi-account-box-multiple',
        title: 'Cuentas',
        to: { name: 'accounts' }
      },
      {
        icon: 'mdi-truck-fast-outline',
        title: 'Viajes',
        to: { name: 'trips' }
      }
    ]
  }),

  computed: {
    ...mapGetters({
      drawer: 'layout/navigationDrawer'
    })
  },

  methods: {
    ...mapActions({
      setDrawer: 'layout/setNavigationDrawer'
    })
  }
}
</script>
