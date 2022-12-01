export default axios => ({
  cget (config) {
    return axios.get('/on_demand/trips', config)
  },
  get (uri) {
    return axios.get(uri)
  },
  post (data) {
    return axios.post('/on_demand/trips', data)
  }
})
