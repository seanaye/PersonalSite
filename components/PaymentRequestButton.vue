<template>
  <StripeElement
    ref="element"
    type="paymentRequestButton"
    :stripe="$root.context.env.stripeKey"
    :options="options"
    :value="value"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @change="$emit('change', $event)"
  />
</template>

<script>
import { StripeElement } from 'vue-stripe-elements-plus'

export default {
  components: { StripeElement },
  props: {
    // stripe: {
    //   type: [String, Object],
    //   required: true
    // },
    options: {
      type: [Object],
      required: false
    },
    value: {
      type: String,
      required: false
    }
  },
  methods: {
    blur () { this.$refs.element.blur() },
    clear () { this.$refs.element.clear() },
    focus () { this.$refs.element.focus() },
    update (options) { this.$refs.element.update(options) }
  }
}
</script>
