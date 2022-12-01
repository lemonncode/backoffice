<template>
  <dialogs-confirm @confirm="submit">
    <template #button="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        color="error"
        :loading="submitting"
        v-on="on"
      >
        Eliminar
      </v-btn>
    </template>
  </dialogs-confirm>
</template>

<script>
export default {
  props: {
    resource: {
      required: true,
      type: String
    },
    fab: {
      required: false,
      type: Boolean,
      default: false
    },
    size: {
      required: false,
      type: Number
    },
    entity: {
      required: false,
      type: String
    }
  },

  data: () => ({
    submitting: false
  }),

  methods: {
    async submit () {
      this.submitting = true

      try {
        if (this.entity) {
          await this.$api[this.entity].delete(this.resource)
        } else {
          await this.$axios.delete(this.resource)
        }
        this.$emit('deleted')
      } catch (exception) {
        if (exception.response.data) {
          this.$toast.error(exception.response.data['hydra:description'])
        } else {
          this.$toast.error(exception)
        }
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
