export default axios => ({
  cget (config) {
    return axios.get('/on_demand/riders', config)
  }
})
