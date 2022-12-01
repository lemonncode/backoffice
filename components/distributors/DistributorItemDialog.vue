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
        {{ isNew ? 'Crear' : isViewMode ? 'Mostrando' : 'Editando' }} un distribuidor
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
            <v-col cols="12" sm="6">
              <distribution-center-select
                v-model="form.configuration.distributionCenter"
                :rules="[validationRules.required]"
                prepend-inner-icon="mdi-office-building-marker"
                required
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-checkbox v-model="form.configuration.smsNotifiable" dense label="Notificaciones SMS" />
              <v-checkbox v-model="form.configuration.emailNotifiable" dense label="Notificaciones por mail" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-checkbox v-model="form.configuration.trackeable" dense label="Seguimiento" />
              <v-checkbox v-model="form.configuration.reportable" dense label="Api externa" />
            </v-col>
          </v-row>
        </v-form>

        <v-expand-transition>
          <div v-show="address && isViewMode">
            <h3>
              <v-icon small>
                mdi-map-marker
              </v-icon> Origen de las expediciones
            </h3>
            <v-row>
              <v-col cols="12" sm="6">
                <b>Dirección:</b> {{ address.street }}
              </v-col>
              <v-col cols="12" sm="6">
                <b>Ciudad:</b> {{ address.city }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <b>Código postal:</b> {{ address.postalCode }}
              </v-col>
              <v-col cols="12" sm="6">
                <b>País:</b> {{ address.country }}
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>

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
      address: {
        street: null,
        postalCode: null,
        city: null,
        country: null
      },
      form: {
        name: null,
        configuration: {
          smsNotifiable: false,
          emailNotifiable: false,
          trackeable: false,
          reportable: false,
          distributionCenter: null
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
      this.form.configuration.smsNotifiable = false
      this.form.configuration.emailNotifiable = false
      this.form.configuration.trackeable = false
      this.form.configuration.reportable = false
    },

    normalizeForm (data) {
      this.form.name = data.name
      this.form.configuration.smsNotifiable = data.configuration.smsNotifiable
      this.form.configuration.emailNotifiable = data.configuration.emailNotifiable
      this.form.configuration.trackeable = data.configuration.trackeable
      this.form.configuration.reportable = data.configuration.reportable

      if (typeof data.configuration.distributionCenter === 'object') {
        this.address = data.configuration.distributionCenter.address
        this.form.configuration.distributionCenter = data.configuration.distributionCenter['@id']
      }
    },

    changeMode () {
      this.modeProp = 'edit'
    },

    async loadResource () {
      this.loading = true

      try {
        const data = await this.$axios.get('/api' + this.resource)
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
          url: '/api' + this.resource,
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
