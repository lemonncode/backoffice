export default {
  data: () => (
    {
      page: 1,
      options: {}
    }),

  methods: {
    getParameters (filters, options) {
      if (!options) {
        options = this.options
      }

      const params = {
        page: options.page ? options.page : 1,
        itemsPerPage: options.itemsPerPage,
        order: options.order ? options.order : {}
      }

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value === null || (Array.isArray(value) && value.length === 0)) {
            continue
          }

          let data = null
          if (Array.isArray(value)) {
            if (typeof value[0] === 'object') {
              data = value.map((value) => {
                if (value['@id']) {
                  return value['@id']
                } else if (value.uuid) {
                  return value.uuid
                } else {
                  return value.value
                }
              })
            } else {
              data = value
            }
          } else if (typeof value === 'object') {
            if (key.includes('id')) {
              data = value.id
            } else if (value['@id']) {
              data = value['@id']
            } else if (value.uuid) {
              data = value.uuid
            } else {
              data = value.value
            }
          } else {
            data = value
          }

          params[key] = data
        }
      }

      if (options.sortBy && options.sortBy.length) {
        for (let i = 0; i < options.sortBy.length; i++) {
          params.order[options.sortBy[i]] = options.sortDesc[i] ? 'desc' : 'asc'
        }
      } else {
        params.order.date = 'desc'
      }

      return params
    }
  }
}
