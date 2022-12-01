export default axios => ({
  cget (config) {
    return axios.get('/on_demand/centers', config)
  },
  post (data) {
    return axios.post('/on_demand/centers', data)
  },
  get (uri) {
    return axios.get(uri)
  },
  put (uri, data) {
    return axios.put(uri, data)
  }
})
