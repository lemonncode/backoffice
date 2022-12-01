<template>
  <v-combobox
    v-bind="$attrs"
    :value="value"
    :items="items"
    :search-input.sync="search"
    :loading="loading"
    :menu-props="{ closeOnClick: true, closeOnContentClick: true }"
    item-value="@id"
    item-text="name"
    hide-no-data
    hide-selected
    outlined
    v-on="$listeners"
    @change="change($event)"
  >
    <template v-if="showAsSpan" #selection="{attrs, item, parent, selected}">
      <v-chip
        v-if="item.name"
        v-bind="attrs"
        :input-value="selected"
        outlined
      >
        <span>{{ showAccount ? (item.account.name + ' | ' + item.name) : item.name }}</span>
        <v-icon v-if="spanDeletable" small @click.stop="parent.selectItem(item)">
          $delete
        </v-icon>
      </v-chip>
    </template>
    <template v-else-if="showAccount" #selection="{item}">
      <span v-if="item.name">{{ item.account.name + ' | ' + item.name }}</span>
    </template>
    <template v-if="showAccount" #item="{item}">
      <span v-if="item.name">{{ item.account.name + ' | ' + item.name }}</span>
    </template>
  </v-combobox>
</template>

<script>
import qs from 'qs'

export default {
  props: {
    value: {
      required: true
    },
    account: {
      required: false
    },
    showAsSpan: {
      required: false,
      default: false,
      type: Boolean
    },
    spanDeletable: {
      required: false,
      default: false,
      type: Boolean
    },
    showAccount: {
      required: false,
      default: false,
      type: Boolean
    },
    filterExcludeItems: {
      required: false,
      type: Array
    }
  },

  data: () => ({
    items: [],
    search: '',
    loading: false
  }),

  watch: {
    search (value) {
      this.loadResources(value)
    },
    account () {
      this.loadResources()
    },
    filterExcludeItems () {
      this.loadResources()
    }
  },

  methods: {
    change (event) {
      this.search = ''
      this.$emit('input', event)
    },
    async loadResources (query) {
      this.loading = true
      const params = { 'order[name]': 'asc' }
      if (this.account) { params['account.id'] = this.account.id }
      if (this.search) { params.name = this.search }

      try {
        const response = await this.$api.center.cget({
          params,
          paramsSerializer: (params) => {
            return qs.stringify(params)
          }
        })

        const items = response.data['hydra:member']

        if (this.filterExcludeItems) {
          this.items = items.filter(item => !this.filterExcludeItems.find(excludedItem => item.id === excludedItem.id))
        } else {
          this.items = items
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
