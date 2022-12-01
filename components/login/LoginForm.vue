<template>
  <v-form @keyup.native.enter="login">
    <v-text-field
      v-model="form.username"
      label="Usuario"
      type="text"
      prepend-inner-icon="mdi-account"
      tabindex="1"
      outlined
      rounded
      flat
      clearable
      autofocus
    />
    <v-text-field
      v-model="form.password"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      label="Contraseña"
      prepend-inner-icon="mdi-lock"
      tabindex="2"
      outlined
      rounded
      flat
      @click:append="showPassword = !showPassword"
    />
    <v-btn
      color="primary"
      tabindex="3"
      block
      x-large
      rounded
      depressed
      :loading="loading"
      :disabled="loading || form.username === '' || form.password === ''"
      @click="login"
    >
      Iniciar Sesión
    </v-btn>
  </v-form>
</template>

<script>
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false
    }
  },

  methods: {
    async login () {
      this.loading = true
      this.$toast.info('Iniciando sesión...')

      try {
        const response = await this.$auth.login({ data: this.form })

        const data = jwtDecode(response.data.token)
        this.$auth.$storage.setUniversal('user', { username: data.username })

        this.$router.push({ name: 'index' })
        this.$toast.success(`Bienvenido ${this.$auth.user.username}`)
      } catch (error) {
        this.$toast.error(error.response.data.message)
      } finally {
        this.form.password = ''
        this.loading = false
      }
    }
  }
}
</script>
