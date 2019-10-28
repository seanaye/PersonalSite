<template>
  <v-row>
    <v-col cols="12">
      <card
        ref="card"
        class="stripe-card"
        :class="{ complete }"
        :stripe="$root.context.env.stripeKey"
        :options="options"
        @change="complete = $event.complete"
      />
    </v-col>
    <v-col cols="12" xs="12" md="6">
      <v-btn
        class="pay-with-stripe"
        :disabled="btnDisabled"
        :color="btnColour"
        @click="pay"
      >
        Pay with card
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
import { Card, createToken } from 'vue-stripe-elements-plus'

export default {
  components: {
    Card
  },
  props: {
    options: Object,
    amount: Number
  },
  data () {
    return {
      paymentComplete: false,
      complete: false
    }
  },
  methods: {
    async pay () {
      console.log('start')
      let t = ''
      try {
        t = await createToken()
        console.log(t)
      } catch (err) {
        console.log(err)
        return
      }
      if (t.error) {
        this.$emit('error')
      } else {
        const r = await this.$axios.post(this.$root.context.env.APIEndpoint, {
          query: `mutation donation(
            $token: String!
            $name: String!
            $amount: Int!
            $live: Boolean!
          ) {
            payment (
              token: $token
              name: $name
              amount: $amount
              desc: "Donation"
              live: $live
            )
          }`,
          variables: {
            token: t.token.id,
            name: 'anonymous',
            amount: this.amount * 100,
            live: t.token.livemode
          }
        })
        const stripeResp = JSON.parse(r.data.data.payment)
        console.log(stripeResp)
        if (r.data.errors || !stripeResp.paid) {
          this.$emit('error')
        } else {
          this.$emit('success')
        }
      }
    }
  },
  computed: {
    btnColour () {
      if (this.paymentError) {
        return 'error'
      } else if (this.paymentComplete) {
        return 'success'
      } else {
        return 'primary'
      }
    },
    btnDisabled () {
      return !this.complete || this.paymentComplete || !(this.amount)
    }
  }
}
</script>
