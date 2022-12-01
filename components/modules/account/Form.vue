<template>
  <section>
    <v-form ref="form" v-model="valid">
      <v-card class="ma-1" />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="form.account.name"
              :rules="[validationRules.required, validationRules.resource]"
              label="cuenta"
              outlined
              dense
              :readonly="readonly"
              hide-details="auto"
              :multiple="false"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <account-center-list />
          </v-col>
          <v-row>
            <v-col cols="12" md="8">
              <account-centers-map />
            </v-col>
          </v-row>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <account-trips-list />
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </section>
</template>
<script>
import validation from '~/mixins/validation.js'
export default {
  mixins: [
    validation
  ],
  props: {
    account: {
      required: false,
      type: Object
    },
    readonly: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      submitting: false,
      valid: true,
      filter: {
        account: null
      },
      form: {
        account: {
          name: null
        }
      }
    }
  },
  created () {
    if (this.account) {
      this.form.account = this.account
    }
  },
  methods: {
    async submit () {
      if (this.readonly || !this.$refs.form.validate()) {
        return
      }
      this.submitting = true
      try {
        const data = {
          ...this.form
        }

        if (this.account) {
          await this.$axios.put(this.account['@id'], data)
        } else {
          await this.$api.account.post(data)
        }

        this.$toast.success('Cuenta nueva creada con éxito')
        await this.$router.push({ name: 'account' })
      } catch (e) {
        console.log(e.response)
        this.$toast.error(e.response.data.message)
      } finally {
        this.submitting = false
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
