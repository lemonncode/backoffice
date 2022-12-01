<template>
  <v-combobox
    v-model="item"
    v-bind="$attrs"
    :items="items"
    :search-input.sync="search"
    :loading="searching"
    :disabled="loading"
    :menu-props="{ closeOnClick: true }"
    item-value="@id"
    item-text="name"
    label="Zona"
    cache-items
    hide-no-data
    hide-selected
    outlined
    clearable
    v-on="$listeners"
    @change="change($event)"
  />
</template>

<script>

export default {
  props: {
    value: {
      required: true
    }
  },

  data: vm => ({
    item: vm.value,
    items: [],
    search: null,
    loading: false,
    searching: false
  }),

  watch: {
    async search (value) {
      await this.doSearch(value)
    }
  },

  async mounted () {
    await this.loadResource()
    await this.doSearch(null)
  },

  methods: {
    async loadResource () {
      if (this.value === null) { return }

      this.loading = true

      try {
        const response = await this.$axios.get(`/api${this.value}`)
        this.item = response.data
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    async doSearch (value) {
      this.searching = true

      try {
        const params = {
          name: value,
          'order[name]': 'asc'
        }

        const response = await this.$axios.get('/api/delivery/zones', {
          params
        })

        this.items = response.data['hydra:member']
      } catch (e) {
        console.log(e)
      } finally {
        this.searching = false
      }
    },

    change (event) {
      this.search = null
      this.$emit('input', event)
    }
  }
}
</script>
