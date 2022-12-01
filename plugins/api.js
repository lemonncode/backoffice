import api from '~/services/api.js'

export default ({ $axios }, inject) => {
  const apiService = {}
  api.forEach(function (element) {
    apiService[element.name] = element.service($axios)
  })

  // api.forEach(element => inject('api_' + element.name, element.service($axios)))
  // inject('api', api($axios))
  inject('api', apiService)
}
