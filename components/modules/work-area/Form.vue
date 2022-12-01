<template>
  <section>
    <v-breadcrumbs :items="breadcrumbs" />

    <v-sheet v-if="loading">
      <v-skeleton-loader type="card" />
    </v-sheet>
    <v-container v-else class="px-6 mb-12" fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-form ref="form" v-model="valid">
            <v-card class="ma-1">
              <v-card-text>
                <v-text-field
                  v-model="form.name"
                  label="Nombre"
                  :rules="[validationRules.required]"
                  outlined
                  dense
                  :readonly="readonly"
                  hide-details="auto"
                />
                <v-switch
                  v-model="form.status"
                  class="mt-4"
                  label="Activo"
                />
                <v-divider class="mt-3" />
                <p class="my-2 title">
                  Centros asociados
                </p>
                <v-row v-if="!readonly">
                  <v-col md="9">
                    <autocompletes-center
                      v-model="centerFilter"
                      :rules="[validationRules.resource]"
                      label="Seleccione un centro"
                      outlined
                      dense
                      :readonly="readonly"
                      hide-details="auto"
                      :multiple="false"
                      :clearable="!readonly"
                      :show-account="true"
                      :filter-exclude-items="form.centers"
                    />
                  </v-col>
                  <v-col md="2">
                    <v-btn
                      color="primary"
                      dense
                      elevation="0"
                      :disabled="!centerFilter"
                      @click="addCenter(centerFilter)"
                    >
                      Añadir
                    </v-btn>
                  </v-col>
                </v-row>
                <v-list>
                  <v-list-item
                    v-for="(center, loopIndex) in form.centers"
                    v-if="center.id"
                    :key="center.id"
                    style="border-bottom: 1px solid lightgray"
                  >
                    <v-list-item-avatar>
                      <v-chip color="red" dark>
                        {{ loopIndex+1 }}
                      </v-chip>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      {{ center.account.name }} | {{ center.name }}
                    </v-list-item-content>
                    <v-list-item-icon v-if="!readonly">
                      <v-icon @click="removeCenter(center)">
                        mdi-close
                      </v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-form>
          <v-row v-if="!readonly" class="mt-3">
            <v-col
              v-if="workArea"
              cols="4"
              class="text-left"
            >
              <buttons-delete :resource="resource" :entity="'workArea'" @deleted="remove" />
            </v-col>
            <v-col
              class="text-right"
            >
              <v-btn
                text
                :disabled="submitting"
                to="/trips"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                :loading="submitting"
                @click="submit"
              >
                Guardar
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <work-area-map
            v-model="form.zones"
            :centers="form.centers"
            :areas="initialAreas"
            :editable="!readonly"
          />
          <v-row>
            <v-col align="right">
              <v-dialog
                v-model="mapDialog"
                persistent
                max-width="900"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    class="mt-2"
                    dense
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left>
                      mdi-information-outline
                    </v-icon>
                    Instrucciones del mapa
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="title">
                    <v-icon size="20" color="grey lighten-2">
                      mdi-map
                    </v-icon>
                    <span class="ml-2">Instrucciones del mapa</span>
                  </v-card-title>
                  <v-card-text class="pb-0">
                    <v-list>
                      <v-list-item>
                        <v-list-item-icon
                          class="mr-2 mr-md-4"
                        >
                          <v-chip>1</v-chip>
                        </v-list-item-icon>
                        <v-list-item-content>
                          Busca los centros de interés y añadelos al listado de centros asociados, esto hará que se pueda visualizar el mapa tanto los centros como sus áreas asociadas
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-icon
                          class="mr-2 mr-md-4"
                        >
                          <v-chip>2</v-chip>
                        </v-list-item-icon>
                        <v-list-item-content>
                          Dibuja y edita en el mapa las zonas
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-container>
                      <video width="100%" height="auto" controls autoplay>
                        <source src="/videos/areaMapInstructions.mov">
                      </video>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      class="ma-2"
                      outlined
                      @click="mapDialog = false"
                    >
                      Cerrar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
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
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    submitting: false,
    loading: false,
    valid: true,
    centerFilter: null,
    form: {
      name: null,
      centers: [],
      zones: [],
      status: true
    },
    initialAreas: [],
    workArea: null,
    mapDialog: false,
    breadcrumbs: [
      {
        text: 'Dashboard',
        link: true,
        exact: true,
        disabled: false,
        to: { name: 'index' }
      },
      {
        text: 'Areas de trabajo',
        link: true,
        exact: true,
        disabled: false,
        to: { name: 'work-areas' }
      }
    ]
  }),
  async created () {
    const currentBreadcrumb = {
      text: 'Añadir',
      link: false,
      exact: true,
      disabled: true
    }

    if (this.resource) {
      currentBreadcrumb.text = (this.readonly ? 'Detalle' : 'Editar')
      await this.loadResource()
    }

    this.breadcrumbs.push(currentBreadcrumb)
  },
  methods: {
    addCenter (center) {
      if (!this.form.centers.find(element => element.id === center.id)) {
        this.form.centers.push(center)
      }
      this.centerFilter = null
    },
    removeCenter (center) {
      this.form.centers.splice(this.form.centers.indexOf(center), 1)
    },
    async submit () {
      if (this.readonly || !this.$refs.form.validate()) {
        return
      }

      if (this.form.zones.length < 1) {
        this.$toast.error('Debe incluir al menos una zona')
        return
      }

      this.submitting = true

      try {
        const data = {
          ...this.form,
          centers: this.form.centers.map(element => element.id)
        }
        let message = 'Área de trabajo'

        if (this.workArea) {
          await this.$api.workArea.put(this.workArea['@id'], data)
          message += ' editada'
        } else {
          await this.$api.workArea.post(data)
          message += ' añadida'
        }

        message += ' con éxito'
        this.$toast.success(message)
        await this.$router.push({ name: 'work-areas' })
      } catch (e) {
        console.log(e.response)
        if (e.response.data) {
          if (e.response.data.violations) {
            this.$toast.error(e.response.data.violations.lastItem.message)
          } else {
            this.$toast.error(e.response.data.message)
          }
        }
      } finally {
        this.submitting = false
      }
    },
    async remove () {
      this.$toast.success('Area de trabajo eliminada con éxito')
      await this.$router.push({ name: 'work-areas' })
    },
    async loadResource () {
      this.loading = true

      try {
        const response = await this.$api.workArea.get(this.resource)
        const self = this

        this.workArea = response.data
        this.form.name = this.workArea.name
        this.form.centers = this.workArea.centers
        this.form.status = this.workArea.status
        this.workArea.zones.forEach(function (zones) {
          self.initialAreas.push(zones.map(element => ({ lat: element.latitude, lng: element.longitude })))
        })
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.v-input--is-readonly >>> fieldset {
  border-color: #EEEEEE;
}
</style>
