export default axios => ({
  cget (config) {
    return axios.get('/on_demand/working-zone-riders', config)
  },
  post (data) {
    return axios.post('/on_demand/working-zone-riders', data)
  },
  delete (uri) {
    return axios.delete(uri)
  }
})
