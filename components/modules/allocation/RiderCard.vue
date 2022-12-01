<template>
  <v-card outlined selectable hover max-width="400" class="ma-4">
    <v-container fluid fill-height>
      <v-row>
        <v-col sm="12">
          {{ rider.full_name }}
        </v-col>
        <v-col sm="8">
          {{ rider.document_number }}
        </v-col>
        <v-col>
          <v-btn v-if="rider.vehicle === 'bike'" icon>
            <v-icon dark>
              mdi-bike
            </v-icon>
          </v-btn>
          <v-btn v-if="rider.vehicle === 'moto'" icon>
            <v-icon dark>
              mdi-motorbike
            </v-icon>
          </v-btn>
          <!--v-if Rider has  allocation-->

          <v-btn
            v-if="rider.hasAllocationId == true"
            icon
            color="error"
            @click="$emit('remove')"
          >
            <v-icon dark>
              mdi-trash-can-outline
            </v-icon>
          </v-btn>
          <!--v-if-->
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: ['rider', 'center']

}

</script>

<style></style>
