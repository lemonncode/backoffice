<template>
  <v-card outlined selectable hover max-width="400" class="ma-4">
    <v-container fluid fill-height>
      <v-row>
        <v-col sm="3" class="pr-0">
          <v-row>
            <v-col cols="12" class="text-center">
              <v-avatar size="40">
                <img
                  :src="rider.avatar_url ? rider.avatar_url : defaultAvatarUrl"
                  alt="avatar"
                >
              </v-avatar>
            </v-col>
          </v-row>
        </v-col>
        <v-col sm="9">
          <v-row>
            <v-col class="pb-0 pr-0">
              {{ rider.firstName }} {{ rider.lastName }}
            </v-col>
            <v-col
              v-if="assignation"
              class="ml-auto pt-1 pr-1 pb-0 text-right"
              sm="3"
            >
              <v-btn
                icon
                outlined
                x-small
                color="error"
                @click="$emit('remove', assignation)"
              >
                <v-icon x-small>
                  mdi-account-minus
                </v-icon>
              </v-btn>
            </v-col>
            <v-col sm="12" class="py-0">
              <small>{{ rider.documentNumber }}</small>
              <v-icon
                v-if="rider.vehicle"
                dense
                class="pl-3"
                color="primary"
              >
                {{ rider.vehicle.includes('motorbike') ? 'mdi-motorbike' : 'mdi-bicycle' }}
              </v-icon>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="rider.center" sm="12" class="text-center pt-0">
          <small>{{ rider.center.name }}</small>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    rider: {
      required: true,
      type: Object
    },
    assignation: {
      required: false,
      type: Object
    }
  },
  data: () => ({
    defaultAvatarUrl: 'https://www.w3schools.com/w3images/avatar3.png'
  })
}
</script>
