<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12" align="center">
        <v-card max-width="500" flat>
          <v-img
            src="/images/logo.png"
            class="mb-12"
            aspect-ratio="2.5"
            contain
          />
          <login-form />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from '../components/login/LoginForm'

export default {
  components: {
    LoginForm
  },
  layout: 'login'
}
</script>
