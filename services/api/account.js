export default axios => ({
  cget (config) {
    return axios.get('/on_demand/accounts', config)
  },
  get (resource) {
    return axios.get(resource)
  }
})
