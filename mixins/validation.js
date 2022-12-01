export default {
  data: () => ({
    validationRules: {
      required: v => (v !== null && v !== '') || 'Campo requerido',
      resource: v => (!v || (v && !!v['@id'])) || 'Campo invalido',
      resources: v => (v && v[0] && !!v[0]['@id']) || 'Campo invalido',
      email: v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Correo electrónico inválido'
    }
  })
}
