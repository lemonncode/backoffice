export default axios => ({
  cget (config) {
    return axios.get('/core_centers', config)
  }
})
