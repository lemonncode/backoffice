<template>
  <v-dialog v-model="dialog" max-width="1000" persistent>
    <template #activator="{ on, attrs }">
      <v-btn
        :color="isNew ? 'primary' : isViewMode ? 'primary' : 'secondary'"
        :bottom="isNew"
        :right="isNew"
        :fixed="isNew"
        :x-small="!isNew"
        :depressed="!isNew"
        fab
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small>
          {{ isNew ? 'mdi-plus' : isViewMode ? 'mdi-eye' : 'mdi-pencil' }}
        </v-icon>
      </v-btn>
    </template>

    <v-sheet v-if="loading">
      <v-skeleton-loader type="card" />
    </v-sheet>

    <v-card v-else>
      <v-card-title class="text-h5">
        {{ isNew ? 'Crear' : isViewMode ? 'Mostrando' : 'Editando' }} un centro de distribución
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" :disabled="isViewMode">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.name"
                prepend-inner-icon="mdi-account"
                label="Nombre"
                outlined
                required
              />
            </v-col>
          </v-row>
          <v-subheader>Dirección</v-subheader>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.address.street"
                prepend-inner-icon="mdi-road-variant"
                label="Calle"
                outlined
                required
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.address.postalCode"
                prepend-inner-icon="mdi-mailbox"
                label="Código Postal"
                outlined
                required
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.address.city"
                prepend-inner-icon="mdi-city-variant"
                label="Ciudad"
                outlined
                required
              />
            </v-col>

            <v-col cols="12" sm="6">
              <country-select
                id="country-select"
                v-model="form.address.country"
                placeholder="Seleccionar pais"
                :rules="[validationRules.required]"
              />
              <!--country-select
                v-model="form.address.country"
                :rules="[validationRules.required]"
                prepend-inner-icon="mdi-google-maps"
                required
              /-->
            </v-col>
          </v-row>
        </v-form>

        <v-snackbar v-model="error" color="error" transition="slide-y-transition">
          {{ errorMessage }}

          <template #action="{ attrs }">
            <v-btn
              text
              outlined
              v-bind="attrs"
              @click="error = false"
            >
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="submitting"
          @click="close"
        >
          Cancelar
        </v-btn>
        <v-btn
          v-if="isViewMode"
          color="secondary"
          @click="changeMode"
        >
          Editar
          <v-icon small right>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          v-else
          color="primary"
          :loading="submitting"
          :disabled="!valid"
          @click="submit"
        >
          Guardar
          <v-icon small right>
            mdi-content-save
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  components: {
  },

  props: {
    resource: {
      required: false,
      type: String
    },
    isNew: {
      required: false,
      type: Boolean,
      default: false
    },
    mode: {
      required: true,
      type: String,
      default: 'show'
    }
  },

  data () {
    return {
      dialog: false,
      loading: false,
      valid: true,
      submitting: false,
      error: false,
      errorMessage: 'Ha ocurrido un error',
      modeProp: this.mode,
      form: {
        name: null,
        address: {
          street: null,
          city: null,
          country: null,
          postalCode: null
        }
      }
    }
  },

  computed: {
    isViewMode () {
      return this.modeProp === 'show'
    }
  },

  watch: {
    dialog (value) {
      if (this.resource !== null && value && !this.isNew) {
        this.loadResource()
      }
    }
  },

  methods: {
    clearForm () {
      this.form.name = null
      this.form.address.street = null
      this.form.address.city = null
      this.form.address.country = null
      this.form.address.postalCode = null
    },

    normalizeForm (data) {
      this.form.name = data.name
      this.form.address.street = data.address.street
      this.form.address.city = data.address.city
      if (typeof data.address.country === 'object') {
        this.form.address.country = data.address.country.countryShortCode
      } else {
        this.form.address.country = data.address.country
      }
      this.form.address.postalCode = data.address.postalCode
    },

    changeMode () {
      this.modeProp = 'edit'
    },

    async loadResource () {
      this.loading = true

      try {
        const data = await this.$axios.get(this.resource)
        this.normalizeForm(data.data)
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.loading = false
      }
    },

    async submit () {
      this.submitting = true
      this.error = false
      this.normalizeForm(this.form)

      try {
        await this.$axios({
          method: this.isNew ? 'POST' : 'PUT',
          url: this.resource,
          data: this.form
        })
        this.$emit('updated')
        this.close()
      } catch (error) {
        this.error = true
        if (error.response) {
          this.errorMessage = error.response.data['hydra:description']
        } else {
          this.errorMessage = error.message
        }
      } finally {
        this.submitting = false
        if (!this.error) {
          this.clearForm()
        }
      }
    },

    close () {
      this.dialog = false
      this.modeProp = this.mode
    }

  }
}
</script>
