const serviceFiles = require.context('./api', false, /\.js$/)
const services = []
serviceFiles.keys().forEach((key) => {
  services.push({ name: key.replace(/(\.\/|\.js)/g, ''), service: serviceFiles(key).default })
})

export default services

// export default axios => ({
// trip: {
// cget (config) {
//  return axios.get('/on_demand/trips', config)
// }
// }
// })
