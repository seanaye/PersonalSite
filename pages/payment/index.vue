<template>
  <card
    class="stripe-card"
    :class="{ complete }"
    stripe="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
    :options="stripeOptions"
    @change="complete = $event.complete"
  />
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements-plus'

export default {
  components: {
    Card
  },
  data () {
    return {
      complete: false,
      stripeOptions: {

      }
    }
  },
  methods: {
    async pay () {
      const r = await createToken()
      console.log(r)
      return r
    }
  }
}
</script>
