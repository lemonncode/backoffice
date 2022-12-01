export default axios => ({
  cget (config) {
    return axios.get('/on_demand/working-zones', config)
  },
  get (uri) {
    return axios.get(uri)
  },
  post (data) {
    return axios.post('/on_demand/working-zones', data)
  },
  put (uri, data) {
    return axios.put(uri, data)
  },
  delete (uri) {
    return axios.delete(uri)
  }
})
