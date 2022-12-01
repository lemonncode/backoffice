<template>
  <v-dialog
    v-model="dialog"
    persistent
    :max-width="dialogWidth"
  >
    <template #activator="{ on }">
      <slot name="button" :on="on" />
    </template>
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" class="mt-6 grey--text lighten-2" align="center">
          <v-icon size="50" color="grey lighten-2">
            mdi-alert-box
          </v-icon>
        </v-col>
      </v-row>
      <v-card-title class="text-center mb-2 pre-formatted">
        {{ message }}
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="ma-2"
          color="red darken-1"
          outlined
          @click="dialog = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="ma-2"
          color="green darken-1"
          outlined
          @click="$emit('confirm');dialog = false"
        >
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    message: {
      required: false,
      type: String,
      default: '¿Esta seguro de realizar esta acción?'
    },
    dialogWidth: {
      required: false,
      type: Number,
      default: 400
    }
  },
  data: () => ({
    dialog: false
  })
}
</script>
<style>
  .pre-formatted {
    white-space: pre;
  }
</style>
