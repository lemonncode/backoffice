<template>
  <v-select
    v-model="currentValue"
    v-bind="$attrs"
    :items="[{ value: false, name: 'No' }, { value: true, name: 'Sí' }]"
    item-text="name"
    item-value="value"
    v-on="$listeners"
    @change="change($event)"
  />
</template>

<script>
export default {
  props: {
    value: {
      required: false,
      type: Boolean,
      default: null
    }
  },
  data: () => ({
    trueValue: { value: true, name: 'Sí' },
    falseValue: { value: false, name: 'No' },
    currentValue: null
  }),
  watch: {
    value () {
      this.currentValue = this.value ? this.trueValue : (this.value === false ? this.falseValue : null)
    }
  },
  created () {
    this.currentValue = this.value
  },
  methods: {
    change (event) {
      this.$emit('input', event)
    }
  }
}
</script>
